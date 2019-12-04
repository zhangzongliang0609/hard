<template>
    <section class="Hui-article-box">
        <div class="page-container">
            <div class="panel panel-default radius">
                <div class="panel-body clearfix">
                    <span class="f-20 fw-b f-l">搭乘审批</span>
                </div>
            </div>
            <div class="panel panel-default radius clearfix mt-10 mb-10">
                <div class="panel-body clearfix">
                    <div class="text-l clearfix lh-30">
                        <div class="f-l clearfix">
                            <select v-model="searchType" class="searchInputType select f-l"
                                    style="width: 85px;height: 31px;">
                                <option value="real_name">申请人</option>
                                <option value="phone">电话</option>
                                <option value="shuttle_name">搭乘线路</option>
                            </select>
                            <input id="searchInput" v-model="searchInput" autocomplete="off" type="text" placeholder="请输入内容"
                                   style="width:200px;margin-left: -1px;" class="f-l input-text">
                        </div>
                        <div class="clearfix f-l ml-20">
                            <span class="f-l">搭乘时间：</span>
                            <span class="f-l">
                                <input v-model="startDateInput" autocomplete="off" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-start-date" v-bind:value="startDateInput">
                            </span>
                            <span class="f-l">至：</span>
                            <span class="f-l">
                                <input v-model="endDateInput" autocomplete="off" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-end-date" v-bind:value="endDateInput">
                            </span>
                        </div>
                        <div class="clearfix f-l ml-20">
                            <div class="f-l">审核状态：</div>
                            <select v-model="approveType" class="searchInputType select f-l"
                                    style="width: 85px;height: 31px;">
                                <option value="">全部</option>
                                <option value="10">待审核</option>
                                <option value="20">审核通过</option>
                                <option value="-10">已驳回</option>
                            </select>
                            <button type="submit" class="btn btn-success radius f-l ml-15" v-on:click="getList(1)"><i class="Hui-iconfont">&#xe665;</i></button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="table_container">
                <div class="table_header mt-10">
                    <div class="text-l clearfix lh-30">
                        <div class="f-l pointer pl-20">
                            <input id="selAll" v-model="isAllSelected" type="checkbox" @click="selectAll"/>
                            <label for="selAll" class="ml-5">全选本页</label>
                        </div>
                        <div class="f-r clearfix">
                            <a href="javascript:;" class="btn btn-success radius" v-on:click="approveAll()">批量通过</a>
                        </div>
                    </div>
                </div>
                <table class="table table-border table-bordered table-hover table-bg mt-10">
                    <thead>
                    <tr class="text-c">
                        <th width="40">
                            <span>选择</span>
                        </th>
                        <th>申请人</th>
                        <th>部门/职位</th>
                        <th>电话</th>
                        <th>搭乘路线</th>
                        <th>搭乘时间</th>
                        <th>审核状态</th>
                        <th width="200">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="text-c pointer" v-for="item in items" @click="clickCheckbox(item)">
                        <td>
                            <div class="select_box" v-show="item.approval_status == 10 || item.approval_status == 30">
                                <input type="checkbox" :value="item.id" v-model="selectedOrderIds"/>
                            </div>
                        </td>
                        <td>{{item.staff.real_name || '--'}}</td>
                        <td>{{item.staff.department_vo.department_name || '--'}}/{{item.staff.position || '--'}}</td>
                        <td>{{item.staff.phone || '--'}}</td>
                        <td>{{item.shuttle_name || '--'}}</td>
                        <td>{{item.departure_datetime.slice(0, 16)}}</td>
                        <td>{{getStatusName(item)}}</td>
                        <td class="pointer" @click.stop>
                            <a v-show="item.approval_status == 10 || item.approval_status == 30" href="javascript:;" class="btn btn-link size-S radius" v-on:click="makeApprove(item, true)">审批通过</a>
                            <a v-show="item.approval_status == 10 || item.approval_status == 30" href="javascript:;" class="btn btn-link size-S radius" v-on:click="makeApprove(item, false)">驳回</a>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div id="J-page" class="m-page" v-show="!noData"></div>
            <div class="m-loading" v-if="itemsLoading">
                <div class="cube1"></div>
                <div class="cube2"></div>
            </div>

            <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
            <div v-if="isShowAdd" class="add-box">
                <div class="layui-layer-title">{{isAgree ? '审批通过' : '审批驳回'}}</div>
                <div class="layui-layer-content">
                    <div v-show="isMultipleSelected" class="pd-15 mt-15 cl">
                        通过全部所选的审批项目
                    </div>
                    <div v-show="!isMultipleSelected" class="mt-15 cl">

                        <label class="f-l col-3 lh-30 tr reason_label"><span v-show="!isAgree" class="c-red">*</span>{{isAgree ? '通过原因' : '驳回原因'}}：</label>
                        <div class="formControls f-l col-8 reason_box">
                            <input v-model="reason" autocomplete="off" type="text" class="input-text reason" value="" placeholder=""
                                   name="reason">
                        </div>
                    </div>
                </div>
                <div class="layui-layer-setwin">
                    <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;"
                       v-on:click="close()"></a>
                </div>
                <div class="layui-layer-btn">
                    <a class="layui-layer-btn0" href="javascript:;" @click="save">取消</a>
                </div>
                <div class="layui-layer-btn">
                    <a class="layui-layer-btn0" href="javascript:;" @click="save">确认</a>
                </div>
            </div>
            <div v-show="isShowAdd" class="layui-layer-shade"></div>
        </div>
    </section>
