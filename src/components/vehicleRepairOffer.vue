<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">{{title}}</div>
        <div class="layui-layer-content flex">
            <div class="flex-1">
                <div class="w-400 mt-10-auto">
                    <div class="clearfix pt-10 pb-10 bor-b">
                        <div class="fw-b f-16 f-l">申请信息:</div>
                        <div class="f-r">
                            <span class="mr-10 fc-999">车辆锁定:</span><img class="w-20"
                                                                        v-bind:src="data.vehicle_vo.locked?'./src/assets/images/lock_close.png':'./src/assets/images/lock_open.png'">
                        </div>
                    </div>
                    <div class="flex lh-30 mt-10">
                        <div class="flex-1">
                            <div>
                                <span class="mr-10">申请人:</span>{{data.staff_vo.real_name}}
                            </div>
                            <div>
                                <span class="mr-10">电&emsp;话:</span>{{data.staff_vo.phone}}
                            </div>
                            <div>
                                <span class="mr-10">工&emsp;号:</span>{{data.staff_vo.job_number}}
                            </div>
                            <div>
                                <span class="mr-10">部&emsp;门:</span>{{data.staff_vo.department_vo.department_name}}
                            </div>
                            <div>
                                <span class="mr-10">职&emsp;位:</span>{{data.staff_vo.position}}
                            </div>
                        </div>
                        <div class="flex-1">
                            <div>
                                <span class="mr-10">车&emsp;牌:</span>{{data.vehicle_vo.car_no}}
                            </div>
                            <div>
                                <span class="mr-10">品&emsp;牌:</span>{{data.vehicle_vo.car_brand}}
                            </div>
                            <div>
                                <span class="mr-10">型&emsp;号:</span>{{data.vehicle_vo.car_model}}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-400 mt-10-auto">
                    <div class="clearfix pt-10 pb-10 bor-b">
                        <div class="fw-b f-16 f-l">维修信息:</div>
                        <div class="f-r fc-999">
                            <span class="mr-10">订单状态:</span>{{data.status_name}}
                        </div>
                    </div>
                    <div class="clearfix mt-10">
                        <div class="f-l mr-10 fc-999">维修/故障项目:</div>
                        <div class="f-l"><span v-for="item in data.fault_item_vos">{{item.fault_name}}<span
                                v-if="data.fault_item_vos.length-1>0">/</span></span></div>
                    </div>
                    <div class="">
                        <div class="fc-999 pt-10 pb-10">维修/故障描述:</div>
                        <p>{{data.fault_desc?data.fault_desc:'--'}}</p>
                    </div>
                    <div v-if="data.image_urls.length>0">
                        <img v-for="img in data.image_urls" class="descImg" v-bind:src="img" v-on:click="clickImg(img)">
                    </div>
                </div>
            </div>
            <div class="flex-1">
                <div class="w-400 mt-10-auto">
                    <div class="clearfix pt-10 pb-10 bor-b">
                        <div class="fw-b f-16 f-l">供应商及报价:</div>
                    </div>
                    <div class="flex mt-10">
                        <form id="J-layer-form" class="flex-1 price">
                            <div class="flex mb-10 relative">
                                <div class="flex-1 text-r lh-30">供应商:</div>
                                <div class="flex-1 ml-10 mr-10 priceInput"><input type="text" class="input-text"
                                                                                  name="supplier"
                                                                                  v-model="supplierInput"
                                                                                  placeholder="请输入供应商名称"></div>
                            </div>
                            <div class="flex mb-10 relative">
                                <div class="flex-1 text-r lh-30">报&emsp;价:</div>
                                <div class="flex-1 ml-10 mr-10 priceInput"><input type="text" class="input-text"
                                                                                  name="amount" v-model="amountInput"
                                                                                  placeholder="请输入价格"></div>
                            </div>
                        </form>
                        <div class="flex-1">
                            <i class="icon icon-plus mt-20 cursor-p" v-on:click="clickSavePrice()"></i>
                        </div>
                    </div>
                </div>
                <div class="w-400 mt-10-auto">
                    <div class="clearfix pt-10 pb-10 bor-b">
                        <div class="fw-b f-16 f-l">报价情况:</div>
                    </div>
                    <div class="mt-10 mb-10 fc-0099fa">临界金额:{{vehicleRepairrules[0].crucial_amount}}元，普通审批&lt;{{vehicleRepairrules[0].crucial_amount}}元，高级审批&gt;={{vehicleRepairrules[0].crucial_amount}}元。</div>
                    <div class="">
                        <div class="flex mb-10 price" v-for="price in prices"
                             v-bind:class="[price.id==selectedPriceId?'selected':'']">
                            <i class="icon icon-minus cursor-p mt-10" v-on:click="deletePrice(price.id)"></i>
                            <div class="priceItem clearfix">
                                <div class="f-l f-12 supplier">{{price.supplier}}</div>
                                <div class="f-r w-100 text-c bor-l fc-0099fa">{{price.amount}}元</div>
                            </div>
                            <i class="Hui-iconfont fs-34 fc-0099fa lh-42 cursor-p selectedIcon">&#xe6a8;</i>
                            <i class="Hui-iconfont fs-34 fc-0099fa lh-42 cursor-p unselectedIcon"
                               v-on:click="selectPrice(price)">&#xe608;</i>
                        </div>
                        {{elems}}
                    </div>
                    <div class="mt-10">
                        <div class="mt-10 mb-10">备&emsp;注(必填):</div>
                        <textarea class="textarea" name="" id="" cols="30" rows="10" placeholder="请输入选择该报价的原因(100字以内)"
                                  v-model="selectedPriceRemark"></textarea>
                    </div>
                    <div class="text-r">
                        <a class="btn btn-primary radius pl-30 pr-30" title="提交报价" href="javascript:;" class="ml-5"
                           v-on:click="setPrice()">提交报价</a>
                    </div>
                </div>
            </div>
        </div>
    <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
    </div>
    <div class="layui-layer-shade"></div>
