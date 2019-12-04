<template>
    <busdetail v-if="showDriverDetailReport" :detail="detailData" v-on:detail-close="detailClose"></busdetail>
    <section class="Hui-article-box" v-show="!showDriverDetailReport">
        <div class="page-container">
            <div class="text-l clearfix ">
                <div class=" f-l cl  fade">
                    <div class="text-l ">
                        司机：
                        <input id="searchInput" autocomplete="off" type="text" class="input-text Wdate mr-5" style="width:250px;" placeholder="姓名/电话">
                        开始日期：
                        <input  v-model="startDateInput" type="text" class="input-text Wdate mr-5 date-input"  id="J-start-outer-date">
                        结束日期：
                        <input v-model="endDateInput" type="text" class="input-text Wdate mr-5 date-input"   id="J-end-outer-date">
                        <button id="getList" type="submit" class="btn btn-success radius" v-on:click="getList(1)"><i  class="Hui-iconfont">&#xe665;</i></button>
                        <button  id="exportData" class="btn btn-primary radius f-r" v-on:click="exportData()">导出数据</button>
                    </div>
                </div>
            </div>
            <table class="table table-border table-bordered table-hover table-bg mt-20">
                <thead>
                <tr class="text-c">
                    <th>姓名</th>
                    <th>性别</th>
                    <!--<th>报名次数</th>-->
                    <th>职位</th>
                    <th>电话</th>
                    <th>工号</th>
                    <th>出车次数</th>
                    <th >查看</th>
                </tr>
                </thead>
                <div class="result" v-if="!noData">
                    <tbody>
                    <tr class="text-c" v-for="item in items">
                        <td>{{item.staff_vo.real_name}}</td>
                        <td>{{item.sex==1? '男': '女'}}</td>
                        <td>{{item.staff_vo.position}}</td>
                        <td>{{item.staff_vo.phone}}</td>
                        <td>{{item.staff_vo.job_number}}</td>
                        <!--<td>{{item.apply_cnt}}</td>-->
                        <td>{{item.order_cnt}}</td>
                        <td>
                            <a class="btn btn-link size-S radius" href="javascript:;" v-on:click="detailShow(item)">出车详情</a>
                        </td>
                    </tr>
                    </tbody>
                </div>
            </table>
            <div id="J-inner-page" class="m-page" v-show="!noData"></div>
            <div class="m-loading" v-if="itemsLoading">
                <div class="cube1"></div>
                <div class="cube2"></div>
            </div>
            <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
        </div>
    </section>
</template>

<style lang="less">
    .fade{
        width: 100%;
        margin: 10px 0px;
        opacity: 1 !important;
        #exportData{
            margin-right: 20px;
        }
    }
</style>

<script type="text/ecmascript-6">
    import * as base from '../../assets/js/base.js';
    import busdetail from "../components/driverbusDetailReport.vue";
    import moment from "moment";

    let driverInfoReportOps = null;

    export default {
        ready() {
            let that = this;
            driverInfoReportOps = {
                param: {
                    page: 1,
                    page_size: 10,
                },
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
            this.init();
        },
        data: function () {
            return {
                noData: false,
                itemsLoading: false,
                items: [],
                searchInput: '',
                showDriverDetailReport: false,
                detailData: null,
                startDateInput: '',
                endDateInput: '',

            }
        },
        methods: {
            init: function () {
                driverInfoReportOps.param.page = 1;
                this.queryAjax((tpageToal = '4', count = '0') => {
                    this.initPage('#J-inner-page', tpageToal, count)
                });

            },
            //初始化分页
            initPage: function (obj, tpageToal = '4', count = '0') {
                $(obj).createPage({
                    pageCount: tpageToal,
                    current: 1,
                    count: count,
                    callback: (p) => {
                        driverInfoReportOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax: function (callback = function () {
            }) {
                this.itemsLoading = true;
                //修改参数
                driverInfoReportOps.param.search = this.searchInput;
                driverInfoReportOps.param.star_date=this.startDateInput;
                driverInfoReportOps.param.end_date=this.endDateInput
                $.ajax({
                    url: `${base.gAjaxUrl.driverList}`,
                    type: 'GET',
                    data: driverInfoReportOps.param
                })
                    .always((data) => {
                        this.itemsLoading = false;
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
            //获取列表
            getList: function (reset = 0) {
                let that = this;
                //重置第一页
                if(moment(this.endDateInput).isBefore(this.startDateInput)){
                    layer.msg("开始时间不能大于结束时间",{icon:2,time:1500});
                    return
                }
                //重置第一页
                if (reset) {
                    this.searchInput = $("#searchInput").val();
                }

                this.queryAjax((tpageToal = '4', count = '0') => {
                    this.initPage('#J-inner-page', tpageToal, count)
                });
            },
            detailShow: function (data) {
                this.detailData = data;
                this.showDriverDetailReport = true;
            },
            exportData: function () {
                if (moment(this.endDateInput).isBefore(this.startDateInput)) {
                    layer.msg("开始时间不能大于结束时间", {icon: 2, time: 1500});
                    return
                }
                let that = this;
                $.ajax({
                    url: `${base.gAjaxUrl.driverList}info_export/`,
                    type: 'GET',
                    data: {
                        start_date: that.startDateInput,
                        end_date: that.endDateInput,
                    }
                }).always((data) => {
                    base.ajaxCallback(data, () => {
                        that.$route.router.go({path: '/job'})
                    })
                })
            },
            detailClose: function () {
                this.showDriverDetailReport = false;
            },
        },
        components: {
            busdetail
        }
    }
</script>
