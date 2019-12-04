<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify layui-map">
        <div class="layui-layer-title layui-layer-title2  layui-layer-title-three">
            <div class="l m-info ml-10">
                <div class="l item">车辆：{{mapInfo.vehicle_vo.car_brand}}/{{mapInfo.vehicle_vo.car_model}}/{{mapInfo.vehicle_vo.car_color}}</div>
                <div class="l item">座位：{{mapInfo.vehicle_vo.seats}}</div>
                <div class="l item">行驶里程：{{mapInfo.driver_mileage  | mToKm}}km</div>
                <div class="l item">乘客：
                    <span v-for="staff in mapInfo.use_staffs">{{staff.real_name}}/{{staff.phone}}</span>
                </div>
                <div class="l item">出发时间：{{mapInfo.trip_vo.admin_ride_time ? mapInfo.trip_vo.admin_ride_time : mapInfo.trip_vo.ride_time}}</div>
                <div class="l item">结束时间：{{mapInfo.trip_vo.admin_end_time ? mapInfo.trip_vo.admin_end_time : mapInfo.trip_vo.end_time}}</div>

                <div class="l item">实际出发时间：{{mapInfo.get_on_time}}</div>
                <div class="l item">实际结束时间：{{mapInfo.get_off_time}}</div>

                <div class="l item">车牌：{{mapInfo.vehicle_vo.car_no}}</div>
                <div class="l item">行驶时长：{{mapInfo.durations | toInt }}小时{{mapInfo.durations % 60}}分钟</div>
                <div class="l item">司机：{{mapInfo.real_name ? mapInfo.real_name : mapInfo.driver_vo.staff_vo.real_name}}</div>
                <div class="l item">出发地/目的地：{{mapInfo.trip_vo.source_name}}/{{mapInfo.trip_vo.destination_name}}</div>
            </div>
        </div>
        <div id="noMap" v-show="!isShowMap">
            <img src="../../assets/images/map.png" alt="">暂无经纬度～
        </div>
        <div class="layui-layer-content">
            <div  id="allmap" class="driver-map"></div>
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
        margin-top: 20px;
    }
    #noMap{
        color:#666;

    }
    #noMap>img{
        width:150px;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../../assets/js/base.js';

    export default{
        ready () {
            console.log("this.data");
            console.log(this.data);
            this.getDetails();
            this.getPoint();
        },
        props: ['title','data'],
        data:function(){
            return {
                noData:false,
                mapInfo:{
                    vehicle_vo:{},
                    staff_vo:{},
                    driver_vo:{
                        staff_vo:{}
                    },
                    trip_vo:{}
                },
                isShowMap:true,
            }
        },
        filters:{
            toInt: function(e){
                return parseInt( e / 60);
            },
            mToKm: function (num) {
                return (num / 1000 || 0).toFixed(2);
            }

        },
        methods: {
            getDetails:function(){
                $.showLoading();
                $.ajax({
                    url: `${base.gAjaxUrl.officialcarDriverTrip_V2}${this.data.id}/`,
                    type: 'GET',
                }).always((data)=>{
                    $.hideLoading();
                    base.ajaxCallback(data,()=>{
                        this.mapInfo = data;
                    })
                })
            },
            getPoint:function(){
                $.showLoading();
                $.ajax({
                    url: `${base.gAjaxUrl.officialcarDriverTrip_V2}${this.data.id}/points/`,
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
                        });

                    });
            },
            close:function(){
                this.$dispatch('dialog-close');
            },
            loadJScript:function(location) {
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = `http://api.map.baidu.com/api?v=2.0&ak=fU6BW6x0g2q9ZyBGpx23Nk2vLSONRGaL&callback=mapInit`;
                document.body.appendChild(script);

                function init(){
                    var pointArr = [];
                    $(location).each(function(i,e){
                        pointArr.push(new BMap.Point(e['longitude'],e['latitude']))
                    })

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
                }
            }
        }
    }
</script>

