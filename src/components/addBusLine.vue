<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify layer-add-bus">
        <div class="layui-layer-title">{{type == 'add' ? '新增' : '修改'}}线路</div>
        <div class="layui-layer-content">
            <form id="J-layer-form" class="form form-horizontal layui-layer-wrap">
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>线路名称：</label>
                    <div class="formControls f-l col-4">
                        <input v-model="shuttleNameInput" type="text" class="input-text" value="" placeholder="不能为空"
                               name="shuttle_name" autocomplete="off"/>
                    </div>
                </div>
                <div id="addGoDepartureTimeId" class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>去程出发时间：</label>
                    <div class="formControls f-l col-4">
                        <input v-model="GoDepartureTimeInput" type="text" class="input-text" id="GO-datetimepicker"
                               value="00:00" autocomplete="off"/>
                    </div>
                    <a href="javascript:;" class="ml-5 btn btn-secondary size-M radius"
                       v-on:click="addGoDepartureTime()">添加</a>
                </div>
                <div class="row cl" v-if="GoDepartureTimeList.length">
                    <label class="form-label f-l col-4 "></label>
                    <div class="formControls f-l col-6">
                        <!-- <a href="javascript:;" class="fl mb-5 mr-5 btn btn-success-outline radius size-S"
                            v-for="item in GoDepartureTimeList">
                             <input class="J-go-time-item station-item" type="text" v-bind:value="item.departure_time"
                                    v-bind:id="item.id" disabled="disabled" autocomplete="off">
                             <i class="f-14 Hui-iconfont" v-on:click="removeGoDepartureTime($index)">&#xe706;</i>
                         </a>-->

                        <div class="fl mb-5 mr-5 btn radius size-S"
                             v-for="(index,item) in GoDepartureTimeList">
                            <input type="text" class="J-go-time-item station-item" v-if="goDateSwitch[index]"
                                   :id="`goDate${index}`" value="00:00" autocomplete="off"/>
                            <input class="J-go-time-item station-item" v-else type="text" :value="item.departure_time"
                                   :id="item.id" disabled="disabled" autocomplete="off">

                            <span class="ml-5 btn btn-link size-MINI" v-if="goDateSwitch[index]"
                                  @click="editDate(item,index,false,'goDate','goDateSwitch','goTimeList')">保存</span>
                            <span class="ml-5 btn btn-link size-MINI" v-else
                                  @click="editDate(item,index,true,'goDate','goDateSwitch','goTimeList')">编辑</span>
                            <i class="f-14 Hui-iconfont" v-on:click="removeGoDepartureTime($index)">&#xe706;</i>
                        </div>
                    </div>
                </div>
                <div id="addReturnDepartureTimeId" class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>返程出发时间：</label>
                    <div class="formControls f-l col-4">
                        <input v-model="ReturnDepartureTimeInput" type="text" class="input-text"
                               id="RETURN-datetimepicker" value="00:00" autocomplete="off"/>
                    </div>
                    <a href="javascript:;" class="ml-5 btn btn-secondary size-M radius"
                       v-on:click="addReturnDepartureTime()">添加</a>
                </div>
                <div class="row cl" v-if="ReturnDepartureTimeList.length">
                    <label class="form-label f-l col-4 "></label>
                    <div class="formControls f-l col-6">
                        <!-- <a href="javascript:;" class="fl mb-5 mr-5 btn btn-success-outline radius size-S"
                            v-for="item in ReturnDepartureTimeList">
                             <input class="J-return-time-item station-item" type="text" autocomplete="off"
                                    v-bind:value="item.departure_time" v-bind:id="item.id" disabled="disabled">
                             <i class="f-14 Hui-iconfont" v-on:click="removeReturnDepartureTime($index)">&#xe706;</i>
                         </a>-->
                        <div class="fl mb-5 mr-5 btn  radius size-S"
                             v-for="(index,item) in ReturnDepartureTimeList">
                            <input type="text" class="J-return-time-item station-item" v-if="outDateSwitch[index]"
                                   :id="`outDate${index}`" value="00:00" autocomplete="off"/>
                            <input class="J-return-time-item station-item" v-else type="text"
                                   :value="item.departure_time"
                                   :id="item.id" disabled="disabled" autocomplete="off">
                            <span class="ml-5 btn btn-link size-MINI" v-if="outDateSwitch[index]"
                                  @click="editDate(item,index,false,'outDate','outDateSwitch','returnTimeList')">保存</span>
                            <span class="ml-5 btn btn-link size-MINI" v-else
                                  @click="editDate(item,index,true,'outDate','outDateSwitch','returnTimeList')">编辑</span>
                            <i class="f-14 Hui-iconfont" v-on:click="removeReturnDepartureTime($index)">&#xe706;</i>
                        </div>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>报名截止及开始打卡时间（距开车前）：</label>
                    <div class="formControls f-l col-4">
                        <input v-model="applyExpiredMinutesInput" type="text" class="input-text" value=""
                               placeholder="不能为空或负数" name="apply_expired_minutes" autocomplete="off"/>
                    </div>
                    <div class="f-l form-label ml-5">分钟</div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">自动排班时间（距开车前）：</label>
                    <div class="formControls f-l col-4">
                        <input id="autoDispatchTime" v-model="autoDispatchTime" type="text" class="input-text" value=""
                               placeholder="不能为负数"
                               name="auto_dispatch_time" autocomplete="off"/>
                    </div>
                    <div class="f-l form-label col-4">
                        <div class="f-l ml-5">分钟</div>
                        <span class="f-l relative message ml-10">
                                <i class="Hui-iconfont c-blue">&#xe6cd;</i>
                                <span class="message-box">若开启自动排班，您可设置自动排班时间定时提前排班，否则系统会到截止报名时间才排班。</span>
                            </span>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>总车票数：</label>
                    <div class="formControls f-l col-4">
                        <input v-model="seatsInput" type="text" class="input-text" value="" placeholder="不能为空或负数"
                               name="seats" autocomplete="off"/>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>车票单价：</label>
                    <div class="formControls f-l col-4">
                        <input v-model="priceInput" type="text" class="input-text" value="" placeholder="不能为空或负数"
                               name="price" autocomplete="off"/>
                    </div>
                    <div class="f-l form-label ml-5">元</div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">自动排班：</label>
                    <div class="formControls f-l col-4 clearfix">
                        <span class="switch-outer f-l" @click="toggleAutoDispatch"
                              :class="{'selected': autoDispatch}">
                            <span class="switch-inner">
                                <span class="switch-center"></span>
                            </span>
                        </span>
                        <span class="f-l relative message ml-10">
                                <i class="Hui-iconfont c-blue">&#xe6cd;</i>
                                <span class="message-box dispatchBus">
                                    开启后：<br/>
                                    1、自动排班前，在【线路排班】进行手动排班，则不会自动排班。<br/>
                                    2、若没有事先在【线路排班】进行手动排班，到自动排班时间，系统自动根据已有的报名人数，对已有的空闲司机、车辆进行排班：<br/>
                                    ①、预约模式：满足座位数的前提下，价格最低的方式派车<br/>
                                    ②、免预约模式：随机且仅派一辆车<br/>
                                    3、若空闲的司机车辆不足以满足乘客数量时，会短信通知管理员（在【线路排班--设置管理员通知】里设置管理员的联系方式）。<br/>
                                    4、若已排班的司机车辆、司机在司机端开始行程，则该排班无效（即乘客无法再分配到该车辆，会导致“司机车辆不足”）<br/>
                                    5、此功能仅是先派司机车辆，尚未给车辆分配乘客，详见“人分配到车”字段的说明
                                </span>
                            </span>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4">人分配到车：</label>
                    <div class="formControls f-l col-4">
                        <span class="f-l switch-outer" @click="peopleVehicle = !peopleVehicle"
                              :class="{'selected': peopleVehicle}">
                                <span class="switch-inner">
                                    <span class="switch-center"></span>
                                </span>
                            </span>
                        <span class="f-l relative message ml-10">
                                <i class="Hui-iconfont c-blue">&#xe6cd;</i>
                                <span class="message-box">
                                    开启：报名截止时，对已派的车（自动排班或手动排班。必须至少有一个排班）进行分配乘客，乘客需在分配到的车辆搭乘，无法在其他车辆搭乘。<br/>
                                    关闭：报名截止时，乘客能搭乘该线路班次所有已派的车。
                                </span>
                            </span>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">线路分组：</label>
                    <div class="formControls f-l col-4">
                        <tags :tags="wTagsArr" :selected="tagsArr"></tags>
                    </div>
                </div>
            </form>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;"
               v-on:click="close()"></a>
        </span>
        <div class="layui-layer-btn" v-on:click="save"><a class="layui-layer-btn0">保存</a></div>
    </div>
    <div class="layui-layer-shade"></div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import tags from '../components/setTags'

    export default {
        ready() {

            $('#GO-datetimepicker').datetimepicker({
                datepicker: false,
                format: 'H:i',
                step: 5
            });
            $('#RETURN-datetimepicker').datetimepicker({
                datepicker: false,
                format: 'H:i',
                step: 5
            });
            $.validator.addMethod("two_decimal", function (value, element, param) {
                return this.optional(element) || /^\d+\.{0,1}\d{0,2}$/.test(value);
//                return this.optional( element ) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test( value );
            }, $.validator.format("请输入正两位小数"));
            base.verticalCenter('.layui-modify');

            this.getTagList();
            /* 新功能引导提示 */
            this.$nextTick(() => {
                this.init();
                this.initValidate();
            });
        },
        //动态传值
        props: ['title', 'type', 'data'],
        data: function () {
            return {
                shuttleNameInput: '',
                GoDepartureTimeInput: '00:00',
                ReturnDepartureTimeInput: '00:00',
                applyExpiredMinutesInput: '',
                autoDispatchTime: '', // 自动排班时间(距离发车前)
                autoDispatch: false, // 自动排班车辆
                peopleVehicle: false, // 人分配到车
                seatsInput: '',
                priceInput: '',
                GoDepartureTimeList: [],
                ReturnDepartureTimeList: [],
                goTimeList: [],// 去程的发车时间数组,用于时间去重
                returnTimeList: [], // 返程的发车时间数组
                itemsLoading: false,
                tagsArr: [],
                wTagsArr: [],
                goDateSwitch: [],
                outDateSwitch: [],
                editIndex: null,
                editType: null,
            }
        },
        methods: {
            initValidate: function () {
                let that = this;
                let ajaxUrl = '';
                let ajaxType = '';
                let getData = this.data;
                if (this.type == 'add') {
                    ajaxUrl = base.gAjaxUrl.shuttlebuses3;
                    ajaxType = 'POST';
                    this.GoDepartureTimeInput = '00:00';
                    this.ReturnDepartureTimeInput = '00:00';
                    this.applyExpiredMinutesInput = '';
                    this.seatsInput = '';
                    this.priceInput = '';
                    this.GoDepartureTimeList = [];
                    this.ReturnDepartureTimeList = [];
                } else if (this.type == 'modify') {
                    ajaxUrl = `${base.gAjaxUrl.shuttlebuses3}${getData.id}/`;
                    ajaxType = 'PUT';
                    this.departmentNameInput = getData.departure_time;
                    let i;
                    let go_times = [];
                    let return_times = [];
                    let bus_times = getData.bus_times;
                    for (i in bus_times) {
                        if (bus_times[i]['shuttle_type'] == -10) {
                            go_times.push(bus_times[i]);
                            that.goTimeList.push(bus_times[i].departure_time);
                        } else if (bus_times[i]['shuttle_type'] == 10) {
                            that.returnTimeList.push(bus_times[i].departure_time);
                            return_times.push(bus_times[i]);
                        }
                    }
                    this.shuttleNameInput = getData.shuttle_name;
                    this.departureTimeInput = getData.departure_time;
                    this.applyExpiredMinutesInput = getData.apply_expired_minutes;
                    this.seatsInput = getData.seats;
                    this.priceInput = getData.price / 100;
                    this.tagsArr = getData.tags;
                    this.GoDepartureTimeList = go_times;
                    this.ReturnDepartureTimeList = return_times;
                    this.autoDispatchTime = getData.apply_dispatch_minutes;
                    this.autoDispatch = getData.auto_dispatch;
                    this.peopleVehicle = getData.people_vehicle;
                }

                //验证
                $('#J-layer-form').validate({
                    rules: {
                        shuttle_name: {
                            required: true,
                        },
                        departure_time: {
                            required: true,
                        },
                        apply_expired_minutes: {
                            required: true,
                            digits: true
                        },
                        auto_dispatch_time: {
                            digits: true
                        },
                        seats: {
                            required: true,
                            digits: true
                        },
                        price: {
                            required: true,
                            two_decimal: true
                        },
                    },
                    submitHandler: function () {


                        if (that.autoDispatch && !$("#autoDispatchTime").val()) {
                            layer.msg("开启【自动排班】功能，请填写【自动排班时间】", {icon: 2, time: 1500});
                            $("#autoDispatchTime").focus();
                            return;
                        }
                        let ajaxBusTime = [];

                        $('.J-go-time-item').each(function () {
                            ajaxBusTime.push({"departure_time": $(this).val(), "shuttle_type": -10});
                        });
                        $('.J-return-time-item').each(function () {
                            ajaxBusTime.push({"departure_time": $(this).val(), "shuttle_type": 10});
                        });

                        let ajaxData = {
                            shuttle_name: that.shuttleNameInput,
                            apply_expired_minutes: that.applyExpiredMinutesInput,
                            apply_dispatch_minutes: that.autoDispatchTime || 0, // 后台不能处理空字符串
                            seats: that.seatsInput,
                            price: parseFloat(that.priceInput) * 100,
                            shuttletime_set: ajaxBusTime,
//                        departure_time: '00:00',
                            tags_set: that.getTagIds(that.tagsArr),
                            auto_dispatch: that.autoDispatch,
                            people_vehicle: that.peopleVehicle,
                        };
                        if (!ajaxBusTime.length) {
                            layer.msg('时间不能为空', {icon: 2, time: 1000});
                            that.itemsLoading = false;
                            return false;
                        }

                        let allDataList = [...that.outDateSwitch].concat([...that.goDateSwitch]);
                        for (let i = 0, len = allDataList.length; i < len; i++) {
                            if (allDataList[i]) {
                                layer.msg('去程/返程出发时间未保存', {icon: 2, time: 1000});
                                return false
                            }
                        }


                        that.itemsLoading = true;

                        $.ajax({
                            url: ajaxUrl,
                            type: ajaxType,
                            contentType: 'application/json',
                            data: JSON.stringify(ajaxData)
                        }).always(function (data) {
                            that.itemsLoading = false;
                            base.ajaxCallback(data, function () {
                                that.$dispatch('dialog-save');
                                layer.msg('提交成功', {icon: 1, time: 1000});
                            });
                        });

                    }
                });
            },
            toggleAutoDispatch: function () {
                if (!this.autoDispatch) {
                    layer.open({
                        title: '自动调度设置提示',
                        content: '<span>  开启了自动调度后，系统会根据车辆所绑定的线路以及司机的常用车辆来分配司机和车辆，并在有多条件可选的情况下遵循以下条件进行分配：<br />1、必须满足所有报名人数<br />2、总费用最低<br />3、价格相同的情况下，选择座位数最多的车。<br />以上3条件按顺序排优先级。默认所有车辆线路的价格都为0，因此最好所有线路车辆价格都设置好，系统好计算。</span>',
                        btn: ['确认', '取消'],
                        btn1: () => {
                            this.autoDispatch = !this.autoDispatch
                        },
                        btn2: () => {
                        }
                    });
                } else {
                    this.autoDispatch = false
                }
            },
            init: function () {
                //判断是否是第一次进入该新功能或页面从而弹出新功能的提示
                if (localStorage.addBus2PromptFlag == 'true') {
                    let arrObj = [$('#addGoDepartureTimeId'), $('#addReturnDepartureTimeId')];
                    let arrTitle = ['记得点击这里添加去程时间', '可以点击这里添加返程时间',];
                    var promptTypes = ['addBus2PromptFlag',];
                    $.guidance({
                        obj: arrObj,
                        title: arrTitle,
                        flag: promptTypes,
                    });
                }
            },
            close: function () {
                this.$dispatch('dialog-close');
            },
            save: function () {
                if (this.autoDispatch && (+this.autoDispatchTime) < (+this.applyExpiredMinutesInput)) {
                    layer.msg("报名截止时间不能早于自动排班时间", {icon: 2, time: 3000});
                    return;
                }
                if (this.GoDepartureTimeList.length > 0 || this.ReturnDepartureTimeList.length > 0) {
                    $('#J-layer-form').submit();
                } else if (this.GoDepartureTimeList.length == 0 && this.ReturnDepartureTimeList.length == 0) {
                    layer.msg('请至少添加去程出发时间或返程出发时间', {icon: 1, time: 2000});
                } else {
                    layer.msg('请先填写完整信息', {icon: 1, time: 2000});
                }
            },
            addGoDepartureTime: function () {
                if (this.GoDepartureTimeInput) {
                    if (_.includes(this.goTimeList, this.GoDepartureTimeInput)) {
                        layer.msg('不能添加重复时间', {icon: 2, time: 1000});
                        return false;
                    } else {
                        this.GoDepartureTimeList.push({
                            "departure_time": this.GoDepartureTimeInput,
                            "shuttle_type": -10
                        });
                        this.goTimeList.push(this.GoDepartureTimeInput);
                    }
                }
            },
            removeGoDepartureTime: function (index) {
                this.GoDepartureTimeList.splice(index, 1);
                this.goTimeList.splice(index, 1);
                this.clearEditStatus()
            },
            addReturnDepartureTime: function () {
                if (this.ReturnDepartureTimeInput) {
                    if (_.includes(this.returnTimeList, this.ReturnDepartureTimeInput)) {
                        layer.msg('不能添加重复时间', {icon: 2, time: 1000});
                        return false;
                    } else {
                        this.ReturnDepartureTimeList.push({
                            "departure_time": this.ReturnDepartureTimeInput,
                            "shuttle_type": 10
                        });
                        this.returnTimeList.push(this.ReturnDepartureTimeInput);
                    }
                }
                //  this.busStationSetInput = '';
            },
            removeReturnDepartureTime: function (index) {
                this.ReturnDepartureTimeList.splice(index, 1);
                this.returnTimeList.splice(index, 1);
                this.clearEditStatus()
            },
            getTagList: function () {
                this.itemsLoading = true;
                $.ajax({
                    url: base.gAjaxUrl.tagGroup,
                    type: 'GET',
                    data: {
                        type: 3,
                        page: 1,
                        page_size: 999999,
                        flag: 'busline'
                    }
                }).always((data) => {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, () => {
                        this.wTagsArr = data.results || [];
                    });
                });
            },
            getTagIds: function (tagArr) {
                let arr = [];
                for (let i = 0, len = tagArr.length; i < len; i++) {
                    arr.push(tagArr[i].id);
                }
                return arr;
            },

            editDate(item, i, status, dateDom, dateSwitch, allDate) {
                if (!status) {
                    let date = $(`#${dateDom + i}`).val();

                    if (item.departure_time == date) {
                        this[dateSwitch].$set(i, status);
                    } else {
                        if (_.includes(this[allDate], date)) {
                            layer.msg('不能添加重复时间', {icon: 2, time: 1000});
                            return false;
                        }
                        if (item.id) {
                            layer.confirm('设定时间只对未发车辆起效，是否保存？', (index) => {
                                $.ajax({
                                    url: `${base.gAjaxUrl.shuttleBusTime}${item.id}/change_time/`,
                                    type: 'POST',
                                    data: {
                                        departure_time: date,
                                    }
                                }).always((data) => {
                                    base.ajaxCallback(data, () => {
                                        this[allDate].$set(i, date); //添加时间 记录全部已存在时间
                                        item.departure_time = date;
                                        this[dateSwitch].$set(i, status);
                                        layer.msg('修改成功', {icon: 1, time: 1000});
                                        layer.close(index);
                                    });
                                });
                            }, (index) => {
                                layer.close(index);
                                this[dateSwitch].$set(i, status);
                            });
                        } else {
                            layer.confirm('设定时间只对未发车辆起效，是否保存？', (index) => {
                                this[allDate].$set(i, date);
                                item.departure_time = date;
                                this[dateSwitch].$set(i, status);
                                layer.msg('修改成功', {icon: 1, time: 1000});
                                layer.close(index);
                            }, (index) => {
                                layer.close(index);
                                this[dateSwitch].$set(i, status);
                            });
                        }
                    }
                } else {
                    let allDataList = [...this.outDateSwitch].concat([...this.goDateSwitch]);
                    for (let i = 0, len = allDataList.length; i < len; i++) {
                        if (allDataList[i]) {
                            layer.msg('请先保存其他编辑时间', {icon: 2, time: 1000});
                            return false
                        }
                    }
                    this.editIndex = i;
                    this.editType = dateDom;
                    this[dateSwitch].$set(i, status);
                    this.$nextTick(() => {
                        $(`#${dateDom + i}`).datetimepicker({
                            datepicker: false,
                            format: 'H:i',
                            step: 5,
                            value: item.departure_time
                        });
                    })
                }
            },
            clearEditStatus() {
                if(this.editType === 'goDate'){
                    this.goDateSwitch.$set(this.editIndex,false)
                }else{
                    this.outDateSwitch.$set(this.editIndex,false)
                }
            },
        },
        components: {
            tags: tags,
        }

    }
