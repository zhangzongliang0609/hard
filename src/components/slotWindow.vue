<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify slot-window ">
        <div class="layui-layer-title">{{title}}</div>
        <div class="layui-layer-content ">
            <slot></slot>
        </div>
        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
    </div>
    <div class="layui-layer-shade "></div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .slot-window{
        left: 50%;
        top: 50%;
        margin-left: -200px;
        margin-top: -150px;
        width: 400px;
        height: 250px;
        z-index: 1000;
    }
    .layui-layer-shade{
        z-index: 999;
    }

</style>
<script>
    import * as base from '../assets/js/base.js';
    export default{
        ready(){},
        data:function () {
            return{

            }
        },
        props:["title"],
        methods:{
            close:function () {
                this.$dispatch("dialog-close");
            }
        },
    }
</script>