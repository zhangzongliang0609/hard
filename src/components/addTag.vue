<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title fw-b">员工标签设置</div>
        <div class="layui-layer-content pl-20 pr-20">
            <div v-show="isShow" class="addTags">
                <div class="f-14">
                    <ul class="tags-manage-list">
                        <li class="f-16 clearfix" v-for="data in tagsArr">
                            <div class="operate f-r pr-20">
                                <a class="f-r btn btn-secondary radius mt-5" href="javascript:;" v-if="!showChange && currentTagId === data.id"
                                   @click="closeChange(data)">取消</a>
                                <a class="mr-10 f-r btn btn-success radius mt-5" href="javascript:;" v-if="!showChange && currentTagId === data.id"
                                   @click="saveChange(data)">保存</a>
                                <a class="f-r btn btn-danger radius mt-5" href="javascript:;" v-if="showChange"
                                   @click="deleteTag(data)">删除</a>
                                <a class="mr-10 f-r btn btn-secondary radius mt-5" href="javascript:;" v-if="showChange"
                                   @click="changeType(data)">修改</a>
                            </div>
                            <div class="tag_name f-l">
                                <div v-if="currentTagId !== data.id || showChange" class="text-ellipsis pl-5"
                                     title="{{data.name}}">{{data.name}}
                                </div>
                                <input v-if="currentTagId === data.id && !showChange" v-model="inputData" maxlength="15"
                                       class="tags-input pl-5 f-16" type="text">
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="text-c lh-30 mt-20" v-show="showChange">
                    <a @click="addTag" href="javascript:;" class="btn btn-secondary radius mb-30">
                        <!--<i class="Hui-iconfont">&#xe600;</i>-->
                        添加新标签
                    </a>
                </div>
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

