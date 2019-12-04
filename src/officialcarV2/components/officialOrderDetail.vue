<template>
    <mileage v-if="showModifyMileage" @dialog-close="closeMileage" :data="dialogData" @save-mileage="saveMileage"></mileage>
    <date v-if="showModifyDate" :start="startDate" :data="dialogData" :end="endDate" :type="'order'" @save-order-date="saveDate" @dialog-close="closeDate"></date>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">订单详情</div>
        <div class="layui-layer-content layui-layer-order-wrap">
                <div class="bd_ddd pb-10">
                    <div class="row cl">
                        <div class="f-l col-6">
                            <label class="f-l ml-10">申请人：</label>
                            <div class="f-l">
                                <div class="">
                                    {{orderData.staff_vo.real_name}}
                                </div>
                            </div>
                        </div>

                    </div>

                    <div class="row cl">
                        <div class="f-l col-6">
                            <label class="f-l ml-10">审批状态：</label>
                            <div class="f-l">
                                <div class="">
                                    {{orderData.approval_status | filterApplyStatus}}
                                </div>
                            </div>
                        </div>
                        <div class="f-l col-6">
                            <label class="f-l ml-10">申请时间：</label>
                            <div class="f-l">
                                <div class="">
                                    {{orderData.ctime}}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row cl">
                        <div class="f-l col-6">
                            <label class="f-l ml-10">订单状态：</label>
                            <div class="f-l">
                                <div class="">
                                    {{orderData.status | filterOrderStatus}}
                                </div>
                            </div>
                        </div>
                        <div class="f-l col-6">
                            <label class="f-l ml-10">订单总费用：</label>
                            <div class="f-l">
                                <div class="">
                                    {{orderData.fee ? orderData.fee / 100 : 0}}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row cl">
                        <div class="f-l col-6">
                            <label class="f-l ml-10">是否加急：</label>
                            <div class="f-l">
                                <div class="">
                                    {{orderData.is_urgent?"是":"否"}}
                                </div>
                            </div>
                        </div>
                        <div class="f-l col-6">
                            <label class="f-l ml-10">是否拼单：</label>
                            <div class="f-l">
                                <div class="">
                                    {{orderData.is_carpool?"是":"否"}}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row cl">
                        <div class="f-l col-6">
                            <label class="f-l ml-10">用车原因：</label>
                            <div class="f-l">
                                <div class="">
                                    {{orderData.reason}}
                                </div>
                            </div>
                        </div>
                        <div v-if="orderData.cancel_reason" class="f-l col-6">
                            <label class="f-l ml-10">取消原因：</label>
                            <div class="f-l">
                                <div class="">
                                    {{orderData.cancel_reason}}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row cl">
                        <div class="f-l col-6">
                            <label class="f-l ml-10">备注信息：</label>
                            <div class="f-l">
                                <div class="">
                                    {{orderData.remark}}
                                </div>
                            </div>
                        </div>
                        <!--<div class="f-l col-6">-->
                            <!--<label class="f-l ml-10">评论：</label>-->
                            <!--<div class="f-l">-->
                                <!--<div class="">-->
                                    <!--{{orderData.comment_vo.comment}}-->
                                <!--</div>-->
                            <!--</div>-->
                        <!--</div>-->
                    </div>

                    <div class="row cl" v-if="orderData.comment_vo">

                        <div class="f-l col-12">
                            <div>
                                <label class="f-l ml-10">评分：</label>
                                <div class="f-l">
                                    <div class="">
                                        {{orderData.comment_vo.score}}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="f-l col-12 mt-10 mb-10 ml-10">
                            <div class="cl">
                                <div class="f-l comment-tags" v-for="tag in commentTags">
                                    {{tag}}
                                </div>
                            </div>
                        </div>

                        <div class="f-l col-12">
                            <div>
                                <label class="f-l ml-10">评论：</label>
                                <div class="f-l">
                                    <div class="">
                                        {{orderData.comment_vo.comment}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    <div class="row cl">
                        <div class="f-l col-6">
                            <div class="row cl">
                                <label class="f-l ml-10">订单费用：</label>
                                <div class="f-l col-8">
                                    <table v-if="concatedFeeArr.length" class="table table-border table-bordered table-hover table-bg">
                                        <thead>
                                        <tr class="text-c">
                                            <th>费用名称</th>
                                            <th>金额</th>
                                            <th>操作员</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr class="text-c" v-for="order in concatedFeeArr">
                                            <td>{{order.feetype}}</td>
                                            <td>{{order.fee ? order.fee / 100 : ''}}</td>
                                            <td>{{order.operator?order.operator:''}}</td>
                                        </tr>
                                        <tr class="text-c">
                                            <td>总计</td>
                                            <td>{{concatedFeeArr | feeSum}}</td>
                                            <td></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="f-l col-6">
                            <div class="row cl">
                                <label class="f-l ml-10">分组：</label>
                                <div class=" f-l col-8">
                                    <tags :tags="wTagsArr" :selected="tagsArr"></tags>
                                </div>
                            </div>
                        </div>
                    </div>



                </div>
                <div class="row cl">
                    <div class="apply-box ml-10 mr-10 pl-10">
                        <p class="mt-10">流程审批</p>
                        <div class="relative">
                            <div class="vertical-line"></div>
                            <div class="apply-item mb-10" v-for="item in orderData.statusrecord_set">
                                <div class="circle"></div>
                                <div class="apply-content ml-10 " >
                                    <div class="content-item" v-for="data in item.extend_info">
                                        <img class="img ml-5" src="../../assets/images/driver_header.jpg" alt="">
                                        <div class="content">
                                            <div class="head">
                                                <div>{{data.approver}}
                                                    <template v-if="data.status_name != '正在审批' && data.status_name != '无需审批' && data.status_name != '未轮到审批'">
                                                        {{data.datetime}}
                                                    </template>
                                                </div>
                                                <div class="">{{data.status_name}}</div>
                                            </div>
                                            <div class="text">{{data.approval_reason}}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row cl" :class="{'orange-bd': trip.carpool_trips && trip.carpool_trips.length}" v-for="trip in orderData.trip_set">
                    <div class="ml-10 mr-10">
                        <div class="travel-title pl-5">行程{{$index + 1}}</div>
                        <div class="travel-content">
                            <div>
                                <span>起点：</span>
                                <span>{{trip.source_name}}</span>
                                <span class="c-orange" v-if="trip.source_remark">地址备注:({{trip.source_remark}})</span>
                            </div>
                            <div>
                                <span>终点：</span>
                                <span>{{trip.destination_name}}</span>
                                <span class="c-orange" v-if="trip.destination_remark">地址备注:({{trip.destination_remark}})</span>
                            </div>
                            <div>
                                <span>乘车人数：</span>
                                <span>{{trip.passenger_number}}</span>
                            </div>
                            <div>
                                <span>是否本人乘车：</span>
                                <span>{{trip.is_self_use?"是":"否"}}</span>
                            </div>

                            <div>
                                <span>乘车人名称/电话：</span>
                                <span v-for="staff in trip.use_staff">
                                    <span class="ml-10">
                                       {{staff.real_name}}/{{staff.phone}}
                                    </span>
                                </span>
                            </div>
                            <div>
                                <span>出发时间：</span>
                                <span>{{trip.ride_time}}</span>
                            </div>
                            <div class="cl">
                                <span>结束时间：</span>
                                <span>{{trip.end_time}}</span>
                                <span @click="modifyDate(trip)" v-if="trip.status == 40 && type !='bill'" class="btn btn-primary radius ml-20">编辑</span>
                            </div>


                            <template v-if="!trip.carpool_id || trip.carpool_id == trip.id">
                                <div class="travel-detail mt-10" v-for="driver in trip.drivertrip">
                                    <div class="lh-30">
                                        <span>接送司机：</span>
                                        <span>{{driver.driver_name}} &nbsp; {{driver.driver_phone}}</span>
                                    </div>
                                    <div class="lh-30">
                                        <span>接送车辆：</span>
                                        <span>{{driver.car_no}}</span>
                                    </div>
                                    <div class="cl lh-30" >
                                        <span>司机行程状态：</span>
                                        <span>{{driver.status_name}}</span>
                                    </div>
                                    <!--<div class="lh-30" v-if="driver.status >= 50">-->
                                    <!--<span>行驶里程：</span>-->
                                    <!---->

                                    <!--</div>-->
                                    <div class="lh-30" v-if="driver.status >= 50">
                                        <span>实际行驶里程：</span>
                                        <!--<span v-if="driver.admin_mileage">{{driver.admin_mileage?driver.admin_mileage / 1000 :0}}KM</span>-->
                                        <span>{{driver.driver_mileage ? driver.driver_mileage / 1000 : 0}}KM</span>
                                        <span v-if="driver.status == 50 && type !='bill'" @click="modifyMileage(driver)" class="btn btn-primary radius ml-20">编辑</span>
                                    </div>
                                    <div class="lh-30">
                                        <span>司机反馈：</span>
                                        <span>{{driver.feedback}}</span>
                                    </div>
                                    <div class="row cl"  v-if=" !trip.carpool_id || trip.carpool_id == trip.id">
                                        <label class="f-l">行程费用：</label>
                                        <div class="f-l col-4" v-if="driver.fee_list && driver.fee_list.length">
                                            <table class="table table-border table-bordered table-hover table-bg mb-10">
                                                <thead>
                                                <tr class="text-c">
                                                    <th>费用名称</th>
                                                    <th>金额</th>
                                                    <th>图片</th>
                                                    <th>操作员</th>
                                                </tr>
                                                </thead>
                                                <!--<div class="result">-->
                                                <tbody>
                                                <tr class="text-c" v-for="fee in driver.fee_list">
                                                    <td>{{fee.feetype}}</td>
                                                    <td>{{fee.fee ? fee.fee / 100 : 0}}</td>
                                                    <td>
                                                        <img :src="fee.img" alt="" style="width:40px;" @click="clickImg(fee.img)">
                                                    </td>
                                                    <td>{{fee.operator}}</td>
                                                </tr>
                                                <tr class="text-c">
                                                    <td>总计</td>
                                                    <td>{{driver.fee_list | feeSum}}</td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                                </tbody>
                                                <!--</div>-->
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>

                    <template v-if="trip.carpool_trips && trip.carpool_trips.length">
                        <div class="row cl" v-for="pool in trip.carpool_trips">
                            <div class="ml-10 mr-10">
                                <div class="travel-title pl-5">拼单行程{{$index + 1}}</div>
                                <div class="travel-content">
                                    <div>
                                        <span>起点：</span>
                                        <span>{{pool.source_name}}</span>
                                        <span class="c-orange" v-if="pool.source_remark">地址备注:({{pool.source_remark}})</span>
                                    </div>
                                    <div>
                                        <span>终点：</span>
                                        <span>{{pool.destination_name}}</span>
                                        <span class="c-orange" v-if="pool.destination_remark">地址备注:({{pool.destination_remark}})</span>
                                    </div>
                                    <div>
                                        <span>乘车人数：</span>
                                        <span>{{pool.passenger_number}}</span>
                                    </div>
                                    <div>
                                        <span>是否本人乘车：</span>
                                        <span>{{pool.is_self_use?"是":"否"}}</span>
                                    </div>

                                    <div>
                                        <span>乘车人名称/电话：</span>
                                        <span v-for="staff in pool.use_staff">
                                    <span class="ml-10">
                                       {{staff.real_name}}/{{staff.phone}}
                                    </span>
                                </span>
                                    </div>
                                    <div>
                                        <span>出发时间：</span>
                                        <span>{{pool.ride_time}}</span>
                                    </div>
                                    <div class="cl">
                                        <span>结束时间：</span>
                                        <span>{{pool.end_time}}</span>
                                        <span @click="modifyDate(pool)" v-if="pool.status == 40 && type !='bill'" class="btn btn-primary radius ml-20">编辑</span>
                                    </div>
                                    <template v-if="trip.carpool_id == pool.id">
                                        <div class="travel-detail mt-10" v-for="driver in pool.drivertrip">
                                            <div class="lh-30">
                                                <span>接送司机：</span>
                                                <span>{{driver.driver_name}} &nbsp; {{driver.driver_phone}}</span>
                                            </div>
                                            <div class="lh-30">
                                                <span>接送车辆：</span>
                                                <span>{{driver.car_no}}</span>
                                            </div>
                                            <div class="cl lh-30" >
                                                <span>司机行程状态：</span>
                                                <span>{{driver.status_name}}</span>
                                            </div>
                                            <!--<div class="lh-30" v-if="driver.status >= 50">-->
                                            <!--<span>行驶里程：</span>-->
                                            <!---->

                                            <!--</div>-->
                                            <div class="lh-30" v-if="driver.status >= 50">
                                                <span>实际行驶里程：</span>
                                                <!--<span v-if="driver.admin_mileage">{{driver.admin_mileage?driver.admin_mileage / 1000 :0}}KM</span>-->
                                                <span>{{driver.driver_mileage ? driver.driver_mileage / 1000 : 0}}KM</span>
                                                <span v-if="driver.status == 50 && type !='bill'" @click="modifyMileage(driver)" class="btn btn-primary radius ml-20">编辑</span>
                                            </div>
                                            <div class="lh-30">
                                                <span>司机反馈：</span>
                                                <span>{{driver.feedback}}</span>
                                            </div>
                                            <div class="row cl" >
                                                <label class="f-l">行程费用：</label>
                                                <div class="f-l col-4" v-if="driver.fee_list && driver.fee_list.length">
                                                    <table class="table table-border table-bordered table-hover table-bg mb-10">
                                                        <thead>
                                                        <tr class="text-c">
                                                            <th>费用名称</th>
                                                            <th>金额</th>
                                                            <th>图片</th>
                                                            <th>操作员</th>
                                                        </tr>
                                                        </thead>
                                                        <!--<div class="result">-->
                                                        <tbody>
                                                        <tr class="text-c" v-for="fee in driver.fee_list">
                                                            <td>{{fee.feetype}}</td>
                                                            <td>{{fee.fee ? fee.fee / 100 : 0}}</td>
                                                            <td>
                                                                <img :src="fee.img" alt="" style="width:40px;" @click="clickImg(fee.img)">
                                                            </td>
                                                            <td>{{fee.operator}}</td>
                                                        </tr>
                                                        <tr class="text-c">
                                                            <td>总计</td>
                                                            <td>{{driver.fee_list | feeSum}}</td>
                                                            <td></td>
                                                            <td></td>
                                                        </tr>
                                                        </tbody>
                                                        <!--</div>-->
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
        </div>
        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close"></a>
    </span>
        <div class="layui-layer-btn" v-if="type !='bill'" v-on:click="save"><a class="layui-layer-btn0">保存</a></div>
    </div>
    <div class="layui-layer-shade"></div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .orange-bd{
        border: 2px solid orange;
        padding:10px;
        margin:10px !important;
    }
    .comment-tags{
        border: 1px solid #dddddd;
        border-radius: 13px;
        padding: 3px 8px;
        text-align: center;
    }
    .bd_ddd{
        border: 1px solid #ddd;
        margin: 0 10px;
    }
    .apply-box{
        border:1px solid #ddd;
        .apply-item{
            display: flex;
            flex-direction: row;
            align-items: center;
            .circle{
                width:10px;
                height:10px;
                background: #0497ff;
                border: none;
                border-radius: 10px;
                margin-left: 15px;
            }
            .apply-content{
                border: 1px solid #ddd;
                border-radius: 5px;
                width:400px;
                display: flex;
                flex-direction: column;
                align-items: center;
                .img{
                    width:30px;
                    height:30px;
                }
                .content-item{
                    display: flex;
                    flex-direction: row;
                    width:400px;
                    min-height:40px;
                    padding-top: 5px;
                }
                .content{
                    display: flex;
                    flex: 1;
                    flex-direction: column;
                    padding: 0 10px;
                    .head{
                        display: flex;
                        flex: 1;
                        flex-direction: row;
                        justify-content: space-between;
                    }
                    .text{
                        margin-top: 5px;
                    }
                }
            }
        }
        .vertical-line{
            border-right:1px dashed #ddd;
            top:0;
            bottom:0;
            left:19px;
            width: 1px;
            position: absolute;
            z-index: -1;
        }
    }
    .travel-title{
        background: #CCCCCC;
    }
    .travel-content{
        padding:5px;
        border:1px solid #ddd;
        border-top:none;
    }
    .travel-detail{
        border:1px solid #ddd;
        padding:5px;
    }

</style>
<script type="text/ecmascript-6">
    import * as base from '../../assets/js/base.js';
    import mileage from '../components/modifyMileage';
    import date from "../components/modifyDate"
    import moment from "moment";
    import tags from './setTags'


    /*

        'tag_staff': '员工分组',
        'department':'公司部门',
        'tag_bus': '通勤车分组',
        'tag_busdriver':'通勤车司机分组',
        'busline':'通勤车线路',
        'tag_offcar': '公务车分组',
        'tag_offorder':'公务车订单分组',
        'tag_offdriver':'公务车司机分组',
        'tag_offcar2': '公务车分组2',
        'tag_offorder2': '公务车订单分组2',
        'tag_offdriver2': '公务车司机分组2',
        'tag_building':'宿舍楼分组',
        'tag_room': '宿舍分组',
        'room_type':'房间类型',
        'repair_type': '维修故障项大类',
        'public_repair_type':'公共报修类型',
        'room_feetype':'费用类别',
        'good_type':'物资大类',
        'vehicle_failure':'车辆故障大类'

    */
    export default{
        ready(){
            this.getTagList();
            this.getDetails();
        },
        data: function(){
            return{
                itemsLoading:false,
                noData:false,
                items:[],
                wTagsArr:[],
                tagsArr:[],
                orderData:{
                    staff_vo:{},
                    comment_vo:{},
                },
                concatedFeeArr:[],
                orderTotalCost:0,
                showModifyMileage:false,
                dialogData:"",
                showModifyDate:false,
                startDate:"",
                endData:"",
                commentTags:[],
            }
        },
        props:["data","type"],
        methods:{
            getTagList: function () {
                this.itemsLoading = true;
                // 3代表大巴车,4代表公务车
                $.ajax({
                    url: base.gAjaxUrl.tagGroup,
                    type: 'GET',
                    data: {
                        type: 5,
                        page: 1,
                        page_size: 999999,
                        flag: 'tag_offorder2'
                    }
                }).always((data)=> {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=> {
                        this.wTagsArr = data.results || [];
                    });
                });
            },
            getTagIds: function (tagArr) {
                let arr = [];
                for (let i = 0, len = tagArr.length; i < len; i++) {
                    arr.push(tagArr[i].id);
                }
                return arr;
            },
            close:function(){
                this.$dispatch("dialog-close","showOrderDetail")
            },
            getDetails:function(){
                let id = this.type =='bill' ? this.data.order : this.data.id;
                $.showLoading();
                $.ajax({
                    url: `${base.gAjaxUrl.officialcarOrder_V2}${id}/`,
                    type: 'GET',
                }).always((data)=>{
                    $.hideLoading();
                    base.ajaxCallback(data,()=>{
                        this.orderData = data;
                        this.tagsArr = data.tags_vo;
                        this.concatArr(data.trip_set)
                        if(data.comment_vo){
                            this.commentTags = data.comment_vo.tags.split(",")
                        }
                    });
                })
            },
            concatArr:function(arr){
                this.concatedFeeArr = [];
                for (let trip of arr){
                    console.log("trip",trip);
                    if(!trip.carpool_id || trip.carpool_id == trip.id){
                        if(trip.drivertrip){
                            trip.drivertrip.map((data)=>{
                                if(data.fee_list && data.fee_list.length){
                                    this.concatedFeeArr = this.concatedFeeArr.concat(data.fee_list);
                                }
                            });
                        }
                    }

                }
            },
            modifyMileage:function(data){
                this.dialogData = data;
                this.showModifyMileage = true;
            },
            closeMileage:function(){
                this.showModifyMileage = false;
            },
            saveMileage:function(){
                this.showModifyMileage = false;
                this.getDetails();
            },
            closeDate:function(){
                this.showModifyDate = false;
            },
            modifyDate:function(data){
                this.dialogData = data;
                this.startDate = data.ride_time;
                this.endDate = data.end_time;
                this.showModifyDate = true;
            },
            saveDate:function(){
                this.showModifyDate = false;
                this.getDetails();
            },
            save:function(){
                $.showLoading();
                $.ajax({
                    url:`${base.gAjaxUrl.officialcarOrder_V2}${this.orderData.id}/`,
                    type:"PATCH",
                    contentType:"application/json",
                    data:JSON.stringify({
                        tags:this.getTagIds(this.tagsArr)
                    })
                }).always((data)=>{
                    $.hideLoading();
                    base.ajaxCallback(data,()=>{
                        layer.msg("保存成功",{icon:1,time:2000});
                        this.$dispatch("dialog-close","showOrderDetail")
                    })
                })
            },
            clickImg: function (url) {
                layer.open({
                    title: '故障描述',
                    content: `<img src="${url}" style="width:280px;height:auto">`,
                });
            }
        },
        components: {
            tags:tags,
            mileage:mileage,
            date:date,
        },
        filters: {
            filterOrderStatus:function(data){
                // 订单状态 -20--已驳回  -10--已取消  10--审批中 20--待派单  30--待接送  40--接送中  50--已完成  60--已评价
                switch(data){
                    case -20:{
                        return "已驳回"
                    }
                    case -10:{
                        return "已取消"
                    }
                    case 10:{
                        return "审批中"
                    }
                    case 20:{
                        return "待派单"
                    }
                    case 30:{
                        return "待接送"
                    }
                    case 40:{
                        return "接送中"
                    }
                    case 50:{
                        return "已完成"
                    }
                    case 60:{
                        return "已评价"
                    }
                }
            },
            filterApplyStatus:function(data){
                // 审批状态 -10--驳回  10--审批通过  20--正在审批中  30--无法审批
                switch(data){
                    case -10:{
                        return "已驳回"
                    }
                    case 10:{
                        return "审批通过"
                    }
                    case 20:{
                        return "正在审批中"
                    }
                    case 30:{
                        return "无法审批"
                    }
                }
            },
            feeSum:function(feeArr){
                let sum = 0;
                for (let fee of feeArr){
                    console.log("fee");
                    console.log(fee);
                    sum += +fee.fee;
                }
                return sum / 100
            }
        }
    }
</script>
