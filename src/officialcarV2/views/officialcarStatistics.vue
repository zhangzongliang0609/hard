<template>
    <vehdetail v-if="showRideDetail" :data="currentData" :start="startDateInput" :end="endDateInput" v-on:detail-close="detailClose"></vehdetail>
    <section v-show="!showRideDetail" class="Hui-article-box">
        <div class="page-container">
            <div class="panel panel-default radius">
                <div class="panel-body">
                    <span class="f-20 fw-b">车辆统计</span>
                </div>
            </div>
            <div class="bk-gray radius mt-10 bgc-fff">

                <div class="pd-15 clearfix">
                    关键字：
                    <input type="text" class="input-text Wdate mr-5" style="width:150px;" placeholder="车牌" id="searchInput">
                    开始日期：
                    <input v-model="startDateInput" type="text" autocomplete="off" class="input-text Wdate mr-5" style="width:120px;" id="J-start-outer-date" v-bind:value="startDateInput">
                    结束日期：
                    <input v-model="endDateInput" type="text" autocomplete="off" class="input-text Wdate mr-5" style="width:120px;" id="J-end-outer-date" v-bind:value="endDateInput">
                    <button  class="btn btn-success radius" v-on:click="getList(1)"><i class="Hui-iconfont">&#xe665;</i></button>
                    <button id="exportData" class="btn btn-primary radius f-r" v-on:click="exportData()">导出数据</button>
                </div>

                <table class="table table-border table-bordered table-hover table-bg" >
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
                            <td v-if="is_GC()">{{item.mileage / 1000}}公里</td>
                            <td v-if="is_GC()">{{item.order_mileage / 1000}}公里</td>
                            <td>{{item.order_duration | toInt }}小时{{item.order_duration % 60}}分钟</td>
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
        </div>
    </section>
</template>

<style lang="less">
</style>

<script type="text/ecmascript-6">
    import * as base from '../../assets/js/base.js';
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
                    page:1,
                    page_size:10,
                },

            };
            this.startDateInput = moment().add('-1','months').format('YYYY-MM-DD');
            this.endDateInput = moment().format('YYYY-MM-DD');

            new Kalendae.Input('J-end-outer-date', {
                months: 2,
                clickHide: true,
            });
            new Kalendae.Input('J-start-outer-date', {
                months: 2,
                clickHide: true,
            });

            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-inner-page',tpageToal,count)
            });

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
                return parseInt(e / 60);
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
                    url: `${base.gAjaxUrl.officialcarFile_V2}order_report_export/`,
                    type:'GET',
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
                        rideReportOps.param.page = p;
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
                $.ajax({
                    url:base.gAjaxUrl.officialcarStatistics_V2,
                    type: 'GET',
                    data:rideReportOps.param,
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
                    rideReportOps.param.page = 1
                }

                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-inner-page',tpageToal,count)
                });
            },
            detailShow:function(data){
                this.currentData = data;
                this.showRideDetail = true;
            },
            detailClose: function () {
                this.showRideDetail = false;
            },
        },
        components:{
            vehdetail
        }
    }
</script>
