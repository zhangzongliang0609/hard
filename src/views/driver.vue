<template>

    <!-- 添加 -->
    <add v-if="isShowAddDialog"
         v-on:dialog-close="addDialogClose"
         v-on:dialog-save="addDialogSave"></add>

    <new-add v-if="showNewAdd"
             :data="dialogData"
             :type="dialogType"
             :title="dialogTitle"
             :parent="'official'"
             @dialog-close="closeNewAdd"
             @dialog-save="newAddSave"></new-add>

    <!-- 导入 -->
    <imoprt-data v-if="isShowImportDialog" v-on:dialog-close="importDialogClose"
                 v-on:dialog-save="importDialogSave"></imoprt-data>
    <section class="Hui-article-box">
        <div class="page-container">

            <div class="clearfix">
                <div class="f-l">关键字：</div>
                <input v-model="searchInput"
                       type="text"
                       autocomplete="off"
                       placeholder="姓名/工号/电话"
                       style="width:250px"
                       class="input-text f-l"/>
                <button v-on:click="getList(1)"
                        class="btn btn-success f-l radius-r" type="button">
                    <i class="Hui-iconfont">&#xe665;</i>
                </button>
            </div>

            <div class="cl pd-5 bg-1 bk-gray mt-20">
                   <span class="f-l">
                <a class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="clickAdd()"><i
                        class="Hui-iconfont">&#xe600;</i> 添加司机
                </a>

            </span>
                <span class="f-r">
                <a class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="clickNewAdd()"><i
                        class="Hui-iconfont">&#xe600;</i> 新增司机
                </a>

            </span>
            </div>
            <table class="table table-border table-bordered table-hover table-bg table-sort">
                <thead>
                <tr class="text-c">
                    <th width="30">头像</th>
                    <th width="100">姓名/性别</th>
                    <th width="100">部门/职位</th>
                    <th width="100">工号</th>
                    <th width="100">电话</th>
                    <th width="60">是否锁定</th>
                    <th width="60">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr class="text-c" v-for="item in items">
                    <td>
                        <img class="avatar"
                             v-bind:src="item.staff_vo.avatar?item.avatar:'./src/assets/images/avatar-default.jpg'"/>
                    </td>
                    <td>{{item.staff_vo.real_name}}/{{item.staff_vo.sex == 1 ? '男':'女'}}</td>
                    <td>{{item.staff_vo.department_vo.department_name}}/{{item.staff_vo.position}}</td>
                    <td>{{item.staff_vo.job_number}}</td>
                    <td>{{item.staff_vo.phone}}</td>
                    <td><img class="w-20"
                             v-bind:src="item.locked?'./src/assets/images/lock_close.png':'./src/assets/images/lock_open.png'"
                             v-on:click="toggleLock(item)"></td>
                    <td class="f-14">
                        <a title="编辑" href="javascript:;" v-on:click="clickModify(item)"><i class="Hui-iconfont">&#xe6df;</i></a>
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

<style lang="less">
    .avatar {
        width: 50px;
    }
</style>

<script>
    import * as base from '../assets/js/base.js';
    import add from "../components/addOfficialCarDriver1.vue";
    import newAdd from "../components/addOfficialCarDriver.vue";

    let staffsOps = null;

    export default {
        ready() {

            staffsOps = {
                search: '',
                page: 1,
                page_size: 10,
            };
            this.queryAjax((tpageToal = '4', count = '0') => {
                this.initPage('#J-page', tpageToal, count)
            });

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
            }
        },
        methods: {
            addDialogClose: function (data) {
                this.isShowAddDialog = false;
            },
            addDialogSave: function (data) {
                this.isShowAddDialog = false;
                this.getList(1);
            },
            clickAdd: function () {
                this.isShowAddDialog = true;
            },
            toggleLock: function (officialcarDriver) {
                var url
                if (officialcarDriver.locked) {
                    // 解锁
                    url = base.gAjaxUrl.officialcardrivers + officialcarDriver.id + '/unlock/'
                } else {
                    // 锁定
                    url = base.gAjaxUrl.officialcardrivers + officialcarDriver.id + '/lock/'
                }
                $.ajax({
                    url: url,
                    type: 'GET'
                }).always((data) => {
                    base.ajaxCallback(data, () => {
                        officialcarDriver.locked = data.locked
                    });
                })
            },
            //初始化分页
            initPage: function (obj, tpageToal = '4', count = '0') {
                $(obj).createPage({
                    pageCount: tpageToal,
                    current: 1,
                    count: count,
                    callback: (p) => {
                        staffsOps.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax: function (callback = function () {
            }) {
                this.itemsLoading = true;
                //修改参数
                $.ajax({
                    url: base.gAjaxUrl.officialcardrivers,
                    type: 'GET',
                    data: staffsOps
                }).always((data) => {
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
                //重置第一页
                if (reset) {
                    staffsOps.page = 1;
                    staffsOps.search = this.searchInput;
                }
                this.queryAjax((tpageToal = '4', count = '0') => {
                    this.initPage('#J-page', tpageToal, count)
                });
            },
            //删除
            deleteBtn: function (id) {
                let that = this;
                layer.confirm('删除须谨慎，确认要删除吗？', (index) => {
                    $.showLoading();
                    $.ajax({
                        url: `${base.gAjaxUrl.officialcardrivers}${id}/`,
                        type: 'DELETE',
                    }).always((data) => {
                        $.hideLoading();
                        if(data) {
                            base.ajaxCallback(data)
                        } else {
                            if (this.items.length === 1 && staffsOps.page > 1) {
                                staffsOps.page--;
                            }
                            layer.msg('删除成功', {icon: 1, time: 1000});
                            that.getList();
                        }
                    })
                });
            },
            clickNewAdd: function () {
                this.showNewAdd = true;
                this.dialogType = 'add';
                this.dialogTitle = '新增司机';
            },
            clickModify: function (data) {
                this.dialogTitle = '修改资料';
                this.dialogType = 'modify';
                this.dialogData = data;
                this.showNewAdd = true;
            },
            closeNewAdd: function () {
                this.showNewAdd = false;
            },
            newAddSave: function (type) {
                this.showNewAdd = false;
                if (type === 'modify') {
                    this.getList(1)
                } else {
                    this.getList();
                }
            }
        },
        components: {
            add: add,
            newAdd: newAdd,
        }
    }
</script>
