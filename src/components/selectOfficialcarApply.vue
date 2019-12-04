<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">选择审批流程</div>
        <div class="layui-layer-content pd-20">
            <div class="cl">
                <div class="f-l">
                    <select name="" class="select-box f-l" v-model="searchType">
                        <option value="approv_name">流程名称</option>
                        <option value="department_name">部门</option>
                        <option value="real_name">员工姓名</option>
                    </select>
                    <input type="text" class="input-text f-l" v-model="searchContent">
                    <a class="btn btn-primary mr-5 f-l" href="javascript:;" v-on:click="getList(1)">查询</a>
                </div>
                <a class="btn btn-primary radius mr-5 f-r" href="javascript:;" v-on:click="save()">确认选择</a>
            </div>
            <div class="layui-layer-wrap">
                <table class="table table-border table-bordered table-hover table-bg table-sort row">
                    <thead>
                    <tr class="text-c">
                        <th width="25">选择</th>
                        <th width="70">流程名称</th>
                        <th width="100">生效范围</th>
                        <th width="100">流程顺序</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="text-c" v-for="item in items">
                        <td>
                            <input type="checkbox" :checked="item | checkItem"  class="radio-wh"   @click="clickCheckbox(item)">
                        </td>
                        <td>{{item.approv_name}}</td>
                        <td class="max-400">{{item | getRule}}</td>
                        <td class="max-400">{{item | getNode}}</td>
                    </tr>
                    </tbody>
                </table>
                <div id="J-page" class="m-page row" v-show="!noData"></div>
                <div class="no-data text-c mt-50 row" v-if="noData">没有相关数据</div>
            </div>
        </div>
        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
    </div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
    <div class="layui-layer-shade"></div>
</template>

<style lang="less" scoped>
    .avatar {
        width: 50px;
    }

    .radio-wh {
        width: 20px;
        height: 20px;
        cursor: pointer;
    }
    .layui-modify {
        top: 50px;
        z-index: 201;
    }
    .layui-layer-shade {
        z-index: 200;
    }
    .select-box{
        width:100px;
        height:31px;
        margin-right:-1px;
    }
    .input-text{
        width:150px;
    }
</style>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';

    let repairOps = null;

    export default{
        ready () {
            repairOps = {
                param: {
                    page: 1,
                    page_size: 10,
                    approv_type: 10, // 公务车流程
                }
            };
            base.verticalCenter('.layui-modify');
            this.getList();
            this.selectedApplyArr = [...this.data];

        },
        props: ["data"],
        data: function () {
            return {
                noData: false,
                items: [],
                selectedApplyArr:[],
                searchType:'approv_name',
                searchContent:"",
                itemsLoading:false,
            }
        },
        methods: {
            //初始化分页
            initPage: function (obj, tpageToal = '4', current = '1', count = '0') {
                $(obj).createPage({
                    pageCount: tpageToal,
                    current: current,
                    count: count,
                    callback: (p) => {
                        repairOps.param.page = p;
                        this.queryAjax();
                    }
                })
            },
            //获取列表
            getList: function (reset = 0) {
                //重置第一页
                if (reset) {
                    repairOps.param.page = 1;
                    repairOps.param["approv_name"] = "";
                    repairOps.param["department_name"] = "";
                    repairOps.param["real_name"] = "";
                    repairOps.param[this.searchType] = this.searchContent;
                }
                this.queryAjax((tpageToal = '4', count = '0') => {
                    this.initPage('#J-page', tpageToal, repairOps.param.page, count)
                })
            },
            queryAjax: function (callback = () => {}) {

                this.itemsLoading = true;
                $.ajax({
                    url: base.gAjaxUrl.procedure,
                    type: 'GET',
                    data: repairOps.param
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
            close: function () {
                this.$dispatch('dialog-close');
            },
            save: function () {
                // let admins = [];
                // this.items.forEach((item) => {
                //     if(item.bus_module) admins.push(item.id);
                // });
                // $.showLoading();
                // $.ajax({
                //     url: base.gAjaxUrl.busnoticemanager + 'bulk_create/',
                //     type: 'POST',
                //     contentType: 'application/json',
                //     data: JSON.stringify({
                //         module: 1,
                //         admins: admins
                //     })
                // }).always((data)=> {
                //     $.hideLoading();
                //     base.ajaxCallback(data, ()=> {
                //         this.$dispatch('dialog-close', true);
                //     });
                // })
                this.$dispatch("dialog-add",this.selectedApplyArr)
            },
            getName (arr, key) {
                let str = '';
                arr.forEach((item) => {
                    str += item[key] + '、';
                });
                return str.slice(0, -1) || '--';
            },
            clickCheckbox:function (value) {
                for (let i = 0,len = this.selectedApplyArr.length; i < len; i++) {
                    if(this.selectedApplyArr[i].id == value.id){
                        this.selectedApplyArr.splice(i,1);
                        return
                    }
                }
                this.selectedApplyArr.push(value);
            },
        },
        filters: {
            getRule (item) {
                let rule = item.approv_rule;
                if(!rule) {
                    return '--'
                }
                let str = '';
                let key = '';
                let arr = null;
                if(item.scope_type == 10) { // 10 表示员工; 20 表示部门
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
            getNode (item) {
                if(item.approv_nodes.length) {
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
            checkItem:function (value) {
                for (let i = 0,len = this.selectedApplyArr.length; i < len; i++) {
                    if(this.selectedApplyArr[i].id == value.id){
                        return true
                    }

                }
                return false;

            }
        },
    }
</script>
