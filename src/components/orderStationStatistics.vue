<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">
            <div class="l m-info ml-10">
                <div class="l item">起点: {{station.stations_json && station.stations_json.length > 1 ? station.stations_json[0].station_name : '--'}}</div>
                <div class="l item">终点: {{station.stations_json && station.stations_json.length > 1 ? station.stations_json[station.stations_json.length - 1].station_name : '--'}}</div>
                <!--<div class="l item">开车时间:{{departureDatetime}}</div>-->
                <!-- <div class="l item">报名截止时间:{{busInfoItem.job_number}}</div> -->
                <div class="l item">座位数: {{station.seats}}</div>
                <div class="l item">价格: {{station.price/100}}</div>
            </div>
        </div>
        <div class="layui-layer-content">
            <table class="table table-border table-bordered table-hover table-bg">
                <thead>
                    <tr class="text-c">
                        <th>站点名称</th>
                        <th>报名人数</th>
                        <th>搭乘人数</th>
                    </tr>
                </thead>
                <div class="result" v-if="!noData">
                <tbody>
                    <tr class="text-c" v-for="item in stationDataItems">
                        <td>{{item.station_name}}</td>
                        <td>{{item.booking_cnt}}</td>
                        <td>{{item.check_cnt}}</td>
                    </tr>
                </tbody>
                </div>
            </table>
            <!--<div id="J-page" class="m-page" v-show="!noData"></div>-->
            <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
        </span>
        <div class="layui-layer-btn" v-on:click="close"><a class="layui-layer-btn0">关闭</a></div>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    let commentsOps = null;
    export default{
        ready () {
//            console.log('orderStationStatics: ')
//            console.log(this);
//            console.log(this.station);
//            commentsOps = {
//                param:{
//                    page:1,
//                    page_size:999999,
//                }
//            };
//            this.queryAjax((tpageToal='4',count='0')=>{
//                this.initPage('#J-page',tpageToal,count)
//            });
            this.queryAjax();
//            this.departureDatetime = this.station.departure_time;
//            this.seats = this.station.seats;
//            this.price = this.station.price/100;
        },
        props: ['station'],
        data:function(){
            return {
                noData:false,
                stationDataItems:[],
//                type: '',
//                departureDatetime: '', // 开车时间 ？
//                seats: '',
//                price: '',
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
                this.itemsLoading = true;

                $.ajax({
                    url: `${base.gAjaxUrl.shuttlebusdates3}${this.station.id}/station_statistics/`,
                    type: 'GET',
                })
                .always((data)=> {
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
                        if(data.length){
                            this.noData = false;
                            this.stationDataItems = data;
                            //回调
//                            callback(data.num_pages,data.count);
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
                    this.initPage('#J-page',tpageToal,count)
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

