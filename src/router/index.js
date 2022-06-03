import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login')
  },
  {
    path: '/',
    redirect: '/layout/home'
  },
  {
    path: '/layout',
    name: 'Layout',
    component: () => import('@/views/Layout'),
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/Layout/Home')
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/Layout/User')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
