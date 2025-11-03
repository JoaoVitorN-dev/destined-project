<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api, getUserToken } from '@/services/api';
import { 
  connectSocket, 
  disconnectSocket, 
  sendMessage as sendSocketMessage,
  sendTypingStatus,
  onNewMessage,
  onMessageSent,
  onUserTyping,
  offNewMessage,
  offMessageSent,
  offUserTyping,
  socketState
} from '@/services/socket';
import BackArrow from '@/components/shared/BackArrow.vue';

const route = useRoute();
const router = useRouter();
const userId = route.params.userId as string;
const currentUserId = getUserToken();

const matchedUser = ref<any>(null);
const messages = ref<any[]>([]);
const newMessage = ref('');
const isLoading = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);
const isOtherUserTyping = ref(false);
const typingTimeout = ref<any>(null);

onMounted(async () => {
  if (!currentUserId) {
    router.push('/login');
    return;
  }

  await loadUser();
  await loadMessages();
  
  // Conectar ao Socket.io
  connectSocket(currentUserId);
  
  // Listeners para mensagens em tempo real
  onNewMessage((message) => {
    console.log('📨 New message received:', message);
    if (message.senderId === userId) {
      messages.value.push({
        ...message,
        isMine: false,
      });
      scrollToBottom();
      
      // Marcar como lida
      api.markMessagesAsRead(userId).catch(console.error);
    }
  });

  onMessageSent((message) => {
    console.log('✅ Message sent confirmation:', message);
  });

  onUserTyping((data) => {
    if (data.userId === userId) {
      isOtherUserTyping.value = data.isTyping;
    }
  });

  scrollToBottom();
});

onUnmounted(() => {
  // Limpar listeners
  offNewMessage();
  offMessageSent();
  offUserTyping();
  
  // Não desconectar o socket aqui, pois pode estar sendo usado em outros lugares
  // disconnectSocket();
});

const loadUser = async () => {
  try {
    const user = await api.getUser(userId);
    matchedUser.value = user;
    console.log('Loaded user:', user);
  } catch (error) {
    console.error('Error loading user:', error);
    router.push('/chats');
  }
};

const loadMessages = async () => {
  isLoading.value = true;
  try {
    const loadedMessages = await api.getMessages(userId);
    console.log('📬 Loaded messages:', loadedMessages);
    
    messages.value = loadedMessages.map((msg: any) => ({
      ...msg,
      isMine: msg.senderId === currentUserId,
      timestamp: msg.createdAt,
    }));

    // Marcar mensagens como lidas
    await api.markMessagesAsRead(userId);
  } catch (error) {
    console.error('Error loading messages:', error);
  } finally {
    isLoading.value = false;
  }
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || !currentUserId) return;

  const messageText = newMessage.value.trim();
  
  // Adicionar mensagem localmente (otimista)
  const tempMessage = {
    _id: 'temp-' + Date.now(),
    text: messageText,
    isMine: true,
    senderId: currentUserId,
    receiverId: userId,
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  messages.value.push(tempMessage);
  newMessage.value = '';
  
  await nextTick();
  scrollToBottom();

  // Enviar via Socket.io
  try {
    const sent = sendSocketMessage(userId, messageText, currentUserId);
    if (!sent) {
      // Fallback para HTTP se socket não estiver conectado
      await api.sendMessage(userId, messageText);
    }
  } catch (error) {
    console.error('Error sending message:', error);
    // Remover mensagem temporária em caso de erro
    messages.value = messages.value.filter(m => m._id !== tempMessage._id);
  }
};

const handleTyping = () => {
  if (!currentUserId) return;

  // Notificar que está digitando
  sendTypingStatus(userId, true, currentUserId);

  // Limpar timeout anterior
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value);
  }

  // Parar de notificar após 2 segundos sem digitar
  typingTimeout.value = setTimeout(() => {
    sendTypingStatus(userId, false, currentUserId);
  }, 2000);
};

const scrollToBottom = () => {
  setTimeout(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  }, 100);
};

const getDisplayName = computed(() => {
  if (!matchedUser.value) return '';
  return matchedUser.value.firstName || matchedUser.value.username;
});

const isUserOnline = computed(() => {
  return socketState.onlineUsers.value.includes(userId);
});

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

