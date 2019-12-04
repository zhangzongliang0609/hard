<template>
    <emdetail v-if="showRideDetail" v-on:detail-close="detailClose"></emdetail>
    <section class="Hui-article-box" v-show="!showRideDetail">
    <div class="page-container">
        <div class="text-l"> 
            关键字：
            <input type="text" class="input-text Wdate mr-5" style="width:150px;" placeholder="姓名/工号/电话/职位" id="searchInput">
            部门：
            <!--<span class="select-box inline mr-5">-->
                <!--<select id="departmentSelected" v-model="departmentSelected" name="" class="select">-->
                    <!--<option value="">全部</option>-->
                    <!--<option v-bind:value="item.id" v-for="item in departmentItem">{{item.department_name}}</option>-->
                <!--</select>-->
            <!--</span>-->
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
            开始日期：
            <input  v-model="startDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-start-outer-date" v-bind:value="startDateInput">
            结束日期：
            <input  v-model="endDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-end-outer-date" v-bind:value="endDateInput">
            <button id="getList" type="submit" class="btn btn-success radius" v-on:click="getList(1)"><i class="Hui-iconfont">&#xe665;</i></button>
            <button id="exportData" class="btn btn-primary radius f-r" v-on:click="exportData()">导出数据</button>
        </div>
        <table class="table table-border table-bordered table-hover table-bg mt-20" >
            <thead>
                <tr class="text-c">
                    <th>姓名</th>
                     <th>部门</th>
                    <th>职位</th>
                    <th>电话</th>
                    <th>工号</th>
                    <th v-if="is_GC()">用车里程(千米)</th>
                    <th>用车时长</th>
                    <th>下单数</th>
                    <th width="70">查看</th>
                </tr>
            </thead>
            <div class="result" v-if="!noData && !itemsLoading">
            <tbody>
                <tr class="text-c" v-for="item in items">
                    <td>{{item.real_name? item.real_name: '-';}}</td>
                    <td>{{item.department_vo? item.department_vo.department_name: '-';}}</td>
                    <td>{{item.position}}</td>
                    <td>{{item.phone}}</td>
                    <td>{{item.job_number}}</td>
                    <td v-if="is_GC()">{{item.order_mileage_cnt}}</td>
                    <td>{{item.duration / 60 | toInt }}小时{{item.duration % 60}}分钟</td>
                    <td>{{item.order_cnt}}</td>
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

<style lang="less" scoped>
    .departmentInput {
        width: 150px;
        display: inline-block;
    }
</style>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
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

//            this.queryAjax((tpageToal='4',count='0')=>{
//                this.initPage('#J-inner-page',tpageToal,rideReportOps.page,count)
//            });


        },
        data:function(){
            return {
                itemsLoading:true,
                items: [],
                noData:false,
                searchInput:'',
                startDateInput:'2016-08-01',
                endDateInput:'2016-09-01',
                departmentItem:[],
                departmentSelected:'',
                departmentSelectedName:'',
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
                    department:this.departmentSelected
                }
                return $.ajax({
                    url: `${base.gAjaxUrl.officialcarstaffs}export_order_report/`,
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
                rideReportOps.param.department = this.getDepartmentId(this.departmentSelectedName);

                $.ajax({
                    url: `${base.gAjaxUrl.officialcarstaffs}order_report/?page=${rideReportOps.page}&page_size=${rideReportOps.page_size}`,
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
                    rideReportOps.page = 1;
                    this.searchInput= $("#searchInput").val();
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