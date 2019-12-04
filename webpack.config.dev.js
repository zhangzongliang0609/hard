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
        //压缩js
        new webpack.optimize.UglifyJsPlugin({
           compress: {
               warnings: false
           }
        }),
        new webpack.DefinePlugin({
            /*内网的测试环境*/
            // wpSiteUrl: JSON.stringify('http://120.25.87.4'),
            //wpSiteUrl: JSON.stringify('http://192.168.0.109:8000'),
            //wpSiteUrl: JSON.stringify('http://mavericks0.imwork.net:11074'),
            //wpSiteUrl: JSON.stringify('http://127.0.0.1:8000'),
            // wpSiteUrl: JSON.stringify('http://192.168.104.210:8000'),
            // wpSiteUrl: JSON.stringify('http://192.168.104.75:8000'),
            // wpSiteUrl: JSON.stringify('http://192.168.105.97:8000'),
            // wpSiteUrl: JSON.stringify('http://192.168.105.154:8000'),
            wpSiteUrl: JSON.stringify('http://szjc-api.test.pinbayun.com'),
            // wpSiteUrl: JSON.stringify('http://test.pinbayun.com'),
            // wpSiteUrl: JSON.stringify('http://test.pinbayun.com:6090'),
            webScoketUrl: JSON.stringify('ws://test.pinbayun.com/notification/'),
            /*外网的正式测试环境*/
            // wpSiteUrl: JSON.stringify('http://175049f64k.51mypc.cn:20265'),
            isHttps:0
        }),
    ]
};
