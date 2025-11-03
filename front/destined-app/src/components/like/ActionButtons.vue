<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import likeIcon from '../../assets/icons/like.svg';
import deslikeIcon from '../../assets/icons/deslike.svg';
import matchIcon from '../../assets/icons/match.svg';
import { useLikeStore } from '@/services/likeStore';

const store = useLikeStore();
const router = useRouter();
const showMatchModal = ref(false);
const matchedUserName = ref('');
const isLiking = ref(false);
const isDisliking = ref(false);

const handleLike = async () => {
  if (isLiking.value) return;
  isLiking.value = true;
  
  const result = await store.likeCurrentUser();
  
  if (result && result.match) {
    matchedUserName.value = result.matchedUser?.firstName || result.matchedUser?.username || 'Someone';
    showMatchModal.value = true;
    
    // Fechar modal após 4 segundos
    setTimeout(() => {
      showMatchModal.value = false;
    }, 4000);
  }
  
  setTimeout(() => {
    isLiking.value = false;
  }, 300);
};

const handleDislike = () => {
  if (isDisliking.value) return;
  isDisliking.value = true;
  
  store.skipCurrentUser();
  
  setTimeout(() => {
    isDisliking.value = false;
  }, 300);
};

const handleMatch = () => {
  router.push('/chats');
};

const closeModal = () => {
  showMatchModal.value = false;
};

const sendMessage = () => {
  showMatchModal.value = false;
  router.push('/chats');
};
</script>

<template>
  <div>
    <!-- Match Modal -->
    <div v-if="showMatchModal" class="match-modal" @click="closeModal">
      <div class="match-content" @click.stop>
        <div class="match-hearts">
          <span class="heart">💖</span>
          <span class="heart">💖</span>
        </div>
        <h2>It's a Match!</h2>
        <p>You and <strong>{{ matchedUserName }}</strong> liked each other</p>
        <div class="modal-actions">
          <button class="modal-btn send-btn" @click="sendMessage">
            Send Message
          </button>
          <button class="modal-btn keep-btn" @click="closeModal">
            Keep Swiping
          </button>
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <button 
        :class="['action-btn', 'dislike-btn', { pressing: isDisliking }]" 
        @click="handleDislike"
        :disabled="isDisliking"
      >
        <deslikeIcon />
      </button>
      <button 
        :class="['action-btn', 'like-btn', 'large', { pressing: isLiking }]" 
        @click="handleLike"
        :disabled="isLiking"
      >
        <likeIcon />
      </button>
      <button class="action-btn match-btn" @click="handleMatch">
        <matchIcon />
      </button>
    </div>
  </div>
</template>

<style scoped>
.action-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  margin-top: 32px;
}

.action-btn {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.action-btn:hover::before {
  width: 100%;
  height: 100%;
}

.action-btn:hover {
  transform: translateY(-4px) scale(1.08);
}

.action-btn:active,
.action-btn.pressing {
  transform: scale(0.92);
}

.action-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.like-btn {
  background: linear-gradient(135deg, #00E676 0%, #00C853 100%);
  box-shadow: 0 6px 20px rgba(0, 230, 118, 0.5);
}

.like-btn.large {
  width: 80px;
  height: 80px;
}

.dislike-btn {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.5);
}

.match-btn {
  background: linear-gradient(135deg, #8354FF 0%, #B794FF 100%);
  box-shadow: 0 6px 20px rgba(131, 84, 255, 0.5);
}

.action-btn :deep(svg) {
  width: 32px;
  height: 32px;
  fill: white;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.like-btn.large :deep(svg) {
  width: 40px;
  height: 40px;
}

/* Match Modal */
.match-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.4s ease;
  padding: 20px;
}

.match-content {
  background: linear-gradient(135deg, #8354FF 0%, #E91E63 100%);
  padding: 48px 40px;
  border-radius: 32px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(131, 84, 255, 0.6);
  animation: scaleIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  max-width: 400px;
  width: 100%;
}

.match-hearts {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 24px;
  font-size: 64px;
}

.heart {
  animation: heartBeat 1.5s ease-in-out infinite;
}

.heart:nth-child(2) {
  animation-delay: 0.2s;
}

@keyframes heartBeat {
  0%, 100% {
    transform: scale(1);
  }
  15% {
    transform: scale(1.2);
  }
  30% {
    transform: scale(1);
  }
}

.match-content h2 {
  color: #FFF;
  font-size: 36px;
  margin: 0 0 16px 0;
  font-weight: 800;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.match-content p {
  color: #FFF;
  font-size: 18px;
  margin: 0 0 32px 0;
  opacity: 0.95;
  line-height: 1.5;
}

.match-content p strong {
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-btn {
  padding: 16px 32px;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.send-btn {
  background: #FFF;
  color: #8354FF;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.send-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.keep-btn {
  background: rgba(255, 255, 255, 0.2);
  color: #FFF;
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.keep-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
