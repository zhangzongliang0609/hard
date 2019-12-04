<template>
    <tag :url="tagUrl" v-if="showSetTag" :add="addContent" :title="title" @dialog-close="closeSetTag"></tag>
    <enter v-if="showEnter" v-on:close="closeEnter" :costlist="costTypeList" @dialog-close="closeEnter"></enter>
    <section class="Hui-article-box">
        <div class="page-container bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body clearfix">
                    <span class="f-20 fw-b f-l">车辆费用</span>
                    <a class="btn btn-secondary radius f-r " title="费用录入" href="javascript:;" v-on:click="inputPrice()">费用录入</a>
                    <a class="btn btn-secondary radius f-r mr-20" title="费用类型管理" href="javascript:;" v-on:click="clickSet()">费用类型管理</a>
                </div>
            </div>
            <div class="mt-10 bgc-fff clearfix">
                <div class="pd-10 clearfix">
                    <div class="inline-block ml-10">
                        费用状态：
                        <span class="select-box inline mr-5">
                            <select id="approvalStatusSelected" v-model="costStatus" class="select" >
                                <option value="">全部</option>
                                <option value="20">已确认</option>
                                <option value="10">未确认</option>
                                <option value="-10">已作废</option>
                            </select>
                        </span>
                    </div>
                  <div class="inline-block ml-10">
                      费用类型：
                      <span class="select-box inline mr-5">
                            <select id="orderStatusSelected" v-model="costType" class="select">
                                <option value="">全部</option>
                                <option v-bind:value="item.id" v-for="item in costTypeList">{{item.name}}</option>
                            </select>
                        </span>
                  </div>
                   <div class=" mt-5 inline-block ml-10">
                           <div class="inline-block">
                               开始日期：
                               <input  v-model="startDateInput" type="text" class="input-text Wdate mr-5 " style="width:120px;" id="J-start-outer-date" >
                           </div>
                            <div class="inline-block">
                                结束日期：
                                <input v-model="endDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-end-outer-date"  >
                            </div>

                        </div>
                    <div class="inline-block relative ml-10">
                        <select id="selectFilter" v-model="searchType" class="select" >
                            <option value="car_no">车牌号</option>
                            <option value="driver_name">驾驶人</option>
                            <option value="operator">操作员</option>
                        </select>
                        <input type="text" v-model="searchContent" class="input-text Wdate mr-5" style="width:150px; margin-left: 69px;" placeholder="请输入搜索内容" id="searchInput">
                    </div>
                    <button type="submit" class="btn btn-success radius" v-on:click="getCostList()"><i class="Hui-iconfont">&#xe665;</i></button>

                </div>
                <div class="materials bk-gray radius bgc-fff">
                    <table class="waterElectricityForm table table-border table-bg table-striped bor-l bor-r">
                        <thead class="text-c">
                        <tr>
                            <th width="">车牌号</th>
                            <th width="">品牌</th>
                            <th width="">型号</th>
                            <th width="">座位数</th>
                            <th width="">驾驶人</th>
                            <th width="">费用类型</th>
                            <th width="">总金额</th>
                            <th width="">发生日期</th>
                            <th width="">记账日期</th>
                            <th width="">操作员</th>
                            <th width="">备注</th>
                            <th width="">状态</th>
                            <th width="">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr class="text-c" v-for="data in items">
                            <td>{{data.car_no}}</td>
                            <td>{{data.car_brand}}</td>
                            <td>{{data.car_model}}</td>
                            <td>{{data.seats}}</td>
                            <td>{{data.driver_name}}</td>
                            <td>{{data.feetype_name}}</td>
                            <td>{{data.fee}}</td>
                            <td>{{data.fee_date}}</td>
                            <td>{{data.ctime}}</td>
                            <td>{{data.operator}}</td>
                            <td class="td-hide">{{data.remark}}</td>
                            <td>{{data.status}}</td>
                            <td>

                                <a v-if="data.status === '未确认'" class="btn btn-secondary radius   mr-20" title="确认费用" href="javascript:;" v-on:click="confirmCost(data)">确认费用</a>
                                <a v-if="data.status !== '已作废'"  class="btn btn-danger radius   mr-20" title="作废费用" href="javascript:;" v-on:click="deleteCost(data)">作废费用</a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div id="J-page" class="m-page" v-show="!noData"></div>
                    <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
                </div>
            </div>
        </div>
    </section>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    #selectFilter{
        width: 70px;
        height: 31px;
        position: absolute;
    }
    .td-hide{
        max-width: 100px;
    }

