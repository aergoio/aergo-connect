const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.[tj]s'],
  addons: [
    '@storybook/addon-knobs',
    '@storybook/addon-backgrounds',
    '@storybook/preset-scss',
    {
      name: '@storybook/preset-typescript',
      options: {
        tsLoaderOptions: {
          configFile: path.resolve(__dirname, '../tsconfig.json'),
        },
      },
    }
  ],
  /*
  webpackFinal: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['vue-svg-loader'],
    });
    return config;
  },*/
};