<template>
    <!-- 添加 -->
    <add_princioal :title="dialogTitle" :type="dialogType" :data="dialogData" v-if="isShowAddPrincioalDialog" v-on:dialog-close="addPrincioalDialogClose" v-on:dialog-save="addPrincioalDialogSave"></add_princioal>
    <add_approver :title="dialogTitle" :type="dialogType" :data="dialogData" :level="dialogLevel" v-if="isShowAddApproverDialog" v-on:dialog-close="addApproverDialogClose" v-on:dialog-save="addApproverDialogSave"></add_approver>

    <section class="Hui-article-box">
        <div class="page-container bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body fw-b">
                    <span class="f-20">负责/审批人管理</span>
                </div>
            </div>
            <div class="bk-gray radius mt-10 bgc-fff mb-20">
                <div class="pd-15 clearfix">
                    <span>
                        <a class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="clickAddPrincioal(princioals[0])"><i class="Hui-iconfont">&#xe600;</i>维修负责人设置</a>
                    </span>
                </div>
                <table class="table table-border table-bg table-striped">
                    <thead class="text-c">
                        <tr>
                            <th>头像</th>
                            <th>姓名/性别</th>
                            <th>部门/职位</th>
                            <th>工号</th>
                            <th>电话</th>
                            <!--<th>审批属性</th>-->
                            <!--<th>审批模块</th>-->
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="text-c" v-for="item in princioals">
                            <td><img class="avatar" v-bind:src="item.staff_vo.avatar?item.avatar:'./src/assets/images/avatar-default.jpg'"/></td>
                            <td>{{item.staff_vo.real_name}}/{{item.staff_vo.sex==1?'男':'女'}}</td>
                            <td>{{item.staff_vo.department_vo.department_name}}/{{item.staff_vo.position}}</td>
                            <td>{{item.staff_vo.job_number}}</td>
                            <td>{{item.staff_vo.phone}}</td>
                            <!--<td>维修负责人</td>-->
                            <!--<td>公务车报修</td>-->
                            <td>
                                <a title="删除" href="javascript:;" class="ml-5" v-on:click="deletePrincioal(item.id)"><i class="Hui-iconfont">&#xe6e2;</i></a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="no-data text-c mt-20 mb-20" v-if="noDataPrincioals">没有相关数据</div>
                <div class="m-loading" v-if="itemsLoading">
                    <div class="cube1"></div>
                    <div class="cube2"></div>
                </div>
            </div>
            <div class="bk-gray radius mt-10 bgc-fff mb-20">
                <div class="pd-15 clearfix">
                    <span>
                        <a class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="clickAddApprover(approversN[0], 'normal')"><i class="Hui-iconfont">&#xe600;</i>普通报价审批人设置</a>
                    </span>
                </div>
                <table class="table table-border table-bg table-striped">
                    <thead class="text-c">
                        <tr>
                            <th>头像</th>
                            <th>姓名/性别</th>
                            <th>部门/职位</th>
                            <th>工号</th>
                            <th>电话</th>
                            <!--<th>审批属性</th>-->
                            <!--<th>审批模块</th>-->
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="text-c" v-for="item in approversN">
                            <td><img class="avatar" v-bind:src="item.staff_vo.avatar?item.avatar:'./src/assets/images/avatar-default.jpg'"/></td>
                            <td>{{item.staff_vo.real_name}}/{{item.staff_vo.sex==1?'男':'女'}}</td>
                            <td>{{item.staff_vo.department_vo.department_name}}/{{item.staff_vo.position}}</td>
                            <td>{{item.staff_vo.job_number}}</td>
                            <td>{{item.staff_vo.phone}}</td>
                            <!--<td>维修负责人</td>-->
                            <!--<td>公务车报修</td>-->
                            <td>
                                <a title="删除" href="javascript:;" class="ml-5" v-on:click="deleteApprover(item.id)"><i class="Hui-iconfont">&#xe6e2;</i></a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="no-data text-c mt-20 mb-20" v-if="noDataPrincioals">没有相关数据</div>
                <div class="m-loading" v-if="itemsLoading">
                    <div class="cube1"></div>
                    <div class="cube2"></div>
                </div>
            </div>
            <div class="bk-gray radius mt-10 bgc-fff mb-20">
                <div class="pd-15 clearfix">
                    <span>
                        <a class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="clickAddApprover(approversS[0], 'senior')"><i class="Hui-iconfont">&#xe600;</i>高级报价审批人设置</a>
                    </span>
                </div>
                <table class="table table-border table-bg table-striped">
                    <thead class="text-c">
                        <tr>
                            <th>头像</th>
                            <th>姓名/性别</th>
                            <th>部门/职位</th>
                            <th>工号</th>
                            <th>电话</th>
                            <!--<th>审批属性</th>-->
                            <!--<th>审批模块</th>-->
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="text-c" v-for="item in approversS">
                            <td><img class="avatar" v-bind:src="item.staff_vo.avatar?item.avatar:'./src/assets/images/avatar-default.jpg'"/></td>
                            <td>{{item.staff_vo.real_name}}/{{item.staff_vo.sex==1?'男':'女'}}</td>
                            <td>{{item.staff_vo.department_vo.department_name}}/{{item.staff_vo.position}}</td>
                            <td>{{item.staff_vo.job_number}}</td>
                            <td>{{item.staff_vo.phone}}</td>
                            <!--<td>维修负责人</td>-->
                            <!--<td>公务车报修</td>-->
                            <td>
                                <a title="删除" href="javascript:;" class="ml-5" v-on:click="deleteApprover(item.id)"><i class="Hui-iconfont">&#xe6e2;</i></a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="no-data text-c mt-20 mb-20" v-if="noDataPrincioals">没有相关数据</div>
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
<script>
    import * as base from '../assets/js/base.js';
    import add_princioal from "../components/addVehicleRepairPrincioal.vue";
    import add_approver from "../components/addVehicleRepairApprovers.vue";

    export default{
        ready(){
            let that = this;
            this.getPrincioalList();
            this.getApproverList();
        },
        data: function(){
            return{
                noDataPrincioals:false,
                noDataApprovesN: false,
                noDataApprovesS: false,
                itemsLoading:false,
                isShowAddPrincioalDialog:false,
                isShowAddApproverDialog:false,
                princioals: [],
                approversN: [], //普通审批人
                approversS: [], //高级审批人
                dialogTitle:'添加审批人',
                dialogType:'add',
                dialogData:'',
                dialogLevel: 1,
            }
        },
        methods: {
            addPrincioalDialogClose:function(data){
                this.isShowAddPrincioalDialog = false;
            },
            addPrincioalDialogSave:function(data){
                this.isShowAddPrincioalDialog = false;
                this.getPrincioalList();
            },
            addApproverDialogClose:function(data){
                this.isShowAddApproverDialog = false;
            },
            addApproverDialogSave:function(data){
                this.isShowAddApproverDialog = false;
                this.getApproverList();
            },
            //设置车辆维修负责人
            clickAddPrincioal:function(data){
                if(!data){
                    this.dialogType='add';
                }else{
                    this.dialogType='modify';
                }
                this.dialogTitle='设置维修负责人';
                this.dialogData=data;
                this.isShowAddPrincioalDialog = true;
            },
            //设置审批人
            clickAddApprover:function(data,type){
                if(type == 'normal'){
                    this.dialogTitle='设置普通审批人';
                    this.dialogLevel = 1;
                }else if(type == 'senior'){
                    this.dialogTitle='设置高级审批人';
                    this.dialogLevel = 2;
                }
                if(!data){
                    this.dialogType='add';
                }else{
                    this.dialogType='modify';
                }
                this.dialogData=data;
                this.isShowAddApproverDialog = true;
            },
            //获取车辆维修负责人列表
            getPrincioalList:function(){
                $.ajax({
                    url: base.gAjaxUrl.vehicleRepairprincioal,
                    type: 'GET',
                })
                .always((data)=>{
                    let resultData = data;
                    this.princioals = resultData;
                    if(resultData && resultData.length != 0){
                        this.noDataPrincioals = false;
                    }else{
                        this.noDataPrincioals = true;
                    }
                });
            },
            //获取车辆维修审价人列表
            getApproverList:function(){
                let that = this;
                $.ajax({
                    url: base.gAjaxUrl.vehicleRepairapprovers,
                    type: 'GET',
                })
                .always((data)=>{
                    let resultData = data.results;
                    that.approversS = [];
                    that.approversN = [];
                    if(resultData && resultData.length != 0){
                        $.each(resultData,function(index,data){
                            if(data.level == 1){
                                that.noDataApprovesN = false;
                                that.approversN.push(data);
                            }else{
                                that.noDataApprovesS = false;
                                that.approversS.push(data);
                            }
                        })
                    }else{
                        this.noDataApprovesN = true;
                        this.noDataApprovesS = true;
                    }
                });
            },
            //删除车辆维修负责人
            deletePrincioal:function(id){
                let that = this;
                layer.confirm('删除须谨慎，确认要删除吗？',(index)=>{

                    $.ajax({
                        url: `${base.gAjaxUrl.vehicleRepairprincioal}${id}/`,
                        type: 'DELETE',
                    })
                    .always((data)=>{
                        layer.msg('删除成功',{icon:1,time:1000});
                        that.getPrincioalList();
                    })
                });
            },
            //删除车辆维修审价人
            deleteApprover:function(id){
                let that = this;
                layer.confirm('删除须谨慎，确认要删除吗？',(index)=>{

                    $.ajax({
                        url: `${base.gAjaxUrl.vehicleRepairapprovers}${id}/`,
                        type: 'DELETE',
                    })
                    .always((data)=>{
                        layer.msg('删除成功',{icon:1,time:1000});
                        that.getApproverList();
                    })
                });
            },            
        },
        components: {
            add_princioal,
            add_approver,
        }
    }
</script>