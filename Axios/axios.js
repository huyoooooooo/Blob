(function() {
  function Axios(config) {
    this.defaults = config
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    }
  }

  function InterceptorManager() {
    this.handlers = []
  }
  
  InterceptorManager.prototype.use = function(fulfilled, rejected) {
    this.handlers.push({
      fulfilled, 
      rejected
    })
  }

  let methods = ['get', 'post', 'put', 'delete'];
  methods.forEach(method => {
    Axios.prototype[method] = function(config) {
      config[method] = method
      return this.request(config)
    }
  })

  Axios.prototype.request = function(config) {
    let chains = [dispatchRequest, undefined]

    let requestInterceptorChain = []
    this.interceptors.request.handlers.forEach(interceptor => {
      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected)
    })

    let responseInterceptorChain = []
    this.interceptors.response.handlers.forEach(interceptor => {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected)
    })

    Array.prototype.unshift.apply(chains, requestInterceptorChain)
    chains = chains.concat(responseInterceptorChain)

    let promise = Promise.resolve(config)
    while(chains.length > 0) {
      promise = promise.then(chains.shift(), chains.shift())
    }

    return promise
  }

  function dispatchRequest(config) {
    return adapter(config).then(response => {
        return response
      },
      error => {
        throw error
      }
    )
  }

  function adapter(config) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest()

      xhr.open(config.method, config.url)

      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          if (xhr.status >= 200  && xhr.status <= 300) {
            resolve({
              config,
              data: JSON.parse(xhr.response),
              headers: xhr.getAllResponseHeaders(),
              request: xhr,
              status: xhr.status,
              statusText: xhr.statusText
            })
          } else {
            reject(new Error('请求失败'))
          }
        }
      }

      if (config.cancelToken) {
        config.cancelToken.promise.then(_ => {
          xhr.abort()
          reject(new Error('请求已取消'))
        })
      }
      xhr.send()
    })
  }

  function CancelToken(executor) {
    let resolvePromise
    this.promise = new Promise(resolve => {
      resolvePromise = resolve
    })
    executor(resolvePromise)
  }

  function createInstance(config) {
    let context = new Axios(config)
    let instance = Axios.prototype.request.bind(context)

    Object.keys(Axios.prototype).forEach(key => {
      instance[key] = Axios.prototype[key].bind(context)
    })

    Object.keys(context).forEach(key => {
      instance[key] = context[key]
    })

    instance.create = function(config) {
      return createInstance(config)
    }

    return instance
  }

  window.axios = createInstance({method: 'GET'})

  axios.CancelToken = CancelToken
})()