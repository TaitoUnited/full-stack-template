const { resolve } = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const base = require('./webpack.base.js');

const PORT = 8080;
const PUBLIC_PORT = 9999;

module.exports = merge.strategy({
  entry: 'prepend',
})(base, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: resolve(__dirname, '../assets'),
    publicPath: '/',
    inline: true,
    historyApiFallback: true,
    hot: true,
    port: PORT,
    host: '0.0.0.0',
    stats: 'minimal',
    watchOptions: {
      poll: 1000
    },
    proxy: {
      '/api/*': {
        target: `http://server:${PUBLIC_PORT}`,
        pathRewrite: {
          '/api' : ''
        }
      },
      '/socket.io/*': {
        target: `http://server:${PUBLIC_PORT}`,
        ws: true
      },
    }
  },
  output: {
    filename: 'app.js' // no need to add the hash in dev
  },
  entry: [
    '@babel/polyfill',
    'react-hot-loader/patch',
    'webpack/hot/only-dev-server',
    'react',
    'react-dom'
  ],
  optimization: {
    namedModules: true
  },
  plugins: [
    new webpack.DefinePlugin({
      // TODO remove obsolete definitions
      'process.env.DEBUG': true,
      'process.env.API_ROOT': JSON.stringify(process.env.API_ROOT),
      'process.env.API_URL': JSON.stringify(process.env.API_URL),
      'process.env.BUILD_VERSION': JSON.stringify(process.env.BUILD_VERSION),
      'process.env.BUILD_IMAGE_TAG': JSON.stringify(process.env.BUILD_IMAGE_TAG),
      'process.env.APP_SENTRY_PUBLIC_DSN': JSON.stringify(process.env.APP_SENTRY_PUBLIC_DSN),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DEVTOOLS__: true  // <-------- DISABLE redux-devtools HERE
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
});
