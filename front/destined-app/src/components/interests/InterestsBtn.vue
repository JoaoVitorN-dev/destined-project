<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  icon: string;
  interest: string;
}>();

const isClicked = ref(false);
const toggleClick = () => (isClicked.value = !isClicked.value);
</script>

<template>
  <div class="btn-container" :class="{ clicked: isClicked }" @click="toggleClick">
    <component :is="props.icon" class="icon" />
    <h2 class="btn-title">{{ interest }}</h2>
  </div>
</template>

<style scoped>
.btn-container {
  display: flex;
  height: 60px;
  width: 150px;
  border-radius: 32px;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin: 0;
  border: 2px solid transparent;
  background-color: #1B1142;
  transition: all 0.3s ease;
}

.btn-title{
    color: #B783EB;
    font-size: 16px;
    font-weight: 500;
}

.btn-container.clicked {
  background-color: #03000C;
  border: 2px solid transparent;
  background-image: 
    linear-gradient(#03000C, #03000C),
    linear-gradient(135deg, #B783EB, #6B46C1, #B783EB);
  background-origin: border-box;
  background-clip: padding-box, border-box;
}

.icon {
  width: 20px;
  height: 20px;
  color: #B783EB; 
  transition: color 0.3s ease;
}

.btn-container.clicked .icon {
  color: #FFF; 
}
</style>
