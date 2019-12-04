<template>
<div class="layui-layer layui-anim layui-layer-page layui-modify">
    <div class="layui-layer-title">{{title}}</div>
    <div class="layui-layer-content">
        <form id="J-layer-form" class="form form-horizontal layui-layer-wrap">
            <div class="row cl">
                <label class="form-label f-l col-4 "><span class="c-red">*</span>类型名称：</label>
                <div class="formControls f-l col-4">
                    <input v-model="materialclassesInput" type="text" class="input-text" value="" placeholder="" name="name">
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
</template>

<style lang="less">

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

            //类型判断
            if(this.type == 'add'){
                ajaxUrl = base.gAjaxUrl.materialclasses;
                ajaxType = 'POST';
            }else if(this.type == 'modify'){
                ajaxUrl = `${base.gAjaxUrl.materialclasses}${getData.id}/`;
                ajaxType = 'PUT';
                this.materialclassesInput = getData.name;
            }

            //验证
            $('#J-layer-form').validate({
                rules: {
                    name: {
                        required: true,
                    },
                },
                submitHandler:function() {
                    $.ajax({
                        url: ajaxUrl,
                        type:ajaxType,
                        data: {
                            name: that.materialclassesInput,
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
                materialclassesInput:'',
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
