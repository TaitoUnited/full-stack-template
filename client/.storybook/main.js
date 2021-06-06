const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storybook-dark-mode',
  ],
  core: {
    builder: 'webpack5',
  },
  typescript: {
    // See issue: https://github.com/styleguidist/react-docgen-typescript/issues/356
    reactDocgen: 'none',
  },
  webpackFinal: config => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '~constants': path.resolve(__dirname, '../src/constants'),
      '~services': path.resolve(__dirname, '../src/services'),
      '~shared': path.resolve(__dirname, '../shared'),
      '~graphql': path.resolve(__dirname, '../src/graphql/index'),
      '~uikit': path.resolve(__dirname, '../src/components/uikit/index'),
      '~components': path.resolve(__dirname, '../src/components'),
      '~utils': path.resolve(__dirname, '../src/utils'),
    };

    return config;
  },
};
