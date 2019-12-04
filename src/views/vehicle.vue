<template>


    <vehicle-dateil v-on:dialog-close="detailsClose" v-if="isShowDetails" :data="details" :vehicle="dialogVehicle" :port="port" ></vehicle-dateil>

    <!-- 添加 -->
    <add :title="dialogTitle" :vehicle="dialogVehicle" :type="dialogType" :data="dialogData" v-if="isShowAddDialog" v-on:dialog-close="addDialogClose" v-on:dialog-save="addDialogSave"></add>
    <set :title="dialogTitle" :type="port" :data="dialogData" v-if="isShowSetPositioningDialog" v-on:dialog-close="setDialogClose" v-on:dialog-save="setDialogSave"></set>

    <section class="Hui-article-box">
    <div class="page-container">
        <div class="text-l clearfix">
            关键字：
            <input id="searchInput"
                   autocomplete="off"
                   type="text"
                   placeholder="车牌号"
                   style="width:200px"
                   class="input-text"><button v-on:click="getList(1)" class="btn btn-success radius-r" type="button"><i class=" Hui-iconfont">&#xe665;</i></button>
        </div>


        <div class="cl mt-10 mb-10 pt-10 pb-10">
                <a class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="clickAdd()"><i class="Hui-iconfont">&#xe600;</i> 添加车辆
                </a>
                <!--<a href="javascript:;" class="btn btn-secondary radius f-r" v-on:click="clickImport()"><i class="Hui-iconfont">&#xe616;</i> 批量导入</a>-->
                <a id="exportData" class="btn btn-secondary radius f-r" v-on:click="exportData()">批量导出</a>
                <a href="javascript:;" class="btn btn-secondary radius f-r mr-15" v-on:click="turnToImport()">批量导入</a>
        </div>
        <table class="table table-border table-bordered table-hover table-bg table-sort">
            <thead>
                <tr class="text-c">
                    <!-- <th width="25"><input type="checkbox" value="" name=""></th> -->
                    <th width="70">车牌</th>
                    <th width="70">品牌</th>
                    <th width="70">型号</th>
                    <th width="70">颜色</th>
                    <th width="70">座位数</th>
                    <th width="150">车辆类型</th>
                    <th width="200">备注</th>
                    <th width="70">是否锁定</th>
					<th width="200">定位器ID</th>
                    <th width="70">操作</th>
                    <th width="70">查看详情</th>
                </tr>
            </thead>
            <tbody>
                <tr class="text-c" v-for="item in items">
                    <!-- <td><input type="checkbox" value="" name="">{{item.avatar}}</td> -->
                    <td>{{item.car_no}}</td>
                    <td>{{item.car_brand}}</td>
                    <td>{{item.car_model}}</td>
                    <td>{{item.car_color}}</td>
                    <td>{{item.seats}}</td>
                    <td>{{item.vehicle_type_name}}</td>
                    <td class="remark">{{item.remark}}</td>
                    <td>
                        <img class="w-20 cursor-p" v-bind:src="item.locked?'./src/assets/images/lock_close.png':'./src/assets/images/lock_open.png'" v-on:click="toggleLock(item)" />
                    </td>
                    <td>
                        <span class="cursor-p" v-if="item.position_hardware_vo" v-on:click="clickSetPositioninghardwares(item)">{{item.position_hardware_vo.hardware_no}}<i class="Hui-iconfont fc-5a98de fz-20" >&#xe695;</i></span>
                        <a class="btn btn-primary radius" href="javascript:;" v-if="!item.position_hardware_vo" v-on:click="clickSetPositioninghardwares(item)">绑定定位器</a>
                    </td>
                    <td class="f-14">
                        <a title="编辑" href="javascript:;" v-on:click="clickModify(item)"><i class="Hui-iconfont">&#xe6df;</i></a>
                        <a title="删除" href="javascript:;" class="ml-5" v-on:click="deleteBtn(item.car_no,item.id)"><i class="Hui-iconfont">&#xe6e2;</i></a>
                    </td>
                    <td>
                        <a class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="showDetails(item)">车辆详情
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
        <div id="J-page" class="m-page" v-show="!noData"></div>
        <div class="m-loading" v-if="itemsLoading">
            <div class="cube1"></div>
            <div class="cube2"></div>
        </div>
    </div>
    </section>
