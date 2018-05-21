// webpack.config.js

module.exports = {
    entry: {index: './src/index.js'},
    target: 'node',
    devtool: 'source-map',
    mode: process.env.NODE_ENV || 'production'
};
