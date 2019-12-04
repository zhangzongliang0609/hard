<template>

    <div class="layui-layer layui-anim mEditDepartmentContainer">
        <div class="layui-layer-title mTitle">编辑部门</div>
        <div class="page-container">
            <div class="inner_container clearfix">
                <div class="departmentContainer f-l relative">
                    <!-- 左侧侧边栏组件 -->
                    <edit v-on:depart-edit="departmentEdit" v-on:depart-add="departmentAdd" v-on:depart-delete="departmentDelete" v-on:depart-click="departmentClick" v-on:dbl-click="departmentDblClick" v-on:del-click="departmentDelClick"></edit>
                </div>
            </div>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" @click="close()"></a>
        </span>
    </div>
    <div class="layui-layer-shade"></div>

    <!-- 添加部门弹窗 -->
    <add v-if="showDepartment" :depart="departmentData" :type="departmentType" :title="departmentTitle" v-on:depart-close="departmentClose" v-on:depart-save="departmentSave"></add>

    <!-- 删除部门弹窗 -->
    <div v-if="showDelete" class="layui-layer layui-anim deleteDepartmentContainer bgc-fff">
        <div class="layui-layer-title fw-b">删除提示</div>
        <div class="layui-layer-content tc mt-10 pd-10">
            <div class="content_title fw-b fs-16">确认删除“{{currentDepartment.department_name || '--'}}”？</div>
            <div class="content_tip fs-14">删除后该部门下的所有部门也会被删除，确认删除？</div>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" @click="deleteClose()"></a>
        </span>
        <div class="mt-10 mb-10 clearfix pd-10 b-box btns">
            <a v-on:click="deleteConfirm" class="btn btn-primary radius">确认</a>
            <a v-on:click="deleteCancel" class="btn btn-default radius">取消</a>
        </div>
    </div>
    <div class="layui-layer-shade mDeleteShade" v-if="showDelete"></div>

    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import edit from './editBarDepartments.vue';
    import add from "./addModifyDepartments.vue";

    export default{
        ready () {

            base.verticalCenter(".mEditDepartmentContainer");

        },
        data: function () {
            return {
                currentDepartment: {},
                departmentData: {},
                departmentType: 'add',
                departmentTitle: '添加部门',
                showDepartment: false,
                showDelete: false,
                itemsLoading: false,
                parentDepartment:'',
            }
        },
        methods: {
            close: function () {
                this.$dispatch("edit-close");
            },
            departmentClick: function (data) {
                console.log("departmentClick：", data);
                this.currentDepartment = data;
            },
            departmentDblClick: function (data) {
                console.log("departmentClick：", data);
            },
            departmentDelClick: function (data) {
                console.log("departmentClick：", data);
                this.$dispatch("edit-refresh");
            },
            departmentEdit: function (data) {
                console.log("bar-departmentEdit", data);
                if(this.currentDepartment.id) {
                    console.log("edit", this.currentDepartment);
                    this.departmentData = this.currentDepartment;
                    this.departmentType = 'modify';
                    this.departmentTitle = '修改部门';
                    this.showDepartment = true;
                } else {
                    layer.msg("请先选择部门", {icon: 2, time: 1500});
                }
            },
            departmentAdd: function (currentData) {
                this.departmentType = 'add';
                this.departmentTitle = '添加部门';
                this.departmentData = this.currentDepartment
                this.showDepartment = true;

            },
            departmentClose: function (data) {
//                console.log("bar-departmentClose", data);
                this.showDepartment = false;
            },
            departmentSave: function (data) {
//                console.log("bar-departmentSave", data);
                this.showDepartment = false;
                this.$dispatch("edit-refresh");
            },
            departmentDelete: function (data) {
//                console.log("bar-departmentDelete", data);
                this.showDelete = true;
            },
            deleteConfirm: function () {
                let id;
                if(id = this.currentDepartment.id) {
                    this.itemsLoading = true;
                    $.ajax({
                        url: base.gAjaxUrl.departments + id + '/',
                        type: 'DELETE',
                        success: () => {
//                            console.log("delete success");
                            layer.msg("删除成功", {icon: 1, time: 1000});
                            this.$dispatch("edit-refresh");
                        },
                        error: function (data) {
                            base.ajaxCallback(data)
                        },
                        complete: () => {
//                            console.log("delete complete");
                            this.itemsLoading = false;
                            this.showDelete = false;
                        }
                    })
                }
            },
            deleteCancel: function () {
                this.showDelete = false;
            },
            deleteClose: function () {
                this.showDelete = false;
            },
        },
        components: {
            edit, add,
        }
    }
</script>

<!-- 标签规则 -->
<style lang="less" rel="stylesheet/less" scoped>
    .mEditDepartmentContainer {
        width: 95%;
        height: 95%;
        min-width: 400px;
        max-width: 600px;
        min-height: 500px;
        max-height: 600px;
        background-color: #fff;
        z-index: 110;
        position: relative;
        .mTitle {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            font-weight: bold;
        }
        .page-container {
            padding: 15px;
            height: 100%;
            overflow: auto;
            box-sizing: border-box;
            position: relative;
            width: 100%;
            .inner_container {
                box-sizing: border-box;
                position: absolute;
                top: 57px;
                left: 15px;
                right: 15px;
                bottom: 52px;
                overflow: auto;
                .departmentContainer {
                    width: 100%;
                    height: 100%;
                    border: 1px solid #ccc;
                    overflow: auto;
                    box-sizing: border-box;
                    padding: 10px;
                }
            }
        }
        .saveBtn {
            position: absolute;
            right: 15px;
            bottom: 10px;
        }
    }

    .deleteDepartmentContainer {
        width: 400px;
        position: absolute;
        line-height: 30px;
        left: 50%;
        top: 50%;
        margin-left: -200px;
        margin-top: -100px;
        z-index: 111;
        .btns {
            display: flex;
            align-content: space-between;
            justify-content: space-between;
            .btn {
                flex: 1;
                margin: 0 20px;
            }
        }
    }
    .mDeleteShade {
        z-index: 110;
    }
</style>
