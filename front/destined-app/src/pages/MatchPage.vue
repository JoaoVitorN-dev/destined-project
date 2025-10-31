<template>
  <div class="match-page">
    <!-- Animated Background Elements -->
    <div class="background-elements">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
      <div class="ripple ripple-1"></div>
      <div class="ripple ripple-2"></div>
      <div class="ripple ripple-3"></div>
      <div class="dot dot-1"></div>
      <div class="dot dot-2"></div>
      <div class="dot dot-3"></div>
      <div class="dot dot-4"></div>
      <div class="dot dot-5"></div>
    </div>

    <!-- Profile Circles -->
    <div class="profiles-container">
      <div class="profile-circle profile-left">
        <div class="profile-image"></div>
      </div>
      <div class="profile-circle profile-right">
        <div class="profile-image"></div>
      </div>
      <div class="heart-icon">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="#E91E63" stroke="#fff" stroke-width="2"/>
        </svg>
      </div>
    </div>

    <!-- Match Content -->
    <div class="match-content">
      <h1 class="match-title">Congrats!</h1>
      <p class="match-subtitle">It's a Match!</p>
      <p class="match-description">Belle & You both liked each other</p>

      <button class="conversation-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Start Conversation</span>
      </button>

      <button class="keep-dating-btn">Keep Dating</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const startConversation = () => {
  // Navigate to chat or messages page
  router.push('/chat')
}

const keepDating = () => {
  // Return to likes/swipe page
  router.push('/likes')
}
</script>

<style scoped>
.match-page {
  position: relative;
  width: 100%;
  height: 100vh;
  background: linear-gradient(180deg, #1a0029 0%, #0a0015 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 2rem;
}

/* Background Elements */
.background-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  border: 3px solid rgba(233, 30, 99, 0.3);
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: 15%;
  left: 10%;
  background: linear-gradient(135deg, rgba(156, 39, 176, 0.3) 0%, transparent 100%);
  border-color: rgba(156, 39, 176, 0.5);
}

.circle-2 {
  width: 250px;
  height: 250px;
  top: 20%;
  right: 15%;
  background: linear-gradient(135deg, rgba(233, 30, 99, 0.3) 0%, transparent 100%);
}

.circle-3 {
  width: 30px;
  height: 30px;
  bottom: 30%;
  right: 20%;
  background: #FFC107;
  border: none;
}

.ripple {
  position: absolute;
  border-radius: 50%;
  border: 2px solid rgba(233, 30, 99, 0.2);
  animation: ripple 3s ease-out infinite;
}

.ripple-1 {
  width: 300px;
  height: 300px;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 0s;
}

.ripple-2 {
  width: 400px;
  height: 400px;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 1s;
}

.ripple-3 {
  width: 500px;
  height: 500px;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 2s;
}

@keyframes ripple {
  0% {
    transform: translateX(-50%) scale(0.8);
    opacity: 0.8;
  }
  100% {
    transform: translateX(-50%) scale(1.5);
    opacity: 0;
  }
}

.dot {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  animation: float 3s ease-in-out infinite;
}

.dot-1 {
  background: #E91E63;
  top: 20%;
  left: 15%;
  animation-delay: 0s;
}

.dot-2 {
  background: #9C27B0;
  top: 25%;
  left: 8%;
  width: 8px;
  height: 8px;
  animation-delay: 0.5s;
}

.dot-3 {
  background: #FFC107;
  bottom: 35%;
  left: 12%;
  width: 10px;
  height: 10px;
  animation-delay: 1s;
}

.dot-4 {
  background: #E91E63;
  bottom: 30%;
  right: 25%;
  width: 8px;
  height: 8px;
  animation-delay: 1.5s;
}

.dot-5 {
  background: #9C27B0;
  top: 35%;
  right: 10%;
  animation-delay: 2s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Profile Circles */
.profiles-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 3rem;
  z-index: 2;
}

.profile-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 4px solid #fff;
  overflow: hidden;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  animation: slideIn 0.6s ease-out;
}

.profile-left {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  animation-delay: 0.2s;
  transform: translateX(-100px);
  animation-fill-mode: both;
}

.profile-right {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  animation-delay: 0.4s;
  transform: translateX(100px);
  animation-fill-mode: both;
}

@keyframes slideIn {
  to {
    transform: translateX(0);
  }
}

.profile-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.heart-icon {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: #E91E63;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #fff;
  box-shadow: 0 4px 20px rgba(233, 30, 99, 0.5);
  animation: heartBeat 1s ease-in-out infinite;
  z-index: 3;
}

@keyframes heartBeat {
  0%, 100% {
    transform: translateX(-50%) scale(1);
  }
  50% {
    transform: translateX(-50%) scale(1.1);
  }
}

/* Match Content */
.match-content {
  text-align: center;
  z-index: 2;
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.match-title {
  font-size: 3rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.match-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 0.5rem 0;
}

.match-description {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 2.5rem 0;
}

.conversation-btn {
  width: 100%;
  max-width: 300px;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin: 0 auto 1.5rem auto;
  transition: all 0.3s ease;
}

.conversation-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.conversation-btn svg {
  width: 24px;
  height: 24px;
}

.keep-dating-btn {
  width: 100%;
  max-width: 300px;
  padding: 1rem 2rem;
  background: transparent;
  border: none;
  color: #E91E63;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 0 0 10px rgba(233, 30, 99, 0.5);
}

.keep-dating-btn:hover {
  color: #f5576c;
  transform: scale(1.05);
  text-shadow: 0 0 20px rgba(233, 30, 99, 0.8);
}

/* Responsive */
@media (max-width: 768px) {
  .match-title {
    font-size: 2.5rem;
  }

  .profile-circle {
    width: 120px;
    height: 120px;
  }

  .heart-icon {
    width: 60px;
    height: 60px;
  }

  .heart-icon svg {
    width: 50px;
    height: 50px;
  }

  .conversation-btn,
  .keep-dating-btn {
    max-width: 280px;
  }
}

@media (max-width: 480px) {
  .match-title {
    font-size: 2rem;
  }

  .profile-circle {
    width: 100px;
    height: 100px;
  }

  .profiles-container {
    gap: 1.5rem;
  }

  .heart-icon {
    width: 50px;
    height: 50px;
  }

  .heart-icon svg {
    width: 40px;
    height: 40px;
  }
}
</style>
