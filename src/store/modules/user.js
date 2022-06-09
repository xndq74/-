import api from '@/api'
import { GetToken, SetToken, RemoveToken } from '@/utils/token'

const getDefaultState = () => {
  return {
    token: GetToken() || [],
    UserChannels: [],
    name: ''
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
    }
  },
  actions: {
    // 登入用户
    async GetLoginData ({ commit }, data) {
      const result = await api.user.SetLogin(data)
      if (result.status === 201) {
        commit('SET_TOKEN', result.data.data.token)
        SetToken(result.data.data.token)
        return 'ok'
      }
    },
    // 清除token
    ResetToken ({ commit }) {
      // 返回一个premise 成功的回调。
      return new Promise((resolve) => {
        RemoveToken() // must remove  token  first
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
        return Promise.resolve()
      } else {
        return Promise.reject(new Error('登入过期'))
      }
    },
    // 举报文章
    async SendReportArticle ({ commit }, { target, type }) {
      const result = await api.user.ReportArticle(target, type)
      console.log(result)
    }

  }
}
