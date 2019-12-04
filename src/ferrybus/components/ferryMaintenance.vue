<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify updateBox">
        <h5 class="title">更新保养到期日期</h5>
        <div class="updateContent">

            <form id="J-layer-form" class="form form-horizontal">
            <div>
                <p>本次保养到期日期: {{data.maintenance_deadline}}
                    <span v-if="data.maintenance_deadline == undefined" style="color:red">未设置时间</span>
                    <span :class="{'text-red': data.maintenance_rest_days <= 30 }" v-if="data.maintenance_rest_days != undefined &&  data.maintenance_rest_days > 0">
                        (还有{{data.maintenance_rest_days}}天过期)
                    </span>
                    <span class="text-red" v-if="data.maintenance_rest_days <= 0 && data.maintenance_rest_days != undefined">
                        【已过期】
                    </span>
            </p>
            </div>
            <div>
				<div class="formControls">
				<label>保养费用:
                <input autocomplete="off" v-model="insurance_cost" class="insuranceInput" type="input" placeholder="请输入本次保养话费金额" name="insurance_cost">
                </label>
				</div>
            </div>
                <div>
                    <div class="formControls mileage-box">
                        <label>里程数:
                        <input autocomplete="off" class="mileageInput" type="input" placeholder="请输入本次保养时车辆里程数" name="mileage_cost">
                        </label>
                    </div>
                </div>
            <div class="checkTime">
                <div class="formControls">
                <label>下次保养日期:
                    <input v-model="quarterlyDate" autocomplete="off" placeholder="请选择时间" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-start-date-Real" name="quarterlyDate">
                </label>
                    </div>
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
    .updateBox{
        margin-top: 94px;
        height: 456px;
        width: 40pc;
    }
    h5{
        text-align: center;
        font-size: 20px;
        padding-top: 20px;
    }
	.formControls {
		margin: 0 !important;
		padding: 0 ;
	}
    .updateContent{
        padding: 50px;
        padding-left: 150px;
        div{
            font-size: 15px;
            margin-top: 20px;
        }
    }
    #quarterlyContent{
        width: 200px;
    }
    .checkTime{
        padding: 10px 0;
    }
    .btn-box{
        a{
            width: 100px;
            margin: 40px;
        }
    }



    .hint{
        font-size: 15px;
        text-align: center;
        padding-top: 10px;
    }
    .insuranceInput,.mileageInput{
        width: 200px;
        height: 30px;
    }
    .mileage-box{
        padding-left: 12px;
    }
    .text-red{
        color:red;
    }

</style>
<script>
    import * as base from '../../assets/js/base.js';
    export default{
        ready(){

            let that = this;

            new Kalendae.Input('J-start-date-Real', {
                months: 2,
                clickHide:true,
            });

            $('#J-layer-form').validate({
                rules: {
                    quarterlyDate: {
                        required: true,
                        dateISO:true,
                    },
                    insurance_cost: {
                        required: true,
                        number:true,
                    },
                    mileage_cost:{
                        required: true,
                        number:true,
                        digits:true,
                        maxlength:10,
                    }
                },
                submitHandler: function () {
                    let value = $(".insuranceInput").val();
                    let mileage = $(".mileageInput").val();

                    if(/\./.test(value) && !(value.match(/^\d+(\.\d{1,2})?$/))) {
                        layer.msg('保养金额小数点后最多输入2位', {icon: 2, time: 2000});
                        return;
                    }
                    $.ajax({
                        url:`${that.type}${that.data.id}/maintenance/`,
                        type:"POST",
                        data:{
                            deadline:that.quarterlyDate,
                            maintenance_amount:value,
                            mileage:mileage,
                        },
                    }).always((data)=>{
                        base.ajaxCallback(data,()=>{
                            if(data){
                                that.$dispatch("window-close");
                                layer.msg("保存成功",{icon:1,time:1000});
                                console.log(data);
                                that.$emit('child-data',data);
                            }else{

                            }
                        });
                    })
//                    $.ajax({
//                        url: ajaxUrl,
//                        type: ajaxType,
//                        data: data,
//                    })
//                            .always(function (data) {
//                                base.ajaxCallback(data, function () {
//                                    layer.msg('提交成功', {icon: 1, time: 1000});
//                                    that.$dispatch('dialog-save');
//                                });
//                            });

                }
            });

        },
        data:function () {
            return{
                quarterlyDate:'',
				insurance_cost: '',
            }
        },
        props:["data","type"],
        methods:{
            close:function () {
                this.$dispatch("window-close");
            },

            updata:function () {
                $('#J-layer-form').submit();
//                var that = this;
//                var value = $(".insuranceInput").val();
//                $.ajax({
//                    url:`${that.type}${that.data.id}/maintenance/`,
//                    type:"POST",
//                    data:{
//                        deadline:that.quarterlyDate,
//                        maintenance_amount:value
//                    },
//                }).always((data)=>{
//                    base.ajaxCallback(data,()=>{
//                        if(data){
//                            that.$dispatch("window-close");
//                            layer.msg("保存成功",{icon:1,time:1000});
//                            that.$emit('child-data',data);
//                        }else{
//
//                        }
//                    });
//                })

            }

        },
    }
</script>
