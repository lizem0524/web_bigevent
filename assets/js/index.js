$(function () {

    getUserInfo()

    // 退出按钮绑定事件
    $('#btnLogout').on('click', function () {
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
            localStorage.removeItem('token')
            location.href = '/login.html'
            // 关闭弹出框
            layer.close(index);
        });
    })
    // 获取用户信息
    function getUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('获取用户信息失败');
                }
                renderAvatar(res.data)
            },
            // 无论响应成功或失败，都会调用complete
        })
    }

    // 渲染用户的头像
    function renderAvatar(user) {
        // 获取用户名
        let name = user.nickname || user.username
        // 设置欢迎文本
        $('#welcome').html(`欢迎回来!&nbsp;&nbsp;&nbsp;${name}`)
        // 按需渲染用户头像
        if (user.user_pic) {
            // 渲染图片头像
            $('.layui-nav-img').prop('src', user.user_pic).show()
            $('.text-avtar').hide()
        } else {
            // 渲染文本头像
            $('.layui-nav-img').hide()
            let first = name[0].toUpperCase()
            $('.text-avtar').html(first).show()
        }
    }
})