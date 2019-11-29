/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebappWebpackPlugin = require('webapp-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

const y = new Date().getFullYear();
const COPYRIGHT = 'Copyright ' + y + ' Taito United Oy - All rights reserved.';
const OUTPUT_DIR = '../../build';
const ASSETS_DIR = 'assets';
const ICON_DIR = ASSETS_DIR + '/icon.png';
const PUBLIC_PORT = process.env.COMMON_PUBLIC_PORT;
const DEV_PORT = 8080;
const DEV_POLL =
  (process.env.HOST_OS == 'macos' || process.env.HOST_OS == 'windows') &&
  !process.env.DC_COMMAND
    ? 2000
    : undefined;

module.exports = function(env, argv) {
  const isProd = !!env.production;
  const analyzeBundle = isProd && process.env.ANALYZE_BUNDLE === 'true';

  return {
    mode: isProd ? 'production' : 'development',

    devtool: isProd ? 'source-maps' : 'inline-source-map',

    entry: ['src/index'],

    output: {
      // Use [contenthash] for better caching support
      filename: isProd ? '[name].[contenthash].js' : '[name].bundle.js',
      path: path.resolve(__dirname, OUTPUT_DIR),
      publicPath: '/admin/'
    },

    resolve: {
      modules: [path.resolve('.'), 'node_modules'],
      extensions: ['.json', '.mjs', '.jsx', '.js', '.ts', '.tsx'],
      // Add aliases here and remember to update tsconfig.json "paths" too
      // alias: {
      //   '~common': path.resolve(__dirname, 'src/common'),
      // },
    },

    plugins: [
      // No need to type check when analyzing the JS bundle
      // NOTE: if type checking fails -> the build will fail
      !analyzeBundle && new ForkTsCheckerWebpackPlugin(),

      new HtmlWebpackPlugin({
        title: 'full-stack-template',
        version: process.env.BUILD_VERSION,
        imageTag: process.env.BUILD_IMAGE_TAG,
        template: 'index.html.template',
        inject: 'body',
      }),

      // Extract imported CSS into separate file for caching
      new MiniCssExtractPlugin({
        filename: isProd ? '[name].[contenthash].css' : '[name].css',
      }),

      new WebappWebpackPlugin({
        logo: path.resolve(__dirname, ICON_DIR),
        cache: true, // Make builds faster
        prefix: 'assets/', // Where to put pwa icons, manifests, etc.
        favicons: {
          appName: 'full-stack-template-admin',
          appShortName: 'Taito Admin',
          appDescription: 'Taito admin template app',
          developerName: 'Taito United',
          developerURL: 'https://github.com/TaitoUnited',
          background: '#ffffff',
          theme_color: '#0C6298',
          display: 'standalone',
          start_url: '.',
          icons: {
            // Don't include unnecessary icons
            coast: false,
            yandex: false,
            windows: false,
          },
        },
      }),

      // If you use moment add any locales you need here
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|fi/),

      // Caching -> vendor hash should stay consistent between prod builds
      isProd && new webpack.HashedModuleIdsPlugin(),

      // Enable HRM for development
      !isProd && new webpack.HotModuleReplacementPlugin(),

      analyzeBundle && new BundleAnalyzerPlugin(),

      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.API_URL': JSON.stringify(process.env.API_URL),
        'process.env.SENTRY_PUBLIC_DSN': JSON.stringify(
          process.env.SENTRY_PUBLIC_DSN
        ),
      }),

      new webpack.BannerPlugin({ banner: COPYRIGHT }),
    ].filter(Boolean),

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          enforce: 'pre',
          loader: 'eslint-loader',
          options: {
            quiet: true, // Don't report warnings
          },
        },

        {
          test: /\.(js|tsx?)$/,
          use: ['babel-loader'],
          exclude: /node_modules/,
        },

        {
          test: /\.js$/,
          use: ['source-map-loader'],
          enforce: 'pre',
        },

        {
          test: /\.(png|svg|jpg|gif)$/,
          use: ['file-loader'],
          exclude: /node_modules/,
        },

        {
          test: /\.css$/,
          use: [
            // NOTE: don't extract CSS in development
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ],
        },
      ],
    },

    optimization: {
      // Split runtime code into a separate chunk
      runtimeChunk: 'single',

      // Extract third-party libraries (lodash, etc.) to a separate vendor chunk
      splitChunks: {
        cacheGroups: {
          // Group most libs into one vendor bundle
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 20,
          },

          // TODO: not sure if this is necessary...
          // This puts eg. ui components into a separate chunk.
          // https://itnext.io/react-router-and-webpack-v4-code-splitting-using-splitchunksplugin-f0a48f110312
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'async',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      },
    },

    devServer: isProd
      ? undefined
      : {
          host: '0.0.0.0',
          port: DEV_PORT,
          publicPath: '/',
          // Fix HMR inside Docker container
          public: `localhost:${PUBLIC_PORT}/admin/sockjs-node`,
          contentBase: [
            path.join(__dirname, 'assets')
          ],
          hot: true,
          historyApiFallback: true,
          stats: 'minimal',
          lazy: false,
          watchOptions: {
            aggregateTimeout: 300,
            poll: DEV_POLL,
          },
          proxy: {
            '/api/*': {
              target: `http://server:${PUBLIC_PORT}`,
              pathRewrite: {
                '/api': '',
              },
            },
            '/socket.io/*': {
              target: `http://server:${PUBLIC_PORT}`,
              ws: true,
            },
          },
        },
  };
};
