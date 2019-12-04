<template>

    <!-- 百度地图bug：
        有些自定义覆盖物上使用了e.preventDefault()，会导致如下效果
        点击单个提示，只存在一个临时的可选点，但是选择一个点之后，要点击两次地图，地图才能获得焦点进行第二次标记 -->
    <section class="Hui-article-box" v-on:click="hideSearchList">
        <div id="mContainer" class="page-container bgc-f5 bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body clearfix">
                    <span class="f-20 fw-b f-l">站点配置</span>
                </div>
            </div>
            <div class="panel panel-default mt-10 pd-10 radius clearfix line_sel_box">
                <div class="f-l">
                    线路名称：
                </div>
                <div class="f-l sel_con">
                    <div class="department_select_container" @mouseleave="departmentEnter(false,$event)"
                         @mouseenter="departmentEnter(true,$event)">
                        <input v-if="buslines.length === 0" disabled type="text" class="input-text" value="无可选择线路">
                        <input v-else autocomplete="off" @click="departmentClick($event)" v-model="selectLineName"
                               type="text" class="input-text" value="" placeholder="" name="department">
                        <i v-show="selectLineName !== ''" class="empty-icon Hui-iconfont"
                           @click="emptySearch($event)">&#xe60b;</i>
                        <div class="departmentListBox" style="display: none">
                            <div v-bind:title="item" track-by="$index"
                                 v-for="item in buslines | filterBy selectLineName in 'shuttle_name'"
                                 @click="setDepartmentValue(item,$event)" class="departmentListItem">
                                {{item.shuttle_name}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 站点模块 -->
            <div class="station_list_box bk-gray radius bgc-fff">
                <!--                <div id="setDirection" class="flex pl-20 pr-20">-->
                <!--                    <div class="text-c flex-1">-->
                <!--                        <div class="pd-10 fw-b bgc-c1" @click="toggleDirection($event,-10)">去程站点设置</div>-->
                <!--                    </div>-->
                <!--                    <div class="text-c flex-1">-->
                <!--                        <div class="pd-10 fw-b bgc-f5" @click="toggleDirection($event,10)">返程程站点设置</div>-->
                <!--                    </div>-->
                <!--                </div>-->

                <div class="text-c pl-10 pr-10 mt-10 mb-10 clearfix">
                    <div class="f-l col-11 row pointer clearfix"
                         @click="clickInput">
                        <div class="add_station f-l">
                            <input :disabled="!isCompile"
                                   type="text"
                                   placeholder="站点名称"
                                   class="input-text text-c radius add_station_input newStation">
                        </div>
                        <div class="ml-10 add_station f-l">
                            <input :disabled="!isCompile"
                                   type="number"
                                   placeholder="距下站点距离km"
                                   class="input-text text-c radius add_station_input newStationDistance">
                        </div>

                    </div>
                    <div class="col-1 f-l">
                        <img v-show="isCompile"
                             class="add_img_icon add pointer"
                             src="../../assets/images/icon-plus.png"
                             @click="addLineStation">
                    </div>
                </div>
                <p class="text-c f-12">拖拽站点可改变站点顺序↓</p>
                <div class="item_content">
                    <ul class="stationLists">
                        <li v-for="(index, station) in busStations">
                            <div class="item"
                                 v-on:click="moveToPoint($event, index, station)"
                                 @mouseup="itemDrag">
                                <div class="img-icon delete c-white"
                                     @click="deleteStation($index,station.station_name)"
                                     v-show="inputShow && $index == inputIndex"><i
                                        class="icon Hui-iconfont">&#xe6a6;</i>
                                </div>

                                <span class="item-name clearfix station_far" v-show="$index != inputIndex || !inputShow">
                                    <span class="f-l station_far_item text-overflow item-name">{{station.station_name}}</span>
                                    <span class="f-l station_far_item ml-5 text-overflow item-name">距离下站{{station.next_station_how_far}}Km</span>
                                </span>
                                <div class="lat_lng">经纬度：<i>{{station | getLngLat }}</i></div>
                                <div class="clearfix station_input_box"
                                     v-show="inputShow && $index == inputIndex">
                                    <div class="f-l station_input_item">
                                        <input type="text"
                                               placeholder="线路名称"
                                               v-model="station.station_name">
                                    </div>
                                    <div class="f-r station_input_item">
                                        <input type="number"
                                               placeholder="距离下站距离km"
                                               v-model="station.next_station_how_far">
                                    </div>
                                </div>

                                <div class="img-icon sure c-white" @click="saveStation(station.station_name)"
                                     v-show="inputShow && $index == inputIndex"><i
                                        class="icon Hui-iconfont">&#xe6a7;</i>
                                </div>
                                <div class="img-icon change c-333" @click="showSaveBtn($index)"
                                     v-show="isCompile && !inputShow"><i class="icon Hui-iconfont">&#xe6df;</i>
                                </div>
                            </div>
                            <span class="stationIndex">{{$index+1}}</span>
                        </li>
                    </ul>
                </div>
                <div class="text-c">
                    <a href="javascript:;" class="btn btn-primary radius mt-20" v-on:click="compile()"
                       v-show="!isCompile">编辑</a>
                    <a href="javascript:;" class="btn btn-primary radius mt-20" v-on:click="clickSave()"
                       v-show="isCompile">保存</a>
                </div>
            </div>

        </div>

        <!-- 地图模块 -->
        <div id="map_pinba">
            <div class="clearfix" style="position: relative; z-index: 1000;">
                <!-- <span class="select-box bgc-f4 relative f-l" style="padding:0">
                    <div class="selectmask" v-show="dataIsChange" @click="checkChange"></div>
                    <i class="icon icon-route"></i>
                </span> -->
            </div>
            <div id="map"></div>
            <div class="location_search_box">
                <input v-on:click="stopPro($event)" v-on:keydown="keydownToSearch($event)"
                       v-on:focus="focusToSearch($event)" v-model="searchInfo" type="text" placeholder="请输入地名检索"
                       id="search_input" size="20" class="search_input f-l">
                <div v-on:click="searchLocation" class="f-r searchBtn"><i class="Hui-iconfont">&#xe665;</i></div>
            </div>
            <div class="result_box">
                <div class="result_item clearfix" v-for="(index, item) in searchListArr"
                     v-on:click="select($event, item)">
                    <img src="../../assets/images/icon-station.png" class="result_item_img">
                    <div class="result_detail fr">
                        <div class="result_title">{{item.title}}</div>
                        <div class="result_adress">{{item.address}}</div>
                    </div>
                </div>
                <div v-if="noResult && searchListArr.length == 0" class="result_item ">
                    <div class="result_adress">未检索到结果</div>
                </div>
            </div>
        </div>

        <!-- 百度隐藏的dom因素 -->
        <div class="hide" id="hideElements">
            <img src="../../assets/images/icon_pointer.png" alt="" class="move_pointer">
            <div class="ctrl_point">
                <img src="../../assets/images/icon-station.png" alt="" class="ctrl_point_icon">
                <span class="ctrl_point_txt">标记站点</span>
            </div>
            <div class="win_station">
                <img class="win_station_img" src="../../assets/images/icon-station.png"/>
                <div class="win_station_name"></div>
                <div class="win_station_order"></div>
            </div>
            <div class="win_point_info">
                <div class="win_point_info_title">
                    标记站点
                    <div class="win_point_info_title_btn_delete">
                        X
                    </div>
                </div>
                <div class="win_point_info_address">
                    地址：
                </div>
                <div class="win_point_info_latlng">
                    经纬度：<span class="c-red"></span>
                </div>
                <div class="win_point_info_station">
                    选择站点：
                    <div class="available_station_list">
                        <div v-for="(index, item) in noCoordinateStationArr" class="available_station_item"
                             value="{{item.id + ',' + item.station_name + ',' + item.tempId}}"
                             title="{{item.station_name}}">{{item.station_name}}
                        </div>
                        <div v-if="noCoordinateStationArr.length == 0" class="available_station_item">无更多可选站点</div>
                    </div>
                </div>
                <div class="win_point_info_btns clearfix">
                    <div class="win_point_info_btn_save">保存</div>
                    <div class="win_point_info_btn_delete">删除</div>
                </div>
            </div>
        </div>
    </section>
</template>
<script type="text/ecmascript-6">

    import * as base from '../../assets/js/base.js';
    import * as drag from '../../assets/js/ferry-drag';

    // vue在当前路由
    export default {
        ready() {
            let that = this;
            this.getBuslines(() => {
                // that.getShuttlebusesStations();
            });
            that.loadMap();

        },
        data: function () {
            return {
                map: null, // 地图类
                geoLocation: null, // 定位类
                geoCoder: null, // 地址逆解析类
                ctrl: null, // 地图控件类
                stationMarkersArr: [], // 需要加载的该条线路的站点数组
                noCoordinateStationArr: [], // 没有分配坐标点的站点数组,用来选择可用站点
                stationIcon: null, // 标记站点的markder类的icon
                $infoWin: null, // jquery 对象 用来显示站点的信息窗体
                infoOverlay: null, // 原生的信息窗体无法满足事件定义的需求，需要增加自定义overlay样式
                localCity: "广州市", // 当前城市
                searchListArr: [], // 搜索查询列表
                searchInfo: null, // 检索信息 双向绑定输入框失效，百度自动输入的value值，vue检测不到变化
                // 点搜索按钮时，要通过jquery获取的方式来搜索才有效
                // 这个双向绑定数据的作用是，监控输入框值发生变化，然后影藏上一次的搜索列表
                searchInfoCopy: null, // 用于比对，看输入框内容是否真的发生变化
                overlay: null, // 存储当前的overlay，标记站点，方便删除
                marker: null, // 存储当前的marker，标记站点，方便删除
                isOverlayClick: false, // 是否显示了站点信息弹窗，如果显示了，触发地图click事件时，就要return一部分功能掉
                localSearch: null, // 地图检索类
                noResult: false, // 是否没有检测到任何数据
                isRefresh: false, // 当前组件是否被刷新，即将被绑定
                isPointing: false, // 是否在标记点
                buslines: [],
                selectBusLine: '',
                busStations: [],
                direction: -10,
                isAdd: false,
                inputShow: false,
                isCompile: false,
                showSave: false,
                inputIndex: '',
                dataIsChange: false, // 是否处于编辑状态
                // 线路选择框
                isDepartmentFocus: false,
                selectLineName: '',
            }
        },
        watch: {
            busStations: function (newVal, oldVal) {
//                console.log("busStations -- changed");
                this.stationMarkersArr = this.getMarkerArr(newVal);
//                this.addStationMarkers();
            },
            stationMarkersArr: function (newVal, oldVal) {
//                console.log("stationMarkersArr  -- changed");
//                console.log(newVal);
//                this.addStationMarkers();
//                this.updateBusStations();
                let that = this;

                function circle() {
                    if (that.map) {
                        that.$nextTick(() => {
                            that.addStationMarkers();
                        });
                    } else {
                        setTimeout(function () {
                            circle();
                        }, 100)
                    }
                }

                circle();
            },
            noCoordinateStationArr: function (newVal, oldVal) {
//                console.log("noCoordinateStationArr -- changed");
//                console.log(newVal)
//                console.log(newVal);
//                this.addStationMarkers();
            },
            searchInfo: function (newVal, oldVal) {
//                console.log("searchInfo: -- changed");
//                console.log(this.searchInfo);
                if (this.searchInfoCopy != newVal) {
                    this.hideSearchList();
                }
            }
        },
        methods: {
            loadMap: function () {
//                alert('loadMap');
                let that = this;
                let max = 100, num = 0;

                function init() {
                    num++;
                    if (num > max) {
                        $("#map_pinba").css({"color": "#fff", "font-size": "20px"}).html("地图加载失败");
                        return;
                    }
                    try {
//                        console.log("this.isRefresh: " + that.isRefresh);
                        if (that.isRefresh) {
                            return;
                        }
                        // 创建地图，关闭地图默认的POI事件
                        var map = new BMap.Map("map", {enableMapClick: false});
                        that.map = map;
                        let point = new BMap.Point(116.404, 39.915); // 创建点坐标
                        map.enableScrollWheelZoom(); //启用滚轮放大缩小
                        map.disableDoubleClickZoom(true); // 禁止双击自动放大
                        map.enableAutoResize(); // 自动缩放尺寸
//                        map.enableAutoResize(); // 自动缩放尺寸
                        // 在当前页面刷新的话，下面的load方法会加载两次
                        map.addEventListener("load", function () {
//                            console.log("map loaded");
                            that.geoLocation = new BMap.Geolocation(); // 初始化定位类
                            that.location();
                            that.geoCoder = new BMap.Geocoder(); // 初始化地址解析类
                            that.addClickEvent();
                            that.ctrl = new BMap.Control(); // 初始化控件类
                            that.$nextTick(function () {
                                that.addControl();
                            });
                            // anchor 偏移量 注意与后面鼠标的偏移量保持一致
                            that.stationIcon = new BMap.Icon("/static/images/icon-station.png", new BMap.Size(35, 35), {
                                imageSize: new BMap.Size(35, 35),
                                anchor: new BMap.Size(17, 35)
                            });
                            // 显示已经标记的站点
//                                that.stationMarkersArr = that.getMarkerArr(that.busStations);
                            that.addAutoSearch();
                            num = 0;
                        });
                        map.centerAndZoom(point, 15);

                    } catch (e) {
//                        console.log('map error type : ' + typeof e);
                        //console.log(e);
                        setTimeout(function () {
                            init();
                        }, 300)
                    }
                }

                init();
            },
            location: function () {
//                console.log("location");
                let that = this;
                that.geoLocation.getCurrentPosition(function (r) {
                    if (this.getStatus() == BMAP_STATUS_SUCCESS) {
//						var mk = new BMap.Marker(r.point);
//						that.map.addOverlay(mk);
                        that.map.panTo(r.point);
                        var point = new BMap.Point(r.point.lng, r.point.lat);
//							alert('您的位置：'+r.point.lng+','+r.point.lat);
                        that.map.centerAndZoom(point, 15);
                    } else {
                        //console.log('failed BMap status code :'+this.getStatus());
                    }
                })
            },
            // 添加地图点击事件
            addClickEvent: function () {
//                console.log("addClickEvent");
                let map = this.map;
                let that = this;
                map.addEventListener('click', function (e) {
//                    console.log("map click");
                    that.hideSearchList();

//                    console.log("e.point: ");
//                    console.log(e.point);
                    // 点击地图，清楚之前存储的临时的marker和overlay
                    if (that.isOverlayClick) {
                        that.isOverlayClick = false;
//                        console.log("map click return");
                        return;
                    }
                    that.clearTempMarker();
                    if (that.isPointing) {
//                        that.stationMarkersArr.push({
//                            lat: e.point.lat,
//                            lng: e.point.lng,
//                            id: null,
//                            station_name: null
//                        });
                        // 弹窗
                        that.markerOnClick(null, e.point);
                    }
                    // 点击地图时，输入框不会失去焦点，因此要让输入矿主动失去焦点
                    $("#search_input").trigger("blur");
                })
            },
            // 添加控件
            addControl: function () {
//                console.log('addControl');
                let map = this.map;
                let that = this;

                // 添加移动、缩放、定位 百度地图原生的控件
                map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT}));
                map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT}));
                map.addControl(new BMap.NavigationControl({
                    // 靠左上角位置
                    anchor: BMAP_ANCHOR_BOTTOM_LEFT,
                    // LARGE类型
                    type: BMAP_NAVIGATION_CONTROL_LARGE,
                    // 启用显示定位
                    enableGeolocation: true
                }));

                let $div = $("#hideElements .ctrl_point").clone();
                $div.click(function (e) {
                    if (!that.isCompile) {
                        layer.msg('请先点击编辑状态', {icon: 2, time: 1000});
                        return
                    }
//                    console.log("控件isOnClick");
//                    console.log(e);
                    that.isPointing = !that.isPointing;
                    let str = that.isPointing ? '取消标记' : '标记站点';
                    $("#map_pinba .ctrl_point_txt").html(str);
//					"http://pinbayun.com/static/images/icon_pointer.png"
                    that.isPointing ? map.setDefaultCursor("url('/static/images/icon_pointer.png') 17 35, default") : map.setDefaultCursor("default");
                    that.isPointing ? map.setDraggingCursor("url('/static/images/icon_pointer.png') 17 35, default") : map.setDraggingCursor("default");
                });
                // 设置 标记站点 控件显示
                let ctrl = new BMap.Control();
                ctrl.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
                ctrl.defaultOffset = new BMap.Size(340, 20);
                ctrl.initialize = function (map) {
                    // 添加DOM元素到地图中
                    map.getContainer().appendChild($div[0]);
                    // 将DOM元素返回
                    return $div[0];
                };
                map.addControl(ctrl);
            },
            addStationMarkers: function (point) {
//                console.log("addStationMarkers");
                let that = this;
                let map = this.map;
                // 删除所有的覆盖物
                map && map.clearOverlays();

                // 通过信息窗体添加标记点代替marker类
                function addMarkerInfoWindow(item, i) {
                    if (item == null || i == null) return;
                    if (item.id != null || item.tempId != null && item.station_name != null) {
                        // 自定义标记点覆盖物
                        let $infoWin = $("#hideElements .win_station").clone();
                        $infoWin.children(".win_station_name").html(item.station_name);
                        $infoWin.children(".win_station_order").html(i * 1 + 1);
                        $infoWin[0].station_id = i;
                        let point = new BMap.Point(item.lng, item.lat);
                        $infoWin.click(function (e) {
//                            console.log("this.station_id: ");
//                            console.log(this.station_id);
                            that.markerOnClick(this.station_id, point);
                            that.isOverlayClick = true;
//                            e.stopPropagation();
                        });
//                        let isDOM = (typeof HTMLElement === 'object') ?
//                                    function (obj) {
//                                        return obj instanceof HTMLElement;
//                                    } :
//                                    function (obj) {
//                                        return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
//                                    } ;
//                        console.log("$infoWin[0] type : ");
////                        console.log($infoWin[0]);
//                        console.log(isDOM($infoWin[0]));
                        function ComplexCustomOverlay() {
                            this._point = point;
                            this._div = $infoWin[0];
                        }

                        ComplexCustomOverlay.prototype = new BMap.Overlay();
                        ComplexCustomOverlay.prototype.initialize = function (map) {
                            this._map = map;
                            map.getPanes().labelPane.appendChild(this._div);
                            return this._div;
                        };
                        ComplexCustomOverlay.prototype.draw = function () {
                            var map = this._map;
                            var pixel = map.pointToOverlayPixel(this._point);
                            this._div.style.left = pixel.x - 17.5 + "px";
                            this._div.style.top = pixel.y - 40 + "px"; // 当前窗体显示的位置 默认左上角
                        };
                        map.addOverlay(new ComplexCustomOverlay(point));

                    } else {
                        let pt = new BMap.Point(item.lng, item.lat);
                        // 使用原生marker类来加载没有设定过的站点
                        let marker = new BMap.Marker(pt, {icon: that.stationIcon});
                        // 给marker绑定唯一id，
                        marker.station_id = i;
                        // 给marker绑定点击事件，
                        marker.addEventListener("click", function (e) {
                            that.markerOnClick(this.station_id, e.point);
//                            console.log("marker.station_id: ");
//                            console.log(marker.station_id)
                        });
                        map.addOverlay(marker);
                    }
                }

                for (let i = 0, len = that.stationMarkersArr.length; i < len; i++) {
                    addMarkerInfoWindow(that.stationMarkersArr[i], i);
                }
            },
            markerOnClick: function (id, point) {
                let that = this;
                let map = this.map;
                // 直接点击已经存储站点的标记点，要清楚之前的点击地图生成的标记点
                that.clearTempMarker();
                map.panTo(point, {
                    noAnimation: false
                });
                if (id == null) {
                    // 添加一个标记点
                    that.marker = new BMap.Marker(point, {icon: that.stationIcon});
                    map.addOverlay(that.marker);
                }
//                console.log("id" + "====" + id);
//                console.log("point:" + point.lng + "," + point.lat);
                let $infoWin = $("#hideElements .win_point_info").clone();
                if (id != null) {
                    let $child = $infoWin.find(".available_station_item").eq(0);
                    let $div = $child.clone();
                    let marker_item = that.stationMarkersArr[id];
//                    console.log(marker_item);
                    let value = marker_item.id + ',' + marker_item.station_name + ',' + marker_item.tempId;
                    $div.attr("value", value);
                    $div.attr("title", marker_item.station_name);
                    $div.html(marker_item.station_name);
//                    console.log($div);
//                    console.log($child);
                    $div.insertBefore($child);
                }
                that.geoCoder.getLocation(point, function (rs) {
                    var addComp = rs.addressComponents;
                    that.localCity = addComp.city;
                    $infoWin.children(".win_point_info_address").html("地址：" + rs.address);
                    var val = $infoWin.children().find(".available_station_item").attr("value");
                    $infoWin.find("span").html(point.lng + "," + point.lat);
                    let $selectBox = $infoWin.find(".available_station_list");
                    $selectBox.click(function (e) {
                        let $item = $selectBox.find(".available_station_item");
                        let minH = $item.outerHeight();
                        let maxH = $item.length * minH;
                        maxH = maxH > 400 ? 400 : maxH;
                        let nowHeight = $(this).outerHeight();
                        if (nowHeight < maxH) {
                            $(this).animate({
                                // - 1 是为了处理最后一个border-bottom
                                height: maxH - 1 + "px"
                            }, 200);
                        } else {
                            $(this).animate({
                                height: minH - 1 + "px"
                            }, 200);
                        }
//                        e.stopPropagation();
                    });

                    $selectBox.mousewheel(function (e) {
                        if (e.stopPropagation) {
                            e.stopPropagation();
                        } else {
                            window.event.cancelBubble = true;
                        }
                    });
                    $selectBox.children().click(function (e) {
                        val = $(this).attr("value");
//                        console.log("id,coordinate,tempId: " + val);
                        if ($(this).index() != 0) {
                            $(this).insertBefore($(this).siblings(":eq(0)"));
                        }
//                        console.log($selectBox);
//                        console.log($selectBox.scrollTop());
                        $selectBox.scrollTop(0);
                    });
                    $infoWin.click(function (e) {
                        if (!/available_station_item/.test(e.target.className)) {
                            // 点击弹出其他地方，收缩盒子，但是
                            $selectBox.animate({
                                height: "29px"
                            }, 200);
                        }
                        // 这里的点击事件不能阻止传递，否则导致点击地图会失效一次
                        // 这里的隐藏事件需要放在地图点击事件中处理
//                        e.stopPropagation();
//                        console.log("infowin onclick");
                        that.isOverlayClick = true;
                    });
                    $infoWin.find(".win_point_info_btn_save").click(function () {
//                        console.log("win_point_info_btn_save");
                        if (!that.isCompile) {
                            layer.msg('请先点击编辑状态', {icon: 2, time: 1000});
                            that.isOverlayClick = true;
                            return;
                        }
                        if (val) {
                            let _station = {
                                id: val.split(",")[0],
                                station_name: val.split(",")[1],
                                lat: point.lat,
                                lng: point.lng,
                                tempId: val.split(",")[2]
                            };
                            if (id != null) { // 传入id值的情况下，点击已经渲染好的marker
                                that.stationMarkersArr[id].id = val.split(",")[0];
                                that.stationMarkersArr[id].station_name = val.split(",")[1];
                                that.stationMarkersArr[id].tempId = val.split(",")[2];
//								console.log("why");
//                                console.log(that.stationMarkersArr[id]);
                                // 这里需要手动触发事件，只改变这个数组的一部分值，vue无法检测到数据的变化
                                that.addStationMarkers();
                            } else {// 没有传入id值的情况，表示新增
                                that.stationMarkersArr.push(_station);
                            }
                            that.deleteBusStationCoordinate(_station);
                        }
                        that.marker && map.removeOverlay(that.marker);
                        that.overlay && map.removeOverlay(that.overlay);
                        that.marker = null;
                        that.overlay = null;
                    });
                    $infoWin.find(".win_point_info_btn_delete").click(function () {
//                        console.log("delete");
                        if (!that.isCompile) {
                            layer.msg('请先点击编辑状态', {icon: 2, time: 1000});
                            that.isOverlayClick = true;
                            return;
                        }
                        that.marker && map.removeOverlay(that.marker);
                        that.overlay && map.removeOverlay(that.overlay);
                        that.marker = null;
                        that.overlay = null;
                        if (id != null) {
//							let item = that.stationMarkersArr[id];
//							let item1 = that.stationMarkersArr.splice(id, 1);
                            let item = that.stationMarkersArr.splice(id, 1);
//							console.log(item == item1);
//                            console.log(item);
                            that.deleteBusStationCoordinate(item[0]);
                        }
                    });
                    $infoWin.find(".win_point_info_title_btn_delete").click(function () {
//                        console.log("close overlay");
                        map.removeOverlay(that.overlay);
                        map.removeOverlay(that.marker);
                    });

                    function ComplexCustomOverlay(point) {
                        this._point = point;
                    }

                    ComplexCustomOverlay.prototype = new BMap.Overlay();
                    ComplexCustomOverlay.prototype.initialize = function (map) {
                        this._map = map;
                        this._div = $infoWin[0];
                        map.getPanes().labelPane.appendChild(this._div);
                        return this._div;
                    };
                    ComplexCustomOverlay.prototype.draw = function () {
                        var map = this._map;
                        var pixel = map.pointToOverlayPixel(this._point);
                        this._div.style.left = pixel.x - 175 + "px"; // 350px 居中留一半的间隙
                        this._div.style.top = pixel.y - 220 + "px"; // 178 px
                    }
//                    that.overlay = new ComplexCustomOverlay(point);
//                    map.addOverlay(that.overlay);
                    that.overlay = new ComplexCustomOverlay(point);
                    map.addOverlay(that.overlay);
                })
                return null;
            },
            clearTempMarker: function () {
                if (this.overlay) {
                    this.map.removeOverlay(this.overlay);
                    this.overlay = null;
                }
                if (this.marker) {
                    this.map.removeOverlay(this.marker);
                    this.marker = null;
                }
            },
            deleteStationMarkers: function (id) {
                let that = this;
                let map = this.map;
                let allOverlays = map.getOverlays();
                for (let i = 0, len = allOverlays.length; i < len; i++) {
                    let item = allOverlays[i];
                    if (item.station_id == id) {
                        map.removeOverlay(item);
                        that.stationMarkersArr.splice(id, 1);
                        break;
                    }
                }
            },
            getMarkerArr: function (arr) {
                let stationArr = [];
                let noArr = [];
                for (let i = 0, len = arr.length; i < len; i++) {
                    let item = arr[i];
                    // 如果有坐标值，则添加这个坐标点为marker点
                    if (item.longitude != null && item.latitude != null) {
                        stationArr.push({
                            lat: item.latitude,
                            lng: item.longitude,
                            id: item.id ? item.id : null,
                            station_name: item.station_name,
                            tempId: item.tempId ? item.tempId : null
                        })
                    } else { // 如果没有这个坐标点，则将这个站点放入待分配的数组中去
                        noArr.push({
                            lat: null,
                            lng: null,
                            id: item.id ? item.id : null,
                            station_name: item.station_name,
                            tempId: item.tempId ? item.tempId : null
                        });
                    }
                }
//                console.log(noArr);
                this.noCoordinateStationArr = noArr;
                return stationArr;
            },
            // 当点击保存按钮时，表示站点与坐标有变化，
            // 先删除当前坐标对应的之前站点数组中的项的坐标值，
            // 然后再去遍历marker数组，然后一一对应到站点数组中
            deleteBusStationCoordinate: function (item) {
                let sArr = this.busStations; // 线路的站点列表数组
                // 当发生改变时，
                for (let j = 0, len_s = sArr.length; j < len_s; j++) {
                    let item_s = sArr[j];
                    if (item.lat == item_s.latitude && item.lng == item_s.longitude && (item.id == item_s.id || item.tempId == item_s.tempId && item.tempId != null)) {
                        // 更新这个item对应的站点的坐标信息
//                        console.log(this.busStations[j]);
                        this.busStations[j].latitude = null;
                        this.busStations[j].longitude = null;
                        break;
                    }
                }
                this.updateBusStations();
            },
            // 更新bus站点和已经分配坐标的marker数组进行对应，
            // 通过判断站点名称、id值或者tempId值进行匹配
            updateBusStations: function () {
//                console.info("updateBusStations");
                let mArr = this.stationMarkersArr; // 地图已经标记的站点数组
                let sArr = this.busStations; // 线路的站点列表数组
                let arr = [];
                // 防止mArr为空数组的时候，不会进入第二个循环，导致noCoordinateStationArr为空
                if (mArr.length === 0) {
                    this.noCoordinateStationArr = arr.concat(sArr);
                    return null;
                }

                for (let j = 0, len_s = sArr.length; j < len_s; j++) {
                    let item_s = sArr[j];
                    for (let i = 0, len_m = mArr.length; i < len_m; i++) {
                        let item_m = mArr[i];
                        if (item_m.station_name == item_s.station_name) {
                            // 判断这个站点的唯一性，如果站点同名。tempid相同或者id相同就更新信息
                            // tempId相同，说明是新增的站点，还未保存的服务器
                            // id相同，说明是这前的站点，已经存储过服务器
                            if (item_m.tempId != item_s.tempId && item_m.id != item_s.id) {
                                continue;
                            } else {
                                // 更新这个id 或者 tempId对应的站点的坐标信息
                                item_s.latitude = item_m.lat;
                                item_s.longitude = item_m.lng;
                                break;
                            }
                        } else if (i == len_m - 1) {
//                            console.info("the last item");
                            item_s.latitude = null;
                            item_s.longitude = null;
                            arr.push(item_s);
                        }
                    }
                }
                this.noCoordinateStationArr = arr;
                // 数据更新之后，刷新当前页面覆盖物
//                this.addStationMarkers();
                return null;
            },
            addAutoSearch: function () {
                let that = this;
                let map = this.map;
                let ac = new BMap.Autocomplete({//建立一个自动完成的对象
                    "input": "search_input",
                    "location": map
                });
//                console.log("addAutoSearch");
//                console.log(ac);
                that.localSearch = new BMap.LocalSearch(map, {
                    onSearchComplete: function (results) {
//                        console.log("onSearchComplete: ");
//                        console.log(that.localSearch.getStatus());
                        if (that.localSearch.getStatus() == BMAP_STATUS_SUCCESS) {
                            // 判断状态是否正确
                            var s = [];
                            for (var i = 0; i < results.getCurrentNumPois(); i++) {
                                s.push(results.getPoi(i));
                            }
                            that.searchListArr = s;
                        } else {
                            that.noResult = true;
                        }
                    },
                    pageCapacity: 10, // 最大搜索结果条数，默认值10条
                });
                ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
                    var _value = e.item.value;
//                    console.log(e);
                    let myValue = _value.province + _value.city + _value.district + _value.street + _value.business;

//                    console.log("onconfirm");
//                    console.log(myValue);
                    that.searchLocation(myValue);
                });
            },
            select: function (e, item) {
                this.markerOnClick(null, item.point)
                e.stopPropagation();
            },
            hideSearchList: function () {
//                console.log("hide list ")
                this.noResult = false;
                this.searchListArr = [];
            },
            stopPro: function ($event) {
//                console.log("stop");
                $event.stopPropagation();
//                console.log(arguments[0].constructor.name);
            },
            focusToSearch: function ($event) {

                // 阻止冒泡，防止当前顶层容器触发hideSearchList
                $event.stopPropagation()
                // 如果输入框值没有变化并且搜索结果数组length不为0，则不进行搜索
                if (this.searchInfo == this.searchInfoCopy && this.searchListArr.length != 0) {
                    return;
                }
                this.searchLocation();
            },
            keydownToSearch: function ($event) {
//                console.log("keydownToSearch");
//                console.log($event);
                if (13 == $event.keyCode) {
                    this.searchLocation();
                }
                $event.stopPropagation();
            },
            searchLocation: function (data) {
                this.noResult = false;
                this.hideSearchList();
                let searchData = typeof data == 'string' ? data : $("#search_input").val();
                this.searchInfo = this.searchInfoCopy = searchData;
                searchData && this.localSearch.search(searchData);
            },
            moveToPoint: function (e, index, station) {
                let that = this;
                // 直接用station的话，如果操作地图更改过station内部的值，这里获取不到最新的
                let _station = this.busStations[index];
                if (_station && _station.latitude && _station.longitude) {
                    for (let i = 0, len = this.stationMarkersArr.length; i < len; i++) {
                        let item = this.stationMarkersArr[i];
                        if (item.lat == _station.latitude && item.lng == _station.longitude) {
                            this.markerOnClick(i, new BMap.Point(_station.longitude, _station.latitude));
                            break;
                        }
                    }
                } else if (e.target.nodeName == "SPAN") {
                    layer.msg("此站点未在地图上标记位置", {icon: 2, time: 1500});
                }

            },
            itemDrag: function () {
                var that = this;
                if (drag.indexObj.canDrag && drag.isMove) {
                    setTimeout(function () {
                        that.busStations.splice(drag.indexObj.end, 0, that.busStations.splice(drag.indexObj.start, 1)[0]);
                        // console.log(that.busStations);
                        that.initDrag();
                    }, 400)
                }
            },
            getBuslines: function (callback = () => {
            }) {
                let that = this;
                $.ajax({
                    url: base.gAjaxUrl.ferryBusLines,
                    type: 'GET',
                    data: {
                        page: 1,
                        page_size: 999999,
                    },
                }).always((data) => {
                    base.ajaxCallback(data, function () {
                        that.buslines = data.results;
                        if (data.results.length > 0) {
                            //console.log("lineName");
                            //  console.log(data);
                            // that.selectBusLine = data.results[0].id;
                            // that.selectLineName = data.results[0].shuttle_name;
                            //console.log("that.selectLineName");
                            // console.log(that.selectLineName);
                            callback();
                        }

                    })
                });
            },
            getShuttlebusesStations: function (callback = () => {
            }) {
                let that = this;
                $.ajax({
                    url: `${base.gAjaxUrl.ferryBusLines}${that.selectBusLine}/stations/`,
                    type: 'GET',
                    data: {
                        shuttle_type: that.direction,
                    }
                }).always((data) => {
                    base.ajaxCallback(data, function () {
                        if (that.isRefresh) return;
                        $(".item_content>.item").remove();
                        that.busStations = data
//                    that.stationMarkersArr = that.getMarkerArr(that.busStations);
                        that.$nextTick(() => {
                            drag.dragStation(null, that.initDrag);
                        });
                        callback();
                    })
                });
            },
            clickSave: function () {

                $.showLoading();
                drag.indexObj.canDrag = false;
                let that = this;
                let map = this.map;
                this.isCompile = false;
                this.dataIsChange = false;
                this.inputShow = false;
                this.isPointing = false;
                map.setDefaultCursor("default");
                map.setDraggingCursor("default");
                // 处理数组，给服务器，全部给，服务器无法处理
                // 没有id的不能传id属性值
                function dealData(data) {
                    let arr = [];
                    if (!data) return [];
                    for (let i = 0, len = data.length; i < len; i++) {
                        let item = data[i];
                        if (item.id) {
                            arr.push({
                                station_name: item.station_name,
                                id: item.id,
                                longitude: item.longitude,
                                latitude: item.latitude,
                                address: item.address,
                                next_station_how_far: item.next_station_how_far,
                            });
                        } else {
                            arr.push({
                                station_name: item.station_name,
                                longitude: item.longitude,
                                latitude: item.latitude,
                                address: item.address,
                                next_station_how_far: item.next_station_how_far,
                            });
                        }
                    }
                    ;
                    return arr;
                }

//                if(this.busStations.length == 0){
//                    layer.msg('请先添加站点',{icon:2,time:1000});
//                    return;
//                }
                let _stations = this.busStations.length ? dealData(that.busStations) : [];
                $("#map_pinba .ctrl_point_txt").html("标记站点");
                $.ajax({
                    url: `${base.gAjaxUrl.ferryBusLines}${that.selectBusLine}/stations/`,
                    type: 'POST',
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify({
                        stations: _stations,
                        shuttle_type: that.direction
                    }),
//                    data: {
//                        stations: _stations,
//                        shuttle_type: that.direction
//                    }
                }).always((data) => {
                    $.hideLoading();
                    layer.msg("保存成功", {icon: 1, time: 1000});
                    that.getShuttlebusesStations();
                });
            },
            checkChange: function () {
//                if(this.dataIsChange){
//                    layer.msg('请先保存当前设置',{icon:2,time:2000});
//                    return;
//                }
                let that = this;
                let map = this.map;
                if (this.dataIsChange) {
                    layer.open({
                        content: '是否保存之前的线路？',
                        btn: ['保存', '不保存'],
                        yes: function (index, layero) {
                            that.clickSave();
                            layer.close(index);
                        },
                        btn2: function (index) {
                            drag.indexObj.canDrag = false;
                            that.isCompile = false;
                            that.dataIsChange = false;
                            that.inputShow = false;
                            that.isPointing = false;
                            map.setDefaultCursor("default");
                            map.setDraggingCursor("default");
                            that.getShuttlebusesStations();
                        }
                    });
                }
            },
            setBusLineRange: function (item) {
                this.selectBusLine = item.id;
                this.selectLineName = item.shuttle_name;
                this.getShuttlebusesStations();
            },
            toggleDirection: function (event, type) {
                if (this.isCompile) {
                    layer.msg("请先保存当前设置", {icon: 2, time: 1500});
                    return;
                }
                $("#setDirection>.flex-1>div").removeClass("bgc-c1");
                $(event.target).addClass("bgc-c1");
                if (this.direction == type) {
                    return;
                }
                this.direction = type;
                this.getShuttlebusesStations();
            },
            compile: function () {
                drag.indexObj.canDrag = true;
                this.isCompile = true;
                this.dataIsChange = true;
            },
            showSaveBtn: function (index) {
                drag.indexObj.canDrag = false;
                // console.log(drag.indexObj)
                console.log(drag.indexObj);
                this.inputIndex = index;
                this.inputShow = true;
            },
            deleteStation: function (index, stationName) {
                var that = this;
//               var  $(e.target.parentNode).attr("index")
                layer.confirm('删除须谨慎，确认要删除' + stationName + '这个站点吗？', () => {

                    that.busStations.splice(index, 1);
                    that.initDrag();
                    layer.closeAll('dialog')
                });

            },
            initDrag: function () {
                var that = this;
                $(".item_content>.item").remove();
                let arr = that.busStations;
                that.busStations = [];
                drag.indexObj.canDrag = true;
                that.inputShow = false;
                setTimeout(function () {
                    that.busStations = arr;
                    that.$nextTick(() => {
                        drag.dragStation();
                    });
                }, 0);
            },
            addLineStation: function () {
                var newStation = $.trim($(".newStation").val());
                var newStationDistance = $.trim($(".newStationDistance").val());
                if (!newStation) {
                    layer.msg('站名名称不能为空', {icon: 2, time: 1000});
                    return;
                }
                $(".newStation").val('');
                $(".newStationDistance").val('');
                this.dataIsChange = true;
                let _station = {
                    station_name: newStation,
                    longitude: null,
                    latitude: null,
                    address: null,
                    next_station_how_far: newStationDistance,
                    // 新增加的站点，在没有上传过服务器是没有分配id值的，但是在地图操作增加坐标时，
                    // 需要获取到数组中的项的唯一性，给赋值坐标值（用station_name不可靠，是可以重复的）
                    tempId: Math.random().toString() // 用来做站点的临时表示，
                };
                this.busStations.push(_station);
                this.noCoordinateStationArr.push(_station);
                this.$nextTick(() => {
                    drag.dragStation("add");
                    $(".item_content").scrollTop("1000000");
                });
            },
            saveStation: function () {
                this.inputShow = false;
                drag.indexObj.canDrag = true;
            },
            clickInput: function () {
                if (!this.isCompile) {
                    layer.msg("新增站点,请先点击编辑按钮,进入编辑状态~", {icon: 2, time: 1500});
                }
            },
            departmentEnter: function (flag, e) {
                this.isDepartmentFocus = flag;
                !flag && $(e.target).children(".departmentListBox").hide();
            },
            departmentClick: function (e) {
                if (this.isDepartmentFocus) {
                    $(e.target).nextAll(".departmentListBox").show();
                }
            },
            // 清除搜索输入框
            emptySearch: function (e) {
                this.selectLineName = '';
                $(e.target).nextAll(".departmentListBox").show();
            },
            setDepartmentValue: function (item, e) {
                this.selectBusLine = item.id;
                this.selectLineName = item.shuttle_name;
                this.getShuttlebusesStations();
                $(e.target).parent(".departmentListBox").hide();
            },
        },
        components: {},
        filters: {
            getLngLat(item) {
                if (item.longitude && item.latitude) {
                    return item.longitude + ',' + item.latitude
                }
                return '--'
            }
        },
        // 这是个状态识别
        // 因为：当前页面刷新时，vue会ready两次，vue组件会有两次生命周期
        // refresh表示监控当前vue组件生命周期是否还是有效的，ready的时候是有效的，但是beforeDestroy的时候是无效的
        // 为了防止百度地图因为两次ready而初始化两次百度地图，dom事件方面会被前一次的百度地图初始化优先绑定
        // 所以在vue组件生命周期内可以对百度地图进行初始化，否则如果当前组件失效，就要在百度地图初始化过程中阻断其继续初始化
        // 就是当前组件里面的 loadMap方法
        beforeDestroy() {
            //  console.log("beforeDestroy");
            this.isRefresh = true;
        },
    }
