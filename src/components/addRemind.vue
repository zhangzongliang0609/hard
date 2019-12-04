<template>
<div class="layui-layer layui-anim layui-layer-page layui-modify">
    <div class="layui-layer-title">{{title}}</div>
    <div class="layui-layer-content">
        <form id="J-layer-form" class="form form-horizontal layui-layer-wrap lh-30">
            <div class="row cl">
                <label class="form-label f-l col-4 "><span class="c-red">*</span>标题：</label>
                <div class="formControls f-l col-4">
                    <input v-model="remindTitle" id="remindTitle" type="text" class="input-text" value="" placeholder="标题(15个字以内)" name="remindTitle">
                </div>
            </div>
            <div class="row cl">
                <label class="form-label f-l col-4 "><span class="c-red">*</span>提醒内容：</label>
                <div class="formControls f-l col-4">
                    <textarea v-model="remindContent" id="remindContent" type="text" class="input-text" value="" placeholder="提醒内容(60个字以内)" name="remindContent"></textarea>
                </div>
            </div>
            <div class="row cl">
                <label class="form-label f-l col-4 "><span class="c-red">*</span>提醒日期：</label>
                <div class="formControls f-l col-4">
                    <input v-model="remind_time" id="remind_time" type="text" class="input-text" value="" placeholder="" name="remind_time">
                </div>
            </div>
            <div class="row cl">
                <label class="form-label f-l col-4 "><span class="c-red">*</span>重复：</label>
                <div class="formControls f-l col-4">
                    <!-- 原型上没有，但是接口有这个参数: 一次 -->
                    <input type="radio" id="once" value="1" v-model="remind_type">
                    <label for="once">一次</label>
                    <input type="radio" id="month" value="2" v-model="remind_type">
                    <label for="month">每月</label>
                    <input type="radio" id="tMonth" value="3" v-model="remind_type">
                    <label for="tMonth">三个月</label>
                    <input type="radio" id="hYear" value="4" v-model="remind_type">
                    <label for="hYear">半年</label>
                    <input type="radio" id="year" value="5" v-model="remind_type">
                    <label for="year">一年</label>
                </div>
            </div>
            <div class="row cl">
                <!--<label class="form-label f-l col-4 "><span class="c-red">*</span>手机短信通知：</label>-->
                <label class="form-label f-l col-4 "><span class="c-red"></span>手机短信通知：</label>
                <div class="formControls f-l col-4">
                    <input v-model="phone" id="phone" type="text" class="input-text" value="" placeholder="" name="phone">
                </div>
            </div>
            <div class="row cl">
                <label class="form-label f-l col-4 "><span class="c-red">*</span>是否启用：</label>
                <div class="formControls f-l col-4">
                    <input type="radio" id="yes" value="1" v-model="is_action">
                    <label for="yes">是</label>
                    <input type="radio" id="no" value="0" v-model="is_action">
                    <label for="no">否</label>
                </div>
            </div>
            <div class="row cl">
                <div class="c-red row col-push-2 col-10">
                    注：1.提醒事项提醒时间为早上08:30<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.如果选择的日期，重复所在当月没有所选的日期，会默认为重复当月最后一天进行提醒。<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如：提醒日期选择2018年1月31日，重复为每月，则会默认在2018年2月28日提醒
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
    #remindContent {
        height: 160px;
    }
    #J-layer-form input[type=radio]{
        line-height: 30px;
        vertical-align: middle;
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
            new Kalendae.Input("remind_time", {
                months: 1,
                clickHide: true,

            });
            this.getTime();
//            this.remind_time = moment().add(1, "month").format("YYYY-MM-DD");
            //类型判断
            if(this.type == 'add'){
                ajaxUrl = base.gAjaxUrl.remind;
                ajaxType = 'POST';
            } else if (this.type == 'modify'){
                ajaxUrl = `${base.gAjaxUrl.remind}${getData.id}/`;
                ajaxType = 'PUT';
                this.remind_time = (getData.remind_time && typeof getData.remind_time == "string") ? getData.remind_time : "--";
                this.remindTitle = getData.title;
                this.remindContent = getData.content;
                this.remind_type = getData.remind_type;
                this.is_action = getData.is_action ? "1" : "0";
                this.phone = getData.phone;
            }
            $.validator.addMethod('mobile', function( value, element ){
                return this.optional( element ) || /^1\d{10}$/.test( value );
            }, '请输入正确的手机号码');
            //验证
            $('#J-layer-form').validate({
                rules: {
                    remindTitle: {
                        required: true,
                        maxlength: 15,
                    },
                    remindContent: {
                        required: true,
                        maxlength: 60,
                    },
                    remind_time: {
                        required: true,
                        dateISO:true
                    },
                    phone: {
//                        required: true,
                        mobile: true,
                    }
                },
                submitHandler:function() {
                    var obj = {
                        title: that.remindTitle,
                        content: that.remindContent,
                        remind_time: that.remind_time,
                        remind_type: that.remind_type,
                        phone: that.phone,
                        is_action: that.is_action == "1",
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
                remindTitle: '',
                remindContent: '',
                remind_type: 1,
                remind_time: '',
                phone: '',
                is_action: "1",
                nowaday: 0,
            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            save:function(){
                if(this.remind_type === 1 && this.nowaday >= new Date(this.remind_time + " 08:30").getTime()) {
                    layer.msg("您当前所设置的时间已过提醒时间，请重新设置",{icon:2, time: 1500});
                    return;
                }
                $('#J-layer-form').submit();
            },
            getTime: function () {
                $.ajax({
                    url: base.gAjaxUrl.time,
                    type: 'GET',
                }).always((data)=> {
                    this.nowaday = new Date(data.full).getTime();
//                    console.log(data);
                })
            },
        },
    }
</script>
