<template>
    <prick v-if="showSelectTrip"  @dialog-close="closePrick" :data="selectedTripArr" @dialog-save="save"></prick>
    <div class="layui-layer layui-anim layui-layer-page layui-modify layui-modify-left">
        <div class="layui-layer-title layui-layer-title-combine layui-layer-title-two combine-box">
            <!--<a href="javascript:;" class="btn btn-success radius" @click="callBack()">返回</a>-->
            <div class="l m-info ml-10">
                <!--<div class="l item">起点/终点:{{data.source_name}}/{{data.destination_name}}</div>-->
                <!--<div class="l item">出发时间:{{data.ride_time}}</div>-->
                <!--<div class="l item">结束时间:{{data.end_time}}</div>-->
                <!--<div class="l item">人数:{{data.passenger_number}}</div>-->
                <!--<div class="l item">拼车/加急:{{data.is_carpool? '是': '否'}}/{{data.is_urgent? '是': '否'}}</div>-->


                <div class="l item">起点/终点:{{data.source_name}}/{{data.destination_name}}</div>
                <div class="l item">出发时间:{{data.admin_ride_time}}</div>
                <div class="l item">结束时间:{{data.admin_end_time}}</div>
                <div class="l item">人数:{{data.passenger_number}}</div>
                <div class="l item">拼车/加急:{{order.is_carpool? '是': '否'}}/{{order.is_urgent? '是': '否'}}</div>
            </div>

        </div>
        <div class="layui-layer-content">
            <table class="table table-border table-bordered table-hover table-bg">
                <thead>
                    <tr class="text-c">
                        <th width="50">选择</th>
                        <th>申请人/电话</th>
                        <th>乘车人</th>
                        <th>起点/终点</th>
                        <th>出发时间</th>
                        <th>结束时间</th>
                        <th>人数</th>
                        <th>状态</th>
                        <th>是否已派司机</th>
                    </tr>
                </thead>
                <div class="result" v-if="!noData">
                <tbody>
                    <tr class="text-c" v-for="(vooKey, vooItem) in items">
                        <td><input type="checkbox" class="radio-wh" value="{{vooItem}}" @click="clickTrip(vooItem)" :checked="filterSelectedTrip(vooItem)" name="order_id"/></td>
                        <td>{{vooItem.staff_name}}/{{vooItem.staff_phone}}</td>
                        <td>{{vooItem.use_staffs | getRealNames}}</td>
                        <td>{{vooItem.source_name}}/{{vooItem.destination_name}}</td>
                        <td>{{vooItem.ride_time}}</td>
                        <td>{{vooItem.end_time}}</td>
                        <td>{{vooItem.passenger_number}}</td>
                        <td>{{vooItem.status | filterTripStatus}}</td>
                        <td>{{vooItem.status > 10 ? '是': '否'}}</td>
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
        <div class="layui-layer-btn" v-on:click="showPrick"><a class="layui-layer-btn0">拼单</a></div>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<style lang="less" scoped>
    .layui-modify{
        width:1000px;
    }
    div.layui-layer-title-combine {
        height: 70px;
    }
    .radio-wh{
        width: 20px;
        height: 20px;
        cursor: pointer;
    }
    div.layui-modify-left {
        left: 50%;
        margin-left: -400px;
    }
    .layui-layer-content{
        padding:0 15px;

    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../../assets/js/base.js';
    import prick from "./prickMainTrip"
    let carpoolOps = null;
    export default{
        ready () {
            // this.topItems = JSON.parse(localStorage['dataInfo']);

            carpoolOps = {
                param:{
                    search:'',
                    approval_status:'',
                    order_status:'',
                    is_carpool:false,
                    is_urgent:'',
                },
                page:1,
                page_size:10,
            };
            base.verticalCenter(".layui-modify");

            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-page',tpageToal,count)
            });
        },
        props: ['title','data','order'],
        data:function(){
            return {
                noData:false,
                topItems:[],
                items:[],
                showSelectTrip:false,
                selectedTripArr:[this.data],
            }
        },
        methods: {
            //初始化分页
            initPage:function(obj,tpageToal='4',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:1,
                    count:count,
                    callback:(p)=>{
                        carpoolOps.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax:function(callback=function(){}){
                let that = this;
                this.itemsLoading = true;

                $.ajax({
                    url: `${base.gAjaxUrl.officialcarTrip_V2}${that.data['id']}/can_carpool_trip/?page=${carpoolOps.page}&page_size=${carpoolOps.page_size}`,
                    contentType: 'application/json',
                    type: 'GET'
                })
                .always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
                        let resultData = data.results;
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
                //重置第一页
                carpoolOps.page = 1;

                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-page',tpageToal,carpoolOps.page,count)
                });
            },
            close:function(){
                this.$dispatch('dialog-close',"isShowAllOrder");
            },
            save:function(){
                this.showSelectTrip = false;
                this.$dispatch('dialog-save');
                layer.msg('拼单成功',{icon:1,time:1000});
            },
            callBack:function () {
                this.$dispatch('call-back');
            },
            showPrick:function(){
                if(this.selectedTripArr.length < 1){
                    layer.msg("请先选择需要拼单的行程",{icon:2,time:2000});
                    return;
                }
                this.showSelectTrip = true;
            },
            closePrick:function(){
                this.showSelectTrip = false;
            },
            filterSelectedTrip:function(item){
                for (let i = 0; i < this.selectedTripArr.length; i++) {
                    if(this.selectedTripArr[i].id == item.id){
                        return true;
                    }
                }
                return false

            },
            clickTrip:function(item){
                let index = null;
                for (let i = 0; i < this.selectedTripArr.length; i++) {
                    if(this.selectedTripArr[i].id == item.id){
                        index = i;
                        break;
                    }
                }
                if(index === null){
                    this.selectedTripArr.push(item);
                }else{
                    this.selectedTripArr.splice(index,1);
                }
            }
        },
        filters:{
            getRealNames (use_staffs) {
                use_staffs = use_staffs || [];
                let str = '';
                use_staffs.forEach(staff => {
                    str += staff.real_name + '/'
                });
                return str.slice(0, -1);
            },
            filterTripStatus:function(data){
                // 行程状态 -20:已驳回 -10:已取消 10:待派单 20:待接送 30:接送中 40:已完成
                switch(data){
                    case -20:{
                        return "已驳回"
                    }
                    case -10:{
                        return "已取消"
                    }
                    case 10:{
                        return "待派单"
                    }
                    case 20:{
                        return "待接送"
                    }
                    case 30:{
                        return "接送中"
                    }
                    case 40:{
                        return "已完成"
                    }
                }
            }
        },
        components:{
            prick:prick,
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
div.combine-box{
    height: auto;
}
</style>
