<template>

    <add :type="dialogType"
         :data="dialogData"
         v-if="isShowAddDialog"
         v-on:dialog-close="addDialogClose"
         v-on:dialog-save="addDialogSave"></add>

    <!--    &lt;!&ndash; 日期 &ndash;&gt;-->
    <calendar v-if="isShowCalendarDialog"
              v-on:dialog-close="calendarDialogClose"
              v-on:dialog-save="calendarDialogSave"></calendar>

    <time v-if="isShowTimetable"
          v-on:dialog-close='timetableClose'
          :line_id="selectLineId"></time>

    <section class="Hui-article-box">
        <div class="page-container">
            <div class="panel panel-default radius">
                <div class="panel-body clearfix">
                    <span class="f-20 fw-b f-l">线路管理</span>
                </div>
            </div>
            <div class="panel panel-default radius clearfix mt-10 mb-10">
                <div class="panel-body clearfix">
                    <div class="text-l clearfix f-l">
                        <input id="searchInput" autocomplete="off" type="text" placeholder="线路名称" style="width:200px"
                               class="f-l input-text" v-model="searchInput">
                        <button v-on:click="getList(1)" class="f-l btn btn-success radius-r" type="button">
                            <i class="f-r Hui-iconfont">&#xe665;</i>
                        </button>
                    </div>
                    <a class="btn btn-primary radius mr-10 f-r" href="javascript:;"
                       v-on:click="clickModifyDate()">班车日期</a>
                    <a class="btn btn-primary radius mr-10 f-r" href="javascript:;"
                       v-on:click="goToSetStation()">站点设置</a>
                    <a class="btn btn-primary radius mr-10 f-r" href="javascript:;"
                       v-on:click="clickAdd()">新增线路</a>
                </div>
            </div>
            <table class="table table-border table-bordered table-hover table-bg table-sort">
                <thead>
                <tr class="text-c">
                    <th width="120" class="max-200">线路名称</th>
                    <th width="100">起点</th>
                    <th width="100">终点</th>
                    <th width="100">时刻表</th>
                    <th width="200" class="max-400">线路站点</th>
                    <th width="100">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr class="text-c" v-for="item in items">
                    <td class="max-200">{{item.shuttle_name}}</td>
                    <td>{{item.go_stations_json | getStartStation true}}</td>
                    <td>{{item.go_stations_json | getStartStation false}}</td>
                    <td>
                        <div class="btn btn-primary radius" @click="showTimetable(item)">时刻表</div>
                    </td>
                    <td class="max-400" :title="item.go_stations_json | getStations">
                        {{item.go_stations_json | getStations}}
                    </td>
                    <td class="f-14">
                        <a title="编辑" href="javascript:;" class="ml-5" v-on:click="clickModify(item)"><i
                                class="Hui-iconfont">&#xe6df;</i></a>
                        <a title="删除" href="javascript:;" class="ml-5" v-on:click="deleteBtn(item.id)"><i
                                class="Hui-iconfont">&#xe6e2;</i></a>
                    </td>
                </tr>
                </tbody>
            </table>
            <div id="J-page" class="m-page" v-show="!noData"></div>
            <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
        </div>
    </section>
</template>

<style lang="less" scoped rel="stylesheet/less">


</style>

<script type="text/ecmascript-6">

    import * as base from '../../assets/js/base.js';
    import add from "../components/ferryBusAddBusLine.vue";
    import calendar from "../components/addBusDate";
    import time from '../components/lineTimes.vue'

    let pageOpts = null;

    export default {
        ready() {

            pageOpts = {
                page: 1,
                page_size: 10,
                search: ''
            };
            this.init();

        },
        data: function () {
            return {
                noData: false,
                isShowAddDialog: false, // 增加，修改
                isShowCalendarDialog: false, // 班车日期
                items: [],
                searchInput: '',
                downloadCode: base.gAjaxUrl.shuttlebuses,
                codeToken: localStorage['token'],
                dialogTitle: '添加部门',
                dialogType: 'add',
                dialogData: '',
                sourceDate: [],
                selectedLineName: '',
                busSelected: '',
                isDepartmentFocus: false,
                isShowTimetable: false,
                selectLineId: ""

            }
        },
        methods: {
            timetableClose: function () {
                this.isShowTimetable = false;
            },
            showTimetable(item) {
                this.selectLineId = item.id;
                this.isShowTimetable = true;
            },
            init: function () {
                pageOpts.page = 1;
                this.getList();
            },
            addDialogClose: function (data) {
                this.isShowAddDialog = false;
            },
            addDialogSave: function (data) {
                this.isShowAddDialog = false;
                this.getList();
            },
            calendarDialogClose: function (data) {
                this.isShowCalendarDialog = false;
            },
            calendarDialogSave: function (data) {
                this.isShowCalendarDialog = false;
                this.getList();
            },
            clickModifyDate: function () {
                this.isShowCalendarDialog = true;
            },
            // 添加线路
            clickAdd: function () {
                this.dialogType = 'add';
                this.isShowAddDialog = true;
            },
            clickModify: function (data) {
                this.dialogType = 'modify';
                this.dialogData = data;
                this.isShowAddDialog = true;
            },
            //获取列表
            getList: function (reset = 0) {
                //重置第一页
                if (reset) {
                    pageOpts.page = 1;
                    pageOpts.search = this.searchInput;
                }

                this.queryAjax((tpageToal = '4', count = '0') => {
                    this.initPage('#J-page', tpageToal, pageOpts.page, count)
                });
            },
            queryAjax: function (callback = function () {
            }) {
                $.showLoading();
                //修改参数
                $.ajax({
                    url: base.gAjaxUrl.ferryBusLines,
                    type: 'GET',
                    data: pageOpts
                }).always((data) => {
                    $.hideLoading();
                    base.ajaxCallback(data, () => {
                        //console.log(data.results)
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
            //初始化分页
            initPage: function (obj, tpageToal = '4', current = '1', count = '0') {
                $(obj).createPage({
                    pageCount: tpageToal,
                    current: current,
                    count: count,
                    callback: (p) => {
                        pageOpts.page = p;
                        this.queryAjax();
                    }
                });
            },
            //删除
            deleteBtn: function (id) {
                layer.confirm('删除须谨慎，确认要删除吗？', (index) => {
                    $.ajax({
                        url: `${base.gAjaxUrl.ferryBusLines}${id}/`,
                        type: 'DELETE',
                    }).always((data) => {
                        if (data) {
                            base.ajaxCallback(data);
                            return
                        }
                        if (this.items.length == 1 && pageOpts.page > 1) {
                            pageOpts.page--;
                        }
                        layer.msg('删除成功', {icon: 1, time: 1500});
                        this.getList();
                    })
                });
            },
            goToSetStation: function () {
                this.$router.go('/ferryBusSetStation');
            },
        },
        filters: {
            getStations(stations) {
                return stations && stations.length ? stations.map(item => item.station_name).join(' -> ') : '--'
            },
            getStartStation(stations, flag) {
                if (stations && stations.length) {
                    return stations[flag ? 0 : stations.length - 1].station_name;
                }
                return '--'
            },
        },
        components: {
            add,
            calendar,
            time
            // // bindvehicle,
        }
    }
</script>
