编译webpack.DllPlugin命令

```bash
webpack --config=config.dll.js
```

webpack.DllPlugin命令配置文件
```js
const webpack = require('webpack');

const vendors = [
    'react',
    'react-dom',
    // ...其它库
];

module.exports = {
    output: {
        path: 'build',
        filename: '[name].js',
        library: '[name]',
    },
    entry: {
        "lib": vendors,
    },
    plugins: [
        new webpack.DllPlugin({
            path: 'manifest.json',
            name: '[name]',
            context: __dirname,
        }),
    ],
};

```
