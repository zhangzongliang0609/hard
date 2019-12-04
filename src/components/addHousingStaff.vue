<template>
<div class="layui-layer layui-anim layui-layer-page layui-modify">
    <div class="layui-layer-title">{{title}}</div>
    <div class="layui-layer-content">
        <div class="bk-gray radius mt-10">
            <div class="text-l clearfix f-l pd-15">
                <input v-model="searchInput" type="text"  placeholder="名字/工号/手机号" style="width:250px" class="f-l input-text">
                    <button v-on:click="getList(1)" class="btn btn-success" type="button"><i class="f-r Hui-iconfont">&#xe665;</i></button>
            </div>
            <table class="fixedParent table table-border table-bg table-striped table-hover table-pointer">
                <thead class="text-c">
                    <tr>
                        <th>姓名/性别</th>
                        <th>部门/职位/学历</th>
                        <th>员工分组</th>
                        <th>工号</th>
                        <th>电话</th>
                    </tr>
                </thead>
                <tbody class="text-c">
                    <tr v-for="item in items" v-on:click="clickItem(item)">
                        <td>{{item.real_name}}/{{item.sex==1? '男': '女'}}</td>
                        <td>{{item.department_vo.department_name}}/{{item.position?item.position:'--'}}/{{item.education?item.position:'--'}}</td>
                        <td>
                            <div class="tag_container">
                                <span v-if="!item.tags.length">--</span>
                                <div @mouseenter="checkPosition($event, item.tags.length <= 1)" class="tag_box" v-if="item.tags.length">
                                    <div class="tag_item" :title="item.tags[0].name">
                                        {{item.tags[0].name}}
                                        <span class="tag_more" v-if="item.tags.length > 1">...</span>
                                    </div>
                                    <div class="tag_second_box_sign"></div>
                                    <div v-if="item.tags.length > 1" class="tag_second_box clearfix">
                                        <div v-for="tag in item.tags" class="tag_item f-l" title="{{tag.name}}">{{tag.name}}</div>
                                    </div>
                                </div>
                            </div>
                        </td>
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

<!-- 添加 -->
<add :title="dialogTitle" :type="dialogType" :parent="'arrange'" :data="dialogData" v-if="isShowAddDialog" v-on:dialog-close="addDialogClose" v-on:dialog-save="addDialogSave"></add>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>
<style lang="less" scoped>
    .tag_container {
        width: 80px;
        margin: 0 auto;
    }
    .table-pointer tr{
        cursor: pointer;
    }
</style>
<script>
import * as base from '../assets/js/base.js';
import add from "../components/arrangeRoom.vue";
// import add from "../components/choiceRoom.vue";

    let repairOps = null;

    export default{
        ready () {
            repairOps = {
                param:{
                    search:'',
                    page:1,
                    page_size:10,
                }
            };
            let that = this;
            let ajaxUrl = '';
            let ajaxType = '';
            let getData = this.data;

            base.verticalCenter('.layui-modify');

            this.queryAjax((tpageToal='4',count='1')=>{
                this.initPage('#J-page',tpageToal,repairOps.param.page,count)
            });

        },
        props: ['title','type','data'],
        data:function(){
            return {
                noData:false,
                itemsLoading:false,
                isShowAddDialog:false,
                items: [],
                searchInput: '',
                dialogTitle:'选择房间',
                dialogType:'',
                dialogData:''
            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            // save:function(){
            //     let that = this;
            //     let ajaxAddData = {
            //         staffs: this.selectRepairmen,
            //     };
            //     $.ajax({
            //         url: base.gAjaxUrl.addRepairmen,
            //         type:'POST',
            //         contentType: 'application/json',
            //         data: JSON.stringify(ajaxAddData),
            //     })
            //         .always(function(data) {
            //             base.ajaxCallback(data,function(){
            //                 layer.msg('提交成功',{icon:1,time:1000});
            //                 that.$dispatch('dialog-save');
            //             });
            //         });
            // },
            addDialogClose:function(data){
                this.isShowAddDialog = false;
            },
            addDialogSave:function(data){
                this.isShowAddDialog = false;
                this.$dispatch("dialog-save");
                //this.getList();
            },
            clickItem:function(item){
                this.dialogTitle='选择房间';
                this.dialogType='choice';
                console.log("this item");
                console.log(item);
                this.dialogData = item;
                this.isShowAddDialog = true;
            },
            //初始化分页
            initPage:function(obj,tpageToal='4',current='1',count='0'){
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
            //获取列表
            getList:function(reset=0){
                let that = this;
                //重置第一页
                if(reset){
                    repairOps.param.page = 1
                }

                this.queryAjax((tpageToal='4',count='0')=>{
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
            checkPosition: function (e, flag) {
                if(flag) return;
                let target = e.srcElement ? e.srcElement : e.target;
                let $this = $(target);
                if($this.hasClass("top") || $this.hasClass("bottom")) return;
                let $parent = $this.parents(".fixedParent");
                let $tagBox = $this.children(".tag_second_box");
                // $tagBox.offset().top + $tagBox.outerHeight() > $parent.offset().top + $parent.outerHeight() 判断向下不能显示完
                // $this.offset().top - $parent.offset().top < $this.find(".tag_second_box_sign").outerHeight() + $tagBox.outerHeight().outerHeight() 判断向上不能显示完
                if($tagBox.offset().top + $tagBox.outerHeight() > $parent.offset().top + $parent.outerHeight() && $this.offset().top - $parent.offset().top < $this.find(".tag_second_box_sign").outerHeight() + $tagBox.outerHeight()){
                    // 防止重复添加minHeight属性，选择添加最大值
                    var height = parseInt($parent.parent().css("minHeight"));
                    var currentHeight = $this.offset().top - $parent.offset().top + $this.find(".tag_second_box_sign").outerHeight() + $tagBox.outerHeight() + $this.parents("td").outerHeight();
                    var compensate = $parent.offset().top - $parent.parent().offset().top;
                    if(currentHeight > height && $parent.parents(".position_box").height() < currentHeight + compensate) $parent.parent().css({minHeight: currentHeight + compensate});
                    $this.addClass("bottom");
                } else if($tagBox.offset().top + $tagBox.outerHeight() + $this.find(".tag_second_box_sign").outerHeight() > $parent.offset().top + $parent.outerHeight()){
                    $this.addClass("top");
                } else {
                    $this.addClass("bottom");
                }
            },
        },
        components: {
            add,
        }
    }
</script>
