<template>

	<div class="layui-layer-shade s_overflow">
	<div class="layui-layer layui-anim layui-layer-page layui-modify vehicle_archives_box">
		<div class="layui-layer-title vehicle_title_1">{{title}}</div>

		<div class="layui-layer-title vehicle_title">
			<div class="vehicle_title_box">【{{data.car_no}}】 {{title}}</div>
		</div>
		<div class="layui-layer-content pr-20" id="vehicle_container">
			<div class="vehicle_content_title lh-16 row">
				<div class="f-l vehicle_title_item pr-20">
					品牌：{{data.car_brand}}
				</div>
				<span class="f-l">|</span>
				<div class="f-l vehicle_title_item pr-20 pl-20">
					型号：{{data.car_model}}
				</div>
				<span class="f-l">|</span>
				<div class="f-l vehicle_title_item pr-20 pl-20">
					颜色：{{data.car_color}}
				</div>
				<span class="f-l">|</span>
				<div class="f-l vehicle_title_item pr-20 pl-20">
					发动机：{{data.engine_no}}
				</div>
				<span class="f-l">|</span>
				<div class="f-l vehicle_title_item pr-20 pl-20">
					车架号：{{data.drive_no}}
				</div>
				<span class="f-l">|</span>
				<div class="f-l vehicle_title_item pr-20 pl-20">
					车辆注册日期：{{data.register_date}}
				</div>
			</div>
			<div class="row vehicle_inspect">
				<div class="f-l col col-3">
					<div class="vehicle_inspect_box">
						<div class="vehicle_inspect_box_title">保险 &nbsp;&nbsp;<span style="color: red">{{insurance_vos.length}} 条</span></div>
						<div class="vehicle_inspect_box_content">
							<div class="vehicle_inspect_box_next" v-if="data.insurance_deadline">
								<div class="vehicle_inspect_box_date">{{data.insurance_deadline}}</div>
								<span class="vehicle_inspect_box_span c-999">|</span>
								<div class="vehicle_inspect_box_name">下次保险到期日期</div>
							</div>
							<div class="s_left vehicle_inspect_scroll_box" v-else>
								<div class="vehicle_inspect_box_name">无内容</div>
							</div>

							<div class="vehicle_inspect_scroll_box">
								<div v-for="item in insurance_vos" class="vehicle_inspect_item">
									<div class="vehicle_inspect_box_date">{{item.this_date}}</div>
									<span class="vehicle_inspect_box_span c-999">|</span>
									<div v-bind:title="item.insurance_company" class="vehicle_inspect_box_name">{{item.insurance_company}}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="f-l col col-3">
					<div class="vehicle_inspect_box">
						<div class="vehicle_inspect_box_title">季审 &nbsp;&nbsp;<span style="color: red">{{quarterly_verification_vos.length}} 条</span></div>
						<div class="vehicle_inspect_box_content">
							<div class="vehicle_inspect_box_next" v-if="data.quarterly_verification_deadline">
								<div class="vehicle_inspect_box_date">{{data.quarterly_verification_deadline}}</div>
								<span class="vehicle_inspect_box_span c-999">|</span>
								<div class="vehicle_inspect_box_name">下次季审到期日期</div>
							</div>
							<div class="s_left vehicle_inspect_scroll_box" v-else>
								<div class="vehicle_inspect_box_name">无内容</div>
							</div>

							<div class="vehicle_inspect_scroll_box">
								<div v-for="item in quarterly_verification_vos" class="vehicle_inspect_item">
									<div class="vehicle_inspect_box_date">{{item.this_date}}</div>
									<span class="vehicle_inspect_box_span c-999">|</span>
									<div v-bind:title="item.verification_content_name" class="vehicle_inspect_box_name">{{item.verification_content_name}}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="f-l col col-3">
					<div class="vehicle_inspect_box">
						<div class="vehicle_inspect_box_title">年审 &nbsp;&nbsp;<span style="color: red">{{annual_verification_vos.length}} 条</span></div>
						<div class="vehicle_inspect_box_content">
							<div class="vehicle_inspect_box_next" v-if="data.annual_verification_deadline">
								<div class="vehicle_inspect_box_date">{{data.annual_verification_deadline}}</div>
								<span class="vehicle_inspect_box_span c-999">|</span>
								<div class="vehicle_inspect_box_name">下次年审到期日期</div>
							</div>
							<div class="s_left vehicle_inspect_scroll_box" v-else>
								<div class="vehicle_inspect_box_name">无内容</div>
							</div>
							<div class="vehicle_inspect_scroll_box">
								<div v-for="item in annual_verification_vos" class="clearfix vehicle_inspect_item">
									<div class="vehicle_inspect_box_date">{{item.this_date}}</div>
									<span class="vehicle_inspect_box_span c-999">|</span>
									<div v-bind:title="item.verification_content_name"  class="vehicle_inspect_box_name">{{item.verification_content_name}}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="f-l col col-3">
					<div class="vehicle_inspect_box maintain_box">
						<div class="vehicle_inspect_box_title">保养 &nbsp;&nbsp;<span style="color: red">{{maintenance_vos.length}} 条</span></div>
						<div class="vehicle_inspect_box_content"><div class="vehicle_inspect_box_next c-red" v-if="data.maintenance_deadline"><div class="vehicle_inspect_box_date">{{data.maintenance_deadline}}</div><span class="vehicle_inspect_box_span c-999">|</span><div class="vehicle_inspect_box_name">下次保养到期日期</div></div>
							<div class="s_left vehicle_inspect_scroll_box" v-else>
								<div class="vehicle_inspect_box_name">无内容</div>
							</div>
							<div class="vehicle_inspect_scroll_box"><div v-for="item in maintenance_vos" class="vehicle_inspect_item"><div class="vehicle_inspect_box_date">{{item.this_date}}</div><span class="vehicle_inspect_box_span c-999">|</span><div id="amount" v-bind:title="item.maintenance_amount" class="vehicle_inspect_box_name">￥{{item.maintenance_amount}}</div><span class="vehicle_inspect_box_span c-999">|</span><div id="mile" v-bind:title="item.mileage" class="vehicle_inspect_box_name">{{item.mileage}}KM</div></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="row vehicle_peccancy">
				<p>【{{data.car_no}}】 的违章信息 <span style="color: red">{{peccancy_vos.length}} 条</span></p>
				<table class="table table-border table-bordered table-hover table-bg table-sort">
					<thead>
					<tr class="text-c">
						<th width="70">违章日期</th>
						<th width="200">违章地址</th>
						<th width="200">违反具体内容</th>
						<th width="70">扣分</th>
						<th width="70">罚款</th>
					</tr>
					</thead>
					<tbody>
					<tr class="text-c" v-if="peccancy_vos.length == 0">
						<td>无内容</td>
					</tr>
					<tr class="text-c" v-for="item in peccancy_vos">
						<td width="70">{{item.time}}</td>
						<td width="200">{{item.address}}</td>
						<td width="200">{{item.reason}}</td>
						<td width="70">{{item.point}}</td>
						<td width="70">{{item.fine}}</td>
					</tr>
					</tbody>
				</table>
			</div>
			<div class="row vehicle_maintain">
				<p>【{{data.car_no}}】 的维修信息 <span style="color: red">{{repair_vos.length}} 条</span></p>
				<table class="table table-border table-bordered table-hover table-bg table-sort">
					<thead>
					<tr class="text-c">
						<th>保修日期</th>
						<th>姓名</th>
						<th>电话</th>
						<th>工号</th>
						<th>部门</th>
						<th>职业</th>
						<th>报价评审人</th>
						<th>订单状态</th>
						<th>维修商家</th>
						<th>维修金</th>
					</tr>
					</thead>
					<tbody>
					<tr class="text-c" v-if="repair_vos.length == 0">
						<td>无内容</td>
					</tr>
					<tr class="text-c" v-for="item in repair_vos">
						<td>保修日期</td>
						<td>姓名</td>
						<td>电话</td>
						<td>工号</td>
						<td>部门</td>
						<td>职业</td>
						<td>报价评审人</td>
						<td>订单状态</td>
						<td>维修商家</td>
						<td>维修金</td>
					</tr>
					</tbody>
				</table>
			</div>
		</div>
    <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
	</div>
	</div>
