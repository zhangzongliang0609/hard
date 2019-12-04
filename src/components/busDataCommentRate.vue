<template>
    <div class="layui-layer layui-layer1 layui-anim layui-layer-page layui-modify zIndex-103">
        <div class="layui-layer-title">
            <div class="titlecomm f-l f-20 ">通勤车评价</div>
            <div class="select-day f-r zIndex-103">
                <div class="pselect f-l titlecomm">选择展示时间</div>
                开始日期：
                <input  v-model="start" type="text" class="input-text"  id="L-start-outer-date" v-bind:value="start">
                结束日期：
                <input v-model="end" type="text" class="input-text" id="L-end-outer-date" @click="clickInput" v-bind:value="end">
                <button type="submit" class="btn btn-success radius" v-on:click="allchange()"><i  class="Hui-iconfont">&#xe665;</i></button>
            </div>
        </div>
        <div class="layui-layer-content layui-layer-content2">
            <div class="all-coment f-l">
                <div class="imgs f-l">
                    <img src="../assets/images/goodcomment.jpg" alt="">
                </div>
                <div class="comments f-l">
                    <div class="f-l f-20 c-black">总体好评率: &nbsp;&nbsp;</div>
                    <div class="f-l c-red f-20"> {{ good_comment_rate + '%' }} &nbsp;</div>
                </div>
                <div class="imgs f-l">
                </div>
            </div>
            <div id="mainComment" class="main-comment"></div>
            <p class="all-p-red">全部线路的评论如下：</p>
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
                        <tr class="text-c" v-for="item in commentItems">
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
            </div>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" @click="close()"></a>
        </span>

    </div>
    <div class="date-hint fs-18" v-show="dateHint">
        <i class="Hui-iconfont c-red f-28">&#xe6dd;</i>
        结束日期不能早于开始日期
    </div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
<div class="layui-layer-shade"></div>
</template>

<style lang="less" rel="stylesheet" scoped>
    .table{
        border-left: 1px solid #ddd;
        border-right: 1px solid #ddd;
    }
    .table-bg thead th{
        background-color: #C9D2D9;
    }
    .c-red-score{
        color: #FD6B6C;
    }
    .titlecomm{
        color: #000;
    }
    .all-p-red{
        color: #ff6e69;
        padding-top:5px;
    }
    .all-coment{
        position: absolute;
        top: 2%;
        left: 2%;
    }
    .pselect{
        width: 100px;
    }
    table tr.bg-comment{
        background-color: #c9d2d9;
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
        height: 56%;
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
        .main-table{
            height: 38%;
        }
    }
    @media screen and (max-width: 2000px) {

    }
</style>
<script>
import * as base from '../assets/js/base.js';
import moment from "moment";
import echarts from 'echarts/lib/echarts';
  // 引入基本模板
