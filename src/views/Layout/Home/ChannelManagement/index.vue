<template>
  <div>
    <!-- 弹出层的头部区域 -->
    <van-nav-bar title="频道管理">
      <template #right>
        <van-icon name="cross" size="0.37333334rem" color="white" @click="ShutDown"/>
      </template>
    </van-nav-bar>
    <!-- 我的频道 -->
    <div class="my-channel-box">
      <div class="channel-title">
        <span>我的频道
          <span class="small-title">
            点击{{isCross ? '删除' : '进入'}}频道
          </span>
        </span>
        <span @click="toggleEdit">{{isCross ? '完成' : '编辑'}}</span>
      </div>
      <!-- 我的频道列表 -->
      <van-row type="flex">
        <van-col span="6" v-for="channel in UserChannels" :key="channel.id" @click="RemoveChannel(channel)">
          <div class="channel-item van-hairline--surround">
            {{channel.name}}
            <!-- 删除的徽标 -->
            <van-badge color="transparent" class="cross-badge">
              <template #content>
                <van-icon
                  name="cross"
                  class="badge-icon"
                  color="#cfcfcf"
                  size="0.32rem"
                  v-show='isCross && channel.id !== 0'
                />
              </template>
            </van-badge>
          </div>
        </van-col>
      </van-row>
    </div>

    <!-- 更多频道 -->
    <div class="more-channel-box">
      <div class="channel-title">
        <span>点击添加更多频道：</span>
      </div>
      <!-- 更多频道列表 -->
      <van-row type="flex">
        <van-col span="6" v-for="AllChannel in NotChooseChannel" :key='AllChannel.id' @click="AddUserChannel(AllChannel)">
          <div class="channel-item van-hairline--surround">{{AllChannel.name}}</div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChannelManagement',
  data () {
    return {
      isCross: false
    }
  },
  props: ['AllChannelList', 'UserChannels'],
  methods: {
    // 切换编辑按钮
    toggleEdit () {
      this.isCross = !this.isCross
    },
    // 添加用户选择列表
    AddUserChannel (row) {
      // 因为是props传入的不能直接修改需要通过emit 通知父组件修改
      this.$emit('AddUserChannelEv', row)
    },
    // 关闭编辑管理
    ShutDown () {
      this.$emit('ShutDown')
    },
    // 删除频道管理项目
    RemoveChannel (row) {
      if (this.isCross) {
        // 不能移除推荐
        if (row.id !== 0) {
          this.$emit('RemoveChannelEv', row)
        }
      } else {
        // 给组件绑定v-model说明就是给子组件绑 input 影响vlaue
        // 比如
        // <input v-model="test"/>
        // 本质上是
        // <input :value="test" @input="test = $event.target.value"/>
        // @就绑定自定义事件,所以子组件给他传input v-model能接受 让后改变父组件的值实现改变
        this.$emit('ShutDown')
        this.$emit('input', row.id)
      }
    }
  },
  computed: {
    // 计算出没有选择的频道
    NotChooseChannel () {
      return this.AllChannelList.filter(item => {
        const res = this.UserChannels.findIndex(UserItem => {
          // 过滤不能直接拿对象来比较 发现他们类型不匹配，拿他身上的值来作比较
          return item.id === UserItem.id
        })
        if (res === -1) {
          return true
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.van-popup,
.popup-container {
  background-color: transparent;
  height: 100%;
  width: 100%;
}

.popup-container {
  display: flex;
  flex-direction: column;
}

.pop-header {
  height: 90px;
  background-color: #007bff;
  color: white;
  text-align: center;
  font-size: 14px;
  position: relative;
  .title {
    width: 100%;
    position: absolute;
    bottom: 15px;
  }
}

.pop-body {
  flex: 1;
  overflow: scroll;
  padding: 8px;
  background-color: white;
}

.my-channel-box,
.more-channel-box {
  .channel-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 28px;
    padding: 0 6px;
  }
}

.channel-item {
  font-size: 12px;
  text-align: center;
  line-height: 36px;
  background-color: #fafafa;
  margin: 5px;
}

/*删除的微标 */
.cross-badge {
  position: absolute;
  right: -3px;
  top: 0;
  border: none;
}

/*提示文字 */
.small-title {
  font-size: 10px;
  color: gray;
}
</style>
