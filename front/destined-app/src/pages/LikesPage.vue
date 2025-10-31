<script setup lang="ts">
import Header from '@/components/like/Header.vue';
import MainCard from '@/components/like/MainCard.vue';
import ActionButtons from '@/components/like/ActionButtons.vue';
import TabBar from '@/components/shared/TabBar.vue';

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
  padding-bottom: 80px; /* Space for tab bar */
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  flex: 1;
}

.header {
  margin-bottom: 20px;
}
</style>