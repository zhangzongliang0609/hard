<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">{{exportTypeObj[type].title}}</div>
        <div class="layui-layer-content">
            <form id="J-layer-form" class="form form-horizontal layui-layer-wrap">
                <div class="row cl">
                    <div class="form-label f-l col-4 select-department">车牌号：</div>
                    <div class="formControls f-l col-3">
                        <div class="department_select_container" @mouseleave="departmentEnter(false,$event)" @mouseenter="departmentEnter(true,$event)">
                            <input v-if="busArr.length === 0" disabled type="text" class="input-text" value="无可选择车辆">
                            <input v-else autocomplete="off" @click="departmentClick($event)" v-model="selectedVehicleNo" type="text" class="input-text" value="" placeholder="" name="department">
                            <i v-show="selectedVehicleNo !== ''" class="empty-icon Hui-iconfont" @click="emptySearch($event)">&#xe60b;</i>
                            <div class="departmentListBox" style="display: none">
                                <div v-bind:title="item.car_no" track-by="$index"  v-for="item in busArr | filterBy selectedVehicleNo in 'car_no'" @click="setDepartmentValue(item,$event)" class="departmentListItem">{{item.car_no}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4"><span class="c-red">*</span>导出时间：</label>
                    <div class="formControls f-l col-3">
                        <input readonly v-model="billStartTime" id="billStartTime" type="text" class="input-text" value=""
                               placeholder="" name="billStartTime">
                    </div>
                </div>
                <div class="text-c mt-15 c-red">
                    <p>注意：1.每次只能导出一辆车一天的行驶数据</p>
                </div>
            </form>
        </div>
    <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
        <div class="layui-layer-btn" v-on:click="export"><a class="layui-layer-btn0" v-if="type!='check'">导出</a></div>
    </div>
    <div class="layui-layer-shade"></div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>

<style lang="less" scoped>
    .layui-layer.layui-layer-page .layui-layer-content {
        padding-bottom: 200px;
    }

</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import moment from 'moment';

    export default{
        ready () {

            base.verticalCenter('.layui-modify');

            new Kalendae.Input("billStartTime", {
                months: 1,
                clickHide: true
            });
            this.billStartTime = moment().format("YYYY-MM-DD");

            if(this.data.date) {
                this.billStartTime = this.data.date;
            }
            this.getVehicles();

            //验证
            $('#J-layer-form').validate({
                rules: {
                    billStartTime: {
                        required: true,
                        dateISO: true
                    },
                },
                submitHandler: () => {
                    var obj = {
                        start_date: this.billStartTime,
                        vehicle_id: this.selectedVehicleId,
                    };
                    this.itemsLoading = true;
                    $.ajax({
                        url: this.exportTypeObj[this.type].exportUrl,
                        type: 'GET',
                        data: obj
                    }).always((data)=> {
                        this.itemsLoading = false;
                        this.close();
                        this.$router.go({path: '/job'});
                    })
                }
            });
        },
        props: ['type', 'data'],
        data: function () {
            return {
                billStartTime: '',
                itemsLoading: false,
                selectedVehicleNo: '',
                selectedVehicleId: '',
                isDepartmentFocus: false,
                busArr: [],
                exportTypeObj: { // 不同类型的请求参数和处理参数
                    bus: {
                        title: '导出车辆位置信息',
                        exportUrl: base.gAjaxUrl.busLocationExport,
                        listUrl: base.gAjaxUrl.busTrail,
                    },
                    car: {
                        title: '导出车辆位置信息',
                        exportUrl: base.gAjaxUrl.carLocationExport,
                        listUrl: base.gAjaxUrl.carTrail,
                    },
                    privateCar: {
                        title: '导出车辆位置信息',
                        exportUrl: `${base.gAjaxUrl.privateCar}export_day/`,
                        listUrl: `${base.gAjaxUrl.privateCar}device_info/`,
                    },
                }
            }
        },
        methods: {
            close: function () {
                this.$dispatch('dialog-close');
            },
            export: function () {
                $('#J-layer-form').submit();
            },
            getVehicles: function () {
                $.ajax({
                    url: this.exportTypeObj[this.type].listUrl,
                    type: "GET",
                    data: {
                        page: 1,
                        page_size: 999999,
                    }
                }).always((data) => {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, () => {
//                        console.log(data);
                        this.busArr = data.result || [];
                        var item = this.data.item;
                        this.$nextTick(()=>{
                            if(item.car_no) {
                                this.selectedVehicleNo = item.car_no;
                                this.selectedVehicleId = item.vehicle_id;
                            }
//                            console.log(this.selectedVehicleNo, this.selectedVehicleId)
                        });
                    })
                })
            },
            departmentEnter: function (flag,e) {
                this.isDepartmentFocus = flag;
                !flag && $(e.target).children(".departmentListBox").hide();
            },
            departmentClick: function (e) {
                if(this.isDepartmentFocus) {
                    $(e.target).nextAll(".departmentListBox").show();
                }
            },
            // 清除搜索输入框
            emptySearch:function(e){
                this.selectedVehicleNo = '';
                $(e.target).nextAll(".departmentListBox").show();
            },
            setDepartmentValue: function (item,e) {
                this.selectedVehicleNo = item.car_no;
                this.selectedVehicleId = item.vehicle_id;
                $(e.target).parents(".departmentListBox").hide();
            },
        },
    }
</script>
