<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify updateBox">
        <h5 class="title">更新年审到期日期</h5>
        <div class="updateContent">
            <form id="J-layer-form" class="form form-horizontal">
            <div>
                    <p>本次年审日期: {{data.annual_verification_deadline}}
                        <span v-if="data.annual_verification_deadline == undefined " style="color:red">未设置时间</span>
                    <span :class="{'text-red':data.annual_rest_days <= 30 }" v-if="data.annual_rest_days != undefined && data.annual_rest_days > 0">
                        (还有{{data.annual_rest_days}}天过期)
                    </span>
                        <span style="color:red" v-if="data.annual_rest_days <= 0 && data.annual_rest_days != undefined">
                        【已过期】
                    </span>
                    </p>
            </div>
            <div><span>本次年审内容:</span>
                <select id="quarterlyContent">
                    <option value ="1">年审</option>
                    <option value ="2">领标</option>
                </select>
            </div>
            <div class="checkTime formControls">
                下次年审时间    <input v-model="quarterlyDate" autocomplete="off" placeholder="请选择时间" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-start-date-Real" name="quarterlyDate" >
            </div>
            <div class="btn-box">
                <a class="btn radius mr-5 cancel  " href="javascript:;" @click="close()">取消</a>
                <a class="btn btn-primary radius mr-5 affirm " href="javascript:;" @click="updata">确认</a>
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
                },
                submitHandler: function () {
                    var type = $("#quarterlyContent").val();
                    $.ajax({
                        url:`${that.type}${that.data.id}/annual_verification/`,
                        type:"POST",
                        data:{
                            deadline:that.quarterlyDate,
                            content:type
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
//                var type = $("#quarterlyContent").val();
//                $.ajax({
//                    url:`${that.type}${that.data.id}/annual_verification/`,
//                    type:"POST",
//                    data:{
//                        deadline:that.quarterlyDate,
//                        content:type
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