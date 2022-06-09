export default {
  // 定义插件
  install (Vue) {
    // 定义全局指令
    Vue.directive('GetFocus', {
      // 指令所在元素被插入页面时
      inserted (element, binding) {
        // 自定义自定可以获取里面DOM元素 让后通过querySelector选择器选中input 来获取焦点
        element.querySelector('input').focus()
      }
    })
  }
}
