<template>
    <div class="m_win relative">
        <div class="layui-layer-title">设置查看【计费单：{{bill.bill_name}}】 [ 开始日期：{{bill.start_date}}  结束日期：{{bill.end_date}} ]</div>
        <div class="m_content">
            <div class="roomTitle clearfix" v-if="roomInfo">
                <img src="../assets/images/icon-room.png" class="f-l room-img" alt="房间">
                <div class="f-l ml-10 mt-5">
                    <div class="room_no f-18 c-primary">{{roomInfo.room_no}}房</div>
                </div>
                <div class="f-l ml-10 mt-10">
                    <div class="building_no">{{data.building_name}}</div>
                </div>
                <div class="f-l ml-10 mt-10">
                    <div class="room_type">{{roomInfo.room_type_vo.type_name ? roomInfo.room_type_vo.type_name : '--'}}({{roomInfo.room_type_vo.content ? roomInfo.room_type_vo.content : '--'}}人)</div>
                </div>
                <!--<div class="f-l ml-10 mt-10">-->
                    <!--<div class="room_in">已入住({{roomInfo.occupancy_number || 0}}人)</div>-->
                <!--</div>-->
                <div class="f-l ml-10 mt-10">
                    <span>房间配置:
                        <span v-if="roomInfo.room_type_vo.equipments && roomInfo.room_type_vo.equipments.length">
                            <span v-for="equipment in roomInfo.room_type_vo.equipments">
                                {{equipment.name}}
                                <span v-show="$index != roomInfo.room_type_vo.equipments.length - 1">/</span>
                            </span>
                        </span>
                        <span v-else>无</span>
                    </span>
                </div>
                <div class="f-l ml-10 mt-10">
                    <span>房间分组:
                        <span v-if="data.room_tags && data.room_tags.length">
                            <span v-for="tag in data.room_tags">
                                {{tag.tag_name}}
                                <span v-show="$index != data.room_tags.length - 1">/</span>
                            </span>
                        </span>
                        <span v-else>无</span>
                    </span>
                </div>
            </div>
            <div class="roomCommonPrice clearfix" v-if="roomInfo && fees.length">
                <form id="J-layer-form" class="f-l clearfix _roomPrice setRoom000001">
                    <div class="commonInput f-l mt-10 mb-10 clearfix mr-20 relative" track-by="$index" v-for="fee in fees">
                        <div class="f-l tr mr-5">{{fee.feetype_name}}</div>
                        <input :disabled="type == 'check'" type="text" class="input-text w-100 f-l ml-5" :class="'csr' + fee.feetype_id" :value="fee.fee | feeFilter" placeholder="" name="{{'nsr' + fee.feetype_id}}">
                        <span class="f-l ml-5">元</span>
                    </div>
                </form>
                <div class="f-l clearfix mt-10" v-if="roomInfo.room_fees.length">
                    <a :class="{'disabled': type == 'check', 'btn-default': type == 'check', 'btn-primary': type == 'set'}" class="btn radius fs-12 f-l" v-on:click="setPrice">修改房间费用</a>
                </div>
                <span class="c-red" v-else>【请先给改房间设定全体费用】</span>
            </div>
            <div class="mt-50">
                <div class="roomMemberList" v-if="roomInfo && roomInfo.room_fees.length && roomInfo.staff_fee_list.length" class="build-form-container mt-10">
                    <table class="fixedParent roomList table table-border table-bordered table-bg table-sort">
                        <thead class="text-c">
                            <tr>
                                <th width="60">序号</th>
                                <th width="80">姓名</th>
                                <th width="100">工号</th>
                                <th width="100">入住时间</th>
                                <th width="100">退宿时间</th>
                                <!--<th width="90" class="costName" track-by="$index" v-for="item in userCostNamesArr">{{item}}(元)</th>-->
                                <th width="120" class="costName" title="{{fee.feetype_name + '/元'}}" track-by="$index" v-for="fee in fees">{{fee.feetype_name}}/元</th>
                                <th width="80">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr class="text-c" v-for="(index, item) in roomInfo.staff_fee_list" track-by="$index">
                            <td>{{$index + 1}}</td>
                            <td>{{item.real_name}}</td>
                            <td>{{item.job_number}}</td>
                            <td>{{item.checkin_time | time}}</td>
                            <td>{{item.checkout_time | time}}</td>
                            <td v-for="fee in fees" track-by="$index">
                                {{fee.feetype_id | getFee item.fixed_fee_list}}
                            </td>
                            <td>
                                <!--<a :class="{'disabled': type == 'check', 'btn-default': type == 'check', 'btn-primary': type == 'set'}" class="btn radius fs-12" title="修改费率" href="javascript:;" v-on:click="changeExpenseRate(item)">修改费率</a>-->
                                <a v-if="type == 'set'" class="btn btn-primary radius fs-12" title="修改费率" href="javascript:;" v-on:click="changeExpenseRate(item, 0)">修改费率</a>
                                <a v-else class="btn btn-default radius fs-12" title="查看费率" href="javascript:;" v-on:click="changeExpenseRate(item, 1)">查看费率</a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="tr mt-10 mb-20" v-show="roomInfo && roomInfo.staff_fee_list.length">
                    <a class="btn btn-primary radius" v-on:click="save">确认</a>
                </div>
                <div v-show="!roomInfo || !roomInfo.room_fees.length" class="no-data text-c mt-50 c-red">当前计费单，该宿舍楼未设置费用，请先设置</div>
                <div v-show="!roomInfo || !roomInfo.staff_fee_list.length" class="no-data text-c mt-50 c-red">房间无员工入住信息</div>
            </div>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
        </span>
        <!--<div class="tr mt-10 sureBtn" v-show="roomInfo && roomInfo.staff_fee_list.length">-->
            <!--<a class="btn btn-primary radius" v-on:click="close">确认</a>-->
        <!--</div>-->
    </div>
    <div class="layui-layer-shade"></div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
    <modify v-if="isShowModifyDialog" v-bind:member="member" v-bind:type="statusType" v-bind:bill="bill" v-bind:fees="fees" v-on:dialog-close="closeModify" v-on:dialog-save="saveModify"></modify>
