<template>
  <div>
    <!-- 因为这里定位在顶部了，定位就没有占用空间需要给他加padding 给他挤下来 -->
    <van-nav-bar fixed>
      <template #right>
        <!-- 因为是在移动端所以size必须换成rem -->
        <van-icon name="search" size="0.48rem" color="#fff" @click="toSearch" />
      </template>
      <template #left>
        <van-icon name="wap-home" size="0.48rem" color="#fff" />
      </template>
    </van-nav-bar>
    <div class="main">
      <!--
        before-change 切换标签前的回调函数，返回 false 可阻止切换，支持返回 Promise
        change 当前激活的标签改变时触发 在他切换后判断距离顶部多少给他设置上
       -->
      <van-tabs
        animated
        sticky
        offset-top="47.80"
        v-model="ChannelsId"
        :before-change="GetSocollY"
        @change="SetSocollTo"
      >
        <van-tab
          v-for="Channels in UserChannels"
          :title="Channels.name"
          :key="Channels.id"
          :name="Channels.id"
        >
          <TabItems :ChannelsId="ChannelsId" />
        </van-tab>
      </van-tabs>
      <van-icon
        name="plus"
        size="0.37333334rem"
        class="moreChannels"
        @click="showPopup"
        set-contarner="body"
      />
    </div>
    <van-popup v-model="PopupShow" class="PopupSize"
      ><ChannelManagement
        :UserChannels="UserChannels"
        :AllChannelList="AllChannelList"
        @AddUserChannelEv="AddUserChannelFn"
        @RemoveChannelEv="RemoveChannelFn"
        v-model="ChannelsId"
        @ShutDown="PopupShow = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TabItems from './TabIitems'
import ChannelManagement from './ChannelManagement'
import api from '@/api'
export default {
  name: 'Home',
  data () {
    return {
      ChannelsId: '0',
      PopupShow: false,
      AllChannelList: [],
      // 每个tabs距离顶部的距离存储的地方
      scrollYs: {}
    }
  },
  created () {
    this.GetUserChannels()
    this.GetAllChannel()
  },
  methods: {
    // 获取用户标签信息
    async GetUserChannels () {
      await this.$store.dispatch('user/GetChannelsData')
    },
    // 显示遮罩层 给用户添加列表的
    showPopup () {
      this.PopupShow = true
    },
    // 获取全部列表数据
    async GetAllChannel () {
      const result = await api.user.GetAllChannels()
      if (result.status === 200) {
        this.AllChannelList = result.data.data.channels
      }
    },
    // 添加用户选择列表
    async AddUserChannelFn (channel) {
      this.UserChannels.push(channel)
      const res = this.UserChannels.map((item, index) => {
        return {
          id: item.id,
          seq: index
        }
      })
      await api.user.SetUserChannels({ channels: res })
    },
    // 删除用户列表数据项
    async RemoveChannelFn (channel) {
      const res = this.UserChannels.findIndex((item) => item === channel)
      this.UserChannels.splice(res, 1)
      await api.user.DeleteUserChannels(channel.id)
    },
    // 跳转到搜索路由
    toSearch () {
      this.$router.push({
        path: '/search'
      })
    },
    // 切换tabs那到页面的位置存到data数据中
    GetSocollY () {
      this.scrollYs[this.ChannelsId] = window.scrollY
      // 返回值为true 才能切换
      return true
    },
    // 路由切换后先判断给scrollTo设置值
    SetSocollTo () {
      // 切换回来后 给页面设置距离 如果没有写入值就返回一个0
      // 因为切换出去的时候，页面的高度为0 如果一切换进来就改变页面位置，就会导致无效，一个等组件加载完成后再改变位置
      this.$nextTick(() => {
        window.scrollTo(0, this.scrollYs[this.ChannelsId] || 0)
      })
    }
  },
  computed: {
    ...mapState('user', ['UserChannels'])
  },
  components: { TabItems, ChannelManagement },
  // 离开守卫：通过路由规则，离开该组件时被调用
  beforeRouteLeave (to, from, next) {
    //  离开路由的时候存储页面的位置
    this.$route.meta.top = window.scrollY
    next()
  }
}
</script>

<style lang="less" scoped>
.main {
  padding-top: 47.83px;
}
// 设置 tabs 容器的样式
/deep/ .van-tabs__wrap {
  padding-right: 30px;
  background-color: #fff;
}

// 设置小图标的样式
.moreChannels {
  position: fixed;
  top: 62px;
  right: 8px;
  z-index: 999;
}
.PopupSize {
  width: 100vw;
  height: 100vh;
}
</style>
