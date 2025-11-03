import { createRouter, createWebHistory } from 'vue-router'
import InitialPage from '../pages/InitialPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import ProfileDetailsPage from '@/pages/ProfileDetailsPage.vue'
import InterestsPage from '@/pages/InterestsPage.vue'
import LikesPage from '@/pages/LikesPage.vue'
import UsersPage from '@/pages/UsersPage.vue'
import MatchPage from '@/pages/MatchPage.vue'
import MatchesPage from '@/pages/MatchesPage.vue'
import ChatsPage from '@/pages/ChatsPage.vue'
import ChatPage from '@/pages/ChatPage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'

const routes = [
  { path: '/', name: 'Initial Page', component: InitialPage },
  { path: '/login', name: 'Login Page', component: LoginPage },
  { path: '/profileDetails', name: 'Profile Details Page', component: ProfileDetailsPage },
  { path: '/interests', name: 'Interests Page', component: InterestsPage },
  { path: '/likes', name: 'Likes Page', component: LikesPage },
  { path: '/users', name: 'Users Page', component: UsersPage },
  { path: '/match', name: 'Match Page', component: MatchPage },
  { path: '/matches', name: 'Matches Page', component: MatchesPage },
  { path: '/chats', name: 'Chats Page', component: ChatsPage },
  { path: '/chat/:userId', name: 'Chat Page', component: ChatPage },
  { path: '/profile', name: 'Profile Page', component: ProfilePage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router