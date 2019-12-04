<template>
    <cover v-if="showConflict" :data="conflictDataArr" @cancel-cover="cancelCover"
           @confirm-cover="confirmCover"></cover>
    <div class="layui-layer layui-anim layui-layer-page layui-modify bus-dispatch">
        <div class="layui-layer-title">设置巴士班次</div>
        <div class="layui-layer-content dispatch_content">
            <div class="row clearfix layer_content">
                <div class="f-l col-4">
                    <div class="row clearfix">
                        <div class="text-l lh-30 ml-15">线路名称:&nbsp;&nbsp;</div>
                        <div class="line_box ml-15">
                            <div class="radius line_item text-c"
                                 v-for="(index, item) in lines"
                                 track-by="$index"
                                 @click="selectLines(item.id)"
                                 :title="item.shuttle_name"
                                 :class="{'selected': selectedLineId==item.id}">
                                {{item.shuttle_name}}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="f-l col-7">
                    <div class="row clearfix pl-10 pr-10">
                        <div class="col-2 f-l text-r lh-30">司机选择&nbsp;&nbsp;</div>
                        <div class="col-10 f-l">
                            <sel :arr="driverList"
                                 :name="selectDriver.staff__real_name"
                                 key="staff__real_name"
                                 v-on:sel="selectedDriver"></sel>
                        </div>
                    </div>
                    <div class="row clearfix pl-10 pr-10">
                        <div class="col-2 f-l text-r lh-30">车辆选择&nbsp;&nbsp;</div>
                        <div class="col-10 f-l">
                            <sel :arr="carList"
                                 key="car_no"
                                 :name="selectCar.car_no"
                                 v-on:sel="selectedCar"></sel>
                        </div>
                    </div>
                    <div class="row clearfix pl-10 pr-10">
                        <div class="f-l col-2 text-r lh-30">
                            <div>日期选择&nbsp;&nbsp;</div>
                        </div>
                        <div class="f-l col-10">
                            <div class="calendar">
                                <div id="busCalendar"></div>
                            </div>
                        </div>
                    </div>
                    <div class="row clearfix pl-10 pr-10">
                        <div class="f-l col-2 text-r lh-30">
                            <div>发车时间&nbsp;&nbsp;</div>
                        </div>
                        <div class="f-l col-10">
                            <div class="selected_content f-l clearfix col-10">
                                <div v-for="(index, item) in dateBusTimeArr"
                                     :class="{'selected': selectBusTimeArr.indexOf(item.busdate_id) > -1}"
                                     @click="setBusTime(item)"
                                     class="select_item f-l pointer">
                                    {{item.time}}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="clearfix mt-15">
                        <a href="javascript:;" class="btn radius btn-primary f-r mt-10 mr-20"
                           @click="saveDispatch">保存</a>
                    </div>
                </div>
            </div>
        </div>
        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<script type="text/ecmascript-6">

    import * as base from '../../assets/js/base.js';
    import moment from "moment";
    import sel from '../components/palceselectedInput.vue';
    import cover from './ferryBusDispatchCover';

    export default {
        ready() {

            base.verticalCenter('.layui-modify');
            this.initCalendar();
            this.init();

            window.moment = moment;
        },
        data: function () {
            return {
                selectedLineId: '',// 当前选择的路线的id
                showDirection: false,
                showBusDates: false,
                dateArr: [], // 所有的日期组合
                lineName: '', // 选择的线路名称
                busTimeObj: {}, // 当前线路所有的发车时间
                dateBusTimeArr: [], // 选择的日期对应的发车时间
                selectBusTimeArr: [], // 选择的发车时间
                currentDate: '', // 当前选择的日期 -> 一次只能选择一个日期
                driverName: '',
                driverFocus: false,
                driverId: '',
                carName: '',
                carFocus: false,
                carId: '',
                showConflict: false,
                shuttleType: '',
                conflictDataArr: {},
                carList: [], // 所有的车辆列表
                driverList: [], // 所有的司机列表
                selectDriver: {}, // 选择的司机
                selectCar: {}, // 选择的车辆
                busTypes: [], // 车辆类型列表
                nowaday: new Date().getTime(), // 线路车辆类型价格列表
            }
        },
        props: ['lines'],
        methods: {
            // 重置线路日期发车时刻数据
            resetData() {
                this.dateArr = [];
                this.busTimeObj = {};
                this.currentDate = '';
                this.selectBusTimeArr = [];
            },
            selectLines: function (id) {
                if (this.selectBusTimeArr.length) {
                    layer.msg("当前有选择发车时刻，不能切换线路");
                    return;
                }
                this.resetData();
                this.selectedLineId = id;
                this.getLinesDates();
                this.getLinesTimes();
                this.dateColor();
            },
            // 根据班车日期选择当天的发车时刻
            setBusDate() {
                this.dateBusTimeArr = this.busTimeObj[this.currentDate] || [];
            },
            // 选择发车时刻
            setBusTime: function (item) {
                let index = this.selectBusTimeArr.findIndex(id => id === item.busdate_id);
                if (index > -1) {
                    this.selectBusTimeArr.splice(index, 1);
                } else {
                    this.selectBusTimeArr.push(item.busdate_id);
                }
            },
            init: function () {
                // 获取系统时间
                this.getSystemTime();
                // 获取所有信息列表
                this.getInfos();
            },
            selectedDriver: function (data, index) {
                if (data) {
                    this.selectDriver = data;
                } else {
                    this.selectDriver = {};
                }
            },
            selectedCar: function (data, index) {
                if (data) {
                    this.selectCar = data;
                } else {
                    this.selectCar = {}
                }
            },
            // 获取线路的日期
            getInfos: function () {
                $.ajax({
                    url: base.gAjaxUrl.ferryBusDispatch + 'check_driver_vehicle/',
                    type: "GET",
                    data: {
                        page: 1,
                        page_size: 999999,
                    }
                }).always((data) => {
                    base.ajaxCallback(data, () => {
                        this.carList = data.vehicle;
                        this.driverList = data.drivers;
                    })
                })
            },
            close: function () {
                this.$dispatch("dialog-close");
            },
            dateColor: function () {
                let dateArr = $('#busCalendar .k-in-month');
                // console.log(dateArr)
                let that = this;
                dateArr.each(function () {
                    let thisDate = $(this).attr('data-date');
                    //console.log(thisDate)
                    let thisTimeStamp = moment(thisDate + ' 23:59:59').format('x') * 1;
                    // 只显示已经设置过的班车日期 - 可以选择
                    if (thisTimeStamp > that.nowaday && that.dateArr.indexOf(thisDate) > -1) {
                        $(this).removeClass().addClass("k-in-month k-active");
                        if (that.currentDate === thisDate) $(this).addClass('k-selected')
                    } else {
                        $(this).removeClass().addClass('k-in-month');
                    }
                })
            },
            saveDispatch: function () {
                if (!this.selectDriver.id) {
                    layer.msg("请选择司机", {icon: 2, time: 1500});
                    return;
                }
                if (!this.selectCar.id) {
                    layer.msg("请选择车辆", {icon: 2, time: 1500});
                    return;
                }
                if (this.selectBusTimeArr.length === 0) {
                    layer.msg("请选择发车时间", {icon: 2, time: 1500});
                    return;
                }
                this.checkConflict();
            },
            checkConflict: function () {
                if (this.loading) return;
                let that = this;
                this.loading = true;
                $.ajax({
                    url: base.gAjaxUrl.ferryBusDispatch + 'dispatch_validate/',
                    type: "POST",
                    contentType: 'application/json',
                    data: JSON.stringify({
                        shuttle_bus_dates: that.selectBusTimeArr,
                        driver_vehicles: [{
                            vehicle: this.selectCar.id,
                            driver: this.selectDriver.id,
                        }]
                    })
                }).always((data) => {
                    that.loading = false;
                    base.ajaxCallback(data, () => {
                        if (data.driver.length || data.vehicle.length) {
                            that.showConflict = true;
                            that.conflictDataArr = data;
                        } else {
                            that.save();
                        }
                    })
                })
            },
            cancelCover: function () {
                this.showConflict = false;
            },
            confirmCover: function () {
                this.showConflict = false;
                this.save();
            },
            save: function () {

                $.showLoading();

                $.ajax({
                    url: base.gAjaxUrl.ferryBusDispatch + 'bulk_set/',
                    type: "POST",
                    contentType: 'application/json',
                    data: JSON.stringify({
                        shuttle_bus_dates: this.selectBusTimeArr,
                        driver_vehicles: [{
                            vehicle: this.selectCar.id,
                            driver: this.selectDriver.id,
                        }],
                    })
                }).always((data) => {
                    $.hideLoading();
                    base.ajaxCallback(data, () => {
                        this.$dispatch("dialog-save")
                    });
                });
            },
            //获取当前线路的已排班发车时刻
            getLinesTimes: function () {
                if (!this.selectedLineId) return;
                $.ajax({
                    url: `${base.gAjaxUrl.ferryBusLines}${this.selectedLineId}/datetimes/`,
                    type: 'GET',
                }).always((data) => {
                    base.ajaxCallback(data, () => {
                        this.busTimeObj = data;
                    })
                });
            },
            getLinesDates: function () {
                if (!this.selectedLineId) return;
                $.ajax({
                    url: `${base.gAjaxUrl.ferryBusLines}${this.selectedLineId}/dates/`,
                    type: 'GET',
                }).always((data) => {
                    base.ajaxCallback(data, () => {
                        this.dateArr = data.map(item => item.departure_date);
                        this.$nextTick(() => {
                            this.dateColor();
                        });
                    })
                });
            },
            initCalendar: function () {
                let that = this;
                this.calendar = new Kalendae({
                    attachTo: document.getElementById('busCalendar'),
                    months: 1,
                    mode: 'multiple',
                    subscribe: {
                        'date-clicked': function (date) {
                            let todayTimeStamp = new Date($('.k-today').attr('data-date')).getTime();
                            if (!that.selectedLineId) {
                                layer.msg('请先选择线路', {icon: 2, time: 1000});
                                return false;
                            }
                            if (!that.dateArr.length) {
                                layer.msg('请先设置线路班车日期', {icon: 2, time: 1000});
                                return false;
                            }
                            that.currentDate = date._i;
                            that.setBusDate();
                            setTimeout(function () {
                                that.dateColor();
                            });
                            return false;
//                        }

                        },
                        "view-changed": function (date) {
                            setTimeout(function () {
                                that.dateColor();
                            })
                        }
                    }

                });
            },
            // 获取服务器的系统时间 用于做是否过期的判断
            getSystemTime: function () {
                $.ajax({
                    url: base.gAjaxUrl.time,
                    type: 'GET',
                }).always((data) => {
                    if (data && data.full) this.nowaday = moment(data.full).format('x');
                    this.dateColor();
                })
            },
        },
        filters: {},
        components: {
            sel, cover
        }
    }
