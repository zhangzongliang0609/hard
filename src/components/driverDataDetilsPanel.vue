<template>
    <div class="layui-layer layui-layer1 layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">
            <div class="titlecomm f-l f-20">司机明细</div> 
            <div class="select-day f-r">
                <div class="pselect f-l">选择展示时间</div> 
                <select v-model="passSelectedDay" class="se-r f-l" @change="allchange()">
                    <!-- <option value="最近7天" >最近7天</option> -->
                    <option value="最近7天" selected = "selected">最近7天</option>
                    <option value="最近14天" >最近14天</option>
                    <option value="最近30天">最近30天</option>   
                    <option value="最近60天">最近60天</option>   
                    <option value="最近90天">最近90天</option>   
                </select>
            </div>
        </div>
        <div class="layui-layer-content layui-layer-content1">
            <div class="all-num">
                <div class="t-c f-l">搭乘总人数：</div>
                <!-- <div class="t-c f-l c-red-num"> {{ ride_num  }}</div> -->
                <div class="t-c f-l"> 人次</div>
            </div>
            <div id="main" class="main"></div>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" @click="close()"></a>
        </span>

    </div>
<div class="layui-layer-shade"></div>
</template>

<style lang="less" rel="stylesheet" scoped>
    .all-num{
        height: 30px;
        line-height: 30px;
        color: #000;
    }
    .c-red-num {
        color: red;
        font-size: 22px;
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
        width: 260px;
        height: 42px;
        text-align: center;
    }
    .layui-layer1{
        width: 1200px;
        max-height: 1000px;
    }
    .layui-layer1 .layui-layer-content.layui-layer-content1{
        width: 1150px;
        max-width: 1150px;
        height: 750px;
        max-height: 1000px;
        padding-left: 25px;
        padding-top: 20px;
    }
    .layui-layer-page .layui-layer-content{
        overflow: visible;
    }
    .main{
        width: 100%;
        height: 90%;
    }
    @media screen and (max-width: 1600px) {
        .layui-layer1{
            width: 1050px;
            max-height: 750px;
        }
        .layui-layer1 .layui-layer-content.layui-layer-content1{
            width: 1000px;
            height: 550px;
            max-height: 600px;
            padding-left: 25px;
        }
        .main{
            width: 100%;
            height: 94%;
        } 
    }
    @media screen and (max-width: 2000px) {
      
    }
