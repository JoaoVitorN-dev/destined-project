<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import TabBar from '@/components/shared/TabBar.vue';
import { api, removeUserToken } from '@/services/api';

const router = useRouter();
const currentUser = ref<any>(null);
const isLoading = ref(false);

onMounted(async () => {
  await loadCurrentUser();
});

const loadCurrentUser = async () => {
  isLoading.value = true;
  try {
    const user = await api.getCurrentUser();
    currentUser.value = user;
    console.log('Current user:', user);
  } catch (error) {
    console.error('Error loading current user:', error);
  } finally {
    isLoading.value = false;
  }
};

const getAge = computed(() => {
  if (!currentUser.value?.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(currentUser.value.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

const displayName = computed(() => {
  if (!currentUser.value) return '';
  const firstName = currentUser.value.firstName || currentUser.value.username;
  return getAge.value ? `${firstName}, ${getAge.value}` : firstName;
});

const editProfile = () => {
  router.push('/profileDetails');
};

const logout = () => {
  removeUserToken();
  localStorage.clear();
  router.push('/');
};
</script>

<template>
  <div class="profile-page">
    <div class="header">
      <h1>Profile</h1>
    </div>

    <div v-if="isLoading" class="loading">
      <p>Loading profile...</p>
    </div>

    <div v-else-if="currentUser" class="profile-content">
      <div class="profile-card">
        <div class="avatar-large">
          {{ (currentUser.firstName || currentUser.username).charAt(0).toUpperCase() }}
        </div>
        <h2 class="profile-name">{{ displayName }}</h2>
        <p class="username">@{{ currentUser.username }}</p>

        <div class="profile-stats">
          <div class="stat">
            <span class="stat-value">{{ currentUser.interests?.length || 0 }}</span>
            <span class="stat-label">Interests</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ currentUser.gender || 'Not set' }}</span>
            <span class="stat-label">Gender</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ currentUser.preference || 'Not set' }}</span>
            <span class="stat-label">Preference</span>
          </div>
        </div>
      </div>

      <div v-if="currentUser.interests?.length" class="interests-section">
        <h3>Interests</h3>
        <div class="interests-grid">
          <span 
            v-for="interest in currentUser.interests" 
            :key="interest"
            class="interest-tag"
          >
            {{ interest }}
          </span>
        </div>
      </div>

      <div class="profile-info">
        <div class="info-item">
          <span class="info-label">📧 Email</span>
          <span class="info-value">{{ currentUser.username }}@destined.com</span>
        </div>
        <div v-if="currentUser.dateOfBirth" class="info-item">
          <span class="info-label">🎂 Birthday</span>
          <span class="info-value">{{ new Date(currentUser.dateOfBirth).toLocaleDateString() }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">📅 Member since</span>
          <span class="info-value">{{ new Date(currentUser.createdAt || Date.now()).toLocaleDateString() }}</span>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="editProfile" class="btn-edit">
          <span class="btn-icon">✏️</span>
          Edit Profile
        </button>
        <button @click="logout" class="btn-logout">
          <span class="btn-icon">🚪</span>
          Logout
        </button>
      </div>
    </div>

    <div v-else class="empty-profile">
      <div class="spinner"></div>
      <p>Loading profile...</p>
    </div>

    <TabBar />
  </div>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 20px;
  padding-bottom: 100px;
}

.header {
  margin-bottom: 32px;
  text-align: center;
}

.header h1 {
  color: #FFF;
  font-size: 36px;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #8354FF 0%, #E91E63 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.empty-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
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

.empty-profile p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 32px;
  font-weight: 700;
  margin: 0;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
}

.loading p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-card {
  background: linear-gradient(135deg, rgba(131, 84, 255, 0.15) 0%, rgba(233, 30, 99, 0.1) 100%);
  backdrop-filter: blur(20px);
  border-radius: 28px;
  padding: 40px 24px;
  text-align: center;
  border: 2px solid rgba(131, 84, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.avatar-large {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8354FF 0%, #E91E63 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFF;
  font-size: 52px;
  font-weight: 800;
  margin: 0 auto 20px;
  border: 5px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 12px 40px rgba(131, 84, 255, 0.5);
  transition: transform 0.3s ease;
}

.avatar-large:hover {
  transform: scale(1.05);
}

.profile-name {
  color: #FFF;
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.username {
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  margin: 0 0 24px 0;
}

.profile-stats {
  display: flex;
  justify-content: space-around;
  padding-top: 24px;
  border-top: 1px solid rgba(131, 84, 255, 0.2);
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  color: #FFF;
  font-size: 20px;
  font-weight: 700;
}

.stat-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  text-transform: uppercase;
}

.interests-section {
  background: rgba(131, 84, 255, 0.1);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(131, 84, 255, 0.2);
}

.interests-section h3 {
  color: #FFF;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.interests-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.interest-tag {
  padding: 8px 16px;
  background: rgba(131, 84, 255, 0.3);
  border-radius: 20px;
  color: #FFF;
  font-size: 14px;
  border: 1px solid rgba(131, 84, 255, 0.4);
}

.profile-info {
  background: rgba(131, 84, 255, 0.05);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid rgba(131, 84, 255, 0.1);
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(131, 84, 255, 0.1);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.info-value {
  color: #FFF;
  font-size: 14px;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.btn-edit,
.btn-logout {
  padding: 18px 24px;
  border-radius: 20px;
  border: none;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.btn-icon {
  font-size: 20px;
}

.btn-edit {
  background: linear-gradient(135deg, #8354FF 0%, #E91E63 100%);
  color: #FFF;
  box-shadow: 0 4px 16px rgba(131, 84, 255, 0.4);
}

.btn-edit:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 28px rgba(131, 84, 255, 0.6);
}

.btn-edit:active {
  transform: translateY(-2px);
}

.btn-logout {
  background: rgba(255, 82, 82, 0.15);
  color: #FF6B6B;
  border: 2px solid rgba(255, 82, 82, 0.4);
}

.btn-logout:hover {
  background: rgba(255, 82, 82, 0.25);
  border-color: rgba(255, 82, 82, 0.6);
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(255, 82, 82, 0.3);
}

.btn-logout:active {
  transform: translateY(-2px);
}
</style>
