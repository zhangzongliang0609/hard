<template>

    <div class="layui-layer layui-anim layui-layer-page layui-modify add_vehicle_container" :class="{'small': !isShowRightPart}">
        <div class="layui-layer-title">{{type == 'add' ? '新增' : '修改'}}车辆信息</div>
        <div class="" id="vehicle_content">
            <form id="J-layer-form" class="form form-horizontal clearfix">
                <div class="f-l col" :class="{'col-4': isShowRightPart, 'col-12': !isShowRightPart}">
                    <div class="title_info clearfix">
                        <div class="f-l tr col-3">
                            <span class="pr-20">基础信息</span>
                        </div>
                        <div class="f-l col-3 col-offset-4">
                            <a v-if="!isShowRightPart" title="展示更多信息" href="javascript:;" class="btn btn-primary radius ml-10" @click="isShowRightPart = true">
                                <i class="Hui-iconfont">&#xe63d;</i>
                            </a>
                            <a v-else href="javascript:;" title="展示基础信息" class="btn btn-primary radius ml-10" @click="isShowRightPart = false">
                                <i class="Hui-iconfont">&#xe67d;</i>
                            </a>
                        </div>
                    </div>
                    <div>
                        <div class="row clearfix">
                            <label class="form-label f-l col-3"><span class="c-red">*</span>车牌</label>
                            <div class="formControls f-l col-6">
                                <input autocomplete="off" v-model="car_no" type="text" class="input-text" value=""
                                       placeholder="" name="car_no"/>
                            </div>
                        </div>
                        <div class="row clearfix">
                            <label class="form-label f-l col-3">车号</label>
                            <div class="formControls f-l col-6">
                                <input autocomplete="off" v-model="car_flag" type="text" class="input-text" value=""
                                       placeholder="" name="car_flag"/>
                            </div>
                        </div>
                        <div class="row clearfix">
                            <label class="form-label f-l col-3"><span class="c-red">*</span>车辆类型</label>
                            <div class="formControls f-l col-6">
                                <div class="department_select_container" @mouseleave="departmentEnter(false)" @mouseenter="departmentEnter(true)">
                                    <input v-if="types.length === 0 && type === 'add'" disabled type="text" class="input-text" value="无可选择类型">
                                    <input v-else autocomplete="off" @click="departmentClick" v-model="type_name" type="text" class="input-text" value="" placeholder="" name="type_name">
                                    <i v-show="type_name !== ''" class="empty-icon Hui-iconfont" @click="emptySearch($event)">&#xe60b;</i>
                                    <div class="departmentListBox" style="display: none">
                                        <div v-bind:title="item.type_name" v-for="item in types | filterBy type_name in 'type_name'" @click="setDepartmentValue(item)" class="departmentListItem">{{item.type_name}}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-3 f-l">
                                <a href="javascript:;" class="btn btn-primary radius ml-10" @click="clickAdd">添加类型</a>
                            </div>
                        </div>
                        <div class="row clearfix">
                            <label class="form-label f-l col-3">品牌</label>
                            <div class="formControls f-l col-6">
                                <input v-model="car_brand" type="text" disabled class="input-text" value="" placeholder=""
                                       name="car_brand">
                            </div>
                        </div>
                        <div class="row clearfix">
                            <label class="form-label f-l col-3">型号</label>
                            <div class="formControls f-l col-6">
                                <input v-model="car_model" type="text" disabled class="input-text" value="" placeholder=""
                                       name="car_model">
                            </div>
                        </div>
                        <div class="row clearfix">
                            <label class="form-label f-l col-3">颜色</label>
                            <div class="formControls f-l col-6">
                                <input v-model="car_color" type="text" disabled class="input-text" value="" placeholder=""
                                       name="car_color">
                            </div>
                        </div>
                        <div class="row clearfix">
                            <label class="form-label f-l col-3">座位数</label>
                            <div class="formControls f-l col-6">
                                <input v-model="seats" type="text" disabled class="input-text" value="" placeholder=""
                                       name="seats">
                            </div>
                        </div>
                        <div class="row clearfix">
                            <label class="form-label f-l col-3">备注</label>
                            <div class="formControls f-l col-6">
                                <textarea v-model="remark" type="text" class="textarea" value=""
                                          placeholder="输入备注(最多50个字符)" name="remark"></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 右半部分上
                 -->
                <div v-show="isShowRightPart" class="f-l col-8">
                    <div class="clearfix">
                        <div class="f-l col-6 col">
                            <div class="title_info clearfix">
                                <div class="f-l tr col-3">
                                    <span class="pr-20">详细信息</span>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="row clearfix">
                                    <label class="form-label f-l col-3">车辆种类</label>
                                    <div class="formControls f-l col-6">
                                        <div v-on:click="vehicle_type = accIndex + 1"
                                             v-bind:class="{'add_vehicle_active' : vehicle_type == accIndex + 1}"
                                             v-for="(accIndex, accItem) in carModelArr" class="add_vehicle_radio_box">
                                            <input id="{{'picked' + accIndex}}" type="radio" value="{{accIndex + 1}}"
                                                   v-model="vehicle_type" name="vehicle_type">
                                            <label for="{{'picked' + accIndex}}" class="pointer">{{accItem}}</label>
                                            <br>
                                        </div>
                                    </div>
                                </div>
                                <div class="row clearfix">
                                    <label class="form-label f-l col-3">车辆注册日期</label>
                                    <div class="formControls f-l col-6">
                                        <input autocomplete="off" v-model="register_date" type="text"
                                               class="input-text Wdate mr-5" id="register_date"
                                               name="register_date">
                                    </div>
                                </div>
                                <div class="row clearfix">
                                    <label class="form-label f-l col-3 ">发动机号</label>
                                    <div class="formControls f-l col-6">
                                        <input v-model="engine_no" type="text" class="input-text" value=""
                                               placeholder=""
                                               name="engine_no">
                                    </div>
                                </div>
                                <div class="row clearfix">
                                    <label class="form-label f-l col-3 ">车架号</label>
                                    <div class="formControls f-l col-6">
                                        <input v-model="drive_no" type="text" class="input-text" value="" placeholder=""
                                               name="drive_no">
                                    </div>
                                </div>
                                <div class="row clearfix">
                                    <label class="form-label f-l col-3">事故情况</label>
                                    <div class="formControls f-l col-6">
                                        <div v-on:click="has_accident = accIndex"
                                             v-bind:class="{'add_vehicle_radio_box': true, 'add_vehicle_active' : has_accident == accIndex}"
                                             v-for="(accIndex, accItem) in carAccidentArr">
                                            <input id="{{'picked_acc' + accIndex}}" type="radio" v-model="has_accident"
                                                   name="has_accident" value="{{accIndex}}">
                                            <label for="{{'picked_acc' + accIndex}}" class="pointer">{{accItem}}</label>
                                            <br>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="f-l col-6 col pl-20">
                            <div class="title_info clearfix">
                                <div class="f-l tr col-3">
                                    <span class="pr-20">详细信息</span>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="row clearfix">
                                    <label class="form-label f-l col-4">季审或领标到期日期</label>
                                    <div class="formControls f-l col-8">
                                        <input autocomplete="off" v-model="quarterly_verification_deadline" type="text"
                                               class="input-text Wdate mr-5" id="quarterly_verification_deadline"
                                               name="quarterly_verification_deadline">

                                <span v-if="type == 'modify' && quarterly_verification_deadline && data.quarterly_rest_days != null && data.quarterly_rest_days > 30"
                                      class="span">【还有{{data.quarterly_rest_days}}天过期】</span>
                                <span v-if="type == 'modify' && quarterly_verification_deadline && data.quarterly_rest_days != null && data.quarterly_rest_days > 0 && data.quarterly_rest_days <= 30"
                                      class="span c-red">【还有{{data.quarterly_rest_days}}天过期】</span>
                                <span class="span c-red"
                                      v-if="type == 'modify' && quarterly_verification_deadline && data.quarterly_rest_days != null && data.quarterly_rest_days <= 0">【已过期】</span>
                                    </div>
                                </div>
                                <div class="row clearfix">
                                    <label class="form-label f-l col-4 ">年审或领标到期日期</label>
                                    <div class="formControls f-l col-8">
                                        <input autocomplete="off" v-model="annual_verification_deadline" type="text"
                                               class="input-text Wdate mr-5" name="annual_verification_deadline"
                                               id="annual_verification_deadline" />
                                        <!--<span v-if="type == 'modify' && annual_verification_deadline && data.annual_rest_days" class="span">【还有{{data.annual_rest_days}}天过期】</span>-->

                                <span v-if="type == 'modify' && annual_verification_deadline && data.annual_rest_days != null && data.annual_rest_days > 30"
                                      class="span">【还有{{data.annual_rest_days}}天过期】</span>
                                <span v-if="type == 'modify' && annual_verification_deadline && data.annual_rest_days != null && data.annual_rest_days > 0 && data.annual_rest_days <= 30"
                                      class="span c-red">【还有{{data.annual_rest_days}}天过期】</span>
                                <span class="span c-red"
                                      v-if="type == 'modify' && annual_verification_deadline && data.annual_rest_days != null && data.annual_rest_days != null && data.annual_rest_days <= 0">【已过期】</span>
                                    </div>
                                </div>
                                <div class="row clearfix">
                                    <label class="form-label f-l col-4 ">保险到期日期</label>
                                    <div class="formControls f-l col-8">
                                        <input autocomplete="off" v-model="insurance_deadline" type="text"
                                               class="input-text Wdate mr-5"
                                               id="insurance_deadline"
                                               name="insurance_deadline">
                                        <!--<span v-if="type == 'modify' && insurance_deadline && data.insurance_rest_days" class="span">【还有{{data.insurance_rest_days}}天过期】</span>-->

                                <span v-if="type == 'modify' && insurance_deadline && data.insurance_rest_days != null && data.insurance_rest_days > 30"
                                      class="span">【还有{{data.insurance_rest_days}}天过期】</span>
                                <span v-if="type == 'modify' && insurance_deadline && data.insurance_rest_days != null && data.insurance_rest_days > 0 && data.insurance_rest_days <= 30"
                                      class="span c-red">【还有{{data.insurance_rest_days}}天过期】</span>
                                <span class="span c-red"
                                      v-if="type == 'modify' && data.insurance_rest_days != null && insurance_deadline && data.insurance_rest_days <= 0">【已过期】</span>
                                    </div>
                                </div>
                                <div class="row clearfix">
                                    <label class="form-label f-l col-4 ">保养到期日期</label>
                                    <div class="formControls f-l col-8">
                                        <input autocomplete="off" v-model="maintenance_deadline" type="text"
                                               class="input-text Wdate mr-5" name="maintenance_deadline"
                                               id="maintenance_deadline" />
                                        <!--<span v-if="type == 'modify' && maintenance_deadline && data.maintenance_rest_days" class="span">【还有{{data.maintenance_rest_days}}天过期】</span>-->

                                <span v-if="type == 'modify' && maintenance_deadline && data.maintenance_rest_days != null && data.maintenance_rest_days > 30"
                                      class="span">【还有{{data.maintenance_rest_days}}天过期】</span>
                                <span v-if="type == 'modify' && maintenance_deadline && data.maintenance_rest_days != null && data.maintenance_rest_days > 0 && data.maintenance_rest_days <= 30"
                                      class="span c-red">【还有{{data.maintenance_rest_days}}天过期】</span>
                                <span class="span c-red"
                                      v-if="type == 'modify' && data.maintenance_rest_days != null && maintenance_deadline && data.maintenance_rest_days <= 0">【已过期】</span>
                                    </div>
                                </div>
                                <div class="row clearfix">
                                    <label class="form-label f-l col-4">保险公司</label>
                                    <div class="formControls f-l col-8">
                                        <input v-model="insurance_company" type="text" class="input-text" value=""
                                               placeholder="保险公司名称(20个字符以内)" name="insurance_company">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div class="clearfix btns">
            <div class="f-r btn-default btn radius" v-on:click="close">取消</div>
            <div class="f-r btn-primary mr-15 btn radius" v-on:click="save">保存</div>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;"
               v-on:click="close()"></a>
        </span>
    </div>
    <div class="layui-layer-shade"></div>
    <!-- 添加 -->
    <add :type="dialogType" v-if="isShowAddDialog" v-on:dialog-close="addDialogClose" v-on:dialog-save="addDialogSave"></add>
