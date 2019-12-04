<template>
    <add :title="dialogTitle" :type="dialogType" :data="dialogData" v-if="isShowAddDialog"
         v-on:dialog-close="addDialogClose" v-on:dialog-save="addDialogSave"></add>

    <section class="Hui-article-box">

        <div class="page-container">
            <div class="title panel panel-default radius pt-10 pb-10 pl-20 bg-fff">
                <span class="f-15 fw-b">企业管理员</span>
            </div>
            <div class="panel panel-default radius clearfix mt-15 mb-15">
                <div class="panel-body clearfix">
                    <div class="f-l clearfix">
                        <select v-model="searchType"
                                class="f-l searchType select">
                            <option value="real_name">姓名</option>
                            <option value="phone">电话</option>
                        </select>
                        <input class="f-l input-text"
                               type="text"
                               placeholder=""
                               v-model="searchContent"
                               style="width:200px;margin-left: -1px">
                        <button v-on:click="getList(1)" class="btn btn-success f-l radius-r" type="button"><i
                                class="f-r Hui-iconfont">&#xe665;</i></button>
                    </div>
                    <div class="f-r">
                        <a class="btn btn-primary radius" href="javascript:;"
                           v-on:click="clickAdd()">
                            <i class="Hui-iconfont">&#xe600;</i>添加管理员
                        </a>
                    </div>
                </div>
            </div>

            <table class="table table-border table-bordered table-hover table-bg">
                <thead>
                <!-- <tr>
                    <thscoped="col" colspan="10">企业管理员</th>
                </tr> -->
                <tr class="text-c">
                    <!-- <th width="25"><input type="checkbox" value="" name=""></th> -->
                    <th>姓名</th>
                    <th>电话（账号）</th>
                    <th width="70">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr class="text-c" v-for="item in items">
                    <td>{{item.user_name}}
                        <span class="c-red" v-if="item.is_super">
                            (超级管理员不可删除与编辑)
                        </span>
                    </td>
                    <td>{{item.phone}}</td>
                    <td class="f-14">
                        <div v-if="!item.is_super">
                            <a title="编辑" href="javascript:;" v-on:click="clickModify(item)"><i
                                    class="Hui-iconfont">&#xe6df;</i></a>
                            <a title="删除" href="javascript:;" class="ml-5" v-on:click="deleteBtn(item.id)"><i
                                    class="Hui-iconfont">&#xe6e2;</i></a>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
            <div id="J-page" class="m-page" v-show="!noData"></div>
            <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>

        </div>
    </section>
</template>

<style lang="less" rel="stylesheet" scoped>

    .searchType {
        padding-left: 5px;
        text-align: right;
        height: 31px;
        width: 80px;
    }

</style>

<script type="text/ecmascript-6">

    import * as base from '../assets/js/base.js';
    import add from "../components/addCompany.vue";

    let pageOpts = null;

    export default {
        ready() {

            pageOpts = {
                page: 1,
                page_size: 10,
                real_name: '',
                phone: '',
            };
            this.getList();

        },
        data: function () {
            return {
                noData: false,
                isShowAddDialog: false,
                isShowModifyDialog: false,
                items: [],
                searchType: 'real_name',
                searchContent: '',
                dialogTitle: '添加部门',
                dialogType: 'add',
                dialogData: ''
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
                this.dialogTitle = '添加管理员';
                this.dialogType = 'add';
                this.isShowAddDialog = true;
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
                        pageOpts.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax: function (callback = function () {
            }) {
                $.showLoading();
                $.ajax({
                    url: base.gAjaxUrl.companyadmins,
                    type: 'GET',
                    data: pageOpts
                }).always((data) => {
                    $.hideLoading();
                    base.ajaxCallback(data, () => {
                        let resultData = data.results;
                        this.items = resultData;
                        if (resultData.length) {
                            this.noData = false;
                            callback(data.num_pages, data.count);
                        } else {
                            this.noData = true;
                        }
                    });
                })
            },
            //获取列表
            getList: function (flag) {

                if (flag) {
                    pageOpts.page = 1;
                    pageOpts.real_name = '';
                    pageOpts.phone = '';
                    pageOpts[this.searchType] = this.searchContent;
                }

                this.queryAjax((tpageToal = '4', count = '0') => {
                    this.initPage('#J-page', tpageToal, pageOpts.page, count)
                });
            },
            //删除
            deleteBtn: function (id) {

                layer.confirm('删除须谨慎，确认要删除吗？', (index) => {

                    $.ajax({
                        url: `${base.gAjaxUrl.companyadmins}${id}/`,
                        type: 'DELETE',
                    }).always((data) => {
                        if (data) {
                            base.ajaxCallback(data)
                        } else {
                            layer.msg('删除成功', {icon: 1, time: 1500});
                            if (this.items.length === 1 && pageOpts.page > 1) {
                                pageOpts.page--;
                            }
                            this.getList();
                        }
                    })
                });

            }
        },
        components: {
            add
        }
    }

</script>