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

// Calcular idade baseado na data de nascimento, se disponível
const getAge = (user: any) => {
  if (user.age) return user.age;
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

const displayName = computed(() => {
  if (!currentUser.value) return '';
  const user = currentUser.value as any;
  const firstName = user.firstName || user.username;
  const age = getAge(user);
  return age ? `${firstName}, ${age}` : firstName;
});
</script>

<template>
  <div class="container">
    <div v-if="store.isLoading.value" class="profile-card loading-state">
      <div class="spinner"></div>
      <p class="loading-text">Finding matches...</p>
    </div>
    <div v-else-if="currentUser" class="profile-card">
        <div class="gradient-overlay"></div>
        <div class="bottom">
            <div class="avatar">
              <span class="avatar-initial">
                {{ ((currentUser as any).firstName || currentUser.username).charAt(0).toUpperCase() }}
              </span>
            </div>
            <div class="informations">
                <p class="name">{{ displayName }}</p>
                <div v-if="(currentUser as any).gender" class="details-row">
                  <span class="detail-item">
                    {{ (currentUser as any).gender === 'Male' ? '👨' : (currentUser as any).gender === 'Female' ? '👩' : '🧑' }}
                    {{ (currentUser as any).gender }}
                  </span>
                  <span v-if="currentUser.distance" class="detail-item">
                    📍 {{ currentUser.distance }}
                  </span>
                </div>
                <div v-if="(currentUser as any).interests?.length" class="interests">
                  <span 
                    v-for="interest in (currentUser as any).interests.slice(0, 4)" 
                    :key="interest"
                    class="interest-tag"
                  >
                    {{ interest }}
                  </span>
                </div>
            </div>
            <div class="actions">
                <div class="container-elipses">
                    <div 
                      v-for="i in Math.min(totalUsers, 5)" 
                      :key="i"
                      :class="['elipse', { active: i - 1 === currentIndex }]"
                    ></div>
                    <span v-if="totalUsers > 5" class="more-users">+{{ totalUsers - 5 }}</span>
                </div>
                <chatIcon class="chat-icon"/>
            </div>
        </div>
    </div>
    <div v-else class="profile-card empty-state">
      <div class="empty-icon">💫</div>
      <p class="empty-title">No more profiles</p>
      <p class="empty-subtitle">Check back later for new matches!</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  height: 580px;
  width: 380px;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  position: relative;
}

.profile-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: linear-gradient(135deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
}

.gradient-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(to top, rgba(14, 1, 36, 0.95), transparent);
  pointer-events: none;
}

.bottom {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  position: relative;
  z-index: 1;
}

.avatar {
  height: 90px;
  width: 90px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8354FF 0%, #E91E63 100%);
  border: 4px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(131, 84, 255, 0.4);
  transition: transform 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
}

.avatar-initial {
  font-size: 36px;
  font-weight: 700;
  color: #FFF;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.informations {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.name {
  font-size: 28px;
  font-weight: 700;
  color: #FFF;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.details-row {
  display: flex;
  gap: 16px;
  align-items: center;
}

.detail-item {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.15);
  padding: 6px 12px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
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

.loading-text {
  color: #FFF;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.empty-state {
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 40px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.empty-title {
  font-size: 24px;
  font-weight: 700;
  color: #FFF;
  margin: 0 0 8px 0;
}

.empty-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.interests {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.interest-tag {
  background: linear-gradient(135deg, rgba(131, 84, 255, 0.3), rgba(233, 30, 99, 0.3));
  backdrop-filter: blur(10px);
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 13px;
  color: #FFF;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.2s ease;
}

.interest-tag:hover {
  transform: scale(1.05);
}

.more-users {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  font-weight: 600;
  margin-left: 4px;
}

</style>
