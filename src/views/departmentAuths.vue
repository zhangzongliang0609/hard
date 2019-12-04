<!--

    如果 department 部门的 serial_number 字段是null，
    在设置权限时，是无法应用到子部门的

 -->

<template>

    <section class="Hui-article-box">
        <div class="page-container">
            <div class="title panel panel-default radius">
                <div class="panel-body">
                    <span class="f-15 fw-b">部门权限管理</span>
                </div>
            </div>
            <div class="inner_container clearfix">
                <div class="department_container f-l relative no-selected">
                    <div class="search_box mt-10">
                        <input id="searchInputAuths" type="text" placeholder="部门" class="input-text">
                        <button v-on:click="getDepartmentTree(1)" class="btn btn-success radius-r" type="button">
                            <i class="f-r Hui-iconfont">&#xe665;</i>
                        </button>
                    </div>
                    <div class="exp_container">
                        <ul class="expandComponents no-selected">
                            <exp :params="treeParams" :model="treeData" v-on:depart-click="departmentClick"
                                 v-on:dbl-click="departmentDblClick"></exp>
                        </ul>
                    </div>
                </div>
                <div class="auths_container">
                    <div class="top clearfix">
                        <div class="left f-l">
                            <span>{{ getDepartmentName(currentDepartment) }}</span>
                        </div>
                        <div class="f-l mt-20">app访问／使用权限配置</div>
                        <div class="right f-r mt-15 mr-30" @click="setSelected">
                            <a href="javascript:;" class="btn btn-primary radius">{{isSelected ? '取消修改权限' : '修改权限'}}</a>
                        </div>
                    </div>
                    <div class="content no-selected">
                        <div class="list">
                            <div v-for="item in currentDepartmentDetail" class="item">
                                <div class="icon"><img :src="item.ico" :alt="item.name"></div>
                                <div class="title fs-12" :title="item.name">{{ item.name }}</div>
                                <div @click="changeSelected(item)" class="selected"
                                     :class="{sel: isSelected, can: item.is_allow}">
                                    <i class="Hui-iconfont" v-if="item.is_allow">&#xe6a7;</i>
                                </div>
                            </div>
                        </div>
                        <div class="btns clearfix pd-10 b-box" v-if="isSelected">
                            <a v-if="currentDepartment.id" v-on:click="save(true)"
                               class="btn btn-primary radius f-r mr-10">保存并应用到所有子部门</a>
                            <a v-if="currentDepartment.id" v-on:click="save(false)"
                               class="btn btn-primary radius f-r mr-10">保存</a>
                            <a v-if="!currentDepartment.id" v-on:click="saveAll"
                               class="btn btn-primary radius f-r mr-10">应用到公司所有部门</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import exp from "../components/departmentExpands.vue";

    export default{
        ready () {

            this.getDepartmentTree(0, this.getCompanyDetail);

        },
        data: function () {
            return {
                itemsLoading: false,
                isSelected: false,
                isChanged: false, // 当前部门的修改是否已经设定
                treeData: {},
                treeParams: {
                    department_name: '',
                    add: false, // 是否允许添加
                    id: '', // 通过匹配 id , 加背景颜色 // 是否隐藏人数
                    hidePeople: false, // 是否隐藏人数
                    autoWidth: true, // 是否自动宽度 默认固定宽度250px
                },
                currentDepartment: {}, // 选定的当前部门
                currentDepartmentDetail: [], // 选定的当前部门
                companyDepartmentDetail: [], // 选定的当前部门
                search_department_name: '', // 搜索的权限部门输入内容
            }
        },
        methods: {
            // 获取
            getDepartmentTree: function (reset, callback = () => {
            }) {
                if (reset) {
                    this.search_department_name = $('#searchInputAuths').val();
                }
                this.itemsLoading = true;
                $.ajax({
                    url: base.gAjaxUrl.departmentTree,
                    type: 'GET',
                    data: {
                        department_name: this.search_department_name
                    }
                }).always((data)=> {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=> {
                        this.treeData = data;
                        callback();
                    });
                })
            },
            getCompanyDetail: function () {
                let id;
                let child = this.treeData.child;
                if (child && child.length) {
                    if (id = child[0].id) {
                        $.ajax({
                            url: base.gAjaxUrl.departmentsV4 + id + '/',
                            type: 'GET',
                        }).always((data)=> {
                            this.itemsLoading = false;
                            base.ajaxCallback(data, ()=> {
                                this.companyDepartmentDetail = this.getMenu(data.appmodels);
                                this.companyDepartmentDetail.forEach((item)=> {
                                    item.is_allow = false;
                                });
                                this.currentDepartmentDetail = JSON.parse(JSON.stringify(this.companyDepartmentDetail));
                            });
                        })
                    }
                }
            },
            getDepartmentDetail: function () {
                let id = this.currentDepartment.id;
                this.itemsLoading = true;
                $.ajax({
                    url: base.gAjaxUrl.departmentsV4 + id + '/',
                    type: 'GET',
                }).always((data)=> {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=> {
                        this.currentDepartmentDetail = this.getMenu(data.appmodels);
                    });
                })
            },
            save: function (flag, callback = ()=> {}) { // 设置到某个部门
                if(!this.isChanged) {
                    layer.msg("权限尚未修改！", {icon: 7, time: 1500});
                    return;
                }
                this.itemsLoading = true;
                $.ajax({
                    url: base.gAjaxUrl.departmentsV4 + this.currentDepartment.id + '/set_models/',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        models: this.getAuthsId(),
                        apply_childs: flag,
                    })
                }).always((data)=> {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=> {
                        layer.msg("设置成功", {icon: 1, time: 1500});
                        this.isChanged = false;
                        callback();
                    });
                })
            },
            saveAll: function (callback = ()=> {}) { // 设置到全公司所有部门
                if(!this.isChanged) {
                    layer.msg("权限尚未修改，无需保存！", {icon: 7, time: 1500});
                    return;
                }
                layer.confirm("确定应用权限到全公司所有部门？", {
                    btn: ['是', '否'],
                    btn1: () => {
                        this.itemsLoading = true;
                        $.ajax({
                            url: base.gAjaxUrl.setAllAuths,
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify({
                                models: this.getAuthsId(),
//                                departments: [], // 表示设定制定的部门id
                            })
                        }).always((data)=> {
                            this.itemsLoading = false;
                            console.log("设置成功--------");
                            base.ajaxCallback(data, ()=> {
                                layer.msg("设置成功", {icon: 1, time: 1500});
                                this.currentDepartmentDetail = JSON.parse(JSON.stringify(this.companyDepartmentDetail));
                                this.isChanged = false;
                                callback();
                            });
                        });
                    },
                    btn2: (index) => {
                        callback();
                    },
                });
            },
            getAuthsId: function () {
                var arr = [];
                this.currentDepartmentDetail.forEach((item) => {
                    if (item.is_allow) arr.push(item.id);
                });
                return arr;
            },
            // 返回的数据有一部分是模块类型的数据 如：[智慧出行] [智慧生活] [智慧办公]
            getMenu: function (target) {
                var arr = [];
                target.forEach((item) => {
                    if (item.is_menu) arr.push(item)
                });
                return arr;
            },
            // 开启 权限修改 功能
            setSelected: function () {
                if (this.isChanged) {
                    this.departmentClick(this.currentDepartment, () => {
                        this.isSelected = !this.isSelected;
                    });
                } else {
                    this.isSelected = !this.isSelected;
                }
            },
            // 点击 选择/取消选择模块功能
            changeSelected: function (item) {
                if (this.isSelected) {
                    item.is_allow = !item.is_allow;
                    this.isChanged = true;
                } else {
                    layer.msg("请先开启【修改权限】!", {icon: 2, time: 1500});
                }
            },
            departmentClick: function (data, callback) {
//                console.log("departmentEmployee - departmentClick：", data);
                if(typeof callback != 'function') {
                    if(data.id === this.currentDepartment.id) {
                        return;
                    }
                    callback = ()=>{};
                }
                let sFun = () => {
                    this.treeParams.id = data.id || '';
                    this.currentDepartment = data;
                    layer.closeAll();
                    this.isChanged = false;
                    if (data.id) {
                        this.getDepartmentDetail();
                    } else {
                        this.currentDepartmentDetail = JSON.parse(JSON.stringify(this.companyDepartmentDetail));
                    }
                    callback();
                };
                if (this.isChanged) {
                    layer.confirm("是否保存当前部门的权限修改？", { //
                        btn: ['是', '否'],
                        btn1: () => { // 保存修改
                            if (this.currentDepartment.id) { // 是否选择了部门
                                if (this.currentDepartment.child && this.currentDepartment.child.length) { // 该部门有子部门
                                    layer.confirm("是否将修改应用到所有子部门", {
                                        btn: ['是', '否'],
                                        btn1: () => {
                                            this.save(true, () => {
                                                sFun();
                                            });
                                        },
                                        btn2: () => {
                                            this.save(false, () => {
                                                sFun();
                                            });
                                        },
                                    });
                                } else { // 该部门没有子部门
                                    this.save(false, () => {
                                        sFun();
                                    });
                                }
                            } else { // 不选择部门的情况下为全公司
                                this.saveAll(() => {
                                    sFun();
                                });
                            }
                        },
                        btn2: () => { // 不保存修改
                            sFun();
                        },
                    });
                } else {
                    sFun();
                }
            },
            departmentDblClick: function (data) {
//                console.log("departmentEmployee - departmentDblClick：", data);
            },
            // 递归获取某个部门的所有部门名称
            // 返回： 1级/2级/.../某个部门
            getDepartmentName: function (depart) {
                var _name = '';

                function getName(obj) {
                    if (obj.id == depart.id) { // 找到obj对象中的depart对象
                        _name = obj.department_name;
                        return true;
                    }
                    for (var key in obj) {
                        var item = obj[key];
                        if (item && typeof item === 'object' && obj.hasOwnProperty(key)) {
                            if (getName(item)) {
                                if (obj.department_name) {
                                    _name = obj.department_name + "/" + _name;
                                }
                                return true;
                            }
                        }
                    }
                }

                getName(this.treeData);
                return _name || this.treeData.company_name || '--';
            }
        },
        components: {
            exp,
        }
    }
