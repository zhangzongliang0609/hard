<template>
    <section class="Hui-article-box">
        <div class="page-container bgc-f5 bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body clearfix">
                    <span class="f-26 lh-30 f-l mt-10 mb-10">轨迹查询</span>
                    <div class="mt-10 lh-30 mb-10 input-box text-c pl-10 pr-10 f-l clearfix">
                        <input id="searchCarId" class="f-l" type="text" placeholder="车牌号" class="input-text text-c">
                        <div @click="queryAjax(1)" class="search f-l radius-r"><i class="Hui-iconfont">&#xe665;</i>
                        </div>
                    </div>
                    <button id="exportData" class="mt-10 lh-30 mb-10 btn btn-primary radius f-r"
                            v-on:click="exportData()">导出位置信息
                    </button>
                </div>
            </div>
            <div class="operation bk-gray radius bgc-fff">
                <div class="car_status clearfix">
                    <div class="car_all f-l" @click="setStatus(0)">
                        <div class="number tc lh-42 f-26" :class="{'c-09f': currentStatus == 0}">{{summary ?
                            summary.count : 0}}
                        </div>
                        <div class="txt f-16 lh-30">
                            <span class="all mr-5"></span>
                            全部
                        </div>
                    </div>
                    <div class="car_line f-l"></div>
                    <div class="car_online f-l" @click="setStatus(1)">
                        <div class="number tc lh-42 f-26" :class="{'c-0c9': currentStatus == 1}">{{summary ?
                            summary.online : 0}}
                        </div>
                        <div class="txt f-16 lh-30">
                            <span class="online mr-5"></span>
                            在线
                        </div>
                    </div>
                    <div class="car_line f-l"></div>
                    <div class="car_offline f-l" @click="setStatus(2)">
                        <div class="number tc lh-42 f-26" :class="{'c-ae': currentStatus == 2}">{{summary ?
                            summary.offline : 0}}
                        </div>
                        <div class="txt f-16 lh-30">
                            <span class="offline mr-5"></span>
                            离线
                        </div>
                    </div>
                </div>
                <div class="car_list no-selected">
                    <div class="car_item" data-id="{{item.vehicle_id}}" v-for="item in busArr">
                        <div class="info clearfix" @click="moveToPoint(item)">
                            <div :class="[item.online ? 'info_status_online' : 'info_status_offline']"
                                 class="f-l info_isOnline"></div>
                            <div class="ml-5 info_car_no text-overflow f-16 lh-30 f-l">{{item.car_no || '--'}}</div>
                            <div @click.stop="getTrack(item, $event)"
                                 :class="[currentCarId == item.vehicle_id ? 'info_location_checked' : 'info_location_unchecked']"
                                 class="info_location ml-5 f-16 lh-30 f-r"></div>
                            <div v-if="item.online" class="ml-5 btn_ c-fff speed radius info_status f-14 lh-30 f-r">
                                {{item.speed | getSpeed}}
                            </div>
                            <div v-else class="ml-5 btn_ c-fff status radius info_status f-14 lh-30 f-r">离线</div>
                        </div>
                    </div>
                    <div class="date" id="dateInputBox">
                        <input size="16" readonly v-model="dateInput" type="text" class="input-text Wdate mr-5" id="J-date-input" v-bind:value="dateInput"/>
                    </div>
                    <div class="page_set clearfix">
                        <div @click="nextPage" class="f-r _btn next mr-30">
                            <i class="icon Hui-iconfont">&#xe6d5;</i>
                        </div>
                        <div @click="prevPage" class="f-r _btn prev">
                            <i class="icon Hui-iconfont">&#xe6d6;</i>
                        </div>
                        <div @click="turnToPage" class="f-r go btn mr-5">GO</div>
                        <div class="f-r page mr-5"> / {{totalPage}} 页</div>
                        <input v-model="pageInput" id="page_input" class="f-r mr-5" type="text">
                    </div>
                </div>
            </div>
        </div>
        <div class="map_box" id="map_pinba">
            <div id="map"></div>
        </div>
        <div class="hide" id="hideElements">
            <div class="carInfoBox">
                <img class="closeBtn" src="/static/images/closeinfowindow_95e6fa5.png" align="right"
                     style="position:absolute;right:0px;cursor:pointer;margin:15px 20px 0 0"/>
                <div class="carInfoWindow">
                    <div class="carInfoHeader0">
                        <span class="carNo" title=""></span>
                    </div>
                    <div class="carInfoContent">
                        <div class="carInfoItem">
                            <div class="infoItemTitle">定位时间:</div>
                            <div class="infoItemContent locationTime">2018-02-27 09:03:21</div>
                        </div>
                        <div class="carInfoItem">
                            <div class="infoItemTitle">上传时间:</div>
                            <div class="infoItemContent upTime">2018-02-27 09:03:38</div>
                        </div>
                        <div class="carInfoItem">
                            <div class="infoItemTitle">经纬度:</div>
                            <div class="infoItemContent position">113.202672,21.993289</div>
                        </div>
                        <div class="carInfoItem">
                            <div class="infoItemTitle">位置:</div>
                            <div class="infoItemContent address">广东省珠海市金湾区高栏港大道</div>
                        </div>
                        <div class="carInfoItem">
                            <div class="infoItemTitle">司机:</div>
                            <div class="infoItemContent driver"> -- </div>
                        </div>
                        <div class="carInfoItem">
                            <div class="infoItemTitle">手机号:</div>
                            <div class="infoItemContent phone"> -- </div>
                        </div>
                        <div class="carInfoItem">
                            <div class="infoItemTitle">速度:</div>
                            <div class="infoItemContent speed">60.0km/h</div>
                        </div>
                        <div class="carInfoItem">
                            <div class="infoItemTitle">高度:</div>
                            <div class="infoItemContent height">4米</div>
                        </div>
                        <div class="carInfoItem">
                            <div class="infoItemTitle">精度:</div>
                            <div class="infoItemContent accuracy">10米</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="zoomControl BMap_noprint anchorBR">
                <div class="zoomIn"></div>
                <div class="zoomOut"></div>
            </div>
            <div class="speedControl BMap_noprint anchorBR"></div>
            <div class="rulerControl">
                <div class="timeline visible">
                    <div class="timelineControl">
                        <div class="timelinePlay"></div>
                        <div class="timelineSlow"></div>
                        <div class="timelineQuick"></div>
                    </div>
                    <div class="timelineMain">
                        <div class="timelineMainMask">
                            <div class="timelineProgress" style="left: 0px"></div>
                        </div>
                        <div class="timeHour timeHourFirst"></div>
                        <div class="timeHour"></div>
                        <div class="timeHour"></div>
                        <div class="timeHour"></div>
                        <div class="timeHour"></div>
                        <div class="timeHour"></div>
                        <div class="timeHour"></div>
                        <div class="timeHour"></div>
                        <div class="timeHour"></div>
                        <div class="timeHour"></div>
                        <div class="timeHour"></div>
                        <div class="timeHour"></div>
                        <div class="timeHour"></div>
                        <div class="timeHour"></div>
                        <div class="timeHour"></div>
                        <div class="timeHour"></div>
                        <div class="timeHour"></div>
                        <div class="timeHour"></div>
                        <div class="timeHour"></div>
                        <div class="timeHour"></div>
                        <div class="timeHour"></div>
                        <div class="timeHour"></div>
                        <div class="timeHour"></div>
                        <div class="timeHour timeHourFinal"></div>
                        <div class="timeNumber">0</div>
                        <div class="timeNumber">1</div>
                        <div class="timeNumber">2</div>
                        <div class="timeNumber">3</div>
                        <div class="timeNumber">4</div>
                        <div class="timeNumber">5</div>
                        <div class="timeNumber">6</div>
                        <div class="timeNumber">7</div>
                        <div class="timeNumber">8</div>
                        <div class="timeNumber">9</div>
                        <div class="timeNumber">10</div>
                        <div class="timeNumber">11</div>
                        <div class="timeNumber">12</div>
                        <div class="timeNumber">13</div>
                        <div class="timeNumber">14</div>
                        <div class="timeNumber">15</div>
                        <div class="timeNumber">16</div>
                        <div class="timeNumber">17</div>
                        <div class="timeNumber">18</div>
                        <div class="timeNumber">19</div>
                        <div class="timeNumber">20</div>
                        <div class="timeNumber">21</div>
                        <div class="timeNumber">22</div>
                        <div class="timeNumber">23</div>
                        <div class="timeNumber">24</div>
                        <div class="timelineLabel blank" style="left: 0px;display: none">
                            <div class="timelineLabelcontent"></div>
                            <div class="timelineLabelpointer"></div>
                        </div>
                        <div class="caliperA" style="left: 0px;">
                            <div class="caliperLine"></div>
                            <div class="caliperPointerA"></div>
                        </div>
                        <div class="caliperB" style="left: 481px;">
                            <div class="caliperLine"></div>
                            <div class="caliperPointerB"></div>
                        </div>
                        <div class="caliperPartA" style="width: 0px;"></div>
                        <div class="caliperPartB" style="width: 0px;"></div>
                    </div>
                </div>
            </div>
            <div class="behavior behaviorControl">
                <div class="behavior_title">驾驶行为分析</div>
                <div class="behavior_content clearfix">
                    <div class="behavior_item speeding f-l">
                        <div class="behavior_item_number speeding_num">0</div>
                        <div class="behavior_item_select clearfix" data-item="speeding">
                            <div class="behavior_item_select_box f-l"></div>
                            <div class="behavior_item_name f-l">超速</div>
                        </div>
                    </div>
                    <div class="behavior_item harsh_acceleration f-l">
                        <div class="behavior_item_number harsh_acceleration_num">0</div>
                        <div class="behavior_item_select clearfix" data-item="harsh_acceleration">
                            <div class="behavior_item_select_box f-l"></div>
                            <div class="behavior_item_name f-l">急变速</div>
                        </div>
                    </div>
                    <div class="behavior_item harsh_breaking f-l">
                        <div class="behavior_item_number harsh_breaking_num">0</div>
                        <div class="behavior_item_select clearfix" data-item="harsh_breaking">
                            <div class="behavior_item_select_box f-l"></div>
                            <div class="behavior_item_name f-l">急刹车</div>
                        </div>
                    </div>
                    <div class="behavior_item harsh_steering f-l">
                        <div class="behavior_item_number harsh_steering_num">0</div>
                        <div class="behavior_item_select clearfix" data-item="harsh_steering">
                            <div class="behavior_item_select_box f-l"></div>
                            <div class="behavior_item_name f-l">急转弯</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="behaviorOverlay"></div>
            <div class="car_marker">
                <img src="../../assets/images/bus-blue.png" alt="" class="car_img blue show">
                <span class="car_no"></span>
            </div>
        </div>
        <div class="m-loading" v-show="itemsLoading">
            <div class="cube1"></div>
            <div class="cube2"></div>
        </div>
        <exp :data="exportVehicleData" :type="dialogType" v-if="isShowExport" v-on:dialog-close="exportClose"></exp>
    </section>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .info_car_no{
        width:100px;
        font-size: 14px;
    }
    .page-container {
        width: 100%;
        height: 100%;
        min-width: 1000px;
        padding: 10px;
        padding-bottom: 50px;
        position: relative;
        box-sizing: border-box;
        .panel-body {
            padding: 8px;
            .input-box {
                position: relative;
                input {
                    width: 158px;
                    border: 1px solid #ddd;
                    font-size: 12px;
                    height: 29px;
                    padding: 0 10px;
                }
                .search {
                    background-color: #6498e1;
                    height: 31px;
                    width: 40px;
                    position: relative;
                    cursor: pointer;
                    i {
                        width: 100%;
                        text-align: center;
                        font-size: 20px;
                        color: white;
                        cursor: pointer;
                    }
                }
            }
        }
    }

    .operation {
        box-sizing: border-box;
        width: 290px;
        position: absolute;
        left: 10px;
        top: 99px;
        bottom: 20px;
        min-height: 720px;
        overflow: hidden;
        .car_status {
            border-bottom: 1px solid #eee;
            & > div {
                height: 90px;
                width: 90px;
                text-align: center;
                .number {
                    margin-top: 9px;
                    cursor: pointer;
                }
                &.car_all, &.car_online {
                    margin-left: 5px;
                }
                span {
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    vertical-align: middle;
                    border-radius: 50%;
                    &.all {
                        background-color: #0099ff;
                    }
                    &.online {
                        background-color: #00cc99;
                    }
                    &.offline {
                        background-color: #aeaeae;
                    }
                }
            }
            .car_line {
                border-right: 1px solid #d7d7d7;
                width: 0;
                height: 50px;
                margin-top: 10px;
            }
        }
        .car_list {
            & > div {
                .info {
                    /*height: 30px;*/
                    padding: 5px 10px;
                    border-bottom: 1px solid #eee;
                    .btn_ {
                        cursor: default;
                        padding: 0 5px;
                    }
                    .info_isOnline {
                        width: 30px;
                        height: 30px;
                    }
                    .info_status_online {
                        background: url("/static/images/icon-bus-online.png") no-repeat center center /18px 20px;
                    }
                    .info_status_offline {
                        background: url("/static/images/icon-bus-offline.png") no-repeat center center /18px 20px;
                    }
                    .speed {
                        background-color: #429842;
                    }
                    .status {
                        background-color: #ddd;
                        box-shadow: 0 0 0 0;
                    }
                    .info_location {
                        width: 40px;
                        height: 30px;
                        cursor: pointer;
                    }
                    .info_location_checked {
                        background: url("../../assets/images/icon-location-review-active.png") no-repeat center center /20px 20px;
                    }
                    .info_location_unchecked {
                        background: url("../../assets/images/icon-location-review.png") no-repeat center center /20px 20px;
                    }
                }
                .date {
                    display: block;
                }
            }
            .date {
                border: 5px solid #ddd;
                display: none;
                input {
                    outline: none;
                    border: none;
                    height: 20px;
                    font-size: 16px;
                    padding-right: 30px;
                    background-color: #fff;
                    text-align: center;
                }
            }
            .page_set {
                font-size: 16px;
                line-height: 30px;
                border: 1px solid #eee;
                border-top: 0 none;
                padding: 5px;
                #page_input {
                    padding: 0 8px;
                    width: 30px;
                    height: 30px;
                    font-size: 16px;
                    outline: none;
                    border: 1px solid #ddd;
                }
                ._btn {
                    cursor: pointer;
                    width: 26px;
                    height: 30px;
                    text-align: center;
                    font-weight: 700;
                    font-size: 22px;
                    line-height: 26px;
                    border: 1px solid #ddd;
                }
                .prev {
                    border-right: 0 none;
                    color: #1495ff;
                    /*
                    background: url("../assets/images/icon-packup.png") no-repeat center center /20px 20px;
                    */
                }
                .prev.disabled {
                    color: #ccc;
                }
                .next {
                    color: #1495ff;
                    /*
                    background: url("../assets/images/icon-unfold.png") no-repeat center center /20px 20px;
                    */
                }
                .next.disabled {
                    color: #ccc;
                }
            }
        }
    }

    #map_pinba {
        position: absolute;
        left: 310px;
        top: 99px;
        right: 20px;
        bottom: 20px;
        min-height: 720px;
        border-radius: 5px;
        box-sizing: border-box;
        border: 1px solid #ccc;
        overflow: hidden;
    }

    #map {
        z-index: 1;
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background-color: #0c9;
    }

    .car_marker {
        position: absolute;
        left: 0;
        top: 0;
        width: 100px;
        height: 60px;
    }

    .car_img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
    }

    .car_no {
        position: absolute;
        width: 100px;
        height: 17px;
        text-align: center;
        line-height: 17px;
        font-size: 12px;
        left: 0;
        top: 0;
        z-index: 2;
        color: #fff;
        padding: 3px;
        /*background-color: orange;*/
    }

    .c-09f {
        color: #0099ff;
    }

    .c-0c9 {
        color: #00cc99;
    }

    .c-ae {
        color: #aeaeae;
    }
    .carInfoHeader0 {
        background-image: url("/static/images/icon-car-online.png");
        background-size: 18px 20px;
    }
    .carInfoHeader1 {
        background-image: url("/static/images/icon-car-offline.png");
        background-size: 18px 20px;
    }
