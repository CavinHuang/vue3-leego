import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home'
import FromCreator from '../views/test/form-creator'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/test/form-creator',
    name: 'FormCreator',
    component: FromCreator
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
