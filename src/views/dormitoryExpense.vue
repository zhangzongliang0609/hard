<template>
    <section class="Hui-article-box">
        <div class="page-container relative">
            <div class="panel panel-default relative radius title clearfix pb-10">
                <div class="f-20 fw-b mt-15 ml-15 f-l title-text">缴费管理</div>
                <div class="title-body clearfix f-l">
                    <div class="f-l ml-15 mt-5 title-item">
                        <span>所属计费单：</span>
                        <select v-model="bill" class="select"><!--  @change="getList(1)" 可以用于机换单切换后刷新页面 -->
                            <option value="">全部</option>
                            <option v-bind:value="bill.id" :title="bill.bill_name" v-for="bill in bills">{{bill.bill_name}}</option>
                        </select>
                    </div>
                    <div class="f-l ml-15 mt-5 title-item">
                        <span>宿舍楼：</span>
                        <select v-model="buildingSelected" class="select">
                            <option value="">全部</option>
                            <option v-bind:value="item.id" :title="item.building_name" v-for="item in buildingArr">{{item.building_name}}</option>
                        </select>
                    </div>
                    <div class="f-l ml-15 mt-5 title-item">
                        <span>房间类型：</span>
                        <select v-model="roomTypeSelected" class="select">
                            <option value="">全部</option>
                            <option v-bind:value="item.id" :title="item.type_name" v-for="item in roomTypeArr">{{item.type_name}}</option>
                        </select>
                    </div>
                    <div class="f-l ml-15 mt-5 title-item">
                        <span>部门：</span>
                        <div class="departmentContainer">
                            <div class="department_select_container" @click="departmentClick"
                                 @mouseleave="departmentEnter(false)" @mouseenter="departmentEnter(true)">
                                <input v-if="departmentItem.length === 0" disabled type="text" class="input-text"
                                       value="无可选择部门">
                                <input v-else autocomplete="off" v-model="departmentSelectedName" type="text"
                                       class="input-text" value="" placeholder="" name="department" id="department">
                                <i v-show="departmentSelectedName !== ''" class="empty-icon Hui-iconfont" @click="emptySearch()">&#xe60b;</i>
                                <div class="departmentListBox" style="display: none">
                                    <div v-bind:title="item.department_tree"
                                         v-for="item in departmentItem | filterBy departmentSelectedName in 'department_tree'"
                                         @click="setDepartmentValue(item)" class="departmentListItem">{{item.department_tree}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="f-l ml-15 mt-5 title-item">
                        <span>职位：</span>
                        <input autocomplete="off" v-model="position" type="text" class="input-text w-100" value=""
                               placeholder="" name="position" id="position">
                    </div>
                    <div class="f-l ml-15 mt-5 title-item">
                        <span>学历：</span>
                        <input autocomplete="off" v-model="education" type="text" class="input-text  w-100" value=""
                               placeholder="" name="education" id="education">
                    </div>
                    <!--<div class="f-l ml-15 mt-5 title-item">-->
                        <!--<span>员工标签：</span>-->
                        <!--<select v-model="staffTag" class="select">-->
                            <!--<option value="">全部</option>-->
                            <!--<option v-bind:value="tag.id" v-for="tag in staffTagArr">{{tag.name}}</option>-->
                        <!--</select>-->
                    <!--</div>-->
                    <!-- 这个搜索功能现在后台已经去掉，暂时不加 -->
                    <!--<div class="f-l ml-15 mt-5 title-item">-->
                        <!--<span>房间标签：</span>-->
                        <!--<select v-model="roomTag" class="select">-->
                            <!--<option value="">全部</option>-->
                            <!--<option v-bind:value="tag.id" v-for="tag in roomTagArr">{{tag.name}}</option>-->
                        <!--</select>-->
                    <!--</div>-->
                    <div class="f-l ml-15 mt-5 title-item">
                        <span>支付情况：</span>
                        <select v-model="payStatus" class="select">
                            <option value="">全部</option>
                            <option value="10">未支付</option>
                            <option value="20">已支付</option>
                        </select>
                    </div>
                    <div class="f-l ml-15 mt-5 title-item">
                        <span>支付方式：</span>
                        <select v-model="payType" class="select">
                            <option value="">全部</option>
                            <option value="alipay">支付宝</option>
                            <option value="wx">微信</option>
                            <option value="cash">现金</option>
                            <option value="Withholding">代缴代扣</option>
                        </select>
                    </div>
                </div>
                <div class="clearfix searchButton">
                    <div class="f-l ml-15 mt-5 clearfix search_box">
                        <select v-model="searchInputType" class="searchInputType select f-l">
                            <option value="real_name" selected>姓名</option>
                            <option value="job_number">工号</option>
                            <option value="phone">电话</option>
                            <option value="room_no">房间号</option>
                        </select>
                        <input id="searchInput" class="f-l input-text" type="text" placeholder="" style="width:250px">
                        <button v-on:click="getList(1)" class="btn btn-success f-l radius-r" type="button"><i class="f-r Hui-iconfont"> &#xe665; </i></button>
                    </div>
                    <button id="exportData" class="btn btn-primary radius f-l mt-5 ml-15" v-on:click="exportData()">
                        导出数据
                    </button>
                    <button class="btn btn-primary radius f-l mt-5 ml-15" v-on:click="setPayType()">设置支付方式</button>
                </div>
            </div>
            <div class="panel panel-default relative radius content mt-20">
                <div class="position_box">
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
                                        <th width="120">姓名/性别</th>
                                        <th width="60">工号</th>
                                        <th width="80" id="colFixed">部门</th>
                                        <th width="70">职位</th>
                                        <th width="70">学历</th>
                                        <th width="100" class="hoverVisible">员工分组</th>
                                        <th width="100" class="hoverVisible">房间分组</th>
                                        <th width="100">手机号</th>
                                        <th width="60">所属计费单</th>
                                        <th width="60">支付情况</th>
                                        <th width="60">支付方式</th>
                                        <th width="100">入住时间</th>
                                        <th width="100">退宿时间</th>
                                        <th width="120" class="costName" title="{{fee.name + '/元'}}" v-for="fee in feeItems">{{fee.name}}(元)</th>
                                        <th width="130">总金额(元)</th>
                                        <th width="130">应缴金额(元)</th>
                                        <th width="80">操作</th>
                                        <th width="130">备注</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr class="text-c" v-for="item in items">
                                        <td>{{item.building_name}}</td>
                                        <td>{{item.room_no}}</td>
                                        <td title="{{item.room_type_name}}">{{item.room_type_name}}</td>
                                        <td title="{{item.real_name}}/{{item.sex == 1 ? '男' : '女'}}">{{item.real_name}}/{{item.sex == 1 ? '男' : '女'}}</td>
                                        <td>{{item.job_number}}</td>
                                        <td title="{{item.department_name}}">{{item.department_name}}</td>
                                        <td>{{item.position || '--'}}</td>
                                        <td>{{item.education || '--'}}</td>
                                        <td class="hoverVisible">
                                            <div class="tag_container">
                                                <div @mouseenter="checkPosition($event, item.staff_tags.length <= 1)" class="tag_box" v-if="item.staff_tags.length">
                                                    <div class="tag_item">
                                                        <span title="{{item.staff_tags[0].name}}">{{item.staff_tags[0].name}}</span>
                                                        <span class="tag_more" v-if="item.staff_tags.length > 1">...</span>
                                                    </div>
                                                    <div class="tag_second_box_sign"></div>
                                                    <div v-if="item.staff_tags.length > 1" class="tag_second_box clearfix">
                                                        <div v-for="staff_tag in item.staff_tags" class="tag_item f-l" title="{{staff_tag.name}}">{{staff_tag.name}}</div>
                                                    </div>
                                                </div>
                                                <span v-else>--</span>
                                            </div>
                                        </td>
                                        <td class="hoverVisible">
                                            <div class="tag_container">
                                                <div @mouseenter="checkPosition($event, item.room_tags.length <= 1)" class="tag_box" v-if="item.room_tags.length">
                                                    <div class="tag_item">
                                                        <span title="{{item.room_tags[0].name}}">{{item.room_tags[0].name}}</span>
                                                        <span class="tag_more" v-if="item.room_tags.length > 1">...</span>
                                                    </div>
                                                    <div class="tag_second_box_sign"></div>
                                                    <div v-if="item.room_tags.length > 1" class="tag_second_box clearfix">
                                                        <div v-for="room_tag in item.room_tags" class="tag_item f-l" title="{{room_tag.name}}">{{room_tag.name}}</div>
                                                    </div>
                                                </div>
                                                <span v-else>--</span>
                                            </div>
                                        </td>
                                        <td>{{item.phone}}</td>
                                        <td width="100" title="{{item.bill_name || '--'}}">{{item.bill_name || '--'}}</td> <!-- 计费单名称 -->
                                        <td width="100">{{item.status_name || '--'}}</td>
                                        <td width="100">{{item.pay_type || '--'}}</td> <!-- 这里的字段，开发文档上是pay_type_name -->
                                        <td>{{item.checkin_time | time}}</td>
                                        <td>{{item.checkout_time | time}}</td>
                                        <td v-for="fee in feeItems" track-by="$index">
                                            <div>{{fee.id | getFee item.fee_items 0}}</div>
                                            <div class="fc-aaa">(原：{{fee.id | getFee item.fee_items 1}} 费率{{fee.id | getPoint item.fee_items}})</div>
                                        </td>
                                        <td width="60">{{item.amount / 100}}</td>
                                        <td width="60">{{item.pay_amount / 100}}</td>
                                        <td>
                                            <a class="btn btn-primary radius fs-12" title="确认收款" href="javascript:;" v-if="item.status==10&&item.pay_type=='cash'" v-on:click="clickConfirm(item)">确认收款</a>
                                            <span v-else>无</span>
                                        </td>
                                        <td class="visible">
                                            <div>
                                                <a title="编辑" href="javascript:;" class="ml-10" v-on:click="setDormitoryRemark(item)"><i class="Hui-iconfont">&#xe6df;</i></a>
                                            </div>
                                            <div class="text-ellipsis" title="{{item.remark || '--'}}">
                                                {{item.remark || "--"}}
                                            </div>
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
                                        <th width="120">姓名/性别</th>
                                        <th width="60">工号</th>
                                        <th width="80">部门</th>
                                        <th width="70">职位</th>
                                        <th width="70">学历</th>
                                        <th width="100" class="hoverVisible">员工分组</th>
                                        <th width="100" class="hoverVisible">房间分组</th>
                                        <th width="100">手机号</th>
                                        <th width="60">所属计费单</th>
                                        <th width="60">支付情况</th>
                                        <th width="60">支付方式</th>
                                        <th width="100">入住时间</th>
                                        <th width="100">退宿时间</th>
                                        <th width="120" class="costName" title="{{fee.name + '/元'}}" v-for="fee in feeItems">{{fee.name}}(元)</th>
                                        <th width="130">总金额(元)</th>
                                        <th width="130">应缴金额(元)</th>
                                        <th width="80">操作</th>
                                        <th width="130">备注</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr class="text-c" v-for="item in items">
                                        <td>{{item.building_name}}</td>
                                        <td>{{item.room_no}}</td>
                                        <td title="{{item.room_type_name || '--'}}">{{item.room_type_name || '--'}}</td>
                                        <td title="{{item.real_name}}/{{item.sex == 1 ? '男' : '女'}}">{{item.real_name}}/{{item.sex == 1 ? '男' : '女'}}</td>
                                        <td>{{item.job_number}}</td>
                                        <td title="{{item.department_name}}">{{item.department_name}}</td>
                                        <td>{{item.position || '--'}}</td>
                                        <td>{{item.education ||'--'}}</td>
                                        <td class="hoverVisible">
                                            <div class="tag_container">
                                                <div @mouseenter="checkPosition($event, item.staff_tags.length <= 1)" class="tag_box" v-if="item.staff_tags.length">
                                                    <div class="tag_item">
                                                        <span title="{{item.staff_tags[0].name}}">{{item.staff_tags[0].name}}</span>
                                                        <span class="tag_more" v-if="item.staff_tags.length > 1">...</span>
                                                    </div>
                                                    <div class="tag_second_box_sign"></div>
                                                    <div v-if="item.staff_tags.length > 1" class="tag_second_box clearfix">
                                                        <div v-for="staff_tag in item.staff_tags" class="tag_item f-l" title="{{staff_tag.name}}">{{staff_tag.name}}</div>
                                                    </div>
                                                </div>
                                                <span v-else>--</span>
                                            </div>
                                        </td>
                                        <td class="hoverVisible">
                                            <div class="tag_container">
                                                <div @mouseenter="checkPosition($event, item.room_tags.length <= 1)" class="tag_box" v-if="item.room_tags.length">
                                                    <div class="tag_item">
                                                        <span title="{{item.room_tags[0].tag_name}}">{{item.room_tags[0].tag_name}}</span>
                                                        <span class="tag_more" v-if="item.room_tags.length > 1">...</span>
                                                    </div>
                                                    <div class="tag_second_box_sign"></div>
                                                    <div v-if="item.room_tags.length > 1" class="tag_second_box clearfix">
                                                        <div v-for="room_tag in item.room_tags" class="tag_item f-l" title="{{room_tag.tag_name}}">{{room_tag.tag_name}}</div>
                                                    </div>
                                                </div>
                                                <span v-else>--</span>
                                            </div>
                                        </td>
                                        <td>{{item.phone}}</td>
                                        <td>{{item.bill_name || '--'}}</td>
                                        <td>{{item.status_name || '--'}}</td>
                                        <td>{{item.pay_type_name || '--'}}</td>
                                        <td>{{item.checkin_time | time}}</td>
                                        <td>{{item.checkout_time | time}}</td>
                                        <td v-for="fee in feeItems" track-by="$index">
                                            <div>{{fee.id | getFee item.fee_items 0}}</div>
                                            <div class="fc-aaa">(原：{{fee.id | getFee item.fee_items 1}} 费率{{fee.id | getPoint item.fee_items}})</div>
                                        </td>
                                        <td>{{item.amount / 100}}</td>
                                        <td>{{item.pay_amount / 100}}</td>
                                        <td>
                                            <a class="btn btn-primary radius fs-12" title="确认收款" href="javascript:;" v-if="item.status==10&&item.pay_type=='cash'" v-on:click="clickConfirm(item)">确认收款</a>
                                            <span v-else>无</span>
                                        </td>
                                        <td class="visible">
                                            <div>
                                                <a title="编辑" href="javascript:;" class="ml-10" v-on:click="setDormitoryRemark(item)"><i class="Hui-iconfont">&#xe6df;</i></a>
                                            </div>
                                            <div class="text-ellipsis" title="{{item.remark || '--'}}">
                                                {{item.remark || "--"}}
                                            </div>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="scroll-bar">
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

    <!-- 添加 -->
    <remark :data="remarkData" v-if="isShowRemarkDialog" v-on:dialog-close="remarkClose" v-on:dialog-save="remarkSave"></remark>
    <set_paytype :title="dialogTitle" :type="dialogType" :data="dialogData" v-if="isShowPayTypeDialog" v-on:dialog-close="payTypeDialogClose"></set_paytype>
</template>
<style lang="less" scoped>
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

    .hoverVisible:hover {
        overflow: visible;
    }

    .no-data {
        margin: 0;
        line-height: 80px;
    }

    .tag_container {
        width: 80px;
        margin: 0 auto;
    }

    .clearfix:before {
        content: "";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
        zoom: 1;
    }

    .page-container {
        box-sizing: border-box;
    }

    .title {
        width: 100%;
        z-index: 2;
    }

    .title-text {
        position: absolute;
        left: 0;
        top: 0;
        width: 160px;
    }

    .title-body {
        margin-left: 160px;
    }

    .content {
        /*min-height: 600px;*/
        /*height: 100%;*/
        overflow: hidden;
        box-sizing: border-box;
        z-index: 1;
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
        /*width: 450px;*/
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
        margin-top: -10px;
        color: #ccc;
        background-color: #ccc;
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

    .searchButton {
        margin-left: 160px;
    }

</style>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import mScroll from '../assets/js/scrollLeft';
    import set_paytype from '../components/setPayType.vue';
    import remark from '../components/addDormitoryRemark.vue';
    let itemOps = null;
    export default{
        ready(){
            itemOps = {
                param: {
                    page: 1,
                    page_size: 10,
                    bill: '',
                    building: '', // 宿舍楼id
                    room_type: '', // 房间类型id
                    department: '', // 员工部门id
                    position: '', // 员工职位
                    education: '', // 员工学历
//                    staff_tag: '', // 员工标签id
//                    room_tag: '', // 房间标签id
                    status: "", // 支付状态
                    pay_type: '', // 支付方式
                    staff_name: '', // 员工姓名
                    job_number: '', // 员工工号
                    room_no: '', // 房间号
                    phone: "", // 员工电话
                }
            };
            this.initSelections();
            this.getList();
        },
        data: function () {
            return {
                noData: false,
                itemsLoading: false,
                isShowPayTypeDialog: false, // 设置支付方式
                isShowRemarkDialog: false, // 设置备注内容
                items: [], // 缴费单数组
                roomTypeArr: [], // 房间类型数组
                roomTypeSelected: '', // 房间类型
                room_no: '', // 房间号
                departmentItem: [], // 部门数组
                departmentSelected: '', // 部门
                departmentSelectedName: '',
                positionArr: [], // 职位数组
                position: '', // 职位
                studyArr: [], // 学历数组
                education: '', // 学历
//                staffTag: '', // 员工标签
//                staffTagArr: [], // 员工标签数组
                roomTag: '', // 员工标签
                roomTagArr: [], // 员工标签数组
                feeItems: [], // 费用类型列表
                bills: [],
                bill: '',
                buildingSelected: '', // 选择的楼id
                buildingArr: [], // 楼列表数组
                searchInputType: '', // 搜索内容类型
                remarkData: null, // remark data
                payStatus: "", // 支付状态
                payType: "", // 支付方式
                isComponentDestroy: false,
            }
        },
        methods: {
            clickItem: function (module) {
                this.module = module;
            },
            clickSave: function (item) {
                let that = this;
                if (!(/^[0-9]*[1-9][0-9]*$/.test(this.deadlineInput))) {
                    layer.msg('请输入正确的天数', {icon: 2, time: 1000});
                    return;
                }
                let ajaxData = {
                    checkin_deadline_day: this.deadlineInput,
                };
                $.ajax({
                    url: that.rulesURL,
                    type: that.rulesType,
                    data: ajaxData,
                }).always((data)=> {
                    base.ajaxCallback(data, ()=> {
                        layer.msg('提交成功', {icon: 1, time: 1000});
                    });
                });
            },
            //初始化分页
            initPage: function (obj, tpageToal = '4', current = '1', count = '0') {
                $(obj).createPage({
                    pageCount: tpageToal,
                    current: current,
                    count: count,
                    callback: (p)=> {
                        itemOps.param.page = p;
                        this.queryAjax(this.buildingsId);
                    }
                });
            },
            //获取入住申请规则列表
            getList: function (reset = 0) {
                //重置第一页
                if (reset) {
                    itemOps.param.room_no = itemOps.param.staff_name = itemOps.param.job_number = itemOps.param.phone = "";
                    itemOps.param.page = 1;
                    itemOps.param.room_type = this.roomTypeSelected; // 房间类型
                    itemOps.param.department = this.getDepartmentId($("#department").val()); // 部门列表
                    itemOps.param.position = this.position; // 职位
                    itemOps.param.education = this.education; // 学历
//                    itemOps.param.staff_tag = this.staffTag; // 员工标签
//                    itemOps.param.room_tag = this.roomTag; // 房间标签
                    itemOps.param.building = this.buildingSelected; // 宿舍楼id
                    itemOps.param.pay_type = this.payType; // 支付方式
                    itemOps.param.status = this.payStatus; // 支付状态
                    itemOps.param.bill = this.bill; // 计费单id
                    itemOps.param[this.searchInputType] = $("#searchInput").val();
                }
//                console.log("ajax param :");
//                console.log(itemOps.param);
                this.queryAjax((tpageToal = '4', count = '0')=> {
                    this.initPage('#J-page', tpageToal, itemOps.param.page, count)
                });
            },
            queryAjax: function (callback = function () {}) {
                this.itemsLoading = true;
                $.ajax({
                    url: `${base.gAjaxUrl.payOrder}`,
                    type: 'GET',
                    data: itemOps.param
                }).always((data)=> {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=> {
                        let resultData = data.results;
                        if (resultData && resultData.length) {
                            this.items = resultData;
                            this.noData = false;
                            //回调
                            callback(data.num_pages, data.count);
                        } else {
                            this.items = [];
                            this.noData = true;
                        }
                        this.feeItems = this.getFeeTypes(this.items);
//                        console.log(this.feeItems);
                        this.$nextTick(() => {
                            if(this.isComponentDestroy) return;
                            this.setHeight();
                        });
                    });
                })
            },
            setDormitoryRemark: function (item) {
                console.log(item);
                this.remarkData = item;
                this.isShowRemarkDialog = true;
            },
            remarkClose: function () {
                this.isShowRemarkDialog = false;
            },
            remarkSave: function (para) {
//                console.log("para: ");
//                console.log(para);
                this.isShowRemarkDialog = false;
                this.getList();
            },
            initSelections: function () {
                this.itemsLoading = true;
                //获取计费单
                $.ajax({
                    url: `${base.gAjaxUrl.bills}?page=1&page_size=999999`,
                    type: 'GET',
                }).always((data)=> {
                    base.ajaxCallback(data, ()=> {
                        if (data.results.length) {
                            this.bills = data.results;
                        }
                    })
                });
                //获取部门列表
                $.ajax({
                    url: `${base.gAjaxUrl.departments}?page=1&page_size=999999`,
                    type: 'GET',
                }).always((data)=> {
//                    console.log(data.results);
                    this.departmentItem = data || [];

                });
                //获取房间类型列表
                $.ajax({
                    url: `${base.gAjaxUrl.roomtypes}?page=1&page_size=999999`,
                    type: 'GET',
                }).always((data)=> {
                    base.ajaxCallback(data, ()=> {
                        this.roomTypeArr = (data && data.results) || [];
                    });
                });
                // 宿舍楼列表
                $.ajax({
                    url: `${base.gAjaxUrl.buildings}?page=1&page_size=999999`,
                    type: 'GET',
                }).always((data)=> {
                    base.ajaxCallback(data, ()=> {
                        this.buildingArr = (data && data.results) || [];
                    });
                });
//                // 员工标签
//                $.ajax({
//                    url: `${base.gAjaxUrl.staffsTag}?page=1&page_size=999999`,
//                    type: 'GET',
//                }).always((data)=> {
//                    base.ajaxCallback(data, ()=> {
//                        this.staffTagArr = data.results || [];
//                    });
//                });
                // 获取房间标签列表 -- 功能暂时停用
//                $.ajax({
//                    url: `${base.gAjaxUrl.roomTag}?page=1&page_size=999999`,
//                    type: 'GET',
//                }).always((data)=> {
//                    base.ajaxCallback(data, ()=> {
//                        this.roomTagArr = data.results || [];
//                    });
//                });
                // 获取费用类型列表
//                $.ajax({
//                    url: base.gAjaxUrl.feeTypeList,
//                    type: 'GET',
//                }).always((data)=>{
//                    this.itemsLoading = false;
//                    base.ajaxCallback(data,()=>{
//                        this.feeItems = data || [];
//                        console.log("feeItems:");
//                        console.log(this.feeItems);
//                        this.$nextTick(() => {
//                            this.getList();
//                        });
//                    });
//                })
            },
            clickConfirm: function (item) {
                layer.confirm(`确认收到${item.real_name}的住宿费用:￥${item.pay_amount/100}元?`,
                    (index)=>{
                        $.ajax({
                            url: `${base.gAjaxUrl.waterEleOrders}${item.id}/confirm_cash/`,
                            type: 'POST',
                        }).always((data)=>{
                            base.ajaxCallback(data,()=>{
                                layer.msg('提交成功',{icon:1,time:1000});
                                this.getList();
                            });
                        })
                    },
                );
            },
            checkPosition: function (e, flag) {
                if(flag) return;
                let target = e.srcElement ? e.srcElement : e.target;
                let $this = $(target);
                if ($this.hasClass("top") || $this.hasClass("bottom")) return;
                let $parent = $this.parents(".fixedParent"); // 以下判断方法，需要$parent的padding为0，不然要重新插入padding的判断
                let $tagBox = $this.children(".tag_second_box");
                // $tagBox.offset().top + $tagBox.outerHeight() + $this.find(".tag_second_box_sign").outerHeight() > $parent.offset().top + $parent.outerHeight() 判断向下不能显示完
                // $this.parents("td").offset().top - $parent.offset().top < $this.find(".tag_second_box_sign").outerHeight() + $tagBox.outerHeight() 判断向上不能显示完
                if ($tagBox.offset().top + $tagBox.outerHeight() + $this.find(".tag_second_box_sign").outerHeight() > $parent.offset().top + $parent.height() && $this.parents("td").offset().top - $parent.offset().top < $this.find(".tag_second_box_sign").outerHeight() + $tagBox.outerHeight()) {
                    // 防止重复添加minHeight属性，选择添加最大值
                    var height = $parent.parents(".position_box").height();
                    var currentHeight = $this.offset().top - $parent.offset().top + $this.find(".tag_second_box_sign").outerHeight() + $tagBox.outerHeight() + $this.parents("td").outerHeight();
                    // 防止 $parent 不是 $parent.parent() 的第一个子元素
                    var compensate = $parent.offset().top - $parent.parent().offset().top;
                    if (currentHeight + compensate > height) $parent.parents(".position_box, .panel-default").css({minHeight: currentHeight + compensate});
                    $this.addClass("bottom");
                } else if ($tagBox.offset().top + $tagBox.outerHeight() + $this.find(".tag_second_box_sign").outerHeight() > $parent.offset().top + $parent.outerHeight()) {
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
                if (this.isDepartmentFocus) {
                    $(".departmentListBox").show();
                }
            },
            departmentEnter: function (flag) {
                this.isDepartmentFocus = flag;
                !flag && $(".departmentListBox").hide();
            },
            setDepartmentValue: function (item) {
                this.departmentSelectedName = item.department_tree;
                this.departmentSelected = item.id;
                $(".departmentListBox").hide()
            },
            // 清除搜索输入框
            emptySearch:function(){
                this.departmentSelectedName = '';
                $(".departmentListBox").show();
            },
            getDepartmentId: function (val) {
                var id = '';
                this.departmentItem.forEach(function (item) {
                    if (item.department_tree == val) {
                        id = item.id;
                    }
                });
                return id;
            },
            exportData: function () {
//                console.log("exportData");
                this.itemsLoading = true;
                $.ajax({
                    url: `${base.gAjaxUrl.exportPayOrders}`,
                    type: 'GET',
                    data: itemOps.param,
                }).always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=>{
                        this.$route.router.go({path: '/job'})
                    })
                })
            },
            setPayType: function () {
                this.dialogTitle = '设置支付方式';
                this.dialogData = 6; //所属模块  1:通勤车,2:公务车,3:入住,4:订水,5:宿舍维修,6:水电
                this.isShowPayTypeDialog = true;
            },
            payTypeDialogClose: function (data) {
                this.isShowPayTypeDialog = false;
            },
            setHeight: function (){
                $(".position_box").parents(".panel").css({
                    height: $(".position_box").outerHeight()
                });
                if(this.isComponentDestroy) return;
                mScroll("#scroll-roll", "#colFixed");
            },
            getFeeTypes: function (items) {
//                console.log("getFeeTypes");
//                console.log(items);
                // fee_items feetype_id feetype_name
                let arr = [];
                for(let i = 0, len = items.length; i < len; i++) {
                    let fees = items[i].fee_items;
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
            set_paytype,
            remark,
        },
        filters: {
            /**
             * @param id
             * @param fees
             * @param flag 0表示获取实际缴费金额，1表示应缴纳金额
             * @returns {*}
             */
            getFee: function (id, fees, flag) {
                for(let i = 0, len = fees.length;i < len;i++) {
                    if(id == fees[i].feetype_id) {
                        return flag == 1 ? fees[i].fee / 100 : fees[i].payfee / 100 ;
                    }
                }
                return "--"
            },
            getPoint: function (id, fees) {
                for(let i = 0, len = fees.length;i < len;i++) {
                    if(id == fees[i].feetype_id) {
                        return fees[i].point ? fees[i].point + "%" : '100%';
                    }
                }
                return "100%"
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