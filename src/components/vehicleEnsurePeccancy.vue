<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify updateBox">
        <h5 class="title">确认处理完成？</h5>
        <div class="updateContent">
            <div>
                <p>{{title}} 违章情况</p>
            </div>
            <div>
                <p>违章日期：{{data.ctime}}</p>
                <p>违反地址：{{data.address}}</p>
                <p>违反内容：{{data.reason}}</p>
                <p>扣分情况：{{data.point ? data.point : 0}}分</p>
                <p>罚款情况：{{data.vehicle_type}}元</p>
            </div>
            <div class="btn-box">
                <a class="btn btn-primary radius mr-5 affirm" href="javascript:;" @click="sure()">确认</a>
            </div>
        </div>

        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .updateBox{
        width: 600px;
        height: 400px;
        z-index: 199;
        top: 50% !important;
        left: 50%;
        margin-left: -300px;
        margin-top: -200px !important;
        .title {
            padding-top: 20px;
            text-align: center;
            font-size: 25px;
            line-height: 50px;
        }
        .updateContent{
            box-sizing: border-box;
            padding:20px 30px;
            width: 350px;
            margin: 0 auto;
            p{
                font-size: 15px;
                line-height: 25px;
                margin: 0 auto;
            }
            .affirm{
                width: 350px;
                height: 50px;
                line-height: 42px;
                font-size: 25px;
            }
        }
    }
    .btn-box {
        padding-top: 20px;
    }


</style>
<script>
    import * as base from '../assets/js/base.js';
    export default{
        ready(){
            base.verticalCenter('.updateBox')
        },
        props: ['title', 'data'],
        data: function () {
            return {}
        },
        methods: {
            close:function () {
                this.$dispatch('dialog-close');
            },
            sure: function () {
                this.$dispatch('dialog-save');
            }
        },
    }
</script>