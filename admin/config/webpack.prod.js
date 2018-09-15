const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const base = require('./webpack.base.js');

const copyright = 'Copyright 2018 Taito United Oy - All rights reserved.';

module.exports = merge(base, {
  mode: 'production',
  optimization: {
    // TODO was: noEmitOnErrors: true,
    minimizer: [
      new UglifyJSPlugin({
        sourceMap: true,
        uglifyOptions: {
          compress: {
            inline: false
          }
        }
      })
    ],
    runtimeChunk: false,
    // TODO was: splitChunks names: ['vendor', 'manifest']
    splitChunks: {
      cacheGroups: {
        default: false,
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor_app',
          chunks: 'all',
          minChunks: 2
        }
      }
    }
  },
  plugins: [
    // NOTE: for moment (include only those locales that you need!)
    // new webpack.ContextReplacementPlugin(/moment[\\/]locale$/, /^\.\/(fi)$/),

    new webpack.DefinePlugin({
      // TODO remove obsolete definitions
      'process.env.DEBUG': false,
      'process.env.API_ROOT': JSON.stringify(process.env.API_ROOT),
      'process.env.API_URL': JSON.stringify(process.env.API_URL),
      'process.env.BUILD_VERSION': JSON.stringify(process.env.BUILD_VERSION),
      'process.env.BUILD_IMAGE_TAG': JSON.stringify(process.env.BUILD_IMAGE_TAG),
      'process.env.APP_SENTRY_PUBLIC_DSN': JSON.stringify(process.env.APP_SENTRY_PUBLIC_DSN),
      'process.env.NODE_ENV': "'production'",
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false
    }),
    new webpack.BannerPlugin(copyright),
    ...(!process.env.ANALYZE ? [] : [
      new BundleAnalyzerPlugin()
    ])
  ]
});
