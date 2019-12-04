<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">查看来访记录</div>
        <div class="layui-layer-content pd-20">
            <div>来访人:&nbsp;{{item.real_name}}/{{item.phone}}/{{item.vistor_company?item.vistor_company:'--'}}</div>
            <div class="layui-layer-wrap">
                <table class="table table-border table-bordered table-hover table-bg table-sort row">
                    <thead>
                    <tr class="text-c">
                        <th width="200">来访时间</th>
                        <th width="200">开始时间</th>
                        <th width="200">结束时间</th>
                        <th width="100">被访人姓名</th>
                        <th width="150">被访人电话</th>
                        <th width="100">被访人部门</th>
                        <th width="200">来访原因</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="text-c" v-for="item in items">
                        <td>{{item.visitrecord_vo.visit_time}}</td>
                        <td>{{item.arrive_time ? item.arrive_time : "--"}}</td>
                        <td>{{item.leave_time ? item.leave_time : "--"}}</td>
                        <td>{{item.visitrecord_vo.staff_name}}</td>
                        <td>{{item.visitrecord_vo.staff_phone}}</td>
                        <td>{{item.visitrecord_vo.staff_department}}</td>
                        <td>
                            <div class="text-overflow" style="width:200px;">
                                {{item.visitrecord_vo.visit_reason ? item.visitrecord_vo.visit_reason : "--"}}
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div id="L-page" class="m-page row" v-show="!noData"></div>
                <div class="no-data text-c mt-50 row" v-if="noData">没有相关数据</div>
            </div>
        </div>
        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
    </div>
    <div class="m-loading" v-if="loading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
    <div class="layui-layer-shade"></div>
</template>

<style lang="less" scoped>
    .layui-modify{
        width:1000px;
    }
    .avatar{
        width: 50px;
    }
    .radio-wh{
        width: 20px;
        height: 20px;
        cursor: pointer;
    }
</style>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';

    let itemsOps = null;

    export default{
        ready () {

            if(this.type){
                this.isShowAdd = true;
            }
            let that = this;
            itemsOps = {
                param:{
                    page:1,
                    page_size:10,
                }
            };
            base.verticalCenter('.layui-modify');

            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#L-page',tpageToal,count)
            });

        },
        props:['type','item'],
        data:function(){
            return {
                loading:false,
                noData:false,
                items: [],
                searchInput:'',
                selectedEmployees:[],
                isShowAdd:false,
            }
        },
        methods:{
            initPage:function(obj,tpageToal='4',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:1,
                    count:count,
                    callback:(p)=>{
                        itemsOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            getList:function(reset=0){
                let that = this;
                //重置第一页
                if(reset){
                    this.searchInput = $("#searchInput").val();
                    itemsOps.param.page = 1
                }

                this.queryAjax((tpageToal='4',count='0')=>{
                    that.initPage('#L-page',tpageToal,itemsOps.param.page,count)
                });
            },
            queryAjax:function(callback=function(){}){
                let that = this;
                //修改参数
                this.loading = true;

                $.ajax({
                    url: `${base.gAjaxUrl.visitorList}${that.item.id}/visitrecord/`,
                    type: 'GET',
                    data:itemsOps.param
                })
                    .always((data)=>{
                        base.ajaxCallback(data,()=>{
                            this.loading = false;
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
            close:function(){
                this.$dispatch('dialog-close')
            }
        },
        filters:{

        }
    }
</script>
