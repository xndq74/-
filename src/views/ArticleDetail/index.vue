<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar
      fixed
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 文章信息区域 -->
    <div class="article-container">
      <!-- 文章标题 -->
      <h1 class="art-title">{{ DetailData.title }}</h1>

      <!-- 用户信息 -->
      <van-cell
        center
        :title="DetailData.aut_name"
        :label="timeAgo(DetailData.pubdate)"
      >
        <template #icon>
          <img :src="DetailData.aut_photo" alt="" class="avatar" />
        </template>
        <template #default>
          <div>
            <van-button
              type="info"
              size="mini"
              v-if="DetailData.is_followed"
              @click="FocusOn"
              >已关注</van-button
            >
            <van-button
              icon="plus"
              type="info"
              size="mini"
              plain
              v-else
              @click="FocusOn"
              >关注</van-button
            >
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content" v-html="DetailData.content"></div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞 -->
      <div class="like-box">
        <van-button
          icon="good-job"
          type="danger"
          size="small"
          v-if="DetailData.attitude === 1"
          @click="GiveLike"
          >已点赞</van-button
        >
        <van-button
          icon="good-job-o"
          type="danger"
          plain
          size="small"
          v-else
          @click="GiveLike"
          >点赞</van-button
        >
      </div>
    </div>
    <CommentList />
  </div>
</template>

<script>
import api from '@/api'
import CommentList from '@/views/ArticleDetail/CommentList'
import { Notify } from 'vant'
import { timeAgo } from '@/utils/data'
export default {
  name: 'ArticleDetail',
  data () {
    return {
      DetailData: {},
      timeAgo: timeAgo
    }
  },
  created () {
    this.GetDetailData()
  },
  components: { CommentList },
  methods: {
    // 获取详情页
    async GetDetailData () {
      const result = await api.user.GetDetail(this.$route.params.art_id)
      if (result.status === 200) {
        this.DetailData = result.data.data
      }
    },
    // 关注和取消关注
    async FocusOn () {
      this.DetailData.is_followed = !this.DetailData.is_followed
      const { aut_id } = this.DetailData
      if (this.DetailData.is_followed) {
        const result = await api.user.SetFocusOn({ target: aut_id })
        if (result.status === 201) {
          Notify({ type: 'success', message: '关注成功' })
        } else {
          Notify({ type: 'warning', message: '失败' })
        }
      } else {
        const result = await api.user.SetCancelFocusOn({ target: aut_id })
        if (result.status === 204) {
          Notify({ type: 'success', message: '取消关注成功' })
        } else {
          Notify({ type: 'warning', message: '失败' })
        }
      }
    },
    // 对文章点赞和取消
    async GiveLike () {
      const { art_id } = this.DetailData
      if (this.DetailData.attitude === 1) {
        const result = await api.user.SetCancelGiveLike({ target: art_id })
        if (result.status === 204) {
          this.DetailData.attitude = -1
          Notify({ type: 'success', message: '取消点赞' })
        } else {
          Notify({ type: 'warning', message: '失败' })
        }
      } else {
        const result = await api.user.SetGiveLike({ target: art_id })
        if (result.status === 201) {
          this.DetailData.attitude = 1
          Notify({ type: 'success', message: '点赞成功' })
        } else {
          Notify({ type: 'warning', message: '失败' })
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
  /deep/ img {
    width: 100%;
  }
  /deep/ pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}
</style>
