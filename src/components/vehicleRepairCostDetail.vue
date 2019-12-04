<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">{{title}}</div>
        <div class="layui-layer-content">
            <div class="w-600 mt-10-auto">
                <div class="clearfix pt-10 pb-10 bor-b">
                    <div class="fw-b f-16 f-l">申请信息:</div>
                    <div class="f-r">
                        <span class="mr-10 fc-999">车辆锁定:</span>
                        <img v-if="detailData.vehicle_vo"
                             class="w-20"
                             v-bind:src="detailData.vehicle_vo.locked ?'./src/assets/images/lock_close.png':'./src/assets/images/lock_open.png'">
                        <span v-else class="c-red">无此车辆信息</span>
                    </div>
                </div>
                <div class="flex lh-30 mt-10" v-if="detailData.staff_vo">
                    <div class="flex-1">
                        <div>
                            <span class="mr-10">申请人:</span>{{detailData.staff_vo.real_name}}
                        </div>
                        <div>
                            <span class="mr-10">部&emsp;门:</span>{{detailData.staff_vo.department_name}}
                        </div>
                        <div>
                            <span class="mr-10">品&emsp;牌:</span><span v-bind:class="{'c-red': !detailData.vehicle_vo}">{{detailData.vehicle_vo ? detailData.vehicle_vo.car_brand : '无此车辆信息'}}</span>
                        </div>
                    </div>
                    <div class="flex-1">
                        <div>
                            <span class="mr-10">电&emsp;话:</span>{{detailData.staff_vo.phone}}
                        </div>
                        <div>
                            <span class="mr-10">职&emsp;位:</span>{{detailData.staff_vo.position}}
                        </div>
                        <div>
                            <span class="mr-10">型&emsp;号:</span><span v-bind:class="{'c-red': !detailData.vehicle_vo}">{{detailData.vehicle_vo ? detailData.vehicle_vo.car_model : '无此车辆信息'}}</span>
                        </div>
                    </div>
                    <div class="flex-1">
                        <div>
                            <span class="mr-10">工&emsp;号:</span>{{detailData.staff_vo ? detailData.staff_vo.job_number :
                            '--'}}
                        </div>
                        <div>
                            <span class="mr-10">车&emsp;牌:</span><span v-bind:class="{'c-red': !detailData.vehicle_vo}">{{detailData.vehicle_vo ? detailData.vehicle_vo.car_no : '无此车辆信息'}}</span>
                        </div>
                    </div>
                </div>
                <div class="lh-30">申请时间：{{detailData.ctime || '--'}}</div>
            </div>
            <div class="w-600 mt-10-auto">
                <div class="clearfix pt-10 pb-10 bor-b">
                    <div class="fw-b f-16 f-l">维修信息:</div>
                    <div class="f-r fc-999">
                        <span class="mr-10">订单状态:</span>{{detailData.status_name}}
                    </div>
                </div>
                <div class="clearfix mt-10">
                    <div class="f-l mr-10 fc-999">维修/故障项目:</div>
                    <div class="f-l">
                        <span v-if="detailData.fault_item_vos"
                              v-for="item in detailData.fault_item_vos">
                            {{item.fault_name}}
                            <span v-if="detailData.fault_item_vos.length-1>0">/</span>
                        </span>
                    </div>
                </div>
                <div class="clearfix">
                    <div class="f-l mr-10 fc-999">维修/故障描述:</div>
                    <div class="f-l">
                        <span>{{detailData.fault_desc || '--'}}</span>
                    </div>
                </div>
                <div v-if="detailData.image_urls && detailData.image_urls.length">
                    <img v-for="img in detailData.image_urls" class="descImg" v-bind:src="img"
                         v-on:click="clickImg(img)">
                </div>
            </div>
            <div class="w-600 mt-10-auto">
                <div class="clearfix pt-10 pb-10 bor-b">
                    <div class="fw-b f-16 f-l">审批信息:</div>
                </div>
                <div class="mt-10">
                    <!-- 审批部分 -->
                    <div v-if="detailData.approval_vo">
                        <div class="clearfix mb-10">
                            <div class="f-l">
                                <span class="fc-999">审批时间:</span>
                                {{detailData.approval_vo.mtime || '--'}}
                            </div>
                        </div>
                        <div class="clearfix mb-10">
                            <div class="f-l cell_item ">
                                <span class="fc-999">审批人:</span>
                                {{detailData.approval_vo.real_name || '--'}}
                            </div>
                            <div class="f-l cell_item ml-20">
                                <span class="fc-999">审批人电话:</span>
                                {{detailData.approval_vo.phone || '--'}}
                            </div>
                        </div>
                        <div class="clearfix mb-10"
                             v-if="detailData.approval_vo">
                            <div class="f-l cell_item ">
                                <span class="fc-999">审批结果:</span>
                                {{detailData.approval_vo.approval_status_name || '--'}}
                            </div>
                            <div class="f-l cell_item ml-20">
                                <span class="fc-999">审批原因:</span>
                                {{detailData.approval_vo.approval_reason || '--'}}
                            </div>
                        </div>
                    </div>
                    <div class="sep_line mb-20 mt-20"></div>
                    <!-- 审价部分 -->
                    <div v-if="detailData.approval_price_vo">
                        <div class="clearfix mb-10">
                            <div class="f-l">
                                <span class="fc-999">审价时间:</span>
                                {{detailData.approval_price_vo.mtime || '--'}}
                            </div>
                        </div>
                        <div class="clearfix mb-10">
                            <div class="f-l cell_item ">
                                <span class="fc-999">审价人:</span>
                                {{detailData.approval_price_vo.real_name || '--'}}
                            </div>
                            <div class="f-l cell_item ml-20">
                                <span class="fc-999">审价人电话:</span>
                                {{detailData.approval_price_vo.phone || '--'}}
                            </div>
                        </div>
                        <div class="clearfix mb-10"
                             v-if="detailData.approval_price_vo">
                            <div class="f-l cell_item ">
                                <span class="fc-999">审价结果:</span>
                                {{detailData.approval_price_vo.status_name || '--'}}
                            </div>
                            <div class="f-l cell_item ml-20">
                                <span class="fc-999">审价原因:</span>
                                {{detailData.approval_price_vo.approval_reason || '--'}}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div class="w-600 mt-10-auto" v-if="detailData.status > 10 || detailData.status === -5">
                <div class="clearfix pt-10 pb-10 bor-b">
                    <div class="fw-b f-16 f-l">报价信息:</div>
                </div>
                <!-- 报价人信息 -->
                <div v-if="detailData.set_price_vo">
                    <div class="clearfix mb-10 mt-10">
                        <div class="f-l cell_item">
                            <span class="fc-999">报价时间:</span>
                            {{detailData.set_price_vo.set_price_datetime || '--'}}
                        </div>
                    </div>
                    <div class="clearfix mb-10 mt-10">
                        <div class="f-l cell_item ">
                            <span class="fc-999">报价人:</span>
                            {{detailData.set_price_vo.real_name || '--'}}
                        </div>
                        <div class="f-l cell_item ml-20">
                            <span class="fc-999">报价人电话:</span>
                            {{detailData.set_price_vo.phone || '--'}}
                        </div>
                    </div>
                    <div class="clearfix mb-10 mt-10">
                        <div class="f-l">
                            <span class="fc-999">备注:</span>
                            <!-- 报价备注就是最外层的备注 -->
                            {{detailData.remark || '--'}}
                        </div>
                    </div>
                </div>
                <div v-for="price in detailData.price_info_vo">
                    <div class="flex mb-10">
                        <div class="indexIcon">{{$index + 1}}</div>
                        <div class="priceItem clearfix">
                            <div class="f-l">{{price.supplier}}</div>
                            <div class="f-r w-100 text-c bor-l fc-0099fa">{{price.amount}}元</div>
                        </div>
                        <i class="Hui-iconfont fs-34 fc-0099fa lh-42" v-if="price.id == detailData.selected_price_info">&#xe6a8;</i>
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

