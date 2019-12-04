<template>

    <!-- 添加 -->
    <add v-if="isShowAddDialog"
         v-on:dialog-close="addDialogClose"
         v-on:dialog-save="addDialogSave"></add>

    <new-add v-if="showNewAdd"
             :data="dialogData"
             :type="dialogType"
             :title="dialogTitle"
             @dialog-close="closeNewAdd"
             @dialog-save="newAddSave"
             @modify-save="newAddSave"></new-add>

    <!-- 导入 -->
    <imoprt-data v-if="isShowImportDialog" v-on:dialog-close="importDialogClose" v-on:dialog-save="importDialogSave"></imoprt-data>
    <section class="Hui-article-box">
        <div class="page-container">
            <div class="panel panel-default radius">
                <div class="panel-body">
                    <span class="f-20 fw-b">司机管理</span>
                </div>
            </div>
            <div class="text-l mt-10 mt-10 mb-10 pt-10 pb-10 clearfix">
                <input id="searchInput"
                       type="text"
                       autocomplete="off"
                       placeholder="姓名/工号/电话"
                       style="width:200px"
                       class="input-text">
                <button v-on:click="getList(1)" class="btn btn-success search-btn radius-r" type="button"><i class="Hui-iconfont">&#xe665;</i></button>


                <span class="f-r">
                <a class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="clickAdd()"><i class="Hui-iconfont">&#xe600;</i> 添加司机
                </a>

            </span>
                <span class="f-r">
                <a class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="clickNewAdd()"><i class="Hui-iconfont">&#xe600;</i> 新增司机
                </a>

            </span>
            </div>
            <table class="table table-border table-bordered table-hover table-bg table-sort">
                <thead>
                <tr class="text-c">
                    <!-- <th width="25"><input type="checkbox" value="" name=""></th> -->
                    <th width="50">头像</th>
                    <th width="100">姓名/性别</th>
                    <th >部门/职位</th>
                    <th width="70">工号</th>
                    <th width="150">电话</th>
                    <!--<th width="50">是否上班</th>--> <!-- bug 412 建议隐藏 -->
                    <th width="50">是否锁定</th>
                    <th width="100">是否备用</th>
                    <th width="70">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr class="text-c" v-for="item in items">
                    <!-- <td><input type="checkbox" value="" name="">{{item.avatar}}</td> -->
                    <td><img class="avatar" v-bind:src="item.staff_vo.avatar?item.avatar:'./src/assets/images/avatar-default.jpg'"/></td>
                    <td>{{item.staff_vo.real_name}}/{{item.staff_vo.sex == 1 ? '男':'女'}}</td>
                    <td>{{item.staff_vo.department_vo.department_name}}/{{item.staff_vo.position}}</td>
                    <td>{{item.staff_vo.job_number}}</td>
                    <td>{{item.staff_vo.phone}}</td>
                    <!--<td>{{item.is_on_duty ? '是' : '否'}}</td>-->
                    <td><img class="w-20" v-bind:src="item.locked?'./src/assets/images/lock_close.png':'./src/assets/images/lock_open.png'" v-on:click="toggleLock(item)"></td>

                    <td>
                        <span class="switch-outer" @click="toggleStandby(item)"
                              :class="{'selected': item.is_spare}">
                                <span class="switch-inner">
                                    <span class="switch-center"></span>
                                </span>
                        </span>
                    </td>
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

<style lang="less">
    .avatar{
        width: 50px;
    }
    .search-btn{
        margin-left: -5px;
    }
</style>

<script type="text/ecmascript-6">
    import * as base from '../../assets/js/base.js';
    import add from "../components/addDriver.vue";
    import newAdd from "../components/addOfficicalcar2Driver.vue";

    let staffsOps = null;

    export default{
        ready () {

            let that = this;
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
                itemsLoading:false,
                isShowAddDialog:false,
                isShowImportDialog:false,
                items: [],
                searchInput:'',
                dialogTitle:'添加部门',
                dialogType:'add',
                dialogData:'',
                showNewAdd:false,
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
                this.isShowAddDialog = true;
            },
            clickModify:function(data){
                this.dialogTitle='修改资料';
                this.dialogType='modify';
                this.dialogData=data;
                this.showNewAdd = true;
            },
            toggleLock:function(officialcarDriver) {
                this.itemsLoading = true;
                var url;
                officialcarDriver.locked ? url = base.gAjaxUrl.officialcarDriverList_V2 + officialcarDriver.id + '/' :  url = base.gAjaxUrl.officialcarDriverList_V2 + officialcarDriver.id + '/';
                $.ajax({
                    url: url,
                    type: 'PATCH',
                    data:{
                        locked:  officialcarDriver.locked ? false : true
                    }
                })
                    .always((data)=>{
                        this.itemsLoading = false;
                        base.ajaxCallback(data,()=>{
                            officialcarDriver.locked = data.locked
                        });
                    })
            },
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
                this.itemsLoading = true;
                //修改参数
                staffsOps.param.search = this.searchInput;

                $.ajax({
                    url: base.gAjaxUrl.officialcarDriverList_V2,
                    type: 'GET',
                    data:staffsOps.param
                })
                    .always((data)=>{
                        base.ajaxCallback(data,()=>{
                            this.itemsLoading = false;
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
            deleteBtn:function(id){
                let that = this;
                layer.confirm('删除须谨慎，确认要删除吗？',(index)=>{

                    if($('tbody tr.text-c').length == 1 && staffsOps.param.page>1){
                        staffsOps.param.page--;
                    };

                    $.ajax({
                        url: `${base.gAjaxUrl.officialcarDriverList_V2}${id}/`,
                        type: 'DELETE',
                    })
                        .always((data)=>{
                            layer.msg('删除成功',{icon:1,time:1000});
                            that.getList();

                        })
                });
            },
            clickNewAdd:function(){
                this.showNewAdd = true;
                this.dialogType = 'add';
                this.dialogTitle = '新增司机';
            },
            closeNewAdd:function(){
                this.showNewAdd = false;
            },
            newAddSave:function(){
                this.showNewAdd = false;
                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-page',tpageToal,staffsOps.param.page,count)
                });
            },
            toggleStandby:function(data){
                let str = data.is_spare ? `是否确定取消${data.staff_vo.real_name}司机的备用状态` : `是否确定将${data.staff_vo.real_name}司机修改为备用`;
                layer.confirm(str,(index)=>{
                    this.itemsLoading  = true;
                    $.ajax({
                        url: `${base.gAjaxUrl.officialcarDriverList_V2}${data.id}/`,
                        type: 'PATCH',
                        contentType:"application/json",
                        data:JSON.stringify({
                            is_spare: data.is_spare ? false : true
                        })
                    }).always((data)=>{
                            this.itemsLoading = false;
                            base.ajaxCallback(data,()=>{
                                this.getList();
                            })
                        });
                    layer.closeAll();
                });
            }
        },
        components:{
            add:add,
            newAdd:newAdd,
        }
    }
</script>
