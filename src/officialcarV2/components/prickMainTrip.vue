<template>
    <drivers v-if="showDriver" :data="currentData" @dialog-close="closeDriver"></drivers>
    <div class="layui-layer layui-anim layui-layer-page layui-modify layui-modify-left">
        <div class="layui-layer-title layui-layer-title-combine layui-layer-title-two combine-box">
            选择拼单主行程
        </div>
        <div class="layui-layer-content">
            <table class="table table-border table-bordered table-hover table-bg">
                <thead>
                <tr class="text-c">
                    <th  width="50">选择</th>
                    <th>行程</th>
                    <th>是否已有司机</th>
                    <th>操作</th>
                </tr>
                </thead>
                <div class="result" v-if="!noData">
                    <tbody>
                        <tr class="text-c" v-for="(vooKey, vooItem) in tripArr">
                            <td ><input type="radio" class="radio-wh" @click="clickItem(vooItem)" :checked="selectedItem.id == vooItem.id"  name="order_id"/></td>
                            <td>{{vooItem.source_name}}----{{vooItem.destination_name}}</td>
                            <td>{{vooItem.status >= 20 ? '是': '否'}}</td>
                            <td>
                                <a v-if="vooItem.status >= 20" href="javascript:;" class="btn btn-primary radius" @click="clickShowDriver(vooItem)">查看司机</a>
                            </td>
                        </tr>
                    </tbody>
                </div>
            </table>
            <button class="btn btn-primary radius f-r mt-10" @click="save">保存</button>
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

            this.tripArr = [].concat(this.data);
            console.log("this.tripArr");
            console.log(this.tripArr);
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
            close:function(){
                this.$dispatch('dialog-close','showCarpool');
            },
            clickItem:function(trip){
                this.selectedItem = trip;
            },
            save:function(){
                if(!this.selectedItem){
                    layer.msg("请选择主行程",{icon:2,time:2000});
                    return;
                }
                let arr = this.data.map((item)=>{
                    return item.id;
                })
                $.ajax({
                    url: `${base.gAjaxUrl.officialcarTrip_V2}${this.selectedItem.id}/carpool/`,
                    contentType: 'application/json',
                    type: 'POST',
                    data:JSON.stringify({trips:arr})
                }).always((data)=>{
                        base.ajaxCallback(data,()=>{
                            this.$dispatch('dialog-save');
                            layer.msg('拼单成功',{icon:1,time:1000});
                        });
                    })

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
