<template>
  <div>
    <!-- 因为这里定位在顶部了，定位就没有占用空间需要给他加padding 给他挤下来 -->
    <van-nav-bar fixed>
      <template #right>
        <!-- 因为是在移动端所以size必须换成rem -->
        <van-icon name="search" size="0.48rem" color="#fff" />
      </template>
      <template #left>
        <van-icon name="wap-home" size="0.48rem" color="#fff" />
      </template>
    </van-nav-bar>
    <div class="main">
      <van-tabs animated sticky offset-top='47.80' v-model="ChannelsId" >
        <van-tab
          v-for="Channels in UserChannels"
          :title="Channels.name"
          :key="Channels.id"
          :name="Channels.id"
        >
          <TabItems :ChannelsId='ChannelsId' />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TabItems from './TabIitems'
export default {
  name: 'Home',
  data () {
    return {
      ChannelsId: '0'
    }
  },
  created () {
    this.GetUserChannels()
  },
  methods: {
    // 获取用户标签信息
    async GetUserChannels () {
      await this.$store.dispatch('user/GetChannelsData')
    }
  },
  computed: {
    ...mapState('user', ['UserChannels'])
  },
  components: { TabItems }
}
</script>

<style lang="less" scoped>
.main {
  padding-top: 47.83px;
}
</style>
