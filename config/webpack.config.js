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
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
var HtmlWebpackInlineStylePlugin = require('html-webpack-inline-style-plugin');
// webpack.config.js
module.exports = {
  mode: 'development',
  entry: {
    // third: ['jquery', 'lodash'],
    test: "./src/js/test.js",
    index: "./src/js/index.js"
  },
  output: {
    path: path.resolve(__dirname, "../dist/assets/"), // or path: path.join(__dirname, "dist/js"),
    filename: "[name].js"
  },
  
  optimization: {
    // 在开发模式下显示chunks名，在生产环境默认不启用显示数字编号,如Asset  Size Chunks ChunkName
    /**
    namedChunks: true,
    开发模式下：
    Asset      Size       Chunks                    Chunk Names
    index.css  15.7 KiB   0       [emitted]         index
    index.js   117 KiB    0       [emitted]  [big]  index
    third.js   162 KiB    1       [emitted]  [big]  third
    index.html   279 KiB          [emitted]  [big]

    生产模式下：
    Asset      Size       Chunks                    Chunk Names
    index.css  15.7 KiB   index  [emitted]         index
    index.js   117 KiB    index  [emitted]  [big]  index
    third.js   162 KiB    third  [emitted]  [big]  third
    index.html   279 KiB          [emitted]  [big]
     */
    namedChunks: true,
    minimize: true,
    splitChunks: {
        chunks: 'all', // 表示显示块的范围，有三个可选值：initial(初始块)、async(按需加载块)、all(全部块)，默认为all;
        minChunks: 1, // 表示被引用次数，默认为1,这里要说明的是，如果chunks属性值是async时，这个minChunks:大于1是无效的
        maxAsyncRequests: 5, // 按需加载时最大并行请求数 最大的按需(异步)加载次数，默认为1；
        maxInitialRequests: 3, // 在一个入口点的并行请求的最大数量 最大的初始化加载次数，默认为1；
        name: true, // 可以是一个字符串名
        minSize: 30, // import的模块最小30K的文件将被提取到公用文件中
        cacheGroups: {
            commons: {
                test: /[\\/]node_modules[\\/]/,
                name: 'third'
            },
            default: {
                name: 'vendors',
                minChunks: 1,
                priority: -20,
                reuseExistingChunk: true
            }
        }
    },
    minimizer: [
        new UglifyJsPlugin({
            test: /\.js($|\?)/i, //
            // include: /\/js\//, //只压缩JS文件夹下的
            exclude: undefined,
            sourceMap: true, // true会在chrome浏览器中看到sourcemap
            cache: false, //'UglifyJsPluginCache', // 启用文件缓存。缓存目录的默认路径：node_module/.cache/uglifyjs-webpack-plugin
            // parallel: parallel,// 并发进行运行压缩数据,默认当是当前CUP数量-1个
            uglifyOptions: {
                ecma: 6,
                warnings: true, // 显示警告
                toplevel: false, // 启用顶级变量和函数名，并删除未使用的变量和函数
                output: {
                    ecma: 6, // 这个和babel-loader有关，如果设置了就不起作用了
                    indent_start: 0, // 缩进开始位置
                    indent_level: 4, // 缩进长度
                    beautify: false, // 美化是和 indent_statr indent_level一样的
                    comments: false, // 要不要保留注释
                    keep_quoted_props: false,
                    bracketize:true, // 总是在if、for、do、while或语句中插入括号，即使它们的主体是单个语句
                    //max_line_len: 1000 // 最大行长度
                },
                mangle: {
                    /**
                     *  原文
                        class ClassNamesss {
                            init() {}
                        }
                        const c = new ClassNamesss();
                        c.init();
                        编译后：
                        new class {
                            init() {}
                        }().init();
                     */
                    keep_classnames: false, // default:false,保持classname名不被压缩混淆
                    // 保留的
                    reserved: ['$'], //传递一组标识符，这些标识符应该被排除在处理之外。例如:["foo", "bar"].定义在[]中的变量将不会压缩
                    toplevel: false // true: 混淆顶级的变量名
                },
                compress: {
                    drop_console: false, // 删除 console.log语句
                    drop_debugger: false, //default true -- remove debugger; statements
                    ecma: 6, // 这个和babel-loader有关，如果设置了就不起作用了
                    global_defs: {
                        '@alert': 'console.log', //将全局定义的alert转换成，没有@否则它将被替换为字符串文字，
                        DEBUG: true // 这个是用程序化来处理，if (DEBUG) {console.log('debug'); } => 转义后  console.log('debug');
                    },
                    evaluate: true, // 尝试评估常量表达式,编译后会把变量自动计算 如：var num = 100;console.log(num * 2); -> console.log(200);
                    hoist_props: true, //  For example: var o={p:1, q:2}; f(o.p, o.q); is converted to f(1, 2);
                    hoist_funs: false, // (default: false) -- 函数提升
                    join_vars: true, // 连续加入var语句,把多个var声明的变量合并成一个
                    properties: true, // default: true;用点符号重写属性访问，例如foo['bar'] => foo.bar
                    toplevel: false, //
                    // top_retain: true,  // @TODO
                    unused: true, // default: true; 删除未引用的函数和变量
                    keep_fnames: false // default:false; 保持function名不被压缩混淆
                }
            },
            extractComments: {
                // 提取注释
                // condition: function(node, comments) {// 按条件匹配，
                //     console.log(node);
                //     console.log(comments);
                //     return true;
                // },
                filename: 'comment.LICENSE', // filename和banner一起使用
                banner: ''
            }, // 把注释放到一起，代码放到一起
            warningsFilter() {
                // 警告过滤
                return false;
            }
        }),
        // CSS压缩
        new OptimizeCSSAssetsPlugin({
            assetNameRegExp: /\.css/g, // 路径是相对于dist文件夹中指定的路径
            cssProcessorOptions: {
                safe: true,
                discardComments: { removeAll: false }
            }
        })
    ]
  },
  // 新添加的module属性
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
            loaders: {
                js: 'babel-loader'
            },
            transformToRequire: {
                video: ['src', 'poster'],
                source: 'src',
                img: 'src',
                image: 'xlink:href'
            }
        }
      },
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
      "vue": 'vue/dist/vue.js',
      '@': path.resolve(__dirname, '../src/')
    },
    // 自动解析确定的扩展
    extensions: [".js", ".json"]
  },
  externals: {
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
    maxEntrypointSize: 250000,
    //资源(asset)是从 webpack 生成的任何文件。此选项根据单个资源体积，控制 webpack 何时生成性能提示。默认值是：250000 (bytes)。
    maxAssetSize: 100000

  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new HtmlWebpackPlugin({
      title: 'My App',
     // template: './src/index.html',
      // inject: false
      // inlineSource: '.(js|scss)$' // embed all javascript and css inline
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackInlineStylePlugin()
  ]
}
