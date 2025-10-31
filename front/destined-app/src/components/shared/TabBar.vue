<script setup lang="ts">
import swipeIcon from '../../assets/icons/swipe.svg';
import usersIcon from '../../assets/icons/users.svg';
import chatsIcon from '../../assets/icons/chats.svg';
import userIcon from '../../assets/icons/user.svg';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const activeTab = ref('swipe');

const setActiveTab = (tab: string) => {
  activeTab.value = tab;
  
  // Navigate to corresponding page
  if (tab === 'users') {
    router.push('/users');
  } else if (tab === 'swipe') {
    router.push('/likes');
  }
  // Add more navigation as needed
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
  background: linear-gradient(180deg, rgba(14, 1, 36, 0.95) 0%, rgba(18, 1, 48, 0.98) 100%);
  backdrop-filter: blur(10px);
  padding: 16px 24px;
  border-top: 1px solid rgba(131, 84, 255, 0.2);
  z-index: 1000;
}

.tab-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.tab-btn:hover {
  background: rgba(131, 84, 255, 0.1);
}

.tab-btn.active {
  background: rgba(131, 84, 255, 0.2);
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -16px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #8354FF 0%, #B794FF 100%);
  border-radius: 2px 2px 0 0;
}

.tab-btn :deep(svg) {
  width: 24px;
  height: 24px;
  fill: #B8A9D9;
  transition: fill 0.3s ease;
}

.tab-btn.active :deep(svg) {
  fill: #8354FF;
}

.tab-btn:hover :deep(svg) {
  fill: #9D7BFF;
}
</style>
