const path = require('path')
const helpers = require('./helpers')
const webpackConfig = require('./webpack.config.base')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const DefinePlugin = require('webpack/lib/DefinePlugin')
const env = require('../environment/dev.env')

webpackConfig.module.rules = [...webpackConfig.module.rules,
{
  test: /\.less$/,
  use: [{
    loader: 'style-loader'
  },
  {
    loader: 'css-loader'
  },
  {
    loader: 'less-loader'
  }
  ]
},
{
  test: /\.css$/,
  use: [{
    loader: 'style-loader'
  },
  {
    loader: 'css-loader'
  },
  ]
},
{
  test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
  loader: 'file-loader'
}
]

webpackConfig.plugins = [...webpackConfig.plugins,
new HtmlWebpackPlugin({
  inject: true,
  template: helpers.root('/src/index.html'),
  // favicon: helpers.root('/src/favicon.ico')
}),
new DefinePlugin({
  'process.env': env
})
]

webpackConfig.devServer = {
  port: 8080,
  host: 'localhost',
  historyApiFallback: {
    rewrites: [{
      from: /.*/,
      to: path.posix.join('/', 'index.html')
    },],
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  contentBase: './src',
  open: true,
  proxy: {
    //匹配代理的url
    '/api': {
      // 目标服务器地址
      target:'https://cstj.olcourt.cn/api',
      // target: 'http://120.78.223.114:8688',
    //   target: 'http://47.105.189.44:8780',
      //路径重写
      pathRewrite: {
        '^/api': ''
      },
      ws: true,
      changeOrigin: true
    },
    '/ws': {
      // target: 'http://120.78.223.114:8688/voice/ws.jhtml',
      target: 'https://cstj.olcourt.cn/api',
      changeOrigin: true,
      ws: true
    }
  }
}

module.exports = webpackConfig
