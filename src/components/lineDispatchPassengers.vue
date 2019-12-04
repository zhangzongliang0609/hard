<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">查看乘车记录</div>
        <div class="layui-layer-content">
            <div class="text-l clearfix lh-30 mb-10">
                <div class="f-l">
                    <select class="select" @change="setCarItem" v-model="carId">
                        <option value="">全部</option>
                        <option :value="item.id" v-for="item in cars">{{item.car_no}}</option>
                    </select>
                </div>
                <div class="f-l ml-20">
                    {{data.departure_date}}&nbsp;/
                    {{data.departure_time}}&nbsp;/
                    司机：{{currentCar.driver_name || '--'}}&nbsp;&nbsp;{{currentCar.phone || '--'}}&nbsp;/
                    人数：{{passengerNumbers}}
                </div>
            </div>
            <table class="table table-border table-bordered table-hover table-bg">
                <thead>
                <tr class="text-c">
                    <th>姓名/性别</th>
                    <th>部门</th>
                    <th>职位</th>
                    <th>工号</th>
                    <th>电话</th>
                    <th>报名站点</th>
                    <th>车牌/车号</th>
                    <th>司机</th>
                    <th>状态</th>
                </tr>
                </thead>
                <tbody v-if="!noData">
                <tr class="text-c" v-for="item in passengers">
                    <td>{{item.real_name || '--'}}/{{item.sex || '--';}}</td>
                    <td>{{item.department || '--'}}</td>
                    <td>{{item.position || '--'}}</td>
                    <td>{{item.job_number || '--'}}</td>
                    <td>{{item.phone || '--'}}</td>
                    <td>{{item.bus_station || '--'}}</td>
                    <td>{{item.car_no || '--'}}/{{item.car_flag || '--'}}</td>
                    <td>{{item.driver_name || '--'}}</td>
                    <td>{{item.status}}</td>
                </tr>
                </tbody>
            </table>
            <div id="J-page" class="m-page" v-show="!noData"></div>
            <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;"
               v-on:click="close()"></a>
        </span>
    </div>
    <div class="m-loading" v-if="loading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<style scoped lang="less">
    .layui-modify {
        min-width: 1000px !important;
        margin-top: 30px;
    }

    .layui-layer-content {
        padding: 0 20px;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    let commentsOps = null;
    export default{
        ready () {
            commentsOps = {
                param: {
                    page: 1,
                    page_size: 10,
                    vehicle: ''
                }
            };
            this.getList(1);
            this.setCars();
        },
        props: ['data'],
        data: function () {
            return {
                noData: false,
                passengers: [],
                loading: true,
                cars: [],
                carId: '',
                currentCar: {},
                passengerNumbers: 0,
            }
        },
        methods: {
            close: function () {
                this.$dispatch('dialog-close');
            },
            setCars: function () {
                let arr = [];
                this.data.dispatch_set.forEach((item) => {
                    arr.push({
                        id: item.vehicle,
                        car_no: item.car_no,
                        driver_name: item.driver_name,
                        phone: item.phone,
                    })
                })
                this.cars = arr;
            },
            setCarItem: function () {
                if(this.carId){
                    this.cars.every((item) => {
                        if (item.id == this.carId) {
                            this.currentCar = item;
                            return false
                        }
                        return true
                    });
                } else {
                    this.currentCar = {}
                }
                commentsOps.param.vehicle = this.carId;
                this.getList(1);
            },
            //获取列表
            getList: function (reset) {
                //重置第一页
                if (reset) {
                    commentsOps.param.page = 1
                }
                this.queryAjax((tpageToal = '4', count = '0')=> {
                    this.initPage('#J-page', tpageToal, count)
                });
            },
            queryAjax: function (callback = () => {
            }) {
                this.itemsLoading = false;
                $.ajax({
//                    url: `${base.gAjaxUrl.busDispatchList}02da08db-73cd-4a37-ab36-53d97a9a4cb2/staffs/`,
                    url: `${base.gAjaxUrl.shuttlebusdates3}${this.data.id}/staffs/`,
                    type: 'GET',
                    data: commentsOps.param
                }).always((data)=> {
                    this.loading = false;
                    base.ajaxCallback(data, ()=> {
                        let res = data.results || [];
                        this.passengers = res;
                        this.passengerNumbers = data.count || 0;
                        if (res.length) {
                            this.noData = false;
                            callback(data.num_pages, data.count);
                        } else {
                            this.noData = true;
                        }

                    });
                });
            },
            //初始化分页
            initPage: function (obj, tpageToal = '4', count = '0') {
                $(obj).createPage({
                    pageCount: tpageToal,
                    current: 1,
                    count: count,
                    callback: (p)=> {
                        commentsOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
        }
    }
</script>
<style lang="less" rel="stylesheet/less" scoped>
    .layui-layer-title {

        .m-info {
            border: none;
            padding: 9px 0;
            margin: 0;
        }

    }
</style>
