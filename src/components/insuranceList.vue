<template>
    <div class="page-container">
        <div class="text-l clearfix mt-10">
            <input id="searchInput" type="text"  placeholder="车牌号" style="width:250px" class="f-l input-text">
            <button v-on:click="getList(1)" class="btn btn-success" type="button"><i class="f-r Hui-iconfont">&#xe665;</i></button>
        </div>
        <div class="mt-20">
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
                <th width="150">保险公司</th>
                <th width="100">保险到期日期</th>
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
                <td>{{item.insurance_company}}</td>
                <td>
                  {{item.insurance_deadline}}
                </td>
                <td :class="{'text-red': item.insurance_rest_days <= 30}">{{item.insurance_rest_days <= 0 ? "已过期" : item.insurance_rest_days}} </td>
                <td><img class="warning" v-show="item.insurance_rest_days <= 30 && item.insurance_rest_days || item.insurance_rest_days == 0 " src="../assets/images/warning.png" alt=""></td>
                <td class="f-14">
                    <a href="javascript:;" class="btn btn-primary radius mr-5" @click="showRecord(item)">确认已续保</a>
                </td>
            </tr>
            </tbody>
        </table>
        <div id="I-page" class="m-page" v-if="!noData"></div>
        <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
        <div class="m-loading" v-if="itemsLoading">
            <div class="cube1"></div>
            <div class="cube2"></div>
        </div>
    </div>
    <insurance v-on:window-close="close" v-if="isShowWindow" :data="data" :type="portType" v-on:child-data="updata"></insurance>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .page-container{
        overflow: visible;
        padding: 20px;
        position: absolute;
        left: 0;
        top: 23%;
        right: 0;
    }
     h6{
         font-size: 20px;
         text-align: center;
         margin-top: 10px;
        }
       .insuranceInput{
          width: 200px;
           height: 30px;
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
    import * as base from '../assets/js/base.js';
    import insurance from './updateInsurance'
    let staffsOps = null;
    export default{
        ready(){
            staffsOps = {
                param:{
                    search:'',
                    page:1,
                    page_size:10,
                    order:"insurance",
                }
            };
            let that = this;
            this.queryAjax((tpageToal='4',count='0')=>{
                setTimeout(function () {
                    that.initPage('#I-page',tpageToal,staffsOps.param.page,count)
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
//                    staffsOps.param.page = 1
                    this.searchInput= $("#searchInput").val();
                    staffsOps.param.page = 1
                }
                this.queryAjax((tpageToal='4',count='0')=>{
                    that.initPage('#I-page',tpageToal,staffsOps.param.page,count)
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
            showRecord:function (data) {
                this.data = data;
                this.isShowWindow = true;

            },
            close:function () {
                this.isShowWindow = false;
            },
            updata:function () {
                this.queryAjax();
            }



        },
        components:{
            insurance,
        }
    }
</script>