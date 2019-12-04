<template>
    <cover v-if="showConflict" :data="conflictDataArr" @cancel-cover="cancelCover"
           @confirm-cover="confirmCover"></cover>
    <div class="layui-layer layui-anim layui-layer-page layui-modify bus-dispatch">
        <div class="layui-layer-title">{{type == 'add' ? '设置' : '修改'}}巴士班次</div>
        <div class="layui-layer-content dispatch_content">
            <div class="row clearfix layer_content">
                <div class="f-l col-4">
                    <div class="row clearfix">
                        <div class="f-l col-4 text-r lh-30">班次名称:&nbsp;&nbsp;</div>
                        <div class="f-l col-8">
                            <sel :arr="lines" :key="'shuttle_name'" :name="lineName" v-on:sel="selectedLine"></sel>
                        </div>
                    </div>
                    <div class="row clearfix">
                        <div class="f-l col-4 text-r lh-30">去/返程:&nbsp;&nbsp;</div>
                        <div class="f-l col-8">
                            <select name="" class="select shuttleType" @change="setDirection" v-model="shuttleType">
                                <option value="">全部</option>
                                <option value="-10">去程</option>
                                <option value="10">返程</option>
                            </select>
                        </div>
                    </div>
                    <div class="row clearfix">
                        <div class="f-l col-4 text-r lh-30">班次时间:&nbsp;&nbsp;</div>
                        <div class="f-l col-8">
                            <select id="busTime" name="" class="select shuttleType" v-model="bus_time"
                                    @change="getDispatchDates">
                                <option value="">请选择班次</option>
                                <option :value="data.id" v-for="data in bus_times">
                                    {{data.departure_time}}
                                    {{shuttleType == '' ? data.shuttle_type == '-10' ? '(去程)' : '(返程)' : ''}}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="row clearfix">
                        <div class="f-l col-4 text-r lh-30"></div>
                        <div class="f-l col-8">
                            <div class="calendar">
                                <h5 class="text-l ml-30">请选择发车日期</h5>
                                <p class="fc-999 fs-12">提示:只能操作已设置的班车的日期</p>
                                <div class="pointer btn radius" :class="{'btn-secondary': isCheckAll}"
                                     @click="checkAll">选择全部
                                </div>
                                <div id="busCalendar"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="f-l col-8">
                    <div class="row clearfix">
                        <div class="f-l text-r lh-30 col-offset-1">请选择司机车辆</div>
                        <div class="f-l">
                            <a href="javascript:;" class="btn btn-primary ml-10 radius" @click="addDispatch">添加司机车辆</a>
                        </div>
                    </div>
                    <div class="row clearfix">
                        <!--<div class="f-l col-10 text-r lh-30 col-offset-1">-->
                        <div class="right_box">
                            <div class="f-l col-12 text-r lh-30">
                                <table class="table table-border table-bordered table-hover table-bg">
                                    <thead>
                                    <tr class="text-c">
                                        <th width="80">车辆类型</th>
                                        <th width="60">车牌号码</th>
                                        <th width="60">司机</th>
                                        <!--<th width="60">座位数</th>-->
                                        <th width="60">价格(元)</th>
                                        <th width="30">操作</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="(index, item) in busPriceList">
                                        <td>
                                            <sel :arr="busTypes" :key="'type_name'" :name="item.car_type.type_name"
                                                 :index="index" v-on:sel="selectedType"></sel>
                                        </td>
                                        <td>
                                            <sel :arr="getInTypeCar(item)" :key="'car_no'" :name="item.car.car_no"
                                                 :index="index" v-on:sel="selectedCar"></sel>
                                        </td>
                                        <td>
                                            <sel :arr="driverList" :key="'staff__real_name'"
                                                 :name="item.driver.staff__real_name"
                                                 :index="index" v-on:sel="selectedDriver"></sel>
                                        </td>
                                        <!--<td>{{'dispatch.driver_name' || '&#45;&#45;'}}</td>-->
                                        <td class="text-c">{{item.car_type | getPrice}}</td>
                                        <td class="text-c">
                                            <a title="删除" href="javascript:;" style="display: inline-block" class="ml-5"
                                               v-on:click="deleteItem(index)">
                                                <i class="Hui-iconfont">&#xe6e2;</i>
                                            </a>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <a href="javascript:;" class="btn radius btn-primary f-r mt-10 mr-20" @click="saveDispatch(0)">保存</a>
            <a v-if="!busPriceList.length" href="javascript:;" class="btn radius btn-danger f-r mt-10 mr-20" @click="saveDispatch(1)">不排班</a>
        </div>
        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
    </div>
    <div class="m-loading" v-if="loading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import moment from "moment";
    import cover from '../components/dispatchCover';
    import sel from '../components/selectedInput.vue';

    export default{
        ready(){

            this.initValidate();
            base.verticalCenter('.layui-modify');
            this.init();
            if(this.type == 'modify') {
                this.setDispatchData();
            }
        },
        data: function () {
            return {
                loading: false,
                showDirection: false,
                showBusDates: false,
                dateArr: [],
                lineName: '', // 选择的线路名称
                bus_time: '',
                bus_times: [],
                currentLine: '',
                selectedDateArr: [],
                selectedLineItem: null, // 选择的线路对象
                driverName: '',
                driverFocus: false,
                driverId: '',
                carName: '',
                carFocus: false,
                carId: '',
                showConflict: false,
                isCheckAll: false,
                shuttleType: '',
                dispatchData: {},
                dateIdArr: [],
                conflictDataArr: {},
                carList: [], // 所有的车辆列表
                driverList: [], // 所有的司机列表
                busTypes: [], // 车辆类型列表
                lineprice: [], // 线路车辆类型价格列表
                busPriceList: [], // 线路车辆类型价格列表
            }
        },
        props: ['lines', 'data', 'type'],
        methods: {
            setDispatchData: function () {
                // 设置车辆信息
                let arr = [];
                this.data.dispatch_set.forEach((item) => {
                    arr.push({
                        car_type: {
                            type_name: item.vehicle_vo.car_type_vo.type_name,
                            id: item.vehicle_vo.car_type_vo.id
                        },
                        car: {
                            car_no: item.car_no,
                            id: item.vehicle
                        },
                        driver: {
                            staff__real_name: item.driver_name,
                            id: item.driver
                        }
                    })
                });
                this.busPriceList = arr;
                this.selectedLineItem = {
                    id: this.data.shuttle_bus,
                    shuttle_name: this.data.shuttle_name,
                };
                this.lineName = this.data.shuttle_name;
                this.shuttleType = this.data.shuttle_type;
                this.bus_times = [{
                    departure_time: this.data.departure_time,
                    id: this.data.shuttle_bus_time,
                    shuttleType: this.shuttleType
                }];
                this.bus_time = this.data.shuttle_bus_time;
                this.getDispatchDates();
            },
            init: function () {
                // 获取所有信息列表
                this.getInfos();
            },
            deleteItem: function (index) {
                this.busPriceList.splice(index, 1);
            },
            addDispatch: function () {
                this.busPriceList.push({
                    car_type: {
                        type_name: '',
                        id: ''
                    },
                    car: {
                        car_no: '',
                        id: ''
                    },
                    driver: {
                        staff__real_name: '',
                        id: ''
                    }
                });
            },
            selectedType: function (data, index) {
                if (data) {
                    if (this.busPriceList[index].car_type.id != data.id) {
                        this.busPriceList[index].car_type = data;
                    }
                } else {
                    this.busPriceList[index].car_type = {
                        type_name: '',
                        id: ''
                    }
                }
            },
            selectedCar: function (data, index) {
                if (data) {
                    if (this.busPriceList[index].car.id != data.id) {
                        if (this.isInList(data, 'car')) {
                            layer.msg("当前车辆已被选择", {icon: 2, time: 2000});
                            this.busPriceList[index].car = {
                                car_no: '',
                                id: ''
                            };
                            console.log(this.busPriceList[index].car);
                        } else {
                            this.busPriceList[index].car = data;
                            // 选择车辆的时候，将该车辆的车辆类型也一起更改掉
                            this.busPriceList[index].car_type = {
                                type_name: data.car_type__type_name,
                                id: data.car_type
                            }
                        }
                    }
                }
            },
            selectedDriver: function (data, index) {
                if (data) {
                    if (this.busPriceList[index].driver.id != data.id) {
                        if (this.isInList(data, 'driver')) {
                            layer.msg("当前司机已被选择", {icon: 2, time: 2000});
                            this.busPriceList[index].driver = {
                                staff__real_name: '',
                                id: ''
                            };
                        } else {
                            this.busPriceList[index].driver = data;
                        }
                    }
                }
            },
            isInList: function (data, type) {
                for (let i = 0, len = this.busPriceList.length; i < len; i++) {
                    let item = this.busPriceList[i];
                    if (item[type].id == data.id) return true
                }
                return false
            },
            selectedLine: function (item) { // isSave 是否点击的线路
                if (item) {
                    if (!this.selectedLineItem || this.selectedLineItem.id != item.id) {
                        this.selectedLineItem = item;
                        this.getBusTimes();
                    }
                } else {
                    this.selectedLineItem = null;
                    this.bus_times = [];
                    layer.msg('未正确选择线路', {icon: 2, time: 1500})
                }
            },
            // 获取线路、所有车辆、所有司机、所有车辆类型、所有价格列表
            getInfos: function () {
                $.ajax({
                    url: base.gAjaxUrl.busDispatchList + 'check_driver_vehicle/',
                    type: "GET",
                    data: {
                        page: 1,
                        page_size: 999999,
                    }
                }).always((data)=> {
                    base.ajaxCallback(data, () => {
//                        this.lines = data.shuttlebus; // 线路列表不用
                        this.busTypes = data.car_type;
                        this.carList = data.vehicle;
                        this.lineprice = data.lineprice;
                        this.driverList = data.drivers;
                    })
                })
            },
            setDirection: function () {
                this.bus_time = '';
                this.showBusDates = true;
                this.getBusTimes();
            },
            close: function () {
                this.$dispatch("dialog-close")
            },
            dateColor: function () {
                let dateArr = $('#busCalendar .k-in-month');
                let that = this;
                dateArr.each(function () {
                    let thisDate = $(this).attr('data-date');
                    let thisTimeStamp = new Date(thisDate).getTime();
                    //过期的状态颜色  这里渲染的只是服务器返回的已经设置过的日期
                    if (thisTimeStamp + 86400000 < that.nowaday || that.dateArr.indexOf(thisDate) == -1) {
                        $(this).removeClass().addClass("k-in-month");
                    } else if (that.dateArr.indexOf(thisDate) != -1) {
                        $(this).addClass("k-in-month k-active");
                    }

                    if (that.selectedDateArr.indexOf(thisDate) != -1 && that.dateArr.indexOf(thisDate) != -1) {
                        $(this).addClass('k-selected cache')
                    } else {
                        $(this).removeClass('k-selected cache');
                    }
                })
            },
            saveDispatch: function (allowNull=false) {
                if (!this.selectedLineItem) {
                    layer.msg("该线路不存在", {icon: 2, time: 1500});
                    return;
                }
                if (this.bus_time == '') {
                    layer.msg("请选择去/返程与班车班次", {icon: 2, time: 1500});
                    return;
                }
                if (this.selectedDateArr.length == 0) {
                    layer.msg("请选择发车日期", {icon: 2, time: 1500});
                    return;
                }
                //
                if (this.busPriceList.length == 0 && !allowNull) {
                    layer.msg("请先添加需要安排的车辆", {icon: 2, time: 1500});
                    return;
                }
                let arr = [];
                for(let i = 0, len = this.busPriceList.length; i < len;i++) {
                    let item = this.busPriceList[i];
                    if(item.car.id && item.driver.id) {
                        arr.push(item);
                    }
                }
                if(arr.length < this.busPriceList.length) {
                    layer.msg("请选择司机车辆", {icon: 2, time: 1500});
                    return
                }
                if(this.checkRepeat(arr)) {
                    layer.msg("司机车辆不能重复", {icon: 2, time: 1500});
                    return;
                }
                if(allowNull){
                    layer.confirm("确定当前班次不安排任何车辆吗?",()=>{
                        this.checkConflict();
                        layer.closeAll();
                    })
                }else{
                    this.checkConflict();
                }
            },
            checkRepeat: function (arr) {
                for(let i = 0, len = arr.length; i < len; i++) {
                    let item = arr[i];
                    let ar1 = arr.slice(i + 1, arr.length);
                    if(this.checkRepeatCar(item.car, ar1) || this.checkRepeatDriver(item.driver, ar1)) {
                        return true
                    }
                }
                return false
            },
            checkRepeatCar: function (item, arr) {
                arr = arr || [];
                for(let i = 0, len = arr.length; i < len; i++) {
                    if(item.id == arr[i].car.id) {
                        return true
                    }
                }
                return false
            },
            checkRepeatDriver: function (item, arr) {
                arr = arr || [];
                for(let i = 0, len = arr.length; i < len; i++) {
                    if(item.id == arr[i].driver.id) {
                        return true
                    }
                }
                return false
            },
            cancelCover: function () {
                this.showConflict = false;
            },
            confirmCover: function () {
                this.showConflict = false;
                this.save();
            },
            checkAll: function () {
                let that = this;
                this.isCheckAll = !this.isCheckAll;
                if (this.isCheckAll) {
                    $("#busCalendar .k-active").each(function (index, value) {
                        if (that.selectedDateArr.indexOf($(this).attr('data-date')) == -1) {
                            that.selectedDateArr.push($(this).attr('data-date'));
                        }
                    })
                } else {
                    $("#busCalendar .k-active").each(function (index, value) {
                        let delIndex = that.selectedDateArr.indexOf($(this).attr('data-date'));
                        that.selectedDateArr.splice(delIndex, 1);
                    })
                }
                that.dateColor();
            },
            save: function () {
                if (this.loading) return;
                let that = this;
                this.loading = true;

                let dateIdArr = [];
                for (let i = 0, len = this.selectedDateArr.length; i < len; i++) {
                    dateIdArr.push(this.dispatchData[this.selectedDateArr[i]]);
                }
                let arr = [];
                for (let i = 0, len = this.busPriceList.length; i < len; i++) {
                    let item = this.busPriceList[i];
                    if(item.car.id && item.driver.id) {
                        arr.push({
                            vehicle: item.car.id,
                            driver: item.driver.id,
                        });
                    }
                }
                $.ajax({
                    url: base.gAjaxUrl.addBusDispatchDate,
                    type: "POST",
                    contentType: 'application/json',
                    data: JSON.stringify({
                        shuttle_bus_dates: dateIdArr,
                        driver_vehicles: arr,
                    })
                }).always((data)=> {
                    that.loading = false;
                    base.ajaxCallback(data, function () {
                        that.$dispatch("dialog-save")
                    })
                })
            },
            getBusTimes: function () {
                if (!this.selectedLineItem) {
                    layer.msg("请先选择正确的线路", {icon: 2, time: 1500});
                    return;
                }
                let busIdData = this.selectedLineItem.id;
                if (busIdData) {
                    $.ajax({
                        url: `${base.gAjaxUrl.linebustime}${busIdData}/bus_time/`,
                        type: 'GET',
                        data: {shuttle_type: this.shuttleType},
                    }).always((data)=> {
                        base.ajaxCallback(data, () => {
                            this.bus_times = data;
                        })
                    });
                }
            },
            getDispatchDates: function () {
                let that = this;
                that.dateArr = [];
                that.dispatchData = {};
                that.selectedDateArr = [];
                that.isCheckAll = false;
                if (this.bus_time != '') {
                    $.ajax({
                        url: `${base.gAjaxUrl.linebustime}${that.selectedLineItem.id}/dispatch_dates/`,
                        type: "GET",
                        data: {
                            bus_time: that.bus_time,
                        }
                    }).always((data)=> {
                        base.ajaxCallback(data, function () {
                            for (var i = 0, len = data.length; i < len; i++) {
                                that.dateArr.push(data[i].departure_date);
                                that.dispatchData[data[i].departure_date] = data[i].id;
                            }
                            that.dateColor();
                        })
                    })
                }
            },
            initValidate: function () {
                let that = this;
                this.calendar = new Kalendae({
                    attachTo: document.getElementById('busCalendar'),
                    months: 1,
                    mode: 'multiple',
//                direction: 'today-future', 不添加这个属性,就显示上月下月,去年明年的按钮
                    subscribe: {
                        'date-clicked': function (date) {
                            let todayTimeStamp = new Date($('.k-today').attr('data-date')).getTime();
                            let currentDate = date._i;
//                        let currentTimeStamp = new Date(currentDate).getTime();
                            // 先选择时间才可以点击去程或返程的时间
                            if (that.bus_time == "") {
                                layer.msg('请先选择发车时间！', {icon: 2, time: 1000});
                                return false;
                            }
                            if (that.selectedDateArr.indexOf(currentDate) != -1) {
                                that.selectedDateArr.splice(that.selectedDateArr.indexOf(currentDate), 1);
                            } else {
                                that.selectedDateArr.push(currentDate);
                            }
                            setTimeout(function () {
                                that.dateColor();
                            }, 0)
                            return false;
//                        }

                        },
                        "view-changed": function (date) {
                            that.isCheckAll = false;
                            if (that.bus_time) {
                                setTimeout(function () {
                                    that.dateColor();
                                }, 0)
                            }
                        }
                    }

                },);
            },
            checkConflict: function () {
                if (this.loading) return;
                let that = this;
                this.loading = true;
                that.dateIdArr = [];
                for (let i = 0, len = that.selectedDateArr.length; i < len; i++) {
                    that.dateIdArr.push(that.dispatchData[that.selectedDateArr[i]]);
                }
                let arr = [];
                for (let i = 0, len = this.busPriceList.length; i < len; i++) {
                    let item = this.busPriceList[i];
                    arr.push({
                        vehicle: item.car.id,
                        driver: item.driver.id,
                    });
                }
                $.ajax({
                    url: base.gAjaxUrl.busDispatchList + 'dispatch_validate/',
                    type: "POST",
                    contentType: 'application/json',
                    data: JSON.stringify({
                        shuttle_bus_dates: that.dateIdArr,
                        driver_vehicles: arr
                    })
                }).always((data)=> {
                    that.loading = false;
                    base.ajaxCallback(data, () => {
                        if (data.driver.length != 0 || data.vehicle.length != 0) {
                            that.showConflict = true;
                            that.conflictDataArr = data;
                        } else {
                            that.save();
                        }
                    })
                })
            },
            // 获取选择的发车时间的 bus_time 对象
            getSelectedBusTime: function () {
                for (let i = 0, len = this.bus_times.length; i < len; i++) {
                    let item = this.bus_times[i];
                    if (item.id == this.bus_time) return item
                }
                return null
            },
            getInTypeCar: function (item) {
                let id = item.car_type.id;
                if(id == '') return this.carList;
                let arr = [];
                for(let i = 0 , len = this.carList.length; i < len;i++) {
                    let item = this.carList[i];
                    if(id == item.car_type) arr.push(item);
                }
                return arr;
            },
        },
        filters: {
            getPrice: function (type) {
                let str = '--';
                let bus_time = this.getSelectedBusTime();
                if (bus_time && this.selectedLineItem && this.selectedLineItem.id && this.lineprice.length) {
                    this.lineprice.every((item) => {
                        if (item.shuttle_bus == this.selectedLineItem.id && item.car_type == type.id) {
                            str = item[bus_time.shuttle_type == '10' ? 'back_price' : 'to_price'];
                            str = Math.round(str / 100);
                            return false
                        }
                        return true
                    })
                }
                return str
            }
        },
        components: {
            cover, sel
        }
    }
</script>
<style lang="less" rel="stylesheet/less" scoped>
    .bus-dispatch {
        width: 1100px;
        min-height: 450px;
        max-height: 600px;
        .dispatch_content {
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

    .line-box {
        width: 200px;
        height: 31px;
    }

    #busCalendar {
        /*margin-top: 30px;*/
    }

    .input-box {
        width: 150px;
        display: inline-block;
    }
</style>