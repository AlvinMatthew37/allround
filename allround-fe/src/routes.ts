import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import About from './pages/About.vue'
import Monkeytype from './pages/Monkeytype.vue'
import Aimlab from './pages/Aimlab.vue'
import Settings from './views/Settings.vue'

const routes = [
  { path: '/', component: Home, name:'Home' },
  { path: '/about', component: About, name:'About' },
  { path:'/projects/monkeytype', component: Monkeytype, name:'MonkeyType'},
  { path:'/projects/aimlab', component: Aimlab, name:'Aimlab'},
  { path: '/settings', component: Settings, name: 'Settings' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
