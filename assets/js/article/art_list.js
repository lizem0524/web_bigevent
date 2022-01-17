$(function () {
    // 导入layui需要的函数
    var form = layui.form
    var layer = layui.layer
    var laypage = layui.laypage;
    // 定义梅花事件的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
    // 定义补0函数
    function padZero(n) {
        return n < 10 ? '0' + n : n
    }
    let q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    initCate()
    initTable()
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表数据失败')
                }
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }

                console.log(res);
                // 调用模板引擎
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // layui再次渲染
                form.render()
            }
        })
    }
    // 为筛选按钮绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        initTable()
    })
    
    // 分页器的渲染
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',   //分液器容器的ID
            count: total,      //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum,   //设置默认被选中的分页
            limits: [2, 5, 8, 10],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        })
    }
    // 删除按钮绑定事件
    $('tbody').on('click', '.btn-delete', function () {
        // 拿到页面删除按钮的个数
        let len = $('.btn-delete').length
        let id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                    // 解决最后一页数据全部删除后不自动跳转的问题
                    if (len === 1 && q.pagenum !== 1) {
                        q.pagenum -= 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })
})