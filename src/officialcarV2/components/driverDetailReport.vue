<template>
    <map :title="dialogTitle" :data="dialogData" v-if="isShowDialog" v-on:dialog-close="dialogClose"></map>
    <section class="Hui-article-box">
        <div class="page-container">
        <div class="cl pd-5 bg-1 bk-gray">
            <span class="l">
                <a class="l btn btn-primary radius" href="javascript:;" v-on:click="clickgoBack()">返回</a>
                <div class="l m-info ml-10">
                    <div class="l item">{{data.real_name}}/{{data.sex==1? '男': '女'}}</div>
                    <div class="l item">电话:{{data.phone}}</div>
                    <div class="l item">工号:{{data.job_number}}</div>
                    <div class="l item">总行驶里程:{{data.mileage_cnt}}</div>
                    <div class="l item">订单数:{{data.trip_cnt}}</div>
                    <div class="l item">行驶时长:{{data.durations |  toInt }}小时{{data.durations % 60}}分钟</div>
                    <div class="l item">订单行驶里程:{{data.order_mileage_cnt}}KM</div>
                </div>
            </span>
        </div>
        <div class="text-l mt-20">
            关键字：
            <input type="text" class="input-text Wdate mr-5" style="width:150px;" placeholder="申请人" id="searchInput">
            开始日期：
            <input v-model="startDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-start-date" v-bind:value="startDateInput">
            结束日期：
            <input v-model="endDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-end-date" v-bind:value="endDateInput">
            <button type="submit" class="btn btn-success radius" v-on:click="getList(1)"><i class="Hui-iconfont">&#xe665;</i></button>
        </div>

            <table class="table table-border table-bordered table-hover table-bg mt-20" >
                <thead>
                    <tr class="text-c">
                        <th>申请人</th>
                        <th>起点</th>
                        <th>终点</th>
                        <th>出发时间</th>
                        <th>结束时间</th>
                        <th>人数</th>
                        <th>车牌号</th>
                        <th>费用</th>
                        <th>评价</th>
                        <!-- <th>行驶里程</th> -->
                        <th>行驶时长</th>
                        <th>行驶路径</th>
                    </tr>
                </thead>
                <div class="result" v-if="!noData">
                <tbody>
                    <tr class="text-c" v-for="item in items">
                        <td>{{item.staff_name}}</td>
                        <td>{{item.trip_vo.source_name}}</td>
                        <td>{{item.trip_vo.destination_name}}</td>
                        <td>{{item.get_on_time}}</td>
                        <td>{{item.get_off_time}}</td>
                        <td>{{item.trip_vo.passenger_number}}</td>
                        <td>{{item.car_no}}</td>
                        <td>{{item.fee ? item.fee / 100 : ''}}</td>
                        <td>{{item.source}}</td>
                        <td>{{item.durations | toInt }}小时{{item.durations % 60}}分钟</td>
                        <td>
                            <a class="btn btn-link size-S radius"
                               href="javascript:;"
                               v-if="locationConfig.cat_map && locationConfig.officialcar2_cat_map"
                               v-on:click="clickCheck(item)">查看路径</a>
                        </td>
                    </tr>
                </tbody>
                </div>
            </table>
            <div id="J-page" class="m-page"  v-show="!noData"></div>
            <div class="m-loading" v-if="!noData && itemsLoading">
                <div class="cube1"></div>
                <div class="cube2"></div>
            </div>
        <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
    </div>
    </section>
</template>

<style lang="less">
</style>

<script type="text/ecmascript-6">
    import * as base from '../../assets/js/base.js';
    import map from "../components/driverShowMap.vue";
    import moment from "moment";
    let rideDetailReportOps = null;

    export default{
        ready () {
            let that = this;
            rideDetailReportOps = {
                param:{
                    search:'',
                    start_date:'',
                    end_date:'',
                    page:1,
                    page_size:10
                },

            };
            this.startDateInput = this.start;
            this.endDateInput = this.end;

            new Kalendae.Input('J-end-date', {
                format:'YYYY-MM-DD',
                months: 2,
            });
            new Kalendae.Input('J-start-date', {
                format:'YYYY-MM-DD',
                months: 2,
            });

            this.queryAjax((tpageToal='4',count='0')=>{
                that.initPage('#J-page',tpageToal,count);
            });

            this.getLocationConfig();
        },
        props:["data","start","end"],
        data:function(){
            return {
                isShowDialog:false,
                dialogTitle:'查看路径',
                dialogData:'',
                itemsLoading:true,
                items: [],
                noData:false,
                searchInput:'',
                startDateInput:'2016-08-01',
                endDateInput:'2016-09-01',

                locationConfig: {} // 轨迹
            }
        },
        filters:{
            toInt: function(e){
                return parseInt( e / 60 )
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
            //初始化分页
            initPage:function(obj,tpageToal='4',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:1,
                    count:count,
                    callback:(p)=>{
                        rideDetailReportOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax:function(callback=function(){}){
                this.itemsLoading = true;
                //修改参数
                rideDetailReportOps.param.search = this.searchInput;
                rideDetailReportOps.param.start_date = this.startDateInput;
                rideDetailReportOps.param.end_date = this.endDateInput;
                rideDetailReportOps.param.driver = this.data.driver_id;
                $.ajax({
                    url: base.gAjaxUrl.officialcarDriverTrip_V2,
                    type: 'GET',
                    data:rideDetailReportOps.param,
                })
                .always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
                        let resultData = data.results;
                        this.items = resultData;
                        if(resultData.length){
                            this.noData = false;
                            //回调
                            callback(data.num_pages,data.count);
                        }else{
                            this.noData = true;
                        }
                    });
                    this.itemsLoading = false;
                })
            },
            //获取列表
            getList:function(reset=0){
                if(moment(this.endDateInput).isBefore(this.startDateInput)){
                    layer.msg("开始时间不能大于结束时间",{icon:2,time:1500});
                    return
                }
                //重置第一页
                if(reset){
                    this.searchInput = $("#searchInput").val();
                    rideDetailReportOps.param.page = 1;
                }
                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-page',tpageToal,count)
                });
            },
            //返回
            clickgoBack:function(){
                //重置第一页
                rideDetailReportOps.page = 1;
                this.queryAjax((tpageToal='4',count="0")=>{
                    this.initPage('#J-page',tpageToal,count)
                });
                this.$dispatch("detail-close")
            },
            clickCheck:function(data){
                this.dialogData = data;
                this.isShowDialog = true;
                if(data.status >= 50){
                    this.dialogData = data;
                    console.log("this.dialogData");
                    console.log(this.dialogData);
                    this.isShowDialog = true;
                }else{
                    layer.msg('订单未完成，不能查看',{icon:2,time:1000});
                }
            },
            commentTxt:function(txt){
                return base.cutString(txt,5)
            },
            dialogClose:function(data){
                this.isShowDialog = false;
            },
            isUrgent:function(data){
                if(data){
                    return '<span class="red">是</span>';
                }else{
                    return  '否';
                }
            }
        },
        components:{
            map:map,
        }
    }
</script>