//    let echarts1 = require('echarts/lib/echarts');
//alert(!!echarts1);

    let carpoolOps = null;

    export default{
        ready () {

            carpoolOps = {
                param:{
                    search:'',
                    approval_status:'',
                    order_status:'',
                    is_carpool:false,
                    is_urgent:'',
                },
                page:1,
                page_size:500,
            }
            new Kalendae.Input('L-end-outer-date', {
                months: 2,
                clickHide:true
            });
            new Kalendae.Input('L-start-outer-date', {
                months: 2,
                clickHide:true
            });

            let that = this;
            base.verticalCenter('.layui-modify');
            that.allchange();
            window.onresize = function(){
                that.datapanel();
                that.lineCommentFn();
                base.verticalCenter('.layui-modify');
            }
        },
        props: ['start','end'],
        data:function(){
            return {
                title:'2.6万',
                commentSelectedDay: this.commentData,
                commentItems:[],
                good_comment_rate: 0,
                itemsLoading:true,
                dateHint:false,
            }
        },
        methods: {
            clickInput:function () {
                console.log(332132);
            },
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
                this.datapanel();
                this.lineCommentFn();
                this.carryRate();
            },
            carryRate: function(){
                let that = this;
                $.ajax({
                    type: "GET",
                    url: `${base.gAjaxUrl.shuttlebusdates2}data/`,
                    contentType: 'application/json',
                    data: {
                        start_date: that.start,
                        end_date: that.end,
                    },
                    success: function(data){
                        that.good_comment_rate = data.good_comment_rate * 100;
                    },
                    error: function(data){
                        console.log('总数出错了');
                    }
                });
            },
            datapanel: function(){
                let that = this;
                $.ajax({
                    type: "GET",
                    url: `${base.gAjaxUrl.shuttlebuses2}avg_busline_praise_rates/`,
                    contentType: 'application/json',
                    data: {
                        start_date: that.start,
                        end_date: that.end,
                    },
                    success: function(data){
                        let xArr = [];
                        let avgPraiseRateArr = [];
                        let lineLen = data.length;
                        $.each(data, function(index, elem){
                            // 线路名称
                            let shuttle_name = elem.shuttle_bus.shuttle_name;
                            xArr.push(shuttle_name);
                            //好评率
                            let avg_praise_rate = (elem.avg_praise_rate) * 100;
                            avgPraiseRateArr.push(avg_praise_rate);
                        })
                        that.itemsLoading = false;
                        let option = {
                            tooltip : {
                                trigger: 'axis',
                                formatter : function (params) {
                                    return params[0].data.toFixed(2);
                                }
                            },
                            toolbox: {
                                show : true,
                                orient: 'horizontal',      // 布局方式，默认为水平布局，可选为：
                                                           // 'horizontal' ¦ 'vertical'
                                x: '1350',                // 水平安放位置，默认为全图右对齐，可选为：
                                                           // 'center' ¦ 'left' ¦ 'right'
                                                           // ¦ {number}（x坐标，单位px）
                                y: 'top',                  // 垂直安放位置，默认为全图顶端，可选为：
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
                            calculable : true,
                            legend: {
                                data:['好评率',],
                                color:"#000",
                                // data:['最差站点Top20','平均温度']
                            },
                            dataZoom: [{
                                height: 15,
                                show : true,
                                realtime : true,
                                start : 0,
                                end: 10/data.length * 100,
                                bottom: 0,
                                zoomLock: true
                            // 数据缩放锁，默认为false，当设置为true时选择区域不能伸缩，即(end - start)值保持不变，仅能做数据漫游
                            }],
                            xAxis : [
                                {
                                    type : 'category',
                                    data : xArr,
                                    axisLabel: {
                                        interval:0,
                                        rotate:15
                                    },
                                    name : "线路名称"
                                }
                            ],
                            yAxis : [
                                {
                                    type : 'value',
                                    name : '( % )',
                                    axisLabel : {
                                        formatter: '{value}%'
                                    }
                                },

                            ],

                            series : [

                                {
                                    name:'好评率',
                                    type:'bar',
                                    data: avgPraiseRateArr,
                                    itemStyle: {
                                            normal: {
                                                color: function(params) {
                                                    // build a color map as your need.
                                                    // var colorList = [
                                                    //   '#C1232B',
                                                    // ];
                                                    var colorList = [
                                                      '#fd6b6b','#ffb5bc','#fd6b6b','#ffb5bc','#fd6b6b',
                                                       '#ffb5bc','#fd6b6b','#ffb5bc','#fd6b6b','#ffb5bc',
                                                       '#fd6b6b','#ffb5bc','#fd6b6b','#ffb5bc','#fd6b6b',
                                                       '#ffb5bc','#fd6b6b','#ffb5bc','#fd6b6b','#ffb5bc'
                                                    ];
                                                    return params.dataIndex % 2 == 0 ? '#fd6b6b' : '#ffb5bc'
                                                },
                                                label: {
                                                    show: true,
                                                    position: 'top',
                                                    textStyle: {
                                                        color: '#615a5a'
                                                    },
                                                    formatter:function(params){
                                                        if(params.value==0){
                                                            return '';
                                                        }else
                                                        {
                                                            return params.value.toFixed(2);
                                                        }
                                                    }
                                                }
                                            }
                                    },
                                    //设置柱的宽度，要是数据太少，柱子太宽不美观~
        　　　　　　　　　　        barWidth:25,
                                },

                            ]
                        };

                        let myChart = echarts.init(document.getElementById('mainComment'));
                        myChart.setOption(option);
                    }
                });

            },
            lineCommentFn: function(){
                let that = this;
                $.ajax({
                    type: "GET",
                    url: `${base.gAjaxUrl.shuttlebuses2}comments/?page=${carpoolOps.page}&page_size=${carpoolOps.page_size}`,
                    contentType: 'application/json',
                    data: {
                        start_date: that.start,
                        end_date: that.end,
                    },
                    success: function(data){
                        console.log("comment");
                        console.log(data);
                        that.commentItems = data.results;
                    }
                });
            },
            close:function(){
                this.$dispatch('dialog-comment-close');
            },
        },
        filters:{
            subTime: function(e){
                return e.substring(0,11) ;
            }
        }
    }
</script>
