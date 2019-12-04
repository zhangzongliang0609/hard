<template>

    <!-- 添加 -->
    <add :title="dialogTitle" :type="dialogType" :data="dialogData" v-if="isShowAddDialog"
         v-on:dialog-close="addDialogClose" v-on:dialog-save="addDialogSave"></add>
    <new-add v-if="showNewAdd" :data="dialogData" :type="type" @dialog-close="closeNewAdd" @dialog-save="newAddSave"></new-add>
    <!-- 导入 -->
    <imoprt-data v-if="isShowImportDialog" v-on:dialog-close="importDialogClose"
                 v-on:dialog-save="importDialogSave"></imoprt-data>
    <section class="Hui-article-box">
        <div class="page-container">
            <div class="panel panel-default radius">
                <div class="panel-body clearfix">
                    <span class="f-20 fw-b f-l">司机管理</span>
                </div>
            </div>
            <div class="panel panel-default radius clearfix mt-10 mb-10">
                <div class="panel-body clearfix">
                    <div class="text-l clearfix f-l">
                        <input id="searchInput" type="text" autocomplete="off" placeholder="姓名/工号/电话" style="width:250px"
                               class="f-l input-text">
                        <button v-on:click="getList(1)" class="f-l btn btn-success radius-r" type="button">
                            <i class="f-r Hui-iconfont">&#xe665;</i>
                        </button>
                    </div>
                    <a class="btn btn-primary radius mr-5 f-r" href="javascript:;" v-on:click="clickAdd()">添加司机</a>
                    <a class="btn btn-primary radius mr-5 f-r" href="javascript:;" v-on:click="clickNewAdd()">新增司机</a>
                </div>
            </div>
            <table class="table table-border table-bordered table-hover table-bg table-sort">
                <thead>
                <tr class="text-c">
                    <th width="150">姓名/性别</th>
                    <th width="100">部门/职位</th>
                    <th width="100">工号</th>
                    <th width="100">电话</th>
                    <th width="100">是否锁定</th>
                    <th width="100">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr class="text-c" v-for="item in items">
                    <td>{{item.staff_vo.real_name}}/{{item.staff_vo.sex == 1 ? '男':'女'}}</td>
                    <td>{{item.staff_vo.department_vo.department_name}}/{{item.staff_vo.position}}</td>
                    <td>{{item.staff_vo.job_number || '--'}}</td>
                    <td>{{item.staff_vo.phone || '--'}}</td>
                    <td>
                        <img class="w-20 cursor-p"
                             v-bind:src="!item.is_active ? './src/assets/images/lock_close.png' : './src/assets/images/lock_open.png'"
                             v-on:click="toggleLock(item)"/>
                    </td>
                    <td class="f-14">
                        <a title="编辑" href="javascript:;" v-on:click="clickModify(item)"><i class="Hui-iconfont">
                            &#xe6df;</i></a>
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

<script type="text/ecmascript-6">
    import * as base from '../../assets/js/base.js';
    import add from "../components/ferryaddBusDriver.vue";
    import newAdd from "../components/ferryaddBusEmployeeDriver.vue";
    let staffsOps = null;

    export default{
        ready () {
            staffsOps = {
                param: {
                    search: '',
                    page: 1,
                    page_size: 10,
                }
            };
            this.getList();
        },
        data: function () {
            return {
                noData: false,
                itemsLoading: false,
                isShowAddDialog: false,
                isShowImportDialog: false,
                items: [],
                searchInput: '',
                dialogTitle: '添加部门',
                dialogType: 'add',
                dialogData: '',
                showNewAdd: false,
                type: 'add',
                title: '新增司机',
            }
        },
        methods: {
            addDialogClose: function (data) {
                this.isShowAddDialog = false;
            },
            addDialogSave: function (data) {
                this.isShowAddDialog = false;
                this.getList();
            },
            clickAdd: function () {
                this.dialogType = 'add';
                this.dialogTitle = '添加司机';
                this.isShowAddDialog = true;
            },
            clickModify: function (data) {
                this.type = 'modify';
                this.dialogData = data;
                this.showNewAdd = true;
            },
            //初始化分页
            initPage: function (obj, tpageToal = '4', current = '1', count = '0') {
                $(obj).createPage({
                    pageCount: tpageToal,
                    current: current,
                    count: count,
                    callback: (p)=> {
                        staffsOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax: function (callback = function () {
            }) {
                this.itemsLoading = true;
                //修改参数
                $.ajax({
                    url: base.gAjaxUrl.ferryBusDriver,
                    type: 'GET',
                    data:  {
                        search:this.searchInput
                    }
                }).always((data)=> {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=> {
                       // console.log(data)
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
            // 获取列表
            getList: function (reset = 0) {
                //重置第一页
                if (reset) {
                    this.searchInput = $("#searchInput").val();
                    staffsOps.param.page = 1
                }
                this.queryAjax((tpageToal = '4', count = '0')=> {
                    this.initPage('#J-page', tpageToal, staffsOps.param.page, count)
                });
            },
            // 删除
            deleteBtn: function (id) {

                layer.confirm('删除须谨慎，确认要删除吗？', (index)=> {
                    this.itemsLoading = true;
                    $.ajax({
                        url: `${base.gAjaxUrl.ferryBusDriver}${id}/`,
                        type: 'DELETE',
                    }).always((data)=> {
                        this.itemsLoading = false;
                        if (data) {
                            base.ajaxCallback(data);
                            return
                        }
                        if (this.items.length == 1 && staffsOps.param.page > 1) {
                            staffsOps.param.page--;
                        }
                        layer.msg('删除成功', {icon: 1, time: 1000});
                        this.getList();
                    })
                });

            },
            //获取司机
            toggleLock: function (driver) {
                this.itemsLoading = true;
                //console.log(driver)
                $.ajax({
                    url: base.gAjaxUrl.ferryBusDriver + driver.id + '/',
                    type: 'PATCH',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        is_active: !driver.is_active
                    })
                }).always((data)=> {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=> {
                        this.getList();
                    });
                })
            },
            clickNewAdd: function () {
                this.showNewAdd = true;
                this.type = 'add';
            },
            closeNewAdd: function () {
                this.showNewAdd = false;
            },
            newAddSave: function () {
                this.showNewAdd = false;
                this.queryAjax((tpageToal = '4', count = '0')=> {
                    this.initPage('#J-page', tpageToal, staffsOps.param.page, count)
                });
            }
        },
        components: {
            add: add,
            newAdd: newAdd,
        }
    }
</script>