</template>

<script type="text/ecmascript-6">

    import * as base from '../../assets/js/base.js';
    import tags from '../components/ferrysetTags';
    import add from "../components/ferryaddBusType.vue";
    import moment from "moment";

    export default{
        ready () {
            base.verticalBodyCenter('.layui-modify');
            this.init();
            this.initKalendae();
            this.initValidate();
        },
        /**
         * title 车辆编辑
         * type add --> 新增；modify --> 修改
         * vehicle 车辆类型 bus --> 通勤车； vehicle --> 公务车(没做判断)
         * data 数据
         */
        props: ['type', 'data'],
        events: {
            'screenSizeChange': function () {
                base.verticalBodyCenter('.layui-modify');
            }
        },
        data: function () {
            return {
                isShowRightPart: false,
                isShowAddDialog: false, // 新增车辆类型
                dialogType: 'add', // 新增车辆类型
                car_no: '',
                car_brand: '',
                car_model: '',
                car_color: '',
                car_flag: '', // 车号
                seats: '',
                vehicle_type: 6,
                carModelArr: ['7座以下非运营小客车', '面包及7座(含)以上非运营小客车', '运营客车', '货车、大中型客车', '摩托车', '其他机动车'],
                carAccidentArr: ['未发生过致人伤亡事故', '发生过致人伤亡事故'],
                register_date: '',
                engine_no: '',
                drive_no: '',
                has_accident: 0,
                remark: '',
                quarterly_verification_deadline: '',
                annual_verification_deadline: '',
                insurance_deadline: '',
                maintenance_deadline: '',
                insurance_company: '',
                types: [], // 车辆类型
                type_name: '', // 选择的车辆类型名称
                typeSelected: '', // 选择的车辆类型 id
                isDepartmentFocus: '', // 是否显示部门列表
                currentCarType: {}
            }
        },
        methods: {
            addDialogClose: function () {
                this.isShowAddDialog = false;
            },
            addDialogSave: function () {
                this.isShowAddDialog = false;
                this.getTypes();
            },
            clickAdd: function () {
                this.isShowAddDialog = true;
            },
            initKalendae: function () {
                let that = this;
                let dateArr = ['register_date', 'quarterly_verification_deadline', 'annual_verification_deadline', 'insurance_deadline', 'maintenance_deadline'];
                for (let i = 0, len = dateArr.length; i < len; i++) {
                    let item = dateArr[i];
//					that[item] = moment().add('0', 'months').format('YYYY-MM-DD');
                    new Kalendae.Input(item, {
                        months: 2,
                        clickHide: true
                    });
                }
            },
            initValidate: function () {
                let that = this;
                let ajaxUrl = '';
                let ajaxType = '';
//类型判断
                if (this.type == 'add') {
                    ajaxUrl = base.gAjaxUrl.ferryBusList;
                    ajaxType = 'POST';
                } else if (this.type == 'modify') {
                    ajaxUrl = `${base.gAjaxUrl.ferryBusList}${this.data.id}/`;
                    ajaxType = 'PUT';
                    let getData = JSON.parse(JSON.stringify(this.data));
                    this.car_no = getData.car_no;
                    this.car_brand = getData.car_brand;
                    this.car_flag = getData.car_flag;
                    this.car_model = getData.car_model;
                    this.car_color = getData.car_color;
                    this.seats = getData.seats;
                    this.currentCarType = getData.car_type_vo || {};
                    this.typeSelected = getData.car_type || '';
                    this.type_name = this.currentCarType.type_name || '';
                    this.vehicle_type = getData.vehicle_type;
                    // 还未对接
                    this.register_date = getData.register_date;
                    this.engine_no = getData.engine_no;
                    this.drive_no = getData.drive_no;
                    this.has_accident = getData.has_accident ? 1 : 0;
                    this.remark = getData.remark;
                    this.quarterly_verification_deadline = getData.quarterly_verification_deadline;
                    this.annual_verification_deadline = getData.annual_verification_deadline;
                    this.insurance_deadline = getData.insurance_deadline;
                    this.maintenance_deadline = getData.maintenance_deadline;
                    this.insurance_company = getData.insurance_company;
                }

                //验证
                $('#J-layer-form').validate({
                    rules: {
                        car_no: {
                            required: true,
                            maxlength: 10
                        },
                        car_brand: {
                            required: true,
                        },
//					car_model: {
//						required: true,
//					},
// 					car_color: {
// 						required: true,
// 					},
                        seats: {
                            required: true,
                            number: true,
                            digits: true,
                        },
                        vehicle_type: {
                            required: true,
                        },
                        register_date: {
//                            required: true,
                            dateISO: true
                        },
                        quarterly_verification_deadline: {
                            dateISO: true
                        },
                        annual_verification_deadline: {
                            dateISO: true
                        },
                        insurance_deadline: {
                            dateISO: true
                        },
                        maintenance_deadline: {
                            dateISO: true
                        },
                        remark: {
                            required: false,
                            maxlength: 50
                        },
                        insurance_company: {
                            maxlength: 20
                        },
//					engine_no: {
//						required: true,
//					},
//					drive_no: {
//						required: true,
//					},
//					has_accident: {
//						required: true,
//					},
                        /*job_number:{*/
                        /*required: true,    */
                        /*},*/
                    },
                    submitHandler: function () {
                        let type = that.getDepartmentId(that.type_name);
                        if(type == '') {
                            layer.msg("请选择正确的车辆类型", {icon: 2, time: 1500});
                            return;
                        }
                        let data = {
                            car_no: that.car_no,
                            car_type: type,
                            car_flag: that.car_flag, // 车号
//                            car_brand: that.car_brand,
//                            car_model: that.car_model,
//                            car_color: that.car_color,
//                            seats: that.seats,
                            remark: that.remark,
                          //  shuttlebus: shuttlebus,
                            vehicle_type: that.vehicle_type,
                            engine_no: that.engine_no,
                            drive_no: that.drive_no,
                            has_accident: that.has_accident,
                            insurance_company: that.insurance_company,
//                            register_date: that.register_date,
//                            quarterly_verification_deadline: that.quarterly_verification_deadline || '',
//                            annual_verification_deadline: that.annual_verification_deadline || '',
//                            insurance_deadline: that.insurance_deadline || '',
//                            maintenance_deadline: that.maintenance_deadline || '',
                        };
                        $.showLoading();
                        that.register_date && (data.register_date = that.register_date);
                        that.quarterly_verification_deadline && (data.quarterly_verification_deadline = that.quarterly_verification_deadline);
                        that.annual_verification_deadline && (data.annual_verification_deadline = that.annual_verification_deadline);
                        that.insurance_deadline && (data.insurance_deadline = that.insurance_deadline);
                        that.maintenance_deadline && (data.maintenance_deadline = that.maintenance_deadline);
                        $.ajax({
                            url: ajaxUrl,
                            type: ajaxType,
                            contentType: "application/json",
                            data: JSON.stringify(data),
                        }).always(function (data) {
                            $.hideLoading();
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
                layer.confirm('确定信息并保存?', function (index) {
                    $('#J-layer-form').submit()
                });
            },
            init: function () {
                this.getTypes();
            },
            // 获取车辆类型
            getTypes: function () {
                $.ajax({
                    url: base.gAjaxUrl.ferryBusType,
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

            // 车辆类型搜索 -- 开始
            departmentEnter: function (flag) {
                this.isDepartmentFocus = flag;
                !flag && $(".departmentListBox").hide();
            },
            departmentClick: function () {
                if(this.isDepartmentFocus) {
                    $(".departmentListBox").show();
                }
            },
            emptySearch:function(e,type){
                if(!type){
                    this.type_name = '';
                }
                $(e.target).nextAll(".departmentListBox").show();
            },
            setDepartmentValue: function (item) {
                this.type_name = item.type_name;
                this.typeSelected = item.id;
                this.currentCarType = item;
                $(".departmentListBox").hide();
            },
            getDepartmentId: function (val) {
                var id = '';
                this.types.forEach(function (item) {
                    if(item.type_name == val) {
                        id = item.id;
                    }
                });
                return id;
            },
            // 车辆类型搜索 -- 结束
            getTagIds: function (tagArr) {
                let arr = [];
                for (let i = 0, len = tagArr.length; i < len; i++) {
                    arr.push(tagArr[i].id);
                }
                return arr;
            },
        },
        watch: {
            'currentCarType': function (n, o) {
                this.car_brand = n.car_brand;
                this.car_model = n.car_model;
                this.car_color = n.car_color;
                this.seats = n.seats;
            },
            'isShowRightPart': function (n, o) {
                this.$nextTick(() => {
                    base.verticalBodyCenter('.layui-modify');
                });
            }
        },
        components: {
            tags, add
        }
    }
</script>

<style lang="less" scoped rel="stylesheet/less">
    .add_vehicle_container {
        width: 80%;
        bottom: 30px;
        overflow-y: hidden;
        overflow-x: auto;
        min-width: 1100px;
        box-sizing: border-box;
        &.small {
            width: 800px;
            min-width: 800px;
            max-width: 800px;
        }
    }

    @media (max-width: 1375px) {
        .add_vehicle_container {
            width: 81.5%;
        }
    }

    .formControls input {
        border-radius: 5px;
    }

    #vehicle_content {
        position: absolute;
        top: 44px;
        left: 0;
        right: 0;
        bottom: 60px;
        padding: 15px;
        overflow-y: auto;
        overflow-x: hidden;
        .title_info {
            box-sizing: border-box;
            margin-bottom: 20px;
            font-size: 18px;
            font-weight: bold;
            a {
                font-size: 14px;
                line-height: 20px;
                padding: 4px 20px;
            }
        }
    }

    .add_vehicle_radio_box {
        margin-top: 15px;
        padding-left: 40px;
        position: relative;
    }

    .add_vehicle_radio_box:first-of-type {
        margin-top: 3px;
    }

    input[type=radio] {
        display: none;
        width: 0 !important;
        height: 0 !important;
    }

    .Wdate {
        padding: 0 15px;
    }

    .add_vehicle_radio_box:after {
        position: absolute;
        content: '';
        display: block;
        width: 18px;
        height: 18px;
        box-sizing: border-box;
        left: 11px;
        top: 50%;
        margin-top: -9px;
        border: 1px solid #ccc;
        border-radius: 50%;
    }

    .add_vehicle_active:after {
        border: 1px solid #5a98de;
    }

    .car_title {
        margin: 10px 20px 0;
        border-radius: 5px 5px 0 0;
        background-color: #5a98de;
        color: #fff;
    }

    .car_title span {
        font-weight: 700;
    }

    .add_vehicle_active:before {
        position: absolute;
        content: '';
        display: block;
        width: 10px;
        height: 10px;
        box-sizing: border-box;
        left: 15px;
        top: 50%;
        margin-top: -5px;
        background-color: #5a98de;
        border-radius: 50%;
    }

    .form-horizontal .form-label {
        padding-right: 20px;
    }

    .formControls {
        position: relative;
    }

    .span {
        position: absolute;
        left: 100px;
        top: 4px;
        height: 30px;
    }

    .btns {
        position: absolute;
        bottom: 15px;
        width: 100%;
        left: 0;
        padding-right: 20px;
        box-sizing: border-box;
    }

    .btns_flex {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        align-content: center;
        height: 100%;
        .btn {
            height: 25px;
            line-height: 23px;
            padding: 0 5px;
        }
    }


</style>
