<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify layui-modifyHeight">
        <div class="layui-layer-title">预览</div>
        <div class="layui-layer-content">

            <div id="pdfDom" v-if="!type">
                <div class="top-box">
                    <img :src="logoUrl" class="company-logo" alt="">
                    <div class="company-name inline-block">{{company_name}}</div>
                </div>

                <div class="content-box">

                    <div class="title">{{trip_name}}-行程单</div>

                    <div class="text-c">PINBA TECHNOLOGY - TRIP TRABLE</div>

                    <div class="person-list">

                        <div class="person-item">
                            <div class="person-left">
                                姓名:
                            </div>
                            <div class="person-right" id="realName"></div>
                        </div>

                        <div class="person-item">
                            <div class="person-left">
                                工号:
                            </div>
                            <div class="person-right" id="jobNumber"></div>
                        </div>

                        <div class="person-item">
                            <div class="person-left">
                                部门:
                            </div>
                            <div class="person-right" id="deparmentName"></div>
                        </div>

                    </div>

                    <div class="message-box">
                        <div class="message-item">
                            <span class="blue"></span>
                            <span class="message-content" id="applyTime">申请时间</span>
                        </div>

                        <div class="message-item">
                            <span class="blue"></span>
                            <span class="message-content" id="travelTime">行程时间</span>
                        </div>
                    </div>

                    <div class="message-box">
                        <div class="message-item">
                            <span class="blue"></span>
                            <span class="message-content" id="travelPersonPhone">行程人电话</span>
                        </div>

                        <div class="message-item">
                            <span class="blue"></span>
                            <span class="message-content" id="totalContent">共XXX张行程,行程里程共XXX公里,合计XXX元</span>
                        </div>
                    </div>

                    <table class="pad-table" id="pdfTable">
                        <thead class="text-c">
                        <tr>
                            <th >序号</th>
                            <th >开始时间</th>
                            <th >结束时间</th>
                            <th >起点</th>
                            <th >终点</th>
                            <th >里程(KM)</th>
                            <th >停车费</th>
                            <th >高速费</th>
                            <th >油费</th>
                            <th >其它费用</th>
                            <th >总费用</th>
                            <th >备注</th>
                        </tr>
                        </thead>
                        <tbody id="tableBody">
                        <!--<tr class="text-c table-content" >-->
                        <!--<td></td>-->
                        <!--<td></td>-->
                        <!--<td></td>-->
                        <!--<td></td>-->
                        <!--<td></td>-->
                        <!--<td></td>-->
                        <!--<td></td>-->
                        <!--<td></td>-->
                        <!--<td></td>-->
                        <!--<td></td>-->
                        <!--<td></td>-->
                        <!--</tr>-->
                        </tbody>
                    </table>
                </div>

            </div>

            <div id="voucherDom" v-if="type">
                <div class="top-box">
                    <img :src="logoUrl" class="company-logo" alt="">
                    <div class="company-name inline-block">{{company_name}}</div>
                </div>

                <div class="content-box">

                    <div class="title">{{voucher_name}}-凭证单</div>

                    <div class="text-c">PINBA TECHNOLOGY - TRIP TRABLE</div>

                    <div class="person-list">

                        <div class="person-item">
                            <div class="person-left">
                                姓名:
                            </div>
                            <div class="person-right" id="voucher-realName"></div>
                        </div>

                        <div class="person-item">
                            <div class="person-left">
                                工号:
                            </div>
                            <div class="person-right" id="voucher-jobNumber"></div>
                        </div>

                        <div class="person-item">
                            <div class="person-left">
                                部门:
                            </div>
                            <div class="person-right" id="voucher-deparmentName"></div>
                        </div>

                    </div>

                    <div class="message-box">
                        <div class="message-item">
                            <span class="blue"></span>
                            <span class="message-content" id="voucher-applyTime">申请时间</span>
                        </div>

                        <div class="message-item">
                            <span class="blue"></span>
                            <span class="message-content" id="vouchervoucher-travelTime">行程时间</span>
                        </div>
                    </div>

                    <div class="message-box">
                        <div class="message-item">
                            <span class="blue"></span>
                            <span class="message-content" id="voucher-travelPersonPhone">行程人电话</span>
                        </div>

                        <div class="message-item">
                            <span class="blue"></span>
                            <span class="message-content" id="voucher-totalContent">共XXX张行程,行程里程共XXX公里</span>
                        </div>
                    </div>

                    <table class="pad-table" id="voucher-pdfTable">
                        <thead class="text-c">
                        <tr>
                            <th>项目名称</th>
                            <!--<th>单位</th>-->
                            <th>数量</th>
                            <th>单价</th>
                            <th>总金额</th>
                        </tr>
                        </thead>
                        <tbody id="voucher-tableBody">
                        <!--<tr class="text-c table-content" >-->
                        <!--<td></td>-->
                        <!--<td></td>-->
                        <!--<td></td>-->
                        <!--<td></td>-->
                        <!--<td></td>-->
                        <!--<td></td>-->
                        <!--<td></td>-->
                        <!--<td></td>-->
                        <!--<td></td>-->
                        <!--<td></td>-->
                        <!--<td></td>-->
                        <!--</tr>-->
                        </tbody>
                    </table>


                    <div class="total-price">合计:XXX元</div>
                </div>

            </div>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
        </span>

    </div>
    <div class="layui-layer-shade"></div>
