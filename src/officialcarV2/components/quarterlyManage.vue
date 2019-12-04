<template>
    <div class="page-container">
        <div class="text-l clearfix mt-10">
            <input id="searchInput" type="text"  placeholder="车牌号" style="width:250px" class="f-l input-text">
            <button v-on:click="getList(1)" class="btn btn-success" type="button"><i class="f-r Hui-iconfont">&#xe665;</i></button>
        </div>
        <div class=" mt-20">

        </div>
        <table class="table table-border table-bordered table-hover table-bg table-sort">
            <thead>
            <tr class="text-c">
                <!-- <th width="25"><input type="checkbox" value="" name=""></th> -->
                <th width="100">车牌号</th>
                <th width="100">品牌</th>
                <th width="100">型号</th>
                <th width="100">车架号</th>
                <th width="100">发动机号</th>
                <th width="100">季审到期日期</th>
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
                   {{item.quarterly_verification_deadline}}
                </td>
                <td :class="{'text-red': item.quarterly_rest_days <= 30}">{{item.quarterly_rest_days <= 0 ? "已过期" : item.quarterly_rest_days}} </td>
                <td><img class="warning" v-show="item.quarterly_rest_days <= 30 && item.quarterly_rest_days || item.quarterly_rest_days == 0 " src="../../assets/images/warning.png" alt=""></td>
                <td class="f-14">
                    <a href="javascript:;" class="btn btn-primary radius mr-5" @click="showRecord(item)">确认已季审或领标</a>
                </td>
            </tr>
            </tbody>
        </table>
        <div id="Q-page" class="m-page" v-if="!noData"></div>
        <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
        <div class="m-loading" v-if="itemsLoading">
            <div class="cube1"></div>
            <div class="cube2"></div>
        </div>
    </div>
    <update v-if="isShowWindow" v-on:window-close="close" :data="data" :type="portType"  v-on:child-data="upData"></update>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .updateBox{
        margin:100px 0 0 -297px;
        width: 600px;
        height: 400px;
        .updateContent{
            padding:30px 0 30px 150px;
            select{
                width: 200px;
            }
            div{
                margin-top: 20px;
                font-size: 15px;
            }
            .checkTime{
                input{
                    width: 200px;
                }
            }
        }
    }
    .title{
        padding-top: 20px;
        text-align: center;
        font-size: 20px;
    }
    .btn-box{
        padding-top: 50px;

        a{
            width: 120px;
            margin-left: 20px;
        }
    }
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
    import * as base from '../../assets/js/base.js';
    import update from './updateQuarterly'
    let staffsOps = null
    export default{
        ready(){
            let that = this;
            staffsOps = {
                param:{
                    search:'',
                    page:1,
                    page_size:10,
                    order:"quarterly_verification"
                }
            };
            this.queryAjax((tpageToal='4',count='0')=>{
                setTimeout(function () {
                    that.initPage('#Q-page',tpageToal,staffsOps.param.page,count)
                },100);
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
            initPage:function(obj,tpageToal='4',current='1',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:current,
                    count:count,
                    callback:(p)=>{
                        staffsOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            maskWidth:function (overDate) {
                if(!overDate){
                    return
                }
                var newDate = 31536000 - overDate * 86400;
                var maskW = (newDate/31536000) * 100;
                return maskW.toFixed(1) + "%"
            },
            queryAjax:function(callback=function(){}){
                //修改参数
                var that = this
                this.itemsLoading = true;
                staffsOps.param.search = this.searchInput;

                $.ajax({
                    url: `${that.type}`,
                    type: 'GET',
                    data:staffsOps.param,
                }).always((data)=>{
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
            //获取列表
            getList:function(reset=0){
                let that = this;
                //重置第一页
                if(reset){
//                    staffsOps.param.page = 1
                    this.searchInput= $("#searchInput").val();
                    staffsOps.param.page = 1
                }
                this.queryAjax((tpageToal='4',count='0')=>{
                    that.initPage('#Q-page',tpageToal,staffsOps.param.page,count)
                });
            },
            showRecord:function (data) {
                this.isShowWindow = true;
                this.data = data;
            },
            close:function () {
                this.isShowWindow = false;
            },
            upData:function () {

                let that = this;
                this.queryAjax((tpageToal='4',count="0")=>{
                    setTimeout(function () {
                        that.initPage('#Q-page',tpageToal,staffsOps.param.page,count)
                    },100);
                });
            }

        },
        components:{
            update,
        }
    }
</script>