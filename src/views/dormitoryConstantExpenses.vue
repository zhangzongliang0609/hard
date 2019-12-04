<template>

    <!-- 设置全体费用 -->
    <!--<all v-if="isShowAllPrice" :fees="feeItems" :bill="currentBill" v-on:dialog-close="setDialogClose" v-on:dialog-save="setDialogSave"></all>-->
    <all v-if="isShowAllPrice" :bill="currentBill" v-on:dialog-close="setDialogClose" v-on:dialog-save="setDialogSave"></all>

    <!-- 设置查看 -->
    <room v-if="isShowRoomPrice" :data="dialogData" :type="dialogType" :bill="currentBill" :types="feeItems" v-on:dialog-close="detailBillDialogClose" v-on:dialog-save="detailBillDialogSave"></room>

    <section class="Hui-article-box">
        <div class="page-container">
            <div class="panel panel-default radius">
                <div class="panel-body clearfix">
                    <span class="f-20 fw-b f-l">固定费用录入管理</span>
                    <div class="f-l mt-5 ml-20 title-item">
                        <span>宿舍楼：</span>
                        <select v-model="buildingSelectedId" class="select">
                            <option value="">全部</option>
                            <option v-bind:value="item.id" v-for="item in buildingArr">{{item.building_name}}</option>
                        </select>
                    </div>
                    <div class="f-l mt-5 ml-10 title-item">
                        <span>房间分组：</span>
                        <select v-model="roomTagSelected" class="select">
                            <option value="">全部</option>
                            <option v-bind:value="item.id" v-for="item in roomTagArr">{{item.name}}</option>
                        </select>
                    </div>
                    <div class="f-l mt-5 clearfix search_box">
                        <input id="searchInput" class="f-l input-text" type="text" placeholder="房间号" style="width:120px">
                        <button v-on:click="getList(1)" class="btn btn-success f-l radius-r" type="button"><i class="f-r Hui-iconfont"> &#xe665;</i></button>
                    </div>
                    <!-- 功能还没做，暂时隐藏 -- 2018.02.05 -->
                    <!--<a href="javascript:;" class="btn btn-secondary radius f-r mt-5" v-on:click="clickImport()"><i class="Hui-iconfont">&#xe616;</i>批量导入</a>-->
                </div>
            </div>
            <div class="mt-10 bgc-fff clearfix">
                <div class="pd-10 clearfix">
                    <span class="lh-30 mr-10 f-l">选择计费单：</span>
                    <span class="mr-10 f-l" style="width:auto">
                        <select v-model="selectBill" class="select" @change="getList()">
                            <option v-for="item in bills" value={{item.id}}>{{item.bill_name}}</option>
                        </select>
                    </span>
                    <a class="btn btn-secondary radius f-l" title="设置水电费单" href="javascript:;" v-on:click="clickSet()">设置全体费用</a>
                </div>
                <div class="materials bk-gray radius bgc-fff">
                    <div class="table-container mt-10">
                        <table style="table-layout:fixed;" class="fixedParent fixedFeeInput table table-border table-bordered table-bg table-sort">
                            <thead class="text-c">
                            <tr>
                                <th width="80">楼</th>
                                <th width="60">房间号</th>
                                <th width="100">房间分组</th>
                                <th width="80">所属计费单</th>
                                <th width="80">状态</th>
                                <th width="80" class="costName" title="{{fee.name + '/元'}}" track-by="$index" v-for="fee in feeItems">{{fee.name}}(元)</th>
                                <th width="70">总额(元)</th>
                                <th width="100">操作</th>
                            </tr>
                        </thead>
                            <tbody>
                            <tr class="text-c" v-for="item in items">
                                <td>{{item.building_name}}</td>
                                <td>{{item.room_no}}</td>
                                <td class="hoverVisible">
                                    <div class="tag_container">
                                        <div @mouseenter="checkPosition($event, item.room_tags.length <= 1)" class="tag_box" v-if="item.room_tags.length">
                                            <div class="tag_item" :title="item.room_tags[0].tag_name">
                                                <span title="{{item.room_tags[0].tag_name}}">{{item.room_tags[0].tag_name}}</span><span class="tag_more" v-if="item.room_tags.length > 1">...</span>
                                            </div>
                                            <div class="tag_second_box_sign"></div>
                                            <div v-if="item.room_tags.length > 1" class="tag_second_box clearfix">
                                                <div v-for="tag in item.room_tags" class="tag_item f-l" title="{{tag.tag_name}}">{{tag.tag_name}}</div>
                                            </div>
                                        </div>
                                        <span v-else>--</span>
                                    </div>
                                </td>
                                <td>{{currentBill ? currentBill.bill_name : '--'}}</td>
                                <td>{{item.status_name}}</td>
                                <td v-for="fee in feeItems" track-by="$index">{{fee.id | getFee item.room_fees}}</td>
                                <td>{{item.room_fees_amount / 100}}</td>

                                <td>
                                    <a v-if="item.status == 20" class="btn btn-primary radius fs-12" title="查看" href="javascript:;" v-on:click="setRoomPrice(item, 1)">查看</a>
                                    <a v-if="item.status == 10" class="btn btn-primary radius fs-12" title="设置" href="javascript:;" v-on:click="setRoomPrice(item, 0)">设置</a>
                                </td>
                            </tr>
                        </tbody>
                        </table>
                        <div id="J-page" class="m-page" v-show="!noData"></div>
                        <div class="no-data text-c mt-30 mb-30" v-if="noData">没有相关数据</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>

