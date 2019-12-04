<template>
    <!--选择车辆-->
    <select_vehicle v-if="showPickVehicle" :start="modifyStartTime ? modifyStartTime : orderStartTime" :end="modifyEndTime ? modifyEndTime : orderEndTime" @dialog-close="closeVehicle" @select-vehicle="saveVehcile" :vehicle="selectedVehicleArr"></select_vehicle>
    <!--编辑时间-->
    <date v-if="showModifyDate" @dialog-close="closeDate" :start="modifyStartTime ? modifyStartTime : orderStartTime" :end="modifyEndTime ? modifyEndTime : orderEndTime"  @selected-date="saveModifyTime"></date>
    <!--查看已拼单的行程-->
    <carpool v-if="isShowCarpool" :data="carpoolData" :title="'查看已拼行程'" @dialog-close="closeCarpool"></carpool>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title layui-layer-title2  layui-layer-title-three">
            委派司机
        </div>
        <div class="layui-layer-content cl">
            <div class="f-l list-box">
                <h3>行程名称</h3>
                <div class="list-item" @click="clickTrip(item)" :class="{'bg00':item.id == currentTrip.id}" v-for="item in tripArr">
                    <div class="f-14 clearfix station">
                        <span class="f-l station-source " title="{{item.source_name}}">{{item.source_name}}</span>
                        <span class="f-l station-middle">--</span>
                        <span class="f-l station-destination " title="{{item.destination_name}}">{{item.destination_name}}</span>
                    </div>
                    <div class="f-12 clearfix station location-remark" v-show="item.source_remark || item.destination_remark">
                        <span class="f-l station-source " title="{{item.source_remark}}">({{item.source_remark}})</span>
                        <span class="f-l station-middle">--</span>
                        <span class="f-l station-destination " title="{{item.destination_remark}}">({{item.destination_remark}})</span>
                    </div>
                    <a class="a-font" href="javascript:;" @click="showCarpool(item)" v-if="item.carpool_id">
                        (此行程已拼单,点击查看已拼行程)
                    </a>
                </div>
            </div>
            <div class="f-l center-box pl-10 cl">
                <div class="m-info  cl">
                    <div class="cl">
                        <div class="f-l lh-30">出发时间：{{currentTrip.ride_time ? currentTrip.ride_time.slice(0,-3) : ""}}</div>
                        <div class="f-l lh-30 ml-5">结束时间：{{currentTrip.end_time ? currentTrip.end_time.slice(0,-3) : ""}}</div>
                        <div class="btn btn-primary radius f-l ml-5" v-if="currentTrip.status == 10" @click="modifyDate()">编辑</div>
                    </div>
                    <div class="cl">
                        <div class="f-l">
                            <span>修改后：</span>
                            <span>出发时间：{{isModifyDate() ? modifyStartTime.slice(0,-3) : ""}}</span>
                            <span>结束时间：{{isModifyDate() ? modifyEndTime.slice(0,-3) : ""}}</span>
                        </div>
                    </div>
                </div>
                <div class="cl mt-8">
                    <span class="diamonds f-l mr-5"></span>
                    <span class="sub-title f-l">选择</span>
                </div>

                <div class="border333 driver-box">
                    <div class="cl">
                        <select  class="select-box f-l mt-8" v-model="searchType">
                            <option value="real_name">姓名</option>
                            <option value="job_number">工号</option>
                            <option value="phone">手机号</option>
                        </select>
                        <input class="f-l mt-8 input-text" type="text" v-model="searchContent">
                        <button class="f-l btn btn-primary mt-8" @click="getDriverList">查询</button>
                        <div class="f-r ml-10">
                            <div class="cl">
                                <span class="hint f-l bga1 mt-10 mr-5"></span>
                                <span class="f-l">原有行程</span>
                            </div>
                            <div class="cl">
                                <span class="hint f-l bg00 mt-10 mr-5"></span>
                                <span class="f-l">现有行程</span>
                            </div>
                        </div>
                    </div>
                    <table class="table table-border table-bordered table-hover table-bg table-sort">
                        <thead>
                        <tr class="text-c">
                            <th>姓名</th>
                            <th width="320">行程时间轴</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr class="text-c" v-for="driver in driverJourneyArr" @click="clickDriver(driver)">
                            <td>{{driver.real_name}}</td>
                            <td>
                                <canvas :id="'d' + driver.id"  height="40" class="time-scale" ></canvas>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div id="M-page" class="m-page" v-show="!noData"></div>
                    <div class="no-data text-c" v-if="noData">没有相关数据</div>
                </div>
            </div>

            <div class="right-box mt-3 f-l cl">
                <div class="cl mt-60">
                    <span class="diamonds f-l mr-5"></span>
                    <span class="sub-title f-l">已选</span>
                </div>
                <div class="border333 h-350 bgf2 pd-10">
                    <div class="selected-item" v-for="item in selectedVehicleArr">
                        <div class="message">
                            <span class="inline-block ml-5">{{item.real_name}}</span>
                            <span class="inline-block ml-5">{{item.car_no}}</span>
                        </div>
                        <button class="btn btn-primary radius " v-if="currentTrip.status == 10" @click="modifyVehcile(item,$index)">编辑车辆</button>
                        <button class="btn btn-danger radius ml-10 mr-5" v-if="currentTrip.status == 10" @click="deleteVehcile($index)">删除</button>
                    </div>
                </div>
                <button class="btn btn-primary radius f-r mt-10 mr-10" v-if="currentTrip.status == 10" @click="save()">保存</button>

            </div>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
        </span>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .m-page{
        padding-bottom: 30px;
    }
    .a-font{
        color: #000fff;
    }
    .list-box{
        border: 1px solid #cccccc;
        display: flex;
        width:300px;
        height: 530px;
        overflow-y: auto;
        flex-direction: column;
        align-items: center;
        margin-left: 10px;
        .list-item{
            border-radius: 4px;
            width:270px;
            min-height:30px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color:#ffffff;
            background: #a1a1a1;
            font-size: 12px;
            margin-bottom: 10px;
            cursor: pointer;
            .station {
                height: 20px;
                width: 100%;
                line-height: 20px;
                &.location-remark {
                    color: #ececec;
                }
                .station-source {
                    height: 100%;
                    width: 120px;
                    box-sizing: border-box;
                    text-align: right;
                    padding-left: 8px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
                .station-middle {
                    width: 30px;
                    height: 100%;
                    text-align: center;
                }
                .station-destination {
                    width: 120px;
                    height: 100%;
                    box-sizing: border-box;
                    text-align: left;
                    padding-right: 8px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
            }
        }
        .selected-item{
            background: #0a6999;
        }
    }
    .center-box{
        width:470px;
    }
    .right-box{
        width:285px;
        padding-left: 10px;
        .mt-60{
            margin-top: 70px;
        }
    }
    .mt-8{
        margin-top: 8px;
    }
    div.layui-modify{
        /*margin-left: -25pc;*/
        height: 600px;
        width: 1100px;
    }
    .layui-modify .layui-layer-shade{
        z-index:102;
    }
    .layui-modify .layui-modify{
        z-index:103;
    }
    .diamonds{
        height:20px;
        width:12px;
        background: #0099ff;

    }
    .sub-title{
        font-weight: bold;
        display: inline-block;
        font-size: 14px;
        color:#0a0a0a;
    }

    .mt-8{
        margin-top: 8px;
    }
    .driver-box{
        height:350px;
    }
    .border333{
        border: 1px solid #cccccc;
        margin-top: 10px;
        padding: 10px;
    }
    .select-box{
        width:80px;
        height: 31px;
    }
    .hint{
        width:15px;
        height:8px;
    }
    .bga1{
        background: #a1a1a1;
    }
    .bg00{
        background: #00ccff !important;
    }
    .bgf2{
        background: #f2f2f2;
    }
    .input-text{
        width:200px;
        margin-left: -1px;
    }
    .h-350{
        height:350px;
        overflow-y: auto;

    }
    .mt-3{
        margin-top: 3px;
    }
    .selected-item{
        background: #ffffff;
        height:40px;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 5px;
        .message{
            display: flex;
            flex-direction: column;
            width:200px;
        }
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../../assets/js/base.js';
    import moment from "moment";
    import select_vehicle from  "../components/pickVehicle"
    import date from  "../components/modifyDate"
    import carpool from "../components/showCarpoolOrder"

    let option = null;
    export default{
        ready () {
            option = {
                param:{
                },
                page:1,
                page_size:10
            };
            base.verticalCenter(".layui-layer");

            this.tripArr = this.data.trip_set;
            // 如果是点击订单进入界面,默认选中第一个行程
            if(!this.trip){
                this.currentTrip = this.tripArr[0];
            }else{
                this.currentTrip = this.trip;
            }
            this.orderStartTime = this.currentTrip.ride_time;
            this.orderEndTime = this.currentTrip.end_time;
            this.getDriverList();
            this.getTripDetails(this.currentTrip.id);

        },
        props: ['title','data','trip'],
        data:function(){
            return {
                noData:true,
                mapInfo:{},
                isShowMap:true,
                isModify:true,
                showPickVehicle:false,
                showModifyDate:false,
                timeArr:[], // 显示在时间刻度表上的时间
                timeSpan:1, // 默认时间跨度,单位是小时,行程超过4小时,跨度是2,行程超过12小时跨度是6
                orderStartTime:"2016-12-24 13:30:00",
                orderEndTime:"2019-12-24 17:30:00",
                modifyStartTime:"",
                modifyEndTime:"",
                startLocation:0,
                endLocation:0,
                currentDriver:"",
                tripArr:[], // 行程数组
                currentTrip:"", // 当前行程
                driverJourneyArr:[],
                currentStartTime:"", // 当前的开始时间
                currentEndTime:"", // 当前的结束时间
                selectedVehicleArr:[],
                currentVehicleIndex:null,
                orderDate:{}, // 在没有编辑时间时用来保存一开始的订单时间,用来传给编辑时间的弹窗
                searchType:"real_name",
                searchContent:"",
                oldData:{}, // 当前界面的旧数据,用来切换行程时,判断数据是否有改变
                isShowCarpool:false,
                carpoolData:[],
            }
        },
        filters:{

            /**
             * 1,计算时间刻度跨度。canvas总宽度为320,高度为40,注意,canvas的宽度不能使用css来写,会导致计算混乱.一共显示8个时间区域，所以每个刻度之间的宽度为320/8=40
             * 2,利用canvas画一条线,X轴起点为0,重点为320,Y轴起终点都是25,只所以不放到最底下,是因为需要给显示时间的文字一定的区域.
             * 3,计算显示的时间跨度，正常跨度为1个小时，行程超过4个小时跨度为2个小时，超过12小时跨度为6个小时.利用行程的结束时间减去开始的时间,得出行程的时长,再做判断得出时间的跨度
             * 4,利用moment格式化行程的开始时间,得出第一个刻度上的时间,然后再根据跨度递增并且显示即可.
             * 5,绘画已有行程的矩形,拿到司机已有的行程的时间.用司机行程的开始时间跟当前订单的开始时间都转化成时间戳去判断,如果司机行程的开始时间早于订单的开始时间,那矩形的X轴起点为0,反之用相差的时间/60000转化成分钟数.
             * 6,利用时间跨度*60,得出时间跨度的分钟数,使用前面的时间差的分数/每个跨度代表的分钟数,得出需要展示的比例,乘于每个跨度中的宽度,也就是40.得出需要X轴起点位置
             * 7,X轴的终点位置也是一样,只需要在计算行程差的时候,使用司机行程的结束时间去减订单的开始时间,然后算法同上,得出X轴的重点位置即可绘制.
             * **/
        },
        methods: {
            //初始化分页
            getDriverList:function(){
                option.page = 1;
                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#M-page',tpageToal,option.page,count)
                });
            },
            getTripDetails:function(id){
                $.showLoading();
                $.ajax({
                    url:`${base.gAjaxUrl.officialcarTrip_V2}${id}/`,
                    type:"GET",
                }).always((data)=>{
                    $.hideLoading();
                    base.ajaxCallback(data,()=>{
                        // console.log("data");
                        // console.log(data);
                        this.currentTrip = data;
                        this.modifyStartTime = data.admin_ride_time;
                        this.modifyEndTime = data.admin_end_time;
                        this.selectedVehicleArr = [].concat(data.drivertrip_set);
                        this.orderStartTime = data.ride_time;
                        this.orderEndTime = data.end_time;
                        this.oldData = {
                            modifyedStartTime:data.admin_ride_time,
                            modifyedEndTime:data.admin_end_time,
                            vehicleArr:[].concat(data.drivertrip_set),
                        }
                        if(data.status != 10){
                            layer.msg("当前行程委派完成,如若需要重新委派,请在列表界面取消委派之后操作",{icon:1,time:3000});
                        }
                        this.getDriverList();
                        // this.initDraw();
                    })
                })
            },
            initPage:function(obj,tpageToal='4',current='1',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:current,
                    count:count,
                    callback:(p)=>{
                        option.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax:function(callback=function(){}){
                let data = {
                    page:option.page,
                    page_size:3,
                    start_time:this.modifyStartTime ? this.modifyStartTime : this.orderStartTime,
                    end_time:this.modifyEndTime ? this.modifyEndTime : this.orderEndTime,
                };
                data[this.searchType] = this.searchContent;

                $.showLoading();
                $.ajax({
                    url: `${base.gAjaxUrl.officialcarDispatchDriverList_V2}`,
                    type: 'GET',
                    data:data
                }).always((data)=>{
                    $.hideLoading();
                    base.ajaxCallback(data,()=>{
                        let resultData = data.results;
                        this.driverJourneyArr = resultData;
                        if(resultData.length){
                            this.noData = false;
                            //回调
                            callback(data.num_pages,data.count);
                            this.$nextTick(()=>{
                                this.initDraw();
                            })
                        }else{
                            this.noData = true;
                        }
                    });
                })
            },
            initDraw:function(){
                let start = this.modifyStartTime ? this.modifyStartTime : this.orderStartTime;
                let end = this.modifyEndTime ? this.modifyEndTime : this.orderEndTime;
                this.calculateSpan(start,end);
                this.initTimeArr(start);
                this.driverJourneyArr.forEach((item,index)=>{
                    this.drawDriverRect("d" + item.id,index);
                })
            },
            close:function(){
                this.$dispatch('dialog-close',"showDispatch");
            },
            calculateSpan:function(start,end){
                // 计算时间跨度orderEndTime
               let hours =   (new Date(end).valueOf() - new Date(start).valueOf()) / 60000 / 6 ;
               if(hours < 4){
                   this.timeSpan = 1;
               }else if(hours > 4 && hours < 12){
                   this.timeSpan = 2;
               }else{
                   this.timeSpan = 6;
               }
            },
            initTimeArr:function(start){
                // 获取第一个时间刻度上的时间
                this.timeArr = [];
                this.begin = moment(start).add(this.timeSpan * -3 , "hour").format("YYYY-MM-DD HH:mm:ss");
                // 初始化显示在时间刻度表上的时间
                for (let i = 1; i < 9; i++) {
                    this.timeArr.push(moment(start).add(this.timeSpan * (i - 3), "hour").format("HH:mm"));
                }
            },
            initTimeScale:function(ctx){
                ctx.moveTo(0,25);
                ctx.lineTo(320,25);
                ctx.strokeStyle  = "#070707";
                ctx.fillStyle = "#070707";
                for (let i = 1; i < 8; i++) {
                    ctx.moveTo(i * 40,17);
                    ctx.lineTo(i * 40,25);
                    ctx.textAlign = "center";
                    ctx.fillText(this.timeArr[i-1],i * 40,35)
                }
                ctx.stroke();
            },
            drawDriverRect:function(domId,i){
                let ctx = document.getElementById(domId).getContext("2d");
                // 清除画布
                ctx.clearRect(0,0,320,40);
                this.driverJourneyArr[i].times.forEach((time,index)=>{
                    let obj = this.getDrawLocation(time);
                    // 绘制矩形
                    ctx.fillStyle = "rgb(161,161,161)";
                    ctx.fillRect (obj.start, 10, obj.end - obj.start, 15);
                })
                this.drawOrderRect(ctx);
                this.initTimeScale(ctx);
            },
            getDrawLocation:function(item){
                // 通过计算得出需要绘制起终点
                let timeDifference,startLocation,endLocation;
                // 计算出司机行程和订单的开始时间的时间差,用于计算绘制的位置
                timeDifference = new Date(item.start).valueOf() - new Date(this.begin).valueOf() ;
                startLocation = 0;
                if(timeDifference > 0 ){
                    // 使用前面计算出的时间差的分数除于每个跨度代表的分钟数,得出需要展示的比例,乘于每个跨度中的宽度,也就是40.得出需要X轴起点位置
                    startLocation = timeDifference / 60000 /(60 * this.timeSpan) * 40
                }
                // X轴终点的位置,是计算司机行程的结束时间和订单开始的时间差,由于计算出来是时间戳,除于60000得到分钟数,除于一个刻度区域里代表的分钟数,得出需要展示的比例,乘以固定的刻度区域宽度40,得出需要绘制的X轴终点
                endLocation =  (new Date(item.end).valueOf() - new Date(this.begin).valueOf()) / 60000 / (60 * this.timeSpan) * 40;
                return {start:startLocation,end:endLocation}
            },
            drawOrderRect(c){
                let start = this.modifyStartTime ? this.modifyStartTime : this.orderStartTime;
                let end = this.modifyEndTime ? this.modifyEndTime : this.orderEndTime;
                let obj = this.getDrawLocation({start:start,end:end});
                // 绘制矩形
                c.fillStyle = "rgba(0,204,255,0.5)";
                c.fillRect (obj.start, 0, obj.end - obj.start, 25);
            },
            modifyVehcile:function(data,i){
                this.showPickVehicle = true;
                this.currentVehicleIndex = i;
                this.currentDriver = {};
                this.currentDriver.real_name = data.real_name;
                this.currentDriver.id = data.driver;
            },
            closeVehicle:function(){
                this.showPickVehicle = false;
            },
            modifyDate:function(){
                this.showModifyDate = true;
            },
            closeDate:function(){
                this.showModifyDate = false;
            },
            clickTrip:function(item){
                // console.log("clickTrip");
                // console.log(item);

                if(this.currentTrip.id == item.id){
                    return;
                }else{
                    if(this.checkData()){
                        layer.open({
                            title: '提示信息',
                            content: '<span>当前行程信息有改变但是未保存,是否需要保存?</span>',
                            btn: ['保存', '放弃'],
                            btn1: ()=> {
                                this.save(true);
                                this.getTripDetails(item.id);
                            },
                            btn2: ()=> {
                                this.getTripDetails(item.id);
                            }
                        });
                    }else{
                        this.getTripDetails(item.id);
                    }
                }
            },
            checkData:function(){
                if(this.oldData.modifyedStartTime != this.modifyStartTime){
                    return true;
                }else if(this.oldData.modifyedEndTime != this.modifyEndTime){
                    return true;
                }else if(this.oldData.vehicleArr.length != this.selectedVehicleArr.length ){
                    return true;
                }
                for (let i = 0; i < this.oldData.vehicleArr.length; i++) {
                    if(this.oldData.vehicleArr[i].driver != this.selectedVehicleArr[i].driver || this.oldData.vehicleArr[i].vehicle != this.selectedVehicleArr[i].vehicle ){
                        return true
                    }
                }

                return false;

            },
            saveModifyTime:function(data){
                this.showModifyDate = false;
                this.modifyStartTime = data.startTime;
                this.modifyEndTime = data.endTime;
                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-page',tpageToal,option.page,count)
                });
            },
            clickDriver:function(item){
                for (let vehicle of this.selectedVehicleArr){
                    if(item.id == vehicle.driver){
                        layer.msg("该司机已选择,如需修改,请点击编辑车辆",{icon:2,time:2000});
                        return;
                    }
                }
                this.showPickVehicle = true;
                this.currentVehicleIndex = "";
                this.currentDriver = item;
            },
            saveVehcile:function(vehicle){
                this.showPickVehicle = false;
                vehicle.real_name = this.currentDriver.real_name;
                vehicle.driver = this.currentDriver.id;
                if(this.currentVehicleIndex !== ""){
                    this.selectedVehicleArr[this.currentVehicleIndex] = vehicle;
                    let arr = this.selectedVehicleArr;
                    this.selectedVehicleArr = [];
                    this.selectedVehicleArr = arr;

                }else{
                    this.selectedVehicleArr.push(vehicle)
                }
            },
            deleteVehcile:function(i){
                let that = this;
                layer.confirm(`是否确认删除${this.selectedVehicleArr[i].car_no}这辆车`, (index) => {
                    that.selectedVehicleArr.splice(i,1);
                    layer.closeAll();
                })
            },
            save:function(isChange){
                if(!this.selectedVehicleArr.length){
                    layer.msg("请先安排司机车辆",{icon:2,time:2000});
                    return
                }
                if(this.modifyStartTime){
                    this.saveModifyedTime();
                }

                let arr = this.selectedVehicleArr.map((item)=>{
                    return {vehicle:item.vehicle ? item.vehicle : item.id,driver:item.driver}
                })
                $.showLoading();
                $.ajax({
                    url:`${base.gAjaxUrl.officialcarTrip_V2}${this.currentTrip.id}/delegate/`,
                    type:"PATCH",
                    async:false,
                    contentType:"application/json",
                    data:JSON.stringify(arr),
                }).always((data)=>{
                    $.hideLoading();
                    base.ajaxCallback(data,()=>{
                        layer.msg("保存成功",{icon:1,time:1500});
                        if(!isChange){
                            this.getTripDetails(this.currentTrip.id);
                        }
                        this.$dispatch("save-dispatch")
                    })
                })
            },
            saveModifyedTime:function(){
                $.ajax({
                    url:`${base.gAjaxUrl.officialcarTrip_V2}${this.currentTrip.id}/`,
                    type:"PATCH",
                    data:{
                        admin_ride_time:this.modifyStartTime,
                        admin_end_time:this.modifyEndTime,
                    }
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{})
                })
            },
            showCarpool:function(data){
                this.carpoolData = data;
                this.isShowCarpool = true;
            },
            closeCarpool:function(){
                this.isShowCarpool = false;
            },
            isModifyDate:function(){
                if(moment(this.modifyStartTime).isSame(this.orderStartTime) && moment(this.modifyEndTime).isSame(this.orderEndTime)){
                    return false;
                }else{
                    return true;
                }
            }

        },
        components:{
            select_vehicle:select_vehicle,
            date:date,
            carpool:carpool,
        }
    }
</script>

