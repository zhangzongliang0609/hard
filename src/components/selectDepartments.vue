<template>
    <div class="layui-layer layui-anim mSelectDepartmentContainer">
        <div class="layui-layer-title mTitle">选择部门</div>
        <div class="page-container">
            <div class="inner_container">
                <div class="departmentContainer relative">
                    <div class="fw-b containerTitle">选择：</div>
                    <!-- 左侧侧边栏组件 -->
                    <div class="containerInner relative">
                        <div class="searchBox mt-10">
                            <input id="departmentSelectSearchInput" autocomplete="off" type="text" placeholder="部门" class="input-text">
                            <button v-on:click="getList(1)" class="btn btn-success radius-r" type="button">
                                <i class="f-r Hui-iconfont">&#xe665;</i>
                            </button>
                        </div>
                        <div class="departmentList">
                            <ul class="expandComponents no-selected">
                                <exp :params="treeParams" :model="treeData" v-on:depart-click="departmentClick"
                                     v-on:dbl-click="departmentDblClick" v-on:del-click="departmentDelClick"></exp>
                                <!-- <li class="add" @click="addChild">+</li> -->
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="selectContainer relative">
                    <div class="fw-b containerTitle">已选：</div>
                    <div class="containerInner">
                        <div class="folderList">
                            <div class="relative folder" v-for="item in selectedDeparts">
                                {{getDepartmentName(item)}}
                                <span class="removeDepartment layui-layer-ico" @click="removeSelect(item)"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" @click="close()"></a>
        </span>
        <!--<a href="javascript:;" class="btn btn-primary saveBtn radius" @click="save">保存</a>-->
        <div class="mt-10 mb-10 clearfix pd-10 b-box btns">
            <a v-on:click="save" class="btn btn-primary radius">确认</a>
            <a v-on:click="close" class="btn btn-default radius">取消</a>
        </div>
    </div>
    <div class="layui-layer-shade"></div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import exp from "./departmentExpands.vue";


    export default{
        ready () {

            base.verticalCenter(".mSelectDepartmentContainer");
            this.queryAjax();
            this.selectedDeparts = [].concat(this.departs);

        },
        props: ['departs'],
        data: function () {
            return {
                currentDepartment: {},
                departmentData: {},
                departmentType: 'add',
                departmentTitle: '添加部门',
                showDepartment: false,
                showDelete: false,
                itemsLoading: false,
                treeData: {},// 部门树状结构数据
                allTreeData: {}, // 缓存的全部部门树状结构
                selectedDeparts: [],
                treeParams: {
                    department_name: '',
                    id: '', // 通过匹配 id , 加背景颜色
                    add: false, // 是否允许添加
                    hidePeople: true, // 是否隐藏人数
                    autoWidth: true, // 是否自动宽度 默认固定宽度220px
                },
                search_department_name: '',
            }
        },
        methods: {
            save: function () {
                if (this.selectedDeparts.length) {
                    this.$dispatch("sel-save", this.selectedDeparts);
                } else {
                    layer.confirm("确定不选择任何部门？", function (index) {
                        this.$dispatch("sel-save", []);
                        layer.close(index);
                    }.bind(this));
                }
            },
            close: function () {
                this.$dispatch("sel-close");
            },
            departmentClick: function (data) {
//                console.log("departmentClick：", data);
                if(data.company_name) {
                    layer.msg("如果要需选择全部部门，请到编辑页面进行勾选全部功能", {icon: 2, time: 2500});
                    return
                }
                this.currentDepartment = data;
                this.treeParams.id = data.id || '';
                if (this.selectedDeparts.indexOf(data) == -1) {
                    this.selectedDeparts.push(data);
                }
            },
            departmentDblClick: function (data) {
//                console.log("departmentClick：", data);
            },
            departmentDelClick: function (data) {
//                console.log("departmentClick：", data);
                this.$dispatch("edit-refresh");
            },
            queryAjax: function () {
                this.itemsLoading = true;
                //修改参数
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
                        if(this.search_department_name === '') {
                            this.allTreeData = data;
                        }
//                        console.log(this.treeData);
                    });
                })
            },
            //获取列表
            getList: function (reset = 0) {
                //重置第一页
                if (reset) {
                    this.search_department_name = $('#departmentSelectSearchInput').val();
                }
                this.queryAjax();
            },
            removeSelect: function (item) {
                this.selectedDeparts.every((ite, i) => {
                    if (item.id == ite.id) {
                        this.selectedDeparts.splice(i, 1);
                        return false // 阻断循环
                    }
                    return true // 继续循环
                });
            },
            // 递归获取某个部门的所有部门名称
            // 返回： 1级/2级/.../某个部门
            getDepartmentName: function (depart) {
                if (!depart.id) return ''
                var _name = '';
                var arr = [];

                function getName(obj) {
                    if (obj.id == depart.id) { // 找到obj对象中的depart对象
                        _name = obj.department_name;
                        arr.push(obj.id);
                        return true;
                    }
                    for (var key in obj) {
                        var item = obj[key];
                        if (item && typeof item === 'object' && obj.hasOwnProperty(key)) {
                            if (getName(item)) {
                                if (obj.department_name) {
                                    _name = obj.department_name + "/" + _name;
                                    arr.push(obj.id);
                                }
                                return true;
                            }
                        }
                    }
                }

                getName(this.allTreeData);
                return _name;
            }
        },
        components: {
            exp,
        },
    }
