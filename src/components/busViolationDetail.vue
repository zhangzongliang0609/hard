<template>
    <section class="Hui-article-box">
        <div class="page-container">
            <div class="cl pd-5 bg-1 bk-gray">
            <span class="l">
                <a class="l btn btn-primary radius" href="javascript:;" v-on:click="clickgoBack()">返回</a>
                <div class="l m-info ml-10">
                    <!--                  <td>{{item.real_name}}/{{item.sex == 1 ? "男" : "女"}}</td>
                            <td>{{item.department_name}}/{{item.position}}</td>
                            <td>{{item.phone}}</td>
                            <td>{{item.job_number}}</td>
                            <td>{{item.shuttle_name}}</td>
                            <td>{{item.departure_datetime}}</td>
                            <td>{{item.check_num}}</td>                          -->
                    <div class="l item">姓名/性别：{{order.real_name}}/{{order.sex==1? '男': '女';}}</div>
                    <div class="l item">部门/职位：{{order.department_name}}/{{order.position}}</div>
                    <div class="l item">电话：{{order.phone}}</div>
                    <div class="l item">工号：{{order.job_number}}</div>
                    <div class="l item">线路名称：{{order.shuttle_name}}</div>
                    <div class="l item">发车时间：{{order.departure_datetime}}</div>

                </div>
            </span>
            </div>
            <table class="table table-border table-bordered table-hover table-bg mt-20" >
                <thead>
                <tr class="text-c">
                    <th>线路名称</th>
                    <th>上车站点</th>
                    <th>乘坐车辆</th>
                    <th>刷卡时间</th>
                </tr>
                </thead>
                <div class="result" v-if="!noData">
                    <tbody>
                    <tr class="text-c" v-for="item in dialogData">
                        <td>{{item.shuttle_name}}</td>
                        <td>{{item.station}}</td>
                        <td>{{item.car_no}}</td>
                        <td>{{item.check_time}}</td>
                    </tr>
                    </tbody>
                </div>
            </table>
            <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
        </div>
    </section>
</template>

<style lang="less">
</style>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    export default{
        ready () {
            this.getDetail()
        },
        data:function(){
            return {
                noData:false,
                dialogData:'',
            }
        },
        props:['order'],
        filters:{

        },
        methods: {
            getDetail() {
                $.ajax({
                    url: `${base.gAjaxUrl.busViolationList}detail/`,
                    type: 'GET',
                    data:{
                        order_id:this.order.order_id
                    }
                }).always((data) => {
                    base.ajaxCallback(data, () => {
                        this.dialogData = data;
                    });
                })
            },

            //返回
            clickgoBack:function(){
                this.$dispatch("detail-close")
            },
        },
        components:{
        }
    }
</script>
