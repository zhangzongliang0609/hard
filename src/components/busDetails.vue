<template>

    <div class="layui-layer layui-anim layui-layer-page layui-modify details-box ">
        <h3 class="layui-layer-title">车辆详情</h3>
        <div class="content-box row cl ">
            <div class="f-l col-6 message ">
                <h4 class="fw-b">【{{data.car_no}}】车辆基本信息</h4>
                <p class="cl">
                    <span class="f-l col-6">车牌号码:</span>
                    <span class="f-r col-6">{{data.car_no || "--"}}</span>
                </p>
                <p class="cl">
                    <span class="f-l col-6">车号:</span>
                    <span class="f-r col-6">{{data.car_flag || "--"}}</span>
                </p>
                <p class="cl">
                    <span class="f-l col-6">设备ID:</span>
                    <span class="f-r col-6">{{data.position_hardware_vo?data.position_hardware_vo.hardware_no:"未绑定定位器"}}</span>
                </p>
                <p class="cl">
                    <span class="f-l col-6">车辆类型:</span>
                    <span class="f-r col-6">{{getTypeInfo(data.car_type_vo, 'type_name')}}</span>
                </p>
                <p class="cl">
                    <span class="f-l col-6">品牌:</span>
                    <span class="f-r col-6">{{getTypeInfo(data.car_type_vo, 'car_brand')}}</span>
                </p>
                <p class="cl">
                    <span class="f-l col-6">型号:</span>
                    <span class="f-r col-6">{{getTypeInfo(data.car_type_vo, 'car_model')}}</span>
                </p>
                <p class="cl">
                    <span class="f-l col-6">颜色:</span>
                    <span class="f-r col-6">{{getTypeInfo(data.car_type_vo, 'car_color')}}</span>
                </p>
                <p class="cl">
                    <span class="f-l col-6">座位数:</span>
                    <span class="f-r col-6">{{getTypeInfo(data.car_type_vo, 'seats')}}</span>
                </p>
                <p class="cl">
                    <span class="f-l col-6">备注:</span>
                    <span class="f-r col-6">{{data.remark || "--"}}</span>
                </p>
                <p class="cl">
                    <span class="f-l col-6">绑定线路:</span>
                    <span class="f-r col-6 text-overflow">{{data.shuttlebus_set | get_shuttle_name}}</span>
                </p>
            </div>
            <div class="f-l col-6 insurance">
                <h4 class="fw-b">详细信息</h4>
                <p class="cl">
                    <span class="f-l col-3">车辆种类:</span>
                    <span class="f-r col-9 text-l">{{data.vehicle_type_name || "--" }}</span>
                </p>
                <p class="cl">
                    <span class="f-l col-3">车辆注册时间:</span>
                    <span class="f-r col-9 text-l">{{data.register_date || "--"}}</span>
                </p>
                <p class="cl">
                    <span class="f-l col-3">发动机号:</span>
                    <span class="f-r col-9 text-l">{{data.engine_no || "--"}}</span>
                </p>
                <p class="cl">
                    <span class="f-l col-3">车驾号:</span>
                    <span class="f-r col-9 text-l">{{data.drive_no || "--"}}</span>
                </p>
                <p class="cl">
                    <span class="f-l col-3">事故情况:</span>
                    <span class="f-r col-9 text-l">{{data.has_accident?"有发生过致人伤亡事故":"未发生过致人伤亡事故"}}</span>
                </p>
                <h4 class="fw-b mt-20">季审,年审,保险,保养</h4>
                <p class="f-r col-12"><img v-if="data.quarterly_rest_days && data.quarterly_rest_days < 30 "
                                           src="../assets/images/warning.png" alt="">季审或领标到期日期:
                    <span class="c-red" v-if="data.quarterly_rest_days == undefined">暂时没有设置日期~</span>
                    <span v-if="data.quarterly_rest_days != undefined">
                        {{data.quarterly_verification_deadline}}
                        <span v-if="data.quarterly_rest_days > 0"
                              v-bind:class="{ 'text-red' : data.quarterly_rest_days <= 30 }">【还有
                           {{data.quarterly_rest_days}}
                            天过期】</span>
                        <span class="text-red" v-if="data.quarterly_rest_days <= 0">【已过期】</span>
                    </span>

                    <a v-if="data.quarterly_verification_deadline != undefined" class="btn btn-primary radius mr-5"
                       href="javascript:;" v-on:click="showUpdate('quarterly')">确认已季审或已领标</a>
                </p>

                <p><img v-if="data.annual_rest_days && data.annual_rest_days < 30 " src="../assets/images/warning.png"
                        alt="">年审或领标到期日期:
                    <span class="c-red" v-if="data.annual_rest_days == undefined">暂时没有设置日期~</span>
                    <span v-if="data.annual_rest_days != undefined">
                        {{data.annual_verification_deadline}}
                        <span v-if="data.annual_rest_days > 0"
                              v-bind:class="{ 'text-red' : data.annual_rest_days <= 30 }">【还有{{data.annual_rest_days}}天过期】</span>
                        <span class="text-red" v-if="data.annual_rest_days <= 0">【已过期】</span>
                    </span>

                    <a v-if="data.annual_verification_deadline != undefined" class="btn btn-primary radius mr-5"
                       href="javascript:;" v-on:click="showUpdate('annual')">确认已年审或已领标</a>
                </p>

                <p><img v-if="data.insurance_rest_days && data.insurance_rest_days < 30 "
                        src="../assets/images/warning.png" alt="">保险到期日期:
                    <span class="c-red" v-if="data.insurance_rest_days == undefined">暂时没有设置日期~</span>
                    <span v-if="data.insurance_rest_days != undefined">
                        {{data.insurance_deadline}}
                        <span v-if="data.insurance_rest_days > 0"
                              v-bind:class="{ 'text-red' : data.insurance_rest_days <= 30 }">【还有{{data.insurance_rest_days}}天过期】</span>
                        <span class="text-red" v-if="data.insurance_rest_days <= 0">【已过期】</span>
                    </span>
                    <a v-if="data.insurance_deadline != undefined" class="btn btn-primary radius mr-5"
                       href="javascript:;" v-on:click="showUpdate('insurance')">确认已续保</a>
                </p>

                <p><img v-if="data.maintenance_rest_days && data.maintenance_rest_days < 30 "
                        src="../assets/images/warning.png" alt="">保养到期日期:
                    <span class="c-red" v-if="data.maintenance_rest_days == undefined">暂时没有设置日期~</span>
                    <span v-if="data.maintenance_rest_days!= undefined">
                        {{data.maintenance_deadline}}
                        <span v-if="data.maintenance_rest_days > 0"
                              v-bind:class="{ 'text-red' : data.maintenance_rest_days <= 30 }">【还有{{data.maintenance_rest_days}}天过期】</span>
                        <span class="text-red" v-if="data.maintenance_rest_days <= 0">【已过期】</span>
                    </span>
                    <a v-if="data.maintenance_deadline != undefined" class="btn btn-primary radius mr-5"
                       href="javascript:;" v-on:click="showUpdate('maintenance')">确认已保养</a>
                </p>

                <div class="insuranceCompany">保险公司:
                    <span v-if="data.insurance_company">{{data.insurance_company}}</span>
                    <span class="c-red" v-else>暂时没有设置保险公司</span>
                </div>
            </div>
        </div>
        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
    </div>

    <div class="layui-layer-shade"></div>

    <quarterly v-on:window-close="cancelUpdate" v-if="show == 'quarterly'" :data="data" :type="type"
               v-on:child-data="updata"></quarterly>
    <annual v-on:window-close="cancelUpdate" v-if="show == 'annual'" :data="data" :type="type"
            v-on:child-data="updata"></annual>
    <insurance v-on:window-close="cancelUpdate" v-if="show == 'insurance'" :data="data" :type="type"
               v-on:child-data="updata"></insurance>
    <maintenance v-on:window-close="cancelUpdate" v-if="show == 'maintenance'" :data="data" :type="type"
                 v-on:child-data="updata"></maintenance>

