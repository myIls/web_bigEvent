const form = layui.form
const layer = layui.layer

$(function() {
  form.verify({
    nikename(value) {
      if (value.length > 6) {
        return '昵称长度必须在1~6个字符之间！'
      }
    }
  })
  initUserInfo()

  // 重置表单的数据
  $("#btnReset").on('click', function(e) {
    e.preventDefault() // 阻止默认清空行为
    initUserInfo()
  })

  // 提交修改表单数据
  $('.layui-form').on('submit', function(e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success(res) {
        if (res.status !== 0) {
          return layer.msg('修改用户信息失败！')
        }
        layer.msg('修改用户信息成功！')
        window.parent.getUserInfo() // 调用父元素中的方法，重新渲染头像和用户名

      }
    })
  })
})

// 初始化用户的基本信息
function initUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    success(res) {
      if (res.status !== 0) {
        return layer.msg('获取用户信息失败！')
      }
      form.val("formUserInfo", res.data) // form.val()快速为表单赋值
    }
  })
}