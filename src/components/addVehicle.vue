<template>

	<div class="layui-layer layui-anim layui-layer-page layui-modify add_vehicle_container">
		<div class="layui-layer-title">{{title}}</div>
		<div class="layui-layer-title car_title">{{type == 'add' ? '' : data.car_no}} 车辆基本信息 <span>|</span>
			季审、年审、保险、保养信息
		</div>
		<div class="layui-layer-content pr-20" id="vehicle_content">
			<form id="J-layer-form" class="form form-horizontal clearfix">
				<div class="f-l col-4 col pr-20">
					<div class="row cl">
						<label class="form-label f-l col-4"><span class="c-red">*</span>车牌</label>
						<div class="formControls f-l col-8">
							<input autocomplete="off" v-model="car_no" type="text" class="input-text" value="" placeholder="" name="car_no" />
						</div>
					</div>
					<div class="row cl">
						<label class="form-label f-l col-4"><span class="c-red">*</span>品牌</label>
						<div class="formControls f-l col-8">
							<input v-model="car_brand" type="text" class="input-text" value="" placeholder="" name="car_brand">
						</div>
					</div>
					<div class="row cl">
						<label class="form-label f-l col-4">型号</label>
						<div class="formControls f-l col-8">
							<input v-model="car_model" type="text" class="input-text" value="" placeholder=""
								   name="car_model">
						</div>
					</div>
					<div class="row cl">
						<label class="form-label f-l col-4">颜色</label>
						<div class="formControls f-l col-8">
							<input v-model="car_color" type="text" class="input-text" value="" placeholder=""
								   name="car_color">
						</div>
					</div>
					<div class="row cl">
						<label class="form-label f-l col-4"><span class="c-red">*</span>座位数</label>
						<div class="formControls f-l col-8">
							<input v-model="seats" type="text" class="input-text" value="" placeholder="" name="seats">
						</div>
					</div>
					<div class="row cl">
						<label class="form-label f-l col-4"><span class="c-red">*</span>车辆类型</label>
						<div class="formControls f-l col-8">
							<div v-on:click="vehicle_type = accIndex + 1"
								 v-bind:class="{'add_vehicle_radio_box': true, 'add_vehicle_active' : vehicle_type == accIndex + 1}"
								 v-for="(accIndex, accItem) in carModelArr">
								<input id="{{'picked' + accIndex}}" type="radio" value="{{accIndex + 1}}"
									   v-model="vehicle_type"  name="vehicle_type">
								<label for="{{'picked' + accIndex}}">{{accItem}}</label>
								<br>

							</div>
						</div>
					</div>
				</div>
				<div class="f-l col-4 col pr-20">
					<div class="row cl">
						<label class="form-label f-l col-4 "><span class="c-red">*</span>车辆注册日期</label>
						<div class="formControls f-l col-8">
							<input autocomplete="off" v-model="register_date" type="text" class="input-text Wdate mr-5" id="register_date" v-bind:value="register_date" name="register_date">
						</div>
					</div>
					<div class="row cl">
						<label class="form-label f-l col-4 ">发动机号</label>
						<div class="formControls f-l col-8">
							<input v-model="engine_no" type="text" class="input-text" value="" placeholder=""
								   name="engine_no">
						</div>
					</div>
					<div class="row cl">
						<label class="form-label f-l col-4 ">车架号</label>
						<div class="formControls f-l col-8">
							<input v-model="drive_no" type="text" class="input-text" value="" placeholder=""
								   name="drive_no">
						</div>
					</div>
					<div class="row cl">
						<label class="form-label f-l col-4 "><span class="c-red">*</span>事故情况</label>
						<div class="formControls f-l col-8">
							<div v-on:click="has_accident = accIndex"
								 v-bind:class="{'add_vehicle_radio_box': true, 'add_vehicle_active' : has_accident == accIndex}"
								 v-for="(accIndex, accItem) in carAccidentArr">
								<input id="{{'picked_acc' + accIndex}}" type="radio" v-model="has_accident" name="has_accident" value="{{accIndex}}">
								<label for="{{'picked_acc' + accIndex}}">{{accItem}}</label>
								<br>
							</div>
						</div>
					</div>
					<div class="row cl">
						<label class="form-label f-l col-4 ">备注</label>
						<div class="formControls f-l col-8">
							<textarea v-model="remark" type="text" class="textarea" value="" placeholder="输入备注(最多50个字符)" name="remark"></textarea>
						</div>
					</div>
					<div class="row cl">
						<label class="form-label f-l col-4 ">车辆分组</label>
						<div class="formControls f-l col-8">
							<tags :tags="wTagsArr" :selected="tagsArr" :maxh="100"></tags>
						</div>
					</div>
				</div>
				<div class="f-l col-4 col pr-20">
					<div class="row cl">
						<label class="form-label f-l col-4 ">季审或领标到期日期</label>
						<div class="formControls f-l col-8">
							<input autocomplete="off" v-model="quarterly_verification_deadline" type="text" class="input-text Wdate mr-5" id="quarterly_verification_deadline" v-bind:value="quarterly_verification_deadline" name="quarterly_verification_deadline">

							<span v-if="type == 'modify' && quarterly_verification_deadline && data.quarterly_rest_days != null && data.quarterly_rest_days > 30" class="span">【还有{{data.quarterly_rest_days}}天过期】</span>
							<span v-if="type == 'modify' && quarterly_verification_deadline && data.quarterly_rest_days != null && data.quarterly_rest_days > 0 && data.quarterly_rest_days <= 30" class="span c-red">【还有{{data.quarterly_rest_days}}天过期】</span>
							<span class="span c-red" v-if="type == 'modify' && quarterly_verification_deadline && data.quarterly_rest_days != null && data.quarterly_rest_days <= 0">【已过期】</span>
						</div>
					</div>
					<div class="row cl">
						<label class="form-label f-l col-4 ">年审或领标到期日期</label>
						<div class="formControls f-l col-8">
							<input autocomplete="off" v-model="annual_verification_deadline" type="text" class="input-text Wdate mr-5"  name="annual_verification_deadline" id="annual_verification_deadline" v-bind:value="annual_verification_deadline">
							<!--<span v-if="type == 'modify' && annual_verification_deadline && data.annual_rest_days" class="span">【还有{{data.annual_rest_days}}天过期】</span>-->

							<span v-if="type == 'modify' && annual_verification_deadline && data.annual_rest_days != null && data.annual_rest_days > 30" class="span">【还有{{data.annual_rest_days}}天过期】</span>
							<span v-if="type == 'modify' && annual_verification_deadline && data.annual_rest_days != null && data.annual_rest_days > 0 && data.annual_rest_days <= 30" class="span c-red">【还有{{data.annual_rest_days}}天过期】</span>
							<span class="span c-red" v-if="type == 'modify' && annual_verification_deadline && data.annual_rest_days != null && data.annual_rest_days != null && data.annual_rest_days <= 0">【已过期】</span>
						</div>
					</div>
					<div class="row cl">
						<label class="form-label f-l col-4 ">保险到期日期</label>
						<div class="formControls f-l col-8">
							<input autocomplete="off" v-model="insurance_deadline" type="text" class="input-text Wdate mr-5"
								   id="insurance_deadline" v-bind:value="insurance_deadline"   name="insurance_deadline">
							<!--<span v-if="type == 'modify' && insurance_deadline && data.insurance_rest_days" class="span">【还有{{data.insurance_rest_days}}天过期】</span>-->

							<span v-if="type == 'modify' && insurance_deadline && data.insurance_rest_days != null && data.insurance_rest_days > 30" class="span">【还有{{data.insurance_rest_days}}天过期】</span>
							<span v-if="type == 'modify' && insurance_deadline && data.insurance_rest_days != null && data.insurance_rest_days > 0 && data.insurance_rest_days <= 30" class="span c-red">【还有{{data.insurance_rest_days}}天过期】</span>
							<span class="span c-red" v-if="type == 'modify' && data.insurance_rest_days != null && insurance_deadline && data.insurance_rest_days <= 0">【已过期】</span>
						</div>
					</div>
					<div class="row cl">
						<label class="form-label f-l col-4 ">保养到期日期</label>
						<div class="formControls f-l col-8">
							<input autocomplete="off" v-model="maintenance_deadline" type="text" class="input-text Wdate mr-5" name="maintenance_deadline" id="maintenance_deadline" v-bind:value="maintenance_deadline">
							<!--<span v-if="type == 'modify' && maintenance_deadline && data.maintenance_rest_days" class="span">【还有{{data.maintenance_rest_days}}天过期】</span>-->

							<span v-if="type == 'modify' && maintenance_deadline && data.maintenance_rest_days != null && data.maintenance_rest_days > 30" class="span">【还有{{data.maintenance_rest_days}}天过期】</span>
							<span v-if="type == 'modify' && maintenance_deadline && data.maintenance_rest_days != null && data.maintenance_rest_days > 0 && data.maintenance_rest_days <= 30" class="span c-red">【还有{{data.maintenance_rest_days}}天过期】</span>
							<span class="span c-red" v-if="type == 'modify' && data.maintenance_rest_days != null && maintenance_deadline && data.maintenance_rest_days <= 0">【已过期】</span>
						</div>
					</div>
					<div class="row cl">
						<label class="form-label f-l col-4">保险公司</label>
						<div class="formControls f-l col-8">
							<input v-model="insurance_company" type="text" class="input-text" value="" placeholder="保险公司名称(20个字符以内)" name="insurance_company">
						</div>
					</div>
				</div>
			</form>
			<div class="cancel_btn btn-default" v-on:click="close">取消</div>
			<div class="sure_btn btn-primary" v-on:click="save">{{saveTxt}}</div>
		</div>


	<span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
    </div>

    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
    <div class="layui-layer-shade"></div>
