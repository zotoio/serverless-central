// webpack.config.js
const slsw = require('serverless-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: slsw.lib.entries,
    target: 'node',
    devtool: 'source-map',
    mode: process.env.NODE_ENV || 'production',
    plugins: [
        new CopyWebpackPlugin([
            {
                from: '../src/zoo.proto',
                to: './src'
            }
        ])
    ]
};
