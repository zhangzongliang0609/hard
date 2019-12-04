<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">订单详情</div>
        <div class="layui-layer-content layui-layer-order-wrap">
            <form id="J-layer-form" class="form form-horizontal layui-layer-wrap ">
                <div class="row cl">
                    <label class="form-label f-l col-4 ">车牌号：</label>
                    <div class="formControls f-l col-4">
                        <input type="text" class="input-text" value="{{data.car_no}}" readonly>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">品牌：</label>
                    <div class="formControls f-l col-4">
                        <input type="text" class="input-text" value="{{data.car_brand}}" readonly>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">型号：</label>
                    <div class="formControls f-l col-4">
                        <input type="text" class="input-text" value="{{data.car_model}}" readonly>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">座位数：</label>
                    <div class="formControls f-l col-4">
                        <input type="text" class="input-text" value="{{data.seats}}" readonly>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">驾驶人：</label>
                    <div class="formControls f-l col-4">
                        <input type="text" class="input-text" value="{{data.driver_name}}" readonly>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">费用类型：</label>
                    <div class="formControls f-l col-4">
                        <input type="text" class="input-text" value="{{data.type_name}}" readonly>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">总金额：</label>
                    <div class="formControls f-l col-4">
                        <input type="text" class="input-text" value="{{data.fee}}" readonly>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">发生日期：</label>
                    <div class="formControls f-l col-4">
                        <input type="text" class="input-text" value="{{data.fee_date}}" readonly>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">记账日期：</label>
                    <div class="formControls f-l col-4">
                        <input type="text" class="input-text" value="{{data.ctime}}" readonly>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">操作员：</label>
                    <div class="formControls f-l col-4">
                        <input type="text" class="input-text" value="{{data.operator}}"  readonly>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">备注：</label>
                    <div class="formControls f-l col-4">
                        <textarea class="form-textarea" name="" readonly>{{data.remark}}</textarea>
                    </div>
                </div>
            </form>
        </div>
        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close"></a>
    </span>
        <div class="layui-layer-btn" v-on:click="close"><a class="layui-layer-btn0">关闭</a></div>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<script>
    import * as base from '../assets/js/base.js';
    let commentsOps = null;
    export default{
        ready () {
            commentsOps = {
                param:{
                    page:1,
                    page_size:8,
                }
            };
        },
        props: ['data'],
        data:function(){
            return {
                noData:false,
                items:{
                    is_carpool: '',
                    is_urgent: '',
                },
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
        }
    }
</script>
<style lang="less">
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
