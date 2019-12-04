<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify layer-add-bus">
        <div class="layui-layer-title">{{title}}【计费单：{{bill.bill_name}}】 [ 开始日期：{{bill.start_date}}  结束日期：{{bill.end_date}} ]</div>
        <div class="layui-layer-content pl-10 pr-10">
            <div class="title">
                <img src="../assets/images/icon-room.png" height="atuo" width="32" alt="" class="mr-10" style="vertical-align:text-bottom">
                <span class="mr-10 f-20 roomNo">{{data.bill.room_vo.room_no}}房</span>
                <span class="mr-10">{{data.bill.room_vo.building_vo.building_name}}</span>
            </div>
            <form id="J-layer-form" class="clearfix dormitorybills">
                <div class="mt-10">
                    <img src="../assets/images/icon-electricity.png" height="20" width="13" alt="">
                    <span>电：</span>
                </div>
                <table class="table table-border table-bg table-striped bor-l bor-r mt-10">
                    <thead class="text-c">
                        <tr>
                            <th width="33.33%">上次电量(度)</th>
                            <th width="33.33%">本次电量(度)</th>
                            <th width="33.33%">电费(元)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="text-c">
                            <td class="last" rel-last="{{data.bill.last_electricity_degrees?data.bill.last_electricity_degrees:0}}">
                                <!--{{data.bill.last_electricity_degrees?data.bill.last_electricity_degrees:0}}-->
                                <div class="relative" v-if="data.bill.status==10">
                                    <input id="electricityDegreesInput_last" v-model="electricityDegreesInput_last" type="text" class="input-text w-110" value="{{data.bill.last_electricity_degrees ? data.bill.last_electricity_degrees : 0}}" placeholder="输入上次电量" name="electricity_degrees_last">
                                </div>
                                <span v-if="data.bill.status==20">{{data.bill.last_electricity_degrees ? data.bill.last_electricity_degrees : 0}}</span>
                            </td>
                            <td>
                                <div class="relative" v-if="data.bill.status==10">
                                    <input id="electricityDegreesInput" v-model="electricityDegreesInput" type="text" class="input-text w-110" value="" placeholder="输入本次电量" name="electricity_degrees">
                                </div>
                                <span v-if="data.bill.status==20">{{data.bill.electricity_degrees}}</span>
                            </td>
                            <td>
                                <span v-if="data.bill.status==10">
                                    {{data.water_ele_price.electricity_price | getPrice 'ele'}}
                                </span>
                                <span v-if="data.bill.status==20">{{data.bill.electricity_pay_amount/100 | getFee}}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="mt-10">
                    <img src="../assets/images/icon-water.png" height="20" width="14" alt="">
                    <span>水：</span>
                </div>
                <table class="table table-border table-bg table-striped bor-l bor-r mt-10">
                    <thead class="text-c">
                        <tr>
                            <th width="33.33%">上次水量(m³)</th>
                            <th width="33.33%">本次水量(m³)</th>
                            <th width="33.33%">水费(元)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="text-c">
                            <td class="last" rel-last="{{data.bill.last_water_degrees?data.bill.last_water_degrees:0}}">
                                <!--{{data.bill.last_water_degrees?data.bill.last_water_degrees:0}}-->
                                <div class="relative" v-if="data.bill.status==10">
                                    <input id="waterDegreesInput_last" v-model="waterDegreesInput_last" type="text" class="input-text w-110" value="{{data.bill.last_water_degrees ? data.bill.last_water_degrees : 0}}" placeholder="输入上次水量" name="water_degrees_last">
                                </div>
                                <span v-if="data.bill.status==20">{{data.bill.last_water_degrees ? data.bill.last_water_degrees : 0}}</span>
                            </td>
                            <td>
                                <div class="relative" v-if="data.bill.status==10">
                                    <input id="waterDegreesInput" v-model="waterDegreesInput" type="text" class="input-text w-110" value="" placeholder="输入本次水量" name="water_degrees">
                                </div>
                                <span v-if="data.bill.status==20">{{data.bill.water_degrees}}</span>
                            </td>
                            <td>
                                <span v-if="data.bill.status==10">
                                    {{data.water_ele_price.water_price | getPrice 'water'}}
                                </span>
                                <span v-if="data.bill.status==20">
                                    {{data.bill.water_pay_amount / 100 | getFee}}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="layui-layer-btn relative mt-10" v-if="data.bill.status==10">
                    <a class="layui-layer-btn0" v-if="type!='check'" v-on:click="save">确认</a>
                </div>
            </form>
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

            base.verticalCenter('.layui-modify');

            this.electricityDegreesInput = getData.bill.electricity_degrees?getData.bill.electricity_degrees:'';
            this.waterDegreesInput = getData.bill.water_degrees?getData.bill.water_degrees:'';
            this.electricityDegreesInput_last = getData.bill.last_electricity_degrees?getData.bill.last_electricity_degrees:'';
            this.waterDegreesInput_last = getData.bill.last_water_degrees?getData.bill.last_water_degrees:'';

//            console.log(getData);
//            console.log(getData.water_ele_price.water_price*(this.waterDegreesInput_last - this.waterDegreesInput));
            $.validator.addMethod('floatNum',function(value, element){
                var reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$|^0$/;
                return this.optional(element) || reg.test( value );
            },'请输入正确的用量');
//            $.validator.addMethod('gelast',function(value, element){
//                var last = $(element).parent().parent().siblings('.last').attr('rel-last');
//                return this.optional(element) || value*1 >= last*1;
//            },'必须大于等于上次用量');

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
//                    if (that.electricityDegreesInput < that.electricityDegreesInput_last) {
                    if ($("#electricityDegreesInput").val() * 1 < $("#electricityDegreesInput_last").val() * 1) {
                        layer.msg("本次电费不能小于上次电费", {icon: 2, time: 1500});
                        return;
                    }
//                    if(that.waterDegreesInput < that.waterDegreesInput_last) {
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
                        url: `${base.gAjaxUrl.dormitorybills}${getData.bill.id}/`,
                        contentType: 'application/json',
                        type: 'PATCH',
                        data: JSON.stringify(ajaxData),
                    })
                    .always(function(data) {
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
        props: ['title','type','data', 'bill'],
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
                        return (p * (this.electricityDegreesInput - this.electricityDegreesInput_last)).toFixed(2).replace(".00", "") || '--';
                    } else {
                        return '--';
                    }
                } else {
                    if(this.waterDegreesInput >= this.waterDegreesInput_last) {
                        return (p * (this.waterDegreesInput - this.waterDegreesInput_last)).toFixed(2).replace(".00", "") || '--';
                    } else {
                        return '--';
                    }
                }
            }
        }
    }
</script>