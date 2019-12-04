<template>
    <div id="move" class="move layui-layer layui-anim layui-layer-page  layui-modify1" draggable="true">
        <div class="text-c layui-layer-title layui-layer-title1 layui-layer-title-two">
            <div class="text-c f-22">
                <div class="col-xs-9 col-sm-9 col-md-9 col-lg-9 f-l f-24">
                    <!-- <div class="divs-quare1 f-l"></div>
                    <div class="f-l">当天等待接单中的订单总数为:</div>
                    <div class="f-l">(</div> 
                    <div class="text-c c-red f-24 f-l">{{ wait_order_cnt }}</div>
                    <div class="f-l">)</div> -->
                </div>
                <div  class="text-c col-xs-3 col-sm-3 col-md-3 col-lg-3 f-24 timef">
                    <div id="times" class="times f-l"></div>
                    <div id="time" class="time f-l c-red-orderdetails margin-time"></div>
                </div>
            </div>
        </div>
 
        <div id="heightprcent" class="heightprcent mt-5">
            <div id="divclass" class="divclass1 col-xs-7 col-sm-7 col-md-7 col-lg-7 f-l" style="overflow:auto;overflow-y:hidden;width: 58%; height: 99%;">
                 <div class="f-l f-24 order-number">
                    <div class="divs-quare1 f-l"></div>
                    <div class="f-l">当天等待接单中的订单总数为:</div>
                    <div class="f-l">(</div> 
                    <div class="text-c c-red-wait f-24 f-l">{{ wait_order_cnt }}</div>
                    <div class="f-l">)</div>
                </div>
                <table id="" class="tableclass1 table table-hover table-border table-bordered table-bg thead-padding thead-height-wait  table-striped radius" >
                    <thead class="radius table-thead">
                        <tr class="text-c trborder">
                            <th width="13%" class="f-tr thborder">申请人</th>
                            <th width="25%" class="f-tr thborder">起点</th>
                            <th width="25%" class="f-tr thborder">终点</th>
                            <th width="13%" class="f-tr thborder">审批人</th>
                            <th width="12%" class="f-tr thborder">出发时间</th>
                            <th width="12%" class="f-tr thborder">结束时间</th>
                        </tr>
                    </thead> 
                </table>
                <table id="tableid" class="tableclass table table-border table-bordered table-hover table-bg thead-padding thead-height-wait  table-striped radius" >
                    <thead style="height: 40px;" class="radius">
                        <tr class="text-c">
                            <th width="13%" class="f-tr"></th>
                            <th width="25%" class="f-tr"></th>
                            <th width="25%" class="f-tr"></th>
                            <th width="13%" class="f-tr"></th>
                            <th width="12%" class="f-tr"></th>
                            <th width="12%" class="f-tr"></th>
                        </tr>
                    </thead>
                    <div class="result" v-if="!noData">
                    <tbody id="tbodyid" class="f-16 " v-for="(voKey, voItem) in items"> 
                        <!-- <template v-for="(voKey, voItem) in items"> -->
                            <tr v-for="(vooKey, vooItem) in voItem" class="text-c {{isGroup(voItem,vooKey)}}">
                                <td class="f-tr t-noborder">{{vooItem.staff_vo.real_name? vooItem.staff_vo.real_name: '-';}}</td>
                                <td class="f-tr t-noborder">{{vooItem.source_name}}</td>
                                <td class="f-tr t-noborder">{{vooItem.destination_name}}</td>
                                <td class="f-tr t-noborder">{{vooItem.approvalinfo_set.join('→')}}</td>
                                <td class="f-tr t-noborder c-warning-red">{{vooItem.ride_time | formatDate}}</td>
                                <td class="f-tr t-noborder">{{vooItem.end_time | formatDate}}</td>
                            </tr>
                        <!-- </template> -->
                    </tbody>
                    </div>
                </table>
            </div>
            <div class="text-c rightheight col-xs-5 col-sm-5 col-md-5 col-lg-5 f-l">
                <div class="circle">
                    <div id="main" style="width:100%;height:100%;"></div>
                    <div class="divs-quare-small"></div>
                    <div class="div1">
                        <span class="span1 f-22">{{wait_order_cnt}}</span>
                        <span class="span2 f-22">{{countNumbers_wait}}%</span>  
                    </div>
                    <span class="span3 f-22">待派单</span>

                    <div class="div22">
                        <span class="span21 f-22">{{running_order_cnt}}</span>
                        <span class="span22 f-22">{{countNumbers_running}}%</span>
                    </div>
                    <span class="span23 f-22">行程中</span>

                    <div class="div33">
                        <span class="span31 f-22">{{ finished_order_cnt }}</span>
                        <span class="span32 f-22">{{ countNumbers_finished }}%</span>
                    </div>
                    <span class="span33 f-22">已完成</span>

                    <div class="div44">
                        <span class="span41 f-22">{{cancel_order_cnt}}</span>
                        <span class="span42 f-22">{{countNumbers_cancel}}%</span>
                    </div>
                    <span class="span43 f-22">已取消</span>
                </div>
                
                <div class="f-l div-bottom mt-5" style="height: 57.5%;width: 100%;">
                    <div class="text-c f-22">
                        <div class="text-c layui-layer-title layui-layer-title-bottom  f-24">
                            <div id="divs_quare_bottom" class="divs-quare-bottom f-l"></div>
                            <div id="order_hange" class="f-l f-24 div-bold">当天行程中的订单总数为:</div>
                            <div class="f-l f-24">(</div> 
                            <div id="order_change_count"  class="text-c f-24 f-l c-color-orderdetails">{{ order_cnt }}</div>
                            <div class="f-l f-24">)</div>
                        </div>
                    </div>
                    <div id="div_scroll" class="div-scroll" style="overflow:auto; width: 100%;overflow-y:hidden; height: 91%;">
                        <table id="" class="tableclass1 table table-hover table-border table-bordered table-bg thead-padding thead-height-wait  table-striped radius" >
                            <thead class="radius table-thead">
                                <tr class="text-c trborder">
                                    <th width="12%" class="f-tr thborder">申请人</th>
                                    <th width="29%" class="f-tr thborder">起点</th>
                                    <th width="29%" class="f-tr thborder">终点</th>
                                    <!-- <th width="13%" class="f-tr thborder">审批人</th> -->
                                    <th width="15%" class="f-tr thborder">出发时间</th>
                                    <th width="15%" class="f-tr thborder">结束时间</th>
                                </tr>
                            </thead> 
                        </table>
                        <table id="table_bottom" class="table-bottom table table-border table-bordered table-bottom mt-5 table table-hover table-bg radius thead-padding  table-striped" >
                            <thead style="height: 40px;" class="radius">
                                <tr class="text-c">
                                    <th width="12%" class="f-tr"></th>
                                    <th width="29%" class="f-tr"></th>
                                    <th width="29%" class="f-tr"></th>
                                    <th width="15%" class="f-tr"></th>
                                    <th width="15%" class="f-tr"></th>
                                </tr>
                            </thead>
                            <div class="result" v-if="!noData">
                            <tbody class="f-16" v-for="(voKey, ordervoItem) in orderItems"> 
                                <!-- <template v-for="(voKey, ordervoItem) in orderItems"> -->
                                    <tr v-for="(vooKey, ordervooItem) in ordervoItem" class="text-c {{isGroup(ordervoItem,vooKey)}}">
                                        <td class="f-tr t-noborder">{{ordervooItem.staff_vo.real_name? ordervooItem.staff_vo.real_name: '-';}}</td>
                                        <td class="f-tr t-noborder">{{ordervooItem.source_name}}</td>
                                        <td class="f-tr t-noborder">{{ordervooItem.destination_name}}</td>
                                        <td class="f-tr t-noborder">{{ordervooItem.ride_time | formatDate}}</td>
                                        <td id="c_warning_color" v-bind:class="{ 'c-warning-purple': is_class_purple, 'c-warning-red': is_class_red,'c-warning-green': is_class_green,'c-warning-blue': is_class_blue, }" class="f-tr t-noborder">{{ordervooItem.end_time | formatDate}}</td>
                                    </tr>
                                <!-- </template> -->
                            </tbody>
                            </div>
                        </table>
                    </div>
                </div>
            </div>
            <!-- <div id="J-page" class="m-page" v-if="!noData"></div> -->
            <!-- <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div> -->
        </div>
        <!-- <span class="layui-layer-setwin layui-close">
            <a id="close" class="layui-close layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
        </span> -->
    </div>
