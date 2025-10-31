<script setup lang="ts">
import { ref } from 'vue';

const showAddStory = ref(false);
</script>

<template>
  <header class="users-header">
    <div class="header-top">
      <h1 class="title">Users</h1>
      <div class="header-icons">
        <button class="icon-btn search-btn" aria-label="Search">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
        <button class="icon-btn notification-btn" aria-label="Notifications">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
          </svg>
          <span class="notification-dot"></span>
        </button>
        <button class="icon-btn menu-btn" aria-label="Menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
    <button class="add-story-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      <span>Add Your Story</span>
    </button>
  </header>
</template>

<style scoped>
.users-header {
  padding: 20px 20px 16px 20px;
  background: transparent;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-size: 28px;
  font-weight: 600;
  color: #FFFFFF;
  margin: 0;
  letter-spacing: -0.5px;
}

.header-icons {
  display: flex;
  gap: 12px;
  align-items: center;
}

.icon-btn {
  background: transparent;
  border: none;
  color: #B8A9D9;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.icon-btn:hover {
  background: rgba(131, 84, 255, 0.1);
  color: #8354FF;
}

.notification-btn .notification-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background: #FF3B6D;
  border-radius: 50%;
  border: 2px solid #140034;
}

.add-story-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(131, 84, 255, 0.15);
  border: 1px solid rgba(131, 84, 255, 0.3);
  color: #FFFFFF;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.add-story-btn:hover {
  background: rgba(131, 84, 255, 0.25);
  border-color: rgba(131, 84, 255, 0.5);
  transform: translateY(-1px);
}

.add-story-btn:active {
  transform: translateY(0);
}

.add-story-btn svg {
  color: #8354FF;
}
</style>
