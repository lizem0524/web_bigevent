$(function () {
    let form = layui.form
    form.verify({
        //自定义了一个pwd的校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return "新旧密码不能相同"
            }
        },
        repwd: function (value) {
            let pwd = $('[name=newPwd]').val()
            if (value !== pwd) { return '两次密码输入不一致' }
        }
    })

    // 修改密码提交
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败')
                }
                layui.layer.msg('更新密码成功')
                $('.layui-form')[0].reset()
            }
        })
    })
})