import api from '@/api'
import { GetToken, SetToken, RemoveToken } from '@/utils/token'

const getDefaultState = () => {
  return {
    token: GetToken() || [],
    UserChannels: []
    // ArticlesList: {}
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
    }
    // ARTICLESDATA (state, value) {
    //   state.ArticlesList = value
    // }
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
    }
    // 获取文章新闻推荐
    // async GetArticlesData ({ commit }, data) {
    //   const result = await api.user.GetArticles(data)
    //   console.log(result)
    //   if (result.status === 200) {
    //     commit('ARTICLESDATA', result.data.data)
    //   }
    // }

  }
}
