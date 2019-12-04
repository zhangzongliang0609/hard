<template>
    <selected :type="dialogType" v-if="isShowSelectDialog" :data="busItem" :selected="busesSelected" v-on:dialog-close="selectDialogClose" v-on:dialog-save="selectDialogSave"></selected>
    <section class="Hui-article-box" v-show="!showRideDetail">
        <div class="page-container">
        <div class="text-l">
            关键字：
            <input id="searchInput" type="text" class="input-text Wdate mr-5" style="width:150px;" placeholder="姓名/工号/电话/职位">
            部门：
            <span class="select-box inline mr-5">
                <select id="departmentSelected" v-model="departmentSelected" name="" class="select">
                    <option value="">全部</option>
                    <option v-bind:value="item.id" v-for="item in departmentItem">{{item.department_tree}}</option>
                </select>
            </span>

            <button id="selectBus" type="button" class="btn btn-success radius" v-on:click="selectBus()">班次选择</button>
            开始日期：
            <input  v-model="startDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-start-outer-date" v-bind:value="startDateInput">
            结束日期：
            <input v-model="endDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-end-outer-date" v-bind:value="endDateInput">
            <button id="getList" type="submit" class="btn btn-success radius" v-on:click="getList(1)"><i  class="Hui-iconfont">&#xe665;</i></button>
            <button  id="exportData" class="btn btn-primary radius f-r" v-on:click="exportData()">导出数据</button>
        </div>
        <table class="table table-border table-bordered table-hover table-bg mt-20" >
            <thead>
                <tr class="text-c">
                    <th>姓名/性别</th>
                    <th>部门/职位</th>
                    <th>电话</th>
                    <th>工号</th>
                    <th>搭乘次数</th>
                    <th>未搭乘次数</th>
                    <th id="check" width="70">查看</th>
                </tr>
            </thead>
            <div class="result" v-if="!noData">
            <tbody>
                <tr class="text-c" v-for="item in items">
                    <td>{{item.real_name}}/{{item.sex==1? '男': '女';}}</td>
                    <td>{{item.department_vo.department_name}}/{{item.position}}</td>
                    <td>{{item.phone}}</td>
                    <td>{{item.job_number}}</td>
                    <td>{{item.order_ride_cnt}}</td>
                    <td>{{item.order_unride_cnt}}</td>
                    <td>
                        <a v-if="item.order_ride_cnt || item.order_unride_cnt" class="btn btn-link size-S radius" href="javascript:;" v-on:click="showDetail(item)">搭乘详细</a>
                        <a v-else href="javascript:;">-</a>
                    </td>
                </tr>
            </tbody>
            </div>
        </table>
        <div id="J-inner-page" class="m-page" v-show="!noData"></div>
        <div class="m-loading" v-if="itemsLoading">
            <div class="cube1"></div>
            <div class="cube2"></div>
        </div>
        <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
    </div>
    </section>
</template>

<style lang="less">
#check {
    top: 0;
}
#exportData {
    top: 0;
}
</style>

