<script setup lang="ts">
import { ref } from 'vue';
import logoText from '../assets/InitialPage/logoText.svg';
import Input from '@/components/shared/Input.vue';
import ContinueBtn from '@/components/shared/ContinueBtn.vue';
import BackArrow from '../components/shared/BackArrow.vue';
import router from '@/router';
import { api } from '@/services/api';

const username = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

async function handleLogin() {
  if (!username.value || !password.value) {
    errorMessage.value = 'Please fill in all fields';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    // Criar usuário (simulando login/registro)
    await api.createUser(username.value, password.value);
    router.push("/users");
  } catch (error) {
    console.error('Login error:', error);
    errorMessage.value = 'Failed to login. Please try again.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="container">
    <BackArrow />
    <div class="card-container">
         <h1>Login</h1>
        <logo-text/>
        <div class="form-login">
            <Input v-model="username" placeholder="Username"/>
            <Input v-model="password" type="password" placeholder="Password"/>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            <p class="sing-up">Sing up</p>
            <ContinueBtn @click="handleLogin" :disabled="isLoading"/>
        </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
  padding: 16px;
}

.card-container{
    display: flex;
    align-items: center;
    height: 80vh;
    justify-content: space-between;
    flex-direction: column;
}

h1{
  color: #FFF;
  font-size: 36px;
  font-weight: 600;
}

.form-login{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.sing-up{
  font-size: 18px;
  color: #C53E8D;
}

.error-message {
  color: #ff5252;
  font-size: 14px;
  margin: 0;
}

</style>