<template>
    <!--<div class="layui-layer1">-->
    <div class="layui-layer layui-layer1 layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">
            <div class="titlecomm f-l f-20 ">部门用车明细</div>
        </div>
            <div class="row cl">
                <div class="col-6 f-l">
                <div class="form-label f-l col-3 text-r mr-5 select-department">选择部门:</div>
                <div class="formControls f-l col-7">
                    <div class="department_select_container" @mouseleave="departmentEnter(false)" @mouseenter="departmentEnter(true)">
                        <input v-if="departmentsdata.length === 0" disabled type="text" class="input-text" value="无可选择部门">
                        <input v-else autocomplete="off" @click="departmentClick" v-model="departmentSelectedName" type="text" class="input-text" value="" placeholder="" name="department">
                        <i v-show="departmentSelectedName !== ''" class="empty-icon Hui-iconfont" @click="emptySearch()">&#xe60b;</i>
                        <div class="departmentListBox" style="display: none">
                            <div v-bind:title="item.staff__department__department_name" v-for="item in departmentsdata | filterBy departmentSelectedName in 'staff__department__department_name'" @click="setDepartmentValue(item)" class="departmentListItem">{{item.staff__department__department_name}}</div>
                        </div>
                    </div>
                </div>
                </div>
                <!--<select id="" v-model="selectedDepartment" class="se-r f-l" @change="setDepartmentRange($event, item)">-->
                    <!--<option value="{{item.staff__department}}" v-for="item in departmentsdata">{{item.staff__department__department_name}}</option>-->
                <!--</select>-->
                <div class="col-6 f-r">
                开始日期：
                <input  v-model="start" type="text" class="input-text" id="Q-start-outer-date" v-bind:value="start">
                结束日期：
                <input v-model="end" type="text" class="input-text" id="Q-end-outer-date" v-bind:value="end">
                <button type="submit" class="btn btn-success radius" v-on:click="setDateRange()"><i  class="Hui-iconfont">&#xe665;</i></button>
                </div>
            </div>
        <div class="layui-layer-content layui-layer-content2">
            <div class="f-20">{{department_name}}:<span class="ml-10 fc-ff0000">{{order_num}}单</span></div>
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
                <table class="table table-border table-hover table-bg table-sort radius  table-striped table-bg " v-show="order_num != 0">
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
                            <td>{{order.driver_vo?order.driver_vo.staff_vo.real_name:'--'}}</td>
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

                <div class="no-data text-c mt-50" v-show="noData">没有相关数据</div>
            </div>
            <div id="test1"></div>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" @click="close()"></a>
        </span>
    </div>
    <drivermap :title="mapTitle" :data="mapData" v-if="isShowMapDialog" v-on:dialog-close="mapClose"></driverMap>
    <!--</div>-->
    <div class="layui-layer-shade"></div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>

