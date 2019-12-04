<template>
    <!-- 添加 -->
    <add_procedure :type="type" :add_type="dialogAdd" :data="dialogData" v-if="isShowAdd"
                   v-on:dialog-close="closeAdd"></add_procedure>

    <section class="Hui-article-box">
        <div class="page-container bgc-f5 bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body">
                    <span class="f-20 fw-b">【{{type | getProcedureName}}】流程审批设置</span>
                </div>
            </div>
            <div class="bk-gray clearfix radius mt-10 bgc-fff">
                <div class="pd-15 clearfix">
                    <div class="clearfix pb-5">
                        <a class="btn btn-primary radius f-l" href="javascript:;" v-on:click="addProcedure()">添加流程</a>
                        <select v-model="searchType" id="sexInput" class="sexSearch select f-l ml-5">
                            <option value="approv_name">流程名称</option>
                            <option value="department_name">部门</option>
                            <option value="real_name">姓名</option>
                        </select>
                        <div class="text-l clearfix f-l mr-15">
                            <input id="searchInput"
                                   autocomplete="off"
                                   v-model="searchInput"
                                   type="text" placeholder="流程名称/部门/姓名"
                                   style="width:200px" class="input-text f-l">
                            <button v-on:click="getList(1)" class="f-l btn btn-success radius-r" type="button"><i
                                    class="f-r Hui-iconfont">&#xe665;</i></button>
                        </div>
                    </div>
                </div>
                <table class="table table-border table-bg table-bordered table-hover">
                    <thead class="text-c">
                    <tr>
                        <th width="100">流程名称</th>
                        <th width="400" class="max-400">生效范围</th>
                        <th width="400" class="max-400">流程顺序</th>
                        <th width="100">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="text-c" v-for="item in items">
                        <td>{{item.approv_name}}</td>
                        <td class="max-400">{{item | getRule}}</td>
                        <td class="max-400">{{item | getNode}}</td>
                        <td>
                            <a title="编辑" href="javascript:;" v-on:click="modifyProcedure(item)">
                                <i class="Hui-iconfont">&#xe6df;</i>
                            </a>
                            <a title="删除" href="javascript:;" class="ml-5" v-on:click="deleteProcedure(item)">
                                <i class="Hui-iconfont">&#xe6e2;</i>
                            </a>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div id="J-page" class="m-page" v-show="!noData"></div>
                <div class="text-c lh-60" v-if="noData">没有相关数据</div>
            </div>
            <div class="tip">
                <div class="f-14 lh-22">提示:</div>
                <div>1、如果没有审批流程，请先添加审批流程。</div>
                <div>2、如果一个部门或一个员工设置了多个流程，那么员工在提交审批时可以自行选择一个流程。</div>
            </div>
        </div>
        <div class="m-loading" v-if="itemsLoading">
            <div class="cube1"></div>
            <div class="cube2"></div>
        </div>
    </section>
</template>
<style lang="less" scoped rel="stylesheet/less">
    .sexSearch {
        width: 80px;
        height: 31px;
        line-height: 30px;
        margin-right: -1px;
        margin-left: 15px;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import add_procedure from './add_procedure.vue';

    let repairOps = null;

    export default {
        ready() {

            repairOps = {
                page: 1,
                page_size: 10,
                approv_type: this.type, // 公共区域报修
            };

            this.getList(1);
        },
        /**
         * type: 10-公务车;20-公共区域;30-入住申请;70-私家车
         * 40 - 车辆维修 --> 车辆维修的流程和这些不太一样，无法修改
         * */
        props: ['type'],
        data: function () {
            return {
                noData: false,
                itemsLoading: false,
                isShowAdd: false,
                dialogAdd: 'add',
                dialogData: null,
                searchInput: '',
                searchType: 'approv_name',
                items: [],
            }
        },
        events: {
            enterEvent () {
                this.getList(1);
            }
        },
        methods: {
            addProcedure: function () {
                this.dialogAdd = 'add';
                this.isShowAdd = true;
            },
            modifyProcedure: function (data) {
                this.dialogAdd = 'modify';
                this.dialogData = data;
                this.isShowAdd = true;
            },
            deleteProcedure: function (item) {
                layer.confirm(`确认删除【${item.approv_name}】流程？`, (index) => {
                    console.log("del-id: ", item.id);
                    layer.close(index);
                    this.itemsLoading = true;
                    $.ajax({
                        url: base.gAjaxUrl.procedure + item.id + '/',
                        type: 'DELETE',
                    }).always((data) => {
                        this.itemsLoading = false;
                        console.log(data)
                        if (!data) {
                            layer.msg("删除成功", {icon: 1, time: 1500});
                            if (repairOps.page > 1 && this.items.length == 1) {
                                repairOps.page--;
                            }
                            this.getList();
                        } else {
                            base.ajaxCallback(data);
                        }
                    });
                })
            },
            closeAdd: function (flag) {
                this.isShowAdd = false;
                if (flag) {
                    this.getList(1);
                }
            },
            //初始化分页
            initPage: function (obj, tpageToal = '4', current = '1', count = '0') {
                $(obj).createPage({
                    pageCount: tpageToal,
                    current: current,
                    count: count,
                    callback: (p) => {
                        repairOps.page = p;
                        this.queryAjax();
                    }
                })
            },
            //获取列表
            getList: function (reset = 0) {
                //重置第一页
                if (reset) {
                    repairOps.page = 1;
                    repairOps["approv_name"] = "";
                    repairOps["department_name"] = "";
                    repairOps["real_name"] = "";
                    repairOps[this.searchType] = $("#searchInput").val();
                }
                this.queryAjax((tpageToal = '4', count = '0') => {
                    this.initPage('#J-page', tpageToal, repairOps.page, count)
                })
            },
            queryAjax: function (callback = () => {
            }) {

                this.itemsLoading = true;
                $.ajax({
                    url: base.gAjaxUrl.procedure,
                    type: 'GET',
                    data: repairOps
                }).always((data) => {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, () => {
                        let resultData = data.results;
                        this.items = resultData;
                        if (resultData && resultData.length) {
                            this.noData = false;
                            //回调
                            callback(data.num_pages, data.count);
                        } else {
                            this.noData = true;
                        }
                    })
                })
            },
            getName(arr, key) {
                let str = '';
                arr.forEach((item) => {
                    str += item[key] + '、';
                });
                return str.slice(0, -1) || '--';
            },
        },
        filters: {
            getRule(item) {
                let rule = item.approv_rule;
                if (!rule) {
                    return '--'
                }
                let str = '';
                let key = '';
                let arr = null;
                if (item.scope_type == 10) { // 10 表示员工; 20 表示部门
                    arr = rule.staffs || [];
                    key = 'real_name';
                    str = '指定人员: ';
                } else {
                    arr = rule.departments || [];
                    key = 'department_name';
                    str = '指定部门: ';
                }
                return str + this.getName(arr, key);
            },
            getNode(item) {
                if (item.approv_nodes.length) {
                    let approve = item.approv_nodes;
                    let str = '';
                    approve.forEach((progress) => {
                        str += this.getName(progress.approvers, 'real_name') + ' → ';
                    });
                    return str.slice(0, -3) || '--';
                } else {
                    return '--'
                }
            },
            getProcedureName: function (type) {
                if (type == 10) {
                    return '公务车'
                } else if (type == 20) {
                    return '报修'
                } else if (type == 30) {
                    return '入住申请'
                } else if (type == 70) {
                    return '私家车'
                } else {
                    return '--'
                }
            }
        },
        components: {
            add_procedure,
        }
    }
</script>
