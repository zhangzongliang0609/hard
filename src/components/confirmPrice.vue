<template>
<div class="layui-layer layui-anim layui-layer-page layui-modify">
    <div class="layui-layer-title">{{title}}</div>
    <div class="layui-layer-content pd-10">
        <div class="panel radius bgc-e5">
            <div class="pd-10">
                <span class="mr-5">故障项目：<span >{{data.fault_items}}</span>
                <span class="mr-5">地址：{{data.location}}</span>
            </div>
        </div>
        <div class="bk-gray radius mt-10">
            <div class="pd-10">维修材料:</div>
            <table class="table table-border table-bg table-striped">
                <thead class="text-c">
                    <tr>
                        <th>序号</th>
                        <th>材料名称</th>
                        <th>规格型号</th>
                        <th>品牌</th>
                        <th>数量</th>
                        <th>单价(元)</th>
                        <th>总价</th>
                    </tr>
                </thead>
                <tbody class="text-c">
                    <tr v-for="item in data.repairordermaterial_set">
                        <td>{{$index+1}}</td>
                        <td>{{item.material_vo.name}}</td>
                        <td>{{item.material_vo.format}}</td>
                        <td>{{item.material_vo.brand}}</td>
                        <td>{{item.material_number}}</td>
                        <td>{{item.material_vo.price}}</td>
                        <td>{{item.material_number*item.material_vo.price |two}}</td>
                    </tr>
                </tbody>
            </table>
            <div class="mt-10 pd-10">其他材料: <span class="ml-5" v-if="data.repairorderextracharge_set && data.repairorderextracharge_set.length==0">无</span></div>
            <table class="table table-border table-bg table-striped" v-else>
                <thead class="text-c">
                    <tr>
                        <th>序号</th>
                        <th>材料名称</th>
                        <th>价钱</th>
                    </tr>
                </thead>
                <tbody class="text-c">
                    <tr v-for="item in data.repairorderextracharge_set">
                        <td>{{$index+1}}</td>
                        <td>{{item.content}}</td>
                        <td>{{item.price }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="clearfix">
            <div class="layui-layer-btn place f-r" v-on:click="save"><a class="layui-layer-btn0" v-if="type!='check'">确认报价</a></div>
            <form id="J-layer-form" class="f-r mt-10">
                维修报价：
                <input v-model="payAmountInput" type="text" class="input-text w-150" value="" placeholder="" name="pay_amount">
                元(<span class="color-b">可修改</span>)
            </form>
        </div>
    </div>
    <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
</div>
<div class="layui-layer-shade"></div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>

<style lang="less">
    .color-b{
        color:#206afc;
    }
    #J-layer-form{
        position: relative;
    }
    #J-layer-form label.error{
        right: 70px;
    }
</style>
<script type="text/ecmascript-6">
import * as base from '../assets/js/base.js';

    export default{
        ready () {
            let that = this;
            let getData = this.data;
            this.payAmountInput = getData.pay_amount/100;

            base.verticalCenter('.layui-modify');
            // 两位小数验证
            $.validator.addMethod("plus_number", function(value, element, param) {
//                return value * 1 >= 0 && /^(0|[1-9]\d*).\d{1,2}$|^([1-9]\d*|0)$/.test(value);
                return this.optional(element) || /^\d+\.{0,1}\d{0,2}$/.test(value);
            }, $.validator.format("请输入合法数值"));
            //验证
            $('#J-layer-form').validate({
                rules: {
                    pay_amount: {
                        plus_number: true,
                    },
                },
                submitHandler:function(callback=function(){}) {
                    that.itemsLoading = true;
                    let ajaxData = {
                        pay_amount: that.payAmountInput,
                    }
                    $.ajax({
                        url: `${base.gAjaxUrl.repairorders}${getData.id}/price/`,
                        contentType: 'application/json',
                        type: 'POST',
                        data: JSON.stringify(ajaxData),
                    })
                    .always(function(data) {
                        that.itemsLoading = false;
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
                payAmountInput: '',
                itemsLoading:false,
            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            save:function(){
                $('#J-layer-form').submit();
            }
        },
        filters:{
            two:function(number){
                return number.toFixed(2)
            }
        }
    }
</script>
