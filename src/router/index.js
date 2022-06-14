import Vue from 'vue'
import VueRouter from 'vue-router'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location, resolve, reject) {
  if (resolve || reject) return originalPush.call(this, location, resolve, reject)
  return originalPush.call(this, location).catch((e) => {})
}

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
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/Search')
  },
  {
    path: '/searchResult/:kw',
    name: 'SearchResult',
    component: () => import('@/views/Search/SearchResult')
  },
  {
    path: '/detail/:art_id',
    name: 'Detail',
    component: () => import('@/views/ArticleDetail')
  },
  {
    path: '/userEditor',
    name: 'UserEditor',
    component: () => import('@/views/UserEditor')
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('@/views/Chat')
  }
]
// const router = new VueRouter({
//   // 访问路由就是唯一顶部
//   scrollBehavior: () => ({ y: 0 }),
//   routes
// })

const createRouter = () => {
  return new VueRouter({
  // 访问路由就是唯一顶部
    scrollBehavior: () => ({ y: 0 }),
    routes
  })
}

const router = createRouter()

export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
