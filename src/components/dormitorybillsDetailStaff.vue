<template>
    <div class="m_win relative">
        <div class="layui-layer-title">{{title}}【计费单：{{bill.bill_name}}】 [ 开始日期：{{bill.start_date}}  结束日期：{{bill.end_date}} ]</div>
        <div class="m_content pl-10 pr-10">
            <div  class="mt-20">
                <div class="title">
                    <img src="../assets/images/icon-room.png" height="auto" width="32" alt="" class="mr-10" style="vertical-align:text-bottom">
                    <span class="mr-10 f-20 roomNo">{{data.room_vo.room_no}}房</span>
                    <span class="mr-10">{{data.room_vo.building_vo.building_name}}</span>
                </div>
                <div class="mt-5 fc-999 clearfix">
                    <span class="mr-10">{{data.room_vo.room_type_vo.type_name}}({{data.room_vo.room_type_vo.content}}人)</span>
                    <!--<span class="mr-10">已入住：{{data.room_vo.occupancy_number || "0"}}人</span>-->
                    <span class="mr-10">房间配置:
                        <span v-if="data.equipments.length">
                            <span v-for="equipment in data.equipments">{{equipment.name}}
                                <span v-show="$index != data.equipments.length - 1">/</span>
                            </span>
                        </span>
                        <span v-else>无</span>
                    </span>
                    <!--<span class="f-r fc-333">宿舍水费：<span class="fc-206afc">{{data.water_pay_amount && data.water_pay_amount | getFee }} 元</span></span>-->
                    <!--<span class="f-r mr-10 fc-333">宿舍电费：<span class="fc-206afc">{{data.electricity_pay_amount && data.electricity_pay_amount | getFee }} 元</span></span>-->
                    <span class="mr-10">房间分组:
                        <span v-if="data.room_vo.tags.length">
                            <span v-for="tag in data.room_vo.tags">{{tag.name}}
                                <span v-show="$index != data.room_vo.tags.length - 1">/</span>
                            </span>
                        </span>
                        <span v-else>无</span>
                    </span>
                </div>
            </div>
            <div class="waterElectricityContainer mt-20">
                <set v-if="true" :type="data.status == 10 ? 'set' : 'check'" :data="data" v-on:dialog-save="setDialogSave"></set>
                <!--<set v-if="false" :type="data.status == 10 ? 'set' : 'check'" :data="data" v-on:dialog-save="setDialogSave"></set>-->
            </div>
            <table class="mt-50 table table-border table-bg table-striped bor-l bor-r mt-10 staffList" v-if="staffList && staffList.staff_fee_list.length">
                <thead class="text-c">
                    <tr>
                        <th width="80">序号</th>
                        <th width="80">姓名</th>
                        <!--<th>姓名/性别</th>-->
                        <!--<th>部门/职位</th>-->
                        <th width="100">工号</th>
                        <th width="100">电话</th>
                        <th width="100">入住时间</th>
                        <th width="100">退宿时间</th>
                        <th width="150">电费(元)</th>
                        <th width="150">水费(元)</th>
                        <th width="100">应缴总额(元)</th>
                        <th width="100">实缴总额(元)</th>
                        <th width="100">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="text-c" v-for="item in staffList.staff_fee_list">
                        <td>{{$index+1}}</td>
                        <td>{{item.real_name}}</td>
                        <!--<td>{{item.real_name}}/{{item.sex==1?'男':'女'}}</td>-->
                        <!--<td>{{item.department_vo.department_name}}/{{item.position}}</td>-->
                        <td>{{item.job_number}}</td>
                        <td>{{item.phone}}</td>
                        <td>{{item.checkin_time | time}}</td>
                        <td>{{item.checkout_time | time}}</td>
                        <td>
                            <div>{{item.ele_pay_fee | getFee}}</div>
                            <div class="fc-aaa">(原：{{item.ele_fee | getFee}} 费率{{item.staff_ele_point | getPoint}})</div>
                        </td>
                        <td>
                            <div>{{item.water_pay_fee | getFee}}</div>
                            <div class="fc-aaa">(原：{{item.water_fee | getFee}} 费率{{item.staff_water_point | getPoint}})</div>
                        </td>
                        <td>{{item | getNeedPay}}</td>
                        <td>{{item | getActualPay}}</td>
                        <td>
                            <a v-if="data.status == 10" class="btn btn-primary radius fs-12" title="修改费率" href="javascript:;" v-on:click="changeExpenseRate(item, 0)">修改费率</a>
                            <a v-if="data.status == 20" class="btn btn-default radius fs-12" title="查看费率" href="javascript:;" v-on:click="changeExpenseRate(item, 1)">查看费率</a>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="m-no-data text-c mt-50" v-if="noData">没有相关数据</div>
            <div class="tr mt-10 mb-20 pr-20">
                <a class="btn btn-primary radius" v-on:click="close">确认</a>
            </div>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
        </span>
    </div>
    <div class="layui-layer-shade"></div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
    <modify v-if="isShowModifyDialog" v-bind:member="member" v-bind:type="statusType" v-bind:bill="bill" v-on:dialog-close="closeModify" v-on:dialog-save="saveModify"></modify>
