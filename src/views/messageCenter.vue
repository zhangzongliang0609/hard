<template>
    <section class="Hui-article-box">
        <div class="m_container">
            <div class="nav_bar">
                <h2 class="page-title title text-c">消息中心</h2>
                <div @click="setMessageStatus(-1)" :class="['message_status', 'pl-30', messageStatus == -1 ? 'active' : '']">全部消息</div>
                <div @click="setMessageStatus(0)" :class="['message_status', 'pl-30', messageStatus == 0 ? 'active' : '']"> <span>未读消息</span> <span class="ml-10 label label-primary radius" v-show="unReadMessageNums != 0">{{unReadMessageNums}}</span> </div>
                <div @click="setMessageStatus(1)" :class="['message_status', 'pl-30', messageStatus == 1 ? 'active' : '']">已读消息</div>
            </div>
            <div class="message_container">
                <div class="message_type_text">全部消息</div>
                <div class="line"></div>
                <div class="message_list_title clearfix">
                    <span @click="setMessageType('')" :class="['btn', 'btn-primary', 'f-l', 'ml-10', 'message_type', 'radius', messageType ? '' : 'active']">
                        查看全部类型
                    </span>
                    <span v-for="(index, item) in messageTypeArr" track-by="$index" @click="setMessageType(item)" :class="['btn', 'btn-primary', 'f-l', 'ml-10', 'message_type', 'radius', messageType == item.type ? 'active' : '']">
                        {{item.type_name}} （{{item.count}}）
                    </span>
                </div>
                <div class="message_box">
                    <div class="message_list">
                        <div class="layer-container b-b">
                            <div class="layui-row clearfix b-t title lh-42 fs-18 tc">
                                <div class="col-1 f-l">选择</div>
                                <div class="col-3 f-l">标题</div>
                                <div class="col-5 f-l">内容</div>
                                <div class="col-3 f-l">时间</div>
                            </div>
                            <template v-for="(index, item) in messagesArr">
                                <div class="relative layui-row clearfix b-t tc message_list_item" :class="[item.is_read == 0 ? 'c-333' : 'c-999']" @click="showDetails(item)">
                                    <div class="relative check_box f-l col-1" @click="selectMessage(item.id, $event)">
                                        <div class="m_check_box">
                                            <ins v-show="item.id | contains" class="ins_checked"></ins>
                                        </div>
                                        <div class="point" v-show="item.is_read == 0"></div>
                                    </div>
                                    <div class="f-l col-3 text-ellipsis" title="{{item.title}}">
                                        {{item.title}}
                                    </div>
                                    <div class="relative f-l col-5 text-ellipsis" title="{{item.content}}">
                                        {{item.content}}
                                    </div>
                                    <div class="relative f-l col-3 text-ellipsis" title="{{item.ctime}}">
                                        {{item.ctime}}
                                    </div>
                                </div>
                            </template>
                            <div class="no-data text-c message_list_item b-t" v-show="noData">没有消息</div>
                        </div>
                        <div class="message_options clearfix">
                            <div class="message_select_options f-l clearfix relative pl-10">
                                <div class="select_all_btn" @click="selectAll">
                                    <ins v-show="selectMessageArr.length !== 0 && selectMessageArr.length == messagesArr.length" class="ins_checked"></ins>
                                </div>
                                <span @click="deleteMessages" class="message_delete btn btn-default radius f-l">删除</span>
                                <span v-show="messageStatus != 1" @click="setReadMessages" class="message_ready btn btn-default radius ml-10 f-l">标记已读</span>
                                <span v-show="messageStatus != 1" @click="allReadMessages" class="message_all_ready btn radius ml-10 f-l">全部已读(当前页)</span>
                            </div>
                            <div class="message_page f-r clearfix">
                                <div id="J-page" class="m-page mr-10" v-show="!noData"></div>
                            </div>
                        </div>
                    </div>
                    <div class="m-loading" v-if="itemsLoading">
                        <div class="cube1"></div>
                        <div class="cube2"></div>
                    </div>
                </div>
                </div>
            </div>
    </section>
    <details v-if="isShowDetails" :data="message" @dialog-close="closeDetails"></details>
