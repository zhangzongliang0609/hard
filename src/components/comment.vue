<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">
            <div class="l m-info ml-10">
                <div class="l item">起点:{{startStation}}</div>
                <div class="l item">终点:{{endStation}}</div>
                <!--<div class="l item">开车时间:{{departureDatetime}}</div>-->
                <!-- <div class="l item">报名截止时间:{{busInfoItem.job_number}}</div> -->
                <div class="l item">座位数:{{seats}}</div>
                <div class="l item">价格:{{price}}</div>
            </div>
        </div>
        <div class="layui-layer-content">
            <table class="table table-border table-bordered table-hover table-bg">
                <thead>
                    <tr class="text-c">
                        <th>姓名/性别</th>
                        <th>部门/职位</th>
                        <th>电话</th>
                        <th>工号</th>
                        <!--<th>状态</th>-->
                        <th>评分</th>
                        <th width="250">评价</th>
                    </tr>
                </thead>
                <div class="result" v-if="!noData">
                <tbody>
                    <tr class="text-c" v-for="item in commentItems" v-if="item.busorercomment_vo">
                        <td>{{item.staff_vo.real_name}}/{{item.staff_vo.sex==1? '男': '女';}}</td>
                        <td>{{item.staff_vo.department_vo.department_name}}/{{item.staff_vo.position}}</td>
                        <td>{{item.staff_vo.phone}}</td>
                        <td>{{item.staff_vo.job_number}}</td>
                        <!--<td>{{item.status_name}}</td>-->
                        <td>{{item.busorercomment_vo? item.busorercomment_vo.score: '-'}}</td>
                        <td>{{item.busorercomment_vo? item.busorercomment_vo.comment: '-'}}</td>
                    </tr>
                </tbody>
                </div>
            </table>
            <div id="J-page" class="m-page" v-show="!noData"></div>
            <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
        </span>
        <div class="layui-layer-btn" v-on:click="close"><a class="layui-layer-btn0">关闭</a></div>
    </div>
    <div class="layui-layer-shade"></div>
    <div class="m-loading" v-if="loading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>
<script>
    import * as base from '../assets/js/base.js';
    let commentsOps = null;
    export default{
        ready () {

            commentsOps = {
                param:{
                    page:1,
                    page_size:8,
                }
            };

            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-page',tpageToal,count)
            });                 
        },
        props: ['data'],
        data:function(){
            return {
                noData:false,
                commentItems:[],
                startStation:this.data['station_names']?JSON.parse(this.data['station_names'])['0']:'',
                endStation:this.data['station_names']?JSON.parse(this.data['station_names'])[JSON.parse(this.data['station_names']).length-1]:'',
                departureDatetime:this.data.departure_time,
                seats:this.data.seats,
                price:this.data.price/100,
                loading:true,
            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            //初始化分页   
            initPage:function(obj,tpageToal='4',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:1,
                    count:count,
                    callback:(p)=>{
                        commentsOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax:function(callback=function(){}){
                let that = this;
                $.ajax({
                    url: `${base.gAjaxUrl.shuttlebusdates2}${this.data.id}/order_comments/`,
                    type: 'GET',
                    data:commentsOps.param
                })
                .always((data)=> {
                    that.loading = false;
                    base.ajaxCallback(data,()=>{
                        let resultData = data.results;
                        this.commentItems = resultData;

                        if(resultData.length){
                            this.noData = false;
                            //回调
                            callback(data.num_pages,data.count);
                        }else{
                            this.noData = true;
                        }

                    });
                });
            },
            //获取列表
            getList:function(){
                //重置第一页
                commentsOps.param.page = 1

                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-page',tpageToal,commentsOps.param.page,count)
                });
            },
        }
    }
</script>
<style lang="less" scoped>
.layui-layer-title{
    .m-info{
        border: none;
        padding: 9px 0;
        margin: 0;
    }

}
.layui-modify{
    top: 60px;
}
</style>
