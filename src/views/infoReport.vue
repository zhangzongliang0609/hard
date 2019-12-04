<template>
    <section class="Hui-article-box">
        <div class="page-container bgc-f5">
            <div class="panel panel-default radius">
				<div class="panel-body f-20 fw-b">材料使用统计</div>
			</div>
            <div class="bk-gray radius mt-10 bgc-fff">
                <div class="pd-15 clearfix">
                    <div class="f-l">
                        开始日期：
                        <input type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-start-date" v-model="startDateInput">
                        结束日期：
                        <input type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-end-date" v-model="endDateInput">
                    </div>
                    <div class="text-l clearfix f-l ml-15">
                        <input v-model="searchInput"
                               type="text"
                               placeholder="材料名称"
                               autocomplete="off"
                               style="width:200px"
                               class="f-l input-text">
                        <button v-on:click="getList(1)"
                                class="btn btn-success radius-r"
                                type="button"><i class="f-r Hui-iconfont">&#xe665;</i></button>
                    </div>
                    <a class="btn btn-secondary radius f-r" v-on:click="exportData()">数据导出</a>
                </div>
                <table class="table table-border table-bg table-striped">
                    <thead class="text-c">
                        <tr>
                            <th width="100">材料名称</th>
                            <th width="100">规格型号</th>
                            <th width="100">品牌</th>
                            <th width="100">属性</th>
                            <th width="100">单位</th>
                            <th width="100">数量</th>
                            <th width="100">单价(元)</th>
                            <th width="100">统计费用(元)</th>
                            <th width="100">材料来源</th>
                        </tr>
                    </thead>
                    <tbody class="text-c">
                        <tr v-for="item in items">
                            <td>{{item.repairordermaterial__material_name || '--'}}</td>
                            <td>{{item.format || '--'}}</td>
                            <td>{{item.brand || '--'}}</td>
                            <td>{{item.prop || '--'}}</td>
                            <td>{{item.unit || '--'}}</td>
                            <td>{{item.used_cnt || '0'}}</td>
                            <td>{{item.price.toFixed(0)}}</td>
                            <td>{{item.total_price.toFixed(0)}}</td>
                            <td>{{item.source}}</td>
                        </tr>
                    </tbody>
                </table>
                <div id="J-page" class="m-page" v-show="!noData"></div>
                <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>

            </div>
        </div>
    </section>
</template>
<style lang="less" rel="stylesheet" scoped>
    .bgc-f5{
        background-color: #f5f5f5;
    }
    .fw-b{
        font-weight: bold;
    }
</style>
<script>
    import * as base from '../assets/js/base.js';
    import moment from "moment";

    let vm;

    export default{
        ready(){

            vm = this;
            this.startDateInput = moment().add('-1','months').format('YYYY-MM-DD');
            this.endDateInput = moment().format('YYYY-MM-DD');

            new Kalendae.Input('J-end-date', {
                months: 2,
                clickHide:true,
            });
            new Kalendae.Input('J-start-date', {
                months: 2,
                clickHide:true,
            });

            this.getList(1);

        },
        data: function(){
            return{
                noData:false,
                items: [],
                startDateInput:'',
                endDateInput:'',
                dialogTitle:'添加维修工',
                dialogType:'add',
                dialogData:'',
                searchInput:'',
                pageOpts: {
                    page: 1,
                    page_size: 10,
                    start_date: '',
                    end_date: '',
                    name: ''
                }
            }
        },
        events: {
            enterEvent () {
                this.getList(1);
            }
        },
        methods: {
            //初始化分页
            initPage (obj,tpageToal='4',current='1',count='0') {
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:current,
                    count:count,
                    callback:(p)=>{
                        this.pageOpts.page = p;
                        this.queryAjax();
                    }
                });
            },
            //获取列表
            getList:function(reset=0){
                //重置第一页
                if(reset){
                    if(moment(this.endDateInput).isBefore(moment(this.startDateInput))) {
                        layer.msg("结束时间不得早于开始时间", {icon:2, time: 1500});
                        return;
                    }
                    this.pageOpts.page = 1;
                    this.pageOpts.start_date = this.startDateInput;
                    this.pageOpts.end_date = this.endDateInput;
                    this.pageOpts.name = this.searchInput;
                }

                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-page',tpageToal,this.pageOpts.page,count)
                });

            },
            queryAjax:function(callback=function(){}){
               $.showLoading();
                $.ajax({
                    url: base.gAjaxUrl.infoReport,
                    type: 'GET',
                    data: this.pageOpts
                }).always((data)=>{
                    $.hideLoading();
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
            exportData () {
                $.showLoading();
                $.ajax({
                    url: base.gAjaxUrl.materials + 'exporttotal/',
                    type: 'GET',
                    data: {
                        name: this.pageOpts.name,
                        start_date: this.pageOpts.start_date,
                        end_date: this.pageOpts.end_date
                    }
                }).always((data) => {
                    $.hideLoading();
                    base.ajaxCallback(data, () => {
                        this.$router.go({path: '/job', replace: false});
                    })
                })
            }
        },
        components: {

        }
    }
</script>
