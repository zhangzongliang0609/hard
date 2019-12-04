<template>
    <section class="Hui-article-box">
        <add v-if="showAdd" :data="currentData" :title="title" :type="type" :source="groupType" @dialog-close="closeAdd" @dialog-save="saveAdd"></add>
        <div class="page-container bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body clearfix">
                    <span class="f-20 fw-b f-l">员工分组管理</span>
                    <div class="search-box f-l ml-20">
                        <input type="text" class="input-text ml-15" v-model="searchInput" placeholder="请输入分组名称">
                        <button v-on:click="getList(1)" class="btn btn-success icon_search" type="button"><i class="f-l Hui-iconfont">&#xe665;</i></button>
                    </div>
                    <a class="btn btn-secondary radius f-r mr-20" title="导出数据" href="javascript:;" v-on:click="clickAdd()">新增员工分组</a>
                </div>

            </div>
            <div class="mt-10 bgc-fff clearfix">
                <div class="materials bk-gray radius bgc-fff">
                    <table class="waterElectricityForm table table-border table-bg table-striped bor-l bor-r">
                        <thead class="text-c">
                        <tr>
                            <th width="">分组名称</th>
                            <th width="">是否启用</th>
                            <th width="">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr class="text-c" v-for="data in items">
                            <td>{{data.name}}</td>
                            <td>
                                <div class="open-box pointer mt-5" :class="{'bc-blue':data.is_active}" @click="clickSwitch(data)">
                                <span class="open-box-round pointer" :class="data.is_active?'open-box-open':'open-box-close'"></span>
                            </div></td>
                            <td>
                                <a class="mr-10" href="javascript:;" v-on:click="clickModify(data)"><i class="Hui-iconfont">&#xe6df;</i></a>
                                <a href="javascript:;" title="删除" v-on:click="deleteItem(data)"><i class="Hui-iconfont">&#xe6e2;</i></a>
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
        position: absolute;
    }
    .td-hide{
        max-width: 100px;
    }
    .search-box{
        .input-text{
            width:200px;
        }
    }

</style>
<script>
    import * as base from '../assets/js/base.js';
    import add from '../components/addGroup'
    let itemOps = {}
    export default{
        ready(){
            itemOps.param ={
                page:1,
                page_size:10,
            }
            this.getList();
        },
        data:function () {
            return{
                itemsLoading:false,
                noData:true,
                items:[],
                showAdd:false,
                currentData:'',
                title:"添加员工分组",
                type:'add',
                groupType:1,
                searchInput:'',
            }
        },
        methods:{
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
            //获取宿舍列表
            getList:function(){
                let that = this;
                itemOps.param.page = 1;
                this.queryAjax((tpageToal='4',count='0')=>{
                    that.initPage('#J-page',tpageToal,itemOps.param.page,count)
                });
            },
            queryAjax:function(callback=function(){}){
                //修改参数
                this.itemsLoading = true;
                let that = this;

                $.ajax({
                    url: `${base.gAjaxUrl.tagGroup}`,
                    type: 'GET',
                    data:{
                       type:1,
                       page:itemOps.param.page,
                       page_size:itemOps.param.page_size,
                       name:that.searchInput,
                    }
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
            clickSwitch:function(data){
                let that = this;
                let message = data.is_active?'关闭':'激活';
                layer.confirm(`确定${message}${data.name}这个分组吗?`,function(){
                    that.loading = true;
                    $.ajax({
                        url:`${base.gAjaxUrl.tagGroup}${data.id}/`,
                        type:"PATCH",
                        data:{
                            is_active:!data.is_active
                        }
                    }).always((data)=>{
                        that.getList();
                    })
                    layer.closeAll();
                })

            },
            clickAdd:function(){
                this.showAdd = true;
                this.title = '添加员工分组';
                this.type = 'add';
            },
            clickModify:function(item){
                this.showAdd = true;
                this.title = '修改员工分组';
                this.type = 'modify';
                this.currentData = item;
            },
            closeAdd:function(){
                this.showAdd = false;
            },
            saveAdd:function(){
                let that  = this;
                this.showAdd = false;
                this.queryAjax((tpageToal='4',count='0')=>{
                    that.initPage('#J-page',tpageToal,itemOps.param.page,count)
                });
            },
            deleteItem:function(data){
                let that = this;
                layer.confirm(`确定删除${data.name}这个分组吗?`,function(){
                    that.itemsLoading = true;
                    $.ajax({
                        url:`${base.gAjaxUrl.tagGroup}${data.id}/`,
                        type:"DELETE",
                    }).always((data)=>{
                        that.itemsLoading = false;
                        if(that.items.length == 1 && itemOps.param.page != 1){
                            itemOps.param.page--;
                        }
                        that.queryAjax((tpageToal='4',count='0')=>{
                            that.initPage('#J-page',tpageToal,itemOps.param.page,count)
                        });
                    })
                    layer.closeAll();
                })
            }
        },
        filters:{},
        events:{},
        components:{
            add:add,
        },
    }
</script>