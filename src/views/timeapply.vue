<template>
	<!-- 添加 -->
	<add_procedure :type="dialogType" :add_type="dialogAdd" :data="dialogData" v-if="isShowAdd"
				   v-on:dialog-close="closeAdd"></add_procedure>

	<select_procedure v-if="showSelect" :data="items"  v-on:dialog-close="closeSelect" @dialog-add="addProcedure"></select_procedure>

    <section class="Hui-article-box">
	    <div class="page-container">
	    	<h3 class="hs">公务车申请规则</h3>
	             <form class="form form-horizontal layui-layer-wrap">
					 <div class="row cl" >
						 <label class="form-label f-l col-5 ">是否启用公务车：</label>
						 <div class="formControls f-l col-4" id="is_Enable">
							 <label class="col-4">
								 <input type="radio" @click="toggleY"  value="true" :checked="can_apply" >
								 开启
							 </label>

							 <label class="col-4">
								 <input type="radio" @click="toggleY"  value="false" :checked="!can_apply">
								 关闭
							 </label>
						 </div>
					 </div>
					 <div class="row cl" >
						 <label class="form-label f-l col-5 "> 公务车用车需提前：</label>
						 <div class="formControls f-l col-4" id="input1">
							 <input  class="input-text col-5" v-model="preset_time" type="text" name="">
							 <span class="inline-block">分钟发出申请</span>
						 </div>
					 </div>
					 <div class="row cl">
						 <label class="form-label f-l col-5 "> 可发起用车的申请时间段：</label>
						 <div class="formControls f-l col-4">
							 <input style="width:45%"  v-model="before_apply_time" type="text" class="input-text" id="GO-datetimepicker" /> --
							 <input style="width:45%" v-model="end_apply_time" type="text" class="input-text" id="RETURN-datetimepicker" />
						 </div>
					 </div>
					 <div class="row cl">
						 <label class="form-label f-l col-5 ">选择公务车市区 ：</label>
						 <div class="formControls f-l col-6">
							 <div class="lh-30 f-l">
								 <select class="select-box" v-model="provinceObj" @change="changeProvince()">
									 <option v-for="province in areas" :value="province">{{province.name}}</option>
								 </select>
								 <span>
									 省
								 </span>
							 </div>
							 <div class="lh-30 f-l ml-5">
								 <select class="select-box" v-model="currentCity">
									 <option v-for="city in provinceObj.child" :value="city.name">{{city.name}}</option>
								 </select>
								 <span>
									 市
								 </span>
							 </div>
							 <a class="btn btn-primary radius f-l ml-5" href="javascript:;" v-on:click="addCity()">添加</a>
						 </div>
					 </div>
					 <div class="row cl">
						 <label class="form-label f-l col-5 ">市区地址 ：</label>
						 <div class="formControls f-l col-6">
							 <div class="tag-box">
								 <ul class="selected-box">
									 <li class="tag-item pt-5" v-for="(index,tag) in cityArr">
										<span title="{{tag.province}}--{{tag.city}}">
											{{tag.province}}--{{tag.city}}
										</span>
										 <i class="tag_delete" @click="deleteTag(index)">x</i>
									 </li>
								 </ul>
							 </div>
						 </div>
					 </div>

					 <div class="row cl">
						 <label class="form-label f-l col-5 ">请添加出市的流程审批 ：</label>
						 <div class="formControls f-l col-6">
							 <!--后台在新增流程时返回的数据格式不同,暂时不可用 2018-12-14-->
							 <!--<a class="btn btn-primary radius f-l ml-5" href="javascript:;" v-on:click="addApply()">添加流程审批</a>-->
							 <a class="btn btn-primary radius f-l ml-5" href="javascript:;" v-on:click="selectApply()">选择已有审批流程</a>
						 </div>
					 </div>

					 <div class="row cl">
						 <!--<div class="text-c" v-if="items.length == 0">暂无任何审批流程~</div>-->
						 <table v-if="items.length != 0" class="table table-border table-bg table-bordered table-hover ml-20 mr-20">
							 <thead class="text-c">
							 <tr>
								 <th width="100">流程名称</th>
								 <th width="400" class="max-400">生效范围</th>
								 <th width="400" class="max-400">流程顺序</th>
								 <th width="100">操作</th>
							 </tr>
							 </thead>
							 <tbody>
							 <tr class="text-c" v-for="item in items">
								 <td>{{item.approv_name}}</td>
								 <td class="max-400">{{item | getRule}}</td>
								 <td class="max-400">{{item | getNode}}</td>
								 <td>
									 <!--<a title="编辑" href="javascript:;" v-on:click="modifyProcedure(item,$index)">-->
										 <!--<i class="Hui-iconfont">&#xe6df;</i>-->
									 <!--</a>-->
									 <a title="删除" href="javascript:;" class="ml-5" v-on:click="deleteProcedure(item,$index)">
										 <i class="Hui-iconfont">&#xe6e2;</i>
									 </a>
								 </td>
							 </tr>
							 </tbody>
						 </table>
					 </div>

					 <div class="row cl" >
						 <label class="form-label f-l col-5 ">司机流程控制：</label>
						 <div class="formControls f-l col-6 mt-3">
							 <div class="f-l col-12 ">
								 <span>确认接单</span>
								 <label class="col-4">
									 <input type="radio" @click="toggleControl('can_order',1)" value="true" :checked="can_order" >
									 是
								 </label>
								 <label class="col-4">
									 <input type="radio" @click="toggleControl('can_order')" value="true" :checked="!can_order" >
									 否
								 </label>
							 </div>

							 <div class="f-l col-12 ">
								 <span>确认上车</span>
								 <label class="col-4">
									 <input type="radio" @click="toggleControl('can_get_on',1)" value="true" :checked="can_get_on" >
									 是
								 </label>
								 <label class="col-4">
									 <input type="radio" @click="toggleControl('can_get_on')" value="true" :checked="!can_get_on" >
									 否
								 </label>
							 </div>

							 <div class="f-l col-12 ">
								 <span>确认下车</span>
								 <label class="col-4">
									 <input type="radio" @click="toggleControl('can_get_off',1)" value="true" :checked="can_get_off" >
									 是
								 </label>
								 <label class="col-4">
									 <input type="radio" @click="toggleControl('can_get_off')" value="true" :checked="!can_get_off" >
									 否
								 </label>
							 </div>
						 </div>
					 </div>


					 <div class="row cl text-c" style="margin-top:30px">
						 <a class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="save()"> 确认提交</a>
					 </div>
	         </form>
	         </div>
    </section>
	<div class="m-loading" v-if="itemsLoading">
		<div class="cube1"></div>
		<div class="cube2"></div>
	</div>
