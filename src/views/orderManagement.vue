<template>
    <!--设置费用-->
    <set-cost v-if="isShowSetCost" :order="dialogData" @close="closeSetCost"></set-cost>

    <drivermap :title="mapTitle" :data="mapData" v-if="isShowMapDialog" v-on:dialog-close="mapClose"></driverMap>

    <order :data="orderDialogData" v-if="isShowOrderDialog" v-on:order-dialog-close="orderDialogClose"
           @dialog-save="orderSave"></order>

    <add :title="staffDialogTitle" :type="staffDialogType" :data="staffDialogData" v-if="isShowStaffDialog"
         v-on:dialog-close="staffDialogClose"></add>

    <assign :data="assignDialogData" v-if="isShowAssignDialog" v-on:assign-dialog-close="assignClose"
            @assign-dialog-save="assignSave"></assign>
    <cancel :data="cancelDialogData" v-if="isShowCancelDialog" v-on:cancel-dialog-close="cancelClose"
            v-on:cancel-dialog-save="change"></cancel>
    <combine :title="dialogTitle" :data="dialogData" v-if="isShowAllOrder" v-on:dialog-close="closeShowAllOrder"
             v-on:dialog-save="addDialogSave" v-on:call-back="combineBtn"></combine>
    <recommend :title="dialogTitle" :data="dialogData" v-if="isShowDialog" v-on:dialog-close="addDialogClose"
               v-on:dialog-save="addDialogSave" v-on:show-all="showAllOrder"></recommend>


    <!-- <orderdetails :titledetail="orderDetailsDialogTitle" :datadetail="orderdetailsDialogData" v-if="isShowOrderDetailsDialog" v-on:dialog-close="orderDetailsClose" v-on:dialog-save="orderDetailsSave"></orderdetails> -->
    <section class="Hui-article-box">

        <div class="page-container order-table">
            <div class="text-l">
                关键字：
                <input type="text" class="input-text Wdate mr-5" style="width:150px;" placeholder="姓名/工号/电话/职位"
                       id="searchInput">
                审批状态：
                <span class="select-box inline mr-5">
                <select id="approvalStatusSelected" v-model="approvalStatusSelected" class="select">
                    <option value="">全部</option>
                    <option v-bind:value="$key" v-for="item in approvalStatusItems">{{item}}</option>
                </select>
            </span>
                订单状态：
                <span class="select-box inline mr-5">
                <select id="orderStatusSelected" v-model="orderStatusSelected" class="select" @change="change">
                    <option value="">全部</option>
                    <option v-bind:value="$key" v-for="item in orderStatusItems">{{item}}</option>
                </select>
            </span>
                <div id="carpoolInput" class="skin-minimal w60">
                    <span class="f-l mr-5 ">拼车</span>
                    <div class="f-l check-box">
                        <input type="checkbox" id="checkbox-1" v-model="carpoolInput">
                    </div>
                </div>
                <div id="urgentInput" class="skin-minimal w60">
                    <span class="f-l mr-5 ">加急</span>
                    <div class="f-l check-box">
                        <input type="checkbox" id="checkbox-2" v-model="urgentInput">
                    </div>
                </div>
                <button type="submit" class="btn btn-success radius" v-on:click="getList(1)"><i class="Hui-iconfont">&#xe665;</i>
                </button>
                <a id="" class="btn btn-secondary radius" target="_blank" v-link="{ name: 'orderLargeScreenDisplay' }">大屏模式</a>

                <div class="cl mt-5 f-r">

                    <div class="f-l lh-30 mr-5">
                        时间类型：
                    </div>

                    <select v-model="exportTimeType" class="export-box select-box mr-5 lh-30">
                        <option value="ctime">申请时间</option>
                        <option value="ride_time">用车时间</option>
                        <option value="end_date">结束时间</option>
                    </select>

                    <button id="exportData" class="btn btn-primary radius f-r" v-on:click="exportData()">导出数据</button>
                    <div class="f-r">
                        结束日期：
                        <input v-model="endDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;"
                               id="J-end-outer-date" v-bind:value="endDateInput">
                    </div>
                    <div class="f-r">
                        开始日期：
                        <input v-model="startDateInput" type="text" class="input-text Wdate mr-5 " style="width:120px;"
                               id="J-start-outer-date" v-bind:value="startDateInput">
                    </div>
                </div>
            </div>
            <p class="mt-10 lh-18 c-red f-18">当天等待接单中的订单总数为: {{ wait_send_numbers }} </p>
            <!-- <div class="mt-10 text-l clearfix lh-18 c-red f-18">
                当天等待接单中的订单总数为:
                <input v-model="wait_send_numbers" type="text"  style="width:100px" class="input-text input-text1">
            </div> -->
            <!-- <p class="mt-10 lh-18 c-red f-18">当天等待接单中的订单总数为：{{ 0 }}</p> -->
            <div class="table-container">
                <div class="table-box">
                    <table class="table table-border table-bordered table-hover table-bg mt-10 table-box1">
                        <thead>
                        <tr class="text-c">
                            <th v-if="orderStatusSelected==20">申请顺序</th>
                            <th>申请人</th>
                            <th>审批人</th>
                            <th>起点</th>
                            <th>终点</th>
                            <th>出发时间</th>
                            <th>结束时间</th>
                            <th>人数</th>
                            <th>审批状态</th>
                            <th>订单状态</th>
                            <th>拼车</th>
                            <th>加急</th>
                            <th>接送司机</th>
                            <th>接送车辆</th>
                            <!--<th  >司机是否已读</th>-->
                            <th>订单总费用</th>
                            <th>操作 &nbsp; <a id="operation"
                                             class="btn default-color btn-link size-M  size-M-reset radius"
                                             v-on:click="operationTips(operation)">?</a></th>
                        </tr>
                        </thead>
                        <div class="result" v-if="!noData">
                            <tbody v-for="(voKey, voItem) in items">
                            <!--<template v-for="(voKey, voItem) in items">-->
                            <tr v-for="(vooKey, vooItem) in voItem" class="text-c {{isGroup(voItem,vooKey)}}">
                                <td v-if="orderStatusSelected==20"
                                    v-bind:class="{ 'classRed': vooItem.order_status == 20,'c-cancle': vooItem.order_status == -10,}">
                                    <a class="btn btn-link">{{vooItem.number}}</a></td>
                                <td v-bind:class="{ 'classRed': vooItem.order_status == 20,'c-cancle': vooItem.order_status == -10,}">
                                    <a class="text-overflow inline-block" style="width:100%;color: #0e90d2"
                                       v-on:click="checkStaff(vooItem.staff_vo)">{{vooItem.staff_vo.real_name?
                                        vooItem.staff_vo.real_name: '-';}}</a></td>
                                <td v-bind:class="{ 'classRed': vooItem.order_status == 20,'c-cancle': vooItem.order_status == -10,}">
                                    {{vooItem.approvalinfo_set?vooItem.approvalinfo_set.join('→'):"--"}}
                                </td>
                                <td v-bind:class="{ 'classRed': vooItem.order_status == 20,'c-cancle': vooItem.order_status == -10,}">
                                    {{vooItem.source_name}}
                                </td>
                                <td v-bind:class="{ 'classRed': vooItem.order_status == 20,'c-cancle': vooItem.order_status == -10,}">
                                    {{vooItem.destination_name}}
                                </td>
                                <td v-bind:class="{ 'classRed': vooItem.order_status == 20,'c-cancle': vooItem.order_status == -10,}">
                                    {{vooItem.ride_time}}
                                </td>
                                <td v-bind:class="{ 'classRed': vooItem.order_status == 20,'c-cancle': vooItem.order_status == -10,}">
                                    {{vooItem.end_time}}
                                </td>
                                <td v-bind:class="{ 'classRed': vooItem.order_status == 20,'c-cancle': vooItem.order_status == -10,}">
                                    {{vooItem.passenger_number}}
                                </td>
                                <td v-bind:class="{ 'classRed': vooItem.order_status == 20,'c-cancle': vooItem.order_status == -10,}">
                                    {{vooItem.approval_status_name}}
                                </td>
                                <td v-bind:class="{ 'classRed': vooItem.order_status == 20,'c-cancle': vooItem.order_status == -10,}">
                                    {{vooItem.order_status_name}}
                                </td>
                                <td v-bind:class="{ 'classRed': vooItem.order_status == 20,'c-cancle': vooItem.order_status == -10,}">
                                    {{vooItem.is_carpool? '是': '否'}}
                                </td>
                                <td v-bind:class="{ 'classRed': vooItem.order_status == 20,'c-cancle': vooItem.order_status == -10,'red':vooItem.is_urgent}">
                                    {{vooItem.is_urgent?'是':'否'}}
                                </td>
                                <td v-bind:class="{ 'classRed': vooItem.order_status == 20,'c-cancle': vooItem.order_status == -10,}">
                                    {{vooItem.driver_vo? vooItem.driver_vo.staff_vo.real_name: '-';}}
                                </td>
                                <td v-bind:class="{ 'classRed': vooItem.order_status == 20,'c-cancle': vooItem.order_status == -10,}">
                                    {{vooItem.vehicle_vo? vooItem.vehicle_vo.car_no: '-';}}
                                </td>
                                <!--<td v-bind:class="{ 'classRed': vooItem.order_status == 20,'c-cancle': vooItem.order_status == -10,}">{{vooItem.is_dirver_read? '是': '否'}}</td>-->
                                <td v-bind:class="{ 'classRed': vooItem.order_status == 20,'c-cancle': vooItem.order_status == -10,}">
                                    {{vooItem.fee?vooItem.fee:'--'}}
                                </td>
                                <td v-bind:class="{ 'classRed': vooItem.order_status == 20,'c-cancle': vooItem.order_status == -10,}">
                                    <div v-show="isGroup(voItem,vooKey) == 'group first' || isGroup(voItem,vooKey) == 'group' || isGroup(voItem,vooKey) == '' || isGroup(voItem,vooKey) == 'group last'">
                                        <template
                                                v-if="vooItem.order_status != 60 && vooItem.order_status != 70 && vooItem.order_status != -10">
                                            <a v-if="vooItem.order_status != -10 && vooItem.order_status == 20 || vooItem.order_status == 30"
                                               class="btn btn-link size-MINI  radius"
                                               v-on:click="cancelOrder2(vooItem)">取消订单</a>

                                            <a class="btn btn-link size-MINI radius"
                                               v-if="!vooItem.driver && vooItem.order_status == 20"
                                               v-on:click="assign(vooItem)">委派司机</a>

                                            <a class="btn btn-link size-MINI radius"
                                               v-if="vooItem.driver && vooItem.order_status == 30"
                                               v-on:click="cancel_assign(vooItem)">取消委派</a>

                                            <a v-if="(isGroup(voItem,vooKey) == 'group first' || isGroup(voItem,vooKey) == 'group last' || isGroup(voItem,vooKey) == 'group') && (voItem[0].order_status < 30)"
                                               class="btn btn-link size-MINI radius"
                                               v-on:click="cancelCombine(vooItem.carpool_id)">取消拼单</a>


                                            <a v-else="" v-if="vooItem.order_status == 20 && !vooItem.can_carpooling"
                                               class="btn btn-link size-MINI radius relative"
                                               v-on:click="combineBtn(vooItem)">拼单

                                            </a>
                                            <div v-on:click="combineBtn(vooItem)" v-if="vooItem.can_carpooling"
                                                 class="bubble-box cursor-p">
                                                可拼单
                                            </div>
                                            <!-- <span v-else v-if="vooItem.order_status == 20">
                                                <a class="btn btn-link size-MINI radius" v-on:click="combineBtn(vooItem)">拼单</a>
                                                <a v-bind:id="vooItem.id + 4"  class="btn default-color btn-link size-M  size-M-reset radius"  v-on:click="combineBtn_tips(vooItem.id + 4)">?</a>
                                            </span> -->
                                        </template>

                                        <template v-if="vooItem.order_status == 60 || vooItem.order_status == 70">
                                            <a class="btn btn-link size-MINI radius" href="javascript:;"
                                               v-if="locationConfig.cat_map && locationConfig.officialcar_cat_map"
                                               v-on:click="clickCheck(vooItem)">查看路径</a>
                                            <a class="btn btn-link size-MINI radius"
                                               v-on:click="setCost(vooItem,$index,voKey)">设置费用</a>
                                        </template>

                                        <a class="btn btn-link size-MINI radius" v-on:click="orderDetailBtn(vooItem)">订单详细</a>

                                        <a class="btn btn-link size-MINI radius" v-on:click="feedback(vooItem)">其他反馈</a>

                                    </div>
                                </td>

                            </tr>
                            <!--</template>-->
                            </tbody>
                        </div>
                    </table>
                </div>
            </div>

            <div id="J-page" class="m-page" v-show="!itemsLoading && !noData"></div>
            <div class="m-loading" v-if="itemsLoading">
                <div class="cube1"></div>
                <div class="cube2"></div>
            </div>
        </div>
    </section>

    <!-- 其他反馈输入框-->
    <div id="feedback">
        <div style="margin:10px;">
            发送到:
            <input type="checkbox" id="staff" value="staff" v-model="feedbackTargets">
            <label for="staff">申请人 {{isEmptyObject(selectedOrder)?"":selectedOrder.staff_vo.real_name}}</label>
            <input v-if="selectedOrder.driver" type="checkbox" id="driver" value="driver" v-model="feedbackTargets">
            <label v-if="selectedOrder.driver" for="driver">司 机</label>
        </div>
        <div class="text-c">
            <textarea placeholder="请输入要反馈的内容，最多只能输入300字" class="textarea"
                      maxlength="300" style="margin:10px;width: 700px;height: 200px"
                      v-model="feedbackMsg">
            </textarea>
        </div>
    </div>

