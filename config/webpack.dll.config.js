const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        vendors: ['jquery']
    },
    output: {
        path: path.join(__dirname, 'dll/'),
        filename: 'dll_[name].js',
        library: "[name]_[hash]"
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, "dll", "[name]-manifest.json"),
            name: "[name]_[hash]"
        })
    ]
}