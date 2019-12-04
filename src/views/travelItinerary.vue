<template>

    <tag :url="tagUrl" v-if="showSetTag" :add="addContent" :title="tagTitle" @dialog-close="closeDialog"></tag>
    <path v-if="isShowPath" v-on:dialog-close="closeDialog" :data="itemData"></path>
    <detail v-if="showDetail" :data="itemData" @dialog-close="closeDialog"></detail>
    <cost v-if="showCostSet" @dialog-close="closeDialog" :order="itemData"></cost>

    <section class="Hui-article-box">
        <div class="page-container bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body clearfix">
                    <span class="f-20 fw-b f-l">行程单</span>
                    <a class="btn btn-secondary radius f-r mr-20" title="导出数据" href="javascript:;"
                       v-on:click="exportData()">导出数据</a>
                </div>
            </div>
            <div class="mt-10 bgc-fff clearfix">

                <div class="pd-10 clearfix">

                    <div class="f-l ml-10">
                        订单状态：
                        <span class="select-box inline mr-5">
                            <select v-model="orderStatus" class="select">
                                <option value="">全部</option>
                                <option value="5">审批中</option>
                                <option value="10">待开始</option>
                                <option value="20">行程中</option>
                                <option value="30">已完成</option>
                                <option value="40">已开凭证</option>
                                <option value="50">修改凭证</option>
                                <option value="-20">已驳回</option>
                                <option value="-10">已取消</option>
                            </select>
                        </span>
                    </div>

                    <div class="f-l ml-10">
                        审批状态：
                        <span class="select-box inline mr-5">
                            <select v-model="approvalStatus" class="select">
                                <option value="">全部</option>
                                <option value="10">审批中</option>
                                <option value="20">审批通过</option>
                                <option value="-20">已驳回</option>
                                <option value="-10">无法审批</option>
                            </select>
                        </span>
                    </div>

                    <div class="f-l ml-10">
                        <div class="inline-block">
                            开始日期：
                            <input v-model="startDateInput"
                                   type="text"
                                   v-el:start_date
                                   class="input-text Wdate mr-5 "
                                   style="width:120px">
                        </div>
                        <div class="inline-block">
                            结束日期：
                            <input v-model="endDateInput"
                                   type="text"
                                   v-el:end_date
                                   class="input-text Wdate mr-5"
                                   style="width:120px">
                        </div>

                    </div>

                    <div class="f-l relative ml-10 clearfix">
                        <!-- 20190814 产品宵峰去掉职位搜索项 -->
                        <select id="selectFilter" v-model="searchType" class="select f-l">
                            <option value="real_name">姓名</option>
                            <option value="car_no">车牌</option>
                            <option value="phone">手机号</option>
                            <option value="job_number">工号</option>
                            <option value="department">部门</option>
                        </select>
                        <input type="text"
                               v-model="searchContent"
                               autocomplete="off"
                               class="input-text Wdate f-l"
                               style="width:150px; margin-left: 69px;"
                               placeholder="请输入搜索内容" id="searchInput">
                        <button class="btn btn-success radius-r f-l"
                                v-on:click="getList(1)">
                            <i class="Hui-iconfont">&#xe665;</i>
                        </button>
                    </div>

                </div>

                <div class="materials bk-gray radius bgc-fff">
                    <table class="waterElectricityForm table table-border table-bg table-striped bor-l bor-r">
                        <thead class="text-c">
                        <tr>
                            <th width="60">司机</th>
                            <th width="80">部门/职位</th>
                            <th width="80">电话</th>
                            <th width="80">驾驶车辆</th>
                            <th width="80">起始地/目的地</th>
                            <th width="60">开始时间</th>
                            <th width="60">结束时间</th>
                            <th width="80">用车原因</th>
                            <th width="60">订单状态</th>
                            <th width="80">行驶里程/KM</th>
                            <th width="80">总金额/元</th>
                            <th width="60">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr class="text-c" v-for="data in items">
                            <td>{{data.staff_vo.real_name}}</td>
                            <td class="max-150">
                                {{data.staff_vo.department_name}}/{{data.staff_vo.position?data.staff_vo.position:'--'}}
                            </td>
                            <td>{{data.staff_vo.phone}}</td>
                            <td>{{data.car_no}}</td>
                            <td class="max-150">{{data.source_name}}/{{data.destination_name}}</td>
                            <td>
                                <span v-if="data.order_status > 10">{{data.ride_time || '--'}}</span>
                                <span v-else>--</span>
                            </td>
                            <td>
                                {{data.end_time || '--'}}
                            </td>
                            <td class="max-150">{{data.reason || '--'}}</td>
                            <td>
                                {{data.order_status | orderFilter}}
                            </td>

                            <td>
                                <span v-if="data.order_status >= 30">
                                    {{data.order_mileage | translateKm}}
                                </span>
                                <span v-else>--</span>
                            </td>

                            <td>{{data.money.toFixed(2)}}</td>
                            <td>

                                <a class="btn btn-link radius"
                                   href="javascript:;"
                                   v-on:click="showDialogComponent('showDetail',data)">查看详情</a>

                                <a v-if="data.order_status == 30 || data.order_status == 50"
                                   href="javascript:;"
                                   class="btn btn-link radius"
                                   v-on:click="showDialogComponent('showCostSet',data)">费用设置</a>

                                <a v-if="data.order_status >= 30 && locationConfig.cat_map && locationConfig.privatecar_cat_map"
                                   href="javascript:;"
                                   class="btn btn-link radius"
                                   v-on:click="showDialogComponent('isShowPath',data)">查看路径</a>

                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div id="J-page" class="m-page" v-show="!noData"></div>
                    <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
                </div>
            </div>
        </div>
    </section>