<script>
    import * as base from '../assets/js/base.js';
    import add from "../components/addDepartments.vue";
    import moment from "moment";
    import selected from "../components/selectBus.vue";
    let rideReportOps = null;
    let vm;

    export default{
        ready () {
            this.init();
            vm = this;
            rideReportOps = {
                param:{
                    search:'',
                    start_date:'',
                    end_date:'',
                    department:'',
                    shuttlebus: ''
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
                page_size:100
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
                this.initPage('#J-inner-page',tpageToal,rideReportOps.page,count)
            });

            //获取巴士列表
            $.ajax({
                url: base.gAjaxUrl.shuttlebuses2,
                type: 'GET',
                data:pageParams
            })
            .always((data)=>{
                this.busItem = data.results;

            })

            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-inner-page',tpageToal,rideReportOps.page,count)
            });

            // downloadXls+"&start_date="+startDateInput+"&end_date="+endDateInput

        },
        data:function(){
            return {
                isShowSelectDialog:false,
                itemsLoading:true,
                items: [],
                noData:false,
                searchInput:'',
                startDateInput:'2016-08-01',
                endDateInput:'2016-09-01',
                departmentSelected:'',
                busSelected:'',
                busesSelected:[],
                departmentItem:[],
                busItem:[],
                busesSelectedNames:[],
                downloadXls:`${base.gAjaxUrl.staffs}create_ride_report_file/`
            }
        },
        methods: {
            init: function(){

                //判断是否是第一次进入该新功能或页面从而弹出新功能的提示
                if(localStorage.rideReportPromptFlag == 'true'){
                    let arrObj = [$('#searchInput'),$('#departmentSelected'),$('#selectBus'),$('#J-start-outer-date'),$('#J-end-outer-date'),$('#getList'),];
                    /*$('check'),$('exportData'),*/
                    let arrTitle = ['内容过多时可以搜索您想要的内容哦','可以选择不同的部门哦','可以选择不同的班次哦','可以选择开始的时间哦','可以选择结束的时间哦','点击这里可以搜索出想要的订单哦，就可以点击导出按钮导出数据了',];
                    /*'点击这里可以查看到搭乘详情哦','点击这里可以导出想要的订单详情哦',*/
                    var promptTypes = ['rideReportPromptFlag',];
                    $.guidance({
                        obj:arrObj,
                        title:arrTitle,
                        flag:promptTypes,
                    });
                }
            },
            exportUrl:function(){
                return `${this.downloadXls}&start_date=${this.startDateInput}&end_date=${this.endDateInput}&search=${this.searchInput}&department=${this.departmentSelected}`;
            },
            exportData: function () {
                rideReportOps.param.search = this.searchInput;
                rideReportOps.param.start_date = this.startDateInput;
                rideReportOps.param.end_date = this.endDateInput;
                rideReportOps.param.department = this.departmentSelected;
                // rideReportOps.param.shuttlebus = this.busSelected;
                rideReportOps.param.shuttlebuses = this.busesSelected;
                rideReportOps.param.authorization = `${localStorage['token']}`;
                $.ajax({
                    url: `${this.downloadXls}`,
                    contentType: 'application/json',
                    type: 'POST',
                    data: JSON.stringify(rideReportOps.param)
                })
                .always((data)=>{
                    this.$route.router.go({path: '/job'})
                })
            },
            selectDialogClose:function(data){
                this.isShowSelectDialog = false;
            },
            selectDialogSave:function(data){
                this.busesSelected = data;
                this.isShowSelectDialog = false;
                this.getList();
            },
            inArray:function(item, array){
                let in_array = false;
                let index;
                for(index in array){
                    if(item==array[index]){
                        in_array = true;
                        break;
                    }
                }
                return in_array;
            },
            //初始化分页
            initPage:function(obj,tpageToal='4',current='1',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:current,
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
                // rideReportOps.param.shuttlebus = this.busSelected;
                rideReportOps.param.shuttlebuses = this.busesSelected;


                $.ajax({
                    url: `${base.gAjaxUrl.rideReport}?page=${rideReportOps.page}&page_size=${rideReportOps.page_size}`,
                    contentType: 'application/json',
                    type: 'POST',
                    data:JSON.stringify(rideReportOps.param)
                })
                .always((data)=>{
                    base.ajaxCallback(data,()=>{
                        let resultData = data.results;
                        this.itemsLoading = false;
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
                let that = this;
                //重置第一页
                if(reset){
                    this.searchInput = $("#searchInput").val();
                    rideReportOps.page = 1
                }

                this.queryAjax((tpageToal='4',count='0')=>{
                    that.initPage('#J-inner-page',tpageToal,rideReportOps.page,count)
                });
            },
            showDetail:function(data){
                localStorage.employeeInfo = JSON.stringify(data);
                localStorage.startDate = this.startDateInput;
                localStorage.endDate = this.endDateInput;
                this.showRideDetail = true;
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
            },
            selectBus: function(){
                this.isShowSelectDialog = true;
            }
        },
        components:{
            selected,
            ridedetail
        }
    }
</script>
