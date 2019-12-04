<template>
    <!-- 添加/编辑提醒事项 -->
    <add :title="dialogTitle" :type="dialogType" :data="dialogData" v-if="isShowAddDialog" v-on:dialog-close="addDialogClose" v-on:dialog-save="addDialogSave"></add>

    <section class="Hui-article-box">
        <div class="page-container bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body clearfix">
                    <span class="f-20 fw-b f-l">提醒事项</span>
                    <input id="searchInput" class="ml-30 f-l input-text" type="text" placeholder="标题" style="width:250px">
                    <button v-on:click="getList(1)" class="btn btn-success f-l radius-r" type="button"><i class="f-r Hui-iconfont"> &#xe665; </i></button>
                    <a class="btn btn-primary radius f-r mr-10" title="新增水电计费单" href="javascript:;" v-on:click="clickAdd()">新增提醒事项</a>
                </div>
            </div>
            <div class="mt-10 bgc-fff clearfix">
                <div class="pd-10 clearfix">
                </div>
                <div class="materials bk-gray radius bgc-fff">
                    <table class="table table-border table-bg table-striped bor-l bor-r">
                        <thead class="text-c">
                        <tr>
                            <th width="100">标题</th>
                            <th width="200">提醒内容</th>
                            <th width="100">提醒日期</th>
                            <th width="60">重复</th>
                            <th width="120">手机短信通知</th>
                            <th width="60">是否启用</th>
                            <th width="80">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr class="text-c" v-for="item in remindsArr">
                            <td>{{item.title}}</td>
                            <td class="td-hide">{{item.content}}</td>
                            <td>{{item.remind_time}}</td>
                            <td>
                                <!-- 原型上没有，但是接口有这个参数: 一次 -->
                                <span v-if="item.remind_type == 1">一次</span>
                                <span v-if="item.remind_type == 2">每月</span>
                                <span v-if="item.remind_type == 3">三个月</span>
                                <span v-if="item.remind_type == 4">半年</span>
                                <span v-if="item.remind_type == 5">一年</span>
                            </td>
                            <td>{{item.phone}}</td>
                            <th>
                                <span>{{ item.is_action ? "是" : "否" }}</span>
                            </th>
                            <td>
                                <a title="编辑" href="javascript:;" v-on:click="clickModify(item)"><i class="Hui-iconfont">
                                    &#xe6df;</i></a>
                                <a title="删除" href="javascript:;" class="ml-5" v-on:click="deleteBtn(item)"><i class="Hui-iconfont">&#xe6e2;</i></a>
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
<style lang="less" scoped>
    td.td-hide {
        max-width: 200px;
        min-width: 200px;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import add from "../components/addRemind.vue";

    let itemOps = null;
    /**
     * 水电计费单的推送操作能推送几次？
     * 我有一个计费单，还能不能继续创建多个计费单？
     * 推送完了一个计费单后能不能再次推送这个计费单？比如忘记填写一个宿舍的水电费用，现在是无法重新设置的
     */
    export default{
        ready(){
            itemOps = {
                param:{
                    title: '',
                    page:1,
                    page_size: 10,
                },
            };
            this.getList();
        },
        data: function(){
            return{
                noData:false,
                itemsLoading: false,
                isShowAddDialog: false,
                remindsArr: [],
                dialogType:'add',
                dialogTitle:'新增提醒事项',
                dialogData: null,
            }
        },
        methods: {
            addDialogClose:function(data){
                this.isShowAddDialog = false;
            },
            addDialogSave:function(data){
                this.isShowAddDialog = false;
                this.getList();
            },
            clickAdd:function(){
                this.dialogTitle = '新增提醒事项';
                this.dialogType='add';
                this.isShowAddDialog = true;
            },
            clickModify:function(item){
                this.dialogData = item;
                this.dialogTitle = '编辑提醒事项';
                this.dialogType = 'modify';
                this.isShowAddDialog = true;
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
                    itemOps.param.title = $("#searchInput").val();
//                    console.log(itemOps);
                }
                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-page',tpageToal,itemOps.param.page,count)
                });
            },
            queryAjax:function(callback=function(){}){
                this.itemsLoading = true;
                $.ajax({
                    url: base.gAjaxUrl.remind,
                    type: 'GET',
                    data: itemOps.param
                }).always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
                        let resultData = data.results;
//                        console.log(resultData);
                        if(resultData && resultData.length){
                            this.remindsArr = resultData;
                            this.noData = false;
                            callback(data.num_pages, data.count);
                        } else {
                            this.remindsArr = [];
                            this.noData = true;
                        }
                    });
                });
            },
            deleteBtn: function (item) {
                layer.confirm(`确认删除【${item.title}】提醒?`, (index) =>{
                    this.itemsLoading = true;
                    $.ajax({
                        url: `${base.gAjaxUrl.remind}${item.id}/`,
                        type: 'DELETE',
                    }).always((data)=>{
                        this.itemsLoading = false;
                        base.ajaxCallback(data,()=>{
                            if(this.remindsArr.length == 1) {
                                itemOps.param.page--;
                                itemOps.param.page = itemOps.param.page > 1 ? itemOps.param.page : 1;
                            }
                            this.getList();
                        });
                        layer.close(index);
                    });
                })
            }
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