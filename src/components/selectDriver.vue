<template>
<!--<select_vehicle :data="order"  v-if="isShowSelectVehicleDialog" v-on:dialog-close="dialogClose"></select_vehicle>-->
<div class="layui-layer layui-anim layui-layer-page layui-modify">
    <div class="layui-layer-title">
        选择司机|出发时间:{{order.ride_time}}-结束时间:{{order.end_time}}(橙色表示司机该段时间有单)
    </div>
    <div class="layui-layer-content pd-20">
        <div class="layui-layer-wrap">
            <div class="text-l clearfix">
                <input id="searchInput" type="text"  placeholder="姓名/工号/电话" style="width:250px" class="f-l input-text">
                <button v-on:click="getList(1)" class="btn btn-success" type="button"><i class="f-r Hui-iconfont">&#xe665;</i></button>
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
                        <th width="100">司机是否锁定</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="text-c {{item.driver_conflict_order?'busy':''}}" v-for="(index,item) in items">
                        <td><input type="radio"  class="radio-wh" :value="item" name="" v-model="selected_driver" :checked="index==indexFirst">{{item.staff_vo.avatar}}</td>
                        <td><img class="avatar" v-bind:src="item.avatar?item.avatar:'./src/assets/images/avatar-default.jpg'"/></td>
                        <td>{{item.staff_vo.real_name}}/{{item.staff_vo.sex==1? '男': '女';}}</td>
                        <td>{{item.staff_vo.department_vo.department_name}}/{{item.staff_vo.position}}</td>
                        <td>{{item.staff_vo.job_number}}</td>
                        <td>{{item.staff_vo.phone}}</td>
                        <td>{{item.locked == true ? "是" : "否"}}</td>
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
    <div class="layui-layer-btn" v-on:click="next()"><a class="layui-layer-btn0">选择车辆</a></div>
</div>
<div class="layui-layer-shade"></div>
    <div class="m-loading" v-if="driverLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>

<style lang="less">
.avatar{
    width: 50px;
}
.busy{
    background: orange;
}

.radio-wh{
    width: 20px;
    height: 20px;
    cursor: pointer;
}

</style>

<script>
import * as base from '../assets/js/base.js';
// import select_vehicle from "../components/selectVehicle.vue";

    let staffsOps = null;

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


        },
        props: ['data'],
        data:function(){
            return {
                dialogTitle: '选择车辆',
                noData:false,
                items: [],
                searchInput:'',
                selected_driver:'',
                order: this.data,
                isShowSelectVehicleDialog:false,
                indexFirst: 0,
                driverLoading:false,

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
                this.driverLoading = true;
                $.ajax({
                    url: `${base.gAjaxUrl.officialcarorders}${this.order.id}/driver/`,
                    type: 'GET',
                    data:staffsOps.param
                })
                .always((data)=>{
                    this.driverLoading = false;
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
                this.$dispatch('assign-dialog-close');
            },
            save:function(){
                /*$('#J-layer-form').submit();*/
                console.log('selected_emoloyee is ', this.selected_driver)
            },
            next:function(){
                this.$dispatch('select-driver', this.selected_driver);
                if(this.selected_driver){
                    this.$dispatch('dialog-next');
                }else{
                    layer.msg('请选择司机',{icon:1,time:1500});
                }
            }
        },
        components:{
            // select_vehicle
        }
    }
</script>
