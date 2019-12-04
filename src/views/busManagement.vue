<template>
    <add :title="dialogTitle" :type="dialogType" :data="dialogData" v-if="isShowAddDialog"
         v-on:dialog-close="addDialogClose" v-on:dialog-save="addDialogSave"></add>
    <!-- 日期 -->
    <calendar :title="dialogTitle" :type="dialogType" :busid="busId" v-if="isShowCalendarDialog"
              v-on:dialog-close="calendarDialogClose" v-on:dialog-save="calendarDialogSave"></calendar>
    <pattern-settings v-if="showPatternSet" v-on:dialog-close="setDialogClose" v-on:dialog-refresh="setDialogRefresh"></pattern-settings>
    <section class="Hui-article-box">
        <div class="page-container" id="page-container">
            <div class="panel panel-default radius">
                <div class="panel-body clearfix">
                    <span class="f-20 fw-b f-l ml-10">线路管理</span>
                </div>
            </div>
            <div class="panel panel-default radius clearfix mt-10 mb-10">
                <div class="panel-body clearfix">
                    <div class="text-l clearfix f-l">
                        <input id="searchInput" type="text" placeholder="线路名称" style="width:200px"
                               class="f-l input-text" v-model="searchInput">
                        <button v-on:click="getList(1)" class="f-l btn btn-success radius-r" type="button">
                            <i class="f-r Hui-iconfont">&#xe665;</i>
                        </button>
                    </div>
                    <a class="btn btn-primary radius f-r" href="javascript:;" v-on:click="showPattern()">模式设置</a>
                    <a class="btn btn-primary radius mr-10 f-r" href="javascript:;"
                       v-on:click="goToSetStation()">站点设置</a>
                    <a class="btn btn-primary radius mr-10 f-r" href="javascript:;" v-on:click="clickModifyDate()">编辑班车日期</a>
                    <a class="btn btn-primary radius mr-10 f-r" href="javascript:;" v-on:click="clickAdd()">添加线路</a>
                </div>
            </div>
            <table class="table table-border table-bordered table-hover table-bg table-sort">
                <thead>
                <tr class="text-c">
                    <th width="100">线路名称</th>
                    <th width="100">起点</th>
                    <th width="100">终点</th>
                    <th width="100">去程出发时间</th>
                    <th width="100">返程出发时间</th>
                    <th width="60">检票模式</th>
                    <th width="60">预约模式</th>
                    <th width="60">票数</th>
                    <th width="60">价格</th>
                    <th width="100">自动排班</th>
                    <th width="100">人分配到车</th>
                    <th width="100">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr class="text-c" v-for="item in items">
                    <td>{{item.shuttle_name}}</td>
                    <td>{{item.go_stations_json && item.go_stations_json[0]?item.go_stations_json[0].station_name:''}}
                    </td>
                    <td>{{item.go_stations_json &&
                        item.go_stations_json[item.go_stations_json.length-1]?item.go_stations_json[item.go_stations_json.length-1].station_name:''}}
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
                    <td>{{item.check_mode_name}}</td>
                    <td>{{item.order_mode_name}}</td>
                    <td>{{item.seats}}</td>
                    <td>{{(item.price / 100).toFixed(2)}}</td>
                    <td>
                        <span class="switch-outer" @click="setConfig(item, 'auto_dispatch')"
                              :class="{'selected': item.auto_dispatch}">
                            <span class="switch-inner">
                                <span class="switch-center"></span>
                            </span>
                        </span>
                    </td>
                    <td>
                        <span class="switch-outer" @click="setConfig(item, 'people_vehicle')"
                              :class="{'selected': item.people_vehicle}">
                                <span class="switch-inner">
                                    <span class="switch-center"></span>
                                </span>
                        </span>
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
            <div class="m-loading" v-if="itemsLoading">
                <div class="cube1"></div>
                <div class="cube2"></div>
            </div>
        </div>
    </section>
</template>

