<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify layui-map">
        <div class="layui-layer-title layui-layer-title2  layui-layer-title-three">
            设置费用
        </div>

        <div class="layui-layer-content cl">
            <div class="f-l content-box cl">
                <div class="l m-info ml-10 title-box">
                    <div class="l item">司机：
                        <span>{{order.staff_vo.real_name}}</span></div>
                    <!--<div class="l item">乘客：{{mapInfo.staff_vo.real_name}}</div>-->
                    <div class="l item">起点/终点：{{order.source_name}}/{{order.destination_name}}</div>
                    <div class="l item">出发时间：{{order.ride_time}}</div>
                    <div class="l item">结束时间：{{order.end_time}}</div>
                    <a v-if="!modifying" href="javascript:;" class="btn btn-primary radius" @click="add()">添加费用</a>
                </div>
                <div class="mt-10 cost-table-box f-l">
                    <table class="table table-border table-bg table-striped bor-l bor-r ml-10 ">
                        <thead class="text-c">
                        <tr>
                            <th>费用类型</th>
                            <th width="50">金额</th>
                            <th width="100">发生日期</th>
                            <th width="100">记账日期</th>
                            <th width="50">用油类型</th>
                            <th>加油量</th>
                            <th>加油卡号</th>
                            <th width="80">操作员</th>
                            <th width="80">备注</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr class="text-c" v-for="data in items" :id="'tr' + $index">
                            <td>
                                <select :disabled="$index != currentIndex" :value="data.feetype" class="select-box" @change="changeCostType($index)" :id="'select' + $index">
                                    <option v-for="type in costTypes" :value="type.id">{{type.name}}</option>
                                </select>
                            </td>
                            <td>
                                <input :value="data.money" type="number" autocomplete="off" :id="'price' + $index" :disabled="$index !== currentIndex" class="input-text fee-text">
                            </td>
                            <td>
                                <input :value="data.fs_date" autocomplete="off" :id="'create'+$index" type="text" :disabled="$index !== currentIndex" @focus="focusStart($index)" class="input-text">
                            </td>
                            <td>
                                <input :value="data.jz_date" autocomplete="off" :id="'remember'+$index" type="text" :disabled="$index !== currentIndex" @focus="focusEnd($index)" class="input-text">
                            </td>
                            <td>
                                <select :disabled="$index != currentIndex"
                                        :value="data.extra ? data.extra.oil_type : ''"
                                        class="select-box oil-box"
                                        name="oil"
                                        @change="changeCostType($index)"
                                        :id="'oilType' + $index">
                                    <option v-for="type in oilTypes" :value="type.id">{{type}}</option>
                                </select>
                            </td>
                            <td>
                                <input :value="data.extra ? data.extra.oil_num : ''" autocomplete="off" :id="`oilValue` + $index" type="text" :disabled="$index !== currentIndex" name="oil" class="input-text">
                            </td>
                            <td>
                                <input :value="data.extra ? data.extra.oil_cardnumber : ''" autocomplete="off" :id="`oilCarNumber` + $index" type="text" :disabled="$index !== currentIndex" name="oil" class="input-text">
                            </td>
                            <td>
                                {{data.operator}}
                            </td>

                            <td>
                                <input :value="data.remark" :id="`remark` + $index" type="text" :disabled="$index !== currentIndex" class="input-text">
                            </td>
                            <td>
                                <a href="javascript:;" v-if="!modifying" class="btn btn-primary radius" @click="modifyData($index)">编辑</a>
                                <a v-if="currentIndex == $index && modifying" href="javascript:;" class="btn btn-primary radius" @click="complete($index,data)">完成</a>
                                <a v-if="currentIndex == $index && modifying" href="javascript:;" class="btn btn-primary radius mt-10" @click="cancel()">取消</a>
                                <a v-if="!modifying" href="javascript:;" class="btn btn-danger radius mt-10" @click="delete1(data)">删除</a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
        </span>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .fee-text{
        width: 50px !important;
    }
    .select-box{
        width:100px;
    }
    .oil-box{
        width:50px;
    }
    .content-box{
        width:978px;
        margin-left: 5px;
    }
    .cost-table-box{
        width:100%;
    }
    .layui-modify .layui-layer-shade{
        z-index:102;
    }
    .layui-modify .layui-modify{
        z-index:103;
    }
    .title-box{
        width:100%;
        box-sizing: border-box;
    }
    .layui-layer{
        width:1000px !important;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import moment from "moment";
    export default{
        ready () {
            base.verticalCenter(".layui-layer");

            // this.items = this.order.fee_list;
            this.getCostTypelist();
        },
        props: ['order'],
        data:function(){
            return {
                noData:false,
                mapInfo:{},
                isShowMap:true,
                map:"",
                items:[],
                driverList:[],
                costTypes:[],
                currentIndex:null,
                modifying:false,
                tripData:{},
                focusIsStart:false,
                currentDateIndex:"",
                oilTypes: ['-10#', '0#', '92#', '95#', '98#']
            }
        },
        filters:{
            toInt: function(e){
                return parseInt(e);
            },
            mToKm: function (num) {
                return (num / 1000 || 0).toFixed(2);
            }

        },
        methods: {
            focusStart:function(i){
                this.focusIsStart = true;
                this.currentDateIndex = i;
            },
            focusEnd:function(i){
                this.focusIsStart = false;
                this.currentDateIndex = i;
            },
            close:function(){
                this.$dispatch('dialog-close');
            },
            getDetails:function(){
                $.showLoading();
                $.ajax({
                    url: `${base.gAjaxUrl.privateCarAddCost}`,
                    type: 'GET',
                    data:{
                        order_id:this.order.id,
                    }
                }).always((data)=>{
                    $.hideLoading();
                    base.ajaxCallback(data,()=>{
                        this.items = data;
                    });
                })
            },
            initDatePrick:function(id){
                let that = this;
                new Kalendae.Input(id, {
                    months: 1,
                    clickHide:true,
                    subscribe:{
                        "date-clicked":function(data){
                            let startTime = $(`#create${that.currentDateIndex}`).val();
                            let remberTime = $(`#remember${that.currentDateIndex}`).val();
                            let selectDate = data._i;
                            if(that.focusIsStart){
                                if(moment(selectDate).isAfter(remberTime)){
                                    layer.msg("记账日期不能早于发生日期",{icon:2,time:2500})
                                    return false;
                                }
                            }else{
                                if(moment(selectDate).isBefore(startTime)){
                                    layer.msg("记账日期不能早于发生日期",{icon:2,time:2500})
                                    return false;;
                                }
                            }
                        },
                        "change":function(data){

                        }
                    }
                });
            },
            getCostTypelist:function(){
                $.showLoading();
                $.ajax({
                    url:base.gAjaxUrl.privateCarCostTypes,
                    type:"GET",
                }).always((data)=>{
                    $.hideLoading();
                    base.ajaxCallback(data,()=>{
                        this.costTypes = data;
                        this.getDetails()
                    })
                })
            },
            changeCostType:function(i){
                let typeId = $(`#select${i}`).val();
                let type = "";
                for (let item of this.costTypes){
                    if(item.id == typeId){
                        type = item;
                        break;
                    }
                }
//                $('input[name="oil"]').attr("disabled",true);
                let oilType = $(`#tr${i} #oilType${i}`);
                let oilValue = $(`#tr${i} #oilValue${i}`);
                // let mileage = $(`#tr${i} #mileage${i}`);
                let oilCarNumber = $(`#tr${i} #oilCarNumber${i}`);
                if(type.name == "油费"){
                    oilType.attr("disabled",false);
                    oilValue.attr("disabled",false);
                    // mileage.attr("disabled",false);
                    oilCarNumber.attr("disabled",false);
                }else{
                    oilType.attr("disabled", true).val("");
                    oilValue.attr("disabled", true).val("");
                    // mileage.attr("disabled", true).val("");
                    oilCarNumber.attr("disabled", true).val("");
                }
            },
            modifyData:function(i){
                this.modifying = true;
                this.currentIndex = i;
                this.$nextTick(()=>{
                    this.initDatePrick(`create${this.currentIndex}`);
                    this.initDatePrick(`remember${this.currentIndex}`);
                    this.changeCostType(i);
                })
            },
            complete:function(index,modifyData){
                let data = {
                    extra:{

                    }
                };
                let typeId = $(`#select${index}`).val();
                if(!typeId){
                    layer.msg("请选择费用类型",{icon:2,time:2000});
                    return;
                }

                let price = parseFloat($(`#price${index}`).val());
                if(!price || price < 0){
                    layer.msg("请输入正确的金额",{icon:2,time:2000});
                    return;
                }

                if(!/^\d+\.{0,1}\d{0,2}$/.test(price)){
                    layer.msg("金额最多输入两位数",{icon:2,time:2000});
                    return;
                }

                let startDate = $(`#create${index}`).val();
                if(!startDate){
                    layer.msg("请选择发生时间",{icon:2,time:2000});
                    return;
                }
                let rememberDate = $(`#remember${index}`).val();
                if(!rememberDate){
                    layer.msg("请选择记账日期",{icon:2,time:2000});
                    return;
                }

                if (!moment().isAfter(startDate) || !moment().isAfter(rememberDate)) {
                    layer.msg("发生日期与记账日期都不能选今天之后", {icon: 2, time: 2500});
                    return;
                }

                if (moment(startDate).isAfter(rememberDate)) {
                    layer.msg("记账日期不能早于发生日期", {icon: 2, time: 2500});
                    return;
                }




                if(!$(`#oilType${index}`).attr("disabled")){

                    let oilType = $(`#oilType${index}`).val();
                    if(!oilType){
                        layer.msg("请输入油的类型",{icon:2,time:2000});
                        return;
                    }
                    // let mileage = $(`#mileage${index}`).val();
                    // if(!mileage || !(mileage > 0)){
                    //     layer.msg("请输入正确的公里数",{icon:2,time:2000});
                    //     return;
                    // }
                    let value = $(`#oilValue${index}`).val();
                    if(!value || !(value > 0)){
                        layer.msg("请输入正确的加油量",{icon:2,time:2000});
                        return;
                    }
                    let number = $(`#oilCarNumber${index}`).val();
                    // if(!number){
                    //     layer.msg("请输入油的类型",{icon:2,time:2000});
                    //     return;
                    // }
                    data.extra = {
                        oil_type:oilType,
                        oil_num:value,
                        // mileage:mileage,
                        oil_cardnumber:number,
                    };
                }
                data.remark = $(`#remark${index}`).val();
                data.feetype = typeId;
                data.money = +(price);
                data.fs_date = startDate;
                data.jz_date = rememberDate;
                data.order = this.order.id;
                $.showLoading();
                // 判断是否为新增.
                if(modifyData.id){
                    $.ajax({
                        url:`${base.gAjaxUrl.privateCarAddCost}${modifyData.id}/`,
                        type:"PATCH",
                        contentType:"application/json",
                        data:JSON.stringify(data),
                    }).always((data)=>{
                        $.hideLoading();
                        base.ajaxCallback(data,()=>{
                            this.getDetails();
                            layer.msg("修改成功",{icon:1,time:1500});
                        })
                    })
                }else{
                    $.ajax({
                        url:`${base.gAjaxUrl.privateCarAddCost}`,
                        type:"POST",
                        contentType:"application/json",
                        data:JSON.stringify(data)
                    }).always((data)=>{
                        $.hideLoading();
                        this.getDetails();
                        base.ajaxCallback(data,()=>{
                            layer.msg("保存成功",{icon:1,time:1500});
                        })
                    })
                }
                this.modifying = false;
                this.currentIndex = null;
            },
            cancel:function(){
                this.modifying = false;
                this.currentIndex = null;
                this.getDetails();
            },
            delete1:function(data){
                layer.confirm(`确认删除这条费用吗?`,()=>{
                    $.showLoading();
                    $.ajax({
                        url:`${base.gAjaxUrl.privateCarAddCost}${data.id}/`,
                        type:"DELETE",
                    }).always((data)=>{
                        $.hideLoading();
                        if(data) {
                            base.ajaxCallback(data)
                        } else {
                            layer.msg("删除成功",{icon:1,time:1500});
                            this.getDetails()
                        }
                    })
                    layer.closeAll();
                })
                this.currentIndex = null;

            },
            add:function(){
                this.items.push({
                });
                this.modifying = true;
                this.currentIndex = this.items.length - 1;
                this.$nextTick(()=>{
                    this.initDatePrick(`create${this.currentIndex}`);
                    this.initDatePrick(`remember${this.currentIndex}`);
                    this.changeCostType(this.currentIndex);
                })
            }
        }
    }
</script>

