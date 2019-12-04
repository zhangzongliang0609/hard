<template>

    <section class="Hui-article-box">
        <div class="page-container">

            <div class="panel panel-default radius">
                <div class="panel-body clearfix">
                    <span class="f-20 fw-b f-l">部门统计</span>
                </div>
            </div>

            <div class="panel panel-default radius clearfix mt-10 mb-10">
                <div class="panel-body clearfix lh-30">

                    <div class="f-l clearfix">
                        <div class="f-l">部门名称：</div>
                        <div class="f-l sel_depart" style="width: 200px;">
                            <p-input :options="departOptions"
                                     @selected="selectItem"></p-input>
                        </div>
                    </div>

                    <div class="clearfix f-l ml-15">
                        <div class="f-l">日期搜索：</div>
                        <select v-model="searchDateType"
                                class="select f-l pl-5 pr-5"
                                style="width: 95px;height: 31px;">
                            <option value="ctime">申请时间</option>
                            <option value="complete_time">完成时间</option>
                        </select>
                        <input v-model="startDate"
                               v-el:start_date
                               type="text"
                               placeholder=""
                               class="f-l input-text ml-5 w-100 tc" />
                        <div class="f-l ml-5">至</div>
                        <input v-model="endDate"
                               v-el:end_date
                               type="text"
                               placeholder=""
                               class="f-l input-text ml-5 w-100 tc" />
                        <button v-on:click="getList(1)" class="f-l btn btn-success radius ml-15" type="button">
                            <i class=" Hui-iconfont">&#xe665;</i>
                        </button>
                    </div>

                    <a class="btn btn-secondary radius f-r" v-on:click="exportData()">数据导出</a>

                </div>
            </div>

            <table class="table table-border table-bordered table-hover table-bg table-sort">
                <thead>
                <tr class="text-c">
                    <th width="120">部门名称</th>
                    <th width="200">故障次数（含子部门）</th>
                    <th width="200">报修费用（含子部门）/元</th>
                    <th width="50">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr class="text-c" v-for="item in items">
                    <td>{{item.department_tree || ''}}</td>
                    <td>{{item.cnt || 0}}（{{item.cnt_ch || 0}}）</td>
                    <td>{{item.amount | getPrice}}（{{item.amount_ch | getPrice}}）</td>
                    <td>
                        <a class="btn btn-primary radius mr-5"
                           href="javascript:;"
                           v-on:click="showDetails(item)">详情</a>
                    </td>
                </tr>
                </tbody>
            </table>

            <div id="J-page" class="m-page" v-show="!noData"></div>
            <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>

        </div>
    </section>

</template>

<style lang="less" scoped>

    .sel_depart {
        width: 150px;
        height: 32px;
    }

</style>

<script type="text/ecmascript-6">

    import * as base from '../assets/js/base.js';
    import moment from 'moment';

    let staffsOps = null;

    export default {
        ready() {

            this.startDate = moment().add(-1, 'month').format('YYYY-MM-DD');
            this.endDate = moment().format('YYYY-MM-DD');


            new Kalendae.Input(this.$els.start_date, {
                months: 2,
                clickHide: true,
            });
            new Kalendae.Input(this.$els.end_date, {
                months: 2,
                clickHide: true,
            });

            staffsOps = {
                repairtree_code: '', // 部门搜索
                date_key: 'ctime',
                start_date: this.startDate,
                end_date: this.endDate,
                page: 1,
                page_size: 10,
            };
            this.getDepartment();
            this.getList(1);
        },
        events: {
            enterEvent () {
                this.getList(1);
            }
        },
        data: function () {
            return {
                noData: false,
                items: [],
                startDate: '',
                endDate: '',
                searchDateType: 'ctime',
                departOptions: [], // 所有部门
                selectDepartment: null,// 选择的部门
            }
        },
        methods: {
            // 获取部门列表 -- 订单中的存在的部门
            getDepartment() {
                $.ajax({
                    url: base.gAjaxUrl.repairorders_v1 + 'search_department/',
                    type: 'GET',
                    data: {
                        page: 1,
                        page_size: 999999
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
            selectItem(item) {
                this.selectDepartment = item;
            },
            showDetails(data) {
                if(!data || !data.department_tree) return;
                window.localStorage.setItem("_repairReportDepartmentData", JSON.stringify({
                    data: data,
                    endDate: this.endDate,
                    startDate: this.startDate,
                    searchDateType: this.searchDateType,
                }));
                this.$router.go({
                    path: '/repairEmployeeReport'
                })
            },
            //初始化分页
            initPage: function (obj, tpageToal = '4', current = '1', count = '0') {
                $(obj).createPage({
                    pageCount: tpageToal,
                    current: current,
                    count: count,
                    callback: (p) => {
                        staffsOps.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax: function (callback = function () {
            }) {
                $.showLoading();

                $.ajax({
                    url: base.gAjaxUrl.repairorders_v1 + 'static_department/',
                    type: 'GET',
                    data: staffsOps
                }).always((data) => {
                    $.hideLoading();
                    base.ajaxCallback(data, () => {
                        let resultData = data.results;
                        this.items = resultData;
                        if (resultData.length) {
                            this.noData = false;
                            //回调
                            callback(data.num_pages, data.count);
                        } else {
                            this.noData = true;
                        }
                    });
                })
            },
            keydown (e) {
                console.log("keydown", e);
            },
            //获取列表
            getList: function (flag) {
                if (flag) {
                    if(moment(this.endDate).isBefore(moment(this.startDate))) {
                        layer.msg("结束时间不得早于开始时间", {icon:2, time: 1500});
                        return;
                    }
                    staffsOps.page = 1;
                    staffsOps.date_key = this.searchDateType;
                    staffsOps.repairtree_code = this.selectDepartment ? this.selectDepartment.value : '';
                    staffsOps.start_date = this.startDate;
                    staffsOps.end_date = this.endDate;
                }
                this.queryAjax((tpageToal = '4', count = '0') => {
                    this.initPage('#J-page', tpageToal, staffsOps.page, count)
                });
            },
            exportData: function () {
                // console.log("exportData: ", staffsOps);
                $.showLoading();
                $.ajax({
                    url: `${base.gAjaxUrl.repairorders_v1}static_department_export/`,
                    type: 'GET',
                    data: staffsOps,
                }).always((data) => {
                    $.hideLoading();
                    base.ajaxCallback(data, () => {
                        this.$route.router.go({path: '/job', replace: true});
                    });
                })
            },
        },
        filters: {
            getPrice (price) {
                if(price) {
                    return (price / 100).toFixed(2)
                }
                return 0
            }
        },
        components: {}
    }
</script>

