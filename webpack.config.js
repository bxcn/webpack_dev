//import webpack from 'webpack';
const webpack = require('webpack');

// webpack.config.js  
module.exports = {  
  entry: "./app.js",  
  output: {  
    path: "./",  
    filename:"bundle.js"  
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
      {test: /\.css$/, loader: "style!css"},
      {test: /\.(jpg|png)$/, loader: "url?limit=8192"},
      {test: /\.scss$/, loader: "style!css!sass"}
    ]
  },
  plugins: [
    new webpack.BannerPlugin('This file is created by zhaoda')
  ]
}  