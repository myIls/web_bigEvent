$(function() {
  const layer = layui.layer
    // 1.1 获取裁剪区域的 DOM 元素
  const $image = $('#image');
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  };

  // 1.3 创建裁剪区域
  $image.cropper(options);

  // 为上传按钮绑定点击事件
  $('#btnChooseImage').on('click', function() {
    $('#file').trigger('click')
  })

  // 为文件选择框 绑定 change 事件
  $('#file').on('change', function(e) {
    if (e.target.files.length === 0) {
      return layer.msg('请选择图片文件！')
    }
    let file = e.target.files[0] // 拿到文件
    let newImgURL = URL.createObjectURL(file) // 将文件转换为路径

    // 重新初始化裁剪区域
    $image.cropper('destroy') // 销毁旧的裁区域
      .prop('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 初始化裁剪区域
  })

  // 确定按钮 绑定事件
  $('#btnUpload').on('click', function() {
    let dataURL = $image
      .cropper('getCroppedCanvas', {
        // 创建一个Canvas画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png') // 将Canvas画布上的内容，转换为base64格式的字符串

    $.ajax({
      method: 'POST',
      url: '/my/update/avatar',
      data: {
        avatar: dataURL
      },
      success: function(res) {
        if (res.status !== 0) return layer.msg('更换头像失败！')
        layer.msg('更换头像成功！')

        window.parent.getUserInfo()
      }
    })
  })
})