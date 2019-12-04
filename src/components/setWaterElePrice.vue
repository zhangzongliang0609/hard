<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">{{title}}</div>
        <div class="layui-layer-content">
            <div class="w-600 mt-0-auto">
                <form id="J-layer-form" class="clearfix waterElePrice">
                    <div class="f-l w-250 relative">
                        <img src="../assets/images/icon-electricity.png" height="20" width="13" alt="">
                        <span>电单价：</span>
                        <input v-model="electricityPriceInput" type="text" class="input-text w-110" value=""
                               placeholder="输入金额" name="electricity_price">
                        <span>元/度</span>
                    </div>
                    <div class="f-l w-250 relative">
                        <img src="../assets/images/icon-water.png" height="20" width="14" alt="">
                        <span>水单价：</span>
                        <input v-model="waterPriceInput" type="text" class="input-text w-110" value=""
                               placeholder="输入金额" name="water_price">
                        <span>元/m³</span>
                    </div>
                    <a class="btn btn-primary radius fs-12 f-r" v-if="type!='check'" v-on:click="save">应用到所有楼</a>
                </form>
                <div class="maxh-465 overflow-y-auto">
                    <form id="J-layer-form-list" class="f-l clearfix water_ele">
                        <table class="table table-border table-bordered table-bg table-striped bor-l bor-r mt-20">
                            <thead class="text-c">
                            <tr>
                                <th width="80">楼</th>
                                <th width="120">电单价(元/度)</th>
                                <th width="120">水单价(元/m³)</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="text-c" v-for="item in buildings">
                                <td>{{item.building_name}}</td>
                                <td class="relative water_ele_td">
                                    <div>
                                        <input type="text" :class="'electricity electricity' + item.id" class="input-text w-110" value="{{item.water_ele_price?item.water_ele_price.electricity_price:''}}" placeholder="请输入金额" :name="'electricity' + item.id">
                                    </div>
                                </td>
                                <td class="relative water_ele_td">
                                    <div>
                                        <input type="text" :class="'water water' + item.id" class="input-text w-110" value="{{item.water_ele_price?item.water_ele_price.water_price:''}}" placeholder="请输入金额" :name="'water' + item.id">
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
                <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
                <div class="layui-layer-btn mt-10 confirm" v-if="!noData">
                    <a class="layui-layer-btn0 " v-if="type!='check'" v-on:click="savePrices">确认</a>
                </div>
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
    .water_ele {
        width: 100%;
    }
</style>
<style lang="less" rel="stylesheet/less">
    #J-layer-form.waterElePrice .w-250 label.error {
        right: 64px;
        top: 30px;
    }
    .water_ele_td label.error {
        position: absolute;
        right: 48%;
        top: 12px;
    }
    .confirm{
        position: fixed;
        right:20px;
        bottom:20px;
    }
    .maxh-465{
        max-height: 465px;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';

    export default{
        ready () {
            let that = this;

            base.verticalCenter('.layui-modify');

            this.getBuildingsList();

            $.validator.addMethod('floatNum', function (value, element) {
                var reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$|^0$/;
                return this.optional(element) || reg.test(value);
            }, '请输入正确的金额');

            // 验证
            $('#J-layer-form').validate({
                rules: {
                    electricity_price: {
                        required: true,
                        floatNum: true,
                    },
                    water_price: {
                        required: true,
                        floatNum: true,
                    }
                },
                submitHandler: function () {
                    if(this.isFormInit) return;
                    $(".water_ele .electricity").val(that.electricityPriceInput);
                    $(".water_ele .water").val(that.waterPriceInput);
                }
            });
        },
        props: ['title', 'type', 'data'],
        data: function () {
            return {
                noData: false,
                itemsLoading: false,
                buildings: [],
                electricityPriceInput: '',
                waterPriceInput: '',
                prices: [],
                flag: false,
                isComponentDestroy: false, // 当前组件是否已经被摧毁
                isFormInit: false,
            }
        },
        methods: {
            close: function () {
                this.$dispatch('dialog-close');
            },
            save: function () {
                $('#J-layer-form').submit();
            },
            savePrices: function () {
                if(this.isFormInit) {
                    $('#J-layer-form-list').submit();
                }
            },
            //获取宿舍楼列表
            getBuildingsList: function (callback = function () {}) {
                this.itemsLoading = true;
                let ajaxData = {
                    param: {
                        page: 1,
                        page_size: 999999,
                    }
                };
                $.ajax({
                    url: base.gAjaxUrl.buildings,
                    type: 'GET',
                    data: ajaxData.param
                }).always((data)=> {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=> {
                        let resultData = data.results;
                        // 如果水电价格对象为null,则初始化一个对象防止报错
                        for (let i = 0, l = resultData.length; i < l; i++) {
                            if (!resultData[i].water_ele_price) {
                                resultData[i].water_ele_price = {
                                    electricity_price: '',
                                    water_price: '',
                                }
                            }
                        }
                        this.buildings = resultData;
                        if (resultData && resultData.length) {
                            this.buildingsId = resultData[0].id;
                            this.noData = false;
                            //回调
                            //callback();
                        } else {
                            this.noData = true;
                        }
                        // 水电单价表表单验证时间注册完成之后才能结束动画，才允许其他操作
                        this.itemsLoading = true;
                        this.$nextTick(() => {
                            if(this.isComponentDestroy) return;
                            this.initForm();
                            base.calTableWidth(".water_ele table");
                            this.itemsLoading = false;
                        })
                    });
                })
            },
            initForm: function () {
                var that = this;
                var buildings = this.buildings;
                if (!buildings.length) return;
                var rulesJ = {};
                for (let i = 0, len = buildings.length; i < len; i++) {
                    rulesJ['electricity' + buildings[i].id] = {
                        required:true,
                        floatNum: true,
                    };
                    rulesJ['water' + buildings[i].id] = {
                        required:true,
                        floatNum: true,
                    };
                }
                //验证表单头部
                $('#J-layer-form-list').validate({
                    rules: rulesJ,
                    submitHandler: function () {
                        that.itemsLoading = true;
                        that.isFormInit = false;
                        var buildings = that.buildings;
                        var valArr = [];
                        $.each(buildings, function (j, building) {
                            var electricity_price = $(".water_ele .electricity" + building.id).val();
                            var water_price = $(".water_ele .water" + building.id).val();
                            if(electricity_price === '' && water_price === '') return;
                            valArr.push({
                                building: building.id,
                                electricity_price: electricity_price, // 服务器存储以分为单位
                                water_price: water_price, // 服务器存储以分为单位
                            });
                        });
                        console.log(valArr);
                        $.ajax({
                            url: `${base.gAjaxUrl.waterElePrice}bulk_set/`,
                            type: 'POST',
                            contentType: "application/json",
                            data: JSON.stringify({buildings: valArr}),
                        }).always((data)=> {
                            that.itemsLoading = false;
                            base.ajaxCallback(data, ()=> {
                                that.$dispatch("dialog-save");
                            })
                        });
                    }
                });
                this.isFormInit = true;
            },
        },
        beforeDestroy: function () {
            this.isComponentDestroy = true;
        }
    }
</script>
