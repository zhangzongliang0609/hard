<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify layui-modify-left">
        <div class="layui-layer-title layui-layer-title-combine layui-layer-title-two combine-box">
            <a href="javascript:;" class="btn btn-success radius" @click="callBack()">返回</a>
            <div class="l m-info ml-10">
                <div class="l item">乘车人:{{data.passenger_name
                    ?data.passenger_name : data.staff_vo.real_name}}</div>
                <div class="l item">起点/终点:{{data.source_name}}/{{data.destination_name}}</div>
                <div class="l item">出发时间:{{data.ride_time}}</div>
                <div class="l item">结束时间:{{data.end_time}}</div>
                <div class="l item">人数:{{data.passenger_number}}</div>
                <div class="l item">拼车/加急:{{data.is_carpool? '是': '否'}}/{{data.is_urgent? '是': '否'}}</div>
                <!--<div class="l item">乘车人:{{topItems.staff_vo? topItems.staff_vo.real_name: '-';}}</div>-->
                <!--<div class="l item">起点/终点:{{topItems.source_name}}/{{topItems.destination_name}}</div>-->
                <!--<div class="l item">出发时间:{{topItems.ride_time}}</div>-->
                <!--<div class="l item">结束时间:{{topItems.end_time}}</div>-->
                <!--<div class="l item">人数:{{topItems.passenger_number}}</div>-->
                <!--<div class="l item">加急/拼单:{{topItems.is_carpool? '是': '否'}}/{{topItems.is_urgent? '是': '否'}}</div>-->
            </div>

        </div>
        <div class="layui-layer-content">
            <table class="table table-border table-bordered table-hover table-bg">
                <thead>
                    <tr class="text-c">
                        <th width="50">选择</th>
                        <th>乘车人</th>
                        <th>起点/终点</th>
                        <th>出发时间</th>
                        <th>结束时间</th>
                        <th>人数</th>
                        <th>状态</th>
                        <th>拼车/加急</th>
                        <th>是否已派司机</th>
                    </tr>
                </thead>
                <div class="result" v-if="!noData">
                <tbody> 
                    <!-- <template v-for="(voKey, voItem) in items">
                        <tr class="text-c" v-for="(vooKey, vooItem) in voItem"  v-if="vooItem['id'] != topItems['id']">
                            <td><input type="checkbox" value="{{vooItem.id}}" name="order_id"/></td>
                            <td>{{vooItem.staff_vo? vooItem.staff_vo.real_name: '-';}}</td>
                            <td>{{vooItem.source_name}}/{{vooItem.destination_name}}</td>
                            <td>{{vooItem.ride_time}}</td>
                            <td>{{vooItem.end_time}}</td>
                            <td>{{vooItem.passenger_number}}</td>
                            <td>{{vooItem.order_status_name}}</td>
                            <td>{{vooItem.is_carpool? '是': '否'}}/{{vooItem.is_urgent? '是': '否'}}</td>
                            <td>{{vooItem.driver_vo? '是': '否';}}</td>
                        </tr>
                    </template> -->
                    <tr class="text-c" v-for="(vooKey, vooItem) in items">
                        <td><input type="checkbox" class="radio-wh" value="{{vooItem.id}}" name="order_id"/></td>
                        <td>{{vooItem.passenger_name
                            ?vooItem.passenger_name : vooItem.staff_vo.real_name}}</td>
                        <td>{{vooItem.source_name}}/{{vooItem.destination_name}}</td>
                        <td>{{vooItem.ride_time}}</td>
                        <td>{{vooItem.end_time}}</td>
                        <td>{{vooItem.passenger_number}}</td>
                        <td>{{vooItem.order_status_name}}</td>
                        <td>{{vooItem.is_carpool? '是': '否'}}/{{vooItem.is_urgent? '是': '否'}}</td>
                        <td>{{vooItem.driver_vo? '是': '否';}}</td>
                    </tr>
                </tbody>
                </div>
            </table>
            <div id="J-page" class="m-page" v-show="!noData"></div>
            <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
        </span>
        <div class="layui-layer-btn" v-on:click="save"><a class="layui-layer-btn0">拼单</a></div>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<style lang="less">
    div.layui-layer-title-combine {
        height: 70px;
    }
    .radio-wh{
        width: 20px;
        height: 20px;
        cursor: pointer;
    }
    div.layui-modify-left {
        left: 50%; 
        margin-left: -400px; 
    }
</style>
<script>
    import * as base from '../assets/js/base.js';
    let carpoolOps = null;
    export default{
        ready () {
            // this.topItems = JSON.parse(localStorage['dataInfo']);

            carpoolOps = {
                param:{
                    search:'',
                    approval_status:'',
                    order_status:'',
                    is_carpool:false,
                    is_urgent:'',
                },
                page:1,
                page_size:10,
            };

            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-page',tpageToal,count)
            });                 
        },
        props: ['title','data'],
        data:function(){
            return {
                noData:false,
                topItems:[],
                items:[],
            }
        },
        methods: {
            //初始化分页   
            initPage:function(obj,tpageToal='4',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:1,
                    count:count,
                    callback:(p)=>{
                        carpoolOps.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax:function(callback=function(){}){
                let that = this;
                this.itemsLoading = true;

                $.ajax({
                    url: `${base.gAjaxUrl.officialcarorders}${that.data['id']}/can_carpool_orders/?page=${carpoolOps.page}&page_size=${carpoolOps.page_size}`,
                    contentType: 'application/json',
                    type: 'get'
                })
                .always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
                        let resultData = data.results;

                        this.items = resultData;
                        if(resultData.length){
                            this.noData = false;
                            //回调
                            callback(data.num_pages,data.count);
                        }else{
                            this.noData = true;
                        }
                    });
                })            
            },
            //获取列表
            getList:function(){
                //重置第一页
                carpoolOps.page = 1;

                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-page',tpageToal,carpoolOps.page,count)
                });
            },
            close:function(){
                this.$dispatch('dialog-close');
            },
            save:function(){
                let that = this,
                    arr = [];
                $('input:checkbox[name="order_id"]').each(function(){
                    if($(this).prop('checked')){
                        arr.push($(this).val())
                    }
                })                
                // $.ajax({
                //     url: ajaxUrl,
                //     contentType: 'application/json',
                //     type:ajaxType,
                //     data: JSON.stringify(ajaxData)
                // })
                // .always(function(data) {
                //     base.ajaxCallback(data,function(){
                //         layer.msg('保存成功',{icon:1,time:1000});
                //         that.$dispatch('dialog-save');
                //     });
                // });
                $.ajax({
                    url: `${base.gAjaxUrl.officialcarorders}${that.data['id']}/combine/`,
                    contentType: 'application/json',
                    type: 'POST',
                    data:JSON.stringify({orders:arr})
                })
                .always((data)=>{
                    base.ajaxCallback(data,()=>{
                        that.$dispatch('dialog-save');
                        layer.msg('拼单成功',{icon:1,time:1000});
                    });
                })

            },
            callBack:function () {
                this.$dispatch('call-back');
            }
        }
    }
</script>
<style lang="less" scoped>
.layui-layer-title{
    .m-info{
        border: none;
        padding: 9px 0;
        margin: 0;
    }

}
div.combine-box{
    height: auto;
}
</style>
