<template>
    <cover v-if="showConflict"
           :data="conflictDataArr"
           @cancel-cover="cancelCover"
           @confirm-cover="confirmCover"></cover>
    <div class="layui-layer layui-anim layui-layer-page layui-modify bus-dispatch">
        <div class="layui-layer-title">编辑巴士班次</div>
        <div class="layui-layer-content dispatch_content">
            <div class="row clearfix layer_content">
                <div class="col-10 col-offset-1 f-l">
                    <div class="line_info pd-15 clearfix radius">
                        <div class="f-l ml-5">【{{line.shuttle_name || '--'}}】</div>
                        <div class="f-l ml-5">{{line.departure_date || '--'}}</div>
                        <div class="f-l ml-5">{{line.departure_time || '--'}}</div>
                    </div>
                    <div class="row clearfix pl-10 pr-10">
                        <div class="col-2 f-l text-r lh-30">司机选择&nbsp;&nbsp;</div>
                        <div class="col-10 f-l">
                            <sel :arr="driverList"
                                 :name="selectDriver.staff__real_name"
                                 key="staff__real_name"
                                 v-on:sel="selectedDriver"></sel>
                        </div>
                    </div>
                    <div class="row clearfix pl-10 pr-10">
                        <div class="col-2 f-l text-r lh-30">车辆选择&nbsp;&nbsp;</div>
                        <div class="col-10 f-l">
                            <sel :arr="carList"
                                 key="car_no"
                                 :name="selectCar.car_no"
                                 v-on:sel="selectedCar"></sel>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom_btn">
            <a href="javascript:;"
               class="btn radius btn-primary f-r mt-10 mr-20"
               @click="saveDispatch">保存</a>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;"
               v-on:click="close()"></a>
        </span>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<script type="text/ecmascript-6">

    import * as base from '../../assets/js/base.js';
    import sel from '../components/palceselectedInput.vue';
    import cover from './ferryBusDispatchCover';

    export default {
        ready() {

            if (this.data && this.data.line) {
                this.line = this.data.line || {};
                this.dispatch = this.data.dispatch || {};
                this.selectBusTimeArr = [this.line.id];
                this.getInfos();
            } else {
                layer.alert('数据异常请重新进入', (index) => {
                    this.$dispatch('dialog-close');
                    layer.close(index);
                });
            }
            base.verticalCenter('.layui-modify');
        },
        data: function () {
            return {
                dispatch: {},
                line: {},
                selectedLineId: '',// 当前选择的路线的id
                selectBusTimeArr: [], // 选择的发车时间
                showConflict: false,
                conflictDataArr: {},
                carList: [], // 所有的车辆列表
                driverList: [], // 所有的司机列表
                selectDriver: {}, // 选择的司机
                selectCar: {}, // 选择的车辆
            }
        },
        props: ['data'],
        methods: {
            selectedDriver: function (data, index) {
                if (data) {
                    this.selectDriver = data;
                } else {
                    this.selectDriver = {};
                }
            },
            selectedCar: function (data, index) {
                if (data) {
                    this.selectCar = data;
                } else {
                    this.selectCar = {}
                }
            },
            close: function () {
                this.$dispatch("dialog-close");
            },
            saveDispatch: function () {
                if (!this.selectDriver.id) {
                    layer.msg("请选择司机", {icon: 2, time: 1500});
                    return;
                }
                if (!this.selectCar.id) {
                    layer.msg("请选择车辆", {icon: 2, time: 1500});
                    return;
                }
                this.checkConflict();
            },
            checkConflict: function () {
                if (this.loading) return;
                let that = this;
                this.loading = true;
                $.ajax({
                    url: base.gAjaxUrl.ferryBusDispatch + 'dispatch_validate/',
                    type: "POST",
                    contentType: 'application/json',
                    data: JSON.stringify({
                        shuttle_bus_dates: that.selectBusTimeArr,
                        driver_vehicles: [{
                            vehicle: this.selectCar.id,
                            driver: this.selectDriver.id,
                        }]
                    })
                }).always((data) => {
                    that.loading = false;
                    base.ajaxCallback(data, () => {
                        if (data.driver.length || data.vehicle.length) {
                            that.showConflict = true;
                            that.conflictDataArr = data;
                        } else {
                            that.save();
                        }
                    })
                })
            },
            cancelCover: function () {
                this.showConflict = false;
            },
            confirmCover: function () {
                this.showConflict = false;
                this.save();
            },
            save: function () {
                $.showLoading();
                // 有司机行程的就是单选
                if(this.dispatch.id) {
                    $.ajax({
                        url: base.gAjaxUrl.ferryBusDispatch + this.dispatch.id + '/',
                        type: "PATCH",
                        contentType: 'application/json',
                        data: JSON.stringify({
                            vehicle: this.selectCar.id,
                            driver: this.selectDriver.id,
                        })
                    }).always((data) => {
                        $.hideLoading();
                        base.ajaxCallback(data, () => {
                            this.$dispatch("dialog-save")
                        });
                    });
                } else {
                    this.createNewDispatch()
                }
            },
            createNewDispatch () {
                $.ajax({
                    url: base.gAjaxUrl.ferryBusDispatch + 'bulk_set/',
                    type: "POST",
                    contentType: 'application/json',
                    data: JSON.stringify({
                        shuttle_bus_dates: this.selectBusTimeArr,
                        driver_vehicles: [{
                            vehicle: this.selectCar.id,
                            driver: this.selectDriver.id,
                        }],
                    })
                }).always((data) => {
                    $.hideLoading();
                    base.ajaxCallback(data, () => {
                        this.$dispatch("dialog-save");
                    });
                });
            },
            // 获取线路的日期
            getInfos: function () {
                $.ajax({
                    url: base.gAjaxUrl.ferryBusDispatch + 'check_driver_vehicle/',
                    type: "GET",
                    data: {
                        page: 1,
                        page_size: 999999,
                    }
                }).always((data) => {
                    base.ajaxCallback(data, () => {
                        this.carList = data.vehicle;
                        this.driverList = data.drivers;
                        this.setDefaults()
                    })
                })
            },
            setDefaults() {
                this.carList.forEach(item => {
                    if (item.id === this.dispatch.vehicle) {
                        this.selectCar = item;
                    }
                });
                this.driverList.forEach(item => {
                    if (item.id === this.dispatch.driver) {
                        this.selectDriver = item;
                    }
                });
            }
        },
        filters: {},
        components: {
            sel, cover
        }
    }
