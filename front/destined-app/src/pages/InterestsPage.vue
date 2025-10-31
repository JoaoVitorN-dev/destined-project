<script setup lang="ts">
import BackArrow from '@/components/shared/BackArrow.vue';
import router from '@/router';
import InterestsBtn from '@/components/interests/InterestsBtn.vue';
import ContinueBtn from '@/components/shared/ContinueBtn.vue';

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

function goToProfileDetails(){
  router.push("/likes")
}
</script>

<template>
   <div class="header">
      <BackArrow />
      <p style="color: #F44363;">Skip</p>
    </div>
  <div class="container">
   
    <div>
      <h1 style="text-align: center;">Likes, Interests</h1>
      <p style="text-align: center; margin-bottom: 32px;">Share your likes & passion with others</p>
    </div>
    <div class="container-inputs">
      <InterestsBtn :icon="musicIcon" interest="Music"/>
      <InterestsBtn :icon="fitnessIcon" interest="Fitness"/>
      <InterestsBtn :icon="drinkingIcon" interest="Drinking"/>
      <InterestsBtn :icon="extremeSportsIcon" interest="Extreme Sports"/>
      <InterestsBtn :icon="cookingIcon" interest="Cooking"/>
      <InterestsBtn :icon="shoppingIcon" interest="Shopping"/>
      <InterestsBtn :icon="speechesIcon" interest="Speeches"/>
      <InterestsBtn :icon="swimmingIcon" interest="Swimming"/>
      <InterestsBtn :icon="artCraftsIcon" interest="Art"/>
      <InterestsBtn :icon="travellingIcon" interest="Traveling"/>
      <InterestsBtn :icon="videoGamesIcon" interest="Video Games"/>
    </div>
    <p class="load-more">Load More</p>
    <ContinueBtn @click="goToProfileDetails" style="margin-top: 16px;"/>
    
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
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

</style>