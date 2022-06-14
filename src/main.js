import Vue from 'vue'
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
// 映入了vantUi中的导航栏
import {
  NavBar, Form, Field, Button, Tabbar, TabbarItem, Icon, Tab, Tabs,
  Cell, CellGroup, List, PullRefresh, ActionSheet, Popup, Row, Col,
  Badge, Search, Divider, Tag, Image, Uploader, Dialog, DatetimePicker
} from 'vant'
Vue.use(plugins)
Vue.use(Tag)
Vue.use(Uploader)
Vue.use(DatetimePicker)
Vue.use(Dialog)
Vue.use(Image)
Vue.use(Divider)
Vue.use(Row)
Vue.use(Search)
Vue.use(Col)
Vue.use(Badge)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Form)
Vue.use(Field)
Vue.use(NavBar)
Vue.use(Button)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Icon)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(List)
Vue.use(PullRefresh)
Vue.use(ActionSheet)
Vue.use(Popup)
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
