<template>
    <!-- 添加 -->
    <add :title="dialogTitle" :type="dialogType" :data="dialogData" v-if="isShowAddDialog" v-on:dialog-close="addDialogClose" v-on:dialog-save="addDialogSave"></add>
    <set-tag :url="tagUrl" v-if="showSetTag" :add="addContent" @dialog-close="closeSetTag" :title="title"></set-tag>
    <section class="Hui-article-box">
        <div class="page-container bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body f-20 fw-b">房间类型管理
                    <div class="search-box">
                        <select name="" id="" class="select-box" v-model="searchKey">
                            <option value="type_name">房间类型</option>
                            <option value="content">容纳人数</option>
                            <option value="bed_num">床位</option>
                        </select>
                        <input type="text" class="input-text ml-15" v-model="searchInput">
                        <button v-on:click="getList(1)" class="btn btn-success icon_search" type="button"><i class="f-l Hui-iconfont">&#xe665;</i></button>
                    </div>
                    <span class="f-r">
                        <a class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="setRoomMachine()">添加房间配置</a>
                        <a class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="clickAdd()">添加房间类型</a>
                        <a class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="turnToImport()">批量导入</a>
                    </span>
                </div>

            </div>
            <div class="bk-gray radius mt-10 bgc-fff">
                <div class="pd-15 clearfix">

                    <!-- <div class="text-l clearfix f-r mr-15">
                        <input v-model="searchInput" type="text"  placeholder="名字/工号/手机号" style="width:250px" class="f-l input-text">
                        <button v-on:click="getList(1)" class="btn btn-success" type="button"><i class="f-r Hui-iconfont">&#xe665;</i></button>
                    </div> -->
                </div>
                <table class="table table-border table-bg table-striped">
                    <thead class="text-c">
                        <tr>
                            <th width="120">房间类型</th>
                            <th width="80">容纳人数</th>
                            <th width="120">床位</th>
                            <th width="200">配置</th>
                            <th width="120">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="text-c" track-by="$index" v-for="item in items">
                            <td>{{item.type_name}}</td>
                            <td>{{item.content}}</td>
                            <td>{{item.bed_num}}</td>
                            <td class="max-400">
                                <span v-for="data in item.equipments">{{data.name}}
                                    <span v-if="$index != item.equipments.length - 1">/</span>
                                </span>
                            </td>
                            <!--<td>{{item.has_air_conditioning? '有': '无';}}</td>-->
                            <!--<td>{{item.has_TV? '有': '无';}}</td>-->
                            <!--<td>{{item.has_computer? '有': '无';}}</td>-->
                            <td>
                                <a class="mr-10" href="javascript:;" v-on:click="clickModify(item)"><i class="Hui-iconfont">&#xe6df;</i></a>
                                <a title="删除" href="javascript:;" class="ml-5" v-on:click="deleteItem(item.id)"><i class="Hui-iconfont">&#xe6e2;</i></a>
                            </td>
                        </tr>
                    </tbody>

                </table>
                <div id="J-page" class="m-page" v-show="!noData"></div>
                <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
            </div>
        </div>
        <div class="m-loading" v-if="itemsLoading">
            <div class="cube1"></div>
            <div class="cube2"></div>
        </div>
    </section>
</template>
<style lang="less" scoped rel="stylesheet/less">
    .search-box{
        display: inline-block;
        margin-left: 20px;
        .select-box{
            width: 100px;
            height: 31px;
            margin-right: -22px;
        }
        .input-text{
            width: 200px;
        }
        button{
            margin-left: -10px;
        }
    }
    .bgc-f5{
        background-color: #f5f5f5;
    }
    .fw-b{
        font-weight: bold;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import add from "../components/addRoomtype.vue";
    import setTag from "../components/setBuildingTag.vue";

    let itemOps = null;

    export default{
        ready(){
            itemOps = {
                param:{
                    //search:'',
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
                dialogTitle:'添加房间类型',
                dialogType:'add',
                dialogData:'',
                showSetTag:false,
                tagUrl:base.gAjaxUrl.roomequipments,// 设置标签的url
                searchKey:"type_name",
                title:'房间设备管理',
                addContent:'添加房间设备'
            }
        },
        methods: {
            addDialogClose:function(){
                this.isShowAddDialog = false;
            },
            addDialogSave:function(){
                this.isShowAddDialog = false;
                this.getList();
            },
            clickAdd:function(){
                this.dialogType='add';
                this.dialogTitle='添加房间类型';
                this.isShowAddDialog = true;
            },
            clickModify:function(item){
                this.dialogType='modify';
                this.dialogTitle='修改房间类型';
                this.dialogData=item;
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
            //获取列表
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
                let that = this;
                this.itemsLoading = true;
                //itemOps.param.search = this.searchInput;
                let itemData = {
                    page:itemOps.param.page,
                    page_size:itemOps.param.page_size,
                };
                itemData[this.searchKey] = this.searchInput;
                $.ajax({
                    url: base.gAjaxUrl.roomtypes,
                    type: 'GET',
                    data:itemData,
                })
                .always((data)=>{
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
            //删除
            deleteItem:function(id){
                let that = this;

                layer.confirm('删除须谨慎，确认要删除吗？',(index)=>{

                    if($('tbody tr.text-c').length == 1 && itemOps.param.page>1){
                        itemOps.param.page--; 
                    }; 

                    $.ajax({
                        url: `${base.gAjaxUrl.roomtypes}${id}/`,
                        type: 'DELETE',
                    })
                    .always((data)=>{  
                            layer.msg('删除成功',{icon:1,time:1000});
                            that.getList();
                        
                    })
                });  
            },
            closeSetTag:function () {
                this.showSetTag = false;
            },
            setRoomMachine:function(){
                this.showSetTag = true;
            },
            turnToImport: function () {
                this.$router.go({
                    path: '/importMould',
                    name: 'importMould',
                    query: {
                        importType: 'roomType'
                    }
                })
            },

        },
        components: {
            add,
            setTag
        }
    }
</script>