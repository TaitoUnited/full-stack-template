var webpack = require('webpack');
var webpackConfig = require('./webpack.base');
var { resolve } = require('path');

// Constants
var DEV_SERVER_PORT = 3334;

webpackConfig.plugins = (webpackConfig.plugins) ? webpackConfig.plugins : [];

webpackConfig.entry.unshift(
  'babel-polyfill',
  'react-hot-loader/patch',
  'webpack/hot/only-dev-server',
  'react',
  'react-dom'
);

webpackConfig.output.filename = 'app.js'; // no need to add the hash in dev

webpackConfig.plugins.push(

  new webpack.DefinePlugin({
    'process.env.DEBUG': true,
    'process.env.API_ROOT': JSON.stringify(process.env.API_ROOT),
    'process.env.API_URL': JSON.stringify(process.env.API_URL),
    'process.env.BUILD_VERSION': JSON.stringify(process.env.BUILD_VERSION),
    'process.env.BUILD_IMAGE_TAG': JSON.stringify(process.env.BUILD_IMAGE_TAG),
    'process.env.APP_SENTRY_PUBLIC_DSN': JSON.stringify(process.env.APP_SENTRY_PUBLIC_DSN),
    'process.env.COMMON_ENV': JSON.stringify(process.env.COMMON_ENV),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    __CLIENT__: true,
    __SERVER__: false,
    __DEVELOPMENT__: true,
    __DEVTOOLS__: true  // <-------- DISABLE redux-devtools HERE
  }),

  new webpack.HotModuleReplacementPlugin(),
  // Enable HMR

  new webpack.NamedModulesPlugin()
  // prints more readable module names in the browser console on HMR updates
);

webpackConfig.devServer = {
  contentBase: './assets',
  publicPath: '/',
  inline: true,
  historyApiFallback: true,
  hot: true,
  port: DEV_SERVER_PORT,
  host: '0.0.0.0',
  stats: 'minimal',
  watchOptions: {
    poll: 1000
  },
  proxy: {
    '/api/*': {
      target: 'http://server:8080',
      pathRewrite: {
        '/api' : ''
      }
    },
    '/socket.io/*': {
      target: 'http://server:8080',
      ws: true
    },
  }
};

module.exports = webpackConfig;
