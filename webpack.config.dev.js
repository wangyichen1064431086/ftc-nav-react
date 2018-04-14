const path = require('path');
const webpack = require('webpack');
const sassLoader = 'style-loader!css-loader?modules&importLoaders&localIdentName=[name]__[local]__[hash:base64:5]!sass-loader?sourceMap=true&sourceMapContents=true';
const sassLoaderDemo = 'style-loader!css-loader!sass-loader?sourceMap=true&sourceMapContents=true';
module.exports = {
  mode:'development',
  devtool: 'cheap-module-eval-source-map',//This option controls if and how source maps are generated.
  // enhance debugging by adding meta info for the browser devtools(通过为浏览器devtools添加元信息来增强调试功能)

  entry: [
    'webpack-hot-middleware/client',
      './demo/app.js'
  ],
  output: {
     // options related to how webpack emits results
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },

  module: {
    rules: [{
      test:/\.jsx?$/,//匹配.js和.jsx结尾的文件
      include: [
        path.join(__dirname, 'demo'),
        path.join(__dirname, 'src', 'js')
      ],
      loaders: ['babel-loader']//Rule.loaders is an alias to Rule.use.
    }, {
      test: /\.scss$/,
      include: [
        path.join(__dirname, 'src', 'scss'),
        //path.resolve(__dirname, 'node_modules')
      ],
      loader: sassLoader
    },{
      test: /\.scss$/,
      include: [
        path.join(__dirname, 'demo'),
        //path.resolve(__dirname, 'node_modules')
      ],
      loader: sassLoaderDemo
    }]
  },

  resolve: { 
    //Configure how modules are resolved.
    alias: {
      //Create aliases to import or require certain modules more easily. Eg: in app.js, "import React from '../node_modules/react';" can now be written as "import React from 'react"
      'react': path.join(__dirname,'node_modules','react')
    },
    extensions: [
      //Enables users to leave off the extension when importing.(省略引入文件的后缀)
      '.js', '.jsx','.scss','.css'
    ]
  },

  plugins: [
    //new webpack.NoErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
}