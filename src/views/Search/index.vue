<template>
  <div>
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon
        name="arrow-left"
        color="white"
        size="0.48rem"
        class="goback"
        @click="$router.back()"
      />
      <!-- 搜索组件 -->
      <van-search
        placeholder="请输入搜索关键词"
        background="#007BFF"
        shape="round"
        v-GetFocus
        v-model.trim="value"
        @input="onInput"
        @search='toSearchResult(value)'
        @cancel="value = ''"
      />
    </div>
    <!-- 搜索建议列表 -->
    <div class="sugg-list" v-if='lenovoSearch.length > 0'>
      <div
        class="sugg-item"
        v-for="(data, index) in lenovoSearch"
        :key="index"
         @click="toSearchResult(data)"
        v-html="SearchTextLed(data, value)"
      ></div>
    </div>
    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="history = []" />
        </template>
      </van-cell>

      <!-- 历史列表 -->
      <div class="history-list">
        <span class="history-item" v-for="value,index in history" :key="index" @click="toSearchResult(value)">{{value}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import api from '@/api'
export default {
  name: 'Search',
  data () {
    return {
      value: '',
      lenovoSearch: [],
      history: JSON.parse(localStorage.getItem('history')) || [] // 搜索历史
    }
  },
  methods: {
    // 这是一个方法必须通过 对象.点方法调用不能直接在函数中引用
    onInput: debounce(async function () {
      if (this.value.length > 0) {
        // 请求联想数据
        const result = await api.user.GetSearchLenovo({ keyWord: this.value })
        if (result.status === 200) {
          this.lenovoSearch = result.data.data.options
        }
      } else {
        this.lenovoSearch = []
      }
    }, 500),
    // 搜索字体高亮
    SearchTextLed (DefaultText, TextLed) {
      // 我的想法是接收两个参数一个用原来的数据一个是加工后添加好高亮标签的数据。
      // 利用replace来替换 匹配项可以是正则表达式
      const reg = new RegExp(TextLed, 'ig')
      if (DefaultText) {
        return DefaultText.replace(reg, (p1) => {
          // p1 关键字匹配的值(尽量保持原样)
          // 一个用来创建新子字符串的函数，该函数的返回值将替换掉第一个参数匹配到的结果
          return `<span style='color:red;'>${p1}</span>`
        })
      }
    },
    toSearchResult (kw) {
      if (kw) {
        this.history.push(kw)
        this.$nextTick(() => {
          this.$router.push({
            path: `/searchResult/${kw}`
          })
        })
      }
    }
  },
  watch: {
    deep: true,
    history: {
      handler () {
        localStorage.setItem('history', JSON.stringify(Array.from(new Set(this.history))))
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  /*后退按钮*/
  .goback {
    padding-left: 14px;
  }
  /*搜索组件*/
  .van-search {
    flex: 1;
  }
}
/*搜索建议列表样式 */
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    // 实现省略号的三行代码
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/**搜索历史 */
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>
