<template>

    <!-- 添加 -->
    <add :title="dialogTitle" :type="dialogType" :data="dialogData" v-if="isShowAddDialog"
         v-on:dialog-close="addDialogClose" v-on:dialog-save="addDialogSave" @modify-save="modifySave"></add>

    <section class="Hui-article-box">
        <div class="page-container">
            <div class="title panel panel-default radius">
                <div class="panel-body">
                    <span class="f-15 fw-b">部门员工</span>
                </div>
            </div>
            <div class="inner_container clearfix">
                <div class="departmentContainer f-l relative no-selected">
                    <department v-on:edit="showEditDepartment"
                                v-on:depart-click="departmentClick"
                                v-on:dbl-click="departmentDblClick"
                                v-on:tree-data="getTreeData"></department>
                </div>
                <div class="employeeContainer">
                    <div class="employeeBox">
                        <div class="text-l clearfix bk-gray mb-20 pd-10">
                            <div class="f-l clearfix search_box">
                                <span class="f-l lh-30">性别:</span>
                                <select v-model="sexInput" id="sexInput" class="sexSearch select f-l ml-5">
                                    <option value="" selected>全部</option>
                                    <option value="1">男</option>
                                    <option value="2">女</option>
                                </select>
                                <select v-model="searchInput" class="searchInputType select f-l ml-20">
                                    <option value="real_name" selected>姓名</option>
                                    <option value="job_number">工号</option>
                                    <option value="card_number">员工卡号</option>
                                    <option value="phone">电话</option>
                                    <option value="position">职位</option>
                                    <option value="education">学历</option>
                                </select>
                                <input id="searchInput"
                                       autocomplete="off"
                                       class="f-l input-text"
                                       type="text"
                                       placeholder=""
                                       style="width:200px">
                                <button v-on:click="getList(1)" class="btn btn-success f-l radius-r" type="button"><i
                                        class="f-r Hui-iconfont">&#xe665;</i></button>
                            </div>
                <span class="r">
                    <a class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="clickAdd()">添加员工</a>
                    <a href="javascript:;" class="btn btn-secondary radius" v-on:click="turnToImport">批量导入</a>
                    <a id="exportData" class="btn btn-secondary radius" v-on:click="exportData()">批量导出</a>
                </span>
                        </div>
                        <table class="fixedParent table table-border table-bordered table-hover table-bg table-sort">
                            <thead>
                            <tr class="text-c">
                                <!-- <th width="25"><input type="checkbox" value="" name=""></th> -->
                                <th width="50">头像</th>
                                <th width="70">姓名/性别</th>
                                <th width="160">部门</th>
                                <th width="160">职位/学历</th>
                                <th width="120">员工卡号</th>
                                <th width="100">工号</th>
                                <th width="100">电话</th>
                                <th width="120">分组</th>
                                <th width="80">绑定</th>
                                <th width="70">操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="text-c" v-for="item in items">
                                <!-- <td><input type="checkbox" value="" name="">{{item.avatar}}</td> -->
                                <td><img class="avatar" v-bind:src="item.avatar?item.avatar:'./src/assets/images/avatar-default.jpg'"/>
                                </td>
                                <td>{{item.real_name}}/{{item.sex==1? '男': '女'}}</td>
                                <td class="td-ellipsis">
                                    {{item.department_vo.department_name||"--"}}
                                </td>
                                <td class="td-ellipsis">
                                    {{item.position||"--"}}/{{item.education||"--"}}
                                </td>
                                <td>{{item.card_number && item.card_number !== 'None'?item.card_number:'--'}}</td>
                                <td>{{item.job_number}}</td>
                                <td>{{item.phone}}</td>
                                <td>
                                    <div class="tag_container">
                                        <span v-if="!item.tags.length">--</span>
                                        <div @mouseenter="checkPosition($event, item.tags.length <= 1)" class="tag_box"
                                             v-if="item.tags.length">
                                            <div class="tag_item" :title="item.tags[0].name">
                                                {{item.tags[0].name}}
                                                <span class="tag_more" v-if="item.tags.length > 1">...</span>
                                            </div>
                                            <div class="tag_second_box_sign"></div>
                                            <div v-if="item.tags.length > 1" class="tag_second_box clearfix">
                                                <div v-for="tag in item.tags" class="tag_item f-l" title="{{tag.name}}">
                                                    {{tag.name}}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="btn btn-link size-S radius" v-on:click="clickUnBind(item.phone)">解除绑定</div>
                                </td>
                                <td class="f-14">
                                    <a title="编辑" href="javascript:;" v-on:click="clickModify(item)">
                                        <i class="Hui-iconfont">&#xe6df;</i>
                                    </a>
                                    <a title="删除" href="javascript:;" class="ml-5" v-on:click="deleteEmployee(item.id)">
                                        <i class="Hui-iconfont">&#xe6e2;</i>
                                    </a>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <div id="J-page" class="m-page" v-show="!noData"></div>
                        <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <edit v-if="isShowDepartment" v-on:edit-close="editClose" v-on:edit-refresh="editRefresh"></edit>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import add from "../components/addEmployee.vue";
    import department from '../components/departments.vue';
    import edit from '../components/editDepartment.vue';

    let staffsOps = null;

    export default{
        ready () {
            staffsOps = {
                param: {
                    page: 1,
                    page_size: 10,
                    real_name: '',
                    // department_name: '',
                    phone: '',
                    position: '',
                    job_number: '',
                    education: '',
                }
            };
            this.getList();
            console.log(department);
        },
        data: function () {
            return {
                noData: false,
                itemsLoading: false,
                isShowAddDialog: false,
                items: [],
                importUrl: 'staffsIpmort',
                dialogTitle: '添加部门',
                dialogType: 'add',
                dialogData: '',
                searchInput: 'real_name',
                sexInput: '',
                isShowDepartment: false, // 是否显示展示部门编辑弹窗
                currentDepartment: {}, // 选定的当前部门
                currentDepartmentObj: {}, // 用来做实时更新部门人数
                treeData: [],
            }
        },
        methods: {
            showEditDepartment: function () {
                this.isShowDepartment = true;
            },
            editClose: function () {
                this.isShowDepartment = false;
            },
            editRefresh: function () {
                console.log("editRefresh -- editRefresh -- editRefresh ");
                this.$broadcast('departmentChange');
                this.getList(1);
            },
            addDialogClose: function (data) {
                this.isShowAddDialog = false;
            },
            addDialogSave: function (data) {
                this.isShowAddDialog = false;
                this.getList();
                this.getDepartmentName(data.department_vo, 1)
            },
            clickAdd: function () {
                this.dialogType = 'add';
                this.dialogTitle = '添加员工';
                this.isShowAddDialog = true;
            },
            clickModify: function (data) {
                this.dialogTitle = '修改资料';
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
                    callback: (p)=> {
                        staffsOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax: function (callback = function () {}) {
                //修改参数
                this.itemsLoading = true;
                $.ajax({
                    url: base.gAjaxUrl.staffs,
                    type: 'GET',
                    data: staffsOps.param
                }).always((data)=> {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=> {
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
            //获取列表
            getList: function (reset = 0) {
                //重置第一页
                if (reset) {
                    staffsOps.param.real_name = "";
                    staffsOps.param.phone = "";
                    staffsOps.param.position = "";
                    staffsOps.param.job_number = "";
                    staffsOps.param.education = "";
                    staffsOps.param.card_number = "";
                    staffsOps.param[this.searchInput] = $("#searchInput").val();
                    staffsOps.param.page = 1;
                }
                staffsOps.param.sex = this.sexInput;

                this.queryAjax((tpageToal = '4', count = '0')=> {
                    this.initPage('#J-page', tpageToal, staffsOps.param.page, count)
                });
            },
            //删除
            deleteEmployee: function (id) {
                let that = this;
                layer.confirm('删除须谨慎，确认要删除吗？', (index)=> {
                    if ($('tbody tr.text-c').length == 1 && staffsOps.param.page > 1) {
                        staffsOps.param.page--;
                    }
                    $.ajax({
                        url: `${base.gAjaxUrl.staffs}${id}/`,
                        type: 'DELETE',
                    }).always((data)=> {
                        // 如果在根的部门上删除员工的话,就再次去获取整个部门的树形结构更新人数
                        if (that.currentDepartmentObj.id) {
                            that.getDepartmentName(that.currentDepartmentObj, -1)
                        } else {
                            this.$broadcast('departmentChange');
                        }
                        layer.msg('删除成功', {icon: 1, time: 1000});
                        that.getList();
                    })
                });
            },
            clickUnBind: function (phone) {
                let that = this;
                layer.confirm('确认要解除吗？', (index)=> {
                    $.ajax({
                        url: `${base.gAjaxUrl.staffs}un_bind/`,
                        type: 'DELETE',
                        data: {
                            phone: phone,
                        }
                    }).always((data)=> {
                        let statusErrorRule = /^4\d{2}$/;
                        if (statusErrorRule.test(data.status)) {
                            layer.msg('该号码未绑定设备', {icon: 2, time: 1000});
                        } else {
                            layer.msg('解除成功', {icon: 1, time: 1000});
                            that.getList();
                        }
                    })
                });
            },
            checkPosition: function (e, flag) {
                if (flag) return;
                let target = e.srcElement ? e.srcElement : e.target;
                let $this = $(target);
                if ($this.hasClass("top") || $this.hasClass("bottom")) return;
                let $parent = $this.parents(".fixedParent");
                let $tagBox = $this.children(".tag_second_box");
                // $tagBox.offset().top + $tagBox.outerHeight() > $parent.offset().top + $parent.outerHeight() 判断向下不能显示完
                // $this.offset().top - $parent.offset().top < $this.find(".tag_second_box_sign").outerHeight() + $tagBox.outerHeight().outerHeight() 判断向上不能显示完
                if ($tagBox.offset().top + $tagBox.outerHeight() > $parent.offset().top + $parent.outerHeight() && $this.offset().top - $parent.offset().top < $this.find(".tag_second_box_sign").outerHeight() + $tagBox.outerHeight()) {
                    // 防止重复添加minHeight属性，选择添加最大值
                    var height = parseInt($parent.parent().css("minHeight"));
                    var currentHeight = $this.offset().top - $parent.offset().top + $this.find(".tag_second_box_sign").outerHeight() + $tagBox.outerHeight() + $this.parents("td").outerHeight();
                    var compensate = $parent.offset().top - $parent.parent().offset().top;
                    if (currentHeight > height && $parent.parents(".position_box").height() < currentHeight + compensate) $parent.parent().css({minHeight: currentHeight + compensate});
                    $this.addClass("bottom");
                } else if ($tagBox.offset().top + $tagBox.outerHeight() + $this.find(".tag_second_box_sign").outerHeight() > $parent.offset().top + $parent.outerHeight()) {
                    $this.addClass("top");
                } else {
                    $this.addClass("bottom");
                }
            },
            departmentClick: function (data) {
//                console.log("departmentEmployee - departmentClick：", data);
                this.currentDepartment = data;
            },
            departmentDblClick: function (data) {
//                console.log("departmentEmployee - departmentDblClick：", data);
            },
            departmentDelClick: function (data) {
//                console.log("departmentEmployee - departmentDelClick：", data);
            },
            getTreeData: function (treeData) {
                this.treeData = treeData;
            },
            getDepartmentName: function (depart, number, str) {
                function getName(obj) {
                    if (obj.id == depart.id) {
                        // 找到obj对象中的depart对象
                        // 如果是没有下级部门的人数,类型是Number.如果有下级部门的,后台返回来的是字符串
                        let staffCnt = obj.staff_cnt;
                        if (typeof staffCnt == 'string') {
                            // arr[0] 这个部门有多少人 arr[1]这个部门及其子部门一共有多少人
                            var arr = staffCnt.split("/");
                            arr[0] = arr[0] * 1 + number;
                            arr[1] = arr[1] * 1 + number;
                            obj.staff_cnt = arr.join('/');
                        } else {
                            obj.staff_cnt += number;
                        }
                        return true;
                    }
                    if (obj.child) {
                        for (var i = 0, len = obj.child.length; i < len; i++) {
                            if (getName(obj.child[i])) {
                                let staffCnt = obj.staff_cnt;
                                if (typeof staffCnt == 'string') {
                                    arr = staffCnt.split("/");
                                    arr[1] = arr[1] * 1 + number;
                                    obj.staff_cnt = arr.join('/');
                                } else {
                                    obj.staff_cnt += number;
                                }
                                return true;
                            }
                        }
                    }
//                    for (var key in obj) {
//                        var item = obj[key];
//                        if (item && typeof item === 'object' && obj.hasOwnProperty(key)) {
//                            if (getName(item)) {
//                                // 如果是没有下级部门的人数,类型是Number.如果有下级部门的,后台返回来的是字符串
//                                let staffCnt = obj.staff_cnt;
//                                console.log(obj.staff_cnt, number)
//                                if(typeof staffCnt == 'string'){
////                                    let i = staffCnt.indexOf('/');
////                                    let currentNumber = staffCnt.substring(0,++i);
////                                    let str = staffCnt.substring(i);
////                                    str = (+str) + number;
////                                    obj.staff_cnt = currentNumber + str;
//                                    arr = staffCnt.split("/");
//                                    arr[1] = arr[1] * 1 + number;
//                                    obj.staff_cnt = arr.join('/');
//                                }else{
//                                    obj.staff_cnt += number;
//                                }
//                                return true;
//                            }
//                        }
//                    }
                }

                getName(this.treeData);
            },
            modifySave: function (oldDepartment, newDepartment) {
//                console.log("modifySave");
                this.isShowAddDialog = false;
                this.getList();
//                console.log(oldDepartment.department_vo.department_name, newDepartment.department_vo.department_name);
                if (oldDepartment.department_vo.id == newDepartment.department_vo.id) {
                    return;
                }
                this.getDepartmentName(oldDepartment.department_vo, -1, 'reduce');
                this.getDepartmentName(newDepartment.department_vo, 1, 'add');
            },
            turnToImport: function () {
                this.$router.go({
                    path: '/importMould',
                    name: 'importMould',
                    query: {
                        importType: 'employee'
                    }
                })
            },
            exportData: function () {
                this.itemsLoading = true;
                $.ajax({
                    url: `${base.gAjaxUrl.staffs}export/`,
                    type:'POST',
                    contentType: "application/json;charset=utf-8",
                    data:JSON.stringify(staffsOps.param)
                }).always((data)=>{
                    this.itemsLoading = false;
                    this.$route.router.go({path: '/job'});
                    // layer.msg('最新的一条数据请重新刷新哦',{icon:1,time:3000});
                })
            }
        },
        watch: {
            currentDepartment: function (newVal, oldVal) {
//                console.log("-------------");
//                console.log(newVal, oldVal);
                if (oldVal.id != newVal.id) {
                    this.currentDepartmentObj = newVal;
                    staffsOps.param.department = newVal.id ? newVal.id : '';
                    staffsOps.param.page = 1;
                    this.getList();
                }
            }
        },
        components: {
            add,department,edit
        }
    }
</script>

<style lang="less">
    .avatar {
        width: 50px;
        height: 100%;
    }
</style>

<!-- 标签规则 -->
<style lang="less" rel="stylesheet/less" scoped>
    .td-ellipsis {
        max-width: 160px;
    }

    .page-container {
        padding: 15px;
        height: 100%;
        overflow: auto;
        box-sizing: border-box;
        position: relative;
        width: 100%;
        min-width: 1000px;
        .inner_container {
            box-sizing: border-box;
            position: absolute;
            top: 68px;
            left: 15px;
            right: 15px;
            bottom: 15px;
            overflow: auto;
            .departmentContainer {
                width: 300px;
                height: 100%;
                border: 1px solid #ccc;
                overflow: hidden;
                box-sizing: border-box;
                padding: 10px;
            }
            .employeeContainer {
                overflow: hidden;
                padding-left: 15px;
                box-sizing: border-box;
                .employeeBox {
                    width: 100%;
                    height: 100%;
                    box-sizing: border-box;
                    overflow: auto;
                }
            }
        }
        .panel-body {
            padding: 8px;
        }
    }

    .tag_container {
        width: 80px;
        margin: 0 auto;
    }

    .select {
        width: 120px;
        height: 31px;
        vertical-align: middle;
        display: inline-block;
        line-height: 31px;
    }

    .searchInputType.select {
        width: 100px;
        padding-left: 5px;
        text-align: right;
    }

    .sexSearch {
        width: 60px;
    }

    .searchButton {
        margin-left: 160px;
    }
</style>
