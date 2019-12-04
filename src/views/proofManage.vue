<template>
    <proof_dateil v-if="isShowDetail" :data="currentData" @close="closeDialog"></proof_dateil>
    <down v-if="isShowDownProof" :data="currentData" @dialog-close="closeDown"></down>
    <section v-if="!isShowDetail" class="Hui-article-box">
        <div class="page-container bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body clearfix">
                    <span class="f-20 fw-b f-l">凭证管理</span>
                    <a class="btn btn-secondary radius f-r mr-20" title="导出数据" href="javascript:;" v-on:click="exportData()">导出数据</a>
                </div>
            </div>
            <div class="mt-10 bgc-fff clearfix">

                <div class="pd-10 clearfix">

                    <div class="inline-block ml-10 v-m">
                        凭证状态：
                        <span class="select-box inline mr-5">
                            <select id="approvalStatusSelected" v-model="orderStatus" class="select" >
                                <option value="">全部</option>
                                <option value="10">已开凭证</option>
                                <option value="20">修改凭证</option>
                                <!--<option value="-10">已取消</option>-->
                            </select>
                        </span>
                    </div>
                    <div class=" mt-5 inline-block ml-10 v-m">
                        <div class="inline-block">
                            开始日期：
                            <input  v-model="startDateInput" type="text" class="input-text Wdate mr-5 " style="width:120px;" id="J-start-outer-date" >
                        </div>
                        <div class="inline-block">
                            结束日期：
                            <input v-model="endDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-end-outer-date"  >
                        </div>

                    </div>
                    <div class="inline-block relative ml-10 clearfix v-m">
                        <select id="selectFilter" v-model="searchType" class="select f-l" >
                            <option value="real_name">姓名</option>
                            <option value="phone">手机号</option>
                            <option value="job_number">工号</option>
                            <option value="position">职位</option>
                            <option value="department">部门</option>
                        </select>
                        <input type="text" v-model="searchContent" class="input-text Wdate f-l" style="width:150px; margin-left: 69px;" placeholder="请输入搜索内容" id="searchInput"><button type="submit" class="btn btn-success radius-r f-l" v-on:click="getList()"><i class="Hui-iconfont">&#xe665;</i></button>
                    </div>

                </div>

                <div class="materials bk-gray radius bgc-fff">
                    <table class="waterElectricityForm table table-border table-bg table-striped bor-l bor-r">
                        <thead class="text-c">
                        <tr>
                            <th width="80">姓名/性别</th>
                            <th width="120">部门/职位</th>
                            <th width="80">工号</th>
                            <th width="80">电话</th>
                            <th width="80">开凭证时间</th>
                            <th width="200">金额(元)</th>
                            <th width="60">凭证状态</th>
                            <th width="60">备注</th>
                            <th width="100">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr class="text-c" v-for="data in items">
                            <td>{{data.staff_vo.real_name}}/{{data.staff_vo.sex == 1?'男':'女'}}</td>
                            <td>{{data.staff_vo.department_name}}/{{data.staff_vo.position?data.staff_vo.position:'--'}}</td>
                            <td>{{data.staff_vo.job_number}}</td>
                            <td>{{data.staff_vo.phone}}</td>
                            <td>{{data.open_time}}</td>
                            <td>{{data.money}}</td>
                            <td>{{data.status_name}}</td>
                            <td>{{data.remark}}</td>
                            <td>
                                <a v-if="data.status == 10"  class="btn btn-link radius" href="javascript:;" v-on:click="modifyData(data)">修改</a>
                                <a  class="btn btn-link radius" href="javascript:;" v-on:click="showDetail(data)">订单详情</a>
                                <a v-if="data.status == 10"  class="btn btn-link radius" href="javascript:;" v-on:click="clickDown(data)">下载凭证</a>

                            </td>

                        </tr>
                        </tbody>
                    </table>
                    <div id="K-page" class="m-page" v-show="!noData"></div>
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
<script type="text/ecmascript-6">

    import * as base from '../assets/js/base.js';
    import proof_dateil from "components/proofDetail.vue"
    import down from "../components/downProof"
    import moment from "moment";

    let pageOps = null;

    export default{
        ready(){
            pageOps = {
                params: {
                    page:1,
                    page_size:10,
                }
            };
            this.startDateInput = moment().add(-1, "months").format('YYYY-MM-DD');
            this.endDateInput = moment().format('YYYY-MM-DD');

            new Kalendae.Input('J-start-outer-date', {
                months: 2,
                clickHide:true
            });
            new Kalendae.Input('J-end-outer-date', {
                months: 2,
                clickHide:true
            });

            this.getList();

        },
        data:function () {
            return{
                items:[],
                noData:false,
                searchType:'real_name',
                searchContent:'',
                itemsLoading:'',
                orderStatus:'',
                startDateInput:'',
                endDateInput:'',
                pathData: null,
                isShowPath: false,
                isShowDetail:false,
                currentData:{},
                isShowDownProof:false,
            }
        },
        methods:{
            showDetail:function(data){
                this.currentData = data;
                this.isShowDetail = true;
            },
            closeDialog:function(){
                this.isShowDetail = false;
                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#K-page',tpageToal,pageOps.params.page,count)
                });
            },
            closeDown:function(){
                this.isShowDownProof = false;
            },
            modifyData:function(data){
                layer.confirm('是否确认修改该凭证',()=>{
                    $.ajax({
                        url:`${base.gAjaxUrl.privateCarProofList}${data.id}/release/`,
                        type:"POST",
                    }).always((data)=>{
                        base.ajaxCallback(data,()=>{
                            layer.msg("保存成功",{icon:1,time:1500});
                            this.queryAjax((tpageToal='4',count='0')=>{
                                this.initPage('#K-page',tpageToal,pageOps.params.page,count)
                            });
                        })
                    })
                })
            },
            getList:function () {
                pageOps.params.page = 1;
                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#K-page',tpageToal,pageOps.params.page,count)
                });
            },
            queryAjax:function(callback=function(){}){
                if(moment(this.endDateInput).isBefore(this.startDateInput)){

                    layer.msg("开始时间不能大于结束时间",{icon:2,time:2000});
                    return
                }
                //修改参数
                this.itemsLoading = true;
                let that = this;
                let ajaxData = {
                    page: pageOps.params.page,
                    page_size: pageOps.params.page_size,
                    status:this.orderStatus,
                    start_date:this.startDateInput,
                    end_date:this.endDateInput,
                };
                ajaxData[this.searchType] = this.searchContent;
                $.ajax({
                    url: `${base.gAjaxUrl.privateCarProofList}`,
                    type: 'GET',
                    data:ajaxData
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
            clickDown:function(item){
                this.isShowDownProof = true;
                this.currentData = item;
            },
            exportData: function () {
                let that = this;
                let ajaxData = {
                    status:this.orderStatus,
                    start_date:this.startDateInput,
                    end_date:this.endDateInput,
                };
                ajaxData[this.searchType] = this.searchContent;

                $.ajax({
                    url: `${base.gAjaxUrl.privateCarProofList}export/`,
                    type:'GET',
                    contentType: "application/json;charset=utf-8",
                    data:ajaxData,
                }).always((data)=>{
                    this.$route.router.go({path: '/job'});
                    // layer.msg('最新的一条数据请重新刷新哦',{icon:1,time:3000});
                })
            },
        },
        filters:{
            translateKm:function(value){
                return (value / 1000 ).toFixed(2);
            }
        },
        events:{},
        components:{
            proof_dateil,
            down
        },
    }
</script>
