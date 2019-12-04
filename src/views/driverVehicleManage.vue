<template>
    <!-- 添加 -->
    <select_employee  :type="dialogType"   v-if="isShowSelectEmployee" v-on:dialog-close="dialogClose" v-on:dialog-add="dialogAdd" v-on:did-selected-employee="didSelectedEmployee">
    </select_employee>
    <add_private :title="privateCarTitle" :type="privateCarType" :data="currentEmployee" v-if="isShowPrivateCar"
         v-on:dialog-close="privateCarSave" v-on:dialog-save="privateCarSave" v-on:dialog-return="returnEmployee"></add_private>
    <section class="Hui-article-box">
        <div class="page-container bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body clearfix">
                    <span class="f-20 fw-b f-l">司机车辆管理</span>
                    <a id="exportData" class="btn btn-secondary radius f-r" v-on:click="exportData()">批量导出</a>
                    <a class="btn btn-secondary radius f-r mr-15" title="批量导入" href="javascript:;" v-on:click="turnToImport()">批量导入</a>
                    <a class="btn btn-primary radius f-r mr-15" title="添加司机车辆" href="javascript:;" v-on:click="add()">添加司机车辆</a>
                </div>
            </div>
            <div class="mt-10 bgc-fff clearfix">
                <div class="pd-15 clearfix">
                    <div class="clearfix relative">
                        <select id="selectFilter" v-model="searchType" class="f-l select">
                            <option value="real_name">姓名</option>
                            <option value="car_no">车牌</option>
                            <option value="department">部门</option>
                            <option value="phone">手机号</option>
                            <option value="job_number">工号</option>
                        </select>
                        <input type="text" v-model="searchContent" class="f-l input-text Wdate" style="width:150px;margin-left: -1px" placeholder="请输入搜索内容" id="searchInput">
                        <button type="submit" class="f-l btn btn-success radius-r" v-on:click="getList()"><i class="Hui-iconfont">&#xe665;</i></button>
                    </div>
                </div>
                <div class="materials bk-gray radius bgc-fff">
                    <table class="waterElectricityForm table table-border table-bg table-striped bor-l bor-r">
                        <thead class="text-c">
                        <tr>
                            <th width="">姓名/性别</th>
                            <th width="">部门/职位</th>
                            <th width="">工号</th>
                            <th width="">电话</th>
                            <th width="">登记车牌</th>
                            <th width="">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr class="text-c" v-for="data in items">
                            <td>{{data.real_name}}/{{data.sex == 1?'男':'女'}}</td>
                            <td>{{data.department_vo.department_name}}/{{data.position?data.position:''}}</td>
                            <td>{{data.job_number}}</td>
                            <td>{{data.phone}}</td>
                            <td>{{data.cars}}</td>
                            <td>
                                <a class="btn btn-primary radius   mr-20" title="查看详情" href="javascript:;" v-on:click="showDetails(data)">查看详情</a>
                                <a class="btn btn-danger radius   mr-20" title="删除" href="javascript:;" v-on:click="deletePrivate(data)">删除</a>
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
<style lang="less" rel="stylesheet/less" scoped>
    #selectFilter{
        width: 70px;
        height: 31px;
    }
    .td-hide{
        max-width: 100px;
    }

</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import select_employee from "../components/select_employee.vue";
    import add_private from "../components/addPrivateCar.vue";

    let privateOps = null;
    export default{
        ready(){
            privateOps = {
                params: {
                    page: 1,
                    page_size: 10,
                }
            };
            this.getList();
        },
        data:function () {
            return{
                noData:false,
                items:[],
                itemsLoading:false,
                searchType:'real_name',
                searchContent:'',
                dialogType:'private',
                dialogData:'',
                isShowSelectEmployee:false,
                isShowPrivateCar:false,
                currentEmployee:'',
                privateCarTitle:'添加私家车司机与车辆',
                privateCarType:'add',
                importData: {},
            }
        },
        methods:{
            getList:function(){
                let that = this;
                privateOps.params.page = 1;
                this.queryAjax((tpageToal='4',count='0')=>{
                    that.initPage('#J-page',tpageToal,privateOps.params.page,count)
                });
            },
            queryAjax:function(callback=function(){}){
                //修改参数
                this.itemsLoading = true;
                let that = this;
                let ajaxData = {
                    page: privateOps.params.page,
                    page_size: privateOps.params.page_size,
                };
                ajaxData[this.searchType] = this.searchContent;
                $.ajax({
                    url: `${base.gAjaxUrl.privateCar}staff_list/`,
                    type: 'GET',
                    data:ajaxData
                }).always((data)=>{
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
            initPage:function(obj,tpageToal='4',current='1',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:current,
                    count:count,
                    callback:(p)=>{
                        privateOps.params.page = p;
                        this.queryAjax();
                    }
                });
            },
            dialogClose:function () {
                this.isShowSelectEmployee = false;
            },
            addDialogSave:function () {
                this.isShowSelectEmployee = false;
            },
            // privateCarClose:function () {
            //     this.isShowPrivateCar = false;
            // },
            privateCarSave:function () {
                this.isShowPrivateCar = false;
                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-page',tpageToal,privateOps.params.page,count)
                });
            },
            add:function () {
                this.isShowSelectEmployee = true;
            },
            dialogAdd:function () {
                this.isShowPrivateCar = true;
                this.isShowSelectEmployee = false;
                this.privateCarType = 'add'
            },
            didSelectedEmployee:function (data) {
                console.log("data");
                console.log(data);
                this.currentEmployee = data;
                this.privateCarType = 'modify';
                this.isShowSelectEmployee = false;
                this.isShowPrivateCar = true;

            },
            showDetails:function(value){
                this.isShowPrivateCar = true;
                this.privateCarType = 'modify';
                this.currentEmployee = value;
            },
            deletePrivate:function (data) {
                let that = this;
                layer.confirm(`确定要删除吗?`,function(){
                    $.ajax({
                        url:`${base.gAjaxUrl.privateCar}staff_delete/?staff_id=${data.id}`,
                        type:"DELETE",
                        // contentType:"application/json",
                        // data:JSON.stringify({
                        //     staff_id:
                        // })
                    }).always((data)=>{
                        base.ajaxCallback(data,()=>{
                          if(that.items.length == 1 && privateOps.params.page > 1){
                              privateOps.params.page--;
                          }
                            that.queryAjax((tpageToal='4',count='0')=>{
                                that.initPage('#J-page',tpageToal,privateOps.params.page,count)
                            });
                        })
                    })
                    layer.closeAll("dialog");
                })

            },
            returnEmployee:function () {
                this.isShowSelectEmployee = true;
                this.isShowPrivateCar = false;
            },
            turnToImport: function () {
                this.$router.go({
                    path: '/importMould',
                    name: 'importMould',
                    query: {
                        importType: 'privateCar'
                    }
                })
            },
            exportData: function () {
                this.itemsLoading = true;
                let ajaxData = {};
                ajaxData[this.searchType] = this.searchContent;
                $.ajax({
                    url: `${base.gAjaxUrl.privateCar}export/`,
                    type:'POST',
                    contentType: "application/json",
                    data: JSON.stringify(ajaxData),
                }).always((data)=>{
                    this.itemsLoading = false;
                    this.$route.router.go({path: '/job'});
                    // layer.msg('最新的一条数据请重新刷新哦',{icon:1,time:3000});
                })
            }
        },
        filters:{},
        components:{
            select_employee, add_private
        },
    }
</script>