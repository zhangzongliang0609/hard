

<template>
    <section class="Hui-article-box">
    <div class="page-container">
        <div class="cl pd-5 bg-1 bk-gray">
            <span class="l">
                <a class="l btn btn-primary radius" href="javascript:;" v-on:click="clickgoBack()">返回</a>
                <div class="l m-info ml-10">
                    <div class="l item">司机名称:{{detail.staff_vo.real_name}}</div>
                    <!--<div class="l item">起点:{{detail.stations_json && detail.stations_json.length > 1?detail.stations_json[0].station_name:'&#45;&#45;'}}</div>-->
                    <!--<div class="l item">终点:{{detail.stations_json && detail.stations_json.length > 1?detail.stations_json[detail.stations_json.length-1].station_name:'&#45;&#45;'}}</div>-->
                    <!--<div class="l item">开车时间:{{detail.departure_time}}</div>-->
                    <!-- <div class="l item">报名截止时间:{{detail.job_number}}</div> -->
                    <div class="l item">性别:{{detail.staff_vo.sex==1? '男': '女'}}</div>
                    <div class="l item">手机号码:{{detail.staff_vo.phone}}</div>
                     <div class="l item">工号:{{detail.staff_vo.job_number}}</div>
                     <div class="l item">出车次数:{{detail.order_cnt}}</div>
                </div>
            </span>
        </div>
        <div class="text-l mt-20">
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
                        <th>起点</th>
                        <th>终点</th>
                        <th>日期</th>
                        <th>出发时间</th>
                        <th>车牌号</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <div class="result" v-if="!noData">
                <tbody>
                    <tr class="text-c" v-for="item in items">
                        <!--<td>{{item.departure_date}} {{item.bus_time_vo?item.bus_time_vo.departure_time:item.departure_time}}（{{item.bus_time_vo?item.bus_time_vo.shuttle_type_name:''}}）</td>-->
                        <!--<td>{{item.departure_date}}</td>-->
                        <!--<td>{{item.bus_time_vo.departure_time?item.bus_time_vo.departure_time:item.departure_time}}</td>-->
                        <td>{{item.shuttlebus_name}}</td>
                        <td>{{item.stations[0]}}</td>
                        <td>{{item.stations[item.stations.length-1]}}</td>
                        <td>{{item.departure_date}}</td>
                        <td>{{item.departure_time}}</td>
                        <td>{{item.car_no}}</td>
                        <td>
                            <a class="btn btn-link size-S radius" href="javascript:;" v-on:click="checkRideInfo(item)">轨迹查询</a>
                        </td>
                    </tr>
                </tbody>
                </div>
            </table>
            <div id="J-page" class="m-page" v-show="!noData"></div>
        <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
    </div>
    </section>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>

<style lang="less">
</style>

<script type="text/ecmascript-6">
    import * as base from '../../assets/js/base.js';
    import moment from "moment";
    import driver from "../../views/driver";

    let rideDetailReportOps = null;

    export default{
        ready () {
            let that = this;
            rideDetailReportOps = {
                param:{
                    start_date:'',
                    end_date:''
                },
                page:1,
                page_size:10,
            };
            this.startDateInput = moment().add('-1','months').format('YYYY-MM-DD');
            this.endDateInput = moment().format('YYYY-MM-DD');

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

            })

            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-page',tpageToal,count)
            });
        },
        data:function(){
            return {
                isShowAddDialog:false,
                itemsLoading:true,
                items: [],
                noData:false,
                searchInput:'',
                startDateInput:'',
                endDateInput:'',
                statusSelected:'',
                departmentItem:[],
                dialogData:'',
                isShowRideInfoDialog: false, // 搭乘人员详情
                rideInfoData: null, // 搭乘名单详情
            }
        },
        props:['detail'],
        methods: {
            addDialogClose:function(data){
                this.isShowAddDialog = false;
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
                this.itemsLoading = true;
                //修改参数
                // rideDetailReportOps.param.search = this.searchInput;
                // rideDetailReportOps.param.start_date = this.startDateInput;
                // rideDetailReportOps.param.end_date = this.endDateInput;

                $.ajax({
                    url: `${base.gAjaxUrl.ferryBusDriver}${this.detail.id}/worker_detail/`,
                    contentType: 'application/json',
                    type: 'GET',
                    data:{
                        start_date:this.startDateInput,
                        end_date:this.endDateInput
                    }
                })
                .always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
                        let resultData = data.results.rows;
                       // for(let i=0;i<resultData.)
                        this.items = resultData;
                        if(resultData.length){
                            this.noData = false;
                            //回调
                            callback(data.num_pages,data.count);
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
                //重置第一页
                rideDetailReportOps.page = 1

                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-page',tpageToal,count)
                });
            },
            //返回
            clickgoBack:function(){
                this.$dispatch("detail-close");
//                this.$route.router.go({path: '/busInfoReport', replace: true})
            },
            clickCheck:function(data){
                this.dialogData=data;
                this.isShowAddDialog = true;
            },
            rideInfoDialogClose:function(data){
                this.isShowRideInfoDialog = false;
            },
            checkRideInfo: function(data){
             this.$router.go('/ferryBusLocationReview')
                console.log(data)
               localStorage.bus_id=data.vehicle;
               localStorage.driver_date=data.departure_date

            }

        },

    }
</script>