</template>

<style lang="less" scoped>
    .layui-layer.layui-modify {
        width: 950px;
    }

    .descImg {
        width: 120px;
        height: 120px;
        border-radius: 4px;
        margin-right: 10px;
        margin-bottom: 10px;
        overflow: hidden;
        display: inline-block;
        cursor: pointer;
    }

    .icon {
        display: inline-block;
    }

    .icon-plus {
        width: 34px;
        height: 34px;
        background: url('../assets/images/icon-plus.png') no-repeat center center;
        background-size: 100%;
    }

    .icon-minus {
        width: 28px;
        height: 28px;
        background: url('../assets/images/icon-minus.png') no-repeat center center;
        background-size: 100%;
    }

    .price {
        width: 330px;
    }

    .priceInput {
        width: 250px;
    }

    .indexIcon {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 1px solid #eee;
        background-color: #dddfde;
        line-height: 30px;
        text-align: center;
        margin-top: 6px;
    }

    .priceItem {
        width: 294px;
        min-height: 34px;
        background-color: #f9f9f9;
        border: 1px solid #eee;
        line-height: 34px;
        padding: 5px 10px;
        margin: 0 10px;
    }

    .priceItem .supplier {
        width: 183px;
    }

    .selectedIcon {
        display: none;
    }

    .selected .selectedIcon {
        display: inline-block;
    }

    .selected .unselectedIcon {
        display: none;
    }

    .btn.pr-30 {
        padding-right: 30px;
    }

    .btn.pl-30 {
        padding-left: 30px;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';

    let ajaxUrl = '';

    export default{
        ready () {
            let that = this;

            base.verticalCenter('.layui-modify');

            this.getPriceList();
            this.getVehiclerepairrule();

            //验证
            $.validator.addMethod('signlessInteger', function (value, element) {
                var length = value.length;
                var reg = /^[1-9]\d*$/;
                return this.optional(element) || reg.test(value);
            }, '请输入正整数');
            $('#J-layer-form').validate({
                rules: {
                    supplier: {
                        required: true,
                    },
                    amount: {
                        required: true,
//                       signlessInteger: true,
                        twoDecimal: true,
                    },
                },
                submitHandler: function () {
                    let ajaxData = {
                        supplier: that.supplierInput,
                        amount: that.amountInput,
                    };
                    $.ajax({
                        url: `${base.gAjaxUrl.vehiclerepairorders}${that.data.id}/price_info/`,
                        type: 'POST',
                        async: false,
                        contentType: 'application/json',
                        data: JSON.stringify(ajaxData),
                    }).always(function (data) {
                        clearTimeout(that.timeoutId);
                        that.isAddingPrice = false; // 验证报错的时候这里没法执行
                        base.ajaxCallback(data, function () {
                            //layer.msg('提交成功',{icon:1,time:1000});
                            that.onePrice = data;
                            that.getPriceList();
                            that.supplierInput = '';
                            that.amountInput = '';
                        });
                    });
                }
            });
        },
        props: ['title', 'type', 'data'],
        data: function () {
            return {
                supplierInput: '',
                amountInput: '',
                prices: [],
                vehicleRepairrules: [
                    {
                        crucial_amount: 0
                    }
                ],
                selectedPriceId: '',
                selectedPriceAmount: 0,
                selectedPriceRemark: '',
                elems: '',
                isAddingPrice: false,
                timeoutId: 0,
                onePrice:"",
            }
        },
        methods: {
            close: function () {
                this.$dispatch('dialog-close');
            },
            clickImg: function (url) {
                layer.open({
                    title: '故障描述',
                    content: `<img src="${url}" style="width:280px;height:auto">`,
                });
            },
            clickSavePrice: function (callback=function(){}) {
                let that = this;
                if (that.isAddingPrice) {
                    return
                }
                that.isAddingPrice = true;
                that.timeoutId = setTimeout(function () { // 验证出错，1s后才可以重新提交
                    that.isAddingPrice = false;
                }, 1000);
                $('#J-layer-form').submit();
            },
            getPriceList: function () {
                let that = this;
                $.ajax({
                    url: `${base.gAjaxUrl.vehiclerepairorders}${that.data.id}/price_info/`,
                    type: 'GET',
                })
                        .always((data)=> {
                            base.ajaxCallback(data, ()=> {
                                let resultData = data;
                                $.each(resultData, function (index, data) {
                                    data.index = index;
                                });
                                this.prices = resultData;
                            })
                        })
            },
            getVehiclerepairrule: function () {
                $.ajax({
                    url: base.gAjaxUrl.vehicleRepairrule,
                    type: 'GET',
                }).always((data)=> {
                    base.ajaxCallback(data, ()=> {
                        let resultData = data;
                        if (resultData && resultData.length != 0) {
                            this.vehicleRepairrules = resultData;
                        }
                    });
                })
            },
            selectPrice: function (price) {
                this.selectedPriceId = price.id;
                this.selectedPriceAmount = price.amount;
            },
            deletePrice: function (id) {
                let that = this;
                $.ajax({
                    url: `${base.gAjaxUrl.vehiclerepairorders}${this.data.id}/price_info/`,
                    type: 'DELETE',
                    data: {
                        price_info: id
                    }
                }).always(function (data) {
                    if (id === that.selectedPriceId) {
                        that.selectedPriceId = '';
                        that.selectedPriceAmount = 0;
                    }
                    base.ajaxCallback(data, function () {
                        layer.msg('删除成功', {icon: 2, time: 1000});
                        that.getPriceList();
                    });
                });
            },
            setPrice: function () {
                let that = this;
                this.selectedPriceRemark = $.trim(this.selectedPriceRemark)
                if (this.selectedPriceRemark.length == 0) {
                    layer.msg('请填写备注', {icon: 2, time: 1000});
                    return;
                } else if (this.selectedPriceRemark.length > 100) {
                    layer.msg('备注信息不能超过100个字', {icon: 2, time: 1000});
                    return;
                }
                let ajaxData = {};
                if (that.prices.length < 1) {
                    this.clickSavePrice();
                        ajaxData = {
                            price_info: that.onePrice.id,
                            remark: that.selectedPriceRemark
                        }

                    // layer.msg('请至少添加一家报价', {icon: 2, time: 1000});
                }else{
                    ajaxData = {
                        price_info: that.selectedPriceId,
                        remark: that.selectedPriceRemark
                    }
                }
                $.ajax({
                    url: `${base.gAjaxUrl.vehiclerepairorders}${this.data.id}/set_price/`,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(ajaxData),
                }).always(function (data) {
                    base.ajaxCallback(data, function () {
                        layer.msg('提交成功', {icon: 1, time: 1000});
                        that.$dispatch('dialog-save');
                    });
                });


            },
        },
    }
</script>
