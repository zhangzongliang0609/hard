<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">设置管理员</div>
        <div class="pt-20 clearfix pr-20">
            <a href="javascript:;" class="f-r radius btn btn-primary mr-30" @click="addNew">添加通知管理员</a>
        </div>
        <div class="layui-layer-content pd-20">
            <div class="layui-layer-wrap">
                <table class="table table-border table-bordered table-hover table-bg table-sort">
                    <thead>
                    <tr class="text-c">
                        <th width="25">姓名</th>
                        <th width="100">电话</th>
                        <th width="100">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="text-c" v-for="item in items">
                        <td>{{item.user_name}}</td>
                        <td>{{item.phone}}</td>
                        <td>
                            <a title="删除" href="javascript:;" style="display: inline-block" class="ml-5"
                               v-on:click="deleteItem(item)">
                                <i class="Hui-iconfont">&#xe6e2;</i>
                            </a>
                        </td>
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
    </div>
    <div class="layui-layer-shade"></div>
    <manager v-if="isShowAdd" @dialog-close="saveAdd"></manager>
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
    }

</style>

<script type="text/ecmascript-6">

    import * as base from '../assets/js/base.js';
    import manager from '../components/selectManager.vue'

    let staffsOps = null;

    export default{
        ready () {

            staffsOps = {
                param: {
                    module: this.type == 'bus' ? 1 : 0, // 1 巴士管理员
                    page: 1,
                    page_size: 10,
                }
            };

            base.verticalCenter('.layui-modify');

            this.getList(1);
        },
        props: ['type'],
        data: function () {
            return {
                noData: false,
                items: [],
                searchInput: '',
                isShowAdd: false,
            }
        },
        methods: {
            addNew: function (item) {
                this.isShowAdd = true;
            },
            saveAdd: function (flag) {
                if(flag) {
                    this.getList(1)
                }
                this.isShowAdd = false;
            },
            //初始化分页   
            initPage: function (obj, tpageToal = '4', count = '0') {
                $(obj).createPage({
                    pageCount: tpageToal,
                    current: 1,
                    count: count,
                    callback: (p)=> {
                        staffsOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax: function (callback = function () {}) {
                //修改参数
                $.ajax({
                    url: base.gAjaxUrl.busnoticemanager,
                    type: 'GET',
                    data: staffsOps.param
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
            //获取列表
            getList: function (reset = 0) {
                //重置第一页
                if (reset) {
                    staffsOps.param.page = 1
                }
                this.queryAjax((tpageToal = '4', count = '0')=> {
                    this.initPage('#J-page', tpageToal, count)
                });
            },
            close: function () {
                this.$dispatch('dialog-close');
            },
            deleteItem: function (item) {
                layer.confirm('确认删除管理员?', (index)=> {
                    $.ajax({
                        url: `${base.gAjaxUrl.busnoticemanager}${item.id}/`,
                        type: "DELETE",
                    }).always((data)=> {
                        if (data) {
                            base.ajaxCallback(data);
                            return;
                        }
                        if (this.items.length == 1 && staffsOps.page > 1) {
                            staffsOps.page--;
                        }
                        layer.close(index);
                        this.getList();
                    })
                });
            }
        },
        components: {
            manager
        }
    }
</script>
