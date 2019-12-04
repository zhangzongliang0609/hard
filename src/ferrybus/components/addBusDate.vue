<template>

    <div class="dialog-calendar layui-layer layui-anim layui-layer-page layui-modify layer-add-bus-date">
        <div class="busLine">
            <div class="text-c lh-30 pt-5">选择线路设置班车日期</div>
            <ul class="lineName">
                <li :class="{'currentLine': lineId == item.id}"
                    :title="item.shuttle_name"
                    v-for="item in busLineArr"
                    @click="getBusLineName(item.id,$event)"
                    data-id="{{item.id}}">{{item.shuttle_name}}
                </li>
            </ul>
        </div>

        <div class="bugDate">
            <div class="layui-layer-title">编辑班车日期</div>
            <div id="J-calendar" class="layui-layer-content">
                <div class="date_color clearfix">
                    <div class="clearfix f-l">
                        <div class="f-l red color_sign"></div>
                        <div class="f-l ml-5 c-666">已过期</div>
                        <div class="f-l green color_sign"></div>
                        <div class="f-l ml-5 c-666">开售中</div>
                        <div class="f-l selected color_sign"></div>
                        <div class="f-l ml-5 c-666">已设置</div>
                        <div class="f-l cache color_sign"></div>
                        <div class="f-l ml-5 c-666">未保存</div>
                    </div>
                    <div class="f-r clearfix mr-20">
                        <div class="f-l no-selected" v-show="isSetAll">
                            <label for="selectAllCheckbox"
                                   class="check-round-box ml-5 relative f-l"
                                   v-show="isSetAll">
                                全选班次
                            </label>
                            <input type="checkbox"
                                   id="selectAllCheckbox"
                                   class="check-box ml-5"
                                   @click="clickCheckAll">

                        </div>
                        <p class="inline-block ml-10">批量设置</p>
                        <div class="open-box ml-5" :class="{'bc-blue':isSetAll}" @click="setAll">
                            <div class="open-box-round" :class=" isSetAll?'open-box-open':'open-box-close'"></div>
                        </div>
                    </div>
                </div>
                <div id="dateSelected" class="dateSelected clearfix mt-15 mb-15">
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
                <div class="row cl bus_times">
                    <div class="formControls f-l col-12"
                         v-if="bus_times.length">
                        <div class="mb-5 mr-5 btn btn-success-outline radius time-item"
                             :id="item.id"
                             :class="batchIdArr.indexOf(item.id) != -1 ?'selected-time':'' "
                             v-for="item in bus_times"
                             v-on:click="getSourceDate(item, $event)">
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

    <div class="layui-layer-shade"></div>