</script>

<!-- 标签规则 -->
<style lang="less" rel="stylesheet/less" scoped>
    .mSelectDepartmentContainer {
        width: 95%;
        height: 95%;
        min-width: 600px;
        max-width: 800px;
        min-height: 500px;
        max-height: 600px;
        background-color: #fff;
        z-index: 112;
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
                display: flex;
                .containerTitle {
                    border-left: 5px solid #00B4EE;
                    line-height: 18px;
                    height: 20px;
                    font-size: 16px;
                    margin: 10px 0;
                    padding-left: 10px;
                }
                .containerInner {
                    background-color: #f7f7f7;
                    flex: 1;
                    position: relative;
                    overflow: hidden;
                    .folderList {
                        position: absolute;
                        left: 0;
                        top: 0;
                        bottom: 0;
                        right: 0;
                        overflow: auto;
                    }
                }
                .departmentContainer {
                    width: 300px;
                    height: 100%;
                    overflow: auto;
                    box-sizing: border-box;
                    padding: 10px;
                    flex: 1;
                    margin: 0 10px;
                    display: flex;
                    flex-direction: column;
                    .searchBox {
                        display: flex;
                        box-sizing: border-box;
                        padding: 0 10px;
                        #searchInputInner {
                            flex: 1;
                        }
                        .btn {
                            width: 40px;
                        }
                    }
                    .departmentList {
                        position: absolute;
                        top: 51px;
                        left: 0;
                        bottom: 0;
                        right: 0;
                        overflow: auto;
                    }
                }
                .selectContainer {
                    width: 300px;
                    height: 100%;
                    box-sizing: border-box;
                    padding: 10px;
                    flex: 1;
                    margin: 0 10px;
                    display: flex;
                    flex-direction: column;
                    overflow: auto;
                    .folder {
                        margin: 10px;
                        word-break: break-all;
                        box-sizing: border-box;
                        padding: 0 36px 0 30px;
                        font-size: 14px;
                        line-height: 20px;
                        background: url("../assets/images/folder.png") no-repeat, #eee;
                        background-position: 6px 3px;
                        background-size: 18px 15px;
                        .removeDepartment {
                            position: absolute;
                            right: 10px;
                            top: 50%;
                            margin-top: -8px;
                            width: 16px;
                            height: 16px;
                            overflow: hidden;
                            background: url("../assets/js/skin/default/icon.png") no-repeat 3px -40px;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
        .saveBtn {
            position: absolute;
            right: 15px;
            bottom: 10px;
        }
        .btns {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            box-sizing: border-box;
            align-content: center;
            justify-content: center;
            .btn {
                flex: 1;
                max-width: 120px;
                margin: 0 20px;
            }
        }
    }
</style>
