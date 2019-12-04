<template>
    <div class="driver-box-shade">
            <div class="ctrl-box cl pt-10">
                    <div class="inline-block mr-20">
                        <span :class="$index === index.index?'current-item':''" v-for="item in listArr" class="item-box ml-15" @click="clickItem($index,item.id)">
                            {{$index+1}}
                        </span>
                    </div>
                        <span class="fw-b">原订单线路:</span>
                        <span class="line-green"></span>
                        <span class="fw-b">拼单线路:</span>
                        <span class="line-blue"></span>
                <span class="layui-layer-setwin">
                    <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
                </span>
            </div>
            <div class="map-box">
                <div id="allmap" class="driver-map"></div>
            </div>

    </div>
    <div class="m-loading" v-if="loading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .m-loading{
        left:-200px;
    }
    .driver-box-shade{
        height: 90%;
        min-width: 600px;
        position: relative;
        width:48%;
        left: 50%;
        top:-22px;
        right:500px;
        z-index: 200;
        .ctrl-box{
            position: absolute;
            height:40px;
            background-color: #f8f8f8;
            width: 100%;
            z-index: 201;
        }
        .map-box,#allmap{
            width: 100%;
            padding-top: 40px;
            height: 90%;
        }
    }
    .layui-layer-setwin{
        z-index: 202;
    }
        span{
            display: inline-block;
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
    .item-box{
        border:1px solid #c7c7c7;
        text-align: center;
        height:25px;
        line-height:25px;
        width: 25px;
        background-color: #fff;
        cursor:pointer;
    }
    .current-item{
        background-color: #30bfb0;
        color:white;
    }

</style>
<style>
    #app,body{
        height: 100%;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';

    let greenStart = require('../assets/images/green-start.png');
    let greenEnd = require('../assets/images/green-end.png');
    let blueStart = require('../assets/images/blue-start.png');
    let blueEnd = require('../assets/images/blue-end.png');
    export default{
        ready(){
            this.loading  = true;
            this.listArr = this.arr
            this.loadMap();
            if(this.arr.length != 0 && this.index.index !== ''){
                this.changeVehicle(this.arr[this.index.index].id)
            }
        },
        data:function () {
            return{
                busStations: [],
                map:{},
                carArr:[],
                currentCar:'',
                showSelect:false,
                intervalId:'',
                isMapLoaded: false,
                // currentIndex:0,
                buleLine:'',
                startIcon:'',
                endIcon:'',
                loading:false,
                listArr:''

            }
        },
        props:["order",'arr','index'],
        methods:{
            loadMap: function () {
                let that = this;
                let map = new BMap.Map("allmap",{enableMapClick:false});
                that.map = map;
                let point = new BMap.Point(113.342099, 23.146643); // 创建点坐标
                let bottom_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT})
                let top_left_navigation = new BMap.NavigationControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});  //左上角，添加默认缩放平移控件
                // let top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL});
                map.addEventListener("load", function(){
                    that.isMapLoaded = true;

                    // that.renderGreenLine()
                    // that.renderBlueLine()
                });
                map.addControl(bottom_left_control);
                map.addControl(top_left_navigation);
                // map.addControl(top_right_navigation);
                map.enableScrollWheelZoom(true);
                map.centerAndZoom(point, 15);

                $.ajax({
                    url: `${base.gAjaxUrl.officialcarorders}${that.order.id}/carpool_paths/`,
                    type:"GET",
                }).always((data)=>{
                    that.loading = false;
                    base.ajaxCallback(data,function () {
                        let dataArr = [];
                        if(data.path.length != 0 ){
                            let pathArr = data.path;
                            for (let i = 0,len = pathArr.length; i < len; i++) {
                                if(pathArr[i].longitude){
                                    dataArr.push(new BMap.Point(pathArr[i].longitude,pathArr[i].latitude))
                                }
                            }
                            if(dataArr.length != 0){
                                that.renderGreenLine(dataArr);
                            }else{
                            }
                        }

                    })
                })

            },
            getStations:function (lineId) {
                console.log("getStation");
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
            renderBlueLine:function (pathArr) {
                let that = this;
                // 先移除之前绘画的坐标点
                // that.map.removeOverlay(that.buleLine);
                // that.map.removeOverlay(that.startIcon);
                // that.map.removeOverlay(that.endIcon);
                if(that.buleLine){
                    that.buleLine.setPath(pathArr)
                    that.startIcon.setPosition(pathArr[0])
                    that.endIcon.setPosition(pathArr[pathArr.length-1])
                }else{
                    that.buleLine = new BMap.Polyline(pathArr,{strokeColor:"blue", strokeWeight:6, strokeOpacity:0.5}); // 绘画线路
                    that.startIcon = new BMap.Marker(pathArr[0],{icon:new BMap.Icon(blueStart, new BMap.Size(100,100))});  // 创建标注
                    that.endIcon = new BMap.Marker(pathArr[pathArr.length-1],{icon:new BMap.Icon(blueEnd, new BMap.Size(100,100))});  //
                    that.map.addOverlay(that.buleLine);
                    that.map.addOverlay(that.startIcon);
                    that.map.addOverlay(that.endIcon);// 创建标注
                }
                // 让地图的视口移动到车辆位置
                // that.map.panTo(pathArr[pathArr.length-1], {
                //     noAnimation: true
                // });
                // 增加mark
                that.map.setViewport(pathArr)
            },
            renderGreenLine:function (pathArr) {
                // 这个是当前的公务车订单,只需要绘画一次即可
                let greenLine = new BMap.Polyline(pathArr,{strokeColor:"green", strokeWeight:6, strokeOpacity:0.5});
                let startIcon = new BMap.Marker(pathArr[0],{icon:new BMap.Icon(greenStart, new BMap.Size(100,100))});  // 创建标注
                let endIcon = new BMap.Marker(pathArr[pathArr.length-1],{icon:new BMap.Icon(greenEnd, new BMap.Size(100,100))});  // 创建标注
                this.map.panTo(pathArr[pathArr.length-1], {
                    noAnimation: true
                });
                this.map.addOverlay(greenLine);
                this.map.addOverlay(startIcon);
                this.map.addOverlay(endIcon);
                this.map.setViewport(pathArr)
            },
            changeVehicle:function (id) {
                let that = this;
                // this.currentCar = item;
                // this.showSelect = false;
                $.ajax({
                    url: `${base.gAjaxUrl.officialcarorders}${id}/carpool_paths/`,
                    type:"GET",
                }).always((data)=>{
                    that.loading = false;
                    base.ajaxCallback(data,function () {
                        let dataArr = [];
                        if(data.path.length != 0 ){
                            let pathArr = data.path;
                            for (let i = 0,len = pathArr.length; i < len; i++) {
                                if(pathArr[i].longitude){
                                    dataArr.push(new BMap.Point(pathArr[i].longitude,pathArr[i].latitude))
                                }
                            }
                            if(dataArr.length != 0){
                                that.renderBlueLine(dataArr);
                            }else{
                            }

                        }
                    })
                })
            },
            clickSelect:function () {
                this.showSelect = true;
            },
            clickItem:function(index,id){
                this.loading = true;
                this.index.index = index;
                this.changeVehicle(id)

            },

        },
        filters: {
        },
        events: {
            change: function (index) {
                this.changeVehicle(this.arr[index].id)
            },
            refresh:function (dataArr) {
                this.listArr = dataArr;
                this.map.removeOverlay(this.buleLine);
                this.map.removeOverlay(this.startIcon);
                this.map.removeOverlay(this.endIcon);
            }
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