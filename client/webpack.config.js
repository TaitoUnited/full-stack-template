/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // prettier-ignore
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const y = new Date().getFullYear();
const COPYRIGHT = 'Copyright ' + y + ' Taito United Oy - All rights reserved.';
const OUTPUT_DIR = '../../build';
const BASE_PATH = process.env.BASE_PATH || '';
const ASSETS_PATH = process.env.ASSETS_PATH || '';
const ASSETS_DOMAIN = process.env.ASSETS_DOMAIN || '';
const DEV_PORT = process.env.DEV_PORT || '3000';
const DEV_BINDADDR = process.env.DEV_BINDADDR || '127.0.0.1';
const ASSETS_DIR = 'assets';
const ICON_DIR = ASSETS_DIR + '/icon.png';

// TODO: DOCKER_HOST contains the host ip? Use it instead of the hard coded ip
const PUBLIC_HOST = process.env.DOCKER_HOST ? '192.168.99.100' : 'localhost';
const PUBLIC_PORT = process.env.COMMON_PUBLIC_PORT || DEV_PORT;

module.exports = function (env, options) {
  const isProd = options.mode !== 'development';
  const analyzeBundle = isProd && process.env.ANALYZE_BUNDLE === 'true';

  console.log(`> Bundling for ${isProd ? 'production' : 'development'}...`);

  return {
    mode: isProd ? 'production' : 'development',

    devtool: isProd ? 'source-map' : 'eval-cheap-source-map',

    entry: ['src/index'],

    output: {
      // Use [contenthash] for better caching support
      filename: isProd ? '[name].[contenthash].js' : '[name].bundle.js',
      path: path.resolve(__dirname, OUTPUT_DIR),
      publicPath: `${ASSETS_PATH}/`,
      pathinfo: false,
    },

    resolve: {
      modules: [path.resolve('.'), 'node_modules'],
      extensions: ['.json', '.mjs', '.jsx', '.js', '.ts', '.tsx'],
      // Add aliases here and remember to update tsconfig.json "paths" too
      alias: {
        '~constants': path.resolve(__dirname, 'src/constants'),
        '~services': path.resolve(__dirname, 'src/services'),
        '~shared': path.resolve(__dirname, 'shared'),
        '~graphql': path.resolve(__dirname, 'src/graphql/index'),
        '~uikit': path.resolve(__dirname, 'src/components/uikit/index'),
        '~components': path.resolve(__dirname, 'src/components'),
        '~utils': path.resolve(__dirname, 'src/utils'),
      },
    },

    plugins: [
      new CleanWebpackPlugin(),

      // No need to type check when analyzing the JS bundle
      // NOTE: if type checking fails -> the build will fail
      !analyzeBundle && new ForkTsCheckerWebpackPlugin(),

      new HtmlWebpackPlugin({
        title: 'full-stack-template',
        version: process.env.BUILD_VERSION,
        imageTag: process.env.BUILD_IMAGE_TAG,
        template: './src/index.html',
        basePath: BASE_PATH,
        assetsDomain: ASSETS_DOMAIN,
        inject: 'body',
      }),

      // Extract imported CSS into separate file for caching
      isProd &&
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash].css',
        }),

      // This plugin causes a bunch of vulnerability issues
      // See: https://github.com/itgalaxy/favicons/issues/322
      isProd &&
        new FaviconsWebpackPlugin({
          logo: path.resolve(__dirname, ICON_DIR),
          cache: true, // Make builds faster
          prefix: 'assets/', // Where to put pwa icons, manifests, etc.
          favicons: {
            appName: 'full-stack-template',
            appShortName: 'Taito app',
            appDescription: 'Taito template app',
            developerName: 'Taito United',
            developerURL: 'https://github.com/TaitoUnited',
            background: '#ffffff',
            theme_color: '#15994C',
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

      // Enable HMR + Fast Refresh for development
      !isProd && new webpack.HotModuleReplacementPlugin(),
      !isProd && new ReactRefreshWebpackPlugin(),

      isProd && new LodashModuleReplacementPlugin(),

      analyzeBundle && new BundleAnalyzerPlugin(),

      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.API_URL': JSON.stringify(process.env.API_URL || '/api'),
        'process.env.SENTRY_PUBLIC_DSN': JSON.stringify(process.env.SENTRY_PUBLIC_DSN), // prettier-ignore
        'process.env.GA_TRACKING_ID': JSON.stringify(process.env.GA_TRACKING_ID), // prettier-ignore
      }),

      isProd && new webpack.BannerPlugin({ banner: COPYRIGHT }),

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
          test: /\.(js|tsx?)$/,
          include: path.resolve(__dirname, 'src'),
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                cacheCompression: false,
                cacheDirectory: true,
                plugins: [
                  !isProd && require.resolve('react-refresh/babel'),
                  isProd && 'lodash',
                ].filter(Boolean),
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.js$/,
          use: ['source-map-loader'],
          enforce: 'pre',
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.css$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ],
        },
      ],
    },

    ignoreWarnings: [
      /Failed to parse source map/,
      /GenerateSW has been called multiple times/,
      /and won't be precached. Configure maximumFileSizeToCacheInBytes to change this limit/,
    ],

    // Speed up development by lazily compiling dynamic imports
    experiments: isProd
      ? undefined
      : {
          lazyCompilation: {
            entries: false,
            imports: true,
          },
        },

    optimization: {
      moduleIds: 'deterministic',

      // Split runtime code into a separate chunk
      runtimeChunk: 'single',

      // Extract third-party libraries (lodash, etc.) to a separate vendor chunk
      splitChunks: isProd
        ? {
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
          }
        : false,
    },

    devServer: isProd
      ? undefined
      : {
          host: DEV_BINDADDR,
          port: DEV_PORT,
          public: `${PUBLIC_HOST}:${PUBLIC_PORT}`, // Fix HMR inside Docker container
          contentBase: [path.join(__dirname, 'assets')],
          hot: true,
          historyApiFallback: true,
          stats: 'minimal',
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