<style lang="less" rel="stylesheet/less" scoped>

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
         /*margin-top: 8px;*/
         width: 300px;
         margin-left: 10px;
         background: #5cadff;
         border-radius: 20px;
         color: #fff;
         padding-left: 33px;
         height: 26px;
         font-size: 15px;
     }
    .select-day{
        position:relative;
        min-width: 260px;
        height: 42px;
        text-align: center;
     }
    .layui-layer1{
        height: 90%;
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
        overflow: auto;
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
    .input-text{
        width: 20%;
    }
    .department_select_container>.input-text{
        width: 100%;
    }
    .select-department{
        line-height: 30px ;
    }
    @media screen and (min-width: 3000px) {
        .driver-number ul{
            margin-left: 15%;
        }
    }
</style>
<script>
import * as base from '../assets/js/base.js';
import moment from "moment";
import drivermap from "../components/driverMap.vue";
//import laypage from "../assets/third-party/layui/lay/modules/laypage.js";
//import layui from "../assets/third-party/layui/layui.js";
  // 引入基本模板
//    let echarts = require('echarts/lib/echarts');
//
//        laypage.laypage({
//        cont:$("#test1"),
//        pages:10,
//        curr:1,
//        groups:5,
//        first:"首页",
//        last:"尾页",
//        prev:"true",
//        next:"true",
//        skip:"true",
//
//
//    })
let staffsOps = null;
    export default{
        ready () {
            staffsOps = {
                param:{
                    page:1,
                    page_size:30,
                },

            };
            console.log("this.departmentsData");
            console.log(this.departmentsdata);

//            let driverSelectedIndex = this.driverSelectedIndex;
            // $("#carSelectDayId option").eq(driverSelectedIndex).attr("selected","selected").siblings("option").removeAttr("selected");
            // let value = $("#carSelectDayId option").eq(driverSelectedIndex).val();
            this.selectedDepartment = this.data;

            this.setDateRange();
            let that = this;
            window.onresize = function(){
                that.setDateRange();
            }


            for(let item of that.departmentsdata){
                if(item.staff__department == that.data){
                    that.department_name = item.staff__department__department_name;
                    this.departmentSelectedName = item.staff__department__department_name;
                }
            }
            new Kalendae.Input('Q-start-outer-date',{
                months: 2,
                clickHide:true
            });
            new Kalendae.Input('Q-end-outer-date',{
                months: 2,
                clickHide:true
            });
        },
        props: ['data','start','end','departmentsdata'],
        data:function(){
            return {
                isShowMapDialog:false,
                itemsLoading: false,
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
                isDepartmentFocus:false,
                departmentSelectedName:'',
            }
        },
        methods: {
            // 选择日期
            setDateRange: function () {
                if(moment(this.end).isBefore(this.start)){
                    layer.msg("开始时间不能大于结束时间",{icon:2,time:1500});
                    return
                }
//                this.start_date = this.formatDate(this.days);
//                this.end_date = this.formatDate(0);
                //this.getBaseData();
                staffsOps.param.page = 1;
                this.getOrders((tpageToal='4',count='0')=>{
                        this.initPage('#J-page',tpageToal,count)
                });
            },
            // 选择部门
//             setDepartmentRange: function (ele) {
//                 let that = this;
//                 this.selectedDepartment = ele.target.value;
//                 for(let item of that.departmentsdata){
//                     if(item.staff__department == that.selectedDepartment){
//                         that.department_name = item.staff__department__department_name;
// //                        that.order_num = item.order_num - 1;
//                     }
//                 }
//                 this.getOrders();
//             },
            formatDate: function (days) {
                let dd = new Date();
                dd.setDate(dd.getDate()-days);//获取AddDayCount天后的日期
                let y = dd.getFullYear();
                let m = dd.getMonth()+1;//获取当前月份的日期
                let d = dd.getDate();
                return y+"-"+m+"-"+d;
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
            getOrders: function (callback=function () {}) {
                let that = this;
                this.itemsLoading = true;
                staffsOps.param.start_date = that.start,
                staffsOps.param.end_date = that.end,
                staffsOps.param.department =  this.selectedDepartment,
                $.ajax({
                    url: base.gAjaxUrl.officialcarorders,
                    type: 'GET',
                    data: staffsOps.param
                })
                .always((data)=>{
                    that.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
                        that.orders = data.results;
                        that.department_name = that.departmentSelectedName;
                        if(data.results && data.results.length != 0){
                            that.orders =data.results;
                            that.order_num =data.count;
                            that.noData = false;
                            callback(data.num_pages,data.count);
                        }else{
                            that.noData = true;
                            that.order_num = 0;
                        }
                    })

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
            setDepartmentValue: function (item) {
                this.departmentSelectedName = item.staff__department__department_name;
                this.selectedDepartment = item.staff__department;
                $(".departmentListBox").hide();
                this.setDateRange();
            },
            // 清除搜索输入框
            emptySearch:function(){
                this.departmentSelectedName = '';
                $(".departmentListBox").show();
            }
        },
        filters:{
            subTime: function(e){
                return e.substring(0,11) ;
            }
        },
        components:{
            drivermap,
        }
    }
</script>
