<script setup lang="ts">
import { ref } from 'vue';
import BackArrow from '@/components/shared/BackArrow.vue';
import router from '@/router';
import InterestsBtn from '@/components/interests/InterestsBtn.vue';
import ContinueBtn from '@/components/shared/ContinueBtn.vue';
import { api } from '@/services/api';

// Import SVG icons
import musicIcon from '@/assets/icons/music.svg';
import fitnessIcon from '@/assets/icons/fitness.svg';
import drinkingIcon from '@/assets/icons/drinking.svg';
import extremeSportsIcon from '@/assets/icons/extreme-sports.svg';
import cookingIcon from '@/assets/icons/cooking.svg';
import shoppingIcon from '@/assets/icons/shopping.svg';
import speechesIcon from '@/assets/icons/speeches.svg';
import swimmingIcon from '@/assets/icons/swimming.svg';
import artCraftsIcon from '@/assets/icons/art&crafts.svg';
import travellingIcon from '@/assets/icons/travelling.svg';
import videoGamesIcon from '@/assets/icons/video-games.svg';

const selectedInterests = ref<string[]>([]);

const toggleInterest = (interest: string) => {
  const index = selectedInterests.value.indexOf(interest);
  if (index > -1) {
    selectedInterests.value.splice(index, 1);
  } else {
    selectedInterests.value.push(interest);
  }
};

const isInterestSelected = (interest: string) => {
  return selectedInterests.value.includes(interest);
};

async function goToLikes(){
  try {
    // Buscar dados salvos do perfil
    const profileDataStr = localStorage.getItem('profile-data');
    if (!profileDataStr) {
      alert('Profile data not found. Please fill the profile details first.');
      router.push('/profileDetails');
      return;
    }

    const profileData = JSON.parse(profileDataStr);
    console.log('Profile data from storage:', profileData); // Debug
    
    const userId = localStorage.getItem('user-token');
    console.log('User ID:', userId); // Debug

    if (!userId) {
      alert('User not logged in');
      router.push('/login');
      return;
    }

    const updateData = {
      ...profileData,
      interests: selectedInterests.value,
    };
    console.log('Updating user with data:', updateData); // Debug

    // Atualizar perfil do usuário com todos os dados
    const updatedUser = await api.updateUser(userId, updateData);
    console.log('User updated successfully:', updatedUser); // Debug

    // Limpar dados temporários
    localStorage.removeItem('profile-data');

    // Redirecionar para página de likes (estilo Tinder)
    router.push("/likes");
  } catch (error) {
    console.error('Error saving profile:', error);
    alert('Failed to save profile. Please try again. Error: ' + (error as Error).message);
  }
}

function skipInterests() {
  goToLikes();
}
</script>

<template>
   <div class="header">
      <BackArrow />
      <p style="color: #F44363; cursor: pointer;" @click="skipInterests">Skip</p>
    </div>
  <div class="container">
   
    <div>
      <h1 style="text-align: center;">Likes, Interests</h1>
      <p style="text-align: center; margin-bottom: 32px;">Share your likes & passion with others</p>
    </div>
    <div class="container-inputs">
      <InterestsBtn 
        :icon="musicIcon" 
        interest="Music" 
        :isSelected="isInterestSelected('Music')"
        @click="toggleInterest('Music')"
      />
      <InterestsBtn 
        :icon="fitnessIcon" 
        interest="Fitness"
        :isSelected="isInterestSelected('Fitness')"
        @click="toggleInterest('Fitness')"
      />
      <InterestsBtn 
        :icon="drinkingIcon" 
        interest="Drinking"
        :isSelected="isInterestSelected('Drinking')"
        @click="toggleInterest('Drinking')"
      />
      <InterestsBtn 
        :icon="extremeSportsIcon" 
        interest="Extreme Sports"
        :isSelected="isInterestSelected('Extreme Sports')"
        @click="toggleInterest('Extreme Sports')"
      />
      <InterestsBtn 
        :icon="cookingIcon" 
        interest="Cooking"
        :isSelected="isInterestSelected('Cooking')"
        @click="toggleInterest('Cooking')"
      />
      <InterestsBtn 
        :icon="shoppingIcon" 
        interest="Shopping"
        :isSelected="isInterestSelected('Shopping')"
        @click="toggleInterest('Shopping')"
      />
      <InterestsBtn 
        :icon="speechesIcon" 
        interest="Speeches"
        :isSelected="isInterestSelected('Speeches')"
        @click="toggleInterest('Speeches')"
      />
      <InterestsBtn 
        :icon="swimmingIcon" 
        interest="Swimming"
        :isSelected="isInterestSelected('Swimming')"
        @click="toggleInterest('Swimming')"
      />
      <InterestsBtn 
        :icon="artCraftsIcon" 
        interest="Art"
        :isSelected="isInterestSelected('Art')"
        @click="toggleInterest('Art')"
      />
      <InterestsBtn 
        :icon="travellingIcon" 
        interest="Traveling"
        :isSelected="isInterestSelected('Traveling')"
        @click="toggleInterest('Traveling')"
      />
      <InterestsBtn 
        :icon="videoGamesIcon" 
        interest="Video Games"
        :isSelected="isInterestSelected('Video Games')"
        @click="toggleInterest('Video Games')"
      />
    </div>
    <p class="load-more">Load More</p>
    <ContinueBtn @click="goToLikes" style="margin-top: 16px;"/>
    
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
  padding: 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0px 16px;
}

.container-inputs {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-wrap: wrap;
  gap: 16px;
}

.load-more {
  margin-top: 32px;
  cursor: pointer;
  background-image: linear-gradient(to right, #DD3562, #8354FF);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

</style>