<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify layui-map">
        <div class="layui-layer-title layui-layer-title2  layui-layer-title-three">
            查看轨迹
        </div>

        <div class="layui-layer-content cl">
            <div class="f-l list-box">
                <h3>司机车辆</h3>
                <div :class="{'selected-item': currentDriver.id == item.id}" class="list-item" v-for="item in items" @click="clickDriver(item)">
                    {{item.driver_name}}/{{item.car_no}}
                </div>
            </div>
            <div class="f-r content-box">
                <div class="l map-title">
                    <!--<div class="l item">车辆：{{mapInfo.vehicle_vo.car_brand}}/{{mapInfo.vehicle_vo.car_model}}/{{mapInfo.vehicle_vo.car_color}}</div>-->
                    <!--<div class="l item">座位：{{mapInfo.vehicle_vo.seats}}</div>-->
                    <div class="l item">行驶里程：{{currentDriver.driver_mileage | mToKm}}km &nbsp;</div>
                    <!--<div class="l item">乘客：{{mapInfo.staff_vo.real_name}}</div>-->
                    <div class="l item">出发时间：{{tripData.admin_ride_time ? tripData.admin_ride_time :  tripData.ride_time}} &nbsp;</div>
                    <div class="l item">结束时间：{{tripData.admin_end_time ? tripData.admin_end_time : tripData.end_time }} &nbsp;</div>
                    <!--<div class="l item">车牌：{{mapInfo.vehicle_vo.car_no}}</div>-->
                    <div class="l item">行驶时长：{{currentDriver.durations | toInt }}小时{{currentDriver.durations % 60}}分钟 &nbsp;</div>
                    <!--<div class="l item">司机：{{mapInfo.driver_vo.staff_vo.real_name}}</div>-->
                    <div class="l item">出发地/目的地：{{tripData.source_name}}/{{tripData.destination_name}} &nbsp;</div>
                </div>
                <div id="noMap" v-show="!isShowMap">
                    <img src="../../assets/images/map.png" alt="">暂无经纬度～
                </div>
                <div  id="allmap" class="driver-map" v-if="isShowMap"></div>
            </div>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
        </span>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .list-box{
        border: 1px solid #ddd;
        display: flex;
        width:200px;
        flex-direction: column;
        align-items: center;
        margin-left: 10px;
        .list-item{
            border-radius: 4px;
            width:160px;
            height:30px;
            display: flex;
            justify-content: center;
            align-items: center;
            color:#ffffff;
            background: #a1a1a1;
            font-size: 12px;
            margin-bottom: 10px;
            cursor: pointer;
        }
        .selected-item{
            background: #169bd5;
        }
    }
    .content-box{
        width:750px;
        margin-left: -10px;
        margin-right: 10px;
    }
   .layui-modify .layui-layer-shade{
        z-index:102;
   }
   .layui-modify .layui-modify{
        z-index:103;
   }
   .layui-map{
       width: 1000px;
       margin-top: 20px;
   }
   .map-title{
       width:100%;
       border:1px solid #ddd;
       padding:10px 0 10px 10px;
   }
    #noMap{
        color:#666;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    #noMap>img{
          width:150px;
        margin-top: 100px;
      }
    .allmap{
        width:746px;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../../assets/js/base.js';


    export default{
        ready () {
            base.verticalCenter(".layui-map");
            this.items = this.data.drivertrip;
            if(!this.driver){
                this.currentDriver = this.data.drivertrip[0];
            }else{
                this.currentDriver = this.driver;
            }
            this.map = new BMap.Map("allmap");
            this.loadJScript();
            this.init(this.currentDriver.id);
            this.getTripData()
            console.log("this.currentDriver");
            console.log(this.currentDriver);
        },
        props: ['driver','data'],
        data:function(){
            return {
                noData:false,
                mapInfo:{},
                isShowMap:true,
                map:"",
                items:[],
                currentDriver:{},
                tripData:{},
            }
        },
        filters:{
            toInt: function(e){
                return parseInt((e / 60 ));
            },
            mToKm: function (num) {
                console.log("num");
                console.log(num);
                return (num / 1000 || 0).toFixed(2);
            }

        },
        methods: {
            getTripData:function(){
                $.showLoading();
                $.ajax({
                    url:`${base.gAjaxUrl.officialcarDriverTrip_V2}${this.currentDriver.id}/trip_info/`,
                    type:"GET",
                }).always((data)=>{
                    $.hideLoading();
                    base.ajaxCallback(data,()=>{
                        this.tripData = data;
                    })
                })
            },
            close:function(){
                this.$dispatch('dialog-close',"isShowMapDialog");
            },
            loadJScript:function() {
                // var script = document.createElement("script");
                // script.type = "text/javascript";
                // script.src = `http://api.map.baidu.com/api?v=2.0&ak=fU6BW6x0g2q9ZyBGpx23Nk2vLSONRGaL&callback=mapInit`;
                // document.body.appendChild(script);
                var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
                var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
                var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); //右上角，仅包含平移和缩放按钮
                this.map.addControl(top_left_control);
                this.map.addControl(top_left_navigation);
                this.map.addControl(top_right_navigation);
                this.map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
                // this.map.centerAndZoom(new BMap.Point(location[0]['longitude'],location[0]['latitude']), 15);

            },
            init:function(id){
                $.showLoading();
                this.map.clearOverlays();
                $.ajax({
                    url: `${base.gAjaxUrl.officialcarDriverTrip_V2}${id}/points/`,
                    type: 'GET',
                }).always((resultData)=>{
                    $.hideLoading();
                        base.ajaxCallback(resultData,()=>{
                            if(!resultData.length){
//                        layer.msg('经纬度获取失败',{icon:2,time:1000});
//                        that.$dispatch('dialog-close');
                                this.isShowMap = false;
                                return false;
                            }
                            // var script = document.createElement("script");
                            // script.type = "text/javascript";
                            // script.src = "http://api.map.baidu.com/api?v=2.0&ak=BMvPNolfzSZK2FTuPPk0i9Lp&callback=init";
                            // document.body.appendChild(script);
                            let location = resultData;
                            var pointArr = [];
                            $(location).each(function(i,e){
                                pointArr.push(new BMap.Point(e['longitude'],e['latitude']))
                            })

                            var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
                            var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
                            var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); //右上角，仅包含平移和缩放按钮

                            this.map.addControl(top_left_control);
                            this.map.addControl(top_left_navigation);
                            this.map.addControl(top_right_navigation);
                            this.map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
                            this.map.centerAndZoom(new BMap.Point(location[0]['longitude'],location[0]['latitude']), 15);
                            var polyline = new BMap.Polyline(pointArr, {strokeColor:"blue", strokeWeight:6, strokeOpacity:1});
                            this.map.addOverlay(polyline);
                        });

                    })
            },
            clickDriver:function(item){
                if(item.status != 50){
                    layer.msg("该司机行程未结束,不能查看路径",{icon:2,time:3000});
                    return;
                }
                this.currentDriver = item;
                this.init(item.id);
                this.getTripData(item.id);
            }
        }
    }
</script>

