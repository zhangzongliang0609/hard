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
                <form action="" id="J-layer-form" class="form-box-cost-input">
                <table   class="table table-border table-bordered table-bg table-sort row">
                    <thead>
                    <tr class="text-c">
                        <th width="140">费用类型</th>
                        <th width="100">金额</th>
                        <th width="130">发生日期</th>
                        <th width="130">记账日期</th>
                        <th width="200">备注</th>
                        <th width="100">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="text-c tr-data" v-for="bill in items">
                        <td>
                            <select name="" id="" class="select">
                                <option :value="cost.id" v-for="cost in costlist">{{cost.name}}</option>
                            </select>
                        </td>
                        <td class="relative" id="priceBox">
                            <input type="text" name="price"   class="input-text price" @click="changeName($index)">
                            <!--<label id="price-error" class="error" for="price">必须填写</label>-->
                        </td>
                        <td>
                            <input :id="'startDate' + $index" type="text" class="input-text happen" >
                        </td>
                        <td>
                            <input :id="'endDate' + $index" type="text" class="input-text accounts">
                        </td>
                        <td>
                            <input type="text" class="input-text remark">
                        </td>
                        <td>
                            <a href="javascript:;" class="btn btn-danger radius" @click="deleteBill($index)">删除</a>
                        </td>
                    </tr>
                    </tbody>
                </table>
                </form>
                <div class="text-c cl mt-20">
                    <a href="javascript:;" class="btn btn-primary radius f-r mr-10" @click="getId">保存</a>
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
    .label-box{
        width: 20%;
        line-height: 31px;
    }
    .layui-modify{
        margin-left: -400px;
    }

</style>
<style>
    #J-layer-form.form-box-cost-input label.error {
        right: 10px;
        position: absolute;
        top: 15px;
        color: #ef392b;
        font-size: 12px;
    }
</style>
<script>
    import * as base from '../assets/js/base.js';
    import moment from "moment";
    let staffsOps = {
        param:{
            page:1,
            page_size:999999,
        }
    }
    export default{
        ready(){
            let that = this;
            this.currentDate = moment().format('YYYY-MM-DD');
            jQuery.validator.addMethod("isInt", function(value, element) {
                let reg = /^([1-9]\d*\.?|0\.)\d{0,2}$/;
                return reg.test(value)
            }, "最多输入2位小数");
            jQuery.validator.addMethod("isFloat", function(value, element) {
                return value > -1
            }, "不能为负数");

            $('#J-layer-form').validate({
                    rules:{
                        price:{
                            required: true,
                            number:true,
                            isFloat:true,
                            isInt:true,

                        }
                    },
                    submitHandler:function () {
                        that.save();
                    }
                },
            )
            this.getVehicleList();
            this.getDriverList();
        },
        data:function () {
            return{
                itemsLoading:false,
                vehicleFocus:false,
                driverFocus:false,
                noData:false,
                vehicleItems:[],
                driverItems:[],
                currentDate:'',
                vehicleName:'',
                driverName:'',
                vehicleId:'',
                driverId:'',
                items:[],
            }
        },
        props:['costlist'],
        methods:{
            departmentClick: function (e) {
                    $(e.target).nextAll(".departmentListBox").show();
            },
            departmentEnter: function (flag,type,e) {
                !flag && $(e.target).children(".departmentListBox").hide();
            },
            setVehicleValue: function (item,e) {
                this.vehicleName = item.car_no;
                $(e.target).parents(".departmentListBox").hide();
            },
            setDriverValue: function (item,e) {
                this.driverName = item.staff_vo.real_name;
                $(e.target).parents(".departmentListBox").hide();
            },
            // 清除搜索输入框
            emptySearch:function(e,type){
                if(type){
                    this.driverName = '';
                }else{
                    this.vehicleName = '';
                }
                $(e.target).nextAll(".departmentListBox").show();
            },
            initDate:function (id) {
                new Kalendae.Input(id, {
                    months: 2,
                    clickHide:true
                });
                $('#'+id).val(this.currentDate)
            },
            addCost:function(){
                this.items.push({})
                this.$nextTick(()=>{
                    let i = this.items.length-1;
                    this.initDate('startDate'+ i)
                    this.initDate('endDate'+ i)
                })
            },
            deleteBill:function (i) {
                this.items.splice(i,1);
            },
            close:function () {
                this.$dispatch('close')

            },
            getVehicleList:function () {
                $.ajax({
                    url: base.gAjaxUrl.officialcarvehicles,
                    type: 'GET',
                    data:staffsOps.param
                })
                    .always((data)=>{
                        base.ajaxCallback(data,()=>{
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
            getDriverList:function () {
                $.ajax({
                    url: base.gAjaxUrl.officialcardrivers,
                    type: 'GET',
                    data:staffsOps.param
                })
                    .always((data)=>{
                        base.ajaxCallback(data,()=>{
                            this.driverItems = data.results;
                        });
                    })
            },
            save:function () {
                let dataArr = $(".tr-data");
                if(dataArr.length == 0){
                    layer.msg('请添加费用',{icon:2,time:1500})
                    return
                }
                if(this.costlist.length == 0){
                    layer.msg('费用类型不能为空,请先添加费用类型',{icon:2,time:1500})
                    return
                }
                this.itemsLoading = true;
                let arr = [];
                for (let i = 0,len = dataArr.length; i < len ; i++) {
                    let obj = {};
                    obj.feetype = $(dataArr[i]).find('.select').val();
                    obj.fee = $(dataArr[i]).find('.price').val();
                    obj.fee_date = $(dataArr[i]).find('.happen').val();
                    obj.ctime = $(dataArr[i]).find('.accounts').val();
                    obj.remark = $(dataArr[i]).find('.remark').val();
                    obj.vehicle = this.vehicleId;
                    obj.staff = this.driverId;
                    arr.push(obj)
                }

                $.ajax({
                    url:`${base.gAjaxUrl.officialCarFees}bulk_create/`,
                    type:"POST",
                    contentType:"application/json",
                    data:JSON.stringify(arr)
                }).always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
                        this.$dispatch('dialog-close')
                    })
                })
            },
            getId:function () {
                for (let i = 0,len = this.vehicleItems.length; i < len; i++) {
                    let vehicleCarno  = this.vehicleItems[i].car_no;
                    if(vehicleCarno === this.vehicleName){
                        this.vehicleId = this.vehicleItems[i].id;
                        break;
                    }else if(i === len - 1 || this.vehicleName === ''){
                        layer.msg('该车牌号不存在',{icon:2,time:1500});
                        return
                    }
                }
                for (let i = 0,len = this.driverItems.length; i < len; i++) {
                    let driver  = this.driverItems[i].staff_vo.real_name;
                    if(driver === this.driverName){
                        this.driverId = this.driverItems[i].staff;
                        break;
                    }else if(i === len - 1 || this.driverName === ''){
                        layer.msg('该司机不存在',{icon:2,time:1500});
                        return
                    }
                }
                $('#J-layer-form').submit();
            },
            changeName:function (i) {
                $('.price').removeAttr('name');
                $('#price-error').remove();
                $('.price').eq(i).attr('name','price');
            }


        },
        filter:{},
        event:{},
        components:{},
    }
</script>
