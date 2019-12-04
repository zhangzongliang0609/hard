<template>
    <!-- 添加 -->
    <add :type="dialogType" :data="dialogData" v-if="isShowAddDialog"
         v-on:dialog-close="addDialogClose" v-on:dialog-save="addDialogSave"></add>

    <bus-details v-on:dialog-close="detailsClose" v-if="isShowDetails" :data="details"></bus-details>
    <!-- 定位器 -->
    <set :title="dialogTitle" :type="port" :data="dialogData" v-if="isShowSetPositioningDialog"
         v-on:dialog-close="setDialogClose" v-on:dialog-save="setDialogSave"></set>

    <section class="Hui-article-box">
        <div class="page-container">
            <div class="panel panel-default radius">
                <div class="panel-body clearfix">
                    <span class="f-20 fw-b f-l">车辆管理</span>
                </div>
            </div>
            <div class="panel panel-default radius clearfix mt-10 mb-10">
                <div class="panel-body clearfix">
                    <div class="text-l clearfix f-l">
                        <select v-model="searchType" class="searchInputType select f-l"
                                style="width: 85px;height: 31px;">
                            <option value="car_no">车牌号</option>
                            <option value="type_name">车辆类型</option>
                        </select>
                        <input id="searchInput" v-model="searchInput" type="text" placeholder=""
                               style="width:200px;margin-left: -1px;" class="f-l input-text"
                               autocomplete="off">
                        <button v-on:click="getList(1)" class="btn btn-success radius-r" type="button">
                            <i class="f-r Hui-iconfont">&#xe665;</i>
                        </button>
                    </div>
                    <a id="exportData" class="btn btn-secondary radius f-r" v-on:click="exportData()">批量导出</a>
                    <a href="javascript:;" class="btn btn-secondary radius f-r mr-15" @click="turnToImport()">批量导入</a>
                    <a class="btn btn-primary radius mr-15 f-r" href="javascript:;" v-on:click="clickAdd()">添加车辆</a>
                    <a class="btn btn-primary radius mr-15 f-r" href="javascript:;"
                       v-on:click="turnToBusType()">车辆类型管理</a>
                </div>
            </div>
            <table class="table table-border table-bordered table-hover table-bg table-sort">
                <thead>
                <tr class="text-c">
                    <th width="70">车牌</th>
                    <th width="70">车号</th>
                    <th width="70">品牌</th>
                    <th width="70">型号</th>
                    <th width="70">颜色</th>
                    <th width="70">座位数</th>
                    <th width="100">车辆类型</th>
                    <th width="100">备注</th>
                    <th width="70">是否锁定</th>
                    <th width="120">定位器ID</th>
                    <th width="70">操作</th>
                    <th width="70">查看详情</th>
                </tr>
                </thead>
                <tbody>
                <tr class="text-c" v-for="item in items">
                    <td>{{item.car_no || '--'}}</td>
                    <td>{{item.car_flag || '--'}}</td>
                    <td>{{getTypeInfo(item.car_type_vo, 'car_brand')}}</td>
                    <td>{{getTypeInfo(item.car_type_vo, 'car_model')}}</td>
                    <td>{{getTypeInfo(item.car_type_vo, 'car_color')}}</td>
                    <td>{{getTypeInfo(item.car_type_vo, 'seats')}}</td>
                    <td>{{getTypeInfo(item.car_type_vo, 'type_name')}}</td>
                    <td class="remark">{{item.remark}}</td>
                    <td>
                        <img class="w-20 cursor-p"
                             v-bind:src="item.locked?'./src/assets/images/lock_close.png':'./src/assets/images/lock_open.png'"
                             v-on:click="toggleLock(item)"/>
                    </td>
                    <td>
                        <span class="cursor-p" v-if="item.position_hardware_vo"
                              v-on:click="clickSetPositioninghardwares(item)">{{item.position_hardware_vo.hardware_no}}<i
                                class="Hui-iconfont fc-5a98de fz-20">&#xe695;</i></span>
                        <a class="btn btn-primary radius" href="javascript:;" v-if="!item.position_hardware_vo"
                           v-on:click="clickSetPositioninghardwares(item)">绑定定位器</a>
                    </td>
                    <td class="f-14">
                        <a title="编辑" href="javascript:;" v-on:click="clickModify(item)"><i class="Hui-iconfont">
                            &#xe6df;</i></a>
                        <a title="删除" href="javascript:;" class="ml-5" v-on:click="deleteBtn(item.car_no,item.id)"><i
                                class="Hui-iconfont">&#xe6e2;</i></a>
                    </td>
                    <td>
                        <a class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="showDetails(item)">车辆详情
                        </a>
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

    .remark {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100px;
    }

    .remark:hover {
        white-space: normal;
        overflow: visible;
        text-overflow: clip;
    }

    .fz-20 {
        font-size: 20px;
    }

