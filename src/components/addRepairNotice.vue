<template>
<div class="layui-layer layui-anim layui-layer-page layui-modify">
    <div class="layui-layer-title">{{title}}</div>
    <div class="layui-layer-content">
        <form id="J-layer-form" class="form form-horizontal layui-layer-wrap lh-30">
            <div class="row cl">
                <label class="form-label f-l col-4 "><span class="c-red">*</span>姓名：</label>
                <div class="formControls f-l col-4">
                    <input v-model="real_name" id="real_name" type="text" class="input-text" value="" placeholder="标题(15个字以内)" name="real_name">
                </div>
            </div>
            <div class="row cl">
                <label class="form-label f-l col-4 "><span class="c-red">*</span>联系电话：</label>
                <div class="formControls f-l col-4">
                    <input v-model="phone" autocomplete="off" id="phone" type="text" class="input-text" value="" placeholder="" name="phone"/>
                </div>
            </div>
            <div class="row cl">
                <label class="form-label f-l col-4 "><span class="c-red">*</span>提示类型：</label>
                <div class="formControls f-l col-4">
                    <select class="select" v-model="remind_type" name="remind_type" id="remind_type">
                        <option value="1">申请后</option>
                        <option value="2">接单后</option>
                    </select>
                </div>
            </div>
            <div class="row cl">
                <label class="form-label f-l col-4 "><span class="c-red">*</span>提示时间：</label>
                <div class="formControls f-l col-4 relative remind_time_box" >
                    <select class="select" @mousedown="showType($event)" @change="hideType($event)" @blur="hideType($event)" v-model="remind_time" size="1" name="remind_time" id="remind_time">
                        <option value="1">1小时</option>
                        <option value="2">2小时</option>
                        <option value="3">3小时</option>
                        <option value="4">4小时</option>
                        <option value="5">5小时</option>
                        <option value="6">6小时</option>
                        <option value="7">7小时</option>
                        <option value="8">8小时</option>
                        <option value="9">9小时</option>
                        <option value="10">10小时</option>
                        <option value="11">11小时</option>
                        <option value="12">12小时</option>
                        <option value="24">24小时</option>
                        <option value="48">两天</option>
                        <option value="72">三天</option>
                        <option value="96">四天</option>
                        <option value="120">五天</option>
                        <option value="144">六天</option>
                        <option value="168">七天</option>
                    </select>
                </div>
            </div>
        </form>

    </div>
    <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
    <div class="layui-layer-btn" v-on:click="save"><a class="layui-layer-btn0" v-if="type!='check'">保存</a></div>
</div>
<div class="layui-layer-shade"></div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>

<style lang="less" scoped>
    .layui-layer.layui-layer-page .layui-layer-content {
        padding-bottom: 200px;
    }
    #J-layer-form input[type=radio]{
        line-height: 30px;
        vertical-align: middle;
    }
    #remind_time {
        position: absolute;
        left: 0;
        top: 0;
        height: 31px;
        line-height: 31px;
    }

</style>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import moment from 'moment';

    export default{
        ready () {
            let that = this;
            let ajaxUrl = '';
            let ajaxType = '';
            let getData = this.data;
            base.verticalCenter('.layui-modify');
            //类型判断
            if(this.type == 'add'){
                ajaxUrl = base.gAjaxUrl.remind;
                ajaxType = 'POST';
            } else if (this.type == 'modify'){
                ajaxUrl = `${base.gAjaxUrl.remind}${getData.id}/`;
                ajaxType = 'PUT';
                this.real_name = getData.real_name;
                this.phone = getData.phone;
                this.remind_type = getData.remind_type;
                this.remind_time = getData.remind_time;
            }
            $.validator.addMethod('mobile', function( value, element ){
                return this.optional( element ) || /^1\d{10}$/.test( value );
            }, '请输入正确的手机号码');
            //验证
            $('#J-layer-form').validate({
                rules: {
                    real_name: {
                        required: true,
                        maxlength: 15,
                    },
                    phone: {
                        required: true,
                        mobile: true,
                    },
                },
                submitHandler:function() {
                    var obj = {
                        real_name: that.real_name,
                        phone: that.phone,
                        remind_time: that.remind_time,
                        remind_type: that.remind_type
                    };
                    that.itemsLoading = true;
//                    console.log(obj);
                    $.ajax({
                        url: ajaxUrl,
                        type:ajaxType,
                        data: obj,
                    })
                    .always(function(data) {
                        that.itemsLoading = false;
                        base.ajaxCallback(data,function(){
                            layer.msg('提交成功',{icon:1,time:1500});
                            that.$dispatch('dialog-save');
                        });
                    });
                }
            });
        },
        props: ['title','type','data'],
        data:function(){
            return {
                itemsLoading: false,
                real_name: '',
                phone: '',
                remind_type: 1,
                remind_time: 1,
            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            save:function(){
                $('#J-layer-form').submit();
            },
            showType: function (e) {
                var target = e.target;
                target.size = 5;
                target.style.height = "auto";
            },
            hideType: function (e) {
                var target = e.target;
                target.size = 1;
                target.style.height = "31px";
            }
        },
    }
</script>
