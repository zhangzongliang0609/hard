<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">订单详情</div>
        <div class="layui-layer-content layui-layer-order-wrap">
            <div class="row cl">
                <div class="col-5 f-l text-c">申请人</div>
                <div class="col-5 f-l text-c"></div>
            </div>
        </div>
    <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close"></a>
    </span>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<script type="text/ecmascript-6">
    import * as base from '../../assets/js/base.js';
    import tags from './setTags'
    export default{
        ready () {
            this.getTagList();
            let getData = JSON.parse(JSON.stringify(this.data));
            let id = getData.order_id ? getData.order_id : getData.id;
            $.ajax({
                url: `${base.gAjaxUrl.officialcarorders}${id}/`,
                type: 'GET',
            }).always((data)=> {
                this.items = data;
                this.items.is_carpool = this.items.is_carpool ? '是' : '否';
                this.items.is_urgent = this.items.is_urgent ? '是' : '否';
            });
            this.tagsArr = getData.tags;
        },
        props: ['data'],
        data: function () {
            return {
                noData: false,
                items: {
                    is_carpool: '',
                    is_urgent: '',
                },
                orderData: [{cost_name: "过桥费", price: 1000, operator: '小明'}],
                tagsArr: [],
                wTagsArr: [],
            }
        },
        methods: {
            close: function () {
                this.$dispatch('order-dialog-close');
            },
            isUrgent: function (data) {
                if (data) {
                    return '<span class="red">是</span>';
                } else {
                    return '否';
                }
            },
            getTagList: function () {
                this.itemsLoading = true;
                // 3代表大巴车,4代表公务车
                $.ajax({
                    url: base.gAjaxUrl.tagGroup,
                    type: 'GET',
                    data: {
                        type: 4,
                        page: 1,
                        page_size: 999999,
                        flag: 'tag_offorder'
                    }
                }).always((data)=> {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=> {
                        this.wTagsArr = data.results || [];
                    });
                });
            },
            getTagIds: function (tagArr) {
                let arr = [];
                for (let i = 0, len = tagArr.length; i < len; i++) {
                    arr.push(tagArr[i].id);
                }
                return arr;
            },
            save: function () {
                let id = this.data.order_id ? this.data.order_id : this.data.id;
                let ajaxData = {
                    tags_set: this.getTagIds(this.tagsArr)
                }
                $.ajax({
                    url: `${base.gAjaxUrl.officialcarorders}${id}/`,
                    type: 'PATCH',
                    contentType: 'application/json',
                    data: JSON.stringify(ajaxData)
                }).always((data)=> {
                    base.ajaxCallback(data, ()=> {
                        this.$dispatch('dialog-save')
                    })
                })
            }
        },
        components: {
            tags: tags,
        }
    }
</script>
<style lang="less" scoped rel="stylesheet/less">


</style>
