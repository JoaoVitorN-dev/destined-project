<script setup lang="ts">
    import notificationsIcon from '../../assets/icons/notifications.svg'
    import searchIcon from '../../assets/icons/search.svg'
    import settings from '../../assets/icons/settings.svg'
</script>

<template>
  <div class="container">
    <div class="left">
        <div class="add-button">
            <div class="more">+</div>
        </div>
        <p class="add-story-text">Add story</p>
    </div>
    <div class="right">
        <notificationsIcon class="icon"/>
        <searchIcon class="icon"/>
        <settings class="icon"/>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex !important;
  flex-direction: row !important;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  flex-wrap: nowrap;
}

.left {
  display: flex !important;
  flex-direction: row !important;
  gap: 8px;
  align-items: center;
  flex-wrap: nowrap;
}

.add-story-text {
  margin: 0;
  white-space: nowrap;
}

.add-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #B5101C;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.more {
  font-size: 32px;
  font-weight: 600;
  color: #FFF;
  line-height: 1;
}

.right {
  display: flex !important;
  flex-direction: row !important;
  gap: 16px;
  align-items: center;
  flex-wrap: nowrap;
  flex-shrink: 0;
}

.icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}
</style>
