<template>
    <!-- 添加 -->
    <add :title="dialogTitle" :type="dialogType" :data="dialogData" :classid="materialclassesId" v-if="isShowAddDialog" v-on:dialog-close="addDialogClose" v-on:dialog-save="addDialogSave"></add>
    <add_class :title="dialogTitle" :type="dialogType" :data="dialogData" v-if="isShowAddClassDialog" v-on:dialog-close="addClassDialogClose" v-on:dialog-save="addClassDialogSave"></add_class>
    <sel :id="materialclassesId" :items="materialclasses" v-if="isShowSelected" v-on:dialog-close="selClose" v-on:dialog-save="sendExport"></sel>


    <section class="Hui-article-box">
        <div class="page-container bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body">
                    <span class="f-20 fw-b">材料管理</span>
                </div>
            </div>
            <div class="mt-10 bgc-fff clearfix">
                <div class="materialclasses bk-gray radius bgc-fff f-l">
                    <div class="materialsTop"><a class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="clickAddClass()">添加材料类型</a></div>
                    <div class="all clearfix">
                        <span class="fw-b lh-30">全部</span>
                        <a class="btn btn-primary radius f-r" href="javascript:;" v-on:click="clickShowModify()">编辑</a>
                    </div>
                    <ul>
                        <li class="item clearfix" v-for="item in materialclasses" v-on:click="clickItem(item)">
                            <span class="text-l fw-b name" v-bind:class="[item.index==itemIndex?'curr':'']">{{item.name}}</span>
                            <span class="f-r ml-15" v-if="isShowModify">
                                <a class="mr-5" href="javascript:;" v-on:click="clickModifyClass(item)"><i class="Hui-iconfont">&#xe6df;</i></a>
                                <a href="javascript:;" v-on:click="deleteClass(item)"><i class="Hui-iconfont">&#xe6a6;</i></a>
                            </span>
                        </li>
                    </ul>
                </div>
                <div class="materials bk-gray radius bgc-fff">
                    <div class="pt-10 pb-10 clearfix">
                        <a id="exportData" class="btn btn-secondary radius f-r" v-on:click="exportData()">批量导出</a>
                        <a href="javascript:;" class="btn btn-secondary radius f-r mr-15" v-on:click="turnToImport()">批量导入</a>
                        <a class="btn btn-primary radius mr-15 f-r" href="javascript:;" v-on:click="clickAdd()">添加材料</a>
                    </div>
                    <table class="table table-border table-bg table-striped pr-10 bor-l bor-r">
                        <thead class="text-c">
                            <tr>
                                <th>材料名称</th>
                                <th>规格型号</th>
                                <th>品牌</th>
                                <th>属性</th>
                                <th>单位</th>
                                <!--<th>单价(元)</th>-->
                                <th>材料来源</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="text-c" v-for="item in items">
                                <td>{{item.name}}</td>
                                <td>{{item.format}}</td>
                                <td>{{item.brand}}</td>
                                <td>{{item.prop}}</td>
                                <td>{{item.unit}}</td>
                                <!--<td>{{item.price}}</td>-->
                                <td>{{item.source}}</td>
                                <td>
                                    <a class="mr-10" href="javascript:;" v-on:click="clickModify(item)"><i class="Hui-iconfont">&#xe6df;</i></a>
                                    <a href="javascript:;" title="删除" v-on:click="deleteFault(item)"><i class="Hui-iconfont">&#xe6e2;</i></a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div id="J-page" class="m-page" v-show="!noData"></div>
                    <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
                </div>
            </div>
        </div>
        <div class="m-loading" v-if="itemsLoading">
            <div class="cube1"></div>
            <div class="cube2"></div>
        </div>
    </section>
