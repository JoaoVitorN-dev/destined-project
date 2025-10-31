<script setup lang="ts">
import { onMounted, computed } from 'vue';
import chatIcon from '../../assets/icons/chatIcon.svg';
import { useLikeStore } from '@/services/likeStore';

const store = useLikeStore();

onMounted(async () => {
  await store.loadUsers();
});

const currentUser = computed(() => store.getCurrentUser());
const totalUsers = computed(() => store.users.value.length);
const currentIndex = computed(() => store.currentUserIndex.value);
</script>

<template>
  <div class="container">
    <div v-if="store.isLoading.value" class="profile-card loading-state">
      <p class="loading-text">Loading profiles...</p>
    </div>
    <div v-else-if="currentUser" class="profile-card">
        <div class="bottom">
            <div class="avatar"></div>
            <div class="informations">
                <p class="name">{{ currentUser.username }}</p>
                <p class="distance">{{ currentUser.distance }}</p>
            </div>
            <div class="actions">
                <div class="container-elipses">
                    <div 
                      v-for="i in totalUsers" 
                      :key="i"
                      :class="['elipse', { active: i - 1 === currentIndex }]"
                    ></div>
                </div>
                <chatIcon class="chat-icon"/>
            </div>
        </div>
    </div>
    <div v-else class="profile-card loading-state">
      <p class="loading-text">No more users</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  height: 545px;
  width: 352px;
  border: 2px solid #FFF;
  border-radius: 24px;
  background-image: linear-gradient(to bottom, #12013000, #0E0124E0);
  padding: 16px;
}

.profile-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.bottom {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.avatar {
  height: 80px;
  width: 80px;
  border-radius: 50%;
  background-color: #8354FF;
  border: 3px solid #FFF;
  flex-shrink: 0;
}

.informations {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.name {
  font-size: 24px;
  font-weight: 600;
  color: #FFF;
  margin: 0;
}

.distance {
  font-size: 14px;
  font-weight: 400;
  color: #FFF;
  margin: 0;
  opacity: 0.9;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.container-elipses {
  display: flex;
  gap: 8px;
  align-items: center;
}

.elipse {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
}

.elipse.active {
  background-color: #FFF;
  width: 12px;
  height: 12px;
}

.chat-icon {
  width: 32px;
  height: 32px;
  cursor: pointer;
}

.loading-state {
  justify-content: center;
  align-items: center;
}

.loading-text {
  color: #FFF;
  font-size: 18px;
  font-weight: 500;
  margin: 0;
}

</style>