</template>
<style lang="less">
    div.timef{
        position: fixed;
        top: 2.5%;
        right: -6%;
        z-index: 10000000;
        font-size: 24px;
        font-weight: bold;
    }
    div.layui-layer-title-bottom{
        padding-left: 2px;
    }
    span a.layui-close{
        top: -11px;
    }
    .c-red-wait{
        color: #eb407a;
    }
    tr td.t-noborder{ 
        height: 38px;
        line-height: 38px;
        border-left: 0;
        border-right: 0;
    }
    .div-bold{
        font-weight: bold;
    }
    .order-number{
        position: relative;
        z-index: 4000000;
        background-color: white;
        width: 100%;
        color:#303435;
        font-weight: bold;
        line-height: 42px;
    }
    .table-thead{
        // position: relative;
        background-color: white;
        z-index: 20000;
        height: 48px;
    }
    tbody.table-tbody{
        height: 0px;
        display: none;
    }
    div.move{
        width: 100%;
        height: 100%;
    }
    .divs-quare-small{
        position: absolute;
        top: 1%;
        left: 4%;
        width: 12px;
        height: 12px;
        border:6px solid red;   
        border-radius: 50%; 
        // background-color: red;
        // border-radius: 8px;
    }
    .div1{
        width: 10%;
        height: 10%;
        border-radius: 42%;
        position: absolute;
        top: 17.5%;
        left: 9.5%;
        // '#e64179','#3494f1','#3abfa5','#7e4fff'
        color: #e64179;
        background-color: white;
    }
    .span1{
        position: absolute;
        width: 46px;
        height: 30px;
        text-align: center;
        top: 11%;
        left: 24.5%;
        color: #e64179;
        font-size: 145%;
    }
    .span2{
        position: absolute;
        top: 49%;
        width: 56px;
        height: 30px;
        text-align: center;
        left: 24.5%;
        color: #e64179;
        font-size: 145%;
    }
    .span3{
        position: absolute;
        top: 34%;
        left: 11%;
        color: #e64179;
        font-size: 145%;
    }
    .div22{
        width: 10%;
        height: 10%;
        border-radius: 42%;
        position: absolute;
        top: 17.5%;
        left: 33.5%;
        // '#e64179','#3494f1','#3abfa5','#7e4fff'
        color: #3494f1;
        background-color: white;
    }
    .span21{
        position: absolute;
        top: 11%;
        left: 25.5%;
        width: 46px;
        height: 30px;
        text-align: center;
        color: #3494f1;
        font-size: 145%;
    }
    .span22{
        position: absolute;
        top: 49%;
        left: 25.5%;
        width: 56px;
        height: 30px;
        text-align: center;
        color: #3494f1;
        font-size: 145%;
    }
    .span23{
        position: absolute;
        top: 34%;
        left: 35%;
        color: #3494f1;
        font-size: 145%;
    }
    .div33{
        width: 10%;
        height: 10%;
        border-radius: 42%;
        position: absolute;
        top: 17.5%;
        left: 57%;
        // '#e64179','#3494f1','#3abfa5','#7e4fff'
        color: #3abfa5;
        background-color: white;
    }
    .span31{
        position: absolute;
        top: 11%;
        left: 25.5%;
        width: 46px;
        height: 30px;
        text-align: center;
        color: #3abfa5;
        font-size: 145%;
    }
    .span32{
        position: absolute;
        top: 49%;
        left: 25.5%;
        width: 56px;
        height: 30px;
        text-align: center;
        color: #3abfa5;
        font-size: 145%;
    }
    .span33{
        position: absolute;
        top: 34%;
        left: 59%;
        color: #3abfa5;
        font-size: 145%;
    }
    .div44{
        width: 10%;
        height: 10%;
        border-radius: 42%;
        position: absolute;
        top: 17.5%;
        left: 81%;
        // '#e64179','#3494f1','#3abfa5','#7e4fff'
        color: #7e4fff;
        background-color: white;
    }
    .span41{
        position: absolute;
        top: 11%;
        left: 25.5%;
        width: 46px;
        height: 30px;
        text-align: center;
        color: #7e4fff;
        font-size: 145%;
    }
    .span42{
        position: absolute;
        top: 49%;
        left: 24.5%;
        width: 56px;
        height: 30px;
        text-align: center;
        color: #7e4fff;
        font-size: 145%;
    }
    .span43{
        position: absolute;
        top: 34%;
        left: 83%;
        color: #7e4fff;
        font-size: 145%;
    }
    div.divclass1{
        padding: 0;
        border: 2px solid #ccc;
        border-radius: 8px;
    }
    .divclass{
        margin-left: 4px;
        padding-left: 5px;
        border: 2px solid #ccc;
        border-radius: 8px;
    }
    .heightprcent .table th,.heightprcent .table td{
        line-height: 30px;
    }
    .div-bottom {
        border: 2px solid #ccc;
        border-radius: 8px;
    }
    .div-scroll {
        position: relative;
    }
    .table-bottom {
        borer: 2px solid #ccc;
        border-left: 0;
        border-right: 0;
        border-radius: 8px;
        width: 98.5%;
        position: absolute;
        margin-left: 7px;
        margin-right: 5px;
        left: 0%;
        top: 0px;
    }
    tr.trborder{
        border:1px solid #d2d2d2;
    }
    table thead th.thborder{
        border:1px solid #d2d2d2;
        line-height: 53px;
        // font-weight: bold;
        // border-bottom:1px solid #ccc;
        background-color: #e6e4e4;
    }
    .tableclass1{
        border:0;
        height: 50px;
        position: relative;
        padding: 0;
        z-index: 30000;
        // width: 99%;
        width: 100%;
        margin: 0;
        // margin-left: 5px;
        margin-left: 0px;
    }
    .tableclass{
        width: 99%;
        height: 100%;
        borer: 2px solid #ccc;
        border-radius: 8px;
        position: absolute;
        margin-left: 7px;
        margin-right: 5px;
        left: 0px;
        top: 53px;
    }
    .divs-quare1{
        width: 20px;
        height: 20px;
        border-radius: 5px;
        margin: 5px;
        margin-top: 12px;
        background-color: #e64179;
    }
    .margin-time {
        margin-left: 45%;
    }
    .divs-quare-bottom{
        width: 20px;
        height: 20px;
        border-radius: 5px;
        margin: 5px;
        margin-top: 12px;
        background-color: #3494f1;
    }
    .c-warning-red {
        color: #e64179;
    }
    .c-warning-blue {
        color: #3494f1;
    }
    .c-warning-green {
        color: #3abfa5;
    }
    // '#e64179','#3494f1','#3abfa5','#7e4fff'
    .c-warning-purple{
        color: #7e4fff;
    }
    .c-warning-color {
        color: #3abfa5;
    }
    div.c-red-orderdetails {
        font-weight: bold;
        color: red;
        font-size: 24px;
    }
    .c-color-orderdetails{
        font-weight: 700;
        color: #3494f1;
        font-size: 24px; 
    }
    div.heightprcent{
        height: 99%;
        margin-left: 0.5%;
    }
    .thead-height-wait {
        height: 80px;
    }
    div.layui-modify1 {
        width: 100%;
        height: 100%;
        left:0;
        top: 0px;
        margin-left: 0;
        z-index: 9999999;
    }
    // .table tbody {
    //     display:block;
    //     height:195px;
    //     overflow-y:scroll;
    // }
    // table thead, tbody tr {
    //     display:table;
    //     width:100%;
    //     table-layout:fixed;
    // }
    // table thead {
    //     width: calc( 100% - 1em )
    // }
    table.thead-padding {
        // padding: 0;
    }
    .rightheight {
        height: 100%;
        width: 100%;
        // border: 2px solid #ccc;
        // border-radius: 5px;
    }
    .circle {
        width: 100%;
        height: 40%;
        border: 2px solid #ccc;
        border-radius: 8px;
        // background-color: yellow;
    }
    div.layui-layer-content1 {
        width: 100%;
        height: 100%;
    }
    div.layui-layer-title1 {
        height: 0px;
        line-height: 0px;

    }
    .radio-wh{
        width: 20px;
        height: 20px;
        cursor: pointer;
    }
    div.layui-modify-left {
        left: 50%; 
        margin-left: -400px; 
    }
    @media screen and (max-width: 2300px) {
        th.f-tr,td.f-tr {
            font-size: 150%;
        }
        .heightprcent .table th,.heightprcent .table td{
            line-height: 34px;
        }
        .span1,.span2,.span21,.span22,.span31,.span32,.span41,.span42{
            left: 24.5%;
        } 
        table thead th.thborder{
            border:1px solid #d2d2d2;
            line-height: 53px;
            background-color: #e6e4e4;
        }
    }
    @media screen and (max-width: 2000px) {
        th.f-tr,td.f-tr {
            font-size: 145%;
        }
        .heightprcent .table th,.heightprcent .table td{
            line-height: 34px;
        }
        .span1,.span2,.span21,.span22,.span31,.span32,.span41,.span42{
            left: 24.5%;
        } 
        table thead th.thborder{
            border:1px solid #d2d2d2;
            line-height: 53px;
            background-color: #e6e4e4;
        }
    }
    @media screen and (max-width: 1800px) {
        th.f-tr,td.f-tr {
            font-size: 120%;
        }
        .span1,.span2,.span21,.span22,.span31,.span32,.span41,.span42{
            left: 15.5%;
        } 
        .heightprcent .table th,.heightprcent .table td{
            line-height: 34px;
        }
        table thead th.thborder{
            border:1px solid #d2d2d2;
            line-height: 53px;
            background-color: #e6e4e4;
        }
        tr td.t-noborder {
            height: 30px;
        }
    }
    @media screen and (max-width: 1600px) {
        th.f-tr,td.f-tr {
            font-size: 14px;
        }
        div.timef{
            display: none;
        }
        .heightprcent .table th,.heightprcent .table td{
            line-height: 34px;
        }
        .span1,.span2,.span21,.span22,.span31,.span32,.span41,.span42{
            font-size: 15px;
        }
        .span21,.span22,.span31,.span32,.span41,.span42{
            left: 15.5%;
        }
        table thead th.thborder{
            border:1px solid #d2d2d2;
            line-height: 53px;
            background-color: #e6e4e4;
        }
    } 
    @media screen and (max-width: 1450px) {
        th.f-tr,td.f-tr {
            font-size: 12px;
        }
        div.timef{
            display: none;
        }
        .heightprcent .table th,.heightprcent .table td{
            line-height: 34px;
        }
        .span1,.span2,.span21,.span22,.span31,.span32,.span41,.span42{
            font-size: 13px;
        }
        .span21,.span22,.span31,.span32,.span41,.span42{
            left: 15.5%;
        }
        table thead th.thborder{
            border:1px solid #d2d2d2;
            line-height: 40px;
            background-color: #e6e4e4;
        }
    }
    @media screen and (min-width: 2300px) {
        th.f-tr,td.f-tr {
            font-size: 160%;
        }
        table thead th.thborder{
            border:1px solid #d2d2d2;
            line-height: 53px;
            background-color: #e6e4e4;
        } 
        .heightprcent .table th,.heightprcent .table td{
            line-height: 46px;
        }
        .span21,.span22,.span31,.span32,.span31,.span32,.span41,.span42{
            font-size: 150%;
        }
        .span21,.span22,.span31,.span32,.span41,.span42{
            left: 22.5%;
        }
    }
