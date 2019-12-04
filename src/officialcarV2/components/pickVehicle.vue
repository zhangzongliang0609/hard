<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify vehicle-box">
        <div class="layui-layer-title">选择车辆</div>
        <div class="layui-layer-content pd-20">
            <div class="layui-layer-wrap">
                <div class="text-l clearfix">
                    <input id="searchInput" type="text"  placeholder="车牌/品牌" style="width:250px" class="f-l input-text">
                    <button v-on:click="getList(1)" class="btn btn-success" type="button"><i class="f-r Hui-iconfont">&#xe665;</i></button>
                </div>
                <p>已经选择车辆:{{selectedVehicleArr.length?'':'无'}}</p>
                <table v-if="selectedVehicleArr.length" class="table table-border table-bordered table-hover table-bg table-sort row" >
                    <thead>
                    <tr class="text-c">
                        <th width="70">车牌</th>
                        <th width="70">品牌</th>
                        <th width="70">型号</th>
                        <th width="70">颜色</th>
                        <th width="70">座位数</th>
                        <th width="70">类型</th>
                        <th width="70">备注</th>
                        <th width="70">车辆是否锁定</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="text-c" v-for="item in selectedVehicleArr ">
                        <td>{{item.car_no}}</td>
                        <td>{{item.car_brand}}</td>
                        <td>{{item.car_model}}</td>
                        <td>{{item.car_color}}</td>
                        <td>{{item.seats}}</td>
                        <td>{{item.car_type ? item.car_type:item.vehicle_type_name}}</td>
                        <td>{{item.remark}}</td>
                        <td>{{item.locked == true ? "是" : "否"}}</td>
                    </tr>
                    </tbody>
                </table>
                <p>候选车辆:</p>
                <table class="table table-border table-bordered table-hover table-bg table-sort row">
                    <thead>
                    <tr class="text-c">
                        <th width="25">选择</th>
                        <th width="70">车牌</th>
                        <th width="70">品牌</th>
                        <th width="70">型号</th>
                        <th width="70">颜色</th>
                        <th width="70">座位数</th>
                        <th width="70">类型</th>
                        <th width="70">备注</th>
                        <th width="70">车辆是否锁定</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="text-c {{item.busy?'busy':''}}" v-for="(index,item) in items">
                        <td><input type="radio" class="radio-wh" :value="item" name="car" v-model="selected_vehicle"></td>
                        <td>{{item.car_no}}</td>
                        <td>{{item.car_brand}}</td>
                        <td>{{item.car_model}}</td>
                        <td>{{item.car_color}}</td>
                        <td>{{item.seats}}</td>
                        <td>{{item.car_type ? item.car_type:item.vehicle_type_name}}</td>
                        <td>{{item.remark}}</td>
                        <td>{{item.locked == true ? "是" : "否"}}</td>
                    </tr>
                    </tbody>
                </table>
                <div id="J-page" class="m-page row" v-show="!noData"></div>
                <div class="no-data text-c mt-50 row" v-if="noData">没有相关数据</div>
            </div>
        </div>
        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
        <div class="layui-layer-btn" v-on:click="save"><a class="layui-layer-btn0">确定</a></div>
    </div>
    <div class="layui-layer-shade"></div>
    <div class="m-loading" v-if="vehicleLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>

<style lang="less" scoped rel="stylesheet/less">
    .layui-layer-shade{
        z-index: 102;
    }
    .vehicle-box{
        z-index: 105;
    }
    .avatar{
        width: 50px;
    }
    .busy{
        background: orange;
    }

</style>

<script>
    import * as base from '../../assets/js/base.js';

    let staffsOps = null;

    export default{
        ready () {

            staffsOps = {
                param:{
                    search:'',
                    page:1,
                    page_size:10,
                }
            }
            base.verticalCenter('.vehicle-box');
            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-page',tpageToal,count);
            });



        },
        props: ['title',"start","end","vehicle"],
        data:function(){
            return {
                noData:false,
                items: [],
                searchInput:'',
                selectedVehicleArr:this.vehicle,
                order: this.data,
                indexFirst: 0,
                vehicleLoading:false,
                selected_vehicle:"",
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
                        staffsOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            deleteDefaultCarFromItems:function (vehicle) {
                for (var index in this.items) {
                    if (this.items[index].id == vehicle.id) {
                        this.items.splice(index, 1);
                    }
                }
            },
            queryAjax:function(callback=function(){}){
                //修改参数
                staffsOps.param.search = this.searchInput;
                staffsOps.param.start_time = this.start;
                staffsOps.param.end_time = this.end;
                this.vehicleLoading = true;
                $.ajax({
                    url: `${base.gAjaxUrl.officialcarVehicleList_V2}delegate_vehicle/`,
                    type: 'GET',
                    data:staffsOps.param
                })
                    .always((data)=>{
                        this.vehicleLoading = false;
                        base.ajaxCallback(data,()=>{
                            let resultData = data.results;
                            this.items = resultData;
                            if(resultData.length){
                                this.noData = false;
                                this.selectedVehicleArr.forEach((item)=>{
                                    this.deleteDefaultCarFromItems(item);
                                })
                                //回调
                                callback(data.num_pages,data.count);
                            }else{
                                this.noData = true;
                            }
                        });
                    })
            },
            //获取列表
            getList:function(reset=0){
                //重置第一页
                if(reset){
                    this.searchInput= $("#searchInput").val();
                    staffsOps.param.page = 1
                }
                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-page',tpageToal,count)
                });
            },
            close:function(){
                this.$dispatch('dialog-close');
            },
            save:function(){
                this.$dispatch('select-vehicle', this.selected_vehicle);
            }
        }
    }
</script>
