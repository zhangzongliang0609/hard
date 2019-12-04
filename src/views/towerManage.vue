<template>
    <add_building :title="title" :type="type" :data="currentItem" v-if="isShowAddBuildingDialog"
                  v-on:dialog-close="addBuildingDialogClose" @dialog-save="getList()"></add_building>
    <!-- 导入 -->
    <imoprt-data :urldata="importData" v-if="isShowImportDialog" v-on:dialog-close="importDialogClose"
                 v-on:dialog-save="importDialogSave"></imoprt-data>
    <section class="Hui-article-box">
        <div v-show="globalImageSrc" id="previewWindow">
            <img id="previewWindowImage" v-bind:src="globalImageSrc"/>
            <span @click="closeImagePreview" class="close-btn-img">x</span>
        </div>
        <div class="page-container bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body cl">
                    <span class="f-20 fw-b f-l">宿舍楼管理</span>
                    <input type="text" class="input-text ml-15 f-l" v-model="buildingName" placeholder="宿舍楼名称" />
                    <button v-on:click="getList(1)" class="btn f-l btn-success icon_search radius-r" type="button"><i class="Hui-iconfont">&#xe665;</i></button>
                    <a class="btn btn-primary radius mr-5 f-r" href="javascript:;" v-on:click="clickAddBuilding()">新增宿舍楼</a>
                </div>
            </div>
            <div class="mt-10 bgc-fff clearfix">
                <div class="materials bk-gray radius bgc-fff">
                    <table class="fixedParent table table-border table-bg table-striped bor-l bor-r">
                        <thead class="text-c">
                        <tr>
                            <th>宿舍楼</th>
                            <th>图片</th>
                            <th>地址</th>
                            <th>管理员</th>
                            <th>管理员电话</th>
                            <th>分组</th>
                            <th>备注</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr class="text-c" v-for="item in buildingsList">
                            <td>{{item.building_name}}</td>
                            <td class="building_img_td">
                                <img v-if="item.imgs && item.imgs.length" class="building_img"
                                     @click="previewImage(item.imgs[0].url)" v-bind:src="item.imgs[0].url" alt=""/>
                                <!--<img v-if="true" class="building_img"  @click="previewImage('../../static/images/bus-blue.png')" src="../../static/images/bus-blue.png" alt="" />-->
                                <span v-else>此楼未上传图片</span>
                            </td>
                            <td>{{item.addr?item.addr:'暂无地址'}}</td>
                            <td>{{item.real_name || '--'}}</td>
                            <td>{{item.phone || '--'}}</td>
                            <td class="hoverVisible">
                                <div class="tag_container">
                                    <div @mouseenter="checkPosition($event, item.tags.length <= 1)" class="tag_box" v-if="item.tags.length">
                                        <div class="tag_item" :title="item.tags[0].name">
                                            {{item.tags[0].name}}
                                            <span class="tag_more" v-if="item.tags.length > 1">...</span>
                                        </div>
                                        <div class="tag_second_box_sign"></div>
                                        <div v-if="item.tags.length > 1" class="tag_second_box cl">
                                            <div v-for="data in item.tags" class="tag_item f-l" title="{{data.name}}">{{data.name}}</div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td>{{item.remark}}</td>
                            <td>
                                <a class="mr-10" href="javascript:;" v-on:click="clickModify(item)"><i
                                        class="Hui-iconfont">&#xe6df;</i></a>
                                <a href="javascript:;" title="删除" v-on:click="deleteItem(item)"><i class="Hui-iconfont">
                                    &#xe6e2;</i></a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div id="J-page" class="m-page" v-show="!noData"></div>
                    <div class="m-loading" v-if="itemsLoading">
                        <div class="cube1"></div>
                        <div class="cube2"></div>
                    </div>
                    <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
                </div>
            </div>
        </div>
    </section>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .panel-body > .input-text {
        width: 200px;
    }

    .building_img_td {
        padding: 2px 0;
    }

    .building_img {
        width: 35px;
        height: 35px;
        display: inline-block;
        vertical-align: middle;
    }
    .tag_container {
        width: 80px;
        margin: 0 auto;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import add_building from "../components/addBuilding.vue";
    import imoprtData from "../components/batchImport.vue";
    let ajaxData = null;
    export default{
        ready(){
            ajaxData = {
                param: {
                    page: 1,
                    page_size: 10,
                }
            }
            this.getList(1);
        },
        data: function () {
            return {
                itemsLoading: false,
                noData: true,
                isShowAddBuildingDialog: false,
                buildingName: '',
                buildingsList: [],
                title: '',
                type: '',
                currentItem: '',
                isShowImportDialog: false,
                globalImageSrc: '',
                importData: base.gAjaxUrl.roomsImport,
            }
        },
        methods: {
            getList: function (flag) {
                if(flag) {
                    ajaxData.param.page = 1
                }
                this.isShowAddBuildingDialog = false;
                this.queryAjax((tpageToal = '4', count = '0')=> {
                    this.initPage('#J-page', tpageToal, ajaxData.param.page, count)
                });
            },
            initPage: function (obj, tpageToal = '4', current = '1', count = '0') {
                $(obj).createPage({
                    pageCount: tpageToal,
                    current: current,
                    count: count,
                    callback: (p)=> {
                        ajaxData.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax: function (callback = function () {
            }) {
                let that = this;
                this.itemsLoading = true;
                $.ajax({
                    url: base.gAjaxUrl.buildings,
                    type: 'GET',
                    data: {
                        page: ajaxData.param.page,
                        page_size: ajaxData.param.page_size,
                        building_name: that.buildingName,
                    }
                }).always((data)=> {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=> {
                        let resultData = data.results;
                        this.buildingsList = resultData;
                        if (resultData && resultData.length) {
                            this.noData = false;
                            //回调
                            callback(data.num_pages, data.count);
                        } else {
                            this.noData = true;
                        }
                    });
                })
            },
            clickAddBuilding: function () {
                this.isShowAddBuildingDialog = true;
                this.title = '添加宿舍楼';
                this.type = 'add';
            },
            addBuildingDialogClose: function () {
                this.isShowAddBuildingDialog = false;
            },
            clickAdd: function () {
                this.isShowImportDialog = true;
            },
            clickModify: function (item) {
                this.currentItem = item;
                this.isShowAddBuildingDialog = true;
                this.title = '编辑宿舍楼';
                this.type = 'compile';
            },
            importDialogClose: function () {
                this.isShowImportDialog = false;
            },
            deleteItem: function (item) {
                let that = this;
                layer.confirm(`删除需谨慎,确定需要删除${item.building_name}这个宿舍楼`, function () {
                    $.ajax({
                        url: `${base.gAjaxUrl.buildings}${item.id}/`,
                        type: 'DELETE',
                    }).always((data)=> {
                        if(data) {
                            base.ajaxCallback(data)
                        } else {
                            if(that.buildingsList.length == 1 && ajaxData.param.page) {
                                ajaxData.param.page--
                            }
                            that.getList();
                        }

                    })
                    layer.closeAll("dialog")
                })

            },
            checkPosition: function (e, flag) {
                if(flag) return;
                let target = e.srcElement ? e.srcElement : e.target;
                let $this = $(target);
                if($this.hasClass("top") || $this.hasClass("bottom")) return;
                let $parent = $this.parents(".fixedParent"); // 以下判断方法，需要$parent的padding为0，不然要重新插入padding的判断
                let $tagBox = $this.children(".tag_second_box");
                if($tagBox.offset().top + $tagBox.outerHeight() + $this.find(".tag_second_box_sign").outerHeight() > $parent.offset().top + $parent.height() && $this.parents("td").offset().top - $parent.offset().top < $this.find(".tag_second_box_sign").outerHeight() + $tagBox.outerHeight()){
                    var height = $parent.parents(".table-container").height();
                    var currentHeight = $this.offset().top - $parent.offset().top + $this.find(".tag_second_box_sign").outerHeight() + $tagBox.outerHeight() + $this.parents("td").outerHeight();
                    var compensate = $parent.offset().top - $parent.parent().offset().top;
                    if(currentHeight + compensate > height) $parent.parents(".table-container").css({minHeight: currentHeight + compensate});
                    $this.addClass("bottom");
                } else if($tagBox.offset().top + $tagBox.outerHeight() + $this.find(".tag_second_box_sign").outerHeight() > $parent.offset().top + $parent.outerHeight()){
                    $this.addClass("top");
                } else {
                    $this.addClass("bottom");
                }
            },
            closeImagePreview: function (e) {
                this.globalImageSrc = "";
            },
            previewImage: function (src) {
                this.globalImageSrc = src;
            }
        },
        components: {
            add_building,
            imoprtData,
        }
    }
</script>