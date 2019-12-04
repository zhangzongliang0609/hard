<template>
<div class="layui-layer layui-anim layui-layer-page layui-modify">
    <div class="layui-layer-title">{{title}}</div>
    <div class="layui-layer-content">
        <form id="J-layer-form" class="form form-horizontal layui-layer-wrap">
            <div class="row cl">
                <label class="form-label f-l col-4 "><span class="c-red">*</span>类型名称：</label>
                <div class="formControls f-l col-4">
                    <input v-model="faultNameInput" type="text" class="input-text" value="" placeholder="" name="fault_name" maxlength="10">
                </div>
            </div>
        </form>
    </div>
    <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
    <div class="layui-layer-btn">
        <a class="layui-layer-btn0" v-if="type!='check'" v-on:click="save">确认</a>
        <a class="layui-layer-btn0" v-if="type=='add'" v-on:click="saveAndAdd">确认并继续添加</a>
    </div>
</div>
<div class="layui-layer-shade"></div>
</template>

<style lang="less">

</style>
<script>
import * as base from '../assets/js/base.js';

    export default{
        ready () {
            let that = this;
            let ajaxUrl = '';
            let ajaxType = '';
            let ajaxData = {};
            let getData = this.data;

            base.verticalCenter('.layui-modify');

            //类型判断
            if(this.type == 'add'){
                ajaxUrl = base.gAjaxUrl.faultitems;
                ajaxType = 'POST';
            }else if(this.type == 'modify'){
                ajaxUrl = `${base.gAjaxUrl.faultitems}${getData.id}/`;
                ajaxType = 'PATCH';
                this.faultNameInput = getData.fault_name;
            }

            //验证
            $('#J-layer-form').validate({
                rules: {
                    fault_name: {
                        required: true,
                    },
                },
                submitHandler:function(callback=function(){}) {
                    if(that.type == 'add'){
                        if(getData.faultType == 'firstItem'){
                            ajaxData = {
                                fault_name: that.faultNameInput,
                                father_item: '',
                            }
                        }else if(getData.faultType == 'secondItem'){
                            ajaxData = {
                                fault_name: that.faultNameInput,
                                father_item: getData.id,
                            }
                        }
                        
                    }else if(that.type == 'modify'){
                        if(getData.faultType == 'firstItem'){
                            ajaxData = {
                                fault_name: that.faultNameInput,
                                subclass: false
                            }
                        }else if(getData.faultType == 'secondItem'){
                            ajaxData = {
                                fault_name: that.faultNameInput,
                                subclass: true
                            }
                        }
                    }
                    $.ajax({
                        url: ajaxUrl,
                        contentType: 'application/json',
                        type:ajaxType,
                        data: JSON.stringify(ajaxData),
                    })
                    .always(function(data) {
                        base.ajaxCallback(data,function(){
                            layer.msg('提交成功',{icon:1,time:1000});
                            if(that.saveType == 1){
                                that.$dispatch('dialog-save-add');
                                that.faultNameInput = '';
                            }else if(that.saveType == 0){
                                that.$dispatch('dialog-save');
                            }
                        });
                    });
                }
            });
        },
        props: ['title','type','data'],
        data:function(){
            return {
                saveType: -1, // 保存类型 0 => 保存关闭 1 => 保存并继续添加
                faultNameInput:'',
            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            save:function(){
                this.saveType = 0;
                $('#J-layer-form').submit();
            },
            saveAndAdd:function(){
                this.saveType = 1;
                $('#J-layer-form').submit();
            }
        }
    }
</script>