</style>
<script>
    import * as base from '../assets/js/base.js';
    import tag from '../components/setBuildingTag'
    import enter from '../components/costInput'
    import moment from "moment";

    let costOps = '';
    export default{
        ready(){
            costOps = {
                params:{
                    page:1,
                    page_size:10,
                }
            }
            this.startDateInput = moment().add(-1, "months").format('YYYY-MM-DD');
            this.endDateInput = moment().format('YYYY-MM-DD');

            new Kalendae.Input('J-start-outer-date', {
                months: 1,
                clickHide:true
            });
            new Kalendae.Input('J-end-outer-date', {
                months: 1,
                clickHide:true
            });


            this.getCostList()
            this.getCostTypeList()
        },
        data:function () {
            return{
                itemsLoading:false,
                title:'费用类型管理',
                tagUrl:`${base.gAjaxUrl.officialCarFeeTypes}`, // 类别管理url
                showSetTag:false,
                noData:false,
                orderStatusSelected:'',
                approvalStatusSelected:'',
                orderStatusItems:'',
                showEnter:false,
                costStatus:'',
                costType:'',
                searchType:'car_no',
                searchContent:'',
                startDateInput:'',
                endDateInput:'',
                costTypeList:[],
                items:[],
                addContent:'添加费用类型'
            }
        },
        methods:{
            getCostTypeList:function () {
                let that = this;
                $.ajax({
                    url: `${base.gAjaxUrl.officialCarFeeTypes}`,
                    type: 'GET',
                }).always((data)=>{
                        base.ajaxCallback(data,()=>{
                            if(data.results && data.results.length != 0){
                                that.costTypeList = data.results;
                            }
                        });
                    })
            },
            getCostList:function () {
                costOps.params.page = 1;
                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-page',tpageToal,count)
                });
            },
            initPage:function(obj,tpageToal='4',count='0',current='1'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:current,
                    count:count,
                    callback:(p)=>{
                        costOps.params.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax:function(callback=function(){}){
                this.itemsLoading = true
                let obj = {
                    page:costOps.params.page,
                    page_size:costOps.params.page_size,
                    start_date:this.startDateInput,
                    end_date:this.endDateInput,
                    status:this.costStatus,
                    feetype:this.costType,
                }
                obj[this.searchType] = this.searchContent;
                //修改参数
                $.ajax({
                    url: `${base.gAjaxUrl.officialCarFees}`,
                    type: 'GET',
                    data:obj
                }).always((data)=>{
                        this.itemsLoading = false;
                        base.ajaxCallback(data,()=>{
                            console.log(data);
                            let resultData = data.results;
                            this.items = resultData;
                            if(resultData && resultData.length){
                                this.noData = false;
                                //回调
                                callback(data.num_pages,data.count)
                            }else{
                                this.noData = true;
                            }
                        });
                    })
            },
            closeSetTag:function () {
                this.showSetTag = false;
                this.getCostTypeList();
            },
            clickSet:function () {
                this.showSetTag = true;
            },
            inputPrice:function () {
                this.showEnter = true;
            },
            closeEnter:function () {
                this.showEnter = false;
                this.getCostList()
            },
            confirmCost:function (item) {

                let that = this;
                layer.confirm(`车牌号码:${item.car_no},&nbsp;驾驶人:${item.driver_name},&nbsp;费用类型:${item.feetype_name},&nbsp;费用金额:${item.fee},此费用是否已确认?`,function(){
                    $.ajax({
                        url: `${base.gAjaxUrl.officialCarFees}${item.id}/confirm/`,
                        type: 'GET',
                    }).always((data)=>{
                        base.ajaxCallback(data,()=>{
                            that.getCostList();
                        });
                    })
                    layer.closeAll("dialog");
                })
            },
            deleteCost:function (item) {
                let that = this;
                layer.confirm(`车牌号码:${item.car_no},&nbsp;驾驶人:${item.driver_name},&nbsp;费用类型:${item.feetype_name},&nbsp;费用金额:${item.fee},是否确定作废此费用?`,function(){
                    $.ajax({
                        url: `${base.gAjaxUrl.officialCarFees}${item.id}/discard/`,
                        type: 'GET',
                    }).always((data)=>{
                        base.ajaxCallback(data,()=>{
                            that.getCostList();
                        });
                    })
                    layer.closeAll("dialog");
                })
            }

        },
        filter:{},
        event:{},
        components:{
            tag:tag,
            enter:enter,
        },
    }
</script>