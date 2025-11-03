<script setup lang="ts">
import swipeIcon from '../../assets/icons/swipe.svg';
import usersIcon from '../../assets/icons/users.svg';
import chatsIcon from '../../assets/icons/chats.svg';
import userIcon from '../../assets/icons/user.svg';
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const activeTab = computed(() => {
  const path = route.path;
  if (path === '/likes') return 'swipe';
  if (path === '/users') return 'users';
  if (path === '/chats' || path.startsWith('/chat/')) return 'chats';
  if (path === '/profile' || path === '/profileDetails') return 'user';
  return 'swipe';
});

const setActiveTab = (tab: string) => {
  // Navigate to corresponding page
  if (tab === 'swipe') {
    router.push('/likes');
  } else if (tab === 'users') {
    router.push('/users');
  } else if (tab === 'chats') {
    router.push('/chats');
  } else if (tab === 'user') {
    router.push('/profile');
  }
};
</script>

<template>
  <div class="tab-bar">
    <button 
      class="tab-btn" 
      :class="{ active: activeTab === 'swipe' }"
      @click="setActiveTab('swipe')"
    >
      <swipeIcon />
    </button>
    <button 
      class="tab-btn" 
      :class="{ active: activeTab === 'users' }"
      @click="setActiveTab('users')"
    >
      <usersIcon />
    </button>
    <button 
      class="tab-btn" 
      :class="{ active: activeTab === 'chats' }"
      @click="setActiveTab('chats')"
    >
      <chatsIcon />
    </button>
    <button 
      class="tab-btn" 
      :class="{ active: activeTab === 'user' }"
      @click="setActiveTab('user')"
    >
      <userIcon />
    </button>
  </div>
</template>

<style scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: linear-gradient(180deg, rgba(14, 1, 36, 0.98) 0%, rgba(8, 0, 24, 1) 100%);
  backdrop-filter: blur(20px);
  padding: 12px 24px 20px;
  border-top: 2px solid rgba(131, 84, 255, 0.3);
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.4);
  z-index: 1000;
}

.tab-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 14px 20px;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.tab-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(131, 84, 255, 0.2), rgba(233, 30, 99, 0.2));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tab-btn:hover::before {
  opacity: 1;
}

.tab-btn.active::before {
  opacity: 1;
  background: linear-gradient(135deg, rgba(131, 84, 255, 0.3), rgba(233, 30, 99, 0.3));
}

.tab-btn:hover {
  transform: translateY(-4px);
}

.tab-btn.active {
  transform: translateY(-2px);
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 4px;
  background: linear-gradient(90deg, #8354FF 0%, #E91E63 100%);
  border-radius: 4px 4px 0 0;
  box-shadow: 0 0 12px rgba(131, 84, 255, 0.6);
}

.tab-btn :deep(svg) {
  width: 26px;
  height: 26px;
  fill: #B8A9D9;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.tab-btn.active :deep(svg) {
  fill: #FFF;
  transform: scale(1.1);
}

.tab-btn:hover :deep(svg) {
  fill: #E0D5FF;
  transform: scale(1.05);
}
</style>
