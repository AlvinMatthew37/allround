import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './routes'
import { loadTheme } from './components/projects/theme'

loadTheme()

const app = createApp(App)
app.use(router)

router.afterEach((to) => {
    document.title = (to.name as string) + ' | Allround' || 'Allround'
})

app.mount('#app')