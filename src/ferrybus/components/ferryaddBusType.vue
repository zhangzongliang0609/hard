<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify add_bus_type">
        <div class="layui-layer-title">{{type == 'add' ? '新增' : '修改'}}车辆类型</div>
        <div class="layui-layer-content">
            <form id="J-layer-form-bus-type" class="form form-horizontal layui-layer-wrap">
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>类型名称：</label>
                    <div class="formControls f-l col-4">
                        <input autocomplete="off" v-model="typeInput" type="text" class="input-text" value="" placeholder=""
                               name="type">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4"><span class="c-red">*</span>品牌：</label>
                    <div class="formControls f-l col-4">
                        <input autocomplete="off" v-model="brandInput" type="text" class="input-text" value="" placeholder=""
                               name="brand">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">型号：</label>
                    <div class="formControls f-l col-4">
                        <input autocomplete="off" v-model="modelInput" type="text" class="input-text" value="" placeholder=""
                               name="model">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">颜色：</label>
                    <div class="formControls f-l col-4">
                        <input autocomplete="off" v-model="colorInput" type="text" class="input-text" value="" placeholder=""
                               name="color">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>座位数：</label>
                    <div class="formControls f-l col-4">
                        <input autocomplete="off" v-model="seatsInput" type="text" class="input-text" value="" placeholder=""
                               name="seats">
                    </div>
                </div>

            </form>
        </div>
    <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
        <div class="layui-layer-btn" v-on:click="save"><a class="layui-layer-btn0">保存</a></div>
    </div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
    <div class="layui-layer-shade"></div>
</template>

<script type="text/ecmascript-6">

    import * as base from '../../assets/js/base.js';

    export default{
        ready () {

            base.verticalCenter('.add_bus_type');

            $.validator.addMethod('signlessInteger', function (value, element) {
                return this.optional(element) || /^[1-9]\d*$/.test(value);
            }, '请输入正整数');

            this.initValidate();
        },
        props: ['type', 'data'],
        data: function () {
            return {
                typeInput: '',
                brandInput: '',
                modelInput: '',
                colorInput: '',
                seatsInput: ''
            }
        },
        methods: {
            initValidate: function () {
                let that = this;
                let data = this.data;
                let ajaxUrl = '';
                let ajaxType = '';
                if (that.type == 'add') {
                    ajaxUrl = base.gAjaxUrl.ferryBusType;
                    ajaxType = 'POST';
                } else if (that.type == 'modify') {
                    this.typeInput = data.type_name;
                    this.brandInput = data.car_brand;
                    this.modelInput = data.car_model;
                    this.colorInput = data.car_color;
                    this.seatsInput = data.seats;
                    ajaxUrl = `${base.gAjaxUrl.ferryBusType}${data.id}/`;
                    ajaxType = 'PUT';
                }
                //验证
                $('#J-layer-form-bus-type').validate({
                    rules: {
                        type_name: {
                            required: true,
                        },
                        car_brand: {
                            required: true,
                        },
                        seats: {
                            required: true,
                            signlessInteger: true,
                        },
                    },
                    submitHandler: function () {
                        that.itemsLoading = true;
                        $.ajax({
                            url: ajaxUrl,
                            type: ajaxType,
                            contentType: "application/json",
                            data: JSON.stringify({
                                type_name: that.typeInput,
                                car_brand: that.brandInput,
                                car_model: that.modelInput,
                                car_color: that.colorInput,
                                seats: that.seatsInput,
                            })
                        }).always(function (data) {
                            that.itemsLoading = false;
                            base.ajaxCallback(data, function () {
                                layer.msg('提交成功', {icon: 1, time: 1000});
                                that.$dispatch('dialog-save');
                            });
                        });
                    }
                });

            },
            close: function () {
                this.$dispatch('dialog-close');
            },
            save: function () {
                $('#J-layer-form-bus-type').submit();
            },
        }
    }
</script>

<style lang="less" scoped rel="stylesheet/less">
    .add_bus_type {
        z-index: 200;
    }
    .layui-layer-shade {
        z-index: 199;
    }
    .tag_item_list {
        width: 100%;
        box-sizing: border-box;
        z-index: 2;
        min-height: 40px;
        padding: 3% 3% 6%;
        border-radius: 5px;
        border: 1px solid #ccc;
        background-color: #fff;
        .tag_item {
            /*width: 80px;*/
            width: 28%;
            color: #eee;
            font-size: 14px;
            line-height: 25px;
            margin-left: 3%;
            margin-top: 3%;
            border-radius: 5px;
            background-color: #ff9542;
            text-align: center;
            position: relative;
            cursor: pointer;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding: 0 5px;
            box-sizing: border-box;
            &:hover {
                white-space: normal;
            }
            p {
                width: 100%;
                height: 100%;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            span {
                position: absolute;
                width: 16px;
                height: 16px;
                text-align: center;
                line-height: 12px;
                font-size: 12px;
                border-radius: 50%;
                background-color: #000;
                color: #fff;
                top: -5px;
                right: -5px;
                cursor: pointer;
            }
        }
    }

</style>
