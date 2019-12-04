<template>
    <drivers v-if="showDriver" :data="currentData" @dialog-close="closeDriver"></drivers>
    <div class="layui-layer layui-anim layui-layer-page layui-modify layui-modify-left">
        <div class="layui-layer-title layui-layer-title-combine layui-layer-title-two combine-box">
            查看拼单行程
        </div>
        <div class="layui-layer-content">
            <table class="table table-border table-bordered table-hover table-bg">
                <thead>
                <tr class="text-c">
                    <th>行程</th>
                    <th>是否已有司机</th>
                    <th>操作</th>
                </tr>
                </thead>
                <div class="result" v-if="!noData">
                    <tbody>
                    <tr class="text-c" v-for="(vooKey, vooItem) in driverTripArr">
                        <td>{{vooItem.source_name}}----{{vooItem.destination_name}}</td>
                        <td>{{vooItem.drivertrip_count ? '是': '否'}}</td>
                        <td>
                            <a v-if="vooItem.drivertrip_count" href="javascript:;" class="btn btn-primary radius" @click="clickShowDriver(vooItem)">查看司机</a>
                        </td>
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
        z-index: 99999 !important;
    }
    .layui-layer-shade{
        z-index: 9999 !important;
    }
</style>
<script>
    import * as base from '../../assets/js/base.js';
    import drivers from './showCarpoolDriver'
    let carpoolOps = null;
    export default{
        ready () {
            this.getList();
        },
        props: ['data'],
        data:function(){
            return {
                selectedItem:"",
                tripArr:[],
                showDriver:false,
                currentData:"",
                driverTripArr:[],
            }
        },
        methods: {
            //初始化分页
            //获取列表
            getList:function(){
                $.showLoading();
                $.ajax({
                    url:base.gAjaxUrl.officialcarTrip_V2 + "featch_carpool/",
                    type:"GET",
                    data:{
                        carpool_id:this.data.carpool_id
                    }
                }).always((data)=>{
                    $.hideLoading();
                    base.ajaxCallback(data,()=>{
                        this.driverTripArr = data;
                    })
                })
            },
            close:function(){
                this.$dispatch('dialog-close','showCarpool');
            },
            clickItem:function(trip){
                this.selectedItem = trip;
            },
            clickShowDriver:function(item){
                this.currentData = item;
                this.showDriver = true;
            },
            closeDriver:function(){
                this.showDriver = false;
            }

        },
        components:{
            drivers:drivers,
        }
    }
</script>
