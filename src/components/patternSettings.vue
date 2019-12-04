<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify pattern-box">
        <div class="layui-layer-title">模式设置</div>
        <div class="layui-layer-content">
            <div class="bk-gray radius mt-10 ml-20 mr-20">
                <div class="table-box">
                    <table class="table table-border table-bg table-striped">
                        <thead class="text-c">
                        <tr>
                            <th>线路名称</th>
                            <th>是否预约(预约/免预约)</th>
                            <th>检票方式(软件/硬件)</th>
                        </tr>
                        </thead>
                        <tbody class="text-c">
                        <tr v-for="item in items">
                            <td>{{item.shuttle_name?item.shuttle_name:"五山路口"}}</td>
                            <td>
                                <a class="btn radius" :class="{ 'btn-primary': item.order_mode == 10}"
                                   href="javascript:;" v-on:click="isAppointment(item,10)">预约</a>
                                <a class="btn radius" :class="{ 'btn-primary': item.order_mode == 20}"
                                   href="javascript:;" v-on:click="isAppointment(item,20)">免预约</a>
                            </td>
                            <td>
                                <a class="btn radius" :class="{ 'btn-primary': item.check_mode == 20}"
                                   href="javascript:;" v-on:click="checkFn(item,20)">硬件</a>
                                <a class="btn radius" :class="{ 'btn-primary': item.check_mode == 10}"
                                   href="javascript:;" v-on:click="checkFn(item,10)">软件</a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
            </div>
            <div class="clearfix">
                <div class="layui-layer-btn place f-l" v-on:click="save"><a class="layui-layer-btn0">保存</a></div>
            </div>
            <div class="page-box clearfix">
                <div id="k-page" class="m-page" v-show="!noData"></div>
                <div class="pageMask" @click="hintSave()"></div>
            </div>
        </div>
        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
    </div>
    <div class="layui-layer-shade"></div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .pattern-box {
        height: 95%;

        .layui-layer-content {
            height: 83%;
            overflow: auto;
            max-height: none;
        }
    }

    .page-box {
        padding-right: 10px;
        position: relative;

        .pageMask {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 2;
        }
    }

</style>
<script>
    import * as base from '../assets/js/base.js';

    let staffsOps = null;

    export default {
        ready() {
            staffsOps = {
                param: {
                    search: '',
                    page: 1,
                    page_size: 10,
                }
            };
            this.queryAjax((tpageToal = '4', count = '0') => {
                this.initPage('#k-page', tpageToal, staffsOps.param.page, count)
            });
        },
        data: function () {
            return {
                itemsLoading: true,
                items: '',
                noData: true,
                index: 1,
                change: false,
            }
        },

        methods: {
            initPage: function (obj, tpageToal = '4', current = '1', count = '0') {
                $(obj).createPage({
                    pageCount: tpageToal,
                    current: current,
                    count: count,
                    callback: (p) => {
                        staffsOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax: function (callback = function () {
            }) {
                this.itemsLoading = true;
                let that = this;
                $.ajax({
                    url: base.gAjaxUrl.shuttlebuses3,
                    type: 'GET',
                    data: staffsOps.param
                })
                    .always((data) => {
                        this.itemsLoading = false;
                        base.ajaxCallback(data, () => {
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
                let that = this;
                if (this.change) {
                    layer.confirm(
                        '预约模式 : 该路线需要预约购票   <br> ' +
                        '免预约模式 : 该线路无需预约购票 <br> ' +
                        '硬件检票 : 可使用班车上扫码器扫码上车  <br> ' +
                        '软件检票 : 通过班车司机检票上车   <br>',
                        {title: "当前有设置未保存是否确认关闭界面"},
                        (index) => {
                            this.saveChanges(true);
                        },
                        () => {
                            this.$dispatch('dialog-close');
                        }
                    );
                } else {
                    this.$dispatch('dialog-close');
                }
            },
            isAppointment: function (item, type) {
                if (item.order_mode == type) {
                    return
                }
                item.order_mode = type;
                this.change = true;
                $(".pageMask").css({width: "100%", height: "100%"})
            },
            checkFn: function (item, type) {
                if (item.check_mode == type) {
                    return
                }
                item.check_mode = type;
                this.change = true;
                $(".pageMask").css({width: "100%", height: "100%"})
            },
            hintSave: function () {
                layer.msg("请先保存当前设置", {icon: 2, time: 1500});
            },
            save: function () {
                layer.confirm('预约模式 : 该路线需要预约购票   <br> ' +
                    '免预约模式 : 该线路无需预约购票 <br> ' +
                    '硬件检票 : 可使用班车上扫码器扫码上车  <br> ' +
                    '软件检票 : 通过班车司机检票上车   <br>',
                    {title: "是否保存当前设置"}, (index) => {
                        this.saveChanges();
                    });
            },
            saveChanges (flag) {
                $.ajax({
                    url: base.gAjaxUrl.shuttlebuses3 + "modes/",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({
                        data: this.items
                    })
                }).always((data) => {
                    base.ajaxCallback(data, () => {
                        $(".pageMask").css({width: 0, height: 0});
                        this.change = false;
                        layer.closeAll();
                        layer.msg("保存成功", {icon: 1, time: 1500});
                        if(flag) {
                            this.$dispatch('dialog-close', true);
                        } else {
                            this.$dispatch('dialog-refresh');
                        }
                    })
                })
            }
        }
    }
</script>