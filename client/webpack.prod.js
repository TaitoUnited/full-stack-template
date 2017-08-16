var webpack = require('webpack');
var webpackConfig = require('./webpack.base');
var pkg = require('./package.json');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// Best for production
webpackConfig.devtool = 'cheap-module-source-map';

webpackConfig.entry = {
  main: './index.js',
  vendor: Object.keys(pkg.dependencies)
};

webpackConfig.plugins.push(
  // NOTE: include only those locales that you need!
  new webpack.ContextReplacementPlugin(/moment[\\/]locale$/, /^\.\/(fi)$/),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false,
  }),
  new webpack.DefinePlugin({
    'process.env.DEBUG': false,
    'process.env.API_ROOT': JSON.stringify(process.env.API_ROOT),
    'process.env.API_URL': JSON.stringify(process.env.API_URL),
    'process.env.BUILD_VERSION': JSON.stringify(process.env.BUILD_VERSION),
    'process.env.BUILD_IMAGE_TAG': JSON.stringify(process.env.BUILD_IMAGE_TAG),
    'process.env.COMMON_ENV': JSON.stringify(process.env.COMMON_ENV),
    'process.env.NODE_ENV': "'production'",
    __CLIENT__: true,
    __SERVER__: false,
    __DEVELOPMENT__: false,
    __DEVTOOLS__: false
  }),
  new webpack.optimize.CommonsChunkPlugin({
    names: ['vendor', 'manifest']
  }),
  new webpack.optimize.OccurrenceOrderPlugin(true),
  new webpack.optimize.UglifyJsPlugin({
    beautify: false,
    mangle: {
      screw_ie8: true,
      keep_fnames: true
    },
    compress: {
      unused: true,
      dead_code: true,
      warnings: false,
      screw_ie8: true,
      drop_console: true // no console.log / debug in prod
    },
    comments: false
  }),
  new webpack.BannerPlugin('Copyright 2017 Taito United Oy - All rights reserved.'),
  new webpack.NoEmitOnErrorsPlugin()
);

// Attach bundle analyzer
if (process.env.ANALYZE) {
  webpackConfig.plugins.push(
    new BundleAnalyzerPlugin()
  );
}

module.exports = webpackConfig;
