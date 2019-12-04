<template>
<div class="layui-layer layui-anim layui-layer-page layui-modify">
    <div class="layui-layer-title">{{title}}</div>
    <div class="layui-layer-content">
        <!--<form id="J-layer-form" class="form form-horizontal layui-layer-wrap">-->
            <!--<input type="hidden" value="" name="staff">-->
            <!--<input type="hidden" value="" name="charge_types">-->
        <!--</form>-->
        <div class="bk-gray radius mt-10">
            <div class="clear">
                <div class="text-l clearfix f-l mr-15 mt-10 ml-10">
                    <input v-model="searchInput" type="text"  placeholder="名字/工号/手机号" style="width:200px" class="f-l input-text">
                    <button v-on:click="getList(1)" class="btn btn-success" type="button"><i class="f-r Hui-iconfont">&#xe665;</i></button>
                </div>
                <div class="f-l mt-10 clearfix">
                    <span class="f-l lh-30">选择部门：</span>
                    <!--<span class="select-box f-l w-200">-->
                        <!--<select class="select" v-model="selectDepartment">-->
                            <!--<option v-for="item in data" value="{{item.id}}">{{item.department_name}}</option>-->
                        <!--</select>-->
                    <!--</span>-->
                    <div class="departmentInput mr-5">
                        <div class="department_select_container" @mouseleave="departmentEnter(false)" @mouseenter="departmentEnter(true)">
                            <input v-if="departmentItem.length === 0" disabled type="text" class="input-text" value="无可选择部门">
                            <input v-else autocomplete="off" @click="departmentClick" v-model="departmentSelectedName" type="text" class="input-text" value="" placeholder="" name="department">
                            <i v-show="departmentSelectedName !== ''" class="empty-icon Hui-iconfont" @click="emptySearch()">&#xe60b;</i>
                            <div class="departmentListBox" style="display: none">
                                <div v-bind:title="item.department_tree" v-for="item in departmentItem | filterBy departmentSelectedName in 'department_tree'" @click="setDepartmentValue(item)" class="departmentListItem">{{item.department_tree}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-layer-btn place f-r" v-on:click="save"><a class="layui-layer-btn0" v-if="type!='check'">确认选择</a></div>
            </div>
            <table class="table table-border table-bg table-striped">
                <thead class="text-c">
                    <tr>
                        <th>选择</th>
                        <th>姓名/性别</th>
                        <th>部门/职位</th>
                        <th>工号</th>
                        <th>电话</th>
                    </tr>
                </thead>
                <tbody class="text-c">
                    <tr v-for="item in items">
                        <td><input type="radio" v-model="selectApprovers" value="{{item.id}}"></td>
                        <td>{{item.real_name}}/{{item.sex==1? '男': '女';}}</td>
                        <td>{{item.department_vo.department_name}}/{{item.position}}</td>
                        <td>{{item.job_number}}</td>
                        <td>{{item.phone}}</td>
                    </tr>
                </tbody>
            </table>
            <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
        </div>
        <div id="J-page" class="m-page" v-show="!noData"></div>
    </div>
    <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
</div>
<div class="layui-layer-shade"></div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>

<style lang="less">
    .layui-modify .layui-layer-btn.place{
        position: relative;
    }
    .select-box.w-200{
        width: 200px;
    }
    .departmentInput {
        width: 200px;
        display: inline-block;
    }
</style>
<script>
import * as base from '../assets/js/base.js';

    let itemOps = null;

    export default{
        ready () {
            itemOps = {
                param:{
                    search:'',
                    page:1,
                    page_size:10,
                }
            };
            let that = this;
            let getData = this.data;
            this.departmentItem = getData;
            this.selectDepartment = getData[0].id;

            itemOps.param.page = 1;

            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-page',tpageToal,itemOps.param.page,count)
            });

            base.verticalCenter('.layui-modify');

        },
        props: ['title','type','data'],
        data:function(){
            return {
                noData: false,
                searchInput: '',
                items: [],
                departmentItem:[],
                departmentSelected: '',
                departmentSelectedName: '',
                selectApprovers: '',
            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            save:function(){
                let that = this;
                if(this.selectApprovers.length == 0){
                    layer.msg('请选择审批人',{icon:2,time:1000});
                    return;
                }

                this.departmentSelected = this.getDepartmentId(this.departmentSelectedName);
                if(!this.departmentSelected) {
                    console.log(this.departmentSelected);
                    layer.msg('部门名称不正确',{icon:2,time:1000});
                    return;
                }
                let ajaxAddData = {
                    approver_type: 2,
                    staff: this.selectApprovers,
                    department: this.departmentSelected,
                };
                $.ajax({
                    url: base.gAjaxUrl.approvers,
                    type:'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(ajaxAddData),
                })
                .always(function(data) {
                    base.ajaxCallback(data,function(){
                        layer.msg('提交成功',{icon:1,time:1000});
                        that.$dispatch('dialog-save');
                    });
                });
            },
            //初始化分页
            initPage:function(obj,tpageToal='4',current='1',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:current,
                    count:count,
                    callback:(p)=>{
                        itemOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            //获取员工列表
            getList:function(reset=0){
                let that = this;
                //重置第一页
                if(reset){
                    itemOps.param.page = 1
                }

                this.queryAjax((tpageToal='4',count='0')=>{
                    that.initPage('#J-page',tpageToal,itemOps.param.page,count)
                });
            },
            queryAjax:function(callback=function(){}){
                //修改参数
                this.itemsLoading = true;
                itemOps.param.search = this.searchInput;

                $.ajax({
                    url: base.gAjaxUrl.staffs,
                    type: 'GET',
                    data:itemOps.param
                })
                .always((data)=>{
                    base.ajaxCallback(data,()=>{
                        this.itemsLoading = false;
                        let resultData = data.results;
                        this.items = resultData;
                        if(resultData && resultData.length){
                            this.noData = false;
                            //回调
                            callback(data.num_pages,data.count);
                        }else{
                            this.noData = true;
                        }
                    });
                })
            },
            departmentClick: function () {
                if(this.isDepartmentFocus) {
                    $(".departmentListBox").show();
                }
            },
            // 清除搜索输入框
            emptySearch:function(){
                this.departmentSelectedName = '';
                $(".departmentListBox").show();
            },
            departmentEnter: function (flag) {
                this.isDepartmentFocus = flag;
                !flag && $(".departmentListBox").hide();
            },
            setDepartmentValue: function (item) {
                this.departmentSelectedName = item.department_tree;
                this.departmentSelected = item.id;
                $(".departmentListBox").hide()
            },
            getDepartmentId: function (val) {
                var id = '';
                this.departmentItem.forEach(function (item) {
                    if(item.department_tree == val) {
                        id = item.id;
                    }
                });
                return id;
            },
        }
    }
</script>
