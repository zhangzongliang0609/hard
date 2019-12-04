<template>
    <vehdetail v-if="showRideDetail" v-on:detail-close="detailClose"></vehdetail>
    <section v-show="!showRideDetail" class="Hui-article-box">
    <div class="page-container">
        <div class="text-l"> 
            关键字：
            <input type="text" class="input-text Wdate mr-5" style="width:150px;" placeholder="车牌" id="searchInput">
            开始日期：
            <input v-model="startDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-start-outer-date" v-bind:value="startDateInput">
            结束日期：
            <input v-model="endDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-end-outer-date" v-bind:value="endDateInput">
            <button  class="btn btn-success radius" v-on:click="getList(1)"><i class="Hui-iconfont">&#xe665;</i></button>
            <button id="exportData" class="btn btn-primary radius f-r" v-on:click="exportData()">导出数据</button>
        </div>
        <table class="table table-border table-bordered table-hover table-bg mt-20" >
            <thead>
                <tr class="text-c">
                    <th>车牌</th>
                    <th>品牌</th>
                    <th>型号</th>
                    <th>座位数</th>
                    <th v-if="is_GC()">总行驶里程(千米)</th>
                    <th v-if="is_GC()">订单行驶里程(千米)</th>
                    <th>总行驶时长</th>
                    <th width="70">查看</th>
                </tr>
            </thead>
            <div class="result" v-if="!noData && !itemsLoading">
            <tbody>
                <tr class="text-c" v-for="item in items">
                    <td>{{item.car_no}}</td>
                    <td>{{item.car_brand}}</td>
                    <td>{{item.car_model}}</td>
                    <td>{{item.seats}}</td>
                    <td v-if="is_GC()">{{item.mileage_cnt}}</td>
                    <td v-if="is_GC()">{{item.order_mileage_cnt}}</td>
                    <td>{{item.duration / 60 | toInt }}小时{{item.duration % 60}}分钟</td>
                    <td>
                        <a class="btn btn-link size-S radius" href="javascript:;" v-on:click="detailShow(item)">订单详细</a>
                    </td>
                </tr>
            </tbody>
            </div>
        </table>
        <div id="J-inner-page" class="m-page" v-show="!itemsLoading && !noData"></div>
        <div class="m-loading" v-if="itemsLoading">
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
    import vehdetail from "../components/vehicleDetailReport.vue"

    let rideReportOps = null;

    export default{
        ready () {
            let that = this;
            rideReportOps = {
                param:{
                    search:'',
                    start_date:'',
                    end_date:'',
                    department:'',
                },
                page:1,
                page_size:10,
            };
            this.startDateInput = moment().add('-1','months').format('YYYY-MM-DD');
            this.endDateInput = moment().format('YYYY-MM-DD'); 

            new Kalendae.Input('J-end-outer-date', {
                months: 2,
            });
            new Kalendae.Input('J-start-outer-date', {
                months: 2,
            });

            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-inner-page',tpageToal,count)
            });       

            // downloadXls+"&start_date="+startDateInput+"&end_date="+endDateInput    

        },
        data:function(){
            return {
                itemsLoading:true,
                items: [],
                noData:false,
                searchInput:'',
                startDateInput:'2016-08-01',
                endDateInput:'2016-09-01',
                showRideDetail: false,
            }
        },
        filters:{
            toInt: function(e){
                return parseInt(e);
            }
        },
        methods: {
            is_GC: function(){
                if(localStorage.companyID=='c71a5bc1-ce3a-493b-8587-e645708ac285'){
                    return false;
                }else{
                    return true;
                }
            },
            exportData: function () {
                if(moment(this.endDateInput).isBefore(this.startDateInput)){
                    layer.msg("开始时间不能大于结束时间",{icon:2,time:1500});
                    return
                }
                let ajaxData = {
                    start_date:this.startDateInput,
                    end_date:this.endDateInput,
                    search:this.searchInput
                };
                return $.ajax({
                    url: `${base.gAjaxUrl.officialcarvehicles}export_order_report/`,
                    type:'post',
                    data:ajaxData
                })
                .always((data)=>{
                    this.$route.router.go({path: '/job'})
                })
            },
            //初始化分页   
            initPage:function(obj,tpageToal='4',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:1,
                    count:count,
                    callback:(p)=>{
                        rideReportOps.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax:function(callback=function(){}){
                this.itemsLoading = true;
                //修改参数
                rideReportOps.param.search = this.searchInput;
                rideReportOps.param.start_date = this.startDateInput;
                rideReportOps.param.end_date = this.endDateInput;
                rideReportOps.param.department = this.departmentSelected;

                $.ajax({
                    url: `${base.gAjaxUrl.officialcarvehicles}order_report/?page=${rideReportOps.page}&page_size=${rideReportOps.page_size}`,
                    contentType: 'application/json',
                    type: 'POST',
                    data:JSON.stringify(rideReportOps.param)
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
                if(reset){
                    this.searchInput= $("#searchInput").val();
                    rideReportOps.page = 1
                }

                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-inner-page',tpageToal,count)
                });
            },
            detailShow:function(data){
                localStorage.tempData = JSON.stringify(data);
                localStorage.startDate = this.startDateInput;
                localStorage.endDate = this.endDateInput;
                this.showRideDetail = true;
            },
            detailClose: function () {
                this.showRideDetail = false;
            },
            clickExport:function(){
                let ajaxData = {
                    start_date:this.startDateInput,
                    end_date:this.endDateInput
                }
                $.ajax({
                    url: `${base.gAjaxUrl.staffs}export_ride_report/`,
                    type:'get',
                    data:JSON.stringify(rideReportOps.param)
                })
                .always((data)=>{
                    var bb = new Blob([data.content], {type:'application/vnd.ms-excel'});
                    $('#link').attr({download:'a.xls',href:window.URL.createObjectURL(bb)})
                })   
            }
        },
        components:{
            vehdetail
        }
    }
</script>