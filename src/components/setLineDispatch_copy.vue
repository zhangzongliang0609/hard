<template>
    <cover v-if="showConflict" :data="conflictDataArr" @cancel-cover="cancelCover" @confirm-cover="confirmCover"></cover>
    <div class="layui-layer layui-anim layui-layer-page layui-modify bus-dispatch">
        <h3 class="layui-layer-title">设置巴士班次</h3>
            <div class="filtrate">
                &nbsp;线路名称: &nbsp;
                <div class="line-box">
                    <div class="department_select_container" @mouseleave="inputEnter('line',false)" @mouseenter="inputEnter(true)">
                        <input v-if="line.length === 0" disabled type="text" class="input-text" value="无可选择线路">
                        <input v-else autocomplete="off" @click="inputClick('line')" v-model="lineName" type="text" class="input-text" value="" placeholder="">
                        <i v-show="lineName !== ''" class="empty-icon Hui-iconfont" @click="emptySearch('line')">&#xe60b;</i>
                        <div class="departmentListBox" style="display: none">
                            <div v-bind:title="item.shuttle_name" v-for="item in line | filterBy lineName in 'shuttle_name'" @click="setValue('line',item)" class="departmentListItem">{{item.shuttle_name}}</div>
                        </div>
                    </div>
                </div>
                <div>
                    去/返程:
                    <select name="" class="select"  @change="setDirection" v-model="shuttleType">
                        <option v-show="!showBusDates" value="">请选择去/返程</option>
                        <option value="-10">去程</option>
                        <option value="10">返程</option>
                    </select>
                </div>
                <div v-show="showBusDates">
                    巴士班次: &nbsp;
                    <select id="busTime" name="" class="select" v-model="bus_time" @change="getDispatchDates">
                        <option value="">请选择班次</option>
                        <option :value="data.id" v-for="data in bus_times">{{data.departure_time}}</option>
                    </select>
                </div>
            </div>
        <div class="content-box cl">
            <div  class="calendar">
                <h5 class="text-l ml-30">请选择发车日期</h5>
                <p class="fc-999 fs-12">提示:只能操作已设置的班车的日期~</p>
                <div>
                    全选<input id="checkAll" type="checkbox" class="checkbox ml-10" @click="checkAll" :checked="isCheckAll">
                </div>
                <div id="busCalendar"></div>
            </div>
            <div class="dispatch-box">
                <h5 class="f-l">请选择司机与车辆</h5>
                       <div class="driver">
                           司机:&nbsp;
                           <div class="input-box">
                               <div class="department_select_container" @mouseleave="inputEnter('driver',false)" @mouseenter="inputEnter(true)">
                                   <input v-if="lineItem.length === 0" disabled type="text" class="input-text" value="无可选择线路">
                                   <input v-else autocomplete="off" @click="inputClick('driver')" v-model="driverName" type="text" class="input-text" value="" placeholder="">
                                   <i v-show="driverName !== ''" class="empty-icon Hui-iconfont" @click="emptySearch('driver')">&#xe60b;</i>
                                   <div class="departmentListBox" style="display: none">
                                       <div v-bind:title="item.staff_vo.real_name" v-for="item in driverList | filterBy driverName in 'staff_vo.real_name'" @click="setValue('driver',item)" class="departmentListItem">{{item.staff_vo.real_name}}</div>
                                   </div>
                               </div>
                           </div>
                       </div>
                       <div class="car">
                           车辆:&nbsp;
                           <div class="input-box">
                           <div class="department_select_container" @mouseleave="inputEnter('car',false)" @mouseenter="inputEnter(true)">
                               <input v-if="lineItem.length === 0" disabled type="text" class="input-text" value="无可选择线路">
                               <input v-else autocomplete="off" @click="inputClick('car')" v-model="carName" type="text" class="input-text" value="" placeholder="">
                               <i v-show="carName !== ''" class="empty-icon Hui-iconfont" @click="emptySearch('car')">&#xe60b;</i>
                               <div class="departmentListBox" style="display: none">
                                   <div v-bind:title="item.car_no" v-for="item in carNumberList | filterBy carName in 'car_no'" @click="setValue('car',item)" class="departmentListItem">{{item.car_no}}</div>
                               </div>
                           </div>
                           </div>
                       </div>
                       <div class="action-time">
                           开始打卡时间:&nbsp;
                           <input v-model="actionTime" type="text" class="input-text" id="actionTime" value="00:00"/>
                       </div>
            </div>
        </div>
        <a href="javascript:;" class="btn radius btn-primary f-r mt-10 mr-20" @click="getValue">保存</a>
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
<style lang="less" rel="stylesheet/less" scoped>
    .bus-dispatch{
        height:500px;
    }
    .filtrate{
        margin-top:20px;
    }
    .filtrate select{
        width: 150px;
        height: 31px;
        margin-right: 10px;
    }
    .filtrate>div{
        display: inline-block;
    }
    .calendar{
        display: inline-block;
    }
    .content-box{
        width: 100%;
        padding:70px 50px 0 100px;
        .calendar{
            display: inline-block;
            width: 200px;
            float:left;
        }
        .dispatch-box{
            display: inline-block;
            width:49%;
            float:right;

        }
    }
    .driver, .car{
        width: 200px;
        margin-bottom: 30px;
    }
    .driver{
        margin-top: 50px;
    }

    .line-box{
        width: 200px;
        height: 31px;
    }
    #busCalendar{
        /*margin-top: 30px;*/
    }
    #actionTime{
        width:95px;
    }
    .input-box{
        width: 150px;
        display: inline-block;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import moment from "moment";
    import cover from '../components/dispatchCover'
    export default{
        ready(){
            let that = this;
            $('#actionTime').datetimepicker({
                datepicker:false,
                format:'H:i',
                step:5
            });
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
                                that.selectedDateArr.splice(that.selectedDateArr.indexOf(currentDate),1);
                            } else {
                                that.selectedDateArr.push(currentDate);
                            }
                            setTimeout(function () {
                                that.dateColor();
                            },0)
                            return false;
//                        }

                    },
                    "view-changed":function (date) {
                        that.isCheckAll = false;
                        if(that.bus_time){
                            setTimeout(function () {
                                that.dateColor();
                            },0)
                        }

                    }
                }

            },);
            this.getCarNumberList();
            this.getDriverList();
            base.verticalCenter('.layui-modify');
        },
        data:function () {
            return{
                loading:false,
                showDirection:false,
                showBusDates:false,
                dateArr:[],
                bus_time:'',
                bus_times:[],
                currentLine:'',
                selectedDateArr:[],
                lineName:'',
                lineFocus:false,
                lineId:'',
                driverName:'',
                driverFocus:false,
                driverId:'',
                carName:'',
                carFocus:false,
                carId:'',
                lineItem:["1"],
                actionTime:'',
                showConflict:false,
                isCheckAll:false,
                shuttleType:'',
                dispatchData:{},
                dateIdArr:[],
                conflictDataArr:{},
                carNumberList:[],
                driverList:[],
            }
        },
        props:['line'],
        methods:{
            getCarNumberList:function () {
                let that = this;
                that.carNumberList = [];
                $.ajax({
                    url:base.gAjaxUrl.shuttlebusvehicles,
                    type:"GET",
                    data:{
                        page_size:999999,
                        locked:0,
                    }
                }).always((data)=>{
                    base.ajaxCallback(data,function () {
                        let dataArr = data.results;
                        // 被锁定的车不能再调度线路,所以在这里过滤掉
                        for (let i = 0,len =dataArr.length ;i < len; i++) {
                            if(!dataArr[i].locked){
                                that.carNumberList.push(dataArr[i])
                            }
                        }
                    })
                })
            },
            getDriverList:function () {
                let that = this;
                $.ajax({
                    url:base.gAjaxUrl.shuttlebusdrivers,
                    type:"GET",
                    data:{
                        page:1,
                        page_size:999999,
                    }
                }).always((data)=>{
                    base.ajaxCallback(data,function(){
                        that.driverList = data.results;
                    })
                })
            },
            setDirection:function () {
                let that = this;
                this.bus_time = '';
                this.showBusDates = true;
                this.get_bus_time();
            },
            close:function () {
                this.$dispatch("dialog-close")
            },
            dateColor: function () {
                let dateArr = $('#busCalendar .k-in-month');
                let that = this;
                dateArr.each(function () {
                    let thisDate = $(this).attr('data-date');
                    let thisTimeStamp = new Date(thisDate).getTime();
                    //过期的状态颜色  这里渲染的只是服务器返回的已经设置过的日期
                    if (thisTimeStamp + 86400000 < that.nowaday || that.dateArr.indexOf(thisDate) == -1 ) {
                                $(this).removeClass().addClass("k-in-month");
                    }else if(that.dateArr.indexOf(thisDate) != -1 ){
                        $(this).addClass("k-in-month k-active");
                    }

                    if (that.selectedDateArr.indexOf(thisDate) != -1 && that.dateArr.indexOf(thisDate) != -1 ) {
                                $(this).addClass('k-selected cache')
                    } else {
                                $(this).removeClass('k-selected cache');
                    }
                })
            },
            inputEnter: function (type,flag) {
                if(type == 'line'){
                    this.lineFocus = flag;
                    !flag && $(".line-box .departmentListBox").hide();
                }else if(type == 'driver'){
                    this.driverFocus = flag;
                    !flag && $(".driver .departmentListBox").hide();
                }else if(type == 'car'){
                    this.carFocus = flag;
                    !flag && $(".car .departmentListBox").hide();
                }
            },
            inputClick: function (type) {
                if(type == 'line'){
                    $(".line-box .departmentListBox").show();
                }else if(type == 'driver'){
                    $(".driver .departmentListBox").show();
                }else if(type == 'car'){
                    $(".car .departmentListBox").show();
                }
            },
            // 清除搜索输入框
            emptySearch:function(type){
                if(type == 'line'){
                    this.lineName= '';
                    $(".line-box .departmentListBox").show();
                }else if(type == 'driver'){
                    this.driverName=  '';
                    $(".driver .departmentListBox").show();
                }else if(type == 'car'){
                    this.carName= '';
                    $(".car .departmentListBox").show();
                }
            },
            setValue: function (type,item) {
                if(type == 'line'){
                    this.lineName= item.shuttle_name;
                    this.lineId = item.id;
                    $(".line-box .departmentListBox").hide();
                    this.get_bus_time();
                    this.bus_time = '';
                }else if(type == 'driver'){
                    this.driverName= item.staff_vo.real_name;
                    this.driverId = item.id;
                    $(".driver .departmentListBox").hide();
                }else if(type == 'car'){
                    this.carName= item.car_no;
                    this.carId = item.id;
                     $(".car .departmentListBox").hide();
                }
            },
            getValue: function () {
                let currentDriver = {};
                let currentCar = {};
                let busTimeValue = $("#busTime option:selected").text();

                for (var i = 0; i < this.line.length; i++) {
                        if(this.lineName == this.line[i].shuttle_name){
                            this.lineId = this.line[i].id;
                            break
                        }
                    }
                    if(this.lineId == ''){
                        layer.msg("该线路不存在",{icon:2,time:1500});
                        return;
                    }
                if(this.bus_time == '' ||this.shuttleType == ''){
                    layer.msg("请选择去/返程与班车班次",{icon:2,time:1500});
                    return;
                }
                if(this.selectedDateArr.length == 0){
                    layer.msg("请选择发车日期",{icon:2,time:1500});
                    return;
                }
                    for (var i = 0; i < this.driverList.length; i++) {
                        if(this.driverName == this.driverList[i].staff_vo.real_name){
                            currentDriver = this.driverList[i] ;
                            this.driverId = this.driverList[i].id;
                            break
                        }
                    }
                    if(this.driverId == ''){
                        layer.msg("该司机不存在",{icon:2,time:1500});
                        return;
                    }
                    for (var i = 0; i < this.carNumberList.length; i++) {
                        if(this.carName == this.carNumberList[i].car_no){
                            currentCar = this.carNumberList[i];
                            this.carId = this.carNumberList[i].id;
                            break
                        }
                    }
                    if(this.carId == ''){
                        layer.msg("该车辆不存在",{icon:2,time:1500});
                        return;
                    }
                if(currentCar.shuttle_bus_date_departure_time == busTimeValue  ){
                  layer.msg("当前车辆在该班次时间已有在跑行程,无法设置",{icon:2,time:1500})
                    return
                }
                if(currentDriver.shuttle_bus_date_departure_time == busTimeValue){
                    layer.msg("当前司机在该班次时间已有在跑行程,无法设置",{icon:2,time:1500})
                    return
                }
                this.checkConflict();
            },
            cancelCover:function () {
                this.showConflict = false;
            },
            confirmCover:function () {
                this.showConflict = false;
                this.save();
            },
            checkAll:function(){
                let that = this;
                this.isCheckAll = !this.isCheckAll;
                if(this.isCheckAll){
                        $("#busCalendar .k-active").each(function (index,value) {
                            if(that.selectedDateArr.indexOf( $(this).attr('data-date')) == -1){
                                that.selectedDateArr.push( $(this).attr('data-date'));
                            }
                        })
                }else{
                    $("#busCalendar .k-active").each(function (index,value) {
                        let delIndex = that.selectedDateArr.indexOf($(this).attr('data-date'));
                        that.selectedDateArr.splice(delIndex,1);
                    })
                }
                that.dateColor();
            },
            save:function () {
                if(this.loading) return;
                let that = this;
                this.loading = true;
                $.ajax({
                    url:base.gAjaxUrl.addBusDispatchDate,
                    type:"POST",
                    contentType: 'application/json',
                    data: JSON.stringify({
                        shuttle_bus_dates:that.dateIdArr,
                        driver:that.driverId,
                        vehicle:that.carId,
                        dispatch_time:that.actionTime,
                    })
                }).always((data)=>{
                    that.loading = false;
                    base.ajaxCallback(data,function () {
                        that.$dispatch("dialog-save")
                    })
                })
            },
            get_bus_time: function () {
                let that = this;
                console.log("this.lineId");
                console.log(this.lineId);
                let busIdData = this.lineId;
                if (busIdData) {
                    $.ajax({
                        url: `${base.gAjaxUrl.linebustime}${busIdData}/bus_time/`,
                        type: 'GET',
                        data: {shuttle_type:that.shuttleType},
                    }).always((data)=>{
                        base.ajaxCallback(data,function () {
                            that.bus_times = data;
                        })
                    });
                }
            },
            getDispatchDates:function () {
                let time = moment().format('YYYY-MM-DD') + "-" +$("#busTime option:selected").text(); // 当前班次的时间
                let item = moment(time, "YYYY-MM-DD-HH:mm").add(-30, 'minute').format("YYYY-MM-DD"); // 班次时间减去30分钟之后的日期
                let beforeDay = moment().add(-1, 'days').format("YYYY-MM-DD"); // 当前的前一天的日期
                if(moment(item).isSame(beforeDay)){
                    // 如果相同,则证明跨天了.把开始行程时间改为00:00
                    this.actionTime = '00:00';
                }else{
                    this.actionTime = moment(time,"YYYY-MM-DD-HH:mm").add(-30, 'minute').format('HH:mm');
                }
                let that =  this;
                that.dateArr = [];
                that.dispatchData = {};
                that.selectedDateArr = [];
                that.isCheckAll = false;
                if(this.bus_time != ''){
                    $.ajax({
                        url:`${base.gAjaxUrl.linebustime}${that.lineId}/dispatch_dates/`,
                        type:"GET",
                        data:{
                            bus_time:that.bus_time,
                        }
                    }).always((data)=>{
                        base.ajaxCallback(data,function () {
                            for (var i = 0 ,len = data.length ; i < len; i++) {
                                that.dateArr.push(data[i].departure_date);
                                that.dispatchData[data[i].departure_date] = data[i].id;
                            }
                            that.dateColor();
                        })
                    })
                }
            },
            checkConflict:function () {
                let that = this;
                that.dateIdArr = [];
                for (var i = 0,len = that.selectedDateArr.length; i < len; i++) {
                    that.dateIdArr.push(that.dispatchData[that.selectedDateArr[i]]);
                }

                $.ajax({
                    url:base.gAjaxUrl.busDateCheck,
                    type:"POST",
                    contentType: 'application/json',
                    data: JSON.stringify({
                        shuttle_bus_dates:that.dateIdArr,
                        driver:that.driverId,
                        vehicle:that.carId,
                    })
                }).always((data)=>{
                    base.ajaxCallback(data,function () {
                        if(data.drivers.length != 0 || data.vehicles.length != 0){
                            that.showConflict = true;
                            that.conflictDataArr = data;
                        }else{
                            that.save();
                        }
                    })
                })
            },
        },
        components:{
            cover:cover,
        }
    }
</script>