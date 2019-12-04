<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">搭乘信息</div>
        <div class="layui-layer-content">
            <div class="m-info mb-20 pd-10 relative">
                <div class="clearfix mb-10 lh-30 info">
                    <div class="l">{{data.departure_datetime.slice(0, 16)}}&nbsp;/&nbsp;</div>
                    <div class="l">{{data.shuttle_name || '--'}}&nbsp;/&nbsp;</div>
                    <div class="l">座位数:{{data.seats}}&nbsp;/&nbsp;</div>
                    <div class="l">已报名:{{data.order_cnt}}&nbsp;/&nbsp;</div>
                    <div class="l">已搭乘:{{data.check_order_cnt}}&nbsp;/&nbsp;</div>
                    <div class="l">车辆数:{{data.vehicle_set.length}}</div>
                </div>
                <div class="clearfix searchCondition">
                    <div class="form-label f-l text-r mr-5 mt-5 select-department">行驶车辆:</div>
                    <div class="formControls f-l">
                        <div class="department_select_container" @mouseleave="departmentEnter(false,$event)"
                             @mouseenter="departmentEnter(true,$event)">
                            <input v-if="buses.length === 0" disabled type="text" class="input-text" value="无可选择车辆">
                            <input v-else autocomplete="off" @click="departmentClick($event)" v-model="selectedItemName"
                                   type="text" class="input-text" value="" placeholder="" name="department">
                            <i v-show="selectedItemName !== ''" class="empty-icon Hui-iconfont"
                               @click="emptySearch($event)">&#xe60b;</i>
                            <div class="departmentListBox" style="display: none">
                                <div v-bind:title="item" track-by="$index"
                                     v-for="item in buses | filterBy selectedItemName in 'car_no'"
                                     @click="setDepartmentValue(item,$event)" class="departmentListItem">
                                    {{item.car_no}}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="formControls f-l clearfix ml-20">
                        <select v-model="searchInput" class="select f-l"
                                style="width: 65px;height: 31px;padding-left: 5px">
                            <option value="real_name" selected>姓名</option>
                            <option value="phone">电话</option>
                            <option value="department">部门</option>
                        </select>
                        <input id="searchInput" class="f-l input-text searchInputType" type="text" placeholder=""
                               style="width:150px">
                        <button v-on:click="getList(1)" class="btn btn-success f-l radius-r" type="button">
                            <i class="f-r Hui-iconfont">&#xe665;</i>
                        </button>
                    </div>
                </div>
                <a v-if="isShowTravelButton && locationConfig.cat_map && locationConfig.bus_cat_map"
                   href="javascript:;"
                   class="r radius btn btn-primary collectBtn" @click="showTravel = true">行驶情况</a>
            </div>
            <table class="table table-border table-bordered table-hover table-bg">
                <thead>
                <tr class="text-c">
                    <th>姓名/性别</th>
                    <th>工号</th>
                    <th>部门/职位</th>
                    <th>电话</th>
                    <th>操作时间</th>
                    <th>报名站点</th>
                    <th>上车站点</th>
                    <th>司机/车牌号/车号</th>
                    <th>状态</th>
                </tr>
                </thead>
                <tbody v-if="!noData">
                <tr class="text-c" v-for="item in rideInfoDataItems">
                    <td>{{item.staff_vo?item.staff_vo.real_name:'--'}}/{{item.staff_vo?(item.staff_vo.sex==1? '男':
                        '女'):'--';}}
                    </td>
                    <td>{{item.staff_vo?item.staff_vo.job_number:'--'}}</td>
                    <td>
                        {{item.staff_vo?item.staff_vo.department_vo.department_name:'--'}}/{{item.staff_vo?item.staff_vo.position:'--'}}
                    </td>
                    <td>{{item.staff_vo?item.staff_vo.phone:'--'}}</td>
                    <td>{{(item.mtime + '').slice(0, 11) || '--'}}</td>
                    <td>{{item.bus_station_vo ? item.bus_station_vo.station_name : '--'}}</td>
                    <td>{{item.boarding_station_vo ? item.boarding_station_vo.station_name : '--'}}、</td>
                    <td>{{item.driver_name || '--'}}/{{item.vehicle_no || '--'}}/{{item.car_flag || '--'}}</td>
                    <td>{{item.status_name}}</td>
                </tr>
                </tbody>
            </table>
            <div class="m-loading inner" v-if="loading">
                <div class="cube1"></div>
                <div class="cube2"></div>
            </div>
            <div id="J-page" class="m-page" v-show="!noData"></div>
            <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;"
               v-on:click="close()"></a>
        </span>
        <div class="layui-layer-btn" v-on:click="close"><a class="layui-layer-btn0">关闭</a></div>
    </div>
    <div class="layui-layer-shade"></div>
    <travel v-if="showTravel" @dialog-close="closeTravel" :data="data" :finish="routeFinish" :title="title"></travel>
