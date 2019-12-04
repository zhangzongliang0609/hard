<template>

    <div class="driver-box-shade">
        <div class="driver-box relative">
            <h3 class="driver-box-title"><span class="fw-b">{{title}}</span>  {{data.shuttle_name + "(" + data.bus_time_vo.shuttle_type_name +")"}}
            {{data.departure_datetime?data.departure_datetime:''}}
            </h3>
            <div class="ctrl-box cl">
                <div id="vehicleSelect" class="f-l">
                    <span class="fb-w">行驶车辆:&nbsp;</span>
                    <div class="vehicle-box" @click="clickSelect">{{currentCar.car_no?currentCar.car_no:'没有车辆'}}</div>
                    <ul v-show="showSelect" class="car-Select">
                        <li class="text-c" v-for="item in carArr" @click="changeVehicle(item)">{{item.car_no?item.car_no:''}}</li>
                    </ul>
                </div>
                <div class="line-box f-l cl">
                    <div>
                        <span>站点规划路径:</span>
                        <span class="line-green"></span>
                    </div>
                    <div>
                        <span>车辆行驶路径:</span>
                        <span class="line-blue"></span>
                    </div>
                </div>
                <div id="travelData" v-bind:class="{'finished': finish}" class="f-r clearfix">
                    <span class="f-l">行驶时长: {{currentCar.duration | runTimeFilter}}</span>
                    <span class="f-l ml-10">行驶距离: {{currentCar.distance | distanceFilter}}</span>
                    <span class="f-l ml-10">平均速度: {{currentCar.average_speed | speedFilter}}</span>
                    <span v-if="false" class="f-l ml-10">最高速度: {{currentCar.max_speed | speedFilter}}</span>
                    <br>
                    <span v-if="finish" class="f-l">超速: {{currentCar.speeding_num ? currentCar.speeding_num + "次" : "无"}}</span>
                    <span v-if="finish" class="f-l ml-10">急变速: {{currentCar.harsh_acceleration_num ? currentCar.harsh_acceleration_num + "次" : "无"}}</span>
                    <span v-if="finish" class="f-l ml-10">急转弯: {{currentCar.harsh_steering_num ? currentCar.harsh_steering_num + "次" : "无"}}</span>
                    <span v-if="finish" class="f-l ml-10">急刹车: {{currentCar.harsh_breaking_num ? currentCar.harsh_breaking_num + "次" : "无"}}</span>
                </div>
            </div>
            <div class="map-box">
                <div id="allmap" class="driver-map"></div>
            </div>
            <div class="hide" id="hideElements">
                <div class="car_marker">
                    <img src="../assets/images/bus-yellow.png" alt="" class="car_img blue show">
                    <div class="driver-name text-c">{{currentCar.driver_name?currentCar.driver_name:'无'}}</div>
                    <div class="car_no text-c">{{currentCar.phone?currentCar.phone:'无'}}</div>
                </div>
            </div>
            <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
            </span>
        </div>
    </div>
    <div class="layui-layer-shade"></div>
</template>


