<template>
<div class="layui-layer layui-anim layui-layer-page layui-modify">
    <div class="layui-layer-title">{{title}}</div>
    <div class="layui-layer-content">
        <div class="panel panel-default radius w-600 mt-10-auto">
            <div class="panel-header detailHeader">
                <img src="../assets/images/icon-order.png" height="20" width="20" alt="" class="icon">
                <div class="fw-b f-16">报修单号:{{data.order_no}}</div>
                <div class="fc-999 fw-n clearfix">
                    <span>报修时间:{{data.ctime}}</span>
                    <span>审批状态:{{data.approval_status_name}}</span>
                    <span class="f-r">订单状态：<span class="fc-ffab10">{{data.status_name}}</span></span>
                </div>
            </div>
            <div class="panel-body detailContent">
                <div class="lh-30">
                    <span class="mr-10">报修项目:</span>
                    <span v-for="item in data.fault_item_vos"><span>{{item.fault_name}}<span v-show="$index < data.fault_item_vos.length-1">/</span></span></span>
                </div>
                <div class="lh-30">
                    <span class="mr-10">报修人员:</span>
                    <span>{{data.staff_vo.real_name}}</span>
                </div>
                <div class="lh-30">
                    <span class="mr-10">联系电话:</span>
                    <span>{{data.contact_phone}}</span>
                </div>
                <div class="lh-30">
                    <span class="mr-10">故障地址:</span>
                    <span>{{data.location}}</span>
                </div>
                <div class="lh-30">
                    <span class="mr-10">报修类型:</span>
                    <span>{{data.repair_type_name}}</span>
                </div>
                <div class="lh-30 clearfix">
                    <span class="mr-14 f-l">故障描述:</span>
                    <div class="desc">
                        <div>{{data.fault_desc?data.fault_desc:'--'}}</div>
                        <div v-if="data.image_urls.length>0">
                            <div class="descImg" v-for="item in data.image_urls">
                                <img class="img-responsive" v-bind:src="item" v-on:click="clickImg(item)">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lh-30">
                    <span class="mr-10 f-l">审批人员:</span>
                    <span class="clearfix approva" v-for="item in data.approvalinfo_set">
                        <img class="avatar" v-bind:src="item.approver_vo.avatar?item.approver_vo.avatar:'./src/assets/images/avatar-default.jpg'"/>
                        <span class="approvaName lh-20">{{item.approver_vo.real_name}}</span>
                    </span>
                </div>
            </div>
        </div>
        <div class="panel panel-default radius w-600 mt-10-auto">
            <div class="panel-header commentHeader">
                <img src="../assets/images/icon-comment.png" width="20" alt="" class="icon">
                <div class="fw-b f-16">订单评价</div>
            </div>
            <div class="panel-body clearfix" v-if="data.comment_vo">
                <div class="f-l w-100">
                    <div class="f-30 fc-ffab10 text-c">{{data.comment_vo.score}}</div>
                    <div class="text-c">
                        <img src="../assets/images/icon-star.png" height="15" width="15" alt="" v-for="item in data.comment_vo.score" class="mr-5">
                    </div>
                </div>
                <div class="comment">
                    <div>
                        <span class="mr-4 bgc-fa bor-e pl-8 pr-8 lh-26 radius dp-ilb" v-for="item in data.comment_vo.tags">{{item}}</span>
                    </div>
                    <div class="mt-10 pl-10">{{data.comment_vo.content}}</div>
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

<style lang="less">
    .panel-header.detailHeader,
    .panel-header.commentHeader{
        position: relative;
        padding: 15px;
        padding-left: 42px;
    }
    .detailHeader .icon{
        position: absolute;
        top: 26px;
        left: 12px;
    }
    .commentHeader .icon{
        position: absolute;
        top: 16px;
        left: 12px;
    }
    .approva{
        position: relative;
        display: inline-block;
        width: 56px;
        text-align: center;
    }
    .approva .approvaName{
        display: block;
        text-align: center;
        width: 56px;
        margin-top: 5px
    }
    .detailContent div span{
        display: inline-block;
    }
    .desc{
        overflow: hidden;
    }
    .descImg{
        width: 120px;
        height: 120px;
        border-radius: 4px;
        margin-right: 10px;
        margin-bottom: 10px;
        overflow: hidden;
        display: inline-block;
    }
    .descImg img{
        cursor: pointer;
    }
    .comment{
        overflow: hidden;
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
            clickImg:function(url){
                layer.open({
                    title: '故障描述',
                    content: `<img src="${url}" style="width:280px;height:auto">`,
                });
            }
        },
    }
</script>
