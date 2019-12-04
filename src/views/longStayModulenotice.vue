<template>
    <section class="Hui-article-box">
        <div class="page-container bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body">
                    <span class="f-20 fw-b">住宿信息设置</span>
                </div>
            </div>
            <div class="mt-10 clearfix">
                <div class="materialclasses bk-gray radius bgc-fff f-l">
                    <ul>
                        <li class="item clearfix relative">
                            <span class="fw-b fs-16">设置信息</span>
                            <!-- <i class="Hui-iconfont modifyIcon fs-18 lh-18" v-on:click="clickShowModify()">&#xe61d;</i> -->
                        </li>
                        <li class="item clearfix relative" v-on:click="clickItem(31)" >
                            <span class="text-l name" v-bind:class="[module==31?'curr':'']">{{applyModulenotice.title}}</span>
                            <!-- <span class="f-r ml-10" v-if="isShowModify">
                                <a class="modifyIcon" href="javascript:;" v-on:click="clickModifyTitle(applyModulenotice)"><i class="Hui-iconfont">&#xe6df;</i></a>
                            </span> -->
                            <span v-bind:class="[module==31?'indexTags':'']"></span>
                        </li>
                        <li class="item clearfix relative" v-on:click="clickItem(32)" >
                            <span class="text-l name" v-bind:class="[module==32?'curr':'']">{{checkinModulenotice.title}}</span>
                            <!-- <span class="f-r ml-10" v-if="isShowModify">
                                <a class="modifyIcon" href="javascript:;" v-on:click="clickModifyTitle(checkinModulenotice)"><i class="Hui-iconfont">&#xe6df;</i></a>
                            </span> -->
                            <span v-bind:class="[module==32?'indexTags':'']"></span>
                        </li>
                        <li class="item clearfix relative" v-on:click="clickItem(33)" >
                            <span class="text-l name" v-bind:class="[module==33?'curr':'']">{{checkoutModulenotice.title}}</span>
                            <!-- <span class="f-r ml-10" v-if="isShowModify">
                                <a class="modifyIcon" href="javascript:;" v-on:click="clickModifyTitle(checkoutModulenotice)"><i class="Hui-iconfont">&#xe6df;</i></a>
                            </span> -->
                            <span v-bind:class="[module==33?'indexTags':'']"></span>
                        </li>
                    </ul>
                </div>
                <div class="over-h">
                    <div class="modulenoticeEdit pl-20" v-if="module==31">
                        <div class="pr-20">
                            <input type="text" v-model="applyModulenotice.title" placeholder="请填写提示标题（此消息将在员工端“宿舍申请”状态界面进行展示）" class="input-text radius">
                            <textarea name="" cols="100" rows="30" class="textarea radius minh-300 mt-20" v-model="applyModulenotice.content" placeholder="请填写提示信息"></textarea>
                            <div class="text-r">
                                <a class="btn btn-primary radius fs-12" title="其他反馈" href="javascript:;" v-on:click="clickUnpub(applyModulenotice)">取消发布</a>
                                <a class="btn btn-primary radius fs-12" title="其他反馈" href="javascript:;" v-on:click="clickSave(applyModulenotice)">发布</a>
                            </div>
                        </div>
                        <div class="bgc-fff preview">
                            <div class="bor-9 radius minh-400">
                                <img src="../assets/images/apply_bg.png" class="w-250" alt="">
                                <div class="pd-10">
                                    <div>{{applyModulenotice.title}}</div>
                                    <div class="fs-12 overf-a h-140 w-230">{{applyModulenotice.content}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modulenoticeEdit pl-20" v-if="module==32" >
                        <div class="pr-20">
                            <input type="text" v-model="checkinModulenotice.title" placeholder="请填写提示标题（此消息将在员工端“待入住”状态界面进行展示）" class="input-text radius">
                            <textarea name="" cols="100" rows="30" class="textarea radius minh-300 mt-20" v-model="checkinModulenotice.content" placeholder="请填写提示信息"></textarea>
                            <div class="text-r">
                                <a class="btn btn-primary radius fs-12" title="其他反馈" href="javascript:;" v-on:click="clickUnpub(checkinModulenotice)">取消发布</a>
                                <a class="btn btn-primary radius fs-12" title="其他反馈" href="javascript:;" v-on:click="clickSave(checkinModulenotice)">发布</a>
                            </div>
                        </div>
                        <div class="bgc-fff preview">
                            <div class="bor-9 radius minh-400">
                                <img src="../assets/images/checkin_bg.png" class="w-250" alt="">
                                <div class="pd-10">
                                    <div>{{checkinModulenotice.title}}</div>
                                    <div class="fs-12 overf-a h-170 w-230">{{checkinModulenotice.content}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modulenoticeEdit pl-20" v-if="module==33" >
                        <div class="pr-20">
                            <input type="text" v-model="checkoutModulenotice.title" placeholder="请填写提示标题（此消息将在员工端“待退宿”状态界面进行展示）" class="input-text radius">
                            <textarea name="" cols="100" rows="30" class="textarea radius minh-300 mt-20" v-model="checkoutModulenotice.content" placeholder="请填写提示信息"></textarea>
                            <div class="text-r">
                                <a class="btn btn-primary radius fs-12" title="其他反馈" href="javascript:;" v-on:click="clickUnpub(checkoutModulenotice)">取消发布</a>
                                <a class="btn btn-primary radius fs-12" title="其他反馈" href="javascript:;" v-on:click="clickSave(checkoutModulenotice)">发布</a>
                            </div>
                        </div>
                        <div class="bgc-fff preview">
                            <div class="bor-9 radius minh-400">
                                <img src="../assets/images/checkout_bg.png" class="w-250" alt="">
                                <div class="pd-10">
                                    <div>{{checkoutModulenotice.title}}</div>
                                    <div class="fs-12 overf-a h-170 w-230">{{checkoutModulenotice.content}}</div>
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
            //this.getBuildingsList();
            //this.getRoomTypesList();
            this.getApplyModulenotice();
            this.getCheckinModulenotice();
            this.getCheckoutModulenotice();
        },
        data: function(){
            return{
                noData:false,
                itemsLoading:false,
                module: 31,
                applyModulenotice: {
                    title: '申请提示',
                    content: '',
                    id: '',
                },
                checkinModulenotice: {
                    title: '入住提示',
                    content: '',
                    id: '',
                },
                checkoutModulenotice: {
                    title: '退宿提示',
                    content: '',
                    id: '',
                },
            }
        },
        methods: {
            clickItem:function(module){
                this.module = module;
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
                            module: this.module,

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
                ajaxData.has_pub = true;
                $.ajax({
                    url: ajaxUrl,
                    type: ajaxType,
                    data: ajaxData,
                })
                .always((data)=>{
                    base.ajaxCallback(data,()=>{
                        layer.msg('提交成功',{icon:1,time:1000});
                        if(data.module == 31){
                            that.applyModulenotice.title = data.title;
                            that.applyModulenotice.id = data.id;
                            that.applyModulenotice.content = data.content;
                        }else if(data.module == 32){
                            that.checkinModulenotice.title = data.title;
                            that.checkinModulenotice.id = data.id;
                            that.checkinModulenotice.content = data.content;
                        }else if(data.module == 33){
                            that.checkoutModulenotice.title = data.title;
                            that.checkoutModulenotice.id = data.id;
                            that.checkoutModulenotice.content = data.content;
                        }
                    });
                });
            },
            clickUnpub: function(item){
                if(item.id.length == 0){
                    return;
                }
                let that = this;
                let ajaxType = 'GET';
                let ajaxUrl = `${base.gAjaxUrl.modulenotice}${item.id}/un_pub/`;
                $.ajax({
                    url: ajaxUrl,
                    type: ajaxType,
                })
                .always((data)=>{
                    base.ajaxCallback(data,()=>{
                        layer.msg('提交成功',{icon:1,time:1000});
                    });
                });
            },
            //获取入住申请公告
            getApplyModulenotice:function(callback=function(){}){
                $.ajax({
                    url: base.gAjaxUrl.applyModulenotice,
                    type: 'GET',
                })
                .always((data)=>{
                    if(!data.status){
                        this.applyModulenotice.title = data.title;
                        this.applyModulenotice.content = data.content;
                        this.applyModulenotice.id = data.id;
                    }
                })
            },
            //获取入住公告
            getCheckinModulenotice:function(callback=function(){}){
                $.ajax({
                    url: base.gAjaxUrl.checkinModulenotice,
                    type: 'GET',
                })
                .always((data)=>{
                    if(!data.status){
                        this.checkinModulenotice.title = data.title;
                        this.checkinModulenotice.content = data.content;
                        this.checkinModulenotice.id = data.id;
                        //回调
                        //callback();
                    }
                })
            },
            //获取退宿公告
            getCheckoutModulenotice:function(callback=function(){}){
                $.ajax({
                    url: base.gAjaxUrl.checkoutModulenotice,
                    type: 'GET',
                })
                .always((data)=>{
                    if(!data.status){
                        this.checkoutModulenotice.title = data.title;
                        this.checkoutModulenotice.content = data.content;
                        this.checkoutModulenotice.id = data.id;
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