</template>

<style lang="less" rel="stylesheet/less" scoped>
    #app .details-box {
        height: 90%;
        width: 80%;
        margin-left: -39%;
    }

    #app .content-box {
        width: 80%;
        height: 80%;
        margin: 4% auto;
        border: 1px solid #ccc;
        background: #f2f2f2;
        h5 {
            font-weight: bold;
        }
        .message {
            height: 100%;
            .f-l {
                text-align: right;
            }
            .f-r {
                text-align: left;
                padding-left: 20px;
            }

        }
        .insurance {
            height: 100%;
            padding-left: 20px;
            .f-r.text-l {
                padding-left: 20px;
            }
            p {
                text-align: right;
                padding-right: 20px;
                img {
                    width: 18px;
                    margin-right: 10px;
                }
            }
            .insuranceCompany {
                text-align: center;
            }
            .btn {
                width: 151px;
            }
        }

    }

    .line-block {
        display: inline-block;
    }

    .row > div:nth-child(1) {
        border-right: 1px solid #ccc;
    }

    .f-l p {
        /*line-height: 300%;*/
    }

    .text-red {
        color: red;
        font-weight: 900;
    }
</style>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import quarterly from "./updateQuarterly"
    import annual from "./updateAnnual"
    import insurance from "./updateInsurance"
    import maintenance from "./updateMaintenance"

    export default{
        ready(){
            base.verticalCenter('.layui-modify');
        },
        props: ["data", "port"],
        data: function () {
            return {
                isShowQuarterly: false,
                isShowAnnual: false,
                isShowInsurance: false,
                isShowMaintenance: false,
                show: '',
                type:base.gAjaxUrl.shuttlebusvehicles
            }
        },
        methods: {
            close: function () {
                this.$dispatch('dialog-close');
            },
            showUpdate: function (type) {
                this.show = type;

            },
            cancelUpdate: function () {
                this.show = '';
            },
            updata: function (data) {
                this.data = data;
            },
            getTypeInfo: function (item, type) {
                return item && item[type] ? item[type] : '--'
            },
        },
        filters: {
            'get_shuttle_name': function (arr) {
                let str = '';
                arr.forEach((item) => {
                    str += item.shuttle_name + ','
                });
                return str.slice(0, -1)
            }
        },
        components: {
            quarterly,
            annual,
            insurance,
            maintenance
        }
    }
</script>
