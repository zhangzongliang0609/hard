<template>

    <!-- 新增排班 -->
    <dispatch :lines="busLineArr"
              v-if="showLineDispatch"
              @dialog-save="saveBusDispatch"
              @dialog-close="closeBusDispatch"></dispatch>

    <!-- 编辑排班 -->
    <mod :data="dispatchData"
         v-if="showModifyLineDispatch"
         @dialog-save="saveModifyDispatch"
         @dialog-close="closeModifyDispatch"></mod>

    <div class="Hui-article-box">
        <div class="page-container bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body clearfix">
                    <span class="f-20 fw-b f-l">线路排班</span>
                </div>
            </div>
            <div class="panel panel-default radius cl mt-10">
                <div class="panel-body cl lh-30">
                    <div class="filtrate mb-10 clearfix">
                        <span class="f-l">线路名称：</span>
                        <div class="f-l ml-5 filtrate-line-box">
                            <div class="department_select_container" @mouseleave="inputEnter('filtrateLine',false)"
                                 @mouseenter="inputEnter('filtrateLine',true)">
                                <input v-if="busLineArr.length === 0"
                                       disabled
                                       type="text"
                                       class="input-text"
                                       placeholder="无可选择线路">
                                <input v-else autocomplete="off"
                                       @click="inputClick('filtrateLine')"
                                       v-model="filtrateLineName"
                                       type="text"
                                       class="input-text"
                                       placeholder="全部">
                                <i v-show="filtrateLineName !== ''"
                                   class="empty-icon Hui-iconfont"
                                   @click="emptySearch('filtrateLine')">&#xe60b;</i>
                                <div class="departmentListBox" style="display: none">
                                    <div v-bind:title="item.shuttle_name"
                                         v-for="item in busLineArr | filterBy  filtrateLineName in 'shuttle_name'"
                                         @click="setValue('filtrateLine',item)"
                                         class="departmentListItem">
                                        {{item.shuttle_name}}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <span class="f-l ml-15">开始日期：</span>
                        <input v-model="startDateInput"
                               autocomplete="off"
                               type="text"
                               class="f-l input-text Wdate mr-5 v-m"
                               style="width:100px;"
                               id="J-start-outer-date"
                               v-bind:value="startDateInput">
                        <span class="f-l ml-10">结束日期：</span>
                        <input v-model="endDateInput"
                               autocomplete="off"
                               type="text"
                               class="f-l input-text Wdate mr-5 v-m"
                               style="width:100px;"
                               id="J-end-outer-date"
                               v-bind:value="endDateInput">
                    </div>
                    <div class="mb-10 clearfix lh-30">
                        <span class="ml-10">行程状态:</span>
                        <select name="" id="status" class="select _status" v-model="status">
                            <option value="">全部</option>
                            <option value="10">未开始</option>
                            <option value="20">已开始</option>
                            <option value="30">已结束</option>
                        </select>
                        <div class="f-l search-box clearfix v-m">
                            <select name="" class="select f-l" v-model="searchKey">
                                <option value="driver_name">司机</option>
                                <option value="car_no">车牌</option>
                            </select>
                            <input class="input-text f-l" type="text" v-model="searchInput">
                            <button type="submit" class="btn btn-success radius-r f-l" @click="getList(1)">
                                <i class="Hui-iconfont f-r">&#xe665;</i>
                            </button>
                        </div>
                        <a class="btn radius btn-primary f-r"
                           href="javascript:;"
                           @click="setBusDispatch">线路排班</a>
                        <a class="btn radius btn-primary f-r mr-5"
                           href="javascript:;"
                           @click="importDispatch">导入班数据</a>
                        <a class="btn radius btn-primary f-r mr-5"
                           href="javascript:;"
                           @click="exportData">导出排班数据</a>
                    </div>
                </div>
            </div>
            <div class="materials bk-gray radius bgc-fff mt-20">
                <table class="table table-border table-bg table-striped bor-l bor-r">
                    <thead>
                    <tr class="text-c">
                        <th width="30"></th>
                        <th width="80" class="max-200">线路名称</th>
                        <th width="60">开车日期</th>
                        <th width="60">开车时间</th>
                        <th width="60">报名人数</th>
                        <th width="60">用车数量</th>
                        <th width="60">排班状态</th>
                        <th width="120">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <template v-for="item in items">
                        <tr class="text-c">
                            <tdiconfont>
                                <i class="normal_icon Hui-iconfont" :class="{'_show': currentShowId == item.id}"
                                   v-show="item.dispatch_set.length"
                                   @click="currentShowId = currentShowId == item.id ? '' : item.id">&#xe63d;</i>
                            </tdiconfont>
                            <td class="max-200">{{item.shuttle_name || '--'}}</td>
                            <td>{{item.departure_date || '--'}}</td>
                            <td>
                                {{item.departure_time || '--'}}
                            </td>
                            <td>{{item.order_paid_cnt}}</td>
                            <td>{{item.vehicle_cnt}}</td>
                            <td>{{item.dispatch_status_name || '--'}}</td>
                            <td class="f-14">

                                <a v-if="item.status == 10 || item.status == 20"
                                   class="ml-15 btn btn-primary radius"
                                   title="新增排班"
                                   href="javascript:;"
                                   v-on:click="modifyBusDispatch(item, null)">排班</a>
                            </td>
                        </tr>
                        <tr class="text-c"
                            v-if="item.dispatch_set.length"
                            v-show="currentShowId == item.id">
                            <td class="inner_table_box" colspan="8">
                                <table class="table table-border table-bordered table-hover table-bg table-sort">
                                    <thead>
                                    <tr class="text-c">
                                        <th width="70">车牌号码</th>
                                        <th width="70">车号</th>
                                        <th width="70">车辆类型</th>
                                        <th width="70">品牌</th>
                                        <th width="70">型号</th>
                                        <th width="70">座位数</th>
                                        <th width="70">司机姓名</th>
                                        <th width="70">联系电话</th>
                                        <th width="70">行程状态</th>
                                        <th width="70">操作</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr class="text-c"
                                        v-for="dispatch in item.dispatch_set">
                                        <td>{{dispatch.car_no ? dispatch.vehicle_vo.car_no : '--'}}</td>
                                        <td>{{dispatch.vehicle_vo ? (dispatch.vehicle_vo.car_flag || '--') : '--'}}</td>
                                        <td>{{getTypeInfo(dispatch.vehicle_vo ? dispatch.vehicle_vo.car_type_vo : {},
                                            'type_name')}}
                                        </td>
                                        <td>{{getTypeInfo(dispatch.vehicle_vo ? dispatch.vehicle_vo.car_type_vo : {},
                                            'car_brand')}}
                                        </td>
                                        <td>{{getTypeInfo(dispatch.vehicle_vo ? dispatch.vehicle_vo.car_type_vo : {},
                                            'car_model')}}
                                        </td>
                                        <td>{{getTypeInfo(dispatch.vehicle_vo ? dispatch.vehicle_vo.car_type_vo : {},
                                            'seats')}}
                                        </td>
                                        <td>{{dispatch.driver_name || '--'}}</td>
                                        <td>{{dispatch.phone || '--'}}</td>
                                        <td>{{dispatch.running_status_name || '--'}}</td>
                                        <td>
                                            <!--
                                                running_status_name
                                                10-未开始；20-已开始;30-已结束
                                             -->
                                            <a title="编辑"
                                               href="javascript:;"
                                               class="ml-5"
                                               v-if="dispatch.running_status === 10"
                                               v-on:click="modifyBusDispatch(item, dispatch)">
                                                <i class="Hui-iconfont">&#xe6df;</i>
                                            </a>
                                            <a title="删除"
                                               href="javascript:;"
                                               class="ml-5"
                                               v-if="dispatch.running_status === 10"
                                               v-on:click="deleteBusDispatch(dispatch)">
                                                <i class="Hui-iconfont">&#xe6e2;</i>
                                            </a>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </template>
                    </tbody>
                </table>
                <div id="J-page" class="m-page" v-show="!noData"></div>
                <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
            </div>

        </div>
    </div>