</template>
<style scoped lang="less">
    .layui-layer-content{
        padding-top: 0px !important;
    }
    .layui-modify{
        width: 800px;
    }

    .content-box{
        padding: 30px;
    }
    .company-name{
        line-height: 70px;
        font-size: 15px;
        color: #000000;
        font-weight:900;

    }
    .title{
        text-align: center;
        font-size: 20px;
    }
    .text-c{
        text-align: center;
        font-size: 12px;
    }
    .person-list{
        /*width: 100%;*/
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin:30px 0 ;
    }
    .person-item{
        display: flex;
        flex:1;
        flex-direction: row;
        /*width: 480px;*/
        align-content: center;
    }
    .person-item div{
        font-size: 14px;
    }
    .person-left{
        font-size: 12px;
        color: #cccccc;
    }
    .person-right{
        width: 50px;
        padding-left: 5px;
        border-bottom: 1px solid #ccc;
    }
    .blue{
        display: inline-block;
        height: 10px;
        width: 10px;
        border-radius: 10px;
        background: #1a92f1;
    }
    .message-box{
        /*min-width: 600px;*/
        display: flex;
        flex-direction: row;
        align-content: center;
        margin-bottom: 30px;
    }
    .message-content{
        display: inline-block;
        font-size: 14px;
    }
    .message-item{
        min-width: 350px;
    }
    table{
        width: 100%;
        /*width: 600px;*/
    }
    thead{

        background: #ebecf0;
    }
    th{
        height: 30px;
        font-size: 14px;
    }

    .table-content{
        background: #f9f9f9;
    }
    .table-content td{
        line-height: 25px;
        font-size: 20px;
    }
    .pad-table{
        background: #0a0a0a;
    }
    .top-box{
        /*display: flex;*/
        /*justify-content: center;*/
        background: url("../assets/images/trip_voucher_bg.png") no-repeat;
        background-size:100% 100%;
        height: 100px;
        padding-left: 20px;
    }
    .company-logo{
        width: 70px;
        /*margin-top: 30px;*/
        /*margin-right: 20px;*/
        /*height: 80px;*/
    }
    .total-price{
        font-size: 16px;
        text-align: right;
    }
</style>
<script>
    import * as base from '../assets/js/base.js';
    export default{
        ready () {
            if(this.logo_url){
                this.logoUrl = this.logo_url.url;

            }
        },
        props: ['type','voucher_name','company_name','trip_name','logo_url'],
        data:function(){
            return {
                logoUrl:"",

            }
        },
        methods: {

            close:function(){
                this.$dispatch("dialog-close")
            },
        }
    }
</script>
