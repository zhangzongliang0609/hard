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
                        <td><input type="radio" v-model="selectPrincioal" value="{{item.id}}"></td>
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

            this.queryAjax((tpageToal='4',count)=>{
                this.initPage('#J-page',tpageToal,count)
            });

        },
        props: ['title','type','data','level'],
        data:function(){
            return {
                noData:false,
                searchInput:'',
                items: [],
                selectPrincioal: [],
            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            save:function(){
                let that = this;
                if(this.selectPrincioal.length == 0){
                    layer.msg('请选择维修负责人',{icon:2,time:1000});
                    return;
                }
                let ajaxUrl = '',ajaxType = '';
                if(this.type == 'add'){
                    ajaxUrl = base.gAjaxUrl.vehicleRepairapprovers;
                    ajaxType = 'POST';
                }else{
                    ajaxUrl = `${base.gAjaxUrl.vehicleRepairapprovers}${this.data.id}/`;
                    ajaxType = 'PATCH';
                }
                let ajaxAddData = {
                    staff: this.selectPrincioal,
                    level: this.level,
                };
                $.ajax({
                    url: ajaxUrl,
                    type: ajaxType,
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
            initPage:function(obj,tpageToal='4',count=1){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:1,
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

                this.queryAjax((tpageToal='4',count)=>{
                    this.initPage('#J-page',tpageToal,count)
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
        }
    }
</script>