</style>
<script>
    import * as base from '../assets/js/base.js';
     // 引入基本模板
    let echarts = require('echarts/lib/echarts');
    // 引入圆环图组件
    require('echarts/lib/chart/pie');

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
            };
            var t = null;
            t = setTimeout(time,1000);//開始运行
            function time()
            {
               clearTimeout(t);//清除定时器
               let dt = new Date();
               var h=dt.getHours();//获取时
               var m=dt.getMinutes();//获取分
               var s=dt.getSeconds();//获取秒
               var y = dt.getFullYear(); //获取完整的年份(4位,2014) 
               var month = dt.getMonth()+1; //获取当前月份(0-11,0代表1月) 
               var day = dt.getDate(); //获取当前日(1-31)            
               m =  m < 10 ? "0" + m : m;
               s =  s < 10 ? "0" + s : s; 
               document.getElementById("times").innerHTML = y+"年" +month+"月"+day+"日";
               document.getElementById("time").innerHTML = h+":"+m+":"+s;
               t = setTimeout(time,1000); //设定定时器，外层调用循环运行     
            } 
            // this.topItems = JSON.parse(localStorage['dataInfo']);
            // this.circleNumber(20);
            // this.getOrderNumber(50);
            // this.getOrderWaitNumber();
            let that = this;
            let myChart1 = document.getElementById('main'); 
            // console.log(myChart1);
            
            // setTimeout(function(){

            //     that.circleNumber(20);
            // },5000);

            let [times,timesTdody,timeOrder] = [null,null,null];
            // clearInterval(times);
            times = setInterval(function(){
                that.getOrderWaitNumber();
            },120000);
            // times = setInterval(function(){
            //     that.getOrderWaitNumber();
            // },5000);
            
            let tbodyid = $("#tbodyid");

            let scrollTops = 0;
            let [num,num2] = [0,0];
            var divh = document.getElementById('divclass');



            var arraychange = ["当天行程中的订单总数为:","当天已完成的订单总数为:","当天已取消的订单总数为:"];
            var arraychangecolor = ['#3494f1','#3abfa5','#7e4fff'];
            var orderStatusArray = [50,60,-10];
            var j = 0;
            // 动态传值进行调用数据显示在表格
            function orderFn(number_order){
                if(j<2){
                    j +=1;
                }
                else{
                    j = 0;
                } 


                // var order_child = document.getElementById('order_child');
                var order_hange = document.getElementById('order_hange');
                var order_change_count = document.getElementById('order_change_count');
                var divs_quare_bottom = document.getElementById('divs_quare_bottom');

                // 动态修改当天订单的总数内容
                order_hange.innerText = arraychange[j];
                divs_quare_bottom.style.backgroundColor = arraychangecolor[j];
                order_change_count.style.color = arraychangecolor[j];
                // c_warning_color.style.color = arraychangecolor[j];
                // order_change_count.innerHTML = '';
                // order_change_count.innerHTML = arraychange_count[j];
                // order_change_count.removeChild(order_change_count.childNodes[0]);
                // order_change_count.appendChild(arraychange_count[j]);

                // 传不同状态值调出表格的数据
                that.getOrderNumber(orderStatusArray[j]);
                that.circleNumber(orderStatusArray[j]);
                // console.log('j1='+j);
            }
            // 定时动态传值进行调用数据显示在表格
            // clearInterval(timeOrder);
            // timeOrder = setInterval(orderFn,120000);
            timeOrder = setInterval(orderFn,5000);
            // timeOrder = setInterval(orderFn,5000);
            // timeOrder = setTimeout(orderFn,2000);

           

            //定时向上滚动表格数据

            // function autoPlayFn(){
                function autoPlay() { 

                        var divh = document.getElementById('divclass');
                        var div_scrollh = document.getElementById('div_scroll');
                        var tableh = document.getElementById('tableid');
                        var table_bottomh = document.getElementById('table_bottom');

                        // 获取表格父亲的高度
                        var table_bottomh_ums = -table_bottomh.offsetHeight;//没有单位的，可以不转换
                        var tableHeight = -tableh.offsetHeight;//没有单位的，可以不转换
                        var divHeight = -divh.offsetHeight;
                        var num_div_scrollh = -div_scrollh.offsetHeight;

                        // 每次向上滚动
                        num -=1;
                        num2 -=1;
                        var difference = tableHeight - divHeight + divHeight*1/10;
                        var difference2 = table_bottomh_ums - num_div_scrollh + num_div_scrollh*1/6;
                        // console.log(difference);

                        // 判断是否向上滚动到临界点
                        num <= difference ? num = 0 : num;
                        num2 <= difference2 ? num2 = 0 : num2;
                        // 开始向上滚动
                        tableh.style.top =70 + num + "px";
                        table_bottomh.style.top =30 +  num2 + "px";
                    // },1000);
                    
                }
                // clearInterval(timesTdody);
                // timesTdody = setInterval(autoPlay,100);


            that.getOrderNumber(50);
            that.getOrderWaitNumber();
            // clearInterval(timesTdody);
            that.circleNumber(50);
            
            // 定时向上滚动
            window.onload=function(){
                // that.getOrderNumber(20);
                // that.getOrderWaitNumber();
                // clearInterval(timesTdody);
                // that.circleNumber(20);
                timesTdody = setInterval(autoPlay,100);
            };
            

             // $(document).ready(function(){ timesTdody = setInterval(autoPlay,100);}
           
            // console.log('启动了定时器'); 

             //点击关关闭时清除定时器
            // $('#close').click(even=>{clearInterval(timesTdody);clearTimeout(t);clearInterval(timeOrder)});

            // // 鼠标移动到表格上时停止定时器;移走时开始 定时器
            // $("#divclass").mouseenter(function(event) {
            //     clearInterval(timesTdody);
            //     clearInterval(timeOrder);
            // })
            // .mouseleave(function(){
            //     clearInterval(timesTdody);
            //     clearInterval(timeOrder);
            //     timeOrder = setInterval(orderFn,50000);
            //     timesTdody = setInterval(autoPlay,100);
            // });
            // $("#div_scroll").mouseenter(function(event) {
            //     clearInterval(timesTdody);
            //     clearInterval(timeOrder);
            // })
            // .mouseleave(function(){
            //     clearInterval(timesTdody);
            //     clearInterval(timeOrder);
            //     timeOrder = setInterval(orderFn,5000);
            //     timesTdody = setInterval(autoPlay,100);
            // });


            // var move = document.getElementById("move");
            // move.onmouseenter = function() {
            //     clearInterval(timesTdody);
            //     clearInterval(timeOrder);
            //     clearInterval(times);
            // }
            // move.onmouseleave = function(){
            //     // clearInterval(timesTdody);
            //     // clearInterval(timeOrder);
            //     // clearInterval(times);
            //     timeOrder = setInterval(orderFn,5000);
            //     timesTdody = setInterval(autoPlay,100);
            //     times = setInterval(function(){
            //         that.getOrderWaitNumber();
            //     },5000);
            // }

            // $("#move").mouseenter(function(event) {
            //     clearInterval(timesTdody);
            //     clearInterval(timeOrder);
            //     clearInterval(times);
            // })
            // .mouseleave(function(){
            //     clearInterval(timesTdody);
            //     clearInterval(timeOrder);
            //     clearInterval(times);
            //     timeOrder = setInterval(orderFn,5000);
            //     timesTdody = setInterval(autoPlay,100);
            //     times = setInterval(function(){
            //         that.getOrderWaitNumber();
            //     },5000);
            // });

        },
        props: ['titledetail','datadetail'],
        data:function(){
            return {
                items:[],
                orderItems:[],
                number:'',
                finished_order_cnt: '',
                cancel_order_cnt:'',
                wait_order_cnt:'',
                running_order_cnt:'',
                orderStatusSelected:'20',
                scrollTop: 0,
                countNumbers: '',
                countNumbers_finished:'',
                countNumbers_cancel:'',
                countNumbers_running:'',
                countNumbers_wait:'',
                order_cnt:'',
                is_class_red: true,
                is_class_blue: false,
                is_class_green: false,
                is_class_purple: false,
            }
        },
        filters: {
            // 截取时间字符串
            formatDate(time) {
                return time.substring(11,16);
            }
        },
        methods: {
            //初始化分页   
            initPage:function(obj,tpageToal='4',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:1,
                    count:count,
                    callback:(p)=>{
                        carpoolOps.page = p;
                        this.queryAjax();
                    }
                });
            },
            isGroup:function(e,i){
                if(e[i+1]){
                    if(i==0){
                        return 'group first'; 
                    }
                    return e[i]['carpool_id'] == e[i+1]['carpool_id']? 'group': '';
                }else if(e[i-1]){
                    return e[i]['carpool_id'] == e[i-1]['carpool_id']? 'group last': '';
                }else{
                    return '';
                }
            },
            circleNumber: function(number){
                let that = this;
                 
                $.ajax({
                    url: `${base.gAjaxUrl.officialcarorders}number/?page=${carpoolOps.page}&page_size=${carpoolOps.page_size}`,
                    contentType: 'application/json',
                    type: 'GET',
                    // data:JSON.stringify({orders:arr})
                    data: {
                        // order_status : 20,
                    }
                })
                .always((data)=>{
                    console.log("Got order num");
                    base.ajaxCallback(data,()=>{
                            // 各订单的总数
                            that.finished_order_cnt = data.finished_order_cnt;
                            that.cancel_order_cnt = data.cancel_order_cnt;
                            that.running_order_cnt = data.running_order_cnt;
                            that.wait_order_cnt = data.wait_order_cnt;

                            // 百分比总数
                            that.countNumbers = data.finished_order_cnt + data.cancel_order_cnt + data.running_order_cnt + data.wait_order_cnt;
                            /*that.countNumbers_finished = (data.finished_order_cnt / that.countNumbers * 100).toFixed(1);
                            that.countNumbers_cancel = (data.cancel_order_cnt / that.countNumbers * 100).toFixed(1);
                            that.countNumbers_running = (data.running_order_cnt / that.countNumbers * 100).toFixed(1);
                            that.countNumbers_wait = (data.wait_order_cnt / that.countNumbers * 100).toFixed(1);*/
                            that.countNumbers_finished = Math.floor(data.finished_order_cnt / that.countNumbers * 100);
                            that.countNumbers_cancel = Math.floor(data.cancel_order_cnt / that.countNumbers * 100);
                            that.countNumbers_running = Math.floor(data.running_order_cnt / that.countNumbers * 100);
                            that.countNumbers_wait = Math.floor(data.wait_order_cnt / that.countNumbers * 100);

                            // 避免没有数据时出现NAN而不能画圆
                            if(data.finished_order_cnt==0){
                                that.countNumbers_finished = 0;
                            }
                            if(data.cancel_order_cnt==0){
                                that.countNumbers_cancel = 0;
                            }
                            if(data.running_order_cnt==0){
                                that.countNumbers_running = 0;
                            }
                            if(data.wait_order_cnt==0){
                                that.countNumbers_wait = 0;
                            }

                            //  剩余的部分数 Math.floor
                            /*that.countNumbers_finished_Surplus = (100 - that.countNumbers_finished ).toFixed(1);
                            that.countNumbers_cancel_Surplus = (100 - that.countNumbers_cancel ).toFixed(1);
                            that.countNumbers_wait_Surplus = (100 - that.countNumbers_wait ).toFixed(1);
                            that.countNumbers_running_Surplus = (100 - that.countNumbers_running ).toFixed(1);*/
                            that.countNumbers_finished_Surplus = Math.floor(100 - that.countNumbers_finished );
                            that.countNumbers_cancel_Surplus = Math.floor(100 - that.countNumbers_cancel );
                            that.countNumbers_wait_Surplus = Math.floor(100 - that.countNumbers_wait );
                            that.countNumbers_running_Surplus = Math.floor(100 - that.countNumbers_running );
                            // console.log('是否是小数：'+that.countNumbers_wait_Surplus);
                            // 避免没有数据时出现NAN而不能画圆
                            if(data.finished_order_cnt==0){
                                that.countNumbers_finished_Surplus = 100;
                            }
                            if(data.cancel_order_cnt==0){
                                that.countNumbers_cancel_Surplus = 100;
                            }
                            if(data.running_order_cnt==0){
                                that.countNumbers_running_Surplus = 100;
                            }
                            if(data.wait_order_cnt==0){
                                that.countNumbers_wait_Surplus = 100;
                            }

                            // 不同的状态变化总数与表格的颜色
                            if(number == 60){
                                that.order_cnt = data.finished_order_cnt;
                                that.is_class_red = false;
                                that.is_class_blue = false;
                                that.is_class_green = true;
                                that.is_class_purple = false;
                            }
                            else if(number == 20){
                                that.order_cnt = data.wait_order_cnt;
                                that.is_class_red = true;
                                that.is_class_blue = false;
                                that.is_class_green = false;
                                that.is_class_purple = false;
                            }
                            else if(number == 50){
                                that.order_cnt = data.running_order_cnt;
                                that.is_class_red = false;
                                that.is_class_blue = true;
                                that.is_class_green = false;
                                that.is_class_purple = false;
                            }
                            else if(number == -10){
                                that.order_cnt = data.cancel_order_cnt;
                                that.is_class_red = false;
                                that.is_class_blue = false;
                                that.is_class_green = false;
                                that.is_class_purple = true;
                            }
                            // console.log("Before require")
                            // // 使用earcrts进行画圆环图
                            let echarts = require('echarts/lib/echarts');
                            // console.log("After require")
                                    // 基于准备好的dom，初始化echarts图表
                                    // setTimeout(function(){
                                    //     var myChart = echarts.init(document.getElementById('main')); 
                                    //     return myChart;
                                    // },2000);
                                    
                                    // let myChart = echarts.init(myChart1); 
                                    // console.log("After echar init");
                                    // console.log("main");
                                    var labelTop = {
                                        normal : {
                                            label : {
                                                show : true,
                                                position : 'center',
                                                formatter : '{b}',
                                                textStyle: {
                                                    baseline : 'bottom',
                                                    // 文字的基准线的位置偏移
                                                    // 圆内的字体大小
                                                    // fontSize: 18,
                                                    // fontWeight: 'bolder',
                                                    // color:['#e64179','#3494f1','#3abfa5','#7e4fff',],
                                                }
                                            },
                                            labelLine : {
                                                show : false
                                            }
                                        }
                                    };
                                    var labelFromatter = {
                                        normal : {
                                            label : {
                                                formatter : function (params){
                                                    return 100 - params.value + '%'
                                                },
                                                textStyle: {
                                                    baseline : 'top',
                                                    // 百分比的基准线的位置偏移
                                                    // 圆内百分比的字体大小
                                                    // fontSize: 18,
                                                    // fontWeight: 'bolder',
                                                    // color:['#e64179','#3494f1','#3abfa5','#7e4fff',]
                                                },
                                                // normal:{
                                                //     color:'rgb(255,3,0)',
                                                // },
                                            }
                                        },
                                    }
                                    var labelBottom = {
                                        normal : {
                                            color: '#ccc',
                                            label : {
                                                show : true,
                                                position : 'center',
                                                // 百分比左右的位置偏移
                                            },
                                            labelLine : {
                                                show : false
                                            }
                                        },
                                        emphasis: {
                                            color: 'rgba(0,0,0,0)'
                                        }
                                    };
                                    var radius = ['30%', '40%'];//圆环的大小
                                    var option = {
                                        legend: {
                                            // 样式的位置
                                            // x : 'center',
                                            // y : 'center',
                                            x : '6%',
                                            // y : 'left',
                                            y : '12%',
                                            textStyle:{
                                                fontSize: 18,
                                                paddingLeft: 40,
                                                color:['#e64179','#3494f1','#3abfa5','#7e4fff',],
                                            },
                                            data:[
                                                
                                                '待派单','行程中','已完成','已取消',
                                            ],
                                        },
                                        title : {
                                            text: [
                                                '当天各状态的订单总数和百分比',
                                                // '待派单     ','行程中     ','已完成    ','已取消',
                                            ],
                                            subtext: '',
                                            x: '6%',
                                            // x: 'left',
                                            y: 'top',
                                            textStyle:{
                                                fontSize: 24,
                                                // paddingLeft: 40,
                                            },
                                        },
                                        color:['#e64179','#3494f1','#3abfa5','#7e4fff',],
                                        series : [
                                            {
                                                type : 'pie',
                                                center : ['13%', '55%'],
                                                radius : radius,
                                                x: '0%', // for funnel
                                                itemStyle : labelFromatter,
                                                data : [
                                                    {name:'other', value:that.countNumbers_wait_Surplus, itemStyle : labelBottom},
                                                    // {name:'待派单', value:'',itemStyle : labelTop}
                                                    {name:'待派单', value:that.countNumbers_wait,itemStyle : labelTop}
                                                ]

                                            },
                                            {
                                                type : 'pie',
                                                center : ['38%', '55%'],
                                                radius : radius,
                                                x:'20%', // for funnel
                                                itemStyle : labelFromatter,
                                                data : [
                                                    {name:'other', value:that.countNumbers_running_Surplus, itemStyle : labelBottom},
                                                    {name:'行程中', value:that.countNumbers_running,itemStyle : labelTop}
                                                ]
                                            },
                                            {
                                                type : 'pie',
                                                center : ['63%', '55%'],
                                                radius : radius,
                                                x:'40%', // for funnel
                                                itemStyle : labelFromatter,
                                                data : [
                                                    {name:'other', value:that.countNumbers_finished_Surplus, itemStyle : labelBottom},
                                                    {name:'已完成', value:that.countNumbers_finished,itemStyle : labelTop}
                                                ],
                                            },
                                            {
                                                type : 'pie',
                                                center : ['88%', '55%'],
                                                radius : radius,
                                                x:'60%', // for funnel
                                                itemStyle : labelFromatter,
                                                data : [
                                                    {name:'other', value:that.countNumbers_cancel_Surplus, itemStyle : labelBottom},
                                                    {name:'已取消', value:that.countNumbers_cancel,itemStyle : labelTop}
                                                ]
                                            }, 
                                        ]
                                    };
                                    // window.onload=function(){
                                    //     var myChart = echarts.init(document.getElementById('main')); 
                                    //     myChart.setOption(option);
                                    //     console.log("Finish echar setting")
                                    // }
                                    // 为echarts对象加载数据 
                                    setTimeout(function(){
                                        var myChart = echarts.init(document.getElementById('main')); 
                                        myChart.setOption(option);
                                        // console.log("Finish echar setting");
                                        // return myChart;
                                    },1000);
                        
                                    window.onresize = function(){
                                        var myChart1 = echarts.init(document.getElementById('main')); 
                                        myChart1.setOption(option);
                                    }
                                        
                                }
                        );
                    });            
            },
            getOrderNumber: function(number){
                this.orderItems = [];
                carpoolOps.param.order_status = number;
                // carpoolOps.param.order_status = 20;

                $.ajax({
                    url: `${base.gAjaxUrl.officialcarorders}today_orders/?page=${carpoolOps.page}&page_size=${carpoolOps.page_size}`,
                    contentType: 'application/json',
                    type: 'GET',
                    data: carpoolOps.param,
                    // order_status : this.order_status,       
                })
                .always((data)=>{
                    base.ajaxCallback(data,()=>{
                        let len = data.results.length;
                        let resultData = data.results;
                        this.orderItems = resultData; 
                    });
                });
            },
            getOrderWaitNumber: function(number){
                // 获取等待接单中的数据的函数
                // this.orderItems = [];
                carpoolOps.param.order_status = 20;

                $.ajax({
                    url: `${base.gAjaxUrl.officialcarorders}today_orders/?page=${carpoolOps.page}&page_size=${carpoolOps.page_size}`,
                    contentType: 'application/json',
                    type: 'GET',
                    data: carpoolOps.param,
                    // order_status : this.order_status,       
                })
                .always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
                        let resultData = data.results;
                        this.items = resultData;
                    });
                });

                // $.ajax({  
                //     url: `${base.gAjaxUrl.officialcarorders}today_orders/?page=${carpoolOps.page}&page_size=${carpoolOps.page_size}`, 
                //     contentType: 'application/json', 
                //     type: "GET",  
                //     data: carpoolOps.param,  
                //     success: function(data){  
                //             let resultData = data.results;
                //             this.items = resultData;
                //     },
                //     error: function (XMLHttpRequest, textStatus, errorThrown) {      
                //         alert("请求失败！");
                //     },  
                //  });  
            },
        },
        events: {
            'tabshow': function() {
                console.log('tab-show')
                departmentOrderStatisticsChart.resize()
                companyOrderStatistics.resize()
                orderDrivingTimeDistribution.resize()
                orderDrivingDistanceDistributionChart.resize()
            },
        },
        
    }
</script>
<style lang="less">
.layui-layer-title{
    .m-info{
        border: none;
        padding: 9px 0;
        margin: 0;
    }
}
</style>