</template>
<style scoped lang="less" rel="stylesheet/less">
    .layui-modify {
        min-width: 1000px !important;
        margin-top: 30px;
    }

    .layui-layer-content {
        padding: 0 20px;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import travel from "../components/travelCondition";
    let commentsOps = null;
    export default{
        ready () {
            commentsOps = {
                param: {
                    page: 1,
                    page_size: 10
                }
            };

            this.getList(1);
            this.buses = [].concat(this.data.vehicle_set);
            base.verticalCenter(".layui-layer");
            switch (this.data.status_name) {
                case '已发车':
                    this.routeFinish = false;
                    this.title = '行驶情况';
                    this.isShowTravelButton = true;
                    break;
                case '已结束':
                    this.routeFinish = true;
                    this.title = '行驶统计';
                    this.isShowTravelButton = true;
                    break;
                default:
                    break;
            }
            this.getLocationConfig();
        },
        props: ['data'],
        data: function () {
            return {
                noData: false,
                showTravel: false, // 显示行驶轨迹
                buses: [], // 当前发车线路的所有行驶车辆
                selectedItemName: '', // 选择的车辆车牌号
                selectedItemId: '', // 选择的车辆id
                isSelectedInputFocus: false, // 车辆选择框是否获取焦点
                rideInfoDataItems: [],
                searchInput: 'real_name',
                departureDatetime: this.data.departure_time,
                loading: true,
                isShowTravelButton: false,
                routeFinish: false,
                title: '',

                locationConfig: {} // 轨迹
            }
        },
        methods: {
            getLocationConfig() {
                $.ajax({
                    url: `${base.gAjaxUrl.baseConfig}cat_map/`,
                    type: 'GET',
                }).always((data) => {
                    base.ajaxCallback(data, () => {
                        this.locationConfig = data;
                    });
                })
            },
            close: function () {
                this.$dispatch('dialog-close');
            },
            //初始化分页
            initPage: function (obj, tpageToal = '4', count = '0') {
                $(obj).createPage({
                    pageCount: tpageToal,
                    current: 1,
                    count: count,
                    callback: (p)=> {
                        commentsOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax: function (flag, callback = function () {
            }) {
                this.loading = true;
                let data = {
                    page: commentsOps.param.page,
                    page_size: commentsOps.param.page_size,
                    vehicle: this.selectedItemId
                };
                if (flag) {
                    data[this.searchInput] = $("#searchInput").val();
                }
                $.ajax({
                    url: `${base.gAjaxUrl.shuttlebusdates2}${this.data.id}/ride_info/`,
                    type: 'GET',
                    data: data
                }).always((data)=> {
                    this.loading = false;
                    base.ajaxCallback(data, ()=> {
                        let resultData = data.results;
                        this.rideInfoDataItems = resultData;

                        if (resultData.length) {
                            this.noData = false;
                            //回调
                            callback(data.num_pages, data.count);
                        } else {
                            this.noData = true;
                        }

                    });
                });
            },
            //获取列表
            getList: function (flag) {
                //重置第一页
                if (flag) {
                    commentsOps.param.page = 1;
                }

                this.queryAjax(flag, (tpageToal = '4', count = '0')=> {
                    this.initPage('#J-page', tpageToal, count)
                });
            },
            departmentEnter: function (flag, e) {
                this.isSelectedInputFocus = flag;
                !flag && $(e.target).children(".departmentListBox").hide();
            },
            departmentClick: function (e) {
                if (this.isSelectedInputFocus) {
                    $(e.target).nextAll(".departmentListBox").show();
                }
            },
            // 清除搜索输入框
            emptySearch: function (e, type) {
                this.selectedItemName = '';
                this.selectedItemId = '';
                $(e.target).nextAll(".departmentListBox").show();
            },
            setDepartmentValue: function (item, e) {
                this.selectedItemName = item.car_no;
                this.selectedItemId = item.id;
                $(e.target).parent(".departmentListBox").hide();
            },
            closeTravel: function () {
                this.showTravel = false;
            },
        },
        components: {travel}
    }
</script>
<style lang="less" scoped rel="stylesheet/less">

    .searchInputType {
        margin-left: -1px;
    }
    .m-info {
        .info, .searchCondition {
            padding-right: 100px;
        }
        .collectBtn {
            position: absolute;
            right: 10px;
            top: 50%;
            width: 82px;
            height: 31px;
            margin-top: -15px;
        }
    }
</style>
