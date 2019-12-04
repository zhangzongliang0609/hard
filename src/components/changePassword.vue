<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">修改密码</div>
        <div class="layui-layer-content">
            <form id="J-layer-form" class="form form-horizontal layui-layer-wrap">
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>旧密码：</label>
                    <div class="formControls f-l col-4">
                        <input id="oldPassword" type="password" class="input-text" value="" placeholder="请填写旧密码" name="oldPassword">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>新密码：</label>
                    <div class="formControls f-l col-4">
                        <input id="newPassword" type="password" class="input-text" value="" placeholder="请填写新密码" name="newPassword">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>确认新密码：</label>
                    <div class="formControls f-l col-4">
                        <input id="newPasswordAgain" type="password" class="input-text" value="" placeholder="请确认新密码" name="newPasswordAgain">
                    </div>
                </div>
                <div class="row cl">
                    <div class="col-offset-4 f-l col-4" v-on:click="save">
                        <a class="btn btn-primary radius centerBtn">确认修改</a>
                    </div>
                </div>
            </form>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
        </span>
        <!--<div class="layui-layer-btn centerBtn" v-on:click="save"><a class="layui-layer-btn0">确认修改</a></div>-->
    </div>
    <div class="layui-layer-shade"></div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    export default{
        ready () {

            base.verticalCenter('.layui-modify');

            //验证
            $('#J-layer-form').validate({    
                rules: {
                    oldPassword: {
                        required: true,
                    },
                    newPassword: {
                        required: true,
                    },
                    newPasswordAgain: {
                        required: true,
                        equalTo: "#newPassword"
                    },
                },                 
                submitHandler: () => {
                    this.itemsLoading = true;
                    $.ajax({
                        url: base.gAjaxUrl.resetPassword,
                        type: 'POST',
                        data: {
                            oldpassword: $("#oldPassword").val(),
                            newpassword: $("#newPasswordAgain").val(),
                        },
                    })
                    .always((data) => {
                        this.itemsLoading = false;
                        base.ajaxCallback(data, () => {
                            layer.msg("修改成功", {icon: 1, time: 1500});
                            this.close();
                        });
                    });
                }
            }); 
        },
        data:function(){
            return {
                oldPassword: '',
                newPassword: '',
                newPasswordAgain: '',
                itemsLoading: false,
            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            save:function(){
                $('#J-layer-form').submit();
            }
        }
    }
</script>
<style rel="stylesheet/less" scoped>
    .centerBtn {
        width: 100%;
    }
</style>
