<template>
<div class="m_win">
    <div class="layui-layer-title">设置全体费用【计费单：{{bill.bill_name}}】</div>
    <div class="layui-layer-content" v-if="fees.length">
        <div class="m_content">
            <form id="J-layer-form" class="clearfix allPrice">
                <div class="commonInput f-l mt-20 clearfix mr-20 relative" track-by="$index" v-for="fee in fees">
                    <div class="f-l tr mr-5">{{fee.name}}</div>
                    <input type="text" class="input-text w-100 f-l ml-5" :class="'csa' + fee.id" value="" placeholder="" name="{{'nsa' + fee.id}}">
                    <span class="f-l ml-5">元</span>
                </div>
            </form>
            <div class="clearfix mt-30">
                <a class="btn btn-primary radius fs-12 f-l" v-if="fees.length" v-on:click="setAllPrice">应用到所有楼</a>
            </div>
            <div class="c-red f-14 lh-20 mt-10">1. 设定全体费用会覆盖之前所有设定过的费用</div>
            <div class="c-red f-14 lh-20">2. 只有费用类别开启，并应用到楼层设置才能生效</div>
            <div class="c-red f-14 lh-20">3. 费用支持两位以内小数或者整数输入</div>
            <div v-show="!noData" class="build-form-container mt-10">
                <form id="k-layer-form" class="clearfix roomPrice">
                    <table class="buildingPrice table table-border table-bordered table-bg table-sort">
                        <thead class="text-c">
                        <tr>
                            <th width="60">楼</th>
                            <th width="100" class="costName" track-by="$index" v-for="fee in fees">{{fee.name}}(元)</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr class="text-c" v-for="(index, item) in buildings" track-by="$index">
                            <td>{{item.building_name}}</td>
                            <td v-for="fee in fees">
                                <div class="commonInput relative" v-if="fee.id | checkId item.feetypes">
                                    <input type="text" class="input-text tc" :class="'csai' + fee.id + item.id + ' csa' + fee.id" value="" placeholder="" name="{{'nsai' + fee.id + index}}">
                                </div>
                                <span v-else>--</span>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </form>
            </div>
            <div class="no-data text-c mt-50" v-if="noData">无宿舍楼信息</div>
            <div class="layui-layer-btn mt-10 relative" v-if="!noData">
                <a class="layui-layer-btn0" v-on:click="savePrices">确认</a>
            </div>
        </div>
    </div>
    <span class="c-red lh-42 ml-30 fs-18" v-else>无固定费用类别</span>
    <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
</div>
<div class="m-loading" v-if="itemsLoading">
    <div class="cube1"></div>
    <div class="cube2"></div>
</div>
<div class="layui-layer-shade"></div>
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
        .layui-layer-content {
            .m_content {
                padding: 0 20px;
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
    }
    .tr {
        text-align: right;
    }
    .tc {
        text-align: center;
    }
</style>
<style>
    #J-layer-form.allPrice label.error{
        right: 28px;
        top: 30px;
    }
    #k-layer-form.roomPrice .buildingPrice label.error{
        right: -4px;
        top: 5px;
    }
