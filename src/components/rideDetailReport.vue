<template>
    <section class="Hui-article-box">
        <div class="page-container">
            <div class="cl pd-5 bg-1 bk-gray">
            <span class="l">
                <a class="l btn btn-primary radius" href="javascript:;" v-on:click="clickgoBack()">返回</a>
                <div class="l m-info ml-10">
                    <div class="l item">{{employeeInfoItem.real_name}}/{{employeeInfoItem.sex == 1? '男': '女'}}</div>
                    <div class="l item">{{employeeInfoItem.department_vo.department_name}}/{{employeeInfoItem.position}}</div>
                    <div class="l item">电话:{{employeeInfoItem.phone}}</div>
                    <div class="l item">工号:{{employeeInfoItem.job_number}}</div>
                    <div class="l item">搭乘次数:{{employeeInfoItem.order_ride_cnt}}</div>
                    <div class="l item">未搭乘次数:{{employeeInfoItem.order_unride_cnt}}</div>
                </div>
            </span>
            </div>
            <div class="text-l mt-20">
                关键字：
                <input type="text"
                       class="input-text Wdate mr-5"
                       style="width:150px;"
                       v-model="searchInput"
                       placeholder="线路名称/价格/站点">
                <!-- 部门：
                <span class="select-box inline mr-5">
                    <select v-model="departmentSelected" name="" class="select">
                        <option value="">全部</option>
                        <option v-bind:value="item.id" v-for="item in departmentItem">{{item.department_name}}</option>
                    </select>
                </span>  -->
                开始日期：
                <input v-model="startDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;"
                       id="J-start-date">
                结束日期：
                <input v-model="endDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;"
                       id="J-end-date">

                <button type="submit" class="btn btn-success radius" v-on:click="getList(1)"><i class="Hui-iconfont">&#xe665;</i>
                </button>
                <a class="btn btn-primary radius f-r" :href="exportData()">导出数据</a>
            </div>
            <table class="table table-border table-bordered table-hover table-bg mt-20">
                <thead>
                <tr class="text-c">
                    <th>线路名称</th>
                    <th>座位</th>
                    <th>价格</th>
                    <th>报名站点</th>
                    <th>上车站点</th>
                    <th>去返程</th>
                    <th>出发时间</th>
                    <th>出发日期</th>
                    <th>状态</th>
                </tr>
                </thead>
                <div class="result" v-if="!noData">
                    <tbody>
                    <tr class="text-c" v-for="item in items">
                        <td>{{item.shuttle_bus_date_vo.shuttle_bus_vo.shuttle_name}}</td>
                        <td>{{item.shuttle_bus_date_vo.seats}}</td>
                        <td>{{item.shuttle_bus_date_vo.shuttle_bus_vo.price/100}}</td>
                        <td>{{item.bus_station_vo ? item.bus_station_vo.station_name : '--'}}</td>
                        <td>{{item.boarding_station_vo ? item.boarding_station_vo.station_name : '--'}}</td>
                        <td>
                            {{item.shuttle_bus_date_vo.bus_time_vo?item.shuttle_bus_date_vo.bus_time_vo.shuttle_type_name:''}}
                        </td>
                        <td>
                            {{item.shuttle_bus_date_vo.bus_time_vo?item.shuttle_bus_date_vo.bus_time_vo.departure_time:item.shuttle_bus_date_vo.shuttle_bus_vo.departure_time}}
                        </td>
                        <td>{{item.shuttle_bus_date_vo.departure_date}}</td>
                        <td>{{item.status_name}}</td>
                    </tr>
                    </tbody>
                </div>
            </table>
            <div id="J-page" class="m-page" v-show="!noData"></div>
            <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
        </div>
    </section>
</template>

<style lang="less">
</style>

<script>
    import * as base from '../assets/js/base.js';
    import add from "../components/addDepartments.vue";
    import moment from "moment";

    let rideDetailReportOps = null;

    export default {
        ready() {

            this.startDateInput = localStorage['startDate'];
            this.endDateInput = localStorage['endDate'];

            rideDetailReportOps = {
                search: '',
                start_date: this.startDateInput,
                end_date: this.endDateInput,
                page: 1,
                page_size: 10
            };
//            this.startDateInput = moment().add('-1','months').format('YYYY-MM-DD');
//            this.endDateInput = moment().format('YYYY-MM-DD');

            new Kalendae.Input('J-end-date', {
                format: 'YYYY-MM-DD',
                months: 2,
                clickHide: true,
            });
            new Kalendae.Input('J-start-date', {
                format: 'YYYY-MM-DD',
                months: 2,
                clickHide: true,
            });

            //获取部门列表
            $.ajax({
                url: base.gAjaxUrl.departments,
                type: 'GET',
            }).always((data) => {
                this.departmentItem = data || [];
            });

            this.queryAjax((tpageToal = '4', count = '0') => {
                this.initPage('#J-page', tpageToal, count)
            });
        },
        data: function () {
            return {
                employeeInfoItem: JSON.parse(localStorage['employeeInfo']),
                items: [],
                noData: false,
                searchInput: '',
                startDateInput: '',
                endDateInput: '',
                departmentSelected: '',
                departmentItem: [],
                downloadXls: `${base.gAjaxUrl.staffs}${JSON.parse(localStorage['employeeInfo']).id}/export_ride_detail_report?authorization=${localStorage['token']}`
            }
        },
        methods: {
            exportData: function () {
                return `${this.downloadXls}&start_date=${this.startDateInput}&end_date=${this.endDateInput}&search=${this.searchInput}`;
            },
            //初始化分页
            initPage: function (obj, tpageToal = '4', count = '0') {
                $(obj).createPage({
                    pageCount: tpageToal,
                    current: 1,
                    count: count,
                    callback: (p) => {
                        rideDetailReportOps.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax: function (callback = function () {
            }) {
                $.showLoading();
                //修改参数

                $.ajax({
                    url: `${base.gAjaxUrl.staffs}${this.employeeInfoItem.id}/ride_detail_report/?page=${rideDetailReportOps.page}&page_size=${rideDetailReportOps.page_size}`,
                    contentType: 'application/json',
                    type: 'POST',
                    data: JSON.stringify({
                        search: rideDetailReportOps.search,
                        start_date: rideDetailReportOps.start_date,
                        end_date: rideDetailReportOps.end_date,
                    })
                }).always((data) => {
                    $.hideLoading();
                    base.ajaxCallback(data, () => {
                        let resultData = data.results;
                        this.items = resultData;
                        if (resultData.length) {
                            this.noData = false;
                            //回调
                            callback(data.num_pages, data.count);
                        } else {
                            this.noData = true;
                        }
                    });
                })
            },
            //获取列表
            getList: function (reset = 0) {
                if (moment(this.endDateInput).isBefore(this.startDateInput)) {
                    layer.msg("开始时间不能大于结束时间", {icon: 2, time: 1500});
                    return
                }
                if (reset) {
                    rideDetailReportOps.page = 1;
                    rideDetailReportOps.search = this.searchInput;
                    rideDetailReportOps.start_date = this.startDateInput;
                    rideDetailReportOps.end_date = this.endDateInput;
                }
                this.queryAjax((tpageToal = '4', count = '0') => {
                    this.initPage('#J-page', tpageToal, count)
                });
            },
            //返回
            clickgoBack: function () {
//                this.$route.router.go({path: '/rideReport', replace: true})
                this.$dispatch('dialog-close');
            }

        },
        components: {}
    }
</script>
