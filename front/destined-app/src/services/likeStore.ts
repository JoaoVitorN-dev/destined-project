import { ref } from 'vue';
import { api } from './api';

interface User {
  _id: string;
  username: string;
  age?: number;
  distance?: string;
}

// Estado compartilhado entre componentes
const currentUserIndex = ref(0);
const users = ref<User[]>([]);
const isLoading = ref(false);

export const useLikeStore = () => {
  const loadUsers = async (forceReload = false) => {
    if (users.value.length > 0 && !forceReload) return; // Já carregado
    
    isLoading.value = true;
    try {
      const fetchedUsers = await api.getUsers();
      console.log('Fetched users:', fetchedUsers); // Debug
      users.value = fetchedUsers.map((user: any, index: number) => ({
        ...user, // Passa todos os dados do usuário
        age: user.age || 25 + (index % 10),
        distance: user.distance || `${(1 + (index % 3)).toFixed(1)} km away`,
      }));
      currentUserIndex.value = 0;
      console.log('Mapped users:', users.value); // Debug
    } catch (error) {
      console.error('Error loading users:', error);
      // Fallback para dados mock
      users.value = [
        { _id: '1', username: 'Anna Mcconaughey', age: 28, distance: '1.5 km away' },
        { _id: '2', username: 'Belle Benson', age: 26, distance: '2.0 km away' },
      ];
    } finally {
      isLoading.value = false;
    }
  };

  const getCurrentUser = () => {
    if (users.value.length === 0) return null;
    return users.value[currentUserIndex.value];
  };

  const nextUser = () => {
    if (currentUserIndex.value < users.value.length - 1) {
      currentUserIndex.value++;
    } else {
      currentUserIndex.value = 0; // Volta ao início
    }
  };

  const likeCurrentUser = async () => {
    const user = getCurrentUser();
    if (!user) return null;

    try {
      const result = await api.likeUser(user._id);
      nextUser();
      return result;
    } catch (error) {
      console.error('Error liking user:', error);
      return null;
    }
  };

  const skipCurrentUser = () => {
    nextUser();
  };

  return {
    users,
    currentUserIndex,
    isLoading,
    loadUsers,
    getCurrentUser,
    nextUser,
    likeCurrentUser,
    skipCurrentUser,
  };
};
