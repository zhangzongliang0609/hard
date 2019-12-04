<template>
    <add :type="dialogType" :data="dialogData" v-if="isShowAddDialog"
         v-on:dialog-close="addDialogClose" v-on:dialog-save="addDialogSave"></add>
    <section class="Hui-article-box">
        <div class="page-container">
            <div class="panel panel-default radius">
                <div class="panel-body clearfix">
                    <span class="f-20 fw-b f-l">月票管理</span>
                </div>
            </div>
            <div class="panel panel-default radius clearfix mt-10 mb-10">
                <div class="panel-body clearfix">
                    <div class="text-l clearfix f-l">
                        <input id="searchInput" v-model="searchInput" style="width:250px" type="text" placeholder="月票名称"
                               style="width:200px;margin-left: -1px;" class="f-l input-text">
                        <button v-on:click="getList(1)" class="btn btn-success radius-r" type="button">
                            <i class="f-r Hui-iconfont">&#xe665;</i>
                        </button>
                    </div>
                    <a class="btn btn-primary radius mr-15 f-r" href="javascript:;" v-on:click="clickAdd()">新增月票</a>
                </div>
            </div>
            <table class="table table-border table-bordered table-hover table-bg table-sort">
                <thead>
                <tr class="text-c">
                    <th width="100">月票名称</th>
                    <th width="100">价格(元)</th>
                    <th width="100">有效期(天)</th>
                    <th width="150" class="max-400">使用线路</th>
                    <th width="120" class="max-200">说明</th>
                    <th width="100">操作</th>
                </tr>
                </thead>
                <tbody v-if="!noData">
                <tr class="text-c" v-for="item in items">
                    <td>{{item.ticket_name}}</td>
                    <td>{{(item.price / 100).toFixed(2)}}</td>
                    <td>{{item.day}}</td>
                    <td>{{item.shuttle_buses_set | getBusLineNames}}</td>
                    <td>{{item.ticket_descp}}</td>
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
    import * as base from '../assets/js/base.js';
    import add from "../components/addBusMonthlyTickets.vue";
    let busMonthlyTicketsOps = null;

    export default{
        ready () {

            busMonthlyTicketsOps = {
                param: {
                    search: '',
                    page: 1,
                    page_size: 10,
                }
            };
            this.getList(1);

        },
        data: function () {
            return {
                noData: false,
                itemsLoading: false,
                isShowAddDialog: false,
                items: [],
                searchInput: '',
                dialogType: 'add',
                dialogData: '',
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
                this.dialogType = 'add';
            },
            clickModify: function (data) {
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
                        busMonthlyTicketsOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax: function (callback = function () {
            }) {
                this.itemsLoading = true;
                //修改参数
                busMonthlyTicketsOps.param.search = this.searchInput;
                $.ajax({
                    url: base.gAjaxUrl.busmonthlytickets,
                    type: 'GET',
                    data: busMonthlyTicketsOps.param
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
                    busMonthlyTicketsOps.param.page = 1;
                    this.searchInput = $("#searchInput").val();
                }
                this.queryAjax((tpageToal = '4', count = '0')=> {
                    this.initPage('#J-page', tpageToal, busMonthlyTicketsOps.param.page, count)
                });
            },
            //删除
            deleteBtn: function (id) {

                layer.confirm('删除须谨慎，确认要删除吗？', (index)=> {

                    $.ajax({
                        url: `${base.gAjaxUrl.busmonthlytickets}${id}/`,
                        type: 'DELETE',
                    }).always((data)=> {
                        if (data) {
                            base.ajaxCallback(data);
                            return
                        }
                        if (this.items.length == 1 && busMonthlyTicketsOps.param.page > 1) {
                            busMonthlyTicketsOps.param.page--;
                        }
                        layer.msg('删除成功', {icon: 1, time: 1000});
                        this.getList();
                    })
                });
            }

        },
        components: {
            add
        },
        filters: {
            getBusLineNames: function (arr) {
                let str = '';
                arr.forEach((item) => {
                    str += item.shuttle_name + '、'
                })
                return str.slice(0, -1) || '--';
            }
        }
    }
</script>