<style lang="less" scoped rel="stylesheet/less">
    .layui-modify {
        width: 400px;
    }

    a {
        text-decoration: none !important;
    }

    .layui-layer-content {
        box-sizing: border-box;
    }

    .tags-manage-list {
        li {
            position: relative;
            width: 360px;
            .tag_name {
                width: 200px;
                box-sizing: border-box;
                display: inline-block;
                height: 40px;
                line-height: 40px;
            }
            .operate {
                width: 160px;
                height: 40px;
                line-height: 40px;
                box-sizing: border-box;
                display: inline-block;
            }
        }
    }

    .addTags {
        width: 100%;
        background-color: white;
        /*border-radius: 8px;*/
        /*border: 1px solid #ccc;*/
        padding-bottom: 10px;
        position: relative;
        .tag_name {
            width: 200px;
            div {
                display: inline-block;
                width: 200px;
            }
            div:hover {
                white-space: normal;
            }
            .tags-input {
                width: 200px;
                height: 40px;
                box-sizing: border-box;
                border-radius: 5px;
                border: 1px solid #ccc;

            }
        }
    }

    .add-icon {
        width: 20px;
        height: 20px;
        vertical-align: middle;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';

    export default{
        ready () {
            base.verticalCenter(".layui-modify");
            this.getTagList();
        },
        props: [],
        data: function () {
            return {
                isShow: true,
                showChange: true,
                inputData: '',
                tagsArr: [],
                currentTagId: '',
                itemsLoading: false,
            }
        },
        methods: {
            close: function () {
                this.$dispatch('dialog-close');
            },
            getTagList: function () {
                this.itemsLoading = true;
                $.ajax({
                    url: base.gAjaxUrl.staffsTag,
                    type: 'GET',
                    data: {
                        page: 1,
                        page_size: 999999,
                    }
                }).always((data)=> {
                    this.itemsLoading = false;
                    this.showChange = true;
                    base.ajaxCallback(data, ()=> {
                        this.tagsArr = data.results || [];
                    })
                });
            },
            addTag: function () {
                console.log("addTag");
                if (!this.showChange) {
                    layer.msg("请先保存", {icon: 2, time: 2000});
                    return;
                }
                console.log("addTag over");
                this.inputData = "";
                let id = ("" + Math.random()).slice(2, 8);
                this.currentTagId = id;
//                this.tagsArr.unshift({
                this.tagsArr.push({
                    id: id,
                    tag_name: "",
                    is_new_add: true,
                });
                this.showChange = false;
            },
            deleteTag: function (data) {
                let that = this;
                layer.confirm('删除须谨慎，确认要删除这个类别吗？', (index)=> {
                    that.itemsLoading = true;
                    $.ajax({
                        url: `${base.gAjaxUrl.staffsTag}${data.id}/`,
                        type: 'DELETE',
                    }).always((data)=> {
                        that.itemsLoading = false;
//                        console.log("delete: ");
//                        console.log(data);
                        base.ajaxCallback(data, ()=> {
                            layer.msg("删除成功", {icon: 1, time: 1500});
                            that.getTagList();
                        })
                    });
                    layer.close(index);
                });
            },
            changeType: function (data) {
                this.currentTagId = data.id;
                this.inputData = data.name;
                this.showChange = false;
            },
            saveChange: function (data) {
                console.log(data);
                if (this.inputData === "") {
                    if (data.is_new_add && data.tag_name === "") {
//                        this.tagsArr.shift();
                        this.tagsArr.pop();
                        this.currentTagId = "";
                    } else {
                        layer.msg("请输入名称", {icon: 2, time: 1000})
                    }
                    this.showChange = true;
                    return;
                } else {
                    data.tag_name = this.inputData;
                }
//                console.log(this.tagsArr);
                this.itemsLoading = true;
                let ajaxParam = null;
                let ajaxData = {
                    name: this.inputData
                };
                if (data.is_new_add) { // 新增的标签
                    ajaxParam = {
                        url: base.gAjaxUrl.staffsTag,
                        type: 'POST',
                        data: ajaxData,
                    };
                } else { // 修改原标签
                    ajaxParam = {
                        url: `${base.gAjaxUrl.staffsTag}${data.id}/`,
                        type: 'PUT',
                        data: ajaxData,
                    };
                }
                $.ajax(ajaxParam).always((callbackData)=> {
                    this.itemsLoading = false;
                    this.showChange = true;
                    base.ajaxCallback(callbackData, ()=> {
                        layer.msg("保存成功", {icon: 1, time: 1500});
                        this.getTagList();
                    })
                });
            },
            closeChange: function (data) {
                if (data.is_new_add) {
//                    this.tagsArr.shift();
                    this.tagsArr.pop();
                }
                this.currentTagId = "";
                this.showChange = true;
            },
            checkPosition: function (e, flag) {
                if (flag) return;
                let target = e.srcElement ? e.srcElement : e.target;
                let $this = $(target);
                if ($this.hasClass("top") || $this.hasClass("bottom")) return;
                let $parent = $this.parents(".fixedParent");
                let $tagBox = $this.children(".tag_second_box");
                // $tagBox.offset().top + $tagBox.outerHeight() > $parent.offset().top + $parent.outerHeight() 判断向下不能显示完
                // $this.offset().top - $parent.offset().top < $this.find(".tag_second_box_sign").outerHeight() + $tagBox.outerHeight().outerHeight() 判断向上不能显示完
                if ($tagBox.offset().top + $tagBox.outerHeight() > $parent.offset().top + $parent.outerHeight() && $this.offset().top - $parent.offset().top < $this.find(".tag_second_box_sign").outerHeight() + $tagBox.outerHeight()) {
                    // 防止重复添加minHeight属性，选择添加最大值
                    var height = parseInt($parent.parent().css("minHeight"));
                    var currentHeight = $this.offset().top - $parent.offset().top + $this.find(".tag_second_box_sign").outerHeight() + $tagBox.outerHeight() + $this.parents("td").outerHeight();
                    if (currentHeight > height) $parent.parent().css({minHeight: currentHeight});
                    $this.removeClass("bottom top").addClass("bottom");
                } else if ($tagBox.offset().top + $tagBox.outerHeight() > $parent.offset().top + $parent.outerHeight()) {
                    $this.removeClass("bottom top").addClass("top");
                } else {
                    $this.removeClass("bottom top").addClass("bottom");
                }
            },
        },
        filters: {}
    }
</script>
