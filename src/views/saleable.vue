<template>
    <section class="Hui-article-box">
    <div class="page-container">
        <div class="text-l clearfix">
            <input id="searchInput" type="text"  placeholder="线路名称" style="width:250px" class="f-l input-text">
            <!-- <button v-on:click="getList(1)" class="btn btn-success" type="button"><i class="f-r Hui-iconfont">&#xe665;</i></button>
            &nbsp;&nbsp;或者按&nbsp;&nbsp; -->

            出发日期：
            <input v-model="startDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-start-date" v-bind:value="startDateInput">
            <!-- 出发日期：
            <input v-model="endDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-end-date" v-bind:value="endDateInput"> -->

            <button v-on:click="getList(1)" class="btn btn-success" type="button"><i class="f-r Hui-iconfont">&#xe665;</i></button>
        </div>
        <div class="form-min-height">
            <table class="table table-border table-bordered table-hover table-bg table-sort mt-20">
                <thead>
                    <tr class="text-c">
                        <th>线路名称</th>
                        <th>起点</th>
                        <th>终点</th>
                        <th>座位</th>
                        <th>剩余座位</th>
                        <th>价格</th>
                        <th>出发时间</th>
                        <th>出发日期</th>
                        <th width="80">出票</th>
                    </tr>
                </thead>
                <tbody v-if="!noData">
                    <tr class="text-c" v-for="item in items">
                        <td>{{item.shuttle_bus_vo.shuttle_name}}</td>
                        <!--<td>{{item.shuttle_bus_vo['go_stations_json'] && && item.shuttle_bus_vo['go_stations_json']['0']['station_name']}}</td>-->
                        <!--<td>{{item.shuttle_bus_vo['go_stations_json'][item.shuttle_bus_vo['go_stations_json'].length-1]['station_name']}}</td>-->
                        <td>{{item.shuttle_bus_vo.go_stations_json && item.shuttle_bus_vo.go_stations_json.length > 0 ? item.shuttle_bus_vo.go_stations_json[0].station_name : ''}}</td>
                        <td>{{item.shuttle_bus_vo.go_stations_json && item.shuttle_bus_vo.go_stations_json.length > 0 ? item.shuttle_bus_vo.go_stations_json[item.shuttle_bus_vo.go_stations_json.length-1].station_name : ''}}</td>
                        <td>{{item.shuttle_bus_vo.seats}}</td>
                        <td>{{item.remaining_seats}}</td>
                        <td>{{item.shuttle_bus_vo.price/100}}</td>
                        <td>{{item.bus_time_vo?item.bus_time_vo.departure_time:item.shuttle_bus_vo.departure_time}}</td>
                        <td>{{item.departure_date}}</td>
                        <td><div class="btn btn-link size-S radius" v-on:click="clickCreateOrder(item.id)">出票</div></td>
                    </tr>
                </tbody>
            </table>
            <div id="J-page" class="m-page" v-show="!noData"></div>
            <div class="m-loading" v-if="itemsLoading">
                <div class="cube1"></div>
                <div class="cube2"></div>
            </div>
            <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
        </div>
    </div>
    </section>
</template>

<style lang="less">
    .form-min-height{
        height:592px;
    }
    .avatar{
        width: 50px;
    }
</style>

<script>
    import * as base from '../assets/js/base.js';
    import moment from "moment";
    import add from "../components/addDepartments.vue";
    let saleableOps = null;

    export default{
        ready () {
            // this.startDateInput = moment().add('-1','months').format('YYYY-MM-DD');
            this.startDateInput = moment().add('0','months').format('YYYY-MM-DD');
            this.endDateInput = moment().format('YYYY-MM-DD');
            saleableOps = {
                param:{
                    search:'',
                    departure_date: '',
                    // end_date: '',
                    page:1,
                    page_size:10,
                }
            };
            // new Kalendae.Input('J-end-date', {
            //     months: 2,
            // });
            new Kalendae.Input('J-start-date', {
                months: 2,
            });
            let that = this;

            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-page',tpageToal,saleableOps.param.page,count)
            });                 
        },
        data:function(){
            return {
                noData:false,
                items: [],
                searchInput:'',
                itemsLoading:false, 
                startDateInput:'2017-03-23',
                // endDateInput:'2016-09-01',
            }
        },
        methods: {
            clickCreateOrder:function(id){
                let ajaxData = {
                    shuttle_bus_date:id
                }
                $.ajax({
                    url: base.gAjaxUrl.createOrder,
                    contentType: 'application/json',
                    data:JSON.stringify(ajaxData)
                })
                .always((data)=>{
                    base.ajaxCallback(data,()=>{
                        layer.msg('出票成功',{icon:1,time:1000});
                        this.getList();
                    });
                })
            },
            //初始化分页   
            initPage:function(obj,tpageToal='4',current='1',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:current,
                    count:count,
                    callback:(p)=>{
                        saleableOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax:function(callback=function(){}){
                this.itemsLoading = true;
                //修改参数
                saleableOps.param.search = this.searchInput;
                //添加的按时期查询不知道行不行了？
                saleableOps.param.departure_date = this.startDateInput;
                // saleableOps.param.end_date = this.endDateInput;

                $.ajax({
                    url: base.gAjaxUrl.saleable,
                    type: 'GET',
                    data:saleableOps.param
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
                            this. noData = true;
                        }
                    });
                })
            },
            //获取列表
            getList:function(reset=0){
                //重置第一页
                if(reset){
                    saleableOps.param.page = 1;
                    this.searchInput= $("#searchInput").val();
                }

                this.queryAjax((tpageToal='4',count='0')=>{
                    // this.initPage('#J-page',saleableOps,staffsOps.param.page)
                    // this.initPage('#J-page',staffsOps,saleableOps.param.page)
                    this.initPage('#J-page',saleableOps.param.page,count)
                });
            }
        },
        components:{
            
            
        }
    }
</script>