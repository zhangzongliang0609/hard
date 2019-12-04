<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify layer-add-bus">
        <div class="layui-layer-title">{{title}}</div>
        <div class="layui-layer-content pl-10 pr-10">
            <div class="title">
                <span class="mr-10 f-20">{{data.staff_vo.real_name}}</span>
                <img src="../assets/images/icon-room.png" height="atuo" width="32" alt="" class="mr-10" style="vertical-align:text-bottom">
                <span class="mr-10 f-20 roomNo">{{data.room_vo.room_no}}房</span>
                <span class="mr-10">{{data.room_vo.building_vo.building_name}}</span>
            </div>
            <div class="mt-10">个人本次水电费:</div>
            <table class="table table-border table-bg table-striped bor-l bor-r">
                <thead class="text-c">
                    <tr>
                        <th width="33.33%">电费</th>
                        <th width="33.33%">水费</th>
                        <th width="33.33%">共(元)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="text-c">
                        <td>{{data.electricity_pay_amount/100}}</td>
                        <td>{{data.water_pay_amount/100}}</td>
                        <td>{{data.pay_amount/100}}</td>
                    </tr>
                </tbody>
            </table>
            <div class="mt-10">宿舍水电费:</div>
            <table class="table table-border table-bg table-striped bor-l bor-r">
                <thead class="text-c">
                    <tr>
                        <th width="33.33%">上次电量(度)</th>
                        <th width="33.33%">本次水量(度)</th>
                        <th width="33.33%">电费(元)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="text-c">
                        <td>{{data.last_electricity_degrees}}</td>
                        <td>{{data.electricity_degrees}}</td>
                        <td>{{data.electricity_pay_amount/100}}</td>
                    </tr>
                </tbody>
            </table>
            <table class="table table-border table-bg table-striped mt-10 bor-l bor-r">
                <thead class="text-c">
                    <tr>
                        <th width="33.33%">上次水量(立方米)</th>
                        <th width="33.33%">本次水量(立方米)</th>
                        <th width="33.33%">水费(元)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="text-c">
                        <td>{{data.last_water_degrees}}</td>
                        <td>{{data.water_degrees}}</td>
                        <td>{{data.water_pay_amount/100}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
        </span>
    </div>
    <div class="layui-layer-shade"></div>
</template>

<style lang="less">

</style>

<script>
    import * as base from '../assets/js/base.js';
    export default{
        ready () {
            let that = this;
            let getData = this.data;

            base.verticalCenter('.layui-modify'); 
        },
        //动态传值
        props: ['title','type','data'],
        data:function(){
            return {
            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            }
        }
    }
</script>