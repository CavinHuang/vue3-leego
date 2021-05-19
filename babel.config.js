module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'import',
      {
        libraryName: 'element-plus',
        customStyleName: (name) => {
          console.log('chunk', name)
          name = name.slice(3)
          return `element-plus/packages/theme-chalk/src/${name}.scss`
        }
      }
    ]
  ]
}
