<template>
<div class="layui-layer layui-anim layui-layer-page layui-modify">
    <div class="layui-layer-title">{{title}}</div>
    <div class="layui-layer-content">
        <form id="J-layer-form" class="form form-horizontal layui-layer-wrap">
            <div class="row cl">
                <label class="form-label f-l col-4 "><span class="c-red">*</span>房间类型：</label>
                <div class="formControls f-l col-5">
                    <span class="select-box">
                        <select v-model="roomTypeInput" name="roomTypeInput" class="select">
							<option value="" v-if="!data.length"></option>
                            <option v-for="item in data" value="{{item.id}}">{{item.type_name}}</option>
                        </select>
                    </span>
                </div>
            </div>
            <div class="row cl">
                <label class="form-label f-l col-4 "><span class="c-red">*</span>等级：</label>
                <div class="formControls f-l col-2">
                    <input v-model="lowLevelInput" type="text" class="input-text" value="" placeholder="" name="low_level">
                </div>
                <div class="f-l col-1 text-c">至</div>
                <div class="formControls f-l col-2">
                    <input v-model="highLevelInput" type="text" class="input-text" value="" placeholder="" name="high_level">
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

<style lang="less">
    .floor{
        position: relative;
    }
    .floor span{
        position: absolute;
        top: 4px;
        right: -22px;
    }
</style>
<script>
import * as base from '../assets/js/base.js';

    export default{
        ready () {

            console.log(this.data);
            let that = this;
            let ajaxUrl = '';
            let ajaxType = '';
            let getData = this.data;
            if(getData.length) {
                this.roomTypeInput = getData[0].id;
			} else {
                layer.msg('请先在【宿舍管理】>【房间类型管理】中设定房间类型', {icon: 1, time: 5000});
                return;
            }

            base.verticalCenter('.layui-modify');


            $.validator.addMethod('signlessInteger',function(value, element){
                var length = value.length;
                var reg = /^[1-9]\d*$/;
                return this.optional(element) || reg.test( value );
            },'请输入正整数');
            $.validator.addMethod('highLevel',function(value, element){
                var length = value.length;
                var low_level = parseInt($('input[name="low_level"]').val());
                console.log(low_level);
                return this.optional(element) || value > low_level;
            },'必须大于前一个岗级');

            //验证
            $('#J-layer-form').validate({
                rules: {
                    low_level: {
                       required: true,
                       signlessInteger: true,
                    },
                    high_level: {
                       required: true,
                       signlessInteger: true,
                       highLevel: true,
                    },
					roomTypeInput: {
						required: true,
					}
                },
                submitHandler:function() {
                    $.ajax({
                        url: base.gAjaxUrl.applyroomrules,
                        type: 'POST',
                        data: {
                            room_type: that.roomTypeInput,
                            low_level: that.lowLevelInput,
                            high_level: that.highLevelInput,
                        },
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
        props: ['title','type','data'],
        data:function(){
            return {
                roomTypeInput: '',
                lowLevelInput: '',
                highLevelInput: '',
            }
        },
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