</script>
<style lang="less" rel="stylesheet/less" scoped>

    .selected_content {
        height: 120px;
        border-radius: 4px;
        border: 1px solid #ccc;
        box-sizing: border-box;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 10px 15px 15px;

        .select_item {
            padding: 0 8px;
            line-height: 30px;
            background-color: #fff;
            border: 1px solid #ccc;
            margin-top: 10px;
            margin-left: 10px;
            border-radius: 5px;
            position: relative;

            &.selected {
                background-color: #5a98de;
                color: #fff;
                border-color: #5a98de;
            }

            .delete_btn {
                cursor: pointer;
                position: absolute;
                right: 0;
                top: 0;
                width: 30px;
                height: 30px;
                text-align: center;
                font-size: 20px;
                line-height: 25px;
                vertical-align: middle;
            }
        }
    }

    #diver {
        width: 300px;
        height: 34px;
    }

    #car {
        width: 300px;
        height: 34px;
    }

    .diver {
        width: 300px;
    }

    .line_box {
        width: 90%;
        height: 450px;
        border: 1px solid #ccc;
        background-color: #fff;
        overflow: auto;

        .line_item {
            height: 40px;
            width: 270px;
            line-height: 38px;
            margin: 15px auto;
            position: relative;
            background-color: #e1e1e1;
            border: 1px solid #e1e1e1;

            &.selected {
                color: #fff;
                background-color: orange;
                border-color: orange;
            }

        }
    }

    .layui-layer-page.bus-dispatch {
        width: 800px;
        height: 450px;
        box-sizing: border-box;

        .dispatch_content {
            padding: 0;
            padding-bottom: 20px;
            position: relative;
            height: 100%;

            .right_box {
                padding: 0 20px;
                box-sizing: border-box;
            }

            .line_info {
                border: 1px solid #ccc;
                background-color: #f7f7f7;
            }
        }

        .bottom_btn {
            position: absolute;
            bottom: 15px;
            right: 15px;
        }

    }

    .calendar {
        display: inline-block;
    }

    .content-box {
        width: 100%;
        padding: 70px 50px 0 100px;

        .calendar {
            display: inline-block;
            width: 200px;
            float: left;
        }

        .dispatch-box {
            display: inline-block;
            width: 49%;
            float: right;

        }
    }

    .driver, .car {
        width: 200px;
        margin-bottom: 30px;
    }

    .driver {
        margin-top: 50px;
    }

</style>
