/**
 * Created by fxdong on 2018/3/6.
 * 注意使用了第三方 moment jquery
 */
export default function TrailView(options) {

    // console.log(options);

    // options.data = {
    //     points: [],
    //     behavior: [],
    // }

    this.$container = $(("#" + options.id).replace(/##/, "#"));
    this.map = options.map;
    this.myGeo = null;
    this. myGeo = null;
    this.moment = options.moment;
    this.clearOverlayCallback = options.clearOverlayCallback || function () {}; // 当在这边调用 map.clearOverlays 这个方法时，调用组件的回调

    // mapScaleMeterObj 在不同缩放级别下，单位长度对应的距离，百度地图map.baidu.com标准值参考如下
    // 18: 5, 17: 10, 16: 20, 15: 50, 14: 100, 13: 200,
    // 12: 500, 11: 1000, 10: 2000, 9: 5000, 8: 10000, 7: 20000, 6: 25000, 5: 50000,
    // 4: 100000, 3: 200000, 2: 500000, 1: 1000000, 0: 2000000,

    // 以下数值结合实际百度地图，微调得到的数值
    options.data = options.data || {};
    this.mapScaleMeterObj = { // 用来计算是否要显示坐标点
        19: 20,
        18: 50,
        17: 100,
        16: 200,
        15: 350,
        14: 400,
        13: 800,
        12: 1300,
        11: 2200,
        10: 3300,
        9: 8000,
        8: 15000,
        7: 20000,
        6: 30000,
        5: 50000,
        4: 100000,
        3: 200000,
    };
    this.originalPointArr = options.data.points || []; // 所有坐标的数组
    this.behavior = options.data.behavior || []; // 所有坐标的数组
    this.driver = options.data.driver || {}; // 所有坐标的数组
    this.vehicle = options.data.vehicle || {}; // 车辆信息
    this.pointsArr = []; // 分成若干段的数组
    this.polylinePointsArr = []; // 用来绘制指定时间段的polyline的数组
    this.polylinePoints = []; // polyline 所有的坐标点，用于setViewPort
    this.periodStartTimeArr = []; // 分段后，各段时间的其实时间
    this.centerTimeFlag = options.centerTime || false; // 是否将轨迹段时间段显示在坐标轴中心
    this.zoomFlag = options.zoom || false; // 是否启用地图缩放控件
    this.speedStatusFlag = options.speedStatus || false; // 是否则在轨迹上滚动显示圆点
    this.behaviorFlag = options.behavior || false; // 是否则地图上显示驾驶行为分析
    this.speed = 10; // 滚动播放的速度，1小时的行程，正常情况下10s时间内滚动完轨迹
    this.playFlag = false; // 是否允许播放
    this.rulerWidth = 0; // 时间轴坐标数组
    this.currentPt = null; // 当前点的坐标
    this.currentPtMarker = null; // 当前点的地图Marker
    this.hoverPtMarker = null; // 当前点的地图Marker
    this.hoverPtMarkerPoint = null; // hover点对应的数组里的坐标
    this.carInfoOverlay = null; // hover点对应的数组里的坐标
    this._startTime = 0; // 播放的起始时间 -- 也是当前时间轴上时间点的坐标
    this.startTime = 0; // 播放段的起始时间
    this.endTime = 0; // 播放的终点时间
    this.rulerStartTime = 0; // 时间轴的开始时间
    this.rulerEndTime = 0; // 时间轴的结束时间
    this.startPt = null; // 选择的播放段的起点坐标
    this.endPt = null; // 选择的播放段的终点坐标
    this.$palyDom = null; // 播放按钮
    this.$increaseDom = null; // 加速按钮
    this.$reduceDom = null; // 减速按钮
    this.$timePotDom = null; // 时间点
    this.$beforeTimeDom = null; // 时间段前灰色区域
    this.$afterTimeDom = null; // 时间段后灰色区域
    this.$timeRulerDom = null; // 时间标尺
    this.$timeRulerMaskDom = null; // 时间标尺用来注册点击事件的遮罩层
    this.$timeLabelDom = null; // 显示时间点的弹窗
    this.$timeLabelContentDom = null; // 时间点的内容
    this.$caliperADom = null;
    this.$caliperAPointerDom = null;
    this.$caliperBDom = null;
    this.$caliperBPointerDom = null;
    this.$carInfoBoxDom = null; // 信息窗体
    this.$speedControlDom = null; // 速度识别地图控件DOM
    this.speedControl = null; // 速度识别地图控件
    this.$zoomControlDom = null; // 放大缩小地图控件DOM
    this.zoomControl = null; // 放大缩小地图控件
    this.$rulerControlDom = null; // 时间轴地图控件DOM
    this.rulerControl = null; // 时间轴地图控件
    this.$behaviorControlDom = null; // 行为分析地图控件DOM
    this.behaviorControl = null; // 行为分析地图控件
    this.$behaviorOverlayDom = null; // 行为分析地图控件
    this.behaviorOverlayObj = { // 存储行为分析覆盖物
        speeding: [],
        harsh_acceleration: [],
        harsh_breaking: [],
        harsh_steering: [],
    }; // 行为分析覆盖物集合对象 -- 用于显示、影藏、批量删除
    this.myGeo = new BMap.Geocoder();
    this.init();

}
/**
 * marker z-index 1000 - 2000
 * polyline z-index 100 - 1000
 */
var poto = {
    setOptions: function (opts) {
        this.currentPtMarker && this.currentPtMarker.enableMassClear();
        this.hoverPtMarker && this.hoverPtMarker.enableMassClear();
        this.map.clearOverlays();
        this.clearOverlayCallback();
        this.$timeRulerDom.find('.runPart').remove();
        this.originalPointArr = opts.points;
        this.behavior = opts.behavior || [];
        this.driver = opts.driver || {};
        this.vehicle = opts.vehicle || {};
        this.stopPlay();
        if (this.originalPointArr.length) {
            this.formatData();
            this.initMarkers();
            if (this.centerTimeFlag) {
                this.setTimeRuler(); // 将轨迹时间段放在中心
            } else {
                this.setTimeRulerOneDay(); // 一天显示
            }
            this.setPolyline();
        } else {
            this.initRuler();
        }

        // 更改驾驶行为分析的标题
        if(this.vehicle.car_no) {
            this.$behaviorControlDom.find(".behavior_title").html("驾驶行为分析" + "【" + this.vehicle.car_no + "】");
        } else {
            this.$behaviorControlDom.find(".behavior_title").html("驾驶行为分析");
        }
    },
    init: function () {
        // console.log("init");
        // 初始化dom
        this.$rulerControlDom = $(".rulerControl");
        this.$palyDom = this.$rulerControlDom.find(".timelinePlay");
        this.$increaseDom = this.$rulerControlDom.find(".timelineQuick");
        this.$reduceDom = this.$rulerControlDom.find(".timelineSlow");
        this.$beforeTimeDom = this.$rulerControlDom.find(".caliperPartA");
        this.$afterTimeDom = this.$rulerControlDom.find(".caliperPartB");
        this.$timePotDom = this.$rulerControlDom.find(".timelineProgress");
        this.$timeRulerDom = this.$rulerControlDom.find(".timelineMain");
        this.$timeRulerMaskDom = this.$rulerControlDom.find(".timelineMainMask");
        this.$timeLabelDom = this.$rulerControlDom.find(".timelineLabel");
        this.$timeLabelContentDom = this.$rulerControlDom.find(".timelineLabelcontent");
        this.$caliperADom = this.$rulerControlDom.find(".caliperA");
        this.$caliperAPointerDom = this.$rulerControlDom.find(".caliperPointerA");
        this.$caliperBDom = this.$rulerControlDom.find(".caliperB");
        this.$caliperBPointerDom = this.$rulerControlDom.find(".caliperPointerB");
        this.$carInfoBoxDom = $(".carInfoBox").clone();
        this.$speedControlDom = $(".speedControl");
        this.$zoomControlDom = $(".zoomControl");
        this.$behaviorControlDom = $(".behaviorControl");
        this.$behaviorOverlayDom = $(".behaviorOverlay");

        this.addControl(); // 添加速度标尺控件
        this.initRuler();
        this.addEvents(); // 给dom渲染事件
        if (this.originalPointArr.length) {
            this.formatData(); // 给每个数据增加一个创建该数据的时间戳
            this.initMarkers(); // 初始化hoverMarker、currentMarker、currentMarker点击时的弹窗infoWindow
            if (this.centerTimeFlag) { // 设置时间轴标尺
                this.setTimeRuler(); // 将轨迹时间段放在中心
            } else {
                this.setTimeRulerOneDay(); // 一天显示
            }
            this.setPolyline(); // 显示地图轨迹
        }

        // 更改驾驶行为分析的标题
        if(this.vehicle.car_no) {
            this.$behaviorControlDom.find(".behavior_title").html("驾驶行为分析" + "【" + this.vehicle.car_no + "】");
        } else {
            this.$behaviorControlDom.find(".behavior_title").html("驾驶行为分析");
        }

    },
    formatData: function () {
        // console.log("formatData");
        if (this.originalPointArr.length === 0) return;
        for (var i = 0, len_i = this.originalPointArr.length; i < len_i; i++) {
            var item = this.originalPointArr[i];
            item.loc_time_stamp = Number(this.moment(item.loc_time).format("x"));
            item.bPoint = new BMap.Point(item.longitude, item.latitude);
        }
        this.polylinePointsArr = this.pointsArr = this.separatePoints();
    },
    separatePoints: function (points) {
        // console.log("separatePoints");
        points = points || this.originalPointArr;
        var temp = [];
        var arr = [temp];
        for (let i = 0, len_i = points.length; i < len_i; i++) {
            let item = points[i];
            if (i === 0) {
                temp.push(item);
            } else if (item.loc_time_stamp - points[i - 1].loc_time_stamp > 300000) { // 300秒 不上传，表是断线了，新起一个分段
                temp = [item];
                arr.push(temp);
            } else {
                temp.push(item);
            }
        }
        // 时间段 -- 数组
        this.periodStartTimeArr = [];
        if (arr.length != 0 && arr[0].length === 0) {
            return arr;
        }
        for (let i = 0, len = arr.length; i < len; i++) {
            var item = arr[i];
            this.periodStartTimeArr.push({
                start_time: item[0].loc_time_stamp, // 某段时间的开始
                end_time: item[item.length - 1].loc_time_stamp, // 某段时间的结束
            })
        }
        return arr;
    },
    addControl: function () {
        // console.log("addControl");

        var speedCtrl = new BMap.Control(); // 速度标识控件
        speedCtrl.defaultOffset = new BMap.Size(25, 159);
        speedCtrl.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
        speedCtrl.initialize = function (map) {
            // 创建一个DOM元素
            var div = this.$speedControlDom[0];
            map.getContainer().appendChild(div);
            // 将DOM元素返回
            return div;
        }.bind(this);
        this.map.addControl(speedCtrl);
        this.speedControl = speedCtrl;

        var zoomControl = new BMap.Control(); // 缩放地图控件
        zoomControl.defaultOffset = new BMap.Size(25, 90);
        zoomControl.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
        zoomControl.initialize = function (map) {
            // 创建一个DOM元素
            var div = this.$zoomControlDom[0];
            map.getContainer().appendChild(div);
            // 将DOM元素返回
            return div;
        }.bind(this);
        this.zoomControl = zoomControl;
        this.map.addControl(zoomControl);
        !this.speedStatusFlag && this.disabledSpeedStatus(); // 是否启用速度控件
        !this.zoomFlag && this.disabledZoom(); // 是否启用缩放控件

        var rulerControl = new BMap.Control(); // 时间轴控件
        rulerControl.defaultOffset = new BMap.Size(25, 35);
        rulerControl.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
        rulerControl.initialize = function (map) {
            // 创建一个DOM元素
            var div = this.$rulerControlDom[0];
            map.getContainer().appendChild(div);
            // 将DOM元素返回
            return div;
        }.bind(this);
        this.map.addControl(rulerControl);
        this.rulerWidth = this.$rulerControlDom.find(".timelineMain").outerWidth() - 1; // 标尺宽度 补偿1px
        this.rulerControl = rulerControl;

        var behaviorControl = new BMap.Control(); // 行为分析地图控件
        behaviorControl.defaultOffset = new BMap.Size(25, 20);
        behaviorControl.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
        behaviorControl.initialize = function (map) {
            // 创建一个DOM元素
            var div = this.$behaviorControlDom[0];
            map.getContainer().appendChild(div);
            // 将DOM元素返回
            return div;
        }.bind(this);
        this.map.addControl(behaviorControl);
        this.behaviorControl = behaviorControl;
        !this.behaviorFlag && this.disabledBehaviorControl(); // 是否启用速度控件
    },
    enabledZoom: function () {
        this.zoomControl.show();
    },
    disabledZoom: function () {
        this.zoomControl.hide();
    },
    enabledSpeedStatus: function () {
        this.speedControl.show();
    },
    disabledSpeedStatus: function () {
        this.speedControl.hide();
    },
    enabledBehaviorControl: function () {
        this.behaviorControl.show();
    },
    disabledBehaviorControl: function () {
        this.behaviorControl.hide();
    },
    initMarkers: function () {
        // 注意marker在clearoverlays()时不能取消
        var cMarkerIcon = new BMap.Icon("/static/images/icon-map-track-play.png", new BMap.Size(60, 60), {
            imageOffset: new BMap.Size(0, 0),
            imageSize: new BMap.Size(60, 60),
        });
        this.currentPtMarker = new BMap.Marker(this.polylinePointsArr[0][0].bPoint, {icon: cMarkerIcon});
        this.currentPtMarker.setZIndex(400);

        // 移动到polyline，显示最近的点的问题
        var hMarkerIcon = new BMap.Icon("/static/images/icon-map-track-hover.png", new BMap.Size(18, 18), {
            imageOffset: new BMap.Size(0, 0),
            imageSize: new BMap.Size(18, 18)
        });
        this.hoverPtMarker = new BMap.Marker(this.polylinePointsArr[0][0].bPoint, {
            icon: hMarkerIcon,
        });
        this.hoverPtMarker.setZIndex(500);
        this.hoverPtMarkerPoint = this.polylinePointsArr[0][0];
        // this.hoverPtMarker.setRotation(polylinePoints[0].direction); // 设置方向 但是GPS返回的值不准确，暂时不计算了

        this.map.addEventListener("mousemove", function (para) {
            if (hoverPointFlag) return;
            var point = this.getPolylinePoint(para.point);
            if (point) {
                this.hoverPtMarker.setPosition(point.bPoint);
                this.hoverPtMarkerPoint = point;
                this.hoverPtMarker.show();
            } else {
                this.hoverPtMarker.hide();
            }
        }.bind(this));

        /////////每两个点设置一次polyline需要增加的方法
        ///////////////////////////////////////////////
        var hoverPointFlag = false;
        this.hoverPtMarker.addEventListener("mouseover", function () {
            // console.log("hoverPtMarker mouseover");
            hoverPointFlag = true;
        });
        this.hoverPtMarker.addEventListener("mouseout", function () {
            // console.log("hoverPtMarker mouseout");
            hoverPointFlag = false;
        });
        ////////////////////////////////////////////////
        /**
         * 定位：113.202672,21.993289
         * 地址：广东省珠海市金湾区高栏港大道
         * 速度：60.0km/h
         * 定位时间：2018-02-27 09:03:21
         * 上传时间：2018-02-27 09:03:38
         * 高度：4米
         * 精度：10米
         */
        this.hoverPtMarker.addEventListener("click", function (e) {
            var pt = this.hoverPtMarkerPoint.bPoint;
            var location = this.myGeo.getLocation(pt, function (res) {

                // 更新信息窗体相关DOM内容
                this.$carInfoBoxDom.find(".position").text(pt.lng.toFixed(6) + "," + pt.lat.toFixed(6));
                this.$carInfoBoxDom.find(".driver").text(this.hoverPtMarkerPoint.driver_name || '--');
                this.$carInfoBoxDom.find(".phone").text(this.hoverPtMarkerPoint.driver_phone || '--');
                this.$carInfoBoxDom.find(".address").text(res.address);
                this.$carInfoBoxDom.find(".speed").text(Math.round(this.hoverPtMarkerPoint.speed) + "Km/h");
                this.$carInfoBoxDom.find(".locationTime").text(this.hoverPtMarkerPoint.loc_time.slice(0, 19));
                this.$carInfoBoxDom.find(".upTime").text(this.moment(this.hoverPtMarkerPoint.create_time).format("YYYY-MM-DD HH:mm:ss"));
                this.$carInfoBoxDom.find(".height").text((this.hoverPtMarkerPoint.height || '-- ') + "米");
                this.$carInfoBoxDom.find(".accuracy").text((this.hoverPtMarkerPoint.radius || '-- ') + "米");

                // 显示信息窗体
                this.currentPtMarker.setPosition(pt);
                this.carInfoOverlay._point = pt;
                this.carInfoOverlay.draw();
                this.carInfoOverlay.show();
                this.map.panTo(pt);

            }.bind(this));

        }.bind(this));

        this.map.addOverlay(this.hoverPtMarker);
        this.map.addOverlay(this.currentPtMarker);
        this.hoverPtMarker.hide();
        this.currentPtMarker.disableMassClear();
        this.hoverPtMarker.disableMassClear();
        this.initInfoWindow();
    },
    initInfoWindow: function () {
        // console.log("initInfoWindow");
        // 初始化信息窗体的覆盖物
        if (this.polylinePointsArr.length == 0 || this.polylinePointsArr[0].length == 0) {
            return;
        }
        function InfoWindow(map, div, point) {
            this._map = map;
            this._div = div;
            this._point = point;
        }

        InfoWindow.prototype = new BMap.Overlay();
        if(this.vehicle.online == undefined || this.vehicle.online) {
            this.$carInfoBoxDom.find(".carInfoHeader0").removeClass("carInfoHeader1");
        } else {
            this.$carInfoBoxDom.find(".carInfoHeader0").addClass("carInfoHeader1");
        }
        if(this.vehicle.car_no) {
            this.$carInfoBoxDom.find(".carNo").text(this.vehicle.car_no + '【轨迹查询】');
        }
        this.carInfoOverlay = new InfoWindow(this.map, this.$carInfoBoxDom[0], this.polylinePointsArr[0][0].bPoint);
        InfoWindow.prototype.initialize = function (map) {
            map.getPanes().labelPane.appendChild(this._div);
            return this._div;
        };
        InfoWindow.prototype.draw = function () {
            var map = this._map;
            var pixel = map.pointToOverlayPixel(this._point);
            this._div.style.left = pixel.x - 156 + "px"; // 宽度 313px
            this._div.style.top = pixel.y - 221 + "px"; // 高度 221px
        };
        this.$carInfoBoxDom.find(".closeBtn").click(function () {
            this.carInfoOverlay.hide();
        }.bind(this));
        this.$carInfoBoxDom.mousewheel(function (e) {
            if(e.stopPropagation) {
                e.stopPropagation();
            } else {
                window.event.cancelBubble = true;
            }
        });
        this.map.addOverlay(this.carInfoOverlay);
        this.carInfoOverlay.hide();
        this.$carInfoBoxDom.parent().css({"zIndex": 701});
        // 百度 marker 的父盒子是700的zindex;这样设置，
        // 是为了不让地图上的实时位置挡住了添加的行为分析的位置

    },
    setPolyline: function () {

        // console.log("setPolyline start", new Date().getTime() - _start);
        this.map.clearOverlays();
        this.clearOverlayCallback();
        this.addBehaviorOverlay(); // 如果没有polyline是不会存在行为分析的，所以在这里回调
        this.initInfoWindow();
        this.polylinePoints = [];
        for (var i = 0, len = this.polylinePointsArr.length; i < len; i++) {
            var item_i = this.polylinePointsArr[i];
            for (var j = 0, len_j = item_i.length; j < len_j; j++) {
                this.polylinePoints.push(item_i[j].bPoint);
            }
        }
        if(this.speedStatusFlag) { // 根据速度绘制线的颜色 -- 分多段添加 polyline
            var strokeColorArr = ["#00c238", "#8acb28", "#feb413", "#f63526", "#d10206", "#bc0101"];

            function matchColor(n) {
                if (n >= 100) {
                    return 0;
                }
                if (n >= 80) {
                    return 1;
                }
                if (n >= 75) {
                    return 2;
                }
                if (n >= 50) {
                    return 3;
                }
                if (n >= 25) {
                    return 4;
                }
                return 5;
            }

            /**
             * 每两个点根据速度绘制一条线
             */
            for (let i = 0, len_i = this.polylinePointsArr.length; i < len_i; i++) {
                item_i = this.polylinePointsArr[i];
                for (j = 0, len_j = item_i.length; j < len_j - 1; j++) {
                    this.map.addOverlay(new BMap.Polyline([item_i[j].bPoint, item_i[j + 1].bPoint], {
                        strokeColor: strokeColorArr[matchColor(item_i[j].speed)],
                        strokeWeight: 10,
                        strokeOpacity: 1,
                    }));
                }
            }
        } else { // 画一条线
            var mPolyline = new BMap.Polyline(this.polylinePoints, {
                strokeColor: "#00c238",
                strokeWeight: 10,
                strokeOpacity: 1,
            });
            this.map.addOverlay(mPolyline);
        }
        this.showAllPolyline();
        // console.log(this.map.getOverlays().length);
        // console.log("setPolyline end", new Date().getTime() - _start);
    },
    // 地图显示所有的点
    showAllPolyline: function () {
        this.map.setViewport(this.polylinePoints);
    },
    // 行为分析的自定义覆盖物添加
    addBehaviorOverlay: function (){
        this.removeBehaviorOverlay();
        function BehaviorOverlay(point, div, map){
            this._point = point;
            this._div = div;
            this._map = map;
        }
        BehaviorOverlay.prototype = new BMap.Overlay();
        BehaviorOverlay.prototype.initialize = function(map){
            var div = this._div;
            div.onmouseover = function(){
                $(div).addClass("active");
            };
            div.onmouseout = function(){
                $(div).removeClass("active");
            };
            map.getPanes().labelPane.appendChild(div);
            return div;
        };
        BehaviorOverlay.prototype.draw = function(){
            var map = this._map;
            var pixel = map.pointToOverlayPixel(this._point);
            this._div.style.left = pixel.x - 10 + "px";
            this._div.style.top  = pixel.y - 10 + "px";
        };

        for(var key in this.behaviorOverlayObj) {
            var behave = this.behavior[key];
            if(behave && behave.length) {
                for(var i = 0, len = behave.length; i < len; i++) {
                    var item = behave[i];
                    var $dom = this.$behaviorOverlayDom.clone();
                    if(key == "speeding") {
                        item = item.speeding_points[0];
                        $dom.text("超速 " + item.actual_speed + " | " + "限速 " + item.limit_speed);
                    } else if(key == "harsh_acceleration") {
                        $dom.text("急变速");
                    } else if(key == "harsh_breaking") {
                        $dom.text("急刹车");
                    } else if(key == "harsh_steering") {
                        $dom.text("急转弯");
                    }
                    $dom.addClass(key);
                    $dom.mouseenter(function (e) {
                        $(this).addClass("active");
                        e.stopPropagation();
                    });
                    $dom.mouseleave(function (e) {
                        $(this).addClass("active");
                        e.stopPropagation();
                    });
                    $dom.mousemove(function (e) {
                        e.stopPropagation();
                    });
                    var BO = new BehaviorOverlay(new BMap.Point(item.longitude, item.latitude), $dom[0], this.map);
                    BO.markerInfo = item; // 记录这个markerInfo的相关信息，用于在筛选时间段的时候，进行显示和隐藏
                    this.behaviorOverlayObj[key].push(BO);
                    this.map.addOverlay(BO);
                    BO.hide();
                }
            }
        }
        var that = this;
        this.$behaviorControlDom.find(".speeding_num").text(this.behavior.speeding_num);
        this.$behaviorControlDom.find(".harsh_acceleration_num").text(this.behavior.harsh_acceleration_num);
        this.$behaviorControlDom.find(".harsh_breaking_num").text(this.behavior.harsh_breaking_num);
        this.$behaviorControlDom.find(".harsh_steering_num").text(this.behavior.harsh_steering_num);
        this.$behaviorControlDom.find(".behavior_item_select").each(function (i, item) {
            that.showBehaviorOverlay($(item).attr("data-item"), $(item).parents(".behavior_item").hasClass("active"));
        }.bind(this));

    },
    // 行为分析的自定义覆盖物删除
    removeBehaviorOverlay: function () {
        // console.log("remove start");
        for(var key in this.behaviorOverlayObj) {
            var behave = this.behaviorOverlayObj[key];
            if(behave.length) {
                for(var i = 0, len = behave.length; i < len; i++) {
                    this.map.removeOverlay(behave[i]);
                }
                this.behaviorOverlayObj[key] = [];
            }
        }
        // console.log("remove end");
    },
    // 显示/隐藏某种类型的行为分析 overlay
    showBehaviorOverlay: function (para, flag) {
        // console.log("showBehaviorOverlay");
        var behave = this.behaviorOverlayObj[para] || [];
        if(behave.length) {
            for(var i = 0, len = behave.length; i < len; i++) {
                var item = behave[i];
                if(flag && item.markerInfo.loc_time * 1000 >= this.startTime && item.markerInfo.loc_time * 1000 <= this.endTime) {
                    item.show();
                } else {
                    item.hide();
                }
            }
        }
    },
    // 根据时间段筛选显示或者隐藏行为分析覆盖物
    addEvents: function () {
        // console.log("addEvents");
        var that = this;
        // 播放功能
        that.$palyDom.click(function () {
            if ($(this).hasClass("timelinePause")) {
                that.stopPlay();
            } else {
                that.startPlay();
            }
        });

        // 加速播放事件
        this.$increaseDom.click(function () {
            this.speed /= 1.6;
        }.bind(this));
        // 减速播放事件
        this.$reduceDom.click(function () {
            this.speed *= 1.6;
        }.bind(this));

        // 标尺 鼠标进入、离开、移动事件 -- 显示、影藏、更改分钟数/分钟数的显示位置
        that.$timeRulerMaskDom.mouseenter(function (e) {
            var target = e.target === this ? e.offsetX : e.offsetX + e.target.offsetLeft; // 一种是悬浮在mask上，一种是悬浮在圆点上
            that.setTimeLabel(target);
            that.$timeLabelDom.show();
        });
        that.$timeRulerMaskDom.mouseleave(function (e) {
            that.$timeLabelDom.hide();
            // potMove = false;
        });
        that.$timeRulerMaskDom.mousemove(function (e) {
            var target = e.target === this ? e.offsetX : e.offsetX + e.target.offsetLeft; // 一种是悬浮在mask上，一种是悬浮在圆点上
            that.setTimeLabel(target); // 时间轴上方显示时间的事件
            that.$timeLabelDom.show();
            if (potMove) {
                that.setTimePoint(target); // 触发时间点的事件
            }
            e.preventDefault(); // 阻止浏览器默认行为，有时会出现圆圈加一横在中心
        });

        // 标尺 鼠标抬起事件，代替鼠标点击事件 -- 设置圆点的当前位置
        that.$timeRulerMaskDom.mouseup(function (e) {
            if (e.button == 0) { // 左键才处理
                var target = e.target === this ? e.offsetX : e.offsetX + e.target.offsetLeft; // 一种是悬浮在mask上，一种是悬浮在圆点上
                that.setTimePoint(target);
            }
            // potMove = false;
        });

        // 圆点的拖动事件
        var potMove = false;
        that.$timePotDom.mousedown(function (e) {
            if (e.button == 0) { // 左键才处理
                potMove = true
            }
        });

        // 起始点设置的事件
        var caliperADown = false;
        var caliperBDown = false;
        var startX = 0; // 用于计算移动的
        var caliperX = 0; // 保证每次开始箭头的最右侧与鼠标的指针保持一致，从而保证鼠标的指针移动到时间轴上提示的时间和时间移动显示的时间保持一致
        that.$container.mousedown(function (e) {
            if (e.button == 0) {
                if (e.target === that.$caliperAPointerDom[0]) {
                    caliperADown = true;
                    that.setTimeLabel(parseInt(that.$caliperADom.css("left")));
                    startX = e.screenX - parseInt(that.$caliperADom.css("left"));
                    caliperX = e.offsetX; // 点击caliper pointer 的距离左边的位置
                    that.$timeLabelDom.show();
                } else if (e.target === that.$caliperBPointerDom[0]) {
                    caliperBDown = true;
                    that.setTimeLabel(parseInt(that.$caliperBDom.css("left")));
                    startX = e.screenX - parseInt(that.$caliperBDom.css("left"));
                    caliperX = e.offsetX; // 点击caliper pointer 的距离左边的位置
                    that.$timeLabelDom.show();
                }
            }
        });
        that.$container.mousemove(function (e) {
            var _left;
            if (caliperADown) {
                _left = e.screenX - startX - (9 - caliperX);
                that.setStart(_left);
                that.setTimeLabel(_left);
                that.$timeLabelDom.show();
            } else if (caliperBDown) {
                _left = e.screenX - startX + (10 + caliperX);
                that.setEnd(_left);
                that.setTimeLabel(_left);
                that.$timeLabelDom.show();
            }
        });
        that.$container.mouseup(function (e) {
            potMove = false;
            if (caliperADown || caliperBDown) {
                that.setTimePoint(parseInt(that.$caliperADom.css("left")));
                that.stopPlay();
                that.setPlayPeriod();
            }
            caliperADown = false;
            caliperBDown = false;
            that.$timeLabelDom.hide();
        });

        // 放大缩小功能注册点击事件
        this.$zoomControlDom.find(".zoomIn").click(function () {
            this.map.zoomIn();
        }.bind(this));
        this.$zoomControlDom.find(".zoomOut").click(function () {
            this.map.zoomOut();
        }.bind(this));

        // 行为分析功能注册点击事件
        this.$behaviorControlDom.find(".behavior_item_select").click(function (e) {
            var $parent = $(this).parents(".behavior_item");
            $parent.toggleClass("active");
            that.showBehaviorOverlay($(this).attr("data-item"), $parent.hasClass("active"));
        });

    },
    /**
     * 开始播放 计算按10s进行计算
     * 10s 中播放 1小时时间内的所有轨迹
     * 3600 / 10 360秒 --> 1秒钟播放 360秒=6min 的路程
     * 1 秒钟播放 10次，每次播放 3600000 / this.speed / step 的时间间隔的坐标
     * 播放的起点是
     */
    startPlay: function () {
        if (this.currentPtMarker) {
            this.$palyDom.removeClass().addClass("timelinePause");
            this.playFlag = true;
            var step = 10; // 1秒钟播放多少次
            var go = function () {
                // 1秒钟播放10次 每秒播放的轨迹时间跨度 3600000 / this.speed
                // 每次播放的时间跨度 3600000 / this.speed / step
                var newTime = this._startTime + 3600000 / this.speed / step;
                if (newTime > this.endTime) {
                    this.stopPlay();
                    return;
                }
                this._startTime = newTime;
                this.setTimePoint(this.getTimePixel(this._startTime));
                if (this.playFlag) {
                    setTimeout(go, 1000 / step);
                }
            }.bind(this);
            go();
        }
    },
    // 关闭播放
    stopPlay: function () {
        // console.log("stopPlay");
        this.$palyDom.removeClass().addClass("timelinePlay");
        this.playFlag = false;
    },
    // 选择时间点信息
    setTimeLabel: function (target) {
        // console.log("setTimeLabel");
        var that = this;
        target = target <= 0 ? 0 : target; // 防止移动过程中左边超界限
        target = target >= this.rulerWidth ? this.rulerWidth : target; // 防止移动过程中右边超界限
        var ct = this.moment(this.getPixelTime(target)).format("YYYY-MM-DD HH:mm:ss").slice(5, 16);
        that.$timeLabelContentDom.text(ct);
        that.$timeLabelDom.css({
            "left": target
        });
    },
    // 选择时间点信息
    setTimePoint: function (target) {
        // console.log("setTimePoint");
        var that = this;
        target = target <= 0 ? 0 : target; // 防止移动过程中左边超界限
        target = target >= this.rulerWidth ? this.rulerWidth : target; // 防止移动过程中右边超界限
        that.$timePotDom.css({
            "left": target
        });
        this.currentPt = this.getPoint(target);
        this.currentPt && this.currentPtMarker.setPosition(this.currentPt.bPoint);
        this._startTime = this.getPixelTime(target);  // 设置播放的开始时间戳
    },
    // 设置地图显示的 polyline 段的坐标分组
    setPlayPeriod: function () {
        // console.log("setPlayPeriod");
        // _start = new Date().getTime();
        this.polylinePointsArr = this.separatePoints(this.originalPointArr.slice(this.originalPointArr.indexOf(this.startPt), this.originalPointArr.indexOf(this.endPt) + 1));
        this.setPolyline();
        // console.log("setPlayPeriod", new Date().getTime() - _start);
        // console.log(this.map.getPanes())
        // console.log(this.map.getOverlays())
    },
    // 设置播放段的起点
    setStart: function (target) {
        // console.log("setStart");
        var left = parseInt(this.$caliperBDom.css("left"));
        target = target <= 0 ? 0 : target; // 防止移动过程中左边超界限
        target = target >= left ? left : target;
        this.$caliperADom.css({
            left: target
        });
        this.$beforeTimeDom.css({
            width: target
        });
        this.startPt = this.getPoint(target);
        this.startTime = this.getPixelTime(target); // 设置播放的截止时间戳
        // console.log(this.startPt);

    },
    // 设置播放段的终点
    setEnd: function (target) {
        // console.log("setEnd");
        var left = parseInt(this.$caliperADom.css("left"));
        target = target >= this.rulerWidth ? this.rulerWidth : target; // 防止移动过程中右边超界限
        target = target <= left ? left : target;
        this.$caliperBDom.css({
            left: target
        });
        this.$afterTimeDom.css({
            width: this.rulerWidth - target
        });
        this.endPt = this.getPoint(target); // 设置播放的终点
        this.endTime = this.getPixelTime(target); // 设置播放的截止时间戳
    },
    // 在没有给points等数据的时候，预先初始化一次ruler，不然样式会错
    initRuler: function () { // 以当天的日期初始化坐标轴
        this.rulerStartTime = this.moment(this.moment().format("YYYY-MM-DD") + " 00:00:00").format("x") * 1;
        this.rulerEndTime = this.rulerStartTime + 86400000;
        var rulerUnits = this.$rulerControlDom.find(".timeNumber");
        for (var i = 0, len = rulerUnits.length; i < len; i++) { // .add(1, "hour")
            rulerUnits[i].innerHTML = this.moment(this.rulerStartTime + i * 3600000).format("YYYY-MM-DD HH:mm:ss").slice(11, 13);
            rulerUnits[i].style.left = i * this.rulerWidth / 24 - 1 + "px";
        }
        // 清除行为分析 --

        this.$behaviorControlDom.find(".speeding_num").text(0);
        this.$behaviorControlDom.find(".harsh_acceleration_num").text(0);
        this.$behaviorControlDom.find(".harsh_breaking_num").text(0);
        this.$behaviorControlDom.find(".harsh_steering_num").text(0);
    },
    // 在24小时时间内，以返回的时间段为中心显示
    setTimeRuler: function (e) {
        // console.log("setTimeRuler");
        this.startPt = this.originalPointArr[0]; // 初始化播放段设置的起点
        this.endPt = this.originalPointArr[this.originalPointArr.length - 1]; // 初始化播放段设置的终点
        // console.log(this.startPt, this.endPt);
        var sp = this.startPt;
        var ep = this.endPt;
        // var wTime = ep.loc_time_stamp - sp.loc_time_stamp;
        var wTime = new Date(ep.loc_time.slice(0, -6) + ":00:00").getTime() - new Date(sp.loc_time.slice(0, -6) + ":00:00").getTime();
        if (ep.loc_time_stamp - sp.loc_time_stamp > 86400000) { // 超过一天的时间无法处理
            alert("超过一天的时间无法处理");
            return;
        }
        this.rulerStartTime = new Date(sp.loc_time.slice(0, -6) + ":00:00").getTime() - ((86400000 - wTime) / 2);
        this.rulerEndTime = this.rulerStartTime + 86400000;
        var rulerUnits = this.$rulerControlDom.find(".timeNumber");
        for (var i = 0, len = rulerUnits.length; i < len; i++) { // .add(1, "hour")
            rulerUnits[i].innerHTML = this.moment(this.moment(this.rulerStartTime + 3600000 * i)).format("YYYY-MM-DD HH:mm:ss").slice(11, 13);
            rulerUnits[i].style.left = i * this.rulerWidth / 24 - 1 + "px";
        }

        // 设置时间轴内显示轨迹的路段
        for (i = 0, len = this.pointsArr.length; i < len; i++) {
            var left = Math.ceil((this.pointsArr[i][0].loc_time_stamp - this.rulerStartTime) / 86400000 * this.rulerWidth);
            var width = Math.ceil((this.pointsArr[i][this.pointsArr[i].length - 1].loc_time_stamp - this.pointsArr[i][0].loc_time_stamp) / 86400000 * this.rulerWidth);
            this.$timeRulerDom.append('<div class="runPart" style="left: ' + left + 'px; width: ' + width + 'px;"></div>');
            if (i === 0) {
                this.setTimePoint(left); // 初始化播放的默认开始位置
            }
        }
        this.endTime = this.rulerEndTime; // 初始化终点
        this.setStart(0);
        this.setEnd(this.rulerWidth);
    },
    // 以一天的时间显示
    setTimeRulerOneDay: function () {
        // console.log("setTimeRuler");
        this.startPt = this.originalPointArr[0]; // 初始化播放段设置的起点
        this.endPt = this.originalPointArr[this.originalPointArr.length - 1]; // 初始化播放段设置的终点
        var sp = this.startPt;
        var ep = this.endPt;
        if (ep.loc_time_stamp - sp.loc_time_stamp > 86400000) { // 超过一天的时间无法处理
            // alert("超过一天的时间无法处理");
            return;
        }
        this.rulerStartTime = new Date(sp.loc_time.slice(0, 11) + "00:00:00").getTime();
        this.rulerEndTime = this.rulerStartTime + 86400000;
        var rulerUnits = this.$rulerControlDom.find(".timeNumber");
        for (var i = 0, len = rulerUnits.length; i < len; i++) { // .add(1, "hour")
            rulerUnits[i].innerHTML = this.moment(this.rulerStartTime + i * 3600000).format("YYYY-MM-DD HH:mm:ss").slice(11, 13);
            rulerUnits[i].style.left = i * this.rulerWidth / 24 - 1 + "px";
        }
        // 设置时间轴内显示轨迹的路段
        for (i = 0, len = this.pointsArr.length; i < len; i++) {
            var left = Math.ceil((this.pointsArr[i][0].loc_time_stamp - this.rulerStartTime) / 86400000 * this.rulerWidth);
            var width = Math.ceil((this.pointsArr[i][this.pointsArr[i].length - 1].loc_time_stamp - this.pointsArr[i][0].loc_time_stamp) / 86400000 * this.rulerWidth);
            this.$timeRulerDom.append('<div class="runPart" style="left: ' + left + 'px; width: ' + width + 'px;"></div>');
            if (i === 0) {
                this.setTimePoint(left); // 初始化播放的默认开始位置
            }
        }
        this.endTime = this.rulerEndTime; // 初始化终点
        this.setStart(0);
        this.setEnd(this.rulerWidth);
    },
    // 鼠标在轨迹上移动的时候，找最近的一个点
    getPolylinePoint: function (point) {
        // for (var i = 0, len_i = this.pointsArr.length; i < len_i; i++) {
        //     var item_i = this.pointsArr[i];
        //     for (var j = 0, len_j = item_i.length; j < len_j; j++) {
        //         var item_j = item_i[j];
        //         // if(Math.abs(point.lat - item_j.latitude) < this.mapScaleMeterObj[this.map.getZoom()] / 4 / 100000 && Math.abs(point.lng - item_j.longitude) < this.mapScaleMeterObj[this.map.getZoom()] / 4 / 100000) { // 这个判断增加后更加耗性能
        //         if (this.map.getDistance(point, item_j.bPoint) < this.mapScaleMeterObj[this.map.getZoom()] / 4) { // 缩放级别再18的时候，5米以内显示 5 = 20 / 4;
        //             return item_j;
        //         }
        //         // }
        //
        //
        //     }
        // }
        for(var i =0, len = this.originalPointArr.length; i < len; i++) {
            var item = this.originalPointArr[i];
            if (item.loc_time_stamp >= this.startTime
                && item.loc_time_stamp <= this.endTime
                && this.map.getDistance(point, item.bPoint) < this.mapScaleMeterObj[this.map.getZoom()] / 4) { // 缩放级别再18的时候，5米以内显示 5 = 20 / 4;
                // console.log("item", item);
                // console.log(this.startTime, this.endTime, item.loc_time_stamp);
                return item;
            }
        }
        return null;
    },
    // 根据时间寻找最近的点
    getPoint: function (target) {
        if (!this.periodStartTimeArr.length) return;
        var ctime = this.getPixelTime(target);
        for (var j = 0, len_j = this.originalPointArr.length; j < len_j; j++) {
            var item_j = this.originalPointArr[j];
            if (j === 0 && ctime < item_j.loc_time_stamp) { // 在第一个坐标点时间之前
                return item_j;
            } else if (ctime >= this.originalPointArr[this.originalPointArr.length - 1].loc_time_stamp) { // 在最后一个坐标点时间之后
                return this.originalPointArr[this.originalPointArr.length - 1];
            } else if (ctime >= item_j.loc_time_stamp && ctime < this.originalPointArr[j + 1].loc_time_stamp) { // 在两个坐标点时间之间
                return this.originalPointArr[j + 1].loc_time_stamp - ctime > ctime - item_j.loc_time_stamp ? item_j : this.originalPointArr[j + 1]; // 取两个点最近的点进行显示
            }
        }
        return null;
        /**
         * 从 periodStartTimeArr 数组中获取
         */
        // var index = 0;
        // periodStartTimeArr -- 从这个数组中挑选出时间段
        // for(var i = 0, len = this.periodStartTimeArr.length;i < len; i++) {
        // 	var item = this.periodStartTimeArr[i];
        // 	if(ctime >= item.start_time && ctime <= item.end_time) {
        // 		index = i;
        // 	} else if(ctime > item.end_time){
        // 		index = i;
        // 	}
        // }
        // // 从对应时间段中选出点并返回
        // var item_i = this.pointsArr[index];
        // for(var j = 0, len_j = item_i.length; j < len_j; j++) {
        // 	var item_j = item_i[j];
        // 	if(j === 0 && ctime < item_j.loc_time_stamp) { // 在第一个坐标点时间之前
        // 		return item_j;
        // 	} else if(ctime >= item_i[item_i.length - 1].loc_time_stamp) { // 在最后一个坐标点时间之后
        // 		return item_i[item_i.length - 1];
        // 	} else if(ctime >= item_j.loc_time_stamp && ctime < item_i[j + 1].loc_time_stamp) { // 在两个坐标点时间之间
        // 		return item_i[j + 1].loc_time_stamp - ctime > ctime - item_j.loc_time_stamp ? item_j : item_i[j + 1]; // 取两个点最近的点进行显示
        // 	}
        // }
        // return null;
    },
    // 根据时间轴位置显示返回时间
    getPixelTime: function (target) {// 坐标轴宽度按this.rulerWidth计算
        return this.rulerStartTime + target / this.rulerWidth * 86400000;
    },
    // 根据时间戳返回时间轴坐标
    getTimePixel: function (time) {// 坐标轴宽度按this.rulerWidth计算
        return (time - this.rulerStartTime) / 86400000 * this.rulerWidth;
    },
};
// 一小时 3600000 ms
// 一天  86400000 ms

TrailView.prototype = poto;
