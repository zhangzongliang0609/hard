<template>
    <visit_code v-if="isShowQrcode" @dialog-close="closeDialog"></visit_code>
    <section class="Hui-article-box">
        <div class="page-container">
            <div class="panel panel-default radius">
                <div class="panel-body">
                    <span class="f-20 fw-b">预约规则</span>
                </div>
            </div>
            <div class="content-box">
                <form class="form form-horizontal layui-layer-wrap">
                    <div class="row cl">
                        <label class="form-label f-l col-6 ">访客身份证号是否必填：</label>
                        <div class="formControls f-l col-6 mt-3">
                            <div class="f-l col-12 ">
                                <label class="col-4">
                                    <input type="radio" value="true" :checked="visitors_id"
                                           @click="clickLable(true,'visitors_id')">
                                    是
                                </label>
                                <label class="col-4">
                                    <input type="radio" value="true" :checked="!visitors_id"
                                           @click="clickLable(false,'visitors_id')">
                                    否
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="row cl">
                        <label class="form-label f-l col-6 ">随访人员是否开启输入身份证号：</label>
                        <div class="formControls f-l col-6 mt-3">
                            <div class="f-l col-12 ">
                                <label class="col-4">
                                    <input type="radio" value="true" :checked="second_id_switch"
                                           @click="clickLable(true,'second_id_switch')">
                                    是
                                </label>
                                <label class="col-4">
                                    <input type="radio" value="true" :checked="!second_id_switch"
                                           @click="clickLable(false,'second_id_switch')">
                                    否
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="row cl" v-if="second_id_switch">
                        <label class="form-label f-l col-6 ">随访人员身份证号是否必填：</label>
                        <div class="formControls f-l col-6 mt-3">
                            <div class="f-l col-12 ">
                                <label class="col-4">
                                    <input type="radio" value="true" :checked="second_id_form"
                                           @click="clickLable(true,'second_id_form')">
                                    是
                                </label>
                                <label class="col-4">
                                    <input type="radio" value="true" :checked="!second_id_form"
                                           @click="clickLable(false,'second_id_form')">
                                    否
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="row cl">
                        <label class="form-label f-l col-6 ">是否开启执勤人员、来访证编号：</label>
                        <div class="formControls f-l col-6 mt-3">
                            <div class="f-l col-12 ">
                                <label class="col-4">
                                    <input type="radio" value="true" :checked="duty_staff_cardnumber"
                                           @click="clickLable(true,'duty_staff_cardnumber')">
                                    是
                                </label>
                                <label class="col-4">
                                    <input type="radio" value="true" :checked="!duty_staff_cardnumber"
                                           @click="clickLable(false,'duty_staff_cardnumber')">
                                    否
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="row cl" v-if="duty_staff_cardnumber">
                        <label class="form-label f-l col-6 ">执勤人员是否必填：</label>
                        <div class="formControls f-l col-6 mt-3">
                            <div class="f-l col-12 ">
                                <label class="col-4">
                                    <input type="radio" value="true" :checked="duty_staff"
                                           @click="clickLable(true,'duty_staff')">
                                    是
                                </label>
                                <label class="col-4">
                                    <input type="radio" value="true" :checked="!duty_staff"
                                           @click="clickLable(false,'duty_staff')">
                                    否
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="row cl" v-if="duty_staff_cardnumber">
                        <label class="form-label f-l col-6 ">来访证编号是否必填：</label>
                        <div class="formControls f-l col-6 mt-3">
                            <div class="f-l col-12 ">
                                <label class="col-4">
                                    <input type="radio" value="true" :checked="duty_cardnumber"
                                           @click="clickLable(true,'duty_cardnumber')">
                                    是
                                </label>
                                <label class="col-4">
                                    <input type="radio" value="true" :checked="!duty_cardnumber"
                                           @click="clickLable(false,'duty_cardnumber')">
                                    否
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="row cl text-c" style="margin-top:30px">
                        <a class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="save()"> 确认提交</a>
                        <a class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="showQrcode"> 访客二维码</a>
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>

<style scoped lang="less" rel="stylesheet/less">
    .mt-3 {
        margin-top: 3px;
    }

    .content-box {
        margin-top: 10px;
        padding-bottom: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
    }

</style>
<script>
    import * as base from '../assets/js/base.js';
    import visit_code from '../components/visitCode'

    export default {
        ready() {
            this.getConfig();
        },
        //动态传值
        props: [],
        data: function () {
            return {
                isShowQrcode: false,

                visitors_id: false,
                second_id_switch: false,
                second_id_form: false,
                duty_staff_cardnumber: false,
                duty_staff: false,
                duty_cardnumber: false,
            }
        },
        methods: {
            getConfig: function () {
                $.showLoading();
                $.ajax({
                    url: base.gAjaxUrl.visitorconfig,
                    type: "GET",
                    // data:{module:"visitrecord",}
                }).always((data) => {
                    $.hideLoading();
                    base.ajaxCallback(data, () => {
                        this.visitors_id = data.visitors_id;                     //访客身份证号是否必填
                        this.second_id_switch = data.second_id_switch;           //随访人员是否开启输入身份证号
                        this.second_id_form = data.second_id_form;                   //随访人员身份证号是否必填

                        this.duty_staff_cardnumber = data.duty_staff_cardnumber;        //是否开启执勤人员、来访证编号
                        this.duty_staff = data.duty_staff;                       //	是否开启执勤人员
                        this.duty_cardnumber = data.duty_cardnumber;             //是否开启来访证编号

                        // this.duty_carnumber_form = data.duty_carnumber_form;   //执勤人员来访编号是否必填
                    })
                })
            },
            clickLable: function (flag, key) {
                this[key] = flag;
            },
            save: function () {
                $.showLoading();
                let data = {
                    visitors_id:this.visitors_id,
                    second_id_switch:this.second_id_switch,
                    second_id_form:this.second_id_form,
                    duty_staff_cardnumber:this.duty_staff_cardnumber,
                    duty_staff:this.duty_staff,
                    duty_cardnumber:this.duty_cardnumber,
                };
                $.ajax({
                    url: base.gAjaxUrl.visitorconfig,
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(data)
                }).always((data) => {
                    $.hideLoading();
                    base.ajaxCallback(data, () => {
                        layer.msg("提交成功", {icon: 1, time: 2000});
                        this.getConfig();
                    })
                })
            },
            showQrcode: function () {
                this.isShowQrcode = true;
            },
            closeDialog: function () {
                this.isShowQrcode = false;
            },
        },
        filters: {},
        components: {
            visit_code,
        }
    }

</script>


