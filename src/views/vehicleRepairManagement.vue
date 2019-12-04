<template>
    <!-- 添加 -->
    <detail :title="dialogTitle" :type="dialogType" :data="dialogData" v-if="isShowDetailDialog"
            v-on:dialog-close="detailDialogClose"></detail>
    <approve :title="dialogTitle" :type="dialogType" :data="dialogData" v-if="isShowApproveDialog"
             v-on:dialog-close="approveDialogClose" v-on:dialog-save="approveDialogSave"></approve>
    <offer :title="dialogTitle" :type="dialogType" :data="dialogData" v-if="isShowOfferDialog"
           v-on:dialog-close="offerDialogClose" v-on:dialog-save="offerDialogSave"></offer>

    <section class="Hui-article-box">
        <div class="page-container bgc-f5 bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body">
                    <span class="f-20 fw-b">维修/故障管理</span>
                </div>
            </div>
            <div class="bk-gray radius mt-10 bgc-fff">
                <div class="text-l pd-10 clearfix f-l mr-15 w-100p">
                    <div class="f-l clearfix">
                        <span class="f-l lh-30">订单状态：</span>
                        <span class="select-box f-l mr-10 w-100">
                            <select v-model="selectOrderStatus" class="select" @change="onSelectedOrderStatus($event)">
                                <option value="" selected>全部</option>
                                <option value="10">审批中</option>
                                <option value="20">待报价</option>
                                <option value="30">待审价</option>
                                <option value="40">待维修</option>
                                <option value="50">待验收</option>
                                <option value="60">已完成</option>
                                <option value="-10">已取消</option>
                                <option value="-5">被驳回</option>
                            </select>
                        </span>
                    </div>
                    部门：
                    <div class="departmentInput mr-5">
                        <div class="department_select_container" @mouseleave="departmentEnter(false)"
                             @mouseenter="departmentEnter(true)">
                            <input v-if="departmentItem.length === 0" disabled type="text" class="input-text"
                                   value="无可选择部门">
                            <input v-else autocomplete="off" @click="departmentClick" v-model="departmentSelectedName"
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
                    <input v-model="searchInput" type="text" placeholder="姓名/工号/手机号" style="width:250px" class="input-text"><button v-on:click="getList(1)" class="btn btn-primary radius-r" type="button"><i
                            class="Hui-iconfont">&#xe665;</i></button>
                    <button id="exportData" class="btn btn-primary radius f-r" v-on:click="exportData()">导出数据</button>
                    <!--<div class="mt-10">-->
                        <!--<span class="f-l">-->
                            <!--报价中金额超过临界金额是否开启三家比价-->
                        <!--</span>-->
                        <!--<label class="ml-40">-->
                            <!--<input type="radio" :checked="isOpen" @click="changeOpen(1)">-->
                            <!--开启-->
                        <!--</label>-->
                        <!--<label>-->
                            <!--<input type="radio" :checked="!isOpen" @click="changeOpen(0)">-->
                            <!--关闭-->
                        <!--</label>-->
                    <!--</div>-->
                </div>
                <table class="table table-border table-bg table-striped">
                    <thead class="text-c">
                    <tr>
                        <th>申请人</th>
                        <th>工号</th>
                        <th>电话</th>
                        <th>部门/职位</th>
                        <th>车牌</th>
                        <th>品牌</th>
                        <th>型号</th>
                        <th>订单状态</th>
                        <th>车辆锁定</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="text-c" v-for="item in items">
                        <td>{{item.staff_vo.real_name}}</td>
                        <td>{{item.staff_vo.job_number}}</td>
                        <td>{{item.staff_vo.phone}}</td>
                        <td>{{item.staff_vo.department_vo.department_name}}/{{item.staff_vo.position}}</td>
                        <td>{{item.vehicle_vo ? item.vehicle_vo.car_no : '无此车辆信息'}}</td>
                        <td>{{item.vehicle_vo ? item.vehicle_vo.car_brand : '无此车辆信息'}}</td>
                        <td>{{item.vehicle_vo ? item.vehicle_vo.car_model : '无此车辆信息'}}</td>
                        <!--<td v-if="item.vehicle_vo">{{item.vehicle_vo.car_no}}</td>-->
                        <!--<td v-else class="c-red">无此车辆信息</td>-->
                        <!--<td v-if="item.vehicle_vo">{{item.vehicle_vo.car_brand}}</td>-->
                        <!--<td v-else class="c-red">无此车辆信息</td>-->
                        <!--<td v-if="item.vehicle_vo">{{item.vehicle_vo.car_model}}</td>-->
                        <!--<td v-else class="c-red">无此车辆信息</td>-->
                        <td>{{item.status_name}}</td>
                        <td>
                            <img v-if="item.vehicle_vo" class="w-20 cursor-p"
                                 v-bind:src="item.vehicle_vo.locked ?'./src/assets/images/lock_close.png':'./src/assets/images/lock_open.png'"
                                 v-on:click="toggleLock(item)">
                            <span v-else>无此车辆信息</span>
                        </td>
                        <td>
                            <a class="btn btn-primary radius mr-5 fs-12 mt-1" title="审批" href="javascript:;"
                               v-if="item.status == 10 && item.vehicle_vo" v-on:click="clickApprove(item)">审批</a>
                            <a class="btn btn-primary radius mr-5 ml-5 fs-12 mt-1" title="报价" href="javascript:;"
                               v-if="item.status == 20 && item.vehicle_vo" v-on:click="clickOffer(item)">报价</a>
                            <a class="btn btn-primary radius mr-5 ml-5 fs-12 mt-1" title="维修完成" href="javascript:;"
                               v-if="item.status == 40 && item.vehicle_vo" v-on:click="clickFinish(item)">维修完成</a>
                            <!--<a v-if="item.vehicle_vo" class="btn btn-primary radius mr-5 fs-12 mt-1" title="查看详情" href="javascript:;" class="ml-5" v-on:click="clickDetail(item)">查看详情</a>-->
                            <a class="btn btn-primary radius mr-5 fs-12 mt-1" title="查看详情" href="javascript:;"
                               class="ml-5" v-on:click="clickDetail(item)">查看详情</a>
                            <!--<span v-if="!item.vehicle_vo">无此车辆信息</span>-->
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

    .btn.fs-12 {
        font-size: 12px;
    }

    .w-100p {
        width: 100%;
        box-sizing: border-box;
    }

    .select-box {
        line-height: 21px;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import moment from "moment";
    import detail from '../components/vehicleRepairCostDetail';
    import approve from '../components/vehicleRepairApprove.vue';
    import offer from '../components/vehicleRepairOffer.vue';

    let repairOps = null;

    export default{
        ready(){
            repairOps = {
                param: {
                    status: '',
                    search: '',
                    page: 1,
                    page_size: 10,
                }
            };

            this.initPlugin();
            this.getList(1);
            this.getConfig();
        },
        data: function () {
            return {
                noData: false,
                itemsLoading: false,
                isShowDetailDialog: false,
                isShowApproveDialog: false,
                isShowOfferDialog: false,
                items: [],
                selectOrderStatus: '',
                searchInput: '',
                dialogTitle: '添加报修类型',
                dialogType: 'add',
                dialogData: {},
                startDateInput: '',
                endDateInput: '',
                departmentSelected: '',
                departmentSelectedName: '',
                departmentItem: [],
                test: {
                    locked: true,
                    id: '3e641ca5-8c51-4ca6-b738-69a8891e10e0',
                },
                isOpen:0,
            }
        },
        methods: {
            getConfig:function(){
              $.ajax({
                  url:base.gAjaxUrl.baseConfig,
                  type:"GET",
                  data:{
                      module:"vehiclerepair_three_parity",
                  }
              }).always((data)=>{
                  base.ajaxCallback(data,()=>{
                      this.isOpen = data.vehiclerepair_three_parity
                  })
              })
            },
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
            approveDialogClose: function (data) {
                this.isShowApproveDialog = false;
            },
            approveDialogSave: function (data) {
                this.isShowApproveDialog = false;
                this.getList();
            },
            offerDialogClose: function (data) {
                this.isShowOfferDialog = false;
            },
            offerDialogSave: function (data) {
                this.isShowOfferDialog = false;
                this.getList();
            },
            clickDetail: function (data) {
                this.dialogTitle = '订单详情';
                this.dialogData = data;
                this.isShowDetailDialog = true;
            },
            clickApprove: function (data) {
                this.dialogTitle = '审批订单';
                this.dialogData = data;
                this.isShowApproveDialog = true;
            },
            clickOffer: function (data) {
                this.dialogTitle = '报价';
                this.dialogData = data;
                this.isShowOfferDialog = true;
            },
            toggleLock: function (item) {
                let that = this;
                let url;
                let content = '';
                let title = '';
                if (item.vehicle_type == 1) {// 通勤车
                    url = base.gAjaxUrl.shuttlebusvehicles + item.vehicle_vo.id;
                } else { // 公务车
                    url = base.gAjaxUrl.officialcarvehicles + item.vehicle_vo.id;
                }
                if (item.vehicle_vo.locked) {
                    // 解锁
                    url += '/unlock/';
                    content = '确认解锁该车辆？';
                    title = '确认解锁';
                } else {
                    // 锁定
                    url += '/lock/';
                    content = '锁定后该车辆将无法被派单或驾驶，确认锁定该车辆？';
                    title = '确认锁定';
                }
                layer.confirm(content, {title: title}, (index)=> {
                    $.ajax({
                        url: url,
                        type: 'GET'
                    }).always((data)=> {
                        base.ajaxCallback(data, ()=> {
                            layer.msg('提交成功', {icon: 1, time: 1000});
                            item.locked = data.locked;
                            that.getList();
                        });
                    })
                })
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
            //获取订单列表
            getList: function (reset = 0) {
                //重置第一页
                if (reset) {
                    repairOps.param.page = 1;
                    repairOps.param.start_date = this.startDateInput;
                    repairOps.param.end_date = this.endDateInput;
                    repairOps.param.department = this.getDepartmentId(this.departmentSelectedName);
                    repairOps.param.search = this.searchInput;
                }
                this.queryAjax((tpageToal = '4', count = '0')=> {
                    this.initPage('#J-page', tpageToal, repairOps.param.page, count)
                });
            },
            queryAjax: function (callback = function () {}) {

                // 修改参数
                this.itemsLoading = true;
                repairOps.param.status = this.selectOrderStatus;
                $.ajax({
                    url: base.gAjaxUrl.vehiclerepairorders,
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
            onSelectedOrderStatus: function (event) {
                this.selectOrderStatus = event.target.value;
                this.getList(1);
            },
            clickFinish: function (data) {
                layer.confirm(
                        `确认维修完成车辆[${data.vehicle_vo.car_no}]的维修申请？`,
                        {
                            title: '确认维修完成？'
                        },
                        (index)=> {
                            $.ajax({
                                url: `${base.gAjaxUrl.vehiclerepairorders}${data.id}/repair_finish/`,
                                type: 'POST',
                            }).always((data)=> {
                                layer.close(index);
                                base.ajaxCallback(data, ()=> {
                                    this.getList();
                                });
                            })
                        },
                );
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
//                repairOps.param.search = this.searchInput;
//                repairOps.param.start_date = this.startDateInput;
//                repairOps.param.end_date = this.endDateInput;
//                repairOps.param.department = this.getDepartmentId(this.departmentSelectedName);
//                repairOps.param.authorization = `${localStorage['token']}`;
                $.ajax({
                    url: `${base.gAjaxUrl.vehiclerepairorders}export/`,
//                    contentType: 'application/json',
                    type: 'GET',
                    data: {
                        search: this.searchInput,
                        start_date: this.startDateInput,
                        end_date: this.endDateInput,
                        status: this.selectOrderStatus,
                        department: this.getDepartmentId(this.departmentSelectedName)
                    }
                }).always((data)=> {
                    base.ajaxCallback(data, () => {
                        this.$route.router.go({path: '/job'})
                    })
                })
            },
            changeOpen:function(flag){
                if(flag == this.isOpen){
                    return;
                }
                this.isOpen = flag;
                $.ajax({
                    url:`${base.gAjaxUrl.baseConfig}?module=vehiclerepair`,
                    type:"POST",
                    data:{
                        vehiclerepair_three_parity:this.isOpen,
                    }
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
                    })
                })
            }
        },
        components: {
            detail,
            approve,
            offer,
        }
    }
</script>
