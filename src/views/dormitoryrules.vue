<template>
    <!-- 添加 -->
    <add :title="dialogTitle" :type="dialogType" :data="dialogData" v-if="isShowAddDialog" v-on:dialog-close="addDialogClose" v-on:dialog-save="addDialogSave"></add>

    <section class="Hui-article-box">
        <div class="page-container bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body">
                    <span class="f-20 fw-b">住宿信息设置</span>
                </div>
            </div>
            <div class="mt-10 clearfix">
                <div class="materialclasses bk-gray radius bgc-fff f-l">
                    <ul>
                        <li class="item clearfix relative">
                            <span class="fw-b fs-16">设置信息</span>
                        </li>
                        <li class="item clearfix relative" v-on:click="clickItem(1)" >
                            <span class="text-l name" v-bind:class="[module==1?'curr':'']">申请规则</span>
                            <span v-bind:class="[module==1?'indexTags':'']"></span>
                        </li>
                        <li class="item clearfix relative" v-on:click="clickItem(2)" >
                            <span class="text-l name" v-bind:class="[module==2?'curr':'']">入住期限</span>
                            <span v-bind:class="[module==2?'indexTags':'']"></span>
                        </li>
                    </ul>
                </div>
                <div class="over-h">
                    <div class="bgc-fff" v-show="module==1">
                        <div class="pt-20">
                            <a class="btn btn-primary radius ml-20" href="javascript:;" v-on:click="clickAddRule()"><i class="Hui-iconfont">&#xe600;</i>添加规则</a>
                        </div>
                        <div class="clearfix pl-200" >
                            <div class="ruleItem pd-20 f-l" v-for="item in items">
                                <div class="bor-e pd-10 clearfix w-300">
                                    <span>{{item.room_type_vo.type_name}}</span>
                                    <div class="w-150 f-r">
                                        <span class="mr-10">可以申请等级:</span>{{item.low_level}}~{{item.high_level}}
                                    </div>
                                </div>
                                <i class="Hui-iconfont" v-on:click="deleteRules(item)">&#xe60b;</i>
                            </div>
                        </div>
                        <div id="J-page" class="m-page" v-show="!noData"></div>
                        <div class="m-loading" v-if="itemsLoading">
                            <div class="cube1"></div>
                            <div class="cube2"></div>
                        </div>
                        <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
                    </div>
                    <div class="bgc-fff pd-20 pl-220 text-c" v-show="module==2">
                        <div class="bor-e pd-20">
                            <span class="ml-20">分配房间后</span><span class="w-150 dp-ilb ml-5 mr-5"><input type="text" class="input-text radius" v-model="deadlineInput" name="checkin_deadline_day"></span>天内入住,逾期未办理入住的订单作红色标记“
                            <span class="deadlineTags"></span>”
                            <div class="text-c mt-20 mb-20">
                                <a class="btn btn-primary radius fs-12" title="其他反馈" href="javascript:;" v-on:click="clickSave()">确认</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<style lang="less">
    .indexTags{
        display: inline-block;
        width: 10px;
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        background-color: #206afc;
    }
    .deadlineTags{
        display: inline-block;
        width: 10px;
        height: 50px;
        background-color: #ef0021;
        vertical-align: middle;
    }
    .ruleItem{
        display: flex;
        justify-content: space-between;
        width: 350px;
    }
    .ruleItem i{
        font-size: 20px;
        line-height: 42px;
        cursor: pointer;
    }
    #J-layer-form .col-2 label.error{
        right: 2px;
    }
