$(function () {
    initArtCateList()
    // 获取并渲染文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败')
                }
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    // 为添加类别按钮绑定点击事件
    let indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    // 通过代理的形式，为分类添加弹出层form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加文章分类失败')
                }
                initArtCateList()
                layer.close(indexAdd)
                layer.msg('添加成功')
            }
        })
    })
    // 通过代理，给编辑按钮绑定点击事件，并为弹出层的分类修改提交绑定事件
    let form = layui.form
    let indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        let id = $(this).attr('data-Id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分录数据失败')
                }
                form.val('form-edit', res.data)
            }
        })
        // 点击编辑按钮的同时,为修改分类表单form-edit绑定submit事件
        $('#form-edit').on('submit', function (e) {
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('修改分类信息失败')
                    }
                    layer.msg('修改成功')
                    layer.close(indexEdit)
                    initArtCateList()
                }
            })
        })
    })

    //通过代理，给删除按钮绑定点击事件。
    $('tbody').on('click', '.btn-delete', function () {
        let id = $(this).attr('data-Id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: "GET",
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败')
                    }
                    layer.msg('删除成功')
                    initArtCateList()
                }
            })
            layer.close(index);
        });
    })
})