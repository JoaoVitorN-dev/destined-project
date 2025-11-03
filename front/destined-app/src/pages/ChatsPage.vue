<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import TabBar from '@/components/shared/TabBar.vue';
import { api } from '@/services/api';
import { socketState } from '@/services/socket';

const router = useRouter();
const matches = ref<any[]>([]);
const isLoading = ref(false);

onMounted(async () => {
  await loadMatches();
});

const loadMatches = async () => {
  isLoading.value = true;
  try {
    const matchedUsers = await api.getMatches();
    matches.value = matchedUsers;
    console.log('Matches loaded:', matches.value);
  } catch (error) {
    console.error('Error loading matches:', error);
  } finally {
    isLoading.value = false;
  }
};

const openChat = (userId: string) => {
  router.push(`/chat/${userId}`);
};

const getAge = (user: any) => {
  if (user.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(user.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
  return null;
};

const getDisplayName = (user: any) => {
  const name = user.firstName || user.username;
  const age = getAge(user);
  return age ? `${name}, ${age}` : name;
};

const isUserOnline = (userId: string) => {
  return socketState.onlineUsers.value.includes(userId);
};
</script>

<template>
  <div class="chats-page">
    <div class="header">
      <h1>Messages</h1>
      <p class="subtitle">{{ matches.length }} matches</p>
    </div>

    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
      <p>Loading your matches...</p>
    </div>

    <div v-else-if="matches.length === 0" class="empty-state">
      <div class="empty-icon">💬</div>
      <h2>No matches yet</h2>
      <p>Start swiping to find your perfect match!</p>
      <button class="start-swiping-btn" @click="router.push('/likes')">
        Start Swiping
      </button>
    </div>

    <div v-else class="chats-list">
      <div 
        v-for="match in matches" 
        :key="match._id"
        class="chat-item"
        @click="openChat(match._id)"
      >
        <div class="avatar">
          <div class="avatar-placeholder">
            {{ (match.firstName || match.username).charAt(0).toUpperCase() }}
          </div>
          <div class="online-indicator" v-if="isUserOnline(match._id)"></div>
        </div>
        <div class="chat-info">
          <div class="chat-header">
            <h3>{{ getDisplayName(match) }}</h3>
            <span class="time">Now</span>
          </div>
          <p class="last-message">Start chatting now! 👋</p>
        </div>
      </div>
    </div>

    <TabBar />
  </div>
</template>

<style scoped>
.chats-page {
  min-height: 100vh;
  padding: 20px;
  padding-bottom: 100px;
}

.header {
  margin-bottom: 24px;
}

.header h1 {
  color: #FFF;
  font-size: 32px;
  font-weight: 700;
  margin: 0;
}

.subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  margin: 4px 0 0 0;
}

.loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  gap: 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(131, 84, 255, 0.2);
  border-top: 4px solid #8354FF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  font-weight: 600;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  gap: 16px;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 8px;
  opacity: 0.6;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.empty-state h2 {
  color: #FFF;
  font-size: 28px;
  font-weight: 700;
  margin: 0;
}

.empty-state p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  margin: 0;
}

.start-swiping-btn {
  margin-top: 16px;
  padding: 14px 32px;
  background: linear-gradient(135deg, #8354FF 0%, #E91E63 100%);
  color: #FFF;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(131, 84, 255, 0.4);
}

.start-swiping-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(131, 84, 255, 0.6);
}

.chats-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chat-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px;
  background: rgba(131, 84, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(131, 84, 255, 0.15);
}

.chat-item:hover {
  background: rgba(131, 84, 255, 0.18);
  border-color: rgba(131, 84, 255, 0.4);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(131, 84, 255, 0.3);
}

.chat-item:active {
  transform: translateY(-2px);
}

.avatar {
  position: relative;
  flex-shrink: 0;
}

.avatar-placeholder {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8354FF 0%, #B794FF 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFF;
  font-size: 24px;
  font-weight: 700;
  border: 3px solid rgba(131, 84, 255, 0.3);
}

.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 14px;
  height: 14px;
  background: #4CAF50;
  border: 3px solid #0E0124;
  border-radius: 50%;
}

.chat-info {
  flex: 1;
  min-width: 0;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.chat-info h3 {
  color: #FFF;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.time {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  flex-shrink: 0;
  margin-left: 8px;
}

.last-message {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
