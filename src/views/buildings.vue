<template>
    <!-- 添加 -->
    <add :title="dialogTitle" :type="dialogType" :data="dialogData" :tag_arr="tagArr" :buildings_list="buildings"
         :room_types_list="roomTypes" v-if="isShowAddDialog" v-on:dialog-close="addDialogClose"
         v-on:dialog-save="addDialogSave"></add>
    <set-tag :url="tagUrl" v-if="showSetTag" :title="title" :add="addContent" @dialog-close="closeSetTag"></set-tag>

    <section class="Hui-article-box">
        <div class="page-container bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body cl">
                    <span class="f-20 fw-b f-l">宿舍管理</span>
                    <a id="exportData" class="btn btn-secondary radius f-r" v-on:click="exportData()">批量导出</a>
                    <a href="javascript:;" class="btn btn-secondary radius f-r mr-15"
                       v-on:click="turnToImport()">批量导入</a>
                    <!--<a class="btn btn-primary radius mr-5 f-r" href="javascript:;" v-on:click="setTag">标签设置</a>-->
                    <a class="btn btn-primary radius mr-15 f-r" href="javascript:;" v-on:click="clickAdd()">添加宿舍</a>
                </div>
                <div class="mb-10 fs-16 ml-15">
                    <span>
                        宿舍楼:
                        &nbsp;
                    </span>
                    <select name="" v-model="buildingName" class="select-box fs-16">
                        <option value="">全部</option>
                        <option v-for="item in buildings" :value="item.id">{{item.building_name}}</option>
                    </select>
                    <span>
                        房间类型:
                        &nbsp;
                    </span>
                    <select name="" v-model="roomType" class="select-box fs-16">
                        <option value="">全部</option>
                        <option v-for="item in roomTypes" :value="item.id">{{item.type_name}}</option>
                    </select>
                    <span>
                        房间分组:
                        &nbsp
                    </span>
                    <select name="" v-model="roomTag" class="select-box fs-16">
                        <option value="">全部</option>
                        <option v-for="item in tagArr" :value="item.id">{{item.name}}</option>
                    </select>
                    <input type="text" class="input-text ml-15" v-model="roomInput" placeholder="房间号">
                    <button v-on:click="getList(1)" class="btn btn-success icon_search" type="button"><i
                            class="f-l Hui-iconfont">&#xe665;</i></button>
                </div>
            </div>
            <div class="mt-10 bgc-fff clearfix">
                <div class="materials bk-gray radius bgc-fff table-container">
                    <table class="fixedParent table table-border table-bg table-striped bor-l bor-r">
                        <thead class="text-c">
                        <tr>
                            <th>宿舍楼</th>
                            <th>房间号</th>
                            <th>房间类型</th>
                            <th>房间分组</th>
                            <th>容纳人数</th>
                            <th>床位</th>
                            <th>配置</th>
                            <th>锁定</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr class="text-c" v-for="item in items">
                            <td>{{item.building_name}}</td>
                            <td>{{item.room_no}}</td>
                            <td>{{item.type_name}}</td>
                            <td class="hoverVisible">
                                <div class="tag_container">
                                    <div @mouseenter="checkPosition($event, item.room_tags.length <= 1)" class="tag_box"
                                         v-if="item.room_tags.length">
                                        <div class="tag_item" :title="item.room_tags[0].name">
                                            {{item.room_tags[0].name}}
                                            <span class="tag_more" v-if="item.room_tags.length > 1">...</span>
                                        </div>
                                        <div class="tag_second_box_sign"></div>
                                        <div v-if="item.room_tags.length > 1" class="tag_second_box cl">
                                            <div v-for="data in item.room_tags" class="tag_item f-l"
                                                 title="{{data.name}}">{{data.name}}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td>{{item.content}}</td>
                            <td>{{item.bed_num}}</td>
                            <td>
                                    <span v-for="data in item.equipments">{{data.equipment_name}}
                                    <span v-if="$index != item.equipments.length - 1">/</span>
                                    </span>
                            </td>
                            <td>
                                <img class="w-20 cursor-p"
                                     v-bind:src="item.is_locking?'./src/assets/images/lock_close.png':'./src/assets/images/lock_open.png'"
                                     v-on:click="toggleLock(item)">
                            </td>
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

                    <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
                </div>
            </div>
        </div>
    </section>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import add from "../components/addRoom.vue";
    // import setTag from "../components/setBuildingTag.vue";

    let itemOps = null;

    export default{
        ready(){

            itemOps = {
                param: {
                    page: 1,
                    page_size: 10,
                }
            };
            this.itemsLoading = true;
            this.getBuildingsList();
            this.getRoomTypesList();
            this.getRoomTag();
        },
        data: function () {
            return {
                dialogTitle: '',
                dialogType: '',
                noData: false,
                itemsLoading: false,
                isShowAddDialog: false,
                items: [],
                buildings: [],
                buildingsId: '',
                roomTypes: [],
                dialogData: {},
                importData: {},
                tagArr: [], // 宿舍标签数组
                buildingName: '',
                roomType: '',
                roomTag: '',
                roomInput: '',
                showSetTag: false,
                tagUrl: base.gAjaxUrl.buildingsTag,
                title: "房间标签管理",
                addContent: '添加房间标签'

            }
        },
        methods: {
            addDialogClose: function (data) {
                this.isShowAddDialog = false;
            },
            addDialogSave: function (data) {
                this.isShowAddDialog = false;
                this.getList(1);
            },
            addBuildingDialogClose: function (data) {
                this.getBuildingsList();
                this.getRoomTypesList();
            },
            clickAdd: function () {
                if (this.buildings.length == 0) {
                    layer.msg('请先添加宿舍楼', {icon: 2, time: 1000});
                    return;
                }
                if (this.roomTypes.length == 0) {
                    layer.msg('请先添加房间类型', {icon: 2, time: 1000});
                    return;
                }
                this.dialogTitle = '添加宿舍';
                this.dialogType = 'add';
                this.isShowAddDialog = true;
            },
            clickModify: function (item) {
                this.dialogType = 'modify';
                this.dialogTitle = '编辑宿舍信息';
                this.isShowAddDialog = true;
                this.dialogData = item;
            },

            clickItem: function (item) {
                this.buildingsId = item.id;
                this.getList(1);
            },
            //初始化分页
            initPage: function (obj, tpageToal = '4', current = '1', count = '0') {
                $(obj).createPage({
                    pageCount: tpageToal,
                    current: current,
                    count: count,
                    callback: (p)=> {
                        itemOps.param.page = p;
                        this.queryAjax(this.buildingsId);
                    }
                });
            },
            //获取宿舍列表
            getList: function () {
                //重置第一页
//                if(reset){
//                    itemOps.param.page = 1
//                }
                this.queryAjax((tpageToal = '4', count = '0')=> {
                    this.initPage('#J-page', tpageToal, itemOps.param.page, count)
                });
            },
            queryAjax: function (callback = function () {
            }) {
                //修改参数
                this.itemsLoading = true;
                let that = this;
                $.ajax({
                    url: `${base.gAjaxUrl.rooms}`,
                    type: 'GET',
                    data: {
                        building: this.buildingName,
                        room_type: this.roomType,
                        tag: this.roomTag,
                        room_no: this.roomInput,
                        page: itemOps.param.page,
                        page_size: itemOps.param.page_size
                    }
                }).always((data)=> {
                    base.ajaxCallback(data, ()=> {
                        this.itemsLoading = false;
                        let resultData = data.results;
                        this.items = resultData;
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
            //获取宿舍楼列表
            getBuildingsList: function (callback = function () {
            }) {
                let ajaxData = {
                    param: {
                        page: 1,
                        page_size: 999999,
                    }
                };
                $.ajax({
                    url: base.gAjaxUrl.buildings,
                    type: 'GET',
                    data: ajaxData.param
                }).always((data)=> {
                    base.ajaxCallback(data, ()=> {
                        this.itemsLoading = false;
                        let resultData = data.results;
                        for (let i = 0; i < resultData.length; i++) {
                            resultData[i].index = i;
                        }
                        this.buildings = resultData;
                        if (resultData && resultData.length) {
//                            this.buildingsId = resultData[0].id;
                            this.noData = false;
                            //回调
                            //callback();
                            this.getList();
                        } else {
                            this.noData = true;
                        }
                    });
                })
            },
            //获取房间类型列表
            getRoomTypesList: function () {
                $.ajax({
                    url: base.gAjaxUrl.roomtypes,
                    type: 'GET',
                    data: {
                        page: 1,
                        page_size: 999999,
                    }
                }).always((data)=> {
                    base.ajaxCallback(data, ()=> {
                        this.itemsLoading = false;
                        this.roomTypes = data.results;
                    });
                })
            },
            deleteItem: function (item) {
                let that = this;
                layer.confirm(`确定要删除房间吗?`, function () {
                    that.itemsLoading = true;
                    $.ajax({
                        url: `${base.gAjaxUrl.rooms}${item.id}/`,
                        type: "DELETE",
                        success:()=>{
                            layer.msg("删除成功", {icon: 1, time: 1500});
                            that.getList();
                        }
                    }).always((data)=> {
                        this.$nextTick(()=>{
                            layer.closeAll("dialog");
                        })
                        that.itemsLoading = false;
                    })

                })

            },
            checkPosition: function (e, flag) {
                if (flag) return;
                let target = e.srcElement ? e.srcElement : e.target;
                let $this = $(target);
                if ($this.hasClass("top") || $this.hasClass("bottom")) return;
                let $parent = $this.parents(".fixedParent"); // 以下判断方法，需要$parent的padding为0，不然要重新插入padding的判断
                let $tagBox = $this.children(".tag_second_box");
                if ($tagBox.offset().top + $tagBox.outerHeight() + $this.find(".tag_second_box_sign").outerHeight() > $parent.offset().top + $parent.height() && $this.parents("td").offset().top - $parent.offset().top < $this.find(".tag_second_box_sign").outerHeight() + $tagBox.outerHeight()) {
                    var height = $parent.parents(".table-container").height();
                    var currentHeight = $this.offset().top - $parent.offset().top + $this.find(".tag_second_box_sign").outerHeight() + $tagBox.outerHeight() + $this.parents("td").outerHeight();
                    var compensate = $parent.offset().top - $parent.parent().offset().top;
                    if (currentHeight + compensate > height) $parent.parents(".table-container").css({minHeight: currentHeight + compensate});
                    $this.addClass("bottom");
                } else if ($tagBox.offset().top + $tagBox.outerHeight() + $this.find(".tag_second_box_sign").outerHeight() > $parent.offset().top + $parent.outerHeight()) {
                    $this.addClass("top");
                } else {
                    $this.addClass("bottom");
                }
            },
            getRoomTag: function () {
                $.ajax({
                    url: `${base.gAjaxUrl.tagGroup}`,
                    type: "GET",
                    data: {
                        type: 2,
                        page: 1,
                        page_size: 999999,
                    }
                }).always((data)=> {
                    base.ajaxCallback(data, ()=> {
                        this.tagArr = data.results;
                    })
                })
            },
            setTag: function () {
                this.showSetTag = true;
            },
            closeSetTag: function () {
                this.showSetTag = false;
                this.getRoomTag();
            },
            // 锁定/解锁房间
            toggleLock: function (item) {
                let that = this;

                if (item.is_locking) {
                    layer.confirm(`房间解锁之后可以分配人员入住,确定解锁${item.room_no}这个房间吗？`, function () {
                        $.ajax({
                            url: `${base.gAjaxUrl.rooms}${item.id}/`,
                            type: "PUT",
                            contentType: 'application/json',
                            data: JSON.stringify({
                                room_no: item.room_no,
                                building: item.building,
                                room_type: item.room_type,
                                is_locking: false,
                            })
                        }).always((data)=> {
                            base.ajaxCallback(data, ()=> {
                                that.getBuildingsList();
                            })
                        })
                        layer.closeAll("dialog");
                    })
                } else {
                    layer.confirm(`房间锁定之后将不能分配人员入住,确定锁定${item.room_no}这个房间吗？`, function () {
                        $.ajax({
                            url: `${base.gAjaxUrl.rooms}${item.id}/`,
                            type: "PUT",
                            contentType: 'application/json',
                            data: JSON.stringify({
                                room_no: item.room_no,
                                building: item.building,
                                room_type: item.room_type,
                                is_locking: true,
                            })
                        }).always((data)=> {
                            base.ajaxCallback(data, ()=> {
                                that.getBuildingsList();
                            })
                        })
                        layer.closeAll("dialog");
                    })
                }
            },
            turnToImport: function () {
                this.$router.go({
                    path: '/importMould',
                    name: 'importMould',
                    query: {
                        importType: 'dormitory'
                    }
                })
            },
            exportData: function () {
                this.itemsLoading = true;
                $.ajax({
                    url: `${base.gAjaxUrl.rooms}export/`,
                    type: 'POST',
                    contentType: "application/json",
                    data: JSON.stringify({
                        building: this.buildingName,
                        room_type: this.roomType,
                        tag: this.roomTag,
                        room_no: this.roomInput,
                    })
                }).always(() => {
                    this.itemsLoading = false;
                    this.$route.router.go({path: '/job'});
                })
            }
        },
        components: {
            add,
        }
    }
</script>
<style lang="less" scoped rel="stylesheet/less">
    .hoverVisible:hover {
        overflow: visible;
    }

    .tag_container {
        width: 80px;
        margin: 0 auto;
    }

    .clearfix:before {
        content: "";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
        zoom: 1;
    }

    .panel-default .input-text {
        width: 200px;
    }

    .select-box {
        width: 150px;
    }

    .icon_search {
        margin-left: -5px;
    }

    .materialclasses {
        width: 198px;
        border: 1px solid #eee;
        overflow: auto;
    }

    .materialsTop {
        padding: 10px;
        text-align: center;
        border-bottom: 1px solid #eee;
    }

    .materialclasses ul {
        max-height: 450px;
        overflow: auto;
    }

    .materialclasses .item {
        padding: 4px 10px;
        border-bottom: 1px solid #eee;
        text-align: left;
        cursor: pointer;
    }

    .materialclasses .all {
        cursor: default;
        height: 31px;
        border-bottom: 1px solid #eee;
        padding: 4px 10px;
    }

    .materialclasses .all span {
        color: #206afc;
    }

    .materialclasses .item .name {
        line-height: 28px;
    }

    .materialclasses .item .name.curr {
        color: #206afc
    }

    .materialclasses .item.all span {
        line-height: 32px;
        color: #206afc;
    }

    .materials {
        /*padding-left: 200px; */
        overflow: hidden;
    }
</style>
