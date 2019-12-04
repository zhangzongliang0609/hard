<template>
    <comment v-if="isShowAddDialog" :data="dialogData" v-on:dialog-close="addDialogClose" v-on:dialog-save="addDialogSave"></comment>
    <section class="Hui-article-box">
    <div class="page-container">
        <div class="cl pd-5 bg-1 bk-gray">
            <span class="l">
                <a class="l btn btn-primary radius" href="javascript:;" v-on:click="clickgoBack()">返回</a>
                <div class="l m-info ml-10">
                    <div class="l item">线路名称:{{busInfoItem.shuttle_name}}</div>
                    <div class="l item">起点:{{busInfoItem['stations_json']['0']?busInfoItem['stations_json']['0']['station_name']:''}}</div>
                    <div class="l item">终点:{{busInfoItem['stations_json'][busInfoItem['stations_json'].length-1]?busInfoItem['stations_json'][busInfoItem['stations_json'].length-1]['station_name']:''}}</div>
                    <!--<div class="l item">开车时间:{{busInfoItem.departure_time}}</div>-->
                    <!-- <div class="l item">报名截止时间:{{busInfoItem.job_number}}</div> -->
                    <div class="l item">座位数:{{busInfoItem.seats}}</div>
                    <div class="l item">价格:{{busInfoItem.price/100}}</div>
                </div>
            </span>
        </div>
        <div class="text-l mt-20">
            <!-- 状态：
            <span class="select-box inline mr-5">
                <select v-model="statusSelected" name="" class="select">
                    <option value="">全部</option>
                    <option v-bind:value="item.id" v-for="item in departmentItem">{{item.department_name}}</option>
                </select>
            </span>  -->
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
                        <!--<td>{{item.departure_date}} {{item.bus_time_vo?item.bus_time_vo.departure_time:item.departure_time}}（{{item.bus_time_vo?item.bus_time_vo.shuttle_type_name:''}}）</td>-->
                        <!--<td>{{item.departure_date}}</td>-->
                        <!--<td>{{item.bus_time_vo.departure_time?item.bus_time_vo.departure_time:item.departure_time}}</td>-->
                        <td>{{item.departure_datetime}}（{{item.bus_time_vo?item.bus_time_vo.shuttle_type_name:''}}）</td>
                        <td>{{item.status_name}}</td>
                        <td>{{item.score}}</td>
                        <td>{{item.order_cnt}}</td>
                        <td>{{item.remaining_seats}}</td>
                        <td>{{item.check_order_cnt}}</td>
                        <td><div class="btn btn-link size-S radius" v-on:click="clickCheck(item)">乘客及评价</div></td>
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

<style lang="less">
</style>

<script>
    import * as base from '../assets/js/base.js';
    import comment from "../components/comment.vue";
    import moment from "moment";

    let rideDetailReportOps = null;

    export default{
        ready () {
            let that = this;
            alert("ready");
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

            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-page',tpageToal,count)
            });
        },
        data:function(){
            return {
                isShowAddDialog:false,
                busInfoItem:JSON.parse(localStorage["busInfo"]),
                itemsLoading:true,
                items: [],
                noData:false,
                searchInput:'',
                startDateInput:'2017-08-01',
                endDateInput:'2017-09-01',
                statusSelected:'',
                departmentItem:[],
                dialogData:'',
            }
        },
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
                alert(1111)
                rideDetailReportOps.param.search = this.searchInput;
                rideDetailReportOps.param.start_date = this.startDateInput;
                rideDetailReportOps.param.end_date = this.endDateInput;

                $.ajax({
                    url: `${base.gAjaxUrl.shuttlebuses2}${this.busInfoItem['id']}/detail_report/?page=${rideDetailReportOps.page}&page_size=${rideDetailReportOps.page_size}`,
                    contentType: 'application/json',
                    type: 'POST',
                    data:JSON.stringify(rideDetailReportOps.param)
                })
                .always((data)=>{
                    base.ajaxCallback(data,()=>{
                        let resultData = data.results;
                        this.itemsLoading = false;
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
                this.dialogData=data;
                this.isShowAddDialog = true;
            }

        },
        components:{
            comment
        }
    }
</script>
