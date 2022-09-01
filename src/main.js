import Vue from 'vue'
import '@/utils/noConsole'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'
// 设置好了路由规则 要在mian.js中引入
import '@/permission' // permission control
// 引入自定义插件
import plugins from '@/utils/plugins'
// 映入api让后挂在到prototype上
import Api from '@/api'
// 代码高亮的样式
import 'highlight.js/styles/default.css'
// 映入了vantUi中的导航栏
import './VueComponent'
Vue.use(plugins)

Vue.config.productionTip = false

new Vue({
  // 安装全局api
  beforeCreate () {
    Vue.prototype.$Api = Api
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app')
