<template>
  <div class="matches-page">
    <!-- Header -->
    <div class="matches-header">
      <button class="back-button" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="header-content">
        <h1 class="page-title">Dating Matches</h1>
        <p class="page-subtitle">Check out lists of matches & keep enjoing</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs-container">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="['tab', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Matches List -->
    <div class="matches-list">
      <div 
        v-for="match in filteredMatches" 
        :key="match.id"
        class="match-item"
        @click="openChat(match.id)"
      >
        <div class="match-avatar">
          <div class="avatar-circle" :style="{ background: match.color }"></div>
        </div>
        <div class="match-info">
          <h3 class="match-name">{{ match.name }}</h3>
          <p class="match-status">{{ match.status }}</p>
          <span class="match-time">{{ match.time }}</span>
        </div>
        <button class="menu-button" @click.stop="openMenu(match.id)">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="5" r="2" fill="currentColor"/>
            <circle cx="12" cy="12" r="2" fill="currentColor"/>
            <circle cx="12" cy="19" r="2" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/services/api'

const router = useRouter()

interface Match {
  id: string
  _id?: string
  name: string
  username?: string
  status: string
  time: string
  color: string
  type: 'all' | 'you-liked' | 'liked-you' | 'views'
}

const activeTab = ref<string>('all')
const isLoading = ref(false)

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'you-liked', label: 'You Liked' },
  { id: 'liked-you', label: 'Liked You' },
  { id: 'views', label: 'Views' }
]

const matches = ref<Match[]>([])
const allMatches = ref<Match[]>([])
const youLiked = ref<Match[]>([])
const likedYou = ref<Match[]>([])

const colors: string[] = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
]

const getColor = (index: number): string => {
  return colors[index % colors.length]!;
}

onMounted(async () => {
  isLoading.value = true
  
  try {
    // Buscar matches (mutual likes)
    const matchesData = await api.getMatches()
    allMatches.value = matchesData.map((user: any, index: number) => ({
      id: user._id,
      _id: user._id,
      name: user.username,
      username: user.username,
      status: 'Mutual match',
      time: new Date().toLocaleString(),
      color: getColor(index),
      type: 'all' as const
    }))

    // Buscar likes enviados
    const sentLikes = await api.getSentLikes()
    youLiked.value = sentLikes.map((user: any, index: number) => ({
      id: user._id,
      _id: user._id,
      name: user.username,
      username: user.username,
      status: 'You liked this user',
      time: new Date().toLocaleString(),
      color: getColor(index),
      type: 'you-liked' as const
    }))

    // Buscar likes recebidos
    const receivedLikes = await api.getReceivedLikes()
    likedYou.value = receivedLikes.map((user: any, index: number) => ({
      id: user._id,
      _id: user._id,
      name: user.username,
      username: user.username,
      status: 'Liked you',
      time: new Date().toLocaleString(),
      color: getColor(index),
      type: 'liked-you' as const
    }))

    // Combinar todos os matches
    matches.value = [...allMatches.value, ...youLiked.value, ...likedYou.value]
  } catch (error) {
    console.error('Error loading matches:', error)
    // Fallback para dados mock em caso de erro
    matches.value = [
      {
        id: '1',
        name: 'No matches yet',
        status: 'Start liking users to see matches',
        time: '',
        color: getColor(0),
        type: 'all'
      }
    ]
  } finally {
    isLoading.value = false
  }
})

const filteredMatches = computed(() => {
  if (activeTab.value === 'all') {
    return matches.value
  }
  return matches.value.filter(match => match.type === activeTab.value)
})

const goBack = () => {
  router.back()
}

const openChat = (matchId: string) => {
  router.push(`/chat/${matchId}`)
}

const openMenu = (matchId: string) => {
  console.log('Open menu for match:', matchId)
  // Implement menu functionality
}
</script>

<style scoped>
.matches-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #2d1b3d 0%, #1a0029 100%);
  padding-bottom: 2rem;
}

/* Header */
.matches-header {
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: rgba(45, 27, 61, 0.8);
  backdrop-filter: blur(10px);
}

.back-button {
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  margin-top: 0.25rem;
}

.back-button:hover {
  transform: translateX(-4px);
}

.back-button svg {
  width: 24px;
  height: 24px;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.25rem 0;
}

.page-subtitle {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

/* Tabs */
.tabs-container {
  display: flex;
  gap: 0.5rem;
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  overflow-x: auto;
  scrollbar-width: none;
}

.tabs-container::-webkit-scrollbar {
  display: none;
}

.tab {
  padding: 0.5rem 1.25rem;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  position: relative;
  transition: color 0.3s ease;
  border-bottom: 2px solid transparent;
}

.tab.active {
  color: #E91E63;
  border-bottom-color: #E91E63;
}

.tab:hover:not(.active) {
  color: rgba(255, 255, 255, 0.9);
}

/* Matches List */
.matches-list {
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.match-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(45, 27, 61, 0.6);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.match-item:hover {
  background: rgba(45, 27, 61, 0.9);
  border-color: rgba(233, 30, 99, 0.3);
  transform: translateX(4px);
}

.match-avatar {
  flex-shrink: 0;
}

.avatar-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.match-info {
  flex: 1;
  min-width: 0;
}

.match-name {
  font-size: 1.0625rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 0.25rem 0;
}

.match-status {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.match-time {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.menu-button {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  flex-shrink: 0;
}

.menu-button:hover {
  color: #fff;
}

.menu-button svg {
  width: 24px;
  height: 24px;
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }

  .page-subtitle {
    font-size: 0.8125rem;
  }

  .match-item {
    padding: 0.875rem;
  }

  .avatar-circle {
    width: 48px;
    height: 48px;
  }

  .match-name {
    font-size: 1rem;
  }

  .match-status {
    font-size: 0.8125rem;
  }
}

@media (max-width: 480px) {
  .matches-header {
    padding: 1rem 1rem 0.75rem 1rem;
  }

  .tabs-container {
    padding: 1rem 1rem 0.75rem 1rem;
  }

  .matches-list {
    padding: 0 1rem;
  }

  .page-title {
    font-size: 1.375rem;
  }

  .match-item {
    gap: 0.75rem;
    padding: 0.75rem;
  }

  .avatar-circle {
    width: 44px;
    height: 44px;
  }
}
</style>
