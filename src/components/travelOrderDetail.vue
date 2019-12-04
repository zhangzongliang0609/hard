<template>
    <mileage v-if="showModifyMileage" @dialog-close="closeMileage" :data="orderData"
             @save-mileage="saveMileage"></mileage>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">订单详情</div>
        <div class="layui-layer-content layui-layer-order-wrap">

            <h4 class="ml-15">订单编号：{{orderData.order_no || '--'}}</h4>

            <div class="bd_ddd pd-10 ml-10 mr-10">
                <div class="clearfix pt-5 pd-5">
                    <div class="f-l col-6">
                        <label class="f-l ">司机：</label>
                        <div class="f-l">
                            {{orderData.staff_vo.real_name || '--'}}
                        </div>
                    </div>

                    <div class="f-l col-6">
                        <label class="f-l ">性别：</label>
                        <div class="f-l">
                            {{orderData.staff_vo.sex == 1 ? '男' : '女'}}
                        </div>
                    </div>

                </div>

                <div class="clearfix pt-5 pd-5">
                    <div class="f-l col-6">
                        <label class="f-l ">部门：</label>
                        <div class="f-l">
                            {{orderData.staff_vo.department_name || '--'}}
                        </div>
                    </div>

                    <div class="f-l col-6">
                        <label class="f-l ">职位：</label>
                        <div class="f-l">
                            {{orderData.staff_vo.position || '--'}}
                        </div>
                    </div>
                </div>

                <div class="clearfix pt-5 pd-5">
                    <div class="f-l col-6">
                        <label class="f-l ">电话：</label>
                        <div class="f-l">
                            {{orderData.staff_vo.phone || '--'}}
                        </div>
                    </div>

                    <div class="f-l col-6">
                        <label class="f-l ">使用车辆：</label>
                        <div class="f-l">
                            {{orderData.car_no || '--'}}
                        </div>
                    </div>
                </div>

                <div class="clearfix pt-5 pd-5">
                    <div class="f-l col-6">
                        <label class="f-l">起点：</label>
                        <div class="f-l">
                            {{orderData.source_name || '--'}}
                        </div>
                    </div>

                    <div class="f-l col-6">
                        <label class="f-l ">终点：</label>
                        <div class="f-l">
                            {{orderData.destination_name || '--'}}
                        </div>
                    </div>

                </div>

                <div class="clearfix pt-5 pd-5">

                    <div class="f-l col-6">
                        <label class="f-l ">申请时间：</label>
                        <div class="f-l">
                            {{orderData.ctime || '--'}}
                        </div>
                    </div>

                    <div class="f-l col-6"
                         v-if="orderData.form_ride_time">
                        <label class="f-l ">申请开始时间：</label>
                        <div class="f-l">
                            {{orderData.form_ride_time || '--'}}
                        </div>
                    </div>

                </div>

                <div class="clearfix pt-5 pd-5">
                    <div class="f-l col-6">
                        <label class="f-l ">出发时间：</label>
                        <div class="f-l">
                            <span v-if="orderData.order_status > 10">{{orderData.ride_time || '--'}}</span>
                            <span v-else>--</span>
                        </div>
                    </div>

                    <div class="f-l col-6">
                        <label class="f-l ">结束时间：</label>
                        <div class="f-l">
                            {{orderData.end_time || '--'}}
                        </div>
                    </div>
                </div>

                <div class="clearfix pt-5 pd-5">
                    <div class="f-l col-6">
                        <label class="f-l ">订单状态：</label>
                        <div class="f-l">
                            {{orderData.order_status | orderFilter}}
                        </div>
                    </div>
                    <div class="f-l col-6"
                         v-if="orderData.statusrecord_set.length">
                        <label class="f-l ">审批状态：</label>
                        <div class="f-l">
                            {{orderData.approval_status | approveFilter}}
                        </div>
                    </div>
                </div>

                <div class="clearfix pt-5 pd-5"
                     v-if="orderData.statusrecord_set.length || orderData.order_status >= 30">
                    <div class="f-l col-6"
                         v-if="orderData.order_status >= 30">
                        <label class="f-l">行驶里程：</label>
                        <div class="f-l">
                            {{orderData.order_mileage | translateKm}}KM
                        </div>
                        <div class="f-l"
                             v-if="orderData.order_status == 30 || orderData.order_status == 50">
                            <span @click="modifyMileage(driver)"
                                  class="btn btn-primary radius ml-20">编辑里程</span>
                        </div>
                    </div>

                    <div class="f-l col-6"
                         v-if="orderData.statusrecord_set.length">
                        <label class="f-l">附加：</label>
                        <div class="f-l">
                            {{orderData.urgent ? '加急' : '--'}}
                        </div>
                    </div>

                </div>

                <div class="clearfix pt-5 pd-5">
                    <div class="f-l col-6">
                        <label class="f-l ">用车原因：</label>
                        <div class="f-l">
                            {{orderData.reason || '--'}}
                        </div>
                    </div>
                    <div class="f-l col-6">
                        <label class="f-l ">备注信息：</label>
                        <div class="f-l">
                            {{orderData.remark || '--'}}
                        </div>
                    </div>
                </div>

                <div class="clearfix pt-5 pd-5">
                    <div class="f-l col-6">
                        <label class="f-l ">订单总费用：</label>
                        <div class="f-l">
                            {{orderData.money.toFixed(2)}}元
                        </div>
                    </div>
                </div>

                <div class="clearfix pt-5 pd-5">
                    <div class="f-l col-12">
                        <div class="clearfix">
                            <label class="f-l ">订单费用：</label>
                            <div class="f-l col-10" v-if="orderData.fee_list.length">
                                <table class="table table-border table-bordered table-hover table-bg">
                                    <thead>
                                    <tr class="text-c">
                                        <th>费用名称</th>
                                        <th>金额</th>
                                        <th>用油类型</th>
                                        <th>加油量</th>
                                        <th>加油卡号</th>
                                        <th>图片</th>
                                        <th>操作员</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr class="text-c" v-for="fee in orderData.fee_list">
                                        <td>{{fee.feetype_name}}</td>
                                        <td>{{fee.money}}</td>
                                        <td>{{fee.extra ? fee.extra.oil_type : "--"}}</td>
                                        <td>{{fee.extra ? fee.extra.oil_num : "--"}}</td>
                                        <td>{{fee.extra ? fee.extra.oil_cardnumber : "--"}}</td>
                                        <td>
                                            <img :src="fee.img" alt="" style="width:40px;" @click="clickImg(fee.img)">
                                        </td>
                                        <td>{{fee.operator}}</td>
                                    </tr>
                                    <tr class="text-c" v-if=" orderData.fee_list.length">
                                        <td>总计</td>
                                        <td>{{+(orderData.money.toFixed(2))}}</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <span class="f-l ml-10" v-else>--</span>
                        </div>
                    </div>
                </div>

            </div>

            <div class="bd_ddd mt-10 pd-10 radius ml-10 mr-10"
                 v-if="orderData.statusrecord_set.length">
                <div class="apply-box">
                    <p class="mt-10">流程审批</p>
                    <div class="relative">
                        <div class="vertical-line"></div>
                        <div class="apply-item mb-10" v-for="item in orderData.statusrecord_set">
                            <div class="circle"></div>
                            <div class="apply-content ml-10 " >
                                <div class="content-item" v-for="data in item.extend_info">
                                    <img class="img ml-5" src="../assets/images/driver_header.jpg" alt="">
                                    <div class="content">
                                        <div class="head">
                                            <div>{{data.approver}}
                                                <template v-if="data.status_name != '正在审批' && data.status_name != '无需审批' && data.status_name != '未轮到审批'">
                                                    {{data.datetime}}
                                                </template>
                                            </div>
                                            <div class="">{{data.status_name}}</div>
                                        </div>
                                        <div class="text">{{data.approval_reason}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close"></a>
    </span>
    </div>
    <div class="layui-layer-shade"></div>
</template>

<style lang="less" rel="stylesheet/less" scoped>
    .bd_ddd {
        border: 1px solid #ddd;
    }
    .apply-box{
        .apply-item{
            display: flex;
            flex-direction: row;
            align-items: center;
            .circle{
                width:10px;
                height:10px;
                background: #0497ff;
                border: none;
                border-radius: 10px;
                margin-left: 15px;
            }
            .apply-content{
                border: 1px solid #ddd;
                border-radius: 5px;
                width:400px;
                display: flex;
                flex-direction: column;
                align-items: center;
                .img{
                    width:30px;
                    height:30px;
                }
                .content-item{
                    display: flex;
                    flex-direction: row;
                    width:400px;
                    min-height:40px;
                    padding-top: 5px;
                }
                .content{
                    display: flex;
                    flex: 1;
                    flex-direction: column;
                    padding: 0 10px;
                    .head{
                        display: flex;
                        flex: 1;
                        flex-direction: row;
                        justify-content: space-between;
                    }
                    .text{
                        margin-top: 5px;
                    }
                }
            }
        }
        .vertical-line{
            border-right:1px dashed #ddd;
            top:0;
            bottom:0;
            left:19px;
            width: 1px;
            position: absolute;
            z-index: -1;
        }
    }
</style>

<script type="text/ecmascript-6">

    import * as base from '../assets/js/base.js';
    import mileage from '../components/modifyMileage';

    export default {
        ready() {
            this.getDetails();
        },
        data: function () {
            return {
                noData: false,
                items: [],
                showModifyMileage: false,
                dialogData: "",
                orderData: {
                    staff_vo: {},
                    fee_list: [],
                    statusrecord_set: [],
                    money: 0,
                },
            }
        },
        props: ["data"],
        methods: {
            close: function () {
                this.$dispatch("dialog-close", "showOrderDetail")
            },
            getDetails: function () {
                console.log("this.data");
                console.log(this.data);
                let id = this.data.id;
                $.showLoading();
                $.ajax({
                    url: `${base.gAjaxUrl.privateCarOrders}${id}/`,
                    type: 'GET',
                }).always((data) => {
                    $.hideLoading();
                    base.ajaxCallback(data, () => {
                        this.orderData = data;
                        // this.concatArr(data.trip_set)
                    });
                })
            },
            modifyMileage: function (data) {
                this.showModifyMileage = true;
            },
            closeMileage: function () {
                this.showModifyMileage = false;
            },
            saveMileage: function () {
                this.showModifyMileage = false;
                this.getDetails();
            },
            clickImg: function (url) {
                layer.open({
                    title: '图片描述',
                    content: `<img src="${url}" style="width:280px;height:auto">`,
                });
            }
        },
        components: {
            mileage: mileage,
        },
        filters: {
            orderFilter: function (status) {
                /**
                    -20	|	已取消
                    -10	|	已取消
                    5	|	审批中
                    10	|	等待开始
                    20	|	行程中
                    30	|	已完成
                    40	|	已开凭证
                    50	|	修改凭证
                **/
                switch (status) {
                    case -20: {
                        return "已驳回"
                    }
                    case -10: {
                        return "已取消"
                    }
                    case 5: {
                        return "审批中"
                    }
                    case 10: {
                        return "待开始"
                    }
                    case 20: {
                        return "行程中"
                    }
                    case 30: {
                        return "已完成"
                    }
                    case 40: {
                        return "已开凭证"
                    }
                    case 50: {
                        return "修改凭证"
                    }
                }
            },
            approveFilter: function (status) {
                /**
                 -10 ： 无法审批
                 -20 ： 已驳回
                 10 ： 审批中
                 20 ： 审批通过
                * */
                switch (status) {
                    case -20:
                        return "已驳回";
                    case -10:
                        return "无法审批";
                    case 10:
                        return "审批中";
                    case 20:
                        return "审批通过";
                }
            },
            translateKm: function (value) {
                return value > 0 ? (value / 1000).toFixed(2) : 0;
            },
        }
    }
</script>
