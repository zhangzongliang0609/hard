<template>
    <div class="layui-layer1">
    <div class="layui-layer layui-layer1 layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">
            <div class="titlecomm f-l f-20 ">每日订单数</div>
        </div>

        <div class="layui-layer-content layui-layer-content2">
            <div class="cl">
                <div class="f-20 f-l">{{data.date}}:<span class="ml-10 fc-ff0000">{{data.order_num}}单</span></div>
                <div class="row cl">
                    <div class="col-6 f-l">
                        <div class="form-label f-l col-3 text-r mr-5 mt-5 select-department">选择部门:</div>
                        <div class="formControls f-l col-7">
                            <div class="department_select_container" @mouseleave="departmentEnter(false)" @mouseenter="departmentEnter(true)">
                                <input v-if="departmentData.length === 0" disabled type="text" class="input-text" value="无可选择部门">
                                <input v-else autocomplete="off" @click="departmentClick" v-model="departmentSelectedName" type="text" class="input-text" value="" placeholder="" name="department">
                                <i v-show="departmentSelectedName !== ''" class="empty-icon Hui-iconfont" @click="emptySearch()">&#xe60b;</i>
                                <div class="departmentListBox" style="display: none">
                                    <div v-bind:title="item.staff__department__department_name" v-for="item in departmentData | filterBy departmentSelectedName in 'staff__department__department_name'" @click="setDepartmentValue(item)" class="departmentListItem">{{item.staff__department__department_name}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--<select id="" v-model="selectedDepartment" class="se-r f-l" @change="setDepartmentRange($event, item)">-->
                    <!--<option value="{{item.staff__department}}" v-for="item in departmentsdata">{{item.staff__department__department_name}}</option>-->
                </div>
            </div>

            <div class="chart-container">
                <div class=chartTitleContentSeperator></div>
                <div id="daily_order_statistics"></div>
            </div>
            <div class="evaluateTitle">{{department_title }} : {{ evaluateCount}}</div>
            <div class="tableHead text-c bg-comment">
                <span class="span-left" style="width:5%"  class="text-l">乘车人</span>
                <span class="span-left" style="width:10%;flex:2">起点</span>
                <span class="span-left" style="width:10%;flex:2">终点</span>
                <span style="width:5%">出发时间</span>
                <span style="width:5%">结束时间</span>
                <span style="width:5%">人数</span>
                <span style="width:5%">订单状态</span>
                <span style="width:5%;">拼车
                        <br>
                                        /加急</span>
                <span style="width:5%">司机</span>
                <span style="width:5%">车辆</span>
                <span style="width:5%">评分</span>
                <span style="width:5%">里程(米)</span>
                <span style="width:5%">时长</span>
                <span style="width:5%">路径</span>
            </div>
            <div id="mainTable" class="main-table">
                <table class="table table-border table-hover table-bg table-sort radius  table-striped table-bg">
                    <thead>
                        <tr class="text-c bg-comment">
                            <th width="5%" class="text-l"></th>
                            <th width="10%"></th>
                            <th width="10%"></th>
                            <th width="5%"></th>
                            <th width="5%"></th>
                            <th width="5%"></th>
                            <th width="5%"></th>
                            <th width="5%"></th>
                            <th width="5%"></th>
                            <th width="5%"></th>
                            <th width="5%"></th>
                            <th width="5%"></th>
                            <th width="5%"></th>
                            <th width="5%"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="text-c" v-for="order in orders">
                            <td>{{order.passenger_name}}</td>
                            <td>{{order.source_name}}</td>
                            <td>{{order.destination_name}}</td>
                            <td>{{order.get_on_time}}</td>
                            <td>{{order.get_off_time}}</td>
                            <td>{{order.passenger_number}}</td>
                            <td>{{order.order_status_name}}</td>
                            <td>{{order.is_carpool?'拼车':'否'}}/{{order.is_urgent?'加急':'否'}}</td>
                            <td>{{order.driver_vo.staff_vo.real_name}}</td>
                            <td>{{order.vehicle_vo.car_brand}}/{{order.vehicle_vo.car_no}}</td>
                            <td class="clearfix"><span class="dp-ilb">{{order.comment_vo.score?order.comment_vo.score:'--'}}</span>/<span class="dp-ilb text-overflow w-35 lh-9">{{order.comment_vo.comment?order.comment_vo.comment:'--'}}</span></td>
                            <td>{{order.order_mileage}}</td>
                            <td>{{order.duration}}</td>
                            <td><template v-if="order.order_status == 60 || order.order_status == 70">
                                    <a class="btn btn-link size-MINI radius" href="javascript:;" v-on:click="clickCheck(order)">查看路径</a>
                                </template></td>
                        </tr>
                    </tbody>
                </table>
                <div id="J-page" class="m-page" v-show="!noData"></div>
                <div class="m-loading" v-if="itemsLoading">
                    <div class="cube1"></div>
                    <div class="cube2"></div>
                </div>
                <div class="no-data text-c mt-50" v-show="noData">没有相关数据</div>
            </div>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" @click="close()"></a>
        </span>
        <drivermap :title="mapTitle" :data="mapData" v-if="isShowMapDialog" v-on:dialog-close="mapClose"></driverMap>
    </div>
    </div>
    <div class="layui-layer-shade"></div>
    <div class="m-loading" v-if="itemsLoadings">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>

<style lang="less" rel="stylesheet" scoped>

    .tableHead{
        height: 50px;
        width: 100%;
        background: #c9d2d9;
        color:#333;
        font-size:0;
        display: flex;
        position: relative;
        bottom: -17px;
    }

    .tableHead>span{
        display: inline-block;
        text-align: left;
        font-size:14px;
        padding: 10px;
        flex: 1;
        font-weight: 900;
    }
    .tableHead> .span-left{
        padding-top: 18px;
        text-align: center;
    }

    .chart-container {
        width: 100%;
        height: 400px;
        background-color: white;
        border-radius: 10px;
        margin-left: 20px;
        margin-right: 20px;
        margin: 20px;
    }
    .chartTitleContentSeperator {
        position: relative;
        top: 50px;
        width: 100%;
        height: 1px;
        background-color: rgb(225, 234, 242);
    }
    #daily_order_statistics {
        width: 100%;
        height: 400px;
    }
    .table{
        border-left: 1px solid #ddd;
        border-right: 1px solid #ddd;
    }
    .table-bg thead th{
        background-color: #C9D2D9;
    }
    .titlecomm{
        color: #000;
    }
    .all-p-red{
        color: #ff6e69;
        padding-top:5px;
    }

    .pselect{
        width: 100px;
    }
    table tr.bg-comment{
        background-color: #c9d2d9;
    }
    .se-r{
         margin-top: 8px;
         min-width: 132px;
         margin-left: 10px;
         background: #5cadff;
         border-radius: 20px;
         color: #fff;
         padding-left: 33px;
         height: 26px;
         font-size: 15px;
     }
    .select-day{
        min-width: 260px;
        height: 42px;
        text-align: center;
     }
    .layui-layer1{
        width: 1200px;
        top: 60px;
        margin-left: -35%;
     }
    .layui-layer1 .layui-layer-content.layui-layer-content2{
         width: 1150px;
         max-width: 1150px;
         height: 750px;
         max-height: 1000px;
         padding-left: 25px;
         padding-top: 20px;
     }
    .main-table{
         overflow: auto;
         margin-top: 0px;
         width: 100%;
         height: 75%;
     }
    .main-comment{
         width: 100%;
         height: 38%;
    }
    @media screen and (max-width: 1600px) {
         .layui-layer1{
             width: 1050px;
             max-height: 750px;
         }
         .layui-layer1 .layui-layer-content.layui-layer-content2{
             width: 1022px;
             height: 550px;
             max-height: 600px;
             padding-left: 25px;
         }
         .main-comment{
             width: 100%;
             height: 50%;
         }
         
    }
    @media screen and (min-width: 3000px) {
        .driver-number ul{
            margin-left: 15%;
        }
    }
    .evaluateTitle{
        font-size: 15px;
        font-weight: 900;
    }
