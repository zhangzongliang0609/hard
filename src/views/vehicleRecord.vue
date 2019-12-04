<template>
    <section class="Hui-article-box">
        <div class="record-title">车辆档案</div>
        <ul id="tabBar" class="tab">
            <li class="current" @click="getList('all')">全部</li>
            <li @click="getList('insurance')">保险管理</li>
            <li @click="getList('quarterly')">季审及领标管理</li>
            <li @click="getList('annual')">年审及领标管理</li>
            <li @click="getList('maintenance')">保养管理</li>
            <li @click="getList('peccancy')">车辆违章管理</li>
        </ul>
        <all v-if="currentList == 'all'" :type="port"></all>
        <insurance v-if="currentList == 'insurance'" :type="port"></insurance>
        <quarterly v-if="currentList == 'quarterly'" :type="port"></quarterly>
        <annual v-if="currentList == 'annual'" :type="port"></annual>
        <maintenance v-if="currentList == 'maintenance'" :type="port"></maintenance>
        <peccancy v-if="currentList == 'peccancy'" :type="port"></peccancy>
    </section>
    <vehicle-detail v-if="isShowDetails" :title="dialogTitle" :type="port" :data="dialogData" v-on:dialog-close="closeVehicle" ></vehicle-detail>
</template>

<style lang="less" rel="stylesheet/less" scoped>
    #app .tab{
        margin-top: 30px;
        display: flex;
        li{
            flex:1;
            height: 80px;
            text-align: center;
            line-height: 80px;
            border:1px solid #ccc;
            margin:0 20px;
            background-color: #e4e4e4;
            border-radius: 8px;
        }
        .current{
            background-color: #6498e1;
            color:white;
        }
    }
    #app .warning{
        width: 20px;
        height: 20px;
    }

    #app .window-box{
        width: 100%;
        height: 100%;

    }
    .record-title{
        font-size: 16px;
        color:black;
        margin:10px 20px;
        border-radius:8px;

    }
    .Hui-article-box{
        overflow: auto;
    }

</style>

<script>
    import * as base from '../assets/js/base.js';
    import all from '../components/allVehicle';
    import insurance from '../components/insuranceList';
    import quarterly from '../components/quarterlyManage';
    import annual from '../components/annualList';
    import maintenance from '../components/maintenanceList';
    import peccancy from '../components/peccancyDetails';
    import vehicleDetail from '../components/vehicleArchivesDetail.vue';




    export default{
        ready () {
            let that = this;

            $("#tabBar li").on("click",function () {
                $(this).addClass("current").siblings().removeClass("current");
            });
        },
        data:function(){
            return {
                noData:false,
                itemsLoading:false,
                items: [],
                importUrl: 'staffsIpmort',
                searchInput:'',
                currentList:'all',
                port:base.gAjaxUrl.officialcarvehicles,
                dialogTitle: '档案明细',
                dialogData: {},
                isShowDetails: false,
            }
        },
        methods: {
            //初始化分页
            //获取列表
            getList:function(showList){
                this.currentList = showList;

            },
            showVehicle: function (data) {


                this.dialogData = data;

                this.isShowDetails = true;

            },
            closeVehicle: function () {
                this.isShowDetails = false;
            },

        },
        events:{
            "show-details": function (data) {
                this.dialogData = data;
                this.isShowDetails = true;
            }
        },
        components:{
            all, // 全部
            insurance, // 保险管理
            quarterly, // 季审管理
            annual,    // 年审管理
            maintenance, // 保养管理
            peccancy,  // 违规详情
            vehicleDetail //车辆档案明细

        }
    }
</script>
