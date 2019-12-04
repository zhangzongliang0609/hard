<template>
    <div class="layui-layer1">
    <div class="layui-layer layui-layer1 layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">
            <div class="titlecomm f-l f-20 ">站点搭乘统计</div>
            <div class="select-day f-r">
                <div class="pselect f-l titlecomm">选择展示时间</div>
                开始日期：
                <input  v-model="start" type="text" class="input-text"  id="I-start-outer-date" v-bind:value="start">
                结束日期：
                <input v-model="end" type="text" class="input-text" id="I-end-outer-date" v-bind:value="end">
                <button type="submit" class="btn btn-success radius" v-on:click="setDateRange()"><i  class="Hui-iconfont">&#xe665;</i></button>
                <!--<select id="selectDayId" v-model="days" class="se-r f-l" @change="setDateRange()">-->
                    <!--<option value="7">最近7天</option>-->
                    <!--<option value="14" >最近14天</option>-->
                    <!--<option value="30">最近30天</option>-->
                    <!--<option value="60">最近60天</option>-->
                    <!--<option value="90">最近90天</option>-->
                <!--</select>-->
            </div>
        </div>
        <div class="layui-layer-content layui-layer-content2">
            <div class="bor-e pd-10">
                <div class="relative pl-30">
                    <i class="icon icon-station"></i>
                    <span class="stationindex">{{data.station.station_seq+1}}</span>
                    <span class="f-16 fw-b">{{data.station.station_name}}----{{data.station.shuttle_bus.shuttle_name}}</span>
                    <span class="f-16 fw-b">({{data.station.shuttle_type == -10?'去程':'返程'}})</span>
                </div>
                <div class="mt-10">
                    <span class="mr-15"><i class="icon icon-startlocation mr-5"></i>所属路线:{{data.station.shuttle_bus.shuttle_name}}</span>
                    <span class="mr-15"><i class="icon icon-seat mr-5"></i>{{data.station.shuttle_bus.seats}}座</span>
                    <span class="mr-15"><i class="icon icon-money mr-5"></i>{{data.station.shuttle_bus.price?data.station.shuttle_bus.price/100:'0'}}元/张</span>
                </div>
            </div>
            <div class="relative bor-e pd-10">
                <!--<div class="tabicons">-->
                    <!--<span v-bind:class="[shuttle_type==-10?'selected':'']" v-on:click="clickShuttle(-10)">去程</span>-->
                    <!--<span v-bind:class="[shuttle_type==10?'selected':'']" v-on:click="clickShuttle(10)">返程</span>-->
                <!--</div>-->
                <div class="data-control">
                    <div :class="{'mark':applyShow}" @click="clickMark(0)"><span class="apply-box"></span>报名人数</div>
                    <div :class="{'mark':checkShow}" @click="clickMark(1)"><span class="check-box"></span>搭乘人数</div>
                    <div :class="{'mark':noCheckShow}" @click="clickMark(2)"><span class="no-check-box"></span>未搭乘人数</div>
                </div>
                <div class="arrowUp" v-on:click="clickPickUp()" :class="{'mark':!isShowArrowUp}">
                    <i class="icon icon-packup"></i>                    
                </div>
                <div class="arrowDown" v-on:click="clickUnfold()" :class="{'mark':!isShowArrowDown}">
                    <i class="icon icon-unfold"></i>                    
                </div>
                <div id="load-rates-statistics" class="chart-statistics"></div>
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
    <!--悬浮数据展示-->
    <div id="dataShow">
        <div id="dateName"></div>
    </div>
    <div id="showSingeData">
        <span id="timeName"></span>:
        <span class="apply"></span>
        <span class="check"></span>
        <span class="no_check"></span>
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
    .icon-station{
        background: url('../assets/images/icon-station.png') no-repeat;
        background-size: 100%;
        position: absolute;
        left: 5px;
        top: 4px;
    }
    .icon-startlocation{
        background: url('../assets/images/icon-route.png') no-repeat;
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
        left: 200px;
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
    .stationindex{
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 1px solid #333;
        border-radius: 50%;
        text-align: center;
        line-height: 20px;
        font-size: 12px;
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
    .apply{
        color: #b6a2de;
    }
    .apply-box{
        background-color: #b6a2de;
    }
    .check{
        color: #2ec7c9;
    }
    .check-box{
        background-color: #2ec7c9;
    }
    .no_check{
        color: #992434;
    }
    .no-check-box{
        background-color: #992434;
    }
    .data-control{
        position: absolute;
        left:40%;
        top:14px;
        z-index: 10;
        cursor:pointer;
        div{
            display: inline-block;
            margin-right: 5px;
        }
        span{
            display: inline-block;
            width: 20px;
            height: 12px;
            margin-right: 3px;
            margin-bottom: -1px;
            -webkit-border-radius: 3px;
            -moz-border-radius: 3px;
            border-radius: 3px;
            font-size: 12px;
        }
    };
    .mark{
        background-color:#fff;filter:Alpha(Opacity=30);opacity:0.3;
    }
</style>
<script>
import * as base from '../assets/js/base.js';
import moment from "moment";
  // 引入基本模板
    let echarts = require('echarts/lib/echarts');

    export default{
        ready () {
            new Kalendae.Input('I-end-outer-date', {
                months: 1,
                clickHide:true
            });
            new Kalendae.Input('I-start-outer-date', {
                months: 1,
                clickHide:true
            });
            let that = this;
            console.log("this lineData");
            console.log(this.data);
            // that.shuttle_type = this.linetype;
            this.setDateRange();
        },
        props: ['data','start','end',],
        data:function(){
            return {
                start_date: '',
                end_date: '',
                shuttle_type: -10,
                stationSignupNumsChart: null,
                stationData: [],
                loadRatesNum: 5, //出发时间数
                loadRatesIndex: 1, //出发时间索引
                itemsLoading:true,
                dateHint:false,
                allDataArr:{}, // 用于折线悬浮时的展示
                applyShow:false,
                checkShow:false,
                noCheckShow:false,
                isShowArrowUp:false,
                isShowArrowDown:false,
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
                this.start_date = this.formatDate(this.days);
                this.end_date = this.formatDate(0);
                this.getStationNum();
            },
            clickShuttle: function(type){
                this.shuttle_type = type;
                this.getStationNum();
            },
            clickUnfold: function(){
                let that = this;
                if(this.loadRatesIndex < this.stationData.length/5){
                    this.loadRatesIndex ++;
                    that.initStationSignupNumsChart(that.organizeStationNumData(that.stationData.slice((that.loadRatesIndex-1)*that.loadRatesNum,that.loadRatesIndex*that.loadRatesNum)));
                    this.isShowArrowUp = true;
                }
                if(this.loadRatesIndex >= this.stationData.length/5){
                    this.isShowArrowDown = false;
                }
            },
            clickPickUp:function(){
                let that = this;
                if((this.loadRatesIndex - 1) < this.stationData.length/5 && this.loadRatesIndex > 1){
                    this.loadRatesIndex --;
                    that.initStationSignupNumsChart(that.organizeStationNumData(that.stationData.slice((that.loadRatesIndex-1)*that.loadRatesNum,that.loadRatesIndex*that.loadRatesNum)));
                    this.isShowArrowDown = true;
                }
                if(this.loadRatesIndex < this.stationData.length/5 && this.loadRatesIndex == 1){
                    this.isShowArrowUp = false;
                }
            },
            formatDate: function (days) {
                let dd = new Date();
                dd.setDate(dd.getDate()-days);//获取AddDayCount天后的日期
                let y = dd.getFullYear();
                let m = dd.getMonth()+1;//获取当前月份的日期
                let d = dd.getDate();
                return y+"-"+m+"-"+d;
            },
            organizeStationNumData: function (data) {
                let that = this;
                let date = []; //x轴：日期数据
                let series = []; 
                let legends = [];
                // that.allDataArr = {};
                $.each(data, function(index, value){
                    legends.push(value['departure_time']);
                    let signup_nums = value['signup_nums'];
                    let data =[];
                    that.allDataArr[value['departure_time']] = [];
                    $.each(signup_nums, function(i, val){
                        if(index == 0){
                            date.push(val['date']);
                        }
                        data.push(val['order_cnt']);
                        // 用vue的实例对象上的属性,来保存所有的人数数据,使用班次的时间为对象的key,来保存这个班次对应的人数数据,方便显示时获取
                        that.allDataArr[value['departure_time']].push(val)
                    })
                    let seriesObj = {};
                    seriesObj.name = value['departure_time'];
                    seriesObj.type = 'line';
                    seriesObj.data = data;
                    series.push(seriesObj)
                })
                return {
                    'dates': date,
                    'series': series,
                    'legends': legends,
                }
            },
            getStationNum: function () {
                this.itemsLoading = true;
                let that = this;
                $.ajax({
                    url: base.gAjaxUrl.stationSignupNums + that.data.station.id + '/station_signup_nums/',
                    type: 'GET',
                    data:{
                        start_date: that.start,
                        end_date: that.end,
                        // shuttle_type: that.shuttle_type,
                    }
                })
                .success((data)=>{
                    if(data.length > 5){
                        that.isShowArrowDown = true;
                    }
                    that.stationData = data;
                    console.log("that.stationData");
                    console.log(that.stationData);
                    that.initStationSignupNumsChart(that.organizeStationNumData(data.slice(0,that.loadRatesNum)));
                });
            },
            close:function(){
                this.$dispatch('dialog-line-close');
            },
            initStationSignupNumsChart: function (data) {
                let that = this;
                this.stationSignupNumsChart = echarts.init(document.getElementById('load-rates-statistics'));

                let option = {
                    title: {
                        text: '出发时间及人数',
                    },
                    tooltip: {
                        trigger: 'axis',
                        // axisPointer:{
                        //     show: false,
                        //     type : 'cross',
                        //     lineStyle: {
                        //         type : 'dashed',
                        //         width : 1
                        //     }
                        // },
                        // 鼠标悬浮的数据展示窗
                        formatter : function (params) {
                            let index = params[0].dataIndex;   // 获取当前悬浮数据的index
                            let div = $('#dataShow').clone(true); // 克隆写好的div
                            div.children('#dateName').text(params[0]['axisValue']); // 获取要显示的日期
                            for (var i = 0,len = params.length; i < len; i++) { // 循环当前有几个班次时间
                                let contentBox = $('#showSingeData').clone(true);
                                contentBox.children('span').text(''); // 清空
                                let timeName = params[i]['seriesName']; // 获取班次时间
                                contentBox.children('#timeName').text(timeName);
                                // 判断是否要展示对应的人数
                                if(!that.applyShow){
                                    contentBox.children('.apply').text(that.allDataArr[timeName][index]['order_cnt']);
                                }
                                if(!that.checkShow){
                                    contentBox.children('.check').text(that.allDataArr[timeName][index]['check_cnt']);
                                }
                                if(!that.noCheckShow){
                                    contentBox.children('.no_check').text(that.allDataArr[timeName][index]['nocheck_cnt']);
                                }
                                div.append(contentBox);
                            }
                            // 这里返回的,就会在悬浮窗上展示
                            return div.html();
                        }
                    },
                    legend: {
                        orient: 'vertical',
                        left: 20,
                        top: 100,
                        bottom: 100,
                        data: data['legends'],
                    },
                    grid: {
                        left: 190,
                        bottom:100,
                    },
                    dataZoom: [
                                // height: 15,
                                // show : true,
                                // realtime : true,
                                // start : 0,
                                // end : 15,
                                // bottom: 0,
                                // zoomLock: true
                            // 数据缩放锁，默认为false，当设置为true时选择区域不能伸缩，即(end - start)值保持不变，仅能做数据漫游
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
                                formatter: function (value) {
                                    return value % 1 === 0 ?  value:'';
                                }
                            }
                        }
                    ],
                    series: data['series']
                };
                this.stationSignupNumsChart.setOption(option,true);
                this.itemsLoading = false;
            },
            clickMark:function (type) {
                if(type==0){
                    this.applyShow = !this.applyShow
                }else if(type == 1){
                    this.checkShow = !this.checkShow
                }else if(type == 2){
                    this.noCheckShow = !this.noCheckShow
                }
            }
        },
        filters:{
            subTime: function(e){
                return e.substring(0,11) ;
            }
        }
    }
</script>