</style>
<style lang="less" scoped>
    @import '../../assets/css/baiduTrail.css';
</style>
<script type="text/ecmascript-6">
    import * as base from '../../assets/js/base';
    import moment from "moment";
    import baiduTrail from "../../assets/js/baiduTrail";
    import exp from "../components/exportLocation.vue";

    let param = null;
    export default{
        ready: function () {
            param = {
                page: 1,
                page_size: 10,
                status: 0,
                car_no: "",
            };
            this.queryAjax();
            this.$nextTick(() => {
                this.loadMap();
            });
            this.dateInput = moment().format("YYYY-MM-DD");
            new Kalendae.Input('J-date-input', {
                months: 1,
                subscribe: {
                    'date-clicked': function (date) {
                        this.dateInput = date._i;
                        this.trackAjax();
                    }.bind(this)
                },
                clickHide: true,
            });
            this.dateInputDom = document.getElementById("dateInputBox");
            this.$currentInfoWinDom = $("#hideElements .carInfoBox").clone();
        },
        watch: {
            dateInput: function (n, o) {
                if (/^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12]\d|3[01])$/.test(n)) {
//                    console.log(true, n);
                } else {
//                    console.log(false, n);
                }
            },
        },
        data: function () {
            return {
                busArr1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                busArr: [], // 车辆数组
                itemsLoading: false, // 车辆数组
                isShowExport: false, // 显示隐藏导出位置信息组件
                dialogType: "car", // 是否能数据导出
                map: null,
                index: 0, // 滚动索引
                searchContent: '', // 搜索的内容
                distance: 0, // ul滚动的距离
                showInputList: false, // 是否显示搜索的下拉框
                isRefresh: false,
                currentCarId: '', // 选中車輛的id -- 轨迹查询的车辆
                currentCarItem: {}, // 选中車輛的信息 -- 轨迹查询的车辆
                intervalId: null, // 用来清除定时器Id，防止因为组件频繁调用而导致
                dateInput: "", // 查询车辆的绑定日期
                currentCarIndex: 0, // 车辆的
                currentStatus: 0, // 0 所有；1 在线；2 离线
                dateInputDom: null, // 日期选择输入框的按钮 DOM
                pageInput: 1, // 日期输入值
                baiduTrailInstance: null, // 轨迹回放的实例对象
                totalPage: 0, // 总页数
                summary: null, // 总页数
                exportVehicleData: {
                    date: '',
                    item: null,
                },
                currentCarMarker: null, // 当前车辆的marker数组
                $currentInfoWinDom: null, // 当前车辆实时定位信息窗体DOM对象
                currentInfoOverlay: null, // 当前车辆实时定位信息窗窗体覆盖物对象
            }
        },
        methods: {
            loadMap: function () {
                let that = this;
                let max = 100, num = 0;

                function init() {
                    num++;
                    if (num > max) {
                        $("#map_pinba").css({"color": "#fff", "font-size": "20px"}).html("地图加载失败");
                        return;
                    }
                    try {
                        if (that.isRefresh) {
                            return;
                        }
                        // 创建地图，关闭地图默认的POI事件
                        var map = new BMap.Map("map", {enableMapClick: false});
                        that.map = map;
                        var point = new BMap.Point(116.404, 39.915); // 创建点坐标
                        map.enableScrollWheelZoom(); //启用滚轮放大缩小
                        map.disableDoubleClickZoom(true); // 禁止双击自动放大
                        map.enableAutoResize(); // 自动缩放尺寸
                        // 在当前页面刷新的话，下面的load方法会加载两次
                        map.addEventListener("load", function () {
//							console.log("show -- map load");
                            num = 0;
                            that.baiduTrailInstance = new baiduTrail({
                                id: "map_pinba", // 地图容器的盒子
                                map: that.map,
                                data: {
                                    points: [], // 轨迹数组
                                    behavior: [], // 轨迹行为分析
                                    driver: [], // 司机信息
                                    vehicle: {}, // 车辆信息
                                },
                                moment: moment,
                                zoom: true, // 是否启动地图缩放控件
                                speedStatus: true, // 是否根据速度绘制线路
                                behavior: true, // 是否进行车辆行为分析
                                online: true, // 车辆是否在线
                                centerTime: false, // 是否将轨迹记录时间段设置在坐标轴中间 默认false
                                clearOverlayCallback: that.clearOverlayCallback,
                            })
                        });
                        map.centerAndZoom(point, 15);
                    } catch (e) {
                        console.log(e);
                        if (!this.map) {
                            setTimeout(init, 3000)
                        }
                    }
                };
                init();
            },
            addInfoWin: function (item) {
                function RealTimeOverlay(div, map, point) {
                    this._div = div;
                    this._map = map;
                    this._point = point;
                }
                var pt = new BMap.Point(item.longitude, item.latitude);
                RealTimeOverlay.prototype = new BMap.Overlay();
                RealTimeOverlay.prototype.initialize = function (map) {
                    map.getPanes().labelPane.appendChild(this._div);
                    return this._div;
                };
                RealTimeOverlay.prototype.draw = function () {
                    var map = this._map;
                    var pixel = map.pointToOverlayPixel(this._point);
                    this._div.style.left = pixel.x - 156 + "px"; // 宽度 313px
                    this._div.style.top = pixel.y - 226 + "px"; // 高度 221px 补偿 5个像素
                };
                this.$currentInfoWinDom.find(".closeBtn").click(function () {
                    this.currentInfoOverlay.hide();
                    this.currentCarMarker.hide();
                }.bind(this));
                this.$currentInfoWinDom.mousewheel(function (e) {
                    if(e.stopPropagation) {
                        e.stopPropagation();
                    } else {
                        window.event.cancelBubble = true;
                    }
                });
                this.currentInfoOverlay = new RealTimeOverlay(this.$currentInfoWinDom[0], this.map, pt);
                this.map.addOverlay(this.currentInfoOverlay);
                this.currentInfoOverlay.show();

                var cMarkerIcon = new BMap.Icon("/static/images/icon-map-track.png", new BMap.Size(20, 20), {
                    imageOffset: new BMap.Size(0, 0),
                    imageSize: new BMap.Size(20, 20),
                });
                this.currentCarMarker = new BMap.Marker(pt, {icon: cMarkerIcon});
                this.map.addOverlay(this.currentCarMarker);
                this.currentCarMarker.show();
            },
            setInfoWin: function (item, driver) {
                var that = this;
                var pt = new BMap.Point(item.longitude, item.latitude);
                this.baiduTrailInstance.myGeo.getLocation(pt, function (res) {
                    that.$currentInfoWinDom.find(".address").text(res.address);
                });
                // 更新信息窗体相关DOM内容
                this.$currentInfoWinDom.find(".carNo").text((item.car_no || '--') + '【实时位置】');
                this.$currentInfoWinDom.find(".position").text(item.longitude.toFixed(6) + ", " + item.latitude.toFixed(6));
                this.$currentInfoWinDom.find(".driver").text(driver.real_name || '--');
                this.$currentInfoWinDom.find(".phone").text(driver.phone || '--');
                this.$currentInfoWinDom.find(".speed").text(item.speed ? (item.speed.toFixed(1) + "Km/h") : '--');
                this.$currentInfoWinDom.find(".locationTime").text(moment(item.loc_time * 1000).format("YYYY-MM-DD HH:mm:ss"));
                this.$currentInfoWinDom.find(".upTime").parent().remove();
                this.$currentInfoWinDom.find(".height").parent().remove();
                this.$currentInfoWinDom.find(".accuracy").parent().remove();
                if(item.online == undefined || item.online) {
                    this.$currentInfoWinDom.find(".carInfoHeader0").removeClass("carInfoHeader1");
                } else {
                    this.$currentInfoWinDom.find(".carInfoHeader0").addClass("carInfoHeader1");
                }
                if(this.currentInfoOverlay == null) {
                    this.addInfoWin(item);
                    return;
                }

                this.currentInfoOverlay._point = pt;
                this.currentInfoOverlay.draw();
                this.currentInfoOverlay.show();
                this.currentCarMarker.setPosition(pt);
                this.currentCarMarker.show();
            },
            clearOverlayCallback: function () {
                // 当地图轨迹插件调用clearOverlays方法重新绘制覆盖物时调用此回调
                // 查看轨迹回放的时候，清除实时位置信息
                this.map.removeOverlay(this.currentInfoOverlay);
                this.map.removeOverlay(this.currentCarMarker);
                this.currentInfoOverlay = null;
                this.currentCarMarker = null;
            },
            moveToPoint: function (item) {
                if (this.map == null) {
                    layer.msg("地图尚未加载完成", {icon: 2, time: 1500});
                    return;
                }
                this.map.panTo(new BMap.Point(item.longitude, item.latitude));
                this.itemsLoading = true;
                $.ajax({
                    url: `${base.gAjaxUrl.carLocationGetDriver}`,
                    type: "GET",
                    data: {
                        vehicle_id: item.vehicle_id,
                    }
                }).always((driver) => {
                    this.itemsLoading = false;
                    this.setInfoWin(item, driver);
                })
            },
            moveTo: function (item) {
                if (this.map == null) {
                    setTimeout(this.moveTo, 300);
                    return;
                }
                this.map.panTo(new BMap.Point(item.longitude, item.latitude));
            },
            checkPage: function () {
                // disabled
//                console.log("disabled", param.page);
                if (param.page <= 1) {
                    $(".prev").addClass("disabled");
                } else {
                    $(".prev").removeClass("disabled");
                }
                if (param.page >= this.totalPage) {
                    $(".next").addClass("disabled");
                } else {
                    $(".next").removeClass("disabled");
                }
            },
            prevPage: function () {
                if (param.page == 1) return;
                param.page--;
                this.queryAjax();
            },
            nextPage: function () {
                if (param.page >= this.totalPage) return;
                param.page++;
                this.queryAjax();
            },
            turnToPage: function () {
                if (this.pageInput == param.page) return;
                if (this.pageInput < 1) {
                    layer.msg("页数最小为 1 ！", {icon: 2, time: 1500});
                    this.pageInput = 1;
                    return;
                }
                if (this.pageInput > this.totalPage) {
                    layer.msg("页数最大为 " + this.totalPage + " ！", {icon: 2, time: 1500});
                    this.pageInput = this.totalPage;
                    return;
                }
                param.page = this.pageInput;
                this.queryAjax();
            },
            setStatus: function (para) {
                if (param.status == para) return;
                this.currentStatus = param.status = para;
                param.page = 1;
                this.queryAjax();
            },
            queryAjax: function (para) {
                this.itemsLoading = true;
                if (para) {
                    param.car_no = $("#searchCarId").val();
                    param.page = 1;
                }
                this.pageInput = param.page;
                $.ajax({
                    url: `${base.gAjaxUrl.officialcarPath_V2}device_info/`,
                    type: "GET",
                    data: param
                }).always((data) => {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, () => {
                        // 判断如果当前组件已经因为页面刷新而被销毁，异步回来的数据不做任何处理，否则会影响到最新一次ready出来的界面
                        if (this.isRefresh) return;
                        this.totalPage = data.num_pages; // 总页数
                        this.busArr = data.result; // 车辆列表
                        this.summary = data.summary; //
                        this.checkPage();
                        this.busArr.length && this.moveTo(this.busArr[0]);
                        this.$nextTick(()=>{
                            this.setDateInput();
                        });
                    })
                })
            },
            setDateInput: function () {
                var that = this;
                $(".car_item").each(function (i, item) {
                    if($(this).attr("data-id") == that.currentCarId) {
                        $(this).append(that.dateInputDom);
                        that.baiduTrailInstance.showAllPolyline();
                        return false;
                    }
                })
            },
            getTrack: function (item, e) {
                if (item.vehicle_id === this.currentCarId) return;
                if (this.map == null) {
                    layer.msg("地图尚未加载完成", {icon: 2, time: 1500});
                    return;
                }
                $(e.target).parents(".car_item").append(this.dateInputDom);
                this.dateInput = moment().format("YYYY-MM-DD");
                this.currentCarId = item.vehicle_id;
                this.currentCarItem = item;
                this.trackAjax();
            },
            trackAjax: function () {
                this.itemsLoading = true;
                $.ajax({
                    url: `${base.gAjaxUrl.carTrack}`,
                    type: "GET",
                    data: {
                        vehicle_id: this.currentCarId,
                        start_date: this.dateInput,
                    }
                }).always((data) => {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, () => {
                        this.baiduTrailInstance.setOptions({
                            points: data.tracks,
                            behavior: data.drivingbehavior,
                            driver: data.driver,
                            vehicle: this.currentCarItem,
//                            behavior: mSpeed.behavior,
                        });
                    })
                })
            },
            exportData: function () {
                this.isShowExport = true;
                this.exportVehicleData.item = this.currentCarItem;
                this.exportVehicleData.date = this.dateInput;
            },
            exportClose: function () {
                this.isShowExport = false;
            },
        },
        filters: {
            getSpeed: function (speed) { // 在线状态下才会调用此方法
                var s = Math.round(speed);
                if (!s) {
                    return "静止";
                } else {
                    return s + "km/h";
                }
            }
        },
        beforeDestroy(){
//			console.log("show -- beforeDestory");
            this.isRefresh = true;
            clearInterval(this.intervalId);
        },
        components: {
            exp
        }
    }
</script>