<template>
    <!-- 编辑房间 -->
    <add :title="dialogTitle" :type="dialogType" :data="dialogData" :buildingid="buildingsId" v-if="isShowAddDialog"
         v-on:dialog-close="addDialogClose"></add>

    <section class="Hui-article-box">
        <div class="page-container bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body">
                    <div class="mb-10 fs-16 ml-10 clearfix">
                        <span class="f-20 fw-b">房务信息</span>
                        <span>宿舍楼:&nbsp;</span>
                        <select name="" v-model="buildingsId" class="select-box fs-16">
                            <option value="">全部</option>
                            <option v-for="item in buildings" :value="item.id">{{item.building_name}}</option>
                        </select>
                        <span>房间类型:&nbsp;</span>
                        <select name="" v-model="roomType" class="select-box fs-16">
                            <option value="">全部</option>
                            <option v-for="item in roomTypes" :value="item.id">{{item.type_name}}</option>
                        </select>
                        <div class="search-box ml-10">
                            <input type="text" class="input-text ml-5" v-model="roomNumber" placeholder="房间号">
                            <button v-on:click="getList(1)" class="btn btn-success icon_search" type="button"><i class="f-l Hui-iconfont">&#xe665;</i></button>
                        </div>

                        <a id="exportData" class="btn btn-secondary radius f-r" v-on:click="exportData()">批量导出</a>

                        <!--<div>-->
                        <!--<span class="type" v-for="item in currBuilding.type_info"><i class="Hui-iconfont">&#xe619;</i>{{item.type_name}}：{{item.cnt}}间</span>-->
                        <!--</div>-->
                    </div>
                </div>
            </div>
            <div class="panel radius mt-10 bgc-e5">
                <div class="panel-body">
                    <div class="cl">
                        <span class="fw-b fs-18">全部</span>
                        <!--<span v-for="item in roomTypes">{{item.type_name}}:&nbsp; {{item.}}</span>-->
                        <!--<span class="type" v-for="item in currBuilding.type_info"><i class="Hui-iconfont">&#xe619;</i>{{item.type_name}}：{{item.cnt}}间</span>-->

                        <span class="f-r btn radius full mr-5 cursor-d" @click="setStatus(1)">满房：{{currBuilding.room_info?currBuilding.room_info.full_cnt:0}}间</span>
                        <span class="f-r btn radius mr-5 notfull cursor-d" @click="setStatus(2)">未满：{{currBuilding.room_info?currBuilding.room_info.not_full_cnt:0}}间</span>
                        <span class="f-r btn radius mr-5 null-room cursor-d" @click="setStatus(3)">空房：{{currBuilding.room_info?currBuilding.room_info.empty_cnt:0}}间</span>
                        <span class="f-r btn radius mr-5 btn-success cursor-d" @click="setStatus(0)">全部：{{currBuilding.room_info?currBuilding.room_info.all_cnt:0}}间</span>
                    </div>
                    <div>
                        <span class="type" v-for="item in currBuilding.type_info"><i class="Hui-iconfont">&#xe619;</i>{{item.type_name}}：{{item.cnt}}间</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-10 clearfix radius">
            <div class="overf-h pl-10">
                <div class="bgc-fff clearfix pt-1 minh-411">
                    <ul class="clearfix">
                        <li class="roomItem choiceRoom ml-5 mt-5" v-for="item in items"
                            v-bind:class="[item.staff_num==0?'null-room':(item.is_full?'full':'notfull')]">
                            <div>
                                <div class="text-c">{{item.building_name}}</div>
                                <div class="text-c">{{item.room_no}}</div>
                                <div class="text-c">{{item.room_type_name}}({{item.content}}人)</div>
                                <div class="">已住：{{item.staff_num}}人
                                    <i class="Hui-iconfont cursor-p lock fs-22" @click.stop="clickModify(item)">
                                        &#xe6df;</i>
                                    <img class="w-20 cursor-p ml-10"
                                         v-bind:src="item.is_locking?'./src/assets/images/lock_close.png':'./src/assets/images/lock_open.png'"
                                         v-on:click.stop="toggleLock(item)">
                                </div>
                            </div>
                        </li>

                        <!--<li class="roomItem" v-for="item in items" v-bind:class="[item.staff_num==0?'bgc-fff':(item.is_full?'full':'notfull')]">-->
                        <!--<div>-->
                        <!--<div class="text-c">{{item.room_no}}房</div>-->
                        <!--<div class="text-c">{{item.room_type_vo.type_name}}({{item.room_type_vo.content}}人)</div>-->
                        <!--<div class="text-c">已住：{{item.staff_num}}人</div>-->
                        <!--</div>-->
                        <!--<a class="icon-modify" href="javascript:;" v-on:click="clickModify(item)">-->
                        <!--<img v-if="item.staff_num==0" src="../assets/images/icon-modify-g.png" height="20" width="20" alt="">-->
                        <!--<img v-else src="../assets/images/icon-modify-w.png" height="20" width="20" alt="">-->
                        <!--</a>-->
                        <!--</li>-->
                    </ul>
                    <div id="J-page" class="m-page mr-20" v-show="!noData"></div>
                    <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
                </div>
            </div>
        </div>
        <!--</div>-->
    </section>
    <div class="m-loading" v-if="isLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import add from "../components/modifyRoomStaff.vue";

    let itemOps = null;

    export default{
        ready(){
            itemOps = {
                param: {
                    page: 1,
                    page_size: 20,
                }
            };
            this.isLoading = true;
            this.getBuildingsList();
            this.getRoomTypesList();
        },
        props: ['title', 'type', 'data'],
        data: function () {
            return {
                noData: false,
                isLoading: false,
                isShowAddDialog: false,
                isShowAddBuildingDialog: false,
                isShowModify: false,
                itemIndex: 0,
                currBuilding: {},
                items: [],
                buildings: [],
                buildingsId: '',
                buildingName: '',
                dialogType: 'add',
                dialogTitle: '添加大分类',
                dialogData: {},
                roomTypes: '', // 房间类型列表
                roomType: '',
                roomStatus: '',
            }
        },
        methods: {
            addDialogClose: function (data) {
                this.isShowAddDialog = false;
                this.getList(0);
                this.getBuildingsMessage(this.buildingsId);
            },
            clickModify: function (item) {
                this.isShowAddDialog = true;
                this.dialogTitle = '配置住房人员';
                this.dialogType = 'modify';
                this.dialogData = item;
            },
            clickItem: function (item) {
                this.itemIndex = item.index;
                this.buildingsId = item.id;
                this.buildingName = item.building_name;
                this.getBuildingsMessage();
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
                        this.queryAjax();
                    }
                });
            },
            setStatus: function (status) {
                this.roomStatus = status == 0 ? '' : status;
                this.getList(1);
            },
            // 获取宿舍列表
            // -3顶部搜索 0 全部 1 满房 2 未满 3 空房
            getList: function (type) {
                //重置第一页
                if (type) {
                    itemOps.param.page = 1
                }
                this.getBuildingsMessage();
                this.queryAjax((tpageToal = '4', count = '0')=> {
                    this.initPage('#J-page', tpageToal, itemOps.param.page, count)
                });
            },
            queryAjax: function (callback = function () {
            }) {
                //修改参数
                this.isLoading = true;
                //修改参数
                $.ajax({
                    url: `${base.gAjaxUrl.rooms}occupancy_info/`,
                    type: 'GET',
                    data: {
                        page: itemOps.param.page,
                        page_size: itemOps.param.page_size,
                        building: this.buildingsId,
                        room_type: this.roomType,
                        room_no: this.roomNumber,
                        status: this.roomStatus,
                    }
                }).always((data)=> {
                    base.ajaxCallback(data, ()=> {
                        this.isLoading = false;
                        let resultData = data.results;
                        this.items = resultData;
                        if (resultData && resultData.length != 0) {
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
                }
                $.ajax({
                    url: base.gAjaxUrl.buildings,
                    type: 'GET',
                    data: ajaxData.param
                }).always((data)=> {
                    base.ajaxCallback(data, ()=> {
                        this.isLoading = false;
                        let resultData = data.results;
                        if (resultData && resultData.length) {
                            for (let i = 0; i < resultData.length; i++) {
                                resultData[i].index = i;
                            }
                            this.buildings = resultData;
                            // this.buildingsId = resultData[0].id;
                            // this.buildingName = resultData[0].building_name;
                            // this.currBuilding = resultData[0];
                            this.noData = false;
                            //回调
                            //callback();
                            this.getList();
                            this.getBuildingsMessage();
                        } else {
                            this.noData = true;
                        }
                    });
                })
            },
            getBuildingsMessage: function () {
                let that = this;
                $.ajax({
                    url: `${base.gAjaxUrl.rooms}rooms_stat/`,
                    type: 'GET',
                    data: {
                        building: that.buildingsId,
                        room_type: that.roomType,
                    }
                }).always((data)=> {
                    base.ajaxCallback(data, ()=> {
                        this.isLoading = false;
                        let resultData = data;
                        this.currBuilding = resultData;
                    });
                })
            },
            getRoomTypesList: function () {
                this.isLoading = true;
                $.ajax({
                    url: base.gAjaxUrl.roomtypes,
                    type: 'GET',
                    data: {
                        page_size: 999999,
                    }
                }).always((data)=> {
                    base.ajaxCallback(data, ()=> {
                        this.isLoading = false;
                        this.roomTypes = data.results;
                    });
                })
            },
            toggleLock: function (room) {
                console.log("room");
                console.log(room);
                let that = this;
                if (room.is_locking) {
                    layer.confirm(`房间解锁之后可以分配人员入住,确定解锁${room.room_no}这个房间吗？`, function () {
                        $.ajax({
                            url: `${base.gAjaxUrl.rooms}${room.id}/`,
                            type: "PUT",
                            contentType: 'application/json',
                            data: JSON.stringify({
                                room_no: room.room_no,
                                building: room.building,
                                room_type: room.room_type,
                                is_locking: false,
                            })
                        }).always((data)=> {
                            base.ajaxCallback(data, ()=> {
                                that.getList();
                            })
                        })
                        layer.closeAll("dialog");
                    })
                } else {
                    layer.confirm(`房间锁定之后将不能分配人员入住,确定锁定${room.room_no}这个房间吗？`, function () {
                        $.ajax({
                            url: `${base.gAjaxUrl.rooms}${room.id}/`,
                            type: "PUT",
                            contentType: 'application/json',
                            data: JSON.stringify({
                                room_no: room.room_no,
                                building: room.building,
                                room_type: room.room_type,
                                is_locking: true,
                            })
                        }).always((data)=> {
                            base.ajaxCallback(data, ()=> {
                                that.getList();
                            })
                        })
                        layer.closeAll("dialog");
                    })
                }
            },
            exportData: function () {
                this.isLoading = true;
                $.ajax({
                    url: `${base.gAjaxUrl.rooms}export_staff_statistics/`,
                    type: 'POST',
                    contentType: "application/json",
                    data: JSON.stringify({
                        building: this.buildingsId,
                        room_type: this.roomType,
                        room_no: this.roomNumber,
                        status: this.roomStatus,
                    })
                }).always(() => {
                    this.isLoading = false;
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
    .select-box, .input-text {
        width: 200px;
    }

    .search-box {
        display: inline-block;
        position: relative;
        .search-key {
            position: absolute;
            height: 33px;
            /*top: 3px;*/
            width: 70px;
        }
        .input-text {
            height: 33px;
            /*width: 0px;*/
            /*margin-left: 70px;*/
        }
    }

    .room-situation {

    }

    .icon_search {
        height: 34px;
        margin-left: -5px;
    }

    .materialclasses {
        width: 198px;
        border: 1px solid #eee;
        overflow: auto;
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
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }

    .materialclasses .item.curr {
        background-color: #e5e5e5;
    }

    .materialclasses .item.curr .name {
        color: #206afc
    }

    .materials {
        /*padding-left: 200px; */
        overflow: hidden;
        padding-left: 10px;
    }

    .type {
        position: relative;
        padding-left: 14px;
        margin-right: 10px;
    }

    .type i {
        color: #c9d1d9;
        position: absolute;
        top: 1px;
        left: 0;
        font-size: 10px;
    }

    .roomItem {
        float: left;
        width: 160px;
        height: 130px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        border: 1px solid #eee;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
    }

    .full {
        background-color: #ff3b6a !important;
        color: #fff;
    }

    .null-room {
        background-color: #f0f0f0 !important;
    }

    .notfull {
        background-color: #5bacfd !important;
        color: #fff;
    }

    .roomItem .icon-modify {
        position: absolute;
        top: 8px;
        right: 8px;
        display: inline-block;
        width: 20px;
        height: 20px;
    }
</style>