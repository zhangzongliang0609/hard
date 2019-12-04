<template>

    <!-- 添加 -->
    <add :type="dialogType" :data="dialogData" v-if="showAdd" v-on:dialog-close="addClose"></add>
    <div class="Hui-article-box">
        <div class="page-container bgc-fff">
            <div class="panel panel-default radius">
                <div class="panel-body clearfix">
                    <span class="f-20 fw-b f-l">白名单</span>
                </div>
            </div>
            <div class="panel panel-default radius clearfix mt-10 mb-10">
                <div class="panel-body cl clearfix">
                    <input class="input-text f-l" type="text" v-model="searchInput" placeholder="部门/名称"
                           style="width: 150px"/>
                    <button type="submit" class="btn btn-success radius-r f-l" @click="getList(1)">
                        <i class="Hui-iconfont f-r">&#xe665;</i>
                    </button>
                    <a class="btn radius btn-primary f-r" href="javascript:;" @click="addWhiteList">添加白名单</a>
                </div>
            </div>
            <!--<table class="table table-border table-bg table-hover table-bg table-sort">-->
            <table class="table table-border table-bg table-striped bor-l bor-r">
                <thead>
                <tr class="text-c">
                    <th width="120">名称</th>
                    <th width="120">部门</th>
                    <th width="200">操作</th>
                    <th width="400">复制地址</th>
                </tr>
                </thead>
                <tbody v-if="!noData">
                <tr class="text-c" v-for="item in items">
                    <td>{{ item.name }}</td>
                    <td>{{ item.department_name }}</td>
                    <td class="f-14  no-selected">
                        <a title="编辑" href="javascript:;" v-on:click="clickModify(item)">
                            <i class="Hui-iconfont">&#xe6df;</i>
                        </a>
                        <a class="ml-15" title="删除" href="javascript:;" v-on:click="deleteBtn(item)">
                            <i class="Hui-iconfont">&#xe6e2;</i>
                        </a>
                        <a class="ml-15 btn btn-primary radius" title="下载二维码" href="javascript:;"
                           v-on:click="downloadCode(item)">下载二维码</a>
                    </td>
                    <td>{{url + '?com_id=' + companyId + '&uid=' + item.key}}</td>
                </tr>
                </tbody>
            </table>
            <div id="J-page" class="m-page" v-show="!noData"></div>
            <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
            <!--<img src="../assets/images/admin-login-bg.jpg" alt="" class="imggg"/>-->
            <a href="" class="saveBtn hide" target="_blank" download>下载按钮</a>
        </div>
    </div>

    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>

</template>

<style lang="less" rel="stylesheet/less" scoped>
    .page-container {
        min-height: 100%;
        box-sizing: border-box;
    }

    .imggg {
        position: fixed;
        left: 250px;
        top: 200px;
        border: 5px solid #ccc;
        background-color: #f5f5f5;
        width: 250px;
        height: 250px;
        z-index: 200;
    }

    /* 调试样式 */
    /*.saveBtn {*/
        /*position: fixed;*/
        /*left: 550px;*/
        /*top: 200px;*/
        /*border: 5px solid #ccc;*/
        /*background-color: #f5f5f5;*/
        /*width: 250px;*/
        /*height: 50px;*/
        /*z-index: 200;*/
        /*line-height: 50px;*/
    /*}*/

</style>

