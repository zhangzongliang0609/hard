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
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>出发时间：</label>
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
                        <div class="fl mb-5 mr-5 btn radius size-S"
                             v-for="(index,item) in GoDepartureTimeList">
                            <input type="text" class="J-go-time-item station-item"
                                   v-if="goDateSwitch[index]"
                                   :id="`goDate${index}`"
                                   value="00:00"
                                   autocomplete="off"/>
                            <input class="J-go-time-item station-item"
                                   v-else type="text"
                                   :value="item.departure_time"
                                   :id="item.id"
                                   disabled="disabled"
                                   autocomplete="off">

                            <span class="ml-5 btn btn-link size-MINI" v-if="goDateSwitch[index]"
                                  @click="editDate(item,index,false,'goDate','goDateSwitch')">保存</span>
                            <span class="ml-5 btn btn-link size-MINI" v-else
                                  @click="editDate(item,index,true,'goDate','goDateSwitch')">编辑</span>
                            <i class="f-14 Hui-iconfont" v-on:click="removeGoDepartureTime($index)">&#xe706;</i>
                        </div>
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
</template>

<script type="text/ecmascript-6">
    import * as base from '../../assets/js/base.js';

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
            base.verticalCenter('.layui-modify');

            /* 新功能引导提示 */
            this.$nextTick(() => {
                this.init();
                this.initValidate();
            });
        },
        //动态传值
        props: ['type', 'data'],
        data: function () {
            return {
                shuttleNameInput: '',
                GoDepartureTimeInput: '00:00',
                ReturnDepartureTimeInput: '00:00',
                GoDepartureTimeList: [],
                goDateSwitch: [],
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
                    ajaxUrl = base.gAjaxUrl.ferryBusLines;
                    ajaxType = 'POST';
                    this.GoDepartureTimeInput = '00:00';
                    this.GoDepartureTimeList = [];
                } else if (this.type == 'modify') {
                    ajaxUrl = `${base.gAjaxUrl.ferryBusLines}${getData.id}/`;
                    ajaxType = 'PUT';
                    this.shuttleNameInput = getData.shuttle_name;
                    this.departureTimeInput = getData.departure_time;
                    this.GoDepartureTimeList = [...getData.bus_times];
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
                    },
                    submitHandler: function () {
                        let ajaxBusTime = [];

                        $('.J-go-time-item').each(function () {
                            ajaxBusTime.push({"departure_time": $(this).val(), "shuttle_type": -10});
                        });
                        $('.J-return-time-item').each(function () {
                            ajaxBusTime.push({"departure_time": $(this).val(), "shuttle_type": 10});
                        });

                        let ajaxData = {
                            shuttle_name: that.shuttleNameInput,
                            shuttletime_set: ajaxBusTime,
//                        departure_time: '00:00',
                        };
                        if (!ajaxBusTime.length) {
                            layer.msg('时间不能为空', {icon: 2, time: 1000});
                            $.hideLoading();
                            return false;
                        }

                        let allDataList = [...that.goDateSwitch];
                        for (let i = 0, len = allDataList.length; i < len; i++) {
                            if (allDataList[i]) {
                                layer.msg('出发时间未保存', {icon: 2, time: 1000});
                                return false
                            }
                        }

                        $.showLoading();
                        $.ajax({
                            url: ajaxUrl,
                            type: ajaxType,
                            contentType: 'application/json',
                            data: JSON.stringify(ajaxData)
                        }).always(function (data) {
                            $.hideLoading();
                            base.ajaxCallback(data, function () {
                                that.$dispatch('dialog-save');
                                layer.msg('提交成功', {icon: 1, time: 1000});
                            });
                        });

                    }
                });
            },
            init: function () {
                //判断是否是第一次进入该新功能或页面从而弹出新功能的提示
                // if (localStorage.addBus2PromptFlag == 'true') {
                //     let arrObj = [$('#addGoDepartureTimeId')];
                //     let arrTitle = ['记得点击这里添加出发时间'];
                //     var promptTypes = ['addBus2PromptFlag',];
                //     $.guidance({
                //         obj: arrObj,
                //         title: arrTitle,
                //         flag: promptTypes,
                //     });
                // }
            },
            close: function () {
                this.$dispatch('dialog-close');
            },
            save: function () {
                if (this.GoDepartureTimeList.length > 0) {
                    $('#J-layer-form').submit();
                } else if (this.GoDepartureTimeList.length == 0) {
                    layer.msg('请至少添加出发时间', {icon: 1, time: 2000});
                } else {
                    layer.msg('请先填写完整信息', {icon: 1, time: 2000});
                }
            },
            addGoDepartureTime: function () {
                if (this.GoDepartureTimeInput) {
                    if (this.GoDepartureTimeList.findIndex(item => item.departure_time === this.GoDepartureTimeInput) > -1) {
                        layer.msg('不能添加重复时间', {icon: 2, time: 1000});
                        return false;
                    } else {
                        this.GoDepartureTimeList.push({
                            "departure_time": this.GoDepartureTimeInput,
                            "shuttle_type": -10
                        });
                    }
                }
            },
            removeGoDepartureTime: function (index) {
                this.GoDepartureTimeList.splice(index, 1);
                this.clearEditStatus()
            },
            getTagIds: function (tagArr) {
                let arr = [];
                for (let i = 0, len = tagArr.length; i < len; i++) {
                    arr.push(tagArr[i].id);
                }
                return arr;
            },
            editDate(item, i, status, dateDom, dateSwitch) {
                if (!status) {
                    console.log(111)
                    let date = $(`#${dateDom + i}`).val();
                    if (item.departure_time != date) {
                        if (this.GoDepartureTimeList.findIndex(item => item.departure_time === date) > -1) {
                            layer.msg('不能添加重复时间', {icon: 2, time: 1000});
                            return false;
                        }
                        if (item.id) {
                            layer.confirm('设定时间只对未发车辆起效，是否保存？', (index) => {
                                $.ajax({
                                    url: `${base.gAjaxUrl.ferryBusTimes}${item.id}/change_time/`,
                                    type: 'POST',
                                    data: {
                                        departure_time: date,
                                    }
                                }).always((data) => {
                                    base.ajaxCallback(data, () => {
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
                            item.departure_time = date;
                            this[dateSwitch].$set(i, status);
                        }
                    } else {
                        this[dateSwitch].$set(i, status);
                    }
                } else {
                    console.log(222)
                    let allDataList = [...this.goDateSwitch];
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
                if (this.editType === 'goDate') {
                    this.goDateSwitch.$set(this.editIndex, false)
                }
            },
        },
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
