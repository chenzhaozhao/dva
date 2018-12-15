import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
const HtmlWebpackPlugin = require('html-webpack-plugin');

export default function(webpackConfig) {
  webpackConfig.entry.vendor = [
    'core-js',
    '@babel/polyfill',
    'react',
    'react-dom',
    // 'dva',
    // 'dva/router',
    // 'dva/dynamic',
    // 'dva/fetch',
    'element-react',
    'react-intl-universal',
    'react-document-title',
    'lodash.find',
    'lodash.remove',
    'fetch-detector',
    'fetch-ie8',
    'es6-promise',
    /* 'sockjs-client', */
  ];
  webpackConfig.output.chunkFilename += ('?t=' + Date.now());
  webpackConfig.plugins.some(item => {
    if (item instanceof HtmlWebpackPlugin) {
      item.options.inject = false;
      item.options.hash = true;
      return true;
    }
    return false;
  })
  if (process.env.NODE_ENV !== 'production') {
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
  }
  return webpackConfig;
}