</template>
<style lang="less" scoped rel="stylesheet/less">
    .materialclasses{
        width: 198px;
        border: 1px solid #eee;
        overflow: auto;
    }
    .materialsTop{
        padding: 10px;
        text-align: center;
        border-bottom: 1px solid #eee;
    }
    .materialclasses ul{
        max-height: 450px;
        overflow: auto;
    }
    .materialclasses .item{
        padding: 4px 10px;
        border-bottom: 1px solid #eee;
        text-align: left;
        cursor: pointer;
    }
    .materialclasses .item.all{
        cursor: default;
    }
    .materialclasses .item .name{
        line-height: 28px;
    }
    .materialclasses .item .name.curr{
        color: #206afc
    }
    .materialclasses .item.all span{
        line-height: 32px;
        color: #206afc;
    }
    .materials{
        overflow:hidden;
        padding-right: 10px
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import add from "../components/addMaterials.vue";
    import add_class from "../components/addMaterialclasses.vue";
    import sel from "../components/selectMaterials.vue";

    let materialOps = null;

    export default{
        name: 'materials',
        ready(){

            materialOps = {
                param:{
                    material_class: '',
                    page:1,
                    page_size:10,
                }
            };
            this.getMaterialclassesList();
            // this.getList();
        },
        data: function(){
            return{
                noData:false,
                itemsLoading:false,
                isShowAddDialog:false,
                isShowAddClassDialog:false,
                isShowModify: false,
                isShowSelected: false, // 是否显示选择框
                itemIndex: 0,
                items: [],
                materialclasses: [],
                materialclassesId: '',
                dialogType:'add',
                dialogTitle:'添加大分类',
                dialogData:{},
                importData: {},
            }
        },
        methods: {
            addDialogClose:function(data){
                this.isShowAddDialog = false;
            },
            addDialogSave:function(data){
                this.isShowAddDialog = false;
                this.isShowModify = false;
                this.getList();
            },
            addClassDialogClose:function(data){
                this.isShowAddClassDialog = false;
                this.isShowModify = false;
            },
            addClassDialogSave:function(data){
                this.isShowAddClassDialog = false;
                this.isShowModify = false;
                this.getMaterialclassesList();
            },
            clickAdd:function(){
                this.isShowAddDialog = true;
                this.dialogTitle = '添加维修材料';
                this.dialogType='add';
            },
            clickModify:function(item){
                this.isShowAddDialog = true;
                this.dialogTitle = '修改维修材料';
                this.dialogType = 'modify';
                this.dialogData = item;
            },
            clickAddClass:function(){
                this.isShowAddClassDialog = true;
                this.dialogType='add';
                this.dialogTitle='添加维修材料类型';
            },
            clickModifyClass:function(data){
                this.isShowAddClassDialog = true;
                this.dialogType='modify';
                this.dialogTitle='修改维修材料类型';
                this.dialogData=data;
            },
            deleteClass:function(data){
                let that = this;
                
                layer.confirm(
                    `确定要删除维修材料类型：${data.name}及其包含的材料列表吗？`, 
                    {
                        title: '删除维修材料类型'
                    },
                    ()=>{
                        $.ajax({
                            url: `${base.gAjaxUrl.materialclasses}${data.id}/`,
                            type: 'DELETE',
                        })
                        .always((data)=>{
                            layer.msg('删除成功',{icon:1,time:1000});
                            that.getMaterialclassesList();
                            that.isShowModify = false;
                        })},
                    ()=>{
                        that.isShowModify = false;
                    }
                );
            },
            //显示或隐藏材料类型按钮
            clickShowModify:function(){
                this.isShowModify = !this.isShowModify;
            },
            clickItem:function(item){
                this.itemIndex = item.index;
                this.materialclassesId = item.id;
                this.getList(1);
            },
            //初始化分页
            initPage:function(obj,tpageToal='4',current='1',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:current,
                    count:count,
                    callback:(p)=>{
                        materialOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            //获取材料列表
            getList:function(reset=0){
                let that = this;
                //重置第一页
                if(reset){
                    materialOps.param.page = 1
                }
                this.queryAjax((tpageToal='4',count='0')=>{
                    that.initPage('#J-page',tpageToal,materialOps.param.page,count)
                });
            },
            queryAjax:function(callback=function(){}){
                //修改参数
                this.itemsLoading = true;
                materialOps.param.material_class = this.materialclassesId;

                $.ajax({
                    url: base.gAjaxUrl.materials,
                    type: 'GET',
                    data: materialOps.param
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
                        this.itemsLoading = false;
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
            //获取材料类型列表
            getMaterialclassesList:function(callback=function(){}){
                $.ajax({
                    url: base.gAjaxUrl.materialclasses,
                    type: 'GET',
                    data: {
                        page: 1,
                        page_size: 999999,
                    }
                }).always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
                        let resultData = data.results;
                        for(let i=0; i<resultData.length; i++){
                            resultData[i].index = i;
                        }
                        this.materialclasses = resultData;
                        
                        if(resultData && resultData.length){
                            this.materialclassesId = resultData[0].id;
                            this.noData = false;
                            //回调
                            //callback();
                            this.getList();
                        }else{
                            this.noData = true;
                        }
                    });
                })
            },
            //删除
            deleteFault:function(item){
                let that = this;
                layer.confirm(
                    '删除须谨慎，确认要删除吗？',
                    (index)=>{
                        if($('tbody tr.text-c').length == 1 && materialOps.param.page>1){
                            materialOps.param.page--;
                        }
                        $.ajax({
                            url: `${base.gAjaxUrl.materials}${item.id}/`,
                            type: 'DELETE',
                        })
                        .always((data)=>{
                            layer.msg('删除成功',{icon:1,time:1000});
                            that.getList(1);
                            that.isShowDelete = false;
                        })},
                    ()=>{
                        that.isShowDelete = false;
                    }
                );
            },
            turnToImport: function () {
                this.$router.go({
                    path: '/importMould',
                    name: 'importMould',
//                    params: { // 传递无效
//                        importType: 'material'
//                    },
                    query: {
                        importType: 'material'
                    }
                })
            },
            exportData: function () {
                this.isShowSelected = true;
            },
            selClose: function () {
                this.isShowSelected = false;
            },
            sendExport: function (idsArr) {
                this.itemsLoading = true;
                this.selClose();
//                console.log("idsArr: ", idsArr);
                $.ajax({
                    url: `${base.gAjaxUrl.materials}export/`,
                    type:'POST',
                    contentType: "application/json",
                    data: JSON.stringify({
                        material_class: idsArr
                    }),
                }).always((data)=>{
                    this.itemsLoading = false;
                    this.$route.router.go({path: '/job'});
                    // layer.msg('最新的一条数据请重新刷新哦',{icon:1,time:3000});
                })
            }
        },
        components: {
            add,
            add_class,
            sel,
        }
    }
</script>