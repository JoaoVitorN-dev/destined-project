<script setup lang="ts">
import { onMounted } from 'vue';
import Header from '@/components/like/Header.vue';
import MainCard from '@/components/like/MainCard.vue';
import ActionButtons from '@/components/like/ActionButtons.vue';
import TabBar from '@/components/shared/TabBar.vue';
import { useLikeStore } from '@/services/likeStore';

const store = useLikeStore();

// Forçar recarregar usuários quando entrar na página
onMounted(async () => {
  console.log('LikesPage mounted, reloading users...');
  await store.loadUsers(true); // forceReload = true
});
</script>

<template>
  <div class="page-container">
    <div class="header">
      <Header/>
    </div>
    <div class="container">
      <div>
        <MainCard/>
      </div>
      <ActionButtons/>
    </div>
    <TabBar/>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 90px;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  flex: 1;
  justify-content: center;
  gap: 8px;
}

.header {
  margin-bottom: 24px;
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>