<template>
<div class="layui-layer layui-anim layui-layer-page layui-modify">
    <div class="layui-layer-title">{{title}}</div>
    <div class="layui-layer-content">
        <form id="J-layer-form" class="form form-horizontal layui-layer-wrap">
            <div class="row cl">
                <label class="form-label f-l col-4"><span class="c-red">*</span><span class="pr-5">临界金额:</span></label>
                <div class="formControls f-l col-4">
                    <input v-model="crucialAmountNameInput" type="text" class="input-text" value="" placeholder="请输入临界金额" name="crucial_amount">
                </div>
            </div>
            <div class="text-c fc-999 mt-10">
                <p>提示:  小于临界金额:  普通报价审批人</p>
                <p>大于等于临界金额:  高级报价审批人</p>
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

<style lang="less" scoped>
    .floor{
        position: relative;
    }
    .floor span{
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
                ajaxUrl = base.gAjaxUrl.vehicleRepairrule;
                ajaxType = 'POST';
            }else if(this.type == 'modify'){
                ajaxUrl = `${base.gAjaxUrl.vehicleRepairrule}${getData.id}/`;
                ajaxType = 'PUT';
                this.crucialAmountNameInput = getData.crucial_amount;
            }

            //验证
            $.validator.addMethod('signlessInteger',function(value, element){
                var length = value.length;  
                var reg = /^[1-9]\d*$/; 
                return this.optional(element) || reg.test( value );
            },'请输入正整数');
            $('#J-layer-form').validate({
                rules: {
                    crucial_amount: {
                        required: true,
//                        signlessInteger: true,
                        twoDecimal: true,
                    },
                },
                submitHandler:function() {
                    $.ajax({
                        url: ajaxUrl,
                        type:ajaxType,
                        data: {
                            crucial_amount: that.crucialAmountNameInput,
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
                crucialAmountNameInput:'',
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
