<template>
  <div>
    <div class="home_container">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
      <!-- <router-view></router-view> -->
    </div>

    <div>
      <van-tabbar v-model="active" route>
        <van-tabbar-item icon="home-o" :to="{name:'Home'}">首页</van-tabbar-item>
        <van-tabbar-item icon="setting-o" :to="{name:'User'}">我的</van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  data () {
    return {
      active: 0
    }
  }

}
</script>

<style lang="less" scoped>
/* 内容底部内边距(把内容往上挤压, 防止内部被底部导航挡住) */
.home_container {
  padding-bottom: 50px;
}
/* 底部导航上边框 */
.van-tabbar {
  border-top: 1px solid #f8f8f8;
}
</style>
