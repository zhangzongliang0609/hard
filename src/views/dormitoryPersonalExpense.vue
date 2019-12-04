<template>
    <section class="Hui-article-box">
        <div class="page-container relative">
            <div class="panel panel-default relative radius title">
                <div class="title-body clearfix">
                    <div class="f-20 fw-b mt-15 ml-15 f-l title-text"> 个人费率管理 </div>
                    <div class="f-l mr-15 mt-5 title-item">
                        <span>宿舍楼：</span>
                        <select v-model="buildingSelectedId" class="select">
                            <option value="">全部</option>
                            <option v-bind:value="item.id" :title="item.building_name" v-for="item in buildingsArr">{{item.building_name}}</option>
                        </select>
                    </div>
                    <div class="f-l mr-15 mt-5 title-item">
                        <span>房间类型：</span>
                        <select v-model="roomTypeSelected" class="select">
                            <option value="">全部</option>
                            <option v-bind:value="item.id" :title="item.type_name" v-for="item in roomTypeArr">{{item.type_name}}</option>
                        </select>
                    </div>
                    <div class="f-l mr-15 mt-5 title-item">
                        <span>部门：</span>
                        <div class="departmentContainer">
                            <div class="department_select_container" @click="departmentClick" @mouseleave="departmentEnter(false)" @mouseenter="departmentEnter(true)">
                                <input v-if="departmentItem.length === 0" disabled type="text" class="input-text" value="无可选择部门">
                                <input v-else autocomplete="off" v-model="departmentSelectedName" type="text" class="input-text" value="" placeholder="" name="department" id="department">
                                <i v-show="departmentSelectedName !== ''" class="empty-icon Hui-iconfont" @click="emptySearch()">&#xe60b;</i>
                                <div class="departmentListBox" style="display: none">
                                    <div v-bind:title="item.department_tree" v-for="item in departmentItem | filterBy departmentSelectedName in 'department_tree'" @click="setDepartmentValue(item)" class="departmentListItem">{{item.department_tree}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="f-l mr-15 mt-5 title-item">
                        <span>职位：</span>
                        <input autocomplete="off" v-model="positionSelected" type="text" class="input-text w-100" value="" placeholder="" name="department" id="positionSelected">
                    </div>
                    <div class="f-l mr-15 mt-5 title-item">
                        <span>学历：</span>
                        <input autocomplete="off" v-model="education" type="text" class="input-text  w-100" value="" placeholder="" name="department" id="education">
                    </div>
                    <div class="f-l mr-15 mt-5 title-item">
                        <span>员工分组：</span>
                        <select v-model="tagSelected" class="select">
                            <option value="">全部</option>
                            <option v-bind:value="item.id" :title="item.name" v-for="item in tagSelectedArr">{{item.name}}</option>
                        </select>
                    </div>
                    <div class="f-l mr-15 mt-5 clearfix search_box">
                        <select v-model="searchInputType" class="searchInputType select f-l">
                            <option value="real_name" selected>姓名</option>
                            <option value="job_number">工号</option>
                            <option value="phone">电话</option>
                            <option value="room_no">房间号</option>
                        </select>
                        <input id="searchInput" class="f-l input-text" type="text" placeholder="" style="width:250px">
                        <button v-on:click="getList(1)" class="btn btn-success f-l radius-r" type="button"><i class="f-r Hui-iconfont"> &#xe665; </i></button>
                    </div>
                </div>
            </div>
            <div class="panel panel-default relative radius content">
                <div class="position_box relative clearfix">
                    <div class="content-body relative" id="scroll-roll">
                        <!--
                         注意使用条件：
                            scroll-top-body 放上面的左边部分
                            scroll-bottom-body 放在下面的右边部门
                            保证两个body的内容 vue数据结构一样都是
                            在 scroll-top-body 的.table表格中增加一个id为 固定位置的选择点
                            在 scroll-top-body，scroll-bottom-body 的.table表格表格中，给显示出来的操作绑定相同的事件
                         -->
                        <div class="scroll-top-fixed">
                            <span class="scroll-top-fixed-mask"></span>
                            <div class="scroll-top-body">
                                <table style="table-layout:fixed;" class="fixedParent table table-border table-bordered table-bg table-sort">
                                    <thead>
                                    <tr class="text-c">
                                        <th width="80">楼</th>
                                        <th width="60">房间号</th>
                                        <th width="100">房间类型</th>
                                        <th width="60">容纳人数</th>
                                        <th width="120">姓名/性别</th>
                                        <th width="60">工号</th>
                                        <th width="100" id="colFixed">部门</th>
                                        <th width="100">职位</th>
                                        <th width="100">学历</th>
                                        <th width="100" class="hoverVisible">员工分组</th>
                                        <th width="100">手机号</th>
                                        <th width="100">入住时间</th>
                                        <!--<th width="100">退宿时间</th>-->
                                        <th width="120" class="costName" title="{{fee.name}}" track-by="$index" v-for="fee in feeItems">{{fee.name}}费率</th>
                                        <th width="60">操作</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr class="text-c" track-by="$index" v-for="rateItem in rateArr">
                                        <td title="{{rateItem.building_name || '--'}}">{{rateItem.building_name || "--"}}</td>
                                        <td title="{{rateItem.room_no || '--'}}">{{rateItem.room_no || "--"}}</td>
                                        <td title="{{rateItem.room_type_name || '--'}}">{{rateItem.room_type_name || "--"}}</td>
                                        <td title="{{rateItem.room_content || '--'}}">{{rateItem.room_content || "--"}}</td>
                                        <td title="{{rateItem.real_name}}/{{rateItem.sex === 1 ? '男' : '女'}}" class="td-hide name">{{rateItem.real_name}}/{{rateItem.sex === 1 ? "男" : "女"}}</td>
                                        <td title="{{rateItem.job_number || '--'}}" class="td-hide job">{{rateItem.job_number || "--"}}</td>
                                        <td title="{{rateItem.department_name || '--'}}">{{rateItem.department_name || "--"}}</td>
                                        <td title="{{rateItem.position || '--'}}">{{rateItem.position || "--"}}</td>
                                        <td title="{{rateItem.education || '--'}}">{{rateItem.education || "--"}}</td>
                                        <td class="hoverVisible">
                                            <div class="tag_container">
                                                <div @mouseenter="checkPosition($event, rateItem.staff_tags.length <= 1)" class="tag_box" v-if="rateItem.staff_tags.length">
                                                    <div class="tag_item">
                                                        <span title="{{rateItem.staff_tags[0].name}}">{{rateItem.staff_tags[0].name}}</span><span class="tag_more" v-if="rateItem.staff_tags.length > 1">...</span>
                                                    </div>
                                                    <div class="tag_second_box_sign"></div>
                                                    <div v-if="rateItem.staff_tags.length > 1" class="tag_second_box clearfix">
                                                        <div v-for="tag in rateItem.staff_tags" class="tag_item f-l" title="{{tag.name}}">{{tag.name}}</div>
                                                    </div>
                                                </div>
                                                <span v-else>--</span>
                                            </div>
                                        </td>
                                        <td title="{{rateItem.phone || '--'}}">{{rateItem.phone || "--"}}</td>
                                        <td>{{rateItem.checkin_time | time}}</td>
                                        <!--<td>{{rateItem.checkout_time | time}}</td>-->
                                        <!--<td title="{{rateItem.checkin_time && rateItem.checkin_time.slice(0, 10) || '&#45;&#45;'}}">{{rateItem.checkin_time && rateItem.checkin_time.slice(0, 10) || "&#45;&#45;"}}</td>-->
                                        <td v-for="fee in feeItems" track-by="$index">{{fee.id | getPoint rateItem.staff_fees}}</td>
                                        <td>
                                            <a title="clickReply" href="javascript:;" v-on:click="showModifyRate(rateItem)"><i class="Hui-iconfont">&#xe6df;</i></a>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="scroll-bottom-roll relative">
                            <!-- scroll-bottom-body dom元素会通过tranform: translate()来移动，所有scroll-bar会与scroll-bottom-body并列 -->
                            <div class="scroll-bottom-body relative">
                                <table @mouseenter="tableEnter($event)" @mouseleave="tableLeave($event)" style="table-layout:fixed;" class="fixedParent table table-border table-bordered table-bg table-sort">
                                    <thead>
                                    <tr class="text-c">
                                        <th width="80">楼</th>
                                        <th width="60">房间号</th>
                                        <th width="100">房间类型</th>
                                        <th width="60">容纳人数</th>
                                        <th width="120">姓名/性别</th>
                                        <th width="60">工号</th>
                                        <th width="100">部门</th>
                                        <th width="100">职位</th>
                                        <th width="100">学历</th>
                                        <th width="100" class="hoverVisible">员工分组</th>
                                        <th width="100">手机号</th>
                                        <th width="100">入住时间</th>
                                        <!--<th width="100">退宿时间</th>-->
                                        <th width="120" class="costName" title="{{fee.name}}" track-by="$index" v-for="fee in feeItems">{{fee.name}}费率</th>
                                        <th width="60">操作</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr class="text-c" track-by="$index" v-for="rateItem in rateArr">
                                        <td title="{{rateItem.building_name || '--'}}">{{rateItem.building_name || "--"}}</td>
                                        <td title="{{rateItem.room_no || '--'}}">{{rateItem.room_no || "--"}}</td>
                                        <td title="{{rateItem.room_type_name}}">{{rateItem.room_type_name || "--"}}</td>
                                        <td title="{{rateItem.room_content || '--'}}">{{rateItem.room_content || "--"}}</td>
                                        <td title="{{rateItem.real_name}}/{{rateItem.sex === 1 ? '男' : '女'}}" class="td-hide name">{{rateItem.real_name}}/{{rateItem.sex === 1 ? "男" : "女"}}</td>
                                        <td title="{{rateItem.job_number || '--'}}" class="td-hide job">{{rateItem.job_number || "--"}}</td>
                                        <td title="{{rateItem.department_name || '--'}}">{{rateItem.department_name || "--"}}</td>
                                        <td title="{{rateItem.position || '--'}}">{{rateItem.position || "--"}}</td>
                                        <td title="{{rateItem.education || '--'}}">{{rateItem.education || "--"}}</td>
                                        <td class="hoverVisible">
                                            <div class="tag_container">
                                                <div @mouseenter="checkPosition($event, rateItem.staff_tags.length <= 1)" class="tag_box" v-if="rateItem.staff_tags.length">
                                                    <div class="tag_item">
                                                        <span title="{{rateItem.staff_tags[0].name}}">{{rateItem.staff_tags[0].name}}</span><span class="tag_more" v-if="rateItem.staff_tags.length > 1">...</span>
                                                    </div>
                                                    <div class="tag_second_box_sign"></div>
                                                    <div v-if="rateItem.staff_tags.length > 1" class="tag_second_box clearfix">
                                                        <div v-for="tag in rateItem.staff_tags" class="tag_item f-l" title="{{tag.name}}">{{tag.name}}</div>
                                                    </div>
                                                </div>
                                                <span v-else>--</span>
                                            </div>
                                        </td>
                                        <td title="{{rateItem.phone || '--'}}">{{rateItem.phone || "--"}}</td>
                                        <td title="{{rateItem.checkin_time | time}}">{{rateItem.checkin_time | time}}</td>
                                        <!--<td title="{{rateItem.checkout_time | time}}">{{rateItem.checkout_time | time}}</td>-->
                                        <!--<td title="{{rateItem.checkin_time && rateItem.checkin_time.slice(0, 10) || '&#45;&#45;'}}">{{rateItem.checkin_time && rateItem.checkin_time.slice(0, 10) || "&#45;&#45;"}}</td>-->
                                        <td v-for="fee in feeItems" track-by="$index">{{fee.id | getPoint rateItem.staff_fees}}</td>
                                        <td>
                                            <a title="编辑" href="javascript:;" v-on:click="showModifyRate(rateItem)"><i class="Hui-iconfont">&#xe6df;</i></a>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="scroll-bar" v-show="!noData">
                                <div class="scroll-left no-selected">◀</div>
                                <!--<div class="scroll-pot no-selected">☰</div>-->
                                <div class="scroll-pot no-selected"></div>
                                <div class="scroll-right no-selected">▶</div>
                            </div>
                        </div>
                    </div>
                    <div id="J-page" class="m-page" v-show="!noData"></div>
                    <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
                </div>
            </div>
        </div>
        <div class="m-loading" v-if="itemsLoading">
            <div class="cube1"></div>
            <div class="cube2"></div>
        </div>
    </section>
    <modify v-if="isShowModifyDialog" v-bind:member="dialogRate" v-bind:fees="feeItems" v-on:dialog-close="closeModify" v-on:dialog-save="saveModify"></modify>
</template>
<style rel="stylesheet" lang="less" scoped>
    .departmentContainer {
        width: 120px;
        height: 100%;
        display: inline-block;
    }
    .table td, .table th {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    /*.table td.name:hover, .table td.job:hover {*/
        /*white-space:normal;*/
        /*overflow: visible;*/
        /*text-overflow: clip;*/
    /*}*/
    .name.td-hide:hover {
        max-width: 120px;
    }
    .job.td-hide:hover {
        max-width: 100px;
    }
    .hoverVisible:hover {
        overflow: visible;
    }
    .tag_container {
        width: 80px;
        margin: 0 auto;
    }
    .clearfix:before {
        content:"";
        display:block;
        height:0;
        clear:both;
        visibility:hidden;
        zoom:1;
    }
    .page-container {
        height: 100%;
        box-sizing: border-box;
    }
    .title {
        width: 100%;
        min-width: 1140px;
        height: 80px;
        z-index: 2;
    }
    .title-text {
        width: 160px;
    }
    .title-body {
        height: 100%;
        width: 1140px;
    }
    .content {
        min-height: 400px;
        position: absolute;
        left: 20px;
        top: 105px;
        right: 20px;
        bottom: 20px;
        z-index: 1;
        box-sizing: border-box;
    }
    .content-body {
        width: 100%;
        box-sizing: border-box;
    }
    .position_box {
        position: absolute;
        top: 15px;
        left: 15px;
        right: 15px;
        overflow: hidden;
    }
    .scroll-top-fixed {
        position: absolute;
        z-index: 3;
        top: 0;
        left: 0;
        box-sizing: border-box;
        padding-bottom: 30px;
        overflow: hidden;
        background-color: #fff;
    }
    .scroll-top-fixed-mask {
        z-index: 4;
        position: absolute;
        left: 0;
        bottom: 0;
        height: 30px;
        width: 100%;
        background-color: #fff;
    }
    .scroll-bottom-roll {
        width: 100%;
        height: auto;
        padding-bottom: 30px;
        box-sizing: border-box;
    }
    .costName {
        min-width: 80px;
    }
    .scroll-bottom-body {
        box-sizing: border-box;
        z-index: 2;
    }
    .scroll-bar {
        position: absolute;
        /*left: 450px;*/
        bottom: 0;
        right: 0;
        height: 30px;
        z-index: 1;
        background-color: #eee;
    }
    .scroll-left, .scroll-right {
        position: absolute;
        top: 0;
        width: 20px;
        height: 100%;
        line-height: 28px;
        color: #ccc;
        text-align: center;
        cursor: pointer;
    }
    .scroll-left {
        left: 0;
    }
    .scroll-right {
        right: 0;
    }
    .scroll-pot {
        position: absolute;
        left: 20px;
        top: 50%;
        width: 80px;
        height: 20px;
        line-height: 20px;
        /*font-size: 16px;*/
        margin-top: -10px;
        color: #ccc;
        background-color: #ccc;
        /*border-radius: 4px;*/
        text-align: center;
        cursor: pointer;
    }
    .scroll-pot:active {
        background-color: #aaa;
    }
    .scroll-left:active, .scroll-right:active {
        color: #999;
    }
    .title-body > div {
        height: 31px;
    }
    .title-item {
        height: 30px;
    }
    .title-item span {
        vertical-align: middle;
        display: inline-block;
        height: 30px;
        line-height: 30px;
    }
    .select {
        width: 120px;
        height: 31px;
        vertical-align: middle;
        display: inline-block;
        line-height: 31px;
    }
    .searchInputType.select {
        width: 75px;
        padding-left: 5px;
        text-align: right;
    }
    .search_box {
        margin-left: 25px;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import mScroll from '../assets/js/scrollLeft';
    import modify from "../components/modifyPersonalRate.vue";
    let itemOps = null;
    export default{
        ready(){
            itemOps = {
                param:{
                    page:1,
                    page_size: 10,
                    room_type: "", // 房间类型ID
                    position: "", // 员工职位
                    education: "", // 员工学历
                    staff_tag: "", // 员工标签
                    building: "", // 宿舍楼ID
                    department: "", // 部门ID
                }
            };
            this.initSelections();
        },
        data: function(){
            return{
                noData:false,
                itemsLoading:false,
                rateArr: [], // 个人费率统计单数组
                feeItems: [], // 已经启用状态的固定费用类型数组
                dialogRate: null, // 传入个人费率设置的各项费用类型费率值
                roomTypeArr: [], // 房间类型数组
                roomTypeSelected: '', // 房间
                departmentItem: [], // 部门数组
//                departmentSelected: '', // 部门
                departmentSelectedName: '',
                positionArr: [], // 职位数组
                positionSelected: '', // 职位
                education: '', // 学历
                tagSelected: '', // 标签
                tagSelectedArr: [], // 标签数组
                buildingSelectedId: '', // 选择的楼id
                buildingsArr: [], // 楼列表数组
                searchInputType: '', // 搜索内容类型
                isShowModifyDialog: false,
                personalRate: null,
                isComponentDestroy: false,
            }
        },
        methods: {
            clickItem:function(module){
                this.module = module;
            },
            clickSave:function(item){
                let that = this;
                if(!(/^[0-9]*[1-9][0-9]*$/.test(this.deadlineInput))){
                    layer.msg('请输入正确的天数',{icon:2,time:1000});
                    return;
                };
                let ajaxData = {
                    checkin_deadline_day: this.deadlineInput,
                };
                $.ajax({
                    url: that.rulesURL,
                    type: that.rulesType,
                    data: ajaxData,
                })
                .always((data)=>{
                    base.ajaxCallback(data,()=>{
                        layer.msg('提交成功',{icon:1,time:1000});
                    });
                });
            },
            //初始化分页
            initPage:function(obj,tpageToal='4',current='1',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:current,
                    count:count,
                    callback:(p)=>{
                        itemOps.param.page = p;
                        this.queryAjax(this.buildingsId);
                    }
                });
            },
            //获取入住申请规则列表
            getList:function(reset=0){
//                let that = this;
                //重置第一页
                if(reset){
                    itemOps.param.real_name = itemOps.param.phone = itemOps.param.job_number = itemOps.param.room_no = "";
                    itemOps.param.page = 1;
                    itemOps.param.room_type = this.roomTypeSelected, // 房间类型ID
                    itemOps.param.position = this.positionSelected, // 员工职位
                    itemOps.param.education = this.education, // 员工学历
                    itemOps.param.staff_tag = this.tagSelected, // 员工标签
                    itemOps.param.building = this.buildingSelectedId, // 宿舍楼ID
                    itemOps.param.department = this.getDepartmentId($("#department").val());// 获取员工部门ID
                    itemOps.param[this.searchInputType] = $("#searchInput").val();
                }
                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-page',tpageToal,itemOps.param.page,count)
                });
            },
            queryAjax:function(callback=function(){}){
                //修改参数
                this.itemsLoading = true;
                $.ajax({
                    url: base.gAjaxUrl.stafffeePoint,
                    type: 'GET',
                    data: itemOps.param
                }).always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
                        let resultData = data.results;
                        if(resultData && resultData.length){
                            this.rateArr = resultData;
                            this.noData = false;
                            //回调
                            callback(data.num_pages,data.count);
                        }else{
                            this.rateArr = [];
                            this.noData = true;
                        }
                        this.$nextTick(() => {
                            if(this.isComponentDestroy) return;
                            this.setHeight();
                        });
                    });
                })
            },
            //获取宿舍规则列表
            getDormitoryrules:function(){
                $.ajax({
                    url: base.gAjaxUrl.dormitoryrules,
                    type: 'GET',
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
                        this.itemsLoading = false;
                        let resultData = data.results;
                        if(resultData && resultData.length){
                            this.deadlineInput = resultData[0].checkin_deadline_day;
                            this.rulesType = 'PATCH';
                            this.rulesURL = `${base.gAjaxUrl.dormitoryrules}${resultData[0].id}/`;
                            //回调
                            //callback(data.num_pages);
                        } else {
                            this.rulesType = 'POST';
                            this.rulesURL = base.gAjaxUrl.dormitoryrules;
                        }
                    });
                })
            },
            //获取房间类型列表
            getRoomTypes:function(){
                $.ajax({
                    url: `${base.gAjaxUrl.roomtypes}?page=1&page_size=999999`,
                    type: 'GET',
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
                        this.itemsLoading = false;
                        let resultData = data.results;

                        if(resultData && resultData.length){
                            this.roomTypes = resultData;
                        }
                    });
                })
            },
            showModifyRate: function (rateItem) {
                this.dialogRate = rateItem;
                this.isShowModifyDialog = true;
            },
            closeModify: function () {
              this.isShowModifyDialog = false;
            },
            saveModify: function () {
              this.isShowModifyDialog = false;
                this.getList();
            },
            initSelections: function () {
                // 获取费用类别列表
                $.ajax({
                    url: base.gAjaxUrl.feeTypeList,
                    type: 'GET',
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
                        this.feeItems = data || [];
                        this.$nextTick(() => {
                            // 表头渲染完成后再去加载列表
                            this.getList();
                        });
                    });
                })
                //获取部门列表
                $.ajax({
                    url: `${base.gAjaxUrl.departments}?page=1&page_size=999999`,
                    type: 'GET',
                }).always((data)=>{
//                    console.log(data.results);
                    this.departmentItem = data || [];
                });
                //获取房间类型列表
                $.ajax({
                    url: `${base.gAjaxUrl.roomtypes}?page=1&page_size=999999`,
                    type: 'GET',
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
                        this.roomTypeArr = (data && data.results) || [];
                    });
                });
                // 宿舍楼列表
                $.ajax({
                    url: `${base.gAjaxUrl.buildings}?page=1&page_size=999999`,
                    type: 'GET',
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
                        this.buildingsArr = (data && data.results) || [];
                    });
                });
                // 获取标签列表
                $.ajax({
                    url: `${base.gAjaxUrl.staffsTag}?page=1&page_size=999999&flag=tag_staff`,
                    type: 'GET',
                }).always((data)=>{
                    base.ajaxCallback(data, ()=>{
//                        console.log(data);
                        this.tagSelectedArr = data.results || [];
                    })
                });
            },
            // 不同界面需要找到不同的
            checkPosition: function (e, flag) {
                if(flag) return;
                let target = e.srcElement ? e.srcElement : e.target;
                let $this = $(target);
                if($this.hasClass("top") || $this.hasClass("bottom")) return;
                let $parent = $this.parents(".fixedParent"); // 以下判断方法，需要$parent的padding为0，不然要重新插入padding的判断
                let $tagBox = $this.children(".tag_second_box");
                // $tagBox.offset().top + $tagBox.outerHeight() + $this.find(".tag_second_box_sign").outerHeight() > $parent.offset().top + $parent.outerHeight() 判断向下不能显示完
                // $this.parents("td").offset().top - $parent.offset().top < $this.find(".tag_second_box_sign").outerHeight() + $tagBox.outerHeight() 判断向上不能显示完
                if($tagBox.offset().top + $tagBox.outerHeight() + $this.find(".tag_second_box_sign").outerHeight() > $parent.offset().top + $parent.height() && $this.parents("td").offset().top - $parent.offset().top < $this.find(".tag_second_box_sign").outerHeight() + $tagBox.outerHeight()){
                    // 防止重复添加minHeight属性，选择添加最大值
                    var height = $parent.parents(".position_box").height();
                    var currentHeight = $this.offset().top - $parent.offset().top + $this.find(".tag_second_box_sign").outerHeight() + $tagBox.outerHeight() + $this.parents("td").outerHeight();
                    // 防止 $parent 不是 $parent.parent() 的第一个子元素
                    var compensate = $parent.offset().top - $parent.parent().offset().top;
                    if(currentHeight + compensate > height) $parent.parents(".position_box, .content").css({minHeight: currentHeight + compensate});
                    $this.addClass("bottom");
                } else if($tagBox.offset().top + $tagBox.outerHeight() + $this.find(".tag_second_box_sign").outerHeight() > $parent.offset().top + $parent.outerHeight()){
                    $this.addClass("top");
                } else {
                    $this.addClass("bottom");
                }
            },
            tableEnter: function (e) {
                let target = e.srcElement ? e.srcElement : e.target;
                $(target).parent().css({zIndex: 2})
            },
            tableLeave: function (e) {
                let target = e.srcElement ? e.srcElement : e.target;
                $(target).parent().css({zIndex: 1})
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
                $(".departmentListBox").hide()
            },
            getDepartmentId: function (val) {
                var id = '';
                this.departmentItem.forEach(function (item) {
                    if(item.department_tree == val) {
                        id = item.id;
                    }
                });
                return id;
            },
            setHeight: function (){
                $(".position_box").parents(".panel").css({
                    height: $(".position_box").outerHeight()
                });
                if(this.isComponentDestroy) return;
                mScroll("#scroll-roll", "#colFixed");
            }
        },
        components: {
            modify
        },
        filters: {
            getPoint: function (id, fees) {
//                console.log(id);
//                console.log(fees);
                for(let i = 0, len = fees.length;i < len;i++) {
                    if(id == fees[i].feetype) {
                        return fees[i].point + "%";
                    }
                }
                return "100%"; // 现在PC端做一下处理，后台没有初始化最初的100%的值
            },
            time: function (t) {
                return t ? t.slice(0, 10) : '--';
            }
        },
        beforeDestroy: function () {
            this.isComponentDestroy = true;
        }
    }
</script>
