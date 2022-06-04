/**
 * 每次调用ajax请求的时候都会先调用ajaxPrefilert()
 * 在这个函数中，可以拿到AJAX提交的配置对象
 */
$.ajaxPrefilter(function(options) {
  // 在发起正在的ajax请求之前，统一拼接根路径
  options.url = 'http://127.0.0.1:3007'.concat(options.url)
})