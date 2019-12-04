<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify layui-modify-left">
        <div class="layui-layer-title layui-layer-title-combine layui-layer-title-two combine-box">
            查看司机车辆
        </div>
        <div class="layui-layer-content">
            <table class="table table-border table-bordered table-hover table-bg">
                <thead>
                <tr class="text-c">
                    <th>司机名称</th>
                    <th>车牌号码</th>
                </tr>
                </thead>
                <div class="result">
                    <tbody>
                    <tr class="text-c" v-for="item in driverData.drivertrip_set">
                        <td>{{item.car_no}}</td>
                        <td>{{item.real_name}}</td>
                    </tr>
                    </tbody>
                </div>
            </table>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
        </span>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<style lang="less" scoped>
    .layui-layer-content{
        padding:0 15px;

    }
    .layui-layer{
        z-index: 9999999 !important;
    }
    .layui-layer-shade{
        z-index: 999999 !important;
    }
</style>
<script>
    import * as base from '../../assets/js/base.js';
    export default{
        ready () {
            this.getDriveVehicleList();
        },
        props:["data"],
        data:function(){
            return {
                driverData:{},
            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            getDriveVehicleList:function(){
                $.showLoading();
                $.ajax({
                    url:`${base.gAjaxUrl.officialcarTrip_V2}${this.data.id}`,
                    type:"GET",
                }).always((data)=>{
                    $.hideLoading();
                    base.ajaxCallback(data,()=>{
                        this.driverData = data;
                    })
                })
            }
        }
    }
</script>
