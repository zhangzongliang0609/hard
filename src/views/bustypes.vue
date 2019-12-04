<template>
    <!-- 添加 -->
    <add :type="dialogType" :data="dialogData" v-if="isShowAddDialog" v-on:dialog-close="addDialogClose" v-on:dialog-save="addDialogSave"></add>
    <section class="Hui-article-box">
        <div class="page-container">
            <div class="panel panel-default radius">
                <div class="panel-body clearfix">
                    <span class="f-20 fw-b f-l ml-10">车辆类型管理</span>
                    <a class="btn btn-primary radius mr-5 f-r" href="javascript:;" v-on:click="back()">返回</a>
                </div>
            </div>
            <div class="panel panel-default radius clearfix mt-10 mb-10">
                <div class="panel-body clearfix">
                    <div class="search-box f-l clearfix">
                        <input placeholder="车辆类型" type="text" class="input-text f-l" style="margin-left: -1px"
                               v-model="searchInput">
                        <button v-on:click="getList(1)" class="btn btn-success icon_search f-l radius-r" type="button">
                            <i class="f-l Hui-iconfont">&#xe665;</i></button>
                    </div>
                    <span class="f-r">
                        <a class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="clickAdd()">添加类型</a>
                        <!--<a class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="turnToImport()">批量导入</a>-->
                    </span>
                </div>
            </div>
            <div class="bk-gray radius mt-10 bgc-fff">
                <table class="table table-border table-bg table-striped">
                    <thead class="text-c">
                    <tr>
                        <th width="120">类型名称</th>
                        <th width="120">品牌</th>
                        <th width="120">型号</th>
                        <th width="120">颜色</th>
                        <th width="120">座位数</th>
                        <th width="150">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="text-c" track-by="$index" v-for="item in items">
                        <td>{{item.type_name || '--'}}</td>
                        <td>{{item.car_brand || '--'}}</td>
                        <td>{{item.car_model || '--'}}</td>
                        <td>{{item.car_color || '--'}}</td>
                        <td>{{item.seats || '--'}}</td>
                        <td>
                            <a class="mr-10" href="javascript:;" v-on:click="clickModify(item)"><i class="Hui-iconfont">
                                &#xe6df;</i></a>
                            <a title="删除" href="javascript:;" class="ml-5" v-on:click="deleteItem(item.id)"><i
                                    class="Hui-iconfont">&#xe6e2;</i></a>
                        </td>
                    </tr>
                    </tbody>

                </table>
                <div id="J-page" class="m-page" v-show="!noData"></div>
                <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
            </div>
        </div>
        <div class="m-loading" v-if="itemsLoading">
            <div class="cube1"></div>
            <div class="cube2"></div>
        </div>
    </section>
    <import-mould v-if="showImport" v-on:dialog-close="importOver" :type="importType"></import-mould>
</template>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import add from "../components/addBusType.vue";
    import importMould from '../views/importMould.vue';

    let itemOps = null;

    export default{
        ready(){
            itemOps = {
                param: {
                    page: 1,
                    page_size: 10,
                }
            };
            this.getList(1);
        },
        data: function () {
            return {
                showImport: false, // 是否显示导入导出
                noData: false,
                itemsLoading: false,
                isShowAddDialog: false,
                items: [],
                searchInput: '',
                dialogType: 'add',
                dialogData: '',
                importType: "busType",
            }
        },
        methods: {
            addDialogClose: function () {
                this.isShowAddDialog = false;
            },
            addDialogSave: function () {
                this.isShowAddDialog = false;
                this.getList(1);
            },
            clickAdd: function () {
                this.dialogType = 'add';
                this.isShowAddDialog = true;
            },
            clickModify: function (item) {
                this.dialogType = 'modify';
                this.dialogData = item;
                this.isShowAddDialog = true;
            },
            //初始化分页
            initPage: function (obj, tpageToal = '4', current = '1', count = '0') {
                $(obj).createPage({
                    pageCount: tpageToal,
                    current: current,
                    count: count,
                    callback: (p)=> {
                        itemOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            //获取列表
            getList: function (reset = 0) {
                //重置第一页
                if (reset) {
                    itemOps.param.page = 1
                }
                this.queryAjax((tpageToal = '4', count = '0')=> {
                    this.initPage('#J-page', tpageToal, itemOps.param.page, count)
                });
            },
            queryAjax: function (callback = function () {}) {
                //修改参数
                this.itemsLoading = true;
                let itemData = {
                    page: itemOps.param.page,
                    page_size: itemOps.param.page_size,
                    search: this.searchInput
                };
                $.ajax({
                    url: base.gAjaxUrl.bustypes,
                    type: 'GET',
                    data: itemData,
                }).always((data)=> {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=> {
                        let resultData = data.results;
                        this.items = resultData || [];
                        if (resultData && resultData.length) {
                            this.noData = false;
                            //回调
                            callback(data.num_pages, data.count);
                        } else {
                            this.noData = true;
                        }
                    });
                })
            },
            //删除
            deleteItem: function (id) {

                layer.confirm('删除须谨慎，确认要删除吗？', (index)=> {
                    $.ajax({
                        url: `${base.gAjaxUrl.bustypes}${id}/`,
                        type: 'DELETE',
                    }).always((data)=> {
                        if(data) {
                            base.ajaxCallback(data);
                            return;
                        }
                        if (this.items.length == 1 && itemOps.param.page > 1) {
                            itemOps.param.page--;
                        }
                        layer.msg('删除成功', {icon: 1, time: 1000});
                        this.getList();
                    });
                });

            },
            turnToImport: function () {
                this.showImport = true;
            },
            importOver: function (flag) {
                if (flag) {
                    this.getList(1);
                }
                this.showImport = false;
            },
            back: function () {
                window.history.back();
            }

        },
        components: {
            add,
            importMould,
        }
    }
</script>
<style lang="less" scoped rel="stylesheet/less">
    .select-box {
        width: 100px;
        height: 31px;
    }

    .input-text {
        width: 200px;
    }
</style>