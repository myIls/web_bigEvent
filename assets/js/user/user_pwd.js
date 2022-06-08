 $(function() {
   const form = layui.form
   const layer = layui.layer

   form.verify({
     pwd: [
       /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格!'
     ],
     newPwd(value) {
       let oldPwd = $('[name=oldPwd]').val()
       if (oldPwd === value) {
         return '新密码不能和旧密码相同！'
       }
     },
     reNewPwd(value) {
       let newPwd = $('[name=newPwd]').val()
       if (value !== newPwd) {
         return '两次新密码不一致，请重新输入！'
       }
     }
   })

   $('.layui-form').on('submit', function(e) {
     e.preventDefault()
     $.ajax({
       method: 'POST',
       url: '/my/updatepwd',
       data: $(this).serialize(),
       success(res) {
         if (res.status !== 0) {
           return layer.msg('更新密码失败！')
         }
         layer.msg('更新密码成功！')

         //  $('#btnReset').click()
         // 调用原生DOM对象的reset() 重置表单
         $('.layui-form')[0].reset()
       }
     })
   })
 })