</template>

<style lang="less" scoped>
	.vehicle_archives_box {
		/*z-index: 200 !important;*/
		position: relative;
		left: 0;
		right: 0;
		width: 100%;
		height: 100%;
		margin:0 auto;
		top: 0;
		min-width: 1200px;
		max-width: 1400px;
		overflow-y: hidden;
		overflow-x: auto;
		min-height: 550px;
		/*max-height: 800px;*/
	}
	.s_left  {
		text-align: left !important;
	}
	.s_overflow {
		overflow: auto !important;
		padding: 10px 20px !important;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
	}

	#vehicle_container {
		position: absolute;
		top: 96px;
		left: 20px;
		right: 20px;
		bottom: 30px;
		box-sizing: border-box;
		/*min-height: 400px;*/
		/*height: calc(100% - 126px);*/
		max-height: 7750px;
		/*min-width: 1200px;*/
		padding: 0 15px 30px !important;
		border: 1px solid #ccc;
		border-top: 0 none;
		border-radius: 0 0 5px 5px;
	}

	.vehicle_title {
		position: absolute !important;
		left: 0;
		top: 54px;
		width: 100% !important;
		padding: 0 20px;
		background-color: #fff;
		border: 0 none;
		box-sizing: border-box !important;
	}

	.vehicle_title_box {
		width: 100%;
		height: 100%;
		padding-left: 15px;
		border-radius: 5px 5px 0 0;
		box-sizing: border-box;
		background-color: #5a98de;
		color: #fff;
		border-bottom: 0 none;
	}
	.vehicle_title_1 {
		width: 100%;
		box-sizing: border-box !important;
	}

	.vehicle_content_title {
		box-sizing: border-box !important;
		height: 20px;
		line-height: 20px;
		/*font-size: 12px;*/
		color: #333;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.vehicle_content_title span {
		color: #5a98de;
	}

	/* 四大块部分样式 */
	.vehicle_peccancy, .vehicle_maintain, .vehicle_inspect {
		width: 100%;
		height: 200px;
	}
	.vehicle_peccancy, .vehicle_maintain {
		overflow: auto;
		p {
			font-size: 20px;
			line-height: 30px;
		}
	}

	.vehicle_inspect_box {
		width: 270px;
		height: 180px;
		box-sizing: border-box;
		margin: 10px auto;
		text-align: center;
		border: 1px solid #ccc;
		border-radius: 5px;
	}
	.maintain_box {
		width: 285px !important;
	}

	.vehicle_inspect_box_title {
		width: 100%;
		box-sizing: border-box;
		padding-left: 10px;
		height: 38px;
		line-height: 37px;
		font-size: 20px;
		color: #333;
		text-align: left;
		background-color: #fff;
		border-bottom: 1px solid #ccc;
		font-weight: 500;
	}

	.vehicle_inspect_box_content {
		width: 100%;
		height: 140px;
		box-sizing: border-box;
		padding: 10px 10px;
		font-size: 12px !important;
		background-color: #f4f4f4;
	}

	.vehicle_inspect_box_next, .vehicle_inspect_item {
		line-height: 20px;
		text-align: left;
		color: #333;
	}
	.vehicle_inspect_box_next {
		overflow: hidden;
	}

	.vehicle_inspect_box_date, .vehicle_inspect_box_span, .vehicle_inspect_box_name {
		display: inline-block;
		vertical-align: top;
	}
	.vehicle_inspect_box_date {
		width: 80px;
		text-align: right;
	}
	.vehicle_inspect_box_span {
		width: 12px;
		text-align: center;
	}
	.vehicle_inspect_box_name {
		text-align: left;
		line-height: 20px;
		word-break: break-all;
		word-wrap: break-word;
		width: 110px;
	}

	.vehicle_inspect_box_next {
		color: red;
		height: 24px;
		width: 100%;
	}

	.vehicle_inspect_scroll_box {
		height: 96px;
		width: 100%;
		overflow: auto;
	}

	#amount {
		display: inline-block;
		width: 63px;
	}
	#mile {
		display: inline-block;
		width: 75px;
		line-height: 20px;
		word-wrap: break-word;
		word-break: break-all;
	}

	/* 滚动条滚动样式 */
	table tbody {
		display: block;
		height: 120px;
		overflow-y: scroll;
	}

	table thead, tbody tr {
		display: table;
		width: 100%;
		table-layout: fixed;
	}

	table thead {
		box-sizing: border-box;
		padding-right: 17px; /* 滚动条样式 */
		background-color: #F5FAFE;
		/*width: calc(100% - 1em);*/
	}

