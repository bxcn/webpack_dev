const webpack = require('webpack');
const path = require('path');
// 将多CSS文件合并成一个文件
const CopyWebpackPlugin = require('copy-webpack-plugin') // 复制文件

module.exports = {
  mode: 'production',
  entry: {
    vendors: ['jquery']
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: './src/view',
        to: './',
        test: /\/(.+)\.html$/
      },
      {
        from: './src/view',
        to: path.resolve(__dirname, '../../yizhao-pc/web/'),
        test: /\/(.+)\.html$/
      },
      {
        from: './dist/',
        to: path.resolve(__dirname, '../../yizhao-pc/web/'),
        test: /(.+)\.(html|js|css|svg|png|gif)$/
      }
    ], { debug: 'info' }),

  ]
}
