//import webpack from 'webpack';
const webpack = require('webpack');
// 将多CSS文件合并成一个文件
var ExtractTextPlugin = require("extract-text-webpack-plugin");
let cssExtractor = new ExtractTextPlugin('app.css');

// webpack.config.js  
module.exports = {  
  entry:{
    app: "./app.js",
    app1: "./app1.js"
  }, 

  output: {  
    path: "./out/",  
    filename:"[name].bundle.js"  
  },
  // 新添加的module属性
  module: {
    loaders: [
      {
        test: /\.js$/, 
        loader: "babel", 
        query: {
          presets: ['es2015']
        }
      },
      {test: /\.css$/, loader:  cssExtractor.extract(['css'])},
      {test: /\.(jpg|png)$/, loader: "url?limit=555"},
      {test: /\.scss$/, loader: "style!css!sass"}
    ]
  },
  plugins: [
    // 增加文件头信息
    new webpack.BannerPlugin('This file is created by zhaoda'),
    // 提取公用的文件-选择的提取公共代码
    new webpack.optimize.CommonsChunkPlugin("commons.js"),
    cssExtractor,
    // 压缩JS
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      //mangle 通过设置except数组来防止指定变量被改变
      mangle: {
        except: ['$super', '$', 'exports', 'require']
    }
    })
  ]
}  