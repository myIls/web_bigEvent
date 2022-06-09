$(function() {
  const { layer, form } = layui
  let state = '已发布'

  initCate()
  isListPage() // 是否来自 列表页的编辑按钮
  initEditor() // 初始化 富文本编辑器

  // 加载文章分类
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success(res) {
        if (res.status !== 0) return layer.msg('获取文章分类列表失败！')

        let htmlStr = template('tpl_cate', res)
        $('[name=cate_id]').html(htmlStr)
        form.render('select'); //刷新select选择框渲染
      }
    })
  }

  // 单击 选择封面 触发 文件上传
  $('#img_a').on('click', function() {
    $('[name=cover_img]').trigger('click')
  })

  // 监听 文件上传 的变化，实时预览 封面图片
  $('[name=cover_img]').on('change', function(e) {
    if (e.target.files.length === 0) {
      $('#img_a img').prop('src', '/assets/images/fengmian.jpg')
    } else {
      let url = URL.createObjectURL(e.target.files[0])
      $('#img_a img').prop('src', url) // 预览图片
      DrawCanvas(url)
    }
  })

  // 传入图片URL 把图片绘制在Canvas画布上
  function DrawCanvas(url) {
    // 将图片绘制在Canvas画布上
    let c1 = $('#c1')[0]
    let ctx = c1.getContext('2d'); //c1为Canvas画布id
    let img = new Image();
    img.src = url;
    img.setAttribute("crossOrigin", 'Anonymous') //  为image请求添加跨域
    img.onload = function() { //必须等待图片加载完成
      // 当画布的宽或高被重置时，当前画布内容就会被移除
      c1.width = img.width
      c1.height = img.height
      ctx.drawImage(img, 0, 0, img.width, img.height); //绘制图像进行拉伸
    }
  }

  // 单击 存为草稿
  $('#btnSave2').on('click', function() {
    state = '草稿'
  })

  // 提交表单
  $('#form-pub').on('submit', function(e) {
    e.preventDefault()
    let id = $('[name=Id]').val()
    let fd = new FormData($(this)[0])
    fd.append('state', state)
      // canvas对象 转为 文件对象
    $('#c1')[0].toBlob(function(blob) {
      fd.delete('cover_img')
      fd.append('cover_img', blob)
      id ? updateArticle(fd) : publishArticle(fd) // id存在则 更新文章，否则就发布新文章
    })
  })

  // 发布新文章
  function publishArticle(fd) {
    fd.delete('Id')
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      // FormData 格式数据必须添加以下两项
      // 不修改 Content-Type 属性，使用 FormData 默认的 Content-Type 值
      contentType: false,
      // 不对 FormData 中的数据进行 url 编码，而是将 FormData 数据原样发送到服务器
      processData: false,
      success(res) {
        if (res.status !== 0) {
          return layer.msg('发布新文章失败!')
        }
        layer.msg('已上传文章成功!')
        setTimeout(function() {
          window.parent.clickArt('list') // 跳转到列表页
        }, 500)
      }
    })
  }

  // 更新文章 
  function updateArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/edit',
      data: fd,
      // FormData 格式数据必须添加以下两项
      // 不修改 Content-Type 属性，使用 FormData 默认的 Content-Type 值
      contentType: false,
      // 不对 FormData 中的数据进行 url 编码，而是将 FormData 数据原样发送到服务器
      processData: false,
      success(res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg('修改文章成功！')
        setTimeout(function() {
          window.parent.clickArt('list') // 跳转到列表页
        }, 500)
      }
    })
  }

  // 表单验证
  form.verify({
    file() {
      let img_url = $('#img_a img').prop('src')
      if (img_url.endsWith('/assets/images/fengmian.jpg')) {
        return '请选择文章封面！'
      }
    }
  })

  // 是否来自列表页的 编辑 按钮
  function isListPage() {
    let id = sessionStorage.getItem('art_id') ? sessionStorage.getItem('art_id') : null;
    if (!id) return false
    sessionStorage.removeItem('art_id')

    // 渲染页面
    $.ajax({
      method: 'GET',
      url: '/my/article/'.concat(id),
      success(res) {
        if (res.status !== 0) return layer.msg('获取文章详情失败！')
        randerForm(res.data)
      }
    })
  }

  // 渲染 表单
  function randerForm(data) {
    $('[name=Id]').val(data.Id)
    $('[name=title]').val(data.title)
    $('[name=content]').val(data.content)
    let img_url = location.origin.concat(':3007', data.cover_img)
    $('#img_a img').prop('src', img_url)
    $('[name=cate_id]').val(data.cate_id)
    form.render('select')
    DrawCanvas(img_url)
  }


})