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

const handleLike = async () => {
  const result = await store.likeCurrentUser();
  
  if (result && result.match) {
    matchedUserName.value = result.matchedUser?.username || 'Someone';
    showMatchModal.value = true;
    
    // Fechar modal após 3 segundos
    setTimeout(() => {
      showMatchModal.value = false;
    }, 3000);
  }
};

const handleDislike = () => {
  store.skipCurrentUser();
};

const handleMatch = () => {
  router.push('/matches');
};
</script>

<template>
  <div>
    <!-- Match Modal -->
    <div v-if="showMatchModal" class="match-modal">
      <div class="match-content">
        <h2>🎉 It's a Match!</h2>
        <p>You and {{ matchedUserName }} liked each other</p>
      </div>
    </div>

    <div class="action-buttons">
      <button class="action-btn like-btn" @click="handleLike">
        <likeIcon />
      </button>
      <button class="action-btn dislike-btn" @click="handleDislike">
        <deslikeIcon />
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
  gap: 20px;
  margin-top: 24px;
}

.action-btn {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.action-btn:hover {
  transform: scale(1.1);
}

.action-btn:active {
  transform: scale(0.95);
}

.like-btn {
  background: linear-gradient(135deg, #00D9A5 0%, #00B88C 100%);
  box-shadow: 0 4px 12px rgba(0, 217, 165, 0.4);
}

.dislike-btn {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
}

.match-btn {
  background: linear-gradient(135deg, #FF2E97 0%, #E91E63 100%);
  box-shadow: 0 4px 12px rgba(255, 46, 151, 0.4);
}

.action-btn :deep(svg) {
  width: 28px;
  height: 28px;
  fill: white;
}

/* Match Modal */
.match-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.match-content {
  background: linear-gradient(135deg, #FF2E97 0%, #E91E63 100%);
  padding: 40px;
  border-radius: 24px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(255, 46, 151, 0.6);
  animation: scaleIn 0.3s ease;
}

.match-content h2 {
  color: #FFF;
  font-size: 32px;
  margin: 0 0 16px 0;
  font-weight: 700;
}

.match-content p {
  color: #FFF;
  font-size: 18px;
  margin: 0;
  opacity: 0.9;
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
