## Layout

### BasicLayout 基础layout 

保持上中下结构，包含公共头尾，中间部分自定义

### UserLayout 用户中心layout 

包含头部，中间部分自定义

### ManagerLayout 管理中心layout

保持上中下结构，中间分为左右栏结构

### BlankLayout 空白layout

一张白纸，按照需求自定义，目前首页、交易中心使用这个layout

## Router

### 目前完成的路由

首页 / 等同于 /home

交易中心 /transaction

等级分红 /levelProfit

QQ游戏 /qqGame

用户中心

注册 /user/register

登录 /user/login

忘记密码 /user/forgetPwd

系统相关：

404页面 /404

500页面 /500

### 路由的配置

举个例子，想要增加一个交易中心的路由，期待的路由是`/transaction` 并且想使用BasicLayout作为布局 则在common/nav.js 增加如下代码：

```javascript

    if ('BasicLayout' === layout) {
        return {
            name: '首页', 
            exact: true,
            path: '/',
            layout: 'BasicLayout',
            component: dynamicWrapper(app, ['user'], () => import('../layouts/BasicLayout')),
            children: [
                {
                    name: '交易中心',
                    path: 'transaction',
                    component: dynamicWrapper(app, [], () => import('../routes/Transaction/index')),
                },
            ],
        }
    }

```

其中children里面的路由就是匹配root/下面的一级路由，可支持多级路由

## Icon-font

### 使用方法

```javascript

import Icon from '../../components/Icon' // 引入Icon组件

```

```rxjs

<Icon type="star" size="16" color="#ccc" />

```

参数：

size Number 字体大小 默认12px

type String 图标名称 必填

color String 图标色值 （16进制，rgb，rgba）默认#333

## Mock

.roadhogrc.mock.js 里面写入你要mock的请求和返回的数据

```javascript

export default {
    'GET /api/users': { 
        users: [{ username: 'admin' }],
        list: {
            columns: [
                {
                  label: "日期",
                  prop: "date",
                  width: 180
                },
                {
                  label: "姓名",
                  prop: "name",
                  width: 180
                },
                {
                  label: "地址",
                  prop: "address"
                }
              ],
              data: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
              }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
              }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
              }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
              }]
        }
     },
}

```

services/api.js 这里就是真实向后端请求

```javascript

import request from '../utils/request'

export async function users(params) {
    return request('/api/users')
}

```

models/user.js 比如这里要请求用户列表

```javascript

effects: {
    *fetchUserList({ payload }, { call, put }) {
      yield put({ type: 'loading', payload: true})
      const response = yield call(users, payload)
      yield put({
        type: 'saveList',
        payload: response.data.list,
      })
      yield put({ type: 'loading', payload: false })
    },
}

```

以上effects里面的generator在react被称为副作用，也就是这里存在异步数据流，但你可以将它们看为同步方式

## WebSocket

使用HTML5原生WebSocket对象，做了一个简单的封装

```javascript

    Socket({
        url: 'ws://localhost:8080',
        params: {
            flag: flag, 
            data: currentItem
        },
        callback: response => {
            console.log(response)
        }
    })

```