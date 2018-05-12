const path = require('path');
const webpack = require('webpack');
// 将多CSS文件合并成一个文件
// 设置生成css 的路径和文件名，会自动将对应entry入口js文件中引入的CSS抽出成单独的文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin') // 复制文件
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// webpack.config.js
module.exports = {
  mode: 'development',
  entry: {
    index: "./src/js/view/index.js",
    vendors: ['jquery']
  },
  output: {
    path: path.resolve(__dirname, "../dist/js/"), // or path: path.join(__dirname, "dist/js"),
    filename: "[name].js"
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        },
        // 将多个css chunk合并成一个css文件：
        // styles: {            
        //   name: 'styles',
        //   test: /.scss|css$/,
        //   chunks: 'all',    // merge all the css chunk to one file
        //   enforce: true
        // }
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({})  // use OptimizeCSSAssetsPlugin
    ]
  },
  // 新添加的module属性
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          process.env.NODE_ENV == 'development' ? { loader: 'style-loader' } : MiniCssExtractPlugin.loader,
          { loader: "css-loader" },
          { loader: "sass-loader" },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')({
                  browsers: [
                    'last 4 version',
                    'ie >= 9'
                  ]
                })
              ]
            }
          }
        ]
      },
      {
        //正则匹配后缀.js文件;
        test: /\.js$/,
        //需要排除的目录
        exclude: /node_modules/,
        //加载babel-loader转译es6
        use: [
          {
            loader: 'babel-loader',
            //配置参数,wecpack2后loader的参数都在这里配置
            options: {
              presets: ['es2015']
            }
          }],
      },
      {
        test: /\.(jpg|png)$/,
        use: [
          { loader: "file-loader" },
          { loader: "url-loader?limit=555" }
        ]

      },
      { //解析 .html
        test: /\.html$/,
        loader: 'html-loader'
      }, { //解析 .tpl
        test: /\.html$/,
        loader: 'ejs-loader'
      }
    ],
    noParse: [/moment-with-locales/]
  },
  resolve: {
    alias: {
      "js/dialog": path.resolve(__dirname, './src/js/common/dialog.js')
    },
    // 自动解析确定的扩展
    extensions: [".js", ".json"]
  },
  externals: {
    'react': 'window.React'
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
    // new HtmlWebpackPlugin({
    //   template: '.src/view/[name].html',
    //   inject: true
    // }),
    //把入口文件里面的数组打包成vendors.js
    new MiniCssExtractPlugin({
      filename: "../css/[name].css",
      chunkFilename: "[id].css"
    }),

    new webpack.HotModuleReplacementPlugin(),
    new webpack.DllReferencePlugin({
      context: path.join(__dirname, "./dll"),
      manifest: require("./dll/vendors-manifest.json") // eslint-disable-line
    })
  ]
}
