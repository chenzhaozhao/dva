import fetch from 'dva/fetch'
import { Notification} from 'element-react'
import {logout} from './index.js'
import {
  FetchClient,
  Interceptor
} from '../utils/fetch'
import {
    getUserInfo
} from '../utils/index'
import intl from 'react-intl-universal'
function parseJSON(response) {
  return response.json()
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  const error = new Error(response.statusText)
  error.response = response
  throw error
}

function handelData(res) {
  let success;

  // if (res.msg&&res.msg==="Login_please"){
  //    window.location="#/newlogin"
  //     // Notification({
  //     //     title:intl.get('Reminder'),
  //     //     type: 'success',
  //     //     message: intl.get(res.msg),
  //     //     duration: 2000
  //     // });
  // }
  if ( parseInt(res.code,10) < 0) {
    success = false;
    return {code: res.code, msg: res.msg, data: (res.data?res.data:""),success }
  } else if (parseInt(res.code,10) > 0) {
    success = true;
    return { data: res.data, success,msg: res.msg }
  } else if ('0' === res.code) {
    // session 过期
    logout()
  }
}

function handleError (error) {
  const code = error.code
  if ('-1' === code) {
    Notification({title:'警告',message: `异常错误`, type: 'warning'})
  }
  return { success: false }
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options, force=false) {
  // debugger
  // const userid = localStorage.getItem('_userid_')
  // const token = localStorage.getItem('_token_')
    const {userid,token}=getUserInfo();
  let formData = null
  let newOption = null

  if (options.method.toUpperCase() === 'GET') {
    url = url + '?'
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        url = url + key + '=' + options[key] +'&'
      }
    }
    if (userid && token && !force) {
      url = url + '&userid=' + userid + '&token=' + token+'&lang='+window.currentLocale
    }
  } else if (options.method.toUpperCase() === 'POST') {
    options.body = options.body || {};
    if (userid && token && !force) {
      options.body = {
        ...options.body,
        userid,
        lang:window.currentLocale,
        token,
        who:'前端' // TODO: 需要去掉
      }
    }else{
        options.body = {
            ...options.body,
            lang:window.currentLocale,
            who:'前端' // TODO: 需要去掉
        }
    }
    // debugger
    formData = new FormData;
    for (let key in options.body) {
      if (options.body.hasOwnProperty(key)) {
        formData.append(key, options.body[key])
      }
    }

    newOption = {
      ...options,
      body: formData
    }
  }
  return fetch(url, newOption)
    .then(checkStatus)
    .then(parseJSON)
    .then(handelData)
    .catch(handleError)
  }

export function get (url, options, force=false) {
  return request(url, { ...options, method: 'get' }, force)
}

export function post (url, options, force=false) {
  return request(url, { ...options, method: 'post' }, force)
}

export function put (url, options) {
  return request(url, { ...options, method: 'put' })
}

export function deleted (url, options) {
  return request(url, { ...options, method: 'deleted' })
}

// 自定义拦截器设置
const fetchClient = new FetchClient()
const interceptor = new Interceptor({
  // cors: {
  //   id: 0,
  //   request(url, config) {
  //     url += '&a=1'
  //     config.mode = 'cors'
  //     return Promise.resolve([url, config])
  //   },
  //   success(data) {
  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         console.log('res a', data)
  //         data.a = 'intercepta'
  //         resolve(data)
  //       }, 1000)
  //     })
  //   }
  // },
  credentials: {
    id: 1,
    request(url, config) {
      url += '&b=2'
      config.credentials = 'include' // 不论是不是跨域的请求,总是发送请求资源域在本地的 cookies、 HTTP Basic authentication 等验证信息.
      return Promise.resolve([url, config])
    },
    requestError(fetchError) {
      return Promise.reject('requestError reject')
      // or return Promise.resolve('requestError resolve')
    },
    response(response) {
      return Promise.resolve(response)
    },
    success(data) {
      return new Promise((resolve) => {
        setTimeout(() => {
          data.b = 'interceptb'
          resolve(data)
        }, 1000)
      })
    },
    error(res) {
      return Promise.resolve(res)
    },
    timeout(url) {
      return Promise.resolve('timeout')
      // default timeout is 10s
      // or return Promise.reject('timeout)
    }
  }
})

fetchClient.setInterceptors(interceptor)
// Example
// fetchClient.post('/member/login', {
//   email: '43950@qq.com',
//   password: 'echo2213'
// })

export { fetchClient }
