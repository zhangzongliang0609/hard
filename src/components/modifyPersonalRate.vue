<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">个人费率设置【{{member.real_name}}】</div>
        <div class="layui-layer-content">
            <form id="J-layer-form" class="form form-horizontal layui-layer-wrap mPersonalRateForm" >
                <div class="row cl" track-by="$index" v-for="item in fees">
                    <div class="f-l col-4 col-offset-1 tr rateName lh-30">
                        <span class="c-red">*</span>
                        {{item.name}}
                    </div>
                    <div class="f-l col-3 pl-20">
                        <input type="number" class="ratesInput" v-bind:value="item.id | getPoint" feetype="{{item.id}}" placeholder="" name="{{'name' + item.id}}">
                    </div>
                    <div class="f-l col-3 tl rateNumber lh-30">
                        <span>%</span>
                    </div>
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
<style lang="less" scoped>
    .layui-modify {
        width: 500px;
    }
    .rateName {
        box-sizing: border-box;
        padding-right: 10px !important;
    }
    .rateNumber {
        box-sizing: border-box;
        padding-left: 10px !important;
    }
    .ratesInput {
        width: 100%;
        font-size: 14px;
        height: 31px;
        line-height: 1.42857;
        padding: 4px;
        box-sizing: border-box;
        border: solid 1px #ddd;
    }
    .tl {
        text-align: left;
    }
    .tr {
        text-align: right;
    }
</style>
<style>
    .mPersonalRateForm label.error {
        right: 10px !important;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    export default{
        ready () {

            let that = this;
            let ajaxUrl = base.gAjaxUrl.setFee;
            let ajaxType = 'POST';
            let getData = this.data;
//            console.log("getData: ");
//            console.log(this.member);
//            console.log(this.fees);
            this.rates = this.member.staff_fees;

            base.verticalCenter('.layui-modify');

            // 两位小数验证
            $.validator.addMethod("plus_number", function(value, element, param) {
                return value * 1 >= 0 && /^\d+$/.test(value);
            }, $.validator.format("请输非负整数"));

                // 动态添加 表单fees属性的验证规则
                var rules = {};
                for(let i = 0, len = this.fees.length; i < len; i++) {
                    rules['name' + this.fees[i].id] = {
                        plus_number: true,
                    }
                }
//                console.log("rules: ");
//                console.log(rules);
                //验证
                $('#J-layer-form').validate({
                    rules: rules,
                    submitHandler:function() {
                        that.itemsLoading = true;
                        let valArr = [];
                        $.each($(".ratesInput"), function (i, item) {
//                            console.log($(item).attr("name"));
                            let $this = $(item);
                            valArr.push({
                                feetype: $this.attr("feetype"),
                                point: $this.val(),
                            })
                        });
//                        console.log(valArr);
                        $.ajax({
                            url: ajaxUrl,
                            type:ajaxType,
                            contentType: "application/json",
                            data: JSON.stringify({
                                data:[{
                                    staff: that.member.staff,
                                    fee_items: valArr,
                                }]
                            })
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

        props: ['member', 'fees'],
        data:function(){
            return {
                rates: [],
                itemsLoading: false,
            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            save:function(){
                layer.confirm(`确认保存对【${this.member.real_name}】的费率修改`, function (index) {
                    $('#J-layer-form').submit();
                    layer.close(index);
                });
            },
        },
        filters: {
            getPoint: function (id) {
//                console.log(id)
                if(id) {
                    for(let i = 0, len = this.rates.length;i < len;i++) {
                        if(this.rates[i].feetype === id) {
                            return this.rates[i].point;
                        }
                    }
                    return "100";
                } else {
                    return "100";
                }
            }
        }
    }
</script>