</template>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import messageDetails from '../components/messageDetails';
    let staffsOps = null;

    export default{
        ready () {
            staffsOps = {
                param:{
                    is_read: 0,
                    page:1,
                }
            };
            this.getMessageTypes();
            this.setNoReadMessageNums();
            this.getList();
        },
        events: {
            refreshMessage: function () {
                this.getMessageTypes();
                this.getList(1);
//                this.setNoReadMessageNums();
            }
        },
        data:function(){
            return {
                noData:false,
                pageSize: 10, // 页面的数量，用于控制全选按钮的
                itemsLoading: false,
                messagesArr: [],
//                messagesArr: [
//                    {
//                        "id": "72aec979-fcb0-418e-a721-e744e331694d",
//                        "ctime": "2017-12-22 15:57:00",
//                        "mtime": "2018-01-31 10:47:01",
//                        "msg_type": "SHUTTLEBUS",
//                        "msg_id": "25d5c4b4-06e8-47a9-a752-b0b7112d26c9",
//                        "title": "班次已满员",
//                        "extra_param": null,
//                        "is_read": 1,
//                        "content": "22222 2017-12-19 11:30:00",
//                        "msg_type_name": "通勤车"
//                    },
//                    {
//                        "id": "67baeb8c-e060-4aa7-b6b4-73ed045637f1",
//                        "ctime": "2017-12-22 15:57:00",
//                        "mtime": "2017-12-22 15:57:00",
//                        "msg_type": "SHUTTLEBUS",
//                        "msg_id": "25d5c4b4-06e8-47a9-a752-b0b7112d26c9",
//                        "title": "班次已满员",
//                        "extra_param": null,
//                        "is_read": 0,
//                        "content": "22222 2017-12-19 11:30:00",
//                        "msg_type_name": "通勤车"
//                    },
//                    {
//                        "id": "ca9938ed-31f8-43fb-a1fb-acadd4c96b97",
//                        "ctime": "2017-11-24 20:38:14",
//                        "mtime": "2017-12-20 12:33:49",
//                        "msg_type": "SHUTTLEBUS",
//                        "msg_id": "2608a2f9-df7a-4cc6-bda2-ea0bd4633612",
//                        "title": "班次已满员",
//                        "extra_param": null,
//                        "is_read": 1,
//                        "content": "22222 2017-11-24 21:00:00",
//                        "msg_type_name": "通勤车"
//                    }
//                ],
                messageTypeArr: [],
                selectMessageArr: [],
                messageStatus: -1, // 消息状态
                messageType: '', // 消息类型
                statusChangeArr: [], // 用来存储传递给服务器，已读消息id的数组
                unReadMessageNums: 0, // 未读消息数量,
                isShowDetails: false, // 显示信息详情
            }
        },
        methods: {
            setNoReadMessageNums: function () {
                $.ajax({
                    url: base.gAjaxUrl.messages,
                    type: 'GET',
                    data: {
                        msg_type: this.messageType,
                        is_read: 0,
                        page: 1,
                        page_size: 1,
                    }
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
//                        console.log(data.count);
                        data && (this.unReadMessageNums = data.count);
                    });
                });
            },
            closeDetails: function () {
                this.isShowDetails = false;
            },
            showDetails:function (item) {
                this.isShowDetails = true;
                this.message = item;
                    $.ajax({
                        url: `${base.gAjaxUrl.messages}${item.id}/read/`,
                        type: 'GET',
                    }).always((data)=>{
                        base.ajaxCallback(data, ()=>{
                            this.getList();
                    });
                });
            },
            setMessageStatus: function (messageStatus) {
                if(messageStatus == this.messageStatus) return;
                staffsOps.param.page = 1;
                this.messageStatus = messageStatus;
                this.getList();
            },
            setMessageType: function (item) {
                if(item === this.messageType || (item && item.type === this.messageType)) return;
                if(item) {
                    this.messageType = item.type;
                } else {
                    this.messageType = "";
                }
                staffsOps.param.page = 1;
                this.getList();
            },
            selectMessage: function (id, e) {
//                console.log(id)
                let index = this.selectMessageArr.indexOf(id);
                index == -1 ? this.selectMessageArr.push(id) : this.selectMessageArr.splice(index, 1);
                if(e) {
                    e.stopPropagation()
                } else {
                    window.event.cancelBubble = true;
                }
            },
            selectAll: function () {
                if(this.selectMessageArr.length === this.messagesArr.length && this.selectMessageArr.length !== 0) {
                    this.selectMessageArr = [];
                } else {
                    let arr = [];
                    for(let i = 0, len = this.messagesArr.length; i < len;i++) {
                        arr.push(this.messagesArr[i].id);
                    }
                    this.selectMessageArr = arr;
                }
            },
            deleteMessages: function () {
                let that = this;
                if(that.selectMessageArr.length !== 0) {
                    layer.confirm('确认要删除选中的信息？', function (index) {
                        $.ajax({
                            url: base.gAjaxUrl.messagesDelete,
                            type: 'DELETE',
                            contentType: 'application/json',
                            data:JSON.stringify({
                                messages: that.selectMessageArr
                            })
                        }).always((data)=>{
                            if(that.selectMessageArr.length == that.messagesArr.length) {
                                staffsOps.param.page--;
                                staffsOps.param.page = staffsOps.param.page < 1 ? 1 : staffsOps.param.page;
                            }
                            base.ajaxCallback(data,()=>{
//                                console.log(data);
                                that.getList();
                            });
                        });
                        layer.close(index);
                    });
                } else {
                    layer.msg('没有选中消息',{icon: 2, time: 1000})
                }
            },
            setReadMessages: function () {

                let arr = [];
                for(let j = 0, len_j = this.selectMessageArr.length; j < len_j; j ++) {
                    let item_j = this.selectMessageArr[j];
                    for(let i = 0, len = this.messagesArr.length; i < len;i++) {
                        let item_i = this.messagesArr[i];
                        if(item_i.id === item_j && item_i.is_read === 0) arr.push(item_j);
                    }
                }
                let that = this;
//                if(that.selectMessageArr.length !== 0) {
                if(arr.length !== 0) {
                    layer.confirm('确认要标记选中的信息为已读？', function (_index) {
                        $.ajax({
                            url: base.gAjaxUrl.messagesReadAll,
                            type: 'POST',
                            contentType: 'application/json',
                            data:JSON.stringify({
    //                            messages: that.selectMessageArr
                                messages: arr
                            })
                        }).always((data)=>{
                            base.ajaxCallback(data, ()=>{
    //                            console.log(data);
                                if(arr.length == that.messagesArr.length) {
                                    staffsOps.param.page--;
                                    staffsOps.param.page = staffsOps.param.page < 1 ? 1 : staffsOps.param.page;
                                }
                                that.getList();
                            });
                        });
                        layer.close(_index);
                    })
                } else {
                    layer.msg('没有未读消息被选中',{icon: 2, time: 1500})
                }
            },
            allReadMessages: function () {
                let arr = [];
                for(let i = 0, len = this.messagesArr.length; i < len;i++) {
                    if(this.messagesArr[i].is_read === 0) arr.push(this.messagesArr[i].id);
                }
                if(arr.length === 0) {
                    layer.msg('当前页面没有未读消息',{icon: 2, time: 1000})
                    return;
                }
                let that = this;
                layer.confirm('确认要标记全部信息为已读？', function (_index) {
                    $.ajax({
                        url: base.gAjaxUrl.messagesReadAll,
                        type: 'POST',
                        contentType: 'application/json',
                        data:JSON.stringify({
                            messages: arr
                        })
                    }).always((data)=>{
                        base.ajaxCallback(data, ()=>{
                            if(arr.length === that.messagesArr.length && that.messageStatus == 0) {
                                staffsOps.param.page--;
                                staffsOps.param.page = staffsOps.param.page < 1 ? 1 : staffsOps.param.page;
                            }
                            that.getList();
                        })
                    })
                    layer.close(_index);
                })
            },
            //初始化分页
            initPage:function(obj,tpageToal='4',current='1',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:current,
                    count:count,
                    callback:(p)=>{
                        staffsOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax:function(callback=function(){}){
                this.itemsLoading = true;
                let para = this.messageStatus == -1 ? {
                    msg_type: this.messageType,
                    page: staffsOps.param.page,
                    page_size: this.page_size,
                }:{
                    is_read: this.messageStatus,
                    msg_type: this.messageType,
                    page: staffsOps.param.page,
                    page_size: this.page_size,
                };
//                console.log(para)
                $.ajax({
                    url: base.gAjaxUrl.messages,
                    type: 'GET',
                    data: para
                }).always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
                    let resultData = data.results;
                        this.messagesArr = [];
                        this.selectMessageArr = [];
                        this.messagesArr = resultData;
                        if(resultData.length){
                            this.noData = false;
                            //回调
                            callback(data.num_pages,data.count);
                        }else{
                            this.noData = true;
                        }
                    });
                });
            },
            getMessageTypes: function () {
                $.ajax({
                    url: base.gAjaxUrl.messagesTypes,
                    type: 'GET',
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
                        this.messageTypeArr = data;
                    });
                });
            },
            // 是否发布通知
            // 不传值表示发布通知到top.vue更新相关信息
            getList:function(isNotEmit){
                if(!isNotEmit) {
                    this.$emit('global', 'PB_MSG_REFRESH');
                }
                this.setNoReadMessageNums();
                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-page',tpageToal,staffsOps.param.page,count)
                });
            },
        },
        filters:{
            contains: function (para){
                return this.selectMessageArr.indexOf(para) > -1;
            },
            time: function (t) {
                return t ? t.slice(0, 10) : '--';
            }
        },
        components:{
            details: messageDetails,
        }
    }
