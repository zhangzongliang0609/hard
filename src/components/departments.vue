<template>
    <div class="mContainer relative">
        <div v-on:click="edit" class="editBtn btn-primary mb-10 radius fs-20 c-fff tc">部门管理</div>
        <div class="searchBox">
            <input id="departmentSearchInput" type="text" placeholder="部门" style="width:250px" class="input-text">
            <button v-on:click="getList(1)" class="btn btn-success radius-r" type="button">
                <i class="f-r Hui-iconfont">&#xe665;</i>
            </button>
        </div>
        <div class="exp_box">
            <ul class="expandComponents">
                <exp :params="treeParams" :model="treeData" v-on:depart-click="departmentClick" v-on:dbl-click="departmentDblClick"></exp>
                <!-- <li class="add" @click="addChild">+</li> -->
            </ul>
        </div>
    </div>
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
            this.queryAjax();
        },
        data: function () {
            return {
                search_department_name: '',
                itemsLoading: false,
                treeData: {},
                treeParams: {
                    department_name: '',
                    id: '', // 通过匹配 id , 加背景颜色
                    add: false, // 是否允许添加
                    hidePeople: false, // 是否隐藏人数
                    autoWidth: false, // 是否自动宽度 默认固定宽度220px
                }
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
                this.$dispatch("edit");
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
                        this.$dispatch('tree-data',data)
                    });
                })
            },
            //获取列表
            getList: function (reset = 0) {
                //重置第一页
                if (reset) {
                    this.search_department_name = $.trim($('#departmentSearchInput').val());
                }
                this.queryAjax();
            },
            departmentClick: function (data) {
//                console.log("departClick", data.department_name);
                this.treeParams.id = data.id || '';
                this.treeParams.department_name = data.department_name;
                this.$dispatch("depart-click", data);
            },
            departmentDblClick: function (data) {
//                console.log("departmentDblClick", data.department_name);
                this.$dispatch("dbl-click", data);
            }

        },
        components: {
            exp
        }
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .mContainer {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        .editBtn {
            width: 100%;
            height: 40px;
            line-height: 40px;
            transition: all .3s ease;
            cursor: pointer;
        }
        .searchBox {
            display: flex;
            & > .btn {
                flex: 1;
            }
        }
        .exp_box {
            position: absolute;
            left: 0;
            right: 0;
            top: 90px;
            bottom: 0;
            overflow: auto;
        }
        .departmentTree {
            width: 100%;
        }
    }
</style>