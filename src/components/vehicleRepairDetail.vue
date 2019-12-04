<template>
<div class="layui-layer layui-anim layui-layer-page layui-modify">
    <div class="layui-layer-title">{{title}}</div>
    <div class="layui-layer-content">
        <div class="w-600 mt-10-auto">
            <div class="clearfix pt-10 pb-10 bor-b">
                <div class="fw-b f-16 f-l">申请信息:</div>
                <div class="f-r">
                    <span class="mr-10 fc-999">车辆锁定:</span><img v-if="data.vehicle_vo" class="w-20" v-bind:src="data.vehicle_vo.locked?'./src/assets/images/lock_close.png':'./src/assets/images/lock_open.png'">
                    <span v-else class="c-red">无此车辆信息</span>
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
                        <span class="mr-10">品&emsp;牌:</span><span v-bind:class="{'c-red': !data.vehicle_vo}">{{data.vehicle_vo ? data.vehicle_vo.car_brand : '无此车辆信息'}}</span>
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
                        <span class="mr-10">型&emsp;号:</span><span v-bind:class="{'c-red': !data.vehicle_vo}">{{data.vehicle_vo ? data.vehicle_vo.car_model : '无此车辆信息'}}</span>
                    </div>
                </div>
                <div class="flex-1">
                    <div>
                        <span class="mr-10">工&emsp;号:</span>{{data.staff_vo.job_number}}
                    </div>
                    <div>
                        <span class="mr-10">车&emsp;牌:</span><span v-bind:class="{'c-red': !data.vehicle_vo}">{{data.vehicle_vo ? data.vehicle_vo.car_no : '无此车辆信息'}}</span>
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
                <div class="fw-b f-16 f-l">审批信息:</div>
            </div>
            <div class="mt-10">
                <div class="mb-10">
                    <span class="mr-10 fw-b pl-10">申请时间:</span>{{data.ctime}}
                </div>
                <div class="mb-10">
                    <span class="mr-10 fw-b pl-10">审批通过时间:</span>{{data.approval_info.mtime}}
                </div>

                <div class="mb-10">
                    <!-- 如果审批报价被驳回或者订单状态 > 10，那么审批报修结果一定是通过的 -->
                    <!--<span  class="flagicon mr-10 fw-b pl-10">审批报修结果:</span>{{(data.approval_price_reason || data.status > 10)? '审批通过' : (data.approval_status_name || '&#45;&#45;')}}-->
                    <span  class="flagicon mr-10 fw-b pl-10">审批报修结果:</span>{{data.approval_status_name || '--'}}
                </div>
                <div class="mb-10">
                    <span class="mr-10 fw-b pl-10">审批报修原因:</span>{{data.approval_reason || '--'}}
                </div>
                <div class="mb-10">
                    <span class="flagicon mr-10 fw-b pl-10">审批报价结果:</span>{{data.approval_price_status_name || '--'}}
                </div>
                <div>
                    <span class="mr-10 fw-b pl-10">审批报价原因:</span>{{data.approval_price_reason || '--'}}
                </div>
            </div>
        </div>
        <div class="w-600 mt-10-auto" v-if="data.status>10">
            <div class="clearfix pt-10 pb-10 bor-b">
                <div class="fw-b f-16 f-l">报价信息:</div>
            </div>
            <div class="mt-10 mb-10 flex">
                <div class="fw-b mr-10">备&emsp;&emsp;注:</div>
                <div class="price_remark">{{data.remark}}</div>
            </div>
            <div class="" v-for="price in data.price_info_vo">
                <div class="flex mb-10">
                    <div class="indexIcon">{{$index + 1}}</div>
                    <div class="priceItem clearfix">
                        <div class="f-l">{{price.supplier}}</div>
                        <div class="f-r w-100 text-c bor-l fc-0099fa">{{price.amount}}元</div>
                    </div>
                    <i class="Hui-iconfont fs-34 fc-0099fa lh-42" v-if="price.id == data.selected_price_info">&#xe6a8;</i>
                </div>
            </div>
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
    .price_remark {
        line-height: 18px;
        font-size: 12px;
        width: 100%;
        padding: 0 10px;
    }
    .flagicon{
        border-left: 3px solid #0099fa;
    }
    .indexIcon{
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 1px solid #eee;
        background-color: #dddfde;
        line-height: 30px;
        text-align: center;
        margin-top: 6px;
    }
    .priceItem{
        width: 494px;
        min-height: 34px;
        background-color: #f9f9f9;
        border: 1px solid #eee;
        line-height: 34px;
        padding: 5px 10px;
        margin: 0 10px;
    }
</style>
<script>
import * as base from '../assets/js/base.js';


    export default{
        beforeCompile:function () {
            let that = this;
            if(this.title == '维修费用订单详情'){
                $.ajax({
                    url:`${base.gAjaxUrl.vehiclerepairorders}${that.data.id}/`,
                    async: false,
                    type:"GET",
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
                        that.data = data;
                    })
                })
            }

        },
        ready () {

            base.verticalCenter('.layui-modify');

        },
        props: ['title','type','data'],
        data:function(){
            return {
            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            clickImg:function(url){
                layer.open({
                    title: '故障描述',
                    content: `<img src="${url}" style="width:280px;height:auto">`,
                });
            }
        },
    }
</script>
