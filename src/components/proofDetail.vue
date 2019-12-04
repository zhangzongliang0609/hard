<template>
    <detail v-if="showDetail" @dialog-close="closeDialog" :data="itemData"></detail>
    <path v-if="isShowPath" v-on:dialog-close="closeDialog" :data="itemData"></path>
    <cost v-if="showCostSet" @dialog-close="closeDialog" :order="itemData"></cost>
    <section class="Hui-article-box">
        <div class="page-container bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body clearfix">
                    <a class="btn btn-secondary radius f-l mr-20"  href="javascript:;" v-on:click="back">返回</a>
                    <span class="f-l mt-5 mr-10">姓名/性别 : {{orderData.staff_vo.real_name}}/{{orderData.staff_vo.sex == 1?'男':'女'}}</span>
                    <span class="f-l mt-5 mr-10">部门/职位 : {{orderData.staff_vo.department_name}}/{{orderData.staff_vo.position?orderData.staff_vo.position:'--'}}</span>
                    <span class="f-l mt-5 mr-10">工号 : {{orderData.staff_vo.job_number}}</span>
                    <span class="f-l mt-5 mr-10">电话 : {{orderData.staff_vo.phone}}</span>
                    <span class="f-l mt-5 mr-10">开凭证时间 : {{orderData.open_time}}</span>
                    <span class="f-l mt-5 mr-10">总金额 : {{orderData.money}}</span>
                </div>
            </div>
            <div class="mt-10 bgc-fff clearfix">

                <div class="pd-10 clearfix">
                    <div class="inline-block ml-10 v-m">
                        订单状态：
                        <span class="select-box inline mr-5">
                            <select id="approvalStatusSelected" v-model="orderStatus" class="select" >
                                <option value="">全部</option>
                                <option value="40">已开凭证</option>
                                <option value="50">修改凭证</option>
                                <!--<option value="-10">已取消</option>-->
                            </select>
                        </span>
                    </div>
                    <div class=" mt-5 inline-block ml-10 v-m">
                        <div class="inline-block">
                            开始日期：
                            <input  v-model="startDateInput" type="text" class="input-text Wdate mr-5 " style="width:120px;" id="J-start-outer-date" >
                        </div>
                        <div class="inline-block">
                            结束日期：
                            <input v-model="endDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-end-outer-date"  >
                        </div>

                    </div>
                    <div class="inline-block relative ml-10 clearfix v-m">
                        <!--<select id="selectFilter" v-model="searchType" class="select f-l" >-->
                            <!--<option value="real_name">姓名</option>-->
                            <!--<option value="car_no">车牌</option>-->
                            <!--<option value="phone">手机号</option>-->
                            <!--<option value="job_number">工号</option>-->
                        <!--</select>-->
                        <input type="text" v-model="searchContent" class="input-text Wdate f-l" style="width:150px;" placeholder="请输入车牌" id="searchInput"><button type="submit" class="btn btn-success radius-r f-l" v-on:click="getList()"><i class="Hui-iconfont">&#xe665;</i></button>
                    </div>

                </div>

                <div class="materials bk-gray radius bgc-fff">
                    <table class="waterElectricityForm table table-border table-bg table-striped bor-l bor-r">
                        <thead class="text-c">
                        <tr>
                            <!--<th width="80">司机/性别</th>-->
                            <!--<th width="120">部门/职位</th>-->
                            <!--<th width="80">工号</th>-->
                            <!--<th width="80">电话</th>-->
                            <th width="80">驾驶车辆</th>
                            <th width="80">起始地/目的地</th>
                            <th width="120">开始时间</th>
                            <th width="120">结束时间</th>
                            <th width="80">行驶里程(KM)</th>
                            <th width="80">总金额</th>
                            <th width="200">备注</th>
                            <th width="60">状态</th>
                            <th width="100">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr class="text-c" v-for="data in items">
                            <!--<td>{{data.staff_vo.real_name}}/{{data.staff_vo.sex == 1?'男':'女'}}</td>-->
                            <!--<td>{{data.staff_vo.department_name}}/{{data.staff_vo.position?data.staff_vo.position:'&#45;&#45;'}}</td>-->
                            <!--<td>{{data.staff_vo.job_number}}</td>-->
                            <!--<td>{{data.staff_vo.phone}}</td>-->
                            <td>{{data.car_no}}</td>
                            <td class="max-200">{{data.source_name}}/{{data.destination_name}}</td>
                            <td>{{data.ride_time}}</td>
                            <td>{{data.end_time}}</td>
                            <td>{{data.order_mileage | translateKm}}</td>
                            <td>{{data.money}}</td>
                            <td class="max-200">{{data.remark || '--'}}</td>
                            <td>
                                {{data.order_status | orderFilter}}
                            </td>
                            <td>
                                <a  class="btn btn-link radius" href="javascript:;" v-on:click="showDialogComponent('showDetail',data)">查看详情</a>
                                <a  v-if="data.order_status == 30 || data.order_status == 50" class="btn btn-link radius" href="javascript:;" v-on:click="showDialogComponent('showCostSet',data)">费用设置</a>
                                <a  v-if="data.order_status >= 30" class="btn btn-link radius" title="导出数据" href="javascript:;" v-on:click="showDialogComponent('isShowPath',data)">查看路径</a>
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
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>

