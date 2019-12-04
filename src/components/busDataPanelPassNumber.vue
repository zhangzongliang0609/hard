<template>
    <div class="layui-layer layui-layer1 layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">
            <div class="titlecomm f-l f-20">搭乘总人数</div> 
            <div class="select-day">
                <div class="pselect f-l">选择展示时间</div>
                    开始日期：
                    <input  v-model="start" type="text" class="input-text"  id="K-start-outer-date" v-bind:value="start">
                    结束日期：
                    <input v-model="end" type="text" class="input-text" id="K-end-outer-date" v-bind:value="end">
                <button type="submit" class="btn btn-success radius" v-on:click="allchange()"><i  class="Hui-iconfont">&#xe665;</i></button>
            </div>
        </div>
        <div class="layui-layer-content layui-layer-content1">
            <div class="all-num">
                <div class="t-c f-l">搭乘总人数：</div>
                <div class="t-c f-l c-red-num"> {{ ride_num  }}</div>
                <div class="t-c f-l"> 人次</div>
            </div>
            <div id="main" class="main"></div>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" @click="close()"></a>
        </span>
    </div>
    <div class="date-hint fs-18" v-show="dateHint">
        <i class="Hui-iconfont c-red f-28">&#xe6dd;</i>
        结束日期不能早于开始日期
    </div>
<div class="layui-layer-shade"></div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>

<style lang="less" rel="stylesheet/less" scoped>
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
import moment from "moment";
  // 引入基本模板
    let echarts = require('echarts/lib/echarts');
    export default{
        ready () {
            let that = this;
            base.verticalCenter('.layui-modify');
            
            new Kalendae.Input('K-end-outer-date', {
                months: 1,
                clickHide:true
            });
            new Kalendae.Input('K-start-outer-date', {
                months: 1,
                clickHide:true
            });
            that.allchange();
            window.onresize = function(){
                that.allchange();
                base.verticalCenter('.layui-modify');
            }
        },
        props: ['start','end'],
        data:function(){
            return {
                title:'2.6万',
                passSelectedDay: "",
                ride_num:0,
                itemsLoading:true,
                dateHint:false,
            }
        },
        methods: {
            allchange: function(){
                let that = this;
                if(moment(this.end).isBefore(this.start)){
                    that.dateHint = true;
                    setTimeout(function(){
                        that.dateHint = false;
                    },1000)
                    return
                }
                this.itemsLoading = true;
                this.PassDataPanel();
            },
            PassDataPanel: function(){
                let that = this;
                $.ajax({
                    type: "GET",
                    url: `${base.gAjaxUrl.shuttlebuses2}ride_nums/`,
                    contentType: 'application/json',
                    data: {
                        start_date: that.start,
                        end_date: that.end,
                    },
                    success: function(data){
                        // let resultDataRate = data[0];
                        let xArr = [];
                        let passNumArr = [];
                        let lineLen = data.length;
                        let dates = []
                        let total = 0;
                        $.each(data, function(index, elem){
                            // 线路名称
                            let passName = elem.shuttle_bus_date__departure_date.split('-');
                             dates.push(passName[1] + '/' + passName[2]);
                            //好评率
                            total += elem.ride_num;
                            passNumArr.push(elem.ride_num);
                        })
                        that.itemsLoading = false;
                        that.ride_num = total;
                        let option = {
                            title: {
                                // text: '搭乘总人数：`${3.5万}`人次'
                                text: '搭乘人数',
                                show: false,
                            },
                            tooltip : {
                                trigger: 'axis'
                            },  
                            // 横轴属性  
                            xAxis: {
                                name:'日期',  //这里是横轴标题
                                data: dates,
                                axisLabel: {
                                    interval:0,
                                    rotate:30
                                },
                            },
                            dataZoom: [{
                                height: 15,
                                show : true,
                                realtime : true,
                                start : 0,
                                end : parseInt(10.0/dates.length*100),
                                bottom: 0,
                                zoomLock: true
                            // 数据缩放锁，默认为false，当设置为true时选择区域不能伸缩，即(end - start)值保持不变，仅能做数据漫游
                            }],
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
                                data:passNumArr,
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
                this.$dispatch('dialog-pass-close');
            },
        }
    }
</script>
