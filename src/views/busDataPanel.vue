<template>
    <passnumber :start="startDateInput" :end="endDateInput" v-if="isShowPassDialog" v-on:dialog-pass-close="passDialogClose"></passnumber>
    <datacomment  :start="startDateInput" :end="endDateInput" v-if="isShowCommentDialog" v-on:dialog-comment-close="commentDialogClose"></datacomment>
    <singlebus :data="lineSelected" :start="startDateInput" :end="endDateInput"  :buslines="busItem" v-if="isShowLineData" v-on:dialog-line-close="lineDialogClose"></singlebus>
    <stationsignupnums :data="selectedStation"  :start="startDateInput" :end="endDateInput"  v-if="isShowStationSignupNumsDetailDialog" v-on:dialog-line-close="stationsignupnumsDialogClose"></stationsignupnums>

    <section class="Hui-article-box">
        <div class="tabBar clearfix">
            <span role="tab" class="line f-18" :class="{'current':currentTab == 1}" @click="lineReport">线路统计</span>
            <span role="tab" class="f-18" :class="{'current':currentTab == 2}" @click="rideReport">搭乘统计</span>
            <span role="tab" class="f-18" :class="{'current':currentTab == 3}" @click="realTime">票务实时情况</span>
        </div>
            <div id="tab_demo" class="HuiTab mt-40" role="tablist">
                <!--  以下为线路总数统计 -->
               <div class="bk_gray pd-10 tabpan" role="tabpanel" v-show="isShowLineReport">
                    <div class="clearfix tab-circle">
                        <div class="fit">
                            <div class="circle-box">
                                <div class="circle">
                                    <div class="adaptive-circle">
                                        <div class="layout middle">
                                            <div>
                                                <h2>搭乘总人数</h2>
                                                <p>{{ ride_num }}</p>
                                                <a href="javascript:;" @click = "passNumber">查看详情</a>
                                                <div class="triangle"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <div class="small-line"></div>
                            <div class="circle-box">
                                <div class="circle">
                                    <div class="adaptive-circle adaptive-circle2">
                                        <div class="layout middle">
                                            <div>
                                                <h2>好评率</h2>
                                                <p>{{ good_comment_rate }}%</p>
                                                <a href="javascript:;" @click = "commentRate" >查看详情</a>
                                                <div class="triangle triangle2"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        <div class="small-line"></div>
                            <div class="circle-box">
                                <div class="circle">
                                    <div class="adaptive-circle adaptive-circle3">
                                        <div class="layout middle">
                                            <div>
                                                <h2>线路总数</h2>
                                                <p>{{ shuttle_bus_cnt }}条</p>
                                                <a href="javascript:;"  v-link="{ name: 'busManagement'}">查看详情</a>
                                                <div class="triangle triangle3"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="circle-box" style="vertical-align: top;">
                                <div class="circle">
                                        <p class="pselect">选择展示时间</p>
                                        <div>
                                            开始日期：
                                            <input  v-model="startDateInput" type="text" class="input-text date-input"  id="J-start-outer-date-line" v-bind:value="startDateInput">
                                        </div>
                                        <div>
                                            结束日期：
                                            <input v-model="endDateInput" type="text" class="input-text date-input" id="J-end-outer-date-line" v-bind:value="endDateInput">
                                        </div>
                                        <button type="submit" class="btn btn-success radius search-btn" v-on:click="allchange()"><i  class="Hui-iconfont">&#xe665;</i></button>

                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="top-rate">
                        <div class="row cl line-control">
                            <div class="col-12 f-l">
                                <div class="form-label f-l col-4 text-r mr-5 mt-5 select-department">选择线路:</div>
                                <div class="formControls f-l col-7">
                                    <div class="department_select_container" @mouseleave="departmentEnter(false,$event)" @mouseenter="departmentEnter(true,$event)">
                                        <input v-if="lineNameData.length === 0" disabled type="text" class="input-text" value="无可选择线路">
                                        <input v-else autocomplete="off" @click="departmentClick($event)" v-model="selectLineName" type="text" class="input-text" value="" placeholder="" name="department">
                                        <i v-show="selectLineName !== ''" class="empty-icon Hui-iconfont" @click="emptySearch($event)">&#xe60b;</i>
                                        <div class="departmentListBox" style="display: none">
                                            <div v-bind:title="item" v-for="item in lineNameData | filterBy selectLineName" @click="setDepartmentValue(item,$event)" class="departmentListItem">{{item}}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="main1" class="main1" style="width: 100%;height: 95%;"></div>
                    </div>
                    <div class="bottom-rate">
                        <div class="row cl classes-control">
                            <div class="col-12 f-l">
                                <div class="form-label f-l col-4 text-r mr-5 mt-5 select-department">选择站点:</div>
                                <div class="formControls f-l col-7">
                                    <div class="department_select_container" @mouseleave="departmentEnter(false,$event)" @mouseenter="departmentEnter(true,$event)">
                                        <input v-if="classesNameData.length === 0" disabled type="text" class="input-text" value="无可选择站点">
                                        <input v-else autocomplete="off" @click="departmentClick($event)" v-model="selectClassesName" type="text" class="input-text" value="" placeholder="" name="department">
                                        <i v-show="selectClassesName !== ''" class="empty-icon Hui-iconfont" @click="emptySearch($event,true)">&#xe60b;</i>
                                        <div class="departmentListBox" style="display: none">
                                            <div v-bind:title="item" track-by="$index"  v-for="item in classesNameData | filterBy selectClassesName" @click="searchClasses(item,$event)" class="departmentListItem">{{item}}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tabicons">
                            <span v-bind:class="[shuttle_type==-10?'selected':'']" v-on:click="clickShuttle(-10)">去程</span>
                            <span v-bind:class="[shuttle_type==10?'selected':'']" v-on:click="clickShuttle(10)">返程</span>
                        </div>
                        <div id="main2" class="main2" style="width: 100%;height: 80%;"></div>
                    </div>
               </div>
               <!--  以下为搭乘统计 -->
                <div class="ridereport" v-if="isShowRideReport">
                    <ridereport></ridereport>
                </div>
                <!-- 以下为票务实时情况-->
                <div class="ridereport" v-if="isShowRealTime">
                    <real v-if="isShowRealTime"></real>
                </div>
            </div>
    </section>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>

    #main1,#main2{
        width: 100%;
        /*height: 100%;*/
        height: 500px;
    }

    .page-container{
        padding:0;
    }
    /*以下为搭乘统计模块*/
    .search {
        position: absolute;
        margin-left: 69%;
        z-index: 10000;
        margin-top: -8px;
        .search-btn{
            margin-left: 5px;
            font-size: 24px;
            color: #909bad;
            cursor: pointer;
        }
        .input-search{
            width: 120px;
            height: 24px;
            padding-left: 12px;
        }
    }

    .line{
        background-color: #277bd1;
    }
    .tabpan{
        width:100%;
        height:100%;
        background-color: #f7f7f7;
        border-radius: 10px;
        margin-bottom: 10px;
    }
    #check {
        top: 0;
    }
    #exportData {
        top: 0;
    }
    .input-small{
        width: 120px;
    }
    .tabCon .page-container .select-small{
        width: 258px;
    }
     /*以下为线路统计模块*/
    .triangle{
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 8px solid #40C6AE;
        margin-left: 45%;
    }
    .triangle2{
        border-bottom: 8px solid #FE696B;
    }
    .triangle3{
        border-bottom: 8px solid #FAB687;
    }
    .pselect{
        padding-left: 39px;
        font-size: 16px;
    }
    .small-line{
        height: 150px;
        width: 2px;
        display: inline-block;
        background-color: #EAEAEC;
        /*float: left;*/
        /*margin-top: 15px;*/
        margin:8px 0;
    }
    .all-avage{
        color: red;
        text-align: center;
        width: 100px;
        padding-top: 120px;
        margin-left: 70px;
        line-height: 50px;
        color: red;
    }

    /*.main1{*/
        /*height: 500px;*/
    /*}*/
    .tabCon{
        width: 98.3%;
        height: 98%;
    }
    .HuiTab{
        width: 100%;
        height: 100%;
    }
    .top-rate{
        position: relative;
        margin-top: 10px;
        width: 100%;
        height: 450px ;
        background-color: #fff;
        border-radius: 10px;
    }
    .bottom-rate{
        position: relative;
        width: 100%;
        height: 550px;
        background-color: #fff;
        border-radius: 10px;
        margin-top: 10px;
    }
    .tab-circle{
        width: 90%;
        height: 175px;
        overflow: hidden;
        padding: 0 5%;
        background-color: #fff;
        border-radius: 5px;
        min-width: 1000px;
    }
    .clearfix:after{content:"\20";display:block;height:0;clear:both;visibility:hidden}.clearfix{zoom:1}
    .tabBar {background-color: #6E6E6E;height: 43px;}
    .tabBar span {color: white;cursor: pointer;display: inline-block;float: left;height: 30px;line-height: 30px;padding: 4px 16px; width: 120px;background-color: #6E6E6E; border-top: 4px solid #6E6E6E;font-size: 16px;}
    .tabBar span.current{background-color: #697E93; border-top: 4px solid #5CADFE; width: 120px;}
    .tabCon {display: none}
    .se-r{
        width: 132px;
        margin-left: 25px;
        background: #5cadff;
        border-radius: 20px;
        color: #fff;
        padding-left: 33px;
        height: 26px;
        font-size: 15px;
    }
    .tabBar{
        position:fixed;
        z-index:100;
        // margin-top: 10px;
        // margin-left: 34%;
        width: 100%;
        border:0;
    }
    .tabBar span{
        text-align: center;
    }

    @media screen and (max-width: 2000px) {


    }
    @media screen and (min-width: 1600px) {
    }
    .layui-layer-title{
        .m-info{
            border: none;
            padding: 9px 0;
            margin: 0;
        }
    }
    .line-control{
        position:absolute;
        z-index:2;
        width: 350px;
        left: 8%;
        top: 4.5%;
    }
    .classes-control{
        position:absolute;
        z-index:2;
        width: 350px;
        left: 8%;
        top: 3.5%;
    }
    .fit{
        width: 100%;
        height: 160px;
        .circle-box{
            display: inline-block;
            width:24%;
            min-width: 240px;
            .circle{
                margin: 0 auto;
                width: 170px;
                height: 160px;
                border:none;
            }
        }

    }
    .search-btn{
        width: 172px;
        margin-top: 5px;
    }
    .date-input{
        margin-top: 5px;
        width: 130px;
    }
    .adaptive-circle {
        margin: 10px auto 0;
        width: 100%;
        height: 100%;
        /*padding-top: 100%;*/
        border-radius: 100%;
        border: 3px solid #40c4af;
        box-sizing: border-box;
        position: relative;
        // margin-left: 5%;
        // margin-right: 5%;
    }
    .adaptive-circle2{
        border: 3px solid #fd6b6b;
        // margin-left: 5%;
        // margin-right: 5%;
    }
    .adaptive-circle3{
        border: 3px solid #fab685;
        // margin-left: 5%;
        // margin-right: 5%;
    }
    .adaptive-circle .layout {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        text-align: center;
    }
    .adaptive-circle .layout.middle a{
        color: #909bad;
        font-size: 13px;
    }
    .adaptive-circle .layout.middle h2{
        font-size: 140%;
        padding-top: 0;
        color: #611421;
    }
    .adaptive-circle p{
        font-size: 170%;
        color: #40c4af;
    }
    .adaptive-circle2 p{
        font-size: 170%;
        color: #fd6b6b;
    }
    .adaptive-circle3 p{
        font-size: 170%;
        color: #fab685;
    }
    .adaptive-circle .layout.middle:before {
        display: inline-block;
        vertical-align: middle;
        content: '';
        height: 100%;
        width: 0;
        overflow: hidden;
    }
    .adaptive-circle .layout.middle div:first-child {
        display: inline-block;
        vertical-align: middle;
    }
</style>
<style>
    .ridereport > .Hui-article-box {
        position: absolute;
        left: 0;
    }
    .tabicons{
        position: absolute;
        top: 3.5%;
        right: 20%;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        cursor: pointer;
        z-index: 2;
    }
    .tabicons span{
        display: inline-block;
        padding: 4px 10px;
        background-color: #999;
        color: #fff;
        float: left;
    }
    .tabicons span.selected{
        background-color: #5cadff;
    }

</style>
<script>
    import * as base from '../assets/js/base.js';
    import moment from "moment";
    /*以下为线路统计*/
    import passnumber from '../components/busDataPanelPassNumber.vue';
    import datacomment from '../components/busDataCommentRate.vue';
    /*以下为搭乘统计统计*/
    import ridereport from "./rideReport.vue";
    /*以下为票务实时情况*/
    import real from "./busRealTimeInfo.vue";

    import singlebus from "../components/singleLineBusData.vue";
    import stationsignupnums from "../components/stationSignupNums.vue";

     // 引入基本模板
    let echarts = require('echarts/lib/echarts');


    // 引入组件
    require('echarts/lib/chart/bar');
    require('echarts/lib/chart/line');

    let carpoolOps = null;
    export default{
        ready () {
            let that = this;
            this.init();
            //  防止echarts多次注册点击事件
            this.echartsMain2 = echarts.init(document.getElementById('main2'));

                that.echartsMain2.on('click', function (params) {
                    // 判断点击的是文字,还是数据柱子
                    let index = params.dataIndex?params.dataIndex:that.initClassesEchartsData['xArr'].indexOf(params.value);
                    that.isShowStationSignupNumsDetailDialog = true;
                    that.selectedStation = that.initClassesEchartsData['originalData'][index];
                    that.selectClassesName = that.selectedStation.station.shuttle_bus.shuttle_name + '.' + that.selectedStation.station.station_name ;
                });

        },
        data:function(){
            return {
                // 以下为线路统计
                selectedDay: '最近7天',
                ride_num:'0',//搭乘总数,
                per_day_ride_rate:'0',//搭乘率
                shuttle_bus_cnt:'0',//巴士总数,
                good_comment_rate:'0',//好评率,
                station_cnt:'0',//站点总数
                isShowPassDialog:false,
                isShowCommentDialog:false,
                datapass: this.selectedDay,
                lineData: this.selectedDay,
                commentData: this.selectedDay,
                isShowStationSignupNumsDetailDialog: false,
                selectedStation: {},
                isShowLineReport:true,
                currentTab:1, // 当前的tab
                isShowLineData: false,
                startDateInput:0,
                endDateInput:0,
                itemsLoading:true,
                // 以下为搭乘统计
                isShowRideReport:false,

                // 以下为票务实时情况
                isShowRealTime: false,
                shuttle_type:-10,

                // 搜索线路
                isDepartmentFocus:false,
                selectLineName:'',
                lineNameData:[],
                initLineEchartsData:{},
                lineStartValue:0,
                lineEndValue:9,

                // 搜索班次
                selectClassesName:'',
                classesNameData:[],
                initClassesEchartsData:{},
                classesStartValue:0,
                classesEndValue:10,

                // echarts实例对象
                echartsMain2:''
            }
        },
        filters: {
            // 截取时间字符串
            formatDate(time) {
                return time.substring(11,16);
            }
        },
        methods: {
            init:function () {
                this.itemsLoading = true;
                carpoolOps = {
                    param:{
                        search:'',
                        approval_status:'',
                        order_status:'',
                        is_carpool:false,
                        is_urgent:'',
                    },
                    page:1,
                    page_size:500,
                };
                this.startDateInput = moment().add(-1, "days").format('YYYY-MM-DD');
                this.endDateInput = moment().format('YYYY-MM-DD');

                new Kalendae.Input('J-end-outer-date-line', {
                    months: 2,
                    clickHide:true
                });
                new Kalendae.Input('J-start-outer-date-line', {
                    months: 2,
                    clickHide:true
                });

                // 以下为线路统计模块
                this.topStation();
                this.carryRate();
                this.averageRate();
                let that  = this;
                window.onresize = function(){
                    that.topStation();
                    that.averageRate();
                }
                let pageParams = {
                    page:1,
                    page_size:100
                }

                //获取巴士列表
                $.ajax({
                    url: base.gAjaxUrl.shuttlebuses2,
                    type: 'GET',
                    data:pageParams
                })
                        .always((data)=>{
                            base.ajaxCallback(data,()=>{
                                that.busItem = data.results;
                            })
                        })
                let RealpageParams = {
                    page:1,
                    page_size:100
                }
            },
            // 以下为线路统计模块
            passDialogClose:function(data){
                this.isShowPassDialog = false;
            },
            commentDialogClose:function(data){
                this.isShowCommentDialog = false;
            },
            lineDialogClose: function () {
                this.isShowLineData = false;
            },
            stationsignupnumsDialogClose: function(){
                this.isShowStationSignupNumsDetailDialog = false;
            },
            commentRate: function(){
                localStorage.good_comment_rate = this.good_comment_rate;
//                let x = document.getElementById("selectId").selectedIndex;
//                localStorage.selectindex = x;
                this.isShowCommentDialog = true;
            },
            passNumber: function(){
                localStorage.ride_num = this.ride_num;
//                let x = document.getElementById("selectId").selectedIndex;
//                localStorage.selectindex = x;
                this.isShowPassDialog = true;
            },
            // 选择改变，重调用数据画图形
            allchange: function(){
                if(moment(this.endDateInput).isBefore(this.startDateInput)){
                    layer.msg("开始时间不能大于结束时间",{icon:2,time:1500});
                    return
                }
                this.itemsLoading = true;
                this.carryRate();
                this.topStation();
                this.averageRate();
            },
            // 搭乘总人数与总好评率 ，线路总数
            carryRate: function(){
                let that = this;
                $.ajax({
                    type: "GET",
                    url: `${base.gAjaxUrl.shuttlebusdates2}data/`,
                    contentType: 'application/json',
                    data: {
                        start_date: that.startDateInput,
                        end_date: that.endDateInput,
                    },
                    success: function(data){
                        that.ride_num = data.ride_num;
                        that.per_day_ride_rate = data.per_day_ride_rate;
                        that.shuttle_bus_cnt = data.shuttle_bus_cnt;
                        that.good_comment_rate = data.good_comment_rate * 100;
                        that.station_cnt = data.station_cnt;
                    },
                    error: function(data){
                        console.log('总数出错了');
                    },
                    complete: function () {
                        this.itemsLoading = false;
                    }
                });
            },
            // 各线路搭载分析
            averageRate : function(){
                let that = this;
                $.ajax({
                    type: "GET",
                    url: `${base.gAjaxUrl.shuttlebuses2}avg_busline_load_rates/`,
                    contentType: 'application/json',
                    data: {

                        start_date: that.startDateInput,
                        end_date: that.endDateInput,
                    },
                    success: function(data){
                        // let resultDataRate = data[0];
                        let xArr = [];
                        let minrateArr = [];
                        let maxrateArr = [];
                        let avgrateArr = [];

                        // for (let i = 0; i < lineLen; i++) {/**/
                        $.each(data, function(index, elem){
                            // console.log(index, elem);
                            // 线路的数量
                            // 线路名称
                            let shuttle_name = elem.shuttle_name;
                            xArr.push(elem.shuttle_name);

                            //最低载率
                            minrateArr.push(elem.min_rate);

                            //最高载率
                            // let busTimesLen = elem.bus_times.length - 1;
                            // let maxrate = (elem.bus_times[busTimesLen].load_rate * 100).toFixed(2)*1;
                            maxrateArr.push(elem.max_rate);

                            // 总平均载率
//                            let avgrate = ((minrate + maxrate)/2).toFixed(1)*1;
//
                            avgrateArr.push(elem.avg_rate);
                            // return [xArr,minrateArr,maxrateArr,avgrateArr];
                        })
                        that.lineNameData = xArr;
                        let dataObj = {
                            xArr:xArr,
                            minrateArr:minrateArr,
                            maxrateArr:maxrateArr,
                            avgrateArr:avgrateArr,
                            originalData:data,
                        }

                        that.initLineEchartsData = dataObj;
                        that.initLineEcharts(dataObj)
                    },
                    error: function(data){
                        console.log('数据列表出错了');
                    },
                    complete: function (){
                        that.itemsLoading = false;
                    }
                });
            },
            initLineEcharts:function (data) {
                let that = this;
                let option = {
                    // backgroundColor: "#344b58",
                    "title": {
                        "text": "线路搭载率",
                        x: "0%",
                        y: "5%",
                        textStyle: {
                            color: '#666',
                            fontSize: '18'
                        },
                        // subtext: '线路搭载率',
                        // subtextStyle: {
                        //     color: '#333',
                        //     fontSize: '16',
                        // },
                    },
                    'toolbox': {
                        show : true,
                        orient: 'horizontal',      // 布局方式，默认为水平布局，可选为： 'horizontal' ¦ 'vertical'
                        x: '84%',  // 水平安放位置，默认为全图右对齐，可选为：'center' ¦ 'left' ¦ 'right'
                        // ¦ {number}（x坐标，单位px）
                        y: '5%', // 垂直安放位置，默认为全图顶端，可选为：// 'top' ¦ 'bottom' ¦ 'center'
                        // ¦ {number}（y坐标，单位px）
                        // 各工具盒的颜色设置
                        color : ['red','blue','blue','green','red','blue','blue','green','black'],
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    "tooltip": {
                        "trigger": "axis",
                        "axisPointer": {
                            "type": "shadow",
                            textStyle: {
                                color: "#fff"
                            }
                        },
                    },
                    "grid": {
                        "borderWidth": 0,
                        "top": 110,
                        "bottom": 95,
                        textStyle: {
                            color: "#000"
                        }
                    },
                    "legend": {
                        x: '43%',
                        top: '5%',
                        textStyle: {
                            color: '#000',
                        },
                        "data": ['最低载率', '最高载率', '总平均载率']
                    },
                    "calculable": true,
                    "xAxis": [{
                        "type": "category",
                        "axisLine": {
                            lineStyle: {
                                color: '#000'
                            }
                        },
                        "splitLine": {
                            "show": false
                        },
                        "axisTick": {
                            "show": false
                        },
                        "splitArea": {
                            "show": false
                        },
                        "axisLabel": {
                            "interval": 0,
                            "rotate":15
                        },
                        "data": data['xArr'],
                        "name": "线路名称"

                        // "axisLabel": {
                        //     interval:0,
                        //     rotate:15
                        // },
                    }],
                    "yAxis": [{
                        "type": "value",
                        "splitLine": {
                            "show": false
                        },
                        "axisLine": {
                            lineStyle: {
                                color: '#000'
                            }
                        },
                        "axisTick": {
                            "show": false
                        },
                        "axisLabel": {
                            "interval": 0,

                        },
                        "splitArea": {
                            "show": false
                        },
                        "name": "(%)   "
                        // "splitNumber":1,
                        // "min": 0,
                        // "max": 100

                    }],
                    "dataZoom": [{
                        "height": 15,
                        "show" : true,
                        "realtime" : true,
                        // "start" : 0,
                        // "end" : parseInt((8.0 / avgrateArr.length) * 100),
                        startValue:that.lineStartValue,                           //数据窗口范围的起始数值
                        endValue:that.lineEndValue,
                        "bottom": 0,
                        "zoomLock": true
                        // 数据缩放锁，默认为false，当设置为true时选择区域不能伸缩，即(end - start)值保持不变，仅能做数据漫游
                    }],
                    "series": [

                        {
                            "name": "最低载率",
                            "type": "bar",
                            "stack": "总量",
                            "barMaxWidth": 35,
                            "barGap": "10%",
                            "itemStyle": {
                                "normal": {
                                    "color": "rgba(255,144,128,1)",
                                    "label": {
                                        "show": true,
                                        "textStyle": {
                                            "color": "#fff"
                                        },
                                        "position": "insideTop",
                                        formatter: function(p) {
                                            return (p.value > 0 ? (p.value) : '');
                                        }
                                    }
                                }
                            },
                            //设置柱的宽度，要是数据太少，柱子太宽不美观~
                            barWidth:32,
                            "data": data["minrateArr"],
                        },

                        {
                            "name": "最高载率",
                            "type": "bar",
                            "stack": "总量",
                            "itemStyle": {
                                "normal": {
                                    "color": "rgba(0,191,183,1)",
                                    "barBorderRadius": 0,
                                    "label": {
                                        "show": true,
                                        "position": "top",
                                        formatter: function(p) {
                                            return p.value > 0 ? (p.value) : '';
                                        }
                                    }
                                }
                            },
                            //设置柱的宽度，要是数据太少，柱子太宽不美观~
                            barWidth:30,
                            "data": data["maxrateArr"]
                        },
                        {
                            "name": "总平均载率",
                            "type": "line",
                            symbolSize:8,
                            symbol:'circle',
                            // 设置柱的宽度，要是数据太少，柱子太宽不美观~
                            barWidth:8,
                            "itemStyle": {
                                "normal": {
                                    "color": "#07A5E5",
                                    "barBorderRadius": 0,
                                    "label": {
                                        "show": true,
                                        "position": "top",
                                        formatter: function(p) {
                                            return p.value > 0 ? (p.value) : '';
                                        }
                                    }
                                }
                            },
                            "data": data["avgrateArr"]
                        },
                    ]
                };

                let myChart = echarts.init(document.getElementById('main1'));
                myChart.setOption(option);
                myChart.on('click', function (params) {
                    that.selectLineName = params.name
                    that.isShowLineData = true;
                    that.lineSelected = data['originalData'][params.dataIndex];
                });
            },
            // 搭乘人数最少站点Top20
            topStation: function() {
                let that = this;
                $.ajax({
                    type: "GET",
                    url: `${base.gAjaxUrl.shuttlebuses2}avg_stations_signup_nums/`,
                    contentType: 'application/json',
                    data: {
                        shuttle_type:that.shuttle_type,
                        start_date: that.startDateInput,
                        end_date: that.endDateInput,
                        // limit: 20
                    },
                    success: function(data){
                        let resultDataStat = data.signup_nums;
                        let xArr = [];
                        let stationIdArr = [];
                        let orderArr = []; // 报名人数
                        let checkArr = []; // 搭乘人数
                        let noCheckArr = []; // 未搭乘人数
                        let dataObj = {};
                        let originalData = [].concat(resultDataStat);
                        $.each(resultDataStat, function(index, elem){
                            // 站点名称
                            let station_name = elem.station.station_name;
                            // 这里是广丰的需求,去程的情况下,不显示广汽丰田这个终点站
                            if(that.shuttle_type == -10 && station_name == '广汽丰田' && window.localStorage.companyID == '76d3d1dd-413a-48de-94fe-3e9de3f66bcc'){
                                originalData.splice(originalData.indexOf(elem),1);
                                return true
                            }
                            let shuttle_bus = elem.station.shuttle_bus.shuttle_name;
                            xArr.push(shuttle_bus +"."+ station_name);
                            // 各站点搭载人数
                            let id = elem.station.id;
                            stationIdArr.push(id);
                            orderArr.push(elem.order_cnt);
                            checkArr.push(elem.check_cnt);
                            noCheckArr.push(elem.nocheck_cnt);
                        })
                        that.classesNameData = xArr;
                        dataObj = {
                            xArr:xArr,
                            stationIdArr:stationIdArr,
                            orderArr:orderArr,
                            checkArr:checkArr,
                            noCheckArr:noCheckArr,
                            originalData:originalData
                        }

                        that.initClassesEchartsData = dataObj;
                        that.initClassesEcharts(dataObj)
                    },
                    error: function(data){
                        console.log('数据列表出错了');
                    },
                    complete: function (){
                        that.itemsLoading = false;
                    }
                });
            },
            initClassesEcharts:function (data) {
                let that = this;
                let option = {
                    title: {
                        // text: "各站点搭乘人数分析",
                        text: "站点搭乘统计",
                        x: "0%",
                        y: "5%",
                        textStyle: {
                            color: '#666',
                            fontSize: '18'
                        },
                        // subtext: '搭乘人数最少站点Top20',
                        // subtextStyle: {
                        //     color: '#333',
                        //     fontSize: '16',
                        // },
                    },
                    tooltip : {
                        trigger: 'axis',
                        "axisPointer": {
                            "type": "shadow",
                            textStyle: {
                                color: "#fff"
                            }
                        },
                    },
                    toolbox: {
                        show : true,
                        orient: 'horizontal',    // 布局方式，默认为水平布局，可选为： 'horizontal' ¦ 'vertical'
                        x: '84%',  // 水平安放位置，默认为全图右对齐，可选为： 'center' ¦ 'left' ¦ 'right'
                        // ¦ {number}（x坐标，单位px）
                        y: '5%',   // 垂直安放位置，默认为全图顶端，可选为： 'top' ¦ 'bottom' ¦ 'center'
                        // ¦ {number}（y坐标，单位px）
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    legend: {
                        // x: '43%',
                        top: '5%',
                        data:['报名人数','搭乘人数','未搭乘人数'],
                        color:"#d3dee5",
                        // data:['最差站点Top20','平均温度']
                    },
                    grid: {
                        bottom:100,
                        top:100,
                    },
                    "dataZoom": [{
//                                 y:430,
//                         "height": 15,
//                         "show" : true,
//                         "realtime" : true,
//                         // "start" : 0,
//                         // "end" : parseInt((8.0 / avgrateArr.length) * 100),
//                         startValue:that.lineStartValue,                           //数据窗口范围的起始数值
//                         endValue:that.lineEndValue,
//                         "bottom": 0,
//                         "zoomLock": true
                        "height": 15,
                        "show" : true,
                        "realtime" : true,
                        // "start" : 0,
                        // "end" : parseInt((10.0 / stationIdArr.length) * 100),
                        "startValue":that.classesStartValue,
                        "endValue":that.classesEndValue,
                        "bottom": 0,
                        "zoomLock": true
                        // 数据缩放锁，默认为false，当设置为true时选择区域不能伸缩，即(end - start)值保持不变，仅能做数据漫游
                    }],
                    xAxis : [
                        {
                            type : 'category',
                            data : data['xArr'], //横坐标数据
                            triggerEvent:true, // X轴坐标文字是否可以点击
                            axisLabel: {
                                interval:0,
                                rotate:15,
                                formatter:function(value)
                                {
                                    return value.split(".").join("\n");
                                }
                            },
                            name: "站点名称",
                            color: "#000",
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            name : '',
                            axisLabel : {
                                formatter:function(value)
                                {
                                    if(value % 1 === 0){
                                        return value + "人";
                                    }
                                    return
                                }
                            },
                            color: "#000",
                        },
                    ],

                    series : [
                        {
                            name:'报名人数',
                            type:'bar',
                            data: data['orderArr'], //报名人数数据
                            itemStyle: {
                                normal: {
                                    color: '#b6a2de',
                                    label: {
                                        show: true,
                                        position: 'top',
                                        textStyle: {
                                            color: '#b6a2de'
                                        },
                                        formatter:function(params){
                                            if(params.value==0){
                                                return '';
                                            }else
                                            {
                                                return params.value;
                                            }
                                        }
                                    }
                                }
                            },
                            //设置柱的宽度，要是数据太少，柱子太宽不美观~
                            barWidth:25,
                        },
                        {
                            name:'未搭乘人数',
                            type:'bar',
                            stack:'pile',  // 实现堆叠的柱状图,stack只是一个名称,名称相同就会堆叠
                            data: data['noCheckArr'], //报了名但是未搭乘数据
                            zlevel:10,
                            itemStyle: {
                                normal: {
                                    color: '#c23531',
                                    label: {
                                        show: true,
                                        position: 'top',
                                        textStyle: {
                                            color: '#c23531',
                                        },
                                        formatter:function(params){
                                            if(params.value==0){
                                                return '';
                                            }else
                                            {
                                                return params.value;
                                            }
                                        },

                                    },

                                }
                            },
                            //设置柱的宽度，要是数据太少，柱子太宽不美观~
                            barWidth:25,
                        },
                        {
                            name:'搭乘人数',
                            type:'bar',
                            stack:'pile',  // 实现堆叠的柱状图,stack只是一个名称,名称相同就会堆叠
                            data: data['checkArr'],// 搭乘人数数据
                            // data: aboard_nums,//纵坐标数据
                            itemStyle: {
                                normal: {
                                    color: '#2ec7c9',
                                    label: {
                                        show: true,
                                        position: 'top',
                                        textStyle: {
                                            color: '#2ec7c9'
                                        },
                                        formatter:function(params){
                                            if(params.value==0){
                                                return '';
                                            }else
                                            {
                                                return params.value;
                                            }
                                        }
                                    }
                                }
                            },
                            //设置柱的宽度，要是数据太少，柱子太宽不美观~
                            barWidth:25,
                        },
                    ]
                };

                that.echartsMain2.setOption(option,true);

            },
            lineReport:function(){
                this.currentTab = 1;
                this.init();
                this.isShowLineReport = true;
                this.isShowRideReport = false;
                this.isShowRealTime = false;

            },
            rideReport:function(){
                this.currentTab = 2;
                this.isShowLineReport = false;
                this.isShowRideReport = true;
                this.isShowRealTime = false;
            },
            realTime:function(){
                this.currentTab = 3;
                this.isShowLineReport = false;
                this.isShowRideReport = false;
                this.isShowRealTime = true;
            },
            clickShuttle: function(type){
                this.itemsLoading = true;
                this.shuttle_type = type;
                this.selectClassesName = '';
                this.topStation();
            },
            departmentEnter: function (flag,e) {
                this.isDepartmentFocus = flag;
                !flag && $(e.target).children(".departmentListBox").hide();
            },
            departmentClick: function (e) {
                if(this.isDepartmentFocus) {
                    $(e.target).nextAll(".departmentListBox").show();
                }
            },
            // 清除搜索输入框
            emptySearch:function(e,type){
                if(type){
                    this.selectClassesName ='';
                }else{
                    this.selectLineName = '';
                }

                $(e.target).nextAll(".departmentListBox").show();
            },
            setDepartmentValue: function (item,e) {
                this.selectLineName = item;
                let index = this.lineNameData.indexOf(item);
                if((index + 10) >= this.lineNameData.length){
                    this.lineStartValue = this.lineNameData.length - 10;
                    this.lineEndValue = this.lineNameData.length - 1;
                }else{
                    this.lineStartValue = index;
                    this.lineEndValue = index + 10;
                }
                this.initLineEcharts(this.initLineEchartsData);
                $(e.target).parent(".departmentListBox").hide();
            },
            searchClasses:function (item,e) {
             this.selectClassesName = item;
                let index = this.classesNameData.indexOf(item);
                if((index + 10) >= this.classesNameData.length){
                    this.classesStartValue = this.classesNameData.length - 10;
                    this.classesEndValue = this.classesNameData.length - 1;
                }else{
                    this.classesStartValue = index;
                    this.classesEndValue = index + 10;
                }
                this.initClassesEcharts(this.initClassesEchartsData);
                $(e.target).parent(".departmentListBox").hide();
            }
        },

        components:{
            passnumber,
            datacomment,
            real,
            singlebus,
            ridereport,
            stationsignupnums,
        }
    }
</script>

