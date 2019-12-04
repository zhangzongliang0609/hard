<template>
    <!-- 添加 -->
    <set :title="dialogTitle" :type="dialogType" :data="dialogData" v-if="isShowSetDialog" v-on:dialog-close="setDialogClose" v-on:dialog-save="setDialogSave"></set>

    <section class="Hui-article-box">
        <div class="page-container bgc-f5 bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body">
                    <span class="f-20 fw-b">设置临界金额</span>
                </div>
            </div>
            <div class="bk-gray radius mt-10 bgc-fff">
                <div class="pd-15 clearfix">
                    <a class="btn btn-primary radius" title="设置临界金额" href="javascript:;" class="ml-5" v-on:click="clickSet(items[0])">设置临界金额</a>
                </div>
                <div class="bgc-ed pd-10 fw-b">
                    <span class="mr-10">临界金额:</span>{{items[0].crucial_amount}}元
                </div>
                <div class="flex text-c">
                    <div class="flex-1 pd-10 bor-r">普通报价审批人&lt;{{items[0].crucial_amount}}元</div>
                    <div class="flex-1 pd-10">高级报价审批人&ge;{{items[0].crucial_amount}}元</div>
                </div>
            </div>
        </div>
    </section>
</template>
<style lang="less" scoped>
    .bgc-f5{
        background-color: #f5f5f5;
    }
    .fw-b{
        font-weight: bold;
    }
    .btn.pd-4{
        padding: 4px;
    }
    .btn.fs-12{
        font-size: 12px;
    }
</style>
<script>
    import * as base from '../assets/js/base.js';
    import set from '../components/setVehicleRepairRule.vue';

    export default{
        ready(){
            this.getList();
        },
        data: function(){
            return{
                isShowSetDialog:false,
                items: [
                    {
                        crucial_amount:0,
                        id: '',
                    }
                ],
                dialogTitle:'添加报修类型',
                dialogType:'add',
                dialogData: {},
            }
        },
        methods: {
            setDialogClose:function(data){
                this.isShowSetDialog = false;
            },
            setDialogSave:function(data){
                this.isShowSetDialog = false;
                this.getList();
            },
            clickSet:function(data){
                this.dialogTitle='设置临界金额';
                this.dialogData = data;
                if(data.id.length == 0){
                    this.dialogType = 'add';
                }else{
                    this.dialogType = 'modify';
                }
                this.isShowSetDialog = true;
            },
            //获取列表
            getList:function(){
                this.queryAjax();
            },
            queryAjax:function(callback=function(){}){
                $.ajax({
                    url: base.gAjaxUrl.vehicleRepairrule,
                    type: 'GET',
                })
                .always((data)=>{
                    base.ajaxCallback(data,()=>{
                        let resultData = data;
                        if(resultData && resultData.length != 0){
                            this.items = resultData;
                        }
                    });
                })
            },
        },
        components: {
            set,
        }
    }
</script>