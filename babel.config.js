module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  // 自动按需引入组件 (推荐)
  plugins: [
    [
      'import',
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        // 指定样式路径
        style: (name) => `${name}/style/less`
      },
      'vant'
    ]
  ]
}
