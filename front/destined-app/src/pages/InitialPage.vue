<script setup lang="ts">
import Logo from '@/components/home/Logo.vue';
import StartButton from '@/components/home/StartButton.vue';
</script>

<template>
  <div class="container">
    <div>
      <logo/>
    </div>
    <div>
      <StartButton/>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  padding: 0;
  margin: 0;
  gap: 24px; 
  overflow: hidden;
}
</style>