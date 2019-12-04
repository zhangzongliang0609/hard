<template>
    <busdetail v-if="showBusDetailReport" :detail="detailData" v-on:detail-close="detailClose"></busdetail>
    <section class="Hui-article-box" v-show="!showBusDetailReport">
        <div class="page-container">
            <div class="text-l clearfix ">
                <div class=" f-l cl line-control">
                    <div class="form-label f-l  text-r mr-5 mt-5 select-department">线路名称:</div>
                    <div class="formControls f-l">
                        <div class="department_select_container" @mouseleave="departmentEnter(false,$event)"
                             @mouseenter="departmentEnter(true,$event)">
                            <input v-if="busItem.length === 0" disabled type="text" class="input-text" value="无可选择线路">
                            <input v-else autocomplete="off" @click="departmentClick($event)" v-model="selectedLineName"
                                   type="text" class="input-text" value="" placeholder="" name="department">
                            <i v-show="selectedLineName !== ''" class="empty-icon Hui-iconfont"
                               @click="emptySearch($event)">&#xe60b;</i>
                            <div class="departmentListBox" style="display: none">
                                <div v-bind:title="item" track-by="$index"
                                     v-for="item in busItem | filterBy selectedLineName in 'shuttle_name'"
                                     @click="setDepartmentValue(item,$event)" class="departmentListItem">
                                    {{item.shuttle_name}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!---->
                <!--<input id="searchInput" type="text"  placeholder="起点/终点/站点" style="width:250px" class="f-l input-text">-->
                <!--<button v-on:click="getList(1)" class="btn btn-success" type="button"><i class="f-r Hui-iconfont">&#xe665;</i></button>-->
                <span class="f-r lh-30 mr-10">
                开始日期：
                <input v-model="startDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;"
                       id="J-start-outer-date" v-bind:value="startDateInput">
                结束日期：
                <input v-model="endDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;"
                       id="J-end-outer-date" v-bind:value="endDateInput">
                <button id="exportData" class="btn btn-primary radius f-r" v-on:click="exportData()">导出数据</button>
            </span>
            </div>
            <table class="table table-border table-bordered table-hover table-bg mt-20">
                <thead>
                <tr class="text-c">
                    <th>线路名称</th>
                    <th>起点</th>
                    <th>终点</th>
                    <th width="100">去程出发时间</th>
                    <th width="100">返程出发时间</th>
                    <th>座位</th>
                    <th>价格</th>
                    <!-- <th>平均载率</th> -->
                    <th>平均评分</th>
                    <th width="70">查看</th>
                </tr>
                </thead>
                <div class="result" v-if="!noData">
                    <tbody>
                    <tr class="text-c" v-for="item in items">
                        <td>{{item.shuttle_name}}</td>
                        <td>{{item.go_stations_json && item.go_stations_json.length >
                            1?item.go_stations_json[0].station_name:'--'}}
                        </td>
                        <td>{{item.go_stations_json && item.go_stations_json.length >
                            1?item.go_stations_json[item.go_stations_json.length-1].station_name:'--'}}
                        </td>
                        <td>
                            <select>
                                <option v-for="time in item.bus_times" v-if="time.shuttle_type==-10">
                                    {{time.departure_time}}
                                </option>
                            </select>
                        </td>
                        <td>
                            <select>
                                <option v-for="time in item.bus_times" v-if="time.shuttle_type==10">
                                    {{time.departure_time}}
                                </option>
                            </select>
                        </td>
                        <td>{{item.seats}}</td>
                        <td>{{item.price/100}}</td>
                        <!-- <td>{{item.seats}}</td> -->
                        <td>{{item.score}}</td>
                        <td>
                            <a class="btn btn-link size-S radius" href="javascript:;" v-on:click="detailShow(item)">查看班次计划详情</a>
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
</style>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import busdetail from "../components/busDetailReport.vue";
    import moment from "moment";

    let busInfoReportOps = null;

    export default {
        ready() {
            let that = this;
            busInfoReportOps = {
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
            this.getLineArr();
            this.init();
        },
        data: function () {
            return {
                noData: false,
                itemsLoading: false,
                items: [],
                searchInput: '',
                showBusDetailReport: false,
                detailData: null,
                startDateInput: '',
                endDateInput: '',

                // 线路搜索框
                busItem: [],
                selectedLineName: '',
                busSelected: '',
                isDepartmentFocus: false,
            }
        },
        methods: {
            init: function () {
                busInfoReportOps.param.page = 1;
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
                        busInfoReportOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            getLineArr: function () {
                //获取巴士列表
                $.ajax({
                    url: base.gAjaxUrl.shuttlebuses2,
                    type: 'GET',
                    data: {
                        page: 1,
                        page_size: 999999
                    }
                })
                    .always((data) => {
                        base.ajaxCallback(data, () => {
                            let all = {
                                id: '',
                                shuttle_name: '全部'
                            }
                            this.busItem = data.results;
                            this.busItem.unshift(all);
                        })
                    });
            },
            queryAjax: function (callback = function () {
            }) {
                this.itemsLoading = true;
                //修改参数
                busInfoReportOps.param.id = this.busSelected;
                $.ajax({
                    url: `${base.gAjaxUrl.busInfoReport}`,
                    type: 'GET',
                    data: busInfoReportOps.param
                })
                    .always((data) => {
                        this.itemsLoading = false;
                        base.ajaxCallback(data, () => {
                            console.log("Data");
                            console.log(data);
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
                this.showBusDetailReport = true;
            },
            exportData: function () {
                if (moment(this.endDateInput).isBefore(this.startDateInput)) {
                    layer.msg("开始时间不能大于结束时间", {icon: 2, time: 1500});
                    return
                }
                let that = this;
                $.ajax({
                    url: `${base.gAjaxUrl.shuttlebuses2}info_export/`,
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
                this.showBusDetailReport = false;
            },
            departmentEnter: function (flag, e) {
                this.isDepartmentFocus = flag;
                !flag && $(e.target).children(".departmentListBox").hide();
            },
            departmentClick: function (e) {
                if (this.isDepartmentFocus) {
                    $(e.target).nextAll(".departmentListBox").show();
                }
            },
            // 清除搜索输入框
            emptySearch: function (e) {
                this.selectedLineName = '';
                $(e.target).nextAll(".departmentListBox").show();
            },
            setDepartmentValue: function (item, e) {
                this.selectedLineName = item.shuttle_name;
                this.busSelected = item.id;
                // let index = this.lineNameData.indexOf(item);
                // if((index + 10) >= this.lineNameData.length){
                //     this.lineStartValue = this.lineNameData.length - 10;
                //     this.lineEndValue = this.lineNameData.length - 1;
                // }else{
                //     this.lineStartValue = index;
                //     this.lineEndValue = index + 10;
                // }
                // this.initLineEcharts(this.initLineEchartsData);
                this.init();
                $(e.target).parent(".departmentListBox").hide();
            },
        },
        components: {
            busdetail
        }
    }
</script>