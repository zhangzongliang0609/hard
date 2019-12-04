<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">物资库存管理</div>
        <div class="layui-layer-content">
            <form id="K-layer-form" class="form form-horizontal layui-layer-wrap">
                <div class="row cl">
                    <label class="form-label f-l col-4 ">
                        <span class="c-red">*</span>
                        <span v-if="type == 'add'">增加：</span>
                        <span v-if="type == 'reduce'">减少：</span>
                    </label>
                    <div class="formControls f-l col-4">
                        <input v-model="materials_stock" type="text" class="input-text" placeholder="请输入数量" name="materials_stock">
                    </div>
                    <div class="f-l form-label ml-5">{{data.unit}}</div>
                </div>
            </form>
        </div>
        <span class="layui-layer-setwin">
            <a  class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
        </span>
        <div class="layui-layer-btn" v-on:click="save"><a href="javascript:;" class="layui-layer-btn0">保存</a></div>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<script>
    import * as base from '../assets/js/base.js';
    export default{
        ready () {
            let that = this;
            base.verticalCenter('.layui-modify');

            //验证
            $.validator.addMethod("int", function(value, element, param) {
                return this.optional( element ) || /^\-{0,1}[0-9]{1,}$/.test( value );
            }, $.validator.format("不能携带小数点"));

            $('#K-layer-form').validate({
                rules: {
                    materials_stock: {
                        required: true,
                        int:true
                    },
                },
                submitHandler:function() {
                    let ajaxData = that.materials_stock;
                    $.ajax({
                        url: `${base.gAjaxUrl.materialsList}${that.data.id}/stock/`,
                        type: "POST",
                        contentType: "application/json;charset=utf-8",
                        data:JSON.stringify({ number:that.type == "reduce"? -ajaxData:ajaxData}),


                    }).always(function(data) {
                        base.ajaxCallback(data,function(){
                            layer.msg('提交成功',{icon:1,time:1000});
                            that.$dispatch('dialog-save');
                        });
                    });

                }
            });

        },
        props: ['type','data'],
        data:function(){
            return {
                materials_stock:'',
            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            save:function(){
                $('#K-layer-form').submit();
            },
        }
    }
</script>
