<template>
    <confirmvisit v-if="showConfirmVisit" :order="order" :type="type" :data="visitData"
                 :title="title" :rules="ruleData" @close="closeConfirmVisit" @dialog-save="getList"></confirmvisit>
    <detail v-if="isShowDetail" :rules="ruleData" :data="currentData" @dialog-close="closeDetail"></detail>
    <section class="Hui-article-box">
        <div class="page-container">
            <div class="panel panel-default radius">
                <div class="panel-body cl">
                    <span class="f-20 fw-b">访客来访记录</span>
                    <button class="btn btn-primary f-r radius" @click="exportData">导出访客数据</button>
                </div>

            </div>
            <div class="bk-gray radius mt-10 bgc-fff">
                <div class="pd-15 clearfix">
                    <span class=" f-l mr-10">

                        <div class="f-l ml-10 clearfix lh-30 mr-10">
                            <span class="f-l">
                                  访客状态：
                            </span>
                            <select v-model="orderStatus" class="status-select f-l" >
                                <option value="">全部</option>
                                <option value="10">审批中</option>
                                <option value="20">已审批</option>
                                <option value="30">已到访</option>
                                <option value="40">已离开</option>
                                <option value="-10">已驳回</option>
                            </select>
                        </div>


                        <select v-model="searchType" class="select f-l" style="width:100px;height:31px;margin-right: -1px;">
                            <option value="visitor_name">访客名称</option>
                            <option value="vistor_phone">访客电话</option>
                            <option value="vistor_company">访客单位</option>
                            <option value="staff_name">被访人名称</option>
                            <option value="staff_phone">被访人电话</option>
                        </select>
                        <input  v-model="searchContent" type="text"   style="width:250px" class="f-l input-text">

                       <div class="inline-block ml-10">
                            <div class="inline-block">
                                开始日期：
                                <input  v-model="startDateInput" type="text" class="input-text Wdate mr-5 " style="width:120px;" id="J-start-outer-date" >
                            </div>
                            <div class="inline-block">
                                结束日期：
                                <input v-model="endDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-end-outer-date"  >
                            </div>
                       </div>
                        <button v-on:click="getList(1)" class="btn btn-success" type="button"><i class="f-r Hui-iconfont">&#xe665;</i></button>
                    </span>
                </div>
                <table class="table table-border table-hover">
                    <thead class="text-c">
                    <tr>
                        <th class="pl-15">申请人名称</th>
                        <th>申请人电话</th>
                        <th>访客单位</th>
                        <th>拜访时间</th>
                        <th>来访事由</th>
                        <th>被访问姓名</th>
                        <th>被访人电话</th>
                        <th>状态</th>
                        <th>随身物品</th>
                        <th>备注</th>
                        <!--<th>到访时间</th>-->
                        <!--<th>离开时间</th>-->
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <template  v-for="(index,item) in items">
                        <tr class="text-c">
                            <td class="clearfix">
                                <span class="f-l">
                                </span>
                                <img :class="{'down-icon':currentItemId == item.id && isOpen}"   class="allow-icon f-l"  src="../assets/images/icon-unfold.png" alt="" @click="insertDiv(index,item,$event)">
                                <span>{{item.visitor_name}}</span>
                            </td>
                            <td>{{item.visitor_phone}}</td>
                            <td>
                                <div class="text-overflow">
                                    {{item.vistor_company}}
                                </div>
                            </td>
                            <td>{{item.visit_time}}</td>
                            <td>
                                <div class="text-overflow" style="max-width:300px;margin:0 auto;">
                                    {{item.visit_reason ?  item.visit_reason : "--"}}
                                </div>
                            </td>
                            <td>{{item.staff_name}}</td>
                            <td>{{item.staff_phone}}</td>
                            <td>{{item.status_name}}</td>
                            <td>
                                <div class="text-overflow" style="max-width: 200px; margin: 0 auto">
                                    {{item.personal_effects}}
                                </div>
                            </td>
                            <td>
                                <div class="text-overflow " style="max-width: 200px;margin: 0 auto">
                                    {{item.remark}}
                                </div>
                            </td>
                            <!--<td>{{item.retinue[0].arrive_time ? item.retinue[0].arrive_time.slice(0,16) : "&#45;&#45;"}}</td>-->
                            <!--<td>{{item.retinue[0].leave_time ? item.retinue[0].leave_time.slice(0,16) : "&#45;&#45;"}}</td>-->
                            <td>
                                <a v-if="item.status == 20" class="btn btn-secondary radius" v-on:click="confirmItem(item,1,item,'全部')">全部到访</a >
                                <a v-if="item.status == 30" class="btn btn-secondary radius" v-on:click="confirmItem(item,0,item,'全部')">全部离开</a >
                                <a class="btn btn-secondary radius mt-5" v-on:click="showDetail(item)">查看详情</a >

                                <!--<div>-->
                                    <!--<a v-if="item.status == 20 && item.retinue.length <= 1" class="btn btn-secondary radius" v-on:click="confirmItem(item,1)">确认到访</a >-->

                                    <!--<a v-if="item.status == 30 && item.retinue.length <= 1" class="btn btn-secondary radius" v-on:click="confirmItem(item,0)">确认离开</a >-->
                                <!--</div>-->
                                <!--<div class="mt-5">-->
                                <!--</div>-->
                            </td>
                        </tr>

                        <tr v-show="isOpen && currentItemId == item.id">
                            <td colspan="11">
                                <table>
                                    <thead class="text-c">
                                    <tr>
                                        <th class="pl-15">访客名称</th>
                                        <th>访客电话</th>
                                        <th>到访时间</th>
                                        <th>离开时间</th>
                                        <th v-if="ruleData.second_id_switch">身份证号码</th>
                                        <th v-if="ruleData.duty_staff_cardnumber">执勤人员(到达/离开)</th>
                                        <th v-if="ruleData.duty_staff_cardnumber">来访证编号</th>
                                        <th>操作</th>
                                    </tr>
                                    </thead>
                                    <tbody >
                                    <tr class="text-c" v-for="data in item.retinue">
                                        <td>{{data.visitor_name}}</td>
                                        <td>{{data.visitor_phone}}</td>
                                        <td>{{data.arrive_time ? data.arrive_time.slice(0,16) : "--"}}</td>
                                        <td>{{data.leave_time ? data.leave_time.slice(0,16) : "--"}}</td>
                                        <td v-if="ruleData.second_id_switch">{{data.visitor_idcard || '--'}}</td>
                                        <td v-if="ruleData.duty_staff_cardnumber">{{data.duty_staff_name}}/{{data.leave_duty_name}}</td>
                                        <td v-if="ruleData.duty_staff_cardnumber">{{data.duty_id}}</td>
                                        <td>
                                            <a v-if="!data.arrive_time && !data.leave_time && item.status > 10" class="btn btn-secondary radius" v-on:click="confirmItem(data,1,item)">确认到访</a>

                                            <a v-if="data.arrive_time && !data.leave_time" class="btn btn-secondary radius" v-on:click="confirmItem(data,0,item)">确认离开</a >
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </template>
                    </tbody>
                </table>
                <div id="J-page" class="m-page" v-show="!noData"></div>
                <div class="no-data text-c" v-if="noData">没有相关数据</div>
                <div class="m-loading" v-if="itemsLoading">
                    <div class="cube1"></div>
                    <div class="cube2"></div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
    import * as base from '../assets/js/base.js';
    import detail from '../components/showVisitRecordDetail'
    import confirmvisit from '../components/confirmVisit'
    import moment from "moment";
    let itemsOps = null;
    export default{
        ready(){
            itemsOps = {
                param:{
                    page:1,
                    page_size:10,
                }
            };
            new Kalendae.Input('J-start-outer-date', {
                months: 1,
                clickHide:true
            });
            new Kalendae.Input('J-end-outer-date', {
                months: 1,
                clickHide:true
            });
            this.getConfig();

            this.startDateInput = moment().add(-1, "months").format('YYYY-MM-DD');
            this.endDateInput = moment().format('YYYY-MM-DD');
            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-page',tpageToal,itemsOps.param.page,count)
            });

        },
        data: function(){
            return{
                noData:false,
                itemsLoading:false,
                items: [],
                searchType:'visitor_name',
                searchContent:'',
                startDateInput:"",
                endDateInput:"",
                orderStatus:"",
                currentIndex:"",
                isOpen:false,
                currentItemId:"",
                isShowDetail:false,
                currentData:"",
                showConfirmVisit:false,
                visitData:"",
                ruleData:{},
                order:{},
                title:'',
            }
        },
        methods: {
            //初始化分页
            initPage:function(obj,tpageToal='4',current='1',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:current,
                    count:count,
                    callback:(p)=>{
                        itemsOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            getList:function(reset=0){
                let that = this;
                if(moment(this.endDateInput).isBefore(this.startDateInput)){
                    layer.msg("开始时间不能大于结束时间",{icon:2,time:1500});
                    return
                }
                this.showConfirmVisit = false;
                //重置第一页
                if(reset){
                    this.searchInput = $("#searchInput").val();
                    itemsOps.param.page = 1
                }

                this.queryAjax((tpageToal='4',count='0')=>{
                    that.initPage('#J-page',tpageToal,itemsOps.param.page,count)
                });
            },
            queryAjax:function(callback=function(){}){
                //修改参数

                let data = {
                    page :itemsOps.param.page,
                    page_size: itemsOps.param.page_size,
                    start_date:this.startDateInput,
                    end_date:this.endDateInput,
                }
                this.itemsLoading = true;
                data[this.searchType] = this.searchContent;
                this.orderStatus ? data.status = this.orderStatus :'';
                // itemsOps.param[this.searchType] = this.searchContent;
                // this.orderStatus ? itemsOps.param.status = this.orderStatus : itemsOps.param.status = '';
                $.ajax({
                    url: base.gAjaxUrl.visitRecords,
                    type: 'GET',
                    data:data,
                }).always((data)=>{
                        base.ajaxCallback(data,()=>{
                            this.itemsLoading = false;
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
            getConfig:function(){
                $.showLoading();
                $.ajax({
                    url:base.gAjaxUrl.visitorconfig,
                    type:"GET",
                    data:{
                        module:"visitrecord",
                    }
                }).always((data)=>{
                    $.hideLoading();
                    base.ajaxCallback(data,()=>{
                        this.ruleData = data;
                    })
                })
            },
            insertDiv:function(i,data,e){
                this.currentItemId = data.id;
                this.currentIndex = i;
                if($(e.target).hasClass("down-icon")){
                    this.isOpen = false;
                    $(e.target).removeClass("down-icon");
                }else{
                    this.isOpen = true;
                    $(".allow-icon").removeClass("down-icon");
                    $(e.target).addClass("down-icon");
                }
            },
            confirmItem:function(data,type,order,title){
                this.title=title || '';
                this.type = type ? "arrive" : "leave";
                this.visitData  = data;
                this.order = order;
                this.showConfirmVisit = true;
            },
            showDetail:function(item){
                this.currentData = item;
                this.isShowDetail = true;
            },
            closeDetail:function(){
                this.isShowDetail = false;
            },
            closeConfirmVisit:function(){
                this.showConfirmVisit = false;
            },
            isShowVisiting:function(item){
                for (let data of item.retinue) {
                    if (data.extra && data.extra.visitrecord_duty_staff_cardnumber) {
                        return true;
                    }
                }
                return false;
            },
            exportData:function(){
                if(moment(this.endDateInput).isBefore(this.startDateInput)){
                    layer.msg("开始时间不能大于结束时间",{icon:2,time:1500});
                    return
                }
                let data = {
                    start_date:this.startDateInput,
                    end_date:this.endDateInput,
                }
                this.orderStatus ? data.status = this.orderStatus : '';
                $.ajax({
                    url: `${base.gAjaxUrl.visitRecords}export/`,
                    type: 'GET',
                    data: data
                }).always((data)=> {
                    base.ajaxCallback(data, () => {
                        this.$route.router.go({path: '/job'})
                    })
                })
            }
        },
        components: {
            detail:detail,
            confirmvisit:confirmvisit,
        },
        filters: {

        }
    }
</script>
<style lang="less" scoped>
    .bgc-f5{
        background-color: #f5f5f5;
    }
    .fw-b{
        font-weight: bold;
    }
    .btn.pd-4{
        padding: 4px;
    }
    .btn.fs-12{
        font-size: 12px;
    }
    .icon-sq{
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 3px;
        margin-right: 3px;
        margin-top: 10px;
    }
    .table th.pl-15,
    .table td.pl-15{
        padding-left: 15px;
    }
    .tableTags{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 10px;
        display: inline-block;
    }
    .no-data {
        line-height: 60px;
    }
    .status-select{
        height:31px;
        width:80px;
        font-size: 14px;
    }
    .allow-icon{
        transform: rotateZ(180deg);
        height:20px;
        cursor: pointer;
        transition:0.3s all;
    }
    .down-icon{
        transform: rotateZ(0deg);
    }
</style>
