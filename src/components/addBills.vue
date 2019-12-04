<template>
<div class="layui-layer layui-anim layui-layer-page layui-modify">
    <div class="layui-layer-title">{{title}}</div>
    <div class="layui-layer-content">
        <form id="J-layer-form" class="form form-horizontal layui-layer-wrap">
            <div class="row cl">
                <label class="form-label f-l col-4 "><span class="c-red">*</span>计费单名称：</label>
                <div class="formControls f-l col-4">
                    <input v-model="billNameInput" type="text" class="input-text" value="" placeholder="" name="bill_name">
                </div>
            </div>
            <div class="row cl">
                <label class="form-label f-l col-4 "><span class="c-red">*</span>开始时间：</label>
                <div class="formControls f-l col-4">
                    <input v-model="billStartTime" id="billStartTime" type="text" class="input-text" value="" placeholder="" name="billStartTime">
                </div>
            </div>
            <div class="row cl">
                <label class="form-label f-l col-4"><span class="c-red">*</span>结束时间：</label>
                <div class="formControls f-l col-4">
                    <input v-model="billEndTime" id="billEndTime" type="text" class="input-text" value="" placeholder="" name="billEndTime">
                </div>
            </div>
            <div class="text-c mt-15" v-if='type=="add"'>
                <p>注意：1.添加计费单前请先添加宿舍；</p>
                <p>2.计费单创建后不可删除；</p>
                <p>3.添加新的计费单后，之前的计费单只能修改名称，请谨慎操作；</p>
            </div>
        </form>
    </div>
    <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
    <div class="layui-layer-btn" v-on:click="save"><a class="layui-layer-btn0" v-if="type!='check'">保存</a></div>
</div>
<div class="layui-layer-shade"></div>
<div class="m-loading" v-if="itemsLoading">
    <div class="cube1"></div>
    <div class="cube2"></div>
</div>
</template>

<style lang="less" scoped>
    .layui-layer.layui-layer-page .layui-layer-content {
        padding-bottom: 200px;
    }

</style>
<script type="text/ecmascript-6">
import * as base from '../assets/js/base.js';
import moment from 'moment';

    export default{
        ready () {
            let that = this;
            let ajaxUrl = '';
            let ajaxType = '';
            let getData = this.data;

            base.verticalCenter('.layui-modify');

            //类型判断
            if(this.type == 'add'){
                ajaxUrl = base.gAjaxUrl.bills;
                ajaxType = 'POST';
                this.itemsLoading = true;
                $.ajax({
                    url: base.gAjaxUrl.bills,
                    type: 'GET',
                    data: {page: 1, page_size: 2},
                }).always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
//                        console.log("data: ");
//                        console.log(data);
                        if(data && data.results && data.results.length) {
                            that.billStartTime = data.results[0].end_date ? moment(data.results[0].end_date).add(1, "day").format("YYYY-MM-DD") : moment().add(-1, "month").format("YYYY-MM-DD");
                            that.billEndTime = data.results[0].end_date ? moment(data.results[0].end_date).add(1, "day").endOf("month").format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
                            that.lastBillEndTime = that.billStartTime;
                        } else {
                            that.billStartTime = moment().add(-1, "month").format("YYYY-MM-DD");
                            that.billEndTime = moment().format("YYYY-MM-DD");
                            that.lastBillEndTime = that.billStartTime;
                        }
                    });
                });
            }else if(this.type == 'modify'){
                ajaxUrl = `${base.gAjaxUrl.bills}${getData.id}/`;
                ajaxType = 'PUT';
                this.billNameInput = getData.bill_name;
                this.billStartTime = (getData.start_date && typeof getData.start_date == "string") ? getData.start_date : "";
                this.billEndTime = (getData.end_date && typeof getData.end_date == "string") ? getData.end_date : "";
            }

            new Kalendae.Input("billStartTime", {
                months: 1,
//                subscribe: {
//                    'date-clicked': function (date) {
//                        if(new Date(date._i).getTime() < new Date(that.lastBillEndTime).getTime()) {
//                            layer.msg("开始时间不能小于上一张单的结束时间", {icon: 2, time: 1500});
//                            return false;
//                        }
//                    }
//                },
                clickHide: true
            });

            new Kalendae.Input("billEndTime", {
                months: 1,
                subscribe: {
                    'date-clicked': function (date) {
                        let start_date = $("#billStartTime").val();
                        if(new Date(date._i).getTime() < new Date(start_date).getTime()) {
                            layer.msg("结束时间不能早于开始时间", {icon: 2, time: 1500});
                            return false;
                        }
                    }
                },
                clickHide: true
            });

            //验证
            $('#J-layer-form').validate({
                rules: {
                    bill_name: {
                        required: true,
                    },
                    billStartTime: {
                        required: true,
                        dateISO:true
                    },
                    billEndTime: {
                        required: true,
                        dateISO:true
                    }
                },
                submitHandler:function() {
                    var obj = {
                        start_date: that.billStartTime,
                        end_date: that.billEndTime,
                        bill_name: that.billNameInput,
                    };
                    that.itemsLoading = true;
//                    console.log(obj);
                    $.ajax({
                        url: ajaxUrl,
                        type:ajaxType,
                        data: obj,
                    })
                    .always(function(data) {
                        that.itemsLoading = false;
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
                billNameInput: '',
                billStartTime: '',
                billEndTime: '',
                itemsLoading: false,
                lastBillEndTime: '',
            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            save:function(){
//                console.log(new Date(this.lastBillEndTime).getTime(), new Date(this.billStartTime).getTime());
//                if(this.type == 'add' && new Date(this.lastBillEndTime).getTime() > new Date(this.billStartTime).getTime()) {
//                    layer.msg("开始时间不能小于上一张单的结束时间", {icon: 2, time: 1500});
//                    return;
//                }
                if(this.type == 'add' && this.isDateWrong()) return;
                $('#J-layer-form').submit();
            },
            isDateWrong: function () {
                console.log("dates: ");
                let start_date = $("#billStartTime").val();
                let end_date = $("#billEndTime").val();
                console.log(start_date, end_date);
//                if(new Date(start_date).getTime() < new Date(this.lastBillEndTime).getTime()) {
//                    layer.msg("开始时间不能小于上一张单的结束时间", {icon: 2, time: 1500});
//                    return true;
//                } else if(new Date(end_date).getTime() < new Date(start_date).getTime()) {
                if(new Date(end_date).getTime() < new Date(start_date).getTime()) {
                    layer.msg("结束时间不能早于开始时间", {icon: 2, time: 1500});
                    return true;
                }
                return false;
            }
        },
        filters: {
            billTime: function (time) {
                return time || "--";
            }
        },
    }
</script>
