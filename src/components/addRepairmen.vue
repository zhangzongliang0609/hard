<template>
<div class="layui-layer layui-anim layui-layer-page layui-modify">
    <div class="layui-layer-title">{{title}}</div>
    <div class="layui-layer-content">
        <div class="bk-gray radius mt-10">
            <div class="clearfix">
                <div class="text-l clearfix f-l mr-15 mt-10 ml-10">
                    <input v-model="searchInput" type="text"  placeholder="名字/工号/手机号" style="width:250px" class="f-l input-text">
                    <button v-on:click="getList(1)" class="btn btn-success" type="button"><i class="f-r Hui-iconfont">&#xe665;</i></button>
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
                        <td><input type="checkbox" v-model="selectRepairmen" value="{{item.id}}"></td>
                        <td>{{item.real_name}}/{{item.sex==1? '男': '女';}}</td>
                        <td>{{item.department_vo.department_name}}/{{item.position}}</td>
                        <td>{{item.job_number}}</td>
                        <td>{{item.phone}}</td>
                    </tr>
                </tbody>
            </table>
            <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
            <div class="m-loading" v-if="itemsLoading">
                <div class="cube1"></div>
                <div class="cube2"></div>
            </div>
        </div>
        <div id="J-page" class="m-page" v-show="!noData"></div>
    </div>
    <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
</div>
<div class="layui-layer-shade"></div>
</template>

<style lang="less">

</style>
<script>
import * as base from '../assets/js/base.js';

    let repairOps = null;

    export default{
        ready () {
            let that = this;
            let ajaxUrl = '';
            let ajaxType = '';
            let getData = this.data;

            base.verticalCenter('.layui-modify');

            repairOps = {
                param:{
                    search:'',
                    page:1,
                    page_size:10,
                }
            };

            this.queryAjax((tpageToal='4',count="0")=>{
                this.initPage('#J-page',tpageToal,repairOps.param.page,count)
            });

        },
        props: ['title','type','data'],
        data:function(){
            return {
                noData:false,
                searchInput:'',
                items: [],
                selectRepairmen: [],
            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            save:function(){
                let that = this;
                if(this.selectRepairmen.length == 0){
                    layer.msg('请选择维修工',{icon:2,time:1000});
                    return;
                }
                let ajaxAddData = {
                    staffs: this.selectRepairmen,
                };
                $.ajax({
                    url: base.gAjaxUrl.addRepairmen,
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
            initPage:function(obj,tpageToal='4',current='1',count="0"){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:current,
                    count:count,
                    callback:(p)=>{
                        repairOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            //获取员工列表
            getList:function(reset=0){
                let that = this;
                //重置第一页
                if(reset){
                    repairOps.param.page = 1
                }

                this.queryAjax((tpageToal='4',count="0")=>{
                    that.initPage('#J-page',tpageToal,repairOps.param.page,count)
                });
            },
            queryAjax:function(callback=function(){}){
                //修改参数
                this.itemsLoading = true;
                repairOps.param.search = this.searchInput;

                $.ajax({
                    url: base.gAjaxUrl.staffs,
                    type: 'GET',
                    data:repairOps.param
                })
                .always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
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
        }
    }
</script>
