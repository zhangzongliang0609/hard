<template>
    <!-- 添加 -->
    <add_detail :title="dialogTitle" :parent_component="vInstance" :data="dialogData" v-if="isShowDetailDialog"
                v-on:dialog-close="detailDialogClose"></add_detail>
    <add_repairman :type="dialogType" :data="dialogData" v-if="isShowRepairmanDialog"
                   v-on:dialog-close="repairmanDialogClose" v-on:dialog-save="repairmanDialogSave"></add_repairman>
    <add_price :title="dialogTitle" :type="dialogType" :data="dialogData" v-if="isShowPriceDialog"
               v-on:dialog-close="priceDialogClose" v-on:dialog-save="priceDialogSave"></add_price>
    <set_paytype :title="dialogTitle" :type="dialogType" :data="dialogData" v-if="isShowPayTypeDialog"
                 v-on:dialog-close="payTypeDialogClose"></set_paytype>

    <section class="Hui-article-box">

        <div class="page-container bgc-f5">

            <div class="panel panel-default radius">
                <div class="panel-body clearfix">
                    <span class="f-20 fw-b f-l">报修订单管理</span>
                </div>
            </div>

            <div class="panel panel-default radius clearfix mt-10 mb-10">
                <div class="panel-body clearfix lh-30">

                    <div class="f-l clearfix w100p">
                        <div class="f-l clearfix">
                            <div class="f-l lh-30">报修区域：</div>
                            <div class="f-l w-130">
                                <p-sel :data="areaOptions"
                                       :len="6"
                                       :index="selectAreaIndex"
                                       @save="onAreaChange"></p-sel>
                            </div>
                        </div>
                        <div class="f-l clearfix">
                            <div class="f-l lh-30 ml-10">审批状态：</div>
                            <select v-model="selectApproveStatus"
                                    class="select w-100 h-31"
                                    @change="onSearchChange($event)">
                                <option value="" selected>全部</option>
                                <option value="-10">已驳回</option>
                                <option value="10">审批通过</option>
                                <option value="20">审批中</option>
                                <option value="30">无需审批</option>
                            </select>
                        </div>

                        <div class="f-l clearfix">
                            <span class="f-l lh-30 ml-10">订单状态： </span>
                            <!--订单状态 -5 驳回;-10:已取消,1:审批中,10:待派单,20:待报价,30:待确认,40:待支付,50:待维修,60:已完成,70:已评价-->
                            <span class="select-box f-l w-100">
                                <select v-model="selectOrderStatus" class="select status"
                                        @change="onSearchChange($event)">
                                    <option value="" selected>全部</option>
                                    <option value="1">审批中</option>
                                    <option value="10">待派单</option>
                                    <option value="20">待报价</option>
                                    <option value="30">待审价</option>
                                    <option value="40">待支付</option>
                                    <option value="50">待维修</option>
                                    <option value="55">待验收</option>
                                    <option value="60">已完成</option>
                                    <option value="70">已评价</option>
                                    <option value="-10">已取消</option>
                                    <option value="-5">已驳回</option>
                                </select>
                            </span>
                        </div>

                        <div class="f-l clearfix">
                            <span class="f-l lh-30 ml-10">支付方式： </span>
                            <span class="select-box f-l w-100">
                                <select v-model="selectOrderPayType" class="select type"
                                        @change="onSearchChange()">
                                <option value="" selected>全部</option>
                                    <!--<option value="alipay">支付宝</option>-->
                                <option value="wx">微信</option>
                                <option value="cash">现金支付</option>
                                <option value="withholding">代缴代扣</option>
                                <option value="free">无需支付</option>
                            </select>
                            </span>
                        </div>

                        <div class="f-l clearfix">
                            <div class="f-l lh-30 ml-10">部门：</div>
                            <div class="f-l" style="width: 150px;height: 32px;">
                                <p-input :options="departOptions"
                                         @selected="selectDepartmentItem"></p-input>
                            </div>
                        </div>

                        <div class="f-r clearfix">
                            <button id="exportData"
                                    class="btn btn-primary radius f-r"
                                    v-on:click="exportData()">导出数据
                            </button>
                        </div>
                    </div>

                    <div class="f-l clearfix mt-10 w100p">
                        <div class="f-l lh-30">开始日期：</div>
                        <div class="f-l w-100">
                            <input v-model="startDateInput" type="text" class="input-text Wdate mr-5 date-input"
                                   id="J-start-outer-date" v-bind:value="startDateInput"/>
                        </div>
                        <div class="f-l lh-30 ml-10">结束日期：</div>
                        <div class="f-l w-100">
                            <input v-model="endDateInput"
                                   type="text"
                                   class="input-text Wdate mr-5 date-input"
                                   id="J-end-outer-date" v-bind:value="endDateInput"/>
                        </div>
                        <div class="f-l clearfix ml-10">
                            <div class="f-l">
                                <input autocomplete="off"
                                       v-model="searchInput"
                                       type="text"
                                       placeholder="申请人/联系电话/工号"
                                       style="width:200px"
                                       class="input-text">
                            </div>
                            <div class="f-l">
                                <button v-on:click="getList(1)"
                                        class="btn btn-success radius-r"
                                        type="button">
                                    <i class="f-r Hui-iconfont">&#xe665;</i>
                                </button>
                            </div>

                        </div>
                        <div class="f-l ml-20">
                            <a class="btn btn-primary radius" title="设置支付方式" href="javascript:;"
                               v-on:click="setPayType()">设置支付方式</a>
                        </div>
                    </div>

                </div>
            </div>

            <div class="table_container">
                <table class="table table-border table-bg table-striped">
                    <thead class="text-c">
                    <tr>
                        <th width="80">申请人</th>
                        <th width="60">工号</th>
                        <th width="60">联系电话</th>
                        <th width="80">报修地址</th>
                        <th width="80">报修区域</th>
                        <th width="80">报修项目</th>
                        <th width="50">申请时间</th>
                        <th width="50">期望维修时间</th>
                        <th width="60">审批状态</th>
                        <th width="60">订单状态</th>
                        <th width="60">维修工</th>
                        <th width="60">维修金额</th>
                        <th width="60">支付方式</th>
                        <th width="180">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="text-c" v-for="item in items">
                        <td>{{item.real_name || '--'}}</td>
                        <td>{{item.job_number || '--'}}</td>
                        <td>{{item.contact_phone || '--'}}</td>
                        <td class="text-overflow">{{item.location || '--'}}</td>
                        <td class="text-overflow">{{item.repairarea_name || '--'}}</td>
                        <td class="text-overflow">{{item.fault_items || '--'}}</td>
                        <td>{{item.ctime.slice(0, 16)}}</td>
                        <td>{{item.expect_repair_time ? item.expect_repair_time.slice(0, 16) : "--"}}</td>
                        <td>{{item.approval_status_name || '--'}}</td>
                        <td>{{item.status_name || '--'}}</td>
                        <td>{{item.repairman_name || '--'}}</td>
                        <td>{{item.pay_amount ? (item.pay_amount/100).toFixed(2) : '0'}}</td>
                        <!--                        <td>{{item.pay_type_name ? item.pay_type_name : '无需支付'}}</td>-->
                        <td>{{item | getPayTypeName}}</td>
                        <td>
                            <a class="btn btn-primary radius mr-5 fs-12"
                               title=""
                               href="javascript:;"
                               v-if="item.status==10||item.status==30||item.status==55||(item.status==40&&item.pay_type=='cash')">
                                <span v-if="item.status==10" v-on:click="clickAppointRepairman(item)">委派维修工</span>
                                <span v-if="item.status==30" v-on:click="clickConfirmPrice(item)">确认费用</span>
                                <span v-if="item.status==55" v-on:click="clickAcceptance(item)">维修验收</span>
                                <span v-if="item.status==40 && item.pay_type=='cash'" v-on:click="confirmCash(item.id)">确认支付</span>
                            </a>
                            <a class="btn btn-primary radius fs-12"
                               title="订单详情"
                               href="javascript:;"
                               v-on:click="clickDetail(item)">订单详情</a>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div id="J-page" class="m-page" v-show="!noData"></div>
                <div class="text-c lh-60" v-if="noData">没有相关数据</div>
            </div>

        </div>

    </section>

    <!-- 其他反馈输入框-->
    <div class="pd-20 clearfix" id="repairRemarkLayerDom">
        <div style="width: 80px" class="f-l">
            备注信息:
        </div>
        <div class="f-l">
            <textarea placeholder="请输入要反馈的内容，最多只能输入120字"
                      class="textarea"
                      maxlength="120"
                      style="width:350px;height:100px"
                      v-model="orderRemark">
            </textarea>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">

    import * as base from '../assets/js/base.js';
    import moment from "moment";
    import add_detail from '../components/repairorderDetail.vue';
    import add_repairman from '../components/appointRepairman.vue';
    import add_price from '../components/confirmPrice.vue';
    import set_paytype from '../components/setPayType.vue';

    let repairOps = null;

    export default {
        ready() {

            repairOps = {
                status: '',
                pay_type: '',
                page: 1,
                page_size: 10,
            };

            this.initPlugin();
            this.getList(1);

            this.vInstance = this;

        },
        data: function () {
            return {
                noData: false,
                isShowDetailDialog: false,
                isShowRepairmanDialog: false,
                isShowPriceDialog: false,
                isShowPayTypeDialog: false,
                items: [],
                repairTypes: [],
                selectType: '',
                selectApproveStatus: '', // 选择审批状态
                selectOrderStatus: '', // 订单状态
                areas: [], // 所有区域列表
                areaOptions: [], // 报修区域 select 选项值
                selectAreaIndex: 0, // 选择的报修区域的索引值；-1表示都不选
                selectArea: '', // 选择的报修区域名称
                selectOrderPayType: '',
                searchInput: '',
                dialogTitle: '添加报修类型',
                orderRemark: '',
                dialogType: '',
                dialogData: {},
                startDateInput: '',
                endDateInput: '',
                departOptions: [], // 所有部门
                selectDepartment: null, // 选择的部门
                vInstance: null, // 当前组建的 vue 实例
            }
        },
        events: {
            enterEvent() {
                this.getList(1);
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

                // 获取部门列表
                this.getDepartment();
                // 获取报修区域列表
                this.getAreas();

            },
            // 获取部门列表 -- 订单中的存在的部门
            getDepartment() {
                $.ajax({
                    url: base.gAjaxUrl.repairorders_v1 + 'search_department/',
                    type: 'GET',
                    data: {
                        page: 1,
                        page_size: 999999,
                        finish: 1,
                    }
                }).always((data) => {
                    base.ajaxCallback(data, () => {
                        this.departOptions = data.map(item => {
                            return {
                                value: item
                            }
                        });
                    });
                })
            },
            // 获取部门列表
            getAreas() {
                $.ajax({
                    url: base.gAjaxUrl.repairorders_v1 + 'search_area/',
                    type: 'GET',
                }).always((data) => {

                    let arr = data || [];
                    let res = ['全部', ...arr];
                    this.areaOptions = this.areas = res;

                });
            },
            // 选择了部门时
            selectDepartmentItem(item) {
                this.selectDepartment = item;
            },
            detailDialogClose: function (data) {
                this.isShowDetailDialog = false;
            },
            repairmanDialogSave: function (data) {
                this.isShowRepairmanDialog = false;
                this.getList();
            },
            repairmanDialogClose: function (data) {
                this.isShowRepairmanDialog = false;
            },
            priceDialogSave: function (data) {
                this.isShowPriceDialog = false;
                this.getList();
            },
            priceDialogClose: function (data) {
                this.isShowPriceDialog = false;
            },
            payTypeDialogClose: function (data) {
                this.isShowPayTypeDialog = false;
            },
            clickDetail: function (data) {
                this.dialogTitle = '订单详情';
                this.dialogData = data;
                this.isShowDetailDialog = true;
            },
            clickAppointRepairman: function (data) {
                this.dialogData = data;
                this.isShowRepairmanDialog = true;
            },
            clickConfirmPrice: function (data) {
                this.dialogTitle = '确认报价';
                this.dialogType = 'confirm';
                this.dialogData = data;
                this.isShowPriceDialog = true;
            },
            clickAcceptance(item) {
                layer.open({
                    type: 1,
                    title: '确认验收',
                    content: $('#repairRemarkLayerDom'),
                    area: ['500px'],
                    btn: ['确定', '取消'],
                    yes: (index) => {
                        $.showLoading();
                        $.ajax({
                            url: base.gAjaxUrl.repairorders + item.id + '/accept/',
                            type: 'GET',
                            data: {
                                check_remark: this.orderRemark
                            }
                        }).always((data) => {
                            $.hideLoading();
                            base.ajaxCallback(data, () => {
                                layer.close(index);
                                this.orderRemark = '';
                                layer.msg("提交成功", {icon: 1, time: 1500});
                                layer.close(index);
                                this.getList(1);
                            })
                        });
                    },
                    cancel: (index) => {
                        layer.close(index)
                    }
                });
            },
            setPayType: function () {
                this.dialogTitle = '维修支付方式';
                this.dialogData = 5; //所属模块  1:通勤车,2:公务车,3:入住,4:订水,5:宿舍维修
                this.isShowPayTypeDialog = true;
            },
            //初始化分页
            initPage: function (obj, tpageToal = '4', current = '1', count = '0') {
                $(obj).createPage({
                    pageCount: tpageToal,
                    current: current,
                    count: count,
                    callback: (p) => {
                        repairOps.page = p;
                        this.queryAjax();
                    }
                })
            },
            //获取列表
            getList: function (reset = 0) {
                //重置第一页
                if (reset) {
                    if (moment(this.endDateInput).isBefore(moment(this.startDateInput))) {
                        layer.msg("结束时间不得早于开始时间", {icon: 2, time: 1500});
                        return;
                    }
                    repairOps.page = 1;
                    repairOps.search = this.searchInput;
                    repairOps.repairtree_code = this.selectDepartment ? this.selectDepartment.value : '';
                    repairOps.start_date = this.startDateInput;
                    repairOps.end_date = this.endDateInput;
                    repairOps.area = this.selectArea === '全部' ? '' : this.selectArea;
                    repairOps.approval_status = this.selectApproveStatus;
                    repairOps.status = this.selectOrderStatus;
                    repairOps.pay_type = this.selectOrderPayType;
                }
                this.queryAjax((tpageToal = '4', count = '0') => {
                    this.initPage('#J-page', tpageToal, repairOps.page, count)
                })
            },
            queryAjax: function (callback = function () {
            }) {
                //修改参数
                $.showLoading();
                $.ajax({
                    url: base.gAjaxUrl.repairorders,
                    type: 'GET',
                    data: repairOps
                }).always((data) => {
                    $.hideLoading();
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
                    })
                })
            },
            onAreaChange(val, idx, order) {
                // console.log("onAreaChange: ", val, idx, order);
                this.selectAreaIndex = idx;
                this.selectArea = this.areas[this.selectAreaIndex];
                this.getList(1);
            },
            onSearchChange: function (event) {
                this.getList(1);
            },
            confirmCash: function (id) {
                let that = this;
                layer.confirm('该员工是否已完成现金支付？', (index) => {
                    $.showLoading();
                    if ($('tbody tr.text-c').length == 1 && repairOps.page > 1) {
                        repairOps.page--;
                    }
                    $.ajax({
                        url: `${base.gAjaxUrl.repairorders}${id}/confirm_cash/`,
                        type: 'POST',
                    }).always((data) => {
                        $.hideLoading();
                        base.ajaxCallback(data, () => {
                            layer.msg('提交成功', {icon: 1, time: 1000});
                            that.getList();
                        })
                    })
                })
            },
            exportData: function () {
                if (moment(this.endDateInput).isBefore(this.startDateInput)) {
                    layer.msg("开始时间不能大于结束时间", {icon: 2, time: 1500});
                    return
                }
                $.showLoading();
                $.ajax({
                    url: `${base.gAjaxUrl.repairorders_v1}export/`,
                    type: 'GET',
                    data: {
                        search: this.searchInput,
                        start_date: this.startDateInput,
                        end_date: this.endDateInput,
                        status: this.selectOrderStatus,
                        approval_status: this.selectApproveStatus,
                        pay_type: this.selectOrderPayType,
                        area: this.selectArea === '全部' ? '' : this.selectArea,
                        repairtree_code: this.selectDepartment ? this.selectDepartment.value : ''
                    }
                }).always((data) => {
                    $.hideLoading();
                    base.ajaxCallback(data, () => {
                        this.$route.router.go({path: '/job'});
                    });
                })
            }
        },
        filters: {
            getAreaName(id) {
                for (let i = 0, len = this.areas.length; i < len; i++) {
                    let item = this.areas[i];
                    if (id == item.id) {
                        return item.area_name
                    }
                }
                return '--'
            },
            getPayTypeName(item) {
                // 订单状态item.status>=50（已过支付流程）
                // 有  pay_type_name 就显示；没有就显示“无需支付”
                // 50 之前的状态显示 '--'
                if (item.status >= 50) {
                    return item.pay_type_name || '无需支付'
                } else {
                    return '--'
                }
            }
        },
        components: {
            add_detail,
            add_repairman,
            add_price,
            set_paytype,
        }
    }
</script>

<style lang="less" scoped rel="stylesheet/less">
    .bgc-f5 {
        background-color: #f5f5f5;
    }

    .fw-b {
        font-weight: bold;
    }

    .btn.fs-12 {
        font-size: 12px;
    }

    .w100p {
        width: 100%;
    }

    .department_search {
        width: 130px;
    }

    .select-box {
        line-height: 1.5;
        box-sizing: border-box;

        &.area_box {
            width: 130px;
        }

        .area {
            width: 100%;
        }
    }

    .table_container {
        width: 100%;
        overflow: auto;
    }
</style>
