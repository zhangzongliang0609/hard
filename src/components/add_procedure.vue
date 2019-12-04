<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify f-14">
        <div class="layui-layer-title">{{add_type == 'add' ? '新增' : '修改' }}【{{approveItems[type].name}}】审批流程</div>
        <div class="layui-layer-content">
            <div class="procedure_name mt-20">
                <div class="clearfix">
                    <span class="f-l lh-30 f-20 b-l pl-10">流程名称:</span>
                    <div class="f-l ml-5" style="width: 200px">
                        <input class="procedureName input-text" name="procedureName" v-model="procedureName"
                               type="text"/>
                    </div>
                </div>
                <div class="tip f-12 lh-20 mt-10 clearfix fc-999">
                    <div class="f-l f-14 lh-22 clearfix pl-15">提示:</div>
                    <div class="f-l ml-5">
                        <div>1、如果为一个员工指定了流程并且同时为其所在的部门指定了流程，则以员工指定流程优先。</div>
                        <div>2、审批步骤中如果选择多人审批，则需要每个人都审批同意后，才能进入下一步</div>
                        <div>3、审批步骤中如果选择单人审批，则只需要一个人审批通过，即可进入下一步</div>
                    </div>
                </div>
            </div>
            <!-- 生效范围 -->
            <div class="procedure_range mt-15 lh-30">
                <div class="range_title clearfix">
                    <span class="f-l f-20 b-l pl-10">生效范围</span>
                    <a class="f-l ml-15 btn btn-primary radius" href="javascript:;" v-on:click="addRange()">添加</a>
                </div>
                <div class="range_content clearfix row  pl-15">
                    <div class="selected_type f-l col-2">
                        <div @click="scope_type = 20" class="select_btn"
                             :class="{'selected' : scope_type == 20}">指定部门
                        </div>
                        <div @click="scope_type = 10" class="select_btn"
                             :class="{'selected' : scope_type == 10}">指定人员
                        </div>
                    </div>
                    <div v-show="scope_type == 20" class="selected_content f-l clearfix col-10">
                        <div v-for="item in departments" class="select_item f-l" track-by="$index">
                            <span>{{item.department_name}}</span>
                            <span @click="deleteItem(item, $index, 'departments')" class="delete_btn c-fff"><i
                                    class="Hui-iconfont">&#xe60b;</i></span>
                        </div>
                    </div>
                    <div v-show="scope_type == 10" class="selected_content f-l clearfix col-10">
                        <div v-for="item in staffs" class="select_item f-l">
                            <span>{{item.real_name}}</span>
                            <span @click="deleteItem(item, $index, 'staffs')" class="delete_btn c-fff"><i
                                    class="Hui-iconfont">&#xe60b;</i></span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 流程顺序 -->
            <div class="procedure_order mt-15 lh-30">
                <div class="order_title clearfix">
                    <span class="f-l f-20 b-l pl-10">流程顺序</span>
                </div>
                <div class="order_container">
                    <table class="table table-border table-bg table-bordered table-hover">
                        <thead class="text-c">
                        <tr>
                            <th width="50">序号</th>
                            <th width="400">审批人</th>
                            <th style="width: 120px;">
                                <span>是否需全部通过</span>
                                <span class="set_condition">
                                    <span class="abstract fs-12" style="font-weight: normal;">
                                        默认审批步骤中所有人审批通过，才会进入下一审批步骤。
                                        关闭后，该步骤中有一个审批人审批通过既可进入下一审批步骤。
                                    </span>
                                    <i class="Hui-iconfont fs-16 fc-ef3e40">&#xe6e0;</i>
                                </span>
                            </th>
                            <th width="100">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr class="text-c" v-for="(i, order) in orders" track-by="$index">
                            <td>{{i + 1}}</td>
                            <td>
                                <div class="approve_box">
                                    <span v-if="order.approvers.length" v-for="(index, item) in order.approvers"
                                          class="f-l ml-10 mt-5 approve_staff">
                                        {{item.real_name || '--'}}
                                        <span @click="deleteApprove(i, index)" class="approve_delete">
                                            <i class="Hui-iconfont">&#xe60b;</i>
                                        </span>
                                    </span>
                                    <a @click="addApprove(i)" href="javascript:;"
                                       class="f-l ml-10 mt-5 btn_add_approve">添加</a>
                                </div>
                            </td>
                            <td>
                                <span @click="order.condition = order.condition == 1 ? 0 : 1"
                                      class="btn_set_condition outer" :class="{'_close': order.condition == 0}">
                                    <span class="inner"></span>
                                </span>
                            </td>
                            <td>
                                <a v-if="$index != 0" title="顺序上移" href="javascript:;" class="ml-5"
                                   v-on:click="upProcedure(order, $index)">
                                    <i class="Hui-iconfont">&#xe679;</i>
                                </a>
                                <a v-if="$index != orders.length - 1" title="顺序下移" href="javascript:;" class="ml-10"
                                   v-on:click="downProcedure(order, $index)">
                                    <i class="Hui-iconfont">&#xe674;</i>
                                </a>
                                <a title="删除" href="javascript:;" class="ml-10"
                                   v-on:click="deleteProcedure($index)">
                                    <i class="Hui-iconfont">&#xe6e2;</i>
                                </a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <a title="添加流程" href="javascript:;" class="btn btn-default btn_add mt-10" v-on:click="addProcedure">添加流程</a>
                </div>
            </div>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;"
               v-on:click="close()"></a>
        </span>
        <div class="layui-layer-btn" v-on:click="save"><a class="layui-layer-btn0">保存</a></div>
    </div>
    <!-- 选择部门 -->
    <sel :departs="departments" :is_single="isDepartmentSingleSelect" v-if="isShowSelectDepartment"
         v-on:sel-close="departmentClose" v-on:sel-save="departmentSave"></sel>
    <sel_staff :list="staffs" :is_single="isStaffSingleSelect" v-if="isShowSelectStaff" v-on:sel-close="staffClose"
               v-on:sel-save="staffSave"></sel_staff>
    <sel_staff :list="approves" :is_single="isApproveSingleSelect" v-if="isShowSelectApprove"
               v-on:sel-close="approveClose" v-on:sel-save="approveSave"></sel_staff>
    <div class="layui-layer-shade"></div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>

