<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">{{title}}</div>
        <div class="layui-layer-content">
            <form id="J-layer-form" class="form form-horizontal layui-layer-wrap">
                <div id="row cl" class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>水类型名称：</label>
                    <div class="formControls f-l col-4">
                        <input disabled v-model="water_name" type="text" class="input-text" placeholder="" name="water_name">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">
                        <span class="c-red">*</span>价格：
                    </label>
                    <div class="formControls f-l col-4">
                        <input :disabled="type != 'add'" v-model="water_price" type="text" class="input-text" value="" placeholder="请输入价格（单位：分）" name="water_price">
                    </div>
                    <div class="f-l form-label ml-5">元</div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">
                        <span class="c-red">*</span>
                        <span v-if="type == 'add'">库存：</span>
                        <span v-if="type == 'increase'">增加：</span>
                        <span v-if="type == 'reduce'">减少：</span>
                    </label>
                    <div class="formControls f-l col-4">
                        <input v-model="water_stock" type="text" class="input-text" placeholder="请输入数量" name="water_stock">
                    </div>
                    <div class="f-l form-label ml-5">桶</div>
                </div>
            </form>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
        </span>
        <div id="save" class="layui-layer-btn" v-on:click="save"><a class="layui-layer-btn0">保存</a></div>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<script>
    import * as base from '../assets/js/base.js';
    export default{
        ready () {

            let that = this;
            let ajaxUrl = base.gAjaxUrl.waterInfo;
            let ajaxType = 'POST';
            let getData = this.data;

            base.verticalCenter('.layui-modify');

            //类型判断 add -- 新增水
            if(this.type == 'add'){
                this.water_name = '桶装水';
//                console.log('add')
                // 改变水库存量
            }else {
                ajaxUrl = `${ajaxUrl}${getData.id}/stock/`;
//                console.log(ajaxUrl);
                this.water_name = getData.name;
                this.water_price = getData.price / 100;
            }
            // 两位小数验证
            $.validator.addMethod("two_decimal", function(value, element, param) {
                return this.optional( element ) || /^\d+\.{0,1}\d{0,2}$/.test( value );
//                return this.optional( element ) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test( value );
            }, $.validator.format("请输入正两位小数"));

            //验证
            $('#J-layer-form').validate({
                rules: {
                    water_name: {
                        required: true,
                    },
                    water_price: {
//                        required: true,
                        two_decimal: true,
//                        digits:true
                    },
                    water_stock: {
//                        required: true,
                        digits:true
                    },
                },
                submitHandler:function() {
                    let ajaxData = null;
                    if(that.type == 'add') {
                        ajaxData = {
                            name: that.water_name,
                            price: that.water_price * 100,
                            stock: that.water_stock,
                        }
                    } else {
                        ajaxData = {
                            number: that.type == 'increase' ? that.water_stock : -Math.abs(that.water_stock * 1)
                        }
                    }
                    $.ajax({
                        url: ajaxUrl,
                        type:ajaxType,
                        data: ajaxData
                    }).always(function(data) {
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
                water_name:'',
                water_price:'',
                water_stock:''
            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            save:function(){
                $('#J-layer-form').submit();
            },
        }
    }
</script>
