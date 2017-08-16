var webpack = require('webpack');
var webpackConfig = require('./webpack.base');
var { resolve } = require('path');

// Constants
var DEV_SERVER_PORT = 3333;

webpackConfig.plugins = (webpackConfig.plugins) ? webpackConfig.plugins : [];

webpackConfig.entry.unshift(
  'react-hot-loader/patch',
  'webpack-dev-server/client?http://localhost:' + DEV_SERVER_PORT,
  'webpack/hot/only-dev-server'
);

webpackConfig.output.filename = 'app.js'; // no need to add the hash in dev

/* NOTE:
 * Enable if we devide not to use styled-components
 * and want to use sass + css-modules instead.
 */

// webpackConfig.module.rules.push(
//   {
//     test: /\.scss$/,
//     exclude: /node_modules/,
//     use: [
//       'style-loader',
//       'css-loader?modules',
//       'postcss-loader',
//       'sass-loader'
//     ],
//   }
// );

webpackConfig.plugins.push(

  new webpack.DefinePlugin({
    'process.env.DEBUG': true,
    'process.env.API_ROOT': JSON.stringify(process.env.API_ROOT),
    'process.env.API_URL': JSON.stringify(process.env.API_URL),
    'process.env.BUILD_VERSION': JSON.stringify(process.env.BUILD_VERSION),
    'process.env.BUILD_IMAGE_TAG': JSON.stringify(process.env.BUILD_IMAGE_TAG),
    'process.env.COMMON_ENV': JSON.stringify(process.env.COMMON_ENV),
    'process.env.NODE_ENV': "'dev'",
    __CLIENT__: true,
    __SERVER__: false,
    __DEVELOPMENT__: true,
    __DEVTOOLS__: true  // <-------- DISABLE redux-devtools HERE
  }),

  /* NOTE:
   * Enable if we decide not to use styled-components
   * and want to use sass + css-modules instead.
   */

  // new webpack.LoaderOptionsPlugin({
  //   options: {
  //     sassLoader: { // define options here => sass-loader requires context
  //       includePaths: [path.resolve(__dirname, 'components', 'static')]
  //     },
  //     context: '/'
  //   }
  // }),

  new webpack.HotModuleReplacementPlugin(),
  // Enable HMR

  new webpack.NamedModulesPlugin()
  // prints more readable module names in the browser console on HMR updates
);

webpackConfig.devServer = {
  contentBase: './common/assets',
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
