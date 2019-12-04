<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify mSelectStaffContainer">
        <div class="layui-layer-title">选择员工</div>
        <div class="m-page-container">
            <div class="inner_container clearfix">
                <div class="departmentContainer col-3 f-l relative no-selected">
                    <department :type="'black'" v-on:depart-click="departmentClick"
                                v-on:dbl-click="departmentDblClick" v-on:tree-data="getTreeData"></department>
                </div>
                <div class="employeeContainer col-7 f-l">
                    <div class="employeeBox">
                        <div class="clearfix staff_search">
                            <div class="f-l clearfix search_box">
                                <select v-model="searchInput" class="searchInputType select f-l">
                                    <option value="real_name" selected>姓名</option>
                                    <option value="job_number">工号</option>
                                    <option value="card_number">员工卡号</option>
                                    <option value="phone">电话</option>
                                    <option value="position">职位</option>
                                    <option value="education">学历</option>
                                </select>
                                <input id="searchInput" class="f-l input-text" type="text" placeholder=""
                                       style="width:250px">
                                <button v-on:click="getList(1)" class="btn btn-success f-l radius-r" type="button"><i
                                        class="f-r Hui-iconfont"> &#xe665;</i></button>
                            </div>
                        </div>
                        <div class="table_container">
                            <table class="fixedParent table table-border table-bordered table-hover table-bg table-sort">
                                <thead>
                                <tr class="text-c">
                                    <th width="70">姓名/性别</th>
                                    <th width="220">部门/职位/学历</th>
                                    <th width="100">工号</th>
                                    <th width="100">电话</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr class="text-c" v-for="item in items" @click="clickItem(item)">

                                    <td>{{item.real_name}}/{{item.sex==1? '男': '女'}}</td>
                                    <td>
                                        {{item.department_vo.department_name||"--"}}/{{item.position||"--"}}/{{item.education||"--"}}
                                    </td>

                                    <td>{{item.job_number}}</td>
                                    <td>{{item.phone}}</td>
                                </tr>
                                </tbody>
                            </table>
                            <div id="J-page" class="m-page" v-show="!noData"></div>
                            <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
                        </div>
                    </div>

                </div>
                <div class="name-list-container col-2 f-l">
                    <div class="name-list-box">
                        <div class="list-head cl">
                            <span class="blue-block f-l"></span>
                            <span class="f-l head-title">已选名单</span>
                        </div>
                        <div class="list">
                            <div v-for="data in selectedNameList" class="list-item">
                                <span>{{data.real_name || '--'}}</span>
                                <span class="delete-icon Hui-iconfont" @click="deleteSelected(data)">&#xe706;</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cl btn-box">
                <button class="btn bottom-btn btn-primary radius f-r mr-10 mb-10" v-on:click="confirm()">确定</button>
                <button class="btn bottom-btn btn-normal radius f-r mr-10 mb-10" v-on:click="close()">取消</button>
            </div>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;"
               v-on:click="close()"></a>
        </span>
    </div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
    <div class="layui-layer-shade"></div>
