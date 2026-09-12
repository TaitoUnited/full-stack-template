import type { StorybookConfig } from '@storybook/tanstack-react';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  framework: {
    name: '@storybook/tanstack-react',
    options: {
      builder: {
        viteConfigPath: './.storybook/vite.config.js',
      },
    },
  },
  async viteFinal(conf) {
    const { mergeConfig } = await import('vite');
    return mergeConfig(conf, {
      cacheDir: '.vite/storybook-cache',
    });
  },

  docs: {
    autodocs: 'tag',
    defaultName: 'Docs',
  },
};

export default config;
