<template>
    <comment v-if="isShowAddDialog" :data="dialogData" v-on:dialog-close="addDialogClose" v-on:dialog-save="addDialogSave"></comment>
    <station v-if="isShowStationDialog" :station="stationData" v-on:dialog-close="stationDialogClose"></station>
    <ride v-if="isShowRideInfoDialog" :data="rideInfoData" v-on:dialog-close="rideInfoDialogClose"></ride>
    <travel v-if="showTravel" @dialog-close="closeTravel" :data="travelData" :finish="routeFinish" :title="title"></travel>
    <section class="Hui-article-box">
    <div class="page-container">
        <div class="text-l mt-20">
            <!--<div class="row cl inline-block">-->
                <div class=" f-l cl line-control">
                    <div class="form-label f-l  text-r mr-5 mt-5 select-department">线路名称:</div>
                    <div class="formControls f-l">
                        <div class="department_select_container" @mouseleave="departmentEnter(false,$event)" @mouseenter="departmentEnter(true,$event)">
                            <input v-if="busItem.length === 0" disabled type="text" class="input-text" value="无可选择线路">
                            <input v-else autocomplete="off" @click="departmentClick($event)" v-model="selectedLineName" type="text" class="input-text" value="" placeholder="" name="department">
                            <i v-show="selectedLineName !== ''" class="empty-icon Hui-iconfont" @click="emptySearch($event)">&#xe60b;</i>
                            <div class="departmentListBox" style="display: none">
                                <div v-bind:title="item" track-by="$index"  v-for="item in busItem | filterBy selectedLineName in 'shuttle_name'" @click="setDepartmentValue(item,$event)" class="departmentListItem">{{item.shuttle_name}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            <!--</div>-->
            <!---->
            去/返程:
            <span class="select-box inline mr-5">
            <select @change="showBusTime(shuttleType)" name="" id="shuttleType" v-model="shuttleType" class="select">
                <option value="">全部</option>
                <option value="-10">去程</option>
                <option value="10">返程</option>
            </select>
            </span>
            <div class="inline-block" v-show="isShowBusTime">
                巴士班次:
                <span class="select-box inline mr-5">
                <select v-model="busTimeId" name="" class="select">
                    <option value="">全部</option>
                    <option v-bind:value="item.id" v-for="item in bus_times" >{{item.departure_time}}</option>
                </select>
            </span>
            </div>

            开始日期：
            <input v-model="startDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-start-date" v-bind:value="startDateInput">
            结束日期：
            <input v-model="endDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-end-date" v-bind:value="endDateInput">
            <button type="submit" class="btn btn-success radius" v-on:click="getList()"><i class="Hui-iconfont">&#xe665;</i></button>
            <!-- <a class="btn btn-primary radius f-r" href="javascript:;" v-on:click="">导出数据</a> -->
        </div>
            <table class="table table-border table-bordered table-hover table-bg mt-20" >
                <thead>
                    <tr class="text-c">
                        <th>线路名称</th>
                        <th>出发时间</th>
                        <!--<th>开车日期</th>-->
                        <!--<th>开车时间</th>-->
                        <th>状态</th>
                        <th>平均评分</th>
                        <th>报名数</th>
                        <th>剩余座位数</th>
                        <th>搭乘数</th>
                        <th>查看</th>
                    </tr>
                </thead>
                <div class="result" v-if="!noData">
                <tbody>
                    <tr class="text-c" v-for="item in items">
                        <td>{{item.shuttle_name}}</td>
                        <td>{{item.departure_datetime}} {{item.bus_time_vo?item.bus_time_vo.shuttle_type_name:''}}</td>
                        <!--<td>{{item.departure_date}}</td>-->
                        <!--<td>{{item.bus_time_vo.departure_time?item.bus_time_vo.departure_time:item.departure_time}}</td>-->
                        <td>{{item.status_name}}</td>
                        <td>{{item.score}}</td>
                        <td>{{item.order_cnt}}</td>
                        <td>{{item.seats-item.order_cnt}}</td>
                        <td>{{item.check_order_cnt}}</td>
                        <td>
                            <div class="btn btn-link size-S radius" v-on:click="clickCheck(item)">{{item.status==30||item.status==40?"评价":""}}</div>
                            <div class="btn btn-link size-S radius" v-on:click="checkStation(item)">站点统计</div>
                            <div class="btn btn-link size-S radius" v-on:click="checkRideInfo(item)">搭乘信息</div>
                            <div class="btn btn-link size-S radius"
                                 v-if="item.status_name=='已发车' && locationConfig.cat_map && locationConfig.bus_cat_map"
                                 v-on:click="checkTravel(item)">行驶情况</div>
                            <div class="btn btn-link size-S radius"
                                 v-if="item.status_name=='已结束' && locationConfig.cat_map && locationConfig.bus_cat_map"
                                 v-on:click="checkTravel(item,true)">行驶统计</div>
                        </td>
                    </tr>
                </tbody>
                </div>
            </table>
            <div id="J-page" class="m-page" v-show="!noData"></div>
            <div class="m-loading" v-if="itemsLoading">
                <div class="cube1"></div>
                <div class="cube2"></div>
            </div>

        <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
    </div>
    </section>
</template>

<style lang="less" scoped>
    #shuttleType{
        width: 100px;
    }
    .line-control{
        width: 300px;
    }
    .formControls{
        width: 75%;
    }
