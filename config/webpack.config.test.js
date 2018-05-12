'use strict'
const webpack = require('webpack');
const merge = require('webpack-merge')
const prodEnv = require('./webpack.config')
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin') // 复制文件

module.exports = merge(prodEnv, {
    devServer: {
        contentBase: [ path.join(__dirname, "../src/view/"),path.join(__dirname, "../dist/"), path.join(__dirname, "../src/")], //指定多个文件入口
        compress: true, //指定压缩
        publicPath: "/js/", // 此路径下的打包文件可在浏览器中访问。 https://doc.webpack-china.org/configuration/dev-server
        port: 9092 //指定商品
    },
    plugins: [
        new webpack.DefinePlugin({
            '__HOST__': "''"
        }),
        new CopyWebpackPlugin([{
            from: './src/images',
            to: '../images/',
            test: /images\/(.+)\.png$/
        }], { debug: 'info' }),
    ]
})