</template>

<script type="text/ecmascript-6">
    let lineDispatchOpts = null;
    import * as base from '../../assets/js/base.js';
    import moment from "moment";
    import dispatch from '../components/ferryBusSetLineDispatch';
    import mod from '../components/modifyLineDispatch';

    export default {
        ready() {
            lineDispatchOpts = {
                page: 1,
                page_size: 10,
                start: '',
                end: '',
                shuttle_bus: '',
                running_status: '',
            };
            this.startDateInput = moment().format('YYYY-MM-DD');
            this.endDateInput = moment().add("month", 1).format('YYYY-MM-DD');
            new Kalendae.Input('J-end-outer-date', {
                months: 2,
                clickHide: true,
            });
            new Kalendae.Input('J-start-outer-date', {
                months: 2,
                clickHide: true,
            });
            $('#actionTime').datetimepicker({
                datepicker: false,
                format: 'H:i',
                step: 5
            });
            this.init();

        },
        data: function () {
            return {
                noData: true,
                bus_driver_vehicle: false, // 自动调度车辆
                showManager: false, // 添加通知管理员
                showLineDispatch: false,
                dispatchData: null, // 编辑排班
                showModifyLineDispatch: false, // 编辑排班
                startDateInput: '',
                endDateInput: '',
                currentShowId: '', // 点击展开的调度列表
                filtrateLineName: '', // 输入的线路名称
                filtrateLineFocus: false, // 线路名称输入框是否获得焦点
                busLineArr: [],
                searchKey: 'driver_name',
                searchInput: '',
                items: [],
                status: '',
                dialogData: null,
                dialogType: 'add',
            }
        },
        methods: {
            importDispatch: function () {
                this.$router.go({
                    path: '/importMould',
                    name: 'importMould',
                    query: {
                        importType: 'ferryBusDispatch'
                    }
                })
            },
            init: function () {
                this.getList(1);
                // 获取线路列表
                this.getLineList();
            },
            initPage: function (obj, tpageToal = '4', current = 1, count = '0') {
                $(obj).createPage({
                    pageCount: tpageToal,
                    current: current,
                    count: count,
                    callback: (p) => {
                        lineDispatchOpts.page = p;
                        this.queryAjax();
                    }
                });
            },
            getLineList: function () {
                $.ajax({
                    url: base.gAjaxUrl.ferryBusLines,
                    type: 'GET',
                    data: {
                        page: 1,
                        page_size: 999999,
                        search: ''
                    }
                }).always((data) => {
                    base.ajaxCallback(data, () => {
                        //console.log(data.results)
                        this.busLineArr = data.results;
                    });
                })
            },
            getList: function (flag) {
                if (flag) {
                    if (moment(this.startDateInput).isAfter(this.endDateInput)) {
                        layer.msg("搜索的开始时间不能大于结束时间", {icon: 2, time: 1500});
                        return
                    }
                    let id = this.getLineId();
                    if (id == '' && this.filtrateLineName) {
                        layer.msg("线路名称不存在", {icon: 2, time: 1500});
                        return;
                    }
                    lineDispatchOpts.page = 1;
                    lineDispatchOpts.driver_name = '';
                    lineDispatchOpts.car_no = '';
                    lineDispatchOpts.start = this.startDateInput;
                    lineDispatchOpts.end = this.endDateInput;
                    lineDispatchOpts.running_status = this.status;
                    lineDispatchOpts.shuttle_bus = id;
                    lineDispatchOpts[this.searchKey] = this.searchInput;
                }
                this.queryAjax((tpageToal = '4', count = '0') => {
                    this.initPage('#J-page', tpageToal, lineDispatchOpts.page, count)
                });
            },
            queryAjax: function (callback = () => {
            }) {
                $.showLoading();
                $.ajax({
                    url: base.gAjaxUrl.ferryBusDates,
                    type: "GET",
                    data: lineDispatchOpts
                }).always((data) => {
                    $.hideLoading();
//                    base.ajaxCallback(data, () => {
                    let res = data.results || [];
                    this.noData = !res.length;
                    this.items = res;
                    callback(data.num_pages, data.count);
//                    })
                })
            },
            modifyBusDispatch: function (item, dispatch) {
                this.dispatchData = {
                    line: item,
                    dispatch: dispatch,
                };
                this.showModifyLineDispatch = true;
            },
            saveModifyDispatch: function () {
                this.getList(1);
                this.showModifyLineDispatch = false;
            },
            closeModifyDispatch: function () {
                this.showModifyLineDispatch = false;
            },
            deleteBusDispatch(item) {
                layer.confirm('确认删除这条调度信息吗?', (index) => {
                    $.ajax({
                        url: `${base.gAjaxUrl.ferryBusDispatch}${item.id}/`,
                        type: "DELETE",
                    }).always((data) => {
                        if (data) {
                            base.ajaxCallback(data);
                            return;
                        }
                        if (this.items.length == 1 && lineDispatchOpts.page > 1) {
                            lineDispatchOpts.page--;
                        }
                        layer.close(index);
                        this.getList();
                    })
                });
            },
            setBusDispatch: function () {
                this.dialogType = 'add';
                this.showLineDispatch = true;
            },
            closeBusDispatch: function () {
                this.showLineDispatch = false;
            },
            saveBusDispatch: function () {
                this.getList(1);
                this.showLineDispatch = false;
            },
            inputEnter: function (type, flag) {
                if (type == 'filtrateLine') {
                    this.filtrateLineFocus = flag;
                    !flag && $(".filtrate-line-box .departmentListBox").hide();
                }
            },
            inputClick: function (type) {
                if (type == 'filtrateLine') {
                    $(".filtrate-line-box .departmentListBox").show();
                }
            },
            // 清除搜索输入框
            emptySearch: function () {
                this.filtrateLineName = '';
                $(".filtrate-line-box .departmentListBox").show();
            },
            setValue: function (type, item) {
                if (type == 'filtrateLine') {
                    this.filtrateLineName = item.shuttle_name;
                    $(".filtrate-line-box .departmentListBox").hide();
                }

            },
            getLineId: function () {
                let id = '';
                for (var i = 0, len = this.busLineArr.length; i < len; i++) {
                    let item = this.busLineArr[i];
                    if (this.filtrateLineName == item.shuttle_name) {
                        id = item.id;
                        break;
                    }
                }
                return id;
            },
            getTypeInfo: function (item, type) {
                return item && item[type] ? item[type] : '--'
            },
            exportData: function () {
                $.showLoading();
                $.ajax({
                    url: `${base.gAjaxUrl.ferryBusDates}export_dispatch/`,
                    type: 'GET',
                    data: lineDispatchOpts
                }).always((data) => {
                    $.hideLoading();
                    base.ajaxCallback(data, () => {
                        this.$route.router.go({path: '/job'})
                    })
                })
            }
        },
        components: {
            dispatch, mod
        },
        filters: {
            dateSlice: function (value) {
                return value.substring(0, value.lastIndexOf(":"));
            }
        }
    }


</script>

<style lang="less" rel="stylesheet/less" scoped>
    .page-container {
        min-height: 100%;
        box-sizing: border-box;
    }

    .select {
        height: 31px;
        width: 60px;

        &._line {
            width: 90px;
        }

        &._status {
            width: 80px;
        }
    }

    .bus-date {
        position: relative;

        input {
            width: 30px;
            height: 30px;
            border: none;
        }

        #busDates {
            position: absolute;
            width: 30px;
            height: 30px;
            opacity: 0;
            cursor: pointer;
        }

        img {
            height: 30px;
        }
    }

    .search-box {
        width: 305px;
        position: relative;

        input {
            width: 200px;
            margin-left: -1px;
        }
    }

    .input-box {
        display: inline-block;
        width: 220px;
    }

    .filtrate-line-box {
        display: inline-block;
        width: 180px;
    }

    .inner_table_box {
        padding: 0 20px;
        box-sizing: border-box;
    }

    .normal_icon {
        font-size: 20px;
        transform: rotate(90deg);
        display: inline-block;
        transition: all 0.3s ease;
        cursor: pointer;

        &._show {
            transform: rotate(-90deg);
        }
    }
</style>
