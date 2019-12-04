<template>

    <!-- 添加 -->
    <add_detail :title="dialogTitle"
                :parent_component="vInstance"
                :data="dialogData"
                v-if="isShowDetailDialog"
                v-on:dialog-close="detailDialogClose"></add_detail>

    <section class="Hui-article-box">

        <div class="page-container bgc-f5">

            <div class="panel panel-default radius">
                <div class="panel-body clearfix lh-30">
                    <a href="javascript:;"
                       class="f-l btn btn-primary radius"
                       @click="goBack">返回</a>
                    <span class="f-16 f-l ml-15">部门名称：</span>
                    <span class="f-16 f-l">{{departmentData.department_tree || ''}}</span>
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

                        <div class="f-l clearfix ml-15">
                            <div class="f-l lh-30">订单状态：</div>
                            <!--订单状态只处理 60:已完成,70:已评价-->
                            <div class="select-box f-l"
                                 style="width: 100px;height: 31px;">
                                <select v-model="selectOrderStatus"
                                        class="select status"
                                        @change="onSearchChange($event)">
                                    <option value="">全部</option>
                                    <option value="60">已完成</option>
                                    <option value="70">已评价</option>
                                </select>
                            </div>
                        </div>

                        <div class="clearfix ml-20 f-l">
                            <select v-model="searchDateType"
                                    class="select f-l pl-5 pr-5"
                                    style="width: 95px;height: 31px;">
                                <option value="ctime">申请时间</option>
                                <option value="complete_time">完成时间</option>
                            </select>
                            <div class="f-l ml-10">日期搜索：</div>
                            <input v-model="startDateInput"
                                   v-el:start_date
                                   type="text"
                                   placeholder=""
                                   class="f-l input-text ml-5 w-100 tc"/>
                            <div class="f-l ml-5">至</div>
                            <input v-model="endDateInput"
                                   v-el:end_date
                                   type="text"
                                   placeholder=""
                                   class="f-l input-text ml-5 w-100 tc"/>
                        </div>

                    </div>

                    <div class="f-l clearfix mt-10">

                        <div class="f-l clearfix">
                            <span class="f-l lh-30">支付方式： </span>
                            <span class="select-box f-l w-100">
                                <select v-model="selectOrderPayType"
                                        class="select type"
                                        @change="onSearchChange()">
                                <option value="" selected>全部</option>
                                <option value="wx">微信</option>
                                <option value="cash">现金支付</option>
                                <option value="withholding">代缴代扣</option>
                                <option value="free">无需支付</option>
                            </select>
                            </span>
                        </div>

                        <div class="f-l clearfix ml-15">
                            <select v-model="searchInputType"
                                    class="select f-l pl-5 pr-5"
                                    style="width: 90px;height: 31px;">
                                <option value="real_name">申请人</option>
                                <option value="phone">联系电话</option>
                                <option value="job_number">工号</option>
                            </select>
                            <input autocomplete="off"
                                   v-model="searchInput"
                                   type="text"
                                   placeholder="请输入内容"
                                   style="width:200px;margin-left: -1px" class="input-text f-l">
                        </div>

                        <button v-on:click="getList(1)"
                                class="btn btn-success radius-r f-l"
                                type="button"><i
                                class="f-r Hui-iconfont">&#xe665;</i></button>

                    </div>

                </div>
            </div>

            <div class="table_container">
                <table class="table table-border table-bg table-striped">
                    <thead class="text-c">
                    <tr>
                        <th width="80">申请人</th>
                        <th width="80">部门</th>
                        <th width="60">工号</th>
                        <th width="60">联系电话</th>
                        <th width="80">报修地址</th>
                        <th width="80">报修区域</th>
                        <th width="80">报修项目</th>
                        <th width="60">申请时间</th>
                        <th width="60">期望维修时间</th>
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
                        <td>{{item.repairtree_code || '--'}}</td>
                        <td>{{item.job_number || '--'}}</td>
                        <td>{{item.contact_phone || '--'}}</td>
                        <td class="text-overflow">{{item.location || '--'}}</td>
                        <td class="text-overflow">{{item.area || '--'}}</td>
                        <td class="text-overflow">{{item.fault_item_vos}}</td>
                        <td>{{item.ctime ? item.ctime.slice(0, 16) : '--'}}</td>
                        <td>{{item.expect_repair_time ? item.expect_repair_time.slice(0, 16) : "--"}}</td>
                        <td>{{item.approval_status_name || '--'}}</td>
                        <td>{{item.status_name || '--'}}</td>
                        <td>{{item.repairman_name || '--'}}</td>
                        <td>{{item.pay_amount ? (item.pay_amount/100).toFixed(2) : '--'}}</td>
                        <td>{{item | getPayTypeName}}</td>
                        <td>
                            <a class="btn btn-primary radius fs-12" title="详情" href="javascript:;"
                               v-on:click="clickDetail(item)">详情</a>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div id="J-page" class="m-page" v-show="!noData"></div>
                <div class="text-c lh-60" v-if="noData">没有相关数据</div>
            </div>

        </div>
    </section>