</style>
<script type="text/ecmascript-6">
import * as base from '../assets/js/base.js';

    export default{
        ready () {

            $.validator.addMethod('floatNum',function(value, element){
                var reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$|^0$/; // 包含对 0 的检测
                return this.optional(element) || reg.test( value );
            },'格式错误');

            this.getFeeTypes(() => {
                this.getBuildingsList();
            });
        },
//        props: ['fees', "bill"],
        props: ["bill"], // 从服务器获取fees
        data:function(){
            return {
                noData:true,
                itemsLoading:false,
                buildings: [],
                electricityPriceInput:'',
                waterPriceInput: '',
                prices: [],
                flag: false,
                isComponentDestroy: false, // 当前组件是否已经被销毁
                isFormInit: false,
                isJFormInit: false,
                fees: [],
            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            setAllPrice:function(){
                if(this.isJFormInit && this.isFormInit) {
                    $('#J-layer-form').submit();
                }
            },
            savePrices:function(){
                if(this.isFormInit) {
                    layer.confirm("确定设置费用？", function (i) {
                        $('#k-layer-form').submit();
                        layer.close(i);
                    });
                }
            },
            //获取宿舍楼列表
            getBuildingsList:function(callback=function(){}){
                this.itemsLoading = true;
                $.ajax({
                    url: base.gAjaxUrl.buildings,
                    type: 'GET',
                    data: {
                        page:1,
                        page_size: 999999,
                    }
                }).always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
                        let resultData = data.results;
                        if(resultData && resultData.length){
                            this.buildings = resultData;
                            this.noData = false;
                            this.$nextTick(() => {
                                if(this.isComponentDestroy) return;
                                this.isFormInit = false;
                                this.initKForm();
                            });
                        }else{
                            this.noData = true;
                        }
                    });
                })
            },
            initKForm: function () {
//                console.log("inited: ");
                var rulesK = {};
                var that = this;
                $.each(that.buildings, function (i) {
                    $.each(that.fees, function (j, item) {
                        rulesK["nsai" + item.id + i] = {
                            floatNum: true,
                        }
                    })
                });
//                console.log(rulesK);
                //验证
                $('#k-layer-form').validate({
                    rules: rulesK,
                    submitHandler:function() {
                        that.itemsLoading = true;
                        let valArr = [];
                        $.each(that.buildings, function (i, item) {
//                            console.log("fdsafas");
                            if(item.feetypes.length === 0) return true;
                            let valsObj = {
                                building: item.id,
                                fee_items: []
                            };
                            $.each(that.fees, function (j, fee) {
                                if(that.checkFeeId(fee.id,  item.feetypes)) {
                                    let feeVal = $(".roomPrice .csai" + fee.id + item.id).val();// 传给服务器的单位是分不是元
                                    if(feeVal == "") return true;
                                    feeVal *= 100;
                                    valsObj.fee_items.push({
                                        feetype: fee.id,
                                        fee: feeVal,
                                        feetype_name: fee.name
                                    });
                                }
                            });
                            if(valsObj.fee_items.length) valArr.push(valsObj);
                        });
//                        console.log("valArr: ");
//                        console.log(valArr);
                        $.ajax({
                            url: `${base.gAjaxUrl.bills}${that.bill.id}/bulk_set_fixedfee/`,
                            type: 'POST',
                            contentType: "application/json",
                            data: JSON.stringify({data: valArr}),
                        }).always((data)=> {
                            that.itemsLoading = false;
                            base.ajaxCallback(data, ()=> {
                                layer.msg("设置成功", {icon: 1, time: 1500});
                                that.$dispatch("dialog-save");
                            })
                        });
                    }
                });
                this.isFormInit = true;
            },
            checkFeeId: function (id, fees) {
                for(let i = 0, len = fees.length; i < len; i++) {
                    if(fees[i].id === id) {
                        return true;
                    }
                }
                return false;
            },
            getFeeTypes: function (callback=()=>{}) {
                let that = this;
                this.itemsLoading = true;
                $.ajax({
                    url: base.gAjaxUrl.feeTypeList,
                    type: 'GET',
                    data: {type: 1}
                }).always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
                        this.fees = data || [];
                        this.$nextTick(function (){
                            if(that.isComponentDestroy) return;
                            this.isJFormInit = false;
                            this.initForm();
                        });
                        callback();
                    });
                })
            },
            initForm: function () {
                var that = this;
                var fees = this.fees;
                if(!fees.length) return;
                var rulesJ = {};
                for(let i = 0, len = this.fees.length; i < len; i++) {
                    rulesJ["nsa" + this.fees[i].id] = {
                        floatNum: true,
                    }
                }
                //验证表单头部
                $('#J-layer-form').validate({
                    rules: rulesJ,
                    submitHandler:function() {
                        for(let i = 0, len = that.fees.length; i < len; i++) {
                            let val = $(".allPrice .csa" + that.fees[i].id).val();
                            $(".roomPrice .csa" + that.fees[i].id).val(val);
                        }
                    }
                });
                this.isJFormInit = true;
            },
        },
        filters: {
            checkId: function (id, types) {
//                console.log(id);
//                console.log(types);
                for(let i = 0, len = types.length; i < len; i++) {
                    if(types[i].id === id) {
                        return true
                    }
                }
                return false;
            }
        },
        beforeDestroy: function () {
            this.isComponentDestroy = true;
        }
    }
</script>
