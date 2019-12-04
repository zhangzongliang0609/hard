<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify layui-map">
        <div class="layui-layer-title layui-layer-title2  layui-layer-title-three">
            设置费用
        </div>

        <div class="layui-layer-content cl">
            <div class="f-l list-box">
                <h3>司机车辆</h3>
                <div :class="{'selected-item': driver.id == item.id}" class="list-item" v-for="item in driverList" @click="clickDriver(item)">
                    {{item.driver_name}}/{{item.car_no}}
                </div>
            </div>
            <div class="f-l content-box cl">
                <div class="l m-info ml-10 title-box">
                    <div class="l item">乘车人：
                    <span v-for="staff in tripData.use_staffs">{{staff.real_name}}</span></div>
                    <!--<div class="l item">乘客：{{mapInfo.staff_vo.real_name}}</div>-->
                    <div class="l item">起点/终点：{{tripData.source_name}}/{{tripData.destination_name}}</div>
                    <div class="l item">出发时间：{{tripData.admin_ride_time?tripData.admin_ride_time:tripData.ride_time}}</div>
                    <div class="l item">结束时间：{{tripData.admin_end_time?tripData.admin_end_time:tripData.end_time}}</div>
                    <div class="l item">人数：{{tripData.passenger_number}}</div>
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
                            <th>公里数</th>
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
                                <select :disabled="$index != currentIndex" :value="data.feetype_id" class="select-box" @change="changeCostType($index)" :id="'select' + $index">
                                    <option v-for="type in costTypes" :value="type.id">{{type.name}}</option>
                                </select>
                            </td>
                            <td>
                                <input :value="data.fee ? data.fee / 100 : ''" type="number" autocomplete="off" :id="'price' + $index" :disabled="$index !== currentIndex" class="input-text fee-text">
                            </td>
                            <td>
                                <input :value="data.fee_date" autocomplete="off" :id="'create'+$index" type="text" :disabled="$index !== currentIndex" @focus="focusStart($index)" class="input-text">
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
                                <input :value="data.extra ? data.extra.mileage : ''" autocomplete="off" :id="`mileage` + $index" type="text" :disabled="$index !== currentIndex" name="oil" class="input-text">
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
    .list-box{
        border: 1px solid #ddd;
        display: flex;
        width:200px;
        flex-direction: column;
        align-items: center;
        margin-left: 10px;
        .list-item{
            border-radius: 4px;
            width:160px;
            height:30px;
            display: flex;
            justify-content: center;
            align-items: center;
            color:#ffffff;
            background: #a1a1a1;
            font-size: 12px;
            margin-bottom: 10px;
            cursor: pointer;
        }
        .selected-item{
            background: #169bd5;

        }
    }
    .content-box{
        width:978px;
        margin-left: -5px;
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
        width:1200px !important;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../../assets/js/base.js';
    import moment from "moment";
    export default{
        ready () {
            base.verticalCenter(".layui-layer");
            this.driverList = this.data.drivertrip;
            if(!this.driver){
                for (let i = 0; i < this.data.drivertrip.length; i++) {
                    if(this.data.drivertrip[i].status == 50){
                        this.driver = this.data.drivertrip[i];
                        break;
                    }
                }
            }

            this.getCostTypelist();

            this.getTripData();

        },
        props: ['driver','data'],
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
            getTripData:function(){
                $.showLoading();
                $.ajax({
                    url:`${base.gAjaxUrl.officialcarDriverTrip_V2}${this.driver.id}/trip_info/`,
                    type:"GET",
                }).always((data)=>{
                    $.hideLoading();
                    base.ajaxCallback(data,()=>{
                        this.tripData = data;
                    })
                })
            },
            focusStart:function(i){
                this.focusIsStart = true;
                this.currentDateIndex = i;
            },
            focusEnd:function(i){
                this.focusIsStart = false;
                this.currentDateIndex = i;
            },
            close:function(){
                this.$dispatch('dialog-close',"showCost");
            },
            clickDriver:function(item){
                if(item.status != 50){
                    layer.msg("该司机行程未结束,不能设置费用",{icon:2,time:3000});
                    return
                }
                this.items = [];
                this.modifying = false;
                this.currentIndex = null;
                this.driver = item;
                this.getDriverCost();
                this.getTripData();
            },
            initDatePrick:function(id){
                let that = this;
                new Kalendae.Input(id, {
                    months: 2,
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
            getDriverCost:function(){
                $.showLoading();
                $.ajax({
                    url:base.gAjaxUrl.officialcarBillList_V2,
                    type:"GET",
                    data:{
                        drivertrip:this.driver.id,
                        page:1,
                        page_size:999,
                    }
                }).always((data)=>{
                    $.hideLoading();
                    base.ajaxCallback(data,()=>{
                        if(data.results && data.results.length){
                            this.items = data.results;
                            this.$nextTick(()=>{
                                for (let i = 0; i < this.items.length; i++) {
                                    this.initDatePrick(`create${i}`);
                                    this.initDatePrick(`remember${i}`);
                                }
                            });
                        }else{
                            this.items = [];
                        }
                    })
                })
            },
            getCostTypelist:function(){
                $.showLoading();
                $.ajax({
                    url:base.gAjaxUrl.officialcarCostTypes_V2,
                    type:"GET",
                }).always((data)=>{
                    $.hideLoading();
                    base.ajaxCallback(data,()=>{
                        this.costTypes = data;
                        this.getDriverCost();
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
                let mileage = $(`#tr${i} #mileage${i}`);
                let oilCarNumber = $(`#tr${i} #oilCarNumber${i}`);
                if(type.name == "油费"){
                    oilType.attr("disabled",false);
                    oilValue.attr("disabled",false);
                    mileage.attr("disabled",false);
                    oilCarNumber.attr("disabled",false);
                }else{
                    console.log("非油费");
                    oilType.attr("disabled", true).val("");
                    oilValue.attr("disabled", true).val("");
                    mileage.attr("disabled", true).val("");
                    oilCarNumber.attr("disabled", true).val("");
                }
            },
            modifyData:function(i){
                this.modifying = true;
                this.currentIndex = i;
                this.$nextTick(()=>{
                    this.changeCostType(i);
                })
            },
            complete:function(index,modifyData){
                let data = {};
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
                    let mileage = $(`#mileage${index}`).val();
                    if(!mileage || !(mileage > 0)){
                        layer.msg("请输入正确的公里数",{icon:2,time:2000});
                        return;
                    }
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
                        mileage:mileage,
                        oil_cardnumber:number,
                    };
                }
                data.remark = $(`#remark${index}`).val();
                data.feetype = typeId;
                data.fee = +(price * 100).toFixed(0);
                data.fee_date = startDate;
                data.jz_date = rememberDate;
                $.showLoading();
                // 判断是否为新增.
                if(modifyData.id){
                    $.ajax({
                        url:`${base.gAjaxUrl.officialcarBillList_V2}${modifyData.id}/`,
                        type:"PATCH",
                        contentType:"application/json",
                        data:JSON.stringify(data),
                    }).always((data)=>{
                        $.hideLoading();
                        base.ajaxCallback(data,()=>{
                            this.getDriverCost();
                            layer.msg("修改成功",{icon:1,time:1500});
                        })
                    })
                }else{
                    $.ajax({
                        url:`${base.gAjaxUrl.officialcarDriverTrip_V2}${this.driver.id}/set_fee/`,
                        type:"POST",
                        contentType:"application/json",
                        data:JSON.stringify(data)
                    }).always((data)=>{
                        $.hideLoading();
                        this.getDriverCost();
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
                this.getDriverCost();
            },
            delete1:function(data){
                layer.confirm(`确认删除这条费用吗?`,()=>{
                    $.showLoading();
                    $.ajax({
                        url:`${base.gAjaxUrl.officialcarBillList_V2}${data.id}/`,
                        type:"DELETE",
                    }).always((data)=>{
                        $.hideLoading();
                        if(data) {
                            base.ajaxCallback(data)
                        } else {
                            layer.msg("删除成功",{icon:1,time:1500});
                            this.getDriverCost()
                        }
                    })
                    layer.closeAll();
                })
                this.currentIndex = null;

            },
            add:function(){
                if(this.driver.status != 50){
                    layer.msg("该司机行程未结束,不能设置费用",{icon:2,time:3000});
                    return
                }
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

