<script setup lang="ts">
import { ref } from 'vue';
import logoText from '../assets/InitialPage/logoText.svg';
import Input from '@/components/shared/Input.vue';
import ContinueBtn from '@/components/shared/ContinueBtn.vue';
import BackArrow from '@/components/shared/BackArrow.vue';
import avatar from '../assets/profileDetails/avatar.svg'
import router from '@/router';

const preference = ref<string>('')

function goToNextStep(){
  router.push("/interests")
}
</script>

<template>
  <div class="container">
    <BackArrow/>
    <div class="card-container">
        <div class="title-box">
            <h1>Profile Details</h1>
            <p>Fill up the following details</p>
        </div>
         <div class="avatar">
            <avatar/>
         </div>
        <div class="form-profile">
            <label>
                First Name
                <Input type="text" placeholder="First Name"/>
            </label>
            <Input type="text" placeholder="Last Name"/>
            <Input type="date" placeholder="DOB"/>
              <div class="input-gradient-wrap">
                <select class="inner-input" v-model="preference" name="myBrowser">
                  <option value="" disabled>Select your preference</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            <ContinueBtn @click="goToNextStep"/>
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

.title-box{
    margin-bottom: 14px;
}

.title-box h1{
  color: #FFF;
  font-size: 36px;
  font-weight: 600;
}

.title-box p{
    font-size: 16px;
    font-weight: 400;
    color: #FFF;
    text-align: center;
    margin-top: -4px;
}

.form-profile{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.form-profile label {
    color: #DA489E;
    font-size: 16px;
    font-weight: 500;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.input-gradient-wrap {
  display: inline-block;
  padding: 2px; 
  border-radius: 16px; 
  background: linear-gradient(90deg, #C53E8D, #8A52F3);
  margin-bottom: 12px;
}
.input-gradient-wrap:focus-within {
  box-shadow: 0 0 0 4px rgba(138,82,243,0.12);
}
.inner-input {
  display: block;
  width: 280px;
  border: none;
  outline: none;
  border-radius: 13px; 
  padding: 10px 12px;
  background: #03000C;
  box-sizing: border-box;
  color: #FFFFFF;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  cursor: pointer;
}

.inner-input option {
  background: #03000C;
  color: #FFFFFF;
}

</style>