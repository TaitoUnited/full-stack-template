const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// NOTE: for flow
// const FlowWebpackPlugin = require('flow-webpack-plugin');

module.exports = {
  resolve: {
    alias: {
      '~common': resolve(__dirname, '../src/common'),
      '~controls': resolve(__dirname, '../src/common/controls'),
      '~infra': resolve(__dirname, '../src/common/infra'),
      '~layout': resolve(__dirname, '../src/common/layout'),
      '~utils': resolve(__dirname, '../src/common/utils'),
    },
    modules: [ resolve('.'), 'node_modules' ],
    extensions: ['.json', '.mjs', '.jsx', '.js']
  },

  // context: resolve(__dirname, '.'),
  // node: { __filename: true },

  entry: [ './index.js' ],

  // When webpack bundles your application, the bundled file(s) need to be saved
  // somewhere. Settings under `output` affect this.
  output: {
    path: resolve(__dirname, '../../build'),
    filename: '[chunkhash].[name].js',
    publicPath: '/admin/'
  },

  plugins: [
    // NOTE: for flow
    // new FlowWebpackPlugin(),

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

        // NOTE: for sass
        // sassLoader: { // define options here => sass-loader requires context
        //   includePaths: [resolve(__dirname, './src', './assets')]
        // },

        context: '/'
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        use: ['eslint-loader'],
        exclude: /node_modules/,
        enforce: 'pre'
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },

      // NOTE: for json
      {
        test: /\.json$/,
        use: ['json-loader'],
        exclude: /node_modules/
      },

      // NOTE: for binary assets
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        use: ['file-loader'],
        exclude: /node_modules/
      },

      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',

          // NOTE: for css-modules
          'css-loader', // 'css-loader?modules',

          // NOTE: for sass
          // 'sass-loader'
        ]
      }
    ]
  }
};
