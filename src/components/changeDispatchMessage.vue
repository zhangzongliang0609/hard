<template>
    <cover v-if="showConflict" :data="conflictData" @cancel-cover="cancelCover" @confirm-cover="saveChange"></cover>
    <div class="layui-layer layui-anim layui-layer-dialog change-box">
        <div class="change-title f-16">修改调度信息</div>
        <div class="change-content">
            <p>线路名称:&nbsp;{{data.shuttlebus_name}}</p>
            <p>去/返程:&nbsp;{{data.shuttlebus_type==-10?'去程':'返程'}}</p>
            <p>发车日期:&nbsp;{{data.departure_date}}</p>
            <p>发车时间:&nbsp;{{data.departure_time}}</p>
            <div class="driver">
                司机:&nbsp;
                <div class="input-box">
                    <div class="department_select_container" @mouseleave="inputEnter('driver',false)" @mouseenter="inputEnter(true)">
                        <input v-if="driverList.length === 0" disabled type="text" class="input-text" value="无可选择线路">
                        <input v-else autocomplete="off" @click="inputClick('driver')" v-model="driverName" type="text" class="input-text" value="" placeholder="">
                        <i v-show="driverName !== ''" class="empty-icon Hui-iconfont" @click="emptySearch('driver')">&#xe60b;</i>
                        <div class="departmentListBox" style="display: none">
                            <div v-bind:title="item.department_name" v-for="item in driverList | filterBy driverName in 'staff_vo.real_name'" @click="setValue('driver',item)" class="departmentListItem">{{item.staff_vo.real_name}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="car">
                车辆:&nbsp;
                <div class="input-box">
                    <div class="department_select_container" @mouseleave="inputEnter('car',false)" @mouseenter="inputEnter(true)">
                        <input v-if="carNumberList.length === 0" disabled type="text" class="input-text" value="无可选择线路">
                        <input v-else autocomplete="off" @click="inputClick('car')" v-model="carName" type="text" class="input-text" value="" placeholder="">
                        <i v-show="carName !== ''" class="empty-icon Hui-iconfont" @click="emptySearch('car')">&#xe60b;</i>
                        <div class="departmentListBox" style="display: none">
                            <div v-bind:title="item.department_name" v-for="item in carNumberList | filterBy carName in 'car_no'" @click="setValue('car',item)" class="departmentListItem">{{item.car_no}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="action-time">
                开始打卡时间:&nbsp;
                <input v-model="actionTime" type="text" class="input-text" id="actionTime" value="00:00"/>
            </div>
        </div>
        <a class="btn radius btn-secondary f-r mt-20 mr-10" href="javascript:;" @click="cancel">取消</a>
        <a class="btn radius btn-primary f-r mt-20 mr-10" href="javascript:;" @click="getValue()">保存</a>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .change-box{
        width: 500px;
        height: 420px;
        border-radius:6px 6px 0 0;
        z-index:9999;
        left:37%;
        .change-title{
            height: 30px;
            line-height: 30px;
            color: #fff;
            border-bottom:1px solid #999;
            background-color:#5a98de;
            text-indent: 1em;
        }
        .change-content{
            padding: 10px 100px;
        }
    }
    .driver,.car,.action-time{
        margin-top: 15px;
    }
    .input-box{
        display: inline-block;
        width: 220px;
    }
    #actionTime{
        width: 164px;
    }
    .line-box{
        display: inline-block;
        width: 100px;
    }

</style>
<script>
    import * as base from '../assets/js/base.js';
    import cover from '../components/dispatchCover'
    export default{
        ready(){
            this.getCarNumberList();
            this.getDriverList();
            base.verticalCenter('.change-box')
            },


        data:function () {
            return{
                showConflict:false,
                conflictData:{},
                driverName:'',
                driverFocus:false,
                driverId:'',
                carName:'',
                carFocus:false,
                carId:'',
                actionTime:'',
                carNumberList:[],
                driverList:[],
            }
        },
        props:["data"],
        methods:{
            getCarNumberList:function () {
                let that = this;
                $.ajax({
                    url:base.gAjaxUrl.shuttlebusvehicles,
                    type:"GET",
                    data:{
                        page_size:999999,
                        locked:0,
                    }
                }).always((data)=>{
                    base.ajaxCallback(data,function () {
                        that.carNumberList  = data.results;
                        that.$nextTick(()=>{
                            that.carName = that.data.car_no;
                        })
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
                        that.$nextTick(()=>{
                            that.driverName = that.data.driver_name;
                            that.actionTime = that.data.dispatch_time.substring(0,that.data.dispatch_time.lastIndexOf(":"));;
                        })

                    })
                })
            },
            inputEnter: function (type,flag) {
                if(type == 'filtrateLine'){
                    this.filtrateLineFocus = flag;
                    !flag && $(".filtrate-line-box .departmentListBox").hide();
                }
                else if(type == 'line'){
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
                if(type == 'filtrateLine'){
                    $(".filtrate-line-box .departmentListBox").show();
                }
                else if(type == 'line'){
                    $(".line-box .departmentListBox").show();
                }else if(type == 'driver'){
                    $(".driver .departmentListBox").show();
                }else if(type == 'car'){
                    $(".car .departmentListBox").show();
                }
            },
            // 清除搜索输入框
            emptySearch:function(type){
                if(type == 'driver'){
                    this.driverName = '';
                    $(".driver .departmentListBox").show();
                }else if(type == 'car'){
                    this.carName= '';
                    $(".car .departmentListBox").show();
                }
            },
            setValue: function (type,item) {
                if(type == 'filtrateLine'){
                    this.filtrateLineName= item.shuttle_name;
                    this.filtrateLineId = item.id;
                    $(".filtrate-line-box .departmentListBox").hide();
                    this.get_bus_time();
                    this.busTime = '';
                }
                else if(type == 'driver'){
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
                for (var i = 0; i < this.driverList.length; i++) {
                    if(this.driverName == this.driverList[i].staff_vo.real_name){
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
                        this.carId = this.carNumberList[i].id;
                        break
                    }
                }
                if(this.carId == ''){
                    layer.msg("该车辆不存在",{icon:2,time:1500});
                    return;
                }
                this.checkConflict();
            },
            checkConflict:function () {
                let that = this;
                let shuttleArr = [];
                shuttleArr.push(that.data.shuttlebus_date);
                $.ajax({
                    url:base.gAjaxUrl.busDateCheck,
                    type:"POST",
                    contentType: 'application/json',
                    data:JSON.stringify({
                        shuttle_bus_dates:shuttleArr,
                        driver:that.driverId,
                        vehicle:that.carId,
                    })
                }).always((data)=>{
                    base.ajaxCallback(data,function () {
                        if(data.drivers.length != 0 || data.vehicles.length != 0){
                            that.showConflict = true;
                            that.conflictData = data;
                        }else{
                           that.saveChange();
                        }
                    })
                })
            },
            saveChange:function () {
                let that = this;
                $.ajax({
                    url:`${base.gAjaxUrl.busDispatchList}${that.data.id}/`,
                    type:"PATCH",
                    contentType: 'application/json',
                    data:JSON.stringify({
                        driver:that.driverId,
                        vehicle:that.carId,
                        dispatch_time:that.actionTime,
                    })
                }).always((data)=>{
                    base.ajaxCallback(data,function () {
                        that.$dispatch("save-change")
                    })
                })
            },
            cancel:function () {
                this.$dispatch("dialog-close")
            },
            cancelCover:function () {
                this.showConflict = false;
            }
        },
        components:{
            cover:cover,
        },
        filters:{
            dateSlice:function (value) {
                return value.substring(0,value.lastIndexOf(":"));
            }
        }
    }
</script>