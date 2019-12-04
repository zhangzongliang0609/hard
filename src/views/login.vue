<template>
    <header class="navbar-wrapper login-bar">
        <div class="navbar navbar-fixed-top">
            <div class="container-fluid cl">
                <!--<a class="logo navbar-logo f-l mr-10" href="/aboutHui.shtml">-->
                <!--<img src="../assets/images/logo.png"/>-->
                <!--智慧后勤管理系统-->
                <!--</a> -->
                <span id="J-company" class="logo navbar-slogan f-l"></span>
                <nav class="navbar-userbar f-r">
                    <!-- <a href="javascript:void(0);" class="btn btn-primary radius" v-link="{ name: 'register' }" data-title="注册" href="javascript:;">注册</a> -->
                </nav>
            </div>
        </div>
    </header>

    <div class="loginWraper">
        <div id="loginform" class="loginBox">
            <form id="J-sign-in" class="form form-horizontal">
                <div class="row cl">
                    <label class="form-label col-xs-3"><i class="Hui-iconfont">&#xe60d;</i></label>
                    <div class="formControls col-xs-8">
                        <input v-model.trim="username" name="username" type="text" placeholder="账户" class="input-text size-L">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label col-xs-3"><i class="Hui-iconfont">&#xe60e;</i></label>
                    <div class="formControls col-xs-8">
                        <input id="passwordId" v-model.trim="password" name="password" type="password" placeholder="密码" class="input-text size-L">
                    </div>
                </div>
                <div class="row cl">
                    <div class="formControls col-xs-8 col-xs-offset-3">
                        <button id="login" type="submit" class="btn btn-success radius size-L">登录</button>
                        <!-- <button id="login" type="submit" disabled="true" class="btn btn-success radius size-L">登录</button> -->
                        <!-- <a class="btn btn-primary radius size-L ml-10" v-link="{ name: 'register' }" data-title="注册" href="javascript:;">注册</a> -->
                        <!-- <a class="btn btn-secondary-outline radius size-s ml-10" v-link="{ name: 'modifypassword' }" data-title="修改密码" href="javascript:;">忘记密码？修改密码</a> -->
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
<style>
    a.btn-secondary-outline {
        color: white;
        background-color: transparent;
        background-image: none;
        border-color: #3bb4f2;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';

    export default {
        ready () {
//        setTimeout(function () {
//            window.location.reload();
//        },0)
            this.loginInit();
            let that = this;
            $('#J-start-loading').remove();
            $('#J-sign-in').validate({
                rules: {
                    username: {
                        required: true,
                    },
                    password: {
                        required: true
                    }
                },
                errorPlacement: function (error, element) {
                    error.appendTo(element.closest('.formControls'));
                },
                submitHandler: function () {
                    // 登录
                    layer.load();
                    let loginTimes = 0;
                    jQuery.ajax({
                        url: base.gAjaxUrl.adminLogin,
                        type:"POST",
                        data: {
                            phone: that.username,
                            password: that.password
                        },
                        success: function (data) {
                            base.ajaxCallback(data, function () {
                                console.log('login', data);
//                        var lengths = $('#passwordId').val().length;
//                        if(lengths < 6){
//                        // layer.msg('您设置的密码长度过于简单，请赶紧修改密码!');
//                          layer.alert('您设置的密码长度过于简单，请赶紧修改密码!', {icon: 6});
//                        }
                                localStorage.clear();
                                let loginToken = data.token;
                                GLOBAL_AUTHOR = loginToken;
                                // 记录token
                                localStorage.token = loginToken;
                                localStorage.companyName = data.company_vo ? data.company_vo.company_name : '-';
                                localStorage.companyID = data.company_vo ? data.company_vo.id : '';
                                localStorage.user_name = data.user_name ? data.user_name : '';
                                localStorage.user_id = data.id ? data.id : '';
                                localStorage.is_super = data.is_super;
                                $('#J-company').text(localStorage.companyName);

                                $.ajaxSetup({
                                    beforeSend: function (xhr, urlData) {
                                        let localAuthor = localStorage.token;
                                        if (GLOBAL_AUTHOR != localAuthor && loginTimes > 0) {
                                            layer.msg("登陆信息已更新，请重新登录", {icon: 2, time: 1500});
                                            GLOBAL_AUTHOR = null;
                                            loginTimes = 0;
                                            window.location.href = '/#!/login';
                                            return false;
                                        }
                                        if(urlData.url.indexOf('?') == -1){
                                            urlData.url =  urlData.url + ("?_key=" + window.location.hash.slice(3));
                                            // urlData.url += `?_key=${window.location.hash.slice(3,)}`
                                        }else{
                                            // urlData.url += `&_key=${window.location.hash.slice(3,)}`
                                            urlData.url = urlData.url + ("&_key=" + window.location.hash.slice(3));
                                        }
                                        xhr.setRequestHeader("authorization", loginToken);
                                        loginTimes++;
                                    },
                                });
                                layer.closeAll('loading');

                                // that.$route.router.go({path: '/departmentEmployee', replace: true});
                                /*登录成功后用于计录登录错误的标志还原为初始状态*/
                                localStorage.countlogin = 0;
                                localStorage.loginTimeStart = 0;
                                that.$emit('global', 'PB_LOGIN_IN');
                            });
                        },
                        error: function (data) {
                            //加载层-默认风格
                            layer.load();
                            //此处自动关闭
                            setTimeout(function () {
                                layer.closeAll('loading');
                            }, 1000);
                            layer.msg('登录失败!请检查账号或密码是否正确!', {icon:2,time:1500});
                            // let dataResponseText = JSON.parse(data.responseText).detail
                            // var num = 10;
                            // if (dataResponseText.code == "ADMIN_LOGIN_FAIL") {
                            //     /*将字符串转换为数值*/
                            //     var countlogin = parseInt(localStorage.getItem('countlogin'));
                            //     /*当登录次数大于3 时就限制登录的操作*/
                            //     if (countlogin >= 9) {
                            //         $('#login').addClass('disabled');
                            //         $('#login').removeClass('btn-success');
                            //         $('#login').attr('disabled', 'disabled');
                            //         layer.msg('今天登录错误次数已经超出限制了，请明天再来!');
                            //         /*设置不能登录时的时间并存在本地，用于下次进入计数是否已经过了设定时间*/
                            //         var loginTimeStart = new Date().getTime();
                            //         localStorage.loginTimeStart = loginTimeStart;
                            //     }
                            //     /*还能登录的剩余次数*/
                            //     var remainingNumber = 10 - countlogin - 1;
                            //     var countloginTime1 = countlogin + 1;
                            //     var str = '今天登录错误次数已经第' + countloginTime1 + '次了，还有' + remainingNumber + '次机会';
                            //     if (countlogin > 1 && countlogin < 9) {
                            //         layer.msg(str);
                            //     }
                            //     /*登录失败后计数加1*/
                            //     localStorage.countlogin = ++countlogin;
                            //
                            //     return countlogin;
                            // }
                            // else {
                            //     layer.msg('登录失败!');
                            // }

                        },
                    });
                }
            });
        },
        data: function () {
            return {
                username: '',
                password: '',
            }
        },
        methods: {
            loginInit: function () {
                /*获取最新时间和上次登录失败的时间*/
                var loginTimeStartEnd = new Date().getTime();
                var loginTimeStart = parseInt(localStorage.getItem('loginTimeStart'));
                /*计算两次时间之差*/
                var loginCountTime = loginTimeStartEnd - loginTimeStart;
                /*两次时间之差超过设置值，重新可以登录，其他值也还原为初始值*/
                if (loginCountTime > 86400000) {
                    $('#login').removeClass('disabled');
                    $('#login').addClass('btn-success');
                    $('#login').removeAttr('disabled');
                    localStorage.countlogin = 0;
                    localStorage.loginTimeStart = 0;
                }
                /*防止刷新后能登录*/
                var countlogin = parseInt(localStorage.getItem('countlogin'));
                if (countlogin >= 10) {
                    $('#login').addClass('disabled');
                    $('#login').removeClass('btn-success');
                    $('#login').attr('disabled', 'disabled');
                    layer.msg('今天登录错误次数已经超出限制了，请明天再来!');
                }
            }
        }
    }

</script>
<style lang="less">
    @import '../assets/css/PB-ui.login.css';

    .loginWraper {
        z-index: 100;

    label.error {
        right: 65px;
        top: 9px;
        font-size: 14px
    }

    }
    .navbar-wrapper {
        position: relative;
        z-index: 99;
    }
</style>
