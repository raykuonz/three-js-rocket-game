const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    plugins: [
        // Auto create an index.html with the right bundle name and references to the js
        new HtmlWebpackPlugin({
            template: './src/html/index.html',
        }),

        // Copy game assets from static dir to output
        new CopyPlugin({
            patterns: [
                {
                    from: './src/static',
                    to: 'static',
                }
            ]
        })
    ],

    // Entrypoint from game
    entry: './src/main.ts',

    module: {
        rules: [
            {
                // Load GLSL shaders in as text
                test: /\.(glsl|vs|fs|vert|frag)$/,
                exclude: /node_modules/,
                use: ['raw-loader']
            },
            {
                // Process Typescript
                test: /.tsx?$/,
                exclude: /node_modules/,
                use: 'ts-loader',
            }
        ],
    },

    resolve: {
        extensions: [
            '.tsx',
            '.ts',
            '.js'
        ]
    }

}