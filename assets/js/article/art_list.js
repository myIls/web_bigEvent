$(function() {
  const { layer, form, laypage } = layui
  const q_data = {
    pagenum: 1,
    pagesize: 2,
    cate_id: '',
    state: ''
  }

  // 过滤器 - 美化时间
  template.defaults.imports.dataFormat = function(date) {
    const dt = new Date(date)
    let y = dt.getFullYear()
    let m = padZero(dt.getMonth() + 1)
    let d = padZero(dt.getDate())
    let hh = padZero(dt.getHours())
    let mm = padZero(dt.getMinutes())
    let ss = padZero(dt.getSeconds())
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  }

  initTable()
  initCate()

  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q_data,
      success(res) {
        if (res.status !== 0) return layer.msg('获取文章列表失败！')
        let htmlStr = template('tpl_table', res)
        $('tbody').html(htmlStr)
        randerPage(res.total) // 渲染分页
      }
    })
  }

  // 补零函数
  function padZero(n) {
    return n > 9 ? n : '0'.concat(n)
  }

  // 初始化 文章分类
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

  // 提交 筛选表单 
  $('#form_search').on('submit', function(e) {
    e.preventDefault()
    let search_data = form.val("form_search")
    Object.assign(q_data, search_data)
    initTable()
  })


  // 渲染分页
  function randerPage(total) {
    laypage.render({
      elem: 'PageBox', // 分页容器
      count: total, // 数据总量
      limit: q_data.pagesize, // 每页显示的条数
      limits: [2, 3, 10, 20, 50],
      curr: q_data.pagenum, // 当前页码值
      /** 分页发生切换 触发的回调函数
       * 点击 页码，会触发回调，first 为 undefined 	
       * 调用 randerPage() 也会触发回调，first 为true
       */
      jump(obj, first) {
        if (!first) {
          q_data.pagenum = obj.curr /// 更新页码值
          q_data.pagesize = obj.limit // 更新 条目数
          initTable()
        }
      },
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'] // 自定义排版
    })
  }

  //事件委派 删除按钮 提交删除
  $("tbody").on('click', '.btn-delete', function() {
    let id = $(this).data('id')
    let len = $('.btn-delete').length // 删除之前 该页的 数据总量
    layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/'.concat(id),
        success(res) {
          if (res.status !== 0) return layer.msg('删除文章失败！')
          layer.msg('删除文章成功！')

          // 当前页如果只有1个删除按钮，那么删除成功 后 页码 -1
          if (len === 1) {
            // 如果页码已经是 1了，则不用-1
            q_data.pagenum = q_data.pagenum === 1 ? 1 : q_data.pagenum - 1
          }
          initTable()
        }
      })
      layer.close(index);
    })
  })

  // 事件委派 编辑按钮
  $('tbody').on('click', '.btn-edit', function() {
    let id = $(this).data('id')
    sessionStorage.setItem('art_id', id)
    window.parent.clickArt('pub')
  })
})