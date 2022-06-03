import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'
// 映入了vantUi中的导航栏
import { NavBar, Form, Field, Button, Tabbar, TabbarItem, Icon, Tab, Tabs, Cell, CellGroup, List, PullRefresh, ActionSheet } from 'vant'
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
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
