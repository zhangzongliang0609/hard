<template>
<div class="layui-layer layui-anim layui-layer-page layui-modify">
    <div class="layui-layer-title">{{title}}</div>
    <div class="layui-layer-content pd-20"> 
        <div class="layui-layer-wrap">
            <div class="text-l clearfix">
                <input v-model="searchInput" type="text"  placeholder="姓名/工号/电话/部门/职位" style="width:250px" class="f-l input-text">
                <button v-on:click="getList()" class="btn btn-success" type="button"><i class="f-r Hui-iconfont">&#xe665;</i></button>
            </div>
            <table class="table table-border table-bordered table-hover table-bg table-sort row">
                <thead>
                    <tr class="text-c">
                        <th width="25">选择</th>
                        <th width="70">车牌</th>
                        <th >品牌</th>
                        <th>型号</th>
                        <th width="50">颜色</th>
                        <th width="50">座位数</th>
                        <th width="100">类型</th>
                        <th width="200">备注</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="text-c" v-for="item in items">
                        <td><input type="radio" class="radio-wh" :value="item" name="" v-model="selected_vehicle">{{item.avatar}}</td>
                        <td>{{item.car_no}}</td>
                        <td>{{item.car_brand}}</td>
                        <td>{{item.car_model}}</td>
                        <td>{{item.car_color}}</td>
                        <td>{{item.seats}}</td>
                        <td>{{item.car_type}}</td>
                        <td>{{item.remark}}</td>
                    </tr>
                </tbody>
            </table>
            <div id="J-page" class="m-page row" v-show="!noData"></div>
            <div class="no-data text-c mt-50 row" v-if="noData">没有相关数据</div>
        </div>
    </div>
    <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
    <div class="layui-layer-btn" v-on:click="save"><a class="layui-layer-btn0">保存</a></div>
</div>
<div class="layui-layer-shade"></div>
</template>
 
<style lang="less">
.avatar{
    width: 50px;
}
.radio-wh{
    width: 20px;
    height: 20px;
    cursor: pointer;
}
</style>

<script>
import * as base from '../assets/js/base.js';

    let staffsOps = null;

    export default{
        ready () {

            let that = this;

            staffsOps = {
                param:{
                    search:'',
                    page:1,
                    page_size:10,
                }
            };

            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-page',tpageToal,staffsOps.param.page,count)
            });                 

        },
        props: ['title','type','data'],
        data:function(){
            return {
                noData:false,
                items: [],
                searchInput:'',
                selected_employee:'',
                selected_vehicle:'',
            }
        },
        methods: {
            //初始化分页   
            initPage:function(obj,tpageToal='4',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:1,
                    count:count,
                    callback:(p)=>{
                        staffsOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax:function(callback=function(){}){
                //修改参数
                staffsOps.param.search = this.searchInput;

                $.ajax({
                    url: base.gAjaxUrl.officialcarvehicles,
                    type: 'GET',
                    data:staffsOps.param
                })
                .always((data)=>{
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
                //重置第一页
                staffsOps.param.page = 1

                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-page',tpageToal,staffsOps.param.page,count)
                });
            },
            close:function(){
                this.$dispatch('dialog-close');
            },
            save:function(){
                // if(this.selected_vehicle.length < 1){
                //     layer.msg('请先选择车辆哦',{icon:1,time:1000});
                // }
                // else{
                // /*$('#J-layer-form').submit();*/
                // console.log('selected_emoloyee is ', this.selected_vehicle)
                // /*this.$dispatch('did-selected-vehicle', this.selected_vehicle);*/
                // this.$dispatch('dialog-save', this.selected_vehicle);
                // }
                
                /*$('#J-layer-form').submit();*/
                console.log('selected_emoloyee is ', this.selected_vehicle)
                /*this.$dispatch('did-selected-vehicle', this.selected_vehicle);*/
                this.$dispatch('dialog-save', this.selected_vehicle);
            }
        }
    }
</script>
