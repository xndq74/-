import axios from 'axios'
// 引入仓库访问里面的token
import store from '@/store'
import { GetToken, RemoveToken, SetToken } from './token'
import router from '@/router'
// Dialog
import { Notify, Dialog } from 'vant'
import api from '@/api'
const request = axios.create({
  baseURL: '/v1_0',
  timeout: 20000
})

// 添加请求拦截器
request.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // 如果有token 就在请求头里携带token
    if (store.getters.token) {
      config.headers.Authorization = 'Bearer ' + GetToken()
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
request.interceptors.response.use(
  // 对响应数据做点什么
  function (RequestResult) {
    // 如果请求结果不成功
    if (RequestResult.status !== 201 && RequestResult.status !== 200 && RequestResult.status !== 204) {
      Notify({ type: 'danger', message: RequestResult.data.message })
    } else {
      return RequestResult
    }
  },
  async function (error) {
    // 401 refresh_token 未携带或已过期
    if (error.response.status === 401) {
      store.commit('user/SET_TOKEN', '')
      RemoveToken()
      const newToken = await api.user.acquireNewToken()
      if (newToken.status === 201) {
        store.commit('user/SET_TOKEN', newToken.data.data.token)
        SetToken('geek-itheima', newToken.data.data.token)
      }
      error.config.headers.Authorization = `Bearer ${GetToken('refresh_token')}`
      // return到await的地方
      return request(error.config)
    }
    if (error.response.status === 500 &&
      error.response.data.message === 'refresh_token失效' &&
      error.response.config.url === '/authorizations') {
      Dialog.alert({
        title: '登入过期',
        message: '请从新登入'
      }).then(async () => {
        // 因为清除token返回的是premise成功的回调 所有可以用await 等他他相应成功后在刷新页面，也可以用then和ratch来接收
        await store.dispatch('user/ResetToken')
        router.replace('/login')
      })
      // 刷新页面 在路由守卫里就可以设置回到登入界面。
    }
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)
// 导出自定义函数, 参数对象解构赋值
// 以后换库, 只需要改这里, 逻辑页面不用动, 保证代码的复用性和独立性(高内聚低耦合)
export default ({ url, method, params, data, headers }) => request(
  { url, method, params, data, headers }
)
