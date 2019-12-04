
<template>
	<ensure-peccancy :title="dialogTitle" :data="peccancyData" v-on:dialog-close="hideConfirm"  v-on:dialog-save="dealDone" v-if="isShowConfirm"></ensure-peccancy>
	<div class="layui-layer layui-anim layui-layer-page layui-modify details-box ">
		<div class="layui-layer-title">{{title}} </div>
		<div class="layui-layer-title vehicle_title">【{{data.car_no}}】 的违章信息</div>
		<div id="content-box"class="layui-layer-content pr-20">
			<table class="table table-border table-bordered table-hover table-bg table-sort">
			<thead>
			<tr class="text-c">
				<th>违章日期</th>
				<th>违反地址</th>
				<th>违反具体内容</th>
				<th>扣分</th>
				<th>罚款</th>
				<th>操作</th>
			</tr>
			</thead>
			<tbody>
			<tr class="text-c" v-if="items.length == 0">
				<td>无内容</td>
			</tr>
			<tr class="text-c" v-for="item in items">
				<td>{{item.ctime}}</td>
				<td>{{item.address}}</td>
				<td>{{item.reason}}</td>
				<td>{{item.vehicle_type}}</td>
				<td>{{item.point ? item.point : 0}}</td>
				<td>
					<div title="处理完成" href="javascript:;" v-on:click="dealConfirm(item)"><span class="btn-primary vehicle-btn">处理完成</span></div>
				</td>
			</tr>
			</tbody>
		</table>
		</div>
        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
	</div>
	<div class="layui-layer-shade"></div>
</template>

<style lang="less" rel="stylesheet/less" scoped>
	.vehicle_title {
		background-color: #fff;
		border: 0 none;
	}
	.details-box {
		height: 90%;
		width: 80%;
		min-height: 500px !important;
		max-height: 600px !important;
	}

	#content-box {
		position: absolute;
		top: 85px;
		left: 20px;
		right: 20px;
		bottom: 15px;
		min-height: 400px;
		max-height: 500px;
		box-sizing: border-box;
		overflow: auto;
	}

	.row > div:nth-child(1) {
		border-right: 1px solid #ccc;
	}

	.f-l p {
		line-height: 300%;
	}
	.vehicle-btn {
		display: block;
		width: 80px;
		padding: 5px 10px;
		margin: 0 auto;
		border-radius: 3px;
	}
	/* 滚动条滚动样式 */
	table tbody {
		display: block;
	}
	table thead, tbody tr {
		display: table;
		width: 100%;
		table-layout: fixed;
	}
	table thead {
		box-sizing: border-box;
		background-color: #F5FAFE;
		/*width: calc(100% - 1em);*/
	}
</style>
<script>
	import * as base from '../../assets/js/base.js';
	import ensurePeccancy from "./vehicleEnsurePeccancy.vue"

	let ajaxUrl = '';
	let ajaxType = 'GET';

	export default{
		ready(){

            base.verticalCenter('.layui-modify');

			ajaxUrl = `${this.type}${this.data.id}/peccancy/`;
//			if(this.vehicle == 'bus') { // 通勤车
//				ajaxUrl = `${base.gAjaxUrl.shuttlebusvehicles}${this.data.id}/peccancy/`;
//			} else if(this.vehicle == 'vehicle') { // 公务车
//				ajaxUrl = `${base.gAjaxUrl.officialcarvehicles}${this.data.id}/peccancy/`;
//			}

			this.loadList();

		},
		/**
		 * title 违章详情
		 * vehicle 车辆类型 bus --> 通勤车； vehicle --> 公务车(没做判断)
		 * data 数据
		 */
		props: ['title', 'type', "data"],
		data: function () {
			return {
				isShowConfirm: false,
				items: [],
				peccancyData:null,
				dialogTitle:this.title
			}
		},
		methods: {
			loadList: function () {
				var that = this;
				$.ajax({
					url: ajaxUrl,
					type: ajaxType,
				}).always((data)=>{
					base.ajaxCallback(data,()=>{
//						console.log('data--------------------');
//						console.log(data);
						that.items = data ? data : [];
					});
				})
			},
			close: function () {
				this.$dispatch('dialog-close');
			},
			hideConfirm: function () {
				this.isShowConfirm = false;
			},
			dealDone: function () {
				this.isShowConfirm = false;
				var that = this;
				$.ajax({
					url: ajaxUrl,
					type: 'POST',
					data: {
						peccancy: that.peccancyData.id
					}
				}).always((data)=>{
					base.ajaxCallback(data,()=>{
						console.log(data);
						that.loadList();
					});
				});

			},
			dealConfirm: function (item) {
				this.peccancyData = item;
				this.dialogTitle = this.data.car_no
				this.isShowConfirm = true;
			}
		},
		components: {
			ensurePeccancy
		}
	}
</script>