import api from '@/api'
import { GetToken, SetToken, ClearToken } from '@/utils/token'
// 从路由中导入重置路由的方法
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: GetToken() || [],
    UserChannels: [],
    name: '',
    photo: '',
    user: {},
    refresh_token: GetToken('refresh_token') || []
  }
}
export default {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    SET_TOKEN (state, token) {
      state.token = token
    },
    RESET_STATE (state) {
      Object.assign(state, getDefaultState())
    },
    USERCHANNELS (state, value) {
      state.UserChannels = value
    },
    SET_NAME (state, name) {
      state.name = name
    },
    SET_PHOTO (state, photo) {
      state.photo = photo
    },
    USERDATA (state, user) {
      state.user = user
    },
    SET_REFRESHTOKEN (state, refresh_token) {
      state.refresh_token = refresh_token
    }

  },
  actions: {
    // 登入用户
    async GetLoginData ({ commit }, data) {
      const result = await api.user.SetLogin(data)
      if (result.status === 201) {
        commit('SET_TOKEN', result.data.data.token)
        commit('SET_REFRESHTOKEN', result.data.data.refresh_token)
        SetToken('geek-itheima', result.data.data.token)
        SetToken('refresh_token', result.data.data.refresh_token)
        return 'ok'
      }
    },
    // 清除token
    ResetToken ({ commit }) {
      // 返回一个premise 成功的回调。
      return new Promise((resolve) => {
        ClearToken() // must remove  token  first
        commit('RESET_STATE')
        resolve()
      })
    },
    // 获取用户的频道
    async GetChannelsData ({ commit }) {
      const result = await api.user.GetUserChannels()
      if (result.status === 200) {
        commit('USERCHANNELS', result.data.data.channels)
      }
    },
    // 对文章不喜欢
    async SendArticleNoLike ({ commit }, target) {
      const result = await api.user.articleNoLike(target)
      if (result.status === 201) {
        return Promise.resolve()
      }
    },
    // 获取用户信息
    async GetUserInfoData ({ commit }) {
      const result = await api.user.GetUserInfo()
      if (result.status === 200) {
        commit('SET_NAME', result.data.data.name)
        commit('SET_PHOTO', result.data.data.photo)
        commit('USERDATA', result.data.data)
        return Promise.resolve()
      } else {
        return Promise.reject(new Error('登入过期'))
      }
    },
    // 举报文章
    async SendReportArticle ({ commit }, { target, type }) {
      const result = await api.user.ReportArticle(target, type)
      console.log(result)
    },
    // 退出登入
    logout ({ commit }) {
      // 清除token
      ClearToken()
      // 重置路由
      resetRouter()
      // 清除user 信息
      commit('RESET_STATE')
      // 返回一个成功的回调
      return Promise.resolve()
    }

  }
}