<script>

    import * as base from '../assets/js/base.js';

    export default {
        ready() {
            base.verticalCenter('.layui-modify');
            if (this.data.id) {
                this.detailData = Object.assign({}, this.data);
                console.log("this.this.detailData: ", this.detailData);
                this.getDetail();
            } else {
                layer.confirm('未获取到维修订单ID', () => {
                    console.log("confirm");
                    window.history.back();
                }, () => {
                    console.log("cancel");
                });
            }
        },
        props: ['title', 'type', 'data'],
        data: function () {
            return {
                detailData: {}
            }
        },
        methods: {
            getDetail() {
                $.ajax({
                    url: `${base.gAjaxUrl.vehiclerepairorders}${this.data.id}/`,
                    async: false,
                    type: "GET",
                }).always((data) => {
                    base.ajaxCallback(data, () => {
                        this.detailData = data;
                    })
                })
            },
            close() {
                this.$dispatch('dialog-close');
            },
            clickImg(url) {
                layer.open({
                    title: '故障描述',
                    content: `<img src="${url}" style="width:280px;height:auto">`,
                });
            }
        },
    }
</script>

<style lang="less" scoped>
    .descImg {
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

    .flagicon {
        border-left: 3px solid #0099fa;
    }

    .indexIcon {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 1px solid #eee;
        background-color: #dddfde;
        line-height: 30px;
        text-align: center;
        margin-top: 6px;
    }

    .priceItem {
        width: 494px;
        min-height: 34px;
        background-color: #f9f9f9;
        border: 1px solid #eee;
        line-height: 34px;
        padding: 5px 10px;
        margin: 0 10px;
    }

    .cell_item {
        width: 290px;
    }
    .sep_line {
        width: 100%;
        height: 1px;
        background-color: #f5f5f5;
    }
</style>
