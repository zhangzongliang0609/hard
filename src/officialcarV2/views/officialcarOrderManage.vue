<template>
    <!--订单详情-->
    <detail :data="dialogData" v-if="showOrderDetail" @dialog-close="closeDialog"></detail>
    <!--拼单-->
    <recommend :title="dialogTitle" :data="dialogData" :order="currentOrder" v-if="showRecommend" v-on:dialog-close="closeDialog"  v-on:show-all="showAllOrder"></recommend>
    <!--从所有订单中选择-->
    <combine :title="dialogTitle" :data="dialogData" v-if="isShowAllOrder" :order="currentOrder" v-on:dialog-close="closeDialog" v-on:dialog-save="getList"></combine>
    <!--沟通反馈-->
    <feedback :data="dialogData" :type="feedType" v-if="showFeedBackDialog" @dialog-close="closeDialog"></feedback>
    <!--查看轨迹-->
    <drivermap :data="dialogData" :driver="currentTrip" v-if="isShowMapDialog" v-on:dialog-close="closeDialog"></driverMap>
    <!--委派司机-->
    <dispatch-driver v-if="showDispatch" :data="dialogData" :trip="currentTrip" @dialog-close="closeDialog" @save-dispatch="getList"></dispatch-driver>
    <!--取消订单-->
    <cancel :data="dialogData" v-if="isShowCancelDialog" v-on:cancel-dialog-close="closeDialog" v-on:cancel-dialog-save="getList"></cancel>
    <!--查看已拼行程-->
    <carpool v-if="showCarpool" :title="'查看已拼行程'" :data="dialogData" @dialog-close="closeDialog"></carpool>
    <!--设置费用-->
    <cost v-if="showCost" @dialog-close="closeDialog" :data="dialogData" :driver="currentTrip"></cost>

    <section class="Hui-article-box">
        <div class="page-container">
            <div class="panel panel-default radius">
                <div class="panel-body">
                    <span class="f-20 fw-b">订单管理</span>
                </div>
            </div>

            <div class="panel panel-default radius mt-5">
                <div class="pd-15 clearfix">
                    <select class="select-box f-l" v-model="statusKey" @change="changeStatusKey">
                        <option value="approval_status">审批状态</option>
                        <option value="status">订单状态</option>
                        <option value="trip_status">行程状态</option>
                        <option value="running_status">司机行程状态</option>
                    </select>
                    <select class="select-box f-l" v-model="statusValue">
                        <option value="">全部</option>
                        <option v-for="item in currentStatusArr"
                                :value="item.value">{{item.text}}</option>
                    </select>

                    <span class="f-l lh-30 ml-15">开始时间：</span>
                    <input id="J-start-outer-date"
                           class="input-text f-l mr-5"
                           v-model="startDate" type="text" >

                    <span class="f-l lh-30 ml-10" >结束时间：</span>
                    <input id="J-end-outer-date"
                           class="input-text f-l mr-5"
                           v-model="endDate" type="text" >

                    <span class="f-l lh-30 ml-15 mr-5">时间类型：</span>
                    <select class="select-box f-l mr-10"
                            v-model="timeType" >
                        <option value="ctime">申请时间</option>
                        <option value="admin_ride_time">出发时间</option>
                    </select>

                    <input class="input-text search-input f-l"
                           v-model="searchContent"
                           type="text"
                           placeholder="姓名/工号/电话/职位">
                    <button class="btn btn-secondary radius-r f-l"
                            @click="search">搜索</button>

                </div>

                <div class="clearfix pd-15">
                    <span class="f-l await-order">当天等待接单中的订单总数为:{{waitOrderNumber}}</span>
                    <button class="btn btn-secondary radius f-r ml-10" @click="exportData">导出数据</button>
                    <button class="btn btn-secondary radius f-r ml-10" @click="turnToImport">ETC导入</button>
                    <button class="btn btn-secondary radius f-r ml-10">大屏显示</button>
                </div>
            </div>


            <div class="bk-gray radius mt-10 bgc-fff">
                <table class="table table-border table-bg ">
                    <thead class="text-c">
                    <tr>
                        <th>申请顺序</th>
                        <th>申请人</th>
                        <th>部门/职位</th>
                        <th>电话</th>
                        <th>审批流程</th>
                        <th>审批状态</th>
                        <th>订单状态</th>
                        <th>行程数量</th>
                        <th>订单总费用</th>
                        <th>用车原因</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <template  v-for="(index,item) in items">
                        <tr class="text-c" :class="{'pink-bg':item.status == 20}">
                            <td class="clearfix">
                                <span class="f-l">
                                </span>
                                <img :class="{'down-icon':isOpenTwo && filterScrrenOpen(item.id,1)}"   class="allow-icon f-l"  src="../../assets/images/icon-unfold.png" alt="" @click="clickArrow(item,1)">
                                <span>{{item.num}}</span>
                            </td>
                            <td>{{item.staff_vo.real_name}}</td>
                            <td>
                                <div class="text-overflow">
                                    {{item.staff_vo.department_name}}/
                                    {{item.staff_vo.position}}
                                </div>
                            </td>
                            <td>{{item.staff_vo.phone}}</td>
                            <td>
                                <div class="text-overflow" style="max-width:200px;margin:0 auto;">
                                    {{item.approvalinfo_set.join("→")}}
                                </div>
                            </td>
                            <td>{{item.approval_status | filterApplyStatus}}</td>
                            <td>{{item.status | filterOrderStatus}}</td>
                            <td>{{item.trip_set.length}}</td>
                            <td>{{item.fee ? item.fee / 100 : ''}}</td>
                            <td>
                                <div class="text-overflow" style="max-width:200px;margin:0 auto;">
                                    {{item.reason}}
                                </div>
                            </td>
                            <td>
                                <div>
                                    <a v-if="isShowCancelOrder(item.trip_set)" class="btn btn-link size-MINI radius" v-on:click="showDialog('isShowCancelDialog',item)">取消订单</a>
                                    <a class="btn btn-link size-MINI radius" v-on:click="showDialog('showOrderDetail',item)">订单详情</a>
                                    <a v-if="isShowOrderBtn(item,40)" class="btn btn-link size-MINI radius" v-on:click="orderShow(item,'showCost')">设置费用</a>
                                </div>
                                <div>

                                    <a v-if="item.status == 20" class="btn btn-link size-MINI radius" v-on:click="showDialog('showDispatch',item)">委派司机</a>
                                    <a class="btn btn-link size-MINI radius"
                                       v-if="item.status == 20"
                                       v-on:click="showFeedBack(item,'order')">沟通反馈</a>

                                    <a v-if="isShowOrderBtn(item,50) && locationConfig.cat_map && locationConfig.officialcar2_cat_map"
                                       class="btn btn-link size-MINI radius"
                                       v-on:click="orderShow(item,'isShowMapDialog')">查看路径</a>

                                </div>
                            </td>
                        </tr>
                        <template v-for="trip in item.trip_set">
                            <tr class="ml-10"  v-show="isOpenTwo && filterScrrenOpen(item.id,1)" >
                                <td class="inner_table_box" colspan="11">
                                    <table class="bgf9f9f9">
                                        <thead class="text-c">
                                        <tr>
                                            <th width="100">出发地</th>
                                            <th width="100">目的地</th>
                                            <th width="100">出发时间</th>
                                            <th width="100">结束时间</th>
                                            <th width="100">行程状态</th>
                                            <th width="100">是否本人乘车</th>
                                            <th width="100">乘车人数</th>
                                            <th width="100">司机数量</th>
                                            <th width="100">操作</th>
                                        </tr>
                                        </thead>
                                        <tbody >
                                        <tr class="text-c" :class="{'yellow-bg':filterYellowBg(trip)}">
                                            <td class="clearfix">
                                                <span class="f-l">
                                                </span>
                                                <img :class="{'down-icon':filterScrrenOpen(trip.id,2)}"   class="allow-icon f-l"  src="../../assets/images/icon-unfold.png" alt="" @click="clickArrow(trip,2)">
                                                <span>{{trip.source_name}}</span>
                                            </td>
                                            <td>{{trip.destination_name}}</td>
                                            <td>
                                                {{trip.admin_ride_time.slice(0,16)}}
                                            </td>
                                            <td>
                                                {{trip.admin_end_time.slice(0,16)}}
                                            </td>
                                            <td>{{trip.status | filterTripStatus}}</td>

                                            <td>
                                                {{trip.is_self_use?"是":"否"}}
                                            </td>

                                            <td>{{trip.passenger_number}}</td>

                                            <td>{{trip.drivertrip ? trip.drivertrip.length : 0}}</td>
                                            <td>
                                                <div>
                                                    <a v-if="(trip.status == 10 || trip.status == 20) && (item.status == 20 || item.status == 30)"
                                                       class="btn btn-link size-MINI radius"
                                                       v-on:click="clickCombine(trip,item)">拼单</a>

                                                    <a v-if="trip.recommend_carpool && (trip.status == 10 || trip.status == 20) && (item.status == 20 || item.status == 30)"
                                                       class="btn size-MINI radius bubble-box"
                                                       v-on:click="clickRecommend(trip,item)">可拼单</a>

                                                    <!-- 取消状态不显示沟通反馈 -->
                                                    <a class="btn btn-link size-MINI radius"
                                                       v-if="trip.status != -10"
                                                       v-on:click="showFeedBack(trip,'trip')">沟通反馈</a>

                                                    <a v-if=" (trip.status == 10 || trip.status == 20) && trip.carpool_id"
                                                       class="btn btn-link size-MINI radius"
                                                       v-on:click="cancelCarpool(trip)">取消拼单</a>

                                                    <a v-if="trip.carpool_id > 0"
                                                       class="btn btn-link size-MINI radius"
                                                       v-on:click="showDialog('showCarpool',trip)">查看已拼行程</a>

                                                    <a v-if="trip.status == 10 && item.status == 20"
                                                       class="btn btn-link size-MINI radius"
                                                       v-on:click="showDialog('showDispatch',item,trip)">委派司机</a>

                                                    <a v-if="trip.status == 20 "
                                                       class="btn btn-link size-MINI radius"
                                                       v-on:click="cancelDispatch(trip,'trip')">取消委派</a>

                                                    <a v-if="filterDriver(trip,'trip')"
                                                       class="btn btn-link size-MINI radius"
                                                       v-on:click="cancelTrip(trip)">取消行程</a>

                                                    <a v-if="filterTowBtnShow(trip)"
                                                       class="btn btn-link size-MINI radius"
                                                       v-on:click="showDialog('isShowMapDialog',trip)">查看路径</a>

                                                    <a v-if="filterTowBtnShow(trip)"
                                                       class="btn btn-link size-MINI radius"
                                                       v-on:click="showDialog('showCost',trip)">设置费用</a>
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr class="ml-40" v-for="driverTrip in trip.drivertrip"
                                v-show="filterScrrenOpen(trip.id,2)">
                                <td class="inner_table_box2" colspan="22">
                                    <table class="bgf9f9f9">
                                        <thead class="text-c">
                                        <tr>
                                            <th width="100" class="pl-15">司机姓名</th>
                                            <th width="100">司机电话</th>
                                            <th width="100">司机行程状态</th>
                                            <th width="100">车牌号</th>
                                            <th width="100">行程费用</th>
                                            <th width="100">行驶里程</th>
                                            <th width="100">行程时长</th>
                                            <th width="100">操作</th>
                                        </tr>
                                        </thead>
                                        <tbody >
                                        <tr class="text-c" :class="{'yellow-bg':driverYellowBg(trip,driverTrip)}">
                                            <td>{{driverTrip.driver_name}}</td>
                                            <td>{{driverTrip.driver_phone}}</td>
                                            <td>{{driverTrip.status_name}}</td>
                                            <td>{{driverTrip.car_no}}</td>
                                            <td>{{driverTrip.fee ? driverTrip.fee / 100 : ''}}</td>
                                            <td>{{driverTrip.driver_mileage /1000}}公里</td>
                                            <td>{{driverTrip.durations}}分钟</td>
                                            <td>
                                                <a class="btn btn-link size-MINI radius"
                                                   v-if="trip.status != -10"
                                                   v-on:click="showFeedBack(driverTrip,'driver')">沟通反馈</a>

                                                <a v-if="driverTrip.status == 10 || driverTrip.status == 5"
                                                   class="btn btn-link size-MINI radius"
                                                   v-on:click="cancelDispatch(driverTrip,'driver')">取消委派</a>

                                                <a v-if="driverTrip.status == 50"
                                                   class="btn btn-link size-MINI radius"
                                                   v-on:click="showDialog('isShowMapDialog',trip,driverTrip)">查看路径</a>

                                                <a v-if="driverTrip.status == 50"
                                                   class="btn btn-link size-MINI radius"
                                                   v-on:click="showDialog('showCost',trip,driverTrip)">设置费用</a>

                                                <!--<a v-if="driverTrip.status >= 20"  class="btn btn-link size-MINI radius" v-on:click="showDialog('showCost',trip,driverTrip)">设置费用</a>-->
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </template>
                    </template>
                    </tbody>
                </table>

            </div>
            <div id="J-page" class="m-page" v-show="!noData"></div>
        </div>
    </section>
    <div class="no-data text-c" v-if="noData">没有相关数据</div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>

