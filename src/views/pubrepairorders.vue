<template>
    <!-- 添加 -->
    <detail :title="dialogTitle" :type="dialogType" :data="dialogData" v-if="isShowDetailDialog"
            v-on:dialog-close="detailDialogClose"></detail>

    <section class="Hui-article-box">
        <div class="page-container bgc-f5 bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body">
                    <span class="f-20 fw-b">公共区域报修订单管理</span>
                </div>
            </div>
            <div class="bk-gray radius mt-10 bgc-fff">
                <div class="pd-15 clearfix w-100p">
                    <span class="f-l lh-30">报修类型：</span>
                    <span class="select-box f-l mr-10 w-100">
                        <select v-model="selectType" class="select" @change="onSelectedType($event, item)">
                            <option value="" selected>全部</option>
                            <option v-for="item in repairTypes" value="{{item.id}}">{{item.type_name}}</option>
                        </select>
                    </span>
                    <span class="f-l lh-30">审批状态：</span>
                    <span class="select-box f-l mr-10 w-100">
                        <select v-model="selectApprovalStatus" class="select"
                                @change="onSelectedApprovalStatus($event, item)">
                            <option value="" selected>全部</option>
                            <option value="20">正在审批中</option>
                            <option value="10">审批通过</option>
                            <option value="-10">驳回</option>
                        </select>
                    </span>
                    <span class="f-l lh-30">订单状态：</span>
                    <span class="select-box f-l mr-10 w-100">
                        <select v-model="selectOrderStatus" class="select"
                                @change="onSelectedOrderStatus($event, item)">
                            <option value="" selected>全部</option>
                            <option value="10">审批中</option>
                            <option value="20">待维修</option>
                            <option value="30">已完成</option>
                            <option value="40">已评价</option>
                            <option value="-10">已取消</option>
                        </select>
                    </span>
                    <div class="text-l clearfix f-l mr-15">
                        部门：
                        <div class="departmentInput mr-5">
                            <div class="department_select_container" @mouseleave="departmentEnter(false)"
                                 @mouseenter="departmentEnter(true)">
                                <input v-if="departmentItem.length === 0" disabled type="text" class="input-text"
                                       value="无可选择部门">
                                <input v-else autocomplete="off" @click="departmentClick"
                                       v-model="departmentSelectedName"
                                       type="text" class="input-text" value="" placeholder="" name="department">
                                <i v-show="departmentSelectedName !== ''" class="empty-icon Hui-iconfont"
                                   @click="emptySearch()">&#xe60b;</i>
                                <div class="departmentListBox" style="display: none">
                                    <div v-bind:title="item.department_tree"
                                         v-for="item in departmentItem | filterBy departmentSelectedName in 'department_tree'"
                                         @click="setDepartmentValue(item)" class="departmentListItem">
                                        {{item.department_tree}}
                                    </div>
                                </div>
                            </div>
                        </div>
                        开始日期：
                        <input v-model="startDateInput" type="text" class="input-text Wdate mr-5 date-input"
                               id="J-start-outer-date" v-bind:value="startDateInput"/>
                        结束日期：
                        <input v-model="endDateInput" type="text" class="input-text Wdate mr-5 date-input"
                               id="J-end-outer-date" v-bind:value="endDateInput"/>
                        <input id="searchInput" v-model="searchInput" type="text" placeholder="姓名/工号/手机号"
                               style="width:250px"
                               class="input-text">
                        <button v-on:click="getList(1)" class="btn btn-success" type="button"><i
                                class="f-r Hui-iconfont">&#xe665;</i></button>
                    </div>
                    <button id="exportData" class="btn btn-primary radius f-r" v-on:click="exportData()">导出数据</button>
                </div>
                <table class="table table-border table-bg table-striped">
                    <thead class="text-c">
                    <tr>
                        <th>申请人</th>
                        <th>工号</th>
                        <th>电话</th>
                        <th>报修类型</th>
                        <th>故障地址</th>
                        <th class="remark">故障项目</th>
                        <th>申请时间</th>
                        <th>审批状态</th>
                        <th>订单状态</th>
                        <th>审批人</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="text-c" v-for="item in items">
                        <td>{{item.staff_vo.real_name}}</td>
                        <td>{{item.staff_vo.job_number}}</td>
                        <td>{{item.contact_phone}}</td>
                        <td>{{item.repair_type_name}}</td>
                        <td>{{item.location}}</td>
                        <td class="remark">
                                <span v-for="data in item.fault_item_vos">
                                    <span>
                                        {{data.fault_name}}
                                        <span v-show="$index < item.fault_item_vos.length-1">/</span>
                                    </span>
                                </span>
                        </td>
                        <td>{{item.ctime}}</td>
                        <td>{{item.approval_status_name}}</td>
                        <td>{{item.status_name}}</td>
                        <td><span v-for="list in item.approvalinfo_set"><span>{{list.approver_vo.real_name}}<span
                                v-show="$index < item.approvalinfo_set.length-1">/</span></span></span></td>
                        <td>
                            <a class="btn btn-primary radius mr-5 fs-12" title="订单详情" href="javascript:;" class="ml-5"
                               v-on:click="clickDetail(item)">订单详情</a>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div id="J-page" class="m-page" v-show="!noData"></div>
                <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
                <div class="m-loading" v-if="itemsLoading">
                    <div class="cube1"></div>
                    <div class="cube2"></div>
                </div>
            </div>
        </div>
    </section>
