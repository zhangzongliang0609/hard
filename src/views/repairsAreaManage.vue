<template>
    <ares v-if="isShowAddDialog" :title="dialogTitle" @dialog-close="addDialogClose()" @dialog-save="addDialogSave"
          :type="dialogType" :data="dialogData"></ares>
    <section class="Hui-article-box">
        <div class="page-container bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body f-20 fw-b">报修区域管理</div>
            </div>
            <div class="bk-gray radius mt-10 bgc-fff">
                <div class="pd-15 clearfix">
                    <span class="f-r">
                        <a class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="clickAdd()"><i
                                class="Hui-iconfont">&#xe600;</i>添加报修区域</a>
                    </span>
                    <div class="text-l clearfix f-l mr-15">
                        <input v-model="searchInput"
                               type="text"
                               placeholder="报修区域"
                               style="width:200px"
                               class="f-l input-text">
                        <button v-on:click="getList(1)" class="btn btn-success radius-r" type="button"><i
                                class="f-r Hui-iconfont">&#xe665;</i></button>
                    </div>

                </div>
                <div class="pl-20 clearfix">
                    <span class="f-l mt-2">统一设置：</span>
                    <div class="f-l cl ml-20">
                        <span class="f-l mt-2">是否需要审批</span>
                        <select v-model="allApprov" class="select-box f-l ml-5" name="">
                            <option value="0">请选择</option>
                            <option value="1">是</option>
                            <option value="2">否</option>
                        </select>
                        <div class="f-l relative message">
                            <span class="Hui-iconfont cursor-p query f-l ml-5">&#xe633;</span>
                            <span class="message-box">
                                        开启审批后，所有报修申请需要经过流程审批通过后才能派单；关闭则无需审批，申请后可直接派单
                                </span>
                        </div>
                    </div>
                    <div class="f-l cl ml-20">
                        <span class="f-l mt-2">是否需要自动派单</span>
                        <select v-model="allAutoSend" class="select-box f-l ml-5" name="">
                            <option value="0">请选择</option>
                            <option value="1">是</option>
                            <option value="2">否</option>
                        </select>
                        <div class="f-l relative message">
                            <span class="Hui-iconfont cursor-p query f-l ml-5">&#xe633;</span>
                            <span class="message-box">
                                        开启自动派单后，系统会按照预设的报修区域维修工，自动给对应区域里订单最少的维修工进行派单；关闭自动派单，则需要管理员在PC端手动派单
                                </span>
                        </div>
                    </div>

                    <div class="f-l cl ml-20">
                        <span class="f-l mt-2">是否需要支付</span>
                        <select v-model="allPay" class="select-box f-l ml-5" name="">
                            <option value="0">请选择</option>
                            <option value="1">是</option>
                            <option value="2">否</option>
                        </select>
                        <div class="f-l relative message">
                            <span class="Hui-iconfont cursor-p query f-l ml-5">&#xe633;</span>
                            <span class="message-box">
                                       开启支付后，员工需要支付报价大于0元的维修单；关闭支付后，员工无法看到维修单金额，也无需支付
                                </span>
                        </div>
                    </div>

                    <div class="f-l cl ml-20">
                        <span class="f-l mt-2">是否需要审价</span>
                        <select v-model="allApprovPrice" class="select-box f-l ml-5" name="">
                            <option value="0">请选择</option>
                            <option value="1">是</option>
                            <option value="2">否</option>
                        </select>
                        <div class="f-l relative message">
                            <span class="Hui-iconfont cursor-p query f-l ml-5">&#xe633;</span>
                            <span class="message-box">
                                        开启审价后，当维修工报价后，维修单金额大于0元时，需要经过管理员审核价格；关闭审价则无需管理员审核。
                                </span>
                        </div>
                    </div>

                    <div class="f-l cl ml-20">
                        <span class="f-l mt-2">是否需要验收</span>
                        <select v-model="allAcceptance" class="select-box f-l ml-5" name="">
                            <option value="0">请选择</option>
                            <option value="1">是</option>
                            <option value="2">否</option>
                        </select>
                        <div class="f-l relative message">
                            <span class="Hui-iconfont cursor-p query f-l ml-5">&#xe633;</span>
                            <span class="message-box">
                                        开启验收后，所有报修需要经过管理员验收后才能维修完成；关闭则无需验收
                                </span>
                        </div>
                    </div>

                    <span class="f-l ml-20">
                        <a class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="allChangeCheck()">保存</a>
                    </span>
                </div>
                <table class="table table-border table-bg table-striped mt-10">
                    <thead class="text-c">
                    <tr>
                        <th>报修区域</th>
                        <th>维修工</th>
                        <th>是否需要审批</th>
                        <th>是否需要自动派单</th>
                        <th>是否需要支付</th>
                        <th>是否需要审价</th>
                        <th>是否需要验收</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="text-c" v-for="item in items">
                        <td>{{item.area_name}}</td>
                        <td>
                            <div class="text-overflow">
                                <span v-for="(i,staff) in item.repairmans">
                                    {{staff.staff_vo ? staff.staff_vo.real_name : '--' }} <span
                                        v-if="i != item.repairmans.length - 1">/</span>
                                </span>
                                <span v-if="item.repairmans.length == 0">
                                    --
                                </span>
                            </div>
                        </td>
                        <td>
                            <span class="open-box" :class="{'bc-blue':item.need_approval}"
                                  @click="changeCheck(item,'need_approval')">
                                <span class="open-box-round"
                                      :class="item.need_approval?'open-box-open':'open-box-close'"></span>
                            </span>
                        </td>
                        <td>
                            <span class="open-box" :class="{'bc-blue':item.need_autosend}"
                                  @click="changeCheck(item,'need_autosend')">
                                <span class="open-box-round"
                                      :class="item.need_autosend?'open-box-open':'open-box-close'"></span>
                            </span>
                        </td>
                        <td>
                            <span class="open-box" :class="{'bc-blue':item.need_pay}"
                                  @click="changeCheck(item,'need_pay')">
                                <span class="open-box-round"
                                      :class="item.need_pay?'open-box-open':'open-box-close'"></span>
                            </span>
                        </td>
                        <td>
                            <span class="open-box" :class="{'bc-blue':item.need_examine_price}"
                                  @click="changeCheck(item,'need_examine_price')">
                                <span class="open-box-round"
                                      :class="item.need_examine_price?'open-box-open':'open-box-close'"></span>
                            </span>
                        </td>
                        <td>
                            <span class="open-box" :class="{'bc-blue':item.need_check}"
                                  @click="changeCheck(item,'need_check')">
                                <span class="open-box-round"
                                      :class="item.need_check?'open-box-open':'open-box-close'"></span>
                            </span>
                        </td>
                        <td>
                            <a title="编辑" href="javascript:;" v-on:click="clickModify(item)"><i class="Hui-iconfont">
                                &#xe6df;</i></a>
                            <a title="删除" href="javascript:;" class="ml-5" v-on:click="deleteFault(item.id)"><i
                                    class="Hui-iconfont">&#xe6e2;</i></a>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div id="J-page" class="m-page" v-show="!noData"></div>
                <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
            </div>
        </div>
    </section>