<style lang="less" rel="stylesheet/less" scoped>
    .pink-bg{
        background: #ffb7db !important;
    }
    .yellow-bg{
        background: orange !important;
    }
    .bubble-box{
        height:20px;
        width: 50px;
        /*top:-20px;*/
        /*width:15px;*/
        fone-size:12px;
        /*left:-12px;*/
        border-radius: 5px;
        /*padding-left:2em;*/
        background:#F3961C;
        /*position:absolute;*/
        color: white;
        margin: 0 auto;
    }
    .input-text{
        width:100px;
    }
    .search-input{
        width:150px;
    }
    .select-box{
        height:31px;
        width:120px;
        font-size: 14px;
    }
    .await-order{
        font-size: 20px;
    }
    .status-select{
        height:31px;
        width:80px;
        font-size: 14px;
    }
    .allow-icon{
        transform: rotateZ(180deg);
        height:20px;
        cursor: pointer;
        transition:0.3s all;
    }
    .down-icon{
        transform: rotateZ(0deg);
    }
    .inner_table_box {
        padding: 0 0 0 20px;
        box-sizing: border-box;
        border:none !important;
    }
    .inner_table_box2{
        padding: 0 0 0 30px ;
        box-sizing: border-box;
        background: none !important;
        border:none !important;
    }
    .bgf9f9f9{
        background: #f9f9f9 !important;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../../assets/js/base.js';
    import moment from "moment";
    import detail from "../components/officialOrderDetail"
    import recommend from "../components/recommendMerge.vue";
    import combine from "../components/combine.vue";
    import feedback from "../components/officialFeedback";
    import drivermap from "../components/driverMap.vue";
    import dispatchDriver from "../components/dispatchDriver"
    import cancel from "../components/canselOrder.vue";
    import carpool from "../components/prickMainTrip.vue";
    import cost from "../components/setDriverCost.vue";


    let option = null;
    export default{
        ready(){
            option = {
                param:{
                },
                page:1,
                page_size:10
            };

            new Kalendae.Input('J-start-outer-date', {
                months: 1,
                clickHide:true
            });
            new Kalendae.Input('J-end-outer-date', {
                months: 1,
                clickHide:true
            });

            this.startDate = moment().add('-1','months').format('YYYY-MM-DD');
            this.endDate = moment().format('YYYY-MM-DD');

            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-page',tpageToal,option.page,count)
            });

            this.currentStatusArr = this.statusObj[this.statusKey];
            this.getWaitOrder();

            this.getLocationConfig();
        },
        data: function(){
            return{
                itemsLoading:false,
                noData:false,
                items:[],
                isOpenTwo:false, // 是否打开第二层table
                isOpenthree:false, // 是否打开第三层table
                currentOneId:"",  // 第一层的id
                currentTwoIdArr:[], // 第二层的id数组
                statusKey:"status",
                statusValue:"20",
                currentStatusArr:[],
                statusObj:{
                    /**审批状态 -10--驳回  10--审批通过  20--正在审批中  30--无法审批
                     * 订单状态 -20--已驳回  -10--已取消  10--审批中 20--待派单  30--待接送  40--接送中  50--已完成  60--已评价
                     * 行程状态 -20:已驳回 -10:已取消 10:待派单 20:待接送 30:接送中 40:已完成
                     * 司机行程行程状态 0--请选择  -10--已取消 5待确认接单  10--待接送  20--等待上车  30--行程中  40--已送达 50--已完成
                     * 空为全部
                     * */
                    approval_status:[
                        {'value':-10,"text":"已驳回"},
                        {'value':10,"text":"审批通过"},
                        {'value':20,"text":"正在审批中"},
                        {'value':30,"text":"无法审批"},
                        ],
                    status:[
                        {'value':-20,"text":"已驳回"},
                        {'value':-10,"text":"已取消"},
                        {'value':10,"text":"审批中"},
                        {'value':20,"text":"待派单"},
                        {'value':30,"text":"待接送"},
                        {'value':40,"text":"接送中"},
                        {'value':50,"text":"已完成"},
                        {'value':60,"text":"已评价"},
                    ],
                    trip_status:[
                        {'value':-20,"text":"已驳回"},
                        {'value':-10,"text":"已取消"},
                        {'value':10,"text":"待派单"},
                        {'value':20,"text":"待接送"},
                        {'value':30,"text":"接送中"},
                        {'value':40,"text":"已完成"},
                    ],
                    running_status:[
                        {'value':-10,"text":"已取消"},
                        {'value':10,"text":"待接送"},
                        {'value':5,"text":"待确认接单"},
                        {'value':20,"text":"等待上车"},
                        {'value':30,"text":"行程中"},
                        {'value':40,"text":"已送达"},
                        {'value':50,"text":"已完成"},
                    ]
                },
                timeType:"ctime", // 时间类型 ctime--申请时间  admin_ride_time--出发时间
                showOrderDetail:false,
                showRecommend:false,
                isShowAllOrder:false,
                isShowMapDialog:false,
                showDispatch:false,
                showCarpool:false,
                isShowCancelDialog:false,
                showCost:false,
                dialogTitle:"信息窗口",
                dialogData:"",
                showFeedBackDialog:false,
                feedType:"",
                searchContent:"",
                startDate:"2019-01-01",
                endDate:"2019-01-01",
                currentTrip:"",
                waitOrderNumber:0,
                currentOrder:"",

                locationConfig: {} // 轨迹
            }
        },
        methods:{
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
            search:function(){
                option.page = 1;
                this.getList();
            },
            getList:function(){
                this.isShowAllOrder = false;
                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-page',tpageToal,option.page,count)
                });
            },
            //初始化分页
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
            getWaitOrder:function(){
                $.ajax({
                    url:`${base.gAjaxUrl.officialcarOrder_V2}waitorder_today/`,
                    type:"GET",
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
                        this.waitOrderNumber = data.count
                    })
                })
            },
            queryAjax:function(callback=function(){}){
                let data = {
                    page:option.page,
                    page_size:option.page_size,
                    start_date:this.startDate,
                    end_date:this.endDate,
                    date_key:this.timeType,
                    search:this.searchContent,
                };
                data[this.statusKey] = this.statusValue;

                this.itemsLoading = true;
                $.ajax({
                    url: `${base.gAjaxUrl.officialcarOrder_V2}`,
                    type: 'GET',
                    data:data
                }).always((data)=>{
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
                    })
            },
            clickArrow:function(data,level){
                if(level == 1){
                    if(this.currentOneId == data.id){
                        this.isOpenTwo = !this.isOpenTwo;
                        this.isOpenTwo ? '' : this.currentTwoIdArr = [];
                    }else{
                        this.isOpenTwo = true;
                        this.currentOneId = data.id;
                        this.currentTwoIdArr = []
                    }
                }else if(level == 2){
                    let index = this.currentTwoIdArr.indexOf(data.id);
                    if(index != -1){
                        this.currentTwoIdArr.splice(index,1);
                    }else{
                        this.currentTwoIdArr.push(data.id);
                    }
                }
            },
            filterScrrenOpen:function(id,level){
                if(level == 1){
                    return this.currentOneId == id;
                }else if(level == 2){
                    return this.currentTwoIdArr.includes(id);
                }

            },
            showDialog:function(type,item,trip){
                // type 控制组件是否显示的字段
                this[type] = true;
                if(item){
                    if(type == 'showCarpool'){
                        this.dialogData = item.carpool_trip;
                    }else{
                        this.dialogData = item;
                    }
                    this.currentTrip = "";
                }
                if(trip){
                    this.currentTrip = trip;
                }
            },
            clickCombine:function(trip,order){
                this.dialogData = trip;
                this.currentOrder = order;
                this.isShowAllOrder = true;
            },
            clickRecommend:function(trip,order){
                this.dialogData = trip;
                this.currentOrder = order;
                this.showRecommend = true;
            },
            // 沟通反馈的弹窗比较特殊,所以特殊处理
            showFeedBack:function(item,type){
                this.showFeedBackDialog = true;
                this.dialogData = item;
                this.feedType = type;
            },
            closeDialog:function(type,isRefresh = false){
                // type 控制组件是否显示的字段
                this[type] = false;
            },
            cancelDispatch:function(data,type){
                let url = type == 'driver' ? base.gAjaxUrl.officialcarDriverTrip_V2 : base.gAjaxUrl.officialcarTrip_V2;
                layer.confirm('确认取消委派吗?',()=>{
                    $.showLoading();
                    $.ajax({
                        url:`${url}${data.id}/cancel_delegate/`,
                        type:"POST",
                    }).always((data)=>{
                        $.hideLoading();
                        base.ajaxCallback(data,()=>{
                            layer.msg("取消成功",{icon:1,time:2000});
                            if(this.items.length == 1 && option.page != 1){
                                option.page--;
                            }
                            this.getList()
                        })
                    })
                    layer.closeAll();
                })
            },
            cancelTrip:function(data){
                layer.confirm('确认取消行程吗?',()=>{
                    $.showLoading();
                    $.ajax({
                        url:`${base.gAjaxUrl.officialcarTrip_V2}${data.id}/cancel/`,
                        type:"POST",
                    }).always((data)=>{
                        $.hideLoading();
                        base.ajaxCallback(data,()=>{
                            layer.msg("取消成功",{icon:1,time:2000});
                            if(this.items.length == 1 && option.page != 1){
                                option.page--;
                            }
                            this.getList()
                        })
                    })
                    layer.closeAll();
                })
            },
            filterDriver:function(data,type){
                // 行程状态 -20:已驳回 -10:已取消 10:待派单 20:待接送 30:接送中 40:已完成
                if(data.status < 0 || data.status > 20){
                    return false;
                }
                // 司机行程行程状态 0--请选择 5待确认接单 -10--已取消 10--待接送  20--等待上车  30--行程中  40--已送达
                if(data.drivertrip.length > 0){
                    for(let driver of data.drivertrip){
                        if(driver.status  > 20 || driver.status < 5){
                            return false;
                        }
                    }
                    return true;
                }else{
                    return type == 'dispatch' ?  false : true;
                }

            },
            changeStatusKey:function(){
                this.currentStatusArr = this.statusObj[this.statusKey];
                this.statusValue = '';
            },
            isShowCancelOrder:function(arr){
                // 行程状态 -20:已驳回 -10:已取消 10:待派单 20:待接送 30:接送中 40:已完成
                let isShow = true;
                for (let item of arr){
                    if(item.status > 20){
                        return false;
                    }
                    if(item.status < 10 || item.status > 20){
                        isShow = false;
                    }else{
                        return true;
                    }
                }
                return isShow;
            },
            cancelCarpool:function(item){
                layer.confirm('确认取消拼单吗?',()=>{
                    $.showLoading();
                    $.ajax({
                        url:`${base.gAjaxUrl.officialcarTrip_V2}${item.id}/cancel_carpool/`,
                        type:"POST",
                    }).always((data)=>{
                        $.hideLoading();
                        base.ajaxCallback(data,()=>{
                            layer.msg("取消成功",{icon:1,time:2000});
                            if(this.items.length == 1 && option.page != 1){
                                option.page--;
                            }
                            this.getList()
                        })
                    })
                    layer.closeAll();
                })
            },
            showAllOrder:function(){
                this.showRecommend  = false;
                this.isShowAllOrder = true;
            },
            turnToImport: function () {
                this.$router.go({
                    path: '/importMould',
                    name: 'importMould',
                    query: {
                        importType: 'ETC'
                    }
                })
            },
            exportData: function () {
                $.showLoading();
                let data = {
                    start_date:this.startDate,
                    end_date:this.endDate,
                    key_date:this.timeType,
                    search:this.searchContent,
                }
                data[this.statusKey] = this.statusValue;

                $.ajax({
                    url: `${base.gAjaxUrl.officialcarOrder_V2}export/`,
                    type:'GET',
                    data: data,
                }).always((data)=>{
                    $.hideLoading();
                    this.$route.router.go({path: '/job'});
                    // layer.msg('最新的一条数据请重新刷新哦',{icon:1,time:3000});
                })
            },
            isShowOrderBtn:function(item,status){

                for (let trip of item.trip_set){
                    for(let driver of trip.drivertrip){
                        if(driver.status == 50){
                            return true
                        }
                    }
                }

                return false;
            },
            orderShow:function(order,showKey){
                let arr = {
                    drivertrip:[]
                };
                for(let trip of order.trip_set){
                    arr.drivertrip = arr.drivertrip.concat(trip.drivertrip)
                }
                this.dialogData = arr;
                // this.isShowMapDialog = true;
                this[showKey]= true;
            },
            filterYellowBg(trip){

                for (let driver of trip.drivertrip){
                    if(driver.status != -10){
                        if(driver.status <= 5){
                            if(moment().isAfter(trip.admin_ride_time)){
                                return true
                            }
                        } else if(driver.status < 40){
                            if(moment().isAfter(trip.admin_end_time)){
                                return true
                            }
                        }
                    }

                }
                return false;
            },
            driverYellowBg:function(trip,driverTrip){
                // 司机行程行程状态 0--请选择  -10--已取消 5待确认接单  10--待接送  20--等待上车  30--行程中  40--已送达 50--已完成
                if(driverTrip.status == -10) return false;

                if(driverTrip.status <= 10){
                    if(moment().isAfter(trip.admin_ride_time)){
                        return true
                    }
                } else if(driverTrip.status < 50){
                    if(moment().isAfter(trip.admin_end_time)){
                        return true
                    }
                }
                return false;
            },
            filterTowBtnShow:function(trip){
                for (let driverTrip of trip.drivertrip){
                    if(driverTrip.status == 50){
                        return true
                    }
                }
                return false;
            }
        },
        components: {
            detail:detail,
            recommend:recommend,
            combine:combine,
            feedback:feedback,
            drivermap:drivermap,
            dispatchDriver:dispatchDriver,
            cancel:cancel,
            carpool:carpool,
            cost:cost,
        },
        filters: {
            filterOrderStatus:function(data){
                // 订单状态 -20--已驳回  -10--已取消  10--审批中 20--待派单  30--待接送  40--接送中  50--已完成  60--已评价
                switch(data){
                    case -20:{
                        return "已驳回"
                    }
                    case -10:{
                        return "已取消"
                    }
                    case 10:{
                        return "审批中"
                    }
                    case 20:{
                        return "待派单"
                    }
                    case 30:{
                        return "待接送"
                    }
                    case 40:{
                        return "接送中"
                    }
                    case 50:{
                        return "已完成"
                    }
                    case 60:{
                        return "已评价"
                    }
                }
            },
            filterApplyStatus:function(data){
                // 审批状态 -10--驳回  10--审批通过  20--正在审批中  30--无法审批
                switch(data){
                    case -10:{
                        return "已驳回"
                    }
                    case 10:{
                        return "审批通过"
                    }
                    case 20:{
                        return "正在审批中"
                    }
                    case 30:{
                        return "无法审批"
                    }
                }
            },
            filterTripStatus:function(data){
                // 行程状态 -20:已驳回 -10:已取消 10:待派单 20:待接送 30:接送中 40:已完成
                switch(data){
                    case -20:{
                        return "已驳回"
                    }
                    case -10:{
                        return "已取消"
                    }
                    case 10:{
                        return "待派单"
                    }
                    case 20:{
                        return "待接送"
                    }
                    case 30:{
                        return "接送中"
                    }
                    case 40:{
                        return "已完成"
                    }
                }
            }
        }
    }
</script>