</script>
<style lang="less" rel="stylesheet/less" scoped>

    .selected_content {
        height: 120px;
        border-radius: 4px;
        border: 1px solid #ccc;
        box-sizing: border-box;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 10px 15px 15px;

        .select_item {
            padding: 0 8px;
            line-height: 30px;
            background-color: #fff;
            border: 1px solid #ccc;
            margin-top: 10px;
            margin-left: 10px;
            border-radius: 5px;
            position: relative;

            &.selected {
                background-color: #5a98de;
                color: #fff;
                border-color: #5a98de;
            }

            .delete_btn {
                cursor: pointer;
                position: absolute;
                right: 0;
                top: 0;
                width: 30px;
                height: 30px;
                text-align: center;
                font-size: 20px;
                line-height: 25px;
                vertical-align: middle;
            }
        }
    }

    #diver {
        width: 300px;
        height: 34px;
    }

    #car {
        width: 300px;
        height: 34px;
    }

    .diver {
        width: 300px;
    }

    .line_box {
        width: 90%;
        height: 450px;
        border: 1px solid #ccc;
        background-color: #fff;
        overflow: auto;

        .line_item {
            height: 40px;
            width: 270px;
            padding: 0 15px;
            line-height: 38px;
            margin: 15px auto;
            position: relative;
            background-color: #e1e1e1;
            border: 1px solid #e1e1e1;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;

            &.selected {
                color: #fff;
                background-color: orange;
                border-color: orange;
            }

        }
    }

    .layui-layer-page.bus-dispatch {
        width: 1100px;
        min-height: 450px;
        max-height: 650px;

        .dispatch_content {
            padding: 0;
            padding-bottom: 20px;

            .right_box {
                padding: 0 20px;
                box-sizing: border-box;
            }
        }

        .shuttleType {
            width: 100%;
            height: 31px;
        }
    }

    .calendar {
        display: inline-block;
    }

    .content-box {
        width: 100%;
        padding: 70px 50px 0 100px;

        .calendar {
            display: inline-block;
            width: 200px;
            float: left;
        }

        .dispatch-box {
            display: inline-block;
            width: 49%;
            float: right;

        }
    }

    .driver, .car {
        width: 200px;
        margin-bottom: 30px;
    }

    .driver {
        margin-top: 50px;
    }

</style>
