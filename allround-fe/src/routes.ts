import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import About from './pages/About.vue'
import Typewright from './pages/Typewright.vue'
import Aimlab from './pages/Aimlab.vue'
import QuickMaths from './pages/QuickMaths.vue'
import ChimpTest from './pages/ChimpTest.vue'
import Settings from './views/Settings.vue'

const routes = [
  { path: '/', component: Home, name:'Home' },
  { path: '/about', component: About, name:'About' },
  { path:'/projects/typewright', component: Typewright, name:'Typewright'},
  { path:'/projects/aimlab', component: Aimlab, name:'Aimlab'},
  { path:'/projects/quick-maths', component: QuickMaths, name:'QuickMaths'},
  { path:'/projects/chimp-test', component: ChimpTest, name:'ChimpTest'},
  { path: '/settings', component: Settings, name: 'Settings' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
