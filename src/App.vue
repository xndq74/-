<template>
  <div>
    <keep-alive :exclude="['Search','SearchResult','ArticleDetail','UserEditor']">
      <router-view></router-view>
    </keep-alive>
    <!-- <router-view></router-view> -->
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss" scoped>
</style>
