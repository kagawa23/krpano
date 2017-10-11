var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var srcDir = path.resolve(process.cwd(), '.');

//获取多页面的每个入口文件，用于配置中的entry
function getEntry() {
    var jsPath = path.resolve(srcDir, 'js');
    var dirs = fs.readdirSync(jsPath);
    var matchs = [],
        files = {};
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.js$/);
        console.log(matchs);
        if (matchs) {
            files[matchs[1]] = path.resolve(srcDir, 'js', item);
        }
    });
    console.log(JSON.stringify(files));
    return files;
}

module.exports = {
    cache: true,
    devtool: "#source-map",
    entry: getEntry(),
    output: {
        path: path.join(__dirname, "dist/js/"),
        publicPath: "dist/js/",
        filename: "[name].js",
        chunkFilename: "[chunkhash].js"
    },
    resolve: {
        alias: {
            jquery: srcDir + "/js/lib/jquery.min.js",
            core: srcDir + "/js/core",
            ui: srcDir + "/js/ui"
        }
    },

    module: {
        loaders: [{
            test: /\.js[x]?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                compact: false
            }
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader?-convertValues')
        }, {
            test: /\.less$/,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader?-convertValues!less-loader')
        }, {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader?-convertValues!sass-loader')
        }, {
            test: /\.html/,
            loader: "html-loader"
        }]
    },
    plugins: [
        new CommonsChunkPlugin('common'),
        new ExtractTextPlugin("styles.css")
    ]
};