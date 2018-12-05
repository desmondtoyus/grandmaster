const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const VENDOR_LIBS = ['classnames', 'highcharts', 'moment', 'moment-range', 'moment-timezone', 'react', 'react-dom', 'react-dropzone', 'react-highcharts', 'react-redux', 'react-router', 'react-router-dom', 'redux', 'redux-thunk', 'semantic-ui-react'];
process.env.BABEL_ENV = 'production';

module.exports = {
  entry: {
    bundle: './src/index.js',
    vendor: VENDOR_LIBS
  },
  output: {
    path: path.join(__dirname, '..', 'armada_services', 'public'),
    filename: 'js/[name].[chunkhash].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.(js|jsx)$/,
        exclude: /node_modules/
      },
      {
        use: ['style-loader', 'css-loader'],
        test: /\.css$/
      },
      {
        use: 'file-loader',
        test: /\.(ttf|eot|svg)$/
      },
      {
        use: 'url-loader',
        test: /\.(woff|woff2)$/
      },
      {
        use: ['url-loader', 'img-loader'],
        test: /\.(png|gif)$/
      },
      {
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        }),
        test: /\.scss$/
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    new HtmlWebpackPlugin({
      template: 'public/index.html'
    }),
    new ExtractTextPlugin({
      filename: 'css/style.css',
      allChunks: true
    })
  ]
};