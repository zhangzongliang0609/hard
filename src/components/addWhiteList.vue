<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">{{type == 'add' ? '添加' : '编辑'}}白名单</div>
        <div class="layui-layer-content">
            <div class="row cl form-horizontal">
                <label class="form-label f-l col-3"><span class="c-red">*</span>部门：</label>
                <div class="formControls f-l col-6 department_box">
                    <div class="department_select_container" @mouseleave="departmentEnter(false)"
                         @mouseenter="departmentEnter(true)">
                        <input v-if="departmentItem.length === 0" disabled type="text" class="input-text"
                               value="无可选择部门">
                        <input v-else autocomplete="off" @click="departmentClick" v-model="departmentSelectedName"
                               type="text" class="input-text" value="" placeholder="">
                        <i v-show="departmentSelectedName !== ''" class="empty-icon Hui-iconfont"
                           @click="emptySearch($event)">&#xe60b;</i>
                        <div class="departmentListBox" style="display: none">
                            <div v-bind:title="item.department_tree"
                                 v-for="item in departmentItem | filterBy departmentSelectedName in 'department_tree'"
                                 @click="setDepartmentValue(item)" class="departmentListItem">
                                {{item.department_tree}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row cl1">
                <form id="J-layer-form" class="form form-horizontal layui-layer-wrap">
                    <label class="form-label f-l col-3"><span class="c-red">*</span>姓名：</label>
                    <div class="formControls f-l col-6">
                        <input v-model="usernameInput" autocomplete="off" type="text" class="input-text" value=""
                               placeholder=""
                               name="username">
                    </div>
                </form>
            </div>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;"
               v-on:click="close()"></a>
        </span>
        <div class="layui-layer-btn" v-on:click="save"><a class="layui-layer-btn0">保存</a></div>
    </div>
    <div class="m-loading" v-if="itemsLoading inner">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';

    export default{
        ready () {

            base.verticalCenter('.layui-modify');

            this.initValidate();
            this.getDepartments();
        },
        props: ['type', 'data'],
        data: function () {
            return {
                itemsLoading: false,
                usernameInput: '',
                departmentItem: [],
                departmentSelectedName: '', // 选择的部门名称
                departmentSelected: '', // 选择的部门 id
                isDepartmentFocus: false,
            }
        },
        methods: {
            getDepartments: function () {
                //获取部门列表
                $.ajax({
                    url: `${base.gAjaxUrl.departments}?page=1&page_size=9999999`,
                    type: 'GET',
                }).always((data)=> {
                    this.departmentItem = data || [];
                    this.$nextTick(() => {
                        this.setDepartmentName();
                    })
                });
            },
            close: function () {
                this.$dispatch('dialog-close', false);
            },
            save: function () {
                if (!this.usernameInput) {
                    layer.msg('请填写姓名', {icon: 2, time: 1500});
                    return
                }
                let id = this.getDepartmentId(this.departmentSelectedName);
                if (!id) {
                    layer.msg('部门名称不正确', {icon: 2, time: 1000});
                } else {
                    this.departmentSelected = id;
                    $('#J-layer-form').submit();
                }

            },
            // 传过来的是 department_name，但是这边过滤器选择的字段是department_tree
            setDepartmentName: function () {
                if (!this.departmentSelected) return;
                for (let i = 0, len = this.departmentItem.length; i < len; i++) {
                    let item = this.departmentItem[i];
                    if (this.departmentSelected == item.id) {
                        this.departmentSelectedName = item.department_tree;
                        return
                    }
                }
            },
            initValidate: function () {

                let ajaxUrl = base.gAjaxUrl.whitelist;
                let ajaxType = 'POST';

                // 类型判断
                if (this.type == 'modify') {
                    ajaxUrl += this.data.id + '/';
                    ajaxType = 'PATCH';
                    this.departmentSelected = this.data.department;
                    this.usernameInput = this.data.name;
                }
                $('#J-layer-form').validate({
                    rules: {
                        username: {
                            required: true
                        }
                    },
                    submitHandler: () => {
                        this.itemsLoading = true;
                        $.ajax({
                            url: ajaxUrl,
                            type: ajaxType,
                            contentType: 'application/json',
                            data: JSON.stringify({
                                name: this.usernameInput,
                                department: this.departmentSelected
                            })
                        }).always((data) => {
                            this.itemsLoading = false;
                            base.ajaxCallback(data, () => {
                                this.$dispatch('dialog-close', true)
                            });
                        });
                    }
                });
            },
            departmentClick: function () {
                if (this.isDepartmentFocus) {
                    $(".departmentListBox").show();
                }
            },
            // 清除搜索输入框
            emptySearch: function (e) {
                this.departmentSelectedName = '';
                $(e.target).nextAll(".departmentListBox").show();
            },
            departmentEnter: function (flag) {
                this.isDepartmentFocus = flag;
                !flag && $(".departmentListBox").hide();
            },
            setDepartmentValue: function (item) {
                this.departmentSelectedName = item.department_tree;
                this.departmentSelected = item.id;
                $(".departmentListBox").hide();
            },
            getDepartmentId: function (val) {
                var id = '';
                this.departmentItem.forEach(function (item) {
                    if (item.department_tree == val) {
                        id = item.id;
                    }
                });
                return id;
            },
        },
        filters: {},
        components: {}
    }
</script>

<style lang="less" scoped rel="stylesheet/less">
    .layui-modify {
        width: 500px;
        .layui-layer-content {
            min-height: 210px;
        }
    }

    .department_box {
        box-sizing: border-box;
    }
</style>
