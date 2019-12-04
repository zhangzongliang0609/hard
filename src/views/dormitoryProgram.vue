<template>
    <section class="Hui-article-box">
        <div class="page-container bgc-f5">
            <div class="panel panel-default radius">
                <div class="panel-body f-20 fw-b clearfix">
                    <span class="f-l">项目管理</span>
                    <select v-model="searchType" class="searchType select ml-20 f-l">
                        <option value="name" selected>项目名称</option>
                        <option value="code">项目编号</option>
                    </select>
                    <div class="search-box f-l">
                        <input type="text" class="input-text" placeholder="请输入项目名称(代码)" v-model="searchInput">
                        <button v-on:click="getList(1)" class="btn btn-success icon_search radius-r" type="button"><i
                                class="f-l Hui-iconfont">&#xe665;</i></button>
                    </div>
                    <span class="f-r">
                        <a class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="clickAdd()">新增项目</a>
                    </span>
                </div>

            </div>
            <div class="bk-gray radius mt-10 clearfix bgc-fff">
                <div class="pd-15 clearfix">

                    <!-- <div class="text-l clearfix f-r mr-15">
                        <input v-model="searchInput" type="text"  placeholder="名字/工号/手机号" style="width:250px" class="f-l input-text">
                        <button v-on:click="getList(1)" class="btn btn-success" type="button"><i class="f-r Hui-iconfont">&#xe665;</i></button>
                    </div> -->
                </div>
                <table class="table table-border table-bg table-striped">
                    <thead class="text-c">
                    <tr>
                        <th width="120">项目编号</th>
                        <th width="120">项目名称</th>
                        <th width="120">是否启用</th>
                        <th width="120">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="text-c" v-for="item in items">
                        <td>{{item.code || '--'}}</td>
                        <td>{{item.name || '--'}}</td>
                        <td>
                            <div @click="switchStatus(item)" class="switch_btn_bg" :class="{'_show': item.is_on}">
                                <div class="switch_btn_white"></div>
                            </div>
                        </td>
                        <td>
                            <a class="mr-10" href="javascript:;" v-on:click="clickModify(item)"><i class="Hui-iconfont">
                                &#xe6df;</i></a>
                            <a title="删除" href="javascript:;" class="ml-5" v-on:click="deleteItem(item)"><i
                                    class="Hui-iconfont">&#xe6e2;</i></a>
                        </td>
                    </tr>
                    </tbody>

                </table>
                <div id="J-page" class="m-page" v-show="items.length"></div>
                <div class="no-data text-c mt-50" v-if="!items.length">没有相关数据</div>
            </div>
        </div>
        <div class="m-loading" v-if="itemsLoading">
            <div class="cube1"></div>
            <div class="cube2"></div>
        </div>
        <div v-if="isShowAdd" class="add-box">
            <div class="layui-layer-title">{{isAdd ? '新增项目' : '编辑项目'}}</div>
            <div class="layui-layer-content">
                <div class="mt-15 cl">
                    <label class="form-label f-l text-r col-4"><span class="c-red">*</span>项目编号：</label>
                    <div class="formControls f-l col-6">
                        <input v-model="currentNo" type="text" class="input-text currentNo" value="" placeholder=""
                               name="currentNo">
                    </div>
                </div>
                <div class="mt-15 cl">
                    <label class="form-label f-l text-r col-4"><span class="c-red">*</span>项目名称：</label>
                    <div class="formControls f-l col-6">
                        <input v-model="currentName" type="text" class="input-text currentName" value="" placeholder=""
                               name="currentName">
                    </div>
                </div>
                <div class="mt-15 cl">
                    <label class="form-label f-l text-r col-4">是否启用：</label>
                    <div class="formControls f-l col-3">
                        <select name="" class="select-box" id="" v-model="v_is_on">
                            <option value="1">是</option>
                            <option value="0">否</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layui-layer-setwin">
                <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;"
                   v-on:click="close()"></a>
            </div>
            <div class="layui-layer-btn">
                <a class="layui-layer-btn0" href="javascript:;" @click="save">保存</a>
            </div>
        </div>
        <div v-show="isShowAdd" class="layui-layer-shade"></div>
    </section>
</template>

