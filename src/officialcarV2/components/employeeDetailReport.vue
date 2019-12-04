<template>
    <drivermap :title="dialogTitle" :data="dialogData" v-if="isShowDialog" v-on:dialog-close="dialogClose"></driverMap>
    <section class="Hui-article-box">
    <div class="page-container">
        <div class="cl pd-5 bg-1 bk-gray">
            <span class="l">
                <a class="l btn btn-primary radius" href="javascript:;" v-on:click="clickgoBack()">返回</a>
                <div class="l m-info ml-10">
                    <div class="l item">{{data.real_name}}/{{data.sex==1? '男': '女'}}</div>
                    <div class="l item">电话:{{data.phone}}</div>
                    <div class="l item">工号:{{data.job_number}}</div>
                    <div class="l item">总行驶里程:{{data.mileage}}</div>
                    <div class="l item">订单数:{{data.order_cnt}}</div>
                    <div class="l item">行驶时长:{{data.duration/60 | toInt }}小时{{data.duration % 60}}分钟</div>
                </div>
            </span>
        </div>
        <div class="text-l mt-20">
            关键字：
            <input v-model="searchContent" type="text" class="input-text Wdate mr-5" style="width:150px;" placeholder="司机姓名" id="searchInput">

            开始日期：
            <input v-model="startDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-start-date" v-bind:value="startDateInput">
            结束日期：
            <input v-model="endDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-end-date" v-bind:value="endDateInput">
            订单状态：
            <span class="select-box inline mr-5">
                <select v-model="orderStatusSelected" class="select">
                    <option value="">全部</option>
                    <option v-bind:value="item.value" v-for="item in status">{{item.text}}</option>
                </select>
            </span>
            <button type="submit" class="btn btn-success radius" v-on:click="getList(1)"><i class="Hui-iconfont">&#xe665;</i></button>
           <!--  <button class="btn btn-primary radius f-r" v-on:click="exportData()">导出数据</button> -->
        </div>

        <div class="bk-gray radius mt-10 bgc-fff">
            <table class="table table-border table-bg">
                <thead class="text-c">
                    <tr>
                        <th>申请顺序</th>
                        <th>申请人</th>
                        <th>部门/职位</th>
                        <th>电话</th>
                        <th>审批流程</th>
                        <th>审批状态</th>
                        <th>订单状态</th>
                        <th>行程数量</th>
                        <th>订单总费用</th>
                        <th>用车原因</th>
                        <th>备注</th>
                        <th>行驶路径</th>
                    </tr>
                </thead>
                <tbody>
                <template  v-for="(index,item) in items">
                    <tr class="text-c">
                        <td class="clearfix">
                                <span class="f-l">
                                </span>
                            <img :class="{'down-icon':isOpenTwo && filterScrrenOpen(item.id,1)}"   class="allow-icon f-l"  src="../../assets/images/icon-unfold.png" alt="" @click="clickArrow(item,1)">
                            <span>{{item.num}}</span>
                        </td>
                        <td>{{item.staff_vo.real_name}}</td>
                        <td>
                            <div class="text-overflow">
                                {{item.staff_vo.department_name}}/
                                {{item.staff_vo.position}}
                            </div>
                        </td>
                        <td>{{item.staff_vo.phone}}</td>
                        <td>
                            <div class="text-overflow" style="max-width:200px;margin:0 auto;">
                                {{item.approvalinfo_set.join("→")}}
                            </div>
                        </td>
                        <td>{{item.approval_status | filterApplyStatus}}</td>
                        <td>{{item.status | filterOrderStatus}}</td>
                        <td>{{item.trip_set.length}}</td>
                        <td>{{item.fee ? item.fee / 100 : ''}}</td>
                        <td>{{item.reason}}</td>
                        <td>{{item.remark}}</td>
                        <td>
                            <a v-if="isShowOrderBtn(item,50) && locationConfig.cat_map && locationConfig.officialcar2_cat_map"
                               class="btn btn-link size-MINI radius"
                               v-on:click="orderShow(item,'isShowMapDialog')">查看路径</a>
                        </td>
                    </tr>
                    <template v-for="trip in item.trip_set">
                        <tr class="ml-10" v-show="isOpenTwo && filterScrrenOpen(item.id,1)" >
                            <td class="inner_table_box" colspan="12">
                                <table class="bgf9f9f9">
                                    <thead class="text-c">
                                    <tr>
                                        <th width="100">出发地</th>
                                        <th width="100">目的地</th>
                                        <th width="100">出发时间</th>
                                        <th width="100">结束时间</th>
                                        <th width="100">是否本人乘车</th>
                                        <th width="100">乘车人数</th>
                                        <th width="100">乘车人员</th>
                                        <th width="100">司机数量</th>
                                        <th width="100">操作</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="text-c">

                                        <td class="clearfix">
                                                <span class="f-l">
                                                </span>
                                            <img :class="{'down-icon':filterScrrenOpen(trip.id,2)}"   class="allow-icon f-l"  src="../../assets/images/icon-unfold.png" alt="" @click="clickArrow(trip,2)">
                                            <span>{{trip.source_name}}</span>
                                        </td>

                                        <td>{{trip.destination_name}}</td>

                                        <td>
                                            <div class="text-overflow">
                                                {{trip.admin_ride_time}}
                                            </div>
                                        </td>

                                        <td>{{trip.admin_end_time}}</td>

                                        <td>
                                            {{trip.is_self_use?"是":"否"}}
                                        </td>

                                        <td>{{trip.passenger_number}}</td>
                                        <td>
                                            <span v-for="staff in trip.use_staffs">
                                                {{staff.real_name}}
                                                <span v-if="$index !== trip.use_staffs.length - 1 ">/</span>
                                            </span>
                                        </td>
                                        <td>{{trip.drivertrip ? trip.drivertrip.length : 0}}</td>
                                        <td>
                                            <!--<a v-if="item.status > 0 && item.status < 40" class="btn btn-link size-MINI radius" v-on:click="showDialog(trip)">查看路径</a>-->
                                            <a v-if="filterTowBtnShow(trip) && locationConfig.cat_map && locationConfig.officialcar2_cat_map" class="btn btn-link size-MINI radius" v-on:click="showDialog(trip)">查看路径</a>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr class="ml-40" v-for="driverTrip in trip.drivertrip" v-show="filterScrrenOpen(trip.id,2)">
                            <td class="inner_table_box2" colspan="22">
                                <table class="bgf9f9f9">
                                    <thead class="text-c">
                                    <tr>
                                        <th width="100" class="pl-15">司机姓名</th>
                                        <th width="100">司机电话</th>
                                        <th width="100">司机行程状态</th>
                                        <th width="100">车牌号</th>
                                        <th width="100">行程费用</th>
                                        <th width="100">行驶里程</th>
                                        <th width="100">行程时长</th>
                                    </tr>
                                    </thead>
                                    <tbody >
                                    <tr class="text-c">
                                        <td>{{driverTrip.driver_name}}</td>
                                        <td>
                                            {{driverTrip.driver_phone}}
                                        </td>
                                        <td>{{driverTrip.status_name}}</td>
                                        <td>
                                            {{driverTrip.car_no}}
                                        </td>
                                        <td>{{driverTrip.fee / 100 }}</td>
                                        <td>{{driverTrip.driver_mileage / 1000 }}公里</td>
                                        <td>{{driverTrip.durations}}分钟</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </template>
                </template>
                </tbody>
            </table>

        </div>
            <div id="J-page" class="m-page"  v-show="!noData"></div>
        <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
    </div>
    </section>
