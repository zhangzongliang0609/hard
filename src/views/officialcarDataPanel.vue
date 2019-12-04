<template>
    <div class="Hui-article-box">
        <div id="statistics-main">
            <!--[> Tab标题 <]-->
            <div class="tabBar clearfix">
                <span :class="{'current':currentTab == 0}" @click="tabShow(0)">用车统计</span>
                <span :class="{'current':currentTab == 1}" @click="tabShow(1)">司机车辆统计</span>
                <span :class="{'current':currentTab == 2}" @click="tabShow(2)">当天实时看板</span>
            </div>
            <div class="wall cl"></div>
            <orderstatistics   v-if="isShowStatistics"></orderstatistics>
            <drivervehiclestatistics   v-if="isShowDriverStatistics" ></drivervehiclestatistics>
            <realtimestatistics  v-if="isShowRealtimes"></realtimestatistics>
        </div>

    </div>
</template>
<style scoped>
    #statistics-main { 
        width: 100%;
        height: 100%;
    }
    .wall{
        height: 50px;
    }
    div.tabBar {
        position:fixed;
        width: 100%;
        z-index:100;
        height: 43px;
        border-bottom: 0;
    }
    .tabBar span {
        text-align: center;
    }
    .tabCon {
        display: block;
        width: 100%;
        height: calc(100% - 43px);
        overflow: auto;
    }
    .clearfix:after{content:"\20";display:block;height:0;clear:both;visibility:hidden}.clearfix{zoom:1}
    .tabBar {background-color: #6E6E6E;height: 43px;}
    .tabBar span {color: white;cursor: pointer;display: inline-block;float: left;height: 30px;line-height: 30px;padding: 4px 16px; width: 120px;background-color: #6E6E6E; border-top: 4px solid #6E6E6E;font-size: 16px;}
    .tabBar span.current{background-color: #697E93; border-top: 4px solid #5CADFE; width: 120px;}
    .tabCon {display: none}
</style>
<script>
    import * as base from '../assets/js/base.js';
    import orderstatistics from './officialcarOrderStatistics.vue';
    import drivervehiclestatistics from './officialDriverVehicleStatistics.vue';
    import realtimestatistics from './officialCarRealtimestatistics.vue';

//    function notifyChildTab(childVm) {
//        if (childVm.$children) {
//            console.log(childVm)
//            childVm.$emit('tabshow')
//        }
//    }
    export default{
        ready () {
            // console.log('ready for tab')
            // H_UI的tab 切换

//            let vm = this
//            jQuery.Huitab = function(tabBar,tabCon,class_name,tabEvent,i){
//                var $tab_menu=$(tabBar);
//                  // 初始化操作
//                  $tab_menu.removeClass(class_name);
//                  $(tabBar).eq(i).addClass(class_name);
//                  $(tabCon).hide();
//                  $(tabCon).eq(i).show();
//                  notifyChildTab(vm.$children[i])
//
//                  $tab_menu.bind(tabEvent,function(){
//                      $tab_menu.removeClass(class_name);
//                      $(this).addClass(class_name);
//                      var index=$tab_menu.index(this);
//                      $(tabCon).hide();
//                      $(tabCon).eq(index).show()
//                      notifyChildTab(vm.$children[index])
//                  })
//            }
//            $.Huitab("#statistics-main .tabBar span","#statistics-main .tabCon","current","click","0");
        },
        data:function(){
            return {
                isShowStatistics:true,
                isShowDriverStatistics:false,
                isShowRealtimes:false,
                currentTab:0,
            }
        },
        methods: {
            tabShow:function (index) {
                let that = this;
                that.currentTab = index;
                switch(index){
                    case 0:{
                        that.isShowStatistics = true;
                        that.isShowDriverStatistics = false;
                        that.isShowRealtimes = false;
                        break;
                    };
                    case 1 :{
                        that.isShowDriverStatistics = true;
                        that.isShowStatistics = false;
                        that.isShowRealtimes = false;
                        break;
                    }
                    case 2 :{
                        that.isShowRealtimes = true;
                        that.isShowStatistics = false;
                        that.isShowDriverStatistics = false;
                        break;
                    }
                }
            }
        },
        components:{
            orderstatistics,
            drivervehiclestatistics,
            realtimestatistics
        }
    }
</script>
