<template>
    <div class="leftBar relative">
        <div class="clickItems">
            <div v-on:click="add" class="editBtn btn-primary radius fs-20 c-fff tc"><i class="Hui-iconfont">&#xe600;</i>添加部门</div>
            <div v-on:click="edit" class="editBtn btn-primary radius fs-20 c-fff tc">修改</div>
            <div v-on:click="delete" class="editBtn btn-primary radius fs-20 c-fff tc">删除</div>
        </div>
        <div class="searchBox mt-10">
            <input id="searchInputInner" type="text" placeholder="部门" class="input-text">
            <button v-on:click="getList(1)" class="btn btn-success radius-r" type="button">
                <i class="f-r Hui-iconfont">&#xe665;</i>
            </button>
        </div>
        <div class="departmentList">
            <ul class="expandComponents no-selected">
                <exp :params="treeParams" :model="treeData" v-on:depart-click="departmentClick" v-on:dbl-click="departmentDblClick" v-on:del-click="departmentDelClick"></exp>
                <!-- <li class="add" @click="addChild">+</li> -->
            </ul>
        </div>
        <div class="m-loading inner" v-if="itemsLoading">
            <div class="cube1"></div>
            <div class="cube2"></div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import exp from "./departmentExpands.vue";

    export default{
        ready () {

            this.queryAjax();
        },
        data: function () {
            return {
                itemsLoading: false,
                treeData: {},
                treeParams: {
                    department_name: '',
                    add: false, // 是否允许添加
                    id: '', // 通过匹配 id , 加背景颜色 // 是否隐藏人数
                    hidePeople: false, // 是否隐藏人数
                    autoWidth: true, // 是否自动宽度 默认固定宽度220px
                },
                currentDepartment: {},
                search_department_name: '',
            }
        },
        events: {
          "departmentChange": function () {
              this.getList(1);
          }
        },
        methods: {
            edit: function () {
//                console.log("edit");
                this.$dispatch("depart-edit");
            },
            add: function () {
//                console.log("add");
                this.$dispatch("depart-add",this.currentDepartment);
            },
            delete: function () {
                if(this.currentDepartment.id) {
                    console.log("delete", this.currentDepartment);
                    this.$dispatch("depart-delete");
                } else {
                    layer.msg("请先选择部门", {icon: 2, time: 1500});
                }
            },
            queryAjax: function () {
                this.itemsLoading = true;
                //修改参数
                $.ajax({
                    url: base.gAjaxUrl.departmentTree,
                    type: 'GET',
                    data: {
                        department_name: this.search_department_name,
                    }
                }).always((data)=> {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=> {
                        this.treeData = data;
                        // 如果对部门进行了修改，则需要修改父组件的currentDepartment事件
                        this.filterData();
                    });
                })
            },
            //获取列表
            getList: function (reset = 0) {
                //重置第一页
                if (reset) {
                    this.search_department_name = $('#searchInputInner').val();
                }
                this.queryAjax();
            },
            filterData (){
                let id = this.currentDepartment.id;
                if(id) {
                    console.log("this.treeData", this.treeData);
                    if(this.treeData.child && this.treeData.child.length) {
                        this.queryDepartment(this.treeData.child, id);
                    }
                }
            },
            queryDepartment (child, id) {
                for(let i = 0, len = child.length; i < len; i++) {
                    let depart = child[i];
                    if(depart.id == id) {
                        this.currentDepartment = depart;
                        this.$dispatch("depart-click", depart);
                        return true;
                    }
                    if(depart.child && depart.child.length) {
                        if(this.queryDepartment(depart.child, id)) return true;
                    }
                }
            },
            departmentClick: function (data) {
                this.currentDepartment = data;
                this.$dispatch("depart-click", data);
                this.treeParams.id = data.id || '';
                this.treeParams.department_name = data.department_name;
            },
            departmentDblClick: function (data) {
                this.$dispatch("dbl-click", data);
            },
            departmentDelClick: function (data) {
                this.$dispatch("del-click", data);
            },
        },
        components: {
            exp,
        }
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .leftBar {
        width: 100%;
        height: 100%;
        overflow: hidden;
        .clickItems {
            width: 100%;
            display: flex;
            justify-content: space-around;
            padding: 5px 0 15px;
            border-bottom: 1px solid #ccc;
            .editBtn {
                flex: 1;
                margin: 0 10px;
                height: 30px;
                line-height: 30px;
                transition: all .3s ease;
                cursor: pointer;
            }
        }
        .departmentList {
            position: absolute;
            top: 100px;
            left: 0;
            right: 0;
            bottom: 0;
            overflow: auto;
        }
        .searchBox {
            display: flex;
            #searchInputInner {
                flex: 1;
            }
            .btn {
                width: 40px;
            }
        }
    }
</style>