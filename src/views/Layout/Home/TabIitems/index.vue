<template>
  <!-- 一条文章单元格 -->
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <!-- 当组件滚动到底部时 会触发 load 事件并将 loading 设置成 true -->
      <!--
      immediate-check 是否在初始化时立即执行滚动位置检查
      offset  滚动条与底部距离小于 offset 时触发load事件
     -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
        offset="50"
      >
        <van-cell v-for="Articles in ArticlesList" :key="Articles.art_id">
          <!-- 标题区域的插槽 -->
          <template #title>
            <div class="title-box">
              <!-- 标题 -->
              <span>{{ Articles.title }}</span>

              <img
                v-if="Articles.cover.type === 1"
                class="thumb"
                :src="Articles.cover.images[0]"
                alt=""
              />
            </div>
          </template>
          <!-- label 区域的插槽 -->
          <template #label>
            <div class="thumb-box" v-if="Articles.cover.type > 1">
              <img
                v-for="(image, index) in Articles.cover.images"
                :key="index"
                class="thumb"
                :src="image"
                alt=""
              />
            </div>
            <div class="label-box">
              <div>
                <span>{{ Articles.name }}</span>
                <span>{{ Articles.comm_count }}评论</span>
                <span>{{ fromTime(Articles.pubdate) }}</span>
              </div>
              <!-- 反馈按钮 -->
              <van-icon name="cross" @click="show = true"  />
            </div>
          </template>
        </van-cell>
      </van-list>
    </van-pull-refresh>
    <van-action-sheet v-model="show" :actions="actions" @select="onSelect" />
  </div>
</template>

<script>
import api from '@/api'
import { timeAgo } from '@/utils/data'
export default {
  name: 'TabItems',
  props: ['ChannelsId'],
  data () {
    return {
      // 在每个list中获取数据这样数据相互独立就不会收到干扰。
      ArticlesList: [],
      // loading为false就是加载完毕
      loading: false,
      // 若数据已全部加载完毕，则直接将 finished 设置成 true
      finished: false,
      // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳 历史推荐会传给你
      timestamp: +new Date(),
      // 下拉框刷新 设置false为刷新完成，true为成功
      isLoading: false,
      // 这样是设置函数 把函数值直接给对象
      /*
        类似
        obj = {
          'fu': () => {
            retrun 'aa'
          }
        }
        调用
        obj.fu()
      */
      fromTime: timeAgo,
      // 控制动作面板显示和隐藏
      show: false,
      actions: [{ name: '选项一' }, { name: '选项二' }, { name: '选项三' }]
    }
  },
  created () {
    this.GetArticles(this.timestamp)
  },
  methods: {
    // 获取文章新闻推荐
    async GetArticles (timestamp, channel_id = '0') {
      const result = await api.user.GetArticles({
        channel_id,
        timestamp
      })
      console.log(result)
      if (result.status === 200) {
        // 这里要合并成数组 不让会出错。
        this.ArticlesList = [...this.ArticlesList, ...result.data.data.results]
        // this.ArticlesList = result.data.data.results
        this.timestamp = result.data.data.pre_timestamp
        this.loading = false
        this.isLoading = false
        if (this.timestamp === null) {
          this.finished = true
        }
      }
    },
    // 当组件滚动到底部时，会触发onLoad 发送异步请求
    onLoad () {
      this.GetArticles(this.timestamp)
    },
    // 下拉刷新的时候触发
    onRefresh () {
      this.ArticlesList = []
      this.GetArticles(+new Date())
    },
    // 点击动作面板返回
    onSelect (item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      this.show = false
    }
  }
}
</script>

<style lang="less" scoped>
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文章信息span */
.label-box span {
  margin: 0 3px;
  &:first-child {
    margin-left: 0;
  }
}

/* 图片的样式, 矩形黄金比例：0.618 */
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

/* 三图, 图片容器 */
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
