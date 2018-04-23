// webpack.config.js
const slsw = require('serverless-webpack');

module.exports = {
    entry: slsw.lib.entries,
    target: 'node',
    devtool: 'source-map',
    mode: process.env.NODE_ENV || 'production'
};
