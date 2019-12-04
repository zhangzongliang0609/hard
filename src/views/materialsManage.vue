<template>
    <stock :type="stockType" :data="stockMsg" v-if="showStock" @dialog-close="closeStock"
           @dialog-save="materialsSave"></stock>
    <add v-if="showMaterialsManage" @add-goods-close="closeAddGoods" @add-goods-save="saveAddGoods"
         :materials_type="materialsType" :type="materialsTypeArr" :data="compileData"></add>
    <sel :id="materialsType" :items="materialsTypeArr" v-if="isShowSelected" v-on:dialog-close="selClose"
         v-on:dialog-save="sendExport"></sel>
    <section class="Hui-article-box" @click="clickSpace" style=" overflow-x: hidden;">
        <div v-show="globalImageSrc" id="previewWindow">
            <img id="previewWindowImage" v-bind:src="globalImageSrc"/>
            <span @click="closeImagePreview" class="close-btn-img">x</span>
        </div>
        <div class="m-top">
            <h3>物资管理</h3>
            <div class="f-r">
                <a href="javascript:;" id="typeManage" class="btn btn-success  radius mr-5" @click="showAdd">类目管理</a>
                <a href="javascript:;" class="btn btn-success  radius mr-5" @click="addMaterials">添加物资</a>
                <a href="javascript:;" class="btn btn-secondary radius mr-5" @click="turnToImport">批量导入</a>
                <a id="exportData" class="btn btn-secondary radius" v-on:click="exportData()">批量导出</a>
                <!--<a href="javascript:;" id="downData" class="btn btn-primary radius mr-5" @click="showDownData">导出数据</a>-->
                <!--<div v-show="isShowDownData" class="down-data mt-10" transition="rightEnter">-->
                <!--<a href="javascript:;" class="btn btn-primary radius" @click="down">导出全部</a>-->
                <!--<a href="javascript:;" class="btn btn-primary radius" @click="down(1)">导出当前类型</a>-->
                <!--</div>-->
            </div>
        </div>
        <div class="m-container">
            <div class="m-type">
                    <span v-for="(index, item) in materialsTypeArr" track-by="$index"
                          @click="getMaterialsList(item.id,$index)"
                          :class="['btn', 'btn-primary' , 'radius',  materialsIndex == $index ? 'active' : '']">
                        {{item.type_name}}
                    </span>
            </div>
            <div class="m-list">
                <table class="table table-border table-bordered table-hover table-bg table-sort">
                    <thead>
                    <tr class="text-c">
                        <th>名称</th>
                        <th>图片</th>
                        <th>规格型号</th>
                        <th>单位</th>
                        <th>库存</th>
                        <th>单价(元)</th>
                        <th>合计(元)</th>
                        <th>备注</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="text-c" v-for="item in materialsList">
                        <td>{{item.name}}</td>
                        <td class="goods_img_td">
                            <img v-if="item.url" class="goods_img" @click="previewImage(item.url)" v-bind:src="item.url"
                                 alt="">
                            <span v-else>此物品暂时没有图片</span>
                        </td>
                        <td>{{item.format}}</td>
                        <td>{{item.unit}}</td>
                        <td>
                            <a href="javascript:;" class="Hui-iconfont" @click="stock(item,'reduce')">&#xe6a1;</a>
                            {{item.stock}}
                            <a href="javascript:;" class="Hui-iconfont" @click="stock(item,'add')">&#xe600;</a>
                        </td>
                        <td>{{item.price}}</td>
                        <td>{{item.total_price || 0}}</td>
                        <td class="td-remark">{{item.remark}}</td>
                        <td class="f-14">
                            <a title="编辑" href="javascript:;" class="ml-5" v-on:click="compile(item)"><i
                                    class="Hui-iconfont">&#xe6df;</i></a>
                            <a title="删除" href="javascript:;" class="ml-5" v-on:click="deleteBtn(item)"><i
                                    class="Hui-iconfont">&#xe6e2;</i></a>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div class="no-data text-c message_list_item" v-show="noData">没有相关数据</div>
                <div class="message_options clearfix">
                    <div class="message_page f-r clearfix">
                        <div id="J-page" class="m-page mr-10 mt-10" v-show="!noData"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <div v-show="isShow" class="addMaterialsType" transition="rightEnter">
        <div class="materials-type-top">
            <div class="add-title f-16 c-black">添加类目</div>
            <a class="close-add f-16 Hui-iconfont c-red " href="javascript:;" v-on:click="closeAdd()">&#xe6a6;</a>
        </div>
        <div class="addMaterials-content">
            <div class=" ml-20 mr-20 f-16">
                <ul class="category-manage-list">
                    <li class="f-15" v-for="data in materialsTypeArr">
                        <div class="type-name">
                            <span class="" v-show="$index !== currentIndex || showChange">{{data.type_name}}</span>
                            <input v-model="inputData" class="category-input f-14" type="text"
                                   v-show="!showChange && $index === currentIndex">
                        </div>
                        <div class="operate f-r">
                            <a class="mr-5" style="color:#5a98de;" href="javascript:;"
                               @click="changeType($index,data.type_name)" v-show="showChange">修改</a>
                            <a class="mr-5" href="javascript:;" @click="saveChange(data.id)"
                               v-show="!showChange && $index === currentIndex">完成</a>
                            <a href="javascript:;" class="c-red" v-show="showChange" @click="deleteType(data.id)">删除</a>
                            <a href="javascript:;" class="c-red" v-show="!showChange && $index === currentIndex"
                               @click="closeChange">取消</a>
                        </div>
                    </li>
                </ul>
            </div>
            <div v-show="showChange" class="text-c" @click="addType">
                <img class="add-icon" src="../assets/images/icon-add.png" alt="">
                <a href="javascript:;">添加新类目</a>
            </div>
        </div>
    </div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>

