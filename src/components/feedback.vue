<template>
<div class="layui-layer layui-anim layui-layer-page layui-modify">
    <div class="layui-layer-title">{{title}}</div>
    <div class="layui-layer-content">
        <form id="J-layer-form" class="form form-horizontal layui-layer-wrap w-600 mt-0-auto">
            <div>其他反馈:以推送的形式发送至对应员工的APP上</div>
            <div class="row cl">
                <textarea v-model="contentInput" type="text" class="textarea radius" value="" placeholder="请输入您所需要反馈的内容,最多可输入100字" name="content"></textarea>
            </div>
            <div class="clearfix">
                <div class="layui-layer-btn f-r" v-on:click="save"><a class="layui-layer-btn0" v-if="type!='check'">确认发送</a></div>
                <div class="layui-layer-btn f-r" v-on:click="close()"><a class="layui-layer-btn1" v-if="type!='check'">取&nbsp;&nbsp;&nbsp;&nbsp;消</a></div>
            </div>
        </form>
    </div>
    <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
    
</div>
<div class="layui-layer-shade"></div>
</template>

<style lang="less">
    #J-layer-form .layui-layer-btn{
        position: relative;
    }
</style>
<script>
import * as base from '../assets/js/base.js';

    export default{
        ready () {
            let that = this;
            let ajaxUrl = '';
            let ajaxType = '';
            let getData = this.data;

            base.verticalCenter('.layui-modify');

            ajaxType = 'POST';
            ajaxUrl = `${base.gAjaxUrl.applysettleorders}${getData.id}/feedback/`;

            //验证
            $('#J-layer-form').validate({
                rules: {
                    building_name: {
                        content: true,
                    },
                },
                submitHandler:function() {
                    $.ajax({
                        url: ajaxUrl,
                        type:ajaxType,
                        data: {
                            content: that.contentInput,
                            //floor_num: that.floorNumInput,
                        },
                    })
                    .always(function(data) {
                        base.ajaxCallback(data,function(){
                            layer.msg('提交成功',{icon:1,time:1000});
                            that.$dispatch('dialog-save');
                        });
                    });

                }
            });
        },
        props: ['title','type','data'],
        data:function(){
            return {
                contentInput:'',
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
