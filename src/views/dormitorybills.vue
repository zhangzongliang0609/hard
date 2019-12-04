<template>

    <!-- 设置水电单价 -->
    <set :title="dialogTitle" :type="dialogType" :data="dialogData" v-if="isShowSetDialog"
         v-on:dialog-close="setDialogClose" v-on:dialog-save="setDialogSave"></set>

    <!-- 查看详情 -->
    <detail_bill :title="dialogTitle" :bill="currentBill" :type="dialogType" :data="dialogData" v-if="isShowDetailBillDialog"
                 v-on:dialog-close="detailBillDialogClose" v-on:dialog-save="detailBillDialogSave"></detail_bill>

    <!-- 查看人员 -->
    <detail_staff :title="dialogTitle" :bill="currentBill" :data="dialogData"
                  v-if="isShowDetailStaffDialog" v-on:dialog-close="detailStaffDialogClose"  v-on:dialog-save="detailStaffDialogSave"></detail_staff>

    <!-- 导入 -->
    <imoprt_data :urldata="importData" v-if="isShowImportDialog" v-on:dialog-close="importDialogClose"
                 v-on:dialog-save="importDialogSave"></imoprt_data>

    <section class="Hui-article-box">
        <div class="page-container bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body clearfix">
                    <span class="f-20 fw-b f-l">水电录入管理</span>
                    <div class="f-l mt-5 ml-20 lh-30">
                        <span>宿舍楼：</span>
                        <select v-model="buildingSelectedId" class="w-110 select v-m">
                            <option value="">全部</option>
                            <option v-bind:value="item.id" v-for="item in buildings">{{item.building_name}}</option>
                        </select>
                    </div>
                    <div class="f-l mt-5 ml-10 clearfix">
                        <input id="searchInput" v-model="roomNo" class="f-l input-text" type="text" placeholder="房间号" style="width:120px">
                        <button v-on:click="getList(1)" class="btn btn-success f-l radius-r" type="button">
                            <i class="f-r Hui-iconfont">&#xe665;</i>
                        </button>
                    </div>
                    <!--<a href="javascript:;" class="btn btn-secondary radius f-r" v-on:click="clickImport()"><i class="Hui-iconfont">&#xe616;</i> 批量导入</a>-->
                    <a href="javascript:;" class="btn btn-secondary radius f-r" v-on:click="turnToImport()"><i class="Hui-iconfont">&#xe616;</i> 批量导入</a>
                </div>
            </div>
            <div class="mt-10 bgc-fff clearfix">
                <div class="pd-10 clearfix">
                    <span class="lh-30 mr-10 f-l">选择计费单：</span>
                    <span class="select-box mr-10 f-l" style="width:auto">
                        <select v-model="selectBill" class="select">
                            <option v-for="item in bills" value={{item.id}}>{{item.bill_name}}</option>
                        </select>
                    </span>
                    <a class="btn btn-secondary radius f-l" title="设置水电费单" href="javascript:;" v-on:click="clickSet()">设置水电单价</a>
                </div>
                <div class="materials bk-gray radius bgc-fff">
                    <table class="waterElectricityForm table table-border table-bg table-striped bor-l bor-r">
                        <thead class="text-c">
                        <tr>
                            <th width="80">楼</th>
                            <th width="100">房间号</th>
                            <th width="100">所属计费单</th>
                            <th width="80">上次电量(度)</th>
                            <th width="80">本次电量(度)</th>
                            <th width="100" class="fc-206afc">电费(元)</th>
                            <th width="80">上次水量(m³)</th>
                            <th width="80">本次水量(m³)</th>
                            <th width="80" class="fc-206afc">水费(元)</th>
                            <th width="100">水电费总额(元)</th>
                            <th width="80">状态</th>
                            <th width="80">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr class="text-c" v-for="item in items">
                            <td>{{item.room_vo.building_vo.building_name}}</td>
                            <td>{{item.room_vo.room_no}}</td>
                            <td>{{item.bill_vo.bill_name}}</td>
                            <td>{{item.last_electricity_degrees || 0}}</td>
                            <td>{{item.electricity_degrees || 0}}</td>
                            <td class="fc-206afc">{{item.electricity_pay_amount | getFee}}
                            </td>
                            <td>{{item.last_water_degrees || 0}}</td>
                            <td>{{item.water_degrees || 0}}</td>
                            <td class="fc-206afc">{{item.water_pay_amount | getFee }}</td>
                            <td>{{item.pay_amount | getFee}}</td>
                            <td>{{item.status_name}}</td>
                            <td>
                                <a v-if="item.status==20" class="btn btn-primary radius fs-12" title="查看" href="javascript:;" v-on:click="clickDetailStaff(item)">查看</a>
                                <a v-if="item.status==10" class="btn btn-primary radius fs-12" title="设置" href="javascript:;" v-on:click="clickDetailStaff(item)">设置</a>
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
<style lang="less" scoped>
    .panel-body .select {
        height: 31px;
        line-height: 31px;
    }
    .materials {
        overflow: auto;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import set from "../components/setWaterElePrice.vue";
    import detail_bill from "../components/dormitorybillsDetailBill.vue";
    import detail_staff from "../components/dormitorybillsDetailStaff.vue";
    import imoprt_data from "../components/itemImport.vue";

    let itemOps = null;

    export default{
        ready(){
            itemOps = {
                param: {
                    bill: '', // 计费单id
                    building: '', // 宿舍楼id
                    roomtags_id: '', // 房间标签
                    room_no: '', // 房间号
                    page: 1,
                    page_size: 10,
                }
            };

            this.getBillsList(()=> {
                this.initSections();
            });
            this.checkWater()
        },
        data: function () {
            return {
                noData: false,
                itemsLoading: false,
                isShowSetDialog: false,
                isShowDetailBillDialog: false,
                isShowDetailStaffDialog: false,
                isShowImportDialog: false,
                items: [],
                buildings: [],
                buildingSelectedId: '', // 宿舍楼id
                roomTagSelected: '', // 房间标签id
                roomTagArr: [], // 房间标签数组
                roomNo: '', // 房间标签id
                bills: [],
                currentBill: null, // 当前bill对象
                selectBill: '',
                selectValue: '',
                dialogType: '',
                dialogTitle: '',
                dialogData: {},
                importData: {},
                isComponentDestroy: false,
            }
        },
        methods: {
            setDialogClose: function (data) {
                this.isShowSetDialog = false;
            },
            setDialogSave: function (data) {
                this.isShowSetDialog = false;
                this.initSections();
                this.getList(1);
            },
            detailBillDialogClose: function (data) {
                this.isShowDetailBillDialog = false;
            },
            detailBillDialogSave: function (data) {
                this.isShowDetailBillDialog = false;
                this.getList(1);
            },
            detailStaffDialogClose: function (data) {
                this.isShowDetailStaffDialog = false;
            },
            detailStaffDialogSave: function (data) {
//                this.isShowDetailStaffDialog = false;
                this.getList();
            },
            importDialogClose: function (data) {
                this.isShowImportDialog = false;
            },
            importDialogSave: function (data) {
                this.isShowImportDialog = false;
                this.getList();
                this.noData = false;
            },
            clickSet: function () {
                this.isShowSetDialog = true;
                this.dialogTitle = '设置水电单价';
            },
            clickDetailBill: function (item) {
                if (!item.room_vo || !item.room_vo.building_vo && !item.room_vo.building_vo.water_ele_price) {
                    layer.msg('请先设置该楼水电单价后再设置水电用量', {icon: 7, time: 2000});
                    return;
                }
                this.dialogTitle = '设置水电';
                this.dialogData = {};
                this.dialogData.water_ele_price = item.room_vo.building_vo.water_ele_price;
                this.dialogData.bill = item;
                this.isShowDetailBillDialog = true;
            },
            clickDetailStaff: function (item) {
                this.dialogTitle = '查看人员';
                this.dialogData = item;
                this.currentBill = this.getCurrentBill(this.selectBill);
                this.isShowDetailStaffDialog = true;
            },
            //批量导入
            clickImport: function () {
                for (let i = 0, l = this.buildings.length; i < l; i++) {
                    if (!this.buildings[i].water_ele_price) {
                        layer.msg('有楼未设置水电单价，请先设置水电单价后再导入', {icon: 7, time: 2000});
                        return;
                    }
                }
                this.isShowImportDialog = true;
                this.importData.importUrl = `${base.gAjaxUrl.bills}${this.selectBill}/water_ele_import/`;
                this.importData.templateUrl = 'http://eqixing.oss-cn-shenzhen.aliyuncs.com/water_ele_import.xlsx';
            },
            //初始化分页
            initPage: function (obj, tpageToal = '4', current = '1', count = '0') {
//                console.log("initPage");
                $(obj).createPage({
                    pageCount: tpageToal,
                    current: current,
                    count: count,
                    callback: (p)=> {
                        itemOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            //获取宿舍列表
            getList: function (reset = 0) {
                //重置第一页
                if (reset) {
                    itemOps.param.page = 1;
                    itemOps.param.building = this.buildingSelectedId; // 宿舍楼id
                    itemOps.param.roomtags_id = this.roomTagSelected; // 房间标签
                    itemOps.param.room_no = this.roomNo; // 房间号
                }
                this.queryAjax((tpageToal = '4', count = '0')=> {
                    this.initPage('#J-page', tpageToal, itemOps.param.page, count)
                });
            },
            queryAjax: function (callback = function () {}) {
                //修改参数
                this.itemsLoading = true;
                $.ajax({
                    url: base.gAjaxUrl.dormitorybills,
                    type: 'GET',
                    data: itemOps.param
                }).always((data)=> {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=> {
                        let resultData = data.results;
                        this.items = resultData || [];
                        if (resultData && resultData.length) {
                            this.noData = false;
                            callback(data.num_pages, data.count);
                        } else {
                            this.noData = true;
                        }
                        this.$nextTick(() => {
                            if(this.isComponentDestroy) return;
                            base.calTableWidth(".waterElectricityForm");
                        });
                    });
                })
            },
            //获取水电季度计费单列表
            getBillsList: function (callback = function () {}) {
                $.ajax({
                    url: base.gAjaxUrl.bills,
                    type: 'GET',
                    data: {
                        page: 1,
                        page_size: 999999,
                    }
                }).always((data)=> {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=> {
                        let resultData = data.results;
                        if (resultData && resultData.length) {
                            this.bills = resultData;
                            this.selectBill = resultData[0].id;
                            callback();
                        }
                    });
                })
            },
            // 初始化筛选条件
            initSections:function(callback=function(){}){
                let param = {
                    page:1,
                    page_size: 999999,
                };
                this.itemsLoading = true;
                //获取宿舍楼列表
                $.ajax({
                    url: base.gAjaxUrl.buildings,
                    type: 'GET',
                    data: param
                }).always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
                        this.buildings = data.results || [];
                    });
                });
            },
            getCurrentBill: function (id){
                for(let i = 0, len = this.bills.length;i < len;i++) {
                    let item = this.bills[i];
                    if(item.id === id) return item;
                }
                return null
            },
            // 判断水电是否禁用
            checkWater:function () {
                $.ajax({
                    url:`${base.gAjaxUrl.feeTypeList}`,
                    type:"GET",
                    data:{
                        type:0,
                    }
                }).always((data)=>{
                    base.ajaxCallback(data,function () {
                        let items = data ;
                        console.log(items);
                        if(items.length == 0){
                            layer.confirm(`温馨提示:水电费已被禁用,设置的水电度数会保存,但是不会生成缴费单.`,function () {
                                layer.closeAll('dialog')
                            })
                        }else if(items.length == 1){
                            let name = items[0].name
                            if(name == '水费'){
                                layer.confirm(`温馨提示:电费已被禁用,设置的用电度数会保存,但是不会生成缴费单.`,function () {
                                    layer.closeAll('dialog')
                                })
                            }else if(name == '电费'){
                                layer.confirm(`温馨提示:水费已被禁用,设置的用水度数会保存,但是不会生成缴费单.`,function () {
                                    layer.closeAll('dialog')
                                })
                            }
                        }else{

                        }

                    })
                })
            },
            turnToImport: function () {
                this.$router.go({
                    path: '/importMould',
                    name: 'importMould',
                    query: {
                        importType: 'waterEle'
                    }
                });
            },
        },
        components: {
            set,
            detail_bill,
            detail_staff,
            imoprt_data
        },
        filters: {
            getFee: function (num) {
                num = num || 0;
                if(!num) return "0";
                return (num / 100).toFixed(2).replace(".00", "");
            },
        },
        watch: {
            'selectBill': {
                handler: function (curVal, oldVal) {
                    if (curVal != oldVal) {
                        itemOps.param.bill = this.selectBill;
                        itemOps.param.page = 1;
                        this.getList();
                    }
                },
                deep: true,
            }
        },
        beforeDestroy: function () {
            this.isComponentDestroy = true;
        }
    }
</script>