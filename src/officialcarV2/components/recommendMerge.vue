<template>
    <prick v-if="showPrick"  :data="tripArr" @dialog-close="closePrick" @dialog-save="close"></prick>
    <map v-if="isShowMap" v-on:dialog-close="closeMap" :order="data" :arr="items" :selarr="tripArr" :index="currentIndex" ></map>
    <div class="layui-layer layui-anim layui-layer-page layui-modify layui-modify-left recommend-box">
        <div class="layui-layer-title">拼单操作</div>
        <div class="pd-10">
        <div class="layui-layer-title layui-layer-title-combine layui-layer-title-two title-comment">
            <div class="l m-info ml-10">
                <!--<div class="l item">乘车人:{{data.passenger_name-->
                    <!--?data.passenger_name : data.staff_vo.real_name}}</div>-->
                <div class="l item">起点/终点:{{data.source_name}}/{{data.destination_name}}</div>
                <div class="l item">出发时间:{{data.admin_ride_time}}</div>
                <div class="l item">结束时间:{{data.admin_end_time}}</div>
                <div class="l item">人数:{{data.passenger_number}}</div>
                <div class="l item">拼车/加急:{{order.is_carpool? '是': '否'}}/{{order.is_urgent? '是': '否'}}</div>
            </div>

        </div>
            <div class="cl mt-5 ">
                <span class="f-18 fw-b">推荐可拼订单:</span>
                <div class="inline-block">
                    <span>出发时间相差</span>
                    <select v-model="differDate" class="f-14">
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="40">40</option>
                        <option value="50">50</option>
                    </select>
                    <span>分钟以内,起终点或沿途距离相差</span>
                    <select v-model="differDistance" class="f-14">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                    <span>公里以内</span>
                    <a href="javascript:;" class="btn btn-secondary radius" @click="getList">搜索</a>
                </div>
                <a href="javascript:;" class="btn btn-secondary radius show-map" @click="showMap">查看地图</a>
            </div>
        <div class="layui-layer-content">
            <table class="table table-border table-bordered table-bg">
                <thead>
                <tr class="text-c">
                    <th>选择</th>
                    <th>序号</th>
                    <th>申请人</th>
                    <th>起点/终点</th>
                    <th>出发时间</th>
                    <th>结束时间</th>
                    <th>人数</th>
                    <th>状态</th>
                    <th>是否委派司机</th>
                </tr>
                </thead>
                <div class="result" v-if="!noData">
                    <tbody >
                    <tr class="text-c list-tr" :class="{'current-tr':isInclude(vooItem,$index,$event)}" v-for="(vooKey, vooItem) in items" @click="clickTr($index,vooItem)">
                        <td>
                            <input type="checkbox" class="trip-check-box" :checked="isInclude(vooItem)" @click="clickTrip(vooItem)">
                        </td>
                        <td>{{$index+1}}</td>
                        <!--<td><input type="checkbox" class="radio-wh" value="{{vooItem.id}}" name="order_id"/></td>-->
                        <td>{{vooItem.use_staffs | getRealNames}}</td>
                        <td>{{vooItem.source_name}}/{{vooItem.destination_name}}</td>
                        <td>{{vooItem.ride_time}}</td>
                        <td>{{vooItem.end_time}}</td>
                        <td>{{vooItem.passenger_number}}</td>
                        <td>{{vooItem.status | filterTripStatus}}</td>
                        <td>{{vooItem.status > 10? '是': '否'}}</td>
                        <!--<td>{{vooItem.driver_vo? '是': '否'}}</td>-->
                    </tr>
                    </tbody>
                </div>
            </table>
            <div class="cl">
                <div id="J-page" class="m-page" v-show="!noData"></div>
            </div>
            <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
            <div class="cl mt-10">
                <a href="javascript:;" class="btn btn-link f-l" @click="showAll">从所有订单中选择>></a>
                <a href="javascript:;" v-show="!noData" class="btn btn-secondary radius f-r" @click="confirmRecommend">确定拼单</a>
            </div>
        </div>

        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
        </span>
        </div>
    </div>
    <div class="m-loading" v-if="showLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .m-page{
        padding-bottom: 0px;
    }
    .recommend-box{
        width:48%;
        min-width: 600px;
    }
    .current-tr{
        background-color: #30bfb0;
    }
    .show-map{
        float:right;
        margin-top: 2px;
    }
    .title-comment{
        padding:0;
        height:auto;
    }
    .trip-check-box{
        width:20px;
        height:20px;
    }

    .item1{
        background: #7ed321;
        td{
            color: white;
        }
    }
    .item2{
        background: #fbcf23;
        td{
            color: white;
        }
    }
    .item3{
        background: #f07b41;
        td{
            color: white;
        }
    }
    .item4{
        background: #50cfe3;
        td{
            color: white;
        }
    }
    .item5{
        background: #3aa3ea;
        td{
            color: white;
        }
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../../assets/js/base.js'
    import map from '../components/recommendMap.vue'
    import prick from "./prickMainTrip"
    let option = null;
    export default{
        ready(){
            option = {}
            this.getList();
            console.log("this.data");
            console.log(this.data);
        },
        data:function () {
            return{
                differDate:30,
                differDistance:5,
                currentIndex:{
                    index:'', // 为了组件中相互通信
                },
                items:[],
                noData:false,
                isShowMap:false,
                showLoading:false,
                tripArr:[this.data],
                showPrick:false,
                colorClassArr:["item1","item2","item3","item4","item5"],
                colorArr:["#7ed321","#fbcf23","#f07b41","#50cfe3","#3aa3ea"],
                // selectOrder:'',
            }
        },
        props: ['title','data','order'],
        methods:{
            getList:function(){
                $.showLoading();
                let that = this;
                this.currentIndex.index = '';
                option.time_diff = +that.differDate;
                option.distance_diff = +that.differDistance;
                $.ajax({
                    url:`${base.gAjaxUrl.officialcarTrip_V2}${that.data.id}/can_carpool_trip/`,
                    type:"GET",
                    data:option
                }).always((data)=>{
                    $.hideLoading();
                    base.ajaxCallback(data,()=>{
                        if(data.length){
                            that.noData = false;
                            data.map((item,index)=>{
                                item.lineColor = that.colorArr[index];
                            })
                            console.log("data");
                            console.log(data);
                            that.items = data;
                        }else{
                            that.items = [];
                            that.noData = true;
                        }
                        this.$broadcast('refresh',data);

                        this.tripArr.length = 1;
                    })
                })

                // option.page = 1;
                // this.queryAjax((tpageToal='4',count='0')=>{
                //     this.initPage('#J-page',tpageToal,option.page,count)
                // });
            },
            clickTr:function (index,item) {
                // if(this.isShowMap){
                //     this.$broadcast('change',index);
                // }
                this.currentIndex.index = index;
            },
            close:function(){
                this.$dispatch('dialog-close',"showRecommend");
            },
            showAll:function () {
                this.$dispatch('show-all');
            },
            showMap:function(){
                $('.recommend-box').animate({left:420},300,'linear',()=>{
                    this.isShowMap = true
                });

            },
            closeMap:function(){
                this.isShowMap = false;
                $('.recommend-box').animate({left:'50%'},300,'linear');
            },
            confirmRecommend:function(){
                if(this.tripArr.length < 1){
                    layer.msg("请先选择需要拼车的行程",{icon:2,time:2000});
                    return;
                }
                this.showPrick = true;
            },
            closePrick:function(){
              this.showPrick = false;
            },
            clickTrip:function(item){
                let index = null;
                for (let i = 0; i < this.tripArr.length; i++) {
                    if(this.tripArr[i].id == item.id){
                        index = i;
                        break
                    }
                }
                if(index !== null){
                    this.tripArr.splice(index,1);
                }else{
                    this.tripArr.push(item);
                }
                this.$broadcast('change',this.tripArr);

            },
            isInclude:function(item,index){
                for (let trip of this.tripArr){
                    if(trip.id == item.id){
                        $(".list-tr").eq(index).addClass(this.colorClassArr[index]);
                        return true;
                    }
                }
                $(".list-tr").eq(index).removeClass(this.colorClassArr[index]);
                return false;
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
            map:map,
            prick:prick,
        }
    }
</script>
