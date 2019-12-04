<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">图片编辑</div>
        <div class="layui-layer-content relative">
            <div class="img_box clearfix">
                <div class="img_item relative f-l" v-for="(index, item) in buildingimg_set">
                    <span @click="deleteItem(index)" class="del_btn">删除</span>
                    <img :src="item.url" alt="" class="img_url">
                    <input :value="item.name" @blur="setVal(index, $event)" alt="" class="img_name" type="text"/>
                </div>
            </div>
            <div class="btn_box">
                <a href="javascript:;" class="btn btn-primary btn_save" @click="save">保存</a>
            </div>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;"
               v-on:click="close()"></a>
        </span>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';

    export default{
        ready () {
            this.buildingimg_set = JSON.parse(JSON.stringify(this.data));
            console.log(this.buildingimg_set);
//            this.buildingimg_set = this.data;
        },
        data: function () {
            return {
                buildingimg_set: []
            }
        },
        props: ['data'],
        methods: {
            setVal: function (i, e) {
                this.buildingimg_set[i].name = $(e.srcElement).val();
            },
            deleteItem:function (index) {
                this.buildingimg_set.splice(index, 1);
            },
            save: function () {
                this.$dispatch("edit-save", this.buildingimg_set);
            },
            close: function () {
//                layer.confirm("是否保存修改", {title: "提示"}, (index)=> {
//                    this.save();
//                    layer.closeAll();
//                }, (index)=> {
                    this.$dispatch("edit-close");
//                    layer.closeAll();
//                })
            }
        },
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .layui-layer {
        position: absolute;
    }

    .img_box {
        margin-top: -20px;
        .img_item {
            margin-top: 30px;
            margin-left: 30px;
            width: 124px;
            height: 154px;
            .del_btn {
                position: absolute;
                right: 0;
                top: 0;
                cursor: pointer;
                padding: 0 10px;
                background-color: rgba(120, 120, 120, .5);
            }
            .img_url {
                width: 124px;
                height: 124px;
                box-sizing: border-box;
                border: 1px solid #ccc;
            }
            .img_name {
                width: 124px;
                height: 25px;
                margin-top: 5px;
                font-size: 12px;
                line-height: 25px;
                outline: none;
                border: 1px solid #ccc;
                border-radius: 3px;
                box-sizing: border-box;
                padding: 0 5px;
            }
        }
    }

    .btn_box {
        text-align: right;
        margin-top: 10px;
        padding: 5px 15px;
    }
</style>

