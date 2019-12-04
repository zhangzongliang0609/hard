<template>
    <div class="page-container">
        <div class="text-l clearfix">
            <input id="searchInput"  type="text"  placeholder="车牌号" style="width:250px" class="f-l input-text">
            <button v-on:click="getList(1)" class="btn btn-success" type="button"><i class="f-r Hui-iconfont">&#xe665;</i></button>
        </div>

        <table class="table table-border table-bordered table-hover table-bg table-sort mt-20">
            <thead>
            <tr class="text-c">
                <!-- <th width="25"><input type="checkbox" value="" name=""></th> -->
                <th width="100">车牌号</th>
                <th width="100">品牌</th>
                <th width="100">型号</th>
                <th width="100">车架号</th>
                <th width="100">发动机号</th>
                <th width="100">年审到期日期</th>
                <th width="50">剩余天数</th>
                <th width="50">预警</th>
                <th width="100">操作</th>
            </tr>
            </thead>
            <tbody>
            <tr class="text-c" v-for="item in items">
                <!-- <td><input type="checkbox" value="" name="">{{item.avatar}}</td> -->
                <td>{{item.car_no}}</td>
                <td>{{item.car_brand}}</td>
                <td>{{item.car_model}}</td>
                <td>{{item.drive_no}}</td>
                <td>{{item.engine_no}}</td>
                <td>
                    {{item.annual_verification_deadline}}
                </td>
                <td :class="{'text-red': item.annual_rest_days <= 30}">{{item.annual_rest_days <= 0 ? "已过期" : item.annual_rest_days}} </td>
                <td><img class="warning" v-show="item.annual_rest_days === 0 || item.annual_rest_days <= 30    " src="../assets/images/warning.png" alt=""></td>
                <td class="f-14">
                    <a href="javascript:;" class="btn btn-primary radius mr-5" @click="showRecord(item)">确认已年审或领标</a>
                </td>
            </tr>
            </tbody>
        </table>
        <div id="A-page" class="m-page" v-if="!noData"></div>
        <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
        <div class="m-loading" v-if="itemsLoading">
            <div class="cube1"></div>
            <div class="cube2"></div>
        </div>
    </div>
    <annual v-on:window-close="close" v-if="isShowWindow" :data="data" :type="portType"  v-on:child-data="updata"></annual>
</template>
<style lang="less" rel="stylesheet/less"scoped>
    .warning{
        height: 20px;
        width: 20px;
    }
    .text-red{
        color:red;
        font-weight: 900;
    }

</style>
<script>
    import * as base from '../assets/js/base.js';
    import annual from "./updateAnnual"
    let staffsOps = null;
    export default{
        ready(){
            staffsOps = {
                param:{
                    search:'',
                    page:1,
                    page_size:10,
                    order:"annual_verification"
                }
            };
            let that = this;
            this.queryAjax((tpageToal='4',count="0")=>{
                that.$nextTick(function () {
                    that.initPage('#A-page',tpageToal,count)
                })

            });
        },
        data:function () {
            return{
                itemsLoading:true,
                items:{},
                noData:true,
                searchInput:'',
                isShowWindow:false,
                data:{},
                portType:this.type,
            }
        },
        props:["type"],
        methods:{
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
            maskWidth:function (overDate,totalDays) {
                if(!overDate){
                    return
                }
                var maskW =   (totalDays - overDate) / totalDays * 100;

                console.info(maskW);

                return maskW.toFixed(1) + "%"
            },
            queryAjax:function(callback=function(){}){
                //修改参数
                var that = this
                this.itemsLoading = true;
                staffsOps.param.search = this.searchInput;

                console.info(staffsOps.param);
                $.ajax({
                    url: `${that.type}`,
                    type: 'GET',
                    data:staffsOps.param,

                }).always((data)=>{
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
            //获取列表
            getList:function(reset=0){
                let that = this;
                //重置第一页
                if(reset){
                    this.searchInput= $("#searchInput").val();
                    staffsOps.param.page = 1
                }
                this.queryAjax((tpageToal='4',count='0')=>{
                    that.initPage('#A-page',tpageToal,count)
                });
            },
            showRecord:function (data) {
                this.isShowWindow = true;
                this.data = data;
            },
            close:function () {
                this.isShowWindow = false;
            },
            updata:function () {
                this.queryAjax();
            }

        },
        components:{
            annual,
        }
    }
</script>