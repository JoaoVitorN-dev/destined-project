<script setup lang="ts">
import { ref } from 'vue';
import UsersHeader from '../components/users/UsersHeader.vue';
import UsersTabs from '../components/users/UsersTabs.vue';
import UsersGrid from '../components/users/UsersGrid.vue';
import TabBar from '../components/shared/TabBar.vue';

const activeTab = ref('All');

const handleTabChange = (tab: string) => {
  activeTab.value = tab;
};
</script>

<template>
  <div class="users-page">
    <UsersHeader />
    <UsersTabs :activeTab="activeTab" @tab-change="handleTabChange" />
    <UsersGrid :filter="activeTab" />
    <TabBar />
  </div>
</template>

<style scoped>
.users-page {
  min-height: 100vh;
  padding-bottom: 80px;
  overflow-x: hidden;
}
</style>
