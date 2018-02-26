/* eslint-disable */
var resolve = require('path').resolve;
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');
var FlowWebpackPlugin = require('flow-webpack-plugin');

/**
  * This file contains the base configuration for client side webpack.
  * The base configuration is extended by environment specific configuration
  * files.
  *
  * Note that this file is NOT run through babel transpilation before execution.
  */


var webpackConfig = {
  devtool: 'cheap-module-eval-source-map',

  // Entry point for the application: where it starts.
  entry: [
    './index.js'
  ],

  // When webpack bundles your application, the bundled file(s) need to be saved
  // somewhere. Settings under `output` affect this.
  output: {
    path: resolve(__dirname, '../../build'),
    filename: '[chunkhash].[name].js',
    publicPath: '/'
  },

  // context: resolve(__dirname, '.'),

  plugins: [
    new FlowWebpackPlugin(),
    // The HtmlWebpackPlugin plugin will generate an HTML5 file for you that
    // includes all your webpack bundles in the body using script tags.
    new HtmlWebpackPlugin({
      title: 'server-template',
      version: process.env.BUILD_VERSION,
      imageTag: process.env.BUILD_IMAGE_TAG,
      template: 'index.html.template',
      inject: 'body',
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: function () {
          return [autoprefixer];
        }
      }
    })
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['eslint-loader'],
        exclude: /node_modules/,
        enforce: 'pre'
      },
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        use: ['json-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        use: ['file-loader'],
        exclude: /node_modules/
      }
    ]
  },

  resolve: {
    modules: [resolve('.'), 'node_modules'],
    descriptionFiles: ['package.json'],
    mainFiles: ['index.prod', 'index'],
    extensions: ['.json', '.jsx', '.js'],
    alias: {
      '~common': resolve(__dirname, '../app/common'),
      '~infra': resolve(__dirname, '../app/common/infra'),
      '~layout': resolve(__dirname, '../app/common/layout'),
      '~utils': resolve(__dirname, '../app/common/utils'),
    }
  }
}

module.exports = webpackConfig;
