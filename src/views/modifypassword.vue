<template>
<header class="navbar-wrapper login-bar">
  <div class="navbar navbar-fixed-top">
    <div class="container-fluid cl"> 
      <a class="logo navbar-logo f-l mr-10" href="/aboutHui.shtml">
        <img src="../assets/images/logo.png"/>
        E企行 智慧后勤
      </a> 
      <span id="J-company" class="logo navbar-slogan f-l"></span>
      <nav class="navbar-userbar f-r">
        <a href="javascript:void(0);" class="btn btn-success radius" v-link="{ name: 'login' }" data-title="登录" href="javascript:;">登录</a>
      </nav>
    </div>
  </div>
</header>
<div class="loginWraper loginWraper-modifypassword">
  <!-- <div class="layui-layer-title   va-m">修改密码</div> -->
  <!-- <h3 class="va-m">修改密码</h3> -->
  <div id="loginform" class="modifypasswordBox loginBox-modifypassword ">
    <form id="J-sign-out" class="form mt-50 form-horizontal">
      <div class="row cl">
        <!-- <h3 class="text-c va-m c-primary">修改密码</h3> -->
        <h3 class="c-primary text-modify">修改密码</h3>
      </div>
      <div class="row cl">
        <label class="form-label col-xs-3">手机号码:</label>
        <div class="formControls col-xs-8">
          <input id="phone" v-model="phone" name="phone" type="text" placeholder="请输入手机号码" class="input-text">
        </div>
      </div>
      <div class="row cl">
        <label class="form-label col-xs-3">短信验证码:</label>
        <div class="formControls col-xs-8 verify-code">
          <input id="phoneCode" v-model="phoneCode" name="phoneCode" type="text" placeholder="短信验证码" class="f-l input-text">
          <a id="get_code" href="javascript:;" class="btn btn-secondary radius ml-5">获取验证码</a>
        </div>
      </div>
      <!-- <div class="row cl">
        <label class="form-label col-xs-3">用过的密码:</label>
        <div class="formControls col-xs-8">
          <input id="usedPassword" v-model="usedPassword" name="usedPassword" type="password" placeholder="请输入用过的密码" class="input-text">
        </div>
      </div> -->
      <div class="row cl ">
        <label class="form-label col-xs-3">新密码:</label>
        <div class="formControls col-xs-8 ">
          <input id="password" v-model="password" name="password" type="password" placeholder="请输入密码" class="input-text">
        </div>
      </div>
      <div class="row cl ywz_zhuce_xiaoxiaobao">
        <div class="ywz_zhuce_huixian" id='pwdLevel_1'> </div>
        <div class="ywz_zhuce_huixian" id='pwdLevel_2'> </div>
        <div class="ywz_zhuce_huixian" id='pwdLevel_3'> </div>
        <div class="ywz_zhuce_hongxianwenzi"> 弱</div>
        <div class="ywz_zhuce_hongxianwenzi"> 中</div>
        <div class="ywz_zhuce_hongxianwenzi"> 强</div>
      </div>
      <div class="row cl">
        <label class="form-label col-xs-3">确认新密码:</label>
        <div class="formControls col-xs-8">
          <input id="confirm_password" v-model="confirm_password" name="confirm_password" type="password" placeholder="请输入密码" class="input-text">
        </div>
      </div>
      <div class="row cl">
        <div class="formControls col-xs-8 col-xs-offset-3">
          <button type="submit" class="btn-register btn-modifypassword btn btn-primary text-c radius size-L" v-on:click ="submits()" >提交</button>
        </div>
      </div>
    </form>
  </div>
