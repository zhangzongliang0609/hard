<template>
    <div class="layui-layer-shade inner"></div>
    <div class="layui-layer layui-anim layui-layer-page layui-modify room-inner">
        <div class="layui-layer-title">费率修改 【姓名：{{member.real_name}}】【计费单：{{bill.bill_name}}】</div>
        <div class="layui-layer-content" v-if="memberFeePointInfo.length && fees.length">
            <form id="J-layer-form-room-inner" class="form form-horizontal layui-layer-wrap mPersonalRateForm" >
                <div class="row cl" track-by="$index" v-for="fee in fees">
                    <div class="f-l col-4 col-offset-1 tr rateName lh-30">
                        <span class="c-red">*</span>
                        <span>{{fee.feetype_name}}</span>
                    </div>
                    <div class="f-l col-3 pl-20">
                        <input :disabled="type == 'check'" type="number" class="ratesInput" v-bind:class="'cmr' + fee.feetype_id" v-bind:value="fee.feetype_id | getPoint memberFeePointInfo" placeholder="" name="{{'nmr' + fee.feetype_id}}">
                    </div>
                    <div class="f-l col-3 tl rateNumber lh-30">
                        <span>%</span>
                    </div>
                </div>
            </form>
        </div>
        <div v-else class="no-data text-c">当前计费单无费率信息</div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
        </span>
        <div v-if="type == 'set'" id="save" class="layui-layer-btn" v-on:click="save" v-show="memberFeePointInfo.length"><a class="layui-layer-btn0">保存</a></div>
    </div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>
<style lang="less" scoped>
    .layui-layer-shade.inner {
        z-index: 200;
    }
    .room-inner {
        z-index: 201;
    }
    .layui-modify {
        width: 500px;
    }
    .rateName {
        box-sizing: border-box;
        padding-right: 10px !important;
    }
    .rateNumber {
        box-sizing: border-box;
        padding-left: 10px !important;
    }
    .ratesInput {
        width: 100%;
        font-size: 14px;
        height: 31px;
        line-height: 1.42857;
        padding: 4px;
        box-sizing: border-box;
        border: solid 1px #ddd;
    }
    .tl {
        text-align: left;
    }
    .tr {
        text-align: right;
    }
    .no-data {
        line-height: 80px;
    }
</style>
<style>
    .mPersonalRateForm label.error {
        right: 10px !important;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    export default{
        ready () {

            let that = this;
            let ajaxUrl = base.gAjaxUrl.waterInfo;
            let ajaxType = 'POST';
            let getData = this.data;

            base.verticalCenter('.layui-modify.room-inner');

            // 两位小数验证
            $.validator.addMethod("plus_number", function(value, element, param) {
                return value * 1 >= 0 && /^\d+$/.test(value);
            }, $.validator.format("请输非负整数"));
            this.getMember();
        },
        props: ['member', 'bill', 'fees', 'type'],
        data:function(){
            return {
                itemsLoading: false,
                memberFeePointInfo: [],
                isComponentDestroy: false,
                isFormInit: false,
            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            save:function(){
                if(this.isFormInit) {
                    $('#J-layer-form-room-inner').submit();
                }
            },
            getMember: function () {
                this.itemsLoading = true;
                $.ajax({
                    url: `${base.gAjaxUrl.bills}${this.bill.id}/staff_feepoint/`,
                    type: 'GET',
                    data: {
                        staff: this.member.staff_id,
                    }
                }).always((data)=>{
                    console.log(data);
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
                        this.memberFeePointInfo = data || [];
                        this.$nextTick(function () {
                            if(!this.isComponentDestroy) this.initForm();
                        });
                    });
                });
            },
            initForm: function () {
                // 动态添加 表单names属性的验证规则
                var fees = this.fees;
                var rules = {};
                for(let i = 0, len = fees.length; i < len; i++) {
                    rules['nmr' + fees[i].feetype_id] = {
                        plus_number: true,
                    }
                }
                var that = this;

                //验证
                $('#J-layer-form-room-inner').validate({
                    rules: rules,
                    submitHandler:function() {
                        that.itemsLoading = true;
                        var obj = {
                            staff: that.member.staff_id,
                            fee_point_items: [],
                        };
                        for(let i = 0, len = fees.length; i < len; i++) {
                            let id = fees[i].feetype_id;
                            obj.fee_point_items.push({
                                feetype: id,
                                point: $(".cmr" + id).val()
                            });
                        }
                        console.log(obj);
                        $.ajax({
                            url: `${base.gAjaxUrl.bills}${that.bill.id}/modify_staff_feepoint/`,
                            type: 'POST',
                            contentType: "application/json",
                            data: JSON.stringify(obj)
                        }).always((data)=>{
                            console.log(data);
                            that.itemsLoading = false;
                            base.ajaxCallback(data,()=>{
                                that.$dispatch("dialog-save");
                            });
                        });
                    }
                });
                this.isFormInit = true;
            }
        },
        filters: {
            getPoint: function (id, fees) {
                for(let i = 0, len = fees.length; i < len; i++) {
                    if(id == fees[i].feetype_id) {
                        return fees[i].point;
                    }
                }
                return 0;
            },
        },
        beforeDestroy: function () {
            this.isComponentDestroy = true;
        }
    }
</script>