</style>


<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import comment from "../components/comment.vue";
    import station from "../components/orderStationStatistics.vue";
    import ride from "../components/rideInfo.vue";
    import travel from "../components/travelCondition";
    import moment from "moment";

    let rideDetailReportOps = null;

    export default{
        ready () {
            let that = this;
            rideDetailReportOps = {
                param:{
                    search:'',
                            start_date:'',
                            end_date:''
                },
                page:1,
                        page_size:10,
            };
            this.startDateInput = moment().add('-1','months').format('YYYY-MM-DD');
            this.endDateInput = moment().format('YYYY-MM-DD');
            this.objData = {
                start_date : this.startDateInput,
                end_date : this.endDateInput,
            }

            new Kalendae.Input('J-end-date', {
                months: 2,
            });
            new Kalendae.Input('J-start-date', {
                months: 2,
            });

            //获取部门列表
            $.ajax({
                url: base.gAjaxUrl.departments,
                type: 'GET',
            })
            .always((data)=>{
                this.departmentItem = data || [];

            });
            //获取巴士列表
            $.ajax({
                url: base.gAjaxUrl.shuttlebuses2,
                type: 'GET',
                data:{
                    page:1,
                    page_size:999999
                }
            })
            .always((data)=>{
                this.busItem = data.results;

            });

            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-page',tpageToal,count)
            });

            this.getLocationConfig();
        },
        data:function(){
            return {
                isShowAddDialog:false,
                isShowStationDialog: false,
                isShowRideInfoDialog: false,
                stationData: null,
                rideInfoData: null,
                itemsLoading:true,
                items: [],
                noData:false,
                searchInput:'',
                startDateInput:'2016-08-01',
                endDateInput:'2016-09-01',
                statusSelected:'',
                departmentItem:[],
                dialogData:'',
                busItem:[],
                busSelected:'',
                showTravel:false,
                travelData:{},
                routeFinish:false,
                title:'行驶情况',
                shuttleType:'',
                objData:{},

                // 线路搜索框
                isDepartmentFocus:false,
                selectedLineName:'',
                isShowBusTime:false,
                bus_times:[],
                busTimeId:'',

                locationConfig: {} // 轨迹
            }
        },
        methods: {
            getLocationConfig() {
                $.ajax({
                    url: `${base.gAjaxUrl.baseConfig}cat_map/`,
                    type: 'GET',
                }).always((data) => {
                    base.ajaxCallback(data, () => {
                        this.locationConfig = data;
                    });
                })
            },
            addDialogClose:function(data){
                this.isShowAddDialog = false;
            },
            stationDialogClose:function(data){
                this.isShowStationDialog = false;
            },
            rideInfoDialogClose:function(data){
                this.isShowRideInfoDialog = false;
            },
            //初始化分页
            initPage:function(obj,tpageToal='4',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:1,
                    count:count,
                    callback:(p)=>{
                        rideDetailReportOps.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax:function(callback=function(){}){
                let that = this;
                this.itemsLoading = true;
                //修改参数
                // rideDetailReportOps.param.search = this.searchInput;
                // rideDetailReportOps.param.start_date = this.startDateInput;
                // rideDetailReportOps.param.end_date = this.endDateInput;
                // rideDetailReportOps.param.shuttle_bus = this.busSelected;
                // rideDetailReportOps.param.shuttle_type = this.shuttleType;
                // rideDetailReportOps.param.shuttle_time = this.busTimeId;

                $.ajax({
                    url: `${base.gAjaxUrl.shuttlebuses2}real_time_info/?page=${rideDetailReportOps.page}&page_size=${rideDetailReportOps.page_size}`,
                    contentType: 'application/json',
                    type: 'POST',
                    data:JSON.stringify(that.objData)
                })
                .always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
                        let resultData = data.results;
                        this.items = resultData;
                        if(resultData.length){
                            //回调
//                            console.log("asd"+data.count);
                            callback(data.num_pages,data.count);
                            this.noData = false;
                        }else{
                            this.noData = true;
                        }
                    });
                })
            },
            //获取列表
            getList:function(){

                if(moment(this.endDateInput).isBefore(this.startDateInput)){
                    layer.msg("开始时间不能大于结束时间",{icon:2,time:1500});
                    return
                }
                this.objData = {
                    search : this.searchInput,
                    start_date : this.startDateInput,
                    end_date : this.endDateInput,
                    shuttle_bus : this.busSelected,
                    shuttle_type : this.shuttleType,
                    shuttle_time : this.busTimeId,
                }
                //重置第一页
                rideDetailReportOps.page = 1

                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-page',tpageToal,count)
                });
            },
            //返回
            clickgoBack:function(){
                this.$route.router.go({path: '/busInfoReport', replace: true})
            },
            clickCheck:function(data){
                this.dialogData = data;
                this.isShowAddDialog = true;
            },
            checkStation: function(data){
                this.stationData = data;
                this.isShowStationDialog = true;
            },
            checkRideInfo: function(data){
                this.rideInfoData = data;
                this.isShowRideInfoDialog = true;
            },
            checkTravel:function (data,isFinish) {
                console.log("line data");
                console.log(data);
                if(isFinish){
                    this.routeFinish = true;
                    this.title = '行驶统计';
                }else{
                    this.routeFinish = false;
                    this.title = '行驶情况';
                }
                this.showTravel = true;
                this.travelData = data;
            },
            closeTravel:function () {
                this.showTravel = false;
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
                this.selectedLineName = '';
                this.busSelected = '';
                this.busTimeId = '';
                this.isShowBusTime = false;
                this.shuttleType = '';
                $(e.target).nextAll(".departmentListBox").show();
            },
            setDepartmentValue: function (item,e) {
                this.selectedLineName = item.shuttle_name;
                this.busSelected = item.id;
                this.getBusTime();
                this.busTimeId = '';
                // let index = this.lineNameData.indexOf(item);
                // if((index + 10) >= this.lineNameData.length){
                //     this.lineStartValue = this.lineNameData.length - 10;
                //     this.lineEndValue = this.lineNameData.length - 1;
                // }else{
                //     this.lineStartValue = index;
                //     this.lineEndValue = index + 10;
                // }
                // this.initLineEcharts(this.initLineEchartsData);
                $(e.target).parent(".departmentListBox").hide();
            },
            showBusTime:function (type) {
                    this.busTimeId = '';
                    this.isShowBusTime = true;
                    if(this.selectedLineName){
                        for (var i = 0,len = this.busItem.length; i < len; i++) {
                            if(this.selectedLineName  == this.busItem[i].shuttle_name){
                                this.busSelected = this.busItem[i].id;
                                break
                            }
                        }
                        this.getBusTime()
                    }else{
                        this.bus_times = [];
                        // this.isShowBusTime = false;
                    }

            },
            getBusTime:function () {
                let that = this;
                $.ajax({
                    url: `${base.gAjaxUrl.linebustime}${that.busSelected}/bus_time/`,
                    type: 'GET',
                    data:that.shuttleType?{shuttle_type:that.shuttleType}:{shuttle_type:''},
                }).always((data)=>{
                    base.ajaxCallback(data,function () {
                        that.bus_times = data;
                    })
                });
            },


        },
        components:{
            comment,
            station,
            ride,
            travel,
        }
    }
</script>