<style lang="less" scoped rel="stylesheet/less">
    .layui-layer.layui-layer-page .layui-layer-content {
        min-height: 350px;
        max-height: 400px;
        overflow: auto;
        padding: 0 20px 60px;
    }

    .b-l {
        box-sizing: border-box;
        border-left: 5px solid #ccc;
    }

    .pl-15 {
        padding-left: 15px;
    }

    .range_content {
        box-sizing: border-box;
        height: 120px;
        .selected_type {
            .select_btn {
                margin-right: auto;
                margin-left: auto;
                width: 80px;
                height: 32px;
                line-height: 30px;
                box-sizing: border-box;
                border-radius: 3px;
                border: 1px solid #5a98de;
                text-align: center;
                color: #5a98de;
                margin-top: 18px;
                cursor: pointer;
                &.selected {
                    background-color: #5a98de;
                    color: #fff;
                }
            }
        }
        .selected_content {
            border-radius: 4px;
            border: 1px solid #ccc;
            box-sizing: border-box;
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 10px 15px 15px;
            .select_item {
                padding: 0 38px 0 8px;
                line-height: 30px;
                background-color: #5a98de;
                color: #fff;
                margin-top: 5px;
                margin-left: 5px;
                border-radius: 3px;
                position: relative;
                .delete_btn {
                    cursor: pointer;
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 30px;
                    height: 30px;
                    text-align: center;
                    font-size: 20px;
                    line-height: 25px;
                    vertical-align: middle;
                }
            }
        }
    }

    .procedure_order {
        .order_container {
            box-sizing: border-box;
            .btn_add {
                width: 100%;
                height: 40px;
                line-height: 38px;
                font-size: 20px;
                padding: 0;
                border-radius: 5px;
            }
        }
        .table {
            border: 1px solid #ddd;
            .btn_add_approve {
                font-size: 14px;
                line-height: 20px;
                height: 20px;
                padding: 3px 10px;
                border-radius: 4px;
                background-color: #5a98de;
                color: #fff;
                text-decoration: none;
                &:hover {
                    background-color: #06c;
                }
            }
            .approve_box {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-wrap: wrap;
                .approve_staff {
                    padding: 4px 33px 4px 8px;
                    font-size: 14px;
                    line-height: 18px;
                    background-color: #aaa;
                    color: #fff;
                    position: relative;
                    border-radius: 3px;
                    flex-grow: 0;
                    flex-shrink: 0;
                    .approve_delete {
                        width: 20px;
                        height: 20px;
                        font-size: 16px;
                        line-height: 16px;
                        text-align: center;
                        position: absolute;
                        right: 5px;
                        top: 4px;
                        cursor: pointer;
                    }
                }
            }
            .set_condition {
                position: relative;
                &:hover .abstract {
                    display: block;
                }
                .abstract {
                    position: absolute;
                    width: 120px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    background-color: #fafafa;
                    line-height: 20px;
                    right: 0;
                    top: -10px;
                    padding: 5px 10px;
                    text-align: left;
                    transform: translate(50%, -100%);
                    z-index: 1;
                    display: none;
                }
            }
            .btn_set_condition.outer {
                display: block;
                margin-left: auto;
                margin-right: auto;
                width: 50px;
                height: 26px;
                border-radius: 15px;
                background-color: #5a98de;
                box-shadow: 0 0 0 1px inset #ddd;
                cursor: pointer;
                &._close {
                    background-color: rgba(42, 128, 255, 0.2);
                    .inner {
                        transform: translate(0, 0);
                    }
                }
                .inner {
                    display: block;
                    width: 26px;
                    height: 26px;
                    background-color: #fff;
                    border-radius: 50%;
                    box-shadow: 0 0 0 1px inset #ddd;
                    transform: translate(100%, 0);
                    transition: all 0.2s ease;
                }
            }
        }
    }
