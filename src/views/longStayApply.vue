<template>
    <!-- 添加 -->
    <detail :title="dialogTitle"
            :type="dialogType"
            :data="dialogData"
            v-if="isShowDetailDialog"
            v-on:dialog-close="detailDialogClose"></detail>
    <!-- 安排房间 -->
    <arrange :title="dialogTitle" :type="dialogType" :parent="'apply'" :data="dialogData" v-if="isShowArrangeDialog"
             v-on:dialog-close="arrangeDialogClose" v-on:dialog-save="arrangeDialogSave"></arrange>
    <!-- 其他反馈 -->
    <feedback :title="dialogTitle" :type="dialogType" :data="dialogData" v-if="isShowFeedbackDialog"
              v-on:dialog-close="feedbackDialogClose" v-on:dialog-save="feedbackDialogSave"></feedback>
    <!--确认入住弹窗-->
    <slot-window v-if="showWindow" :title="windowTitle" @dialog-close="closeWindow">
        <div class="cl window-box text-c">
            <div>
                确认{{checkinItem.staff_vo.real_name}}入住{{checkinItem.room_vo.location}}?
            </div>
            <div class="mt-10">
                <span>押金金额:</span>
                <input type="text" id="price" class="input-text">
            </div>
            <div class="mt-10">
                <span>押金单号:</span>
                <input type="text" id="priceNumber" class="input-text">
            </div>
        </div>
        <a class="btn btn-primary radius f-r mr-10 mb-10 mt-20" @click="confirmSet()" href="javascript:;">确定</a>
    </slot-window>
    <section class="Hui-article-box">
        <div class="page-container bgc-f5 bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body">
                    <span class="f-20 fw-b">住宿申请</span>
                    <span class="lh-30">审批状态：</span>
                    <span class="select-box  mr-10 w-100">
                        <select v-model="selectApprovalStatus" class="select"
                                @change="onSelectedApprovalStatus($event, item)">
                            <option value="" selected>全部</option>
                            <option value="20">正在审批中</option>
                            <option value="10">审批通过</option>
                            <option value="30">无法审批</option>
                            <option value="-10">驳回</option>
                        </select>
                    </span>
                    <!-- 订单状态：-10: "已取消";-5: "被驳回";10: "审批中";20: "待分配";30: "待入住";40: "已入住";50: "待退宿";60: "已退宿" -->
                    <span class=" lh-30">订单状态：</span>
                    <span class="select-box  mr-10 w-100">
                        <select v-model="selectStatus" class="select" @change="onSelectedStatus($event, item)">
                            <option value="" selected>全部</option>
                            <option v-for="(order_index, order_item) in selectStatusArr" value="{{order_item.code}}">{{order_item.name}}</option>
                        </select>
                    </span>
                    开始日期：
                    <input v-model="startDateInput" type="text" class="input-text Wdate mr-5 date-input"
                           id="J-start-outer-date" v-bind:value="startDateInput"/>
                    结束日期：
                    <input v-model="endDateInput" type="text" class="input-text Wdate mr-5 date-input"
                           id="J-end-outer-date" v-bind:value=""/>
                    <div class="text-l clearfix  mr-15 search">
                        <input id="searchInput" type="text" placeholder="姓名/手机号" style="width:250px"
                               class="f-l input-text">
                        <button v-on:click="getList(1)" class="btn btn-success radius-r" type="button"><i
                                class="f-r Hui-iconfont">&#xe665;</i></button>
                    </div>
                    <span class="f-r">
                        <a href="javascript:;" class="btn btn-secondary radius" v-on:click="exportData()">导出数据</a>
                    </span>
                </div>
            </div>
            <div class="bk-gray radius mt-10 bgc-fff">
                <div class="pd-15 clearfix">
                    <div class="f-l">
                        <a class="btn btn-primary radius" title="当前房间状态" href="javascript:;"
                           v-link="{ name: 'roommessages' }" data-title="房务信息">当前房间状态</a>
                    </div>
                    <div class="ml-20 f-l">
                        <span class="mr-5"><i class="icon-sq icon-sq-84beff"></i>待分配</span>
                        <span class="mr-5"><i class="icon-sq icon-sq-fc1339"></i>逾期未入住</span>
                        <span class="mr-5"><i class="icon-sq icon-sq-f6e12e"></i>退房中</span>
                    </div>
                    <div class="f-l pd-5">
                        <span>员工申请住房时是否可以选择房间类型</span>
                        <label class="ml-10">
                            <input type="radio" @click="isSelectRoomType(1)" name="checkType"
                                   :checked="selectRoomStatus">
                            是
                        </label>
                        <label class="ml-10">
                            <input type="radio" @click="isSelectRoomType(0)" name="checkType"
                                   :checked="!selectRoomStatus">
                            否
                        </label>
                    </div>
                </div>
                <table class="table table-border table-bg table-striped">
                    <thead class="text-c">
                    <tr>
                        <th class="pl-15">申请人</th>
                        <th>手机号</th>
                        <th>申请时间</th>
                        <th>预计入住时间</th>
                        <th>分配日期</th>
                        <th>审批人</th>
                        <th>审批状态</th>
                        <th>订单状态</th>
                        <th class="mw-200">申请原因</th>
                        <th>申请房间类型</th>
                        <th>入住房间</th>
                        <th>预计退房日期</th>
                        <th>期望退房日期</th>
                        <th class="w-170">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="text-c" v-for="item in items">
                        <td class="relative pl-15">
                            <span class="tableTags"
                                  v-bind:class="[item.status==20?'icon-sq-84beff':(item.status==50?'icon-sq-f6e12e':'')]"></span>

                            <!--                            红色 icon-sq-fc1339 -->
                            <span class="tableTags"
                                  v-if="item.status === 30"
                                  :class="{'icon-sq-fc1339': isOverTime(item.assign_date)}"></span>

                            {{item.staff_vo.real_name}}

                        </td>
                        <td>{{item.phone || item.staff_vo.phone || '--'}}</td>
                        <td>{{item.ctime|times}}</td>
                        <td>{{item.checkin_pre || '--'}}</td>
                        <td>{{item.assign_date?item.assign_date:'--'}}</td>
                        <td>
                            <span v-if="!item.approvalinfo_set">--</span>
                            <span v-else v-for="data in item.approvalinfo_set"><span>{{data.approver_vo.real_name}}<span
                                    v-show="$index < item.approvalinfo_set.length-1">/</span></span></span>
                        </td>
                        <td>{{item.approval_status_name}}</td>
                        <td>{{item.status_name}}</td>
                        <td class="mw-200 text-overflow">{{item.apply_reason?item.apply_reason:'--'}}</td>
                        <td>{{item.room_type_vo?item.room_type_vo.type_name:'--'}}</td>
                        <td>{{item.room_vo?item.room_vo.location:'--'}}</td>
                        <td>{{item.checkout_pre?item.checkout_pre:'--'}}</td>
                        <td>{{item.checkout_date?item.checkout_date:'--'}}</td>
                        <td>
                            <a class="btn btn-primary radius mr-5 fs-12 mt-1" title="取消订单" href="javascript:;"
                               v-if="item.status==10||item.status==20||item.status==30" v-on:click="clickCancel(item)">取消订单</a>
                            <a class="btn btn-primary radius mr-5 fs-12 mt-1" title="安排房间" href="javascript:;"
                               v-if="item.status==20" v-on:click="clickArrangeRoom(item)">安排房间</a>
                            <a class="btn btn-primary radius mr-5 fs-12 mt-1" title="确认入住" href="javascript:;"
                               v-if="item.status==30" v-on:click="setRoom(item)">确认入住</a>
                            <a class="btn btn-primary radius mr-5 fs-12 mt-1" title="退房" href="javascript:;"
                               v-if="item.status==40" v-on:click="clickCheckout(item)">退房</a>
                            <a class="btn btn-primary radius mr-5 fs-12 mt-1" title="确认退宿" href="javascript:;"
                               v-if="item.status==50" v-on:click="clickConfirmCheckout(item)">确认退宿</a>
                            <a class="btn btn-primary radius mr-5 fs-12 mt-1" title="订单详情" href="javascript:;"
                               v-on:click="clickDetail(item)">订单详情</a>
                            <a class="btn btn-primary radius mr-5 fs-12 mt-1" title="其他反馈" href="javascript:;"
                               v-on:click="clickFeedback(item)">其他反馈</a>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div id="J-page" class="m-page" v-show="!noData"></div>
                <div class="lh-60 text-c" v-if="noData">没有相关数据</div>
            </div>
        </div>
    </section>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>
