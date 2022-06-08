/**
 * 每次调用ajax请求的时候都会先调用ajaxPrefilert()
 * 在这个函数中，可以拿到AJAX提交的配置对象
 */
$.ajaxPrefilter(function(options) {
  // headers 请求头配置对象，以/my开头的接口则携带token
  if (options.url.startsWith('/my')) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }

    // 全局挂载 complete回调函数
    options.complete = function(res) {
      // 无论ajax请求是否成功，都会执行complete回调函数函数。
      if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败') {
        localStorage.removeItem('token')
        location.href = '/login.html'
        window.parent && (window.parent.location.href = '/login.html')
      }
    }
  }
  // 在发起正在的ajax请求之前，统一拼接根路径  
  options.url = 'http://be.hellohyq.cn:3007'.concat(options.url)
})