</style>
<script>
import * as base from '../assets/js/base.js';
import drivermap from "../components/driverMap.vue";
import echarts from 'echarts';
  // 引入基本模板
    //let echarts = require('echarts/lib/echarts');

let staffsOps = null;

    export default{
        ready () {
            staffsOps = {
                param:{
                    page:1,
                    page_size:30,
                },
            };
            this.itemsLoadings = true;
            let chartIds = ['daily_order_statistics'];
            this.dailyorderChart = echarts.init(document.getElementById('daily_order_statistics'));
            this.start_date = this.data.date;
            this.end_date = this.data.date;
            this.queryAjax();
            let that = this;
            window.onresize = function(){
                that.queryAjax();
            }            
        },
        props: ['data'],
        data:function(){
            return {
                isShowMapDialog:false,
                dailyorderChart: null,
                itemsLoadings: false,
                noData: false,
                start_date: '',
                end_date: '',
                selectedDepartment: '',
                orders: [],
                //部门名称
                department_name: '',
                //订单数
                order_num: 0,
                //driverSelectedIndex: JSON.parse(localStorage['selectindex']),
                driverDate:{},
                vehicle_vo:{},
                evaluateCount:0,
                department_title:"",
                departmentSelectedName:'',
                isDepartmentFocus:false,
                departmentData:{}, // 用于搜索的部门数据
                departmentStartValue:0, // echarts部门展示的起始位置
                departmentEndValue:9, // 部门展示的结束位置
                initEchartsData:{}, // echarts初始化时使用的数据
            }
        },
        methods: {
            queryAjax:function(){
                let that = this;
                $.ajax({
                    url: base.gAjaxUrl.departmentOrderNums,
                    type: 'GET',
                    data:{
                        start_date: that.start_date,
                        end_date: that.end_date
                    }
                })
                .success((data)=>{
                    that.departmentData = data;
                    let department_data = that.organizationDepartmentData(data);
                    that.initDepartmentChart(department_data);
                    that.selectedDepartment = data[0].staff__department;
                    that.department_title = data[0].staff__department__department_name;
                    that.initList();
                });
            },
            initList:function () {
                let that = this;
                staffsOps.param.page = 1;
                that.getOrders((tpageToal='4',count='0')=> {
                    that.initPage('#J-page', tpageToal, count)
                });
            },
            initPage:function(obj,tpageToal='4',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:1,
                    count:count,
                    callback:(p)=>{
                    staffsOps.param.page = p;
                    this.getOrders();
                }
            });
            },
            organizationDepartmentData: function (data) {
                let order_num = [];
                let staff__department = [];
                let staff__department__department_name = [];
                console.log("this is data");
                console.log(data);
                $.each(data, function(index, elem){
                    order_num.push(elem['order_num']);
                    staff__department.push(elem['staff__department']);
                    staff__department__department_name.push(elem['staff__department__department_name']);
                })
                let result = {
                    'order_num': order_num,
                    'staff__department': staff__department,
                    'staff__department__department_name': staff__department__department_name,
                };
                this.initEchartsData = result;
                return result;
            },
            initDepartmentChart: function (department_data) {
                let that = this;
                this.dailyorderChart = echarts.init(document.getElementById('daily_order_statistics'));
                this.dailyorderChart.setOption({
                    title: {
                        text: "订单数",
                        padding: [15, 20],
                    },
                    toolbox: {
                        show : true,
                        orient: 'horizontal',  // 布局方式，默认为水平布局，可选为： 'horizontal' ¦ 'vertical'
                        x: '88%',  // 水平安放位置，默认为全图右对齐，可选为：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
                        y: '10', // 垂直安放位置，默认为全图顶端，可选为：// 'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
                        // 各工具盒的颜色设置
                        color : ['red','blue','blue','green','red','blue','blue','green','black'],
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar']},
                            restore : {show: true},
                            saveAsImage : {show: true}
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
                        bottom:150,
                    },
                    dataZoom: [
                        {
                            type: 'inside',
                            xAxisIndex: [0],
                            // start: 0,
                            // end:10/department_data.staff__department__department_name.length * 100,
                            startValue:that.departmentStartValue,                           //数据窗口范围的起始数值
                            endValue:that.departmentEndValue,                            //数据窗口范围的结束数值。
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
                            data: department_data.staff__department__department_name,
                            name: '部门',
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
                that.itemsLoadings = false;
                that.dailyorderChart.on('click', function (params) {
                    that.selectedDepartment = staffDepartmentsArr[params.dataIndex];
                    that.department_title = params.name;
                    that.departmentSelectedName = params.name;
                    that.initList();
                });
                that.dailyorderChart.on('datazoom', function (params) {
                    console.log("dataZoom");
                    console.log(params);
                    // var startValue = that.dailyorderChart.getModel().option.dataZoom[0].startValue;
                    // console.log("startValue");
                    // console.log(startValue);
                    // var endValue = that.dailyorderChart.getModel().option.dataZoom[0].endValue;
                    // console.log("endValue");
                    // console.log(endValue);
                    // //获得起止位置百分比
                    // var startPercent = that.dailyorderChart.getModel().option.dataZoom[0].start;
                    // console.log("startPercent");
                    // console.log(startPercent);
                    // var endPercent = that.dailyorderChart.getModel().option.dataZoom[0].end;
                    // console.log("endPercent");
                    // console.log(endPercent);
                });
            },
            getOrders: function (callback=function(){}) {
                let that = this;
                this.itemsLoading = true;
                staffsOps.param.start_date = that.start_date,
                        staffsOps.param.end_date = that.end_date,
                        staffsOps.param.department = that.selectedDepartment,
                $.ajax({
                    url: base.gAjaxUrl.officialcarorders,
                    type: 'GET',
                    data:staffsOps.param,
                })
                .always((data)=>{
                    that.itemsLoading = false;
                    if(data.results && data.results.length != 0){
                        that.orders = data.results;
                        that.evaluateCount = data.results.length;
                        that.noData = false;
                        callback(data.num_pages,data.count);
                    }else{
                        that.noData = true;
                        that.orders = [];
                        that.evaluateCount = 0;
                    }
                });
            },
            close:function(){
                this.$dispatch('dialog-pass-close');
            },
            clickCheck:function(data){
                localStorage.mapInfo = JSON.stringify(data);
                this.isShowMapDialog = true;
            },
            mapClose:function(data){
                this.isShowMapDialog = false;
            },
            departmentEnter: function (flag) {
                this.isDepartmentFocus = flag;
                !flag && $(".departmentListBox").hide();
            },
            departmentClick: function () {
                if(this.isDepartmentFocus) {
                    $(".departmentListBox").show();
                }
            },
            // 清除搜索输入框
            emptySearch:function(){
                this.departmentSelectedName = '';
                $(".departmentListBox").show();
            },
            setDepartmentValue: function (item) {
                this.departmentSelectedName = item.staff__department__department_name;
                this.department_title = item.staff__department__department_name;
                this.selectedDepartment = item.staff__department;
                let index = this.departmentData.indexOf(item);
                if((index + 10) >= this.departmentData.length){
                    this.departmentStartValue = this.departmentData.length - 10;
                    this.departmentEndValue = this.departmentData.length - 1;
                }else{
                    this.departmentStartValue = index;
                    this.departmentEndValue = index + 10;
                }
                this.initDepartmentChart(this.initEchartsData);
                this.initList();
                $(".departmentListBox").hide();
            },
        },
        filters:{
            subTime: function(e){
                return e.substring(0,11);
            }
        },
        events: {
            'tabshow': function() {
                this.dailyorderChart.resize();
            },
        },
        components:{
            drivermap,
        }
    }
</script>