</template>

<style scoped lang="less" rel="stylesheet/less">
	.select-box{
		width:120px;
	}
	.col-5{
		width:45%;
	}
	.form-horizontal{
		border:1px solid #999999;
		border-radius: 10px;
		/*height:300px !important;*/
	}
	.form {
		padding-left: 0px;
		width:100%;
	    /*height: 600px;*/
	    /*margin: 0px 250px;*/
	    position: relative;
		padding-bottom: 10px;
	}
	.row>table{
		width:97%;
	}

	.tag-box{
		display: inline-block;
		width: 100%;
		.selected-box,.select-tags-box{
			width: 100%;
			display: inline-block;
			min-height: 37px;
			border-radius: 5px;
			border: 1px solid #ccc;
			background-color: #fff;
			padding: 5px 10px;
			padding-top: 0;
			box-sizing: border-box;
			max-height: 150px;
			overflow-y: auto;

		}
		.tag-item {
			position: relative;
			text-align: center;
			float: left;
			/*width: 28%;*/
			color: #eee;
			font-size: 14px;
			line-height: 25px;
			margin-left: 5px;
			margin-top: 5px;
			border-radius: 5px;
			background-color: #ff9542;
			cursor: pointer;
			box-sizing: border-box;
			padding: 0 5px;
			height: 25px;
			span {
				width: 100%;
				height: 100%;
				display: block;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
		.tag_delete {
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
	.mt-3{
		margin-top: 3px;
	}



</style>
<script>

	import * as base from '../assets/js/base.js';
	import area from '../assets/js/ares';
    import add_procedure from '../components/add_procedure.vue';
    import select_procedure from '../components/selectOfficialcarApply.vue';

      export default{
        ready () {
        	// console.log(this.preset_time);
        	this.get_rule();
        	$('#GO-datetimepicker').datetimepicker({
                datepicker:false,
                format:'H:i',
                step:5
            });
            $('#RETURN-datetimepicker').datetimepicker({
                datepicker:false,
                format:'H:i',
                step:5
            });
        },
        //动态传值
        props: [],
        data:function(){
            return {
            	rule_id: '',
            	have_set_rule: false,
            	can_apply: false, // 是否允许申请
				can_order:false, // 是否允许接单
				can_get_on:false, // 确认上车
				can_get_off:false, // 确认下车
                before_apply_time:'00:00',
                end_apply_time: '00:00',
                preset_time: 0,
                areas:area,
                provinceObj:{child:{}},
				cityArr:[],
				cityName:"",
                currentCity:"",
                dialogType:10,
                dialogAdd:"add",
                dialogData:[],
                isShowAdd:false,
                itemsLoading:false,
                items:[],
                showSelect:false,
                dataIndex:"",
                // isOpen:true,

            }
        },
        methods: {

        	toggleY: function(){
	            this.can_apply = !this.can_apply;
	        },
	        get_rule: function(){
	        	let that = this;
	        	$.ajax({
                    url: base.gAjaxUrl.officialcarrules,
                    type: 'GET',
                })
                .success ((data)=>{
                    base.ajaxCallback(data,()=>{
                        // console.log('初始状态:',localStorage.timeapplyPromptFlag);
                        // console.log(localStorage);
                        //判断是否是第一次进入该新功能或页面从而弹出新功能的提示
                        if(localStorage.timeapplyPromptFlag == 'true'){
                            let arrObj = [$('#is_Enable'),$('#input1'),$('#GO-datetimepicker'),$('#RETURN-datetimepicker'),];
                            // let flag = localStorage.timeapplyPromptFlag;
                            let arrTitle = ['先在这里启用规则才可以设置','设置要乘车需要提前的小时','设置可发起用车的起始时间','设置可发起用车的结束时间',];
                            var promptTypes = ['timeapplyPromptFlag',];
		                    // console.log(promptTypes[0]);
		                    $.guidance({
		                        obj:arrObj,
		                        title:arrTitle,
		                        flag:promptTypes,
		                    });
                        }
                    	if(data[0]){
                    	    let applyData = data[0];
                            that.have_set_rule = true;
                    		that.rule_id = applyData.id;
	                        that.can_apply = applyData.can_apply;
                            data[0].before_apply_time = applyData.before_apply_time.toString();
                            data[0].end_apply_time = applyData.end_apply_time.toString();
                            that.before_apply_time = applyData.before_apply_time.slice(0,applyData.before_apply_time.lastIndexOf(':'));
			                that.end_apply_time = applyData.end_apply_time.slice(0,applyData.end_apply_time.lastIndexOf(':'));
			                that.preset_time = applyData.preset_time;
			                that.can_get_on = applyData.driver_confim_go_on;
			                that.can_get_off = applyData.driver_confim_go_off;
			                that.can_order = applyData.driver_confim_receipt;
			                that.items = applyData.approval_simple;
			                that.cityArr = applyData.city_addr || [];
			                // console.log('have_set_rule:');
			                // console.log(that.have_set_rule);
                    	}
                    	else{
			                that.rule_id = "";
	                        that.can_apply = false;
			                that.before_apply_time = "";
			                that.end_apply_time = "";
			                that.preset_time = "";
                            layer.msg('您还没设置过时间申请规则，现在可以设置!',{icon:1,time:1000});

                        }

                    });
                })
	        },

            save: function(){

                let arr = this.cityArr.map((item,idenx,array)=>{
                    return {city:item.city,province:item.province}
                })
                let applyArr = this.items.map((item,idenx,array)=>{
                    return item.id;
                })

				if(arr.length == 0 && applyArr.length > 0){
                    layer.msg("请添加公务车市区",{icon:2,time:1500});
				    return
				}
                if(arr.length > 0 && applyArr.length == 0){
                    layer.msg("请选择出市的审批流程",{icon:2,time:1500});
                    return
                }
                let timeReg = /^\d{2}:\d{2}$/;
                if(!timeReg.test(this.before_apply_time) || !timeReg.test(this.end_apply_time)){
                    layer.msg("请填写正确的可用车时间段",{icon:2,time:3000});
                    return
                }
                if(!/^\d+$/.test(this.preset_time)){
                    layer.msg("请填写用车需提前的正确时间",{icon:2,time:3000});
                    return
				}



                this.itemsLoading = true;
                let params = {
                    can_apply: this.can_apply,
                    before_apply_time:this.before_apply_time,
                    end_apply_time: this.end_apply_time,
                    preset_time: this.preset_time,
                    driver_confim_receipt:this.can_order,
                    driver_confim_go_on:this.can_get_on,
                    driver_confim_go_off:this.can_get_off,
                    city_addr:arr,
                    approval:applyArr,
                }


                // $('#J-layer-form').submit();
                if(this.have_set_rule){
                	let that = this;
                	$.ajax({
	                    url: base.gAjaxUrl.officialcarrules+that.rule_id+"/",
	                    type: 'PATCH',
						contentType:"application/json",
	                    data:JSON.stringify(params)
                    })
	                .always((data)=>{
                        this.itemsLoading = false;
	                    base.ajaxCallback(data,()=>{
	                    	layer.msg('修改规则成功',{icon:1,time:1000});
	                    });
	                })
                }else{

                	$.ajax({
	                    url: base.gAjaxUrl.officialcarrules,
	                    type: 'POST',
                        contentType:"application/json",
                        data:JSON.stringify(params)
                    })
	                .always((data)=>{
                        this.itemsLoading = false;
	                    base.ajaxCallback(data,()=>{
	                    	this.have_set_rule = true;
	                    	this.rule_id = data.id;
	                    	layer.msg('新增规则成功',{icon:1,time:1000});
	                    });
	                })
                }
            },
            addCity:function(){
        	    if(!this.currentCity){
                    layer.msg("请先选择市区",{icon:2,time:1500});
                    return;
				}

				for (let item of this.cityArr){
				    if(item.province == this.provinceObj.name && item.city == this.currentCity){
				        layer.msg("该城市地区已经存在,请勿重复添加",{icon:2,time:1500});
				        return;
					}
				}
        	    this.cityArr.push({province:this.provinceObj.name,city:this.currentCity})
            },
            deleteTag:function(i){
                this.cityArr.splice(i,1)
			},
            changeProvince:function(){
                this.currentCity = '';
			},
            addApply:function(){
                this.dialogAdd = 'add';
				this.isShowAdd = true;
			},
            closeAdd:function(){
                this.isShowAdd = false;
			},
            deleteProcedure: function (item,i) {
                layer.confirm(`确认删除【${item.approv_name}】流程？`, (index) => {
                    layer.close(index);
                    this.items.splice(i,1)
                })
            },
            getName (arr, key) {
                let str = '';
                arr.forEach((item) => {
                    str += item[key] + '、';
                });
                return str.slice(0, -1) || '--';
            },
            toggleControl:function(key,flag){
                if(flag){
				    this[key] = true
				}else{
                    this[key] = false;
				}
			},
            selectApply:function(){
                this.showSelect = true;
			},
            closeSelect:function(){
                this.showSelect = false;
			},
            addProcedure:function(applyArr){
                this.showSelect = false;
                this.items = [...applyArr];
			},
        },
          filters: {
              getRule (item) {
                  let rule = item.approv_rule;
                  if(!rule) {
                      return '--'
                  }
                  let str = '';
                  let key = '';
                  let arr = null;
                  if(item.scope_type == 10) { // 10 表示员工; 20 表示部门
                      arr = rule.staffs || [];
                      key = 'real_name';
                      str = '指定人员: ';
                  } else {
                      arr = rule.departments || [];
                      key = 'department_name';
                      str = '指定部门: ';
                  }
                  return str + this.getName(arr, key);
              },
              getNode (item) {
                  if(item.approv_nodes.length) {
                      let approve = item.approv_nodes;
                      let str = '';
                      approve.forEach((progress) => {
                          str += this.getName(progress.approvers, 'real_name') + ' → ';
                      });
                      return str.slice(0, -3) || '--';
                  } else {
                      return '--'
                  }
              },
          },
        components:{
            add_procedure:add_procedure,
            select_procedure:select_procedure,
		}
    }

</script>


