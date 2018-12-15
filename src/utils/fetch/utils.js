
export function addQueryString(url, param) {
    for (const key in param) {
      if (param.hasOwnProperty(key) && !isEmpty(param[key])) {
        url += url.indexOf('?') === -1 ? '?' : '&'
        url += `${encodeURIComponent(key)}=${encodeURIComponent(param[key])}`
      }
    }
    return url
  }
  
  export function isEmpty(value) {
    return typeof value === 'undefined' || value === null
  }
  
  export async function dealInterceptors(interceptors, ...data) {
    let isDoubleParams = false
    const dataLen = data.length
    let copyData
    if (dataLen === 2) {
      isDoubleParams = true
      copyData = data
    } else {
      copyData = data[0]
    }
  // debugger
    const len = interceptors.length
    let current = 0
    copyData = await recursion()
    return copyData
  
    async function recursion() {
      if (current < len) {
        copyData = isDoubleParams ?
          await interceptors[current](...copyData) :
          await interceptors[current](copyData)
        current++
        return recursion()
      }
      return copyData
    }
  }
  