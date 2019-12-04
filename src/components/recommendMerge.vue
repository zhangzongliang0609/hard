<template>
    <map v-if="isShowMap" v-on:dialog-close="closeMap" :order="data" :arr="items" :index="currentIndex" ></map>
    <div class="layui-layer layui-anim layui-layer-page layui-modify layui-modify-left recommend-box">
        <div class="layui-layer-title">拼单操作</div>
        <div class="pd-10">
        <div class="layui-layer-title layui-layer-title-combine layui-layer-title-two title-comment">
            <div class="l m-info ml-10">
                <!--<div class="l item">乘车人:{{data.passenger_name-->
                    <!--?data.passenger_name : data.staff_vo.real_name}}</div>-->
                <div class="l item">起点/终点:{{data.source_name}}/{{data.destination_name}}</div>
                <div class="l item">出发时间:{{data.ride_time}}</div>
                <div class="l item">结束时间:{{data.end_time}}</div>
                <div class="l item">人数:{{data.passenger_number}}</div>
                <div class="l item">拼车/加急:{{data.is_carpool? '是': '否'}}/{{data.is_urgent? '是': '否'}}</div>
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
                    <th>乘车人</th>
                    <th>起点/终点</th>
                    <th>出发时间</th>
                    <th>结束时间</th>
                    <th>人数</th>
                    <th>状态</th>
                    <th>拼车/加急</th>
                </tr>
                </thead>
                <div class="result" v-if="!noData">
                    <tbody>
                    <tr class="text-c" :class="$index === currentIndex.index?'current-tr':''" v-for="(vooKey, vooItem) in items" @click="clickTr($index,vooItem)">
                        <td>
                            <input type="radio" :checked="$index === currentIndex.index ">
                        </td>
                        <td>{{$index+1}}</td>
                        <!--<td><input type="checkbox" class="radio-wh" value="{{vooItem.id}}" name="order_id"/></td>-->
                        <td>{{vooItem.passenger_name
                            ?vooItem.passenger_name : vooItem.staff_vo.real_name}}</td>
                        <td>{{vooItem.source_name}}/{{vooItem.destination_name}}</td>
                        <td>{{vooItem.ride_time}}</td>
                        <td>{{vooItem.end_time}}</td>
                        <td>{{vooItem.passenger_number}}</td>
                        <td>{{vooItem.order_status_name}}</td>
                        <td>{{vooItem.is_carpool? '是': '否'}}/{{vooItem.is_urgent? '是': '否'}}</td>
                        <!--<td>{{vooItem.driver_vo? '是': '否'}}</td>-->
                    </tr>
                    </tbody>
                </div>
            </table>
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
</style>
<script>
    import * as base from '../assets/js/base.js'
    import map from '../components/recommendMap.vue'
    export default{
        ready(){
            // this.getList();
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
                // selectOrder:'',
            }
        },
        props: ['title','data'],
        methods:{
            getList:function () {
                this.showLoading = true
                let that = this;
                this.currentIndex.index = '';
              $.ajax({
                  url:`${base.gAjaxUrl.officialcarorders}${that.data.id}/recommend_carpool_orders/`,
                  type:"GET",
                  data:{
                      time_diff:+that.differDate,
                      distance_diff:+that.differDistance,
                  }
              }).always((data)=>{
                  that.showLoading = false;
                  base.ajaxCallback(data,()=>{
                        if(data.length){
                            that.noData = false;
                            that.items = data;
                        }else{
                            that.items = [];
                            that.noData = true;
                        }
                      this.$broadcast('refresh',data);

                  })
              })
            },
            clickTr:function (index,item) {
                if(this.isShowMap){
                    this.$broadcast('change',index);
                }
                this.currentIndex.index = index;
            },
            close:function(){
                this.$dispatch('dialog-close');
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
                let that = this;
                let arr = [];
                if(this.currentIndex.index === ''){
                    layer.msg('请先选择需要拼车的订单',{icon:2,time:1500})
                    return
                }
                arr.push(that.items[this.currentIndex.index].id);
                $.ajax({
                    url: `${base.gAjaxUrl.officialcarorders}${that.data.id}/combine/`,
                    contentType: 'application/json',
                    type: 'POST',
                    data:JSON.stringify({orders:arr})
                })
                    .always((data)=>{
                        base.ajaxCallback(data,()=>{
                            that.$dispatch('dialog-save');
                            layer.msg('拼单成功',{icon:1,time:1000});
                        });
                    })

            }
        },
        components:{
            map:map
        }
    }
</script>