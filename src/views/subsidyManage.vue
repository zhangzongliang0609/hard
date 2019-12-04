<template>
    <add v-if="isShowAdd" :data="currentItem" :type="dialogType" @dialog-save="dialogSave" @dialog-close="dialogClose"></add>
    <section class="Hui-article-box">
        <div class="page-container">
            <div class="panel panel-default radius">
                <div class="panel-body">
                    <span class="f-20 fw-b">补贴管理</span>
                </div>
            </div>

            <div class="cl mt-10 mb-10 pt-10 pb-10">

                <input id="searchInput" type="text"  placeholder="输入补贴类型" style="width:200px" class="input-text"><button v-on:click="getList(1)" class="btn btn-success radius-r" type="button"><i class=" Hui-iconfont">&#xe665;</i></button>


                <a class="btn btn-secondary radius mr-5 f-r" href="javascript:;" v-on:click="clickAdd()"><i class="Hui-iconfont">&#xe600;</i> 新增补贴
                </a>
            </div>
            <table class="table table-border table-bordered table-hover table-bg table-sort">
                <thead>
                <tr class="text-c">
                    <th width="70">补贴类型</th>
                    <th width="70">补贴方式</th>
                    <th width="70">补贴参数</th>
                    <th width="70">补贴单价</th>
                    <th width="70">补贴说明</th>
                    <th width="70">生效范围</th>
                    <th width="150">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr class="text-c" v-for="item in items">
                    <td>{{item.type}}</td>
                    <td>{{item.mode}}</td>
                    <td>{{item.parameter}}</td>
                    <td>{{item.uprice}}</td>
                    <td>
                        <div class="text-overflow " style="max-width: 400px;margin:0 auto">
                            {{item.remake}}
                        </div>
                    </td>
                    <td>{{item.scope_type == 20 ? '部门' : '人员'}}</td>
                    <td class="f-14">
                        <a class="btn btn-primary radius mr-5" v-if="item.scope_type == 10" href="javascript:;" v-on:click="turnToImport(item) ">导入生效人员</a>
                        <a title="编辑" href="javascript:;" v-on:click="clickModify(item)"><i class="Hui-iconfont">&#xe6df;</i></a>
                        <a title="删除" href="javascript:;" class="ml-5" v-on:click="deleteBtn(item)"><i class="Hui-iconfont">&#xe6e2;</i></a>
                    </td>
                </tr>
                </tbody>
            </table>
            <div id="J-page" class="m-page" v-show="!noData"></div>

        </div>
    </section>
</template>

<style lang="less" rel="stylesheet" scoped>

</style>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import  add from "../components/addSubsidy"
    let staffsOps = null;

    export default{
        ready () {
            staffsOps = {
                param:{
                    search:'',
                    page:1,
                    page_size:10,
                }
            };
            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-page',tpageToal,count)
            });

        },
        data:function(){
            return {
                noData:false,
                isShowAdd:false,
                dialogType:"",
                currentItem:{},
                items:[],
            }
        },
        methods: {
            //初始化分页
            initPage:function(obj,tpageToal='4',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:staffsOps.param.page,
                    count:count,
                    callback:(p)=>{
                        staffsOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax:function(callback=function(){}){
                $.showLoading();
                //修改参数
                staffsOps.param.search = this.searchInput;
                $.ajax({
                    url: base.gAjaxUrl.subsidyList,
                    type: 'GET',
                    data:staffsOps.param
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
                let that = this;
                //重置第一页
                if(reset){
                    this.searchInput= $("#searchInput").val();
                    staffsOps.param.page = 1
                }

                this.queryAjax((tpageToal='4',count='0')=>{
                    that.initPage('#J-page',tpageToal,count)
                });
            },
            //删除
            deleteBtn:function(item){
                let that = this;
                layer.confirm('删除须谨慎，确认要删除【'+item.type+'】吗？',(index)=>{
                    $.showLoading();
                    if($('tbody tr.text-c').length == 1 && staffsOps.param.page>1){
                        staffsOps.param.page--;
                    }
                    $.ajax({
                        url: `${base.gAjaxUrl.subsidyList}${item.id}/`,
                        type: 'DELETE',
                        success:function(){
                            layer.msg('删除成功',{icon:1,time:1000});
                            that.getList();
                        },
                    }).always(()=>{
                        $.hideLoading();
                    })
                });
            },
            turnToImport: function (item) {
                if(item.scope_type == 20){
                    layer.msg("该补贴是作用于部门的,需要先修改为作用为人员才能导入生效人员",{icon:2,tim:3000});
                    return;
                }
                localStorage.setItem("subsidyId",item.id);
                this.$router.go({
                    path: '/importMould',
                    name: 'importMould',
                    query: {
                        importType: 'subsidy'
                    }
                })
            },
            clickAdd:function(){
                this.dialogType = "add";
                this.isShowAdd = true;
            },
            clickModify:function(item){
                this.currentItem = item;
                this.dialogType = "modify";
                this.isShowAdd = true;
            },
            dialogSave:function(){
                this.isShowAdd = false;
                this.getList();
            },
            dialogClose:function(){
                this.isShowAdd = false;
            },
            exportData: function () {
                this.itemsLoading = true;
                $.ajax({
                    url: `${base.gAjaxUrl.officialcarVehicleList_V2}export/`,
                    type:'POST',
                    contentType: "application/json",
                    data: JSON.stringify(staffsOps.param),
                }).always((data)=>{
                    this.itemsLoading = false;
                    this.$route.router.go({path: '/job'});
                    // layer.msg('最新的一条数据请重新刷新哦',{icon:1,time:3000});
                })
            }

        },
        components:{
            add
        }
    }
</script>
