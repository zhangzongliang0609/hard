<template>
<div class="layui-layer layui-anim layui-layer-page layui-modify">
    <div class="layui-layer-title">{{title}}</div>
    <div class="layui-layer-content">
        <div class="w-600 mt-10-auto">
            <div class="clearfix pt-10 pb-10 bor-b">
                <div class="fw-b f-16 f-l">申请信息:</div>
                <div class="f-r">
                    <span class="mr-10 fc-999">车辆锁定:</span><img class="w-20" v-bind:src="data.vehicle_vo.locked?'./src/assets/images/lock_close.png':'./src/assets/images/lock_open.png'">
                </div>
            </div>
            <div class="flex lh-30 mt-10">
                <div class="flex-1">
                    <div>
                        <span class="mr-10">申请人:</span>{{data.staff_vo.real_name}}
                    </div>
                    <div>
                        <span class="mr-10">部&emsp;门:</span>{{data.staff_vo.department_vo.department_name}}
                    </div>
                    <div>
                        <span class="mr-10">品&emsp;牌:</span>{{data.vehicle_vo.car_brand}}
                    </div>
                </div>
                <div class="flex-1">
                    <div>
                        <span class="mr-10">电&emsp;话:</span>{{data.staff_vo.phone}}
                    </div>
                    <div>
                        <span class="mr-10">职&emsp;位:</span>{{data.staff_vo.position}}
                    </div>
                    <div>
                        <span class="mr-10">型&emsp;号:</span>{{data.vehicle_vo.car_model}}
                    </div>
                </div>
                <div class="flex-1">
                    <div>
                        <span class="mr-10">工&emsp;号:</span>{{data.staff_vo.job_number}}
                    </div>
                    <div>
                        <span class="mr-10">车&emsp;牌:</span>{{data.vehicle_vo.car_no}}
                    </div>
                </div>
            </div>
        </div>
        <div class="w-600 mt-10-auto">
            <div class="clearfix pt-10 pb-10 bor-b">
                <div class="fw-b f-16 f-l">维修信息:</div>
                <div class="f-r fc-999">
                    <span class="mr-10">订单状态:</span>{{data.status_name}}
                </div>
            </div>
            <div class="clearfix mt-10">
                <div class="f-l mr-10 fc-999">维修/故障项目:</div>
                <div class="f-l"><span v-for="item in data.fault_item_vos">{{item.fault_name}}<span v-if="data.fault_item_vos.length-1>0">/</span></span></div>
            </div>
            <div class="">
                <div class="fc-999 pt-10 pb-10">维修/故障描述:</div>
                <p>{{data.fault_desc?data.fault_desc:'--'}}</p>
            </div>
            <div v-if="data.image_urls.length>0">
                    <img v-for="img in data.image_urls" class="descImg" v-bind:src="img" v-on:click="clickImg(img)">
            </div>
        </div>
        <div class="w-600 mt-10-auto">
            <div class="clearfix pt-10 pb-10 bor-b">
                <div class="fw-b f-16 f-l">审批订单:</div>
            </div>
            <form action="" class="mt-10">
                <textarea class="textarea pd-10" placeholder="请输入同意或驳回原因" name="reason" id="reason" cols="30" rows="10"></textarea>
                <div class="text-c mt-10">
                    <a class="btn btn-e radius mr-10 pl-30 pr-30" title="驳回" href="javascript:;" v-on:click="save(-10)">驳回</a>
                    <a class="btn btn-primary radius pl-30 pr-30" title="同意" href="javascript:;" class="ml-5" v-on:click="save(10)">同意</a>
                </div>
            </form>
        </div>
    </div>
    <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
</div>
<div class="layui-layer-shade"></div>
</template>

<style lang="less" scoped>
    .descImg{
        width: 120px;
        height: 120px;
        border-radius: 4px;
        margin-right: 10px;
        margin-bottom: 10px;
        overflow: hidden;
        display: inline-block;
        cursor: pointer;
    }
    .btn.pr-30{
        padding-right: 30px;
    }
    .btn.pl-30{
        padding-left: 30px;
    }
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
            save:function(result){
                let that = this;
                let ajaxData = {
                    result: result,
                };
                let msg = '';
                let reason = $.trim($('#reason').val());
                let len = reason.length;
                if(result == -10){
                    if(len == 0){
                        layer.msg('请输入驳回原因',{icon:2,time:1000});
                        return;
                    }
                    if (len >= 100) {
                        layer.msg('驳回原因不可以超过100字符',{icon:2,time:1000});
                        return;
                    }
                    msg = '确定驳回该次车辆报修？';
                }else{
                    if (len >= 100) {
                        layer.msg('审批原因不可以超过100字符',{icon:2,time:1000});
                        return;
                    }
                    msg = '确定同意该次车辆报修？';
                }
                ajaxData.reason = reason;
                layer.confirm(msg, function (confirm_index) {
                    $.ajax({
                        url:`${base.gAjaxUrl.vehiclerepairorders}${that.data.id}/make_approve/`,
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(ajaxData)
                    }).always(function(data) {
                        base.ajaxCallback(data,function(){
                            layer.msg('保存成功',{icon:1,time:1000});
                            that.$dispatch('dialog-save');
                        });
                    });
                    layer.close(confirm_index);
                })

            },
            clickImg:function(url){
                layer.open({
                    title: '故障描述',
                    content: `<img src="${url}" style="width:280px;height:auto">`,
                });
            },

        },
    }
</script>