<script type="text/ecmascript-6">
    let pageOpts = null;
    import * as base from '../assets/js/base.js';
    import add from "../components/addWhiteList.vue";

    export default{
        ready () {

            pageOpts = {
                page: 1,
                page_size: 10,
                search: "",
            };

            this.getList();
            this.initEvent();

        },
        data: function () {
            return {
                noData: true,
                showAdd: false,
                dialogType: 'add',
                dialogData: null,
                itemsLoading: false,
                filterName: '',
                filterFocus: false,
                filterId: '',
                searchInput: '',
                items: [],
                companyId: localStorage.getItem('companyID'), //
                url: wpSiteUrl + '/api/v3/pos/create_qroce/', // 白名单的常用地址
            }
        },
        methods: {
            initPage: function (obj, tpageToal = '4', count = '0') {
                $(obj).createPage({
                    pageCount: tpageToal,
                    current: 1,
                    count: count,
                    callback: (p) => {
                        pageOpts.page = p;
                        this.queryAjax();
                    }
                });
            },
            getList: function (flag) {
                if (flag) {
                    pageOpts.search = this.searchInput;
                }
                this.queryAjax((tpageToal = '4', count = '0') => {
                    this.initPage('#J-page', tpageToal, pageOpts.page, count)
                });
            },
            queryAjax: function (callback) {
                this.itemsLoading = true;
                $.ajax({
                    url: base.gAjaxUrl.whitelist,
                    type: "GET",
                    data: pageOpts
                }).always((data) => {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, () => {
                        let res = data.results || [];
                        this.noData = !res.length;
                        this.items = res;
                        callback && callback(data.num_pages, data.count);
                    })
                })
            },
            addWhiteList: function () {
                this.dialogType = 'add';
                this.showAdd = true;
            },
            clickModify: function (item) {
                this.dialogType = 'modify';
                this.dialogData = item;
                this.showAdd = true;
            },
            addClose: function (flag) {
                if (flag) {
                    this.getList();
                }
                this.showAdd = false;
            },
            deleteBtn: function (item) {
                layer.confirm(`确认删除白名单【${item.name}】?`, (index)=> {
                    this.itemsLoading = true;
                    $.ajax({
                        url: `${base.gAjaxUrl.whitelist}${item.id}/`,
                        type: "DELETE",
                    }).always((data)=> {
                        this.itemsLoading = false;
                        layer.close(index);
                        if (data) {
                            base.ajaxCallback(data)
                        } else {
                            layer.msg("删除成功", {icon: 1, time: 1500});
                            if (this.items.length == 1 && pageOpts.page > 1) {
                                pageOpts.page--;
                            }
                            this.getList();
                        }
                    })
                });
            },
            downloadCode: function (item) {
                this.itemsLoading = true;
                var _this = this;
                $.ajax({
                    url: base.gAjaxUrl.whitelist + item.id + '/qrcode/',
                    type: 'GET',
                }).always((data) => {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, () => {
                        console.log(data)
//                        $(".imggg").attr("src", "data:image/png;base64," + data.responseText);
//                        $(".saveBtn").attr("href", "data:image/png;base64," + data.responseText).attr('download', "【" + item.name + "】二维码").trigger("click");
                        $(".saveBtn").attr("href", "data:image/png;base64," + data.responseText).attr('download', "【" + item.name + "】二维码")[0].click();
                    });
                });
            },
            initEvent: function () {
                var _this = this;
                $(".imggg").load(function (e) {
                    console.log("onload")
                    var url = _this.convertImageToCanvas(this).toDataURL("image/png");
//                    if(/AppleWebKit/i.test(navigator.userAgent)) {
                    if("ActiveXObject" in window || !!window.ActiveXObject) {
                        console.log("$(.saveBtn): ", $(".saveBtn"));
                        $(".saveBtn").attr("href", url).attr('download', "【" + "item.naem" + "】二维码")[0].click();
                    } else {
                       this.ieSave();
                    }

                });
            },
//            convertImageToCanvas: function (image) {
//                var canvas = document.createElement("canvas");
//                canvas.width = image.width;
//                canvas.height = image.height;
//                canvas.getContext("2d").drawImage(image, 0, 0);
//                return canvas;
//            },
//            ieSave: function () {
//                var OW = window.open('', "_blank", "");
//                winname.open($(".imggg")[0].src, '_blank', 'top=10000');
//                winname.document.execCommand('saveAs','','下载.png');
//                winname.close();
//            }
        },
        components: {add},
        filters: {}
    }


</script>