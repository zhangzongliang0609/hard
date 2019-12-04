<template>
    <add v-if="isShowAddDialog"
         :type="dialogType"
         :rule="ruleData"
         v-on:close="closeAdd"
         v-on:save="saveAdd"></add>
    <section class="Hui-article-box">
        <div class="page-container">
            <div class="panel panel-default radius">
                <div class="panel-body clearfix">
                    <span class="f-20 fw-b f-l">线路权限设置</span>
                </div>
            </div>
            <div class="panel panel-default radius clearfix mt-10 mb-10">
                <div class="panel-body clearfix">
                    <div class="text-l clearfix f-l">
                        <select v-model="searchType"
                                class="searchInputType select f-l"
                                style="width: 85px;height: 31px;">
                            <option value="shuttle_name">线路名称</option>
                            <option value="department_name">部门</option>
                            <option value="staff_name">人员</option>
                        </select>
                        <input id="searchInput"
                               v-model="searchInput"
                               type="text"
                               autocomplete="off"
                               placeholder=""
                               style="width:200px;margin-left: -1px;"
                               class="f-l input-text">
                        <button v-on:click="getList(1)" class="btn btn-success radius-r" type="button">
                            <i class="f-r Hui-iconfont">&#xe665;</i>
                        </button>
                    </div>
                    <a class="btn btn-primary radius mr-15 f-r" href="javascript:;" v-on:click="clickAdd()">添加线路权限</a>
                </div>
            </div>
            <table class="table table-border table-bordered table-hover table-bg table-sort">
                <thead>
                <tr class="text-c">
                    <th width="70">线路名称</th>
                    <th width="200" class="max-600">生效范围</th>
                    <th width="70">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr class="text-c" v-for="item in items">
                    <td>{{item.shuttle_name || '--'}}</td>
                    <td class="max-600">{{item | getRange}}</td>
                    <td class="f-14">
                        <a title="编辑" href="javascript:;" v-on:click="clickModify(item)"><i class="Hui-iconfont">
                            &#xe6df;</i></a>
                        <a title="删除" href="javascript:;" class="ml-5" v-on:click="deleteBtn(item)"><i
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

    import * as base from '../assets/js/base.js';
    import add from '../components/addAuths.vue'

    let staffsOps = null;

    export default {
        ready() {

            staffsOps = {
                staff_name: '',
                department_name: '',
                shuttle_name: '',
                page: 1,
                page_size: 10,
            };
            this.getList(1);
        },
        data: function () {
            return {
                noData: false,
                isShowAddDialog: false,
                items: [],
                searchInput: '',
                searchType: 'shuttle_name',
                dialogTitle: '添加部门',
                dialogType: 'add',
                importType: 'bus',
                ruleData: null,
            }
        },
        methods: {
            saveAdd: function () {
                this.isShowAddDialog = false;
                this.getList(1);
            },
            closeAdd: function () {
                this.isShowAddDialog = false
            },
            clickAdd: function () {
                this.dialogType = 'add';
                this.isShowAddDialog = true;
            },
            clickModify: function (data) {
                this.dialogType = 'modify';
                this.ruleData = data;
                this.isShowAddDialog = true;
            },
            //获取列表
            getList: function (reset) {
                if (reset) {
                    staffsOps.page = 1;
                    staffsOps.staff_name = '';
                    staffsOps.department_name = '';
                    staffsOps.shuttle_name = '';
                    staffsOps[this.searchType] = this.searchInput;
                }
                this.queryAjax((tpageToal = '4', count = '0') => {
                    this.initPage('#J-page', tpageToal, staffsOps.page, count)
                });
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
                    url: base.gAjaxUrl.busAuths,
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
                    url: base.gAjaxUrl.busAuths + busVehicle.id + '/lock/',
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
            //删除
            deleteBtn: function (item) {

                layer.confirm('确认删除线路【' + item.shuttle_name + '】的权限？', (index) => {
                    $.showLoading();
                    $.ajax({
                        url: `${base.gAjaxUrl.busAuths}${item.id}/delete/`,
                        type: 'DELETE',
                    }).always((data) => {
                        $.hideLoading();
                        base.ajaxCallback(data, () => {
                            if (this.items.length == 1 && staffsOps.page > 1) {
                                staffsOps.page--;
                            }
                            layer.close(index);
                            layer.msg('删除成功', {icon: 1, time: 1000});
                            this.getList();
                        });
                    })
                });

            },
            getTypeInfo: function (item, type) {
                return item && item[type] ? item[type] : '--'
            }
        },
        filters: {
            getRange(item) {
                // item.staffs item.departments
                let de = '';
                let st = '';
                de = item.departments.map(item => item.department_name).join('、');
                st = item.staffs.map(item => item.real_name).join('、');
                return de + (st ? (';' + st) : '')
            }
        },
        components: {add}
    }
</script>

