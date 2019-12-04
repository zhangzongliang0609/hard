<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify mSelectDepartmentContainer">
        <div class="layui-layer-title mTitle">选择部门</div>
        <div class="page-container">
            <div class="inner_container">
                <div class="departmentContainer relative">
                    <div class="fw-b containerTitle">选择：</div>
                    <!-- 左侧侧边栏组件 -->
                    <div class="containerInner relative">
                        <div class="searchBox mt-10">
                            <input id="departmentSelectSearchInput" type="text" placeholder="部门" class="input-text">
                            <button v-on:click="getList(1)" class="btn btn-success radius-r" type="button">
                                <i class="f-r Hui-iconfont">&#xe665;</i>
                            </button>
                        </div>
                        <div class="departmentList">
                            <ul class="expandComponents no-selected">
                                <exp :params="treeParams" :model="treeData" v-on:depart-click="departmentClick"
                                     v-on:dbl-click="departmentDblClick" @double-click="itemDoubleClick" v-on:del-click="departmentDelClick"></exp>
                                <!-- <li class="add" @click="addChild">+</li> -->
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="selectContainer relative">
                    <div class="fw-b containerTitle">已选：</div>
                    <div class="containerInner">
                        <div class="relative folder" v-for="item in departsArr" track-by="$index">
                            {{getDepartmentName(item)}}
                            <span class="removeDepartment layui-layer-ico" @click="removeSelect($index)"></span>
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
</template>

<script type="text/ecmascript-6">
    import * as base from '../../assets/js/base.js';
    import exp from "./departmentExpands.vue";

    export default{
        ready () {

            this.queryAjax();
            this.departsArr = this.departsArr.concat(this.departs);
            this.currentDepartment = this.departsArr[0] || {};
            this.is_single = !!this.is_single;
            if(this.is_single) {
                this.departsArr.splice(1)
            }
            if(this.is_double_click){
                this.treeParams.doubleClick = true;
            }
        },
        props: ['departs', 'is_single',"is_double_click"],
        data: function () {
            return {
                currentDepartment: {},
                departmentData: {},
                departsArr: [], // 选择的部门列表
                showDepartment: false,
                showDelete: false,
                treeData: {},
                isSelectAll: false, // 是否选择了所有部门
                treeParams: {
                    department_name: '',
                    id: '', // 通过匹配 id , 加背景颜色
                    add: false, // 是否允许添加
                    hidePeople: true, // 是否隐藏人数
                    autoWidth: true, // 是否自动宽度 默认固定宽度220px
                },
                search_department_name: '',
                selectedDepartmentIdArr:[],
            }
        },
        methods: {
            close: function () {
                this.$dispatch("sel-close");
            },
            departmentClick: function (data) {
                if(data.company_name) { // 点击公司，表示全部
                    if(this.isSelectAll) {
                        this.departsArr = [];
                    } else {
                        this.selectAllDepartments();
                    }
                    this.isSelectAll = !this.isSelectAll;
                } else if(data.department_name) { // 部门
                    this.currentDepartment = data;
                    this.treeParams.id = data.id || '';
                    if(this.is_single) {
//                    this.departsArr[0] = data; // 无效
//                    this.departsArr = [data]; // 有效
                        this.$set('departsArr[0]', data); // 有效
                    } else {
                        !this.isInDepartments(data) && this.departsArr.push(data);
                    }
                }
            },
            // 部门双击,全选子部门
            itemDoubleClick:function(data){
                if(data.child){
                    this.departsArr = this.addDeparts(data.child, this.departsArr);
                }
            },
            // 选择所有的部门
            selectAllDepartments: function () {
                console.log("this.treeData: ", this.treeData);
                var arr = [];
                this.departsArr = [];
                this.departsArr = this.addDeparts(this.treeData.child, arr);
            },
            addDeparts: function (child, arr) {
                arr = arr || [];
                for(var i = 0, len = child.length; i < len; i++) {
                    var item = child[i];
                    if(this.isInDepartments(item)){
                        continue;
                    }
                    arr.push(item);
                    if(item.child && item.child.length) {
                        this.addDeparts(item.child, arr);
                    }
                }
                return arr
            },
            // 检测是否已经添加了这个部门，如果添加了就不要重复添加
            isInDepartments: function (data) {
                for(var i = 0, len = this.departsArr.length;  i < len; i++) {
                    if(data.id == this.departsArr[i].id) {
                        return true;
                    }
                }
                return false
            },
            departmentDblClick: function (data) {
               console.log("departmentClick：", data);
            },
            departmentDelClick: function (data) {
//                console.log("departmentClick：", data);
            },
            save: function () {
                if (this.departsArr.length) {
                    this.$dispatch("sel-save", this.departsArr);
//                    console.log("departsArr: ", this.departsArr);
                } else {
                    this.$dispatch("sel-save");
                    // layer.confirm("您未选择部门，确定关闭？", function (index) {
                    // layer.close(index);
                    // }.bind(this));
                }
            },
            queryAjax: function () {
                $.showLoading();
                //修改参数
                $.ajax({
                    url: base.gAjaxUrl.departmentTree,
                    type: 'GET',
                    data: {
                        department_name: this.search_department_name
                    }
                }).always((data)=> {
                    $.hideLoading();
                    base.ajaxCallback(data, ()=> {
                        this.treeData = data;
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
            removeSelect: function (index) {
                this.departsArr.splice(index, 1);
            },
            // 递归获取某个部门的所有部门名称
            // 返回： 1级/2级/.../某个部门
            getDepartmentName: function (depart) {
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
                                if(obj.department_name) {
                                    _name = obj.department_name + "/" + _name;
                                    arr.push(obj.id);
                                }
                                return true;
                            }
                        }
                    }
                }
                getName(this.treeData);
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
        width: 100%;
        height: 100%;
        min-width: 620px;
        max-width: 800px;
        min-height: 500px;
        max-height: 620px;
        background-color: #fff;
        z-index: 120;
        box-sizing: border-box;
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
                /*overflow: auto;*/
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
                    overflow-x: hidden;
                    overflow-y: auto;
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
                    .folder {
                        margin: 10px;
                        word-break: break-all;
                        box-sizing: border-box;
                        padding: 0 36px 0 30px;
                        font-size: 14px;
                        line-height: 20px;
                        background: url("../../assets/images/folder.png") no-repeat, #eee;
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
                            background: url("../../assets/js/skin/default/icon.png") no-repeat 3px -40px;
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
