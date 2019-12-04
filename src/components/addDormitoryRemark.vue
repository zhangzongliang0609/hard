<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">编辑备注信息 [{{data.building_name}} - {{data.room_no}} - {{data.room_type_name}} - {{data.real_name}}]</div>
        <div class="layui-layer-content">
            <form id="J-layer-form" class="form form-horizontal layui-layer-wrap">
                <div class="dormitory_remark_box clearfix">
                    <div class="w-110 f-l tr">备注信息：</div>
                    <textarea id="remark" v-model="remark" type="text" class="dormitory_remark f-l ml-10" placeholder="备注信息（50字符以内）" name="remark" ></textarea>
                </div>
            </form>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
        </span>
        <div id="save" class="layui-layer-btn" v-on:click="save"><a class="layui-layer-btn0">保存</a></div>
    </div>
    <div class="layui-layer-shade"></div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>
<style  lang="less" scoped>
    .dormitory_remark_box {
        width: 450px;
        margin: 0 auto;
    }
    .dormitory_remark {
        width: 260px;
        height: 90px;
        padding: 10px 10px;
        line-height: 25px;
    }
</style>
<script>
    import * as base from '../assets/js/base.js';
    export default{
        ready () {

            let that = this;

            base.verticalCenter('.layui-modify');
            $("#remark").val(this.data.remark || "");

            //验证
            $('#J-layer-form').validate({
                rules: {
                    remark: {
//                        required: true,
                        maxlength: 50,
                    }
                },
                submitHandler:function() {
                    that.itemsLoading = true;
                    $.ajax({
                        url: `${base.gAjaxUrl.feeRemark}${that.data.id}/modify_remark/`,
                        type: 'POST',
                        data: {
                            remark: $("#remark").val()
                        }
                    }).always(function(data) {
                        that.itemsLoading = false;
                        base.ajaxCallback(data,function(){
                            layer.msg('提交成功',{icon:1,time:1000});
                            that.$dispatch('dialog-save');
                        });
                    });
                }
            });

        },
        props: ['data'],
        data:function(){
            return {
                remark:'',
                itemsLoading: false,
            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            save:function(){
                $('#J-layer-form').submit();
            },
        }
    }
</script>
