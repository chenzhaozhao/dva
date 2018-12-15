import './common/ie';
import dva from 'dva'
import createLoading from 'dva-loading'
import 'element-theme-default'
import './index.css'
// import {createBrowserHistory } from "history"
// import { createBrowserHistory as createHistory } from 'history';
// 1. Initialize
// const app = dva();
const app = dva();
// 2. Plugins
app.use(createLoading({ effects: true }));
// TODO: https://github.com/dvajs/dva/issues/533
// const cached = {}
// function registerModel(app, model) {
//   if (!cached[model.namespace]) {
//     try {
//         app.model(model)
//     } catch(e) {}
//     cached[model.namespace] = 1
//   }
// }
// registerModel(app, require('./models/global'))
// 3. Model
// app.model(require('./models/example').default)
//初始化webSocket链接次数
window._LINK_COUNT=0;
// 4. Router
app.router(require('./router').default)

// 5. Start
app.start('#root')
