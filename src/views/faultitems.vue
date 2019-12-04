<template>
    <!-- 添加 -->
    <add :title="dialogTitle" :type="dialogType" :data="dialogData" v-if="isShowAddDialog" v-on:dialog-close="addDialogClose" v-on:dialog-save="addDialogSave" v-on:dialog-save-add="addDialogSaveAndAdd"></add>
    <section class="Hui-article-box">
        <div class="page-container bgc-f5">
            <div class="panel panel-default radius">
				<div class="panel-body">
                    <span class="f-20 fw-b">故障项目管理</span>
                </div>
			</div>
            <div class="bk-gray radius mt-10 bgc-fff">
                <div class="pd-10 clearfix bor-b">
                    <span class="f-r">
                        <a v-show="!isShowModify" class="btn btn-primary radius mr-5" title="编辑" href="javascript:;" v-on:click="clickModify()"><i class="Hui-iconfont">&#xe6df;</i>&nbsp;&nbsp;编辑</a>
                        <a v-show="isShowModify" class="btn btn-primary radius mr-5" title="编辑" href="javascript:;" v-on:click="clickModify()"><i class="Hui-iconfont">&#xe6df;</i>&nbsp;&nbsp;完成编辑</a>
                        <a v-show="!isShowDelete" class="btn btn-primary radius mr-5 ml-5" title="删除" href="javascript:;" v-on:click="clickDelete()"><i class="Hui-iconfont">&#xe6e2;</i>&nbsp;&nbsp;删除</a>
                        <a v-show="isShowDelete" class="btn btn-primary radius mr-5 ml-5" title="删除" href="javascript:;" v-on:click="clickDelete()"><i class="Hui-iconfont">&#xe6e2;</i>&nbsp;&nbsp;完成删除</a>
                    </span>
                </div>
                <div id="tab_demo" class="HuiTab faultItem clearfix">
                    <div class="firstItems f-l">
                        <div class="tabBar clearfix">
                            <div class="clearfix text-c">
                                <span class="items addItem" v-on:click="clickAdd('firstItem')">添加大类</span>
                            </div>
                            <div class="clearfix text-c" v-for="item in faultitems" role="tab" v-on:click="clickTab($index)" v-bind:class="[item.index==itemIndex?'curr':'']">
                                <span class="items">
                                    <span class="itemName text-overflow">{{item.fault_name}}</span>
                                    <a class="modify" href="javascript:;" v-on:click="modifyFault(item,'firstItem')" v-if="isShowModify"><i class="Hui-iconfont">&#xe6df;</i></a>
                                    <a class="delete" href="javascript:;" v-on:click="deleteFault(item,'firstItem')" v-if="isShowDelete"><i class="Hui-iconfont">&#xe6a6;</i></a>
                                </span>
                                <i class="icon-arrow" v-if="item.index==itemIndex"><img src="../assets/images/arrow.png"></i>
                            </div>
                        </div>
                    </div>
                    <div class="secondItems" v-for="item in faultitems" v-show="$index == itemIndex">
                        <div class="items addItem" v-on:click="clickAdd('secondItem',item)">添加小类</div>
                        <div class="items" v-for="data in item.items" >
                            <span>{{data.fault_name}}</span>
                            <a class="modify" href="javascript:;" v-on:click="modifyFault(data,'secondItem')" v-if="isShowModify"><i class="Hui-iconfont">&#xe6df;</i></a>
                            <a class="delete" href="javascript:;" v-on:click="deleteFault(data,'secondItem')" v-if="isShowDelete"><sup><i class="Hui-iconfont">&#xe6a6;</i></sup></a>
                        </div>
                    </div>
                </div>
                <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
                <div class="m-loading" v-if="itemsLoading">
                    <div class="cube1"></div>
                    <div class="cube2"></div>
                </div>
            </div>
        </div>
    </section>
</template>
<style lang="less" rel="stylesheet" scoped>
    .faultItem{
        background-color:#dfe2e4;
    }
    .faultItem .firstItems{
        overflow: auto;
        max-height: 482px;
    }
    .faultItem .tabBar{
        border-bottom: none;
        background-color:#fff;
    }
    .faultItem .tabBar div{
        width: 140px;
        position: relative;
    }
    .faultItem .tabBar .items{
        box-sizing: border-box;
        width: 100px;
        text-align: center;
        border: 1px solid #dcdcdc;
        border-radius: 4px;
        margin: 6px 0;
        font-weight: normal;
        position:relative;
        padding: 0;
        background-color: #f7f7f7;
        float: none;
    }
    .faultItem .tabBar .items span{
        font-weight: normal;
        background-color: #f7f7f7;
        line-height: 28px;
        height: 28px;
    }
    .faultItem .itemName{
        width: 68px;
    }
    .faultItem .items.addItem{
        line-height: 28px;
        background-color: #206afc;
        color: #fff;
        border-color: #206afc;
        cursor: pointer;
        float: none;
    }
    .faultItem .tabBar .curr .items .itemName{
        background-color: #dfe2e4;
    }
    .faultItem .icon-arrow{
        position: absolute;
        top: 8px;
        right: 0px;
    }
    .faultItem .icon-arrow img{
        width: 10px;
        height: 22px;
    }
    .faultItem .secondItems{
        overflow: hidden;
        padding: 10px;
        background-color: #dfe2e4;
    }
    .faultItem .secondItems div{
        border: 1px solid #dcdcdc;
        display: inline-block;
        padding: 0px 20px;
        margin: 6px 10px;
        background-color: #fff;
        line-height: 28px;
        border-radius: 4px;
        position: relative;
    }
    .faultItem .secondItems div a{
        text-decoration: none;
    }
    .faultItem .modify{
        position:absolute;
        top: 4px;
        right: 4px;
        display: block;
        width: 14px;
        height: 14px;
        line-height: 20px;
        color: #206afc;
        text-decoration: none;
    }
    .faultItem .delete{
        position:absolute;
        top: -6px;
        right: -6px;
        border-radius: 50%;
        background-color: red;
        display: block;
        width: 14px;
        height: 14px;
        line-height: 12px;
        color: #fff;
        text-decoration: none;
        text-align: center;
    }
    .faultItem .secondItems .delete{
        line-height: 20px;
    }
