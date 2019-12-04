<template>
    <details v-if="isShowDetails"  :start="startDateInput" :datekey="dateKey" :end="endDateInput" :state="fliterType" :item="detailsData"></details>
    <section class="Hui-article-box" v-if="!isShowDetails">
        <div class="page-container bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body clearfix">
                    <span class="f-20 fw-b f-l">车辆账单</span>
                    <a class="btn btn-secondary radius f-r mr-20" title="导出车辆账单" href="javascript:;" v-on:click="exportBill()">导出车辆账单</a>
                </div>
            </div>
            <div class="mt-10 bgc-fff clearfix">
                <div class="pd-10 clearfix">
                    <div class="inline-block ml-10">
                        费用来源：
                        <label>
                            <input type="checkbox" class="check-box order-cost" :checked="fliterType.order">
                            订单费用
                        </label>
                        <label>
                            <input type="checkbox" class="check-box vehicle-cost" :checked="fliterType.vehicle">
                            车辆费用
                        </label>
                        <label>
                            <input type="checkbox" class="check-box maintain-cost" :checked="fliterType.maintain">
                            维修费用
                        </label>
                        <!--</span>-->
                    </div>
                    <div class=" mt-5 inline-block ml-20">
                        <div class="inline-block">
                            开始日期：
                            <input  v-model="startDateInput" type="text" class="input-text Wdate mr-5 " style="width:120px;" id="J-start-outer-date" v-bind:value="startDateInput">
                        </div>
                        <div class="inline-block">
                            结束日期：
                            <input v-model="endDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-end-outer-date" v-bind:value="endDateInput">
                        </div>
                        <div class="inline-block">
                            时间类型：
                            <select class="select-box" v-model="dateKey">
                                <option value="fs_date">发生日期</option>
                                <option value="jz_date">记账日期</option>
                            </select>
                        </div>
                    </div>
                    <div class="inline-block relative ml-10">
                        <input type="text" class="input-text Wdate mr-5" v-model="searchContent" style="width:150px;" placeholder="请输入车牌号" id="searchInput">
                    </div>
                    <button type="submit" class="btn btn-success radius" v-on:click="getList()"><i class="Hui-iconfont">&#xe665;</i></button>

                </div>
                <div class="materials bk-gray radius bgc-fff">
                    <table class="waterElectricityForm table table-border table-bg table-striped bor-l bor-r">
                        <thead class="text-c">
                        <tr>
                            <th width="">车牌号</th>
                            <th width="">品牌</th>
                            <th width="">型号</th>
                            <th width="">座位数</th>
                            <th width="">费用总金额</th>
                            <th width="">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr class="text-c" v-for="data in items">
                            <td>{{data.car_no}}</td>
                            <td>{{data.car_brand}}</td>
                            <td>{{data.car_model}}</td>
                            <td>{{data.seats}}</td>
                            <td>{{data.fee ? data.fee / 100 : '' }}</td>
                            <td>
                                <a href="javascript:;" class="btn btn-primary radius" @click="showDetails(data)">查看详情</a>
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
    .select-box{
        width:100px;
    }

</style>
<script>
    import * as base from '../../assets/js/base.js';
    import moment from "moment";
    import details from "../components/billDetails";

    let billOps = {
    }

    export default{
        ready(){
            billOps.params = {
                page:1,
                page_size:10,
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
            this.getList();
        },
        data:function () {
            return{
                noData:false,
                startDateInput:'',
                endDateInput:'',
                isShowDetails:false,
                searchContent:'',
                itemsLoading:false,
                fliterType:{
                    order:true,
                    vehicle:true,
                    maintain:true,
                },
                items:[{}],
                detailsData:'',
                dateKey:"fs_date"
            }
        },
        methods:{
            initPage:function(obj,tpageToal='4',current='1',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:current,
                    count:count,
                    callback:(p)=>{
                        billOps.params.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax:function(callback=function(){}){
                let that = this;
                this.itemsLoading = true;
                let source = "";
                let sourceArr = [];
                if(this.fliterType.order){
                    sourceArr.push(1);
                    // source += '1,'
                }
                if(this.fliterType.vehicle){
                    sourceArr.push(2);
                    // source += '2,'
                }
                if(this.fliterType.maintain){
                    sourceArr.push(3);
                    // source += '3,'
                }
                source = sourceArr.join();

                if(!source){
                    layer.msg('请至少勾选一种费用来源',{icon:2,time:1500})
                    this.itemsLoading = false;
                    return
                }
                //修改参数
                $.ajax({
                    url: `${base.gAjaxUrl.officialcarBillList_V2}statlist/`,
                    type: 'GET',
                    data:{
                        search:that.searchContent,
                        source:source,
                        start_date:that.startDateInput,
                        end_date:that.endDateInput,
                        page:billOps.params.page,
                        page_size:billOps.params.page_size,
                        key_date:that.dateKey
                    }
                }).always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
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
            getList:function () {
                let order = $('.order-cost').is(':checked');
                let vehicle = $('.vehicle-cost').is(':checked');
                let maintain = $('.maintain-cost').is(':checked');
                billOps.params.page = 1;
                this.fliterType = {
                    order:order,
                    vehicle:vehicle,
                    maintain:maintain,
                }
                this.queryAjax((tpageToal = '4', count = '0')=> {
                    this.initPage('#J-page', tpageToal, billOps.params.page, count)
                });

            },
            showDetails:function (item) {
                this.isShowDetails = true;
                this.detailsData = item;

            },
            closeDetails:function () {
                this.isShowDetails = false;
                // v-if的切换无法重新进入生命周期的函数,导致日历无法选择.所以在这个地方需要再初始化一次
                this.$nextTick(()=>{
                    new Kalendae.Input('J-start-outer-date', {
                        months: 1,
                        clickHide:true
                    });
                    new Kalendae.Input('J-end-outer-date', {
                        months: 1,
                        clickHide:true
                    });
                })

                this.queryAjax((tpageToal = '4', count = '0')=> {
                    this.initPage('#J-page', tpageToal, billOps.params.page, count)
                });
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
                    source += '1'
                }
                if(vehicle){
                    source += ',2'
                }
                if(maintain){
                    source += ',3'
                }

                let ajaxData = {
                    start_date:this.startDateInput,
                    end_date:this.endDateInput,
                    car_no:this.searchContent,
                    source:source,
                    date_key:this.dateKey
                }
                $.ajax({
                    url: `${base.gAjaxUrl.officialcarBillList_V2}statlist_export/`,
                    type:'GET',
                    data:ajaxData
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
                        this.$route.router.go({path: '/job'})
                    })

                })
            }

        },
        filter:{},
        events:{
            'return':function (data) {
                this.fliterType = data;
                this.closeDetails();
            }
        },
        components:{
            details:details,
        },
    }
</script>