</style>

<script type="text/ecmascript-6">
    import * as base from '../../assets/js/base.js';
    import add from "../components/ferryaddBusVehicle.vue";
    import set from "../components/ferryWares.vue";
    import busDetails from "../components/ferrybusDetails.vue";

    let staffsOps = null;

    export default {
        ready() {

            staffsOps = {
                car_no: '',
                type_name: '',
                page: 1,
                page_size: 10,
            };
            this.getList(1);
        },
        data: function () {
            return {
                noData: false,
                isShowAddDialog: false,
                isShowSetPositioningDialog: false,
                isShowDetails: false,
                items: [],
                searchInput: '',
                searchType: 'car_no',
                dialogTitle: '添加部门',
                dialogType: 'add',
                showImport: false,
                importType: 'bus',
                dialogData: '',
                details: {},
                port: base.gAjaxUrl.shuttlebusvehicles,
                importData: {},
            }
        },
        methods: {
            detailsClose: function () {
                this.isShowDetails = false;
            },
            showDetails: function (data) {
                this.details = data;
                this.isShowDetails = true;
            },
            addDialogClose: function (data) {
                this.isShowAddDialog = false;
            },
            addDialogSave: function (data) {
                this.isShowAddDialog = false;
                this.getList();
            },
            clickAdd: function () {
                this.dialogType = 'add';
                this.dialogTitle = '添加车辆';
                this.isShowAddDialog = true;
            },
            turnToBusType: function () {
                this.$router.go({
                    path: '/ferryBusTypes'
                })
            },
            clickModify: function (data) {
                this.dialogTitle = '修改资料';
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
                    url: base.gAjaxUrl.ferryBusList,
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
            toggleLock: function (busVehicle) {
                $.showLoading();
                $.ajax({
                    url: base.gAjaxUrl.ferryBusList + busVehicle.id + '/lock/',
                    type: 'PATCH',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        locked: !busVehicle.locked
                    })
                }).always((data) => {
                    $.hideLoading();
                    base.ajaxCallback(data, () => {
                        this.getList();
                    });
                })
            },
            setDialogClose: function (data) {
                this.isShowSetPositioningDialog = false;
            },
            setDialogSave: function (data) {
                this.isShowSetPositioningDialog = false;
                this.getList();
            },
            clickSetPositioninghardwares: function (data) {
                this.dialogTitle = '车辆硬件';
                this.dialogData = data;
                console.log(data)
                this.isShowSetPositioningDialog = true;
            },
            //获取列表
            getList: function (id = 0) {
                if (id) {
                    staffsOps.page = 1;
                    staffsOps.car_no = '';
                    staffsOps.type_name = '';
                    staffsOps[this.searchType] = $('#searchInput').val();
                }
                this.queryAjax((tpageToal = '4', count = '0') => {
                    this.initPage('#J-page', tpageToal, staffsOps.page, count)
                });
            },
            //删除
            deleteBtn: function (car_num, id) {

                layer.confirm('确认删除车辆【' + car_num + '】？', (index) => {
                    $.ajax({
                        url: `${base.gAjaxUrl.ferryBusList}${id}/`,
                        type: 'DELETE',
                    }).always((data) => {
                        if (data) {
                            base.ajaxCallback(data);
                            return;
                        }
                        if (this.items.length == 1 && staffsOps.page > 1) {
                            staffsOps.page--;
                        }
                        layer.msg('删除成功', {icon: 1, time: 1000});
                        this.getList();
                    })
                });

            },
            turnToImport: function () {
                this.$router.go({
                    path: '/importMould',
                    name: 'importMould',
                    query: {
                        importType: 'ferryBusVehicle'
                    }
                })
            },
            importOver: function (flag) {

                if (flag) {
                    this.getList(1);
                }
                this.showImport = false;
            },
            exportData: function () {
                $.showLoading();
                $.ajax({
                    url: `${base.gAjaxUrl.ferryBusList}export/`,
                    type: 'GET',
                    data: {
                        search: staffsOps
                    },
                }).always((data) => {
                    $.hideLoading();
                    this.$route.router.go({path: '/job', replace: true});
                })
            },
            getTypeInfo: function (item, type) {
                return item && item[type] ? item[type] : '--'
            }
        },
        filters: {
            getLines: function (arr) {
                let str = '';
                arr.forEach(function (item, i) {
                    str += item.shuttle_name + '/'
                });
                return str.slice(0, -1);
            }
        },
        components: {
            add,
            busDetails,
            set,
        }
    }
</script>