</script>

<style lang="less" scoped rel="stylesheet/less" type="text/less">
    .layer-add-bus {
        .station-item {
            width: 80px;
            display: inline-block;
            border: none;
            background: none;
            line-height: 19px;
            height: 19px;
        }

        &.layui-layer.layui-layer-page .layui-layer-content {
            padding-bottom: 150px;
        }
    }

    .message {
        text-align: left;
        cursor: pointer;

        &:hover {
            .message-box {
                display: block;
            }
        }

        .message-box {
            display: none;
            color: white;
            position: absolute;
            left: 50%;
            top: 30px;
            padding: 10px;
            width: 400px;
            background: #088cb7;
            -moz-border-radius: 12px;
            -webkit-border-radius: 12px;
            border-radius: 12px;
            z-index: 999;
            transform: translateX(-50%);
            transition: all 0.2s ease;

            &.dispatchBus {
                width: 600px;
            }

            &:before {
                position: absolute;
                content: "";
                width: 0;
                height: 0;
                left: 50%;
                top: -20px;
                transform: translateX(-50%);
                border-top: 13px solid transparent;
                border-right: 26px solid transparent;
                border-left: 26px solid transparent;
                border-bottom: 13px solid #088cb7;
            }
        }

        i {
            line-height: 20px;
            font-size: 20px;
            width: 24px;
            height: 24px;
            display: block;
        }
    }

    .no-border {
        border: none;
    }
</style>
