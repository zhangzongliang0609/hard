<template>

    <details v-if="isShowDetails"  :start="startDateInput"  :end="endDateInput" @back="closeDetails" :data="currentItem"></details>

    <section class="Hui-article-box" v-if="!isShowDetails">
        <div class="page-container">
            <div class="panel panel-default radius">
                <div class="panel-body">
                    <span class="f-20 fw-b">补贴统计</span>
                </div>
            </div>

            <div class="cl mt-10 mb-10 pt-10 pb-10">

                <div class="inline-block relative f-l filter-box">
                    <select class="select-box fs-14 f-l" v-model="searchKey" >
                        <option value="real_name">姓名</option>
                        <option value="phone">手机</option>
                        <option value="job_number">工号</option>
                        <option value="position">职位</option>
                    </select>
                    <input type="text" v-model="searchContent" class="input-text Wdate mr-5 f-l" placeholder="请输入搜索内容" id="searchInput">
                </div>

                <div class=" inline-block ml-10">
                    <div class="inline-block">
                        开始日期：
                        <input  v-model="startDateInput" type="text" class="input-text Wdate mr-5 " style="width:120px;" id="J-start-outer-date" >
                    </div>
                    <div class="inline-block">
                        结束日期：
                        <input v-model="endDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-end-outer-date"  >
                    </div>

                </div>


                <button type="submit" class="btn btn-success radius" v-on:click="getList()"><i class="Hui-iconfont">&#xe665;</i></button>


                <a class="btn btn-secondary radius f-r mr-20" title="导出数据" href="javascript:;" v-on:click="exportData()">导出数据</a>
            </div>
            <table class="table table-border table-bordered table-hover table-bg table-sort">
                <thead>
                <tr class="text-c">
                    <th width="70">姓名/性别</th>
                    <th width="70">部门/职位</th>
                    <th width="70">工号</th>
                    <th width="70">电话</th>
                    <th width="70">补贴类型</th>
                    <th width="70">补贴方式</th>
                    <th width="70">里程数</th>
                    <th width="70">总金额</th>
                    <th width="150">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr class="text-c" v-for="item in items">
                    <td>{{item.staff_vo.real_name}}/{{item.staff_vo.sex_label}}</td>
                    <td>{{item.staff_vo.department_name}}/{{item.staff_vo.postition}}</td>
                    <td>{{item.staff_vo.job_number}}</td>
                    <td>{{item.staff_vo.phone}}</td>
                    <td>{{item.subsidy_vo.type}}</td>
                    <td>{{item.subsidy_vo.mode}}</td>
                    <td>{{item.order_mileage > 0 ? (item.order_mileage / 1000).toFixed(2) : 0}}</td>
                    <td>{{item.fee}}</td>
                    <td>
                        <a class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="showDetails(item)">补贴明细</a>
                    </td>
                </tr>
                </tbody>
            </table>
            <div id="J-page" class="m-page" v-show="!noData"></div>
            <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
        </div>
    </section>
</template>

<style lang="less" rel="stylesheet" scoped>
    .filter-box{
        .select-box{
            width: 80px;
            height: 31px;
        }
        input{
            width: 200px;
            margin-left: -1px;
        }
    }
</style>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import details from "../components/subsidyDetails"
    import moment from "moment"
    let staffsOps = null;

    export default{
        ready () {
            staffsOps = {
                param:{
                    search:'',
                    page:1,
                    page_size:10,
                }
            };
            this.startDateInput = moment().add('-1','months').format('YYYY-MM-DD');
            this.endDateInput = moment().format('YYYY-MM-DD');

            new Kalendae.Input('J-end-outer-date', {
                months: 2,
                clickHide:true,
            });
            new Kalendae.Input('J-start-outer-date', {
                months: 2,
                clickHide:true,
            });
            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-page',tpageToal,count)
            });

        },
        data:function(){
            return {
                searchContent:"",
                searchType:"",
                items:[],
                isShowDetails:false,
                searchKey:"real_name",
                startDateInput:"",
                endDateInput:"",
                currentItem:"",
                noData:true,
            }
        },
        methods: {
            //初始化分页
            initPage:function(obj,tpageToal='4',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:staffsOps.param.page,
                    count:count,
                    callback:(p)=>{
                        staffsOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax:function(callback=function(){}){
                $.showLoading();
                //修改参数
                let data  = {
                    page:staffsOps.param.page,
                    page_size: staffsOps.param.page_size,
                    start_date:this.startDateInput,
                    end_date:this.endDateInput
                }
                data[this.searchKey] = this.searchContent;
                $.ajax({
                    url: `${base.gAjaxUrl.subsidyStatistics}state/`,
                    type: 'GET',
                    data:data
                })
                    .always((data)=>{
                        $.hideLoading();
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
            //获取列表
            getList:function(reset=0){
                let that = this;

                if (moment(this.endDateInput).isBefore(this.startDateInput)) {
                    layer.msg("开始时间不能大于结束时间", {icon: 2, time: 1500});
                    return
                }
                //重置第一页
                if(reset){
                    staffsOps.param.page = 1
                }

                this.queryAjax((tpageToal='4',count='0')=>{
                    that.initPage('#J-page',tpageToal,count)
                });
            },
            showDetails:function(item){
                this.currentItem = item;
                this.isShowDetails = true;
            },
            //删除
            deleteBtn:function(car_num,id){
                let that = this;
                layer.confirm('删除须谨慎，确认要删除【'+car_num+'】吗？',(index)=>{
                    if($('tbody tr.text-c').length == 1 && staffsOps.param.page>1){
                        staffsOps.param.page--;
                    }
                    $.ajax({
                        url: `${base.gAjaxUrl.officialcarVehicleList_V2}${id}/`,
                        type: 'DELETE',
                    })
                        .always((data)=>{
                            layer.msg('删除成功',{icon:1,time:1000});
                            that.getList();
                        })
                });
            },
            closeDetails:function(){
                this.isShowDetails = false;
                this.$nextTick(()=>{
                    new Kalendae.Input('J-end-outer-date', {
                        months: 2,
                        clickHide:true,
                    });
                    new Kalendae.Input('J-start-outer-date', {
                        months: 2,
                        clickHide:true,
                    });
                    this.getList();
                })
            },
            exportData: function () {
                $.showLoading();
                let ajaxData = {
                    start_date:this.startDateInput,
                    end_date:this.endDateInput,
                }
                ajaxData[this.searchKey] = this.searchContent;
                $.ajax({
                    url: `${base.gAjaxUrl.subsidyStatistics}state_export/`,
                    type:'GET',
                    data: ajaxData,
                }).always((data)=>{
                    $.hideLoading();
                    this.$route.router.go({path: '/job'});
                })
            }
        },
        components:{
            details
        }
    }
</script>
