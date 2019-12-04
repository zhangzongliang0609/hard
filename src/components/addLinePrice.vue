<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify add_bus_type">
        <div class="layui-layer-title">{{type == 'add' ? '新增' : '修改'}}线路价格</div>
        <div class="layui-layer-content">
            <form id="J-layer-form-line-price" class="form form-horizontal layui-layer-wrap">
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>线路名称：</label>
                    <div class="formControls f-l col-4">
                        <div class="department_select_container" @mouseleave="lineEnter(false)" @mouseenter="lineEnter(true)">
                            <input v-if="types.length === 0 && type === 'add'" disabled type="text" class="input-text" value="无可选择类型">
                            <input v-else autocomplete="off" @click="lineClick($event)" v-model="shuttle_name" type="text" class="input-text" value="" placeholder="" name="shuttle_name">
                            <i v-show="shuttle_name !== ''" class="empty-icon Hui-iconfont" @click="emptyLineSearch($event)">&#xe60b;</i>
                            <div class="departmentListBox line_box" style="display: none">
                                <div v-bind:title="item.shuttle_name" v-for="item in lines | filterBy shuttle_name in 'shuttle_name'" @click="setLineValue(item)" class="departmentListItem">{{item.shuttle_name}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4"><span class="c-red">*</span>车辆类型：</label>
                    <div class="formControls f-l col-4">
                        <div class="department_select_container" @mouseleave="typeEnter(false)" @mouseenter="typeEnter(true)">
                            <input v-if="types.length === 0 && type === 'add'" disabled type="text" class="input-text" value="无可选择类型">
                            <input v-else autocomplete="off" @click="typeClick($event)" v-model="type_name" type="text" class="input-text" value="" placeholder="" name="type_name">
                            <i v-show="type_name !== ''" class="empty-icon Hui-iconfont" @click="emptyTypeSearch($event)">&#xe60b;</i>
                            <div class="departmentListBox type_box" style="display: none">
                                <div v-bind:title="item.type_name" v-for="item in types | filterBy type_name in 'type_name'" @click="setTypeValue(item)" class="departmentListItem">{{item.type_name}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">品牌：</label>
                    <div class="formControls f-l col-4">
                        <input autocomplete="off" v-model="car_brand" disabled type="text" class="input-text" value="" placeholder=""
                               name="car_brand">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">型号：</label>
                    <div class="formControls f-l col-4">
                        <input autocomplete="off" v-model="car_model" disabled type="text" class="input-text" value="" placeholder=""
                               name="car_model">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">颜色：</label>
                    <div class="formControls f-l col-4">
                        <input autocomplete="off" v-model="car_color" disabled type="text" class="input-text" value="" placeholder=""
                               name="car_color">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">座位数：</label>
                    <div class="formControls f-l col-4">
                        <input autocomplete="off" v-model="seats" disabled type="text" class="input-text" value="" placeholder=""
                               name="seats">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>去程价格：</label>
                    <div class="formControls f-l col-4">
                        <input autocomplete="off" v-model="to_price" type="text" class="input-text" value="" placeholder=""
                               name="to_price">
                    </div>
                    <label class="form-label f-l col-4 clearfix">
                        <div class="ml-5 f-l">元</div>
                    </label>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>返程价格：</label>
                    <div class="formControls f-l col-4">
                        <input autocomplete="off" v-model="back_price" type="text" class="input-text" value="" placeholder=""
                               name="back_price">
                    </div>
                    <label class="form-label f-l col-4 clearfix">
                        <div class="ml-5 f-l">元</div>
                    </label>
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

    import * as base from '../assets/js/base.js';

    export default{
        ready () {

            base.verticalCenter('.add_bus_type');
            // 两位小数验证
            $.validator.addMethod("two_decimal", function (value, element, param) {
                return this.optional(element) || /^\d+\.{0,1}\d{0,2}$/.test(value);
            }, $.validator.format("请输入正两位小数"));

            this.initValidate();
            this.init();
        },
        props: ['type', 'data'],
        data: function () {
            return {
                shuttle_name: '', // 线路名称
                type_name: '', // 车辆类型名称
                car_brand: '', // 车辆品牌
                car_model: '', // 车辆类型
                car_color: '', // 车辆颜色
                seats: '', // 座位数
                to_price: '', // 去程价格
                back_price: '', // 返程价格
                lines: [], // 线路选择
                isLineFocus: false, // 线路输入框获取焦点
                types: [], // 车辆类型列表
                currentCarType: {}, // 当前选中的车辆类型列表
                isTypeFocus: [], // 车辆类型输入框获取焦点
            }
        },
        methods: {
            init: function () {
                this.getTypes();
                this.getLines();
            },
            initValidate: function () {
                let that = this;
                let data = this.data;
                let ajaxUrl = '';
                let ajaxType = '';
                if (this.type == 'add') {
                    ajaxUrl = base.gAjaxUrl.lineprice;
                    ajaxType = 'POST';
                } else if (this.type == 'modify') {
                    this.currentCarType = data.car_type_vo || {};
                    this.shuttle_name = data.shuttle_name;
                    this.to_price = Math.round(data.to_price / 100);
                    this.back_price = Math.round(data.back_price / 100);
                    ajaxUrl = `${base.gAjaxUrl.lineprice}${data.id}/`;
                    ajaxType = 'PUT';
                }
                //验证
                $('#J-layer-form-line-price').validate({
                    rules: {
                        to_price: {
                            required: true,
                            two_decimal: true,
                        },
                        back_price: {
                            required: true,
                            two_decimal: true,
                        },
                    },
                    submitHandler: function () {
                        let bus = that.getLineId(that.shuttle_name);
                        let type = that.getTypeId(that.type_name);
                        if(bus == '') {
                            layer.msg('请选择正确的线路名称', {icon: 2, time: 1500});
                            return
                        }
                        if(type == '') {
                            layer.msg('请选择正确的车辆类型', {icon: 2, time: 1500});
                            return
                        }
                        that.itemsLoading = true;
                        $.ajax({
                            url: ajaxUrl,
                            type: ajaxType,
                            contentType: "application/json",
                            data: JSON.stringify({
                                shuttle_bus: bus,
                                car_type: type,
                                to_price: parseFloat(that.to_price) * 100,
                                back_price: parseFloat(that.back_price) * 100
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
            // 获取所有线路
            getLines: function () {
                $.ajax({
                    url: base.gAjaxUrl.shuttlebuses3,
                    type: "GET",
                    data: {
                        page: 1,
                        page_size: 999999
                    }
                }).always((data) => {
                    base.ajaxCallback(data, () => {
                        this.lines = data.results || [];
                    })
                });
            },
            // 获取车辆类型
            getTypes: function () {
                $.ajax({
                    url: base.gAjaxUrl.bustypes,
                    type: 'GET',
                    data: {
                        page: 1,
                        page_size: 999999
                    }
                }).always((data)=> {
                    base.ajaxCallback(data, ()=> {
                        this.types = data.results || [];
                    });
                })
            },
            // 线路搜索 -- 开始
            lineEnter: function (flag) {
                this.isTypeFocus = flag;
                !flag && $(".line_box").hide();
            },
            lineClick: function (e) {
                if(this.isTypeFocus) {
                    $(e.target).nextAll(".line_box").show();
                }
            },
            emptyLineSearch:function(e){
                this.shuttle_name = '';
                $(e.target).nextAll(".line_box").show();
            },
            setLineValue: function (item) {
                this.shuttle_name = item.shuttle_name;
                $(".departmentListBox").hide();
            },
            getLineId: function (val) {
                var id = '';
                this.lines.forEach(function (item) {
                    if(item.shuttle_name == val) {
                        id = item.id;
                    }
                });
                return id;
            },
            // 线路搜索 -- 结束
            // 车辆类型搜索 -- 开始
            typeEnter: function (flag) {
                this.isLineFocus = flag;
                !flag && $(".type_box").hide();
            },
            typeClick: function (e) {
                if(this.isLineFocus) {
                    $(e.target).nextAll(".type_box").show();
                }
            },
            emptyTypeSearch:function(e){
                this.type_name = '';
                this.currentCarType = {};
                $(e.target).nextAll(".type_box").show();
            },
            setTypeValue: function (item) {
                this.type_name = item.type_name;
                this.currentCarType = item;
                $(".departmentListBox").hide();
            },
            getTypeId: function (val) {
                var id = '';
                this.types.forEach(function (item) {
                    if(item.type_name == val) {
                        id = item.id;
                    }
                });
                return id;
            },
            // 车辆类型搜索 -- 结束
            close: function () {
                this.$dispatch('dialog-close');
            },
            save: function () {
                $('#J-layer-form-line-price').submit();
            },
        },
        watch: {
            'currentCarType': function (n, o) {
                this.type_name = n.type_name;
                this.car_brand = n.car_brand;
                this.car_model = n.car_model;
                this.car_color = n.car_color;
                this.seats = n.seats;
            }
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
