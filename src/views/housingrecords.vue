<template>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
    <!-- 添加 -->
    <add :title="dialogTitle" :type="dialogType"  :data="dialogData" v-if="isShowAddDialog" v-on:dialog-close="addDialogClose" v-on:dialog-save="addDialogSave"></add>

    <section class="Hui-article-box">
        <div class="page-container bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body f-20 fw-b">
                    <span>宿舍人员管理</span>
                    <a id="exportData" class="btn btn-secondary radius f-r" v-on:click="exportData()">批量导出</a>
                    <a href="javascript:;" class="btn btn-secondary radius f-r mr-15" v-on:click="turnToImport()">批量导入</a>
                </div>
            </div>
            <div class="bk-gray radius mt-10 bgc-fff">
                <div class="pd-15 clearfix">
                    <div class="text-l clearfix f-l mr-15">
                        <input id="searchInput" type="text"  placeholder="名字/工号/手机号" style="width:200px" class="f-l input-text">
                        <button v-on:click="getList(1)" class="btn btn-success" type="button"><i class="f-r Hui-iconfont">&#xe665;</i></button>
                    </div>
                    <span class="f-r">
                        <a class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="clickAdd()">添加宿舍人员</a>
                    </span>
                </div>
                <table class="table table-border table-bg table-striped">
                    <thead class="text-c">
                        <tr>
                            <th>头像</th>
                            <th>姓名/性别</th>
                            <th>宿舍地址</th>
                            <th>部门/职位</th>
                            <th>工号</th>
                            <th>电话</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="text-c" v-for="item in items">
                            <td>
                                <img class="avatar" v-bind:src="item.staff_vo.avatar?item.avatar:'./src/assets/images/avatar-default.jpg'"/>
                            </td>
                            <td>{{item.staff_vo.real_name}}/{{item.staff_vo.sex==1? '男': '女';}}</td>
                            <td>{{item.room_vo?item.room_vo.location:"--"}}</td>
                            <td>{{item.staff_vo.department_vo.department_name}}/{{item.staff_vo.position}}</td>
                            <td>{{item.staff_vo.job_number}}</td>
                            <td>{{item.staff_vo.phone}}</td>
                            <td>
                                <a href="javascript:;" title="" v-on:click="clickCheckout(item)"><img src="../assets/images/icon-tui.png" height="20" width="20" alt=""></a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div id="J-page" class="m-page" v-show="!noData"></div>
                <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
            </div>
        </div>
    </section>

</template>
<style lang="less" rel="stylesheet" scoped>
    .bgc-f5{
        background-color: #f5f5f5;
    }
    .fw-b{
        font-weight: bold;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import add from "../components/addHousingStaff.vue";

    let itemOps = null;

    export default{
        ready(){
            let that = this;

            itemOps = {
                param:{
                    search:'',
                    page:1,
                    page_size:10,
                }
            };

            this.getList();
        },
        data: function(){
            return{
                noData:false,
                itemsLoading:false,
                isShowAddDialog:false,
                items: [],
                searchInput:'',
                dialogTitle:'添加宿舍人员',
                dialogType:'add',
                dialogData:'',
                importData: {},
            }
        },
        methods: {
            addDialogClose:function(data){
                this.isShowAddDialog = false;
//                this.getList(1);
            },
            addDialogSave:function(data){
//                this.isShowAddDialog = false;
                this.getList(1);
            },
            clickAdd:function(){
                this.dialogType='add';
                this.dialogTitle='添加宿舍人员';
                this.isShowAddDialog = true;
            },
            clickCheckout:function(data){
                let that = this;
                console.log("this data");
                console.log(data);
                layer.confirm(
                    `确认${data.staff_vo.real_name}从${data.room_vo.location}退宿?
                       <br>
                     押金金额:&nbsp;${data.deposit?data.deposit:0}
                       <br>
                     押金票号:&nbsp;${data.deposit_no?data.deposit_no:'无'}`,
                    (index)=>{
                        if($('tbody tr.text-c').length == 1 && itemOps.param.page>1){
                            itemOps.param.page--; 
                        };
                        let ajaxData = {
                            staff: data.staff_vo.id
                        }
                        $.ajax({
                            url: `${base.gAjaxUrl.rooms}${data.room_vo.id}/checkout/`,
                            contentType: 'application/json',
                            type: 'POST',
                            data: JSON.stringify(ajaxData)
                        }).always((data)=>{
                            layer.msg('退房成功',{icon:1,time:1000});
                            that.getList();
                        })
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
            //获取列表
            getList:function(reset=0){
                let that = this;
                //重置第一页
                if(reset){
                    this.searchInput = $("#searchInput").val();
                    itemOps.param.page = 1
                }

                this.queryAjax((tpageToal='4',count='0')=>{
                    that.initPage('#J-page',tpageToal,itemOps.param.page,count)
                });
            },
            queryAjax:function(callback=function(){}){
                //修改参数
                this.itemsLoading = true;
                itemOps.param.search = this.searchInput;

                $.ajax({
                    url: base.gAjaxUrl.housingrecords,
                    type: 'GET',
                    data:itemOps.param
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
                        this.itemsLoading = false;
                        let resultData = data.results;
                        this.items = resultData;
                        console.log("resultsData");
                        console.log(resultData);
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
            turnToImport: function () {
                this.$router.go({
                    path: '/importMould',
                    name: 'importMould',
                    query: {
                        importType: 'member'
                    }
                });
            },
            exportData: function () {
                this.itemsLoading = true;
                $.ajax({
                    url: `${base.gAjaxUrl.rooms}export_staff/`,
                    type: 'POST',
                    contentType: "application/json",
                    data: JSON.stringify(itemOps.param)
                }).always(() => {
                    this.itemsLoading = false;
                    this.$route.router.go({path: '/job'});
                })
            }
        },
        components: {
            add,
        }
    }
</script>