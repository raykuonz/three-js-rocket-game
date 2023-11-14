const { merge } = require("webpack-merge");
const common = require('./webpack.common.js');
const path =  require('path');

module.exports = merge(common, {
    mode: 'development', // Don't minify the source
    devtool: 'eval-source-map', // Source map for development
    devServer: {
        static: {
            directory: path.join(__dirname, './dist'), // Serve static file
        },
        hot: true, // Reload the page when code change
    }
});