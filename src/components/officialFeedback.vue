<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">沟通反馈</div>

        <div class="layui-layer-content pd-15">
            <div class="cl">
                <span class="f-l mr-20">
                    发送到:
                </span>
                <div class="f-l">
                    <label >
                        <input type="checkbox" class="person-check">
                        <span>申请人</span>
                    </label>
                </div>
                <div class="f-l ml-10">
                    <label >
                        <input type="checkbox" class="person-check">
                        <span>乘车人</span>
                    </label>
                </div>
                <div class="f-l ml-10">
                    <label >
                        <input type="checkbox" class="person-check">
                        <span>司机</span>
                    </label>
                </div>
            </div>

            <textarea class="content-text mt-10" name="" id="" placeholder="请输入反馈内容,最多只能输入65字" style="resize: none">

            </textarea>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
        </span>
        <div class="layui-layer-btn" v-on:click="close"><a class="layui-layer-btn0">关闭</a></div>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<script>
    import * as base from '../assets/js/base.js';
    export default{
        ready () {

        },
        props: [],
        data:function(){
            return {

            }

        },
        methods: {
            close:function(){
                this.$dispatch("dialog-close")
            }
        }
    }
</script>
<style lang="less" scoped>
    .person-check{
        width:20px;
        height:20px;
    }
    .content-text{
        border:1px solid #999999;
        border-radius: 8px;
        width:100%;
        height:300px;
        padding:0;
    }
</style>