<style lang="less" scoped rel="stylesheet/less">
</style>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import add from "../components/addBusLine.vue";
    import calendar from "../components/addBusDate.vue";
    import patternSettings from "../components/patternSettings.vue";
    import moment from "moment";

    let busManagementOps = null;

    export default{
        ready () {

            busManagementOps = {
                param: {
                    page: 1,
                    page_size: 10,
                }
            };
            this.init();
            this.getLineArr();
            //巴士班次可售卖日期(不可删)
            this.saleableDates();

        },
        data: function () {
            return {
                noData: false,
                itemsLoading: false,        //loading
                isShowAddDialog: false,      //增加，修改
                isShowCalendarDialog: false, //日历
                items: [],
                searchInput: '',
                downloadCode: base.gAjaxUrl.shuttlebuses,
                codeToken: localStorage['token'],
                dialogTitle: '添加部门',
                dialogType: 'add',
                dialogData: '',
                sourceDate: [],
                busId: '',
                showPatternSet: false,
                busItem: [],
                selectedLineName: '',
                busSelected: '',
                isDepartmentFocus: false,

            }
        },
        methods: {
            setConfig: function (item, type) {
                let data = {};
                data[type] = !item[type];
                this.itemsLoading = true;
                $.ajax({
                    url: base.gAjaxUrl.shuttlebuses3 + item.id + '/patch/',
                    type: 'PATCH',
                    contentType: 'application/json',
                    data: JSON.stringify(data)
                }).always((data)=> {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=> {
//                        layer.msg("设置成功！", {icon: 1, time: 1500});
                        this.getList();
                    });
                })
            },
            init: function () {
                busManagementOps.param.page = 1;
                this.getList();
            },
            getTime: function (id) {
                $.ajax({
                    url: base.gAjaxUrl.time,
                    type: 'GET',
                }).always((data)=> {
                    base.ajaxCallback(data, () => {
                        this.getSourceDate(id, moment(data.full).add('1', 'months').format('YYYY-MM'), 0);
                        this.getSourceDate(id, moment(data.full).format('YYYY-MM'), 1);
                    });
                })
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
                }).always((data)=> {
                    base.ajaxCallback(data, ()=> {
                        let all = {
                            id: '',
                            shuttle_name: '全部'
                        }
                        this.busItem = data.results;
                        this.busItem.unshift(all);
                    })
                });
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
            //获取选中日期
            getSourceDate: function (id, date, flag) {
                $.ajax({
                    url: `${base.gAjaxUrl.shuttlebuses2}${id}/dates/`,
                    type: 'GET',
                    data: {
                        month: date
                    }
                }).always((data)=> {
                    $(data).each((i, e) => {
                        this.sourceDate.push(e['departure_date'])
                    });
                    setTimeout(() => {
                        if (flag) {
                            this.busId = id;
                            this.isShowCalendarDialog = true;
                        }
                    }, 200)
                })
            },
            //查询不能删的日期
            saleableDates: function () {
                $.ajax({
                    url: base.gAjaxUrl.shuttlebuses + 'saleable_dates/',
                    type: 'GET',
                })
                        .always((data)=> {
                            //售卖日期
                            this.saleDates = data.data;
                        })
            },
            clickAdd: function () {
                this.dialogType = 'add';
                this.isShowAddDialog = true;
            },
            clickModify: function (data) {
                this.dialogTitle = '修改线路';
                this.dialogType = 'modify';
                this.dialogData = data;
                this.isShowAddDialog = true;
            },
            //初始化分页   
            initPage: function (obj, tpageToal = '4', current = '1', count = '0') {
                $(obj).createPage({
                    pageCount: tpageToal,
                    current: current,
                    count: count,
                    callback: (p)=> {
                        busManagementOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax: function (callback = function () {
            }) {
                this.itemsLoading = true;
                //修改参数
                $.ajax({
                    url: base.gAjaxUrl.shuttlebuses2,
                    type: 'GET',
                    data: busManagementOps.param
                }).always((data)=> {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=> {
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
                    busManagementOps.param.page = 1;
                    busManagementOps.param.shuttle_name = this.searchInput;
                }

                this.queryAjax((tpageToal = '4', count = '0')=> {
                    this.initPage('#J-page', tpageToal, busManagementOps.param.page, count)
                });
            },
            //删除
            deleteBtn: function (id) {

                layer.confirm('删除须谨慎，确认要删除吗？', (index)=> {
                    $.ajax({
                        url: `${base.gAjaxUrl.shuttlebuses}${id}/`,
                        type: 'DELETE',
                    }).always((data)=> {
                        if (data) {
                            base.ajaxCallback(data);
                            return
                        }
                        if (this.items.length == 1 && busManagementOps.param.page > 1) {
                            busManagementOps.param.page--;
                        }
                        layer.msg('删除成功', {icon: 1, time: 1500});
                        this.getList();
                    })
                });
            },
            setDialogClose: function (flag) {
                console.log("setDialogClose: ", flag);
                this.showPatternSet = false;
                if(flag) {
                    this.setDialogRefresh();
                }
            },
            setDialogRefresh: function () {
                console.log("setDialogRefresh: ");
                this.getList();
            },
            showPattern: function () {
                this.showPatternSet = true;
            },
            goToSetStation: function () {
                this.$router.go('/setStations');
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
            add,
            calendar,
            patternSettings
            // bindvehicle,
        }
    }
</script>
