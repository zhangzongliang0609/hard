<template>
    <add :title="dialogTitle" :type="dialogType" :data="dialogData" v-if="isShowAddDialog" v-on:dialog-close="addDialogClose" v-on:dialog-save="addDialogSave"></add>
    <section class="Hui-article-box">
    <div class="page-container">
        <div class="text-l clearfix">
            <input id="searchInput" type="text"  placeholder="部门" style="width:250px" class="f-l input-text">
            <button v-on:click="getList(1)" class="btn btn-success" type="button"><i class="f-r Hui-iconfont">&#xe665;</i></button>
        </div>
        <div class="cl pd-5 bg-1 bk-gray mt-20">
            <span class="l">
                <a class="btn btn-primary radius" href="javascript:;" v-on:click="clickAdd"><i class="Hui-iconfont">&#xe600;</i> 添加部门
                </a>
            </span>
        </div>
        <table class="table table-border table-bordered table-hover table-bg">
            <thead>
                <!-- <tr>
                    <thscoped="col" colspan="10">部门管理</th>
                </tr> -->
                <tr class="text-c">
                    <!-- <th width="25"><input type="checkbox" value="" name=""></th> -->
                    <th >部门名称</th>
                    <th width="70">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr class="text-c" v-for="item in items">
                    <!-- <td><input type="checkbox" value="" name=""></td> -->
                    <td>{{item.department_tree}}</td>
                    <td class="f-14">
                        <a title="编辑" href="javascript:;" v-on:click="clickModify(item)"><i class="Hui-iconfont">&#xe6df;</i></a>
                        <a title="删除" href="javascript:;" class="ml-5" v-on:click="deleteBtn(item.id)"><i class="Hui-iconfont">&#xe6e2;</i></a>
                    </td>
                </tr>
            </tbody>
        </table>
        <div id="J-page" class="m-page" v-show="!noData"></div>
        <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
        <div class="m-loading" v-if="itemsLoading">
            <div class="cube1"></div>
            <div class="cube2"></div>
        </div>
    </div>
    </section>
</template>

<style lang="less" rel="stylesheet" scoped>
</style>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import add from "../components/addDepartments.vue";
    let departmentsOps = null;

    export default{
        ready () {
            let that = this;
            departmentsOps = {
                param:{
                    search:'',
                    page:1,
                    page_size:10,
                }
            };
            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-page',tpageToal,departmentsOps.param.page,count)
            });
        },
        data:function(){
            return {
                noData:false,
                itemsLoading:false,
                isShowAddDialog:false,
                items: [],
                searchInput:'',
                dialogTitle:'添加部门',
                dialogType:'add',
                dialogData:''
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
                this.dialogTitle='添加部门';
                this.dialogType='add';
                this.isShowAddDialog = true;
            },
            clickModify:function(data){
                this.dialogTitle='修改资料';
                this.dialogType='modify';
                this.dialogData=data;
                this.isShowAddDialog = true;
            },
            //初始化分页
            initPage:function(obj,tpageToal='4',current='1',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:current,
                    count:count,
                    callback:(p)=>{
                        departmentsOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax:function(callback=function(){}){
                this.itemsLoading = true;
                //修改参数
                departmentsOps.param.search = this.searchInput;

                $.ajax({
                    url: base.gAjaxUrl.departments,
                    type: 'GET',
                    data:departmentsOps.param
                })
                .always((data)=>{
                    base.ajaxCallback(data,()=>{
                        let resultData = data || [];
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
                //重置第一页
                if(reset){
                    this.searchInput = $('#searchInput').val();
                    departmentsOps.param.page = 1;
                }

                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-page',tpageToal,departmentsOps.param.page,count);
                });
            },
            //删除
            deleteBtn:function(id){
                let that = this;

                layer.confirm('删除须谨慎，确认要删除吗？',(index)=>{

                    if($('tbody tr.text-c').length == 1 && departmentsOps.param.page>1){
                        departmentsOps.param.page--;
                    };

                    $.ajax({
                        url: `${base.gAjaxUrl.departments}${id}/`,
                        type: 'DELETE',
                    })
                    .always((data)=>{
                        layer.msg('删除成功',{icon:1,time:1000});
                        that.getList();

                    })
                });
            }

        },
        components:{
            add
        }
    }
</script>
