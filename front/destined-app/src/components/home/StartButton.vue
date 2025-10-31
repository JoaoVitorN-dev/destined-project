<script setup lang="ts">
import router from '@/router';
import arrow from '../../assets/InitialPage/arrow.svg'

function toLogin(){
    router.push('/login')
}
</script>

<template>
    <div class="start-container" @click="toLogin">
        <h1 class="start-title">Get Started</h1>
        <arrow class="start-arrow"/>
    </div>
</template>

<style scoped>
.start-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 0;
}

.start-container:hover{
    cursor: pointer;
}

.start-title {
  font-size: 1.5rem;
  margin: 0;
  background: linear-gradient(90deg, #DD3562, #8354FF);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent; 
}

.start-arrow {
  width: 20.64px;
  height: 12.61px;
}
</style>