</template>

<style lang="less" scoped rel="stylesheet/less">
    #selAll {
        width: 20px;
        height: 20px;
        vertical-align: middle;
    }

    .searchInputType {
        background-color: #fff;
    }

    .select_box {
        position: relative;
        min-height: 24px;
        height: 100%;
        input {
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -12px;
            margin-left: -12px;
            width: 24px;
            height: 24px;
        }
    }

    .add-box {
        position: absolute;
        width: 400px;
        height: 160px;
        z-index: 110;
        left: 50%;
        top: 150px;
        background-color: #fff;
        transform: translateX(-50%) scale(1);
        -webkit-animation: modify 0.3s ease;
        animation: modify 0.3s ease;
        .layui-layer-btn {
            position: absolute;
            right: 15px;
            bottom: 15px;
            padding: 0;
        }
        .reason_label {
            padding: 0;
        }
        .reason_box {
            padding: 0;
            .reason {
                height: 100%;
                outline: none;
                resize: none;
            }
        }
    }
</style>


<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import moment from "moment";

    let pageOpts = null;

    export default{
        ready () {

//            approval_status -10: 驳回；10: 正在审批；20: 审批通过；30: 无需审批<后台保留状态>
            // 状态30是后台保留状态，前端遇到 无需审批 状态就默认审批通过

            pageOpts = {
                approval_status: 20,
                phone: '',
                shuttle_name: '',
                start_date: '',
                end_date: '',
                page: 1,
                page_size: 10,
            };
            this.startDateInput = moment().format('YYYY-MM-DD');
            this.endDateInput = moment().add('1', 'months').format('YYYY-MM-DD');

            new Kalendae.Input('J-end-date', {
                months: 2,
                clickHide: true
            });
            new Kalendae.Input('J-start-date', {
                months: 2,
                clickHide: true
            });

            this.getList(1);
        },
        data: function () {
            return {
                itemsLoading: true,
                items: [],
                noData: false,
                approveType: '10', // 默认: 待审核
                searchType: 'real_name', // real_name: 审批人；phone: 电话；shuttle_name: 线路名称
                searchInput: '',
                startDateInput: moment().format('YYYY-MM-DD'),
                endDateInput: moment().format('YYYY-MM-DD'),
                isMultipleSelected: false, // 是否开启多选
                selectedOrderIds: [], // 已经选择的的订单
                selectedOrderId: [], // 单独选择的订单id
                isAllSelected: false, // 是否全选本页
                isShowAdd: false, // 是否显示审批
                isAgree: false, // 是否审批通过
                reason: '', // 审批通过原因
            }
        },
        methods: {
            close () {
                this.isShowAdd = false;
            },
            save () {
                if (!this.isAgree && !this.reason) {
                    layer.msg('请输入原因', {icon: 2, time: 2000});
                    return
                }
                $.showLoading();
                $.ajax({
                    url: base.gAjaxUrl.busApprove,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        orders: this.isMultipleSelected ? this.selectedOrderIds : [this.selectedOrderId],
                        approval_status: this.isAgree ? 20 : -10,
                        reason: this.reason
                    })
                }).always((data) => {
                    $.hideLoading();
                    base.ajaxCallback(data, () => {
                        this.selectedOrderIds = [];
                        this.isShowAdd = false;
                        this.getList(1);
                    })
                })
            },
            checkFilter () {
                if (this.items.length === 0) {
                    this.isAllSelected = false;
                    return;
                }
                let flag = true;
                this.items.every(item => {
                    if (!this.selectedOrderIds.includes(item.id)) {
                        flag = false;
                        return false
                    }
                    return true
                });
                this.isAllSelected = flag;
            },
            // 本页全选的操作
            selectAll () {
                if (this.isAllSelected) {
                    this.items.forEach(item => {
                        let idx = this.selectedOrderIds.indexOf(item.id);
                        if (idx > -1) {
                            this.selectedOrderIds.splice(idx, 1);
                        }
                    });
                    this.isAllSelected = false;
                } else {
                    this.items.forEach(item => {
                        if (item.approval_status == 10 || item.approval_status == 30) {
                            if (!this.selectedOrderIds.includes(item.id)) this.selectedOrderIds.push(item.id)
                        }
                    });
                    this.isAllSelected = true;
                }
            },
            // 点击单选框
            clickCheckbox (item) {
                if (item.approval_status == 10 || item.approval_status == 30) {
                    let id = item.id;
                    let idx = this.selectedOrderIds.indexOf(id);
                    if (idx > -1) {
                        this.selectedOrderIds.splice(idx, 1);
                    } else {
                        this.selectedOrderIds.push(id);
                    }
                    this.checkFilter()
                }
            },
            // 批量通过
            approveAll () {
                if (this.selectedOrderIds.length) {
                    this.isMultipleSelected = true;
                    this.isAgree = true;
                    this.isShowAdd = true;
                } else {
                    layer.msg('请至少选择一项审批', {icon: 2, time: 2000})
                }
            },
            // 同批通过或者驳回
            makeApprove (data, isAgree) {
                this.isMultipleSelected = false;
                this.isAgree = isAgree;
                this.isShowAdd = true;
                this.selectedOrderId = data.id;
            },
            //初始化分页
            initPage: function (obj, tpageToal = '4', count = '0') {
                $(obj).createPage({
                    pageCount: tpageToal,
                    current: 1,
                    count: count,
                    callback: (p)=> {
                        pageOpts.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax: function (callback = () => {
            }) {
                this.itemsLoading = true;
                //修改参数
                $.ajax({
                    url: base.gAjaxUrl.busApproveList,
                    type: 'GET',
                    data: pageOpts
                }).always((data)=> {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=> {
                        let resultData = data.results;
                        this.items = resultData;
                        if (resultData.length) {
                            //回调
                            callback(data.num_pages, data.count);
                            this.noData = false;
                        } else {
                            this.noData = true;
                        }
                        this.checkFilter()
                    });
                })
            },
            //获取列表
            getList: function (reset) {

                if (moment(this.endDateInput).isBefore(this.startDateInput)) {
                    layer.msg("开始时间不能大于结束时间", {icon: 2, time: 1500});
                    return
                }
                if (reset) {
                    this.selectedOrderIds = [];
                    pageOpts.approval_status = this.approveType;
                    pageOpts.phone = '';
                    pageOpts.shuttle_name = '';
                    pageOpts.start_date = this.startDateInput;
                    pageOpts.end_date = this.endDateInput;
                    pageOpts.page = 1;
                    pageOpts[this.searchType] = this.searchInput;
                }
                //重置第一页
                this.queryAjax((tpageToal = '4', count = '0')=> {
                    this.initPage('#J-page', tpageToal, count)
                });
            },
            getStatusName (item) {
                if (item.approval_status == -10) {
                    return '驳回'
                }
                if (item.approval_status == 20) {
                    return '审核通过'
                } else {
                    return '待审核'
                }
            }


        },
        components: {}
    }
</script>