</template>
<style lang="less" scoped>
    .bgc-f5 {
        background-color: #f5f5f5;
    }

    .fw-b {
        font-weight: bold;
    }

    .remark {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 150px;
    }

    .remark:hover {
        white-space: normal;
        overflow: visible;
        text-overflow: clip;
    }

    .w-100p {
        width: 100%;
        box-sizing: border-box;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import moment from "moment";
    import detail from '../components/pubrepairorderDetail.vue';

    let repairOps = null;

    export default{
        ready(){
            repairOps = {
                param: {
                    status: '',
                    approval_status: '',
                    repair_type: '',
                    search: '',
                    page: 1,
                    page_size: 10,
                }
            };
            this.initPlugin();
            this.getRepairTypeList();
            this.getList(1);
        },
        data: function () {
            return {
                noData: false,
                itemsLoading: false,
                isShowDetailDialog: false,
                items: [],
                repairTypes: [],
                selectType: '',
                selectApprovalStatus: '',
                selectOrderStatus: '',
                searchInput: '',
                startDateInput: '',
                endDateInput: '',
                departmentSelected: '',
                departmentSelectedName: '',
                departmentItem: [],
                dialogTitle: '添加报修类型',
                dialogType: 'add',
                dialogData: {}
            }
        },
        methods: {
            initPlugin: function () {
                this.startDateInput = moment().add('-1', 'months').format('YYYY-MM-DD');
                this.endDateInput = moment().format('YYYY-MM-DD');

                new Kalendae.Input('J-end-outer-date', {
                    months: 2,
                    clickHide: true
                });
                new Kalendae.Input('J-start-outer-date', {
                    months: 2,
                    clickHide: true
                });

                //获取部门列表
                $.ajax({
                    url: base.gAjaxUrl.departments,
                    type: 'GET',
                    data: {
                        page: 1,
                        page_size: 999999
                    }
                }).always((data)=> {
                    this.departmentItem = data || [];
                });
            },
            detailDialogClose: function (data) {
                this.isShowDetailDialog = false;
            },
            clickDetail: function (data) {
                this.dialogTitle = '订单详情';
                this.dialogData = data;
                this.isShowDetailDialog = true;
            },
            clickModify: function (data) {
                this.dialogTitle = '修改报修类型';
                this.dialogType = 'modify';
                this.dialogData = data;
                this.isShowDetailDialog = true;
            },
            //初始化分页
            initPage: function (obj, tpageToal = '4', current = '1', count = '0') {
                $(obj).createPage({
                    pageCount: tpageToal,
                    current: current,
                    count: count,
                    callback: (p)=> {
                        repairOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            //获取公共区域报修订单列表
            getList: function (reset = 0) {
                let that = this;
                //重置第一页
                if (reset) {
                    repairOps.param.page = 1;
                    repairOps.param.search = $("#searchInput").val();
                    repairOps.param.department = this.getDepartmentId(this.departmentSelectedName);
                    repairOps.param.start_date = this.startDateInput;
                    repairOps.param.end_date = this.endDateInput;
                }

                this.queryAjax((tpageToal = '4', count = '0')=> {
                    that.initPage('#J-page', tpageToal, repairOps.param.page, count)
                });
            },
            queryAjax: function (callback = function () {
            }) {
                //修改参数
                this.itemsLoading = true;
                repairOps.param.status = this.selectOrderStatus;
                repairOps.param.approval_status = this.selectApprovalStatus;
                repairOps.param.repair_type = this.selectType;

                $.ajax({
                    url: base.gAjaxUrl.pubrepairorders,
                    type: 'GET',
                    data: repairOps.param
                }).always((data)=> {
                    base.ajaxCallback(data, ()=> {
                        this.itemsLoading = false;
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
            //获取报修类型列表
            getRepairTypeList: function () {
                let ajaxData = {
                    param: {
                        search: '',
                        page: 1,
                        page_size: 999999,
                    }
                };
                $.ajax({
                    url: base.gAjaxUrl.repairtypes,
                    type: 'GET',
                    data: ajaxData.param,
                })
                        .always((data)=> {
                            let resultData = data.results;
                            this.repairTypes = resultData;
                        });
            },
            onSelectedType: function (event, item) {
                this.selectType = event.target.value;
                this.getList(1);
            },
            onSelectedApprovalStatus: function (event, item) {
                this.selectApprovalStatus = event.target.value;
                this.getList(1);
            },
            onSelectedOrderStatus: function (event, item) {
                this.selectOrderStatus = event.target.value;
                this.getList(1);
            },
            departmentClick: function () {
                if (this.isDepartmentFocus) {
                    $(".departmentListBox").show();
                }
            },
            // 清楚搜索输入框
            emptySearch: function () {
                this.departmentSelectedName = '';
                $(".departmentListBox").show();
            },
            departmentEnter: function (flag) {
                this.isDepartmentFocus = flag;
                !flag && $(".departmentListBox").hide();
            },
            setDepartmentValue: function (item) {
                this.departmentSelectedName = item.department_tree;
                this.departmentSelected = item.id;
                $(".departmentListBox").hide()
            },
            getDepartmentId: function (val) {
                var id = '';
                this.departmentItem.forEach(function (item) {
                    if (item.department_tree == val) {
                        id = item.id;
                    }
                });
                return id;
            },
            exportData: function () {
                if (moment(this.endDateInput).isBefore(this.startDateInput)) {
                    layer.msg("开始时间不能大于结束时间", {icon: 2, time: 1500});
                    return
                }
//                repairOps.param.search = $("#searchInput").val();
//                repairOps.param.department = this.getDepartmentId(this.departmentSelectedName);
//                repairOps.param.start_date = this.startDateInput;
//                repairOps.param.end_date = this.endDateInput;
//                repairOps.param.authorization = `${localStorage['token']}`; // 需要这个？
//                repairOps.param.status = this.selectOrderStatus;
//                repairOps.param.approval_status = this.selectApprovalStatus;
//                repairOps.param.repair_type = this.selectType;
                $.ajax({
                    url: `${base.gAjaxUrl.pubrepairorders}export/`,
//                    contentType: 'application/json',
                    type: 'GET',
//                    data: JSON.stringify({
                    data: {
                        search: this.searchInput,
                        start_date: this.startDateInput,
                        end_date: this.endDateInput,
                        status: this.selectOrderStatus,
                        approval_status: this.selectApprovalStatus,
                        repair_type: this.selectType,
                        department: this.getDepartmentId(this.departmentSelectedName)
                    }
                }).always((data)=> {
                    base.ajaxCallback(data, () => {
                        this.$route.router.go({path: '/job'})
                    })
                })
            },
        },
        components: {
            detail,
        }
    }
</script>
