$(function() {
  const layer = layui.layer
  getUserInfo()

  // 退出登录
  $('#btnLogout').on('click', function() {
    layer.confirm('确认退出登录？', { icon: 3, title: '提示' }, function(index) {
      localStorage.removeItem('token') // 清空本地存储的tokne
      location.href = '/login.html' // 跳转到登录页
      layer.close(index) // 关闭询问层
    })
  })
})

// 获取用户信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    success(res) {
      if (res.status !== 0) {
        return layer.msg('获取用户信息失败！')
      }
      randerAvatar(res.data)
    }
  })
}

// 渲染用户头像
function randerAvatar(user) {
  let uname = user.nickname || user.username
  $('#welcome').html('欢迎&nbsp;&nbsp;'.concat(uname))

  if (user.user_pic !== null) {
    // 渲染用户头像
    $('.layui-nav-img').prop('src', user.user_pic).show()
    $('.text-avatar').hide()
  } else {
    // 渲染文本头像
    let firstAlpha = uname[0].toUpperCase()
    $('.text-avatar').text(firstAlpha).show()
    $('.layui-nav-img').hide()
  }
}