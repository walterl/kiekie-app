/* global module process require __dirname */
var path = require('path'),
    webpack = require('webpack');

const isDevEnv = process.env.NODE_ENV === 'development',
    plugins = [
        new webpack.DefinePlugin({__DEVELOPMENT__: isDevEnv})
    ];

module.exports = {
    entry: ['whatwg-fetch', './www/js/index.jsx'],
    output: {
        path: 'www/build',
        filename: 'bundle.js'
    },
    devtool: 'eval',
    resolve: {
        extensions: ['.js', '.jsx', '']
    },
    module: {
        loaders: [{
            test: /\.jsx?/,
            loader: 'babel',
            include: path.join(__dirname, '/www/js'),
            query: {
                presets: [
                    require.resolve('babel-preset-es2015'),
                    require.resolve('babel-preset-react')
                ]
            }
        }, {
            test: /\.scss/,
            loaders: ['style', 'css', 'sass']
        }]
    },
    plugins: plugins
};
