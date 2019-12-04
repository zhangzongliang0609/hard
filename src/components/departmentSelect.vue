
<!--
引入方式：
<sel :depart="parentDepartment" @set="setParent"></sel>
-->

<template>
    <div class="department_select_container" @mouseleave="departmentEnter(false)" @mouseenter="departmentEnter(true)">
        <input v-if="departmentItem.length === 0 && type === 'add'" disabled type="text" class="input-text"
               value="无可选择部门">
        <input v-else autocomplete="off" @click="departmentClick" v-model="departmentSelectedName" type="text" class="input-text" value="" placeholder="" name="department">
        <i v-show="departmentSelectedName !== ''" class="empty-icon Hui-iconfont" @click="emptySearch()">&#xe60b;</i>
        <div class="departmentListBox" style="display: none">
            <div v-bind:title="item.department_name"
                 v-for="item in departmentItem | filterBy departmentSelectedName in 'department_tree'"
                 @click="setDepartmentValue(item)" class="departmentListItem">{{item.department_tree}}
            </div>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">

    import * as base from '../assets/js/base.js';

    export default{
        ready () {
            let that = this;
            //验证
            //获取部门列表
            $.ajax({
                url: `${base.gAjaxUrl.departments}?page=1&page_size=9999999`,
                type: 'GET',
            }).always((data)=> {
                this.departmentItem = data || [];
            })
        },
        props: ['depart'],
        data: function () {
            return {
                departmentSelected: '',
                departmentSelectedName: '',
                departmentItem: [],
                isDepartmentFocus: '', // 是否显示部门列表
            }
        },
        methods: {
            departmentClick: function () {
                if (this.isDepartmentFocus) {
                    $(".departmentListBox").show();
                }
            },
            departmentEnter: function (flag) {
                this.isDepartmentFocus = flag;
                if(!flag) {
                    $(".departmentListBox").hide();;
                    this.$dispatch('set', this.getDepartmentId(this.departmentSelectedName));
                }
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
            // 清除搜索输入框
            emptySearch:function(){
                this.departmentSelectedName = '';
                $(".departmentListBox").show();
            }
        },
    }
</script>


<style lang="less" scoped rel="stylesheet/less">
</style>
