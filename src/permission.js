import router from '@/router'
import { GetToken } from '@/utils/token'
import store from '@/store'
import { Notify } from 'vant'
router.beforeEach(async (to, from, next) => {
  const whiteList = ['/', 'Home', 'ArticleDetail', 'Login'] // no redirect whitelist
  const token = GetToken()
  if (token) {
    if (to.path === '/login') {
      next(false)
    } else {
      const name = store.state.user.name
      if (name) {
        next()
      } else {
        try {
          await store.dispatch('user/GetUserInfoData')
          next()
        } catch (error) {
          Notify({ type: 'primary', message: error.message, duration: '1000' })
        }
      }
    }
  } else {
    console.log(to, from)
    if (whiteList.indexOf(to.name) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})
// 路由后置守卫
router.afterEach((to, from) => {
  if (to.meta.isRecord) {
    setTimeout(() => {
      window.scrollTo(0, to.meta.top)
    }, 0)
  }
})