<style lang="less" rel="stylesheet/less" scoped>


    .goods_img_td {
        padding: 2px 0;
    }

    .goods_img {
        width: 35px;
        height: 35px;
        display: inline-block;
        vertical-align: middle;
    }

    .td-remark {
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .td-remark:hover {
        white-space: normal;
    }

    .m-top {
        position: relative;
        padding-bottom: 10px;
        height: 75px;
        border-bottom: 1px solid #999999;
        h3 {
            position: absolute;
            left: 30px;
            top: 10px;
            img {
                height: 30px;
                width: 30px;
                margin-right: 10px;
            }
        }
        div {
            position: absolute;
            right: 0;
            top: 30px;
        }
    }

    .m-container {
        height: 85%;
        overflow-y: auto;
        position: absolute;
        left: 0;
        right: 0;
        top: 90px;
        bottom: 0;
        .m-type {
            max-height: 98%;
            overflow-y: auto;
            width: 140px;
            padding: 2px;
            white-space: normal;
            span {
                width: 100%;
                min-height: 45px;
                padding: 18px 0;
                text-align: center;
                border-bottom: 1px solid #f8f8f8;
                white-space: normal;
            }
            span:last-child {
                border-bottom: none;
            }
        }
        .m-list {
            position: absolute;
            left: 147px;
            top: 0px;
            bottom: 0px;
            right: 3px;
        }
    }

    .addMaterialsType {
        width: 350px;
        overflow-y: hidden;
        position: absolute;
        right: 5px;
        background-color: white;
        top: 130px;
        z-index: 2;
        border-radius: 8px;
        border: 1px solid #ccc;
        box-shadow: 5px 5px #c4c4c4;
        padding-bottom: 10px;
        /*padding: 5px;*/
        .close-add {
            position: absolute;
            top: 0px;
            right: 5px;
        }
        .category-manage-list {
            margin: 10px 0;
            max-height: 600px;
            overflow-y: auto;
            .type-name > span {
                display: inline-block;
                width: 200px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .type-name > span:hover {
                white-space: normal;
            }
        }
        .materials-type-top {
            line-height: 50px;
            height: 50px;
            padding: 0 10px;
            background-color: #f2f2f2;
            border-bottom: 1px solid #999;
        }
        .category-input {
            border: 1px solid #cccccc;
            width: 100%;
            height: 28px;
            padding-left: 5px;
            border-radius: 5px;
            border: 1px solid #ccc;

        }
    }

    .category-manage-list {
        li {
            position: relative;
            min-height: 35px;

            .type-name {
                display: inline-block;
            }
            .operate {
                display: inline-block;
            }
        }
    }

    .add-icon {
        width: 20px;
        height: 20px;
    }

    .message_options {
        /*height: 60px;*/
        width: 100%;
    }

    .m-page {
        padding: 0;
    }

    #J-page {
        padding: 0;
    }

    // vue动画类名
    .rightEnter-transition {
        transition: all 0.3s;
    }

    .rightEnter-enter {
        transform: translateX(360px);
    }

    .rightEnter-enter-active {

        transform: translateX(0px);
    }

    .rightEnter-leave {
        transform: translateX(360px);
    }

    .rightEnter-leave-active {
        display: none;
    }

    .btn {
        height: auto;
    }

    .down-data {
        position: absolute;
        z-index: 10;
        width: 200px;
        height: 40px;
        line-height: 40px;
        background-color: white;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import sel from '../components/selectGoods.vue';
    import add from '../components/addGoods';
    import stock from '../components/materilasStock';

    let materialsOps = null;

    export default{
        ready(){
            materialsOps = {
                param: {
                    search: '',
                    page: 1,
                    page_size: 10,
                }
            };
            this.getMaterialsTypeList();
        },
        data: function () {
            return {
                materialsType: '', // 记录当时被选中的类型
                materialsTypeArr: [],
                materialsList: [],
                currentIndex: '',  // 当前点击类目索引
                inputData: '', // 输入框显示的数据,
                isShow: false,
                showChange: true,
                showMaterialsManage: false,
                isShowSelected: false, // 是否显示选择框
                itemsLoading: false,
                noData: false,
                materialsIndex: 0,
                compileData: '',// 编辑物资的数据
                globalImageSrc: '',
                isShowDownData: false, // 选择数据导入的类型的盒子
                stockType: '', // 库存管理类型
                showStock: false,
                stockMsg: '', // 库存管理时传进去的数据

            }
        },
        methods: {
            initPage: function (obj, tpageToal = '4', count = '0', current = '1') {
                $(obj).createPage({
                    pageCount: tpageToal,
                    current: current,
                    count: count,
                    callback: (p)=> {
                        materialsOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            queryAjax: function (id = this.materialsType, callback = () => {
            }) {
                this.materialsType = id;
                this.itemsLoading = true;
                //修改参数
                $.ajax({
                    url: `${base.gAjaxUrl.materialsList}?type=${id}`,
                    type: 'GET',
                    data: materialsOps.param
                }).always((data)=> {
                    base.ajaxCallback(data, ()=> {
                        let resultData = data.results;
                        this.itemsLoading = false;
                        this.materialsList = resultData;
                        if (resultData.length) {
                            this.noData = false;
                            //回调
                            callback(data.num_pages, data.count)
                        } else {
                            this.noData = true;
                        }
                    });
                })
            },
            getMaterialsTypeList: function (type) {
                let that = this;
                this.itemsLoading = true;
                $.ajax({
                    url: `${base.gAjaxUrl.materialsTypes}`,
                    type: 'GET',
                }).always((data) => {
                    base.ajaxCallback(data, function () {
                        that.itemsLoading = false;
                        that.materialsTypeArr = data;
                        if (data.length) {
                            if (type == "add") {
                                that.materialsIndex = that.materialsTypeArr.length - 1;
                                that.queryAjax(that.materialsTypeArr[that.materialsTypeArr.length - 1].id, (tpageToal = '4', count = '0')=> {
                                    that.initPage('#J-page', tpageToal, count)
                                });
                            } else if (type == "change") {
//                                that.queryAjax(that.materialsTypeArr[that.materialsIndex].id, (tpageToal = '4', count = '0')=> {
//                                    that.initPage('#J-page', tpageToal, count)
//                                });
                            } else {
                                that.queryAjax(that.materialsTypeArr[0].id, (tpageToal = '4', count = '0')=> {
                                    that.initPage('#J-page', tpageToal, count)
                                });
                                that.materialsIndex = 0;
                            }
                        } else {
                            that.noData = true;
                        }
                    });
                })
            },
            deleteBtn: function (data) {
                let that = this;
                layer.confirm('删除须谨慎，确认要删除这个' + data.name + '物资吗？', ()=> {
                    $.ajax({
                        url: `${base.gAjaxUrl.materialsList}${data.id}/`,
                        type: 'DELETE',
                    }).always(()=> {
                        that.itemsLoading = false;
                        layer.closeAll('dialog');
                        that.getMaterialsList();
                    })
                });

            },
            changeType: function (index, data) {
                this.currentIndex = index;
                this.inputData = data;
                this.showChange = false;
            },
            showAdd: function () {
                this.isShow = !this.isShow;
            },
            closeAdd: function () {
                if (!this.showChange) {
                    layer.msg("您有未保存项，请先保存", {icon: 2, time: 2000});
                    return;
                }
                this.isShow = false;
            },
            saveChange: function (id = '') {
                if (!this.inputData) {
                    layer.msg("类别名称不能为空", {icon: 2, time: 2000});
                    return
                }
                else if (this.inputData.length > 35) {
                    layer.msg("类别名称不能超过35个字符", {icon: 2, time: 2000});
                    return
                }
                this.itemsLoading = true;
                // 用id判断是新增还是修改
                if (id) {
                    $.ajax({
                        url: `${base.gAjaxUrl.materialsTypes}${id}/`,
                        type: 'PATCH',
                        data: {
                            "type_name": this.inputData
                        },
                    }).always((data)=> {
                        base.ajaxCallback(data, ()=> {
                        })
                        this.itemsLoading = false;
                        this.getMaterialsTypeList("change");
                    })
                } else {
                    $.ajax({
                        url: `${base.gAjaxUrl.materialsTypes}`,
                        type: 'POST',
                        data: {
                            type_name: this.inputData
                        },
                    }).always((data)=> {
                        this.itemsLoading = false;
                        base.ajaxCallback(data, ()=> {
                        })
                        this.getMaterialsTypeList("add");
                    })
                }

                this.showChange = true;
            },
            closeChange: function () {
                this.getMaterialsTypeList();
                this.showChange = true;
            },
            addType: function () {
                this.inputData = "";
                this.materialsTypeArr.push({type: ""});
                this.currentIndex = this.materialsTypeArr.length - 1;
                this.showChange = false;
            },
            deleteType: function (id) {
                layer.confirm('删除须谨慎，确认要删除这个类别吗？', ()=> {
                    this.itemsLoading = true;
                    $.ajax({
                        url: `${base.gAjaxUrl.materialsTypes}${id}/`,
                        type: 'DELETE',
                    }).always((data)=> {
                        this.getMaterialsTypeList();
                    })
                    layer.closeAll('dialog')
                });
            },
            closeAddGoods: function () {
                this.showMaterialsManage = false;
//                this.getMaterialsList();
//                this.queryAjax((tpageToal='4',count='0')=>{
//                    this.initPage('#J-page',tpageToal,count)
//                });
            },
            saveAddGoods: function () {
                this.showMaterialsManage = false;
                this.queryAjax(this.materialsType, (tpageToal = '4', count = '0')=> {
                    this.initPage('#J-page', tpageToal, count, materialsOps.param.page)
                });
            },
            addMaterials: function () {
                this.compileData = '';
                this.showMaterialsManage = true;
            },
            showDownData: function () {
                this.isShowDownData = !this.isShowDownData;
            },
            down: function (i) {
                let that = this;
                let currentType = '';
                if (i == 1) {
                    currentType = this.materialsType;
                }
                $.ajax({
                    url: `${base.gAjaxUrl.materialsList}data/?type=${currentType}`,
                    type: "POST"
                }).always((data)=> {
                    base.ajaxCallback(data, function () {
                        that.$route.router.go({path: '/job'})
                    })
                })

            },
            getMaterialsList: function (id = this.materialsType, currentIndex = this.materialsIndex) {
                this.materialsIndex = currentIndex;
                this.materialsType = id;
                materialsOps.param.page = 1;
                this.queryAjax(id, (tpageToal = '4', count = '0')=> {
                    this.initPage('#J-page', tpageToal, count)
                });
            },
            compile: function (data) {
                this.compileData = data;
                this.showMaterialsManage = true;
            },
            closeImagePreview: function (e) {
                this.globalImageSrc = "";
            },
            previewImage: function (src) {
                this.globalImageSrc = src;
            },
            clickSpace: function (e) {
                let target = $(e.target);
                if (!target.hasClass("addMaterials-content") && e.target.id != "typeManage") {
                    this.isShow = false;
                }
                if (!target.hasClass("down-data") && e.target.id != "downData") {
                    this.isShowDownData = false;
                }
            },
            stock: function (msg, type) {
                this.stockType = type;
                this.stockMsg = msg;
                this.showStock = true;
            },
            closeStock: function () {
                this.showStock = false;
            },
            materialsSave: function () {
                this.showStock = false;
                this.queryAjax();
            },
            turnToImport: function () {
                this.$router.go({
                    path: '/importMould',
                    name: 'importMould',
                    query: {
                        importType: 'goods'
                    }
                })
            },
            exportData: function () {
                this.isShowSelected = true;
            },
            selClose: function () {
                this.isShowSelected = false;
            },
            sendExport: function (idsArr) {
                this.itemsLoading = true;
                this.selClose();
                $.ajax({
                    url: `${base.gAjaxUrl.materialsList}export/`,
                    type: 'POST',
                    contentType: "application/json",
                    data: JSON.stringify({
                        type: idsArr
                    }),
                }).always((data)=> {
                    this.itemsLoading = false;
                    this.$route.router.go({path: '/job'});
                    // layer.msg('最新的一条数据请重新刷新哦',{icon:1,time:3000});
                })
            }
        },
        filters: {},
        components: {sel, add, stock}
    }
</script>