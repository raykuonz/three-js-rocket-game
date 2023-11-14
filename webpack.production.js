const { merge } = require("webpack-merge");
const common = require('./webpack.common.js');
const path = require('path');
const ThreeMinifierPlugin = require("@yushijinhun/three-minifier-webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const threeMinifider = new ThreeMinifierPlugin();

module.exports = merge(common, {
    plugins: [
        threeMinifider, // Minify three.js
        new CleanWebpackPlugin(), // Clean 'dist' folder between builds
    ],

    resolve: {
        plugins: [
            threeMinifider.resolver,
        ]
    },

    mode: 'production', // Minify the output

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[fullhash:8].js',
        sourceMapFilename: '[name].[fullhash:8].map',
        chunkFilename: '[id].[fullhash:8].js',
    },

    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }
})