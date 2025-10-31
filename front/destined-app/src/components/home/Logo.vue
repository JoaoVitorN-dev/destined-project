<script setup lang="ts">
import logo from '../../assets/InitialPage/logoDestined.svg'
import logoText from '../../assets/InitialPage/logoText.svg'
</script>

<template>
  <div class="destined-logo">
    <logo class="logo-image"/>
    <logo-text class="logo-text"/>
  </div>
</template>

<style scoped>
.destined-logo {
  position: relative;
  width: 430px;
  max-width: 90%;
  margin: 0 auto;
}

.logo-image {
  display: block;
  width: 100%;
  height: auto;
}

.logo-text {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 70%;
  width: auto;
  height: auto;
  pointer-events: none;
}
</style>