</template>

<style lang="less" rel="stylesheet" scoped>
 .avatar {
     width: 50px;
 }
    .remark{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100px;
    }
    .fz-20{
        font-size: 20px;
    }
   .remark:hover{
    white-space:normal;
    overflow: visible;
    text-overflow: clip;
    }

</style>

<script type="text/ecmascript-6">
import * as base from '../assets/js/base.js';
import add from "../components/addVehicle.vue";
import set from "../components/setPositioninghardwares.vue";
import vehicleDateil from "../components/vehicleDetails.vue";

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
                isShowSetPositioningDialog:false,
                isShowDetailDialog:false,
                items: [],
                searchInput:'',
                dialogTitle:'添加部门',
                dialogType:'add',
                dialogData:'',
                dialogVehicle: 'vehicle',
                isShowDetails:false,
                details:{},
                port:base.gAjaxUrl.officialcarvehicles,
                importData: {},

            }
        },
        methods: {
            showDetails:function (data) {
                this.isShowDetails=true;
                this.details = data;
            },
            detailsClose:function () {
                this.isShowDetails=false;
                this.getList();
            },
            addDialogClose:function(data){
                this.isShowAddDialog = false;
            },
            addDialogSave:function(data){
                this.isShowAddDialog = false;
                this.getList();
            },
            setDialogClose:function(data){
                this.isShowSetPositioningDialog = false;
            },
            setDialogSave:function(data){
                this.isShowSetPositioningDialog = false;
                this.getList();
            },
            detailDialogClose:function(data){
                this.isShowDetailDialog = false;
            },
            clickAdd:function(){
                this.dialogType='add';
                this.dialogTitle='添加车辆';
                this.isShowAddDialog = true;
            },
            clickModify:function(data){
                this.dialogTitle='修改资料';
                this.dialogType='modify';
                this.dialogData=data;
                this.isShowAddDialog = true;
            },
            clickSetPositioninghardwares:function(data){
                console.log(data);
                this.dialogTitle='车辆硬件';
                this.dialogData=data;
                this.isShowSetPositioningDialog = true;
            },
            clickDetail:function(data){
                this.dialogTitle='车辆详情';
                this.dialogData=data;
                this.isShowDetailDialog = true;
            },
            toggleLock:function(officialcarVehicle) {
                let url = '';
                let that = this;
                if (officialcarVehicle.locked) {
                    // 解锁
                    url = base.gAjaxUrl.officialcarvehicles+officialcarVehicle.id+'/unlock/'
                } else {
                    // 锁定
                    url = base.gAjaxUrl.officialcarvehicles+officialcarVehicle.id+'/lock/'
                }
                $.ajax({
                    url: url,
                    type: 'GET',
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
//                        officialcarVehicle.locked = data.locked;
                        that.getList();
                    });
                })
            },
            //初始化分页
            initPage:function(obj,tpageToal='4',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:1,
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
                    url: base.gAjaxUrl.officialcarvehicles,
                    type: 'GET',
                    data:staffsOps.param
                })
                .always((data)=>{
                    base.ajaxCallback(data,()=>{
                        let resultData = data.results;
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
            deleteBtn:function(car_num,id){
                let that = this;
                layer.confirm('删除须谨慎，确认要删除【'+car_num+'】吗？',(index)=>{
                    if($('tbody tr.text-c').length == 1 && staffsOps.param.page>1){
                        staffsOps.param.page--;
                    }
                    $.ajax({
                        url: `${base.gAjaxUrl.officialcarvehicles}${id}/`,
                        type: 'DELETE',
                    })
                    .always((data)=>{
                        layer.msg('删除成功',{icon:1,time:1000});
                        that.getList();
                    })
                });
            },
            turnToImport: function () {
                this.$router.go({
                    path: '/importMould',
                    name: 'importMould',
                    query: {
                        importType: 'car'
                    }
                })
            },
            exportData: function () {
                this.itemsLoading = true;
                $.ajax({
                    url: `${base.gAjaxUrl.officialcarvehicles}export/`,
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
            add,
            set,
            vehicleDateil,
        }
    }
</script>
