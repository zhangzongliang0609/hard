<template>

    <!--留言回复和留言详情-->
    <answering v-if="showNewAdd" :data="dialogData" :type="dialogType" :title="dialogTitle"
               @dialog-close="closeNewAdd" @dialog-save="newAddSave" @modify-save="newAddSave"></answering>

    <section class="Hui-article-box">
        <div class="page-container">
            <div class="panel panel-default radius">
                <div class="panel-body">
                    <span class="f-20 fw-b">留言信息管理</span>
                </div>
            </div>
            <div class="text-l mt-10 mt-10 mb-10 pt-10 pb-10 clearfix">
                <div class="f-l">
                    <select v-model="searchType" id="sexInput" class="sexSearch  f-l ">
                        <option value="staff_name">留言者</option>
                        <option value="department">部门</option>
                        <option value="phone">电话</option>
                        <option value="job_number">工号</option>
                    </select>
                    <div class="text-l clearfix f-l">
                        <input v-model="searchInput" type="text" placeholder="请输入..." style="width:150px"
                               class="input-text">
                    </div>
                </div>
                <div class="f-l ml-15">
                    <span class="lh-30">互动平台：</span>
                    <select class="select-box w-110" v-model="searchPara.terrace_name">
                        <option value="">全部</option>
                        <option :value="i" v-for="i in option.terrace">{{i}}</option>
                    </select>
                </div>
                <div class="f-l ml-15">
                    <span class="lh-30">状态：</span>
                    <select class="select-box w-110" v-model="searchPara.status">
                        <option value="">全部</option>
                        <option value="10">已处理</option>
                        <option value="-10">未处理</option>
                    </select>
                </div>
                <div class="clearfix f-l ml-15 lh-30">
                    <div class="f-l">留言时间：</div>
                    <input v-model="searchPara.startDate"
                           v-el:start_date
                           type="text"
                           placeholder="开始时间"
                           class="f-l input-text ml-5 w-100 tc" />
                    <div class="f-l ml-5">至</div>
                    <input v-model="searchPara.endDate"
                           v-el:end_date
                           type="text"
                           placeholder="结束时间"
                           class="f-l input-text ml-5 w-100 tc" />
                </div>
                <button @click="getList(1)" class="btn btn-success search-btn radius ml-15" type="button">
                    <i class="Hui-iconfont">&#xe665;</i></button>
            </div>
            <table class="table table-border table-bordered table-hover table-bg table-sort">
                <thead>
                <tr class="text-c">
                    <th width="100">留言者</th>
                    <th width="100">部门</th>
                    <th width="80">联系电话</th>
                    <th width="80">工号</th>
                    <th width="150">互动平台</th>
                    <th>留言内容</th>
                    <th width="120">留言时间</th>
                    <th width="60">状态</th>
                    <th width="150">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr class="text-c" v-for="item in items">
                    <td>{{item.staff_name}}</td>
                    <td>{{item.department}}</td>
                    <td>{{item.phone}}</td>
                    <td>{{item.job_number}}</td>
                    <td>{{item.terrace_name}}</td>
                    <td class="max-150">{{item.backmessage}}</td>
                    <td>{{item.ctime}}</td>
                    <td>{{item.status==10?'已处理':'未处理'}}</td>
                    <td>
                        <span title="回复" @click="clickReply(item,1)" class="btn-text fc-0099fa">回复</span>
                        <span title="查看详情" @click="clickReply(item,2)" class="btn-text fc-999 ml-5">查看详情</span>
                        <span title="处理" @click="disposeBtn(item)" v-show="item.status !=10"
                              class="btn-text fc-ffab10 ml-5">处理</span>
                    </td>
                </tr>
                </tbody>
            </table>
            <div id="J-page" class="m-page" v-show="!noData"></div>
            <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
        </div>
    </section>
</template>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import moment from 'moment';
    import answering from "./components/answering.vue";

    let staffsOps = null;
    let dateScope = null;
    export default {
        ready() {

            let that = this;
            staffsOps = {
                param: {
                    page: 1,
                    page_size: 10,
                }
            };

            this.searchPara.startDate = moment().add(-1, 'month').format('YYYY-MM-DD');
            this.searchPara.endDate = moment().format('YYYY-MM-DD');
            new Kalendae.Input(this.$els.start_date, {  months: 2,
                clickHide: true,});
            new Kalendae.Input(this.$els.end_date, {  months: 2,
                clickHide: true,});

            this.queryAjax((tpageToal = '4', count = '0') => {
                this.initPage('#J-page', tpageToal, count)
            });
            this.getOption();
        },
        data: function () {
            return {
                noData: true,
                isShowAddDialog: false,
                isShowImportDialog: false,
                items: [],
                dialogTitle: '添加部门',
                dialogType: 'add',
                dialogData: '',
                showNewAdd: false,

                searchType: 'staff_name', //默认选项
                searchInput: '',
                searchPara: {
                    status: '',
                    terrace_name: '',
                    startDate: '',
                    endDate: '',
                },
                option: {
                    terrace: [],
                },
            }
        },
        methods: {
            clickReply: function (data, type) {
                if (type === 1) {
                    this.dialogTitle = '回复留言';
                    this.dialogType = 'reply';
                } else if (type === 2) {
                    this.dialogTitle = '对话详情';
                    this.dialogType = 'details';
                }
                this.dialogData = data;
                this.showNewAdd = true;
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
                if(moment(this.searchPara.endDate).isBefore(moment(this.searchPara.startDate))) {
                    layer.msg("结束时间不得早于开始时间", {icon:2, time: 1500});
                    return;
                }
                //修改参数
                let data = {
                    status: this.searchPara.status,
                    terrace_name: this.searchPara.terrace_name,
                    start_date: this.searchPara.startDate,
                    end_date:  this.searchPara.endDate
                };
                data[this.searchType] = this.searchInput;
                let newData = Object.assign({}, staffsOps.param, data);
                 $.showLoading();
                 $.ajax({
                     url: base.gAjaxUrl.adminfeedback,
                     type: 'GET',
                     data: newData
                 })
                     .always((data) => {
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
            //获取列表
            getList: function (reset) {
                let that = this;
                //重置第一页
                if (reset) {
                    // this.searchInput = $("#searchInput").val();
                    staffsOps.param.page = 1;
                }
                this.queryAjax((tpageToal = '4', count = '0') => {
                    that.initPage('#J-page', tpageToal, count)
                });
            },
            //处理
            disposeBtn: function (id) {
                let that = this;
                layer.confirm('确定更改为已处理状态吗？', (index) => {
                    if ($('tbody tr.text-c').length == 1 && staffsOps.param.page > 1) {
                        staffsOps.param.page--;
                    }
                     $.ajax({
                         url: `${base.gAjaxUrl.adminfeedback}${id.staff_id}/`,
                         type: 'PATCH',
                         data:{
                             terrace:id.terrace,
                         },
                     })
                         .always((data) => {
                             layer.msg('处理成功', {icon: 1, time: 1000});
                             that.getList();
                         })
                });
            },

            clickNewAdd: function () {
                this.showNewAdd = true;
                this.dialogType = 'add';
                this.dialogTitle = '新增司机';
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
            getOption: function () {
                $.ajax({
                    url: base.gAjaxUrl.search_terrace,
                    type: 'GET',
                })
                    .always((data) => {
                        base.ajaxCallback(data, () => {
                            this.option.terrace = data;
                        });
                    })
            },
        },
        components: {
            answering
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
