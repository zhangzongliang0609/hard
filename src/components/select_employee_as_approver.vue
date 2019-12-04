<template>
<div class="layui-layer layui-anim layui-layer-page layui-modify">
    <div class="layui-layer-title">选择员工</div>
    <div class="layui-layer-content pd-20">
        <div class="layui-layer-wrap">
            <div class="row cl">
                <span class="f-l">请选择审批部门:</span>
                <div class="formControls f-l col-4 ml-5">
                    <!--<span  id="departmentSelected" class="select-box">-->
                    <!--<select v-model="departmentSelected" name="department" class="select">-->
                    <!--<option value="" selected="">请选择审批部门</option>-->
                    <!--&lt;!&ndash; <option value="ALL" selected="">全部</option> &ndash;&gt;-->
                    <!--<option v-bind:value="item.id" v-for="item in departmentItem">{{item.department_name}}</option>-->
                    <!--</select>-->
                    <!--</span>-->
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
            <div  class="text-l clearfix mt-10">
                <input id="searchInput"  type="text"  placeholder="姓名/工号/电话/部门/职位" style="width:250px" class="f-l input-text">
                <button  v-on:click="getList(1)" class="btn btn-success" type="button"><i class="f-r Hui-iconfont">&#xe665;</i></button>
            </div>
            <table class="table table-border table-bordered table-hover table-bg table-sort row">
                <thead>
                    <tr class="text-c">
                        <th id="selected_employee" width="25">选择</th>
                        <th width="50">头像</th>
                        <th width="70">姓名/性别</th>
                        <th>部门/职业</th>
                        <th width="100">工号</th>
                        <th width="100">电话</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="text-c" v-for="item in items">
                        <td><input class="radio-wh" type="radio" :value="item" name="" v-model="selected_employee">{{item.avatar}}
                        </td>
                        <td><img class="avatar" v-bind:src="item.avatar?item.avatar:'./src/assets/images/avatar-default.jpg'"/></td>
                        <td>{{item.real_name}}/{{item.sex==1? '男': '女';}}</td>
                        <td>{{item.department_vo.department_name}}/{{item.position}}</td>
                        <td>{{item.job_number}}</td>
                        <td>{{item.phone}}</td>
                    </tr>
                </tbody>
            </table>
            <div id="J-page" class="m-page row" v-show="!noData"></div>
            <div class="no-data text-c mt-50 row" v-if="noData">没有相关数据</div>
        </div>
    </div>
    <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
    <div id="addBtn" class="layui-layer-btn" v-on:click="next"><a class="layui-layer-btn0">添加</a></div>
</div>
<div class="layui-layer-shade"></div>
</template>

<style lang="less">
.avatar{
    width: 50px;
}
.radio-wh{
    width: 20px;
    height: 20px;
    cursor: pointer;
}
</style>

<script type="text/ecmascript-6">

import * as base from '../assets/js/base.js';

    let staffsOps = null;
    let departmentOps = null;

    export default{
        ready () {
            let that = this;
            staffsOps = {
            param:{
                search:'',
                page:1,
                page_size:10,
                }
            };
            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-page',tpageToal,count)
            });

            departmentOps = {
                page:1,
                page_size:999999,
            };
            // this.queryAjax((tpageToal='4',count='0')=>{
            //     this.initPage('#J-page',tpageToal,staffsOps.param.page,count)
            // });
            //获取部门列表
            $.ajax({
                url: `${base.gAjaxUrl.departments}?page=${departmentOps.page}&page_size=${departmentOps.page_size}`,

                type: 'GET',
            })
            .always((data)=>{
                this.departmentItem = data || [];
                // this.init();
            });
            setTimeout(function(){
                that.init();
            },200);

             // this.init();
        },

        data:function(){
            return {
                noData:false,
                items: [],
                searchInput:'',
                selected_employee:'',
                departmentSelected:'',
                departmentSelectedName:'',
                departmentItem:[],
            }
        },
        methods: {
            init: function(){
                // 该函数是用来判断是否是第一次进入该新功能或页面

                // console.log('初始状态0:')
                // console.log(localStorage.approverPromptFlag);

                //判断是否是第一次进入该新功能或页面从而弹出新功能的提示
                if(localStorage.approverSelectPromptFlag == 'true'){
                    let arrObj = [$('#searchInput'),$('#departmentSelected'),$('#selected_employee'),$('#addBtn'),];
                    let arrTitle = ['审批人过多时可以通过搜索 姓名/工号/电话/部门/职位','先在这里添加审批人所在部门','然后在下面一列中点击选择相关的审批人','然后点击添加按钮就可添加成功'];
                    var promptTypes = ['approverSelectPromptFlag',];
                    // console.log(promptTypes[0]);
                    $.guidance({
                        obj:arrObj,
                        title:arrTitle,
                        flag:promptTypes,
                    });
                }
            },
            //初始化分页
            initPage:function(obj,tpageToal='4',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:1,
                    count:count,
                    callback:(p)=>{
                        staffsOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax:function(callback=function(){}){
                //修改参数
                staffsOps.param.search = this.searchInput;

                $.ajax({
                    url: base.gAjaxUrl.staffs,
                    type: 'GET',
                    data:staffsOps.param
                })
                .always((data)=>{
                    base.ajaxCallback(data,()=>{
                        let resultData = data.results;
                        this.items = resultData;
                        if(resultData.length){
                            this.noData = false;
                            //回调
                            callback(data.num_pages,data.count);
                        }else{
                            this.noData = true;
                        }
                    });
                })
            },
            //获取列表
            getList:function(reset=0){
                //重置第一页
                if(reset){
                    this.searchInput= $("#searchInput").val();
                    staffsOps.param.page = 1
                }
                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-page',tpageToal,count)
                });
            },
            close:function(){
                this.$dispatch('dialog-close');
            },
            next:function(){
                this.departmentSelected = this.getDepartmentId(this.departmentSelectedName);
                if(!this.departmentSelected) {
                    layer.msg("部门不存在",{icon: 2, time: 1000})
                    return;
                }
                if(!this.selected_employee) {
                    layer.msg("请选择人员",{icon: 2, time: 1000})
                    return;
                }
                this.$dispatch('did-selected-employee', this.selected_employee);
                this.$dispatch('did-selected-department', this.departmentSelected);
//                this.$dispatch('dialog-next');
                this.$dispatch('dialog-save');
            },
            departmentClick: function () {
                if(this.isDepartmentFocus) {
                    $(".departmentListBox").show();
                }
            },
            // 清除搜索输入框
            emptySearch:function(){
                this.departmentSelectedName = '';
                $(".departmentListBox").show()
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
            }

        }
    }
</script>