</template>

<style lang="less" scoped rel="stylesheet/less">
    .bgc-f5 {
        background-color: #f5f5f5;
    }

    .btn.fs-12 {
        font-size: 12px;
    }

    .w100p {
        width: 100%;
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

<script type="text/ecmascript-6">

    import * as base from '../assets/js/base.js';
    import moment from "moment";
    import add_detail from '../components/repairorderDetail.vue';

    let repairOps = null;

    export default {
        ready() {

            let storageData = JSON.parse(window.localStorage.getItem("_repairReportDepartmentData")) || {};
            let data = storageData.data;
            if (data && data.department_tree) {

                this.departmentData = data || {};
                this.initPlugin(storageData);
                this.setSearchOpts();
                this.getList(1);

            } else {
                layer.alert("参数异常", () => {
                    this.$router.go({
                        path: '/repairDepartReport',
                        replace: true
                    })
                })
            }

            this.vInstance = this;

        },
        data: function () {
            return {
                noData: false,
                isShowDetailDialog: false,
                items: [],
                searchInput: '', // 申请人...输入框
                searchInputType: 'real_name', // 申请人...输入框搜索类型
                selectOrderStatus: '', // 订单状态
                areas: [], // 所有区域列表
                areaOptions: [], // 报修区域 select 选项值
                selectAreaIndex: 0, // 选择的报修区域的索引值；-1表示都不选
                selectArea: '', // 选择的报修区域id
                selectOrderPayType: '',
                dialogTitle: '添加报修类型',
                dialogType: '',
                dialogData: {},
                startDateInput: '',
                endDateInput: '',
                departmentData: {}, // 传入过来的部门数据
                vInstance: null, // 当前组建的 vue 实例
                searchDateType: 'ctime', // 日期搜索类型
            }
        },
        events: {
            enterEvent () {
                this.getList(1);
            }
        },
        methods: {
            initPlugin: function (storageData) {

                this.startDateInput = storageData.startDate || moment().add('-1', 'months').format('YYYY-MM-DD');
                this.endDateInput = storageData.endDate || moment().format('YYYY-MM-DD');
                this.searchDateType = storageData.searchDateType || 'ctime';
                new Kalendae.Input(this.$els.start_date, {
                    months: 2,
                    clickHide: true,
                });
                new Kalendae.Input(this.$els.end_date, {
                    months: 2,
                    clickHide: true,
                });

                // 获取报修区域列表
                this.getAreas();

            },
            // 获取报修区域列表
            getAreas() {
                $.ajax({
                    url: base.gAjaxUrl.repairorders_v1 + 'search_area/',
                    type: 'GET',
                    data: {
                        repairtree_code:this.departmentData.department_tree || ''
                    }
                }).always((data) => {
                    base.ajaxCallback(data, () => {
                        let arr = data || [];
                        let res = ['全部', ...arr];
                        this.areaOptions = this.areas = res;
                    });
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
                ;
            },
            // 获取搜索条件
            setSearchOpts() {
                repairOps = {
                    page: 1,
                    page_size: 10,
                    repairtree_code: this.departmentData ? this.departmentData.department_tree : '',
                    start_date: this.startDateInput,
                    end_date: this.endDateInput,
                    area: this.selectArea === '全部' ? '' : this.selectArea,
                    status: this.selectOrderStatus,
                    pay_type: this.selectOrderPayType,
                    date_key: this.searchDateType,
                };
                repairOps[this.searchInputType] = this.searchInput;
            },
            //获取列表
            getList: function (reset = 0) {
                //重置第一页
                if (reset) {
                    if(moment(this.endDateInput).isBefore(moment(this.startDateInput))) {
                        layer.msg("结束时间不得早于开始时间", {icon:2, time: 1500});
                        return;
                    }
                    this.setSearchOpts();
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
                    url: base.gAjaxUrl.repairorders_v1 + 'deatil_department/',
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
                this.selectArea = val;
                this.getList(1);
            },
            onSearchChange: function (event) {
                this.getList(1);
            },
            goBack() {
                this.$router.go({
                    path: '/repairDepartReport',
                    replace: true,
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
            getPayTypeName (item) {
                // 订单状态item.status>=50（已过支付流程）
                // 有  pay_type_name 就显示；没有就显示“无需支付”
                // 50 之前的状态显示 '--'
                if(item.status >= 50) {
                    return item.pay_type_name || '无需支付'
                } else {
                    return '--'
                }
            }
        },
        components: {
            add_detail,
        }
    }
</script>
