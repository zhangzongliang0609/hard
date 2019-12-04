

<template>
    <select_employee :members="staffList" v-if="showAdd" :title="dialogTitle" :type="dialogType"  v-on:dialog-close="closeDialog"  v-on:dialog-save="saveList">
    </select_employee>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">{{title}}</div>
        <div class="layui-layer-content">
            <form id="J-layer-form" class="form form-horizontal layui-layer-wrap">
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>报修区域：</label>
                    <div class="formControls f-l col-4">
                        <input v-model="aresNameInput" type="text" class="input-text" value="" placeholder="" name="type_name">
                    </div>
                </div>
            </form>
            <div class="cl rule-box">
                <div class="f-l cl ml-20">
                    <span class="f-l mt-5">是否需要审批</span>
                            <span class="open-box ml-5 f-l mt-5" :class="{'bc-blue':isApprov}" @click="changeCheck('isApprov')">
                                <span class="open-box-round" :class="isApprov?'open-box-open':'open-box-close'"></span>
                            </span>
                </div>

                <div class="f-l cl ml-20">
                    <span class="f-l mt-5">是否需要自动派单</span>
                            <span class="open-box ml-5 f-l mt-5" :class="{'bc-blue':isAutoSend}" @click="changeCheck('isAutoSend')">
                                <span class="open-box-round" :class="isAutoSend?'open-box-open':'open-box-close'"></span>
                            </span>
                </div>

                <div class="f-l cl ml-20">
                    <span class="f-l mt-5">是否需要支付</span>
                            <span class="open-box ml-5 f-l mt-5" :class="{'bc-blue':isPay}" @click="changeCheck('isPay')">
                                <span class="open-box-round" :class="isPay?'open-box-open':'open-box-close'"></span>
                            </span>
                </div>

                <div class="f-l cl ml-20">
                    <span class="f-l mt-5">是否需要审价</span>
                    <span class="open-box ml-5 f-l mt-5" :class="{'bc-blue':isApprovPrice}" @click="changeCheck('isApprovPrice')">
                                <span class="open-box-round" :class="isApprovPrice?'open-box-open':'open-box-close'"></span>
                            </span>
                </div>

                <div class="f-l cl ml-20">
                    <span class="f-l mt-5">是否需要验收</span>
                    <span class="open-box ml-5 f-l mt-5" :class="{'bc-blue':isAcceptance}" @click="changeCheck('isAcceptance')">
                                <span class="open-box-round" :class="isAcceptance?'open-box-open':'open-box-close'"></span>
                            </span>
                </div>
            </div>
            <div class="mt-10 pd-10">
                <div class="div-title cl mb-10">
                    <span class="hint-diamond f-l ml-10"></span>
                    <span class="f-l lh-30 ml-10">区域维修工</span>
                    <span class="f-l ml-10">
                        <a class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="clickAdd()"><i class="Hui-iconfont">&#xe600;</i>添加维修工</a>
                    </span>
                </div>
                <table class="table table-border table-bg table-striped">
                    <thead class="text-c">
                    <tr>
                        <th>姓名</th>
                        <th>部门/职位</th>
                        <th>工号</th>
                        <th>手机号</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="text-c" v-for="(index,item) in staffList">
                        <td>{{item.staff_vo ? item.staff_vo.real_name : item.real_name}}</td>
                        <td>{{item.staff_vo ? item.staff_vo.department_vo.department_name : item.department_vo.department_name}}</td>
                        <td>{{item.staff_vo ? item.staff_vo.job_number : item.job_number}}</td>
                        <td>{{item.staff_vo ? item.staff_vo.phone : item.phone}}</td>
                        <td>
                            <a title="删除" href="javascript:;" class="ml-5" v-on:click="deleteStaff(index)"><i class="Hui-iconfont">&#xe6e2;</i></a>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
        <div class="layui-layer-btn" v-on:click="save"><a class="layui-layer-btn0" v-if="type!='check'">保存</a></div>
    </div>
    <div class="layui-layer-shade"></div>
</template>

<style lang="less" scoped>
    .hint-diamond{
        height:31px;
        width:9px;
        background-color: #088cb7;
    }
    .rule-box{
        padding: 10px 0;
    }

</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import select_employee from "../components/select_employee.vue";

    let ajaxUrl = '';
    let ajaxType = '';

    export default{
        ready () {

            let that = this;
            let getData = this.data;

            base.verticalCenter('.layui-modify');
            //类型判断
            if(this.type == 'add'){
                ajaxUrl = base.gAjaxUrl.repairsArea;
                ajaxType = 'POST';
            }else if(this.type == 'modify'){
                ajaxUrl = `${base.gAjaxUrl.repairsArea}${getData.id}/`;
                ajaxType = 'PUT';
                this.aresNameInput = getData.area_name || '';
                this.staffList = [...getData.repairmans];
                this.isApprov = getData.need_approval || false;
                this.isAutoSend = getData.need_autosend || false;
                this.isPay = getData.need_pay || false;
                this.isApprovPrice = getData.need_examine_price || false;
                this.isAcceptance = getData.need_check || false;
            }
            //验证
            $('#J-layer-form').validate({
                rules: {
                    type_name: {
                        required: true,
                    },
                },
                submitHandler:function() {
                    if(that.isAutoSend && !that.staffList.length) {
                        layer.confirm("你的报修区域未分配维修工，确定要开启自动派单？", {title: '提示'},(index) => {
                            that.createArea();
                            layer.close(index);
                        });
                        return;
                    }
                    that.createArea();

                }
            });
        },
        props: ['title','type','data'],
        data:function(){
            return {
                aresNameInput:'',
                showAdd:false,
                staffList:[],
                isApprov: true,
                isAutoSend:false,
                isPay: true,
                isApprovPrice: true,
                isAcceptance:false, // 是否需要验收
                dialogTitle:'选择维修工',
                dialogType:"repairmen",
            }
        },
        methods: {
            createArea () {

                $.showLoading();
                $.ajax({
                    url:ajaxUrl,
                    type:ajaxType,
                    contentType:'application/json',
                    data:JSON.stringify({
                        area_name:this.aresNameInput,
                        repairman_set:this.staffList.map(item => item.id),
                        need_approval:this.isApprov,
                        need_autosend:this.isAutoSend,
                        need_pay:this.isPay,
                        need_examine_price:this.isApprovPrice,
                        need_check:this.isAcceptance,
                    }),
                }).always((data) => {
                    $.hideLoading();
                    base.ajaxCallback(data, () => {
                        layer.msg('提交成功',{icon:1,time:1000});
                        this.$dispatch('dialog-save');
                    });
                });
            },
            close:function(){
                this.$dispatch('dialog-close');
            },
            save:function(){
                $('#J-layer-form').submit();
            },
            clickAdd:function(){
                this.showAdd = true;
            },
            closeDialog:function(){
                this.showAdd = false;
            },
            saveList:function(list){
                this.showAdd = false;
//                this.saveFilter(list);
                this.staffList = list;
            },
            saveFilter: function (list) {
                list.forEach((item) => {
                    for(let i = 0, len = this.staffList.length; i < len; i++) {
                        if(item.id == this.staffList[i].id) {
                            return false
                        }
                    }
                    this.staffList.push(item);
                })
            },
            deleteStaff:function(i){
                this.staffList.splice(i,1)
            },
            changeCheck:function(key){
                this[key] = !this[key];
            }
        },
        components:{
            select_employee:select_employee,
        }
    }
</script>