</template>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import department from '../components/departmentsTree.vue';

    let staffsOps = null;

    export default{
        ready () {
            base.verticalCenter(".mSelectStaffContainer")
            staffsOps = {
                param: {
                    page: 1,
                    page_size: 11,
                    real_name: '',
                    // department_name: '',
                    phone: '',
                    position: '',
                    job_number: '',
                    education: '',
                }
            };
            this.queryAjax((tpageToal = '4', count = '0')=> {
                this.initPage('#J-page', tpageToal, staffsOps.param.page, count)
            });

            this.selectedNameList = [].concat(this.list);
            this.is_single = !!this.is_single;
            if(this.is_single) {
                this.selectedNameList.splice(1)
            }

        },
        props: ['is_single', 'list'],
        data: function () {
            return {
                noData: false,
                itemsLoading: false,
                items: [],
                searchInput: 'real_name',
                currentDepartment: {}, // 选定的当前部门
                currentDepartmentValue: {}, // 用来做实时更新部门人数
                treeData: [],
                selectedNameList: [],
            }
        },
        methods: {
            clickItem: function (item) {
                for (let i = 0, len = this.selectedNameList.length; i < len; i++) {
                    if (item.id == this.selectedNameList[i].id) {
                        return
                    }
                }
                if(this.is_single) {
                    this.selectedNameList = [item];
                } else {
                    this.selectedNameList.push(item);
                }
            },
            deleteSelected: function (item) {
                this.selectedNameList = this.selectedNameList.filter((data)=> {
                    return data.id != item.id
                })
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
            queryAjax: function (callback = () => {}) {
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
                let that = this;
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
                this.queryAjax((tpageToal = '4', count = '0')=> {
                    that.initPage('#J-page', tpageToal, staffsOps.param.page, count)
                });
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
            close: function () {
                this.$dispatch("sel-close")
            },
            confirm: function () {

                this.$dispatch('sel-save', this.selectedNameList);
            }
        },
        watch: {
            currentDepartment: function (newVal, oldVal) {
                if (oldVal.department_name != '' && oldVal.department_name != newVal.department_name) {
                    this.currentDepartmentValue = newVal;
                    staffsOps.param.department = newVal.id ? newVal.id : '';
                    staffsOps.param.page = 1;
                    this.getList();
                }
            }
        },
        components: {
            department,
        }
    }
</script>

<!-- 标签规则 -->
<style lang="less" rel="stylesheet/less" scoped>

    .layui-layer-shade {
        left: -50%;
        width: 200%;
    }

    .bottom-btn {
        width: 100px;
    }

    .btn-box {
        position: absolute;
        right: 20px;
        bottom: 10px;
    }

    .layui-layer, .layui-layer-shade {
        position: absolute !important;
    }

    .layui-modify {
        z-index: 102;
    }

    .mSelectStaffContainer {
        width: 100%;
        height: 100%;
        min-width: 1000px;
        max-width: 1300px;
        min-height: 500px;
        max-height: 800px;
        .m-page-container {
            position: absolute;
            top: 43px;
            left: 0;
            bottom: 0;
            right: 0;
        }
    }

    .inner_container {
        position: absolute;
        top: 15px;
        left: 15px;
        bottom: 15px;
        right: 15px;
        overflow: auto;
        padding-bottom: 60px;
        box-sizing: border-box;
        .departmentContainer {
            /*width: 300px;*/
            height: 100%;
            border: 1px solid #ddd;;
            overflow: hidden;
            box-sizing: border-box;
            padding: 10px;
        }
        .employeeContainer {
            /*width: 700px;*/
            overflow: auto;
            height: 100%;
            padding-left: 10px;
            box-sizing: border-box;
            .employeeBox {
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                overflow: auto;
                border: 1px solid #ddd;
                padding: 10px;
                position: relative;
                .staff_search {
                }
                .table_container {
                    position: absolute;
                    top: 53px;
                    left: 10px;
                    bottom: 10px;
                    right: 10px;
                }
            }
        }
        .name-list-container {
            padding-left: 10px;
            height: 100%;
            overflow: auto;
            position: relative;
            .name-list-box {
                .list-head {
                    height: 52px;
                    border: 1px solid #dddddd;
                    border-radius: 5px 5px 0 0;
                    .blue-block {
                        height: 30px;
                        width: 10px;
                        background-color: #0099ff;
                        margin-left: 15px;
                        margin-top: 10px;
                    }
                    .head-title {
                        font-size: 20px;
                        line-height: 52px;
                        margin-left: 15px;
                    }
                }
                .list {
                    border: 1px solid #dddddd;
                    position: absolute;
                    left: 10px;
                    right: 0;
                    top: 53px;
                    bottom: 0;
                    padding: 10px;
                    overflow-y: auto;
                    box-sizing: border-box;
                    .list-item {
                        margin-top: 5px;
                        position: relative;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        background-color: #aaa;
                        color: #fff;
                        box-sizing: border-box;
                        padding: 0 15px;
                        &:first-child {
                            margin-top: 0;
                        }
                        .delete-icon {
                            cursor: pointer;
                            position: absolute;
                            right: 5px;
                            top: 50%;
                            font-size: 18px;
                            line-height: 18px;
                            margin-top: -9px;
                        }

                        .delete-icon:hover {
                            color: #dad6ff;
                            /*color:#fff;*/
                        }
                    }
                }
            }
        }
    }

    .panel-body {
        padding: 8px;
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

    .searchButton {
        margin-left: 160px;
    }
</style>