</template>

<style lang="less" scoped rel="stylesheet/less">
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
            .roomTitle {
                padding: 10px 0;
            }
            ._roomPrice {
                width: 100%;
            }
        }
        .commonInput .f-l {
            line-height: 30px;
        }
        .build-form-container {
            width: 100%;
            padding: 10px 0 20px;
            overflow-x: auto;
        }
        .sureBtn {
            position: absolute;
            right: 20px;
            bottom: 20px;
        }
        .roomMemberList {
            width: 100%;
            overflow: auto;
        }
        /*.roomCommonPrice, .roomMemberList {*/
            /*padding: 10px 20px;*/
        /*}*/
    }
    .tr {
        text-align: right;
    }
    .tc {
        text-align: center;
    }
</style>
<style>
    /* 全局样式，不能影响其他页面，所有有些类名 */
    #J-layer-form._roomPrice.setRoom000001 label.error{
        right: 28px;
        top: 23px;
        line-height: 30px;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import modify from "../components/modifyRoomRate.vue";

    export default{
        ready () {
            let that = this;

            base.verticalCenter('.layui-modify');

//            console.log(getData.room);
            this.getRoomDetail(); // 获取宿舍费用等详细信息

            // 验证两位小数
            $.validator.addMethod('floatNum',function(value, element){
                var reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$|^0$/; // 可以输入 0 的情况
                return this.optional(element) || reg.test( value );
            },'请输入正确的金额');

//            console.log("this.types： ");
//            console.log(this.types);
            console.log(this.bill)

        },
        props: ['data', 'bill', 'types', 'type'], //
        data:function(){
            return {
                itemsLoading:false,
                isShowModifyDialog: false, // 是否显示费率修改组件
                roomInfo: null, // 房间详情，用于整个页面的渲染
                member: null, // 员工的费率
                statusType: '', // 修改费率还是查看费率
                isComponentDestroy: false, // 当前组件是否已经被摧毁
                isFormInit: false,
                fees: [],
            }
        },
        methods: {
            close: function(){
                this.$dispatch('dialog-close');
            },
            save: function(){
                if(this.type == 'set') {
                    this.$dispatch('dialog-save');
                } else {
                    this.$dispatch('dialog-close');
                }
            },
            setPrice: function(){
//                layer.confirm("确定修改当前信息", (index) => {
                    if(this.isFormInit) {
                        $('#J-layer-form').submit();
                    }
//                    layer.close(index)
//                });
            },
            getRoomDetail:function(callback=function(){}){
                //获取宿舍详情
                this.itemsLoading = true;
                $.ajax({
                    url: `${base.gAjaxUrl.bills}${this.bill.id}/room_info/`,
                    type: 'GET',
                    data: {
                        room: this.data.id
                    }
                }).always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
//                        console.log(data);
                        if(data) {
                            this.roomInfo = data || null;
                            // 主要是为了排序，和列表页的费用类型排序保持一致
                           this.fees = this.orderFees(data.room_fees);
                            // this.fees = this.type == 'set' ? data.room_fees : this.orderFees(data.room_fees); // 如果是设置时直接以服务器返回的费用类型进行表头渲染
                            this.$nextTick(() => {
                                if(this.isComponentDestroy) return;
                                this.initForm();
                                base.calTableWidth(".fixedParent.roomList");
                            })
                        }
                    });
                });
            },
            checkPosition: function (e, flag) {
                if(flag) return;
                let target = e.srcElement ? e.srcElement : e.target;
                let $this = $(target);
                if($this.hasClass("top") || $this.hasClass("bottom")) return;
                let $parent = $this.parents(".fixedParent");
                let $tagBox = $this.children(".tag_second_box");
                // $tagBox.offset().top + $tagBox.outerHeight() > $parent.offset().top + $parent.outerHeight() 判断向下不能显示完
                // $this.offset().top - $parent.offset().top < $this.find(".tag_second_box_sign").outerHeight() + $tagBox.outerHeight().outerHeight() 判断向上不能显示完
                if($tagBox.offset().top + $tagBox.outerHeight() > $parent.offset().top + $parent.outerHeight() && $this.offset().top - $parent.offset().top < $this.find(".tag_second_box_sign").outerHeight() + $tagBox.outerHeight()){
                    // 防止重复添加minHeight属性，选择添加最大值
                    var height = parseInt($parent.parent().css("minHeight"));
                    var currentHeight = $this.offset().top - $parent.offset().top + $this.find(".tag_second_box_sign").outerHeight() + $tagBox.outerHeight() + $this.parents("td").outerHeight();
                    if(currentHeight > height) $parent.parent().css({minHeight: currentHeight});
                    $this.removeClass("bottom top").addClass("bottom");
                } else if($tagBox.offset().top + $tagBox.outerHeight() > $parent.offset().top + $parent.outerHeight()){
                    $this.removeClass("bottom top").addClass("top");
                } else {
                    $this.removeClass("bottom top").addClass("bottom");
                }
            },
            changeExpenseRate: function (item, flag) {
                this.member = item;
                this.statusType = flag ? 'check' : 'set'
                this.isShowModifyDialog = true;
            },
            closeModify: function () {
                this.isShowModifyDialog = false;
            },
            saveModify: function () {
                this.isShowModifyDialog = false;
                this.isFormInit = false;
                this.getRoomDetail();
            },
            initForm: function () {
                var that = this;
                var fees = this.fees;
                if(!fees.length) return;
                var rulesJ = {};
                for(let i = 0, len = fees.length; i < len; i++) {
                    rulesJ['nsr' + fees[i].feetype_id] = {
                        floatNum: true,
                    }
                }
                //验证表单头部
                $('#J-layer-form').validate({
                    rules: rulesJ,
                    submitHandler:function() {
                        that.itemsLoading = true;
                        that.isFormInit = false;
                        var fees = that.roomInfo.room_fees;
                        var valArr = [];
                        $.each(fees, function (j, fee) {
                            valArr.push({
                                id: fee.id,
                                feetype_id: fee.feetype_id,
                                fee: $("._roomPrice .csr" + fee.feetype_id).val() * 100, // 服务器存储以分为单位
                            });
                        });
//                        console.log(valArr);
                        $.ajax({
                            url: `${base.gAjaxUrl.bills}${that.bill.id}/modify_room_fixedfee/`,
                            type: 'POST',
                            contentType: "application/json",
                            data: JSON.stringify({
                                room_id: that.data.id,
                                data: valArr
                            }),
                        }).always((data)=> {
                            that.itemsLoading = false;
                            base.ajaxCallback(data, ()=> {
                                that.getRoomDetail();
//                                that.$dispatch("dialog-save");
//                                console.log(data);
                            })
                        });
                    }
                });
                this.isFormInit = true;
            },
            // 对动态获取到的费用列表进行排序
            orderFees: function (fees) {
                let arr = [];
                let types = this.types;
                for(let i = 0,len = types.length; i < len; i++) {
                    for(let j = 0, len_j = fees.length; j < len_j;j++){
                        if(types[i].id === fees[j].feetype_id) {
                            arr.push(fees[j]);
                            break;
                        }
                    }
                }
//                console.log("arr: ");
//                console.log(arr);
                return arr;
            },
        },
        components: {
            modify
        },
        filters: {
            getFee: function (id, fees) {
//                console.log(id, fees)
                for(let i = 0, len = fees.length; i < len; i++) {
                    if(id == fees[i].id) {
//                        console.log((fees[i].fee / 100))
//                        console.log((fees[i].fee / 100).toFixed(2))
                        var value = fees[i].fee / 100;
                        var arr = String(value).toString().split(".");
                        if(arr.length == 1) {
                            return value;
                        } else {
                            return value.toFixed(2);
                        }

                    }
                }
                return 0;
            },
            feeFilter: function (val) {
                var value = val / 100;
                var arr = String(value).toString().split(".");
                if(arr.length == 1) {
                    return value;
                } else {
                    return value.toFixed(2);
                }
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
