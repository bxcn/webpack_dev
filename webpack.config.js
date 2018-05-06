const path = require('path');
const webpack = require('webpack');
// 将多CSS文件合并成一个文件
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin'); // 生成html文件并且自动引用js
let cssExtractor = new ExtractTextPlugin('app.css');



// webpack.config.js
module.exports = {
  mode: 'development',
  entry: {
    app: "./app/js/app.js"

  },

  output: {
    path: __dirname + "/dist/js", // or path: path.join(__dirname, "dist/js"),
    filename: "[name].bundle.js"
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: [path.join(__dirname, "dist"), path.join(__dirname, "app/")],//指定多个文件入口
     compress: true, //指定压缩
     publicPath: "/dist/",
      port: 9000//指定商品
  },
  // 新添加的module属性
  module: {
    rules: [
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.(jpg|png)$/, loader: "url?limit=555" },
      { test: /\.scss$/, loader: "style-loader!css-loader!sass-loader" }
    ],
    noParse: [/moment-with-locales/]
  },
  externals: {
    'react': 'window.React'
  },
  plugins: [
    /*   new HtmlWebpackPlugin({
            title: '试题录入',
            template:__dirname+'/dist/index.html', // 文件模板
            filename: __dirname + '/dist/index.html',  // 生成的文件名
        })*/
    // 增加文件头信息
    //new webpack.BannerPlugin('This file is created by zhaoda'),
    // 提取公用的文件-选择的提取公共代码
    //new webpack.optimize.CommonsChunkPlugin("commons.js"),
    //cssExtractor,
    // 压缩JS
    /*    new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          },
          //mangle 通过设置except数组来防止指定变量被改变
          mangle: {
            except: ['$super', '$', 'exports', 'require']
        }
        })*/
  ]
}
