<template>
    <div class="layui-layer1">
    <div class="layui-layer layui-layer1 layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">
            <div class="titlecomm f-l f-20 ">单线时间段内统计</div>
            <div class="select-day f-r">
                <div class="pselect f-l titlecomm">选择展示时间</div>
                开始日期：
                <input  v-model="start" type="text" class="input-text"  id="L-start-outer-date" v-bind:value="start">
                结束日期：
                <input v-model="end" type="text" class="input-text" id="L-end-outer-date" v-bind:value="end">
                <button type="submit" class="btn btn-success radius" v-on:click="setDateRange()"><i  class="Hui-iconfont">&#xe665;</i></button>
            </div>
        </div>
        <div class="layui-layer-content layui-layer-content2">
            <div class="bor-e pd-10 cl">
                <div class="mt-10 cl f-l line-control">
                    <div class="col-12 f-l">
                        <div class="form-label f-l col-3 text-r mr-5 mt-5 select-department">线路名称:</div>
                        <div class="formControls f-l col-7">
                            <div class="department_select_container" @mouseleave="departmentEnter(false)" @mouseenter="departmentEnter(true)">
                                <input v-if="buslines.length === 0" disabled type="text" class="input-text" value="无可选择线路">
                                <input v-else autocomplete="off" @click="departmentClick" v-model="departmentSelectedName" type="text" class="input-text" value="" placeholder="" name="department">
                                <i v-show="departmentSelectedName !== ''" class="empty-icon Hui-iconfont" @click="emptySearch()">&#xe60b;</i>
                                <div class="departmentListBox" style="display: none">
                                    <div v-bind:title="item.shuttle_name" v-for="item in buslines | filterBy departmentSelectedName in 'shuttle_name'" @click="setDepartmentValue(item)" class="departmentListItem">{{item.shuttle_name}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--<div class="clearfix">-->
                    <!--<span class="select-box radius bgc-ed relative pl-30 f-l">-->
                        <!--<i class="icon icon-route"></i>-->
                        <!--<select class="select bgc-ed" name="demo1" v-model="selectBusLine"  @change="setBusLineRange($event)">-->
                            <!--<option value="{{bus.id}}" v-for="bus in buslines">{{bus.shuttle_name}}</option>-->
                        <!--</select>-->
                    <!--</span>-->
                <!--</div>-->
                <div class="mt-15 f-l">
                    <span class="mr-15"><i class="icon icon-startlocation mr-5"></i>{{star_station_name}}</span>
                    <span class="mr-15"><i class="icon icon-endlocation mr-5"></i>{{end_station_name}}</span>
                    <span class="mr-15"><i class="icon icon-seat mr-5"></i>{{seats}}座</span>
                    <span class="mr-15"><i class="icon icon-money mr-5"></i>{{price}}元/张</span>
                </div>
            </div>
            <div class="relative bor-e pd-10">
                <div class="tabicons">
                    <span v-bind:class="[shuttle_type==-10?'selected':'']" v-on:click="clickShuttle(-10)">去程</span>
                    <span v-bind:class="[shuttle_type==10?'selected':'']" v-on:click="clickShuttle(10)">返程</span>
                </div>
                <div class="arrowUp" v-on:click="clickPickUp()" :class="{'mark':!isShowArrowUp}">
                    <i class="icon icon-packup"></i>
                </div>
                <div class="arrowDown" v-on:click="clickUnfold()" :class="{'mark':!isShowArrowDown}">
                    <i class="icon icon-unfold"></i>
                </div>
                <div id="load-rates-statistics" class="chart-statistics"></div>
            </div>
            <div class="relative">
                <div class="tabicons">
                    <span v-bind:class="[stationType==-10?'selected':'']" v-on:click="clickStationType(-10)">去程</span>
                    <span v-bind:class="[stationType==10?'selected':'']" v-on:click="clickStationType(10)">返程</span>
                </div>
                <div id="load-station-statistics" class="chart-statistics"></div>
            </div>

            <div id="load-score-statistics" class="chart-statistics"></div>
            <h4><strong>评价列表</strong></h4>
            <div id="mainTable" class="main-table">
                <table class="table table-border table-hover table-bg table-sort radius  table-striped table-bg">
                    <thead>
                        <tr class="text-c bg-comment">
                            <th width="30%" >评论内容</th>
                            <th width="5%">评分</th>
                            <th width="10%">时间</th>
                            <th width="20%">姓名/工号/部门</th>
                            <th width="10%">线路名称</th>
                            <th width="15%">司机/车辆</th>
                            <th width="10%">司机手机号</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="text-c" v-for="item in comments">
                            <td class="text-l">{{ item.busorercomment_vo.comment }}</td>
                            <td class="c-red-score">{{ item.busorercomment_vo.score }}</td>
                            <td>{{ item.busorercomment_vo.mtime | subTime }}</td>
                            <td>{{ item.staff_vo.real_name }}/{{ item.staff_vo.job_number }}/{{ item.staff_vo.department_vo.department_name }}</td>
                            <td>{{item.shuttlebus_date_vo.shuttle_name}}</td>
                            <td>{{item.driver_name?item.driver_name+'/'+item.vehicle_no:'没有硬件设备无法记录'}}</td>
                            <td>{{item.driver_phone?item.driver_phone:'没有硬件设备无法记录'}}</td>
                        </tr>
                    </tbody>
                </table>
                <div id="J-page" class="m-page" v-show="comments.length>0"></div>
                <div  class="no-val"  v-if="comments.length <= 0">
                    <div class="single-line-bug-data-no-evaluation">
                        <img src="../assets/images/noVal.png" alt="">
                        暂时没有任何评价～
                    </div>
                </div>
            </div>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" @click="close()"></a>
        </span>
    </div>
    </div>
    <div class="layui-layer-shade"></div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
    <div class="date-hint fs-18" v-show="dateHint">
        <i class="Hui-iconfont c-red f-28">&#xe6dd;</i>
        结束日期不能早于开始日期
    </div>
</template>

<style lang="less" rel="stylesheet" scoped>
    .chart-statistics{
        width: 100%;
        height: 400px;
    }
    .table-bg thead th{
        background-color: #C9D2D9;
    }
    .titlecomm{
        color: #000;
    }
    .pselect{
        width: 100px;
    }
    .se-r{
         margin-top: 8px;
         width: 132px;
         margin-left: 25px;
         background: #5cadff;
         border-radius: 20px;
         color: #fff;
         padding-left: 33px;
         height: 26px;
         font-size: 15px;
     }
    .select-day{
        display: inline-block;
        margin-left: 20%;
        height: 42px;
        text-align: center;
         input{
        width: 130px;
             }
    }
    .layui-layer1{
         width: 1200px;
        top: 60px;
        margin-left: -35%;
        margin-top:-2%;
     }
    .layui-layer1 .layui-layer-content.layui-layer-content2{
         width: 1150px;
         max-width: 1150px;
         height: 750px;
         max-height: 1000px;
         padding-left: 25px;
         padding-top: 20px;
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
    }
    @media screen and (min-width: 3000px) {
        .driver-number ul{
            margin-left: 15%;
        }
    }
    .select-box.pl-30{
        padding-left: 30px;
        width: auto;
    }
    .icon{
        display: inline-block;
        width: 20px;
        height: 20px;
        vertical-align: top;
    }
    .icon-route{
        background: url('../assets/images/icon-route.png') no-repeat;
        background-size: 100%;
        position: absolute;
        left: 5px;
        top: 5px;
    }
    .icon-startlocation{
        background: url('../assets/images/icon-startlocation.png') no-repeat;
        background-size: 100%;
    }
    .icon-endlocation{
        background: url('../assets/images/icon-endloaction.png') no-repeat;
        background-size: 100%;
    }
    .icon-seat{
        background: url('../assets/images/icon-seat.png') no-repeat;
        background-size: 100%;
    }
    .icon-money{
        background: url('../assets/images/icon-money.png') no-repeat;
        background-size: 100%;
    }
    .tabicons{
        width: 96px;
        position: absolute;
        top: 10px;
        left: 180px;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        cursor: pointer;
        z-index: 2;
    }
    .tabicons span{
        display: inline-block;
        padding: 4px 10px;
        background-color: #999;
        color: #fff;
        float: left;
    }
    .tabicons span.selected{
        background-color: #5cadff;
    }
    .arrowUp,.arrowDown{
        position: absolute;
        left: 50px;
        cursor: pointer;
        z-index: 2;
    }
    .arrowUp{
        top: 50px;
    }
    .arrowDown{
        bottom: 50px;
    }
    .arrowUp .icon,.arrowDown .icon{
        width: 30px;
        height: 30px;
    }
    .icon-packup{
        background: url('../assets/images/icon-packup.png') no-repeat;
        background-size: 100%;
    }
    .icon-unfold{
        background: url('../assets/images/icon-unfold.png') no-repeat;
        background-size: 100%;
    }
    .no-val{
        transform: translateX(-50%);
        position: absolute;
        left: 57%;

    }
    .no-val>img{
        width: 100px;
        height: 100px;
        margin-right: 8px;
    }
    .single-line-bug-data-no-evaluation{
        text-align: center;
        line-height: 100px;
        font-size: 16px;
        color:#888;
    }
    .line-control{
        width: 400px;
    }
    .mark{
        background-color:#fff;filter:Alpha(Opacity=30);opacity:0.3;
    }
</style>
<script>
import * as base from '../assets/js/base.js';
import moment from "moment";
  // 引入基本模板
    let echarts = require('echarts/lib/echarts');

    let staffsOps = '';

    export default{
        ready () {
            staffsOps = {
                param:{
                    page:1,
                    page_size:30,
                },

            };
            let that = this;

            new Kalendae.Input('L-end-outer-date', {
                months: 2,
                clickHide:true
            });
            new Kalendae.Input('L-start-outer-date', {
                months: 2,
                clickHide:true
            });
            console.log("selectBusLine");
            console.log(this.data);
            this.selectBusLine = this.data.id;
            this.departmentSelectedName = this.data.shuttle_name;
            if(that.buslines){
                for(let item of that.buslines){
                    if(item.id == that.selectBusLine){
                        if(item.stations_json.length != 0 ){
                            that.star_station_name = item.stations_json[0].station_name;
                            that.end_station_name = item.stations_json[item.stations_json.length-1].station_name;
                        }
                        that.seats = item.seats;
                        that.price = item.price/100;
                    }
                }
            }

            this.setDateRange();
        },
        props: ['data','buslines','start','end'],
        data:function(){
            return {
//                start_date: '',
//                end_date: '',
//                days: 7,
                line: 'eb427319-34ee-4db7-acb2-e6cfcc72fedc',
                selectBusLine: '',
                star_station_name: '',
                end_station_name: '',
                seats: 0,
                price: 0,
                shuttle_type: -10,
                loadRateChart: null,
                loadScoreChart: null,
                loadStationChart: null,
                comments: [],
                loadRates: [],
                loadRatesNum: 5, //座载率及报名数出发时间数
                loadRatesIndex: 1, //座载率及报名数出发时间索引
                evaluateScore:0,  // 评价的平均分
                itemsLoading:true,
                dateHint:false,
                stationType:-10, // 站点报名人数与搭乘人数的去返程标识
                isDepartmentFocus:false,
                departmentSelectedName:'',
                // departmentStartValue:0, // echarts部门展示的起始位置
                // departmentEndValue:9, // 部门展示的结束位置
                initEchartsData:{}, // echarts初始化时使用的数据
                isShowArrowDown:false,
                isShowArrowUp:false,
            }
        },
        methods: {
            // 选择日期
            setDateRange: function () {
                let that = this;
                if(moment(this.end).isBefore(this.start)){
                    that.dateHint = true;
                    setTimeout(function(){
                        that.dateHint = false;
                    },1000)
                    return
                }
                this.itemsLoading = true;
//                this.start_date = this.formatDate(this.days);
//                this.end_date = this.formatDate(0);
                this.getLoadRate();
                this.getStationNum();
                this.getScoreRate();
                this.initComments()
            },
            initComments:function () {
                let that = this;
                staffsOps.param.page = 1;
                this.getComments((tpageToal='4',count='0')=>{
                    that.initPage('#J-page',tpageToal,count)
                });
            },
            setBusLineRange: function (id) {
                this.selectBusLine = id;
                this.getLoadRate();
                this.getStationNum();
                this.getScoreRate();
                this.initComments();
            },
            clickShuttle: function(type){
                this.shuttle_type = type;
                this.isShowArrowUp = false;
                this.isShowArrowDown = false;
                this.getLoadRate();
            },
            clickPickUp: function(){
                let that = this;
                if((this.loadRatesIndex - 1) < this.loadRates.length/5 && this.loadRatesIndex > 1){
                    this.loadRatesIndex --;
                    let data = that.organizeLoadRateData(that.loadRates.slice((that.loadRatesIndex-1)*that.loadRatesNum,that.loadRatesIndex*that.loadRatesNum))
                    that.initLoadRateChart(data);
                    this.isShowArrowDown = true;
                }
                if(this.loadRatesIndex < this.loadRates.length/5 && this.loadRatesIndex == 1){
                    this.isShowArrowUp = false;
                }

            },
            clickUnfold: function(){
                let that = this;
                if(this.loadRatesIndex < this.loadRates.length/5){
                    this.loadRatesIndex ++;
                    that.initLoadRateChart(that.organizeLoadRateData(that.loadRates.slice((that.loadRatesIndex-1)*that.loadRatesNum,that.loadRatesIndex*that.loadRatesNum)));
                    this.isShowArrowUp = true;
                }
                if(this.loadRatesIndex >= this.loadRates.length/5){
                    this.isShowArrowDown = false;
                }
            },
//            formatDate: function (days) {
//                let dd = new Date();
//                dd.setDate(dd.getDate()-days);//获取AddDayCount天后的日期
//                let y = dd.getFullYear();
//                let m = dd.getMonth()+1;//获取当前月份的日期
//                let d = dd.getDate();
//                return y+"-"+m+"-"+d;
//            },
            organizeLoadRateData: function (data) {
                var dates = [];
                var legendsArr = [];
                var series = [];
                var part_time_data = {};
                part_time_data.name = null;
                $.each(data,function(index,value){
                    part_time_data = {
                        name: value['departure_time'],
                        type: 'line',
                        symbol: 'circle',
                        symbolSize: 10,
                        data: []
                    };
                    legendsArr.push(value['departure_time']);
                    var dates_ = [];
                    $.each(value['load_rates_and_signup_nums'],function(index,each_day_data){
                        dates_.push(each_day_data['shuttle_bus_date__departure_date']);
                        part_time_data.data.push(each_day_data['load_rate']);
                    })
                    dates = dates_;
                    series.push(part_time_data);
                });
                return {
                    'legends': legendsArr,
                    'dates': dates,
                    'series': series
                }
            },
            organizeStationNumData: function (data) {
                let stations = [];
                let signup_nums = [];
                let aboard_nums = [];
                $.each(data,function(index,value){
                    stations.push(value['station']['station_name']);
                    signup_nums.push(value['avg_ride_num']);
                    aboard_nums.push(value['aboard_num']);

                })
                return {
                    'stations': stations,
                    'signup_nums': signup_nums,
                    'aboard_num' : aboard_nums,
                }
            },
            organizeScoreRateData: function (data) {
                let dates = [];
                let avg_scores = [];
                let that = this;
                var totalPoint = 0;
                $.each(data,function(index,value){
                    dates.push(value['date']);
                    avg_scores.push(value['avg_score']);
                    totalPoint += value['avg_score']

                })
                that.evaluateScore = (totalPoint / (data.length)).toFixed(2);
                return {
                    'dates': dates,
                    'avg_scores': avg_scores
                }
            },
            getLoadRate: function () {
                let that = this;
                $.ajax({
                    url: base.gAjaxUrl.shuttlebuses2 + that.selectBusLine + '/busline_load_rates_and_signup_nums/',
                    type: 'GET',
                    data:{
                        start_date: that.start,
                        end_date: that.end,
                        shuttle_type: that.shuttle_type,
                    }
                })
                .success((data)=>{
                    that.loadRates = data;
                    if(data.length > 5 ){
                        that.isShowArrowDown = true;
                    }
                    that.initLoadRateChart(that.organizeLoadRateData(data.slice(0,that.loadRatesNum)));
                });
            },
            getStationNum: function () {
                let that = this;
                $.ajax({
                    url: base.gAjaxUrl.shuttlebuses2 + that.selectBusLine + '/avg_busline_stations_ride_nums/',
                    type: 'GET',
                    data:{
                        shuttle_type:that.stationType,
                        start_date: that.start,
                        end_date: that.end,
                    }
                })
                .success((data)=>{

                    let item = {
                        applyArr : [],
                        checkArr : [],
                        noCheckArr : [],
                        stationsArr:[],
                    }


                    for (let i = 0,len = data.length; i < len; i++) {
                        item.applyArr.push(data[i].order_cnt);
                        item.checkArr.push(data[i].check_cnt);
                        item.noCheckArr.push(data[i].nocheck_cnt);
                        item.stationsArr.push(data[i].station.station_name);

                    }
                    that.initLoadStationChart(item);
                });
            },
            getScoreRate: function () {
                let that = this;
                $.ajax({
                    url: base.gAjaxUrl.shuttlebuses2 + that.selectBusLine + '/avg_busline_scores/',
                    type: 'GET',
                    data:{
                        start_date: that.start,
                        end_date: that.end,
                    }
                })
                .success((data)=>{
                    if(data.length <= 0){
                    }
                    that.initLoadScoreChart(that.organizeScoreRateData(data));
                });
            },
            getComments: function (callback=function(){}) {
                let that = this;
                staffsOps.param.start_date = that.start,
                staffsOps.param.end_date = that.end,
                $.ajax({
                    url: base.gAjaxUrl.shuttlebuses2 + that.selectBusLine + '/busline_comments/',
                    type: 'GET',
                    data:staffsOps.param
                }).always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
                        console.log("new data");
                        console.log(data);
                        let resultData = data.results;
                        that.comments = data.results;
                        callback(data.num_pages,data.count);
                    });
                })
            },
            close:function(){
                this.$dispatch('dialog-line-close');
            },
            initLoadRateChart: function (data) {
                let that = this;
                this.loadRateChart = echarts.init(document.getElementById('load-rates-statistics'));
                let option = {
                    title: {
                        text: '搭载率',
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        //type: 'scroll',
                        orient: 'vertical',
                        left: 20,
                        top: 100,
                        bottom: 100,
                        data: data['legends'],
                    },
                    grid: {
                        left: 150,
                        bottom:100,
                    },
                    dataZoom: [
                        // {
                        //         height: 15,
                        //         show : true,
                        //         realtime : true,
                        //         start : 0,
                        //         end : 15,
                        //         bottom: 0,
                        //         zoomLock: true
                        //     // 数据缩放锁，默认为false，当设置为true时选择区域不能伸缩，即(end - start)值保持不变，仅能做数据漫游
                        // }
                        {
                            type: 'inside',
                            xAxisIndex: [0],
                            start: 0,
                            end : parseInt(10.0/data['dates'].length*100),
                            zoomLock: true,
                        },
                        {
                            type: 'slider',
                            height: 15,
                            start: 0,
                            end : parseInt(10.0/data['dates'].length*100),
                            bottom: 10,
                            zoomLock: true
                        }
                    ],
                    //右上角工具条
                    toolbox: {
                        show: true,
                        feature: {
                            mark: {show: true},
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: data['dates'],
                            name:"天",
                            axisLabel: {
                                interval:0,
                                rotate:30
                            },
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value}'
                            },
                            name:"百分比",
                        }
                    ],
                    series: data['series'],

                };
                this.loadRateChart.setOption(option,true);
                this.itemsLoading = false;
            },
            initLoadStationChart: function (data) {
                this.loadStationChart = echarts.init(document.getElementById('load-station-statistics'));
                let option = {
                    title: {
                        text: '站点报名与搭乘人数',
                    },
                    "grid": {
                        "top": 80,
                    },
                    tooltip: {
                        trigger: 'axis',
                    },
                    legend: {
                        data: ['站点报名人数','站点搭乘人数','站点未搭乘人数'],
//                        top:30,
//                        left:"%",
                    },
                    dataZoom: [{
                                height: 15,
                                show: true,
                                realtime: true,
                                start: 0,
                                end: 100,
                                bottom: 0,
                                zoomLock: true
                            // 数据缩放锁，默认为false，当设置为true时选择区域不能伸缩，即(end - start)值保持不变，仅能做数据漫游
                    }],
                    //右上角工具条
                    toolbox: {
                        show: true,
                        feature: {
                            mark: {show: true},
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            // boundaryGap: false,
                            data: data['stationsArr'],
                            name:"站点名称",
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            axisLabel: {
                                formatter:function (value) {
                                    return value % 1 === 0 ? value : '';
                                }
                            },
                            name:"人数"
                        }
                    ],
                    series: [
                        {
                            'name': '站点报名人数',
                            'type': 'bar',
                            "barGap": "10%",
                            "itemStyle": {
                                "normal": {
                                    color: '#b6a2de',
                                    "label": {
                                        "show": true,
                                        "textStyle": {
                                            color: '#b6a2de'
                                        },
                                        "position": "top",
                                        formatter: function(p) {
                                            return p.value > 0 ? (p.value) : '';
                                        }
                                    }
                                }
                            },
                            //设置柱的宽度，要是数据太少，柱子太宽不美观~
                            data: data['applyArr']
                        },
                        {
                            'name': '站点未搭乘人数',
                            'type': 'bar',
                            "stack": "总量",
//                            "barMaxWidth": 35,
                            "barGap": "10%",
                            zlevel:9,
                            "itemStyle": {
                                "normal": {
                                    color: '#c23531',
                                    "label": {
                                        "show": true,
                                        "textStyle": {
                                            color: '#33032d',
                                        },
                                        "position": "top",
                                        formatter: function(p) {
                                            return p.value > 0 ? (p.value) : '';
                                        }
                                    }
                                }
                            },
                            //设置柱的宽度，要是数据太少，柱子太宽不美观~
//                            barWidth:50,
                            data: data['noCheckArr']
                        },
                        {
                            'name': '站点搭乘人数',
                            'type': 'bar',
                            "stack": "总量",
//                            "barMaxWidth": 35,
                            "barGap": "10%",
                            "itemStyle": {
                                "normal": {
                                    color: '#2ec7c9',
                                    "label": {
                                        "show": true,
                                        "textStyle": {
                                            color: '#2ec7c9',
                                        },
                                        "position": "top",
                                        formatter: function(p) {
                                            return p.value > 0 ? (p.value) : '';
                                        }
                                    }
                                }
                            },
                            //设置柱的宽度，要是数据太少，柱子太宽不美观~
//                            barWidth:50,
                            data: data['checkArr']
                        },

                    ]
                };
                this.loadStationChart.setOption(option,true);
            },
            initLoadScoreChart: function (data) {
                this.loadScoreChart = echarts.init(document.getElementById('load-score-statistics'));
                let option = {
                    title: {
                        text: '平均评分',
                        subtext: '总体平均评分 ' + (isNaN(this.evaluateScore)?0:this.evaluateScore),
                        subtextStyle:{
                          color:"red",
                          fontSize:"17",
                            textIndent:"5em",
                        },
                    },
                    tooltip: {
                        trigger: 'axis',
                    },
                    legend: {
                        data: ['平均评分'],
                        orient: 'vertical',
                        left: "50%",
                        selectedMode: 'single',
                    },
                    grid: {
                        bottom:100,
                    },
                    dataZoom: [
                        // {
                        //         height: 15,
                        //         show: true,
                        //         realtime: true,
                        //         start: 0,
                        //         end: 15,
                        //         bottom: 0,
                        //         zoomLock: true
                        //     // 数据缩放锁，默认为false，当设置为true时选择区域不能伸缩，即(end - start)值保持不变，仅能做数据漫游
                        // }
                        {
                            type: 'inside',
                            xAxisIndex: [0],
                            start: 0,
                            end : parseInt(10.0/data['dates'].length*100),
                            zoomLock: true,
                        },
                        {
                            type: 'slider',
                            height: 15,
                            start: 0,
                            end : parseInt(10.0/data['dates'].length*100),
                            bottom: 10,
                            zoomLock: true
                        }
                    ],
                    //右上角工具条
                    toolbox: {
                        show: true,
                        feature: {
                            mark: {show: true},
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: data['dates'],
                            name:"天",
                            axisLabel: {
                                interval:0,
                                rotate:30
                            },
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value}'
                            },

                        }
                    ],
                    series: [
                        {
                            name: '平均评分',
                            type: 'line',
                            data: data['avg_scores'],
                            formatter: function(p) {
                                return p.value.toFixed(2);
                            }
                        }
                    ]
                };
                this.loadScoreChart.setOption(option,true);
            },
            initPage:function(obj,tpageToal='4',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:1,
                    count:count,
                    callback:(p)=>{
                        staffsOps.param.page = p;
                        this.getComments();
                    }
                });
            },
            clickStationType:function (type) {
                this.stationType = type;
                this.getStationNum();
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
                this.itemsLoading = true;
                this.departmentSelectedName = item.shuttle_name;
                this.star_station_name = item.go_stations_json[0].station_name;
                this.end_station_name = item.go_stations_json[item.go_stations_json.length-1].station_name;
                this.seats = item.seats;
                this.price = item.price;
                // this.department_title = item.staff__department__department_name;
                // this.selectedDepartment = item.staff__department;
                // let index = this.departments.indexOf(item);
                // if((index + 10) >= this.departments.length){
                //     this.departmentStartValue = this.departments.length - 10;
                //     this.departmentEndValue = this.departments.length - 1;
                // }else{
                //     this.departmentStartValue = index;
                //     this.departmentEndValue = index + 10;
                // }
                // this.initDepartmentChart(this.initEchartsData);
                // this.initList();
                this.setBusLineRange(item.id);
                $(".departmentListBox").hide();
            },
        },

        filters:{
            subTime: function(e){
                return e.substring(0,11) ;
            }
        }
    }
</script>
