<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import UserCard from './UserCard.vue';
import { api } from '@/services/api';

interface Props {
  filter: string;
}

const props = defineProps<Props>();

interface User {
  id?: number;
  _id?: string;
  name?: string;
  username?: string;
  age?: number;
  distance?: string;
  likes?: number;
  isOnline?: boolean;
  image?: string;
}

// Mock data for users
const allUsers = ref<User[]>([]);
const isLoading = ref(false);
const error = ref('');

const fetchUsers = async () => {
  isLoading.value = true;
  error.value = '';
  
  try {
    const users = await api.getUsers();
    // Mapear os usuários da API para o formato esperado pelo componente
    allUsers.value = users.map((user: any, index: number) => ({
      id: index + 1,
      _id: user._id,
      name: user.username,
      username: user.username,
      age: 25 + (index % 10), // Idade fictícia
      distance: `${(1 + (index % 3)).toFixed(1)} km away`,
      likes: 20 + (index * 5),
      isOnline: index % 2 === 0,
    }));
  } catch (err) {
    console.error('Error fetching users:', err);
    error.value = 'Failed to load users';
    // Fallback para dados mock em caso de erro
    allUsers.value = [
      { id: 1, name: 'Belle Benson', age: 28, distance: '1.5 km away', likes: 35, isOnline: true },
      { id: 2, name: 'Ruby Diaz', age: 33, distance: '1.2 km away', likes: 61, isOnline: false },
      { id: 3, name: 'Myley Corbyn', age: 23, distance: '1.6 km away', likes: 40, isOnline: true },
    ];
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});

const filteredUsers = computed(() => {
  switch (props.filter) {
    case 'Online':
      return allUsers.value.filter(user => user.isOnline);
    case 'New Daters':
      return allUsers.value.filter((user, index) => index > 3);
    case 'Liked You':
      return allUsers.value.filter(user => (user.likes || 0) > 40);
    default:
      return allUsers.value;
  }
});
</script>

<template>
  <div class="users-grid">
    <div v-if="isLoading" class="loading">Loading users...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <UserCard
      v-else
      v-for="user in filteredUsers"
      :key="user._id || user.id"
      :user="user as any"
    />
  </div>
</template>

<style scoped>
.users-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 0 20px 20px 20px;
}

@media (min-width: 768px) {
  .users-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .users-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.loading, .error {
  grid-column: 1 / -1;
  text-align: center;
  padding: 20px;
  color: #fff;
  font-size: 16px;
}

.error {
  color: #ff5252;
}
</style>
