<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">
            费用录入
        </div>
        <div class="layui-layer-content pd-20">
            <div class="layui-layer-wrap">
                <div class="text-l clearfix">
                    <div>
                        <div class="row cl col-5 f-l">
                            <label class="form-label f-l label-box "><span class="c-red">*</span>车牌号：</label>
                            <div class="formControls f-l col-9">
                                <div class="department_select_container" @mouseleave="departmentEnter(false,'vehicle',$event)" @mouseenter="departmentEnter(true,'vehicle',$event)">
                                    <input v-if="vehicleItems.length === 0 && type === 'add'" disabled type="text" class="input-text" value="无可选择部门">
                                    <input v-else autocomplete="off" @click="departmentClick($event)" v-model="vehicleName" type="text" class="input-text" value="" placeholder="" name="department">
                                    <i v-show="driverName !== ''" class="empty-icon Hui-iconfont" @click="emptySearch($event)">&#xe60b;</i>
                                    <div class="departmentListBox" style="display: none">
                                        <div v-bind:title="item.car_no" v-for="item in vehicleItems | filterBy vehicleName in 'car_no'" @click="setVehicleValue(item,$event)" class="departmentListItem">{{item.car_no}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row cl col-5 f-r">
                            <label class="form-label f-l label-box "><span class="c-red">*</span>驾驶人：</label>
                            <div class="formControls f-l col-9">
                                <div class="department_select_container" @mouseleave="departmentEnter(false,'driver',$event)" @mouseenter="departmentEnter(true,'driver',$event)">
                                    <input v-if="driverItems.length === 0 && type === 'add'" disabled type="text" class="input-text" value="无可选择部门">
                                    <input v-else autocomplete="off" @click="departmentClick($event)" v-model="driverName" type="text" class="input-text" value="" placeholder="" name="department">
                                    <i v-show="driverName !== ''" class="empty-icon Hui-iconfont" @click="emptySearch($event,true)">&#xe60b;</i>
                                    <div class="departmentListBox" style="display: none">
                                        <div v-bind:title="item.staff_vo.real_name" v-for="item in driverItems | filterBy driverName in 'staff_vo.real_name'" @click="setDriverValue(item,$event)" class="departmentListItem">{{item.staff_vo.real_name}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btn btn-primary radius mt-5" v-on:click="addCost()">添加费用</div>
                <table class="table table-border table-bordered table-bg table-sort row">
                    <thead>
                    <tr class="text-c">
                        <th>费用类型</th>
                        <th>金额</th>
                        <th>发生日期</th>
                        <th>记账日期</th>
                        <th>用油类型</th>
                        <th>公里数</th>
                        <th>加油量</th>
                        <th>加油卡号</th>
                        <th>备注</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="text-c tr-data" v-for="bill in items" :id=" 'tr' + $index">
                        <td>
                            <select class="select-box" @change="changeCostType($index)" :id="'select' + $index">
                                <option v-for="type in costlist" :value="type.id">{{type.name}}</option>
                            </select>
                        </td>
                        <td class="relative" id="priceBox">
                            <input type="text" name="price" :id="'price' + $index" class="input-text price" @click="changeName($index)">
                            <!--<label id="price-error" class="error" for="price">必须填写</label>-->
                        </td>
                        <td>
                            <div class="relative">
                                <input :id="'startDate' + $index" type="text" autocomplete="off" class="input-text happen" @focus="focusStart($index)"/>

                            </div>
                        </td>
                        <td>
                            <input :id="'rememberDate' + $index" type="text" autocomplete="off" class="input-text accounts" @focus="focusEnd($index)" >
                        </td>
                        <td>
                            <select class="select-box oil-box"
                                    :disabled="filterCostType($index)"
                                    @change="changeOilType($index)"
                                    :id="'oilType' + $index">
                                <option v-for="type in oilTypes" :value="type">{{type}}</option>
                            </select>
                        </td>
                        <td>
                            <input :id="`mileage` + $index" type="text" autocomplete="off" :disabled="filterCostType($index)" class="input-text">
                        </td>
                        <td>
                            <input :id="`oilValue` + $index" type="text" autocomplete="off" :disabled="filterCostType($index)" name="oil" class="input-text">
                        </td>
                        <td>
                            <input :id="`oilCarNumber` + $index" type="text" autocomplete="off" :disabled="filterCostType($index)" name="oil" class="input-text">
                        </td>
                        <td>
                            <input :id="`remark` + $index" type="text" class="input-text">
                        </td>
                        <td>
                            <a href="javascript:;" class="btn btn-danger radius" @click="deleteBill($index)">删除</a>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div class="text-c cl mt-20">
                    <a href="javascript:;" class="btn btn-primary radius f-r mr-10" @click="saveCost">保存</a>
                    <!--<a href="javascript:;" class="btn btn-default radius f-r mr-10" v-on:click="close()">取消</a>-->
                </div>
                <div id="J-page" class="m-page row" v-show="!noData"></div>
                <div class="no-data text-c mt-50 row" v-if="noData">没有相关数据</div>
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
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .label-box {
        width: 20%;
        line-height: 31px;
    }

    .layui-modify {
        width: 1000px !important;
    }

    .select-box {
        width: 120px;
    }
    .oil-box{
        width: 70px;
    }
    .happen,.accounts{
        width: 90px;
    }


</style>
<script type="text/ecmascript-6">
    import * as base from '../../assets/js/base.js';
    import moment from "moment";
    let staffsOps = {
        param: {
            page: 1,
            page_size: 999999,
        }
    }
    export default{
        ready(){
            let that = this;
            base.verticalCenter(".layui-layer");
            this.currentDate = moment().format('YYYY-MM-DD');
            jQuery.validator.addMethod("isInt", function (value, element) {
                let reg = /^([1-9]\d*\.?|0\.)\d{0,2}$/;
                return reg.test(value)
            }, "最多输入2位小数");
            jQuery.validator.addMethod("isFloat", function (value, element) {
                return value > -1
            }, "不能为负数");

            this.getVehicleList();
            this.getDriverList();
        },
        data: function () {
            return {
                itemsLoading: false,
                vehicleFocus: false,
                driverFocus: false,
                noData: false,
                vehicleItems: [],
                driverItems: [],
                currentDate: '',
                vehicleName: '',
                driverName: '',
                vehicleId: '',
                driverId: '',
                items: [],
                focusIsStart: false,   // 判断当前聚焦是否是开始的时间
                currentDateIndex: "", // 当前
                oilTypes: ['-10#', '0#', '92#', '95#', '98#']
            }
        },
        props: ['costlist'],
        methods: {
            departmentClick: function (e) {
                $(e.target).nextAll(".departmentListBox").show();
            },
            departmentEnter: function (flag, type, e) {
                !flag && $(e.target).children(".departmentListBox").hide();
            },
            setVehicleValue: function (item, e) {
                this.vehicleName = item.car_no;
                $(e.target).parents(".departmentListBox").hide();
            },
            setDriverValue: function (item, e) {
                this.driverName = item.staff_vo.real_name;
                $(e.target).parents(".departmentListBox").hide();
            },
            // 清除搜索输入框
            emptySearch: function (e, type) {
                if (type) {
                    this.driverName = '';
                } else {
                    this.vehicleName = '';
                }
                $(e.target).nextAll(".departmentListBox").show();
            },
            focusStart: function (i) {
                this.focusIsStart = true;
                this.currentDateIndex = i;
            },
            focusEnd: function (i) {
                this.focusIsStart = false;
                this.currentDateIndex = i;
            },
            initDate: function (id) {
                let that = this;
                new Kalendae.Input(id, {
                    months: 1,
                    clickHide: true,
                    subscribe: {
                        "date-clicked": function (data) {
                            let startTime = $(`#startDate${that.currentDateIndex}`).val();
                            let remberTime = $(`#rememberDate${that.currentDateIndex}`).val();
                            let selectDate = data._i;
                            if (that.focusIsStart) {
                                if (moment(selectDate).isAfter(remberTime)) {
                                    layer.msg("记账日期不能早于发生日期", {icon: 2, time: 2500})
                                    return false;
                                }
                            } else {
                                if (moment(selectDate).isBefore(startTime)) {
                                    layer.msg("记账日期不能早于发生日期", {icon: 2, time: 2500})
                                    return false;
                                }
                            }
                        },
                        "change": function (data) {

                        }
                    }
                });
                $('#' + id).val(this.currentDate)
            },
            addCost: function () {
                this.items.push({})
                this.$nextTick(()=> {
                    let i = this.items.length - 1;
                    this.initDate('startDate' + i)
                    this.initDate('rememberDate' + i)
                    this.changeCostType(i);
                })
            },
            deleteBill: function (i) {
                this.items.splice(i, 1);
            },
            close: function () {
                this.$dispatch('close')
            },
            getVehicleList: function () {
                $.ajax({
                    url: base.gAjaxUrl.officialcarVehicleList_V2,
                    type: 'GET',
                    data: staffsOps.param
                })
                        .always((data)=> {
                            base.ajaxCallback(data, ()=> {
                                this.vehicleItems = data.results;
                                // this.itemsLoading = false;
                                // this.items = resultData;
                                // if(resultData.length){
                                //     this.noData = false;
                                //     //回调
                                //     callback(data.num_pages,data.count);
                                // }else{
                                //     this.noData = true;
                                // }
                            });
                        })

            },
            getDriverList: function () {
                $.ajax({
                    url: base.gAjaxUrl.officialcarDriverList_V2,
                    type: 'GET',
                    data: staffsOps.param
                }).always((data)=> {
                    base.ajaxCallback(data, ()=> {
                        this.driverItems = data.results;
                    });
                })
            },
            save: function () {
                let dataArr = $(".tr-data");
                if (dataArr.length == 0) {
                    layer.msg('请添加费用', {icon: 2, time: 1500});
                    return
                }
                if (this.costlist.length == 0) {
                    layer.msg('费用类型不能为空,请先添加费用类型', {icon: 2, time: 1500});
                    return
                }
                let priceFlag = false;
                [].forEach.call(dataArr, (item, i) => {
                    let price = $(item).find('#price' + i).val();
                    // 如果未输入或者输入的不是正常数值
                    if (!price || (price * 1 != price * 1) || price < 0) {
                        priceFlag = true
                    }
                });
                if (priceFlag) {
                    layer.msg('请输入正确的金额', {icon: 2, time: 1500});
                    return
                }

                let arr = [];
                for (let i = 0, len = dataArr.length; i < len; i++) {
                    let obj = {};
                    let dom = $(dataArr[i]);
                    obj.feetype = dom.find('#select' + i).val();
                    let price  = parseFloat(dom.find('#price' + i).val());
                    if(!/^\d+\.{0,1}\d{0,2}$/.test(price)){
                        layer.msg("金额最多输入两位数",{icon:2,time:2000});
                        return;
                    }
                    obj.fee = +(price * 100).toFixed(0);


                    obj.fee_date = dom.find('#startDate' + i).val();
                    obj.jz_date = dom.find('#rememberDate' + i).val();
                    if (moment(obj.fee_date).isAfter(obj.jz_date)) {
                        layer.msg("记账日期不能早于发生日期", {icon: 2, time: 2500});
                        return;
                    }
                    obj.remark = dom.find('#remark' + i).val();
                    if (!dom.find(`#oilType${i}`).attr("disabled")) {
                        let type = dom.find(`#oilType${i}`).val();
                        let value = dom.find(`#oilValue${i}`).val();
                        let mileage = dom.find(`mileage${i}`).val();
                        let carnumber = dom.find(`#oilCarNumber${i}`).val();
                        obj.extra = {
                            oil_type: type,
                            oil_num: value,
                            mileage: mileage,
                            oil_cardnumber: carnumber
                        }
                    }

                    obj.vehicle = this.vehicleId;
                    obj.staff = this.driverId;
                    arr.push(obj)
                }

                this.itemsLoading = true;

                $.ajax({
                    url: `${base.gAjaxUrl.officialcarCost_V2}bulk_create/`,
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(arr)
                }).always((data)=> {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=> {
                        layer.msg("保存成功", {icon: 1, time: 1500});
                        this.$dispatch('dialog-save')
                    })
                })
            },
            saveCost: function () {
                for (let i = 0, len = this.vehicleItems.length; i < len; i++) {
                    let vehicleCarno = this.vehicleItems[i].car_no;
                    if (vehicleCarno === this.vehicleName) {
                        this.vehicleId = this.vehicleItems[i].id;
                        break;
                    } else if (i === len - 1 || this.vehicleName === '') {
                        layer.msg('该车牌号不存在', {icon: 2, time: 1500});
                        return
                    }
                }
                for (let i = 0, len = this.driverItems.length; i < len; i++) {
                    let driver = this.driverItems[i].staff_vo.real_name;
                    if (driver === this.driverName) {
                        this.driverId = this.driverItems[i].staff;
                        break;
                    } else if (i === len - 1 || this.driverName === '') {
                        layer.msg('该司机不存在', {icon: 2, time: 1500});
                        return
                    }
                }

                for (let i = 0; i < this.items.length; i++) {
                    if (!$(`#oilType${i}`).attr("disabled")) {
                        let oilType = $(`#oilType${i}`).val();
                        if (!oilType) {
                            layer.msg("请输入油的类型", {icon: 2, time: 2000});
                            return;
                        }
                        let mileage = $(`#mileage${i}`).val();
                        if (!mileage || !(mileage * 1 >= 0)) {
                            layer.msg("请输入正确的里程数", {icon: 2, time: 2000});
                            return;
                        }
                        let value = $(`#oilValue${i}`).val();
                        if (!value || !(value * 1 >= 0)) {
                            layer.msg("请输入正确的加油量", {icon: 2, time: 2000});
                            return;
                        }
                        let number = $(`#oilCarNumber${i}`).val();
                        // if(!number){
                        //     layer.msg("请输入油的类型",{icon:2,time:2000});
                        //     return;
                        // }
                    }
                }

                this.save();
            },
            changeName: function (i) {
                $('.price').removeAttr('name');
                $('#price-error').remove();
                $('.price').eq(i).attr('name', 'price');
            },
            changeCostType: function (i) {
                let typeId = $(`#select${i}`).val();
                let type = "";
                for (let item of this.costlist) {
                    if (item.id == typeId) {
                        type = item;
                        break;
                    }
                }
                let oilType = $(`#tr${i} #oilType${i}`);
                let oilValue = $(`#tr${i} #oilValue${i}`);
                let mileage = $(`#tr${i} #mileage${i}`);
                let oilCarNumber = $(`#tr${i} #oilCarNumber${i}`);
                // $('input[name="oil"]').attr("disabled",true);
                if (type.name == "油费") {
                    oilType.attr("disabled", false);
                    oilValue.attr("disabled", false);
                    mileage.attr("disabled", false);
                    oilCarNumber.attr("disabled", false);
                } else {
                    oilType.attr("disabled", true).val("");
                    oilValue.attr("disabled", true).val("");
                    mileage.attr("disabled", true).val("");
                    oilCarNumber.attr("disabled", true).val("");
                }
            },
            changeOilType: function (i) {
                let typeId = $(`#select${i}`).val();
                let type = "";
                for (let item of this.costlist) {
                    if (item.id == typeId) {
                        type = item;
                        break;
                    }
                }
                let oilType = $(`#tr${i} #oilType${i}`);
                let oilValue = $(`#tr${i} #oilValue${i}`);
                let oilCarNumber = $(`#tr${i} #oilCarNumber${i}`);
                // $('input[name="oil"]').attr("disabled",true);
                if (type.name == "油费") {
                    oilType.attr("disabled", false);
                    oilValue.attr("disabled", false);
                    oilCarNumber.attr("disabled", false);
                } else {
                    oilType.attr("disabled", true).val("");
                    oilValue.attr("disabled", true).val("");
                    oilCarNumber.attr("disabled", true).val("");
                }
            },
            filterCostType: function (i) {
                let typeId = $(`#select${i}`).val();
                let type = "";
                for (let item of this.costlist) {
                    if (item.id == typeId) {
                        type = item;
                        break;
                    }
                }
                return type.name == "油费";

            },


        },
        filter: {},
        event: {},
        components: {},
    }
</script>
