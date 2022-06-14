<template>
<!-- 动态添加类名 -->
  <div :class="{'art-cmt-container-1':isCommentBoxShow,'art-cmt-container-2':!isCommentBoxShow}">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多评论了"
      @load="onLoad"
      :immediate-check='false'
      offset='10'
    >
      <div class="cmt-list" v-for="comment in commentList" :key="comment.com_id">
      <!-- 评论的 Item 项 -->
      <div class="cmt-item">
        <!-- 头部区域 -->
        <div class="cmt-header">
          <!-- 头部左侧 -->
          <div class="cmt-header-left">
            <img :src="comment.aut_photo" alt="" class="avatar" />
            <span class="uname">{{ comment.aut_name }}</span>
          </div>
          <!-- 头部右侧 -->
          <div class="cmt-header-right">
            <van-icon
              name="like"
              size="16"
              color="red"
              v-if="comment.is_liking"
              @click="ToLike(comment)"
            />
            <van-icon
              name="like-o"
              size="16"
              color="gray"
              v-else
              @click="ToLike(comment)"
            />
          </div>
        </div>
        <!-- 主体区域 -->
        <div class="cmt-body">
          {{ comment.content }}
        </div>
        <!-- 尾部区域 -->
        <div class="cmt-footer">{{ timeAgo(comment.pubdate) }}</div>
      </div>
    </div>
    </van-list>
    <!-- 评论列表 -->

    <!-- 底部添加评论区域 - 1 -->
    <div class="add-cmt-box van-hairline--top" v-if="isCommentBoxShow">
      <van-icon name="arrow-left" size="0.48rem" @click="$router.back()" />
      <div class="ipt-cmt-div" @click="isCommentBoxShow = false">发表评论</div>
      <div class="icon-box">
        <van-badge>
          <van-icon
            name="comment-o"
            size="0.53333334rem"
            :badge="totalCount === 0 ? null : totalCount"
            @click="ScrollBottom"
          />
        </van-badge>
        <van-icon name="star-o" size="0.53333334rem" />
        <van-icon name="share-o" size="0.53333334rem" />
      </div>
    </div>

    <!-- 底部添加评论区域 - 2 -->
    <div class="cmt-box van-hairline--top" v-else>
      <textarea
        placeholder="友善评论、理性发言、阳光心灵"
        v-GetFocus
        @blur="BlurTrigger"
        v-model="TextAreaValue"
      ></textarea>
      <!-- :disabled='false'  -->
      <van-button
        type="default"
        @click="ReleaseComment"
        :disabled="!TextAreaValue.length > 0"
        >发布</van-button
      >
    </div>
  </div>
</template>

<script>
import api from '@/api'
import { timeAgo } from '@/utils/data'
export default {
  name: 'CommentList',
  data () {
    return {
      commentList: [],
      timeAgo: timeAgo,
      isCommentBoxShow: true,
      TextAreaValue: '',
      totalCount: '',
      loading: false,
      finished: false,
      offset: null
    }
  },
  created () {
    this.GetCommentData()
  },
  methods: {
    // 请求评论数据
    async GetCommentData () {
      const art_id = this.$route.params.art_id
      const result = await api.user.GetComments({ source: art_id, offset: this.offset })
      console.log(result)
      if (result.status === 200) {
        this.offset = result.data.data.last_id
        this.totalCount = result.data.data.total_count
        // 如果总条数和显示条数匹配 就说明加载完毕不用在合并了this.totalCount === this.commentList.length
        if (this.offset === null) {
          this.finished = true
        } else {
          this.commentList = [...this.commentList, ...result.data.data.results]
          this.loading = false
        }

        // this.commentList = result.data.data.results
      }
    },
    // 点赞和取消点赞
    async ToLike (comment) {
      const { com_id } = comment
      if (comment.is_liking) {
        await api.user.GetCommentCancelLike({ target: com_id })
        comment.is_liking = false
      } else {
        await api.user.GetCommentLike({ target: com_id })
        comment.is_liking = true
      }
    },
    // 发布评论
    async ReleaseComment () {
      const art_id = this.$route.params.art_id
      const content = this.TextAreaValue
      if (content) {
        const result = await api.user.SetComment({ target: art_id, content })
        if (result.status === 201) {
          this.totalCount++
          this.commentList.unshift(result.data.data.new_obj)
          this.TextAreaValue = ''
        }
      }
    },
    // 鼠标失去触发
    BlurTrigger () {
      // this.$nextTick(() => {
      //   this.isCommentBoxShow = true
      // })
      // 这里只能写定时器不能nextTick
      setTimeout(() => {
        this.isCommentBoxShow = true
      })
    },
    // 评论滑动
    ScrollBottom () {
      // 该scrollIntoView()方法将调用它的元素滚动到浏览器窗口的可见区域。
      // 真实DOM都在document(所以不再一个vue文件内), 也是可以获取的
      document.querySelector('.like-box').scrollIntoView({
        behavior: 'smooth'
      })
    },
    // 下滑时触发
    onLoad () {
      if (!this.commentList.length !== 0) {
        this.GetCommentData()
      }
    }
  }
}
</script>

<style scoped lang="less">
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}

/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>