</style>
<script>
    import * as base from '../assets/js/base.js';
    import add from "../components/addApplyroomrules.vue";

    let itemOps = null;

    export default{
        ready(){
            let that = this;
            itemOps = {
                param:{
                    page:1,
                    page_size:10,
                }
            };
            this.queryAjax((tpageToal='4',count='0')=>{
               this.initPage('#J-page',tpageToal,itemOps.param.page,count)
            });

            this.getDormitoryrules();
            this.getRoomTypes();
            
        },
        data: function(){
            return{
                noData:false,
                itemsLoading:false,
                isShowAddDialog:false,
                module: 1,
                items: [],
                roomTypes: [],
                rulesType:'POST',
                rulesURL: base.gAjaxUrl.dormitoryrules,
                deadlineInput: 1,
                dialogTitle:'添加规则',
                dialogType:'add',
                dialogData:'',
            }
        },
        methods: {
            addDialogClose:function(data){
                this.isShowAddDialog = false;
            },
            addDialogSave:function(data){
                this.isShowAddDialog = false;
                this.getList(1);
            },
            clickAddRule:function(){
                this.dialogTitle = '添加规则';
                if(!this.roomTypes.length) {
                    layer.msg('请先在【宿舍管理】>【房间类型管理】中设定房间类型', {icon: 1, time: 5000});
                    return;
                }
                this.dialogData = this.roomTypes;
                this.isShowAddDialog = true;
            },
            clickItem:function(module){
                this.module = module;
            },
            clickSave:function(item){
                let that = this;
                if(!(/^[0-9]*[1-9][0-9]*$/.test(this.deadlineInput))){
                    layer.msg('请输入正确的天数',{icon:2,time:1000});
                    return;
                }
                let ajaxData = {
                    checkin_deadline_day: this.deadlineInput,
                }
                $.ajax({
                    url: that.rulesURL,
                    type: that.rulesType,
                    data: ajaxData,
                })
                .always((data)=>{
                    base.ajaxCallback(data,()=>{
                        layer.msg('提交成功',{icon:1,time:1000});
                    });
                });
            },
            //初始化分页
            initPage:function(obj,tpageToal='4',current='1',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:current,
                    count:count,
                    callback:(p)=>{
                        itemOps.param.page = p;
                        this.queryAjax(this.buildingsId);
                    }
                });
            },
            //获取入住申请规则列表
            getList:function(reset=0){
                let that = this;
                //重置第一页
                if(reset){
                    itemOps.param.page = 1
                }
                this.queryAjax((tpageToal='4',count='0')=>{
                    that.initPage('#J-page',tpageToal,itemOps.param.page,count)
                });
            },
            queryAjax:function(callback=function(){}){
                //修改参数
                this.itemsLoading = true;

                $.ajax({
                    url: base.gAjaxUrl.applyroomrules,
                    type: 'GET',
                    data: itemOps.param
                })
                .always((data)=>{
                    base.ajaxCallback(data,()=>{
                        this.itemsLoading = false;
                        let resultData = data.results;
                        
                        if(resultData && resultData.length){
                            this.items = resultData;
                            this.noData = false;
                            //回调
                            callback(data.num_pages,data.count);
                        }else{
                            this.items = [];
                            this.noData = true;
                        }
                    });
                })
            },
            //获取宿舍规则列表
            getDormitoryrules:function(){
                $.ajax({
                    url: base.gAjaxUrl.dormitoryrules,
                    type: 'GET',
                })
                .always((data)=>{
                    base.ajaxCallback(data,()=>{
                        this.itemsLoading = false;
                        let resultData = data.results;
                        
                        if(resultData && resultData.length){
                            this.deadlineInput = resultData[0].checkin_deadline_day;
                            this.rulesType = 'PATCH';
                            this.rulesURL = `${base.gAjaxUrl.dormitoryrules}${resultData[0].id}/`;
                            //回调
                            //callback(data.num_pages);
                        }else{
                            this.rulesType = 'POST';
                            this.rulesURL = base.gAjaxUrl.dormitoryrules;
                        }
                    });
                })
            },
            //获取房间类型列表
            getRoomTypes:function(){
                let ajaxData = {
                    page:1,
                    page_size: 999999
                }
                $.ajax({
                    url: base.gAjaxUrl.roomtypes,
                    type: 'GET',
                    data: ajaxData,
                })
                .always((data)=>{
                    base.ajaxCallback(data,()=>{
                        this.itemsLoading = false;
                        let resultData = data.results;
                        
                        if(resultData && resultData.length){
                            this.roomTypes = resultData;
                        }
                    });
                })
            },
            deleteRules:function(data){
                let that = this;
                
                layer.confirm(
                    `确定要删除该条规则吗?`, 
                    {
                        title: '删除规则'
                    },
                    (index)=>{
                        $.ajax({
                            url: `${base.gAjaxUrl.applyroomrules}${data.id}/`,
                            type: 'DELETE',
                        })
                        .always((data)=>{
                            if(!data){
                                layer.msg('删除成功',{icon:1,time:1000});
                                that.getList();
                                that.isShowModify = false;
                            }
                            // else{
                            //     base.ajaxCallback(data,()=>{
                            //         this.getList();
                            //         that.isShowDelete = false;
                            //     });
                            // }
                        });
                    },
                    ()=>{
                        that.isShowModify = false;
                    }
                );
            },

        },
        components: {
            add,
        }
    }
</script>