<style lang="less" rel="stylesheet" scoped>
    .bgc-f5 {
        background-color: #f5f5f5;
    }

    .fw-b {
        font-weight: bold;
    }

    .btn.pd-4 {
        padding: 4px;
    }

    .btn.fs-12 {
        font-size: 12px;
    }

    .icon-sq {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 3px;
        margin-right: 3px;
        margin-top: 10px;
    }

    .icon-sq-84beff {
        background-color: #84beff;
    }

    .icon-sq-fc1339 {
        background-color: #fc1339;
    }

    .icon-sq-f6e12e {
        background-color: #f6e12e;
    }

    .table th.pl-15,
    .table td.pl-15 {
        padding-left: 15px;
    }

    .tableTags {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 10px;
        display: inline-block;
    }

    .search {
        display: inline-block;
    }

    .window-box {

        .input-text {
            width: 150px;
        }

    }
</style>
<script type="text/ecmascript-6">

    import * as base from '../assets/js/base.js';
    import detail from '../components/applysettleorderDetail.vue';
    import arrange from '../components/arrangeRoom.vue';
    import feedback from '../components/feedback.vue';
    import slotWindow from '../components/slotWindow';
    import moment from 'moment';

    let itemsOps = null;

    export default {
        ready() {

            itemsOps = {
                status: '',
                approval_status: '',
                search: '',
                page: 1,
                page_size: 10,
            };

            this.startDateInput = moment().add('-1', 'months').format('YYYY-MM-DD');
            this.endDateInput = moment().format('YYYY-MM-DD');

            new Kalendae.Input('J-end-outer-date', {
                months: 2,
            });
            new Kalendae.Input('J-start-outer-date', {
                months: 2,
            });

            // 先获取规则 - 规则中有列表需要进行判断的信息
            this.getDormitoryRules();
            this.getSelectRoomStatus();

            window.moment = moment;

        },
        data: function () {
            return {
                noData: false,
                itemsLoading: false,
                isShowDetailDialog: false,
                isShowArrangeDialog: false,
                isShowFeedbackDialog: false,
                items: [],
                startDateInput: '',
                endDateInput: '',
                selectApprovalStatus: '',
                selectStatus: '',
                selectStatusArr: [
                    {
                        code: 10,
                        name: "审批中"
                    },
                    {
                        code: 20,
                        name: "待分配"
                    },
                    {
                        code: 30,
                        name: "待入住"
                    },
                    {
                        code: 40,
                        name: "已入住"
                    },
                    {
                        code: 50,
                        name: "待退宿"
                    },
                    {
                        code: 60,
                        name: "已退宿"
                    },
                    {
                        code: -10,
                        name: "已取消"
                    },
                    {
                        code: -5,
                        name: "被驳回"
                    },
                ],
                searchInput: '',
                dialogTitle: '',
                dialogType: 'add',
                dialogData: {},
                showWindow: false,
                checkinItem: "",
                selectRoomStatus: '',
                windowTitle: "确认入住",
                ruleData: {},
            }
        },
        methods: {
            // 判断待入住是否超时
            isOverTime(dateTime) {

                console.log("dateTime: ", dateTime, day);
                if(!dateTime || !this.ruleData.id) return false;

                let day = this.ruleData.checkin_deadline_day;
                // console.log(moment(dateTime).add(day, 'day').format('x'), moment().format('x'));
                return moment(dateTime).add(day, 'day').isBefore(moment())

            },
            // 获取宿舍入住期限规则
            getDormitoryRules: function () {
                $.ajax({
                    url: base.gAjaxUrl.dormitoryrules,
                    type: 'GET',
                    data: {
                        page: 1,
                        page_size: 10
                    }
                }).always((data) => {
                    base.ajaxCallback(data, () => {
                        let res = data.results;
                        if (res[0]) this.ruleData = res[0];
                        console.log("getDormitoryRules: ", data);
                    });
                    this.getList(1);
                })
            },
            detailDialogClose: function (data) {
                this.isShowDetailDialog = false;
            },
            arrangeDialogClose: function (data) {
                this.isShowArrangeDialog = false;
            },
            arrangeDialogSave: function (data) {
                this.getList();
            },
            feedbackDialogClose: function (data) {
                this.isShowFeedbackDialog = false;
            },
            feedbackDialogSave: function (data) {
                this.isShowFeedbackDialog = false;
            },
            clickDetail: function (data) {
                this.dialogTitle = '订单详情';
                this.dialogData = data;
                console.log("订单详情");
                console.log(data);
                this.isShowDetailDialog = true;
            },
            clickArrangeRoom: function (data) {
                this.dialogTitle = '安排房间';
                this.dialogData = data;
                this.isShowArrangeDialog = true;
            },
//             clickCheckin:function(item){
//                 let that = this;
//                 this.showCheckin = true;
//                 this.checkinItem = item;
// //                layer.confirm(
// //                    `确认${item.staff_vo.real_name}入住${item.room_vo.location}?`,
// //                    (index)=>{
// //
// //                    },
// //                    ()=>{
// //                        that.isShowModify = false;
// //                    }
// //                );
//             },
            setRoom: function (item) {
                // if(item.room_vo.is_locking){
                //     layer.msg("该房间已锁定,如需要安排人员入住,请先解除锁定",{icon:2,time:2000});
                //     return
                // }
                this.showWindow = true;
                this.checkinItem = item;
            },
            confirmSet: function () {
                let that = this;
                let price = $("#price").val();
                let priceNumber = $("#priceNumber").val();
                if (!/^\d+(?:\.\d{1,2})?$/.test(price) && price) {
                    layer.msg("押金金额必须是数字而且最多两位小数", {icon: 2, time: 1500});
                    return
                }
                this.itemsLoading = true;
                let ajaxAddData = {
                    deposit: price,
                    deposit_no: priceNumber,
                }
                if (!this.checkinItem.is_full) {
                    $.ajax({
                        url: `${base.gAjaxUrl.applysettleorders}${that.checkinItem.id}/checkin/`,
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(ajaxAddData),
                    }).always(function (data) {
                        this.itemsLoading = false;
                        base.ajaxCallback(data, function () {
                            layer.msg('提交成功', {icon: 1, time: 1000});
                            that.showWindow = false;
                            that.getList();
                        });
                    });
                }
            },


            // confirmCheckin:function (item) {
            //     let that = this;
            //     let isLock = $("#lockRoom").is(':checked');
            //     if(isLock){
            //         $.ajax({
            //             url:`${base.gAjaxUrl.rooms}${that.checkinItem.room_vo.id}`,
            //             type:"PUT",
            //             data:{
            //                 room_no:that.checkinItem.room_vo.room_no,
            //                 building:that.checkinItem.room_vo.building_vo.id,
            //                 room_type:that.checkinItem.room_vo.room_type,
            //                 is_locking:true,
            //             }
            //         }).always((data)=>{
            //             base.ajaxCallback(data,()=>{
            //
            //             })
            //         })
            //     }
            //     $.ajax({
            //         url: `${base.gAjaxUrl.applysettleorders}${that.checkinItem.id}/checkin/`,
            //         type: 'POST',
            //     })
            //             .always((data)=>{
            //                 base.ajaxCallback(data,()=>{
            //                     layer.msg('提交成功',{icon:1,time:1000});
            //                     that.showCheckin = false;
            //                     that.getList();
            //                 });
            //             })
            // },
            clickCheckout: function (item) {
                let that = this;
                layer.confirm(
                    `确认${item.staff_vo.real_name}从${item.room_vo.location}退宿?
                       <br>
                     押金金额:&nbsp;${item.deposit ? item.deposit : 0}
                       <br>
                     押金票号:&nbsp;${item.deposit_no ? item.deposit_no : '无'}`,
                    (index) => {
                        layer.closeAll("dialog");
                        $.ajax({
                            url: `${base.gAjaxUrl.applysettleorders}${item.id}/checkout/`,
                            type: 'POST',
                        }).always((data) => {
                            base.ajaxCallback(data, () => {
                                layer.msg('提交成功', {icon: 1, time: 1000});
                                that.isShowDelete = false;
                                that.getList();
                            });
                        })
                    },
                    () => {
                        that.isShowModify = false;
                    }
                );
            },
            clickConfirmCheckout: function (item) {
                let that = this;
                layer.confirm(
                    `确认${item.staff_vo.real_name}从${item.room_vo.location}退宿?
                       <br>
                     押金金额:&nbsp;${item.deposit ? item.deposit : 0}
                       <br>
                     押金票号:&nbsp;${item.deposit_no ? item.deposit_no : '无'}`,
                    (index) => {
                        layer.closeAll("dialog");
                        $.ajax({
                            url: `${base.gAjaxUrl.applysettleorders}${item.id}/confirm_checkout/`,
                            type: 'POST',
                        })
                            .always((data) => {
                                base.ajaxCallback(data, () => {
                                    layer.msg('提交成功', {icon: 1, time: 1000});
                                    that.isShowDelete = false;
                                    that.getList();
                                });
                            })
                    },
                    () => {
                        that.isShowModify = false;
                    }
                );
            },
            clickCancel: function (item) {
                let that = this;

                layer.confirm(
                    `确认取消${item.staff_vo.real_name}的住房申请
                        ?
`,
                    (index) => {
                        $.ajax({
                            url: `${base.gAjaxUrl.applysettleorders}${item.id}/cancel/`,
                            type: 'POST',
                        })
                            .always((data) => {
                                base.ajaxCallback(data, () => {
                                    layer.msg('提交成功', {icon: 1, time: 1000});
                                    that.isShowDelete = false;
                                    that.getList();
                                });
                            })
                    },
                    () => {
                        that.isShowModify = false;
                    }
                );
            },
            clickFeedback: function (data) {
                this.dialogTitle = '其他反馈';
                this.dialogData = data;
                this.isShowFeedbackDialog = true;
            },
            //初始化分页
            initPage: function (obj, tpageToal = '4', current = '1', count = '0') {
                $(obj).createPage({
                    pageCount: tpageToal,
                    current: current,
                    count: count,
                    callback: (p) => {
                        itemsOps.page = p;
                        this.queryAjax();
                    }
                });
            },
            //获取长住申请单列表
            getList: function (reset = 0) {
                let that = this;
                //重置第一页
                if (reset) {
                    this.searchInput = $("#searchInput").val();
                    itemsOps.page = 1
                }
                this.queryAjax((tpageToal = '4', count = '0') => {
                    that.initPage('#J-page', tpageToal, itemsOps.page, count)
                });
            },
            queryAjax: function (callback = function () {
            }) {
                //修改参数
                this.itemsLoading = true;
                itemsOps.search = this.searchInput;
                itemsOps.status = this.selectStatus;
                itemsOps.approval_status = this.selectApprovalStatus;
                itemsOps.start_date = this.startDateInput;
                itemsOps.end_date = this.endDateInput;

                $.ajax({
                    url: base.gAjaxUrl.applysettleorders,
                    type: 'GET',
                    data: itemsOps
                }).always((data) => {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, () => {
                        let resultData = data.results;
                        this.items = resultData;
                        if (resultData && resultData.length) {
                            this.noData = false;
                            //回调
                            callback(data.num_pages, data.count);
                        } else {
                            this.noData = true;
                        }
                    });
                })
            },
            onSelectedApprovalStatus: function (event, item) {
                this.selectApprovalStatus = event.target.value;
                this.getList(1);
            },
            onSelectedStatus: function (event, item) {
                this.selectStatus = event.target.value;
                this.getList(1);
            },
            closeWindow: function () {
                this.showWindow = false;
            },
            isSelectRoomType: function (type) {
                $.ajax({
                    url: `${base.gAjaxUrl.rooms}staff_select_building/`,
                    type: 'POST',
                    contentType: "application/json",
                    data: JSON.stringify({
                        status: type
                    })
                }).always((data) => {
                    base.ajaxCallback(data, () => {
                    });
                })
            },
            getSelectRoomStatus: function () {
                let that = this;
                $.ajax({
                    url: `${base.gAjaxUrl.rooms}staff_select_building/`,
                    type: 'GET',
                }).always((data) => {
                    base.ajaxCallback(data, () => {
                        that.selectRoomStatus = data.status;
                    });
                })
            },
            exportData: function () {
                let that = this;
                let ajaxData = {
                    search: this.searchInput,
                    status: this.selectStatus,
                    approval_status: this.selectApprovalStatus,
                    start_date: this.startDateInput,
                    end_date: this.endDateInput,
                };
                that.itemsLoading = true;
                $.ajax({
                    url: `${base.gAjaxUrl.applysettleorders}export/`,
                    type: 'GET',
                    data: ajaxData,
                }).always((data) => {
                    that.itemsLoading = false;
                    this.$route.router.go({path: '/job'});
                    // layer.msg('最新的一条数据请重新刷新哦',{icon:1,time:3000});
                })
            },

        },
        components: {
            detail,
            arrange,
            feedback,
            slotWindow: slotWindow,
        },
        filters: {
            times: function (times) {
                return times.substring(0, times.indexOf(' '));
            }
        }
    }
</script>
