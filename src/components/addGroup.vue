<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify building-box">
        <div class="layui-layer-title">{{title}}</div>
        <div class="layui-layer-content">
            <form id="J-layer-form" class="form form-horizontal layui-layer-wrap">
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>分组名称：</label>
                    <div class="formControls f-l col-6">
                        <input v-model="groupName" type="text" class="input-text" value="" placeholder="" name="groupName">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">是否启用：</label>
                    <div class="formControls f-l col-6">
                        <select name="" class="select-box" id="" v-model="isStart">
                            <option value="1">是</option>
                            <option value="0">否</option>
                        </select>
                    </div>
                </div>
            </form>
        </div>
        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>

        <div class="layui-layer-btn pt-20" v-on:click="save">
            <a class="layui-layer-btn0">保存</a>
        </div>
    </div>
    <div class="layui-layer-shade"></div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>

<style lang="less"  rel="stylesheet/less" scoped>
    .building-box{
        width: 400px;
        margin-left: -200px !important;
    }
</style>
<script>
    import * as base from '../assets/js/base.js';
    export default{
        ready () {
            let that = this;
            let ajaxType = 'POST';
            let ajaxUrl = `${base.gAjaxUrl.tagGroup}`;
            if(this.type == 'add'){

            }else{
                ajaxUrl += this.data.id;
                ajaxType = 'PATCH';
                this.groupName = this.data.name;
                this.isStart = this.data.is_active?1:0;
            }
            base.verticalCenter('.layui-modify');
            $('#J-layer-form').validate({
                rules: {
                    groupName: {
                        required: true,
                    },
                },
                submitHandler:function() {
                    that.itemsLoading = true;
                    $.ajax({
                        url: ajaxUrl,
                        type:ajaxType,
                        contentType: 'application/json',
                        data: JSON.stringify({
                            type:that.source,
                            name: $.trim(that.groupName),
                            is_active:that.isStart
                        }),
                    }).always(function(data) {
                        that.itemsLoading = false;
                        base.ajaxCallback(data,function(){
                            layer.msg('提交成功',{icon:1, time:1000});
                            that.$dispatch('dialog-save');
                        });
                    });
                }
            });
        },
        data:function(){
            return {
                groupName:'',
                itemsLoading:'',
                isStart:1,
            }
        },
        props:['data','source','title','type'],
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            save:function(){
                $('#J-layer-form').submit();
            }
        }
    }
</script>