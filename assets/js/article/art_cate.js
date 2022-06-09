$(function() {
  initArtCateList()
  const layer = layui.layer
  const form = layui.form
    // 获取文章分类的列表
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success(res) {
        if (res.status !== 0) return layer.msg('获取文章分类列表失败！')
        if (res.data.length === 0) return $('#NotCate').show()
        $('#NotCate').hide()
        let htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }
    })
  }

  // 添加分类列表 弹出层
  let indexAdd = null // 弹出层索引
  $('#btnAdd_artCate').on('click', function() {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '300px'],
      title: '添加文章分类',
      content: $('#dialog_add').html()
    })
  })

  // 事件委派 form_add  添加分类列表
  $('body').on('submit', '#form_add', function(e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success(res) {
        if (res.status !== 0) return layer.msg(res.message)
        layer.msg('新增分类成功！')
        layer.close(indexAdd) // 关闭弹出层
        initArtCateList()
      }
    })
  })

  // 事件委派 btn_edit  编辑修改 弹出层
  let indexEdit = null
  $('tbody').on('click', '.btn_edit', function() {
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '300px'],
      title: '修改文章分类',
      content: $('#dialog_edit').html()
    })

    let id = $(this).data('id') // 获取自定义属性 data-id的值
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/'.concat(id),
      success(res) {
        if (res.status !== 0) return layer.msg('请稍后再试！')
        form.val('form_edit', res.data)
      }
    })
  })

  //事件委派 submit_edit 提交修改
  $('body').on('submit', '#form_edit', function(e) {
    e.preventDefault()

    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success(res) {
        if (res.status !== 0) return layer.msg(res.message)
        layer.close(indexEdit)
        layer.msg('更新分类数据成功！')
        initArtCateList()
      }
    })
  })

  // 事件委派，btn_delete 删除事件 询问层
  $('tbody').on('click', '.btn_delete', function() {
    let id = $(this).data('id')
    layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/'.concat(id),
        success(res) {
          if (res.status !== 0) return layer.msg('删除分类失败！')
          initArtCateList()
          layer.msg('删除分类成功！')
          layer.close(index);
        }
      })
    })

  })
})