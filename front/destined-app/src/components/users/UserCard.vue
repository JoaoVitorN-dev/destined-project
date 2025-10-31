<script setup lang="ts">
interface User {
  id: number;
  name: string;
  age: number;
  distance: string;
  likes: number;
  isOnline: boolean;
  image?: string;
}

interface Props {
  user: User;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="user-card">
    <div class="card-image">
      <div class="image-placeholder">
        <!-- Placeholder for user image -->
      </div>
      <span v-if="user.isOnline" class="online-indicator"></span>
    </div>
    <div class="card-content">
      <div class="user-info">
        <h3 class="user-name">{{ user.name }}, {{ user.age }}</h3>
        <p class="user-distance">{{ user.distance }}</p>
      </div>
      <div class="user-likes">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <span>{{ user.likes }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-card {
  background: linear-gradient(135deg, rgba(131, 84, 255, 0.1) 0%, rgba(75, 19, 168, 0.1) 100%);
  border: 1px solid rgba(131, 84, 255, 0.2);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.user-card:hover {
  transform: translateY(-4px);
  border-color: rgba(131, 84, 255, 0.4);
  box-shadow: 0 8px 24px rgba(131, 84, 255, 0.2);
}

.card-image {
  position: relative;
  width: 100%;
  padding-top: 133%; /* 3:4 aspect ratio */
  background: linear-gradient(135deg, #2D1B4E 0%, #1A0F3A 100%);
  overflow: hidden;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #3D2B5E 0%, #2A1F4A 100%);
}

.online-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 12px;
  height: 12px;
  background: #00FF87;
  border: 2px solid #140034;
  border-radius: 50%;
  box-shadow: 0 0 12px rgba(0, 255, 135, 0.6);
}

.card-content {
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #FFFFFF;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-distance {
  font-size: 12px;
  color: #8B7BA8;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.user-likes {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 59, 109, 0.15);
  padding: 4px 8px;
  border-radius: 8px;
  color: #FF3B6D;
  font-size: 12px;
  font-weight: 600;
}

.user-likes svg {
  width: 14px;
  height: 14px;
}
</style>
