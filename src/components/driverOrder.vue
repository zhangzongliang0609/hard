<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">
            <div class="l m-info ml-10">
                <div class="l item">姓名:{{driverInfo.staff_vo? driverInfo.staff_vo.real_name: ''}}</div>
                <div class="l item">职位:{{driverInfo.staff_vo.position}}</div>
                <div class="l item">工号:{{driverInfo.staff_vo.job_number}}</div>
                <div class="l item">电话:{{driverInfo.staff_vo.phone}}</div>
            </div>
        </div>
        <div class="layui-layer-content">
            <table class="table table-border table-bordered table-hover table-bg">
                <thead>
                    <tr class="text-c">
                        <th>乘车人</th>
                        <th>起点/终点</th>
                        <th>出发时间</th>
                        <th>结束时间</th>
                        <th>人数</th>
                        <th>状态</th>
                        <th>拼车/加急</th>
                    </tr>
                </thead>
                <div class="result"> 
                <tbody>
                    <tr class="text-c">
                        <td>{{items.staff_vo? items.staff_vo.real_name: '-';}}</td>
                        <td>{{items.source_name}}/{{items.destination_name}}</td>
                        <td>{{items.ride_time}}</td>
                        <td>{{items.end_time}}</td>
                        <td>{{items.passenger_number}}</td>
                        <td>{{items.order_status_name}}</td>
                        <td>{{items.is_carpool? '是': '否'}}/{{items.is_urgent? '是': '否'}}</td>
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
<script>
    import * as base from '../assets/js/base.js';
    let driverOrderOps = null;
    export default{
        ready () {
            driverOrderOps = {
                param:{
                    page:1,
                    page_size:10
                },
            };
            $.ajax({
                url: `${base.gAjaxUrl.officialcarorders}${this.driverInfo.conflict_order}/`,
                type: 'GET',
                data:driverOrderOps.param
            })
            .always((data)=> {
                this.items = data;
            });
        },
        props: ['title','data'],
        data:function(){
            return {
                driverInfo:JSON.parse(localStorage['driverInfo']),
                items:[]
            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
        }
    }
</script>
<style lang="less">
.layui-layer-title{
    .m-info{
        border: none;
        padding: 9px 0;
        margin: 0;
    }
}
</style>
