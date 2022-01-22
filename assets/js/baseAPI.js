// 配置全局的ajax请求的属性
$.ajaxPrefilter(function (options) {
    // 发起Ajax前统一拼接根路径
    // const str = 'http://www.liulongbin.top:3007'
    const str = 'http://127.0.0.1'
    options.url = str + options.url;
    // 判断接口是否含/my/，统一请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = { Authorization: localStorage.getItem('token') || '' }
    }
    // 无论响应成功或失败，都会调用complete
    options.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制清空token
            localStorage.removeItem('token')
            // 强制跳转到登陆页面
            location.href = '/login.html'
        }

    }
})