<template>
    <drivermap :title="dialogTitle" :data="dialogData" v-if="isShowDialog" v-on:dialog-close="dialogClose"></driverMap>
    <section class="Hui-article-box">
    <div class="page-container">
        <div class="cl pd-5 bg-1 bk-gray"> 
            <span class="l">
                <a class="l btn btn-primary radius" href="javascript:;" v-on:click="clickgoBack()">返回</a>
                <div class="l m-info ml-10">
                    <div class="l item">{{tempItems.real_name}}/{{tempItems.sex==1? '男': '女';}}</div>
                    <div class="l item">电话:{{tempItems.phone}}</div>
                    <div class="l item">工号:{{tempItems.job_number}}</div>
                    <div class="l item">总行驶里程:{{tempItems.order_mileage_cnt}}</div>
                    <div class="l item">订单数:{{tempItems.order_cnt}}</div>
                    <div class="l item">行驶时长:{{tempItems.duration/60 | toInt }}小时{{tempItems.duration % 60}}分钟</div>
                    <div class="l item">订单行驶里程:{{tempItems.order_mileage_cnt}}KM</div>
                </div>
            </span> 
        </div>
        <div class="text-l mt-20"> 
            关键字：
            <input type="text" class="input-text Wdate mr-5" style="width:150px;" placeholder="站点/出发时间/价格" id="searchInput">
            
            开始日期：
            <input v-model="startDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-start-date" v-bind:value="startDateInput">
            结束日期：
            <input v-model="endDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-end-date" v-bind:value="endDateInput">
            <div class="mt-10">
            <!-- 审批状态：
            <span class="select-box inline mr-5">  
                <select v-model="approvalStatusSelected" class="select">
                    <option value="">全部</option>
                    <option v-bind:value="$key" v-for="item in approvalStatusItems">{{item}}</option>
                </select>
            </span> -->
            订单状态：
            <span class="select-box inline mr-5">  
                <select v-model="orderStatusSelected" class="select">
                    <option value="">全部</option>
                    <option v-bind:value="$key" v-for="item in orderStatusItems">{{item}}</option>
                </select>
            </span>  
            <div class="skin-minimal w60">
                <span class="f-l mr-5 ">拼车</span>
                <div class="f-l check-box">
                    <input type="checkbox" id="checkbox-1" v-model="carpoolInput">
                </div>
            </div>
            <div class="skin-minimal w60">
                <span class="f-l mr-5 ">加急</span>
                <div class="f-l check-box">
                    <input type="checkbox" id="checkbox-2" v-model="urgentInput">
                </div>
            </div>
            <button type="submit" class="btn btn-success radius" v-on:click="getList(1)"><i class="Hui-iconfont">&#xe665;</i></button>
           <!--  <button class="btn btn-primary radius f-r" v-on:click="exportData()">导出数据</button> -->
            </div>

        </div>
        
            <table class="table table-border table-bordered table-hover table-bg mt-20" >
                <thead>
                    <tr class="text-c">
                        <!-- <th>申请人</th> -->
                        <th>乘车人</th>
                        <th>起点</th>
                        <th>终点</th>
                        <th>出发时间</th>
                        <th>结束时间</th>
                        <th>人数</th>
                        <!-- <th>审批状态</th> -->
                        <th>订单状态</th>
                        <th>拼车</th>
                        <th>加急</th>
                        <th>司机</th>
                        <th>车辆</th>
                        <th>评分/评价</th>
                        <th v-if="is_GC()">订单里程（米）</th>
                        <th>行驶时长</th>
                        <th>行驶路径</th>
                    </tr>
                </thead>
                <div class="result" v-if="!noData">
                <tbody>
                    <tr class="text-c" v-for="item in items">
                        <!-- <td>{{item.staff_vo.real_name}}</td> -->
                        <td>{{item.passenger_name}}</td>
                        <td>{{item.source_name}}</td>
                        <td>{{item.destination_name}}</td>
                        <td>{{item.ride_time}}</td>
                        <td>{{item.end_time}}</td>
                        <td>{{item.passenger_number}}</td>
                        <!-- <td>{{item.approval_status_name}}</td> -->
                        <td>{{item.order_status_name}}</td>
                        <td>{{item.is_carpool? '是': '否'}}</td>
                        <td>{{{isUrgent(item.is_urgent)}}}</td>
                        <td>{{item.driver_vo? item.driver_vo.staff_vo.real_name: '-'}}</td>
                        <td>{{item.vehicle_vo? item.vehicle_vo.car_brand: '-'}}/{{item.vehicle_vo? item.vehicle_vo.car_no: '-'}}</td>
                        <td class="comment-td">
                            {{item.comment_vo.score}}/{{commentTxt(item.comment_vo.comment)}}
                            <div class="comment-popup">
                                {{item.comment_vo.comment}}
                            </div>
                        </td>
                        <td v-if="is_GC()">{{item.order_mileage}}</td>
                        <td>{{item.duration | toInt }}小时{{item.duration * 60 % 60 | toInt}}分钟</td>
                        <td>
                            <a class="btn btn-link size-S radius"
                               href="javascript:;"
                               v-if="locationConfig.cat_map && locationConfig.officialcar_cat_map"
                               v-on:click="clickCheck(item)">查看路径</a>
                        </td>
                    </tr>
                </tbody>
                </div>
            </table>
            <div id="J-page" class="m-page"  v-show="!noData"></div>
            <div class="m-loading" v-if="!noData && itemsLoading">
                <div class="cube1"></div>
                <div class="cube2"></div>
            </div>
        
        <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
    </div>
    </section>