// Watch para scroll automático quando novas mensagens chegam
watch(() => messages.value.length, () => {
  scrollToBottom();
});
</script>

<template>
  <div class="chat-page">
    <div class="chat-header">
      <BackArrow @click="router.push('/chats')" />
      <div v-if="matchedUser" class="user-info">
        <div class="avatar">
          {{ getDisplayName.charAt(0).toUpperCase() }}
          <div class="online-indicator" v-if="isUserOnline"></div>
        </div>
        <div class="info">
          <h2>{{ getDisplayName }}</h2>
          <p class="status">{{ isUserOnline ? 'Online' : 'Offline' }}</p>
        </div>
      </div>
      <div class="header-actions">
        <button class="action-btn">📞</button>
        <button class="action-btn">📹</button>
      </div>
    </div>

    <div class="messages-container" ref="messagesContainer">
      <div 
        v-for="message in messages" 
        :key="message._id || message.id"
        :class="['message', { mine: message.isMine }]"
      >
        <div class="message-bubble">
          <p class="message-text">{{ message.text }}</p>
          <span class="message-time">{{ formatTime(message.timestamp) }}</span>
        </div>
      </div>
      
      <!-- Typing indicator -->
      <div v-if="isOtherUserTyping" class="message typing-indicator">
        <div class="message-bubble">
          <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>

    <div class="input-container">
      <button class="emoji-btn">😊</button>
      <input 
        v-model="newMessage"
        type="text" 
        placeholder="Type a message..."
        @keyup.enter="sendMessage"
        @input="handleTyping"
        class="message-input"
      />
      <button 
        @click="sendMessage"
        :disabled="!newMessage.trim()"
        class="send-btn"
      >
        ➤
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #0E0124;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(131, 84, 255, 0.1);
  border-bottom: 1px solid rgba(131, 84, 255, 0.2);
  backdrop-filter: blur(10px);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8354FF 0%, #B794FF 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFF;
  font-size: 20px;
  font-weight: 700;
  border: 2px solid rgba(131, 84, 255, 0.3);
  position: relative;
}

.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #4CAF50;
  border-radius: 50%;
  border: 2px solid #0E0124;
  z-index: 1;
}

.info h2 {
  color: #FFF;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.status {
  color: #4CAF50;
  font-size: 12px;
  margin: 2px 0 0 0;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(131, 84, 255, 0.2);
  border: none;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(131, 84, 255, 0.3);
  transform: scale(1.05);
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
  justify-content: flex-start;
}

.message.mine {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  background: rgba(131, 84, 255, 0.2);
  border: 1px solid rgba(131, 84, 255, 0.3);
}

.message.mine .message-bubble {
  background: linear-gradient(135deg, #8354FF 0%, #B794FF 100%);
  border-color: transparent;
}

.message-text {
  color: #FFF;
  font-size: 15px;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.message-time {
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
}

.input-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(131, 84, 255, 0.05);
  border-top: 1px solid rgba(131, 84, 255, 0.2);
}

.emoji-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(131, 84, 255, 0.2);
  border: none;
  cursor: pointer;
  font-size: 20px;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.emoji-btn:hover {
  background: rgba(131, 84, 255, 0.3);
  transform: scale(1.05);
}

.message-input {
  flex: 1;
  background: rgba(131, 84, 255, 0.1);
  border: 1px solid rgba(131, 84, 255, 0.3);
  border-radius: 24px;
  padding: 12px 20px;
  color: #FFF;
  font-size: 15px;
  outline: none;
  transition: all 0.3s ease;
}

.message-input:focus {
  border-color: rgba(131, 84, 255, 0.5);
  background: rgba(131, 84, 255, 0.15);
}

.message-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.send-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8354FF 0%, #B794FF 100%);
  border: none;
  cursor: pointer;
  color: #FFF;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(131, 84, 255, 0.4);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Typing indicator */
.typing-indicator {
  justify-content: flex-start !important;
}

.typing-dots {
  display: flex;
  gap: 4px;
  padding: 8px 12px;
}

.typing-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  animation: typing-bounce 1.4s infinite;
}

.typing-dots span:nth-child(1) {
  animation-delay: 0s;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing-bounce {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}
</style>