</template>

<style lang="less" scoped>
    .query {
        font-size: 20px;
        margin-top: -4px;
        color: black;
        /*color:white;*/
        /*background-color: black;*/
    }

    .bgc-f5 {
        background-color: #f5f5f5;
    }

    .fw-b {
        font-weight: bold;
    }

    .icon-hover > .message-box {
        display: block;
    }

    .message-box {
        display: none;
        color: white;
        position: absolute;
        left: -69px;
        top: 30px;
        padding: 10px;
        width: 140px;
        /*height: 100px;*/
        background: #088cb7;
        -moz-border-radius: 12px;
        -webkit-border-radius: 12px;
        border-radius: 12px;
        z-index: 999;
    }

    .message-box:before {
        position: absolute;
        content: "";
        width: 0;
        height: 0;
        right: 32%;
        top: -20px;
        border-top: 13px solid transparent;
        border-right: 26px solid transparent;
        border-left: 26px solid transparent;
        border-bottom: 13px solid #088cb7;
    }

    .select-box {
        width: 80px;
    }

    .mt-2 {
        margin-top: 2px;
    }
</style>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import ares from '../components/addRepairsArea'

    let repairOps = null;

    export default {
        ready() {

            repairOps = {
                page: 1,
                page_size: 10,
            };
            $('.message').hover(function () {
                $(this).addClass('icon-hover')
            }, function () {
                $(this).removeClass('icon-hover')
            });
            this.getList(1);
        },
        data: function () {
            return {
                noData: false,
                isShowAddDialog: false,
                isShowImportDialog: false,
                items: [],
                searchInput: '',
                dialogTitle: '添加报修类型',
                dialogType: 'add',
                dialogData: '',
                allApprov: 0,
                allPay: 0,
                allAutoSend: 0,
                allApprovPrice: 0,
                allAcceptance: 0,
            }
        },
        events: {
            enterEvent () {
                this.getList(1);
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
                this.dialogType = 'add';
                this.dialogTitle = '添加报修区域';
                this.isShowAddDialog = true;
            },
            clickModify: function (data) {
                this.dialogTitle = '修改报修区域';
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
                        repairOps.page = p;
                        this.queryAjax();
                    }
                });
            },
            //获取报修类型列表
            getList: function (reset = 0) {
                //重置第一页
                if (reset) {
                    repairOps.page = 1;
                    repairOps.area_name = this.searchInput;
                }
                this.queryAjax((tpageToal = '4', count = '0') => {
                    this.initPage('#J-page', tpageToal, repairOps.page, count)
                });
            },
            queryAjax: function (callback = function () {
            }) {
                //修改参数
                $.showLoading();
                $.ajax({
                    url: base.gAjaxUrl.repairsArea,
                    type: 'GET',
                    data: repairOps
                }).always((data) => {
                    $.hideLoading();
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
                    });
                })
            },
            //删除报修类型
            deleteFault: function (id) {

                layer.confirm('删除须谨慎，确认要删除吗？', (index) => {
                    $.showLoading();
                    $.ajax({
                        url: `${base.gAjaxUrl.repairsArea}${id}/`,
                        type: 'DELETE',
                    }).always((data) => {
                        $.hideLoading();
                        if (data) {
                            base.ajaxCallback(data)
                        } else {
                            layer.msg('删除成功', {icon: 1, time: 1000});
                            if (this.items.length === 1 && repairOps.page > 1) {
                                repairOps.page--;
                            }
                            this.getList();
                        }
                    })
                });
            },
            changeCheck: function (item, type) {
                let str = '';
                switch (type) {
                    case 'need_approval': {
                        str = '审批';
                        break
                    }
                    case 'need_autosend': {
                        str = '自动派单';
                        break
                    }
                    case 'need_pay': {
                        str = '支付';
                        break
                    }
                    case 'need_examine_price': {
                        str = '审价';
                        break
                    }
                    case 'need_check': {
                        str = '验收';
                        break
                    }
                }
                let content = `确认${item[type] ? '关闭' : '打开'}【${item.area_name}】的【${str}】功能吗?`;

                if(type === 'need_autosend' && !(item.repairmans && item.repairmans.length)) {
                    content = "你的【" + item.area_name + "】区域未分配维修工，确定要开启自动派单？";
                }
                layer.confirm(content, (index) => {
                    $.showLoading();
                    let data = {};
                    data[type] = !item[type];
                    $.ajax({
                        url: `${base.gAjaxUrl.repairsArea}${item.id}/single_set/`,
                        type: 'PUT',
                        contentType: "application/json",
                        data: JSON.stringify(data),
                    }).always((data) => {
                        $.hideLoading();
                        base.ajaxCallback(data, () => {
                            this.getList();
                        });
                        layer.close(index);
                    });
                });
            },
            allChangeCheck: function () {
                layer.confirm(`确认保存设置吗?`, (index) => {
                    $.showLoading();
                    let data = {};
                    if (this.allApprov) {
                        data.need_approval = this.allApprov == 1;
                    }
                    if (this.allAutoSend) {
                        data.need_autosend = this.allAutoSend == 1;
                    }
                    if (this.allPay) {
                        data.need_pay = this.allPay == 1;
                    }
                    if (this.allApprovPrice) {
                        data.need_examine_price = this.allApprovPrice == 1;
                    }
                    if (this.allAcceptance) {
                        data.need_check = this.allAcceptance == 1;
                    }
                    $.ajax({
                        url: `${base.gAjaxUrl.repairsArea}bulk_set/`,
                        type: 'PUT',
                        contentType: "application/json",
                        data: JSON.stringify(data),
                    }).always((data) => {
                        this.allApprov = 0;
                        this.allAutoSend = 0;
                        this.allPay = 0;
                        this.allApprovPrice = 0;
                        this.allAcceptance = 0;
                        $.hideLoading();
                        base.ajaxCallback(data, () => {
                            this.getList();
                        });
                        layer.close(index);
                    });
                })

            }
        },
        components: {
            ares
        }
    }
</script>