<style lang="less" scoped>
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
    .search_box {
        margin-left: 25px;
    }
    .table-container {
        width: 100%;
        overflow-x: auto;
    }
    .tag_container {
        width: 80px;
        margin: 0 auto;
    }
</style>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import all from "../components/setAllPrice.vue";
    import room from "../components/setRoomPrice.vue";

    let itemOps = null;

    export default{
        ready(){
            itemOps = {
                param:{
                    building: '',
                    room_no: '',
                    tag: '',
                    page: 1,
                    page_size: 10,
                }
            };
            this.initSections();
//            this.getFeeTypes();
            this.getBillsList(()=>{
                this.getList();
            });
        },
        data: function(){
            return{
                noData:false,
                itemsLoading:false,
                isShowAllPrice:false,
                isShowRoomPrice: false,
                isShowDetailStaffDialog:false,
                isShowImportDialog: false,
                itemIndex: 0,
                items: [],
                feeItems: [],
                buildingSelectedId: '', // 楼的id
                buildingArr: '', // 楼的数组
                roomTagSelected: '', // 楼的数组
                roomTagArr: [], // 房间标签
                isComponentDestroy: false, // 组件是否被销毁
                bills: [],
                currentBill: null,
                selectBill: '',
                selectValue: '',
                dialogData: null,
                dialogType: '',
                importData:{},
            }
        },
        methods: {
            setDialogClose:function(data){
                this.isShowAllPrice = false;
            },
            setDialogSave:function(data){
                this.isShowAllPrice = false;
                this.getList();
            },
            detailBillDialogClose:function(data){
                this.isShowRoomPrice = false;
            },
            detailBillDialogSave:function(data){
                this.isShowRoomPrice = false;
                this.getList();
            },
            detailStaffDialogClose:function(data){
                this.isShowDetailStaffDialog = false;
            },
            importDialogClose:function(data){
                this.isShowImportDialog = false;
            },
            importDialogSave:function(data){
                this.isShowImportDialog = false;
                this.getList();
                this.noData = false;
            },
            clickSet:function(){
                if(this.currentBill) {
                    this.isShowAllPrice = true;
                } else {
                    layer.msg("请先添加计费单", {icon: 2, time: 1500});
                }
            },
            setRoomPrice:function(item, flag){
                this.dialogData = item;
                this.dialogType = flag ? 'check' : 'set'; // check 表示费用已经推送，只能查，set表示费用可以重新设定
                this.isShowRoomPrice = true;
            },
            clickImport:function(){
                for (let i=0,l=this.buildings.length; i<l; i++) {
                    if(!this.buildings[i].water_ele_price){
                        layer.msg('有楼未设置水电单价，请先设置水电单价后再导入',{icon:7,time:2000});
                        return;
                    }
                }
                this.isShowImportDialog = true;
                this.importData.importUrl = `${base.gAjaxUrl.bills}${this.selectBill}/water_ele_import/`;
                this.importData.templateUrl = 'http://eqixing.oss-cn-shenzhen.aliyuncs.com/water_ele_import.xlsx';
            },
            //初始化分页
            initPage:function(obj,tpageToal='4',current='1',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:current,
                    count:count,
                    callback:(p)=>{
                        itemOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            //获取宿舍列表
            getList: function(reset=0){
                //重置第一页
                if(!this.selectBill) return;
                if(reset){
                    itemOps.param.page = 1;
                    itemOps.param.building = this.buildingSelectedId;
                    itemOps.param.tag = this.roomTagSelected;
                    itemOps.param.room_no = $("#searchInput").val();
                }
                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-page',tpageToal,itemOps.param.page,count)
                });
            },
            queryAjax:function(callback=function(){}){
                //修改参数
                this.itemsLoading = true;
//                console.log(itemOps.param);
                $.ajax({
                    url: `${base.gAjaxUrl.bills}${this.selectBill}/room_fixedfee/`,
                    type: 'GET',
                    data: itemOps.param
                }).always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
                        let resultData = data.results;
//                        console.log(resultData);
                        if(resultData && resultData.length){
                            this.noData = false;
                            this.items = resultData;
                            //回调
                            callback(data.num_pages,data.count);
                        }else{
                            this.items = [];
                            this.noData = true;
                        }
                        this.feeItems = this.getFeeTypes(this.items);
                        this.$nextTick(() => {
                            if(this.isComponentDestroy) return;
                            base.calTableWidth(".fixedParent.fixedFeeInput");
                        });
                    });
                })
            },
            //获取宿舍楼列表
            initSections:function(callback=function(){}){
                //获取宿舍楼列表
                $.ajax({
                    url: base.gAjaxUrl.buildings,
                    type: 'GET',
                    data: {
                        page: 1,
                        page_size: 999999,
                    }
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
                        this.buildingArr = data.results || [];
                    });
                });
                //获取房间标签
                $.ajax({
                    url: base.gAjaxUrl.roomTag,
                    type: 'GET',
                    data: {
                        page: 1,
                        page_size: 999999,
                        flag: 'tag_room'
                    }
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
                        this.roomTagArr = data.results || [];
                    });
                })
            },
            //获取计费单列表
            getBillsList:function(callback=function(){}){
                this.itemsLoading = true;
                let ajaxData = {
                    param:{
                        page:1,
                        page_size: 999999,
                    }
                };
                $.ajax({
                    url: base.gAjaxUrl.bills,
                    type: 'GET',
                    data: ajaxData.param
                })
                .always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
                        let resultData = data.results;
                        if(resultData && resultData.length){
                            this.bills = resultData;
                            this.currentBill = resultData[0];
                            this.selectBill = resultData[0].id;
                            this.selectValue = resultData[0].bill_name;
                            callback();
                        }
                    });
                })
            },
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
                    var height = $parent.parents(".table-container").height();
                    var currentHeight = $this.offset().top - $parent.offset().top + $this.find(".tag_second_box_sign").outerHeight() + $tagBox.outerHeight() + $this.parents("td").outerHeight();
                    // 防止 $parent 不是 $parent.parent() 的第一个子元素
                    var compensate = $parent.offset().top - $parent.parent().offset().top;
                    if(currentHeight + compensate > height) $parent.parents(".table-container").css({minHeight: currentHeight + compensate});
                    $this.addClass("bottom");
                } else if($tagBox.offset().top + $tagBox.outerHeight() + $this.find(".tag_second_box_sign").outerHeight() > $parent.offset().top + $parent.outerHeight()){
                    $this.addClass("top");
                } else {
                    $this.addClass("bottom");
                }
            },
            // 动态从列表中获取
