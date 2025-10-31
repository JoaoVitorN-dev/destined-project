<script setup lang="ts"></script>

<template>
  <div id="app">
    <!-- opcional: header -->
    <router-view />
    <!-- opcional: footer -->
  </div>
</template>

<style>
/* global reset / layout */
html, body, #app { height: 100%; margin: 0; }
*, *::before, *::after { box-sizing: border-box; }
</style>