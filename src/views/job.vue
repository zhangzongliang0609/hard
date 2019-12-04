<template>
    <section class="Hui-article-box">
    <div class="page-container">
        <p>温馨小提示：最新的数据请及时刷新后下载。</p>
        <table class="table table-border table-bordered table-hover table-bg  mt-20 ">
            <thead>
                <tr class="text-c">
                    <th>创建时间</th>
                    <th>任务名称</th>
                    <th>状态</th>
                    <th>下载地址</th>
                    <th width="70">操作</th>
                </tr>
            </thead>
            <tbody  v-if="!noData">
                <tr class="text-c" v-for="item in items">
                    <td>{{item.ctime}}</td>
                    <td>{{item.job_name}}</td>
                    <td>{{item.status_name}}</td>
                    <td>
                        <a title="下载", href={{item.download_url}} class="ml-5">{{item.status == 1 ? '点击下载':'请及时刷新后点击下载'}}</a>

                    </td>
                    <td class="f-14">
                        <a title="删除" href="javascript:;" class="ml-5" v-on:click="deleteEmployee(item.id)"><i class="Hui-iconfont">&#xe6e2;</i></a>
                    </td>
                </tr>
            </tbody>
        </table>
        <div id="J-page" class="m-page" v-show="!noData"></div>
        <div class="m-loading" v-if="itemsLoading">
            <div class="cube1"></div>
            <div class="cube2"></div>
        </div>
        <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
    </div>
    </section>
</template>
<script>
    import * as base from '../assets/js/base.js';
    let jobsOps = null;

    export default{
        ready(){
            let that = this;
            jobsOps = {
                params: {

                },
                page: 1,
                page_size: 10,

            };
            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-page',tpageToal,jobsOps.page,count)
            });
//            $.ajax({
//                url: base.gAjaxUrl.jobs,
//                type: 'GET',
//            })
//            .always((data)=>{
//                this.jobItem = data.results
//            })
        },
        data:function(){
            return {
                noData:false,
                itemsLoading: false,
                isShowAddDialog:false,
                isShowImportDialog:false,
                items: [],
                searchInput:'',
                dialogTitle:'',
                dialogType:'',
                dialogData:''
            }
        },
        methods: {
            //初始化分页
            initPage:function(obj,tpageToal='4',current='1',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:current,
                    count:count,
                    callback:(p)=>{
                            jobsOps.page = p;
                            this.queryAjax();
                        }
                    });
            },
            queryAjax:function(callback=function(){}){
                this.itemsLoading = true;
                //修改参数
                $.ajax({
                    url: `${base.gAjaxUrl.jobs}?page=${jobsOps.page}&page_size=${jobsOps.page_size}`,
                    type: 'GET'
                })
                .always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
                        let resultData = data.results;
                        this.items = resultData;
                        // console.log(this.items);
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
                //重置第一页
                // staffsOps.param.page = 1

                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-page',tpageToal,jobsOps.page,count)
                });                
            },
            //删除
            deleteEmployee:function(id){
                let that = this;

                layer.confirm('删除须谨慎，确认要删除吗？',(index)=>{
                    $.ajax({
                        url: `${base.gAjaxUrl.jobs}${id}/`,
                        type: 'DELETE',
                    })
                    .always((data)=>{
                        layer.msg('删除成功',{icon:1,time:1000});
                        that.getList();

                    })
                });
            }
        },
//        components:{
//            add
//        }
    }

</script>