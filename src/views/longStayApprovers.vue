<template>
    <!-- 添加 -->
    <add :title="dialogTitle" :type="dialogType" :data="dialogData" v-if="isShowAddDialog" v-on:dialog-close="addDialogClose" v-on:dialog-save="addDialogSave"></add>

    <section class="Hui-article-box">
        <div class="page-container bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body fw-b">
                    <span class="f-20">设置审批人</span>
                </div>
            </div>
            <div class="bk-gray radius mt-10 bgc-fff">
                <div class="pd-15 clearfix">
                    <span class="f-r">
                        <a class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="clickAdd()"><i class="Hui-iconfont">&#xe600;</i> 添加审批人</a>
                    </span>
                </div>
                <table class="table table-border table-bg table-striped">
                    <thead class="text-c">
                        <tr>
                            <th>姓名/性别</th>
                            <th>部门/职位</th>
                            <th>工号</th>
                            <th>电话</th>
                            <th>审批部门</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="text-c" v-for="item in items">
                            <td>{{item.staff_vo.real_name}}/{{item.staff_vo.sex==1? '男': '女';}}</td>
                            <td>{{item.staff_vo.department_vo.department_name}}/{{item.staff_vo.position}}</td>
                            <td>{{item.staff_vo.job_number}}</td>
                            <td>{{item.staff_vo.phone}}</td>
                            <td>{{item.department_vo?item.department_vo.department_name:'--'}}</td>
                            <td>
                                <a title="删除" href="javascript:;" class="ml-5" v-on:click="deleteFault(item.id)"><i class="Hui-iconfont">&#xe6e2;</i></a>
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
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import add from "../components/addLongStayApprovers.vue";

    let itemOps = null;

    export default{
        ready(){
            let that = this;

            itemOps = {
                param:{
                    approver_type:2,
                    page:1,
                    page_size:10,
                }
            };

            this.getDepartments(()=>{
                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-page',tpageToal,itemOps.param.page,count)
                });
            });
        },
        data: function(){
            return{
                noData:false,
                itemsLoading: false,
                isShowAddDialog:false,
                items: [],
                departments: [],
                dialogTitle:'添加审批人',
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
            clickAdd:function(){
                if(this.departments.length == 0){
                    layer.msg('请先添加部门',{icon:2,time:1000});
                    return;
                }
                this.dialogType='add';
                this.dialogTitle='添加审批人';
                this.dialogData=this.departments;
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
            //获取审批人列表
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
                    url: base.gAjaxUrl.approvers,
                    type: 'GET',
                    data:itemOps.param
                })
                .always((data)=>{
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
            //删除审批人
            deleteFault:function(id){
                let that = this;

                layer.confirm('删除须谨慎，确认要删除吗？',(index)=>{

                    if($('tbody tr.text-c').length == 1 && itemOps.param.page>1){
                        itemOps.param.page--;
                    };

                    $.ajax({
                        url: `${base.gAjaxUrl.approvers}${id}/`,
                        type: 'DELETE',
                    })
                    .always((data)=>{
                        layer.msg('删除成功',{icon:1,time:1000});
                        that.getList();
                    })
                });
            },
            //获取部门列表
            getDepartments:function(callback=function () {}){
                let ajaxData = {
                    param: {
                        page:1,
                        page_size: 9999999,
                    }
                };
                $.ajax({
                    url: base.gAjaxUrl.departments,
                    type: 'GET',
                    data: ajaxData.param,
                })
                .always((data)=>{
                    let resultData = data;
                    this.departments = resultData || [];
                    callback();
                });
            },
        },
        components: {
            add,
        }
    }
</script>