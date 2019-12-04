<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify ">
        <div class="layui-layer-title">消息详情</div>
        <div class="details-content">
          <h4 class="text-c fs-22 lh-42">{{data.title}}</h4>
            <div class="content-box">
                <p>【{{data.msg_type_name}}】 {{data.ctime}}</p>
                <div class="content">
                    {{data.content}}
                </div>
            </div>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
        </span>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .content-box{
        padding:10px 30px
    }
    .content{
        border:1px solid #ccc;
        border-radius:3px;
        height: 400px;
        padding: 20px;
    }
    .details-content{
        padding-bottom: 30px;
    }
</style>
<script>
    import * as base from '../assets/js/base.js';
    export default{
        ready(){
            console.log(this.data);
        },
        data:function () {
            return{

            }
        },
        props:["data"],
        methods:{
            close:function(){
                this.$dispatch('dialog-close');
            },
        },
    }
</script>