<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">选择管理员</div>
        <div class="layui-layer-content pd-20">
            <div class="layui-layer-wrap">
                <table class="table table-border table-bordered table-hover table-bg table-sort row">
                    <thead>
                    <tr class="text-c">
                        <th width="25">选择</th>
                        <th width="70">姓名</th>
                        <th width="100">电话</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="text-c" v-for="item in items">
                        <td>
                            <input type="checkbox" :checked="item.bus_module" class="radio-wh"
                                   @click="item.bus_module = !item.bus_module">
                        </td>
                        <td>{{item.user_name}}</td>
                        <td>{{item.phone}}</td>
                    </tr>
                    </tbody>
                </table>
                <div id="J-page" class="m-page row" v-show="!noData"></div>
                <div class="no-data text-c mt-50 row" v-if="noData">没有相关数据</div>
            </div>
        </div>
    <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
        <div class="layui-layer-btn" v-on:click="save"><a class="layui-layer-btn0">保存</a>
        </div>
    </div>
    <div class="layui-layer-shade"></div>
</template>

<style lang="less" scoped>
    .avatar {
        width: 50px;
    }

    .radio-wh {
        width: 20px;
        height: 20px;
        cursor: pointer;
    }
    .layui-modify {
        top: 50px;
        z-index: 201;
    }
    .layui-layer-shade {
        z-index: 200;
    }
</style>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';

    export default{
        ready () {
            base.verticalCenter('.layui-modify');
            this.getList();
        },
        props: [],
        data: function () {
            return {
                noData: false,
                items: [],
            }
        },
        methods: {
            //获取列表
            getList: function () {
                $.ajax({
                    url: base.gAjaxUrl.busnoticemanager + 'admin_list/',
                    type: 'GET',
                    data: {
                        page: 1,
                        page_size: 999999
                    }
                }).always((data)=> {
                    base.ajaxCallback(data, ()=> {
                        let resultData = data.results;
                        this.items = resultData;
                        if (resultData.length) {
                            this.noData = false;
                            //回调
                            callback(data.num_pages, data.count);
                        } else {
                            this.noData = true;
                        }
                    });
                })
            },
            close: function () {
                this.$dispatch('dialog-close');
            },
            save: function () {
                let admins = [];
                this.items.forEach((item) => {
                    if(item.bus_module) admins.push(item.id);
                });
                $.showLoading();
                $.ajax({
                    url: base.gAjaxUrl.busnoticemanager + 'bulk_create/',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        module: 1,
                        admins: admins
                    })
                }).always((data)=> {
                    $.hideLoading();
                    base.ajaxCallback(data, ()=> {
                        this.$dispatch('dialog-close', true);
                    });
                })
            },
        },
    }
</script>
