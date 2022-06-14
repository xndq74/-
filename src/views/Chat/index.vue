<template>
  <div class="container">
    <!-- 固定导航 -->
    <van-nav-bar
      fixed
      left-arrow
      @click-left="$router.back()"
      title="小思同学"
    ></van-nav-bar>

    <!-- 聊天主体区域 -->
    <div class="chat-list">
      <div v-for="(obj, index) in list" :key="index">
        <!-- 左侧是机器人小思 -->
        <div class="chat-item left" v-if="obj.name !== 'me'">
          <van-image
            fit="cover"
            round
            src="https://img.yzcdn.cn/vant/cat.jpeg"
          />
          <div class="chat-pao">{{ obj.msg }}</div>
        </div>

        <!-- 右侧是当前用户 -->
        <div class="chat-item right" v-else>
          <div class="chat-pao">{{ obj.msg }}</div>
          <van-image fit="cover" round :src="photo" />
        </div>
      </div>
    </div>

    <!-- 对话区域 -->
    <div class="reply-container van-hairline--top">
      <van-field placeholder="说点什么..." v-model="word">
        <template #button>
          <span style="font-size: 12px; color: #999" @click="submitDialog"
            >提交</span
          >
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { GetToken } from '@/utils/token'
// 导入 socket.io-client 包
import { io } from 'socket.io-client'
export default {
  name: 'Chat',
  data () {
    return {
      word: '',
      // 所有的聊天消息
      list: [
        // 只根据 name 属性，即可判断出这个消息应该渲染到左侧还是右侧
        { name: 'xs', msg: 'hi，你好！我是小思' },
        { name: 'me', msg: '我是编程小王子' }
      ],
      // 定义变量，存储 websocket 实例
      socket: null
    }
  },
  created () {
    this.CreateSocket()
  },
  methods: {
    // 创建客户端 websocket 的实例
    CreateSocket () {
      // 固定写法可以直接复制
      this.socket = io('http://geek.itheima.net', {
        query: {
          token: GetToken()
        },
        transports: ['websocket']
      })
      // 建立连接的事件
      this.socket.on('connect', () => {
        console.log('与服务器建立了连接')
      })

      // 监听服务器返回的数据
      this.socket.on('message', data => {
      // 把服务器发送过来的消息，存储到 list 数组中
        this.list.push({
          name: 'xs',
          msg: data.msg
        })
      })
    },
    submitDialog () {
      if (this.word.trim().length === 0) return
      this.list.push({
        name: 'me',
        msg: this.word
      })
      // 利用emit发送到message 中
      this.socket.emit('message', {
        msg: this.word,
        timestamp: new Date().getTime()
      })
      this.word = ''
    }

  },
  computed: {
    ...mapState('user', ['photo'])
  },
  watch: {
    // 利用监听事件来获取滚动
    list () {
      this.$nextTick(() => {
        document.querySelector('.chat-list>div:last-child').scrollIntoView({
          behavior: 'smooth'
        })
      })
    }
  },
  // 组件被销毁之前，清空 sock 对象
  beforeDestroy () {
    // 关闭连接
    this.socket.close()
    // 销毁 websocket 实例对象
    this.socket = null
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before {
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
