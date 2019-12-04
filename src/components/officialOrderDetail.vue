<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">订单详情</div>
        <div class="layui-layer-content layui-layer-order-wrap">
                <div class="row cl">
                    <div class="f-l col-6">
                        <label class="f-l ml-10">申请人：</label>
                        <div class="f-l">
                            <div class="">
                                1231
                            </div>
                        </div>
                    </div>
                    <div class="f-l col-6">
                        <label class="f-l ml-10">审批状态：</label>
                        <div class="f-l">
                            <div class="">
                                4444
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row cl">
                    <div class="f-l col-6">
                        <label class="f-l ml-10">订单状态：</label>
                        <div class="f-l">
                            <div class="">
                                1231
                            </div>
                        </div>
                    </div>
                    <div class="f-l col-6">
                        <label class="f-l ml-10">订单总费用：</label>
                        <div class="f-l">
                            <div class="">
                                4444
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row cl">
                    <div class="f-l col-6">
                        <label class="f-l ml-10">用车原因：</label>
                        <div class="f-l">
                            <div class="">
                                1231
                            </div>
                        </div>
                    </div>
                    <div class="f-l col-6">
                        <label class="f-l ml-10">取消原因：</label>
                        <div class="f-l">
                            <div class="">
                                4444
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row cl">
                    <div class="f-l col-6">
                        <label class="f-l ml-10">备注信息：</label>
                        <div class="f-l">
                            <div class="">
                                1231
                            </div>
                        </div>
                    </div>
                    <div class="f-l col-6">
                        <label class="f-l ml-10">评论：</label>
                        <div class="f-l">
                            <div class="">
                                4444
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row cl">
                    <div class="f-l col-6">
                        <div class="row cl">
                            <label class="f-l ml-10">订单费用：</label>
                            <div class="f-l col-8">
                                <table class="table table-border table-bordered table-hover table-bg">
                                    <thead>
                                    <tr class="text-c">
                                        <th>费用名称</th>
                                        <th>金额</th>
                                        <th>操作员</th>
                                    </tr>
                                    </thead>
                                    <div class="result" v-if="!noData">
                                        <tbody>
                                        <tr class="text-c" v-for="order in items.fee_orders">
                                            <td>{{order.name}}</td>
                                            <td>{{order.fee}}</td>
                                            <td>{{order.operator?order.operator:''}}</td>
                                        </tr>
                                        </tbody>
                                    </div>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="f-l col-6">
                        <div class="row cl">
                            <label class="f-l ml-10">分组：</label>
                            <div class=" f-l col-8">
                                <tags :tags="wTagsArr" :selected="tagsArr"></tags>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row cl">
                    <div class="apply-box ml-10 mr-10 pl-10">
                        <p class="mt-10">流程审批</p>
                        <div class="relative">
                            <div class="vertical-line"></div>
                            <div class="apply-item mb-10">
                                <div class="circle"></div>
                                <div class="apply-content ml-10 ">
                                    <img class="img ml-5" src="../assets/images/driver_header.jpg" alt="">
                                    <div class="content">
                                        <div class="head">
                                            <div>测试员 2018-12-05 15:13:00</div>
                                            <div class="">审批通过</div>
                                        </div>
                                        <div class="text">214324324341234324</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row cl">
                    <div class="ml-10 mr-10">
                        <div class="travel-title pl-5">行程1</div>
                        <div class="travel-content">
                            <div>
                                <span>起点</span>
                                <span>12312321321</span>
                            </div>
                            <div>
                                <span>起点</span>
                                <span>12312321321</span>
                            </div>
                            <div>
                                <span>起点</span>
                                <span>12312321321</span>
                            </div>

                            <div class="travel-detail">
                                <div>接送司机</div>
                                <div>司机行程状态</div>
                                <div>乘车人数</div>
                                <div>乘车人名称/电话</div>
                                <div class="row cl">
                                    <label class="f-l">订单费用：</label>
                                    <div class="f-l col-4">
                                        <table class="table table-border table-bordered table-hover table-bg mt-10">
                                            <thead>
                                            <tr class="text-c">
                                                <th>费用名称</th>
                                                <th>金额</th>
                                                <th>操作员</th>
                                            </tr>
                                            </thead>
                                            <div class="result">
                                                <tbody>
                                                <tr class="text-c">
                                                    <td></td>
                                                </tr>
                                                </tbody>
                                            </div>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

        </div>
        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close"></a>
    </span>
        <div class="layui-layer-btn" v-on:click="save"><a class="layui-layer-btn0">保存</a></div>
    </div>
    <div class="layui-layer-shade"></div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .apply-box{
        border:1px solid #999999;
        .apply-item{
            display: flex;
            flex-direction: row;
            align-items: center;
            .circle{
                width:10px;
                height:10px;
                background: #0497ff;
                border: none;
                border-radius: 10px;
                margin-left: 15px;
            }
            .apply-content{
                border: 1px solid #999999;
                border-radius: 5px;
                width:400px;
                display: flex;
                flex-direction: row;
                align-items: center;
                .img{
                    width:30px;
                    height:30px;
                }
                .content{
                    display: flex;
                    flex: 1;
                    flex-direction: column;
                    padding: 0 10px;
                    .head{
                        display: flex;
                        flex: 1;
                        flex-direction: row;
                        justify-content: space-between;

                    }
                    .text{
                        margin-top: 5px;
                    }
                }
            }
        }
        .vertical-line{
            border-right:1px dashed #999999;
            top:0;
            bottom:0;
            left:19px;
            width: 1px;
            position: absolute;
            z-index: -1;
        }
    }
    .travel-title{
        background: #CCCCCC;
    }
    .travel-content{
        padding:5px;
        border:1px solid #999999;
        border-top:none;
    }
    .travel-detail{
        border:1px solid #999999;
        padding:5px;
    }

</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import moment from "moment";
    import tags from './setTags'

    let option = null;
    export default{
        ready(){
            option = {
                param:{
                },
                page:1,
                page_size:10
            };
            // this.queryAjax((tpageToal='4',count='0')=>{
            //     this.initPage('#J-page',tpageToal,driverOps.page,count)
            // });
        },
        data: function(){
            return{
                itemsLoading:false,
                noData:false,
                items:[],
            }
        },
        methods:{
            //初始化分页
            initPage:function(obj,tpageToal='4',current='1',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:current,
                    count:count,
                    callback:(p)=>{
                        driverOps.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax:function(callback=function(){}){
                this.itemsLoading = false;
                $.ajax({
                    url: `${base.gAjaxUrl.officialcarorders}${this.userInfo['id']}/vehicle/`,
                    type: 'GET',
                })
                    .always((data)=>{
                        base.ajaxCallback(data,()=>{
                            let resultData = data.results;
                            this.itemsLoading = false;
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
            close:function(){
                this.$dispatch("dialog-close")
            }
        },
        components: {
            tags:tags,
        },
        filters: {

        }
    }
</script>