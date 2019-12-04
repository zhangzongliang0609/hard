<template>
    <slot-window v-if="showWindow" :title="windowTitle" @dialog-close="closeWindow">
        <div class="cl window-box text-c">
            <div >
                确定要安排 {{selectStaff.real_name}} 入住 {{windowData.building_name}} {{windowData.room_no}}吗?
            </div>
            <div class="mt-10">
                <span>押金金额:</span>
                <input type="text" id="price" class="input-text">
            </div>
            <div class="mt-10">
                <span>押金单号:</span>
                <input type="text" id="priceNumber" class="input-text">
            </div>
            <div class="text-c mt10">
                <input type="checkbox" id="lockRoom"> 是否锁定该房间
            </div>
        </div>
        <a class="btn btn-primary radius f-r mr-10 mb-10 mt-20" @click="confirmSet()"   href="javascript:;" >确定</a>
    </slot-window>

<div class="layui-layer layui-anim layui-layer-page layui-modify">
    <div class="layui-layer-title">{{title}}</div>
    <div class="layui-layer-content">
        <div class="bk-gray radius mt-10">
            <div class="clear">
                <div class="text-l clearfix f-l mr-15 mt-10 ml-10">
                    <input v-model="searchInput" type="text"  placeholder="名字/工号/手机号" style="width:250px" class="f-l input-text">
                    <button v-on:click="getList(1)" class="btn btn-success" type="button"><i class="f-r Hui-iconfont">&#xe665;</i></button>
                </div>
                <div class="layui-layer-btn place f-r" v-on:click="setRoom()"><a class="layui-layer-btn0" v-if="type!='check'">确认选择</a></div>
            </div>
            <table class="fixedParent table table-border table-bg table-striped">
                <thead class="text-c">
                    <tr>
                        <th>选择</th>
                        <th>姓名/性别</th>
                        <th>部门/职位/学历</th>
                        <th>员工分组</th>
                        <th>工号</th>
                        <th>电话</th>
                    </tr>
                </thead>
                <tbody class="text-c">
                    <tr v-for="item in items">
                        <td><input type="radio" v-model="selectStaff" :value="item"></td>
                        <td>{{item.real_name}}/{{item.sex==1? '男': '女';}}</td>
                        <td>{{item.department_vo.department_name}}/{{item.position?item.position:'--'}}/{{item.education?item.education:'--'}}</td>
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
    <div class="m-loading" v-if="isLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>

<style lang="less" scoped>
    .tag_container {
        width: 80px;
        margin: 0 auto;
    }
    .layui-layer-shade{
        z-index: 102;
    }
    .layui-layer{
        z-index: 103;
    }
    .window-box{
        .input-text{
            width: 150px;
        }
    }
</style>
<script>
import * as base from '../assets/js/base.js';
import slotWindow from '../components/slotWindow.vue';

    let itemOps = null;

    export default{
        ready () {
            let that = this;
            let ajaxUrl = '';
            let ajaxType = '';
            let getData = this.data;
            itemOps = {
                param:{
                    search:'',
                    page:1,
                    page_size:10,
                }
            };

            base.verticalCenter('.layui-modify');

            itemOps.param.page = 1;

            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-page',tpageToal,itemOps.param.page,count)
            });

        },
        props: ['title','type','data',],
        data:function(){
            return {
                isLoading: false,
                searchInput:'',
                items: [],
                selectStaff: '',
                showWindow:false,
                windowData:'',
                windowTitle:"安排房间",
                noData:true,
            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            // save:function(id){
            //     let that = this;
            //
            //     let ajaxAddData = {
            //         staff: this.selectStaff,
            //     };
            //
            // },
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
            //获取列表
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
                this.isLoading = true;
                itemOps.param.search = this.searchInput;

                $.ajax({
                    url: base.gAjaxUrl.staffs,
                    type: 'GET',
                    data:itemOps.param
                })
                .always((data)=>{
                    base.ajaxCallback(data,()=>{
                        this.isLoading = false;
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
            setRoom:function(){

                if(!this.selectStaff){
                    layer.msg('请选择员工',{icon:2,time:1000});
                    return;
                }
                this.showWindow = true;
                this.windowData = this.data;
            },
            confirmSet:function () {
                let that = this;
                let price = $("#price").val();
                let priceNumber = $("#priceNumber").val();
                if(!/^\d+(?:\.\d{1,2})?$/.test(price) && price){
                    layer.msg("押金金额必须是数字而且最多两位小数",{icon:2,time:1500});
                    return
                }
                this.isLoading = true;
                let ajaxAddData = {
                    staff: this.selectStaff.id,
                    deposit:price,
                    deposit_no:priceNumber,
                }
                $.ajax({
                    url: `${base.gAjaxUrl.rooms}${that.windowData.id}/staffs/`,
                    type:'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(ajaxAddData),
                }).always(function(data) {
                    that.isLoading = false;
                        base.ajaxCallback(data,function(){
                           that.lockRoom();
                        });
                    });

                // if(!this.windowData.is_full){
                //     $.ajax({
                //         url: `${base.gAjaxUrl.applysettleorders}${that.data.id}/room/`,
                //         type:'POST',
                //         contentType: 'application/json',
                //         data: JSON.stringify(ajaxAddData),
                //     })
                //         .always(function(data) {
                //             base.ajaxCallback(data,function(){
                //                 layer.msg('提交成功',{icon:1,time:1000});
                //                 that.showWindow = false;
                //             });
                //         });
                // }
            },
            closeWindow:function () {
                this.showWindow = false;
            },
            lockRoom:function () {
                let that = this;
                let isLock = $("#lockRoom").is(':checked');
                if(isLock){
                    $.ajax({
                        url:`${base.gAjaxUrl.rooms}${that.windowData.id}/`,
                        type:"PUT",
                        contentType:"application/json",
                        data:JSON.stringify({
                            room_no:that.windowData.room_no,
                            building:that.windowData.building,
                            room_type:that.windowData.room_type,
                            is_locking:true,
                        })
                    }).always((data)=>{
                        base.ajaxCallback(data,()=>{
                            layer.msg('提交成功',{icon:1,time:1000});
                            that.$dispatch('dialog-save');
                        })
                    })
                }else{
                    layer.msg('提交成功',{icon:1,time:1000});
                    that.$dispatch('dialog-save');
                }
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
            slotWindow:slotWindow,
        }
    }
</script>
 