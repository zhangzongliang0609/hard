<template>
    <!-- 添加 -->
    <detail :title="dialogTitle" :type="dialogType" :data="dialogData" v-if="isShowDetailDialog" v-on:dialog-close="detailDialogClose"></detail>
    <!-- 安排房间 -->
    <arrange :title="dialogTitle" :type="dialogType" :data="dialogData" v-if="isShowArrangeDialog" v-on:dialog-close="arrangeDialogClose" v-on:dialog-save="arrangeDialogSave"></arrange>

    <section class="Hui-article-box">
        <div class="page-container">
            <div class="panel panel-default radius">
                <div class="panel-body">
                    <span class="f-20 fw-b">订水订单管理</span>
                    <span class="f-20 fw-b f-r">
                        当前已申请订单数:<span class="ml-5 mr-5 fc-206afc">{{applyNum}}</span>
                        <!-- 共<span class="fc-296afc">25</span>桶 -->
                    </span>
                </div>
            </div>
            <div class="bk-gray radius mt-10 bgc-fff">
                <div class="pd-15 clearfix">
                    <span class="f-l lh-30">订单状态：</span>
                    <span class="select-box f-l mr-10 w-100">
                        <select v-model="selectApprovalStatus" class="select" @change="onSelectedStatus($event, item)">
                            <option value="" selected>全部</option>
                            <option value="1">已申请</option>
                            <option value="2">已配送</option>
                            <option value="3">已完成</option>
                            <option value="-1">已取消</option>
                        </select>
                    </span>
                    <span class="f-l lh-30">配送状态：</span>
                    <span class="select-box f-l mr-10 w-100">
                        <select v-model="selectIsDelivered" class="select" @change="onSelectedIsDelivered($event, item)">
                            <option value="" selected>全部</option>
                            <option value="0">待配送</option>
                            <option value="1">已配送</option>
                        </select>
                    </span>
                    <div class="text-l clearfix f-l mr-15">
                        <input id="searchInput" type="text"  placeholder="姓名/手机号" style="width:200px" class="f-l input-text">
                        <button v-on:click="getList(1)" class="btn btn-success" type="button"><i class="f-r Hui-iconfont">&#xe665;</i></button>
                    </div>
                    <div class="f-r lh-30 clearfix mt-10-1300">
                    <span class="f-l mr-5">导出数据日期：</span>
                    <span class="f-l mr-5">开始日期：</span>
                    <input  v-model="start_date" type="text" class="input-text Wdate mr-5 f-l" style="width:120px;" id="J-start-date" v-bind:value="start_date">
                    <span class="f-l mr-5">结束日期：</span>
                    <input  v-model="end_date" type="text" class="input-text Wdate mr-5 f-l" style="width:120px;" id="J-end-date" v-bind:value="end_date">
                    <button id="exportData" class="btn btn-primary radius f-l" v-on:click="exportData()">导出数据</button>
                    </div>
                </div>
                <table class="table table-border table-bg table-striped">
                    <thead class="text-c">
                        <tr>
                            <th class="pl-15">申请人</th>
                            <th>手机号</th>
                            <th>申请时间</th>
                            <th>配送时间</th>
                            <th>订单状态</th>
                            <th>地址</th>
                            <th>配送方式</th>
                            <th>数量</th>
                            <th class="">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="text-c" v-for="item in items">
                            <td class="relative pl-15"><span class="tableTags" v-bind:class="[item.status==1&&item.pick_type_vo.pick_type==2?'icon-sq-84beff':'']"></span>{{item.name}}</td>
                            <td>{{item.phone}}</td>
                            <td>{{item.ctime|times}}</td>
                            <td><span v-if="item.pick_type_vo.pick_type==2 && item.pick_time != null">{{item.pick_time|times}}</span><span v-else>--</span></td>
                            <td>{{item.status_name}}</td>
                            <td>{{item.location}}</td>
                            <td>{{item.pick_type_vo.type_name}}</td>
                            <td>{{item.number}}</td>
                            <td>
                                <a class="btn btn-primary radius mr-5 fs-12" title="取消订单" href="javascript:;" v-if="item.status==1" v-on:click="clickCancel(item)">取消订单</a>
                                <a class="btn btn-primary radius mr-5 fs-12" title="确认配送" href="javascript:;" v-if="item.status==1&&item.pick_type_vo.pick_type==2" v-on:click="clickConfirmDeliver(item)">确认配送</a>
                                <a class="btn btn-primary radius mr-5 fs-12" title="确认自提" href="javascript:;" v-if="item.status==1&&item.pick_type_vo.pick_type==1" v-on:click="clickConfirmFinish(item)">确认自提</a>
                                <a class="btn btn-primary radius mr-5 fs-12" title="订单详情" href="javascript:;" v-on:click="clickDetail(item)">订单详情</a>
                            </td>
                        </tr>
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
    .icon-sq-84beff{
        background-color: #84beff;
    }
    .icon-sq-fc1339{
        background-color: #fc1339;
    }
    .icon-sq-f6e12e{
        background-color: #f6e12e;
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
</style>
<script>
    import * as base from '../assets/js/base.js';
    import detail from '../components/waterorderDetail.vue';
    import moment from "moment";

    let itemsOps = null;

    export default{
        ready(){
            let that = this;

            itemsOps = {
                param:{
                    status: '',
                    is_delivered: '',
                    search:'',
                    page:1,
                    page_size:10,
                }
            };

            this.start_date = moment().add('-1','months').format('YYYY-MM-DD');
            this.end_date = moment().format('YYYY-MM-DD');

            new Kalendae.Input('J-end-date', {
                months: 2,
                clickHide: true
            });
            new Kalendae.Input('J-start-date', {
                months: 2,
                clickHide: true
            });

            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-page',tpageToal,itemsOps.param.page,count)
            });
            this.getApplyNum();
        },
        data: function(){
            return{
                noData:false,
                itemsLoading:false,
                isShowDetailDialog:false,
                items: [],
                applyNum: 0,
                selectIsDelivered: '',
                selectStatus: '',
                searchInput:'',
                dialogTitle:'',
                dialogType:'add',
                dialogData: {},
                start_date: "",
                end_date: "",
            }
        },
        methods: {
            detailDialogClose:function(data){
                this.isShowDetailDialog = false;
            },
            clickDetail:function(data){
                this.dialogTitle='订单详情';
                this.dialogData = data;
                this.isShowDetailDialog = true;
            },
            clickConfirmDeliver:function(item){
                let that = this;

                layer.confirm(
                    `确认${item.name}已缴费提水?`,
                    (index)=>{
                        $.ajax({
                            url: `${base.gAjaxUrl.waterorders}${item.id}/confirm_deliver/`,
                            type: 'POST',
                        })
                        .always((data)=>{
                            base.ajaxCallback(data,()=>{
                                layer.msg('提交成功',{icon:1,time:1000});
                                that.isShowDelete = false;
                                that.getList();
                            });
                        })
                    },
                    ()=>{
                        that.isShowModify = false;
                    }
                );
            },
            clickConfirmFinish:function(item){
                let that = this;

                layer.confirm(
                    `确认${item.name}的订水订单已配送?`,
                    (index)=>{
                        $.ajax({
                            url: `${base.gAjaxUrl.waterorders}${item.id}/confirm_finish/`,
                            type: 'POST',
                        })
                        .always((data)=>{
                            base.ajaxCallback(data,()=>{
                                layer.msg('提交成功',{icon:1,time:1000});
                                that.isShowDelete = false;
                                that.getList();
                            });
                        })
                    },
                    ()=>{
                        that.isShowModify = false;
                    }
                );
            },
            clickCancel:function(item){
                let that = this;

                layer.confirm(
                    `确认取消${item.name}的订水申请?`,
                    (index)=>{
                        $.ajax({
                            url: `${base.gAjaxUrl.waterorders}${item.id}/cancel/`,
                            type: 'POST',
                        })
                        .always((data)=>{
                            base.ajaxCallback(data,()=>{
                                layer.msg('提交成功',{icon:1,time:1000});
                                that.isShowDelete = false;
                                that.getList();
                            });
                        })
                    },
                    ()=>{
                        that.isShowModify = false;
                    }
                );
            },
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
            //获取长住申请单列表
            getList:function(reset=0){
                let that = this;
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
                this.itemsLoading = true;
                itemsOps.param.search = this.searchInput;
                itemsOps.param.status = this.selectStatus;
                itemsOps.param.is_delivered = this.selectIsDelivered;

                $.ajax({
                    url: base.gAjaxUrl.waterorders,
                    type: 'GET',
                    data:itemsOps.param
                })
                .always((data)=>{
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
            getApplyNum:function(){
                this.itemsLoading = true;
                $.ajax({
                    url: `${base.gAjaxUrl.waterorders}apply_num/`,
                    type: 'GET',
                })
                .always((data)=>{
                    base.ajaxCallback(data,()=>{
                        this.itemsLoading = false;
                        let resultData = data;
                        
                        this.applyNum = resultData.number;
                    });
                })
            },
            onSelectedIsDelivered:function(event,item){
                this.selectIsDelivered = event.target.value;
                this.getList(1);
            },
            onSelectedStatus:function(event,item){
                this.selectStatus = event.target.value;
                this.getList(1);
            },
            exportData: function () {
                let that = this;
                let para = {
                    start_date: that.start_date,
                    end_date: that.end_date,
                    status: that.selectApprovalStatus
                };
                console.log(para);
                return $.ajax({
                    url: `${base.gAjaxUrl.waterorders}export_all_order_report/`,
                    type:'POST',
                    data: para,
                    success: function (data) {
                                console.log("success")
                                console.log(data)
                        that.$route.router.go({path: '/job'});
                    },
                    error: function (data) {
                                console.log("error");
                                console.log(data)
                        layer.msg(data.responseJSON.detail[0],{icon:1,time:3000});
                    }
                })
            },
        },
        components: {
            detail,
        },
        filters: {
            times : function(times){
                return times.substring(0,times.indexOf(' '));
            }
        }
    }
</script>