</script>
<style lang="less" rel="stylesheet/less" scoped>
    @media (max-width: 767px) {
        .Hui-article-box {
            position: absolute !important;
            left: 0px !important
        }
    }

    h6 {
        margin: 0
    }


    .no_Choice {
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        background: white
    }


    .r_name {
        padding: 20px 0;
        font-weight: 500
    }

    .selectmask {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 100;
    }

    .img-icon {
        width: 25px;
        height: 25px;
        font-size: 16px;
        line-height: 22px;
        vertical-align: middle;
        cursor: pointer;
        position: absolute;
        top: 5px;
        z-index: 10;
    }

    .page-container {
        padding-bottom: 50px;
        box-sizing: border-box;
        position: relative;
        height: 100%;
    }

    /* created by feng */
    .station_list_box {
        box-sizing: border-box;
        width: 400px;
        position: absolute;
        left: 20px;
        top: 160px;
        bottom: 20px;
        padding-bottom: 20px;
        overflow-x: hidden;
        overflow-y: auto;

        .stationLists {
            position: relative;
            text-align: center;

            li {
                height: 60px;

                span {
                    margin-top: 20px;
                }
            }

            .stationIndex {
                display: inline-block;
                width: 20px;
                height: 20px;
                background-color: #5a98de;
                color: #fff;
                border-radius: 50%;
                text-align: center;
                line-height: 20px;
                font-size: 12px;
                float: left;
            }
        }

        .add_station {
            width: 48%;
            .add_station_input {
                width: 100%;
            }
        }


        .add_img_icon {
            display: block;
            margin-top: 3px;
            width: 25px;
            height: 25px;
        }

        .item_content {
            position: relative;
            height: 360px;
            overflow-y: auto;
            overflow-x: hidden;

            .item {
                text-align: center;
                height: 35px;
                /* vertical-align: middle; */
                line-height: 35px;
                /* padding: 10px; */
                margin: 7.5px 0;
                border-radius: 4px;
                cursor: move;
                box-sizing: border-box;
                width: 70%;
                /* margin: 10px auto; */
                left: 57px !important;

                input {
                    font-size: 14px;
                    height: 33px;
                    width: 100%;
                    border: 1px solid #6498e1;
                }

                span {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    width: 100%;
                    display: block;
                }

                span:hover {
                    text-overflow: '';
                    white-space: normal;
                }

                .station_input_box {
                    width: 100%;
                    height: 35px;
                    box-sizing: border-box;
                    border-radius: 4px;
                    position: absolute;
                    left: 0;
                    top: 0;
                    z-index: 2;
                    background-color: #fff;

                    .station_input_item {
                        position: relative;
                        height: 35px;
                        width: 49%;
                    }
                }
                .station_far {
                    .station_far_item {
                        width: 48%;
                        background-color: #f5f5f5;
                    }
                }
            }

            .sure,
            .change {
                right: -35px;
            }

            .sure {
                border-radius: 50%;
                background-color: #5a98de;
            }

            .delete {
                left: -35px;
                border-radius: 50%;
                background-color: red;
            }
        }


        .lat_lng {
            font-size: 12px;
            line-height: 20px;
            height: 20px;

            i {
                color: #5a98de;
            }
        }
    }

    .line_sel_box {
        height: 35px;
        line-height: 35px;

        .sel_con {
            width: 400px;
            height: 35px;
            box-sizing: border-box;
        }

        .department_select_container {
            input {
                height: 33px;
            }

            .departmentListBox {
                top: 35px;
            }
        }
    }

    #map_pinba {
        position: absolute;
        left: 440px;
        top: 160px;
        right: 20px;
        bottom: 20px;
        border-radius: 5px;
        box-sizing: border-box;
        border: 1px solid #ccc;
        overflow: hidden;

        #map {
            z-index: 1;
            width: 100%;
            position: absolute;
            left: 0;
            top: 0px;
            bottom: 0;
            right: 0;
            /*padding-top: 50px;*/
            background-color: #34474e;
        }
    }

    /* 控件展示窗口相关 */
    .ctrl_point {
        width: 150px;
        height: 40px;
        line-height: 40px;
        border-radius: 3px;
        box-sizing: border-box;
        padding-left: 40px;
        border: 1px solid #ccc;
        font-size: 18px;
        text-align: left;
        cursor: pointer;
        position: relative;
        top: 30px !important; /* 保持和左边的自动输入匹配框高度一致 */
        background-color: #fff;
        background: url("/static/images/icon_pointer.png") no-repeat 5px 5px/30px 30px, #fff;
    }

    .ctrl_point_icon {
        position: absolute;
        left: 5px;
        top: 5px;
        width: 30px;
        height: 30px;
    }

    .win_station {
        padding-left: 33px;
        height: 40px;
        position: absolute;
        min-width: 200px;
        cursor: pointer;
    }

    .win_station_img {
        width: 35px;
        height: 35px;
        position: absolute;
        left: 0;
        top: 5px;
    }

    .win_station_name, .win_station_order {
        display: inline-block;
        vertical-align: middle;
    }

    .win_station_name {
        font-size: 16px;
        line-height: 30px;
        height: 30px;
        width: 120px;
        padding: 0 10px;
        border-radius: 2px;
        border: 1px solid #ccc;
        text-align: center;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        background-color: #fff;
    }

    .win_station_order {
        margin-left: 5px;
        width: 30px;
        height: 30px;
        font-size: 18px;
        line-height: 30px;
        border-radius: 50%;
        background-color: green;
        color: white;
        text-align: center;
    }

    .win_point_info {
        width: 350px;
        box-sizing: border-box;
        padding: 0 0 12px;
        border: 1px solid #ccc;
        border-radius: 3px;
        position: absolute;
        cursor: default;
        background-color: #fff;
    }

    .win_point_info_title {
        font-size: 18px;
        height: 40px;
        line-height: 39px;
        padding: 0 15px;
        box-sizing: border-box;
        position: relative;
        border-bottom: 1px solid #ccc;
    }

    .win_point_info_title_btn_delete {
        width: 20px;
        height: 20px;
        position: absolute;
        right: 10px;
        top: 10px;
        font-size: 12px;
        line-height: 20px;
        text-align: center;
        color: #5a98de;
        border-radius: 2px;
        border: 1px solid #5a98de;
        cursor: pointer;
    }

    .win_point_info_address {
        margin-top: 10px;
    }

    .win_point_info_address, .win_point_info_latlng {
        padding: 0 15px;
        font-size: 14px;
        line-height: 20px;
    }

    .win_point_info_station {
        padding: 0 15px;
        margin-top: 10px;
        font-size: 14px;
        line-height: 30px;
        position: relative;
        width: 100%;
        box-sizing: border-box;
    }

    .available_station_list {
        vertical-align: middle;
        height: 29px;
        overflow-x: hidden;
        overflow-y: auto;
        position: absolute;
        right: 15px;
        top: 0;
        bottom: 0;
        left: 100px;
        z-index: 200;
        background-color: #fff;
        border: 1px solid #ccc;
    }

    .available_station_item {
        height: 30px;
        font-size: 14px;
        padding: 0 20px;
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        box-sizing: border-box;
        border-bottom: 1px solid #ccc;
        line-height: 29px;
    }

    .available_station_item:hover {
        background-color: rgba(92, 239, 255, 0.38);
    }

    .available_station_select {
        height: 100%;
        width: 100%;
        font-size: 16px;
        padding: 0 10px;
        cursor: pointer;
    }

    .win_point_info_btns {
        width: 100%;
        margin-top: 10px;
        padding: 0 15px;
        box-sizing: border-box;
    }

    .win_point_info_btn_delete, .win_point_info_btn_save {
        float: right;
        margin-left: 10px;
        font-size: 12px;
        line-height: 18px;
        padding: 2px 10px;
        border-radius: 2px;
        border: 1px solid #ccc;
        background-color: #f7f7f7;
    }

    .win_point_info_btn_save {
        color: #fff;
        cursor: pointer;
        background-color: rgba(96, 163, 245, 0.8);
    }

    .move_pointer {
        width: 30px;
        height: 30px;
        display: block;
        position: absolute;
        z-index: 999999;
        left: -30px;
        top: -30px;
    }

    .ctrl_point_txt {
        letter-spacing: 2px;
    }

    /* 搜索列表 */
    .location_search_box {
        position: absolute;
        top: 30px;
        left: 20px;
        width: 300px;
        height: 40px;
        z-index: 200;
    }

    .search_input {
        width: 250px;
        height: 40px;
        line-height: 38px;
        padding: 0 10px;
        font-size: 16px;
        border: 1px solid #ccc;
        box-sizing: border-box;
    }

    /*.search_input:focus {*/
    /*height: 38px;*/
    /*margin-top: 1px;*/
    /*line-height: 36px;*/
    /*}*/
    .searchBtn {
        width: 50px;
        height: 40px;
        font-size: 30px;
        text-align: center;
        line-height: 37px;
        vertical-align: middle;
        box-sizing: border-box;
        color: #fff;
        background-color: #5a98de;
        border-radius: 0 3px 3px 0;
        cursor: pointer;
    }

    .result_box {
        position: absolute;
        top: 116px;
        left: 20px;
        width: 300px;
        z-index: 210;
        box-shadow: 3px 3px 20px 3px #ccc;
        box-sizing: border-box;
        overflow-x: hidden;
        overflow-y: auto;
        max-height: 500px;
        font-size: 14px;
        line-height: 20px;
        color: #666;
        background-color: #fff;
    }

    .result_item {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        padding: 10px 20px 10px 30px;
        cursor: pointer;
        background: url("/static/images/icon-station.png") no-repeat 5px 5px /30px 30px;
    }

    .result_item_img {
        position: absolute;
        left: 5px;
        top: 50%;
        width: 20px;
        height: 20px;
        margin-top: -10px;
    }

    .result_item:hover {
        background-color: #e7e7e7;
    }

    .result_detail {
        width: 100%;
        overflow: hidden;
    }

    .result_title {
        color: blue;
        font-size: 16px;
        line-height: 30px;
    }

</style>
<style>
    /* 全局修改搜索框自动提示样式 */
    /* 不给层级，会看不到自动提示的效果 */
    .tangram-suggestion-main {
        z-index: 200 !important;
    }
</style>