</script>

<style rel="stylesheet/less" lang="less" scoped>
    .m_container {
        width: 100%;
        height: 100%;
    }
    .page-title {
        line-height: 100px;
    }
    .nav_bar {
        width: 180px;
        height: 100%;
        background-color: #f7f7f7;
        box-sizing: border-box;
        border-right: 1px solid #ccc;
    }
    .line {
        border-top: 1px solid #ccc;
    }
    .message_container {
        position: absolute;
        left: 180px;
        top: 0;
        bottom: 0;
        right: 0;
        padding: 15px 15px 50px;
    }
    .message_status {
        font-size: 16px;
        line-height: 40px;
        cursor: pointer;
    }
    .message_status:first-of-type {
        margin-top: 20px;
    }
    .message_status.active {
        background-color: #ccc;
    }
    .message_status span {
        vertical-align: middle;
    }
    .label.label-primary {
        line-height: 16px;
        margin: 5px;
    }
    .message_type_text {
        height: 15px;
        line-height: 15px;
        font-size: 14px;
        padding-left: 5px;
        margin: 20px 0;
        border-left: 5px solid #5a98de;
    }
    .message_list_title {
        padding: 10px 0;
    }
    .message_type {
        margin: 10px;
        font-size: 16px;
    }
    .message_bar_box {
        height: 30px;
        font-size: 16px;
        line-height: 30px;
        padding: 5px 10px;
        border: 1px solid #ccc;
        background-color: #f6f6f6;
    }
    .message_list {
        width: 100%;
        border: 1px solid #ccc;
        border-top: 0 none;
        box-sizing: border-box;
        .title {
            background-color: #f3f3f3;
        }
        .check_box {
            height: 50px;
        }
        .message_list_item {
            width: 100%;
            height: 50px;
            line-height: 50px;
            padding: 0 5px;
            box-sizing: border-box;
            position: relative;
            &:hover {
                background-color: #f7f7f7;
            }
        }
        .point {
            position: absolute;
            left: 36px;
            top: 50%;
            margin-top: -5px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: #5a98de;
        }
        .ins_checked {
            display: block;
            margin: 0;
            padding: 0;
            width: 18px;
            height: 18px;
            background: url('../../src/assets/js/icheck/blue.png') no-repeat -40px 0;
            border: none;
            cursor: pointer;
        }
        .m_check_box, .select_all_btn {
            width: 18px;
            height: 18px;
            position: absolute;
            left: 10px;
            top: 50%;
            margin-top: -10px;
            border: 1px solid #ccc;
        }
        .m_check_box:hover, .select_all_btn:hover {
            border-color: #5a98de;
        }
    }
    .message_options {
        width: 100%;
        .message_select_options {
            height: 60px;
        }
        .message_delete {
            margin-left: 44px;
        }
        .message_ready, .message_all_ready, .message_delete, .m-page {
            margin-top: 14px;
        }
        .message_all_ready {
            cursor: pointer !important;
            background-image: linear-gradient(#fefefe, #fefefe);
        }
        .message_all_ready:hover {
            background-image: linear-gradient(#eee, #eee);
        }
    }
    .m-page {
        padding: 0;
    }
    #J-page {
        padding: 0;
    }
    .b-t {
        border-top: 1px solid #ccc;
    }
    .b-b {
        border-bottom: 1px solid #ccc;
    }
    .h100 {
        height: 100%;
    }
    /*.b-r {*/
    /*border-right: 1px solid #ccc;*/
    /*}*/
    /*.b-l {*/
    /*border-left: 1px solid #ccc;*/
    /*}*/

</style>