</div>
</template>
<style  scoped>
  .ywz_zhuce_xiaoxiaobao{ width:226px; margin-left: 200px; }
  .ywz_zhuce_kuangzilu{ float:left; width:105px;}
  .ywz_zhuce_huixian{ float:left; background:#d6d3d3; width:62px; height:4px; margin-top:5px; _margin-top:0px; margin-left:5px; _height:2px;font-size:0px;}
  .ywz_zhuce_hongxianwenzi{ float:left; width:62px; margin-left:5px; text-align:center; color:#03051f; font-size:12px; }
  .ywz_zhuce_hongxian{ float:left; background:#ff3300; width:62px; height:4px; margin-top:5px; margin-left:5px; _margin-top:0px;_height:2px; font-size:0px;}
  .ywz_zhuce_hongxian2{ float:left; background: #099; width:62px; height:4px; margin-top:5px; margin-left:5px; _margin-top:0px;_height:2px; font-size:0px;}
  .ywz_zhuce_hongxian3{ float:left; background: #060; width:62px; height:4px; margin-top:5px; margin-left:5px; _margin-top:0px;_height:2px; font-size:0px;}
</style>

<script>
  import * as base from '../assets/js/base.js';

  export default {
      ready () {
        /*密码强度的显示*/
        $('#password').focus(function () {
          $('#pwdLevel_1').attr('class', 'ywz_zhuce_hongxian');
          $('#password').keyup();
        });

        $('#password').keyup(function () {
          var __th = $(this);

          if (!__th.val()) {
            $('#pwd_tip').hide();
            $('#pwd_err').show();
            Primary();
            return;
          }
          if (__th.val().length < 6) {
            $('#pwd_tip').hide();
            $('#pwd_err').show();
            Weak();
            return;
          }
          var _r = checkPassword(__th);
          if (_r < 1) {
            $('#pwd_tip').hide();
            $('#pwd_err').show();
            Primary();
            return;
          }

          if (_r > 0 && _r < 2) {
            Weak();
          } else if (_r >= 2 && _r < 4) {
            Medium();
          } else if (_r >= 4) {
            Tough();
          }

          $('#pwd_tip').hide();
          $('#pwd_err').hide();
        });

        function Primary() {
          $('#pwdLevel_1').attr('class', 'ywz_zhuce_huixian');
          $('#pwdLevel_2').attr('class', 'ywz_zhuce_huixian');
          $('#pwdLevel_3').attr('class', 'ywz_zhuce_huixian');
        }

        function Weak() {
          $('#pwdLevel_1').attr('class', 'ywz_zhuce_hongxian');
          $('#pwdLevel_2').attr('class', 'ywz_zhuce_huixian');
          $('#pwdLevel_3').attr('class', 'ywz_zhuce_huixian');
        }

        function Medium() {
          $('#pwdLevel_1').attr('class', 'ywz_zhuce_hongxian');
          $('#pwdLevel_2').attr('class', 'ywz_zhuce_hongxian2');
          $('#pwdLevel_3').attr('class', 'ywz_zhuce_huixian');
        }

        function Tough() {
          $('#pwdLevel_1').attr('class', 'ywz_zhuce_hongxian');
          $('#pwdLevel_2').attr('class', 'ywz_zhuce_hongxian2');
          $('#pwdLevel_3').attr('class', 'ywz_zhuce_hongxian3');
        }

        function checkPassword(pwdinput) {
          var maths, smalls, bigs, corps, cat, num;
          var str = $(pwdinput).val()
          var len = str.length;

          var cat = /.{13}/g
          if (len == 0) return 1;
          if (len > 13) { $(pwdinput).val(str.match(cat)[0]); }
          cat = /.*[\u4e00-\u9fa5]+.*$/
          if (cat.test(str)) {
            return -1;
          }
          cat = /\d/;
          var maths = cat.test(str);
          cat = /[a-z]/;
          var smalls = cat.test(str);
          cat = /[A-Z]/;
          var bigs = cat.test(str);
          var corps = corpses(pwdinput);
          var num = maths + smalls + bigs + corps;

          if (len < 4) { return 1; }

          if (len >= 4 && len <= 7) {
            if (num == 1) return 1;
            if (num == 2 || num == 3) return 2;
            if (num == 4) return 3;
          }

          if (len > 7 && len <= 9) {
            if (num == 1) return 2;
            if (num == 2) return 3;
            if (num == 3) return 4;
            if (num == 4) return 5;
          }

          if (len > 9) {
            if (num == 1) return 3;
            if (num == 2) return 4;
            if (num > 2) return 5;
          }
        }

        function corpses(pwdinput) {
          var cat = /./g
          var str = $(pwdinput).val();
          var sz = str.match(cat)
          for (var i = 0; i < sz.length; i++) {
            cat = /\d/;
            var maths_01 = cat.test(sz[i]);
            cat = /[a-z]/;
            var smalls_01 = cat.test(sz[i]);
            cat = /[A-Z]/;
            var bigs_01 = cat.test(sz[i]);
            if (!maths_01 && !smalls_01 && !bigs_01) { return true; }
          }
          return false;
        }

        /*获取验证码*/
        $("#get_code").click(function(){
          let that = this;
          let phone = $('#phone').val();
          $.ajax({
              type : "GET",
              async: true,
              url : 'https://api.pinbayun.com/api/v1/admin/anonymous/auth_code/',
              dataType : "json",
              //jsonp: "cb",
              data: {
                      phone: phone,
                    },
              success : function(data){
                layer.msg('验证码已经发送，请注意查收!',{icon:1,time:2000}); 
              },
              error:function(data){
                // error = JSON.parse(data.responseText);
                  layer.msg("出错了！", function(){
                     layer.msg('请注意!', {icon: 6});
                }); 
              },
            });

          
        });

        let that = this;
        $.validator.addMethod('mobile', function( value, element ){
            // /^1\d{10}$/ 来自支付宝的正则
            return this.optional( element ) || /^1\d{10}$/.test( value );
        }, '请输入正确的手机号码');
        //remote:    发送ajax请求验证(常用案例就是在注册时，验证用户名是否存在)，
        // 注：请求返回的 response === true || response === 'true'，才算验证通过，这需要后端的配合
        $.validator.addMethod('checkPassword', function( value, element ){
            /*function checkPasswordComplexity(){
              var str = $('#password').val()
              var cat = /./g
              var sz = str.match(cat)
              for (var i = 0; i < sz.length; i++) {
                cat = /\d/;
                var maths_01 = cat.test(sz[i]);
                cat = /[a-z]/;
                var smalls_01 = cat.test(sz[i]);
                cat = /[A-Z]/;
                var bigs_01 = cat.test(sz[i]);
                var flags,isTrue;
                isTrue = (maths_01 == 'true' && smalls_01 == 'true') || (smalls_01 == 'true' && bigs_01 == 'true') || (maths_01 == 'true' && bigs_01 == 'true')
                if (isTrue == 'true') { 
                  return flags = true; 
                }
                else {
                  return flags = false;
                }
              } 
              // return flags;         
            }
            var flag = checkPasswordComplexity();*/
            function checkPass(pass){
                 if(pass.length < 6){
                      return 0;
                  }
                 var ls = 0;
                 if(pass.match(/([a-z])+/)){                 
                     ls++;               
                  }
                 if(pass.match(/([0-9])+/)){
                     ls++;  
                 }
                 if(pass.match(/([A-Z])+/)){                      
                     ls++;               
                  }              
                 return ls;             
              }

            var flag = checkPass($('#password').val()) >= 2 ? true : false;
            console.log(flag);    
            // console.log(typeof(flag));    
            return this.optional( element ) || (flag==true);

        }, '密码至少包含大写字母、小写字母、数字其中两种');

        $('#J-sign-out').validate({    
            rules: {    
                phone:{
                    required: true,
                    mobile: true,
                    // remote:          
                },        
                phoneCode:{
                    required: true,
                    rangelength:[6,6],
                    digits:true,                 
                },
                usedPassword: {
                  required: true,
                  // remote:          
                },
                password:{
                    required: true,
                    rangelength:[6,12],
                    checkPassword: true
                },
                confirm_password: {
                    required: true,
                    equalTo: "#password",
                    rangelength:[6,12]
                },
            },
            messages: {
              phone:{
                required: "请先输入11位手机号哦！",
                minlength: "请输入正确的11位手机号!",
              },
              usedPassword: {
                required: "请输入之前用过的密码",
              },
              password: {
                required: "请输入密码",
                rangelength: "密码在6~12个字符之间",
              },
              confirm_password: {
                required: "请输入确认密码",
                rangelength: "密码在6~12个字符之间",
                equalTo: "两次输入密码不一致"
              },
              phoneCode: {
                required: "请输入短信验证码",
                rangelength: "短信验证码由6个数字组成！"
              },
            },                 
            errorPlacement: function(error, element) {
              error.appendTo( element.closest('.formControls'));
            }, 
            submitHandler: function() {
              alert('success')
            }             
        }); 
      },
      data:function(){
          return {
              username:'',
              password:'',
          }
      },
      methods:{
        submits: function() {
            let that = this;
            let phone = $('#phone').val();
            let phoneCode = $('#phoneCode').val();
            let usedPassword = $('#usedPassword').val();
            let password = $('#password').val();
            let confirm_password = $('#confirm_password').val();

            $.ajax({
            type : "POST",
            async: true,
            url : 'https://api.pinbayun.com/api/v1/admin/anonymous/register/',
            dataType : "json",
            //jsonp: "cb",
            data: {
                         phone: phone,
                         phoneCode: company_name,
                         password1: password1,
                         password2: password2,
                         code: code,
                  },
            success : function(data){
              layer.msg('注册成功!',{icon:1,time:2000});
                  $('#signupForm input').val('');
                  $('#get_code').val('获取验证码');
                  $('#submit').val('立即注册');
            },
            error:function(data){
              // console.log(data.responseText);
                // console.log('fail');
                error = JSON.parse(data.responseText);
                // console.log(error.msg);
                // layer.msg('不开心。。', {icon: 5});
                layer.msg(error.detail.msg, function(){
                   layer.msg('请注意输入的信息是否正确!', {icon: 6});
              }); 
            },
          });
          
        },

      }
  }
</script>
