<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify cover">
        <div class="layui-layer-title">当前行程调度有冲突,是否覆盖</div>
        <div class="cover-box">
        <h5 class="text-c fw-b" v-if="driver.length != 0">司机行程冲突列表</h5>
        <table v-if="driver.length != 0" class="table table-border table-bordered table-hover table-bg mt-20" >
            <thead>
            <tr class="text-c">
                <th>司机</th>
                <th>车牌号码</th>
                <th>手机号码</th>
                <th>线路名称</th>
                <th>去返程</th>
                <th>发车日期</th>
                <th>发车时间</th>
            </tr>
            </thead>
            <div class="result" v-if="!noData">
                <tbody>
                <tr class="text-c" v-for="item in driver">
                    <td>{{item.driver_name}}</td>
                    <td>{{item.car_no}}</td>
                    <td>{{item.phone}}</td>
                    <td>{{item.shuttlebus_name}}</td>
                    <td>{{item.shuttle_type == -10?'去程':'返程'}}</td>
                    <td>{{item.departure_date}}</td>
                    <td>{{item.departure_time}}</td>
                </tr>
                </tbody>

            </div>

        </table>
        <h5 class="text-c fw-b" v-if="vehicle.length != 0">车辆行程冲突列表</h5>
        <table v-if="vehicle.length != 0" class="table table-border table-bordered table-hover table-bg mt-20" >
            <thead>
            <tr class="text-c">
                <th>司机</th>
                <th>车牌号码</th>
                <th>手机号码</th>
                <th>线路名称</th>
                <th>去返程</th>
                <th>发车日期</th>
                <th>发车时间</th>
            </tr>
            </thead>
            <div>
                <tbody>
                <tr class="text-c" v-for="item in vehicle">
                    <td>{{item.driver_name}}</td>
                    <td>{{item.car_no}}</td>
                    <td>{{item.phone}}</td>
                    <td>{{item.shuttlebus_name}}</td>
                    <td>{{item.shuttle_type == -10?'去程':'返程'}}</td>
                    <td>{{item.departure_date}}</td>
                    <td>{{item.departure_time}}</td>
                </tr>
                </tbody>
            </div>
        </table>
        </div>
        <a class="btn radius btn-secondary f-r mt-20 mr-10 mb-20" href="javascript:;" @click="cancel">取消</a>
        <a class="btn radius btn-danger f-r mt-20 mr-10  mb-20" href="javascript:;" @click="confirm">确定</a>
        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="cancel()"></a>
    </span>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .cover{
        z-index:1000;
        width: 900px;
    }
    .cover-box{
        height: 520px;
        z-index:1000;
        border-radius:6px 6px 0 0;
        padding: 10px;
        overflow: auto;
    }

</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    export default{
        ready(){
            console.log(this.data);
        },
        data:function () {
            return{
                driver:this.data.driver,
                vehicle:this.data.vehicle,
            }
        },
        props:['data'],
        methods:{
            cancel:function(){
                this.$dispatch("cancel-cover");
            },
            confirm:function () {
                let that = this;
                layer.confirm('被覆盖的行程将不会开启,确认覆盖吗？',(index)=>{
                    layer.closeAll('dialog');
                    that.$dispatch("confirm-cover")
                });
            }
        },
    }
</script>