</style>


<script type="text/ecmascript-6">

    import * as base from '../assets/js/base.js';
    import sel from './selectDepartment.vue';
    import sel_staff from './selectStaff.vue';

    export default{
        ready () {
            this.ajaxUrl = base.gAjaxUrl.procedure;
            if (this.add_type == 'add') {
                this.ajaxType = "POST"
            } else {
                this.ajaxUrl += this.data.id + '/';
                this.ajaxType = "PUT";
                this.initModifyData();
            }
        },
        /**
         * type: 10-公务车;20-公共区域;30-入住申请;40-车辆维修
         * is_add: 新增还是删除
         * data: 审批流程数据
         * */
        props: ['type', 'add_type', 'data'],
        data: function () {
            return {
                ajaxUrl: '',
                ajaxType: '',
                procedureName: '', // 流程名称
                itemsLoading: false, // 流程名称
                scope_type: 20, // 生效范围的类型: 20 表示部门; 10 表示员工
                isShowSelectDepartment: false, // 展示添加部门
                isDepartmentSingleSelect: false, // 是否为单选
                departments: [], // 需要添加的部门集合
                isShowSelectStaff: false, // 展示添加员工
                isStaffSingleSelect: false, // 是否为单选
                isShowSelectApprove: false, // 展示添加审批人
                isApproveSingleSelect: false, // 是否为单选
                staffs: [], // 需要添加的员工集合
                approves: [], // 审批人集合，编辑单个步骤的审批人时会用到
                orderIndex: 0, // 处理的流程索引
                orders: [], // 流程审批顺序
                approveItems: {
                    10: { // 公务车
                        name: "公务车"
                    },
                    20: { // 报修
                        name: "报修"
                    },
                    30: { // 入住申请
                        name: "入住申请"
                    },
                    70: { // 入住申请
                        name: "私家车"
                    }
                }
            }
        },
        methods: {
            initModifyData () {
                this.scope_type = this.data.scope_type;
                this.orders = this.data.approv_nodes;
                this.procedureName = this.data.approv_name;
                if (this.scope_type == 10) {
                    this.staffs = this.data.approv_rule.staffs;
                } else {
                    this.departments = this.data.approv_rule.departments;
                }
            },
            // 流程上移一步
            upProcedure (item, index) {
                console.log('upProcedure', item);
                if (index == 0) return;
                this.orders.splice(index, 1);
                this.orders.splice(index - 1, 0, item);
            },
            // 流程下移一步
            downProcedure (item, index) {
                console.log('downProcedure', item);
                if (index == this.orders.length - 1) return;
                this.orders.splice(index, 1);
                this.orders.splice(index + 1, 0, item);
            },
            // 添加流程
            addProcedure () {
                this.orders.push({
                    approvers: [],
                    condition: 1 // 审批通过条件: 0 单人审批; 1 多人审批; 默认传值 1
                });
            },
            // 删除流程
            deleteProcedure (index) {
                console.log('deleteProcedure');
                layer.confirm(`确认删除该审批步骤？`, (i) => {
                    this.orders.splice(index, 1);
                    layer.close(i);
                })
            },
            deleteItem (item, index, typeName) {
                console.log("deleteItem: ", typeName);
                this[typeName].splice(index, 1);
            },
            // 部门/员工 选择部分
            addRange () {
                if (this.scope_type == 20) {
                    console.log('添加部门');
                    this.isDepartmentSingleSelect = false;
                    this.isShowSelectDepartment = true;
                } else {
                    console.log('添加员工');
                    this.isStaffSingleSelect = false;
                    this.isShowSelectStaff = true;
                }
            },
            departmentSave (data) {
                this.isShowSelectDepartment = false;
                this.departments = data || [];
            },
            departmentClose () {
                this.isShowSelectDepartment = false;
            },
            staffSave (data) {
                this.staffs = data || [];
                this.isShowSelectStaff = false;
            },
            staffClose () {
                this.isShowSelectStaff = false;
            },
            // 添加审批人
            addApprove (index) {
                console.log("addApprove: ", index);
                this.orderIndex = index;
                this.approves = this.orders[index].approvers || [];
                this.isApproveSingleSelect = false;
                this.isShowSelectApprove = true;
            },
            approveSave (data) {
                data = data || [];
                this.orders[this.orderIndex].approvers = data;
                this.isShowSelectApprove = false;
            },
            approveClose () {
                this.isShowSelectApprove = false;
            },
            deleteApprove (i, index) {
                console.log("deleteApprove: ", i, index);
                this.orders[i].approvers.splice(index, 1);
            },
            // 保存一个流程
            saveProcedure () {
                if (!this.procedureName) {
                    layer.msg('请设置流程名称', {icon: 2, time: 1500});
                    $(".procedureName").trigger('focus');
                    return;
                }
                let range = this.getRange();
                if (!range.length) {
                    layer.msg('请设置生效范围', {icon: 2, time: 1500});
                    return;
                }
                var node_set = this.getOrder();
                if (!node_set) {
                    return;
                }
                var ajaxData = {
                    approv_name: this.procedureName,
                    approv_type: this.type,
                    rule_set: {},
                    scope_type: this.scope_type,
                    node_set: node_set,
                };
                ajaxData.rule_set[this.scope_type == 20 ? 'departments' : 'staffs'] = range;
                this.itemsLoading = true;
                $.ajax({
                    url: this.ajaxUrl,
                    type: this.ajaxType,
                    contentType: 'application/json',
                    data: JSON.stringify(ajaxData)
                }).always((data) => {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, () => {
                        layer.msg("提交成功", {icon: 1, time: 1500});
                        this.$dispatch('dialog-close', true);
                    })
                });
            },
            // 获取生效范围对象
            getRange () {
                var res = [];
                var arr = this[this.scope_type == 20 ? 'departments' : 'staffs'];
                for (let i = 0, len = arr.length; i < len; i++) {
                    res.push(arr[i].id);
                }
                return res;
            },
            // 获取审批流程的步骤
            getOrder () {
                var res = [];
                if (!this.orders.length) {
                    layer.msg('请设置审批步骤', {icon: 2, time: 1500});
                    return;
                }
                var arr = this.orders;
                for (let i = 0, len = arr.length; i < len; i++) {
                    let item = arr[i];
                    if (item.approvers.length == 0) {
                        layer.msg(`步骤【 ${i + 1} 】未设置审批人`, {icon: 2, time: 1500});
                        return false
                    } else {
                        res.push({
                            condition: item.condition,
                            approvers: []
                        });
                        for (let j = 0, len_j = item.approvers.length; j < len_j; j++) {
                            res[i].approvers.push(item.approvers[j].id);
                        }
                    }
                }
                return res;
            },
            close () {
                this.$dispatch('dialog-close', false);
            },
            save () {
                this.saveProcedure();
            }
        },
        components: {sel, sel_staff},
    }
</script>