</style>
<script>
import * as base from '../assets/js/base.js';
  // 引入基本模板
    let echarts = require('echarts/lib/echarts');
    export default{
        ready () {
            let that = this;
            let getData = this.data;
            base.verticalCenter('.layui-modify');
            that.PassDataPanel();
            window.onresize = function(){
                that.PassDataPanel();
                that.carryRate();
                base.verticalCenter('.layui-modify');
            }

            // console.log(that.vehiclechartdata);

        },
        // props: ['passData'],
        data:function(){
            return {
                title:'2.6万',
                passSelectedDay: this.passData,
                // ride_num: "",
                // ride_num: JSON.parse(localStorage['ride_num']),
                // vehiclechartdata: JSON.parse(localStorage['vehiclechartdata']),
            }
        },
        methods: {
            selectDayFn: function(AddDayCount) {
                if(AddDayCount == '最近7天'){
                     AddDayCount = -7;
                }
                else if(AddDayCount == '最近14天'){
                     AddDayCount = -14;
                }
                else if(AddDayCount == '最近30天'){
                     AddDayCount = -30;
                }
                else if(AddDayCount == '最近60天'){
                     AddDayCount = -60;
                }
                else if(AddDayCount == '最近90天'){
                     AddDayCount = -90;
                }
                else {
                     AddDayCount = 0;
                } 
                let dd = new Date(); 
                dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期 
                let y = dd.getFullYear(); 
                let m = dd.getMonth()+1;//获取当前月份的日期 
                let d = dd.getDate(); 
                return y+"-"+m+"-"+d; 
            },
            allchange: function(){
                this.PassDataPanel();
                this.carryRate();
            },
            carryRate: function(){
                let beforeDay = this.selectDayFn(this.passSelectedDay);
                let today = this.selectDayFn(0);;
                let that = this;
                $.ajax({
                    type: "GET",
                    url: `${base.gAjaxUrl.shuttlebusdates2}data/`,
                    contentType: 'application/json',
                    data: {
                        start_date: beforeDay, 
                        end_date: today,
                    },
                    success: function(data){
                        // console.log(data);
                        that.ride_num = data.ride_num; 
                        // that.per_day_ride_rate = data.per_day_ride_rate;                        
                        // that.shuttle_bus_cnt = data.shuttle_bus_cnt; 
                        // that.good_comment_rate = data.good_comment_rate * 100; 
                        // that.station_cnt = data.station_cnt;
                    },
                    error: function(data){
                        console.log('总数出错了');
                    }
                });
            },
            PassDataPanel: function(){
                let beforeDayPass = this.selectDayFn(this.passSelectedDay);   
                let todayPass = this.selectDayFn(0);

                $.ajax({
                    type: "GET",
                    url: `${base.gAjaxUrl.shuttlebuses2}ride_nums/`,
                    contentType: 'application/json',
                    data: {
                        start_date: beforeDayPass, 
                        end_date: todayPass,
                    },
                    success: function(data){
                        // console.log(data);
                        // let resultDataRate = data[0];
                        let xArr = [];
                        let passNumArr = [];
                        let lineLen = data.length;
                        $.each(data, function(index, elem){
                            // 线路名称
                            let passName = elem.shuttle_bus_date__departure_date;
                            xArr.push(passName);
                            //好评率  
                            let avg_praise_rate = elem.ride_num;
                            passNumArr.push(avg_praise_rate); 
                        })
                        // console.log(xArr);
                        // console.log(passNumArr);

                        var data = passNumArr;
                        var markLineData = [];
                        for (var i = 1; i < data.length; i++) {
                            markLineData.push([{
                                xAxis: i - 1,
                                yAxis: data[i - 1],
                                value: (data[i] + data[i-1]).toFixed(2)
                            }, {
                                xAxis: i,
                                yAxis: data[i]
                            }]);
                        }

                        let option = {
                            title: {
                                // text: '搭乘总人数：`${3.5万}`人次'
                            },
                            tooltip : {
                                trigger: 'axis'
                            },  
                            // 横轴属性  
                            xAxis: {
                                name:'日期',  //这里是横轴标题
                                data: xArr,
                                axisLabel: {
                                    interval:0,
                                    rotate:15
                                },
                            },
                            // 以下的是可以移动拉伸和拖动的
                            // "dataZoom": [{
                            //     "show": true,
                            //     "height": 15,
                            //     "xAxisIndex": [
                            //         0
                            //     ],
                            //     bottom: 30,
                            //     "start": 10,
                            //     "end": 80,
                            //     handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                            //     handleSize: '110%',
                            //     handleStyle:{
                            //         color:"#fff",
                                    
                            //     },
                            //        textStyle:{
                            //         color:"#fff"},
                            //        borderColor:"#615a5a"
                            // }, 
                            // {
                            //     "type": "inside",
                            //     "show": true,
                            //     "height": 15,
                            //     "start": 1,
                            //     "end": 35
                            // }],
                            dataZoom : {
                                height: 15,
                                show : true,
                                realtime : true,
                                start : 20,
                                end : 80,
                                bottom: 0,
                            },
                            'toolbox': {
                                show : true,
                                orient: 'horizontal',      // 布局方式，默认为水平布局，可选为：
                                                           // 'horizontal' ¦ 'vertical'
                                x: '83%',                // 水平安放位置，默认为全图右对齐，可选为：
                                                           // 'center' ¦ 'left' ¦ 'right'
                                                           // ¦ {number}（x坐标，单位px）
                                y: '2%',                  // 垂直安放位置，默认为全图顶端，可选为：
                                                           // 'top' ¦ 'bottom' ¦ 'center'
                                                           // ¦ {number}（y坐标，单位px）
                                feature : {
                                    mark : {show: true},
                                    dataView : {show: true, readOnly: false},
                                    magicType: {show: true, type: ['line', 'bar']},
                                    restore : {show: true},
                                    saveAsImage : {show: true}
                                }
                            },
                            axisLabel : {
                                show:true,
                                interval: 'auto',    // {number}
                                rotate: 45,
                                margin: 8,
                                formatter: '{value}',
                                // formatter: '{value}日',
                                textStyle: {
                                    color: 'black',
                                    fontFamily: 'sans-serif',
                                    fontSize: 15,
                                    fontStyle: 'italic',
                                    fontWeight: 'bold'
                                }
                            },
                            // 纵轴属性
                            yAxis: {
                                 name:'人数',  //这里是横轴标题
                                 axisLabel : {
                                    show:true,
                                    interval: 'auto',    // {number}
                                    // rotate: -45,
                                    margin: 18,
                                    formatter: '{value} 人',    // Template formatter!
                                    textStyle: {
                                        color: 'black',
                                        fontFamily: 'verdana',
                                        fontSize: 10,
                                        fontStyle: 'normal',
                                        fontWeight: 'bold'
                                    }
                                },
                            },
                            series: [{
                                type: 'line',
                                data:data,
                                markPoint: {
                                    data: [
                                        {type: 'max', name: '最大值'},
                                        {type: 'min', name: '最小值'}
                                    ]
                                },
                                markLine: {
                                    smooth: true,
                                            effect: {
                                                show: true
                                            },
                                            distance: 10,
                                    label: {
                                        normal: {
                                            position: 'middle'
                                        }
                                    },
                                    symbol: ['none', 'none'],
                                    data: markLineData
                                }
                            }]
                        };
                        let myChart = echarts.init(document.getElementById('main')); 
                        myChart.setOption(option);
                    },
                    error: function(){
                        console.log('出错了！！');
                    }
                });

                
            },
            close:function(){
                this.$dispatch('dialog-dirver-close');
            },
        }
    }
</script>
