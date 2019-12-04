<template>
<div class="layui-layer layui-anim layui-layer-page layui-modify">
    <div class="layui-layer-title">{{title || '选择员工'}}</div>
    <div class="layui-layer-content pd-20"> 
        <div class="layui-layer-wrap">
            <div class="text-l clearfix">
                <input id="searchInput" type="text"  placeholder="姓名/工号/电话/部门/职位" style="width:250px" class="f-l input-text">
                <button v-on:click="getList(1)" class="btn btn-success" type="button"><i class="f-r Hui-iconfont">&#xe665;</i></button>
                <button v-if="isShowAdd" v-on:click="addPrivate(1)" class="btn btn-primary radius f-r" type="button">新增员工/车辆</button>
            </div>
            <table class="table table-border table-bordered table-hover table-bg table-sort row">
                <thead>
                    <tr class="text-c">
                        <th width="25">选择</th>
                        <th width="50">头像</th>
                        <th width="70">姓名/性别</th>
                        <th>部门/职业</th>
                        <th width="100">工号</th>
                        <th width="100">电话</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="text-c" v-for="item in items">
                        <td>
                            <input v-if="type != 'private'" type="checkbox" :checked="item | checkItem"  class="radio-wh"   @click="clickCheckbox(item)">
                            <input v-if="type == 'private'" type="radio" name="radio" class="radio-wh" @click="clickRadio(item)">
                        </td>
                        <td><img class="avatar" v-bind:src="item.avatar?item.avatar:'./src/assets/images/avatar-default.jpg'"/></td>
                        <td>{{item.staff_vo ? item.staff_vo.real_name : item.real_name}}/{{item.staff_vo ? item.staff_vo.sex==1? '男': '女' : item.sex==1? '男': '女' }}</td>
                        <td>{{item.staff_vo ? item.staff_vo.department_vo.department_name : item.department_vo.department_name}}/{{ item.staff_vo ? item.staff_vo.position : item.position}}</td>
                        <td>{{item.staff_vo ? item.staff_vo.job_number : item.job_number}}</td>
                        <td>{{item.staff_vo ? item.staff_vo.phone : item.phone}}</td>
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
    <div v-if="type != 'repairmen'" class="layui-layer-btn" v-on:click="next"><a class="layui-layer-btn0">添加</a></div>
    <div v-if="type == 'repairmen'" class="layui-layer-btn" v-on:click="save"><a class="layui-layer-btn0">保存</a></div>
</div>
<div class="layui-layer-shade"></div>
</template>
 
<style lang="less" scoped>
.avatar{
    width: 50px;
}
.radio-wh{
    width: 20px;
    height: 20px;
    cursor: pointer;
}
    .layui-modify{
        z-index: 999;
    }
</style>

<script type="text/ecmascript-6">
import * as base from '../assets/js/base.js';

    let staffsOps = null;

    export default{
        ready () {
            if(this.type && this.type != "repairmen"){
                this.isShowAdd = true;
            }

            staffsOps = {
                param:{
                    search:'',
                    page:1,
                    page_size:10,
                }
            };

            base.verticalCenter('.layui-modify');

            this.getList(1);
            this.selectedEmployees = this.members ? [].concat(this.members) : [];
        },
        props:['type','title','members'],
        data:function(){
            return {
                noData:false,
                items: [],
                searchInput:'',
                selectedEmployees:[],
                isShowAdd:false,
            }
        },
        methods: {
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
                let ajaxUrl = this.type == 'repairmen' ? base.gAjaxUrl.repairmen : base.gAjaxUrl.staffs;
                $.ajax({
                    url: ajaxUrl,
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
            save:function(){
                if(this.selectedEmployees.length == 0){
                    layer.msg('请先选择员工',{icon:2,time:1500})
                    return
                }
                console.log(this.selectedEmployees.length);
                this.$dispatch('dialog-save', this.selectedEmployees);
                // console.log('selected_emoloyee is', this.selected_employee.real_name)
            },
            next:function(){
                if(this.selectedEmployees.length == 0){
                    layer.msg('请先选择员工',{icon:2,time:1500})
                    return
                }
                this.$dispatch('did-selected-employee', this.selectedEmployees);
                this.$dispatch('dialog-next');
                this.$dispatch('dialog-save');
            },
            addPrivate:function () {
                this.$dispatch('dialog-add');
            },
            clickCheckbox:function (value) {
                for (let i = 0,len = this.selectedEmployees.length; i < len; i++) {
                    if(this.selectedEmployees[i].id == value.id){
                        this.selectedEmployees.splice(i,1);
                        return
                    }
                }
                this.selectedEmployees.push(value);
            },
            clickRadio:function(item){
                this.selectedEmployees = item;
            }
        },
        filters:{
            checkItem:function (value) {
                for (let i = 0,len = this.selectedEmployees.length; i < len; i++) {
                    if(this.selectedEmployees[i].id == value.id){
                        return true
                    }

                }
                return false;

            }
        }
    }
</script>
