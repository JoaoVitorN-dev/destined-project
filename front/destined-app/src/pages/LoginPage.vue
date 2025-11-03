<script setup lang="ts">
import { ref } from 'vue';
import logoText from '../assets/InitialPage/logoText.svg';
import Input from '@/components/shared/Input.vue';
import ContinueBtn from '@/components/shared/ContinueBtn.vue';
import BackArrow from '../components/shared/BackArrow.vue';
import router from '@/router';
import { api } from '@/services/api';
import { connectSocket } from '@/services/socket';

const username = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const isSignUpMode = ref(false);

async function handleLogin() {
  if (!username.value || !password.value) {
    errorMessage.value = 'Please fill in all fields';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const user = await api.login(username.value, password.value);
    console.log('User logged in:', user);
    
    // Conectar ao Socket.io com o ID do usuário
    connectSocket(user._id);
    console.log('🔌 Connected to Socket.io for user:', user._id);
    
    // Verificar se o usuário tem perfil completo
    if (!user.gender || !user.preference) {
      console.log('User needs to complete profile');
      router.push("/profileDetails");
    } else {
      console.log('User has complete profile, going to likes page');
      router.push("/likes");
    }
  } catch (error: any) {
    console.error('Login error:', error);
    errorMessage.value = error.message || 'Failed to login. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

async function handleSignUp() {
  if (!username.value || !password.value) {
    errorMessage.value = 'Please fill in all fields';
    return;
  }

  if (password.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const user = await api.register(username.value, password.value);
    console.log('User registered:', user);
    
    // Conectar ao Socket.io com o ID do usuário
    connectSocket(user._id);
    console.log('🔌 Connected to Socket.io for new user:', user._id);
    
    // Novo usuário sempre precisa completar perfil
    router.push("/profileDetails");
  } catch (error: any) {
    console.error('Sign up error:', error);
    errorMessage.value = error.message || 'Failed to sign up. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

function toggleMode() {
  isSignUpMode.value = !isSignUpMode.value;
  errorMessage.value = '';
  username.value = '';
  password.value = '';
}
</script>

<template>
  <div class="container">
    <BackArrow />
    <div class="card-container">
         <h1>{{ isSignUpMode ? 'Sign Up' : 'Login' }}</h1>
        <logo-text/>
        <div class="form-login">
            <Input v-model="username" placeholder="Username"/>
            <Input v-model="password" type="password" placeholder="Password"/>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            
            <div class="button-group">
              <ContinueBtn 
                v-if="!isSignUpMode"
                @click="handleLogin" 
                :disabled="isLoading"
              >
                {{ isLoading ? 'Loading...' : 'Login' }}
              </ContinueBtn>
              
              <ContinueBtn 
                v-else
                @click="handleSignUp" 
                :disabled="isLoading"
              >
                {{ isLoading ? 'Loading...' : 'Sign Up' }}
              </ContinueBtn>
            </div>

            <p class="toggle-mode" @click="toggleMode">
              {{ isSignUpMode ? 'Already have an account? Login' : "Don't have an account? Sign up" }}
            </p>
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
  width: 100%;
}

.button-group {
  width: 100%;
  display: flex;
  justify-content: center;
}

.toggle-mode {
  font-size: 16px;
  color: #C53E8D;
  cursor: pointer;
  margin: 8px 0 0 0;
  transition: all 0.3s ease;
  text-decoration: underline;
}

.toggle-mode:hover {
  color: #8354FF;
  transform: translateY(-1px);
}

.error-message {
  color: #ff5252;
  font-size: 14px;
  margin: 0;
  text-align: center;
  padding: 8px 12px;
  background: rgba(255, 82, 82, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 82, 82, 0.3);
}

</style>