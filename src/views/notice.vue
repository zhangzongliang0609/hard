<template>
    <section class="Hui-article-box">
        <div class="page-container">
            <div class="text-l clearfix">
                <input type="text" class="input-text Wdate f-l" style="width:150px;" placeholder="标题/作者"
                       id="searchInput">
                <button type="submit" class="btn btn-success f-l radius-r" v-on:click="getList(1)">
                    <i class="Hui-iconfont">&#xe665;</i>
                </button>
                <a class="btn btn-primary radius f-r" v-on:click="addNotice" href="javascript:;">
                    <i class="Hui-iconfont">&#xe600;</i> 发公告
                </a>
            </div>

            <table class="table table-border table-bordered table-hover table-bg  mt-20 ">
                <thead>
                <tr class="text-c">
                    <th width="200" class="max-200">标题</th>
                    <th width="80">作者</th>
                    <th width="80">封面图片</th>
                    <th width="120">最后发布时间</th>
                    <!--<th width="80">是否发布</th>-->
                    <th width="120">操作</th>
                </tr>
                </thead>
                <tbody v-if="!noData">
                <tr class="text-c" v-for="item in items">
                    <td class="max-200">{{item.title}}</td>
                    <td>{{item.author}}</td>
                    <td>
                        <img @click="showImageView(item.img)" class="img avatar"
                             :src="item.img || '/static/images/notice-no-img.png'" alt="暂无图片"/>
                    </td>
                    <td>{{item.pub_time && item.status == 20 ? item.pub_time : '--'}}</td>
                    <td class="f-14">
                        <a title="预览" href="javascript:;" v-on:click="previewNotice(item)"
                           class="btn btn-primary radius">预览</a>
                        <a title="发布" href="javascript:;" v-on:click="publishNotice(item)"
                           class="btn btn-primary radius ml-10">发布</a>
                        <a title="编辑" href="javascript:;" v-on:click="modifyNotice(item)" class="ml-10"><i
                                class="Hui-iconfont">
                            &#xe6df;</i></a>
                        <a title="删除" href="javascript:;" class="ml-10" v-on:click="deleteBtn(item)"><i
                                class="Hui-iconfont">&#xe6e2;</i></a>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
            <div id="J-page" class="m-page" v-show="!noData"></div>
        </div>
        <pi v-if="isShowImageView" :src="showImageSrc" v-on:close-view="hideImageView"></pi>
        <pn v-if="isShowPreviewNotice" :data="selectNotice" @dialog-close="closePreview"></pn>
        <edit :notice="selectNotice" :type="type" v-if="showEditor" @dialog-close="closeAdd"></edit>
        <div class="m-loading" v-if="itemsLoading">
            <div class="cube1"></div>
            <div class="cube2"></div>
        </div>
    </section>
</template>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import pi from '../components/previewImage.vue';
    import pn from '../components/previewNotice.vue';
    import edit from '../components/noticeEditor.vue';

    let noticesOps = null;

    export default{
        ready () {
            noticesOps = {
                param: {
                    search: '',
                    page: 1,
                    page_size: 10,
                }
            };
            this.getList(1);
        },
        data: function () {
            return {
                noData: false,
                itemsLoading: false,
                isShowImageView: false,
                showImageSrc: '',
                isShowPreviewNotice: false,
                showEditor: false,
                selectNotice: null, // 选择的通知 -- 预览或者编辑
                type: 'add',
                items: [],
                url: base.gAjaxUrl.notices,
                searchInput: '',
            }
        },
        methods: {
            showImageView: function (src) {
                if (src && typeof src == 'object') {
                    src = src.target.src
                }
                this.showImageSrc = src;
                this.isShowImageView = true;
            },
            hideImageView: function () {
                this.showImageSrc = '';
                this.isShowImageView = false;
            },
            addNotice: function () {
                this.type = 'add';
                this.selectNotice = null;
                this.showEditor = true;
            },
            modifyNotice: function (data) {
                this.type = 'modify';
                this.selectNotice = data;
                this.showEditor = true;
            },
            closeAdd: function (flag) {
                if (flag) {
                    this.getList(1);
                }
                this.showEditor = false;
            },
            previewNotice: function (data) {
                this.selectNotice = data;
                this.isShowPreviewNotice = true;
            },
            // 关闭预览
            closePreview: function () {
                this.isShowPreviewNotice = false;
            },
            //初始化分页   
            initPage: function (obj, tpageToal = '4', current = '1', count = '0') {
                $(obj).createPage({
                    pageCount: tpageToal,
                    current: current,
                    count: count,
                    callback: (p)=> {
                        noticesOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax: function (callback = function () {
            }) {
                this.itemsLoading = true;
                //修改参数
                noticesOps.param.search = this.searchInput;
                $.ajax({
                    url: base.gAjaxUrl.notices,
                    type: 'GET',
                    data: noticesOps.param
                }).always((data)=> {
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
            //获取列表
            getList: function (reset = 0) {
                //重置第一页
                if (reset) {
                    this.searchInput = $("#searchInput").val();
                    noticesOps.param.page = 1
                }
                //以下限制标题搜索为20个字
                if ($(".Wdate").val().length > 20) {
                    // layer.confirm('至多输入20个字符哦！',(index)=>{});
                    layer.msg('至多输入20个字符！', {icon: 1, time: 1500});
                } else {
                    this.queryAjax((tpageToal = '4', count = '0')=> {
                        this.initPage('#J-page', tpageToal, noticesOps.param.page, count)
                    });
                }
            },
            //删除
            deleteBtn: function (item) {
                layer.confirm(`确认要删除公告【${item.title}】吗？`, (index)=> {
                    $.ajax({
                        url: `${base.gAjaxUrl.notices}${item.id}/`,
                        type: 'DELETE'
                    }).always((data)=> {
                        if (data) {
                            base.ajaxCallback(data);
                            return
                        }
                        if (this.items.length == 1 && noticesOps.param.page > 1) {
                            noticesOps.param.page--;
                        }
                        layer.msg('删除成功', {icon: 1, time: 1000});
                        this.getList();
                    })
                });
            },
            // 更改发布状态
            publishNotice: function (item) {
                layer.confirm(`确认要发布公告【${item.title}】吗？`, (index)=> {
                    this.itemsLoading = true;
                    $.ajax({
                        url: `${base.gAjaxUrl.notices}${item.id}/`,
                        type: 'PATCH',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            status: 20
                        })
                    }).always((data)=> {
                        this.itemsLoading = false;
                        base.ajaxCallback(data, () => {
                            layer.msg('发布成功', {icon: 1, time: 1000});
                            this.getList();
                        });
                    })
                    layer.close(index);
                });
            },

        },
        components: {
            pi, pn, edit
        }
    }
</script>

<style lang="less" scoped rel="stylesheet/less">
    .avatar {
        width: 40px;
        height: 30px;
        cursor: pointer;
    }

    .sel-box {
        width: 40px;
        height: 20px;
        border-radius: 10px;
        cursor: pointer;
        box-sizing: border-box;
        position: relative;
        background-color: #0099ff;
        overflow: hidden;
        display: inline-block;
        span {
            position: absolute;
            left: 0;
            top: 0;
            cursor: pointer;
            box-sizing: border-box;
            border-radius: 10px;
        }
        .sel-mask {
            background-color: rgba(255, 255, 255, .75);
            width: 100%;
            height: 100%;
            left: 0;
            transition: all 0.2s ease;
            &.open {
                left: 20px;
            }
        }
        .sel-inner {
            background-color: #fff;
            width: 20px;
            height: 20px;
            border: 1px solid #ccc;
        }
    }
</style>