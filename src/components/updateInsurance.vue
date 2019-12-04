<template>
	<div class="layui-layer layui-anim layui-layer-page layui-modify updateBox">
		<h5 class="title">更新保险到期日期</h5>
		<h6 class="hint">是否确认续保,续保后保险到期日期自动推迟1年</h6>
		<div class="updateContent">
			<form id="J-layer-form" class="form form-horizontal">
				<div>
					<p>本次保险到期日期: {{data.insurance_deadline}}
						<span v-if="data.insurance_deadline == undefined " style="color:red">未设置时间</span>
                    <span :class="{'text-red':data.insurance_rest_days <= 30 }" v-if="data.insurance_rest_days != undefined && data.insurance_rest_days > 0 ">
                        (还有{{data.insurance_rest_days}}天过期)
                    </span>
						<span class="text-red" v-if="data.insurance_rest_days <= 0 && data.insurance_rest_days != undefined ">
                        【已过期】
                    </span>
					</p>
				</div>
				<div>
					<div class="formControls">
						<label>本次保险公司:
					<input autocomplete="off" v-model="insurance_company" class="insuranceInput input-text" type="text" placeholder="请输入保险公司名称" name="insurance_company">
						</label>
						</div>
				</div>
				<div class="checkTime">
					<p>下次保险到期日期: {{data.next_insurance_deadline}} (还有{{data.next_insurance_rest_days}}天过期)</p>
				</div>
				<div class="btn-box">
					<a class="btn radius mr-5 cancel" href="javascript:;" @click="close()">取消</a>
					<a class="btn btn-primary radius mr-5 affirm " href="javascript:;" @click="updata()">确认</a>
				</div>
			</form>
		</div>

        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
	</div>
</template>
<style lang="less" rel="stylesheet/less" scoped>

	.updateBox {
		margin-top: 94px;
		height: 456px;
		width: 40pc;
	}
	.formControls {
		margin: 0 !important;
		padding: 0 !important;
	}

	h5 {
		text-align: center;
		font-size: 20px;
		padding-top: 20px;
	}

	.updateContent {
		padding: 50px;
		padding-left: 150px;
		div {
			font-size: 15px;
			margin-top: 20px;
		}
	}

	#quarterlyContent {
		width: 200px;
	}

	.checkTime {
		padding: 10px 0;
	}

	.btn-box {
		a {
			width: 100px;
			margin: 40px;
		}
	}

	.hint {
		font-size: 15px;
		text-align: center;
		padding-top: 10px;
	}

	.insuranceInput {
		width: 200px;
		height: 30px;
	}
	.text-red{
		color:red;
	}

</style>
<script>
	import * as base from '../assets/js/base.js';
	export default{
		ready(){

			let that = this;
//			let value = $(".insuranceInput").val();
			console.info(that.data);
			console.info(that.type);
			$('#J-layer-form').validate({
				rules: {
					insurance_company: {
						required: true,
						maxlength: 20
					},
				},
				submitHandler: function () {
//					let value = $(".insuranceInput").val();
					$.ajax({
						url: `${that.type}${that.data.id}/insurance/`,
						type: "POST",
						data: {
							insurance_company: that.insurance_company,
						},
					}).always((data) => {
						base.ajaxCallback(data, () => {
						if(data){
							that.$dispatch("window-close");
							layer.msg("保存成功", {icon: 1, time: 1000});
							that.$emit('child-data', data);
						}else{}
					}
					)
				})
				}
			});

		},
		data: function () {
			return {
				quarterlyDate: '',
				insurance_company: this.data.insurance_company,
			}
		},
		props: ["data", "type"],
		methods: {
			close: function () {
				this.$dispatch("window-close");
			},

			updata: function () {

				$('#J-layer-form').submit();

//				var that = this;
//				var value = $(".insuranceInput").val();
//				console.info(that.data);
//				console.info(that.type);
//
//				$.ajax({
//					url: `${that.type}${that.data.id}/insurance/`,
//					type: "POST",
//					data: {
//						insurance_company: value,
//					},
//				}).always((data) => {
//					base.ajaxCallback(data, () => {
//						if(data){
//							that.$dispatch("window-close");
//							layer.msg("保存成功", {icon: 1, time: 1000});
//							that.$emit('child-data', data);
//						}else{}
//					});
//				})

			}

		},
	}
</script>