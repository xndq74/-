export default {
  // 定义插件
  install (Vue) {
    // 定义全局指令
    Vue.directive('GetFocus', {
      // 指令所在元素被插入页面时
      inserted (element, binding) {
        // 自定义自定可以获取里面DOM元素 让后通过querySelector选择器选中input 来获取焦点
        // nodeName 获取标签吗 大写的
        setTimeout(() => {
          if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
            element.focus()
          } else {
            const input = element.querySelector('input')
            const textarea = element.querySelector('textarea')
            if (input) input.focus()
            if (textarea) textarea.focus()
          }
        }, 500)
      },
      update (element) { // updata 是检测每次改变的时候触发 inserted 就是插入的时候触发
        setTimeout(() => {
          if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
            element.focus()
          } else {
            const input = element.querySelector('input')
            const textarea = element.querySelector('textarea')
            if (input) input.focus()
            if (textarea) textarea.focus()
          }
        }, 500)
      }
    })
  }
}
