<template>
    <!-- 添加 -->
    <add :title="dialogTitle" :type="dialogType" :data="dialogData" v-if="isShowAddDialog" v-on:dialog-close="addDialogClose" v-on:dialog-save="addDialogSave"></add>
    <section class="Hui-article-box">
        <div class="page-container">
            <div class="cl pd-5 bg-1 bk-gray mt-20">
            <span class="l">
                <a class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="clickAdd()"><i class="Hui-iconfont">&#xe600;</i> 添加用水类型
                </a>
            </span>
            </div>
            <table class="table table-border table-bordered table-hover table-bg table-sort">
                <thead>
                <tr class="text-c">
                    <!-- <th width="25"><input type="checkbox" value="" name=""></th> -->
                    <th>用水类型</th>
                    <th>单价</th>
                    <th>当前库存</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr class="text-c" v-for="item in items">
                    <!-- <td><input type="checkbox" value="" name="">{{item.avatar}}</td> -->
                    <td>{{item.name}}</td>
                    <td>{{item.price / 100}} 元</td>
                    <td>{{item.stock}}</td>
                    <td>
                        <a title="增加库存" href="javascript:;" class="btn btn-primary radius mr-5" v-on:click="clickModify(item, 'increase')">增加库存</a>
                        <a title="减少库存" href="javascript:;" class="btn btn-primary radius mr-5" v-on:click="clickModify(item, 'reduce')">减少库存</a>
                        <a title="删除当前水类型" href="javascript:;" class="btn btn-primary radius mr-5" v-on:click="deleteBtn(item.name,item.id)">删除当前水类型</a>
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

<style lang="less" scoped>

</style>

<script>
    import * as base from '../assets/js/base.js';
    import add from "../components/addWaterStock.vue";

    let staffsOps = null;

    export default{
        ready () {
            staffsOps = {
                param:{
                    page:1,
                    page_size:10,
                }
            }
            let that = this;

            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-page',tpageToal,staffsOps.param.page,count)
            });

        },
        data:function(){
            return {
                noData:false,
                itemsLoading:false,
                isShowAddDialog:false,
                items: [],
                searchInput:'',
                dialogTitle:'添加用水',
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
                this.getList();
            },
            clickAdd:function(){
                this.dialogType='add';
                this.dialogTitle='添加用水';
                this.dialogData=null;
                this.isShowAddDialog = true;
            },
            clickModify:function(data, para){
                if(para == 'increase') {
                    this.dialogTitle='增加库存';
                    this.dialogType='increase';
                } else {
                    this.dialogTitle='减少库存';
                    this.dialogType='reduce';
                }
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
                        staffsOps.param.page = p
                        this.queryAjax();
                    }
                });
            },
//            expor
            queryAjax:function(callback=function(){}){
                //修改参数
                this.itemsLoading = true;
                staffsOps.param.search = this.searchInput;

                $.ajax({
                    url: base.gAjaxUrl.waterInfo,
                    type: 'GET',
                    data:staffsOps.param
                }).always((data)=>{
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
            getList:function(){
                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-page',tpageToal,staffsOps.param.page,count)
                });
            },
            //删除
            deleteBtn:function(name, id){
                let that = this;
                layer.confirm('确认删除【'+name+'】？',(index)=>{
                    if($('tbody tr.text-c').length == 1 && staffsOps.param.page>1){
                        staffsOps.param.page--;
                    };
                    $.ajax({
                        url: `${base.gAjaxUrl.waterInfo}${id}/`,
                        type: 'DELETE',
                    }).always((data)=>{
                        layer.msg('删除成功',{icon:1,time:1000});
                        that.getList();
                    })
                });
            }
        },
        components:{
            add,
        }
    }
</script>