</template>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import moment from "moment";
    import combine from "../components/combine.vue";
    import order from "../components/order.vue";
    import drivermap from "../components/driverMap.vue";
    import add from "../components/showEmployee.vue";
    import assign from "../components/assign.vue";
    import cancel from "../components/canselOrder.vue";
    import recommend from "../components/recommendMerge.vue";
    import setCost from "../components/setCost.vue";
    // import orderdetails from "../components/orderLargeScreenDisplay.vue";

    let carpoolOps = null;

    export default {
        ready() {
            base.calTableWidth('.table-box1');
            let that = this;
            carpoolOps = {
                param: {
                    search: '',
                    approval_status: '',
                    order_status: '',
                    // is_carpool:'',
                    // is_urgent:'',
                },
                page: 1,
                page_size: 10,
            };
            this.startDateInput = moment().add('-1', 'months').format('YYYY-MM-DD');
            this.endDateInput = moment().format('YYYY-MM-DD');
            new Kalendae.Input('J-end-outer-date', {
                months: 2,
                clickHide: true,
            });
            new Kalendae.Input('J-start-outer-date', {
                months: 2,
                clickHide: true,
            });
            //初始新功能引导提示
            this.init();
            this.FailureToSendSingle();
            //美化
            $('.skin-minimal input').iCheck({
                checkboxClass: 'icheckbox-blue',
                radioClass: 'iradio-blue',
                increaseArea: '20%'
            });

            //获取订单状态
            $.ajax({
                url: base.gAjaxUrl.orderStatus,
                type: 'GET',
            }).always((data) => {
                this.orderStatusItems = data;
            })

            //获取审批状态
            $.ajax({
                url: base.gAjaxUrl.approvalStatus,
                type: 'GET',
            })
                .always((data) => {
                    this.approvalStatusItems = data;
                })

            this.getList();
            // this.queryAjax((tpageToal='4',count='0')=>{
            //     this.initPage('#J-page',tpageToal,count)
            // });
            this.getLocationConfig();

        },
        data: function () {
            return {
                // ishidden:true,
                wait_send_numbers: 0,
                isShowStaffDialog: false,
                isShowMapDialog: false,
                isShowAssignDialog: false,
                mapTitle: '查看路径',
                mapData: '',
                isShowDialog: false,
                isShowOrderDialog: false,
                noData: false,
                itemsLoading: false,        //loading
                isShowAddDialog: false,      //增加，修改
                isShowCalendarDialog: false, //日历
                items: [],
                searchInput: '',
                carpoolInput: '',
                urgentInput: '',
                approvalStatusSelected: '',
                approvalStatusItems: [],
                orderStatusSelected: '20',
                orderStatusItems: [],
                dialogTitle: '拼单',

                orderDetailsDialogTitle: '订单详细',

                staffDialogTitle: '查看员工',
                staffDialogType: 'check',
                dialogData: '',
                orderDialogData: '',
                staffDialogData: '',
                assignDialogData: '',
                isShowCancelDialog: false,

                isShowOrderDetailsDialog: false,
                cancelDialogData: '',
                feedbackTargets: [],
                feedbackMsg: '',
                selectedOrder: {},
                startDateInput: '2016-08-01',
                endDateInput: '2016-09-01',
                isShowAllOrder: false,
                exportTimeType: "ctime",


                isShowSetCost: false,
                parentIndex: 0,// 因为拼单有可能是双数组的原因,所以需要记录外层和内层数组的下标
                childrenIndex: 0,

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
                        // console.log("locationConfig: ", data);
                        this.locationConfig = data;
                    });
                })
            },
            FailureToSendSingle: function () {
                let that = this;
                $.ajax({
                    url: `${base.gAjaxUrl.officialcarorders}waiting_send_number/`,
                    type: 'GET',
                })
                    .success((data) => {
                        base.ajaxCallback(data, () => {
                            // console.log(1);
                            // console.log(data);
                            // console.log(2);
                            // console.log(data.wait_send_number);
                            // let data = JSON.parse(data)
                            // that.wait_send_numbers=1;
                            // if(data.wait_send_number){
                            that.wait_send_numbers = data.wait_send_number;
                            // }

                        });
                    })
            },
            init: function () {

                //判断是否是第一次进入该新功能或页面从而弹出新功能的提示
                if (localStorage.orderManagementPromptFlag == 'true') {
                    let arrObj = [$('#approvalStatusSelected'), $('#orderStatusSelected'), $('#carpoolInput'), $('#urgentInput'), $('#exportData'), $('#operation'),];
                    let arrTitle = ['可以对订单进行不同审批状态的筛选', '可以对订单进行不同审批状态的筛选', '可以对订单的是否拼车的状态进行筛选', '可以对订单的是否加急的状态进行筛选', '可以对订单的进行导出而查看具体的详情', '点击这里可以查看下面的订单操作的每项具体操作',];
                    var promptTypes = ['orderManagementPromptFlag',];
                    $.guidance({
                        obj: arrObj,
                        title: arrTitle,
                        flag: promptTypes,
                    });
                }
            },
            //isSelect: function() {

            // if(approvalStatusItems[3]){
            // ele.target.value;
            /* if(approvalStatusItems[3]=="驳回"){
             // if(approvalStatusSelected=="驳回"){
                 return this.ishidden = false;
             }
             */
            // if(approvalStatusItems[3]){

            //},
            isEmptyObject: function (obj) {
                for (var key in obj) {
                    return false
                }
                return true
            },
            operationTips: function (id) {
                layer.tips('1：取消订单：会发送推送通知申请人和司机；</br> 2：委派司机：会委派特定的司机会接申请人；</br>3：拼单：会与其他申请人一起乘同一辆车；</br>4：取消拼单：将不会与其他申请人一起乘同一辆车；</br>5：订单详细：可以看到你下单的信息和司机的相关信息；</br>6：其他反馈：可以把要反馈的内容发给申请人和司机；', '#operation', {
                    tips: [1, '#0FA6D8'],
                    time: 7000
                });
            },
            $Id: function (id) {
                return document.getElementById(id);
            },
            exportData: function () {
                let that = this;
                return $.ajax({
                    url: `${base.gAjaxUrl.officialcarstaffs}export_all_order_report/`,
                    type: 'post',
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify({
                        start_date: that.startDateInput,
                        end_date: that.endDateInput,
                        key_date: that.exportTimeType,
                    })
                })
                    .always((data) => {
                        this.$route.router.go({path: '/job'});
                        // layer.msg('最新的一条数据请重新刷新哦',{icon:1,time:3000});
                    })
            },
            //初始化分页
            initPage: function (obj, tpageToal = '4', current = '1', count = '0') {
                $(obj).createPage({
                    pageCount: tpageToal,
                    current: current,
                    count: count,
                    callback: (p) => {
                        carpoolOps.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax: function (callback = function () {
            }) {
                let that = this;
                this.itemsLoading = true;
                this.items = [];
                this.noData = false;
                //修改参数
                carpoolOps.param.search = this.searchInput;
                carpoolOps.param.approval_status = this.approvalStatusSelected;
                carpoolOps.param.order_status = this.orderStatusSelected;
                this.carpoolInput ? carpoolOps.param.is_carpool = true : delete carpoolOps.param.is_carpool;
                this.urgentInput ? carpoolOps.param.is_urgent = true : delete carpoolOps.param.is_urgent;

                this.urgentInput ? carpoolOps.param.is_driver_read = true : delete carpoolOps.param.is_driver_read;

                $.ajax({
                    url: `${base.gAjaxUrl.carpool}?page=${carpoolOps.page}&page_size=${carpoolOps.page_size}`,
                    contentType: 'application/json',
                    type: 'POST',
                    data: JSON.stringify(carpoolOps.param)
                })
                    .always((data) => {
                        that.itemsLoading = false;
                        base.ajaxCallback(data, () => {
                            let resultData = data.results;
                            that.items = resultData;
                            if (resultData.length) {
                                that.noData = false;
                                //回调
                                callback(data.num_pages, data.count);
                            } else {
                                that.noData = true;
                            }
                        });
                    })
            },
            //获取列表
            getList: function (reset = 0) {
                this.items = [];
                //重置第一页
                if (reset) {
                    this.searchInput = $("#searchInput").val();
                    carpoolOps.page = 1;
                }
                this.queryAjax((tpageToal = '4', count = '0') => {
                    this.initPage('#J-page', tpageToal, carpoolOps.page, count)
                });
            },
            clickDetail: function (data) {
                localStorage.employeeInfo = JSON.stringify(data);
            },
            cancelOrder: function (id, status_id) {
                let that = this;

                if (status_id == -10) {
                    layer.msg('订单已取消', {icon: 2, time: 1000});
                    return false;
                }
                layer.confirm('确认要取消吗？', (index) => {
                    $.ajax({
                        url: `${base.gAjaxUrl.officialcarorders}${id}/cancel/`,
                        type: 'get',
                    })
                        .always((data) => {
                            let dataResponseText = data.responseText && JSON.parse(data.responseText).detail;
                            if (dataResponseText && dataResponseText.msg) {
                                layer.msg(dataResponseText.msg, {icon: 2, time: 1000});
                                that.getList();
                            } else {
                                layer.msg('取消成功', {icon: 1, time: 1000});
                                that.getList();
                            }
                        })
                });
            },
            cancelOrder2: function (data) {
                this.isShowCancelDialog = true;
                this.cancelDialogData = data;
            },
            assignDriver: function (data) {
                let that = this;
                localStorage.userInfo = JSON.stringify(data);

                // layer.confirm('', {
                //     title:'开始委派',
                //     skin:'btn-center',
                //     btn: ['选择司机','选择车辆'] //按钮
                // }, function(){
                //     layer.closeAll();
                //     that.$route.router.go({path: '/assignDriver', replace: true})
                // }, function(){
                //     layer.closeAll();
                //     that.$route.router.go({path: '/assignCar', replace: true})

                // });
            },
            isGroup: function (e, i) {
                if (e[i + 1]) {
                    if (i == 0) {
                        return 'group first';
                    }
                    return e[i]['carpool_id'] == e[i + 1]['carpool_id'] ? 'group' : '';
                } else if (e[i - 1]) {
                    return e[i]['carpool_id'] == e[i - 1]['carpool_id'] ? 'group last' : '';
                } else {
                    return '';
                }
            },
            cancelCombine: function (id) {
                let that = this;
                layer.confirm('确认要取消拼单吗？', (index) => {
                    $.ajax({
                        url: base.gAjaxUrl.orderSeparate,
                        type: "POST",
                        data: {carpool_id: id}
                    })
                        .always((data) => {
                            base.ajaxCallback(data, () => {
                                that.getList();
                                layer.msg('取消成功', {icon: 1, time: 1000});
                            });
                        })
                });
            },
            addDialogClose: function (data) {
                this.isShowDialog = false;
            },
            orderDetailsClose: function (data) {
                this.isShowOrderDetailsDialog = false;
            },
            addDialogSave: function (data) {
                this.isShowAllOrder = false;
                this.isShowDialog = false;
                this.getList();
            },
            orderDetailsSave: function (data) {
                this.isShowOrderDetailsDialog = false;
                this.getList();
            },
            staffDialogClose: function (data) {
                this.isShowStaffDialog = false;
            },
            combineBtn: function (infoData = this.dialogData) {
                this.dialogData = infoData;
                this.isShowDialog = true;
                this.isShowAllOrder = false;
            },
            isUrgent: function (data) {
                if (data) {
                    return '<span class="red">是</span>';
                } else {
                    return '否';
                }
            },
            orderDialogClose: function (data) {
                this.isShowOrderDialog = false;
            },
            orderDetailBtn: function (data) {

                this.orderDialogData = data;
                this.isShowOrderDialog = true;
            },
            checkStaff(data) {
                this.staffDialogData = data;
                this.isShowStaffDialog = true;
            },
            clickCheck: function (data) {
                localStorage.mapInfo = JSON.stringify(data);
                this.isShowMapDialog = true;
            },
            mapClose: function (data) {
                this.isShowMapDialog = false;
            },
            assign: function (data) {
                this.assignDialogData = data;
                this.isShowAssignDialog = true;
            },
            assignClose: function (data) {
                this.isShowAssignDialog = false;
//                this.getList();
            },
            cancel_assign: function (data) {
                layer.confirm('确认要取消委派吗？', (index) => {
                        // console.log("cancel_assign");
                        $.ajax({
                            url: `${base.gAjaxUrl.officialcarorders}${data['id']}/cancel_assign/`,
                            contentType: 'application/json',
                            type: 'get'
                        })
                            .done((data) => {
                                base.ajaxCallback(data, () => {
                                    layer.msg('取消委派成功', {icon: 1, time: 1000});
                                    this.getList()
                                });
                            })
                    }
                );
            },
            feedback: function (data) {
                var that = this
                this.selectedOrder = data
                layer.open({
                    type: 1,
                    title: '其他反馈1',
                    content: $('#feedback'),
                    area: ['720px'],
                    btn: ['确认发送'],
                    yes: function (index, layero) {
                        // 发送反馈
                        if (that.feedbackTargets.length == 0) {
                            layer.msg('请选择反馈对象')
                            return
                        }
                        if (that.feedbackMsg.length == 0) {
                            layer.msg('请输入反馈内容')
                            return
                        }
                        $.ajax({
                            url: `${base.gAjaxUrl.officialcarorders}${data['id']}/feedback/`,
                            contentType: 'application/json',
                            type: 'post',
                            data: JSON.stringify({
                                target: that.feedbackTargets,
                                content: that.feedbackMsg
                            })
                        })
                            .done((data) => {
                                base.ajaxCallback(data, () => {
                                    layer.msg('反馈成功', {icon: 1, time: 1000});
                                });
                            })
                        that.feedbackMsg = ''
                        that.feedbackTargets = []
                        that.selectedOrder = {}
                        layer.close(index)
                    },
                    cancel: function () {

                    }
                })
            },
            cancelClose: function (data) {
                this.isShowCancelDialog = false;
            },
            assignSave: function () {
                this.isShowAssignDialog = false;
                this.getList();
            },
            change: function () {
                this.isShowCancelDialog = false;
                this.getList(1);
            },
            showAllOrder: function () {
                this.isShowDialog = false;
                this.isShowAllOrder = true;
            },
            closeShowAllOrder: function () {
                this.isShowAllOrder = false;
            },
            setCost: function (item, index, parentIndex) {
                this.isShowSetCost = true;
                this.dialogData = item;
                this.childrenIndex = index;
                this.parentIndex = parentIndex;

            },
            closeSetCost: function () {
                this.isShowSetCost = false;
            },
            orderSave: function () {
                this.isShowOrderDialog = false;
                this.queryAjax((tpageToal = '4', count = '0') => {
                    this.initPage('#J-page', tpageToal, carpoolOps.page, count)
                });
            }
            // clickTr:function (index) {
            //     // 这个方法只为了记录当前点击是数组中的下标
            //     console.log("this.parentIndex");
            //     console.log(index);
            //     this.parentIndex = index;
            // }
        },
        components: {
            combine,
            order,
            drivermap,
            add,
            assign,
            cancel,
            recommend,
            setCost,
            // orderdetails
        },
        events: {
            'changeCost': function (cost) {
                let costStr = cost.toString()
                if (costStr.indexOf('.') != -1 && costStr.indexOf('.') + 2 <= costStr.length) {
                    cost = cost.toFixed(2);
                }
                this.items[this.parentIndex][this.childrenIndex].fee = cost;
            }
        }
    }
</script>
<style lang="less" rel="stylesheet/less" scoped>
    .export-box {
        width: 120px;
        height: 30px;
        font-size: 14px;
    }

    .table-container {
        width: 100%;
        /*padding: 10px;*/
        overflow: hidden;
        /*border: 1px solid #ccc;*/
        box-sizing: border-box;
    }

    .table-box {
        width: 100%;
        overflow-x: auto;
    }

    #feedback {
        display: none;
    }

    input.input-text1 {
        border: 0;
    }

    td.classRed {
        background-color: pink;
        color: #0e90d2;
    }

    .c-cancle {
        background-color: #bbb;
        color: #0e90d2;
    }

    a.btn.size-M-reset {
        padding: 4px 12px 4px 0px;
    }

    a.default-color {
        color: #555;
    }

    a.btn.size-MINI {
        padding: 1px 0px;
    }

    .hiddens {
        display: none;
    }

    .order-table {
        .table-bordered {
            border-collapse: collapse;
        }

        .group {
            border-left: 2px solid #5a98de;
            border-right: 2px solid #5a98de;

            &.first {
                border-top: 2px solid #5a98de;
            }

            &.last {
                border-bottom: 2px solid #5a98de;
            }
        }
    }

    .bubble-box {
        height: 20px;
        width: 50px;
        /*top:-20px;*/
        /*width:15px;*/
        fone-size: 12px;
        /*left:-12px;*/
        border-radius: 5px;
        /*padding-left:2em;*/
        background: #F3961C;
        /*position:absolute;*/
        color: white;
        margin: 0 auto;
    }

    /*.bubble-box::after{*/
    /*content:"";*/
    /*width:0;*/
    /*height:0;*/
    /*font-size:0;*/
    /*border-width:8px;*/
    /*border-style:solid;*/
    /*border-color:#f3961c transparent transparent;*/
    /*_border-color:#f3961c white white;*/
    /*overflow:hidden;*/
    /*position:absolute;*/
    /*left:20px;*/
    /*bottom:-16px;*/
    /*}*/
    /*.page-container {*/
    /*!* padding: 20px; *!*/
    /*margin: 20px;*/
    /*overflow: auto;*/
    /*width: 100%;*/
    /*}*/
</style>
