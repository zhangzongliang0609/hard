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
        <div class="assign-driver-wrap">
            <div class="frame driver">
                <div class="hd">选择司机</div>
                <div class="bd">
                    <ul>
                        <li class="{{driverId == voDriver.id? 'active': ''}} {{voDriver.driver_conflict_order? 'conflict':''}}" v-for="voDriver in driverItems" v-on:click="selectDriver(voDriver.id,voDriver.driver_conflict_order)">
                            <span class="data-item">姓名:{{voDriver.staff_vo? voDriver.staff_vo.real_name: '-';}}</span>
                            <span class="data-item">电话:{{voDriver.staff_vo? voDriver.staff_vo.phone: '-'}}</span>
                        </li>
                    </ul>
                </div>
                <div class="ft">
                    <div id="J-driver-page" class="m-page"></div>
                </div>
            </div>
            <div class="frame car">
                <div class="hd">选择车辆</div>
                <div class="bd">
                    <ul>
                        <li class="{{carId == voCar.id? 'active': ''}} {{voCar.vehicle_conflict_order? 'conflict':''}}" v-for="voCar in carItems" v-on:click="selectCar(voCar.id,voCar.vehicle_conflict_order)">
                            <span class="data-item">车辆:{{voCar.car_brand}}/{{voCar.car_model}}/{{voCar.car_color}}</span>
                            <span class="data-item">车牌:{{voCar.car_no}}</span>
                            <span class="data-item">座位:{{voCar.seats}}</span>
                        </li>
                    </ul>
                </div>
                <div class="ft">
                    <div id="J-car-page" class="m-page"></div>
                </div>
            </div>
            <div class="clearfix"></div>
            <div class="btn btn-primary radius" v-on:click="clickChoice()">确定</div>
        </div>
    </div>

    </section>
</template>

<style lang="less">
</style>

<script>
    import * as base from '../assets/js/base.js';
    import driverorder from "../components/driverOrder.vue";
    let driverOps = null;
    let carOps = null;
    let assignOps = null;

    export default{
        ready () {
            let that = this;
            driverOps = {
                param:{
                    page:1,
                    page_size:30
                }
            };
            carOps = {
                param:{
                    page:1,
                    page_size:30
                }
            };
            assignOps = {
                param:{
                    driver:'',
                    vehicle:'',
                    driver_conflict_order:'',
                    vehicle_conflict_order:'',
                }
            };
            // $.ajax({
            //     url: `${base.gAjaxUrl.officialcarorders}${this.userInfo['id']}/driver/`,
            //     type: 'GET',
            //     data:driverOps.param
            // })
            // .always((data)=>{
            //     base.ajaxCallback(data,()=>{
            //         let resultData = data.results;
            //         this.driverItems = resultData;

            //         $('#J-driver-page').createPage({
            //             pageCount:data.num_pages,
            //             current:driverOps.param.page,
            //             callback:(p)=>{
            //                 driverOps.param.page = p;
            //                 this.driverQueryAjax();
            //             }
            //         });

            //     });
            // })

            // $.ajax({
            //     url: `${base.gAjaxUrl.officialcarorders}${this.userInfo['id']}/vehicle/`,
            //     type: 'GET',
            // })
            // .always((data)=>{
            //     base.ajaxCallback(data,()=>{
            //         let resultData = data.results;
            //         this.carItems = resultData;
            //     });
            // })

            this.driverQueryAjax((tpageToal='4',count='0')=>{
                this.driverInitDPage('#J-driver-page',tpageToal,count)
            });      
//
//            this.carQueryAjax((tpageToal='4',count='0')=>{
//                this.carInitDPage('#J-car-page',tpageToal,count)
//            });

        },
        data:function(){
            return {
                isShowDialog:false,
                driverItems: [],
                carItems: [],
                noData:false,
                userInfo:JSON.parse(localStorage['userInfo']),
                driverId:'',
                carId:'',
            }
        },
        methods: {
            //返回
            clickgoBack:function(){
                this.$route.router.go({path: '/orderManagement', replace: true})
            },
            selectDriver:function(id,conflict_id){
                this.driverId = id;
                assignOps.param.driver = id;
                assignOps.param.driver_conflict_order = conflict_id;
            },
            selectCar:function(id,conflict_id){
                this.carId = id;
                assignOps.param.vehicle = id;
                assignOps.param.vehicle_conflict_order = conflict_id;
            },
            clickChoice:function(){
                
                if(this.driverId && this.carId){
                    $.ajax({
                        url: `${base.gAjaxUrl.officialcarorders}${this.userInfo['id']}/driver/`,
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
                }else{
                    layer.msg('请选择司机和车辆',{icon:2,time:1000});
                }
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
            driverInitDPage:function(obj,tpageToal='4',current='1',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:current,
                    count:count,
                    callback:(p)=>{
                        driverOps.param.page = p;
                        this.driverQueryAjax();
                    }
                });
            },
            driverQueryAjax:function(callback=function(){}){
                console.log('driverQueryAjax')
                let that = this;
                $.ajax({
                    url: `${base.gAjaxUrl.officialcarorders}${this.userInfo['id']}/driver/`,
                    type: 'GET',
                    data:driverOps.param
                })
                .always((data)=>{
                    base.ajaxCallback(data,()=>{
                        let resultData = data.results;

                        that.driverItems = resultData;
                        //回调
                        callback(data.num_pages,data.count);
                    });
                })
            },
            carInitDPage:function(obj,tpageToal='4',current='1',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:current,
                    count:count,
                    callback:(p)=>{
                        carOps.param.page = p;
                        this.carQueryAjax();
                    }
                });
            },
            carQueryAjax:function(callback=function(){}){
                console.log('driverQueryAjax')
                let that = this;
                $.ajax({
                    url: `${base.gAjaxUrl.officialcarorders}${this.userInfo['id']}/vehicle/`,
                    type: 'GET',
                    data:carOps.param
                })
                .always((data)=>{
                    base.ajaxCallback(data,()=>{
                        let resultData = data.results;

                        that.carItems = resultData;
                        //回调
                        callback(data.num_pages,data.count);
                    });
                })
            },


        },
        components:{
            driverorder
        }
    }
</script>
