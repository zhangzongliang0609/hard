<template>
    <section class="Hui-article-box">
        <div class="page-container bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body">
                    <span class="f-20 fw-b">订水规则设置</span>
                </div>
            </div>
            <div class="mt-10 clearfix">
                <div class="materialclasses bk-gray radius bgc-fff f-l">
                    <ul>
                        <li class="item clearfix relative">
                            <span class="fw-b fs-16">规则设置</span>
                            <!-- <i class="Hui-iconfont modifyIcon fs-18 lh-18" v-on:click="clickShowModify()">&#xe61d;</i> -->
                        </li>
                        <li class="item clearfix relative" v-on:click="clickItem(31)" >
                            <span class="text-l name" v-bind:class="[module==31?'curr':'']">配送方式设置</span>
                            <span v-bind:class="[module==31?'indexTags':'']"></span>
                        </li>
                        <li class="item clearfix relative" v-on:click="clickItem(32)" >
                            <span class="text-l name" v-bind:class="[module==32?'curr':'']">订水提示信息</span>
                            <span v-bind:class="[module==32?'indexTags':'']"></span>
                        </li>
                    </ul>
                </div>
                <div class="over-h">
                    <div class="pl-220" v-if="module==31">
                        <div class="pd-20 bgc-fff">
                            <div class="text-c mt-20">
                                <label class="col-4 text-r"><span class="c-red">*</span>配送方式：</label>
                                <div class="dp-ilb col-4" v-for="item in picktypes">
                                    <div class="check-box ml-10 mr-10">
                                        <input type="checkbox" id="{{item.id}}" v-model="selectedTypes" value="{{item.pick_type}}">
                                        <label for="{{item.id}}">{{item.type_name}}</label>
                                    </div>
                                </div>
                            </div>
                            <div class="text-c mt-20 mb-20">
                                <a class="btn btn-primary radius fs-12" title="保存" href="javascript:;" v-on:click="clickSaveTypes()">保存</a>
                            </div>
                        </div>
                    </div>
                    <div class="modulenoticeEdit pl-20" v-if="module==32" >
                        <div class="pr-20">
                            <input type="text" v-model="reservewaterModulenotice.title" placeholder="请填写提示标题" class="input-text radius">
                            <textarea name="" id="" cols="100" rows="30" class="textarea radius minh-300 mt-20" v-model="reservewaterModulenotice.content" placeholder="请填写提示信息"></textarea>
                            <div class="text-r">
                                <a class="btn btn-primary radius fs-12" title="其他反馈" href="javascript:;" v-on:click="clickSave(reservewaterModulenotice)">发布</a>
                            </div>
                        </div>
                        <div class="bgc-fff preview">
                            <div class="bor-9 radius minh-400">
                                <img src="../assets/images/waterorder_bg.png" class="w-250" alt="">
                                <div class="pd-10">
                                    <div>{{reservewaterModulenotice.title}}</div>
                                    <div class="fs-12 overf-a h-140">{{reservewaterModulenotice.content}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="m-loading" v-if="itemsLoading">
                        <div class="cube1"></div>
                        <div class="cube2"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<style lang="less">
    .indexTags{
        display: inline-block;
        width: 10px;
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        background-color: #206afc;
    }
    .modifyIcon{
        position: absolute;
        top: 22px;
        right: 16px;
        cursor: pointer;
    }
    .modulenoticeEdit{
        display: flex;
        justify-content: space-between;
    }
    .preview{
        width:300px;
        height: 400px;
        border-radius: 36px;
        border: 1px solid #666;
        padding: 36px 10px 36px 10px;
    }
</style>
<script>
    import * as base from '../assets/js/base.js';

    export default{
        ready(){
            let that = this;

            // this.queryAjax((tpageToal='4')=>{
            //    this.initPage('#J-page',tpageToal,materialsOps.param.page)
            // });
            
            this.getPicktypes();
            this.getReservewaterModulenotice();
        },
        data: function(){
            return{
                noData:false,
                itemsLoading:false,
                module: 31,
                picktypes: [
                    {
                        id:'picktype2',
                        type_name:'配送',
                        pick_type:2
                    },
                    {
                        id:'picktype1',
                        type_name:'自提',
                        pick_type:1
                    },
                ],
                selectedTypes: [],
                reservewaterModulenotice:{
                    title:'',
                    content:'',
                    id:'',
                }
            }
        },
        methods: {
            clickItem:function(module){
                this.module = module;
            },
            clickSaveTypes:function(){
                let that = this;
                if(this.selectedTypes.length == 0){
                    layer.msg('必须选择一种配送方式',{icon:2,time:1000});
                    return;
                }
                let ajaxData = {
                    pick_types: this.selectedTypes,
                }
                $.ajax({
                    url: base.gAjaxUrl.picktypesSet,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(ajaxData)
                })
                .always((data)=>{
                    base.ajaxCallback(data,()=>{
                        layer.msg('提交成功',{icon:1,time:1000});
                    })
                })
            },
            clickSave:function(item){
                let that = this;
                let ajaxUrl = '';
                let ajaxType = '';
                let ajaxData = {};
                if(item.id.length == 0){
                    ajaxType = 'POST';
                    if(item.content.length == 0){
                        layer.msg('请输入提示内容',{icon:2,time:1000});
                        return;
                    }else{
                        ajaxData = {
                            title: item.title,
                            content: item.content,
                            module: 4,
                        };
                        ajaxUrl = base.gAjaxUrl.modulenotice;
                    }
                }else{
                    ajaxType = 'PATCH';
                    ajaxData = {
                        title: item.title,
                        content: item.content,
                    }
                    ajaxUrl = `${base.gAjaxUrl.modulenotice}${item.id}/`
                }
                $.ajax({
                    url: ajaxUrl,
                    type: ajaxType,
                    data: ajaxData,
                })
                .always((data)=>{
                    base.ajaxCallback(data,()=>{
                        layer.msg('提交成功',{icon:1,time:1000});
                    });
                });
            },
            //获取配送方式列表
            getPicktypes:function(callback=function(){}){
                let that = this;
                $.ajax({
                    url: base.gAjaxUrl.picktypes,
                    type: 'GET',
                })
                .always((data)=>{
                    base.ajaxCallback(data,()=>{
                        this.itemsLoading = false;
                        let resultData = data;

                        if(resultData && resultData.length){
                            $.each(resultData,function(index,item){
                                that.selectedTypes.push(item.pick_type + '');
                            });

                        }
                    });
                })
            },
            //获取订水公告
            getReservewaterModulenotice:function(callback=function(){}){
                $.ajax({
                    url: base.gAjaxUrl.reservewaterModulenotice,
                    type: 'GET',
                })
                .always((data)=>{
                    if(!data.status){
                        this.reservewaterModulenotice.title = data.title;
                        this.reservewaterModulenotice.content = data.content;
                        this.reservewaterModulenotice.id = data.id;
                        //回调
                        //callback();
                    }
                })
            },
        },
        components: {
            
        }
    }
</script>