</template>

<script type="text/ecmascript-6">

    import * as base from '../assets/js/base.js';
    import moment from "moment";
    import path from "../components/privateCarPathMap.vue"
    import detail from "../components/travelOrderDetail.vue"
    import cost from "../components/setPrivateCost.vue"
    import tag from '../components/setBuildingTag'

    let pageOps = null;

    export default {
        ready() {

            this.startDateInput = moment().add(-1, "months").format('YYYY-MM-DD');
            this.endDateInput = moment().format('YYYY-MM-DD');

            new Kalendae.Input(this.$els.start_date, {
                months: 2,
                clickHide: true
            });
            new Kalendae.Input(this.$els.end_date, {
                months: 2,
                clickHide: true
            });

            pageOps = {
                page: 1,
                page_size: 10,
            };

            this.getList(1);

            this.getLocationConfig();

        },
        data: function () {
            return {
                items: [],
                noData: false,
                searchType: 'real_name',
                searchContent: '',
                orderStatus: '', // 订单状态
                approvalStatus: '', // 审批状态
                startDateInput: '',
                endDateInput: '',
                itemData: null,
                isShowPath: false,
                showDetail: false,
                showCostSet: false,
                tagUrl: `${base.gAjaxUrl.privateCarCostTypes}`, // 费用类型url
                showSetTag: false,
                addContent: "私家车费用类型",
                tagTitle: "费用类型管理",
                locationConfig: {} // 轨迹
            }
        },
        methods: {
            getLocationConfig() {
                $.ajax({
                    url: `${base.gAjaxUrl.baseConfig}cat_map/`,
                    type: 'GET',
                }).always((data) => {
                    base.ajaxCallback(data, () => {
                        this.locationConfig = data;
                    });
                })
            },
            showDialogComponent: function (key, item) {
                this[key] = true;
                if (item) {
                    this.itemData = item;
                }
            },
            closeDialog: function () {
                this.showDetail = false;
                this.isShowPath = false;
                this.showSetTag = false;
                this.showCostSet = false;
                this.queryAjax((tpageToal = '4', count = '0') => {
                    this.initPage('#J-page', tpageToal, pageOps.page, count)
                });
            },
            getList: function (flag) {
                if (flag) {
                    let ajaxData = {
                        page: pageOps.page,
                        page_size: pageOps.page_size,
                        order_status: this.orderStatus,
                        approval_status: this.approvalStatus,
                        start_date: this.startDateInput,
                        end_date: this.endDateInput,
                    };
                    ajaxData[this.searchType] = this.searchContent;
                    pageOps = ajaxData;
                }
                this.queryAjax((tpageToal = '4', count = '0') => {
                    this.initPage('#J-page', tpageToal, pageOps.page, count)
                });
            },
            queryAjax: function (callback) {
                if (moment(this.endDateInput).isBefore(this.startDateInput)) {
                    layer.msg("开始时间不能大于结束时间", {icon: 2, time: 2000});
                    return
                }
                //修改参数
                $.showLoading();
                $.ajax({
                    url: `${base.gAjaxUrl.privateCarOrders}`,
                    type: 'GET',
                    data: pageOps
                }).always((data) => {
                    $.hideLoading();
                    base.ajaxCallback(data, () => {
                        let resultData = data.results;
                        this.items = resultData;
                        if (resultData && resultData.length) {
                            this.noData = false;
                            //回调
                            typeof callback === 'function' && callback(data.num_pages, data.count);
                        } else {
                            this.noData = true;
                        }
                    });
                })
            },
            initPage: function (obj, tpageToal = '4', current = '1', count = '0') {
                $(obj).createPage({
                    pageCount: tpageToal,
                    current: current,
                    count: count,
                    callback: (p) => {
                        pageOps.page = p;
                        this.queryAjax();
                    }
                });
            },
            exportData: function () {
                let ajaxData = {
                    order_status: this.orderStatus,
                    approval_status: this.approvalStatus,
                    start_date: this.startDateInput,
                    end_date: this.endDateInput,
                };
                ajaxData[this.searchType] = this.searchContent;
                $.ajax({
                    url: `${base.gAjaxUrl.privateCarOrders}export/`,
                    type: 'GET',
                    contentType: "application/json;charset=utf-8",
                    data: ajaxData,
                }).always((data) => {
                    this.$route.router.go({path: '/job'});
                    // layer.msg('最新的一条数据请重新刷新哦',{icon:1,time:3000});
                })
            },
        },
        filters: {
            translateKm: function (value) {
                if (value < 0) {
                    return '0.00';
                } else {
                    return (value / 1000).toFixed(2);
                }
            },
            orderFilter: function (status) {
                /**
                 -20   |   已驳回
                 -10   |   已取消
                 5    |    审批中
                 10    |    待开始
                 20    |    行程中
                 30    |    已完成
                 40    |    已开凭证
                 50    |    修改凭证
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
        },
        events: {},
        components: {
            path,
            tag,
            detail,
            cost,
        },
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    #selectFilter {
        width: 70px;
        height: 31px;
        position: absolute;
    }

    .td-hide {
        max-width: 100px;
    }

</style>
