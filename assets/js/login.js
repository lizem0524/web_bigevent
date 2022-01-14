$(function () {
    // 点击"注册账号"的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 点击"去登录"的链接
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })
    // 从layui中获取form 对象
    let form = layui.form
    // 通过form.verify()函数自定义校验规则
    form.verify({
        //自定义了一个pwd的校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],
        repwd: function (value) {
            let pwd = $('.reg-box [name=password]').val()
            if (value !== pwd) { return '两次密码输入不一致' }
        }
    })
})

// 监听注册表单的提交事件
$('#form_reg').on('submit', function (e) {
    e.preventDefault()
    $.post('/api/reguser',
        {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录')
            $('#link_login').click()
        })
})
// 监听登录表单提交事件
$('#form_login').on('submit', function (e) {
    e.preventDefault()
    $.post('/api/login', $(this).serialize(), function (res) {
        if (res.status !== 0) {
            return layer.msg(res.message)
        }
        layer.msg('登录成功')
        localStorage.setItem('token', res.token)
        location.href = './index.html'
    })
})