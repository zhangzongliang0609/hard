<template>
<header class="navbar-wrapper login-bar">
  <div class="navbar navbar-fixed-top">
    <div class="container-fluid cl"> 
      <a class="logo navbar-logo f-l mr-10" href="/aboutHui.shtml">
        <img src="../assets/images/logo.png"/>
        用心做好企业出行
      </a> 
      <span id="J-company" class="logo navbar-slogan f-l"></span>
      <nav class="navbar-userbar f-r">
        <a href="javascript:void(0);" class="btn btn-success radius" v-link="{ name: 'login' }" data-title="登录" href="javascript:;">登录</a>
      </nav>
    </div>
  </div>
</header>
<div class="loginWraper loginWraper-register">
  <div id="loginform" class="loginBox loginBox-register">
    <form id="J-sign-out" class="form form-horizontal">
      <div class="row cl">
        <label class="form-label col-xs-3">手机号码:</label>
        <div class="formControls col-xs-8">
          <input v-model="username" name="phone" type="text" placeholder="请输入手机号码" class="input-text">
        </div>
      </div>
      <div class="row cl">
        <label class="form-label col-xs-3">图形验证码:</label>
        <div class="formControls col-xs-8 verify-code">
          <input v-model="username" name="picCode" type="text" placeholder="请输入图形验证码" class="f-l input-text">
          <img class="pic f-l ml-5" src="http://www.uhoopb.com/images/58x58.png"/>
          <a href="javascript:;" class="btn btn-link">看不清，换一张</a>
        </div>
      </div>
      <div class="row cl">
        <label class="form-label col-xs-3">短信验证码:</label>
        <div class="formControls col-xs-8 verify-code">
          <input v-model="username" name="phoneCode" type="text" placeholder="短信验证码" class="f-l input-text">
          <a href="javascript:;" class="btn btn-secondary radius ml-5">获取验证码</a>
        </div>
      </div>
      <div class="row cl">
        <label class="form-label col-xs-3">企业名称:</label>
        <div class="formControls col-xs-8">
          <input v-model="username" name="companyName" type="text" placeholder="请输入企业名称" class="input-text">
        </div>
      </div>
      <div class="row cl">
        <label class="form-label col-xs-3">所在地:</label>
        <div class="formControls col-xs-8">
          <input v-model="username" name="address" type="text" placeholder="请输入城市名称" class="input-text">
        </div>
      </div>
      <div class="row cl">
        <label class="form-label col-xs-3">公司地址:</label>
        <div class="formControls col-xs-8">
          <input v-model="username" name="companyAddress" type="text" placeholder="请输入公司地址" class="input-text">
        </div>
      </div>
      <div class="row cl">
        <label class="form-label col-xs-3">固定电话:</label>
        <div class="formControls col-xs-8">
          <input v-model="username" name="tel" type="text" placeholder="请输入固定电话" class="input-text">
        </div>
      </div>
      <div class="row cl">
        <label class="form-label col-xs-3">联系人:</label>
        <div class="formControls col-xs-8">
          <input v-model="username" name="contract" type="text" placeholder="请输入联系人" class="input-text">
        </div>
      </div>
      <div class="row cl">
        <label class="form-label col-xs-3">企业邮箱:</label>
        <div class="formControls col-xs-8">
          <input v-model="username" name="email" type="email" placeholder="请输入企业邮箱" class="input-text">
        </div>
      </div>
      <div class="row cl">
        <label class="form-label col-xs-3">密码:</label>
        <div class="formControls col-xs-8">
          <input v-model="username" name="password" type="password" placeholder="请输入密码" class="input-text">
        </div>
      </div>
      <div class="row cl">
        <label class="form-label col-xs-3">确认密码:</label>
        <div class="formControls col-xs-8">
          <input v-model="username" name="confirm_password" type="password" placeholder="请输入密码" class="input-text">
        </div>
      </div>
      <div class="row cl">
        <label class="form-label col-xs-3">公司类型:</label>
        <div class="formControls col-xs-8 m-radio">
          <label>
              <input type="radio" name="company_type" value="1"/>普通法人企业
          </label>
          <label>
              <input type="radio" name="company_type" value="2"/>非法人组织（如分公司、营业部、分店）
          </label>
        </div>
      </div>
      <div class="row cl">
        <label class="form-label col-xs-3">营业执照:</label>
        <div class="formControls col-xs-8 m-radio">
          
        </div>
      </div>
      <div class="row cl">
        <label class="form-label col-xs-3">办公现场照片:</label>
        <div class="formControls col-xs-8 m-radio">
          
        </div>
      </div>
      <div class="row cl">
        <div class="formControls col-xs-8 col-xs-offset-3">
          <button type="submit" class="btn-register btn btn-primary radius size-L">注册</button>
        </div>
      </div>
    </form>
  </div>
</div>
</template>
<script>
import * as base from '../assets/js/base.js';

export default {
    ready () {
      let that = this;
      $('#J-sign-out').validate({    
          rules: {    
              phone:{
                  required: true,
              },        
              picCode:{
                  required: true,
              },
              phoneCode:{
                  required: true,
              },
              companyName:{
                  required: true,
              },
              address:{
                  required: true,
              },
              companyAddress:{
                  required: true,
              },
              tel:{
                  required: true,
              },
              contract:{
                  required: true,
              },
              email:{
                  required: true,
              },
              password:{
                  required: true,
              },
              confirm_password: {
                  required: true,
                  equalTo: "#password"
              },
              company_type:{
                  required: true,
              }
          }, 
          messages:{
              company_type:{
                  required: '请选择',
              }
          },                
          errorPlacement: function(error, element) {
            error.appendTo( element.closest('.formControls'));
          }, 
          submitHandler:function() {
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
}
</script>