</template>

<style lang="less" scoped>

    .allow-icon{
        transform: rotateZ(180deg);
        height:20px;
        cursor: pointer;
        transition:0.3s all;
    }
    .down-icon{
        transform: rotateZ(0deg);
    }
    .inner_table_box {
        padding: 0 0 0 20px;
        box-sizing: border-box;
        border:none !important;
    }
    .inner_table_box2{
        padding: 0 0 0 30px ;
        box-sizing: border-box;
        background: none !important;
        border:none !important;
    }
    .bgf9f9f9{
        background: #f9f9f9 !important;
    }
</style>

<script type="text/ecmascript-6">
    import * as base from '../../assets/js/base.js';
    import moment from "moment";
    import drivermap from "../components/driverMap.vue";
    let rideDetailReportOps = null;

    export default{
        ready () {
            rideDetailReportOps = {
                param:{
                    search:'',
                    start_date:'',
                    end_date:'',
                    page:1,
                    page_size:10
                },

            };



            this.startDateInput = this.start;
            this.endDateInput = this.end;

            new Kalendae.Input('J-end-date', {
                format:'YYYY-MM-DD',
                months: 2,
            });
            new Kalendae.Input('J-start-date', {
                format:'YYYY-MM-DD',
                months: 2,
            });
            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-page',tpageToal, count)
            });

            this.getLocationConfig();
        },
        props:["data","end","start","type"],
        data:function(){
            return {
                isShowDialog:false,
                dialogTitle:'查看路径',
                dialogData:'',
                items: [],
                noData:false,
                startDateInput:'2016-08-01',
                endDateInput:'2016-09-01',
                orderStatusSelected:50,
                orderStatusItems:[],
                searchContent:"",
                isOpenTwo:false, // 是否打开第二层table
                isOpenthree:false, // 是否打开第三层table
                currentOneId:"",  // 第一层的id
                currentTwoIdArr:[], // 第二层的id数组
                status:[
                    // {'value':-20,"text":"已驳回"},
                    // {'value':-10,"text":"已取消"},
                    // {'value':10,"text":"审批中"},
                    // {'value':20,"text":"待派单"},
                    // {'value':30,"text":"待接送"},
                    {'value':40,"text":"接送中"},
                    {'value':50,"text":"已完成"},
                    {'value':60,"text":"已评价"},
                ],

                locationConfig: {} // 轨迹
            }
        },
        methods: {
            getLocationConfig() {
                $.ajax({
                    url: `${base.gAjaxUrl.baseConfig}cat_map/`,
                    type: 'GET',
                }).always((data) => {
                    base.ajaxCallback(data, () => {
                        this.locationConfig = data;
                    });
                })
            },
             is_GC: function(){
                if(localStorage.companyID=='c71a5bc1-ce3a-493b-8587-e645708ac285'){
                    return false;
                }else{
                    return true;
                }
            },
            //初始化分页
            initPage:function(obj,tpageToal='4',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:rideDetailReportOps.param.page,
                    count:count,
                    callback:(p)=>{
                        rideDetailReportOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax:function(callback=function(){}){
                $.showLoading();
                //修改参数
                rideDetailReportOps.param.search = this.searchContent;
                rideDetailReportOps.param.start_date = this.startDateInput;
                rideDetailReportOps.param.end_date = this.endDateInput;
                rideDetailReportOps.param.status = this.orderStatusSelected;
                rideDetailReportOps.param.staff = this.data.id;
                rideDetailReportOps.param.date_key = this.type;
                // rideDetailReportOps.param.date_key = "ctime";
                $.ajax({
                    url: base.gAjaxUrl.officialcarOrder_V2,
                    type: 'GET',
                    data:rideDetailReportOps.param,
                })
                .always((data)=>{
                    $.hideLoading();
                    base.ajaxCallback(data,()=>{
                        let resultData = data.results;
                        this.items = resultData;
                        if(resultData.length){
                            this.noData = false;
                            //回调
                            callback(data.num_pages,data.count);
                        }else{
                            this.noData = true;
                        }
                    });
                })
            },
            //获取列表
            getList:function(reset=0){
                if(moment(this.endDateInput).isBefore(this.startDateInput)){
                    layer.msg("开始时间不能大于结束时间",{icon:2,time:1500});
                    return
                }
                //重置第一页
                if(reset == 1){
                this.searchInput= $("#searchInput").val();
                rideDetailReportOps.param.page = 1
                }
                this.queryAjax((tpageToal='4',count="0")=>{
                    this.initPage('#J-page',tpageToal,count)
                });
            },
            //返回
            clickgoBack:function(){
                //重置第一页
                rideDetailReportOps.page = 1;
                this.queryAjax((tpageToal='4',count="0")=>{
                    this.initPage('#J-page',tpageToal,count)
                });
//                this.$route.router.go({path: '/employeeReport', replace: true});
                this.$dispatch("detail-close")
            },
            clickCheck:function(data){
                if(data.order_status == 60 || data.order_status == 70){
                    localStorage.mapInfo = JSON.stringify(data);
                    this.isShowDialog = true;
                }else{
                    layer.msg('订单未完成，不能查看',{icon:2,time:1000});
                }
            },
            commentTxt:function(txt){
                return base.cutString(txt,5)
            },
            dialogClose:function(data){
                this.isShowDialog = false;
            },
            clickArrow:function(data,level){
                if(level == 1){
                    if(this.currentOneId == data.id){
                        this.isOpenTwo = !this.isOpenTwo;
                        this.isOpenTwo ? '' : this.currentTwoIdArr = [];
                    }else{
                        this.isOpenTwo = true;
                        this.currentOneId = data.id;
                        this.currentTwoIdArr = []
                    }
                }else if(level == 2){
                    let index = this.currentTwoIdArr.indexOf(data.id);
                    if(index != -1){
                        this.currentTwoIdArr.splice(index,1);
                    }else{
                        this.currentTwoIdArr.push(data.id);
                    }
                }
            },
            filterScrrenOpen:function(id,level){
                if(level == 1){
                    return this.currentOneId == id;
                }else if(level == 2){
                    return this.currentTwoIdArr.includes(id);
                }

            },
            showDialog:function(data){
                this.isShowDialog = true;
                this.dialogData = data;
            },
            isShowOrderBtn:function(item,status){
                for (let trip of item.trip_set){
                    for(let driver of trip.drivertrip){
                        if(driver.status == 50){
                            return true
                        }
                    }
                }
                return false;
            },
            orderShow:function(order,showKey){
                let arr = {
                    drivertrip:[]
                };
                for(let trip of order.trip_set){
                    arr.drivertrip = arr.drivertrip.concat(trip.drivertrip)
                }

                this.dialogData = arr;
                // this.isShowMapDialog = true;
                this.isShowDialog= true;
            },
            filterTowBtnShow:function(trip){
                for (let driverTrip of trip.drivertrip){
                    if(driverTrip.status == 50){
                        return true;
                    }
                }
                return false;
            }
        },
        filters:{
            filterOrderStatus:function(data){
                // 订单状态 -20--已驳回  -10--已取消  10--审批中 20--待派单  30--待接送  40--接送中  50--已完成  60--已评价
                switch(data){
                    case -20:{
                        return "已驳回"
                    }
                    case -10:{
                        return "已取消"
                    }
                    case 10:{
                        return "审批中"
                    }
                    case 20:{
                        return "待派单"
                    }
                    case 30:{
                        return "待接送"
                    }
                    case 40:{
                        return "接送中"
                    }
                    case 50:{
                        return "已完成"
                    }
                    case 60:{
                        return "已评价"
                    }
                }
            },
            filterApplyStatus:function(data){
                // 审批状态 -10--驳回  10--审批通过  20--正在审批中  30--无法审批
                switch(data){
                    case -10:{
                        return "已驳回"
                    }
                    case 10:{
                        return "审批通过"
                    }
                    case 20:{
                        return "正在审批中"
                    }
                    case 30:{
                        return "无法审批"
                    }
                }
            },
            toInt: function(e){
                return parseInt(e);
            }
        },
        components:{
            drivermap
        }
    }
</script>