</template>
<style lang="less" rel="stylesheet/less" scoped>
    #selectFilter{
        width: 70px;
        height: 31px;
        position: absolute;
    }
    .td-hide{
        max-width: 100px;
    }

</style>
<script type="text/ecmascript-6">

    import * as base from '../assets/js/base.js';
    import moment from "moment";
    import path from "components/privateCarPathMap.vue"
    import detail from "components/travelOrderDetail.vue"
    import cost from "components/setPrivateCost.vue"
    let pageOps = null;
    export default{
        ready(){
            pageOps = {
                params: {
                    page:1,
                    page_size:10,
                }
            };
            this.startDateInput = moment().add(-1, "months").format('YYYY-MM-DD');
            this.endDateInput = moment().format('YYYY-MM-DD');

            new Kalendae.Input('J-start-outer-date', {
                months: 2,
                clickHide:true
            });
            new Kalendae.Input('J-end-outer-date', {
                months: 2,
                clickHide:true
            });

            this.orderData = this.data;
            this.getList();

        },
        props:["data"],
        data:function () {
            return{
                items:[],
                noData:false,
                orderData:{
                    staff_vo:{},
                },
                searchType:'real_name',
                searchContent:'',
                itemsLoading:'',
                orderStatus:'',
                startDateInput:'',
                endDateInput:'',
                itemData: null,
                isShowPath: false,
                showDetail:false,
                showCostSet:false,
                tagUrl:`${base.gAjaxUrl.officialCarFeeTypes}`, // 费用类型url
                showSetTag:false,
                addContent:"私家车费用类型",
                tagTitle:"费用类型管理",
            }
        },
        methods:{
            back:function(){
                this.$dispatch("close")
                // this.$route.router.go({path: '/proofManage', replace: true});
            },
            showDialogComponent : function (key,item) {
                this[key] = true;
                if(item){
                    this.itemData = item;
                }
            },
            closeDialog: function () {
                this.isShowPath = false;
                this.showSetTag = false;
                this.showDetail = false;
                this.showCostSet = false;
                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-page',tpageToal,pageOps.params.page,count)
                });
            },
            getList:function () {
                pageOps.params.page = 1;
                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-page',tpageToal,pageOps.params.page,count)
                });
            },
            queryAjax:function(callback=function(){}){
                if(moment(this.endDateInput).isBefore(this.startDateInput)){

                    layer.msg("开始时间不能大于结束时间",{icon:2,time:2000});
                    return
                }
                //修改参数
                this.itemsLoading = true;
                let that = this;
                let ajaxData = {
                    page: pageOps.params.page,
                    page_size: pageOps.params.page_size,
                    order_status:this.orderStatus,
                    start_date:this.startDateInput,
                    end_date:this.endDateInput,
                    vourcher:this.orderData.id,
                    car_no:this.searchContent,
                };
                // ajaxData[this.searchType] = this.searchContent;
                $.ajax({
                    url: `${base.gAjaxUrl.privateCarOrders}`,
                    type: 'GET',
                    data:ajaxData
                }).always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
                        let resultData = data.results;
                        this.items = resultData;
                        if(resultData && resultData.length){
                            this.noData = false;
                            //回调
                            callback(data.num_pages,data.count);
                        }else{
                            this.noData = true;
                        }
                    });
                })
            },
            initPage:function(obj,tpageToal='4',current='1',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:current,
                    count:count,
                    callback:(p)=>{
                        pageOps.params.page = p;
                        this.queryAjax();
                    }
                });
            },
            exportData: function () {
                let that = this;
                let ajaxData = {
                    order_status:this.orderStatus,
                    start_date:this.startDateInput,
                    end_date:this.endDateInput,
                };
                ajaxData[this.searchType] = this.searchContent;

                $.ajax({
                    url: `${base.gAjaxUrl.privateCarOrders}export/`,
                    type:'GET',
                    contentType: "application/json;charset=utf-8",
                    data:ajaxData,
                }).always((data)=>{
                    this.$route.router.go({path: '/job'});
                    // layer.msg('最新的一条数据请重新刷新哦',{icon:1,time:3000});
                })
            },
        },
        filters:{
            translateKm:function(value){
                return value > 0 ? (value / 1000 ).toFixed(2) : 0;
            },
            orderFilter:function(status){
                /*
                *
                    -10	|	默认值	|	已取消
                    10	|	等待开始
                    20	|	行程中
                    30	|	已完成
                    40	|	已开凭证
                    50	|	修改凭证
                * */
                switch (status) {
                    case 10:{
                        return "等待开始"
                    }
                    case 20:{
                        return "行程中"
                    }
                    case 30:{
                        return "已完成"
                    }
                    case 40:{
                        return "已开凭证"
                    }
                    case 50:{
                        return "修改凭证"
                    }
                }
            }
        },
        events:{},
        components:{
            path,
            detail,
            cost,
        },
    }
</script>
