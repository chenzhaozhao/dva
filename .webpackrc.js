const path = require('path');
export default {
  entry: "src/index.js",

  "publicPath": "/",

  // externals: {
  //   // react: 'window.React',
  //   // 'react-dom': 'window.ReactDOM',
  //   // 'babel-polyfill': 'window.BP',
  //   // 'core-js': 'window.CJ',
  // },
    env: {
        development: {
            extraBabelPlugins: ['dva-hmr'],
        },
    },
    extraBabelPlugins: [
        // 'transform-decorators-legacy',
        // ['import', { libraryName: 'element-react', libraryDirectory: 'es', style: true }],
    ],
    // 后期 monitor、svc 等各站点共享 cdn 内的公共 js 资源
    externals: {
        '@antv/data-set': 'DataSet',
        bizcharts: 'BizCharts',
        rollbar: 'rollbar',

    },
    alias: {
        components: path.resolve(__dirname, 'src/components/'),
        layouts: path.resolve(__dirname, 'src/layouts/'),
        utils: path.resolve(__dirname, 'src/utils/'),
        routes: path.resolve(__dirname, 'src/routes/'),
    },
    ignoreMomentLocale: true,
  commons: [
    { name: 'vendor', minChunks: Infinity },
  ],
  hash: true,
  html: {
    template: './src/index.ejs',
  },
  proxy: {
      "/Tongji": {
          "target": "http://testcre.crebe.io",
          "changeOrigin": true,
          "pathRewrite": {"^/Tongji": "/Tongji"}
      },
    "/coin": {
      "target": "http://testcre.crebe.io",
      "changeOrigin": true,
      "pathRewrite": {"^/coin": "/coin"}
    },
    "/member": {
      "target": "http://testcre.crebe.io",
      "changeOrigin": true,
      "pathRewrite": {"^/member": "/member"}
    },
    "/member_login_log": {
      "target": "http://testcre.crebe.io",
      "changeOrigin": true,
      "pathRewrite": {"^/member_login_log": "/member_login_log"}
    },
    "/member_balance": {
      "target": "http://testcre.crebe.io",
      "changeOrigin": true,
      "pathRewrite": {"^/member_balance": "/member_balance"}
    },
    "/member_add_coin": {
      "target": "http://testcre.crebe.io",
      "changeOrigin": true,
      "pathRewrite": {"^/member_add_coin": "/member_add_coin"}
    },
    "/member_sub_coin": {
      "target": "http://testcre.crebe.io",
      "changeOrigin": true,
      "pathRewrite": {"^/member_sub_coin": "/member_sub_coin"}
    },
    "/Member_sub_coin": {
      "target": "http://testcre.crebe.io",
      "changeOrigin": true,
      "pathRewrite": {"^/Member_sub_coin": "/Member_sub_coin"}
    },
    "/member_sub_coin_address": {
      "target": "http://testcre.crebe.io",
      "changeOrigin": true,
      "pathRewrite": {"^/member_sub_coin_address": "/member_sub_coin_address"}
    },
    "/coin_entrust": {
      "target": "http://testcre.crebe.io",
      "changeOrigin": true,
      "pathRewrite": {"^/coin_entrust": "/coin_entrust"}
    },
    "/coin_trade": {
      "target": "http://testcre.crebe.io",
      "changeOrigin": true,
      "pathRewrite": {"^/coin_trade": "/coin_trade"}
    },
    "/member_share_out_bonus": {
      "target": "http://testcre.crebe.io",
      "changeOrigin": true,
      "pathRewrite": {"^/member_share_out_bonus": "/member_share_out_bonus"}
    },
    "/member_ref": {
      "target": "http://testcre.crebe.io",
      "changeOrigin": true,
      "pathRewrite": {"^/member_ref": "/member_ref"}
    },
    "/announce": {
      "target": "http://testcre.crebe.io",
      "changeOrigin": true,
      "pathRewrite": {"^/announce": "/announce"}
    },
    "/share_out": {
      "target": "http://testcre.crebe.io",
      "changeOrigin": true,
      "pathRewrite": {"^/announce": "/announce"}
    },
    "/Coin_entrust": {
      "target": "http://testcre.crebe.io",
      "changeOrigin": true,
      "pathRewrite": {"^/Coin_entrust": "/Coin_entrust"}
    },
    "/vip": {
      "target": "http://testcre.crebe.io",
      "changeOrigin": true,
      "pathRewrite": {"^/vip": "/vip"}
    },
    "/dragon": {
      "target": "http://testcre.crebe.io",
      "changeOrigin": true,
      "pathRewrite": {"^/dragon": "/dragon"}
    },
    "/Dragon": {
      "target": "http://testcre.crebe.io",
      "changeOrigin": true,
      "pathRewrite": {"^/Dragon": "/Dragon"}
    },
    "/tongji": {
      "target": "http://testcre.crebe.io",
      "changeOrigin": true,
      "pathRewrite": {"^/tongji": "/tongji"}
    },
    "/kline": {
      "target": "http://testcre.crebe.io",
      "changeOrigin": true,
      "pathRewrite": {"^kline": "/kline/"}
    },
    "/entrust": {
      "target": "http://testcre.crebe.io",
      "changeOrigin": true,
      "pathRewrite": {"^/entrust": "/entrust"}
    },
    "/tradepair": {
      "target": "http://testcre.crebe.io",
      "changeOrigin": true,
      "pathRewrite": {"^/tradepair": "/tradepair"}
    },
    "/IdCard": {
      "target": "http://testcre.crebe.io",
      "changeOrigin": true,
      "pathRewrite": {"^/IdCard": "/IdCard"}
    },
    "//testimg.chawong.cn": {
      "target": "http://testimg.chawong.cn/",
      "changeOrigin": false,
      "pathRewrite": {"^/IdCard": "/IdCard"}
    },
    "/Authenticator": {
      "target": "http://testcre.crebe.io",
      "changeOrigin": true,
      "pathRewrite": {"^/Authenticator": "/Authenticator"}
    },
    "/Geetest": {
      "target": "http://testcre.crebe.io",
      "changeOrigin": true,
      "pathRewrite": {"^/member_login_log": "/member_login_log"}
    },
      "/index": {
          "target": "http://testcre.crebe.io",
          "changeOrigin": true,
          "pathRewrite": {"^/news": "/news"}
      }

  }
}
