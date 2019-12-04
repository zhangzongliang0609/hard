<template>
    <driverdetail v-if="showRideDetail" :start="startDateInput" :end="endDateInput" :data="currentData" v-on:detail-close="detailClose"></driverdetail>

    <section v-show="!showRideDetail" class="Hui-article-box">
        <div class="page-container">
            <div class="panel panel-default radius">
                <div class="panel-body">
                    <span class="f-20 fw-b">司机用车统计</span>
                </div>
            </div>
            <div class="bk-gray radius mt-10 bgc-fff">
                <div class="pd-10 clearfix">
                    <div class="text-l">
                        关键字：
                        <input type="text" class="input-text Wdate mr-5" style="width:150px;" placeholder="姓名/工号/电话" id="searchInput">
                        开始日期：
                        <input v-model="startDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-start-outer-date" v-bind:value="startDateInput">
                        结束日期：
                        <input v-model="endDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-end-outer-date" v-bind:value="endDateInput">
                        <button type="submit" class="btn btn-success radius" v-on:click="getList(1)"><i class="Hui-iconfont">&#xe665;</i></button>
                        <button v-if="is_AJ()" class="btn btn-primary radius f-r daochu" v-on:click="feedback()">导出上下班数据</button>
                        <!-- <button v-if="selectedId!='983c2895-1534-4d1d-8b1f-1cb492c74128'" class="btn btn-primary radius f-r" v-on:click="exportData()">导出数据</button> -->
                        <button  class="btn btn-primary radius f-r" v-on:click="exportData()">导出数据</button>
                    </div>
                </div>
                <table class="table table-border table-bordered table-hover table-bg" >
                    <thead>
                    <tr class="text-c">
                        <th>姓名/性别</th>
                        <!-- <th>部门/职位</th> -->
                        <th>职位</th>
                        <th>电话</th>
                        <th>工号</th>
                        <th v-if="is_GC()">总行驶里程(千米)</th>
                        <th v-if="is_GC()">订单行驶里程(千米)</th>
                        <th>行驶时长</th>
                        <th>订单数</th>
                        <th width="70">查看</th>
                    </tr>
                    </thead>
                    <div class="result" v-if="!noData && !itemsLoading">
                        <tbody>
                        <tr class="text-c" v-for="item in items">
                            <td>{{item.real_name}}/{{item.sex==1? '男': '女'}}</td>
                            <!-- <td>{{item.staff_vo.department_vo? item.staff_vo.department_vo.department_name: '-';}}/{{item.staff_vo.position}}</td> -->
                            <td>{{item.position}}</td>
                            <td>{{item.phone}}</td>
                            <td>{{item.job_number}}</td>
                            <td v-if="is_GC()">{{item.mileage_cnt}}</td>
                            <td v-if="is_GC()">{{item.order_mileage_cnt}}</td>
                            <td>{{item.durations | toInt }}小时{{item.durations % 60}}分钟</td>
                            <td>{{item.trip_cnt}}</td>
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
    .daochu{
        margin-left: 20px;
    }
</style>

<script type="text/ecmascript-6">
    import * as base from '../../assets/js/base.js';
    import moment from "moment";
    import driverdetail from "../components/driverDetailReport.vue";
    let rideReportOps = null;

    export default{
        ready () {
            console.log(this.selectedId);
            let that = this;
            rideReportOps = {
                param:{
                    search:'',
                    start_date:'',
                    end_date:'',
                    page:1,
                    page_size:10,
                },
            };
            this.startDateInput = moment().add('-1','months').format('YYYY-MM-DD');
            this.startDateInputSpecific = moment().add('-1','months').format('YYYY-MM-DD');
            this.endDateInput = moment().format('YYYY-MM-DD');
            this.endDateInputSpecific = moment().format('YYYY-MM-DD');

            new Kalendae.Input('J-end-outer-date', {
                months: 2,
            });

            new Kalendae.Input('J-start-outer-date', {
                months: 2,
            });

            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-inner-page',tpageToal,count)
            });
        },
        data:function(){
            return {
                selectedId: localStorage.companyID,
                // selectedId: 983c2895-1534-4d1d-8b1f-1cb492c74128,
                itemsLoading:true,
                items: [],
                noData:false,
                searchInput:'',
                startDateInput:'2016-08-01',
                endDateInput:'2016-09-01',
                departmentSelected:'',
                showRideDetail: false,
                currentData:{},
                downloadXls:`${base.gAjaxUrl.staffs}export_ride_report?authorization=${localStorage['token']}`
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
            is_AJ: function(){
                if(localStorage.companyID=='1fe0fb2d-07e8-4d09-a672-4fa8e11ba735'){
                    return true;
                }else{
                    return false;
                }
            },
            feedback:function(id) {
                var that = this
                // this.selectedOrder = id
                layer.open({
                    type: 1,
                    title: '请选择导出的时间或内容',
                    content: $('#feedback'),
                    area: ['450px', '120px'],
                    btn: ['确认导出'],
                    // btn: [''],
                    yes: function () {
                        layer.closeAll();
                        let ajaxData = {
                            start_date: that.startDateInputSpecific,
                            end_date: that.endDateInputSpecific,
                        }
                        return $.ajax({
                            url: `${base.gAjaxUrl.officialcardrivers}export_go_and_off_work_data/`,
                            type: 'post',
                            data: ajaxData
                        })
                            .always((data)=> {
                                that.$route.router.go({path: '/job'})
                            })
                    }
                },)
            },
            exportData: function () {
                if(moment(this.endDateInput).isBefore(this.startDateInput)){
                    layer.msg("开始时间不能大于结束时间",{icon:2,time:1500});
                    return
                }
                let ajaxData = {
                    start_date:this.startDateInput,
                    end_date:this.endDateInput,
                    search:this.searchInput,
                }
                return $.ajax({
                    url: `${base.gAjaxUrl.officialcarDriverList_V2}order_report_export/`,
                    type:'GET',
                    data:ajaxData
                }).always((data)=>{
                        this.$route.router.go({path: '/job'});
                    })
            },
            exportUrl:function(){
                return `${this.downloadXls}&start_date=${this.startDateInput}&end_date=${this.endDateInput}&search=${this.searchInput}&department=${this.departmentSelected}`;
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
                if(moment(this.endDateInput).isBefore(this.startDateInput)){
                    layer.msg("开始时间不能大于结束时间",{icon:2,time:1500});
                    return
                }
                this.itemsLoading = true;
                //修改参数
                rideReportOps.param.search = this.searchInput;
                rideReportOps.param.start_date = this.startDateInput;
                rideReportOps.param.end_date = this.endDateInput;

                $.ajax({
                    url: base.gAjaxUrl.officialcarDriverStatistics_V2,
                    type: 'GET',
                    data:rideReportOps.param
                }).always((data)=>{
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
                        this.itemsLoading = false;
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
                    rideReportOps.param.page = 1
                    this.searchInput = $("#searchInput").val();
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
            driverdetail
        }
    }

</script>
