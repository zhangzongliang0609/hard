<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify date-box">
        <div class="layui-layer-title">编辑出发时间</div>
        <div class="layui-layer-content pd-20">
            <div class="layui-layer-wrap content">
                <div class="row">
                    <span class="mr-10 w-84 inline-block lh-30">出发时间:</span>
                    <input v-model="startDate" type="text" class="input-text input-date" id="start-date">
                    <input v-model="startTime" type="text" class="input-text time-input" id="start-time" autocomplete="off">
                </div>
                <div class="row">
                    <span class="mr-10 w-84 inline-block lh-30">结束时间</span>
                    <input v-model="endDate" type="text" class="input-text input-date" id="end-date">
                    <input v-model="endTime" type="text" class="input-text time-input" id="end-time" autocomplete="off">
                </div>
                <div class="row between">
                    <button class="btn btn-default radius"  v-on:click="close()">取消</button>
                    <button class="btn btn-primary radius" @click="save()">确定</button>
                </div>
            </div>
        </div>
        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
    </div>
    <div class="layui-layer-shade"></div>
</template>

<style lang="less" scoped rel="stylesheet/less">
    .layui-layer-shade{
        z-index: 102;
    }
    .date-box{
        z-index: 105;
        width:500px;

    }
    .content{
        padding:20px 50px;
    }
    .row{
        display: flex;
        flex-direction: row;
    }
    .between{
        justify-content: space-around;
    }
    .input-date{
        width:200px;
    }
    .time-input{
        width:100px;
        margin-left: -1px;
    }

</style>

<script>
    import * as base from '../../assets/js/base.js';
    import moment from "moment";
    export default{
        ready () {
            this.init();
        },
        props: ["start","end",'type','data'],
        data:function(){
            return {
                vehicleLoading:false,
                startDate:"",
                endDate:"",
                startTime:"",
                endTime:"",
            }
        },
        methods: {
            init:function(){
                let that = this;
                base.verticalCenter('.date-box');

                this.startDate = this.start.slice(0,10);
                this.startTime = this.start.slice(10,-3);
                this.endDate = this.end.slice(0,10);
                this.endTime = this.end.slice(10,-3);

                $('#start-time').datetimepicker({
                    datepicker:false,
                    format:'H:i',
                    validateOnBlur:false,
                    step: 5
                });
                $('#end-time').datetimepicker({
                    datepicker: false,
                    format: 'H:i',
                    validateOnBlur:false,
                    step: 5
                });

                new Kalendae.Input('start-date', {
                    months: 2,
                    clickHide: true,
                });
                new Kalendae.Input('end-date', {
                    months: 2,
                    clickHide: true,
                });

            },
            close:function(){
                this.$dispatch('dialog-close');
            },
            save:function(){
                if(!this.startDate){
                    layer.msg("请选择开始日期",{icon:2,time:2000});
                    return;
                }
                if(!this.startTime){
                    layer.msg("请选择开始时间",{icon:2,time:2000});
                    return;
                }
                if(!this.endDate){
                    layer.msg("请选择结束日期",{icon:2,time:2000});
                    return;
                }
                if(!this.endTime){
                    layer.msg("请选择结束时间",{icon:2,time:2000});
                    return;
                }
                let start = `${this.startDate} ${this.startTime}:00`;
                let end = `${this.endDate} ${this.endTime}:00`;
                if(moment(start).isAfter(end)){
                    layer.msg("结束时间不能早于开始时间",{icon:2,time:2000});
                    return;
                }
                // order表示当前是订单详情界面跳转进来
                if(this.type =='order'){
                    $.showLoading();
                    $.ajax({
                        url:`${base.gAjaxUrl.officialcarTrip_V2}${this.data.id}/`,
                        type:"PATCH",
                        data:{
                            admin_ride_time:start,
                            admin_end_time:end,
                        }
                    }).always((data)=>{
                        $.hideLoading();
                        base.ajaxCallback(data,()=>{
                            layer.msg("保存成功",{icon:1,time:2000});
                            this.$dispatch("save-order-date")
                        })
                    })
                }else{
                    this.$dispatch('selected-date',{
                        startTime:start,
                        endTime:end,
                    });
                }

            }
        }
    }
</script>
