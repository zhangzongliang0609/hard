<template>
    <!-- 添加 -->
    <add :title="dialogTitle" :type="dialogType" :data="dialogData" v-if="isShowAddDialog"
         v-on:dialog-close="addDialogClose" v-on:dialog-save="addDialogSave"></add>
    <!--编辑-->
    <div v-if="isShowEdit">
        <div class="layui-layer layui-anim layui-layer-page layui-modify">
            <div class="layui-layer-title">编辑编号</div>
            <div class="layui-layer-setwin">
                <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;"
                   @click="close()"></a>
            </div>
            <div class="layui-layer-content">
                <form id="J-layer-form" class="form form-horizontal layui-layer-wrap">
                    <div class="row cl">
                        <label class="form-label f-l col-4 "><span class="c-red"></span>编号：</label>
                        <div class="formControls f-l col-4">
                            <input v-model="num" type="text" class="input-text" value="" placeholder="">
                        </div>
                    </div>
                </form>
            </div>
            <button class="btn btn-primary radius f-r mr-10 mb-10" @click="save()">保存</button>
        </div>
        <div class="layui-layer-shade"></div>
    </div>

    <section class="Hui-article-box">
        <div class="page-container ">
            <div class="panel panel-default radius">
                <div class="panel-body f-20 fw-b">执勤人员管理</div>
            </div>
            <div class="bk-gray radius mt-10 bgc-fff">
                <div class="pd-15 clearfix">
                    <div class=" f-l mr-10">
                        <select v-model="searchType" class="select f-l"
                                style="width:100px;height:31px;margin-right: -1px;"
                                @change="onSelectedStatus">
                            <!--<option value="">全部</option>-->
                            <option value="real_name">姓名</option>
                            <option value="department_name">部门</option>
                            <option value="job_number">工号</option>
                            <option value="phone">电话</option>
                            <option value="number">编号</option>
                        </select>
                        <input v-model="searchInput" type="text" style="width:250px" class="f-l input-text">
                        <button @click="getList(1)" class="btn btn-success" type="button"><i class="f-r Hui-iconfont">&#xe665;</i>
                        </button>
                    </div>
                    <span class="f-r">
                        <a class="btn btn-primary radius mr-5" href="javascript:;" @click="clickAdd()">新增执勤人员</a>
                    </span>
                </div>
                <table class="table table-border table-bg table-striped">
                    <thead class="text-c">
                    <tr>
                        <th>姓名</th>
                        <th>部门/职位</th>
                        <th>工号</th>
                        <th>电话</th>
                        <th>编号</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="text-c" v-for="item in items">
                        <td>{{item.staff_vo.real_name}}</td>
                        <td>{{item.staff_vo.department_vo.department_name}}/{{item.staff_vo.position}}</td>
                        <td>{{item.staff_vo.job_number}}</td>
                        <td>{{item.staff_vo.phone}}</td>
                        <td>{{item.number}}</td>
                        <td>
                            <a title="删除" href="javascript:;" class="ml-5" @click="deleteRepairmen(item.id)"><i
                                    class="Hui-iconfont">&#xe6e2;</i></a>
                            <a title="编辑" href="javascript:;" class="ml-5" @click="editRepairmen(item)"><i
                                    class="Hui-iconfont">&#xe6df;</i></a>
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
        </div>
    </section>
</template>
<script>
    import * as base from '../assets/js/base.js';
    import add from "../components/addCarryOut";

    let repairOps = null;

    export default {
        ready() {
            let that = this;

            repairOps = {
                param: {
                    // search: '',
                    page: 1,
                    page_size: 10,
                }
            };

            this.queryAjax((tpageToal = '4', count = '0') => {
                this.initPage('#J-page', tpageToal, repairOps.param.page, count)
            });
        },
        data: function () {
            return {
                noData: false,
                itemsLoading: false,
                isShowEdit: false,
                isShowAddDialog: false,
                isShowImportDialog: false,
                items: [],
                searchInput: '',
                dialogTitle: '添加维修工',
                dialogType: 'add',
                dialogData: '',
                searchType: 'real_name',
                editData: {},  //存储编辑
                num: '', //编号
            }
        },
        events: {
            enterEvent() {
                this.getList(1);
            }
        },
        methods: {
            addDialogClose: function (data) {
                this.isShowAddDialog = false;
            },
            addDialogSave: function (data) {
                this.isShowAddDialog = false;

                this.getList();
            },
            clickAdd: function () {
                this.dialogType = 'add';
                this.dialogTitle = '新增执勤人员';
                this.isShowAddDialog = true;
            },
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
                });
            },
            //获取维修工列表
            getList: function (reset = 0) {
                let that = this;
                //重置第一页
                if (reset) {
                    // this.searchInput = $("#searchInput").val();
                    repairOps.param.page = 1
                }

                this.queryAjax((tpageToal = '4', count = '0') => {
                    that.initPage('#J-page', tpageToal, repairOps.param.page, count)
                });
            },
            queryAjax: function (callback = function () {
            }) {
                this.itemsLoading = true;
                //修改参数
                // repairOps.param.search = this.searchInput;
                let o = {};
                o[this.searchType] = this.searchInput;
                $.ajax({
                    url: base.gAjaxUrl.publicsecurity,
                    type: 'GET',
                    data: Object.assign({}, repairOps.param, o)
                })
                    .always((data) => {
                        base.ajaxCallback(data, () => {
                            this.itemsLoading = false;
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
            //删除
            deleteRepairmen: function (id) {
                let that = this;

                layer.confirm('删除须谨慎，确认要删除吗？', (index) => {

                    if ($('tbody tr.text-c').length == 1 && repairOps.param.page > 1) {
                        repairOps.param.page--;
                    }

                    $.ajax({
                        url: `${base.gAjaxUrl.publicsecurity}${id}/`,
                        type: 'DELETE',
                    })
                        .always((data) => {
                            layer.msg('删除成功', {icon: 1, time: 1000});
                            that.getList();

                        })
                });
            },
            //编辑
            editRepairmen: function (item) {
                this.isShowEdit = true;
                this.editData = item;
                this.$nextTick(() => {
                    this.num = item.number;
                });
            },
            close() {
                this.isShowEdit = false
            },
            save() {
                console.log(this.num);
                $.showLoading();
                $.ajax({
                    // url: `${base.gAjaxUrl.adminfeedback}${data.id}/`,
                    url: base.gAjaxUrl.publicsecurity + 'add_number/',
                    type: 'POST',
                    contentType: "application/json",
                    data: JSON.stringify({
                        staffs: this.editData.staff,
                        number: this.num,
                    })
                }).always((data) => {
                    $.hideLoading();
                    base.ajaxCallback(data, () => {
                        layer.msg("修改成功", {icon: 1, time: 1500});
                        this.close();
                        this.getList();
                    })
                });

            },
            onSelectedStatus() {
                this.searchInput = '';
            },
        },
        components: {
            add,
        }
    }
</script>
<style lang="less" scoped>
    .bgc-f5 {
        background-color: #f5f5f5;
    }

    .fw-b {
        font-weight: bold;
    }
</style>
