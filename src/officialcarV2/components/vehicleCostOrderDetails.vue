<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">费用详情</div>
        <div class="layui-layer-content layui-layer-order-wrap">
            <div class="row cl">
                <div class="f-l col-5 text-c">
                    <span class="f-l col-5 text-r">
                        车牌：
                    </span>
                    <span class="f-l col-5 text-l fw-b">
                        {{orderData.car_no}}
                    </span>
                </div>
                <div class="f-l col-5 text-c">
                    <span class="f-l col-5 text-r">
                        品牌：
                    </span>
                    <span class="f-l col-5 text-l fw-b">
                        {{orderData.car_brand}}
                    </span>
                </div>
            </div>
            <div class="row cl">
                <div class="f-l col-5 text-c">
                    <span class="f-l col-5 text-r">
                        颜色：
                    </span>
                    <span class="f-l col-5 text-l fw-b">
                        {{orderData.car_color}}
                    </span>
                </div>
                <div class="f-l col-5 text-c">
                    <span class="f-l col-5 text-r">
                        型号：
                    </span>
                    <span class="f-l col-5 text-l fw-b">
                        {{orderData.car_model}}
                    </span>
                </div>
            </div>
            <div class="row cl">

                <div class="f-l col-5 text-c">
                    <span class="f-l col-5 text-r">
                        座位数：
                    </span>
                    <span class="f-l col-5 text-l fw-b">
                        {{orderData.seats}}
                    </span>
                </div>
                <div class="f-l col-5 text-c">
                    <span class="f-l col-5 text-r">
                        驾驶人：
                    </span>
                    <span class="f-l col-5 text-l fw-b">
                        {{orderData.driver_name}}
                    </span>
                </div>
            </div>
            <div class="row cl">
                <div class="f-l col-5 text-c">
                    <span class="f-l col-5 text-r">
                        费用类型：
                    </span>
                    <span class="f-l col-5 text-l fw-b">
                        {{orderData.feetype_name}}
                    </span>
                </div>
                <div class="f-l col-5 text-c">
                    <span class="f-l col-5 text-r">
                        金额：
                    </span>
                    <span class="f-l col-5 text-l fw-b">
                        {{orderData.fee ? orderData.fee / 100 : '' }}
                    </span>
                </div>
            </div>
            <div class="row cl">
                <div class="f-l col-5 text-c">
                    <span class="f-l col-5 text-r">
                        发生时间：
                    </span>
                    <span class="f-l col-5 text-l fw-b">
                        {{orderData.fee_date}}
                    </span>
                </div>
                <div class="f-l col-5 text-c">
                    <span class="f-l col-5 text-r">
                        记账日期：
                    </span>
                    <span class="f-l col-5 text-l fw-b">
                        {{orderData.jz_date}}
                    </span>
                </div>
            </div>
            <div class="row cl">
                <div class="f-l col-5 text-c">
                    <span class="f-l col-5 text-r">
                        操作人：
                    </span>
                    <span class="f-l col-5 text-l fw-b">
                        {{orderData.operator}}
                    </span>
                </div>
                <div class="f-l"></div>
            </div>
            <div class="row cl">
                <div class="f-l col-5 text-c">
                    <span class="f-l col-5 text-r">
                        备注：
                    </span>
                    <span class="f-l col-5 text-l fw-b">
                        {{orderData.remark}}
                    </span>
                </div>
                <div class="f-l"></div>
            </div>
            <div class="row cl">
                <div class="f-l col-5 text-c">
                    <span class="f-l col-5 text-r">
                        图片：
                    </span>
                    <span class="f-l col-5 text-l fw-b">
                     <img :src="orderData.img" alt="" width="50px;">
                    </span>
                </div>
                <div class="f-l"></div>
            </div>
        </div>
        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close"></a>
    </span>
        <div class="layui-layer-btn" v-on:click="close"><a class="layui-layer-btn0">关闭</a></div>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<script>
    import * as base from '../../assets/js/base.js';
    export default{
        ready () {
            console.log("data");
            console.log(this.data);
            this.getDetails();
        },
        props: ['data'],
        data:function(){
            return {
                noData:false,
                items:{
                    is_carpool: '',
                    is_urgent: '',
                },
                orderData:{},
            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            isUrgent:function(data){
                if(data){
                    return '<span class="red">是</span>';
                }else{
                    return  '否';
                }
            },
            getDetails:function(){
                $.showLoading();
                $.ajax({
                    url: `${base.gAjaxUrl.officialcarCost_V2}${this.data.id}`,
                    type: 'GET',
                }).always((data)=>{
                    $.hideLoading();
                    base.ajaxCallback(data,()=>{
                        this.orderData = data;
                    });
                })
            }
        }
    }
</script>
<style lang="less" scoped rel="stylesheet/less">
    .layui-order-detail{
        width: 1000px !important;
        margin-left:-500px !important;
    }
    .layui-layer-title{
        .m-info{
            border: none;
            padding: 9px 0;
            margin: 0;
        }
    }
    .layui-layer-order-wrap .form .row{
        margin-top:10px;
    }
</style>
