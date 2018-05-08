const path = require('path');
const webpack = require('webpack');
// 将多CSS文件合并成一个文件
var HtmlWebpackPlugin = require('html-webpack-plugin'); // 生成html文件并且自动引用js
// 设置生成css 的路径和文件名，会自动将对应entry入口js文件中引入的CSS抽出成单独的文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const CopyWebpackPlugin = require('copy-webpack-plugin') // 复制文件

// webpack.config.js
module.exports = {
  mode: 'development',
  entry: {
    app: "./app/js/app.js",
    search: "./app/js/search.js",
    vendors: ['jquery']
  },

  output: {
    path: __dirname + "/dist/js", // or path: path.join(__dirname, "dist/js"),
    filename: "[name].js"
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: [path.join(__dirname, "dist"), path.join(__dirname, "app/")], //指定多个文件入口
    compress: true, //指定压缩
    publicPath: "/dist/", // 此路径下的打包文件可在浏览器中访问。 https://doc.webpack-china.org/configuration/dev-server
    port: 9090 //指定商品
  },
  // 新添加的module属性
  module: {
    rules: [{
        test: /.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      }, {
        //正则匹配后缀.js文件;
        test: /\.js$/,
        //需要排除的目录
        exclude: /node_modules/,
        //加载babel-loader转译es6
        use: [{
          loader: 'babel-loader',
          //配置参数,wecpack2后loader的参数都在这里配置
          options: {
            presets: ['es2015']
          }
        }],
      },
      { test: /\.(jpg|png)$/, loader: "url?limit=555" }
    ],
    noParse: [/moment-with-locales/]
  },
  resolve: {
    alias:{
      commonA: path.resolve(__dirname,'./app/js/common/a.js')
    },
    // 自动解析确定的扩展
    extensions: [".js", ".json","scss"]
  },
  externals: {
    'react': 'window.React'
  },
  optimization: {
    /*    splitChunks: {
          name: 'vendors',
          filename: 'js/[name].bundle.js', // 生成后的文件名，虽说用了[name]，但实际上就是'commons.bundle.js'了
          minChunks: 1, // 设定要有4个chunk（即4个页面）加载的js模块才会被纳入公共代码。这数目自己考虑吧，我认为3-5比较合适。
        }*/
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        }
      }
    }
  },
  /**
   * 配置如何展示性能提示。例如，如果一个资源超过 250kb，webpack 会对此输出一个警告来通知你。
   * https://doc.webpack-china.org/configuration/performance/
   * @type {Object}
   */
  performance: {
    hints: false,
    // 入口起点表示针对指定的入口，对于所有资源，要充分利用初始加载时(initial load time)期间。
    // 此选项根据入口起点的最大体积，控制 webpack 何时生成性能提示。默认值是：250000 (bytes)。
    maxEntrypointSize: 400000,
    //资源(asset)是从 webpack 生成的任何文件。此选项根据单个资源体积，控制 webpack 何时生成性能提示。默认值是：250000 (bytes)。
    maxAssetSize: 100000

  },
  plugins: [
    //把入口文件里面的数组打包成vendors.js
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new CopyWebpackPlugin([{
      from: './app/images',
      to: '../images/',
      test: /images\/(.+)\.png$/
    }], { debug: 'info' }),
    new webpack.HotModuleReplacementPlugin()

    //new webpack.optimize.splitChunks('vendors', 'vendors.js'),
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
    /*  new webpack.optimize.UglifyJsPlugin({
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
