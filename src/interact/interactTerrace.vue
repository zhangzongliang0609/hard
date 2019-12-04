<template>
    <!-- 添加 -->
    <add-interact v-if="showNewAdd" :data="dialogData" :type="dialogType" :title="dialogTitle"
                  @dialog-close="closeNewAdd" @dialog-save="newAddSave" @modify-save="newAddSave"></add-interact>

    <section class="Hui-article-box">
        <div class="page-container">
            <div class="panel panel-default radius">
                <div class="panel-body">
                    <span class="f-20 fw-b">互动平台管理</span>
                </div>
            </div>
            <div class="text-l mt-10 mt-10 mb-10 pt-10 pb-10 clearfix">
                <div class="f-l">
                    互动平台：
                    <input id="searchInput" v-model="searchInput"
                           type="text" autocomplete="off" placeholder="请输入..."
                           style="width:200px" class="input-text">
                    <button @click="getList(1)" class="btn btn-success search-btn radius-r" type="button"><i
                            class="Hui-iconfont">&#xe665;</i></button>
                </div>
                <span class="f-r">
                      <a class="btn btn-primary radius mr-5" href="javascript:;" @click="clickNewAdd()">
                         <!-- <i class="Hui-iconfont">&#xe600;</i>--> 新加互动平台</a>
                </span>
            </div>
            <table class="table table-border table-bordered table-hover table-bg table-sort">
                <thead>
                <tr class="text-c">
                    <th width="240">平台名称</th>
                    <th width="100">图片</th>
                    <th>公告内容</th>
                    <th width="70">是否启用</th>
                    <th width="120">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr class="text-c" v-for="item in items">
                    <td>{{item.name}}</td>
                    <td>
                        <img class="avatar" :src="item.images" v-if="item.images"/>
                        <span v-else>--</span>
                    </td>
                    <td class="max-150">{{item.message}}</td>
                    <td>
                        <span class="switch-outer" @click="toggleStandby(item)"
                              :class="{'selected': item.is_active}">
                                <span class="switch-inner">
                                    <span class="switch-center"></span>
                                </span>
                        </span>
                    </td>
                    <td class="f-14">
                        <a title="编辑" href="javascript:;" @click="clickModify(item)"><i class="Hui-iconfont">&#xe6df;</i></a>
                        <a title="删除" href="javascript:;" class="ml-5" @click="deleteBtn(item.id)"><i
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
    import * as base from '../assets/js/base.js';
    import addInteract from "./components/addInteract";

    let staffsOps = null;

    export default {
        ready() {

            let that = this;
            staffsOps = {
                param: {
                    search: '',
                    page: 1,
                    page_size: 10,
                }
            };
            this.queryAjax((tpageToal = '4', count = '0') => {
                this.initPage('#J-page', tpageToal, count)
            });

        },
        data: function () {
            return {
                noData: true,
                itemsLoading: false,
                isShowAddDialog: false,
                items: [],  //表格数据
                searchInput: '',
                dialogTitle: '新增',
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
                this.getList();
            },
            clickAdd: function () {
                this.isShowAddDialog = true;
            },
            clickModify: function (data) {
                this.dialogTitle = '修改资料';
                this.dialogType = 'modify';
                this.dialogData = data;
                this.showNewAdd = true;
            },
            toggleLock: function (officialcarDriver) {
                this.itemsLoading = true;
                var url;
                officialcarDriver.locked ? url = base.gAjaxUrl.officialcarDriverList_V2 + officialcarDriver.id + '/' : url = base.gAjaxUrl.officialcarDriverList_V2 + officialcarDriver.id + '/';
                $.ajax({
                    url: url,
                    type: 'PATCH',
                    data: {
                        locked: officialcarDriver.locked ? false : true
                    }
                })
                    .always((data) => {
                        this.itemsLoading = false;
                        base.ajaxCallback(data, () => {
                            officialcarDriver.locked = data.locked
                        });
                    })
            },
            //初始化分页
            initPage: function (obj, tpageToal = '4', count = '0') {
                $(obj).createPage({
                    pageCount: tpageToal,
                    current: staffsOps.param.page,
                    count: count,
                    callback: (p) => {
                        staffsOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax: function (callback = function () {
            }) {
                this.itemsLoading = true;
                //修改参数
                staffsOps.param.search = this.searchInput;

                $.ajax({
                    url: base.gAjaxUrl.interactList,
                    type: 'GET',
                    data: staffsOps.param
                }).always((data) => {
                        base.ajaxCallback(data, () => {
                            this.itemsLoading = false;
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
                if (reset) {
                    this.searchInput = $("#searchInput").val();
                    staffsOps.param.page = 1
                }

                this.queryAjax((tpageToal = '4', count = '0') => {
                    that.initPage('#J-page', tpageToal, count)
                });
            },
            //删除
            deleteBtn: function (id) {
                let that = this;
                layer.confirm('删除须谨慎，确认要删除吗？', (index) => {
                    if ($('tbody tr.text-c').length == 1 && staffsOps.param.page > 1) {
                        staffsOps.param.page--;
                    }
                    $.ajax({
                        url: `${base.gAjaxUrl.interactList}${id}/`,
                        type: 'DELETE',
                    })
                        .always((data) => {
                            layer.msg('删除成功', {icon: 1, time: 1000});
                            that.getList();

                        })
                });
            },
            clickNewAdd: function () {
                this.showNewAdd = true;
                this.dialogType = 'add';
                this.dialogTitle = '新增互动平台';
            },
            closeNewAdd: function () {
                this.showNewAdd = false;
            },
            newAddSave: function () {
                this.showNewAdd = false;
                this.queryAjax((tpageToal = '4', count = '0') => {
                    this.initPage('#J-page', tpageToal, staffsOps.param.page, count)
                });
            },
            toggleStandby: function (data) {
                let str = data.is_active ? `确定禁用${data.name}吗？` : `确定启用${data.name}吗？`;
                layer.confirm(str, (index) => {
                    this.itemsLoading = true;
                    $.ajax({
                        url: `${base.gAjaxUrl.interactList}${data.id}/`,
                        type: 'PATCH',
                        contentType: "application/json",
                        data: JSON.stringify({
                            is_active: data.is_active ? false : true
                        })
                    }).always((data) => {
                        this.itemsLoading = false;
                        base.ajaxCallback(data, () => {
                            this.getList();
                        })
                    });
                    layer.closeAll();
                });
            }
        },
        components: {
            addInteract,
        }
    }
</script>

<style lang="less" type="text/less">
    .avatar {
        width: 50px;
    }

    .search-btn {
        margin-left: -5px;
    }
</style>
