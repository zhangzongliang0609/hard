<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">{{title}}</div>
        <div class="layui-layer-content">
            <form id="J-layer-form" class="form form-horizontal layui-layer-wrap">
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>姓名：</label>
                    <div class="formControls f-l col-4">
                        <input v-model="usernameInput" type="text" class="input-text" value="" placeholder="" name="username">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>电话：</label>
                    <div class="formControls f-l col-4">
                        <input v-model="phoneInput" type="text" class="input-text" value="" placeholder="" name="phone">
                    </div>
                </div>

                <div class="row cl">
                    <label class="form-label f-l col-4 ">单位/公司：</label>
                    <div class="formControls f-l col-4">
                        <input v-model="companyName" type="text" class="input-text" value="" placeholder="" >
                    </div>
                </div>
                <!--<div class="row cl">-->
                <!--<label class="form-label f-l col-4 ">身份证号：</label>-->
                <!--<div class="formControls f-l col-4">-->
                <!--<input v-model="id_card" type="text" class="input-text" value="" placeholder="" name="id_card">-->
                <!--</div>-->
                <!--</div>-->
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red" v-if="passwrodFlag">*</span>密码：</label>
                    <div class="formControls f-l col-4">
                        <input id="password" v-model="passwordInput" type="password" class="input-text" value="" placeholder="" name="password">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red" v-if="passwrodFlag">*</span>确认密码：</label>
                    <div class="formControls f-l col-4">
                        <input type="password" class="input-text" value="" placeholder="" name="confirm_password">
                    </div>
                </div>

            </form>
        </div>
        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
        <button   class="btn btn-primary radius f-r mr-10 mb-10" v-on:click="save()">保存</button>
        <button   class="btn btn-primary radius f-r mr-10 mb-10" v-on:click="saveAndActivate()">保存并激活</button>

    </div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
    <div class="layui-layer-shade"></div>

    <!--弹出选择时效的选择框-->
    <div v-show="false" id="addTimeChoiceDiv" class="form-horizontal">
        <div class="row cl">
            <label class="form-label f-l col-4 ">账号开始使用日期:&nbsp;</label>
            <div class="formControls f-l col-6">
                <input v-model="startDate" type="text" class="input-text" id="startDate">
            </div>
        </div>
        <div class="row cl">
            <label class="form-label f-l col-4 ">账号结束使用日期:&nbsp;</label>
            <div class="formControls f-l col-6">
                <input v-model="dueDate" type="text" class="input-text" id="dateInput">
            </div>
        </div>
        <button   class="btn btn-primary radius f-r mr-10 mt-20" v-on:click="confirmTime">确认</button>
    </div>
</template>

<style lang="less" rel="stylesheet/less">
    .kalendae.k-floating{
        z-index: 9999999999999 !important;
    }

</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import moment from "moment";
    export default{
        ready () {
            let that = this;
            this.dueDate = this.end;

            new Kalendae.Input('startDate', {
                months: 1,
                clickHide: true
            });

            new Kalendae.Input('dateInput', {
                months: 1,
                clickHide: true
            });

            if(this.type == 'modify'){
                let data = this.item;
                this.passwrodFlag = false;
                this.usernameInput = data.real_name;
                this.phoneInput = data.phone;
                this.companyName = data.vistor_company;
                this.id_card = data.id_card;
                this.dueDate = data.due_date;
                this.ajaxUrl = `${this.ajaxUrl}${data.id}/`;
                this.ajaxType = 'PATCH';
            }
            base.verticalCenter('.layui-modify');

            $.validator.addMethod('mobile', function( value, element ){
                return this.optional( element ) || /^1\d{10}$/.test( value );
            }, '请输入正确的手机号码');
            $.validator.addMethod("idCard",function(value,element,params){
                if(!value) {
                    return true;
                } else {
                    // 18位和15位身份证号验证
                    return /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value) || /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/.test(value);
                }
            }, "请输入正确的身份证号");
            // $.validator.addMethod("cardNumber",function(value,element,params){
            //     return /^[0-9a-fA-F]{8}$/.test(value) || !value;
            // }, "使用8位数字和a-f字母");
            //验证
            $('#J-layer-form').validate({
                rules: {
                    username:{
                        required:true,
                    },
                    phone:{
                        required:true,
                        mobile:true,
                    },
                    id_card:{
                        idCard:true,
                    },
                    password:{
                        required: that.passwrodFlag,
                    },
                    confirm_password: {
                        required: that.passwrodFlag,
                        equalTo: "#password"
                    },

                },
                submitHandler:function() {
                    if(that.isActive){
                        layer.open({
                            title:"账号有效时长",
                            type: 1,
                            // skin: 'layui-layer-rim', //加上边框
                            area: ['420px', '250px'], //宽高
                            content: $("#addTimeChoiceDiv"),
                            cancel:function(){
                            }
                        });
                    }else{
                        that.saveNewStaff()
                    }
                }
            });
        },
        props:['title','type','end','item'],
        data:function(){
            return{
                itemsLoading:false,
                usernameInput:'',
                phoneInput:'',
                companyName:"",
                passwordInput:"",
                passwrodFlag:true,
                dueDate:"",
                isActive:false,
                ajaxUrl:base.gAjaxUrl.visitorList,
                ajaxType:"POST",
                startDate:"",
            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            saveAndActivate:function(){
                this.isActive = true;
                $("#J-layer-form").submit();

            },
            save:function(){
                this.isActive = false;
                $("#J-layer-form").submit();
            },
            confirmTime:function(){
                if(moment(this.dueDate).isBefore(this.startDate)){
                    layer.msg("结束时间不能早于开始时间",{icon:2,time:2000});
                    return
                }
                this.saveNewStaff();
                layer.closeAll();
            },
            saveNewStaff:function(){
                let that = this;
                this.itemsLoading = true;
                let staffData = {
                    real_name:this.usernameInput,
                    phone:this.phoneInput,
                    vistor_company:this.companyName,
                    id_card:this.id_card,
                    is_active:0,
                }
                this.passwordInput ? staffData["password"] = this.passwordInput:'';
                if(this.isActive){
                    staffData.is_active = 1;
                    staffData.due_date = this.dueDate;
                    staffData.effective_date = this.startDate;
                }else if(this.type == 'modify'){
                    staffData.is_active = this.item.is_active;
                }
                $.ajax({
                    url:that.ajaxUrl,
                    type:that.ajaxType,
                    contentType:"application/json",
                    data:JSON.stringify(staffData)
                }).always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
                        this.$dispatch('dialog-save')
                    })
                })
            }

        },
        filters: {
        },
        components:{
        }
    }
</script>
