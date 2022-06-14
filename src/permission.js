import router from '@/router'
import { GetToken } from '@/utils/token'
import store from '@/store'
import { Notify } from 'vant'
router.beforeEach(async (to, from, next) => {
  const whiteList = ['/login', '/', '/layout/home'] // no redirect whitelist
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
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
})
