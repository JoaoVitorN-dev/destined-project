import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// global styles (applies the default gradient to all pages)
import './styles/global.css'

const app = createApp(App)

app.use(router)

app.mount('#app')
