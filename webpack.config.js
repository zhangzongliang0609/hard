var path = require('path');
var webpack = require('webpack');
module.exports = {
    entry: './src/main',
    //输出位置
    output: {
        path: path.join(__dirname, './dist'), //配置输出路径，文件地址，使用绝对路径形式
        filename: '[name].js',
        publicPath: '/dist/'
    },
    devServer: {
        historyApiFallback: true,
        hot: false,
        inline: false,
        progress: true,
        port:9888,
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            },
            // 编译css并自动添加css前缀
            {
                test: /\.css$/,
                loader: 'style!css!autoprefixer'
            },
            {
                test: /\.less$/,
                loader: 'style!css!less?sourceMap'
            },
            //html模板编译？
            {
                test: /\.(html|tpl)$/,
                loader: 'html-loader'
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url?limit=300000'
            }
        ]
    },
    // .vue的配置。需要单独出来配置
    vue: {
        loaders: {
            css: 'style!css!autoprefixer'
        }
    },
    // 配置babel转化成es5的语法
    babel: {
        presets: ['es2015'],
        plugins: ['transform-runtime']
    },
    resolve: {
        extensions: ['', '.js', '.vue'],
        alias: {
            'filter': path.join(__dirname, './src/filters'),
            'components': path.join(__dirname, './src/components'),
            'jquery':path.join(__dirname, './src/assets/js/jquery'),
            'PBUiAdmin':path.join(__dirname, './src/assets/js/PB-ui.admin'),
            'iCheck':path.join(__dirname, './src/assets/js/icheck/jquery.icheck.min'),
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            // wpSiteUrl: JSON.stringify('http://192.168.104.210:8000'),
            // wpSiteUrl: JSON.stringify('http://192.168.104.220:8000'),
            // wpSiteUrl: JSON.stringify('http://192.168.105.113:8000'),
            // wpSiteUrl: JSON.stringify('http://192.168.105.75:8000'),
            // wpSiteUrl: JSON.stringify('http://192.168.105.97:8000'),
            // wpSiteUrl: JSON.stringify('http://192.168.105.198:8000'),
            // wpSiteUrl: JSON.stringify('http://192.168.105.240:8000'),
            wpSiteUrl: JSON.stringify('http://szjc-api.test.pinbayun.com'),
            // wpSiteUrl: JSON.stringify('http://test.pinbayun.com:6090'),
            // wpSiteUrl: JSON.stringify('http://test.pinbayun.com'),
            // wpSiteUrl: JSON.stringify('https://api.pinbayun.com'),
            webScoketUrl: JSON.stringify('ws://192.168.104.210:8000/notification/'),
            // wpSiteUrl: JSON.stringify('http://192.168.104.210:8500'),
            // webScoketUrl: JSON.stringify('ws://192.168.104.210:8500/notification/'),
        }),
    ]

};
