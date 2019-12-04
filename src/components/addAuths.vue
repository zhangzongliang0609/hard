<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify f-14">
        <div class="layui-layer-title">{{type == 'add' ? '新增' : '修改' }}线路权限</div>
        <div class="layui-layer-content">
            <div class="row cl"
                 v-if="type === 'add'">
                <label class="form-label f-l col-2 text-r">
                    <span class="c-red">*</span>线路名称：
                </label>
                <div class="formControls f-l col-8">
                    <div class="department_select_container"
                         @mouseleave="lineEnter(false)"
                         @mouseenter="lineEnter(true)">
                        <input v-if="lines.length === 0 && type === 'add'"
                               disabled
                               type="text"
                               class="input-text"
                               value="无可选择类型"/>
                        <input v-else
                               autocomplete="off"
                               @click="lineClick($event)"
                               v-model="shuttle_name"
                               type="text"
                               class="input-text"
                               placeholder
                               name="shuttle_name"/>
                        <i v-show="shuttle_name !== ''"
                           class="empty-icon Hui-iconfont"
                           @click="emptyLineSearch($event)">&#xe60b;</i>
                        <div class="departmentListBox line_box" style="display: none">
                            <div v-bind:title="item.shuttle_name"
                                 v-for="item in lines | filterBy shuttle_name in 'shuttle_name'"
                                 @click="setLineValue(item)"
                                 class="departmentListItem">{{item.shuttle_name}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row cl"
                 v-if="type != 'add'">
                <label class="form-label f-l col-2 text-r">
                    <span class="c-red">*</span>线路名称：
                </label>
                <div class="formControls f-l col-8">
                    <input autocomplete="off"
                           v-model="shuttle_name"
                           type="text"
                           class="input-text"
                           disabled/>
                </div>
            </div>

            <!-- 生效范围 -->
            <div class="procedure_range mt-15 lh-30">
                <div class="range_title clearfix">
                    <span class="f-l f-20 b-l pl-10">生效范围</span>
                    <a class="f-l ml-15 btn btn-primary radius"
                       href="javascript:;"
                       v-on:click="addDepartment()">添加部门</a>
                    <a class="f-l ml-15 btn btn-primary radius"
                       href="javascript:;"
                       v-on:click="addStaff()">添加员工</a>
                    <a class="f-l ml-15 btn btn-danger radius"
                       href="javascript:;"
                       v-on:click="deleteAllData()">一键清空</a>
                </div>
                <div class="range_content clearfix row">
                    <div class="selected_type f-l col-2">
                        <div class="select_txt">生效部门：</div>
                    </div>
                    <div class="selected_content f-l clearfix col-10">
                        <div v-for="(idx, item) in departments" class="select_item f-l" track-by="$index">
                            <span>{{item.department_name}}</span>
                            <span @click="deleteItem(item, idx, 'departments')" class="delete_btn c-fff">
                <i class="Hui-iconfont">&#xe60b;</i>
              </span>
                        </div>
                    </div>
                </div>
                <div class="range_content clearfix row">
                    <div class="selected_type f-l col-2">
                        <div class="select_txt">生效人员：</div>
                    </div>
                    <div class="selected_content f-l clearfix col-10">
                        <div v-for="item in staffs" class="select_item f-l">
                            <span>{{item.real_name}}</span>
                            <span @click="deleteItem(item, $index, 'staffs')" class="delete_btn c-fff">
                <i class="Hui-iconfont">&#xe60b;</i>
              </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <span class="layui-layer-setwin">
              <a class="layui-layer-ico layui-layer-close layui-layer-close1"
                 href="javascript:;"
                 v-on:click="close()"></a>
        </span>
        <div class="layui-layer-btn" v-on:click="submit">
            <a class="layui-layer-btn0">保存</a>
        </div>
    </div>
    <!-- 选择部门 -->
    <sel :departs="departments"
         :is_single="isDepartmentSingleSelect"
         v-if="isShowSelectDepartment"
         v-on:sel-close="departmentClose"
         v-on:sel-save="departmentSave"></sel>
    <sel_staff :list="staffs"
               :is_single="isStaffSingleSelect"
               v-if="isShowSelectStaff"
               v-on:sel-close="staffClose"
               v-on:sel-save="staffSave"></sel_staff>
    <sel_staff :list="approves"
               :is_single="isApproveSingleSelect"
               v-if="isShowSelectApprove"
               v-on:sel-close="approveClose"
               v-on:sel-save="approveSave"></sel_staff>
    <div class="layui-layer-shade"></div>
</template>


<script type="text/ecmascript-6">

    import * as base from '../assets/js/base.js';
    import sel from '../components/selectDepartment.vue';
    import sel_staff from '../components/selectStaff.vue';

    export default {
        ready() {
            if (this.type != 'add') {
                this.initModifyData();
            } else {
                this.getLines();
            }
        },
        props: ['type', 'rule'],
        data: function () {
            return {
                ajaxUrl: '',
                ajaxType: '',
                isShowSelectDepartment: false, // 展示添加部门
                isDepartmentSingleSelect: false, // 是否为单选
                isShowSelectStaff: false, // 展示添加员工
                isStaffSingleSelect: false, // 是否为单选
                isShowSelectApprove: false, // 展示添加审批人
                isApproveSingleSelect: false, // 是否为单选
                approves: [], // 审批人集合，编辑单个步骤的审批人时会用到
                orderIndex: 0, // 处理的流程索引
                shuttle_name: '', // 线路名称
                departments: [], // 需要添加的部门集合
                staffs: [], // 需要添加的员工集合
                lines: [], // 线路选择
                selectLineId: '', // 选择的线路id
            }
        },
        methods: {
            initModifyData() {
                let item = this.rule;
                if (!item || !item.shuttle_name) {
                    layer.alert("参数异常", (index) => {
                        layer.close(index);
                        this.close();
                    });
                } else {
                    this.shuttle_name = item.shuttle_name;
                    this.selectLineId = item.id;
                    this.staffs = item.staffs || [];
                    this.departments = item.departments || [];
                }
            },
            deleteItem(item, index, typeName) {
                console.log("deleteItem: ", typeName, index);
                this[typeName].splice(index, 1);
            },
            // 部门/员工 选择部分
            addDepartment() {
                console.log('添加部门');
                this.isDepartmentSingleSelect = false;
                this.isShowSelectDepartment = true;
            },
            // 部门/员工 选择部分
            addStaff() {
                console.log('添加员工');
                this.isStaffSingleSelect = false;
                this.isShowSelectStaff = true;
            },
            deleteAllData() {
                console.log("删除所有数据");
                this.staffs = [];
                this.departments = [];
            },
            departmentSave(data) {
                console.log("data: ", data);
                this.departments = data || [];
                this.isShowSelectDepartment = false;
            },
            departmentClose() {
                this.isShowSelectDepartment = false;
            },
            staffSave(data) {
                this.staffs = data || [];
                this.isShowSelectStaff = false;
            },
            staffClose() {
                this.isShowSelectStaff = false;
            },
            approveSave(data) {
                data = data || [];
                this.isShowSelectApprove = false;
            },
            approveClose() {
                this.isShowSelectApprove = false;
            },
            // 获取生效范围对象
            getRange() {
                var res = [];
                // var arr = this[this.scope_type == 20 ? 'departments' : 'staffs'];
                for (let i = 0, len = arr.length; i < len; i++) {
                    res.push(arr[i].id);
                }
                return res;
            },
            close() {
                this.$dispatch('close');
            },
            submit() {
                if (!this.selectLineId) {
                    layer.msg("请先选择线路", {icon: 2, time: 1500});
                    return;
                }
                if (!this.departments.length && !this.staffs.length) {
                    layer.msg("请先选择生效范围", {icon: 2, time: 1500});
                    return;
                }
                $.showLoading();
                $.ajax({
                    url: base.gAjaxUrl.busAuths + this.selectLineId + '/set_rules/',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        departments: this.departments.map(item => item.id),
                        staffs: this.staffs.map(item => item.id),
                    })
                }).always((data) => {
                    $.hideLoading();
                    base.ajaxCallback(data, () => {
                        layer.msg("添加成功！", {icon: 1, time: 1500});
                        this.$dispatch('save');
                    });
                })
            },
            lineEnter: function (flag) {
                this.isTypeFocus = flag;
                !flag && $(".line_box").hide();
            },
            lineClick: function (e) {
                if (this.type !== 'add') return;
                if (this.isTypeFocus) {
                    $(e.target).nextAll(".line_box").show();
                }
            },
            emptyLineSearch: function (e) {
                this.shuttle_name = '';
                this.selectLineId = '';
                $(e.target).nextAll(".line_box").show();
            },
            setLineValue: function (item) {
                this.shuttle_name = item.shuttle_name;
                this.selectLineId = item.id;
                $(".departmentListBox").hide();
            },
            getLines: function () {
                $.ajax({
                    url: base.gAjaxUrl.shuttlebuses3,
                    type: "GET",
                    data: {
                        page: 1,
                        page_size: 999999
                    }
                }).always((data) => {
                    base.ajaxCallback(data, () => {
                        this.lines = data.results || [];
                    })
                });
            },
        },
        components: {sel, sel_staff},
    }
</script>

<style lang="less" scoped rel="stylesheet/less">

    .layui-layer.layui-layer-page .layui-layer-content {
        min-height: 350px;
        max-height: 550px;
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
        overflow: hidden;

        .selected_type {
            margin-top: 44px;

            .select_txt {
                margin-right: auto;
                margin-left: auto;
                height: 32px;
                line-height: 30px;
                box-sizing: border-box;
                border-radius: 3px;
                text-align: right;
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
</style>
