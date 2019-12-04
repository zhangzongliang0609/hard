<template>
<div class="layui-layer layui-anim layui-layer-page layui-modify">
    <div class="layui-layer-title">{{title}}</div>
    <div class="layui-layer-content pl-20 pr-20">
        <div class="cl lh-30">
            <div class="f-l col-7">
                <div class="fc-999 fs-16 fw-b pl-20">申请信息</div>
                <div class="pl-20"><span class="mr-15">申请人:</span>{{data.name}}</div>
                <div class="pl-20"><span class="mr-15">手机号:</span>{{data.phone}}</div>
                <div class="pl-20"><span class="mr-15">地址:</span>{{data.location}}</div>
                <div class="pl-20 "><span class="mr-15">申请时间:</span>{{data.ctime}}</div>
            </div>
            <div class="f-l col-5">
                <div class="fc-999 fs-16 fw-b">&nbsp;</div>
                <div class="fw-b"><span class="mr-15">订单状态:</span><span class="fc-206afc">{{data.status_name}}</span></div>
                <div class="fc-206afc"><span class="mr-15">数量:</span>{{data.number}}</div>
                <div><span class="mr-15">配送方式:</span>{{data.pick_type_vo.type_name}}</div>
                <div><span class="mr-15">配送日期:</span><span v-if="data.pick_type_vo.pick_type==2 && data.pick_time">{{data.pick_time}}</span><span v-else>--</span></div>
            </div>
        </div>
    </div>
    <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
</div>
<div class="layui-layer-shade"></div>
</template>

<style lang="less">
    
</style>
<script>
import * as base from '../assets/js/base.js';

    let ajaxUrl = '';
    let getData = '';

    export default{
        ready () {
            let that = this;
            getData = this.data;

            base.verticalCenter('.layui-modify');

            ajaxUrl = `${base.gAjaxUrl.pubrepairorders}${getData.id}/`;

        },
        props: ['title','type','data'],
        data:function(){
            return {
                detail: {},
            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
        },
    }
</script>
