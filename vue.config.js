/**
 * Created by miaozhendong@live.com on 2019/6/10.
 */
const path = require('path')
function resolve (dir) {
  return path.join(__dirname, '.', dir)
}

// vue.config.js 详情参考：https://cli.vuejs.org/zh/config/#vue-config-js
module.exports = {
  // 配置选项...
  publicPath: './', // 部署应用包时的根路径
  runtimeCompiler: false, // 是否使用包含运行时编译器的 Vue 构建版本。
  productionSourceMap: false, // 关闭生产环境source map，加速生产环境构建，并减少包体积
  lintOnSave: true, // 保存时 lint 代码
  // CSS配置
  css: {
    // 将组件内的 CSS 提取到一个单独的 CSS 文件 (只用在生产环境中)
    extract: process.env.NODE_ENV === 'production',
    // 是否开启 CSS source map？
    sourceMap: false,
    // 为预处理器的 loader 传递自定义选项。
    loaderOptions: {
      sass: {
        // 引入全局变量 @/ 是 src/ 的别名
        prependData: '@import "@/assets/styles/variables.scss";'
      }
    }
  },
  // 修改webpack相关配置
  chainWebpack: config => {
    // 配置文件alias
    config.resolve.alias
      .set('@assets', resolve('src/assets'))
      .set('@config', resolve('src/config'))
      .set('@components', resolve('src/components'))
      .set('@layout', resolve('src/views/layout'))
      .set('@utils', resolve('src/assets/scripts/utils'))
      .set('@scripts', resolve('src/assets/scripts'))
      .set('@styles', resolve('src/assets/styles'))
      .set('@views', resolve('src/views'))

    config.optimization.minimizer('terser').tap((args) => {
      // 去除生产环境console
      args[0].terserOptions.compress.drop_console = true
      return args
    })

    config.output.filename('[name].[hash].js').end()
    // set svg-sprite-loader
    config.module.rule('svg').exclude.add(resolve('src/assets/images/svgs')).end()
    config.module.rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/images/svgs'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },
  // 第三方插件的选项
  pluginOptions: {
    // ...
  },
  // 服务配置
  devServer: {
    proxy: {
      // 匹配代理的url标识, 请求到'/proxy_api'下的请求都会被代理到target地址中
      '/testApi': {
        target: 'https://api.apiopen.top', // api地址
        secure: false, // 接受运行在https上的服务
        pathRewrite: { '^/testApi': '' }, // 路径重写，替换代理url标识Q
        changeOrigin: true, // needed for virtual hosted sites
        ws: false // proxy websockets
      }
    }
  }
}
