<template>
    <emdetail  v-if="showRideDetail" :data="currentData" :start="startDateInput" :end="endDateInput" :type="timeType" v-on:detail-close="detailClose"></emdetail>
    <section class="Hui-article-box" v-show="!showRideDetail">
        <div class="page-container">
            <div class="panel panel-default radius">
                <div class="panel-body">
                    <span class="f-20 fw-b">员工用车统计</span>
                </div>
            </div>
            <div class="bk-gray radius mt-10 bgc-fff">
                <div class="pd-15 clearfix">
                    <div class="text-l">

                        <div class="f-l search-box" >
                            <select class="select-box fs-14" v-model="searchKey" >
                                <option value="real_name">姓名</option>
                                <option value="phone">手机</option>
                                <option value="job_number">工号</option>
                                <option value="position">职位</option>
                            </select>
                        </div>
                        <input type="text" class="input-text Wdate mr-5" style="width:150px;" placeholder="姓名/工号/电话/职位" id="searchInput">
                        部门：
                        <div class="departmentInput mr-5">
                            <div class="department_select_container" @mouseleave="departmentEnter(false)" @mouseenter="departmentEnter(true)">
                                <input v-if="departmentItem.length === 0" disabled type="text" class="input-text" value="无可选择部门">
                                <input v-else autocomplete="off" @click="departmentClick" v-model="departmentSelectedName" type="text" class="input-text" value="" placeholder="" name="department">
                                <i v-show="departmentSelectedName !== ''" class="empty-icon Hui-iconfont" @click="emptySearch()">&#xe60b;</i>
                                <div class="departmentListBox" style="display: none">
                                    <div v-bind:title="item.department_tree" v-for="item in departmentItem | filterBy departmentSelectedName in 'department_tree'" @click="setDepartmentValue(item)" class="departmentListItem">{{item.department_tree}}</div>
                                </div>
                            </div>
                        </div>
                        时间类型:
                        <select class="select-box mr-10" style="width:120px;" v-model="timeType">
                            <option value="admin_ride_time">上车时间</option>
                            <option value="get_off_time">结束时间</option>
                        </select>

                        开始日期：
                        <input  v-model="startDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-start-outer-date" v-bind:value="startDateInput">
                        结束日期：
                        <input  v-model="endDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-end-outer-date" v-bind:value="endDateInput">
                        <button id="getList" type="submit" class="btn btn-success radius" v-on:click="getList(1)"><i class="Hui-iconfont">&#xe665;</i></button>
                        <button id="exportData" class="btn btn-primary radius f-r" v-on:click="exportData()">导出数据</button>
                    </div>
                </div>
                <table class="table table-border table-bordered table-hover table-bg" >
                    <thead>
                    <tr class="text-c">
                        <th>姓名/性别</th>
                        <th>部门/职位</th>
                        <th>电话</th>
                        <th>工号</th>
                        <th v-if="is_GC()">用车里程(千米)</th>
                        <th>用车时长</th>
                        <th>下单数</th>
                        <th width="70">查看</th>
                    </tr>
                    </thead>
                    <div class="result" v-if="!noData">
                        <tbody>
                        <tr class="text-c" v-for="item in items">
                            <td>{{item.real_name}}/{{item.sex == 1 ? "男" : "女"}}</td>
                            <td>{{item.department_name}}/{{item.position}}</td>
                            <td>{{item.phone}}</td>
                            <td>{{item.job_number}}</td>
                            <td v-if="is_GC()">{{item.mileage / 1000}}</td>
                            <td>{{item.duration / 60 | toInt }}小时{{item.duration % 60}}分钟</td>
                            <td>{{item.order_cnt}}</td>
                            <td>
                                <a class="btn btn-link size-S radius" href="javascript:;" v-on:click="detailShow(item)">订单详细</a>
                            </td>
                        </tr>
                        </tbody>
                    </div>
                </table>
                <div id="J-inner-page" class="m-page" v-show="!noData"></div>
                <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
            </div>
        </div>
    </section>
</template>

<style lang="less" scoped rel="stylesheet/less">
    .departmentInput {
        width: 150px;
        display: inline-block;
    }
    .search-box{
        width: 80px;
        margin-right: -1px;
        select{
            height: 31px;
        }
    }
</style>

<script type="text/ecmascript-6">
    import * as base from '../../assets/js/base.js';
    import moment from "moment";
    import emdetail from "../components/employeeDetailReport.vue";
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
            });
            new Kalendae.Input('J-start-outer-date', {
                months: 2,
            });

            let pageParams = {
                page:1,
                page_size:999999
            }

            //获取部门列表
            $.ajax({
                url: base.gAjaxUrl.departments,
                type: 'GET',
                data:pageParams
            })
                .always((data)=>{
                    this.departmentItem = data || [];
                })

            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-inner-page',tpageToal ,count)
            });
        },
        data:function(){
            return {
                items: [{}],
                noData:false,
                searchInput:'',
                startDateInput:'2016-08-01',
                endDateInput:'2016-09-01',
                departmentItem:[],
                departmentSelected:'',
                departmentSelectedName:'',
                showRideDetail: false,
                currentData:{},
                timeType:"admin_ride_time",
                searchKey:"real_name",
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
                    key_date:this.timeType,
                    department:this.getDepartmentId(this.departmentSelectedName),
                }
                ajaxData[this.searchKey] = this.searchInput;

                return $.ajax({
                    url: `${base.gAjaxUrl.officialcarOrder_V2}order_report_export/`,
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
                $.showLoading();

                let data = {
                    start_date:this.startDateInput,
                    end_date:this.endDateInput,
                    key_date:this.timeType,
                    department:this.getDepartmentId(this.departmentSelectedName),
                    page:rideReportOps.param.page,
                    page_size:rideReportOps.param.page_size,
                }
                data[this.searchKey] = this.searchInput;

                $.ajax({
                    url:base.gAjaxUrl.officialcarStaffStatistics_V2,
                    type:'GET',
                    data:data
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
                if(reset){
                    rideReportOps.param.page = 1;
                    this.searchInput= $("#searchInput").val();
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
            departmentClick: function () {
                if(this.isDepartmentFocus) {
                    $(".departmentListBox").show();
                }
            },
            // 清除搜索输入框
            emptySearch:function(){
                this.departmentSelectedName = '';
                $(".departmentListBox").show();
            },
            departmentEnter: function (flag) {
                this.isDepartmentFocus = flag;
                !flag && $(".departmentListBox").hide();
            },
            setDepartmentValue: function (item) {
                this.departmentSelectedName = item.department_tree;
                this.departmentSelected = item.id;
                $(".departmentListBox").hide()
            },
            getDepartmentId: function (val) {
                var id = '';
                this.departmentItem.forEach(function (item) {
                    if(item.department_tree == val) {
                        id = item.id;
                    }
                });
                return id;
            }
        },
        components:{
            emdetail
        }
    }
</script>