//            getFeeTypes: function () {
//                let that = this;
//                $.ajax({
//                    url: base.gAjaxUrl.feeTypeList,
//                    type: 'GET',
//                    data: {type: 1}
//                }).always((data)=>{
//                    base.ajaxCallback(data,()=>{
//                        this.feeItems = data || [];
//                        this.$nextTick(function (){
//                            if(that.isComponentDestroy) return;
//                            base.calTableWidth(".fixedParent");
//                        });
//                    });
//                })
//            },
            setBill: function (id) {
                for(let i = 0, len = this.bills.length; i < len; i++) {
                    if(this.bills[i].id === id) {
                        this.currentBill = this.bills[i];
                        break;
                    }
                }
            },
            getFeeTypes: function (items) {
//                console.log("getFeeTypes");
//                console.log(items);
                // room_fees feetype_id feetype_name
                let arr = [];
                for(let i = 0, len = items.length; i < len; i++) {
                    let fees = items[i].room_fees;
                    for(let j = 0, len_j = fees.length; j < len_j; j++) {
                        let item = fees[j];
                        if(!this.checkContain(item.feetype_id, arr)) {
                            arr.push({
                                id: item.feetype_id,
                                name: item.feetype_name,
                            })
                        }
                    }
                }
                if(arr.length > 1) {
                    arr.sort((a, b) => {
                        for(let i = 0, len = a.length; i < len; i++) {
                            if(a.name.charCodeAt(i) !== b.name.charCodeAt(i)) {
                                return a.name.charCodeAt(i) - b.name.charCodeAt(i);
                            }
                        }
                        return a.name.charCodeAt(0) - b.name.charCodeAt(0);
                    });
                }
                return arr;
            },
            checkContain: function (id, arr) {
                for(let i = 0, len = arr.length; i < len; i++) {
                    if(arr[i].id === id) return true;
                }
                return false;
            }
        },
        components: {
            all,
            room,
        },
        watch:{
            'selectBill': {
                handler:function(curVal,oldVal){
                    if(curVal != oldVal){
                        this.getList(1);
                        this.setBill(curVal);
                    }
                },
                deep:true
            },
        },
        filters: {
            getFee: function (id, fees) {
//                console.log(id);
//                console.log(fees);
                for(let i = 0, len = fees.length;i < len;i++) {
                    if(id == fees[i].feetype_id) {
                        return fees[i].fee || fees[i].fee == 0 ? fees[i].fee / 100 : '--';
                    }
                }
                return "--"
            }
        },
        beforeDestroy: function () {
            this.isComponentDestroy = true;
        }
    }
</script>