</template>
<script type="text/ecmascript-6">

    import * as base from '../../assets/js/base.js';
    import moment from "moment";

    export default {

        ready() {
            let that = this;
            // 售票日期
            this.saleableDates();
            this.getBusList();
            this.getSystemTime();
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
                        // 先选择时间才可以点击去程或返程的时间
                        if (that.bus_time == "" && that.batchIdArr.length == 0) {
                            layer.msg('请先选择线路和时间！', {icon: 2, time: 1000});
                            return false;
                        }
                        let currentTimeStamp = new Date(currentDate + ' ' + that.currentTime + ':00').getTime();
                        let nowTime = that.nowaday;
                        if (that.isSetAll) {
                            currentTimeStamp = moment(currentDate + ' 00:00:00').format('x');
                            nowTime = moment(moment(this.nowaday).format('YYYY-MM-DD') + ' 00:00:00').format('x');
                        }
                        // 预售日期中，如果有已经设置过的日期是不可以选择的 -- 不是怕批量添加的时候会这么操作
                        if(!that.isSetAll && that.saleDates.indexOf(currentDate) != -1 && that.dateArrClassify[currentDateMonth] && that.dateArrClassify[currentDateMonth].contains(currentDate)){
                            layer.msg('不能操作预售日期', {icon: 2, time: 1000});
                            return false;
                        }
                        //不能操作过去的日期 当日00:00:00之前的日期
                        // console.log(currentTimeStamp, that.nowaday, nowTime);
                        // console.log(that.bus_time, that.batchIdArr.length);
                        if (currentTimeStamp < nowTime) {
                            layer.msg('不能操作已过期日期', {icon: 2, time: 1000});
                            return false;
                        } else {
                            if (!that.isSetAll) {
                                //是否已选日期
                                let selected_bus_time = that.bus_time;
                                if (that.dateArrClassify[currentDateMonth] && that.dateArrClassify[currentDateMonth].contains(currentDate)) {
                                    // 创建一个要删除的日期数组，key值为 selected_bus_time
                                    if (!(selected_bus_time in that.deleted_cache)) {
                                        that.deleted_cache[selected_bus_time] = [];
                                    }
                                    let addArrIndexOf = that.deleted_cache[selected_bus_time].indexOf(currentDate);
                                    if (addArrIndexOf < 0) { // 要删除的数组中不存在这个值
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
                            } else {
                                let index = that.batchDateArr.indexOf(currentDate);
                                if (index == -1) {
                                    that.batchDateArr.push(currentDate);
                                } else {
                                    that.batchDateArr.splice(index, 1);
                                }
                            }
                        }
                        setTimeout(function () {
                            that.dateColor();
                        }, 0);
                        return false;

                    },
                    "view-changed": function (date) {
                        $("#dateSelected span").removeClass("date-current");
                        $('#dateSelected input').iCheck('uncheck');
                        if (that.bus_time || that.batchDateArr.length != 0) {
                            setTimeout(function () {
                                that.dateColor();
                            }, 0)
                        }

                    }
                }

            },);
            base.verticalCenter('.layui-modify');
        },
        //动态传值
        data: function () {
            return {
                isSetAll: false,//批量按钮
                batchIdArr: [], // 发车时间id数组
                batchDateArr: [], // 选择日期数组
                isCheckAll: false,
                lineId: '', // 当前选择的线路的id
                bus_times: [], // 当前选择的线路的班次的 发车时刻
                bus_time: "", // 当前线路选择的发车时刻的 id值
                calendar: "", // 日历对象
                saleDates: [], // 预售日期数组
                selected_cache: {}, // 根据每个时间点返回的数据对象，key值为每个线路的bus_time（某个线路的发车时刻id），value值为新增加的之前当前bus_time的未设置的日期值
                addDateArr: [], // 用户操作的新增的日期数组，存储格式为后台需要的个格式
                deleted_cache: {}, // 根据每个时间点返回的数据对象，key值为每个线路的bus_time（某个线路的发车时刻id），value值为选择了即将删除的之前当前bus_time已设置的日期值
                deleteDateArr: [], // 即将要删除日期的数组
                busLineArr: [], // 巴士线路列表数组
                noData: true,
                nowaday: new Date().getTime(), // 服务器返回的 当前时间 当天00:00 的13位数值格式
                dateArrClassify: {}, // 当前线路的某个时间的 日期数组 按年月为key值，存储的多想
                currentTime: '' // 点击选中的班次发车时间
            }
        },
        methods: {
            setAll: function () {
                if (this.lineId == '') {
                    layer.msg('请先选择线路');
                    return;
                }
                let msg = this.isSetAll ? '关闭批量设置之后,未保存的日期将被清除,是否确认关闭吗?' : "开启批量设置之后,选择的日期将完全覆盖之前已设置的日期,是否确认开启";
                layer.confirm(msg, () => {
                    this.isSetAll = !this.isSetAll;
                    $('.selected-time').removeClass('selected-time');
                    layer.closeAll();
                    $("#dateSelected span").removeClass("date-current");
                    $('#dateSelected input').iCheck('uncheck');
                    if (!this.isSetAll) {
                        this.$nextTick(() => {
                            if (this.bus_time) {
                                $("#" + this.bus_time).addClass('selected-time');
                            }
                        })
                    } else {
                        // 重置多线路单时间选择日期条件下的缓存数据 dateArrClassify
                        this.dateArrClassify = {};
                        this.bus_time = '';
                        this.resetSelectAllData();
                        this.isCheckAll = false;
                    }
                    this.dateColor();
                });
            },
            clickCheckAll: function () {
                this.isCheckAll = !this.isCheckAll;
                this.batchIdArr = [];
                if (this.isCheckAll) {
                    this.batchIdArr = this.bus_times.map(item => item.id)
                }
            },
            // 获取线路列表
            getBusList: function () {
                $.showLoading();
                $.ajax({
                    url: base.gAjaxUrl.ferryBusLines,
                    type: 'GET',
                    data: {
                        page: 1,
                        page_size: 9999999,
                    }
                }).always((data) => {
                    $.hideLoading();
                    base.ajaxCallback(data, () => {
                        let resultData = data.results;
                        this.busLineArr = resultData;
                        this.noData = !resultData.length;
                    });
                })
            },
            dateColor: function () {
                let dateArr = $('.k-in-month');
                if(!dateArr.length) return;
                let that = this;
                let currentMonth = dateArr.eq(0).attr('data-date').substr(0, 7);
                let currentDateArr = '';

                // 判断当前是否为批量设置
                if (this.isSetAll) {
                    currentDateArr = this.batchDateArr;
                } else {
                    currentDateArr = this.dateArrClassify[currentMonth] ? this.dateArrClassify[currentMonth] : [];
                }

                dateArr.each(function () {
                    let thisDate = $(this).attr('data-date');
                    $(this).removeClass("k-selected expire sales cache");
                    let thisTimeStamp = '';
                    // console.log(thisDate + that.currentTime);
                    //过期的状态颜色  这里渲染的只是服务器返回的已经设置过的日期
//                        if (thisTimeStamp + 86400000 < that.nowaday) {
                    if (that.isSetAll) {
                        let nowTime = moment(moment(this.nowaday).format('YYYY-MM-DD') + ' 00:00:00').format('x');
                        thisTimeStamp = moment(thisDate + ' 00:00:01').format('x');
                        if (thisTimeStamp > nowTime) {
                            _.includes(currentDateArr, thisDate) ? $(this).addClass('k-selected cache') : $(this).removeClass('k-selected cache');
                        } else {
                            $(this).addClass('out-of-date')
                        }

                    } else {
                        thisTimeStamp = new Date(thisDate + ' ' + that.currentTime + ':00').getTime();
                        if (thisTimeStamp < that.nowaday) {
                            _.includes(currentDateArr, thisDate) ? $(this).addClass('k-selected expire') : $(this).addClass('out-of-date');
                        } else if (_.includes(currentDateArr, thisDate) && !_.includes(that.deleted_cache[that.bus_time], thisDate)) {
                            _.includes(that.saleDates, thisDate) ? $(this).addClass('k-selected sales') : $(this).addClass('k-selected');
                            console.log(22123123)
                        } else {
                            _.includes(that.selected_cache[that.bus_time], thisDate) ? $(this).addClass('k-selected cache') : $(this).removeClass('k-selected cache');
                        }
                    }

                })
            },
            // 获取 当前线路去程或者返程 发车时刻表 -> 摆渡车 默认去程
            get_bus_time: function (id) {
                this.getCheckDate();
                let that = this;
                let busIdData = id;
                if (busIdData) {
                    $.ajax({
                        url: `${base.gAjaxUrl.ferryBusLines}${busIdData}/bus_time/`,
                        type: 'GET',
                    }).always((data) => {
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
                }).always((data) => {
                    //售卖日期
                    this.saleDates = data.data;
                })
            },
            // 从服务器获取 当前线路去程或者返程 已选中的发车时刻表 对应的所有设置过的发车日期
            getSourceDate: function (bus_time, event) {

                if (!this.isSetAll) {
                    this.getCheckDate();
                    $("#dateSelected span").removeClass("date-current");
                    $('#dateSelected input').iCheck('uncheck');
                    this.currentTime = bus_time.departure_time;
                    this.bus_time = bus_time.id;
                    $(event.target).addClass('selected-time').siblings().removeClass('selected-time');
                    $.ajax({
                        url: `${base.gAjaxUrl.ferryBusLines}${this.lineId}/dates/?bus_time=${bus_time.id}`,
                        type: 'GET',
                    }).always((data) => {
                        this.dateArrClassify = {};
                        // 返回来的数据做日期分类处理
                        if(data && data.length) {
                            data.forEach(item => {
                                let monthIndex = item.departure_date.substr(0, 7);
                                if (!this.dateArrClassify[monthIndex]) {
                                    this.dateArrClassify[monthIndex] = [];
                                }
                                this.dateArrClassify[monthIndex].push(item.departure_date);
                            });
                        }
                        this.dateColor();
                    })
                } else {
                    let index = this.batchIdArr.indexOf(bus_time.id);
                    if (index == -1) {
                        this.batchIdArr.push(bus_time.id);
                    } else {
                        this.batchIdArr.splice(index, 1);
                    }
                    this.dateColor();
                }

            },
            // 点击线路时，设置当前线路对应的书
            getBusLineName: function (id, event) {
                if (this.isSetAll && this.batchIdArr.length && this.batchDateArr.length) {
                    layer.confirm("切换线路前是否保存日期设置？", (idx1) => {
                        this.save();
                        this.changeLine(id, event);
                        layer.close(idx1);
                    }, (idx2) => {
                        // 关闭和取消按钮都会调用这个回调。没办法。。。
                        this.resetSelectAllData();
                        this.changeLine(id, event);
                        layer.close(idx2);
                    });
                } else {
                    this.changeLine(id, event)
                }
            },
            changeLine(id, event) {
                this.getCheckDate();
                var tagEle = $(event.target);
                if (tagEle.hasClass("currentLine")) {
                    return false;
                }
                // 清空日历中的状态
                $(".kalendae .k-days>span").removeClass();
                $("#dateSelected span").removeClass("date-current");
                $('#dateSelected input').iCheck('uncheck');

                this.lineId = id;

                //重置
                this.getSystemTime();
                this.bus_time = '';
                // $('#go').click();
                this.get_bus_time(this.lineId);
            },
            // 保存新设置的日期和取消设置的日期
            getCheckDate: function () {
                if (!this.bus_time) return;
                let flag_selected = true; // 新选择？
                let flag_deleted = true; // 删除？
                let bus_time = this.bus_time;
                // this.selected_cache缓存过 bus_time key值，value为日期数组，而且这个日期数组有新增加的日期
                if (this.selected_cache[bus_time] && this.selected_cache[bus_time].length > 0) {
                    let busObj = {};
                    busObj["shuttle_bus"] = this.lineId;
                    busObj["bus_time"] = bus_time;
                    busObj["departure_date"] = [].concat(this.selected_cache[bus_time]);

                    // 在一次修改保存前，防止重复修改同一条线路导致push两次的情况
                    if (busObj["departure_date"].length != 0) {
                        for (let i = 0, len = this.addDateArr.length; i < len; i++) {
                            if (this.addDateArr[i].bus_time === busObj.bus_time) {
                                this.addDateArr[i] = busObj;
                                flag_selected = false;
                            }
                        }
                        flag_selected && this.addDateArr.push(busObj);
                    }
                }
                // this.deleted_cache缓存过 bus_time key值，value为日期数组，而且这个日期数组有要取消的日期
                if (this.deleted_cache[bus_time] && this.deleted_cache[bus_time].length > 0) {
                    let busObj = {};
                    busObj["shuttle_bus"] = this.lineId;
                    busObj["bus_time"] = bus_time;
                    busObj["departure_date"] = [].concat(this.deleted_cache[bus_time]);

                    // 在一次修改保存前，防止重复修改同一条线路导致push两次的情况
                    if (busObj["departure_date"].length != 0) {
                        for (let i = 0, len = this.deleteDateArr.length; i < len; i++) {
                            if (this.deleteDateArr[i].bus_time === busObj.bus_time) {
                                this.deleteDateArr[i] = busObj;
                                flag_deleted = false;
                            }
                        }
                        flag_deleted && this.deleteDateArr.push(busObj);
                    }
                }

            },
            save: function () {
                if (this.isSetAll) {
                    $.showLoading();
                    $.ajax({
                        url: `${base.gAjaxUrl.ferryBusLines}${this.lineId}/bulk_create_date2/`,
                        type: "POST",
                        contentType: 'application/json',
                        data: JSON.stringify({
                            bus_time: this.batchIdArr,
                            departure_date: this.batchDateArr,
                        })
                    }).always((data) => {
                        $.hideLoading();
                        base.ajaxCallback(data, () => {
                            // that.$dispatch('dialog-save',data);
                            layer.msg("设置成功");
                            this.resetSelectAllData();
                        });
                    });
                } else {
                    this.save2();
                }
            },
            save2: function () {
                this.getCheckDate();
                let that = this;
                let flag_add = false; // 新增请求是否发送完成
                let flag_delete = false; // 删除请求是否发送完成
                // 添加
                if (that.addDateArr.length > 0) {
                    $.showLoading();
                    $.ajax({
                        url: `${base.gAjaxUrl.ferryBusLines}bulk_create_date/`,
                        type: "POST",
                        contentType: 'application/json',
                        data: JSON.stringify({
                            data: that.addDateArr
                        })
                    }).always((data) => {
                        flag_add = true;
                        if (flag_delete) $.hideLoading();
                        base.ajaxCallback(data, () => {
                            if (flag_delete) {
                                layer.msg('保存成功', {icon: 1, time: 1000});
                                that.$dispatch('dialog-save');
                            }
                        });
                    });
                } else {
                    flag_add = true;
                }
                // 删除
                if (that.deleteDateArr.length > 0) {
                    $.showLoading();
                    $.ajax({
                        url: `${base.gAjaxUrl.ferryBusLines}bulk_delete_date/`,
                        type: "PATCH",
                        contentType: 'application/json',
                        data: JSON.stringify({
                            data: that.deleteDateArr
                        })
                    }).always((data) => {
                        flag_delete = true;
                        if (flag_add) $.hideLoading();
                        base.ajaxCallback(data, () => {
                            if (flag_add) {
                                layer.msg('保存成功', {icon: 1, time: 1000});
                                that.$dispatch('dialog-save');
                            }
                        });
                    })
                } else {
                    flag_delete = true;
                }

            },
            resetSelectAllData() {
                $("#selectAllCheckbox").attr("checked", false);
                this.isCheckAll = false;
                this.batchIdArr = [];
                this.batchDateArr = [];
                this.dateColor();
            },
            close: function () {
                this.$dispatch('dialog-close');
            },
            // 获取服务器的系统时间 用于做是否过期的判断
            getSystemTime: function () {
                $.ajax({
                    url: base.gAjaxUrl.time,
                    type: 'GET',
                }).always((data) => {
                    this.nowaday = new Date(data.full).getTime();
                    // console.log("this.nowaday:");
                    // console.log(this.nowaday);
                })
            },
            // 工作日全选与周末全选函数
            selectedWorkDay: function (day, event) {
                let that = this;
                let currentMonth = "";
                if (that.bus_time == "" && that.batchIdArr.length == 0) {
                    event.preventDefault();
                    layer.msg('请先选择线路和时间！', {icon: 2, time: 1000});
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
                    if (that.isSetAll) {
                        //如果之前没添加的就添加日期
                        let dateIndex = that.batchDateArr.indexOf(time);

                        if (!isCheckbox) { // 单选
                            let isClass = $("#" + item).hasClass("date-current");
                            if (isClass && dateIndex < 0) {
                                that.batchDateArr.push(time);
                            } else if (!isClass && dateIndex != -1) {
                                that.batchDateArr.splice(dateIndex, 1);
                            }
                        } else { // 单选
                            let isChecked = $("#" + item).is(":checked");
                            if (isChecked && dateIndex < 0) {
                                that.batchDateArr.push(time);
                            } else if (!isChecked && dateIndex != -1) {
                                that.batchDateArr.splice(dateIndex, 1);
                            }
                        }
                    } else {
                        if (that.dateArrClassify[currentMonth] && _.includes(that.dateArrClassify[currentMonth], time)) { // 如果选择的日期是已经设置的日期
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
                that.dateColor();
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

<style lang="less" rel="stylesheet/less" scoped>
    .an_btn {
        display: flex;
        justify-content: space-around;
    }

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

    .date_color {
        height: 30px;
        line-height: 30px;
        box-sizing: border-box;
        padding-right: 15px;

        .color_sign {
            margin-top: 5px;
            margin-left: 10px;
            width: 20px;
            height: 20px;
            float: left;
            border-radius: 3px;

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

    .bus_times {
        min-height: 58px;
    }

    .dateSelected {
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
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
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