</template>

<style lang="less" scoped>
    .add_vehicle_container {
        width: 80%;
        height: 90%;
        overflow-y: hidden;
        overflow-x: auto;
        min-height: 600px;
    }

    .layui-layer-content {
        padding: 0 20px 0 0 !important;
        margin: 0 !important;
        border: 1px solid #ccc;
        border-top-width: 0;
        border-radius: 0 0 5px 5px;
    }

    #vehicle_content {
        position: absolute;
        top: 96px;
        left: 20px;
        right: 20px;
        bottom: 30px;
        min-height: 450px;
        max-height: 600px;
        overflow-y: auto;
        overflow-x: hidden;
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

    .cancel_btn, .sure_btn {
        position: absolute;
        right: 120px;
        bottom: 20px;
        width: 80px;
        height: 35px;
        text-align: center;
        border-radius: 4px;
        line-height: 35px;
    }

    .sure_btn {
        right: 20px;
    }

</style>
<script type="text/ecmascript-6">

	import * as base from '../assets/js/base.js';
    import tags from '../components/setTags';
	import moment from "moment";

	export default{
		ready () {
			let that = this;
			let ajaxUrl = '';
			let ajaxType = '';
			this.getTagList();
            base.verticalCenter('.layui-modify');

            this.initKalendae();
            //类型判断
            if (this.type == 'add') {
                ajaxUrl = base.gAjaxUrl.officialcarvehicles;
                ajaxType = 'POST';

            } else if (this.type == 'modify') {
                ajaxUrl = `${base.gAjaxUrl.officialcarvehicles}${this.data.id}/`;
                ajaxType = 'PATCH';
                let getData = JSON.parse(JSON.stringify(this.data));
                this.car_no = getData.car_no;
                this.car_brand = getData.car_brand;
                this.car_model = getData.car_model;
                this.car_color = getData.car_color;
                this.seats = getData.seats;
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
                this.tagsArr = getData.tags ? getData.tags : [];
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
                    seats: {
                        required: true,
                        number: true,
                        digits: true,
                    },
                    vehicle_type: {
                        required: true,
                    },
                    register_date: {
                        required: true,
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
                },
                submitHandler: function () {
                    let data = {
                        car_no: that.car_no,
                        car_brand: that.car_brand,
                        car_model: that.car_model,
                        seats: that.seats,
                        vehicle_type: that.vehicle_type,
                        register_date: that.register_date,
                        engine_no: that.engine_no,
                        drive_no: that.drive_no,
                        has_accident: that.has_accident,
                        remark: that.remark,
                        insurance_company: that.insurance_company,
                        tags_set: that.getTagIds(that.tagsArr),
                    };
                    that.car_color ? data['car_color'] = that.car_color : '';
                    that.quarterly_verification_deadline ? data['quarterly_verification_deadline'] = that.quarterly_verification_deadline : '';
                    that.annual_verification_deadline ? data['annual_verification_deadline'] = that.annual_verification_deadline : '';
                    that.insurance_deadline ? data['insurance_deadline'] = that.insurance_deadline : '';
                    that.maintenance_deadline ? data['maintenance_deadline'] = that.maintenance_deadline : '';
                    $.ajax({
                        url: ajaxUrl,
                        type: ajaxType,
                        contentType: "application/json",
                        data: JSON.stringify(data),
                    }).always(function (data) {
                        base.ajaxCallback(data, function () {
                            layer.msg('提交成功', {icon: 1, time: 1000});
                            that.$dispatch('dialog-save');
                        });
                    });
                }
            });
        },
        /**
         * title 车辆编辑
         * type add --> 新增；modify --> 修改
         * data 数据
         */
        props: ['title', 'type', 'data'],
        data: function () {
            return {
                car_no: '',
                car_brand: '',
                car_model: '',
                car_color: '',
                seats: '',
                vehicle_type: 1,
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
                saveTxt: this.type == 'modify' ? '确认修改' : '确认',
                wTagsArr: [],
                tagsArr: [],
                itemsLoading: false
            }
        },
        methods: {
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
            close: function () {
                this.$dispatch('dialog-close');
            },
            save: function () {
                layer.confirm('确定信息并保存?', function (index) {
                    $('#J-layer-form').submit()
                });
            },
            getTagList: function () {
                this.itemsLoading = true;
                // 分组的类型,3代表通勤车分组,4代表公务车分组
                $.ajax({
                    url: base.gAjaxUrl.tagGroup,
                    type: 'GET',
                    data: {
                        type: 4,
                        page: 1,
                        page_size: 999999,
                        flag: 'tag_offcar'
                    }
                }).always((data)=> {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=> {
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
            }
        },
        components: {
            tags,
        }
    }
</script>
