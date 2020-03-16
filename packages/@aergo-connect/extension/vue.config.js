// eslint-disable-next-line @typescript-eslint/no-var-requires
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');

module.exports = {
  publicPath: '',
  pages: {
    'index': 'src/main.ts',
    'popup': 'src/main.ts',
    'popup-request': 'src/main.ts',
    'background': 'src/background/main.js'
  },
  chainWebpack: (config) => {
    if (process.env.NODE_ENV !== 'production') {
      config.plugin('extension-reloader').use(ChromeExtensionReloader);
    }

    // manifest.json interpolation
    config.module.rule('manifest').test(/manifest\.json$/).type('javascript/auto')
      .use('file-loader').loader('file-loader').options({ name: '[name].[ext]' }).end()
      .use('extricate-loader').loader('extricate-loader').end()
      .use('interpolate-loader').loader('interpolate-loader').end();
  
    config.module.rule('json').test(/package\.json$/).type('javascript/auto').exclude.add(/node_modules/).end();

    // Disable inlining of images
    config.module.rule('images').use('url-loader').loader('url-loader').tap(options => Object.assign(options, { limit: 1 }));

    // Add content script
    //config.entry('content-script').add('./src/content-script.js').end();
  },
}
