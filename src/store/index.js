import Vue from 'vue'
import Vuex from 'vuex'
import user from '@/store/modules/user'
// 单独封装getters后面就 不用受到命名空间的困扰
import getters from '@/store/getters'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user
  },
  getters
})
