<template>
<div class="layui-layer layui-anim layui-layer-page layui-modify">
    <div class="layui-layer-title">{{title}}</div>
    <div class="layui-layer-content">
        <form id="J-layer-form" class="form form-horizontal layui-layer-wrap">
            <input type="hidden" v-model="materialClassInput" name="material_class">
            <div class="row cl">
                <label class="form-label f-l col-4 "><span class="c-red">*</span>材料名称：</label>
                <div class="formControls f-l col-4">
                    <input v-model="nameInput" type="text" class="input-text" value="" placeholder="" name="name">
                </div>
            </div>
            <div class="row cl">
                <label class="form-label f-l col-4 ">规格型号：</label>
                <div class="formControls f-l col-4">
                    <input v-model="formatInput" type="text" class="input-text" value="" placeholder="" name="format">
                </div>
            </div>
            <div class="row cl">
                <label class="form-label f-l col-4 ">品牌：</label>
                <div class="formControls f-l col-4">
                    <input v-model="brandInput" type="text" class="input-text" value="" placeholder="" name="brand">
                </div>
            </div>
            <div class="row cl">
                <label class="form-label f-l col-4 ">属性：</label>
                <div class="formControls f-l col-4">
                    <input v-model="propInput" type="text" class="input-text" value="" placeholder="" name="prop">
                </div>
            </div>
            <div class="row cl">
                <label class="form-label f-l col-4 "><span class="c-red">*</span>单位：</label>
                <div class="formControls f-l col-4">
                    <input v-model="unitInput" type="text" class="input-text" value="" placeholder="" name="unit">
                </div>
            </div>
            <div class="row cl">
                <label class="form-label f-l col-4 "><span class="c-red">*</span>单价：</label>
                <div class="formControls f-l col-4 price">
                    <input v-model="priceInput" type="text" class="input-text" value="" placeholder="" name="price">
                    <span>元</span>
                </div>
            </div>
            <div class="row cl">
                <label class="form-label f-l col-4 ">材料来源：</label>
                <div class="formControls f-l col-4">
                    <input v-model="sourceInput" type="text" class="input-text" value="" placeholder="" name="source">
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
    .price{
        position: relative;
    }
    .price span{
        position: absolute;
        top: 4px;
        right: -22px;
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

            //类型判断
            if(this.type == 'add'){
                ajaxUrl = base.gAjaxUrl.materials;
                ajaxType = 'POST';
            }else if(this.type == 'modify'){
                ajaxUrl = `${base.gAjaxUrl.materials}${getData.id}/`;
                ajaxType = 'PUT';
                this.nameInput = getData.name;
                this.formatInput = getData.format;
                this.brandInput = getData.brand;
                this.propInput = getData.prop;
                this.unitInput = getData.unit;
                this.priceInput = getData.price;
                this.sourceInput = getData.source;
            }

            this.materialClassInput = this.classid; //材料类型的id

            $.validator.addMethod('floatNum',function(value, element){
                var length = value.length;  
                var reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$|^0$/;
                return this.optional(element) || reg.test( value );
            },'请输入正确的金额');

            $.validator.addMethod("two_decimal", function(value, element, param) {
                return this.optional( element ) || /^\d+\.{0,1}\d{0,2}$/.test( value );
//                return this.optional( element ) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test( value );
            }, $.validator.format("请输入正两位小数"));

            $.validator.addMethod('trim',function(value, element){
                var length = $.trim(value).length;
                return this.optional(element) || length>0;
            },'请正确填写');

            //验证
            $('#J-layer-form').validate({
                rules: {
                    name: {
                        required: true,
                        trim: true,
                    },
                    format: {
                        trim: true,
                    },
                    brand: {
                        trim: true,
                    },
                    prop: {
                        trim: true,
                    },
                    unit: {
                        required: true,
                        trim: true,
                    },
                    price: {
                        required: true,
                        two_decimal:true,
                        floatNum: true,
                    },
                    source: {
                        trim: true,
                    },
                },
                submitHandler:function() {
                    $.ajax({
                        url: ajaxUrl,
                        type:ajaxType,
                        contentType: 'application/json',
                        data: JSON.stringify({
                            name: that.nameInput,
                            format: that.formatInput,
                            brand: that.brandInput,
                            prop: that.propInput,
                            unit: that.unitInput,
                            price: that.priceInput,
                            source: that.sourceInput,
                            material_class: that.materialClassInput,
                        }),
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
        props: ['title','type','data','classid'],
        data:function(){
            return {
                nameInput:'',
                formatInput:'',
                brandInput:'',
                propInput: '',
                unitInput: '',
                priceInput: '',
                sourceInput: '',
                materialClassInput: '',
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
