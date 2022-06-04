$(function() {
  // 点击 点击注册
  $('#link_reg').on('click', function() {
    $('.login-box').hide()
    $('.reg-box').show()
  })

  // 点击 已有账号，点击登录
  $('#link_login').on('click', function() {
    $('.login-box').show()
    $('.reg-box').hide()
  })

  const form = layui.form
  const layer = layui.layer

  // 自定义form表单校验规则
  form.verify({
    username: [/^[a-zA-Z0-9]{5,12}$/, '请输入正确的用户名!'],
    regUname: [/^[a-zA-Z0-9]{5,12}$/, '用户名必须是5-12位的数字和字母组成'],
    pwd: [
      /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
    ],
    // 两次密码是否一致
    repwd: function(value) {
      let pwd = $('.reg-box [name=password]').val()
      if (pwd !== value) {
        return '两次密码不一致！'
      }
    }
  })

  //监听注册表单事件
  $('#form_reg').on('submit', function(e) {
    e.preventDefault()
    const regInfo = {
      username: $('.reg-box [name=username]').val(),
      password: $('.reg-box [name=password]').val()
    }

    $.post('/api/reguser', regInfo, function(res) {
      $('.reg-box input').val('')
      if (res.status !== 0) {
        // 注册失败
        return layer.msg(res.message)
      }
      layer.msg('注册成功，请登录')
      $('#link_login').click()
    })
  })

  // 监听登录表单事件
  $('#form_login').on('submit', function(e) {
    e.preventDefault()
    const data = $(this).serialize()
    $.ajax({
      url: '/api/login',
      method: 'POST',
      data,
      success(res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg('登录成功！')
        localStorage.setItem('token', res.token)
        location.href = '/index.html'
      }
    })
  })

})