<script setup lang="ts">
interface Props {
  activeTab: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'tab-change', tab: string): void;
}>();

const tabs = ['All', 'Online', 'New Daters', 'Liked You'];

const handleTabClick = (tab: string) => {
  emit('tab-change', tab);
};
</script>

<template>
  <div class="users-tabs">
    <div class="tabs-container">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="tab-btn"
        :class="{ active: activeTab === tab }"
        @click="handleTabClick(tab)"
      >
        {{ tab }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.users-tabs {
  padding: 0 20px 20px 20px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.users-tabs::-webkit-scrollbar {
  display: none;
}

.tabs-container {
  display: flex;
  gap: 12px;
  min-width: min-content;
}

.tab-btn {
  background: transparent;
  border: none;
  color: #8B7BA8;
  font-size: 15px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  position: relative;
}

.tab-btn:hover {
  color: #B8A9D9;
}

.tab-btn.active {
  color: #FF3B6D;
  font-weight: 600;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 2px;
  background: #FF3B6D;
  border-radius: 2px;
}
</style>
