<template>

    <section class="Hui-article-box">
        <div v-show="globalImageSrc" id="previewWindow">
            <img id="previewWindowImage" v-bind:src="globalImageSrc" />
            <span @click="closeImagePreview" class="close-btn-img">x</span>
        </div>
        <div class="page-container">
            <div class="bk-gray radius mt-10">
                <div class="pd-15 clearfix">
                    <span class="f-l lh-30 ml-10 fw-b">物资领用记录</span>
                    <span class="f-l lh-30 ml-10">状态：</span>
                    <span class="select-box f-l mr-10 w-100">
                        <select v-model="selectApprovalStatus" class="select">
                            <option value="" selected>全部</option>
                            <option value="20">已领取</option>
                            <option value="10">申请中</option>
                            <option value="-10">已取消</option>
                        </select>
                    </span>
                    <span class="f-l lh-30 ml-10">部门：</span>
                    <div class="f-l departmentInput mr-5">
                        <div class="department_select_container" @click="departmentClick" @mouseleave="departmentEnter(false)" @mouseenter="departmentEnter(true)">
                            <input v-if="departmentItem.length === 0" disabled type="text" class="input-text" value="无可选择部门">
                            <input v-else autocomplete="off" v-model="departmentSelectedName" type="text" class="input-text" value="" placeholder="" name="department">
                            <i v-show="departmentSelectedName !== ''" class="empty-icon Hui-iconfont" @click="emptySearch()">&#xe60b;</i>
                            <div class="departmentListBox" style="display: none">
                                <div v-bind:title="item.department_tree" v-for="item in departmentItem | filterBy departmentSelectedName in 'department_tree'" @click="setDepartmentValue(item)" class="departmentListItem">{{item.department_tree}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="f-l ml-10 text-l clearfix">
                        <input id="searchInput"  type="text"  placeholder="姓名/职位/物资" style="width:200px" class="f-l input-text">
                        <button v-on:click="getList(1)" class="btn btn-success radius-r" type="button"><i class="f-r Hui-iconfont">&#xe665;</i></button>
                    </div>
                    <div class="f-r lh-30 mt-10-1300">
                        <span class="f-l mr-5">导出数据日期：</span>
                        <span class="f-l mr-5">开始</span>
                        <input  v-model="start_date" type="text" class="input-text Wdate mr-5 f-l" style="width:120px;" id="J-start-date" v-bind:value="start_date">
                        <span class="f-l mr-5">结束</span>
                        <input v-model="end_date" type="text" class="input-text Wdate mr-5 f-l" style="width:120px;" id="J-end-date" v-bind:value="end_date">
                        <button id="exportData" class="btn btn-primary radius f-l" v-on:click="exportData()">导出数据</button>
                    </div>
                </div>
                <table class="table table-bg table-border table-bordered">
                    <thead class="text-c">
                        <tr>
                            <th>申请时间</th>
                            <th>申请人</th>
                            <th>部门/职位/等级</th>
                            <th>领用物资</th>
                            <th>图片</th>
                            <th class="remark">规格型号</th>
                            <th>单位</th>
                            <th>数量</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="text-c" v-for="item in items">
                            <td>{{item.ctime}}</td>
                            <td>{{item.staff_vo.real_name}}</td>
                            <td>{{item.staff_vo.department_vo.department_name + '/' + item.staff_vo.position + '/' + (item.staff_vo.level || '无')}}</td>
                            <td>{{item.goods_vo.name}}</td>
                            <td class="goods_img_td">
                                <img class="goods_img" v-if="!item.goods_vo.url" src="../assets/images/materials-g.png" alt="">
                                <img @click="previewImage(item.goods_vo.url)" class="goods_img" v-else v-bind:src="item.goods_vo.url" alt="">
                                <!--<img v-bind:src="item.url || '../assets/images/materials-g.png'" alt="">-->
                            </td>
                            <td>{{item.goods_vo.format}}</td>
                            <td>{{item.goods_vo.unit}}</td>
                            <td>{{item.number}}</td>
                            <td>
                                <a v-if="item.status == 10" class="btn btn-success radius mr-5 fs-12" title="确认领用" href="javascript:;" class="ml-5" v-on:click="sure(item)">确认领用</a>
                                <a v-if="item.status == 10" class="btn btn-default radius mr-5 fs-12" title="取消领用" href="javascript:;" class="ml-5" v-on:click="cancel(item)">取消领用</a>
                                <span v-if="item.status == 20" class="btn btn-primary disabled radius mr-5 fs-12" class="ml-5">已领用</span>
                                <span v-if="item.status == -10" class="btn btn-default disabled radius mr-5 fs-12" class="ml-5">已取消</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div id="J-page" class="m-page" v-show="!noData"></div>
                <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
                <div class="m-loading" v-if="itemsLoading">
                    <div class="cube1"></div>
                    <div class="cube2"></div>
                </div>
            </div>
        </div>
    </section>
</template>
<style lang="less" scoped>
    .fw-b{
        font-weight: bold;
    }
    .btn.pd-4{
        padding: 4px;
    }
    .btn.fs-12{
        font-size: 12px;
    }
    .remark{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 150px;
    }
    .remark:hover{
        white-space:normal;
        overflow: visible;
        text-overflow: clip;
    }
    .goods_img_td {
        padding: 2px 0;
    }
    .goods_img {
        width: 35px;
        height: 35px;
        display: inline-block;
        vertical-align: middle;
    }
    .departmentInput {
        width: 200px;
        display: inline-block;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import moment from 'moment';
    import detail from '../components/pubrepairorderDetail.vue';

    let repairOps = null;

    export default{
        ready(){
            repairOps = {
                param:{
                    page:1,
                    page_size:10,
                    departmentSelected: '',
                    selectApprovalStatus: '',
                }
            };
            let that = this;
            this.start_date = moment().add('-1','months').format('YYYY-MM-DD');
            this.end_date = moment().format('YYYY-MM-DD');
            new Kalendae.Input('J-end-date', {
                months: 2,
                clickHide: true
            });
            new Kalendae.Input('J-start-date', {
                months: 2,
                clickHide: true
            });
            repairOps.param.page = 1;
            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-page',tpageToal,repairOps.param.page,count)
            });
            this.getDepartment();
        },
        data: function(){
            return{
                noData:false,
                itemsLoading:false,
                isShowDetailDialog:false,
                items: [],
                departmentItem: [],
                departmentSelected: '',
                departmentSelectedName: '',
                selectApprovalStatus: '',
                searchInput:'',
                start_date: '',
                end_date: '',
                globalImageSrc: '',
            }
        },
        methods: {
            getDepartment: function () {
                $.ajax({
                    url: base.gAjaxUrl.departments,
                    type: 'GET',
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
                        let resultData = data;
                        this.departmentItem = resultData && resultData.length ? resultData : [];
                    })
                })
            },
            sure: function (item) {
                let that = this;
                layer.confirm('确认【' + item.staff_vo.real_name + '】已领取物资', function (index) {
                    $.ajax({
                        url: `${base.gAjaxUrl.goods}${item.id}/confirm_get/`,
                        type: 'GET',
                    }).always((data)=>{
                        base.ajaxCallback(data,()=>{
                            if(that.items.length == 1 && that.selectApprovalStatus == 10) {
                                repairOps.param.page--;
                                repairOps.param.page = repairOps.param.page > 1 ? repairOps.param.page : 1;
                            }
                            that.getList();
                        })
                    })
                    layer.close(index);
                })
            },
            cancel: function (item) {
                let that = this;
                layer.confirm('是否取消此领用申请', function (index) {
                    $.ajax({
                        url: `${base.gAjaxUrl.goods}${item.id}/cancel/`,
                        type: 'GET',
                    }).always((data)=>{
                        base.ajaxCallback(data,()=>{
                            if(that.items.length == 1 && that.selectApprovalStatus == 10) {
                                repairOps.param.page--;
                                repairOps.param.page = repairOps.param.page > 1 ? repairOps.param.page : 1;
                            }
                            that.getList();
                        })
                    })
                    layer.close(index);
                })
            },
            //初始化分页
            initPage:function(obj,tpageToal='4',current='1',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:current,
                    count:count,
                    callback:(p)=>{
                        repairOps.param.page = p;
                        this.queryAjax();
                    }
                })
            },
            //获取公共区域报修订单列表
            getList:function(reset=0){
                let that = this;
                //重置第一页
                if(reset){
                    this.searchInput = $("#searchInput").val();
                    repairOps.param.page = 1;
                    repairOps.param.selectApprovalStatus = this.selectApprovalStatus;
                    repairOps.param.departmentSelected = this.getDepartmentId(this.departmentSelectedName);
                }
                this.queryAjax((tpageToal='4',count='0')=>{
                    that.initPage('#J-page',tpageToal,repairOps.param.page,count)
                })
            },
            previewImage: function (url) {
                this.globalImageSrc = url;
            },
            closeImagePreview: function (e) {
                this.globalImageSrc = "";
            },
            queryAjax:function(callback=function(){}){
                //修改参数
                this.itemsLoading = true;
                repairOps.param.status = this.selectOrderStatus;
                repairOps.param.approval_status = this.selectApprovalStatus;

                $.ajax({
                    url: base.gAjaxUrl.goods,
                    type: 'GET',
                    data: {
                        search: this.searchInput,
                        status: repairOps.param.selectApprovalStatus,
                        department: repairOps.param.departmentSelected,
                        page: repairOps.param.page,
                        page_size: repairOps.param.page_size,
                    }
                })
                .always((data)=>{
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
                    })
                })
            },
            exportData: function () {
                if(moment(this.end_date).isBefore(this.start_date)){
                    layer.msg("开始时间不能大于结束时间",{icon:2,time:1500});
                    return
                }
                 $.ajax({
                     url: `${base.gAjaxUrl.goods}data/`,
                     contentType: 'application/json',
                     type:'post',
                     data: JSON.stringify({
                         start_date: this.start_date,
                         end_date: this.end_date,
                     })
                 })
                 .always((data)=>{
                     this.$route.router.go({path: '/job', replace: true})
                 })
            },
            departmentClick: function () {
                if(this.isDepartmentFocus) {
                    $(".departmentListBox").show();
                }
            },
            // 清除搜索输入框
            emptySearch:function(){
                this.departmentSelectedName = '';
                $(".departmentListBox").show();
            },
            departmentEnter: function (flag) {
                this.isDepartmentFocus = flag;
                !flag && $(".departmentListBox").hide();
            },
            setDepartmentValue: function (item) {
                this.departmentSelectedName = item.department_tree;
                this.departmentSelected = item.id;
                $(".departmentListBox").hide();
            },
            getDepartmentId: function (val) {
                var id = '';
                this.departmentItem.forEach(function (item) {
                    if(item.department_tree == val) {
                        id = item.id;
                    }
                });
                return id;
            }
        },
        components: {
        }
    }
</script>