</style>
<script>
    import * as base from '../assets/js/base.js';
    import add from "../components/addFaultItem.vue";

//    let repairOps = {
//        param:{
//            status: '',
//            approval_status: '',
//            repair_type: '',
//            search:'',
//            page:1,
//            page_size:10,
//        }
//    }

    export default{
        ready(){
            let that = this;

            //this.queryAjax((tpageToal='4')=>{
            //    this.initPage('#J-page',tpageToal,repairOps.param.page)
            //});
            //this.getRepairTypeList();
            this.queryAjax();
        },
        data: function(){
            return{
                noData:false,
                itemsLoading:false,
                isShowAddDialog:false,
                isShowImportDialog:false,
                isShowDelete:false,
                isShowModify: false,
                itemIndex: 0,
                faultitems: [],
                firstDialogType:'add',
                firstDialogTitle:'添加大分类',
                firstDialogData:{},
            }
        },
        methods: {
            addDialogClose:function(data){
                this.isShowAddDialog = false; 
//                this.isShowModify = false;
//                this.getList();
            },
            addDialogSave:function(data){
                this.isShowAddDialog = false;
//                this.isShowModify = false;
                this.getList();
            },
            addDialogSaveAndAdd:function(data){
                this.isShowAddDialog = true;
                this.getList();
            },
            clickAdd:function(type,data={}){
                this.isShowAddDialog = true;
                this.dialogType='add';
                this.dialogData = data;
                this.dialogData.faultType = type
                if(type == 'firstItem'){
                    this.dialogTitle='添加大分类';
                }
                else if(type == 'secondItem'){
                    this.dialogTitle='添加小分类';
                }
                this.isShowDelete = false;
                this.isShowModify = false;
            },
            clickModify:function(){
                if(this.faultitems.length == 0){
                    layer.msg('请添加大类',{icon:2,time:1000});
                    return;
                }
                this.isShowModify = !this.isShowModify;
                this.isShowDelete = false;
            },
            //修改
            modifyFault:function(item,type){
                this.dialogTitle='修改报修类型';
                this.dialogType='modify';
                this.dialogData=item;
                this.dialogData.faultType = type
                this.isShowAddDialog = true;
                if(type == 'firstItem'){
                    this.dialogTitle='编辑大分类';
                }else if(type == 'secondItem'){
                    this.dialogTitle='编辑小分类'
                }
            },
            clickDelete:function(){
                if(this.faultitems.length == 0){
                    layer.msg('请添加大类',{icon:2,time:1000});
                    return;
                }
                this.isShowDelete = !this.isShowDelete;
                this.isShowModify = false;
            },
            clickTab:function(index){
                this.itemIndex = index;
            },
            //获取故障项目列表
            getList:function(){
                let that = this;
                this.queryAjax();
            },
            queryAjax:function(callback=function(){}){
                this.itemsLoading = true;

                $.ajax({
                    url: base.gAjaxUrl.faultitems,
                    type: 'GET',
                    //data:repairOps.param
                })
                .always((data)=>{
                    base.ajaxCallback(data,()=>{
                        this.itemsLoading = false;
                        let resultData = data;
                        for(let i=0; i<resultData.length; i++){
                            resultData[i].index = i;
                        }
                        this.faultitems = resultData;
                        if(resultData && resultData.length){
                            this.noData = false;
                            //回调
                            callback(data.num_pages);
                        }else{
                            this.noData = true;
                        }
                    });
                })
            },
            //删除
            deleteFault:function(item,type){
                let that = this;
                let title = '';
                let temple = '';
                let ajaxData = {};
                if(type == 'firstItem'){
                    title = '删除大分类'
                    temple = `现在要删除故障项目大分类：${item.fault_name}<br/>将会删除大分类${item.fault_name}下所包含的所有故障项目小分类  共${item.items.length}项`;
                    ajaxData = {
                    }
                }else if(type == 'secondItem'){
                    title = '删除小分类'
                    temple = `现在要删除故障项目小分类：${item.fault_name}`;
                    ajaxData = {
                        subclass: true
                    }
                }
                
                layer.confirm(
                    temple, 
                    {
                        title: title
                    },
                    (index)=>{
                        $.ajax({
                            url: `${base.gAjaxUrl.faultitems}${item.id}/`,
                            type: 'DELETE',
                            data: ajaxData
                        })
                        .always((data)=>{
                            layer.msg('删除成功',{icon:1,time:1000});
                            that.getList();
//                            that.isShowDelete = false;
                        })},
                    ()=>{
//                        that.isShowDelete = false;
                    }
                );
            },
        },
        components: {
            add
        }
    }
</script>