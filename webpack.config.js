const path = require('path');                       // path module, provides utilities to work with file and directory path
const webpack = require('webpack');                 // requires webpack npm package to work
const CopyPlugin = require('copy-webpack-plugin');  // copy webpack plugin to copy assets
const HtmlWebpackPlugin = require('html-webpack-plugin');   // creates a distribution html file with the reference to the bundled js
const {CleanWebpackPlugin} = require('clean-webpack-plugin'); // Removes all files inside the output path as well as unused assets after every successful rebuild

// export configuration file that webpack is going to use
module.exports = {
    entry: './src/js/index.js',
    output: {                                       // enable hot reloading (and define output path)
        path: path.resolve(__dirname, './dist'),
        filename: 'main.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: { loader: 'babel-loader' },
                exclude: /node_modules/,            // babel: Converts newer javascript code (e.g. ES6 or higher) into backwards compatible code (ES5)
            },
            {
                test: [/\.vert$/, /\.frag$/],
                use: 'raw-loader'                   // raw-loader: allows to import code as raw strings
            }
        ]
    },
    plugins: [
        //new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            'CANVAS_RENDERER': JSON.stringify(true),    // define path variables (specific for Phaser)
            'WEBGL_RENDERER': JSON.stringify(true),
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new CopyPlugin({
            patterns: [
                {from: 'src/assets', to: 'assets' }
            ]
        }),
    ],
}
