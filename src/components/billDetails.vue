<template>
    <order v-if="isShowOrder" @order-dialog-close="closeOrder" :data="dialogData"></order>
    <maintain v-if="isShowMaintain" @dialog-close="closeMaintain" :data="dialogData" :title="maintainTitle"></maintain>
    <cost v-if="isShowCost" @dialog-close="closeCost" :data="dialogData"></cost>
    <section class="Hui-article-box">
        <div class="page-container bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body clearfix">
                    <a class="btn btn-secondary radius f-l mr-20" title="费用类型管理" href="javascript:;" v-on:click="callback()">返回</a>
                    <span class="f-20 fw-b f-l">{{item.car_no}}&nbsp;|&nbsp;{{item.car_brand}}&nbsp;|&nbsp;{{item.car_model}}&nbsp;|&nbsp;座位数:{{item.seats}}</span>
                    <a class="btn btn-secondary radius f-r mr-20" title="导出车辆账单" href="javascript:;" v-on:click="exportBill()">导出车辆账单</a>
                </div>
            </div>
            <div class="mt-10 bgc-fff clearfix">
                <div class="pd-10 clearfix">
                    <div class="inline-block ml-10">
                        费用来源:
                        <label>
                            <input type="checkbox" class="check-box order-cost" :checked="state.order">
                            订单费用
                        </label>
                        <label>
                            <input type="checkbox" class="check-box vehicle-cost" :checked="state.vehicle">
                            车辆费用
                        </label>
                        <label>
                            <input type="checkbox" class="check-box maintain-cost" :checked="state.maintain">
                            维修费用
                        </label>
                        <!--</span>-->
                    </div>
                    <div class=" mt-5 inline-block ml-20">
                        <div class="inline-block">
                            开始日期：
                            <input  v-model="startDateInput" type="text" class="input-text Wdate mr-5 " style="width:120px;" id="startDate" v-bind:value="startDateInput">
                        </div>
                        <div class="inline-block">
                            结束日期：
                            <input v-model="endDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;" id="endDate" v-bind:value="endDateInput">
                        </div>
                    </div>
                    <button type="submit" class="btn btn-success radius" v-on:click="getList()"><i class="Hui-iconfont">&#xe665;</i></button>

                </div>
                <div class="materials bk-gray radius bgc-fff">
                    <table class="waterElectricityForm table table-border table-bg table-striped bor-l bor-r">
                        <thead class="text-c">
                        <tr>
                            <th width="">费用来源</th>
                            <th width="">驾驶人</th>
                            <th width="">费用类型</th>
                            <th width="">总金额</th>
                            <th width="">发生日期</th>
                            <th width="">记账日期
                            </th>
                            <th>操作员</th>
                            <th>备注</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr class="text-c" v-for="data in items">
                            <td>{{data.source}}</td>
                            <td>{{data.driver_name}}</td>
                            <td>{{data.type_name}}</td>
                            <td>{{data.fee}}</td>
                            <td>{{data.fee_date}}</td>
                            <td>{{data.ctime}}</td>
                            <td>{{data.operator}}</td>
                            <td class="td-hide" >{{data.remark}}</td>
                            <td>
                                <a href="javascript:;" class="btn btn-primary radius" @click="showDetails(data)">查看订单</a>
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
    .td-hide{
        max-width: 100px;
    }

</style>
<script>
    import * as base from '../assets/js/base.js';
    import moment from "moment";
    import order from './order'
    import maintain from './vehicleRepairCostDetail'
    import cost from './vehicleCostOrderDetails'

    let pageOps = {
        params:{},
    }
    export default{
        ready(){
            pageOps.params.page = 1;
            pageOps.params.page_size = 10;

            this.startDateInput = this.start;
            this.endDateInput = this.end;
            //
            new Kalendae.Input('startDate', {
                months: 1,
                clickHide:true
            });
            new Kalendae.Input('endDate', {
                months: 1,
                clickHide:true
            });
            this.getList();
        },
        props:['item','start','end','state'],
        data:function () {
            return{
                noData:false,
                startDateInput:'',
                endDateInput:'',
                isShowOrder:false,
                isShowMaintain:false,
                isShowCost:false,
                itemsLoading:false,
                fliterType:{},
                items:[],
                dialogData:'',
                maintainTitle:'维修费用订单详情',
            }
        },
        methods:{
            initPage:function(obj,tpageToal='4',current='1',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:current,
                    count:count,
                    callback:(p)=>{
                        pageOps.params.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax:function(callback=function(){}){
                let that = this;
                this.itemsLoading = true
                let source = '';
                if(this.fliterType.order){
                    source += '1,'
                }
                if(this.fliterType.vehicle){
                    source += '2,'
                }
                if(this.fliterType.maintain){
                    source += '3,'
                }
                if(!source){
                    layer.msg('请至少勾选一种费用来源',{icon:2,time:1500})
                    this.itemsLoading = false;
                    return
                }
                //修改参数
                $.ajax({
                    url: `${base.gAjaxUrl.officialCarFees}car_fee_list/`,
                    type: 'GET',
                    data:{
                        vehicle_id:that.item.id,
                        source:source,
                        start_date:that.startDateInput,
                        end_date:that.endDateInput,
                        page: pageOps.params.page,
                        page_size: pageOps.params.page_size,
                    }
                }).always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
                        let resultData = data.results;
                        this.itemsLoading = false;
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
            getList:function () {
                let order = $('.order-cost').is(':checked');
                let vehicle = $('.vehicle-cost').is(':checked');
                let maintain = $('.maintain-cost').is(':checked');
                pageOps.params.page = 1;
                this.fliterType.order = order;
                this.fliterType.vehicle = vehicle;
                this.fliterType.maintain = maintain;
                this.queryAjax((tpageToal = '4', count = '0')=> {
                    this.initPage('#J-page', tpageToal, pageOps.params.page, count)
                });


            },
            callback:function(){
                this.$dispatch('return',this.state)
            },
            closeOrder:function () {
                this.isShowOrder = false;

            },
            closeMaintain:function () {
                this.isShowMaintain = false;

            },
            closeCost:function () {
                this.isShowCost = false;

            },
            exportBill:function () {
                if(moment(this.endDateInput).isBefore(this.startDateInput)){
                    layer.msg("开始时间不能大于结束时间",{icon:2,time:1500});
                    return
                }
                let order = $('.order-cost').is(':checked');
                let vehicle = $('.vehicle-cost').is(':checked');
                let maintain = $('.maintain-cost').is(':checked');
                let source = '';
                if(order){
                    source += '1,'
                }
                if(vehicle){
                    source += '2,'
                }
                if(maintain){
                    source += '3,'
                }
                let ajaxData = {
                    start_date:this.startDateInput,
                    end_date:this.endDateInput,
                    vehicle_id:this.item.id,
                    source:source,
                }
                $.ajax({
                    url: `${base.gAjaxUrl.officialCarFees}car_fee_export/`,
                    type:'GET',
                    data:ajaxData
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
                        this.$route.router.go({path: '/job'})
                    })

                })
            },
            showDetails:function (item) {
                if(item.source === '订单费用'){
                    this.isShowOrder = true;
                }else if(item.source === '车辆费用'){
                    this.isShowCost = true;
                }
                else if(item.source === '维修费用'){
                    this.isShowMaintain = true;
                }
                this.dialogData = item;
            }
        },
        filters:{},
        events:{
        },
        components:{
            order:order,
            maintain:maintain,
            cost:cost,
        },
    }
</script>