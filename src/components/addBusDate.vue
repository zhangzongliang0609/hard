<template>
    <!--<div class="mask" v-if="itemsLoading">-->

    <!--</div>-->
    <div class="dialog-calendar layui-layer layui-anim layui-layer-page layui-modify layer-add-bus-date">
        <div class="busLine">
            <h5>选择线路设置班车日期</h5>
            <ul class="lineName">
                <li :class="{'currentLine': busId == item.id}" v-for="item in busLineArr" @click="getBusLineName(item.id,$event)"
                    data-id="{{item.id}}">{{item['shuttle_name']}}
                </li>
            </ul>
        </div>

        <div class="bugDate">
            <div class="layui-layer-title">编辑班车日期</div>
            <div id="J-calendar" class="layui-layer-content">
                <div class="date-color mt-20 ml-20 text-l">
                    <ul>
                        <li>
                            <span class="red"></span>
                            已过期
                        </li>
                        <li>
                            <span class="green"></span>
                            开售中
                        </li>
                        <li>
                            <span class="selected"></span>
                            已设置
                        </li>
                        <li>
                            <span class="cache"></span>
                            未保存
                        </li>
                    </ul>
                </div>
                <br>
                <div id="assignTime">
                    <input type="radio" name="shuttle_type" value=-10 id="go" v-on:click="get_bus_time(-10)"/>
                    <label id="trip" for="go">去程</label>
                    <input type="radio" name="shuttle_type" value=10 id="return" v-on:click="get_bus_time(10)"/>
                    <label for="return">返程</label>
                    <div id="dateSelected" class="mb-50">
                        <div class="dateLeft">
                            <input id="work" type="checkbox" v-on:click="selectedWorkDay(8,$event)">工作日
                            <span id="monDay" class="" @click="selectedWorkDay(1,$event)">一</span>
                            <span id="tuesDay" class="" @click="selectedWorkDay(2,$event)">二</span>
                            <span id="wednesDay" @click="selectedWorkDay(3,$event)">三</span>
                            <span id="thursDay" @click="selectedWorkDay(4,$event)">四</span>
                            <span id="friDay" @click="selectedWorkDay(5,$event)">五</span>
                        </div>
                        <div class="dateRight">
                            <input id="weekend" type="checkbox" v-on:click="selectedWorkDay(9,$event)">休息日
                            <span id="sat" @click="selectedWorkDay(6,$event)">六</span>
                            <span id="week" @click="selectedWorkDay(7,$event)">日</span>
                        </div>
                    </div>
                </div>
                <div id="bustimes" class="row cl" v-if="bus_times.length">
                    <div id="formControls" class="formControls f-l col-12">

                        <div class="mb-5 mr-5 btn btn-success-outline radius time-item" v-for="item in bus_times"
                             v-on:click="getSourceDate(item, $event)">
                            <input type="radio" v-bind:value="item.id" name="bus_time" v-model="bus_time"
                                   v-bind:id="item.id"/>
                            {{item.departure_time}}
                        </div>
                    </div>
                </div>

            </div>
            <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
            <div class="layui-layer-btn" v-on:click="save"><a class="layui-layer-btn0">保存</a></div>
        </div>

    </div>

    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
    <div class="layui-layer-shade"></div>
</template>

<style lang="less" rel="stylesheet/less">
    #app {
        .dialog-calendar {
            width: 1040px;
            margin-left: -250px;
            display: flex;
            .bugDate {
                flex: 2;
            }
            .busLine {
                flex: 1;
                max-height: 100%;
                overflow-y: auto;
            }
        }
        .date-color {
            height: 20px;
            line-height: 20px;
            li {
                display: inline-block;
            }
            span {
                width: 20px;
                height: 20px;
                float: left;
                border-radius: 3px;
                margin: 0 5px;
                &.green {
                    background: green;
                }
                &.red {
                    background: red;
                }
                &.selected {
                    background: #7EA0E2;
                }
                &.cache {
                    background: orange;
                }
            }
        }
    }

    #dateSelected {
        .dateLeft {
            float: left;
            margin-left: 10px;
        }
        .dateRight {
            float: right;
            margin-right: 10px;
        }
        span {
            display: inline-block;
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            border: 1px solid #ccc;
            text-decoration: none;
            cursor: pointer;
        }
    }

    .date-current {
        background: #3abfa5;
        color: white;
    }

    .layer-add-bus-date {
        .formControls input[type="radio"] {
            display: none;
        }

        .selected-time {
            background: #5eb95e;
            color: white;
        }
    }

    h5 {
        text-align: center;
        color: #8b1020;
    }

    .lineName {
        height: 490px;
        overflow: auto;

        li {
            width: 80%;
            text-align: center;
            height: 28px;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin: 8px 10%;
            line-height: 28px;
            background: #e1e1e1;
            cursor: pointer;
        }
        .currentLine {
            background: orange;
            color: white;
        }
    }

    .mask {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);
    }

