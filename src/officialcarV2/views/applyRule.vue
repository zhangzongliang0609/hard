<template>
    <!-- 添加 -->
    <add_procedure :type="dialogType" :add_type="dialogAdd" :data="dialogData" v-if="isShowAdd"
                   v-on:dialog-close="closeAdd"></add_procedure>

    <select_procedure v-if="showSelect" :data="items"  v-on:dialog-close="closeSelect" @dialog-add="addProcedure"></select_procedure>

    <select_staff v-if="isShowSelectStaff" :list="[]" :is_single="false" v-on:sel-close="staffClose"
                  v-on:sel-save="staffSave" :official_apply="true"></select_staff>
    <section class="Hui-article-box">
        <div class="page-container">
            <div class="panel panel-default radius mb-5">
                <div class="panel-body clearfix">
                    <span class="f-20 fw-b f-l">用车规则</span>
                </div>
            </div>
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
                    <label class="form-label f-l col-5 "> 可用车时间段：</label>
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
                                <li class="tag-item pt-5" v-for="(index,city) in cityArr">
										<span title="{{city}}">
											{{city}}
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
                        <a class="btn btn-primary radius f-l ml-5" href="javascript:;" v-on:click="selectApply()">选择出市审批流程</a>
                    </div>
                </div>
                <div class="row cl">
                    <!--<div class="text-c" v-if="items.length == 0">暂无任何审批流程~</div>-->
                    <table v-if="cityApplyArr.length != 0" class="table table-border table-bg table-bordered table-hover ml-20 mr-20">
                        <thead class="text-c">
                        <tr>
                            <th width="100">流程名称</th>
                            <th width="400" class="max-400">生效范围</th>
                            <th width="400" class="max-400">流程顺序</th>
                            <th width="100">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr class="text-c" v-for="item in cityApplyArr">
                            <td>{{item.approv_name}}</td>
                            <td class="max-400">{{item | getRule}}</td>
                            <td class="max-400">{{item | getNode}}</td>
                            <td>
                                <!--<a title="编辑" href="javascript:;" v-on:click="modifyProcedure(item,$index)">-->
                                <!--<i class="Hui-iconfont">&#xe6df;</i>-->
                                <!--</a>-->
                                <a title="删除" href="javascript:;" class="ml-5" v-on:click="deleteProcedure(item,$index,true)">
                                    <i class="Hui-iconfont">&#xe6e2;</i>
                                </a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>


                <div class="row cl">
                    <label class="form-label f-l col-5 ">选择公务车省份 ：</label>
                    <div class="formControls f-l col-6">
                        <div class="lh-30 f-l">
                            <select class="select-box" v-model="provinceName">
                                <option v-for="province in areas" :value="province.name">{{province.name}}</option>
                            </select>
                            <span>
									 省
                            </span>
                        </div>
                        <a class="btn btn-primary radius f-l ml-5" href="javascript:;" v-on:click="addProvince()">添加</a>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-5 ">省份地址 ：</label>
                    <div class="formControls f-l col-6">
                        <div class="tag-box">
                            <ul class="selected-box">
                                <li class="tag-item pt-5" v-for="name in selectedProvince">
										<span title="{{name}}">
											{{name}}
										</span>
                                    <i class="tag_delete" @click="deleteProvince($index)">x</i>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-5 ">请添加出省的流程审批 ：</label>
                    <div class="formControls f-l col-6">
                        <!--后台在新增流程时返回的数据格式不同,暂时不可用 2018-12-14-->
                        <!--<a class="btn btn-primary radius f-l ml-5" href="javascript:;" v-on:click="addApply()">添加流程审批</a>-->
                        <a class="btn btn-primary radius f-l ml-5" href="javascript:;" v-on:click="selectProvinceApply()">选择出省审批流程</a>
                    </div>
                </div>
                <div class="row cl">
                    <!--<div class="text-c" v-if="items.length == 0">暂无任何审批流程~</div>-->
                    <table v-if="provinceApplyArr.length != 0" class="table table-border table-bg table-bordered table-hover ml-20 mr-20">
                        <thead class="text-c">
                        <tr>
                            <th width="100">流程名称</th>
                            <th width="400" class="max-400">生效范围</th>
                            <th width="400" class="max-400">流程顺序</th>
                            <th width="100">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr class="text-c" v-for="item in provinceApplyArr">
                            <td>{{item.approv_name}}</td>
                            <td class="max-400">{{item | getRule}}</td>
                            <td class="max-400">{{item | getNode}}</td>
                            <td>

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

                <div class="row cl" >
                    <label class="form-label f-l col-5 ">司机车辆不足拒绝申请：</label>
                    <div class="formControls f-l col-6 mt-3">
                        <select class="select-box"  v-model="rejectType">
                            <option value="0">不拒绝</option>
                            <option value="1">司机不足</option>
                            <option value="2">车辆不足</option>
                            <option value="3">司机车辆不足</option>
                        </select>
                    </div>
                </div>

                <div class="row cl">
                    <label class="form-label f-l col-5 ">公务车拒绝申请提示语：</label>
                    <div class="formControls f-l col-6 mt-3">
                        <textarea v-model="hintText" class="textarea" id="" cols="30" rows="10"></textarea>
                    </div>
                </div>

                <div class="row cl" >
                    <label class="form-label f-l col-5 ">是否可以拼车：</label>
                    <div class="formControls f-l col-6 mt-3">
                        <div class="f-l col-12 ">
                            <label class="col-4">
                                <input type="radio" @click="toggleControl('carSharing',1)" value="true" :checked="carSharing" >
                                是
                            </label>
                            <label class="col-4">
                                <input type="radio" @click="toggleControl('carSharing')" value="true" :checked="!carSharing" >
                                否
                            </label>

                        </div>
                    </div>
                </div>

                <div class="row cl" >
                    <label class="form-label f-l col-5 ">是否可以加急：</label>
                    <div class="formControls f-l col-6 mt-3">
                        <div class="f-l col-12 ">
                            <label class="col-4">
                                <input type="radio" @click="toggleControl('urgent',1)" value="true" :checked="urgent" >
                                是
                            </label>
                            <label class="col-4">
                                <input type="radio" @click="toggleControl('urgent')" value="true" :checked="!urgent" >
                                否
                            </label>
                        </div>
                    </div>
                </div>


                <div class="row cl" >
                    <label class="form-label f-l col-5 ">是否开启多个行程：</label>
                    <div class="formControls f-l col-6 mt-3">
                        <div class="f-l col-12 ">
                            <label class="col-4">
                                <input type="radio" @click="toggleControl('muitipleTravel',1)" value="true" :checked="muitipleTravel" >
                                是
                            </label>
                            <label class="col-4">
                                <input type="radio" @click="toggleControl('muitipleTravel')" value="true" :checked="!muitipleTravel" >
                                否
                            </label>
                            <label class="col-4">
                                <div class="relative message inline-block">
                                  <span class="Hui-iconfont cursor-p query ml-5 f-20">&#xe633;
                                  </span>
                                    <span class="message-box">
                                        开启该功能后，司机可以同时开始多个行程。关闭后，司机只能开始一个行程，想要开始新的行程只能在前一个行程结束后才能开始新行程。
                                    </span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="row cl" >
                    <label class="form-label f-l col-5 ">是否开启司机反馈：</label>
                    <div class="formControls f-l col-6 mt-3">
                        <div class="f-l col-12 ">
                            <label class="col-4">
                                <input type="radio" @click="toggleControl('driverFeedback',1)" value="true" :checked="driverFeedback" >
                                是
                            </label>
                            <label class="col-4">
                                <input type="radio" @click="toggleControl('driverFeedback')" value="true" :checked="!driverFeedback" >
                                否
                            </label>
                        </div>
                    </div>
                </div>

                <div class="row cl" >
                    <label class="form-label f-l col-5 ">管理员通知：</label>
                    <div class="formControls f-l col-6 mt-3">
                        <a class="btn btn-primary radius f-l ml-5" href="javascript:;" v-on:click="selectAdministrator()">选择管理员</a>
                    </div>
                </div>

                <div class="row cl">
                    <!--<div class="text-c" v-if="items.length == 0">暂无任何审批流程~</div>-->
                    <table v-if="staffs.length != 0" class="table table-border table-bg table-bordered table-hover ml-20 mr-20">
                        <thead class="text-c">
                        <tr>
                            <th width="100">订单状态</th>
                            <th width="400" class="max-400">管理员名称</th>
                            <th width="100">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr class="text-c" v-for="item in staffs">
                            <td>{{item.order_status | filterStatus }}</td>
                            <td>{{item.real_name}}</td>
                            <td>
                                <a title="删除" href="javascript:;" class="ml-5" v-on:click="deleteStaff(item,$index)">
                                    <i class="Hui-iconfont">&#xe6e2;</i>
                                </a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
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

    /*.icon-hover > .message-box {*/
        /*display: block;*/
    /*}*/
    .message:hover .message-box{
        display: block;
    }

    .message-box {
        display: none;
        color: white;
        position: absolute;
        left: -69px;
        top: 30px;
        padding: 10px;
        width: 140px;
        /*height: 100px;*/
        background: #088cb7;
        -moz-border-radius: 12px;
        -webkit-border-radius: 12px;
        border-radius: 12px;
        z-index: 999;
    }

    .message-box:before {
        position: absolute;
        content: "";
        width: 0;
        height: 0;
        right: 32%;
        top: -20px;
        border-top: 13px solid transparent;
        border-right: 26px solid transparent;
        border-left: 26px solid transparent;
        border-bottom: 13px solid #088cb7;
    }