</style>
<script>
	import * as base from '../assets/js/base.js';
	import moment from "moment";

	export default{
		ready () {
			let that = this;
			let ajaxUrl = '';
			let ajaxType = '';
			let requireData = null;
			let getData = this.data;
//			console.log(getData);

//			base.verticalCenter('.layui-modify');
//
			ajaxUrl = `${this.type}${this.data.id}/file/`;
			ajaxType = 'GET';
//			console.log(ajaxUrl);
//			console.log(ajaxType);
			$.ajax({
				url: ajaxUrl,
				type: ajaxType,
				data: null
			}).always((data) => {
				// 这里的返回值就是items对象，所以下面这句话的作用就无法体现
				base.ajaxCallback(data, function () {
				// 直接用data就好
//					let resultData = data.results;
				let resultData = data;
//			console.log('resdata------------------');
//			console.log(resultData);
			if (resultData) {
				that.insurance_vos = resultData.insurance_vos ? resultData.insurance_vos : [];
				that.quarterly_verification_vos = resultData.quarterly_verification_vos ? resultData.quarterly_verification_vos : [];
				that.annual_verification_vos = resultData.annual_verification_vos ? resultData.annual_verification_vos : [];
				that.maintenance_vos = resultData.maintenance_vos ? resultData.maintenance_vos : [];
				that.peccancy_vos = resultData.peccancy_vos ? resultData.peccancy_vos : [];
			}
		})
		})

		},
		/**
		 * title 页面名称
		 * type add --> 新增；modify --> 修改
		 * vehicle 车辆类型 bus --> 通勤车； vehicle --> 公务车(没做判断)
		 * data 数据
		 */
		props: ['title', 'type', 'data'],
		data: function () {
			return {
				insurance_vos: [],
				quarterly_verification_vos: [],
				annual_verification_vos: [],
				maintenance_vos: [],
				peccancy_vos: [],
				repair_vos: []
			}
		},
		methods: {
			close: function () {
				this.$dispatch('dialog-close');
			},
		}
	}
</script>
