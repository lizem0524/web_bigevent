$(function () {
    initUserInfo()
    let form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度必须在1~6个字符之间"
            }
        }
    })

    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                form.val('formUserInfo', res.data)
            }
        })
    }
    // 提交表单监听事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('信息提交失败')
                }
                layer.msg('修改信息成功')
                parent.getUserInfo()
            }
        })
    })
    // 重置按钮
    $('#btnReset').on('click', function (e) {
        e.preventDefault()
        initUserInfo()
    })
})
