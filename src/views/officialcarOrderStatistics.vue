<template>
    <!--<dateorderdetail></dateorderdetail>-->

    <!--<div id="officialcar-order-statistics" class="minw-835">-->
    <departmentorderdetail :data="passData" :start="startDateInput" :end="endDateInput" :departmentsdata="departments"
                           v-if="isShowDepartmentOrderDetailDialog"
                           v-on:dialog-pass-close="cancelDepartmentOrderDetailDialog"></departmentorderdetail>

    <dailyorderdetail :data="dailyData" v-if="isShowDailyOrderDetailDialog"
                      v-on:dialog-pass-close="cancelDailyOrderDetailDialog"></dailyorderdetail>

    <drivingtimedetail :start="startDateInput" :end="endDateInput" :data="selectedDrivingtime"
                       v-if="isShowDrivingTimeDetailDialog"
                       v-on:dialog-pass-close="cancelDrivingTimeDetailDialog"></drivingtimedetail>

    <drivingdistancedetail :start="startDateInput" :end="endDateInput" :data="selectedDrivingdistance"
                           v-if="isShowDrivingDistanceDetailDialog"
                           v-on:dialog-pass-close="cancelDrivingDistanceDetailDialog"></drivingdistancedetail>
    <div class="dataDate cl">
        <div class="f-r">
            <span class="fw-b f-16">数据展示时间</span>
            开始日期：
            <input v-model="startDateInput" type="text" class="input-text date-input" id="J-start-outer-date"
                   v-bind:value="startDateInput">
            结束日期：
            <input v-model="endDateInput" type="text" class="input-text date-input" id="J-end-outer-date"
                   v-bind:value="endDateInput">
            <button type="submit" class="btn btn-success radius" v-on:click="setDateRange()"><i class="Hui-iconfont">
                &#xe665;</i></button>
        </div>
    </div>
    <div id="header">

        <!--<select class="selectDayRange" v-model="days" @change="setDateRange()" >-->
        <!--<option value="7"  selected = "selected">7天</option>-->
        <!--<option value="14">14天</option>-->
        <!--<option value="30">30天</option>   -->
        <!--<option value="60">60天</option>   -->
        <!--<option value="90">90天</option>   -->
        <!--</select>-->
        <!--<button id="detailButton" type="button">员工用车明细</button>-->

        <div class="profile">
            <div id="order_num" class="profileItem">
                <div class="profileItemContentArea vc">
                    <span class="profileItemContent">{{ totalOrderNum }}个</span>
                    <span class="profileItemTitle">订单总数</span>
                </div>
            </div>
            <div id="driving_mileage" class="profileItem">
                <div class="profileItemContentArea vc">
                    <span class="profileItemContent">{{ totalDrivingMileage | twoFixed }}km</span>
                    <span class="profileItemTitle">总行驶里程</span>
                </div>
            </div>
            <div id="driving_time" class="profileItem">
                <div class="profileItemContentArea vc">
                    <span class="profileItemContent">{{ totalDrivingTime | twoFixed }}h</span>
                    <span class="profileItemTitle">总行驶时长</span>
                </div>
            </div>
        </div>
    </div>
    <!--各部门订单总数-->
    <div class="chart-container relative">
        <div class=chartTitleContentSeperator>
        </div>
        <div class="row cl department-control">
            <div class="col-12 f-l">
                <div class="form-label f-l col-3 text-r mr-5 mt-5 select-department">选择部门:</div>
                <div class="formControls f-l col-7">
                    <div class="department_select_container" @mouseleave="departmentEnter(false)"
                         @mouseenter="departmentEnter(true)">
                        <input v-if="departments.length === 0" disabled type="text" class="input-text" value="无可选择部门">
                        <input v-else autocomplete="off" @click="departmentClick" v-model="departmentSelectedName"
                               type="text" class="input-text" value="" placeholder="" name="department">
                        <i v-show="departmentSelectedName !== ''" class="empty-icon Hui-iconfont"
                           @click="emptySearch()">&#xe60b;</i>
                        <div class="departmentListBox" style="display: none">
                            <div v-bind:title="item.department_tree"
                                 v-for="item in departmentItem | filterBy departmentSelectedName in 'department_tree'"
                                 @click="setDepartmentValue(item)" class="departmentListItem">
                                {{item.department_tree}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="department_order_statistics"></div>

    </div>
    <!--每天订单总数-->
    <div class="chart-container">
        <div class=chartTitleContentSeperator></div>
        <div id="company_order_statistics"></div>
    </div>
    <!--订单行驶时间分布-->
    <div class="chart-container">
        <div class=chartTitleContentSeperator></div>
        <span class="chart-title">分布统计</span>
        <div id="order_driving_time_distribution"></div>
        <!--订单行驶距离分布-->
        <div id="order_driving_distance_distribution"></div>
    </div>

    <!-- <div class="popup" v-if="showDepartmentOrderDetail"> -->
    <!-- <departmentorderdetail  id="department-order-detail" class="hide" v-on:popup-close="closePopupDetail(0)"></departmentorderdetail> -->
    <!-- </div> -->
    <!--</div>-->
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>

</template>
<style lang="less" rel="stylesheet/less" scoped>
    .popup {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: gray;
        text-align: center;
    }

    .popup:first-child {
        display: inline-block;
    }

    #officialcar-order-statistics {
        background-color: rgb(246, 247, 248);
    }

    .dataDate {
        /*margin-top: 20px;*/
        /*float:right;*/
        input {
            width: 26%;
        }
    }

    #header {
        height: 200px;
    }

    .right-section {
        width: 100%;
        position: relative;
        left: 80%;
        top: 20px;
    }

    .selectDayRange {
        width: 100px;
        margin-left: 10px;
        background: #5cadff;
        color: #fff;
        height: 26px;
        font-size: 15px;
        border: none;
        text-align: center;
    }

    #detailButton {
        width: 100px;
        margin-left: 99px;
        margin-top: 10px;
        background: #5cadff;
        color: #fff;
        height: 26px;
        font-size: 13px;
        border: none;
        border-radius: 4px;
    }

    .vc {
        position: relative; /*脱离文档流*/
        top: 50%; /*偏移*/
        transform: translateY(-50%);
    }

    .profile {
        text-align: center;
        height: inherit;
        margin-top: 38px;
    }

    .profile span {
        display: block;
    }

    .profileItem {
        width: 250px;
        height: 121px;
        display: inline-block;
        margin: 0 10px;
    }

    .profileItemContentArea {
        text-align: left;
        padding-left: 15px;
    }

    .profileItemTitle {
        color: white;
        font-size: 15px;
    }

    .profileItemContent {
        color: white;
        font-size: 28px;
    }

    #order_num {
        background: url(../assets/images/order_num_bg.png);
        background-size: 250px 121px;
    }

    #driving_mileage {
        background: url(../assets/images/driving_mileage_bg.png);
        background-size: 250px 121px;
    }

    #driving_time {
        background: url(../assets/images/driving_time_bg.png);
        background-size: 250px 121px;
    }

    #detailButton {
        display: block;
    }

    .chart-container {

        /*width: calc( 100% - 20px * 2);*/
        height: 600px;
        background-color: white;
        border-radius: 10px;
        margin-left: 20px;
        margin-right: 20px;
        margin: 20px;
    }

    .chart-title {
        margin-left: 20px;
        height: 50px;
        font-size: 20px;
        font-weight: bold;
        display: block;
        padding-top: 10px;
    }

    .chartTitleContentSeperator {
        position: relative;
        top: 50px;
        width: 100%;
        height: 1px;
        background-color: rgb(225, 234, 242);
    }

    #department_order_statistics {
        width: 100%;
        height: 600px;
    }

    #company_order_statistics {
        width: 100%;
        height: 600px;
    }

    #order_driving_time_distribution {
        width: 45%;
        height: 300px;
        float: left;
    }

    #order_driving_distance_distribution {
        width: 45%;
        height: 300px;
        float: right;
    }

    .department-control {
        z-index: 12;
        width: 500px;
        position: absolute;
        top: 8px;
        left: 118px;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import moment from "moment";
    import echarts from 'echarts';
    import departmentorderdetail from '../components/departmentOrderDetail.vue';
    import dailyorderdetail from '../components/dailyOrderDetail.vue';
    import drivingtimedetail from '../components/drivingtimeDetail.vue';
    import drivingdistancedetail from '../components/drivingdistanceDetail.vue';

    export default{
        ready () {

            this.startDateInput = moment().add(-1, 'days').format('YYYY-MM-DD');
            this.endDateInput = moment().format('YYYY-MM-DD');

            new Kalendae.Input('J-end-outer-date', {
                months: 2,
                clickHide: true
            });
            new Kalendae.Input('J-start-outer-date', {
                months: 2,
                clickHide: true
            });

            let chartIds = ['department_order_statistics', 'company_order_statistics', 'order_driving_time_distribution', 'order_driving_distance_distribution'];
            // base.fixEchartsWidthPercentage(chartIds)
            //$('#officialcar-order-statistics').width()
            //initChart(this)
            //configureWithSelectedDayRange(this.selectedDayRange, this);
//            this.departmentChart = echarts.init(document.getElementById('department_order_statistics'));
//            this.dailyorderChart = echarts.init(document.getElementById('company_order_statistics'));
//            this.drivingtimeChart = echarts.init(document.getElementById('order_driving_time_distribution'));
//            this.drivingdistanceChart = echarts.init(document.getElementById('order_driving_distance_distribution'));
            this.setDateRange();
            window.onresize = function () {
                this.setDateRange();
            }
            //获取部门列表
            $.ajax({
                url: `${base.gAjaxUrl.departments}?page=1&page_size=9999999`,
                type: 'GET',
            }).always((data)=> {
                this.departmentItem = data || [];
            });
        },
        data: function () {
            return {
                departmentChart: null,
                dailyorderChart: null,
                drivingtimeChart: null,
                drivingdistanceChart: null,
                isShowDepartmentOrderDetailDialog: false,
                isShowDailyOrderDetailDialog: false,
                isShowDrivingTimeDetailDialog: false,
                isShowDrivingDistanceDetailDialog: false,
                totalOrderNum: 0,
                totalDrivingMileage: 0,
                totalDrivingTime: 0,
                departments: [],
                passData: '', //部门id
                dailyData: {},
                drivingtime: [],
                selectedDrivingtime: {},
                drivingdistance: [],
                selectedDrivingdistance: {},
                startDateInput: 0,
                endDateInput: 0,
                itemsLoading: true,
                isDepartmentFocus: false,
                departmentSelectedName: '',
                departmentSelected: '',
                departmentItem: [],
                departmentStartValue: 0, // echarts部门展示的起始位置
                departmentEndValue: 9, // 部门展示的结束位置
                initEchartsData: {}, // echarts初始化时使用的数据
            }
        },
        methods: {
            // onChangeStatisticRange: function() {
            //     configureWithSelectedDayRange(this.selectedDayRange, this)
            //     // configureDepartmentOrderStatisticsChart(this.selectedDayRange)
            //     // configureOrderStatisticsChart(this.selectedDayRange)
            //     // configureOrderDistributionWithType(ORDER_DISTRIBUTION_TYPE_DRIVING_TIME, this.selectedDayRange)
            //     // configureOrderDistributionWithType(ORDER_DISTRIBUTION_TYPE_DRIVING_DISTANCE, this.selectedDayRange)
            // },
            cancelDepartmentOrderDetailDialog: function () {
                this.isShowDepartmentOrderDetailDialog = false;
            },
            cancelDailyOrderDetailDialog: function () {
                this.isShowDailyOrderDetailDialog = false;
            },
            cancelDrivingTimeDetailDialog: function () {
                this.isShowDrivingTimeDetailDialog = false;
            },
            cancelDrivingDistanceDetailDialog: function () {
                this.isShowDrivingDistanceDetailDialog = false;
            },
            getBaseData: function () {
                let that = this;
                $.ajax({
                    url: base.gAjaxUrl.officialcarProfile,
                    type: 'GET',
                    data: {
                        start_date: that.startDateInput,
                        end_date: that.endDateInput,
                    }
                })
                        .success((data)=> {
                            that.totalOrderNum = data.order_num;
                            that.totalDrivingMileage = data.driving_mileage ? data.driving_mileage : 0;
                            that.totalDrivingTime = data.driving_time;
                        });
            },
            setDateRange: function () {
                if (moment(this.endDateInput).isBefore(this.startDateInput)) {
                    layer.msg("开始时间不能大于结束时间", {icon: 2, time: 1500});
                    return
                }
                this.itemsLoading = true;
                this.start_date = this.formatDate(this.days);
                this.end_date = this.formatDate(0);
                this.queryAjax();
                this.getBaseData();
                //localStorage.officialCarData = this.days;
                //let x = document.getElementById("selectId").selectedIndex;
                //localStorage.selectindex = x;
            },
            queryAjax: function () {
                let that = this;
                $.ajax({
                    url: base.gAjaxUrl.departmentOrderNums,
                    type: 'GET',
                    data: {
                        start_date: that.startDateInput,
                        end_date: that.endDateInput,
                    }
                }).success((data)=> {
                    that.itemsLoading = false;
                    that.departments = data;
                    let department_data = that.organizationDepartmentData(data);
                    that.initEchartsData = department_data;
                    that.initDepartmentChart(department_data)
                }).always(function (data) {
                    base.ajaxCallback(data, ()=> {
                    })
                });

                $.ajax({
                    url: base.gAjaxUrl.orderNums,
                    type: 'GET',
                    data: {
                        start_date: that.startDateInput,
                        end_date: that.endDateInput,
                    }
                })
                        .success((data)=> {
                            that.orders = data;
                            let order_data = that.organizationDailyOrderData(data);

                            that.initDailyOrderChart(order_data)
                        });

                $.ajax({
                    url: base.gAjaxUrl.orderDistributions,
                    type: 'GET',
                    data: {
                        start_date: that.startDateInput,
                        end_date: that.endDateInput,
                        distribute_type: 0,
                    }
                })
                        .success((data)=> {
                            that.drivingtime = data;
                            let driving_time = that.organizationDrivingtimeChartData(data);
                            that.initDrivingtimeChart(driving_time)
                        });

                $.ajax({
                    url: base.gAjaxUrl.orderDistributions,
                    type: 'GET',
                    data: {
                        start_date: that.startDateInput,
                        end_date: that.endDateInput,
                        distribute_type: 1,
                    }
                })
                        .success((data)=> {
                            that.drivingdistance = data;
                            let driving_distance = that.organizationDrivingdistanceChartData(data);
                            that.initDrivingdistanceChart(driving_distance)
                        });
            },
            formatDate: function (days) {
                let dd = new Date();
                dd.setDate(dd.getDate() - days);//获取AddDayCount天后的日期
                let y = dd.getFullYear();
                let m = dd.getMonth() + 1;//获取当前月份的日期
                let d = dd.getDate();
                return y + "-" + m + "-" + d;
            },
            organizationDepartmentData: function (data) {
                let order_num = [];
                let staff__department = [];
                let staff__department__department_name = [];
                $.each(data, function (index, elem) {
                    order_num.push(elem['order_num']);
                    staff__department.push(elem['staff__department']);
                    staff__department__department_name.push(elem['staff__department__department_name']);
                })
                let result = {
                    'order_num': order_num,
                    'staff__department': staff__department,
                    'staff__department__department_name': staff__department__department_name,
                };
                // this.initEchartsData = result;
                return result;
            },
            organizationDailyOrderData: function (data) {
                let date = [];
                let order_num = [];
                $.each(data, function (index, elem) {
                    date.push(elem['date']);
                    order_num.push(elem['order_num']);
                })
                let result = {
                    'date': date,
                    'order_num': order_num,
                };
                return result;
            },
            organizationDrivingtimeChartData: function (data) {
                let result = [];
                $.each(data, function (index, elem) {
                    let item = {};
                    if (elem['range_start'] == 0 && elem['range_end'] == 1) {
                        item.value = elem['order_num'];
                        item.name = '0-1h';
                    }
                    if (elem['range_start'] == 1 && elem['range_end'] == 3) {
                        item.value = elem['order_num'];
                        item.name = '1-3h';
                    }
                    if (elem['range_start'] == 3 && elem['range_end'] == 6) {
                        item.value = elem['order_num'];
                        item.name = '3-6h';
                    }
                    if (elem['range_start'] == 6 && elem['range_end'] == 12) {
                        item.value = elem['order_num'];
                        item.name = '6-12h';
                    }
                    if (elem['range_start'] == 12 && elem['range_end'] == 24) {
                        item.value = elem['order_num'];
                        item.name = '12-24h';
                    }
                    if (elem['range_start'] == 24 && elem['range_end'] == 'max') {
                        item.value = elem['order_num'];
                        item.name = '>24h';
                    }
                    result.push(item);
                });
                return result;
            },
            organizationDrivingdistanceChartData: function (data) {
                let result = [];
                $.each(data, function (index, elem) {
                    let item = {};
                    if (elem['range_start'] == 0 && elem['range_end'] == 10) {
                        item.value = elem['order_num'];
                        item.name = '0-10km';
                    }
                    if (elem['range_start'] == 10 && elem['range_end'] == 30) {
                        item.value = elem['order_num'];
                        item.name = '10-30km';
                    }
                    if (elem['range_start'] == 30 && elem['range_end'] == 60) {
                        item.value = elem['order_num'];
                        item.name = '30-60km';
                    }
                    if (elem['range_start'] == 60 && elem['range_end'] == 100) {
                        item.value = elem['order_num'];
                        item.name = '60-100km';
                    }
                    if (elem['range_start'] == 100 && elem['range_end'] == 200) {
                        item.value = elem['order_num'];
                        item.name = '100-200km';
                    }
                    if (elem['range_start'] == 200 && elem['range_end'] == 'max') {
                        item.value = elem['order_num'];
                        item.name = '>200km';
                    }
                    result.push(item);
                });
                return result;
            },
            initDepartmentChart: function (department_data) {
                let that = this;
                this.departmentChart = echarts.init(document.getElementById('department_order_statistics'));
                this.departmentChart.setOption({
                    title: {
                        text: "部门订单数",
                        padding: [15, 20],
                    },
                    toolbox: {
                        show: true,
                        orient: 'horizontal',  // 布局方式，默认为水平布局，可选为： 'horizontal' ¦ 'vertical'
                        x: '88%',  // 水平安放位置，默认为全图右对齐，可选为：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
                        y: '10', // 垂直安放位置，默认为全图顶端，可选为：// 'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
                        // 各工具盒的颜色设置
                        color: ['red', 'blue', 'blue', 'green', 'red', 'blue', 'blue', 'green', 'black'],
                        feature: {
                            mark: {show: true},
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                    },
                    legend: {
                        width: 20,
                    },
                    grid: {
                        top: 100,
                        bottom: 200,
//                        x: 40,
//                        x2: 100,
//                        y2: 150,// y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
                    },
                    dataZoom: [
                        {
                            type: 'inside',
                            xAxisIndex: [0],
                            // start: 0,
                            // end: 10/that.departments.length * 100, // 当前可视区域展示的数据量,是以总数据为百分比展示,如100条,值为20,就显示5条.
                            startValue: that.departmentStartValue,                           //数据窗口范围的起始数值
                            endValue: that.departmentEndValue,                            //数据窗口范围的结束数值。
                            zoomLock: true,
                        },
                        {
                            type: 'slider',
                            height: 15,
                            start: 0,
                            end: 50,
                            bottom: 10,
                            zoomLock: true,
                            y: 530, // 橫向拖动条的位置
                        }
                    ],
                    xAxis: [
                        {
                            type: 'category',
                            data: department_data.staff__department__department_name,
                            name: '日期',
                            axisLabel: {
                                interval: 0,
                                rotate: 30,
                                formatter: function (value) {
                                    if (value.length > 10) {
                                        let half = Math.ceil(value.length / 2);
                                        return value.slice(0, half) + "\n" + value.slice(half);
                                    } else {
                                        return value
                                    }
                                }
//                                textStyle:{
////                                  width:10,
//                                    color:"red",
//                                },
                            },

                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '订单数',
                            axisLabel: {
                                formatter: function (value) {
                                    return value % 1 === 0 ? value : '';
                                }
                            },
                        }
                    ],
                    series: [
                        {
                            name: '订单数',
                            type: 'bar',
                            data: department_data.order_num,
                            barWidth: 30,
                            barMinHeight: 1,
                            itemStyle: {
                                normal: {
                                    color: 'rgb(108, 175, 255)',
                                },
                            },
                            label: {
                                normal: {
                                    position: 'top',
                                    show: true
                                }
                            },
                        }
                    ]
                });
                let staffDepartmentsArr = department_data.staff__department;
                that.departmentChart.on('click', function (params) {
//                    that.departmentSelectedName = params.name; // 这里改用deparment_tree字段了，所以不赋值了
                    that.isShowDepartmentOrderDetailDialog = true;
                    that.passData = staffDepartmentsArr[params.dataIndex];
                });


            },
            initDailyOrderChart: function (order_data) {
                this.dailyorderChart = echarts.init(document.getElementById('company_order_statistics'));
                this.dailyorderChart.setOption({
                    title: {
                        text: "每日订单数",
                        padding: [15, 20],
                    },
                    toolbox: {
                        show: true,
                        orient: 'horizontal',  // 布局方式，默认为水平布局，可选为： 'horizontal' ¦ 'vertical'
                        x: '88%',  // 水平安放位置，默认为全图右对齐，可选为：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
                        y: '10', // 垂直安放位置，默认为全图顶端，可选为：// 'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
                        // 各工具盒的颜色设置
                        color: ['red', 'blue', 'blue', 'green', 'red', 'blue', 'blue', 'green', 'black'],
                        feature: {
                            mark: {show: true},
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                    },
                    legend: {
                        width: 20,
                    },
                    grid: {
                        top: 100,
                        bottom: 100,
                    },
                    dataZoom: [
                        {
                            type: 'inside',
                            xAxisIndex: [0],
                            start: 0,
                            end: parseInt(10.0 / order_data.date.length * 100),
//                            end: 50,
                            zoomLock: true,
                        },
                        {
                            type: 'slider',
                            height: 15,
                            start: 0,
                            end: 50,
                            bottom: 10,
                            zoomLock: true
                        }
                    ],
                    xAxis: [
                        {
                            type: 'category',
                            data: order_data.date,
                            name: '日期',
                            axisLabel: {
                                interval: 0,
                                rotate: 30,
                            },
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '订单数',
                            axisLabel: {
                                formatter: function (value) {
                                    return value % 1 === 0 ? value : '';
                                }
                            },
                        }
                    ],
                    series: [
                        {
                            name: '订单数',
                            type: 'line',
                            data: order_data.order_num,

                            // 折线图拐点形状
                            symbol: 'circle',
                            symbolSize: 10,

                            itemStyle: {
                                normal: {
                                    color: 'rgb(85, 217, 226)',
                                },
                            },
                            lineStyle: {
                                normal: {
                                    color: 'rgb(85, 217, 226)',
                                },
                            },
                            label: {
                                normal: {
                                    position: 'top',
                                    show: true
                                }
                            },
                        }
                    ]
                });
                let orderDatesArr = order_data.date;
                let orderNumsArr = order_data.order_num;
                let that = this;
                that.dailyorderChart.on('click', function (params) {
                    that.isShowDailyOrderDetailDialog = true;
                    that.dailyData.date = orderDatesArr[params.dataIndex];
                    that.dailyData.order_num = orderNumsArr[params.dataIndex];
                });
            },
            initDrivingtimeChart: function (driving_time) {
                this.drivingtimeChart = echarts.init(document.getElementById('order_driving_time_distribution'));
                this.drivingtimeChart.setOption({
                    title: {
                        text: "时长分布",
                        x: 'center',
                        y: 'center',
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}: {c}单 / {d}%'
                    },
                    color: ['#d17fef', '#9c57f2', '#29d9ac', '#02d2dd', '#41b3f6', '#ed6f9e'],
                    legend: {
                        orient: 'vertical',
                        x: 'right',
                        data: ['0-1h', '1-3h', '3-6h', '6-12h', '12-24h', '>24h'],
                    },
                    series: [{
                        type: 'pie',
                        radius: ['50%', '70%'],
                        label: {
                            normal: {
                                show: true,
                                position: 'outside',
                                formatter: '{b}: {c}单 / {d}%',
                            }
                        },
                        data: driving_time,
                    }]
                });
                //let orderDatasArr = driving_time;
                let that = this;
                that.drivingtimeChart.on('click', function (params) {
                    that.isShowDrivingTimeDetailDialog = true;
                    that.selectedDrivingtime = that.drivingtime[params.dataIndex];
                });
            },
            initDrivingdistanceChart: function (driving_distance) {
                this.drivingdistanceChart = echarts.init(document.getElementById('order_driving_distance_distribution'));
                this.drivingdistanceChart.setOption({
                    title: {
                        text: "距离分布",
                        x: 'center',
                        y: 'center',
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}: {c}单 / {d}%'
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'right',
                        data: [{name: '0-10km'}, {name: '10-30km'}, {name: '30-60km'}, {name: '60-100km'}, {name: '100-200km'}, {name: '>200km'}]
                    },
                    color: ['#524ee8', '#2279ea', '#0caae3', '#60c56a', '#00d0dd', '#7735df'],
                    series: [{
                        type: 'pie',
                        radius: ['50%', '70%'],
                        label: {
                            normal: {
                                show: true,
                                position: 'outside',
                                formatter: '{b}: {c}单 / {d}%',
                            }
                        },
                        data: driving_distance,
                    }]
                });
                //let orderDatasArr = order_data.data;
                let that = this;
                that.drivingdistanceChart.on('click', function (params) {
                    that.isShowDrivingDistanceDetailDialog = true;
                    that.selectedDrivingdistance = that.drivingdistance[params.dataIndex];
                });
            },
            departmentEnter: function (flag) {
                this.isDepartmentFocus = flag;
                !flag && $(".departmentListBox").hide();
            },
            departmentClick: function () {
                if (this.isDepartmentFocus) {
                    $(".departmentListBox").show();
                }
            },
            getDepartmentId: function (val) {
                var id = '';
                this.departmentItem.forEach(function (item) {
                    if (item.department_tree == val) {
                        id = item.id;
                    }
                });
                return id;
            },
            // 清楚搜索输入框
            emptySearch: function () {
                this.departmentSelectedName = '';
                $(".departmentListBox").show();
            },
            setDepartmentValue: function (item) {
//                console.log("this.departments");
//                console.log(this.departments);
                this.departmentSelectedName = item.department_tree;
//                this.departmentSelected = item.id;
                this.changeEchartData(item.id);
                // this.initList();
                $(".departmentListBox").hide();
            },
            changeEchartData:function (id) {
//                this.selectedDepartment = item.staff__department;
//                let index = this.departments.indexOf(item);
                var index = 0;
                for(var i = 0, len = this.departments.length; i < len;i++) {
                    var item = this.departments[i];
                    if(item.staff__department == id) {
                        index = i;
                        break;
                    }
                }
                if ((index + 10) >= this.departments.length) {
                    this.departmentStartValue = this.departments.length - 10;
                    this.departmentEndValue = this.departments.length - 1;
                } else {
                    this.departmentStartValue = index;
                    this.departmentEndValue = index + 10;
                }
                this.initDepartmentChart(this.initEchartsData);
            }
        },
        events: {
            'tabshow': function () {
                this.departmentChart.resize()
                this.dailyorderChart.resize()
                this.drivingtimeChart.resize()
                this.drivingdistanceChart.resize()
            },
        },
        filters: {
            twoFixed: function (num) {
//                console.log(num)
                let _num = Number(num);
                if (_num) {
                    return _num.toFixed(2);
                }
                return 0;
            }
        },
        components: {
            departmentorderdetail,
            dailyorderdetail,
            drivingtimedetail,
            drivingdistancedetail,
        }
    }
</script>