</template>

<style lang="less" scoped rel="stylesheet/less">
    .m-no-data {
        line-height: 80px;
    }
    .m_win {
        position: fixed;
        left: 15%;
        top: 5%;
        bottom: 5%;
        right:  15%;
        overflow: auto;
        margin: 0 !important;
        padding: 0 !important;
        z-index: 200;
        background-color: #fff;
        .layui-layer-title {
            padding: 0 80px 0 20px;
            height: 42px;
            line-height: 42px;
            border-bottom: 1px solid #eee;
            font-size: 14px;
            color: #333;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            background-color: #F8F8F8;
            border-radius: 2px 2px 0 0;
        }
        .m_content {
            padding: 0 20px;
            box-sizing: border-box;
            min-width: 600px;
            .roomTitle {
                padding: 10px 0;
            }
            ._roomPrice {
                width: 100%;
            }
        }
        .waterElectricityContainer {
            min-width: 600px;
        }
    }
</style>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import set from "./setWaterElePriceComponent.vue";
    import modify from './modifyWaterElectricityRate.vue';
    export default{
        ready () {
            this.getRoomDetail();
            console.log("this.data: ");
            console.log(this.data)
        },
        // 动态传值
        props: ['title','data', 'bill'],
        data:function(){
            return {
                itemsLoading: false,
                staffList: null,
                isShowModifyDialog: false,
                member: null,
                statusType: null,
                isComponentDestroy: false,
                noData: false,
            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
//                this.$dispatch('dialog-save');
            },
            setDialogSave: function () {
                console.log("dialogsave");
                this.$dispatch('dialog-save');
                this.getRoomDetail();
            },
            //获取房间信息
            getRoomDetail:function(){
                this.itemsLoading = true;
                $.ajax({
                    url: `${base.gAjaxUrl.bills}${this.bill.id}/room_we_info/`,
                    type: 'GET',
                    data: {
                        room: this.data.room
                    }
                })
                .always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{

                        this.staffList = data;
                        this.noData = this.staffList.staff_fee_list.length ? false : true;
                        console.log("this.staffList");
                        console.log(this.staffList.staff_fee_list);
                        this.$nextTick(() => {
                            if(this.isComponentDestroy) return;
                            base.calTableWidth(".staffList");
                        })
                    });
                });
            },
            changeExpenseRate: function (item, flag) {
                this.isShowModifyDialog = true;
                this.member = item;
                this.statusType = flag ? 'check' : 'set'; // check 表示费用已经推送，只能查，set表示费用可以重新设定
            },
            closeModify: function () {
                this.isShowModifyDialog = false;
            },
            saveModify: function () {
                this.isShowModifyDialog = false;
                this.$dispatch('dialog-save');
                this.getRoomDetail();
            }
        },
        filters: {
            getNeedPay: function (item) {
                var num = (Number(item.water_fee) || 0) + (Number(item.ele_fee) || 0);
                if(!num) return 0;
                return (num / 100).toFixed(2).replace(".00", "");
            },
            getActualPay: function (item) {
                var num = (Number(item.water_pay_fee) || 0) + (Number(item.ele_pay_fee) || 0);
                if(!num) return 0;
                return (num / 100).toFixed(2).replace(".00", "");
            },
            getFee: function (num) {
//                console.log(num);
                num = num || 0;
                if(!num) return "0";
                return (num / 100).toFixed(2).replace(".00", "");
            },
            calFee: function (a, b) {
                a = a || 0;
                b = b || 0;
                return ((a + b) / 100).toFixed(2).replace(".00", "");
            },
            getPoint: function (point) {
                if(point == null) return "100%";
                if(point == 0) return 0;
                return point + "%";
            },
            time: function (t) {
                return t ? t.slice(0, 10) : '--';
            }
        },
        beforeDestroy: function () {
            this.isComponentDestroy = true;
        },
        components: {
            modify, set
        }
    }
</script>