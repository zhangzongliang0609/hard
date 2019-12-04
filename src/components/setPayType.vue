<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">{{title}}</div>
        <div class="layui-layer-content">
            <div class="text-c">选择支付方式</div>
            <div class="text-c mt-10 no-selected">
                <div class="check-box ml-10 mr-10" v-for="item in items" :class="{'selected': isSelected(item)}" @click="switchTypes(item)">
                    {{item.type_name}}
                </div>
            </div>
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

<style lang="less" scoped rel="stylesheet/less">
    .check-box {
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 4px 8px;
        &.selected {
            border-color: #0099ff;
            background-color: #0099ff;
            color: #fff;
        }
    }
</style>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';

    export default{
        ready () {
            this.getPayTypes(this.data);
        },
        props: ['title', 'type', 'data'],
        data: function () {
            return {
                itemsLoading: false,
                items: [
                    // {
                    //     id: 'pay_type1',
                    //     type_name: '支付宝',
                    //     pay_type: 1
                    // },

                    {
                        id: 'pay_type2',
                        type_name: '微信',
                        pay_type: 2
                    },
                    {
                        id: 'pay_type3',
                        type_name: '现金',
                        pay_type: 3
                    },
                    {
                        id: 'pay_type4',
                        type_name: '代缴代扣',
                        pay_type: 4
                    },
                ],
                selectedTypes: [],
                //floorNumInput:'',
            }
        },
        methods: {
            close: function () {
                this.$dispatch('dialog-close');
            },
            save: function () {
                let that = this;
                if (this.selectedTypes.length == 0) {
                    layer.msg('必须选择一种支付方式', {icon: 2, time: 1000});
                    return;
                }
                let ajaxData = {
                    module: this.data,
                    pay_types: this.getPayTypeIds(),
                };
                $.ajax({
                    url: `${base.gAjaxUrl.paytypes}bulk_set/`,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(ajaxData)
                }).always((data)=> {
                    base.ajaxCallback(data, ()=> {
                        this.$dispatch('dialog-close');
                        layer.msg('提交成功', {icon: 1, time: 1000});
                    })
                })
            },
            getPayTypeIds: function () {
                let arr = [];
                this.selectedTypes.forEach((item, i) => {
                    arr.push(item.pay_type);
                });
                return arr
            },
            getPayTypes: function (data) {
                this.itemsLoading = true;
                $.ajax({
                    url: base.gAjaxUrl.paytypes,
                    type: 'GET',
                    data: {
                        module: data
                    }
                }).always((data)=> {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=> {
                        this.selectedTypes = data.results;
                    });
                })
            },
            switchTypes: function (item) {
                for(let i = 0, len = this.selectedTypes.length; i < len; i++) {
                    if(this.selectedTypes[i].pay_type == item.pay_type) {
                        this.selectedTypes.splice(i, 1);
                        return
                    }
                }
                this.selectedTypes.push(item)
            },
            isSelected: function (item) {
                for(let i = 0, len = this.selectedTypes.length; i < len; i++) {
                    if(this.selectedTypes[i].pay_type == item.pay_type) {
                        return true
                    }
                }
                return false
            }
        },
    }
</script>
