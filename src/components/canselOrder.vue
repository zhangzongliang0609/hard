<template>
<div class="layui-layer layui-anim layui-layer-page layui-modify layui-modify-cansel">
    <div class="layui-layer-title">取消原因</div>
    <div class="layui-layer-content">
        <div class="reson-area"><textarea class="layui-layer-input" placeholder="请填写取消订单的原因..." v-model="reason"></textarea></div>

    </div>
    <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close"></a>
    </span>
    <div class="layui-layer-btn">
        <a class="layui-layer-btn0" v-on:click="cancel">确定</a>
        <a class="layui-layer-btn1" v-on:click="close">关闭</a>
    </div>
</div>
<div class="layui-layer-shade"></div>
</template>
<style lang="less">
    div.layui-modify-cansel{
        height: 415px;
    }
</style>
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
            $.ajax({
                url: `${base.gAjaxUrl.officialcarorders}${this.data.id}/`,
                type: 'GET',
            }).always((data)=> {
            });

        },
        props: ['data'],
        data:function(){
            return {
                noData:false,
                order: this.data,
                reason: ''
            }
        },
        methods: {
            close:function(){
                this.$emit('cancel-dialog-close');
            },
            cancel:function () {
                if(this.reason === ''){
                    layer.msg('取消原因不能为空',{icon:2,time:1500})
                    return
                }
                $.ajax({
                    url: `${base.gAjaxUrl.officialcarorders}${this.order.id}/cancel/`,
                    type: 'GET',
                    data: {cancel_reason: this.reason}
                }).done((data)=> {
                    layer.msg("取消成功",{icon:1,time:1000});
                    this.$emit('cancel-dialog-save');
                });
            }
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
.reson-area{
    width: 95%;
    margin: 10px auto;
}
.reson-area textarea{
    width: 100%;
    height: 300px;
    font-size: large;
}
</style>
