<template>
    <div class="layui-modify layui-layer layui-anim" id="midifyBox">
        <div class="layui-layer-title">编辑里程</div>
        <div class="layui-layer-content">
            <form id="J-from" class="form form-horizontal layui-layer-wrap">
                <div class="row cl">
                    <lable class="form-lable f-l col-4 lh-30 text-r">行驶里程</lable>
                    <div class="formControls f-l col-4">
                        <input type="text" class="input-text" name="mileage" v-model="mileage">
                    </div>
                    <span class="f-l col-2 lh-30 text-l">KM</span>
                </div>
            </form>
            <div class="cl pl-30 pt-20 pr-20 mt-20">
                <a href="javascript:;" class="btn layui-btn-normal radius f-l ml-40" @click="close()">取消</a>
                <a href="javascript:;" class="btn btn-primary radius f-r mr-40" @click="saveMileage">确定</a>
            </div>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
        </span>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<style rel="stylesheet/less" scoped lang="less">
    .layui-modify{
        top:30% !important;
        width:400px;
        z-index: 999;
    }
    .layui-layer-shade{
        z-index: 998;
    }
</style>
<script>
    import * as base from '../../assets/js/base.js'
    export default {
        ready(){
            let that = this;
            base.verticalCenter('#midifyBox');
            this.mileage = this.data.driver_mileage ? this.data.driver_mileage / 1000 : 0;
            //验证
            $('#J-from').validate({
                rules: {
                    mileage: {
                        required: true,
                        number:true,
                        min:0,
                    },
                },
                submitHandler: function () {
                    layer.confirm("确定保存行程吗?",()=>{
                        that.save();
                    })
                }
            });
        },
        props:["data"],
        data:function(){
            return{
                mileage:0,
            }
        },
        methods:{
            close:function(){
                this.$dispatch("dialog-close")
            },
            saveMileage:function(){
                $("#J-from").submit();
            },
            save:function(){
                $.showLoading();
                $.ajax({
                    url:`${base.gAjaxUrl.officialcarDriverTrip_V2}${this.data.id}/`,
                    type:"PATCH",
                    data:{
                        driver_mileage:this.mileage * 1000
                    }
                }).always((data)=>{
                    $.hideLoading();
                    base.ajaxCallback(data,()=>{
                        layer.msg("保存成功",{icon:1,time:2000});
                        this.$dispatch("save-mileage")
                    })
                })
            }
        }
    }
</script>
