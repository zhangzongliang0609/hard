<template>
    <driverorder v-if="isShowDialog" v-on:dialog-close="addDialogClose"></driverorder>
    <section class="Hui-article-box">
    <div class="page-container">
        <div class="cl pd-5 bg-1 bk-gray"> 
            <span class="l">
                <a class="l btn btn-primary radius" href="javascript:;" v-on:click="clickgoBack()">返回</a>
                <div class="l m-info ml-10">
                    <div class="l item">乘车人:{{userInfo.staff_vo? userInfo.staff_vo.real_name: '-';}}</div>
                    <div class="l item">起点/终点:{{userInfo.source_name}}/{{userInfo.destination_name}}</div>
                    <div class="l item">出发时间:{{userInfo.ride_time}}</div>
                    <div class="l item">结束时间:{{userInfo.end_time}}</div>
                    <div class="l item">人数:{{userInfo.passenger_number}}</div>
                    <div class="l item">加急/拼单:{{userInfo.is_carpool? '是': '否'}}/{{userInfo.is_urgent? '是': '否'}}</div>
                </div>
            </span> 
        </div>        
            <table class="assign-talbe table table-border table-bordered  table-bg mt-20" >
                <thead>
                    <tr class="text-c">
                        <th>车牌号码</th>
                        <th>车辆品牌</th>
                        <th>车辆型号</th>
                        <th>车辆颜色</th>
                        <th>座位数</th>
                        <th>车辆类型</th>
                    </tr>
                </thead>
                <div class="result" v-if="!noData">
                <tbody>
                    <tr class="text-c {{item.conflict_order? 'assign-active':''}}" v-for="item in items">
                        <td>{{item.car_no}}</td>
                        <td>{{item.car_brand}}</td>
                        <td>{{item.car_model}}</td>
                        <td>{{item.car_color}}</td>
                        <td>{{item.seats}}</td>
                        <td>{{item.car_type}}</td>
                        <td>
                            <a v-if="item.conflict_order" class="btn btn-link size-MINI radius" v-on:click="clickCheck(item)">查看</a>
                            <a class="btn btn-link size-MINI radius" v-on:click="clickChoice(userInfo.id,item.d2id,item.id,item.conflict_order)">选择</a>
                        </td>
                  </tr>
                </tbody>
                </div>
            </table>
            <div id="J-page" class="m-page"  v-show="!noData"></div>
            <div class="m-loading" v-if="!noData && itemsLoading">
                <div class="cube1"></div>
                <div class="cube2"></div>
            </div>
        
        <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
    </div>
    </section>
</template>

<style lang="less">
</style>

<script>
    import * as base from '../assets/js/base.js';
    import driverorder from "../components/driverOrder.vue";
    let driverOps = null;
    let assignOps = null;

    export default{
        ready () {
            let that = this;

            driverOps = {
                param:{
                },
                page:1,
                page_size:10
            };
            assignOps = {
                param:{
                    driver:'',
                    vehicle:'',
                    driver_conflict_order:'',
                    vehicle_conflict_order:'',
                }
            };

            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-page',tpageToal,driverOps.page,count)
            });           
        },
        data:function(){
            return {
                itemsLoading:true,
                isShowDialog:false,
                items: [],
                noData:false,
                userInfo:JSON.parse(localStorage['userInfo']),
            }
        },
        methods: {
            //初始化分页   
            initPage:function(obj,tpageToal='4',current='1',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:current,
                    count:count,
                    callback:(p)=>{
                        driverOps.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax:function(callback=function(){}){
                this.itemsLoading = false;

                $.ajax({
                    url: `${base.gAjaxUrl.officialcarorders}${this.userInfo['id']}/vehicle/`,
                    type: 'GET',
                })
                .always((data)=>{
                    base.ajaxCallback(data,()=>{
                        let resultData = data.results;
                        this.itemsLoading = false;
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
                // driverOps.page = 1

                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-page',tpageToal,driverOps.page,count)
                });
            },
            //返回
            clickgoBack:function(){
                this.$route.router.go({path: '/orderManagement', replace: true})
            },
            clickChoice:function(order_id,driver_id,vehicle_id,conflict){
                
                assignOps.param.driver = driver_id;
                assignOps.param.vehicle = vehicle_id;
                assignOps.param.driver_conflict_order = conflict;
                
                $.ajax({
                    url: `${base.gAjaxUrl.officialcarorders}${order_id}/driver/`,
                    contentType: 'application/json',
                    type: 'POST',
                    data:JSON.stringify(assignOps.param)
                })
                .always((data)=>{
                    base.ajaxCallback(data,()=>{
                        this.$route.router.go({path: '/orderManagement', replace: true})
                        layer.msg('选择成功',{icon:1,time:1000});
                    });
                })
            },
            clickCheck:function(data){ 
                let isConflict = data.conflict_order;

                if(isConflict){
                    localStorage.driverInfo = JSON.stringify(data);
                    this.isShowDialog = true;
                }else{
                    layer.msg('只能查看冲突选项',{icon:2,time:1000});
                }
            },
            addDialogClose:function(data){
                this.isShowDialog = false;
            },

        },
        components:{
            driverorder
        }
    }
</script>