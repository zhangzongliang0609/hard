<template>
<div class="layui-layer1">
        <div class="layui-layer layui-layer1 layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">
            <div class="titlecomm f-l f-20 ">车辆明细</div>
            <div class="select-day">
                <div class="pselect f-l titlecomm">选择展示时间</div>
                开始日期：
                <input  v-model="start" type="text" class="input-text" id="O-start-outer-date" v-bind:value="start">
                结束日期：
                <input v-model="end" type="text" class="input-text" id="O-end-outer-date" v-bind:value="end">
                <button type="submit" class="btn btn-success radius" v-on:click="setDateRange()"><i  class="Hui-iconfont">&#xe665;</i></button>
            </div>
        </div>
        <div class="layui-layer-content layui-layer-content2">
            <div id="mainDriver" class="main-driver">
                <div class="driver-detail">
                    <ul>
                        <li class="f-l text-c">
                            <img src="../assets/images/vehicle_details.png" alt="" class="f-l">
                            <div class="f-l">&nbsp;{{vehicleDate.car_no}}</div>
                        </li>
                        <li class="f-l text-c">

                            <div>品牌型号：&nbsp;{{vehicleDate.car_brand}}</div>
                        </li>
                        <li class="f-l text-c">

                            <div>颜色：&nbsp;{{vehicleDate.car_color}}</div>
                        </li>
                        <li class="f-l text-c">
                            <div>座位：&nbsp;{{vehicleDate.seats}}</div>
                        </li>
                    </ul>
                </div>
                <div class="driver-number">
                    <ul>
                        <li class="f-l img1">
                            <p class="ml-10 mt-30 f-24 c-white">{{order_num}}个</p>
                            <p class="ml-10 c-white">订单总数</p>
                        </li>
                        <li class="f-l img2 ml-20">
                            <p class="ml-10 mt-30 f-24 c-white">{{driving_mileage}}km</p>
                            <p class="ml-10 c-white">总行使里程</p>
                        </li>
                        <li class="f-l img3 ml-20">
                            <p class="ml-10 mt-30 f-24 c-white">{{driving_time}}h</p>
                            <p class="ml-10 c-white">总行使时长</p>
                        </li>
                    </ul>
                </div>
            </div>
            <div id="mainTable" class="main-table">
                <table class="table table-border table-hover table-bg table-sort radius  table-striped table-bg">
                    <thead>
                        <tr class="text-c bg-comment">
                            <th width="5%" class="text-l">申请人</th>
                            <th width="10%">起点</th>
                            <th width="10%">终点</th>
                            <th width="5%">出发时间</th>
                            <th width="5%">结束时间</th>
                            <th width="5%">订单状态</th>
                            <th width="5%">车辆</th>
                            <th width="5%">评分</th>
                            <th width="5%">里程(米)</th>
                            <th width="5%">时长</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="text-c" v-for="order in orders">
                            <td>{{order.staff_vo.real_name}}</td>
                            <td>{{order.source_name}}</td>
                            <td>{{order.destination_name}}</td>
                            <td>{{order.get_on_time}}</td>
                            <td>{{order.get_off_time}}</td>
                            <td>{{order.order_status_name}}</td>
                            <td>{{order.vehicle_vo.car_no}}</td>
                            <td>{{order.comment_vo.score}}/{{order.comment_vo.comment}}</td>
                            <td>{{order.order_mileage}}</td>
                            <td>{{order.duration}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" @click="close()"></a>
        </span>
    </div>
    <div class="layui-layer-shade"></div>
    <div class="m-loading" v-if="showLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</div>
</template>

<style lang="less" rel="stylesheet/less" scoped>
    .main-driver{
        margin-bottom: 30px;
        height: 200px;
    }
    .driver-number{
        margin-top: 30px;
    }
    .driver-number ul li {
        width: 250px;
        height: 121px;
        text-align: left;
    }
    .driver-number ul{
        margin-left: 13%;
    }
    .img1{
        background: url(../assets/images/order_num_bg.png);
        background-size: 250px 121px;
    }
    .img2{
        background: url(../assets/images/driving_mileage_bg.png);
        background-size: 250px 121px;
    }
    .img3{
        background: url(../assets/images/driving_time_bg.png);
        background-size: 250px 121px;
    }
    .driver-detail{
        height: 36px;
        // border: 1px solid #666;
        width: 100%;
        background-color: #F7F5F6;
    }
    .driver-detail ul li{
        /*width: 175px;*/
        margin-left: 30px ;
        line-height: 36px;
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
        input{
            width: 20%;
        }
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
        width: 260px;
        height: 42px;
        margin-left: 20%;
        text-align: center;
    }
    div.layui-layer1{
        width: 1200px;
        max-height: 1000px;
        margin-left: -31%;
        top: 70px;
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
        height: 66%;
    }
    .main-comment{
        width: 100%;
        height: 38%;
    }
    @media screen and (max-width: 1600px) {
        div.layui-layer1.layui-modify{
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
            height: 54%;
        }
        div.layui-layer1{
            width: 1200px;
            max-height: 1000px;
            margin-left: -31%;
        }
    }
    @media screen and (min-width: 3000px) {
        .driver-number ul{
            margin-left: 15%;
        }
    }
</style>
<script>
import * as base from '../assets/js/base.js';
  // 引入基本模板
    let echarts = require('echarts/lib/echarts');

    let carpoolOps = null;

    export default{
        ready () {
            this.showLoading = true;
            carpoolOps = {
                param:{
                    search:'',
                    approval_status:'',
                    order_status:'',
                    is_carpool:false,
                    is_urgent:'',
                },
                page:1,
                page_size:5000,
            };
            new Kalendae.Input('O-end-outer-date', {
                months: 2,
                clickHide:true
            });
            new Kalendae.Input('O-start-outer-date', {
                months: 2,
                clickHide:true
            });
//            let vehicleSelectedIndex = this.vehicleSelectedIndex
//            $("#selectDayId option").eq(vehicleSelectedIndex).attr("selected","selected").siblings("option").removeAttr("selected");
//            let value = $("#selectDayId option").eq(vehicleSelectedIndex).val();
//            this.days = value;
            this.setDateRange();
            // base.verticalCenter('.layui-modify');
            let that = this;
            window.onresize = function(){
                // base.verticalCenter('.layui-modify');
                that.setDateRange();
            }


        },
        props: ['data','start','end'],
        data:function(){
            return {
                start_date: '',
                end_date: '',
                days: 7,
                orders: [],
                driver: '',
                //订单数
                order_num: '',
                //行驶里程
                driving_mileage: '',
                //行驶时长
                driving_time: '',
                // vehicleSelectedIndex: JSON.parse(localStorage['selectindex']),
                vehicleDate:{},
                showLoading:false,
            }
        },
        methods: {
            // 选择日期
            setDateRange: function () {
                this.showLoading = true;
                this.getBaseData();
                this.getOrders();
            },
            formatDate: function (days) {
                let dd = new Date();
                dd.setDate(dd.getDate()-days);//获取AddDayCount天后的日期
                let y = dd.getFullYear();
                let m = dd.getMonth()+1;//获取当前月份的日期
                let d = dd.getDate();
                return y+"-"+m+"-"+d;
            },
            getOrders: function () {
                let that = this;
                $.ajax({
                    url: base.gAjaxUrl.officialcarvehicles + that.data + '/orders/',
                    type: 'GET',
                    data:{
                        start_date: that.start,
                        end_date: that.end,
                    }
                })
                .success((data)=>{
                    that.orders = data.results;

                });
            },
            getBaseData: function () {
                let that = this;
                $.ajax({
                    url: base.gAjaxUrl.officialcarvehicles + that.data + '/vehicle_profile/',
                    type: 'GET',
                    data:{
                        start_date: that.start,
                        end_date: that.end,
                    }
                })
                .success((data)=>{
                    that.showLoading = false;
                    that.order_num = data.order_num;
                    //that.driving_mileage = data.driving_mileage;
                    that.driving_mileage = data.driving_order_mileage+data.driving_outside_mileage;
                    that.driving_time = data.driving_time;
                    that.vehicleDate = data.vehicle;

                });
            },
            close:function(){
                this.$dispatch('dialog-vehicle-close');
            }
        },
        filters:{
            subTime: function(e){
                return e.substring(0,11) ;
            }
        }
    }
</script>
