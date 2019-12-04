<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">订单详情</div>
        <h4 class="ml-15">订单编号 :{{orderData.order_no}} </h4>
        <div class="layui-layer-content layui-layer-order-wrap">
            <div class="bd_ddd pb-10">
                <div class="row cl">
                    <div class="f-l col-6">
                        <label class="f-l ml-10">司机：</label>
                        <div class="f-l">
                            <div class="">
                                {{orderData.real_name}}
                            </div>
                        </div>
                    </div>

                    <div class="f-l col-6">
                        <label class="f-l ml-10">性别：</label>
                        <div class="f-l">
                            <div class="">
                                {{orderData.sex_label}}
                            </div>
                        </div>
                    </div>

                </div>

                <div class="row cl">
                    <div class="f-l col-6">
                        <label class="f-l ml-10">部门：</label>
                        <div class="f-l">
                            <div class="">
                                {{orderData.department_name}}
                            </div>
                        </div>
                    </div>

                    <div class="f-l col-6">
                        <label class="f-l ml-10">职位：</label>
                        <div class="f-l">
                            <div class="">
                                {{orderData.position?orderData.position:'--'}}
                            </div>
                        </div>
                    </div>
                </div>


                <div class="row cl">
                    <div class="f-l col-6">
                        <label class="f-l ml-10">电话：</label>
                        <div class="f-l">
                            <div class="">
                                {{orderData.phone}}
                            </div>
                        </div>
                    </div>

                    <div class="f-l col-6">
                        <label class="f-l ml-10">使用车辆：</label>
                        <div class="f-l">
                            <div class="">
                                {{orderData.car_no}}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row cl">
                    <div class="f-l col-6">
                        <label class="f-l ml-10">起点：</label>
                        <div class="f-l">
                            <div class="">
                                {{orderData.source_name}}
                            </div>
                        </div>
                    </div>

                    <div class="f-l col-6">
                        <label class="f-l ml-10">终点：</label>
                        <div class="f-l">
                            <div class="">
                                {{orderData.destination_name || '--'}}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row cl">
                    <div class="f-l col-6">
                        <label class="f-l ml-10">申请时间：</label>
                        <div class="f-l">
                            {{orderData.ctime || '--'}}
                        </div>
                    </div>

                    <div class="f-l col-6"
                         v-if="orderData.form_ride_time">
                        <label class="f-l ml-10">申请开始时间：</label>
                        <div class="f-l">
                            {{orderData.form_ride_time || '--'}}
                        </div>
                    </div>

                </div>

                <div class="row cl">
                    <div class="f-l col-6">
                        <label class="f-l ml-10">出发时间：</label>
                        <div class="f-l">
                            <div class="">
                                <span v-if="orderData.order_status > 10">{{orderData.ride_time || '--'}}</span>
                                <span v-else>--</span>
                            </div>
                        </div>
                    </div>

                    <div class="f-l col-6">
                        <label class="f-l ml-10">结束时间：</label>
                        <div class="f-l">
                            <div class="">
                                {{orderData.end_time || '--'}}
                            </div>
                        </div>
                    </div>
                </div>


                <div class="row cl">
                    <div class="f-l col-6">
                        <label class="f-l ml-10">订单状态：</label>
                        <div class="f-l">
                            <div class="">
                                {{orderData.order_status | orderFilter}}
                            </div>
                        </div>
                    </div>
                    <div class="f-l col-6"
                         v-if="orderData.statusrecord_set.length">
                        <label class="f-l ml-10">审批状态：</label>
                        <div class="f-l">
                            <div class="">
                                {{orderData.approval_status | approveFilter}}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row cl">
                    <div class="f-l col-6">
                        <label class="f-l ml-10">行驶里程：</label>
                        <div class="f-l">
                            <div class="">
                                {{orderData.order_mileage | translateKm}}KM
                            </div>
                        </div>
                    </div>
                    <div class="f-l col-6"
                         v-if="orderData.statusrecord_set.length">
                        <label class="f-l ml-10">附加：</label>
                        <div class="f-l">
                            <div class="">
                                {{orderData.urgent ? '加急' : '--'}}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row cl">
                    <div class="f-l col-6">
                        <label class="f-l ml-10">用车原因：</label>
                        <div class="f-l">
                            <div class="">
                                {{orderData.reason || '--'}}
                            </div>
                        </div>
                    </div>
                    <div class="f-l col-6">
                        <label class="f-l ml-10">备注信息：</label>
                        <div class="f-l">
                            <div class="">
                                {{orderData.remark || '--'}}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row cl">
                    <div class="f-l col-12">
                        <label class="f-l ml-10">订单总费用：</label>
                        <div class="f-l">
                            <div class="">
                                {{orderData.fees.toFixed(2)}}元
                            </div>
                        </div>
                    </div>

                </div>


                <div class="row cl">
                    <div class="f-l col-12">
                        <div class="row cl">
                            <label class="f-l ml-10">补贴费用：</label>
                            <div class="f-l col-10"
                                 v-if="orderData.subsidy_list.length">
                                <table class="table table-border table-bordered table-hover table-bg">
                                    <thead>
                                    <tr class="text-c">
                                        <th>补贴类型</th>
                                        <th>补贴方式</th>
                                        <th>补贴数</th>
                                        <th>补贴单价</th>
                                        <th>补贴金额</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr class="text-c" v-for="fee in orderData.subsidy_list">
                                        <td>{{fee.type}}</td>
                                        <td>{{fee.mode}}</td>
                                        <td>{{fee.unit > 0 ? fee.unit.toFixed(2) : 0}}</td>
                                        <td>{{fee.uprice}}</td>
                                        <td>{{fee.fee}}</td>

                                    </tr>
                                    <tr class="text-c">
                                        <td>总计</td>
                                        <td>{{subsidyTotal}}</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-else>--</div>
                        </div>
                    </div>

                </div>

                <div class="row cl">
                    <div class="f-l col-12">
                        <div class="row cl">
                            <label class="f-l ml-10">订单费用：</label>
                            <div class="f-l col-10"
                                 v-if="orderData.fee_list.length">
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
                                    <tr class="text-c" v-if="orderData.fee_list.length">
                                        <td>总计</td>
                                        <td>{{orderData.fees}}</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-else>--</div>
                        </div>
                    </div>

                </div>

                <div class="row cl mt-10 pd-10 radius ml-10 mr-10"
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
        margin: 0 10px;
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

    export default {
        ready() {
            this.getDetails();
        },
        data: function () {
            return {
                noData: false,
                items: [],
                dialogData: "",
                orderData: {
                    staff_vo: {},
                    fee_list: [],
                    statusrecord_set: [],
                    subsidy_list: [],
                    fees: 0,
                },
                subsidyTotal: 0,
            }
        },
        props: ["data"],
        methods: {
            close: function () {
                this.$dispatch("dialog-close")
            },
            getDetails: function () {
                let id = this.data.id;
                let that = this;
                $.showLoading();
                $.ajax({
                    url: `${base.gAjaxUrl.subsidyStatistics}order_detail/`,
                    type: 'GET',
                    data: {
                        order: that.data.order_id
                    }
                }).always((data) => {
                    $.hideLoading();
                    base.ajaxCallback(data, () => {
                        this.orderData = data;
                        data.subsidy_list.map((item) => {
                            this.subsidyTotal += item.fee;
                        })
                    });
                })
            },
            clickImg: function (url) {
                layer.open({
                    title: '图片描述',
                    content: `<img src="${url}" style="width:280px;height:auto">`,
                });
            }

        },
        components: {},
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
            translateKm: function (value) {
                return value > 0 ? (value / 1000).toFixed(2) : 0;
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
        }
    }
</script>
