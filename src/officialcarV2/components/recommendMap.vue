<template>
    <div class="driver-box-shade">
            <div class="ctrl-box cl pt-10">
                    <div class="inline-block mr-20">
                        <span :class="{'current-item':isInclude(item,$index)}" v-for="item in listArr" class="item-box ml-15 list-span" @click="clickItem($index,item)">
                            {{$index+1}}
                        </span>
                    </div>
                        <span class="fw-b">原订单线路:</span>
                        <span class="line-green"></span>
                        <!--<span class="fw-b">拼单线路:</span>-->
                        <!--<span class="line-blue"></span>-->
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
    }
    .current-item{
        background-color: #30bfb0;
        color:white;
    }

    .item1{
        background: #7ed321;
        color: white;
    }
    .item2{
        background: #fbcf23;
        color: white;
    }
    .item3{
        background: #f07b41;
        color: white;
    }
    .item4{
        background: #50cfe3;
        color: white;
    }
    .item5{
        background: #3aa3ea;
        color: white;
    }

</style>
<style>
    #app,body{
        height: 100%;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../../assets/js/base.js';
    let greenStart = require('../../assets/images/green-start.png');
    let greenEnd = require('../../assets/images/green-end.png');
    let blueStart = require('../../assets/images/blue-start.png');
    let blueEnd = require('../../assets/images/blue-end.png');
    export default{
        ready(){
            this.listArr = this.arr;
            this.selectedLineArr = this.selarr;
            this.loadMap();
            // if(this.arr.length != 0 && this.index.index !== ''){
            //     this.changeVehicle(this.arr[this.index.index])
            // }
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
                // buleLine:'',
                startIcon:'',
                endIcon:'',
                loading:false,
                listArr:'',
                colorArr:["item1","item2","item3","item4","item5"],
                mergeLineMapArr:[],
                selectedLineArr:[],
            }
        },
        watch: {
            // 'listArr': {
            //     handler: function (curVal, oldVal) {
            //         this.selectedLineArr = [];
            //     },
            //     deep: true,
            // },
            'selectedLineArr':{
                handler:function(curVal){
                    this.map.clearOverlays();
                    for (let i = 1; i < curVal.length; i++) {
                        this.changeVehicle(curVal[i],i);
                    }
                },
                deep: true,
            },

        },
        props:["order",'arr','index','selarr'],
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
                let p1 = new BMap.Point(this.order.source_longitude,this.order.source_latitude);
                let p2 = new BMap.Point(this.order.destination_longitude,this.order.destination_latitude);
                //
                let driving = new BMap.DrivingRoute(map, {renderOptions:{autoViewport: true}});
                let dataArr = [];
                driving.setSearchCompleteCallback((routerResult)=>{
                    dataArr = routerResult.getPlan(0).getRoute(0).getPath();
                    that.renderGreenLine(dataArr);
                })
                driving.search(p1, p2);
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
            renderBlueLine:function (pathArr,item) {
                let that = this;
                // 先移除之前绘画的坐标点
                // that.map.removeOverlay(that.buleLine);
                // that.map.removeOverlay(that.startIcon);
                // that.map.removeOverlay(that.endIcon);
                // if(that.buleLine){
                //     that.buleLine.setPath(pathArr)
                //     that.startIcon.setPosition(pathArr[0])
                //     that.endIcon.setPosition(pathArr[pathArr.length-1])
                // }else{
                    that.buleLine = new BMap.Polyline(pathArr,{strokeColor:item.lineColor, strokeWeight:6, strokeOpacity:0.5}); // 绘画线路
                    that.startIcon = new BMap.Marker(pathArr[0],{icon:new BMap.Icon(blueStart, new BMap.Size(100,100))});  // 创建标注
                    that.endIcon = new BMap.Marker(pathArr[pathArr.length-1],{icon:new BMap.Icon(blueEnd, new BMap.Size(100,100))});  //

                    that.map.addOverlay(that.buleLine);
                    that.map.addOverlay(that.startIcon);
                    that.map.addOverlay(that.endIcon);// 创建标注
                // }
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
                //  disableMassClear防止在清除覆盖物的时候被清除掉.
                greenLine.disableMassClear();
                startIcon.disableMassClear();
                endIcon.disableMassClear();
                this.map.addOverlay(greenLine);
                this.map.addOverlay(startIcon);
                this.map.addOverlay(endIcon);
                this.map.setViewport(pathArr)
            },
            changeVehicle:function (item,index) {
                let p1 = new BMap.Point(item.source_longitude,item.source_latitude);
                let p2 = new BMap.Point(item.destination_longitude,item.destination_latitude);
                //
                let driving = new BMap.DrivingRoute(this.map, {renderOptions:{autoViewport: true}});
                let dataArr = [];
                driving.setSearchCompleteCallback((routerResult)=>{
                    dataArr = routerResult.getPlan(0).getRoute(0).getPath();
                    this.renderBlueLine(dataArr,item);
                })
                driving.search(p1, p2);
            },
            clickSelect:function () {
                this.showSelect = true;
            },
            clickItem:function(index,item){
                // this.index.index = index;
                // this.changeVehicle(item)
            },
            isInclude:function(item,index){
                for (let trip of this.selectedLineArr){
                    if(trip.id == item.id){
                        this.$nextTick(()=>{
                            $(".list-span").eq(index).addClass(this.colorArr[index]);
                        })
                        return true;
                    }
                }
                this.$nextTick(()=>{
                    $(".list-span").eq(index).removeClass(this.colorArr[index]);
                })
                return false
            }
        },
        filters: {
        },
        events: {
            change: function (dataArr) {
                // this.changeVehicle(this.arr[index])
                this.selectedLineArr = dataArr;
            },
            refresh:function (dataArr) {
                this.listArr = dataArr;
                this.selectedLineArr = [];
                this.map.clearOverlays();
                // this.map.removeOverlay(this.buleLine);
                // this.map.removeOverlay(this.startIcon);
                // this.map.removeOverlay(this.endIcon);
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
