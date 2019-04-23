/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const WorkboxPlugin = require('workbox-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

// TODO: Support legacy + modern bundles:
// https://philipwalton.com/articles/deploying-es2015-code-in-production-today/

const y = new Date().getFullYear();
const COPYRIGHT = 'Copyright ' + y + ' Taito United Oy - All rights reserved.';
const OUTPUT_DIR = '../../build';
const ASSETS_DIR = 'assets';
const PWA_ICON_DIR = ASSETS_DIR + '/icon.png';
const FAVICON_DIR = ASSETS_DIR + '/icon.png';
const DEV_PORT = 8080;
const PUBLIC_PORT = 9999;

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
      publicPath: '/',
    },

    resolve: {
      modules: [path.resolve('.'), 'node_modules'],
      extensions: ['.json', '.mjs', '.jsx', '.js', '.ts', '.tsx'],
      // Add aliases here and remember to update tsconfig.json "paths" too
      alias: {
        '~common': path.resolve(__dirname, 'src/common'),
        '~theme': path.resolve(__dirname, 'src/common/theme'),
        '~styled': path.resolve(__dirname, 'src/common/styled'),
        '~ui': path.resolve(__dirname, 'src/common/ui/index'),
        '~utils': path.resolve(__dirname, 'src/common/utils'),
        '~services': path.resolve(__dirname, 'src/common/services'),
      },
    },

    plugins: [
      // No need to type check when analyzing the JS bundle
      // NOTE: if type checking fails -> the build will fail
      !analyzeBundle && new ForkTsCheckerWebpackPlugin(),

      new HtmlWebpackPlugin({
        title: 'server-template',
        version: process.env.BUILD_VERSION,
        imageTag: process.env.BUILD_IMAGE_TAG,
        template: 'index.html.template',
        inject: 'body',
      }),

      // Extract imported CSS into separate file for caching
      new MiniCssExtractPlugin({
        filename: isProd ? '[name].[contenthash].css' : '[name].css',
      }),

      // Make build faster for dev
      isProd &&
        new FaviconsWebpackPlugin({
          logo: path.resolve(__dirname, FAVICON_DIR),
          prefix: '[hash].',
          icons: {
            favicons: true, // Generate only favicons
            android: false,
            appleIcon: false,
            appleStartup: false,
            firefox: false,
          },
        }),

      // Generate manifest.json for PWA
      new WebpackPwaManifest({
        name: 'server-template',
        short_name: 'Taito',
        description: 'Taito template app',
        orientation: 'portrait',
        display: 'standalone',
        start_url: '.',
        background_color: '#ffffff',
        theme_color: '#15994C',
        inject: true,
        ios: true,
        icons: [
          {
            src: path.resolve(__dirname, PWA_ICON_DIR),
            sizes: [120, 152, 167, 180, 1024],
            ios: true,
          },
          {
            src: path.resolve(__dirname, PWA_ICON_DIR),
            size: 1024,
            ios: 'startup',
          },
          {
            src: path.resolve(__dirname, PWA_ICON_DIR),
            sizes: [36, 48, 72, 96, 144, 192, 512],
          },
        ],
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
        'process.env.GA_TRACKING_ID': JSON.stringify(
          process.env.GA_TRACKING_ID
        ),
      }),

      new webpack.BannerPlugin({ banner: COPYRIGHT }),

      // Generate a Service Worker automatically to cache generated JS files
      // NOTE: this should be the last plugin in the list!
      new WorkboxPlugin.GenerateSW({
        swDest: 'sw.js',

        clientsClaim: true,

        // NOTE: `skipWaiting` with lazy-loaded content might lead to nasty bugs
        // https://stackoverflow.com/questions/51715127/what-are-the-downsides-to-using-skipwaiting-and-clientsclaim-with-workbox
        skipWaiting: false,

        // Exclude images from the precache
        exclude: [/\.(?:png|jpg|jpeg|svg)$/],

        runtimeCaching: [
          {
            urlPattern: /\.(?:png|gif|jpg|jpeg|svg)$/,
            handler: 'CacheFirst',
          },
          {
            urlPattern: /.*(?:googleapis|gstatic)\.com/,
            handler: 'StaleWhileRevalidate',
          },
        ],
      }),
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
          // Separate sentry into it's own bundle since it is huge
          sentry: {
            test: /[\\/]node_modules[\\/](@sentry)[\\/]/,
            name: 'sentry',
            chunks: 'all',
            priority: 30,
          },

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
          public: 'localhost:' + PUBLIC_PORT, // Fix HMR inside Docker container
          hot: true,
          historyApiFallback: true,
          stats: 'minimal',
          disableHostCheck: true, // For headless cypress tests running in container
          lazy: false,
          watchOptions: {
            aggregateTimeout: 300,
            poll: 2000,
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
