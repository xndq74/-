const { defineConfig } = require('@vue/cli-service')
const path = require('path')
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
        lessOptions: {
          modifyVars: {
            // 直接覆盖变量
            // 'text-color': '#111',
            // 'border-color': '#eee',
            // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
            hack: `true; @import "${path.join(__dirname, './src/styles/cover.less')}";`
          }
        }
      }
    }
  },
  devServer: {
    proxy: {
      '/v1_0': { // 匹配所有以 '/v1_0'开头的请求路径
        target: 'http://geek.itheima.net', // 代理目标的基础路径
        changeOrigin: true
        // pathRewrite: { '^/v1_0': '' }
      }
    }
  },
  publicPath: './'

})
