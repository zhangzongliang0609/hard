<template>
    <details v-if="isShowDetails" :data="currentItem" @dialog-close="closeDialog"></details>
    <section class="Hui-article-box">
        <div class="page-container bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body clearfix">
                    <a class="btn btn-secondary radius f-l mr-20" title="费用类型管理" href="javascript:;" v-on:click="callback()">返回</a>
                    <span class="f-20 fw-b f-l">姓名/性别：{{data.staff_vo.real_name}}/{{data.staff_vo.sex_label}}&nbsp;|&nbsp;部门/职位：{{data.staff_vo.department_name}}/{{data.staff_vo.postition}}&nbsp;|&nbsp;工号：{{data.staff_vo.job_number}}&nbsp;|&nbsp;工号：{{data.staff_vo.phone}}&nbsp;|&nbsp;补贴类型：{{data.subsidy_vo.type}}&nbsp;|&nbsp;补贴方式：{{data.subsidy_vo.mode}}</span>
                </div>
            </div>
            <div class="mt-10 bgc-fff clearfix">
                <div class="cl mt-10 mb-10 pt-10 pb-10">


                    <div class=" inline-block ml-10 f-l">
                        <div class="f-l lh-31">

                            开始日期：
                            <input  v-model="startDateInput" type="text" class="input-text Wdate mr-5 " style="width:120px;" id="M-start-outer-date" >
                        </div>
                        <div class="f-l lh-31">
                            结束日期：
                            <input v-model="endDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;" id="M-end-outer-date"  >
                        </div>

                    </div>

                    <div class="inline-block relative f-l filter-box ">
                        <select v-model="orderStatus" class="select f-l" >
                            <option :value="status.value" v-for="status in statusArr">{{status.label}}</option>
                        </select>
                        <input type="text" v-model="searchContent" class="input-text Wdate mr-5 f-l" placeholder="请输入搜索的车牌号" id="searchInput">
                    </div>


                    <button type="submit" class="btn btn-success radius f-l mt-2" v-on:click="getList()"><i class="Hui-iconfont">&#xe665;</i></button>


                    <a class="btn btn-secondary radius f-r mr-20" title="导出数据" href="javascript:;" v-on:click="exportData()">导出数据</a>
                </div>
                <div class="materials bk-gray radius bgc-fff">
                    <table class="waterElectricityForm table table-border table-bg table-striped bor-l bor-r">
                        <thead class="text-c">
                        <tr>
                            <th width="80">驾驶车辆</th>
                            <th width="120">起始地/目的地</th>
                            <th width="100">开始时间</th>
                            <th width="100">结束时间</th>
                            <th width="100">行程里程(KM)</th>
                            <th width="80">补贴单价</th>
                            <th width="100">补贴金额</th>
                            <th width="80">状态</th>
                            <th width="120">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr class="text-c" v-for="data in items">
                            <td>{{data.car_no || '--'}}</td>
                            <td>{{data.source_name}}/{{data.destination_name}}</td>
                            <td>
                                <span v-if="data.order_status > 10">{{data.ride_time || '--'}}</span>
                                <span v-else>--</span>
                            </td>
                            <td>{{data.end_time || '--'}}</td>
                            <td>{{data.order_mileage > 0 ? (data.order_mileage / 1000).toFixed(2) : 0}}</td>
                            <td>{{data.uprice || '--'}}</td>
                            <td>{{data.fee}}</td>
                            <td>{{data.order_status | filterOrder}}</td>
                            <td>
                                <a href="javascript:;" class="btn btn-primary radius" @click="showDetails(data)">查看订单</a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div id="J-page" class="m-page" v-show="!noData"></div>
                    <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
                </div>
            </div>
        </div>
    </section>

</template>
<style lang="less" rel="stylesheet/less" scoped>
    .mt-2{
        margin-top: 2px;
    }
    .td-hide{
        max-width: 100px;
    }
    .filter-box{
        margin-top: 2px;
        .select{
            width: 80px;
            height: 31px;

        }
        input{
            width: 200px;
            margin-left: -1px;
        }
    }

</style>
<script>
    import * as base from '../assets/js/base.js';
    import details from '../components/subsidyStatisticsDetails';
    import moment from "moment";

    let pageOps = null;
    export default{
        ready(){
            pageOps = {
                page: 1,
                page_size: 10
            }

            this.startDateInput = this.start;
            this.endDateInput = this.end;
            //
            new Kalendae.Input('M-start-outer-date', {
                months: 2,
                clickHide:true
            });
            new Kalendae.Input('M-end-outer-date', {
                months: 2,
                clickHide:true
            });
            this.getList();
        },
        props:['data','start','end'],
        data:function () {
            return{
                noData:false,
                startDateInput:"",
                endDateInput:"",
                searchContent:"",
                items:[],
                item:{},
                statusArr:[
                    {value:'',label:"全部"},
                    {value:50,label:"修改凭证"},
                    {value:40,label:"已开凭证"},
                ],
                orderStatus:'',
                isShowDetails:false,
                currentItem:"",
            }
        },
        methods:{
            initPage:function(obj,tpageToal='4',current='1',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:current,
                    count:count,
                    callback:(p)=>{
                        pageOps.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax:function(callback=function(){}){
                let that = this;
                $.showLoading();
                //修改参数
                $.ajax({
                    url: `${base.gAjaxUrl.subsidyStatistics}`,
                    type: 'GET',
                    data:{
                        subsidy:that.data.subsidy_id,
                        start_date:that.startDateInput,
                        end_date:that.endDateInput,
                        order_status:that.orderStatus,
                        car_no:that.searchContent,
                        staff:that.data.staff_id,
                        page: pageOps.page,
                        page_size: pageOps.page_size,
                    }
                }).always((data)=>{
                    $.hideLoading();
                    base.ajaxCallback(data,()=>{
                        let resultData = data.results;
                        this.items = resultData;
                        if(resultData && resultData.length){
                            this.noData = false;
                            //回调
                            callback(data.num_pages,data.count)
                        }else{
                            this.noData = true;
                        }
                    });
                })
            },
            getList:function () {
                if (moment(this.endDateInput).isBefore(this.startDateInput)) {
                    layer.msg("开始时间不能大于结束时间", {icon: 2, time: 1500});
                    return
                }
                pageOps.page = 1;
                this.queryAjax((tpageToal = '4', count = '0')=> {
                    this.initPage('#J-page', tpageToal, pageOps.page, count)
                });
            },

            exportBill:function () {

            },
            showDetails:function (item) {
                this.isShowDetails = true;
                this.currentItem = item;
            },
            closeDialog:function(){
                this.isShowDetails = false;
            },
            callback:function(){
                this.$dispatch("back")
            },
            exportData: function () {
                $.showLoading();

                let ajaxData = {
                    start_date:this.startDateInput,
                    end_date:this.endDateInput,
                    order_status:this.orderStatus,
                    car_no:this.searchContent,
                    staff:this.data.staff_id,
                    subsidy:this.data.subsidy_id
                }
                $.ajax({
                    url: `${base.gAjaxUrl.subsidyStatistics}export/`,
                    type:'GET',
                    data: ajaxData,
                }).always((data)=>{
                    $.hideLoading();
                    this.$route.router.go({path: '/job'});
                })
            }
        },
        filters:{
            filterOrder:function(status){
                switch (status) {
                    case 50:{
                        return "修改凭证"
                    }
                    case 40:{
                        return "已开凭证"
                    }
                }
            },
        },
        events:{
        },
        components:{
            details
        },
    }
</script>