<style lang="less" rel="stylesheet/less" scoped>
    @keyframes s-b {
        0% {
            transform: rotate(0.3);
        }
        100% {
            transform: rotate(1);
        }
    }
    .driver-box-shade {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        z-index: 1000;
        background-color: rgba(20, 20, 20, 0.6);
        .driver-box {
            position: absolute;
            left: 10%;
            top: 10%;
            bottom: 10%;
            width: 80%;
            right: 10%;
            min-height: 500px;
            border-radius: 5px;
            border-bottom: 2px solid #c7c7c7;
            background-color: #fff;
            overflow: auto;
            animation: s-b 0.3s ease;
            .driver-box-title {
                padding: 0 80px 0 20px;
                height: 42px;
                line-height: 42px;
                border-bottom: 1px solid #c7c7c7;
                font-size: 14px;
                color: #333;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                background-color: #F8F8F8;
                border-radius: 2px 2px 0 0;
            }
            .map-box {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                top: 94px;
                #allmap {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
    .ctrl-box{
        border-bottom: 1px solid #c7c7c7;
        padding: 0 10px;
        height: 50px;
        min-width: 800px;
        #vehicleSelect{
            height: 50px;
            width: 210px;
            line-height: 50px;
            position: relative;
            .vehicle-box{
                display: inline-block;
                position: absolute;
                left: 70px;
                top: 10px;
                line-height: 30px;
                height:30px;
                border: 1px solid #ccc;
                /*position: absolute;*/
                width: 120px;
                &:after {
                    position: absolute;
                    display: block;
                    content: "";
                    right: 12px;
                    top: 50%;
                    z-index: 98;
                    margin-top: -5px;
                    border-top: 8px solid #333;
                    border-left: 3px solid #fff;
                    border-right: 3px solid #fff;
                }
            }
            .car-Select{
                position: absolute;
                left: 70px;
                top: 40px;
                z-index: 99999;
                border: 1px solid #ccc;
                width: 120px;
                background:white;

                li{
                    line-height: 35px;
                    height: 35px;
                }
                li:hover{

                    background:orange;
                }
            }

        }
        #travelData{
            height: 60px;
            line-height: 50px;
        }
        #travelData.finished {
            line-height: 25px;
        }
    }
    .car_marker{
        position: relative;
        width: 140px;
        z-index: 2;
        .car_no{
            position: absolute;
            left: 0;
            top:15px;
            width: 100%;
            color: whitesmoke;
        }
        .driver-name{
            position: absolute;
            width: 100%;
            left:0;
            top: 0;
            color: whitesmoke;
        }
    }
    .line-box{
        width: 150px;
        height: 50px;
        span{
            display: inline-block;
        }
        div{
            width: 150px;
            height: 25px;
        }
        .line-green{
            width: 50px;
            height: 5px;
            border-radius: 2px;
            background: green;
        }
        .line-blue{
            width: 50px;
            height: 5px;
            border-radius: 2px;
            background: blue;
        }
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    export default{
        ready(){
            this.getVihecleList(()=>{
                this.getStations();
            });
            this.loadMap();
        },
        data:function () {
            return{
                busStations: [],
                map:{},
                oldLine:'',
                oldLocation:"",
                carArr:[],
                currentCar:'',
                showSelect:false,
                intervalId:'',
                isMapLoaded: false,
            }
        },
        props:["data","finish",'title'],
        methods:{
            getVihecleList:function (callback) {
                let that = this;
                $.ajax({
                    url:base.gAjaxUrl.busDispatchList,
                    type:"GET",
                    data:{
                        shuttlebus_date:that.data.id,
                        page_size:999999,
                    },
                }).always((data)=>{
                    callback();
                    base.ajaxCallback(data,function () {
                        if(data.results.length == 0){
                            layer.msg("当前没有车辆在行程中",{icon:2,time:2000});
                        }else{
                            that.carArr = data.results;
                            that.currentCar = that.carArr[0];
                            that.changeVehicle(that.currentCar);
                               that.intervalId = setInterval(function () {
                                   that.changeVehicle(that.currentCar)
                                },60000)

                        }
//                        that.busDispatchList = data.results;
//                        callback(data.num_pages,data.count);
                    })
                })
            },
            loadMap: function () {
                let that = this;
                let map = new BMap.Map("allmap",{enableMapClick:false});
                that.map = map;
                let point = new BMap.Point(113.342099, 23.146643); // 创建点坐标
                map.addEventListener("load", function(){
                    that.isMapLoaded = true;
                });
                map.centerAndZoom(point, 15);
            },
            initMap:function () {
                let that = this;
                let map = that.map;
                if(!this.isMapLoaded) {
                    setTimeout(function (){
                        that.initMap();
                    }, 200);
                    return;
                }
                let stationArr = [];
                let mapPath = {stationCount:0,pathArr:[]};
                for (var i = 0,len = that.busStations.length; i < len; i++) {
                    if(that.busStations[i].longitude){
                        stationArr.push(new BMap.Point(that.busStations[i].longitude,that.busStations[i].latitude))
                    }
                }
//                console.log(that.busStations);
                stationArr.length && map.centerAndZoom(stationArr[0], 11);
                map.enableScrollWheelZoom(true);

                let drivingOption = {
                    renderOptions:{
//                        这个对象不写,路线就不会自动渲染.
                        map:map,
                        autoViewport:true,
                    },
                    onSearchComplete:function (results) {
                        // 这里可以拿到规划出来路线的所有经纬度
                        if(stationArr.length != 0){
                            mapPath.stationCount = results.getPlan(0).getNumRoutes();
                            for (var i = 0; i < mapPath.stationCount ; i++) {
                                mapPath.pathArr =  mapPath.pathArr.concat(results.getPlan(0).getRoute(i).getPath());
                            }
                        }
                    },
                    onPolylinesSet:function (routes) {
                        map.clearOverlays();
                        // 在清除掉默认的覆盖物之后,默认绘制第一辆车的行程,有可能当前行程没有任何车辆,所以先判断一下
                        if(that.currentCar){
                            that.changeVehicle(that.currentCar);
                        }
                        let geoCoder = new BMap.Geocoder();
                        var polyline = new BMap.Polyline(mapPath.pathArr, {strokeColor:"green", strokeWeight:6, strokeOpacity:1});
                        map.addOverlay(polyline);
                        for (var i = 0,len = that.busStations.length; i < len; i++) {
                            let station  = that.busStations[i];
                            let point = new BMap.Point(station.longitude,station.latitude);
                            let marker = new BMap.Marker(point);
                            var labelOps = {
                                position : point,    // 指定文本标注所在的地理位置
                                offset   : new BMap.Size(-10,-47)    //设置文本偏移量
                            }
                            var label = new BMap.Label((i+1)+"-"+station.station_name, labelOps);  // 创建文本标注对象
                            label.setStyle({
                                color : "black",
                                fontSize : "12px",
                                height : "20px",
                                lineHeight : "20px",
                                fontFamily:"微软雅黑"
                            });
                            map.addOverlay(label);
                            map.addOverlay(marker);
                            let opts = {
                                width : 150,     // 信息窗口宽度
                                height: 100,     // 信息窗口高度
                                title : station.station_name , // 信息窗口标题
                            };
                            geoCoder.getLocation(point,function (result) {
                                let address =  result.addressComponents;
                                let stationName = address.province +  address.city + address.district + address.street + address.streetNumber;
                                marker.addEventListener("click", function(){
                                    var infoWindow = new BMap.InfoWindow(stationName, opts);
                                    map.openInfoWindow(infoWindow,point); //开启信息窗口
                                });
                            })

                        }

//                        for (var i = 0,len = routes.length; i < len; i++) {
//                                let mapStyle = routes[i].getPolyline().z; // 规划路径的样式对象
//                                mapStyle.strokeColor = "green"; // 绘制路线的颜色
//                                mapStyle.rd = 1; // 路线的透明度
//                        }
                    },
                    onMarkersSet:function (pois) {
//                        console.log("pois");
//                        console.log(that.busStations);
                        // 百度地图API功能
//                        var marker = new BMap.Marker(point);  // 创建标注
//                        map.addOverlay(marker);              // 将标注添加到地图中
//                        var opts = {
//                            width : 200,     // 信息窗口宽度
//                            height: 100,     // 信息窗口高度
//                            title : "海底捞王府井店" , // 信息窗口标题
//                            enableMessage:true,//设置允许信息窗发送短息
//                            message:"亲耐滴，晚上一起吃个饭吧？戳下面的链接看下地址喔~"
//                        }
                    },
                    onInfoHtmlSet:function (poi) {
                    }
                }
                var driving = new BMap.DrivingRoute(map,drivingOption);
                let locations = [].concat(stationArr);
                locations.splice(0,1);
                locations.splice(locations.length-1,1) // 途径点数组,不需要起终点
                driving.search(stationArr[0],stationArr[stationArr.length-1],{waypoints:locations});//waypoints表示途经点
            },
            getStations:function (lineId) {
                let that = this;
                $.ajax({
                    url: `${base.gAjaxUrl.shuttlebuses3}${that.data.bus_time_vo.shuttle_bus}/stations/`,
                    type: 'GET',
                    data: {
                        shuttle_type: that.data.bus_time_vo.shuttle_type,
                    }
                }).always((data)=>{
                    base.ajaxCallback(data,function () {
                        that.busStations = data;
                        if(data){
                            that.initMap();
                        }else{
                            layer.msg("该线路站点没有经纬度",{icon:2,time:2000})
                        }
                    })
                });
            },
            close:function () {
                this.$dispatch("dialog-close")
            },
            renderLine:function (pathArr) {
                let that = this;
                that.map.removeOverlay(that.oldLine);
                that.map.removeOverlay(that.oldLocation);
                that.oldLine = new BMap.Polyline(pathArr,{strokeColor:"blue", strokeWeight:6, strokeOpacity:1});
                function ComplexCustomOverlay(point){
                    this._point = point;
                }
                ComplexCustomOverlay.prototype = new BMap.Overlay();
                ComplexCustomOverlay.prototype.initialize = function(){
                    this._map = that.map;
                    var div = this._div = $(".car_marker").clone()[0];
                    this._map.getPanes().labelPane.appendChild(this._div);
                    return div;
                };
                ComplexCustomOverlay.prototype.draw = function(){
                    var map = this._map;
                    var pixel = map.pointToOverlayPixel(this._point);
                    this._div.style.left = pixel.x - 70 + "px";
                    this._div.style.top = pixel.y - 100 + "px"; // 当前窗
                }
                that.oldLocation = new ComplexCustomOverlay(pathArr[pathArr.length-1]);
                // 让地图的视口移动到车辆位置
                that.map.panTo(pathArr[pathArr.length-1], {
                    noAnimation: true
                });
                that.map.addOverlay(that.oldLocation);
                that.map.addOverlay(that.oldLine);
            },
            changeVehicle:function (item) {
                let that = this;
                this.currentCar = item;
                this.showSelect = false;
                $.ajax({
                    url: `${base.gAjaxUrl.busDispatchList}${that.currentCar.id}/locations/`,
                    type:"GET",
                }).always((data)=>{
                    base.ajaxCallback(data,function () {
                        let dataArr = [];
                        if(data.length != 0 ){
                            for (var i = 0,len = data.length; i < len; i++) {
                                if(data[i].longitude){
                                    dataArr.push(new BMap.Point(data[i].longitude,data[i].latitude))
                                }
                            }
                            if(dataArr.length != 0){
                                that.renderLine(dataArr);
                            }else{
                                layer.msg("该车辆暂时没有任何路径",{icon:2,time:1500})
                            }

                        }else{
                            layer.msg("该车辆暂时没有任何路径",{icon:2,time:1500})
                        }

                    })
                })
            },
            clickSelect:function () {
                this.showSelect = true;
            }
        },
        filters: {
            runTimeFilter: function (time) {
                if(time) {
                    let hour = time / 3600;
                    return hour > 1 ? hour.toFixed(2) + "h" : (time / 60).toFixed(0) + "min";
                } else {
                    return 0;
                }

            },
            speedFilter: function (speed) {
                if(speed) {
                    return speed.toFixed(2) + "km/h";
                } else {
                    return 0;
                }

            },
            distanceFilter: function (mile) {
                if(mile) {
                    return (mile / 1000).toFixed(2) + "km";
                } else {
                    return 0;
                }
            }
        },
        beforeDestroy(){
            clearInterval(this.intervalId);
        },
    }
    // 行驶时长 秒
    // 行驶距离 米
    // 平均速度 km/h
    // 最高速度 km/h
    // 超速 次
    // 急转弯 次
    // 急变速 次
    // 急刹车 次
</script>