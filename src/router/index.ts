import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home'
import FromCreator from '../views/test/form-creator'
import Stop from '../views/test/stop'

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
  },
  {
    path: '/test/stop',
    name: 'testStop',
    component: Stop
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
