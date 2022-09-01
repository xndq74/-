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
        <van-cell v-for="Articles in ArticlesList" :key="Articles.art_id" @click='toDetail(Articles.art_id)'>
          <!-- 标题区域的插槽 -->
          <template #title>
            <div class="title-box">
              <!-- 标题 -->
              <span>{{ Articles.title }}</span>

              <img
                v-if="Articles.cover.type === 1"
                class="thumb"
                v-lazy="Articles.cover.images[0]"
                error='https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180426%2F8d46d27e4f4444feb7835b38ce968430.gif&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1657865868&t=d8d69648aee7b11d1c4f481f7c5722e4'
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
                v-lazy="image"
                error='https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180426%2F8d46d27e4f4444feb7835b38ce968430.gif&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1657865868&t=d8d69648aee7b11d1c4f481f7c5722e4'
              />
            </div>
            <div class="label-box">
              <div>
                <span>{{ Articles.name }}</span>
                <span>{{ Articles.comm_count }}评论</span>
                <span>{{ fromTime(Articles.pubdate) }}</span>
              </div>
              <!-- 反馈按钮 -->
              <van-icon name="cross" @click="feedback(Articles.art_id)" v-if="false" />
            </div>
          </template>
        </van-cell>
      </van-list>
    </van-pull-refresh>
    <!-- 动作面板,不显示的原因就是被剪切掉了，要把他 挂在到body上就不受影响，get-container指定挂载点 -->
    <van-action-sheet
      v-model="show"
      :actions="actions"
      @select="onSelect"
      get-container="body"
      :cancel-text="SheetText"
      @cancel="cancelSheet"
      @closed="closedSheet"
    />
  </div>
</template>

<script>
import api from '@/api'
import { timeAgo } from '@/utils/data'
// 引入反馈面板的数据
import { firstActions, secondActions } from '@/api/reports'
import { Notify } from 'vant'
export default {
  name: 'TabItems',
  data () {
    return {
      // 在每个list中获取数据这样数据相互独立就不会收到干扰。
      ArticlesList: [],
      // 页面加载第二页
      page: 1,
      // loading为false就是加载完毕
      loading: false,
      // 若数据已全部加载完毕，则直接将 finished 设置成 true
      finished: false,
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
      actions: firstActions,
      SheetText: '取消',
      artId: undefined
    }
  },
  created () {
    this.GetArticles()
  },
  methods: {
    // 获取文章新闻推荐
    async GetArticles () {
      const result = await api.user.GetSearchResult({
        q: this.$route.params.kw,
        page: this.page++
      })
      if (result.status === 200) {
        // 这里要合并成数组 不让会出错。
        this.ArticlesList = [...this.ArticlesList, ...result.data.data.results]
        // this.ArticlesList = result.data.data.results
        this.loading = false
        this.isLoading = false
        if (this.timestamp === null) {
          this.finished = true
        }
      }
    },
    // 当组件滚动到底部时，会触发onLoad 发送异步请求
    onLoad () {
      if (!this.ArticlesList.length !== 0) {
        this.GetArticles(this.timestamp)
      }
    },
    // 下拉刷新的时候触发
    onRefresh () {
      this.ArticlesList = []
    },
    // 点击动作面板返回  点击选项时触发，禁用或加载状态下不会触发 action index 第一个是选中的对象，第二个是索引
    onSelect (item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      // this.show = false
      if (item.name === '反馈垃圾内容') {
        this.actions = secondActions
        this.SheetText = '返回'
      } else if (item.name === '不感兴趣') {
        this.$store.dispatch('user/SendArticleNoLike', { target: this.artId })
        this.show = false
        Notify({ type: 'primary', message: '反馈成功' })
      } else {
        this.$store.dispatch('user/SendReportArticle', { target: this.artId, type: item.value })
        this.show = false
        Notify({ type: 'primary', message: '反馈成功' })
      }
    },
    // 点击取消按钮动作面板的时候触发
    cancelSheet () {
      if (this.SheetText === '返回') {
        this.actions = firstActions
        this.SheetText = '取消'
        this.show = true
      }
    },
    // 关闭面试时候触发
    closedSheet () {
      this.actions = firstActions
      this.SheetText = '取消'
    },
    // 反馈按钮
    feedback (id) {
      this.show = true
      this.artId = id
    },
    // 跳转到详情页
    toDetail (id) {
      this.$router.push({
        path: `/detail/${id}`
      })
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
