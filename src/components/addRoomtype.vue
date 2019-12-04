<template>
<div class="layui-layer layui-anim layui-layer-page layui-modify">
    <div class="layui-layer-title">{{title}}</div>
    <div class="layui-layer-content">
        <form id="J-layer-form" class="form form-horizontal layui-layer-wrap">
            <div class="row cl">
                <label class="form-label f-l col-4 "><span class="c-red">*</span>房间类型：</label>
                <div class="formControls f-l col-4">
                    <input v-model="typeNameInput" type="text" class="input-text" value="" placeholder="" name="type_name" maxlength="10">
                </div>
            </div>
            <div class="row cl">
                <label class="form-label f-l col-4 "><span class="c-red">*</span>床位：</label>
                <div class="formControls f-l col-4">
                    <input v-model="bedNumInput" type="text" class="input-text" value="" placeholder="" name="bed_num">
                </div>
            </div>
            <div class="row cl">
                <label class="form-label f-l col-4 "><span class="c-red">*</span>容纳人数：</label>
                <div class="formControls f-l col-4">
                    <input v-model="contentInput" type="text" class="input-text" value="" placeholder="" name="content">
                </div>
            </div>

            <div class="row cl">
                <label class="form-label f-l col-4 ">配置：</label>
                <div class="formControls f-l col-4">
                    <!--<input v-model="employee_tag" type="text" class="input-text" value="" placeholder="" name="employee_tag">-->
                    <div class="tag_container relative">
                        <div class="tag_item_list clearfix">
                            <div v-for="item in tagsArr" class="tag_item f-l relative" track-by="$index">
                                <div>{{item.name}}</div>
                                <span @click="deleteTag(item)">x</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row cl">
                <div class="formControls f-l col-4 col-offset-4">
                    <div class="whole_tag_container">
                        <div class="tag_item_list clearfix">
                            <div @click="addTag(item)" v-for="item in tag_arr" class="tag_item f-l" title="{{item.name}}">{{item.name}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
    <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
    <div class="layui-layer-btn" v-on:click="save"><a class="layui-layer-btn0" v-if="type!='check'">保存</a></div>
</div>
<div class="layui-layer-shade"></div>
</template>

<style lang="less" scoped rel="stylesheet/less">
    .tag_item_list {
        width: 100%;
        box-sizing: border-box;
        z-index: 2;
        min-height: 40px;
        padding: 3% 3% 6%;
        border-radius: 5px;
        border: 1px solid #ccc;
        background-color: #fff;
        .tag_item {
            /*width: 80px;*/
            width: 28%;
            color: #eee;
            font-size: 14px;
            line-height: 25px;
            margin-left: 3%;
            margin-top: 3%;
            border-radius: 5px;
            background-color: #ff9542;
            text-align: center;
            position: relative;
            cursor: pointer;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding: 0 5px;
            box-sizing: border-box;
            &:hover {
                white-space: normal;
            }
            p {
                width: 100%;
                height: 100%;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            span {
                position: absolute;
                width: 16px;
                height: 16px;
                text-align: center;
                line-height: 12px;
                font-size: 12px;
                border-radius: 50%;
                background-color: #000;
                color: #fff;
                top: -5px;
                right: -5px;
                cursor: pointer;
            }
        }
    }
    
</style>
<script>
import * as base from '../assets/js/base.js';

    export default{
        ready () {
            let that = this;



            base.verticalCenter('.layui-modify');
            this.getList();
            //类型判断
            // setTimeout(function () {


            // },400)


            $.validator.addMethod('signlessInteger',function(value, element){
                var length = value.length;  
                var reg = /^[1-9]\d*$/; 
                return this.optional(element) || reg.test( value );
            },'请输入正整数');


        },
        props: ['title','type','data'],
        data:function(){
            return {
                typeNameInput:'',
                bedNumInput:'',
                contentInput:'',
                tvInput: false,
                computerInput: false,
                tagsArr:[],
                tag_arr:[],

            }
        },
        methods: {
            getList:function () {
                let that = this;
              $.ajax({
                    url:`${base.gAjaxUrl.roomequipments}`,
                    type:"GET",
                    data:{
                        page:1,
                        page_size:999999,
                    }
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
                            that.tag_arr = data.results;
                            that.checkType();
                    })
                })
            },
            checkType:function () {
                let that = this;
                let getData = this.data;
                let ajaxUrl = '';
                let ajaxType = '';
                if(that.type == 'add'){
                    ajaxUrl = base.gAjaxUrl.roomtypes;
                    ajaxType = 'POST';
                }else if(that.type == 'modify'){
                    ajaxUrl = `${base.gAjaxUrl.roomtypes}${getData.id}/`;
                    ajaxType = 'PUT';
                    that.typeNameInput = getData.type_name;
                    that.bedNumInput = getData.bed_num;
                    that.contentInput = getData.content;
                    if(getData.equipments){
                        for (var i = 0,len = that.tag_arr.length; i < len; i++) {
                            for (var j = 0,leng = getData.equipments.length; j < leng; j++) {
                                if(that.tag_arr[i].id == getData.equipments[j].id){
                                    that.tagsArr.push(that.tag_arr[i]);
                                }
                            }

                        }

                    }
                }

                //验证
                $('#J-layer-form').validate({
                    rules: {
                        type_name: {
                            required: true,
                        },
                        bed_num: {
                            required: true,
                            signlessInteger: true,
                        },
                        content: {
                            required: true,
                            signlessInteger: true,
                        },
                    },
                    submitHandler:function() {
                        let idArr = [];
                        for (var i = 0,len = that.tagsArr.length; i < len; i++) {
                            idArr.push(that.tagsArr[i].id);
                        }
                        $.ajax({
                            url: ajaxUrl,
                            type:ajaxType,
                            contentType:"application/json",
                            data:JSON.stringify({
                                type_name: that.typeNameInput,
                                bed_num: that.bedNumInput,
                                content: that.contentInput,
                                equipment_set:idArr,
                                // has_air_conditioning: that.airConditioningInput,
                                // has_TV: that.tvInput,
                                // has_computer: that.computerInput,
                            },)
                        })
                            .always(function(data) {
                                base.ajaxCallback(data,function(){
                                    layer.msg('提交成功',{icon:1,time:1000});
                                    that.$dispatch('dialog-save');
                                });
                            });

                    }
                });

            },
            close:function(){
                this.$dispatch('dialog-close');
            },
            save:function(){
                $('#J-layer-form').submit();
            },
            deleteTag: function (para) {
                this.tagsArr.splice(this.tagsArr.indexOf(para), 1);
            },
            addTag: function (para) {
                if(this.tagsArr.indexOf(para) == -1) {
                    this.tagsArr.push(para)
                }
            }
        }
    }
</script>
