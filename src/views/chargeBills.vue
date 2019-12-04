<template>
    <!-- 添加计费单名称 -->
    <add :title="dialogTitle" :type="dialogType" :data="dialogData" v-if="isShowAddDialog" v-on:dialog-close="addDialogClose" v-on:dialog-save="addDialogSave"></add>

    <section class="Hui-article-box">
        <div class="page-container bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body clearfix">
                    <span class="f-20 fw-b f-l">费用计费单管理</span>
                    <input id="searchInput" class="ml-10 f-l input-text" type="text" placeholder="费用计费单名称" style="width:250px">
                    <button v-on:click="getList(1)" class="btn btn-success f-l radius-r" type="button"><i class="f-r Hui-iconfont"> &#xe665; </i></button>
                    <a class="btn btn-primary radius f-r mr-10" title="新增计费单" href="javascript:;" v-on:click="clickAdd()"><i class="Hui-iconfont">&#xe600;</i>新增计费单</a>
                </div>
            </div>
            <div class="mt-10 bgc-fff clearfix">
                <div class="pd-10 clearfix">
                </div>
                <div class="materials bk-gray radius bgc-fff">
                    <table class="table table-border table-bg table-striped bor-l bor-r">
                        <thead class="text-c">
                            <tr>
                                <th>计费单名称</th>
                                <th>开始时间</th>
                                <th>结束时间</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="text-c" v-for="item in bills">
                                <td>{{item.bill_name}}</td>
                                <td>{{item.start_date | billTime}}</td>
                                <td>{{item.end_date | billTime}}</td>
                                <td>
                                    <!--<a v-if="item.is_locked" class="btn btn-default radius" title="查看" href="javascript:;" v-on:click="clickModify(item)">查看</a>-->
                                    <a v-if="!item.is_locked" title="编辑" href="javascript:;" v-on:click="clickModify(item)"><i class="Hui-iconfont">&#xe6df;</i></a>
                                    <a class="btn btn-primary radius ml-30" title="费用推送至员工APP" href="javascript:;" v-on:click="clickSend(item, 0)">推送至员工APP</a>
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
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import add from "../components/addBills.vue";

    let itemOps = null;
    /**
     * 计费单的推送操作能推送几次？
     * 我有一个计费单，还能不能继续创建多个计费单？
     * 推送完了一个计费单后能不能再次推送这个计费单？比如忘记填写一个宿舍的费用，现在是无法重新设置的
     */
    export default{
        ready(){
            itemOps = {
                param:{
                    bill_name: '',
                    page:1,
                    page_size: 10,
                },
            };
            this.getList();
        },
        data: function(){
            return{
                noData:false,
                itemsLoading:false,
                isShowAddDialog:false,
                isShowSetDialog:false,
                bills: [],
                dialogType:'add',
                dialogTitle:'新增费用计费单',
                dialogData: null,
            }
        },
        methods: {
            addDialogClose:function(data){
                this.isShowAddDialog = false;
            },
            addDialogSave:function(data){
                let that = this;
                this.isShowAddDialog = false;
                that.getList();
            },
            clickAdd:function(){
                this.isShowAddDialog = true;
                this.dialogTitle = '新增费用计费单';
                this.dialogType='add';
            },
            clickModify:function(item){
                if(this.bills.length == 0){
                    layer.msg('请先添加计费单',{icon:7,time:1000});
                    return;
                }
                this.isShowAddDialog = true;
                this.dialogTitle = '编辑费用计费单';
                this.dialogType = 'modify'; // 如果订单推送过会被锁定，只能是查看状态：check;如果没有被推送过，就是修改状态
                this.dialogData = item;
            },
            //一键推送
            clickSend: function(item){
                if(this.bills.length == 0){
                    layer.msg('请先添加计费单',{icon:7,time:1});
                    return;
                }
                let that = this;
                layer.confirm(
                    `是否确认将【${item.bill_name}】计费单推送至员工app?`,
                    (index)=>{
                        that.itemsLoading = true;
                        console.log("send: " + item.bill_name);
                        $.ajax({
                            url: `${base.gAjaxUrl.bills}${item.id}/bulk_confirm/`,
                            type: 'GET',
                        })
                        .always((data)=>{
                            that.itemsLoading = false;
                            base.ajaxCallback(data,()=>{
                                layer.msg('推送成功',{icon:1,time:1000});
                                that.getList();
                            });
                        })
                        layer.close(index);
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
                        itemOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            //获取宿舍列表
            getList:function(reset=0){
                //重置第一页
                if(reset){
                    itemOps.param.page = 1;
                    itemOps.param.bill_name = $("#searchInput").val();
                    console.log(itemOps);
                }
                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-page',tpageToal,itemOps.param.page,count)
                });
            },
            queryAjax:function(callback=function(){}){
                this.itemsLoading = true;
                $.ajax({
                    url: base.gAjaxUrl.bills,
                    type: 'GET',
                    data: itemOps.param
                }).always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
                        let resultData = data.results;
                        if(resultData && resultData.length){
                            this.bills = resultData;
                            this.noData = false;
                            callback(data.num_pages,data.count);
                        } else {
                            this.bills = [];
                            this.noData = true;
                        }
                    });
                });
            },
        },
        filters: {
            billTime: function (time) {
                return time || "--";
            }
        },
        components: {
            add,
        },
    }
</script>