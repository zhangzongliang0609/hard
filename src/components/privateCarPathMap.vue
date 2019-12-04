<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify layui-map">
        <div class="layui-layer-title layui-layer-title2  layui-layer-title-three">
            <div class="l m-info ml-10" v-if="data">
                <div class="l item">车辆：{{vehicleData.car_brand || '--'}}/{{vehicleData.car_model || '--'}}/{{vehicleData.car_color || '--'}}</div>
                <div class="l item">座位：{{vehicleData.seats}}</div>
                <div class="l item">车牌：{{vehicleData.car_no}}</div>
                <div class="l item">行驶里程：{{data.order_mileage | mToKm}}km</div>
                <div class="l item">出发时间：{{data.ride_time}}</div>
                <div class="l item">结束时间：{{data.end_time}}</div>
                <div class="l item">时长：{{data | getPeriodTime}}</div>
                <div class="l item">司机：{{data.staff_vo.real_name}}</div>
                <div class="l item">出发地/目的地：{{data.source_name || '--'}}/{{data.destination_name || '--'}}</div>
            </div>
        </div>
        <div id="noMap" v-show="!isShowMap">
            <img src="../assets/images/map.png" alt="">暂无经纬度～
        </div>
        <div class="layui-layer-content" v-show="isShowMap">

            <div id="allmap" class="driver-map"></div>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
        </span>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<style lang="less" scoped>

   .layui-layer .layui-layer-title2 {
        height: 135px;
   }
   div.layui-modify{
        margin-left: -25pc;
   }
   .layui-modify .layui-layer-shade{
        z-index:102;
   }
   .layui-modify .layui-modify{
        z-index:103;
   }
   .layui-map{
       /*margin-top: 20px;*/
   }
    #noMap{
        color:#666;
        display: flex;
        justify-content: center;
        align-items: center;
    }
   #noMap>img{
          width:150px;
      }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import moment from 'moment';

    export default{
        ready () {
            this.init();
            this.getDetail();

        },
        props: ['data'],
        data:function(){
            return {
                noData:false,
                isShowMap:true,
                vehicleData:{},
            }
        },
        filters:{
            getPeriodTime: function(data){
                var start = data.ride_time;
                var end = data.end_time;
                var period = Math.round((new Date(end) - new Date(start)) / 1000);
                var h = Math.floor(period / 3600);
                var m = Math.round(period % 3600 / 60);
                return (h ? (h + '小时') : '') + m +"分钟";
            },
            mToKm: function (num) {
                return num > 0 ? (num / 1000 ).toFixed(2) : 0;
            }

        },
        methods: {
            init:function(){
                $.ajax({
                    url: `${base.gAjaxUrl.privateCarOrders}${this.data.id}/location/`,
                    type: 'GET',
                })
                    .always((resultData)=>{
                        base.ajaxCallback(resultData,()=>{
                            if(!resultData.length){
                                this.isShowMap = false;
                                return false;
                            }
                            let location = resultData;
                            var pointArr = [];
                            $(location).each(function(i,e){
                                pointArr.push(new BMap.Point(e['longitude'],e['latitude']))
                            });
                            var map = new BMap.Map("allmap");
                            var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
                            var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
                            var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); //右上角，仅包含平移和缩放按钮

                            map.addControl(top_left_control);
                            map.addControl(top_left_navigation);
                            map.addControl(top_right_navigation);
                            map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用

                            map.centerAndZoom(new BMap.Point(location[0]['longitude'],location[0]['latitude']), 15);

                            var polyline = new BMap.Polyline(pointArr, {strokeColor:"blue", strokeWeight:6, strokeOpacity:1});
                            map.addOverlay(polyline);
                            map.setViewport(pointArr);
                        });

                    })
            },
            close:function(){
                this.$dispatch('dialog-close');
            },
            getDetail:function(){
                $.ajax({
                    url:`${base.gAjaxUrl.privateCar}${this.data.vehicle}/`,
                    type:"GET",
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
                        this.vehicleData = data;
                    })
                })
            }
        }
    }
</script>

