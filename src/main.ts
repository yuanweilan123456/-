import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import './styles.css'
import './premium.css'
import './editorial.css'

createApp(App).use(router).use(i18n).mount('#app')
