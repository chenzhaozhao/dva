

export class Interceptor {
    interceptors = null

  constructor(interceptors) {
    this.interceptors = { ...interceptors }
  }

  set(key, value) {
    this.interceptors[key] = value
  }
  
  get(key) {
    return this.has(key) ? this.interceptors[key] : null
  }

  delete(key) {
    if (this.has(key)) {
      delete this.interceptors[key]
    }
  }
  
  has(key) {
    return this.interceptors.hasOwnProperty(key)
  }
  
  forEach(callback, thisArg) {
    for (const key in this.interceptors) {
      if (this.interceptors.hasOwnProperty(key)) {
        callback.call(thisArg, this.interceptors[key], key, this)
      }
    }
  }

  merge(interceptors) {
    if (interceptors instanceof Interceptor) {
      interceptors.forEach((value, key) => {
        if (!this.has(key)) {
          this.set(key, value)
        }
      })
    }
    return this
  }
}