</script>


<!-- 标签规则 -->
<style lang="less" rel="stylesheet/less" scoped>

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
            .department_container {
                width: 300px;
                height: 100%;
                border: 1px solid #ccc;
                overflow: hidden;
                box-sizing: border-box;
                padding: 10px;
                .search_box {
                    display: flex;
                    #searchInputAuths {
                        flex: 1;
                    }
                    .btn {
                        width: 40px;
                    }
                }
                .exp_container {
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 61px;
                    bottom: 0;
                    overflow: auto;
                }
            }
            .auths_container {
                box-sizing: border-box;
                position: absolute;
                top: 0;
                left: 300px;
                right: 0;
                bottom: 0;
                overflow: auto;
                border: 1px solid #ccc;
                border-left: 0 none;
                .top {
                    height: 60px;
                    line-height: 20px;
                    font-size: 14px;
                    border-bottom: 1px solid #ccc;
                    overflow: auto;
                    .left {
                        border-left: 5px solid #00B4EE;
                        padding-left: 10px;
                        margin: 20px;
                        max-width: 500px;
                        min-height: 20px;
                    }
                    .right {
                    }
                }
                .content {
                    position: absolute;
                    top: 61px;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    .list {
                        box-sizing: border-box;
                        overflow: auto;
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 61px;
                        display: flex;
                        align-content: flex-start;
                        .item {
                            margin-top: 20px;
                            margin-left: 20px;
                            width: 100px;
                            height: 120px;
                            .icon {
                                width: 60px;
                                height: 60px;
                                margin: 0 auto;
                                img {
                                    width: 100%;
                                    height: 100%;
                                    display: block;
                                }
                            }
                            .title {
                                text-align: center;
                                text-overflow: ellipsis;
                                overflow: hidden;
                                white-space: nowrap;
                                line-height: 30px;
                            }
                            .selected {
                                text-align: center;
                                border-radius: 50%;
                                width: 26px;
                                height: 26px;
                                margin: 0 auto;
                                box-sizing: border-box;
                                border: 1px solid #ccc;
                                font-size: 14px;
                                font-weight: bold;
                                color: #fff;
                                cursor: pointer;
                                &.sel.can {
                                    background-color: #5a98de;
                                }
                                &.can {
                                    background-color: #ccc;
                                }
                            }
                        }
                    }
                    .btns {
                        position: absolute;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        height: 61px;
                        box-sizing: border-box;
                    }
                }
            }
        }
        .panel-body {
            padding: 8px;
        }
    }

</style>