<script type="text/ecmascript-6">

    import * as base from '../assets/js/base.js';
    let itemOps = null;

    export default{
        ready(){
            itemOps = {
                param: {
                    page: 1,
                    page_size: 10,
                }
            };
            this.getList();
        },
        data: function () {
            return {
                itemsLoading: false,
                isShowAdd: false, // 是否显示添加弹窗
                items: [],
                searchInput: '',
                searchType: 'name',
                programName: '',
                isAdd: true, // 是否为新增
                currentName: '',
                currentNo: '',
                v_is_on: "1",
                currentId: '',
            }
        },
        methods: {
            save: function () {
                if (!this.isShowAdd && !this.currentId) {
                    layer.msg("未查询到对应项目", {icon: 2, time: 2000});
                    return;
                }
                if(!$(".currentNo").val()) {
                    layer.msg("请输入项目编号", {icon: 2, time: 2000});
                    return
                }
                if(!$(".currentName").val()) {
                    layer.msg("请输入项目名称", {icon: 2, time: 2000});
                    return
                }
                this.itemsLoading = true;
                $.ajax({
                    url: base.gAjaxUrl.project + (this.isAdd ? '' : this.currentId + '/'),
                    type: this.isAdd ? 'POST' : 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        name: this.currentName,
                        code: this.currentNo,
                        is_on: this.v_is_on == "1"
                    })
                }).always((data) => {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=> {
                        this.isShowAdd = false;
                        this.getList();
                    })
                })
            },
            close: function () {
                this.isShowAdd = false;
            },
            clickAdd: function () {
                this.currentName = '';
                this.currentNo = '';
                this.v_is_on = "1";
                this.currentId = '';
                this.isShowAdd = true;
                this.isAdd = true;
                setTimeout(function () {
                    $(".currentNo").focus();
                })
            },
            clickModify: function (item) {
                this.isShowAdd = true;
                this.isAdd = false;
                this.$nextTick(() => {
                    console.log("item: ", item.name);
                    this.currentName = item.name ||'';
                    this.currentNo = item.code ||'';
                    this.v_is_on = item.is_on ? "1" : "0";
                    this.currentId = item.id;
                    setTimeout(function () {
                        $(".currentNo").focus();
                    })
                });
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
            //获取列表
            getList: function (reset = 0) {
                let that = this;
                //重置第一页
                if (reset) {
                    itemOps.param.page = 1
                }
                this.queryAjax((tpageToal = '4', count = '0')=> {
                    this.initPage('#J-page', tpageToal, itemOps.param.page, count)
                });
            },
            queryAjax: function (callback = () => {}) {
                this.itemsLoading = true;
                let itemData = {
                    page: itemOps.param.page,
                    page_size: itemOps.param.page_size,
                };
                itemData[this.searchType] = this.searchInput;
                $.ajax({
                    url: base.gAjaxUrl.project,
                    type: 'GET',
                    data: itemData
                }).always((data)=> {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=> {
                        let resultData = data.results;
                        this.items = resultData;
                        if (resultData && resultData.length) {
                            callback(data.num_pages, data.count);
                        }
                    });
                })
            },
            //删除
            deleteItem: function (item) {
                layer.confirm(`确认要删除【${item.name}】吗？`, (index)=> {
                    this.itemsLoading = true;
                    $.ajax({
                        url: `${base.gAjaxUrl.project}${item.id}/`,
                        type: 'DELETE',
                    }).always((data)=> {
                        this.itemsLoading = false;
                        if(data) {
                            base.ajaxCallback(data)
                        } else {
                            layer.msg('删除成功！', {icon: 1, time: 1000});
                            if(this.items.length == 1 && itemOps.param.page > 1) {
                                itemOps.param.page--;
                            }
                            this.getList();
                        }
                    })
                });
            },
            switchStatus: function (item) {
                layer.confirm(`确认${item.is_on ? '关闭' : '启用'}【${item.name}】项目吗？`,(index)=>{
                    $.ajax({
                        url: base.gAjaxUrl.project + item.id + '/',
                        type: 'PUT',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            name: item.name,
                            code: item.code,
                            is_on: !item.is_on
                        })
                    }).always((data)=>{
                        base.ajaxCallback(data, () => {
                            layer.msg('修改成功！',{icon:1,time:1000});
                            this.getList();
                            layer.close(index);
                        })
                    })
                });
            }

        },
        components: {}
    }
</script>

<style lang="less" scoped rel="stylesheet/less">
    .search-box {
        font-weight: normal;
        .select-box {
            width: 100px;
            height: 31px;
            margin-right: -22px;
        }
        .input-text {
            width: 200px;
        }
        button {
            margin-left: -10px;
        }
    }

    .bgc-f5 {
        background-color: #f5f5f5;
    }

    .fw-b {
        font-weight: bold;
    }

    .add-box {
        position: absolute;
        width: 400px;
        height: 230px;
        z-index: 110;
        left: 50%;
        top: 50px;
        background-color: #fff;
        transform: translateX(-50%) scale(1);
        -webkit-animation: modify 0.3s ease;
        animation: modify 0.3s ease;
        .layui-layer-btn {
            position: absolute;
            right: 15px;
            bottom: 15px;
            padding: 0;
        }
    }
    .searchType {
        width: 100px;
        height: 31px;
        margin-top: 3px;
    }
    @-webkit-keyframes modify {
        from {
            opacity: 0.5;
            -webkit-transform: translateX(-50%) scale(0.3);
            transform: translateX(-50%) scale(0.3);
        }
        to {
            opacity: 1;
            -webkit-transform: translateX(-50%) scale(1);
            transform: translateX(-50%) scale(1);
        }
    }
    @keyframes modify {
        from {
            opacity: 0.5;
            -webkit-transform: translateX(-50%) scale(0.3);
            transform: translateX(-50%) scale(0.3);
        }
        to {
            opacity: 1;
            -webkit-transform: translateX(-50%) scale(1);
            transform: translateX(-50%) scale(1);
        }
    }
</style>