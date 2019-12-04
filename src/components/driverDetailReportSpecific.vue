<template>
	<div class="layui-layer layui-anim layui-layer-page layui-modify layer-add-bus">
        <div class="layui-layer-title">{{title}}</div>
        <div class="layui-layer-content">
			   <div class="text-l mt-20"> 
            关键字：
            <input type="text" class="input-text Wdate mr-5" style="width:150px;" placeholder="站点/出发时间/价格" v-model="searchInput">
            
            开始日期：
            <input v-model="startDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-start-date" v-bind:value="startDateInput">
            结束日期：
            <input v-model="endDateInput" type="text" class="input-text Wdate mr-5" style="width:120px;" id="J-end-date" v-bind:value="endDateInput">

            <!-- specific导出数据按钮 -->
            <!-- <span class="l">
                 <a class="btn btn-primary radius" href="javascript:;" v-on:click="clickAdd()"><i class="Hui-iconfont">&#xe665;</i> 
             </a>
             </span> --> 
            

            <button type="submit" class="btn btn-success radius" v-on:click="getList(1)">
            	<i class="Hui-iconfont">&#xe665;</i>
            </button>
        </div>
        </div> 
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
        </span>
        <div class="layui-layer-btn" v-on:click="save"><a class="layui-layer-btn0">保存</a></div> 
    </div>
    <div class="layui-layer-shade"></div>
</template>
<script>
    import * as base from '../assets/js/base.js';
    import drivermap from "../components/driverMap.vue";
    
    let rideDetailReportOps = null;

    export default{
        ready () {
            rideDetailReportOps = {
                param:{
                    search:'',
                    start_date:'',
                    end_date:''
                },
                page:1,
                page_size:10
            }
			//验证
            $('.layui-layer-content').validate({
                rules: {
                    startDateInput:{
                        required: true,
                    },
                    endDateInput: {
                        required: true,
                    },
                    
                },

            let that = this;

            this.startDateInput = localStorage['startDate'];
            this.endDateInput = localStorage['endDate'];

            new Kalendae.Input('J-end-date', {
                format:'YYYY-MM-DD',
                months: 2,
            });
            new Kalendae.Input('J-start-date', {
                format:'YYYY-MM-DD',
                months: 2,
            });

            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-page',tpageToal,count)
            });           
        },
        data:function(){
            return {
                // isShowDialog:false,
                // dialogTitle:'查看路径',
                // dialogData:'',
                // itemsLoading:true,
                // items: [],
                // noData:false,
                searchInput:'',
                startDateInput:'2016-08-01',
                endDateInput:'2016-09-01',
                tempItems:JSON.parse(localStorage['tempData']),
            }
        },
        methods: {
        	close:function(){
                this.$dispatch('dialog-close');
            },
            save:function(){
                if(this.stationItem.length >= 2){
                    
                    $('#J-layer-form').submit();
                }
                else {
                    layer.msg('请至少添加两个站点',{icon:1,time:1000});
                }
                

            },
            //初始化分页   
            initPage:function(obj,tpageToal='4',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:1,
                    count:count,
                    callback:(p)=>{
                        rideDetailReportOps.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax:function(callback=function(){}){
                
                this.itemsLoading = true;
                //修改参数
                rideDetailReportOps.param.search = this.searchInput;
                rideDetailReportOps.param.start_date = this.startDateInput;
                rideDetailReportOps.param.end_date = this.endDateInput;

                $.ajax({ 
                    url: `${base.gAjaxUrl.officialcardrivers}${this.tempItems.driver}/order_detail_report/?page=${rideDetailReportOps.page}&page_size=${rideDetailReportOps.page_size}`,
                    contentType: 'application/json',
                    type: 'POST',
                    data:JSON.stringify(rideDetailReportOps.param)
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
            	if()
                //重置第一页
                rideDetailReportOps.page = 1

                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-page',tpageToal,rideDetailReportOps.page,count)
                });
            },
          
           
        },
        components:{
            drivermap
        }
    }
  }

</script>
<style lang="less">
// .layer-add-bus{
//     .station-item{
//         width: 80px;
//         display: inline-block;
//         border: none;
//         background: none;
//         line-height: 19px;
//         height: 19px;

//     }
// }
</style>