</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import moment from "moment"

    //
    //$("#dateSelected span").on('click',function () {
    //    $(this).toggleClass("date-current");
    //});
    //添加数据
//    let newAddArr = [];
//    //删除数据
//    let newDeleteArr = [];
//    var that = '';

    export default{

        ready () {
            let that = this;
            // 售票日期
            this.saleableDates();
            this.getBusList();
            this.getTime();

            /*使用方式：
             new Kalendae(指定容器,配置);
             配置属性注解：
             months属性表示日历显示几个月，值：1、2、3.....；默认值：1
             mode属性表示显示的是单选还是多选还是范围，值：'single'、'multiple'、'range'；默认值：'single'
             subscribe属性表示绑定kalendea指定的事件，支持的事件有change、date-clicked、view-changed
             date-clicked——点击日期,但在选择改变。 作为一个时刻对象接收日期点击第一个参数。 返回false将防止选择改变。
             */
            this.calendar = new Kalendae({
                attachTo: document.getElementById('J-calendar'),
                months: 1,
                mode: 'multiple',
//                direction: 'today-future', 不添加这个属性,就显示上月下月,去年明年的按钮
                subscribe: {
                    'date-clicked': function (date) {
//                        let todayTimeStamp = new Date($('.k-today').attr('data-date')).getTime();
                        let currentDate = date._i;

                        let currentDateMonth = currentDate.slice(0, 7);
                        let currentTimeStamp = new Date(currentDate +' ' +  (that.currentTime + ':00')).getTime();
                        // 先选择时间才可以点击去程或返程的时间
                        if (that.bus_time == "") {
                            layer.msg('请先选择时间！', {icon: 2, time: 1000});
                            return false;
                        }
                        // 预售日期中，如果有已经设置过的日期是不可以选择的
                        if(that.saleDates.indexOf(currentDate) != -1 && that.dateArrClassify[currentDateMonth] && that.dateArrClassify[currentDateMonth].contains(currentDate)){
                            layer.msg('不能操作预售日期', {icon: 2, time: 1000});
                            return false;
                        }
                        //不能操作过去的日期 当日00:00:00之前的日期
                        if (currentTimeStamp  < that.nowaday) {
                            layer.msg('不能操作已过期日期', {icon: 2, time: 1000});
                            return false;
                        } else {
                            //是否已选日期
                            let selected_bus_time = that.bus_time;
                            if (that.dateArrClassify[currentDateMonth] && that.dateArrClassify[currentDateMonth].contains(currentDate)) {
                                // 创建一个要删除的日期数组，key值为 selected_bus_time
                                if (!(selected_bus_time in that.deleted_cache)) {
                                    that.deleted_cache[selected_bus_time] = [];
                                }
                                let addArrIndexOf = that.deleted_cache[selected_bus_time].indexOf(currentDate);
                                if(addArrIndexOf < 0) { // 要删除的数组中不存在这个值
                                    that.deleted_cache[selected_bus_time].push(currentDate);
                                } else {
                                    that.deleted_cache[selected_bus_time].splice(addArrIndexOf, 1);
                                }
                            } else {
                                // 如果这个时间还没有日期数组,就创建一个日期数组
                                if (!(selected_bus_time in that.selected_cache)) {
                                    that.selected_cache[selected_bus_time] = [];
                                }
                                let addArrIndexOf = that.selected_cache[selected_bus_time].indexOf(currentDate);
                                if (addArrIndexOf < 0) {
                                    that.selected_cache[selected_bus_time].push(currentDate);
                                } else {
                                    //如果之前添加缓存就删除该缓存
                                    that.selected_cache[selected_bus_time].splice(addArrIndexOf, 1);

//                                    if (that.selected_cache[selected_bus_time].length == 0) {
//                                        delete that.selected_cache[selected_bus_time];
//                                    }
                                }
//                                that.calendar.setSelected(that.selected_cache[selected_bus_time]);
                            }
                            setTimeout(function () {
                                that.dateColor();
                            },0);
                            return false;
                        }

                    },
                    "view-changed":function (date) {
                        $("#dateSelected span").removeClass("date-current");
                        $('#dateSelected input').iCheck('uncheck');
                        if(that.bus_time){
                            setTimeout(function () {
                                that.dateColor();
                            },0)
                        }

                    }
                }

            },);
            base.verticalCenter('.layui-modify');
            setTimeout(function () {
                that.init();
            }, 200);
        },
        //动态传值
        props: ['title', 'type', 'busid',],
        data: function () {
            return {
                busId: '', // 当前选择的线路的id
                bus_times: [], // 当前选择的线路的班次的 发车时刻
                bus_time: "", // 当前线路选择的发车时刻的 id值
                calendar: "", // 日历对象
                saleDates: [], // 预售日期数组
                selected_cache: {}, // 根据每个时间点返回的数据对象，key值为每个线路的bus_time（某个线路的发车时刻id），value值为新增加的之前当前bus_time的未设置的日期值
                allDateArr: [], // 用户操作的新增的日期数组，存储格式为后台需要的个格式
                deleted_cache: {}, // 根据每个时间点返回的数据对象，key值为每个线路的bus_time（某个线路的发车时刻id），value值为选择了即将删除的之前当前bus_time已设置的日期值
                deleteSetedDateArr: [], // 即将要删除日期的数组
                busLineArr: [], // 巴士线路列表数组
                noData: true,
                itemsLoading: true,
                nowaday: 0, // 服务器返回的 当前时间 当天00:00 的13位数值格式
                dateArrClassify:{}, // 当前线路的某个时间的 日期数组 按年月为key值，存储的多想
                currentTime:'' // 点击选中的班次发车时间
            }
        },
        methods: {
            init: function () {
                //判断是否是第一次进入该新功能或页面从而弹出新功能的提示
                if (localStorage.addBusdatePromptFlag == 'true') {
                    let arrObj = [$('#assignTime'), $('#bustimes'), $('.k-disable-previous-year-btn'),];
                    /*$('check'),$('exportData'),*/
                    let arrTitle = ['先选择去程还是返程', '再选择相应时间', '再选择相应的日期',];
                    /*'点击这里可以查看到搭乘详情哦','点击这里可以导出想要的订单详情哦',*/
                    var promptTypes = ['addBusdatePromptFlag',];
                    $.guidance({
                        obj: arrObj,
                        title: arrTitle,
                        flag: promptTypes,
                    });
                }
            },
            // 获取线路列表
            getBusList: function () {
                $.ajax({
                    url: base.gAjaxUrl.shuttlebuses2,
                    type: 'GET',
                    data: {
                        page: 1,
                        page_size: 9999999,

                    }
                }).always((data)=> {
                    base.ajaxCallback(data, ()=> {
                        this.itemsLoading = false;
                        let resultData = data.results;
                        this.busLineArr = resultData;
                        if (resultData.length) {
                            this.noData = false;
                            //回调
                        } else {
                            this.noData = true;
                        }
                    });
                })
            },
            dateColor: function (type) {
//                console.log("dateColor");
                let dateArr = $('.k-in-month');
                let that = this;
                let currentMonth = dateArr.eq(0).attr('data-date').substr(0, 7);
                let currentDateArr = that.dateArrClassify[currentMonth]?that.dateArrClassify[currentMonth]:[];

                dateArr.each(function () {
                        let thisDate = $(this).attr('data-date');
                        $(this).removeClass("k-selected expire sales cache");
                        let thisTimeStamp = new Date(thisDate + ' ' +  that.currentTime).getTime();
                    // console.log(thisDate + that.currentTime);
                    //过期的状态颜色  这里渲染的只是服务器返回的已经设置过的日期
//                        if (thisTimeStamp + 86400000 < that.nowaday) {
                        if (thisTimeStamp < that.nowaday) {
                            _.includes(currentDateArr, thisDate) ? $(this).addClass('k-selected expire') : $(this).addClass('out-of-date');
                        } else if (_.includes(currentDateArr, thisDate) && !_.includes(that.deleted_cache[that.bus_time], thisDate)) {
                            _.includes(that.saleDates, thisDate) ? $(this).addClass('k-selected sales') : $(this).addClass('k-selected');
                        } else {
                            _.includes(that.selected_cache[that.bus_time], thisDate) ? $(this).addClass('k-selected cache') : $(this).removeClass('k-selected cache');
                        }
                    })
            },
            // 获取 当前线路去程或者返程 发车时刻表
            get_bus_time: function (shuttle_type) {
                this.getCheckDate();
                let that = this;
                let busIdData = this.busId;
                if (busIdData) {
                    $.ajax({
                        url: `${base.gAjaxUrl.shuttlebuses2}${busIdData}/bus_time/?shuttle_type=${shuttle_type}`,
                        type: 'GET',
                    }).always((data)=> {
                        this.bus_times = data;
                        this.bus_time = '';
                        $("#dateSelected span").removeClass("date-current");
                        $('#dateSelected input').iCheck('uncheck');
                        // 日历重绘
                        that.calendar.draw();
                    });
                }
            },
            // 获取预售日期
            saleableDates: function () {
                $.ajax({
                    url: base.gAjaxUrl.shuttlebuses + 'saleable_dates/',
                    type: 'GET',
                }).always((data)=> {
                    //售卖日期
                    this.saleDates = data.data;
                })
            },
            // 从服务器获取 当前线路去程或者返程 已选中的发车时刻表 对应的所有设置过的发车日期
            getSourceDate: function (bus_time, event) {
                let that = this;
                that.getCheckDate();
                $("#dateSelected span").removeClass("date-current");
                $('#dateSelected input').iCheck('uncheck');
                this.currentTime = bus_time.departure_time;
                console.log("this.currentTime");
                console.log(this.currentTime);
                this.bus_time = bus_time.id;
                $(event.target).addClass('selected-time').siblings().removeClass('selected-time');
                $.ajax({
                    url: `${base.gAjaxUrl.shuttlebuses2}${that.busId}/dates/?bus_time=${bus_time.id}`,
                    type: 'GET',
                }).always((data) => {
                    that.dateArrClassify = {};
                    // 返回来的数据做日期分类处理
                    $(data).each(function (i,e) {
                        let monthIndex = e['departure_date'].substr(0, 7);
                        if(!that.dateArrClassify[monthIndex]) {
                            that.dateArrClassify[monthIndex] = [];
                        }
                        that.dateArrClassify[monthIndex].push(e['departure_date']);
                     });
                    that.dateColor();
                })
            },
            // 点击线路时，设置当前线路对应的书
            getBusLineName: function (id, event,) {
                this.getCheckDate();
                var tagEle = $(event.target);
                if (tagEle.hasClass("currentLine")) {
                    return false;
                }
                // 清空日历中的状态
                $(".kalendae .k-days>span").removeClass();
                $("#dateSelected span").removeClass("date-current");
                $('#dateSelected input').iCheck('uncheck');

                this.busId = id;

                //重置
                this.getTime();
                this.bus_time = '';
                $('#go').click();
            },
            // 保存新设置的日期和取消设置的日期
            getCheckDate: function () {

                let that = this;
                let flag_selected = true;
                let flag_deleted = true;
                let bus_time = that.bus_time;
                // that.selected_cache缓存过 bus_time key值，value为日期数组，而且这个日期数组有新增加的日期
                if(that.selected_cache[bus_time] && that.selected_cache[bus_time].length > 0){
                    let busObj = {};
                    busObj["shuttle_bus"] = that.busId;
                    busObj["bus_time"] = bus_time;
                    busObj["departure_date"] = [].concat(that.selected_cache[bus_time]);

                    // 在一次修改保存前，防止重复修改同一条线路导致push两次的情况
                    if (busObj["departure_date"].length != 0) {
                        for(let i = 0, len = that.allDateArr.length; i < len; i++) {
                            if(that.allDateArr[i].bus_time === busObj.bus_time) {
                                that.allDateArr[i] = busObj;
                                flag_selected = false;
                            }
                        }
                        flag_selected && that.allDateArr.push(busObj);
                    }
                }
                // that.deleted_cache缓存过 bus_time key值，value为日期数组，而且这个日期数组有要取消的日期
                if(that.deleted_cache[bus_time] && that.deleted_cache[bus_time].length > 0){
                    let busObj = {};
                    busObj["shuttle_bus"] = that.busId;
                    busObj["bus_time"] = bus_time;
                    busObj["departure_date"] = [].concat(that.deleted_cache[bus_time]);

                    // 在一次修改保存前，防止重复修改同一条线路导致push两次的情况
                    if (busObj["departure_date"].length != 0) {
                        for(let i = 0, len = that.deleteSetedDateArr.length; i < len; i++) {
                            if(that.deleteSetedDateArr[i].bus_time === busObj.bus_time) {
                                that.deleteSetedDateArr[i] = busObj;
                                flag_deleted = false;
                            }
                        }
                        flag_deleted && that.deleteSetedDateArr.push(busObj);
                    }
                }

            },
            // 获取服务器的系统时间 用于做是否过期的判断
            getTime: function () {
                $.ajax({
                    url: base.gAjaxUrl.time,
                    type: 'GET',
                }).always((data)=> {
                    this.nowaday = new Date(data.full).getTime();
                    console.log(data);
                    console.log("this.nowaday:");
                    console.log(this.nowaday);
                })
            },
            // 工作日全选与周末全选函数
            selectedWorkDay: function (day, event) {
                let that = this;
                let currentMonth = "";
                if (that.bus_time == "") {
                    event.preventDefault();
                    layer.msg('请先选择时间！', {icon: 2, time: 1000});
                    return false;
                }
                let selected_bus_time = that.bus_time;
                // 日期选择过滤
                /**
                 * 点击批量选择时，遍历当前日期数组进行一个一个过滤
                 * @param item 周一...日的id值，以及复选框的id值
                 * @param time 当前日期
                 * @param isCheckbox 是否是选择复选框
                 */

                function dateFilter(item, time, isCheckbox) {
                    if(that.dateArrClassify[currentMonth] && _.includes(that.dateArrClassify[currentMonth], time)) { // 如果选择的日期是已经设置的日期
                        // 如果刚选择的日期不在已经缓存里面，就清空。
                        if (!(selected_bus_time in that.deleted_cache)) {
                            that.deleted_cache[selected_bus_time] = [];
                        }
                        //如果之前没添加的就添加日期
                        let addArrIndexOf = that.deleted_cache[selected_bus_time].indexOf(time);

                        if (!isCheckbox) {
                            let isClass = $("#" + item).hasClass("date-current");
                            if (!isClass && addArrIndexOf < 0) {
                                that.deleted_cache[selected_bus_time].push(time);
                            } else if (isClass && addArrIndexOf != -1) {
                                that.deleted_cache[selected_bus_time].splice(addArrIndexOf, 1);
                            }
                        } else {
                            let isChecked = $("#" + item).is(":checked");
                            if (!isChecked && addArrIndexOf < 0) {
                                that.deleted_cache[selected_bus_time].push(time);
                            } else if (isChecked && addArrIndexOf != -1) {
                                that.deleted_cache[selected_bus_time].splice(addArrIndexOf, 1);
                            }
                        }
                    } else {
                        // 如果刚选择的日期不在已经缓存里面，就清空。
                        if (!(selected_bus_time in that.selected_cache)) {
                            that.selected_cache[selected_bus_time] = [];
                        }
                        //如果之前没添加的就添加日期
                        let addArrIndexOf = that.selected_cache[selected_bus_time].indexOf(time);

                        if (!isCheckbox) {
                            var isClass = $("#" + item).hasClass("date-current");
                            if (isClass && addArrIndexOf < 0) {
                                that.selected_cache[selected_bus_time].push(time);
                            } else if (!isClass && addArrIndexOf != -1) {
                                that.selected_cache[selected_bus_time].splice(addArrIndexOf, 1);
                            }
                        } else {
                            var isChecked = $("#" + item).is(":checked");
                            if (isChecked && addArrIndexOf < 0) {
                                that.selected_cache[selected_bus_time].push(time);
                            } else if (!isChecked && addArrIndexOf != -1) {
                                that.selected_cache[selected_bus_time].splice(addArrIndexOf, 1);
                            }
                        }
                    }

                }

                if (event) {
                    $(event.target).toggleClass("date-current");
                }
                var dayArr = [];
                $(".k-in-month").each(function (i, e) {
                    // 只要是没有过期、预售、在当前日期之前的情况下，都会放进数组
                    if (!$(e).hasClass("expire") && !$(e).hasClass("sales") && !$(e).hasClass("out-of-date")) {
                        dayArr.push(e);
                    }
                });
                currentMonth = (dayArr.length && $(dayArr[0]).attr("data-date").slice(0, 7)) || '';
                $.each(dayArr, function (i, e) {
                    var jQele = $(e);
                    var elDate = jQele.attr("data-date");
                    var whatDay = moment(elDate).day();
                    switch (day) {
                        case 1: {
                            if (whatDay === 1) {
                                dateFilter("monDay", elDate);
                            }
                            break;
                        }
                        case 2: {
                            if (whatDay === 2) {
                                dateFilter("tuesDay", elDate);
                            }
                            break;
                        }
                        case 3: {
                            if (whatDay === 3) {
                                dateFilter("wednesDay", elDate);
                            }
                            break;
                        }
                        case 4: {
                            if (whatDay === 4) {
                                dateFilter("thursDay", elDate);
                            }
                            break;
                        }
                        case 5: {
                            if (whatDay === 5) {
                                dateFilter("friDay", elDate);
                            }
                            break;
                        }
                        case 6: {
                            if (whatDay === 6) {
                                dateFilter("sat", elDate);
                            }
                            break;
                        }
                        case 7: {
                            if (whatDay === 0) {
                                dateFilter("week", elDate);
                            }
                            break;
                        }
                        case 8: {
                            if ($("#work").is(":checked")) {
                                $(".dateLeft span").addClass("date-current");
                            } else {
                                $(".dateLeft span").removeClass("date-current");
                            }

                            // 工作日全选
                            if (whatDay !== 0 && whatDay !== 6) {
                                dateFilter("work", elDate, true);
                            }
                            break;
                        }
                        case 9: {
                            if ($("#weekend").is(":checked")) {
                                $(".dateRight span").addClass("date-current");
                            } else {
                                $(".dateRight span").removeClass("date-current");
                            }
                            // 休息日全选
                            if (whatDay === 6 || whatDay === 0) {
                                dateFilter("weekend", elDate, true);
                            }
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                });
                if (that.selected_cache[selected_bus_time] || that.deleted_cache[selected_bus_time]) {
                    that.dateColor();
                }
            },
            save: function () {
                this.getCheckDate();
                let that = this;
                let flag_add = false; // 新增请求是否发送完成
                let flag_delete = false; // 删除请求是否发送完成
//                console.log(that.allDateArr);
//                console.log(that.deleteSetedDateArr);
                // 添加
                if(that.allDateArr.length > 0) {
                    that.itemsLoading = true;
                    $.ajax({
                        url: `${base.gAjaxUrl.batchAddBusTime}`,
                        type: "POST",
                        contentType: 'application/json',
                        data: JSON.stringify({
                            data: that.allDateArr
                        })
                    }).always((data)=> {
                        flag_add = true;
                        if(flag_delete) that.itemsLoading = false;
                        base.ajaxCallback(data, () => {
//                            layer.msg('保存成功', {icon: 1, time: 1000});
                            if(flag_delete) that.$dispatch('dialog-save');
                        });
                    });
                } else {
                    flag_add = true;
                }

                // 删除
                if(that.deleteSetedDateArr.length > 0) {
                    that.itemsLoading = true;
                    $.ajax({
                        url: `${base.gAjaxUrl.batchDeleteBusTime}`,
                        type: "POST",
                        contentType: 'application/json',
                        data: JSON.stringify({
                            data: that.deleteSetedDateArr
                        })
                    }).always((data)=> {
                        flag_delete = true;
                        if(flag_add) that.itemsLoading = false;
                        base.ajaxCallback(data, () => {
//                            layer.msg('保存成功', {icon: 1, time: 1000});
                            if(flag_add) that.$dispatch('dialog-save');
                        });
                    })
                } else {
                    flag_delete = true;
                }

            },
            close: function () {
                this.$dispatch('dialog-close');
            },
        }
    }

    //数组功能扩展
    Array.prototype.each = function (fn) {
        fn = fn || Function.K;
        var a = [];
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0; i < this.length; i++) {
            var res = fn.apply(this, [this[i], i].concat(args));
            if (res != null) a.push(res);
        }
        return a;
    };
    //数组是否包含指定元素
    Array.prototype.contains = function (suArr) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == suArr) {
                return true;
            }
        }
        return false;
    }
    //不重复元素构成的数组
    Array.prototype.uniquelize = function () {
        var ra = new Array();
        for (var i = 0; i < this.length; i++) {
            if (!ra.contains(this[i])) {
                ra.push(this[i]);
            }
        }
        return ra;
    };
    //两个数组的补集
    Array.complement = function (a, b) {
        return Array.minus(Array.union(a, b), Array.intersect(a, b));
    };
    //两个数组的交集
    Array.intersect = function (a, b) {
        return a.uniquelize().each(function (o) {
            return b.contains(o) ? o : null
        });
    };
    //两个数组的差集
    Array.minus = function (a, b) {
        return a.uniquelize().each(function (o) {
            return b.contains(o) ? null : o
        });
    };
    //两个数组并集
    Array.union = function (a, b) {
        return a.concat(b).uniquelize();
    };
</script>