</style>
<script>

    import * as base from '../../assets/js/base.js';
    import area from '../../assets/js/ares';
    import  moment from "moment";
    import add_procedure from '../components/add_procedure.vue';
    import select_procedure from '../components/selectOfficialcarApply.vue';
    import select_staff from '../components/selectStaff.vue';

    export default{
        ready () {
            this.get_rule();
            this.getApply();
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
                currentCity:"",
                dialogType:10,
                dialogAdd:"add",
                dialogData:[],
                isShowAdd:false,
                itemsLoading:false,
                showSelect:false,
                selectedProvince:[],
                provinceName:"",
                provinceApplyArr:[], // 出省审批流程
                cityApplyArr:[], // 出市审批流程
                selectApplyType:"city", // 选择审批流程的类型
                rejectType:0, // 拒绝员工申请的条件 1--司机不足,2--车辆不足,3--司机车辆不足
                carSharing:false, // 是否允许拼车
                urgent:false, // 是否允许加急
                hintText:"", // 公务车拒绝的提示语
                administratorArr:[], // 管理员数组
                muitipleTravel:false, // 是否允许多个行程
                driverFeedback:false, // 是否允许司机反馈
                isShowSelectStaff:false,  // 显示选择员工
                staffs:[], // 已经选择的管理员
            }
        },
        methods: {

            toggleY: function(){
                this.can_apply = !this.can_apply;
            },

            getApply:function(){
                $.ajax({
                    url:base.gAjaxUrl.procedure,
                    type:"GET",
                    data:{
                        rule:"city",
                        approv_type: 60,
                        page_size:999,
                    }
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
                        this.cityApplyArr = data.results || [];
                    })
                })

                $.ajax({
                    url:base.gAjaxUrl.procedure,
                    type:"GET",
                    data:{
                        rule:"province",
                        approv_type: 60,
                        page_size:999,
                    }
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
                        this.provinceApplyArr = data.results || [];
                    })
                })
            },
            get_rule: function(){
                let that = this;
                $.ajax({
                    url: base.gAjaxUrl.officialcarApplyRule_V2,
                    type: 'GET',
                }).success ((data)=>{
                        base.ajaxCallback(data,()=>{
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
                                that.cityArr = applyData.city || [];
                                that.selectedProvince = applyData.province || [] ;
                                // that.cityApplyArr = applyData.city_province || [] ;
                                // that.provinceApplyArr = applyData.approval_province || [];
                                that.carSharing = applyData.can_carpool;
                                that.urgent = applyData.can_urgent;
                                that.muitipleTravel = applyData.can_trip;
                                that.rejectType = applyData.refuse_type;
                                that.hintText = applyData.refuse_remark;
                                that.staffs = applyData.notice_json;
                                that.driverFeedback = applyData.driver_feedback;
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

                if((!this.preset_time && this.preset_time !== 0) || this.preset_time < 0){
                    layer.msg("请填写正确的用车提前时间",{icon:2,time:3000});
                    return;
                }



                let nowDate = moment().format("YYYY-MM-DD");
                let timeReg = /^\d{2}:\d{2}$/;
                if(!timeReg.test(this.before_apply_time) || !timeReg.test(this.end_apply_time) || moment( nowDate + " " + this.before_apply_time).isAfter( nowDate + " " + this.end_apply_time)){
                    layer.msg("请填写正确的可用车时间段",{icon:2,time:3000});
                    return
                }

                let cityApplyArr = this.cityApplyArr.map((item)=>{
                    return item.id
                })

                if(this.cityArr.length > 0 && cityApplyArr.length == 0){
                    layer.msg("请选择出市的审批流程",{icon:2,time:2000});
                    return
                }

                let provinceApplyArr = this.provinceApplyArr.map((item)=>{
                    return item.id
                })

                if(this.selectedProvince.length > 0 && provinceApplyArr.length == 0){
                    layer.msg("请选择出省的审批流程",{icon:2,time:2000});
                    return
                }



                for (let item of cityApplyArr){
                    if(provinceApplyArr.includes(item)){
                        layer.msg("出省的审批流程与出市的审批流程不能使用同一个,请检查并删除此流程",{icon:2,time:3000});
                        return
                    }
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
                    can_carpool:this.carSharing,
                    can_urgent:this.urgent,
                    can_trip:this.muitipleTravel,
                    notice_json:this.staffs,
                    refuse_type:this.rejectType,
                    province:this.selectedProvince,
                    approval_province:provinceApplyArr,
                    city:this.cityArr,
                    approval_city:cityApplyArr,
                    refuse_remark:this.hintText,
                    driver_feedback:this.driverFeedback,
                }


                // $('#J-layer-form').submit();
                if(this.have_set_rule){
                    let that = this;
                    $.ajax({
                        url: base.gAjaxUrl.officialcarApplyRule_V2+that.rule_id+"/",
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
                        url: base.gAjaxUrl.officialcarApplyRule_V2,
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
                let value = "";
                if(!this.currentCity){
                    layer.msg("请先选择市区",{icon:2,time:1500});
                    return;
                }

                if(this.currentCity == "市辖区" || this.currentCity == "县"){
                    value = this.provinceObj.name;
                }else{
                    value = this.currentCity;
                }

                for (let item of this.cityArr){
                    if(item == value){
                        layer.msg("该城市地区已经存在,请勿重复添加",{icon:2,time:1500});
                        return;
                    }
                }
                this.cityArr.push(value)
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
            deleteProcedure: function (item,i,isCity) {
                layer.confirm(`确认删除【${item.approv_name}】流程？`, (index) => {
                    layer.close(index);
                    if(isCity){
                        this.cityApplyArr.splice(i,1);
                    }else{
                        this.provinceApplyArr.splice(i,1);
                    }
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
                this.items = [...this.cityApplyArr];
                this.selectApplyType = "city";
            },
            closeSelect:function(){
                this.showSelect = false;
            },
            addProcedure:function(applyArr){
                this.showSelect = false;
                if(this.selectApplyType == "city"){
                    this.cityApplyArr = [...applyArr];
                }else{
                    this.provinceApplyArr = [...applyArr];
                }
            },
            addProvince:function(){
                if(!this.provinceName){
                    layer.msg("请先选择省份",{icon:2,time:3000});
                    return;
                }
                for (let item of this.selectedProvince){
                    if(item == this.provinceName){
                        layer.msg("该省份已经添加,请勿重复添加",{icon:2,time:3000});
                        return;
                    }
                }
                this.selectedProvince.push(this.provinceName);
            },
            deleteProvince:function(i){
                this.selectedProvince.splice(i,1);
            },
            selectProvinceApply:function(){
               this.showSelect = true;
               this.items =  [...this.provinceApplyArr];
               this.selectApplyType = "province";
            },
            selectAdministrator:function(){
                this.isShowSelectStaff = true;
            },
            staffClose:function(){
                this.isShowSelectStaff = false;
            },
            staffSave:function(data,status){
                this.isShowSelectStaff = false;
                if(this.staffs.length == 0){
                    data.forEach((item)=>{
                        this.staffs.push({order_status:status,id:item.id,real_name:item.real_name});
                    })
                }else{
                    data.map((item)=>{
                        for (let i = 0; i < this.staffs.length; i++) {
                            if(status == this.staffs[i].order_status && item.id == this.staffs[i].id){
                                break;
                            }
                            if(i == this.staffs.length - 1){
                                this.staffs.push({order_status:status,id:item.id,real_name:item.real_name});
                            }
                        }
                    })
                }

            },
            deleteStaff:function(data,i){
                layer.confirm(`确认删除【${data.real_name}】管理员吗？`, (index) => {
                    layer.close(index);
                    this.staffs.splice(i,1)
                })
            },
        },
        filters: {
            filterStatus:function(type){

                // switch使用的是===强等
                switch (type) {
                    case "-20":{
                        return "已驳回"
                    }
                    case "-10":{
                        return "已取消"
                    }
                    case "10":{
                        return "审批中"
                    }
                    case "20":{
                        return "待派单"
                    }
                    case "30":{
                        return "待接送"
                    }
                    case "40":{
                        return "接送中"
                    }
                    case "50":{
                        return "已完成"
                    }
                    case "60":{
                        return "已评价"
                    }
                }
            },
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
            select_staff:select_staff,
        }
    }

</script>


