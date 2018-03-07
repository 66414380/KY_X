'use strict'
const path = require('path')
// 工具类，下面会用到
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
// 导出的对象，就是webpack的配置项，详情可以参考的webpack的配置说明
module.exports = {
  // 指明入口函数
  entry: {
    app: './src/main.js'
  },
  // 输出配置项
  output: {
    // 路径，从config/index读取的，值为：工程目录下的dist目录，需要的自定义的也可以去修改
    path: config.build.assetsRoot,
    filename: '[name].js',
    // 发布路径，这里是的值为/，正式生产环境可能是服务器上的一个路径,也可以自定义
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    // 当使用require或者import的时候，自动补全下面的扩展名文件的扩展名，也就是说引入的时候不需要使用扩展名
    extensions: ['.js', '.vue', '.json'],
    // 别名,在我们require的时候，可以使用这些别名，来缩短我们需要的路径的长度
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    // loader之前的配置，会对.vue,.js的文件用eslint进行编译,include是包含的文件，exclude是排除的文件，可以使用的正则
    // 这里也是相应的配置，test就是匹配文件，loader是加载器，
    // query比较特殊，当大小超过10kb的时候，会单独生成一个文件，文件名的生成规则是utils提供的方法，当小于10kb的时候，就会生成一个base64串放入js文件中
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',//注意elementUI的源码使用ES6需要解析
        include: [resolve('src'), resolve('test'),
          resolve('/node_modules/element-ui/src'),
          resolve('/node_modules/element-ui/packages')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
        include: [
          /src/,//表示在src目录下的css需要编译
          //'/node_modules/element-ui/lib/'
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader',
        options: {
          limit: 80000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.less$/,
        loader: "style-loader!css-loader!less-loader",
      }
    ]
  }
}