</template>

<style lang="less">
</style>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import moment from "moment";
    import drivermap from "../components/driverMap.vue";
    let rideDetailReportOps = null;

    export default{
        ready () {
            let that = this;
            rideDetailReportOps = {
                param:{
                    search:'',
                    start_date:'',
                    end_date:''
                },
                page:1,
                page_size:10
            };

            this.startDateInput = localStorage['startDate'];
            this.endDateInput = localStorage['endDate'];

            new Kalendae.Input('J-end-date', {
                format:'YYYY-MM-DD',
                months: 2,
            });
            new Kalendae.Input('J-start-date', {
                format:'YYYY-MM-DD',
                months: 2,
            });

            //获取订单状态
            $.ajax({
                url: base.gAjaxUrl.orderStatus,
                type: 'GET',
            })
            .always((data)=>{
                this.orderStatusItems = data;
            })

            //获取审批状态
            $.ajax({
                url: base.gAjaxUrl.approvalStatus,
                type: 'GET',
            })
            .always((data)=>{
                this.approvalStatusItems = data;
            })

            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-page',tpageToal,count)
            });   

            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-page',tpageToal, count)
            });

            this.getLocationConfig();
        },
        data:function(){
            return {
                isShowDialog:false,
                dialogTitle:'查看路径',
                dialogData:'',
                itemsLoading:true,
                items: [],
                noData:false,
                searchInput:'',
                startDateInput:'2016-08-01',
                endDateInput:'2016-09-01',
                tempItems:JSON.parse(localStorage['tempData']),
                approvalStatusSelected:'',
                approvalStatusItems:[],
                orderStatusSelected:'',
                orderStatusItems:[],
                carpoolInput:'',
                urgentInput:'',

                locationConfig: {} // 轨迹
            }
        },
        filters:{
            toInt: function(e){
                return parseInt(e);
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
                    current:1,
                    count:count,
                    callback:(p)=>{
                        rideDetailReportOps.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax:function(callback=function(){}){
                
                this.itemsLoading = true;
                //修改参数
                rideDetailReportOps.param.search = this.searchInput;
                rideDetailReportOps.param.start_date = this.startDateInput;
                rideDetailReportOps.param.end_date = this.endDateInput;
                rideDetailReportOps.param.approval_status = this.approvalStatusSelected;
                rideDetailReportOps.param.order_status = this.orderStatusSelected;

                this.carpoolInput? rideDetailReportOps.param.is_carpool = true: delete rideDetailReportOps.param.is_carpool;
                this.urgentInput? rideDetailReportOps.param.is_urgent = true: delete rideDetailReportOps.param.is_urgent;  

                $.ajax({ 
                    url: `${base.gAjaxUrl.officialcarstaffs}${this.tempItems.id}/order_detail_report/?page=${rideDetailReportOps.page}&page_size=${rideDetailReportOps.page_size}`,
                    contentType: 'application/json',
                    type: 'POST',
                    data:JSON.stringify(rideDetailReportOps.param)
                })
                .always((data)=>{
                    this.itemsLoading = false;
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
                rideDetailReportOps.page = 1
                }
                this.queryAjax((tpageToal='4')=>{
                    // this.initPage('#J-page',tpageToal)
//                     this.initPage('#J-page',tpageToal,rideDetailReportOps.page)
                });
            },
            //返回
            clickgoBack:function(){
                //重置第一页
                rideDetailReportOps.page = 1;
                this.queryAjax((tpageToal='4',count="0")=>{
                    this.initPage('#J-page',tpageToal,rideDetailReportOps.page,count)
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
            isUrgent:function(data){
                if(data){ 
                    return '<span class="red">是</span>';
                }else{
                    return  '否';
                }
            }
        },
        components:{
            drivermap
        }
    }
</script>
