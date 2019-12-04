<template>
    <form id="J-layer-form" class="clearfix dormitorybills">
        <table class="table table-border table-bg table-striped bor-l bor-r mt-10">
            <thead class="text-c">
            <tr>
                <th width="160">费用类别</th>
                <th width="160">上次度数</th>
                <th width="160">本次度数</th>
                <th width="120">费用(元)</th>
            </tr>
            </thead>
            <tbody>
            <tr class="text-c">
                <td>
                    <img src="../assets/images/icon-electricity.png" height="20" width="13" alt="">
                    <span class="ml-10">电费(度)：</span>
                </td>
                <td >
                    <div class="relative" v-if="data.status==10">
                        <input id="electricityDegreesInput_last" v-model="electricityDegreesInput_last" type="text" class="input-text w-110" placeholder="输入上次电量" name="electricity_degrees_last">
                    </div>
                    <span v-if="data.status==20">{{data.last_electricity_degrees || 0}}</span>
                </td>
                <td>
                    <div class="relative" v-if="data.status==10">
                        <input id="electricityDegreesInput" v-model="electricityDegreesInput" type="text" class="input-text w-110" value="" placeholder="输入本次电量" name="electricity_degrees">
                    </div>
                    <span v-if="data.status==20">{{data.electricity_degrees}}</span>
                </td>
                <td>
                    <span v-if="data.status==10">{{data.room_vo.building_vo.water_ele_price.electricity_price | getPrice 'ele'}}</span>
                    <span v-if="data.status==20">{{data.electricity_pay_amount | getFee}}</span>
                </td>
            </tr>
            <tr class="text-c">
                <td>
                    <img src="../assets/images/icon-water.png" height="20" width="14" alt="">
                    <span class="ml-10">水费(m³)：</span>
                </td>
                <td class="last">
                    <div class="relative" v-if="data.status==10">
                        <input id="waterDegreesInput_last" v-model="waterDegreesInput_last" type="text" class="input-text w-110" placeholder="输入上次水量" name="water_degrees_last">
                    </div>
                    <span v-if="data.status==20">{{data.last_water_degrees || 0}}</span>
                </td>
                <td>
                    <div class="relative" v-if="data.status==10">
                        <input id="waterDegreesInput" v-model="waterDegreesInput" type="text" class="input-text w-110" value="" placeholder="输入本次水量" name="water_degrees">
                    </div>
                    <span v-if="data.status==20">{{data.water_degrees}}</span>
                </td>
                <td>
                    <span v-if="data.status==10">
                        {{data.room_vo.building_vo.water_ele_price.water_price | getPrice 'water'}}
                    </span>
                    <span v-if="data.status==20">
                        {{data.water_pay_amount | getFee}}
                    </span>
                </td>
            </tr>
            </tbody>
        </table>
    </form>
    <div class="clearfix mt-10">
        <a :class="{'disabled': type == 'check', 'btn-default': type == 'check', 'btn-primary': type == 'set'}" class="btn radius fs-12 f-l" v-on:click="save">设置水电费用</a>
    </div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>

<style lang="less">
    #J-layer-form.dormitorybills label.error{
        right:-30px;
    }
    .layui-modify .layui-layer-btn.relative{
        position: relative;
        text-align: center;
    }
</style>

<script>
    import * as base from '../assets/js/base.js';
    export default{
        ready () {
            let that = this;
            let getData = this.data;
            console.log("getData: ");
            console.log(getData);

            base.verticalCenter('.layui-modify');

            this.electricityDegreesInput = getData.electricity_degrees;
            this.waterDegreesInput = getData.water_degrees;
            this.electricityDegreesInput_last = getData.last_electricity_degrees;
            this.waterDegreesInput_last = getData.last_water_degrees;

            $.validator.addMethod('floatNum',function(value, element){
                var reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$|^0$/;
                return this.optional(element) || reg.test( value );
            },'请输入正确的用量');

            //验证
            $('#J-layer-form').validate({
                rules: {
                    electricity_degrees: {
                        required: true,
                        floatNum: true,
                    },
                    electricity_degrees_last: {
                        required: true,
                        floatNum: true,
                    },
                    water_degrees:{
                        required: true,
                        floatNum: true,
                    },
                    water_degrees_last:{
                        required: true,
                        floatNum: true,
                    }
                },
                submitHandler:function() {
                    console.log(that.electricityDegreesInput < that.electricityDegreesInput_last);
                    console.log($("#electricityDegreesInput").val() * 1 < $("#electricityDegreesInput_last").val() * 1);
                    if ($("#electricityDegreesInput").val() * 1 < $("#electricityDegreesInput_last").val() * 1) {
                        layer.msg("本次电费不能小于上次电费", {icon: 2, time: 1500});
                        return;
                    }
                    if ($("#waterDegreesInput").val() * 1 < $("#waterDegreesInput_last").val() * 1) {
                        layer.msg("本次水费不能小于上次水费", {icon: 2, time: 1500});
                        return;
                    }
                    that.itemsLoading = true;
                    let ajaxData = {
                        electricity_degrees: that.electricityDegreesInput,
                        water_degrees: that.waterDegreesInput,
                        last_electricity_degrees: that.electricityDegreesInput_last,
                        last_water_degrees: that.waterDegreesInput_last,
                    };
                    $.ajax({
                        url: `${base.gAjaxUrl.dormitorybills}${getData.id}/`,
                        contentType: 'application/json',
                        type: 'PATCH',
                        data: JSON.stringify(ajaxData),
                    }).always(function(data) {
                        that.itemsLoading = false;
                        base.ajaxCallback(data,function(){
                            layer.msg('提交成功',{icon:1,time:1000});
                            that.$dispatch('dialog-save');
                        });
                    });
                }
            });
        },
        //动态传值
        props: ['title','type','data'],
        data:function(){
            return {
                electricityDegreesInput: '',
                electricityDegreesInput_last: '',
                waterDegreesInput: '',
                waterDegreesInput_last: '',
                itemsLoading: false,
            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            save:function(){
                $('#J-layer-form').submit();
            }
        },
        filters: {
            getFee: function (num) {
                if(num == 0) return "0";
                return (num / 100).toFixed(2).replace(".00", "");
            },
            getPrice: function (p, str) {
                if(str === 'ele') {
                    if(this.electricityDegreesInput >= this.electricityDegreesInput_last) {
                        let res = (p * (this.electricityDegreesInput - this.electricityDegreesInput_last)).toFixed(2).replace(".00", "");
                        return res > 0 ? res : '--';
                    } else {
                        return '--';
                    }
                } else {
                    if(this.waterDegreesInput >= this.waterDegreesInput_last) {
                        let res = (p * (this.waterDegreesInput - this.waterDegreesInput_last)).toFixed(2).replace(".00", "");
                        return res > 0 ? res : '--';
                    } else {
                        return '--';
                    }
                }
            }
        }
    }
</script>