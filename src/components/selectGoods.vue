<template>
<div class="layui-layer layui-anim layui-layer-page layui-modify">
    <div class="layui-layer-title">物资类目导出</div>
    <div class="layui-layer-content">
        <a href="javascript:;" class="btn btn-primary ml-10 radius" @click="selectAll">全选</a>
        <div class="material_container clearfix">
            <div track-by="$index" @click="add(item.id)" :class="{'selected': isSelected(item.id)}" class="f-l material ml-10 mt-10" v-for="item in items">{{item.type_name}}</div>
        </div>
    </div>
    <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
    <div class="layui-layer-btn" v-on:click="save"><a class="layui-layer-btn0" v-if="type!='check'">确定</a></div>
</div>
<div class="layui-layer-shade"></div>
</template>

<script type="text/ecmascript-6">
import * as base from '../assets/js/base.js';

    export default{
        ready () {
            if(typeof this.id == 'string' && this.id.length) {
                this.selectArr.push(this.id);
            }
        },
        props: ['id', 'items'],
        data:function(){
            return {
                selectArr:[],
            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            save:function(){
                if(this.selectArr.length == 0) {
                    layer.confirm("未选择材料类型，默认会导出全部数据", (index) => {
                        this.$dispatch("dialog-save", this.selectArr);
                        layer.close(index);
                    })
                } else {
                    this.$dispatch('dialog-save', this.selectArr);
                }
            },
            add: function (id) {
                var index = this.selectArr.indexOf(id);
                if(index > -1) {
                    this.selectArr.splice(index, 1);
                } else {
                    this.selectArr.push(id);
                }
            },
            selectAll: function () {
                if(this.items.length == this.selectArr.length) {
                    this.selectArr = [];
                } else {
                    for(var i = 0, len = this.items.length; i < len; i++) {
                        var id = this.items[i].id;
                        if(this.selectArr.indexOf(id) == -1) {
                            this.selectArr.push(id);
                        }
                    }
                }
            },
            isSelected: function (id) {
                return this.selectArr.indexOf(id) > -1;
            }
        },
        filters: {
        }
    }
</script>

<style lang="less" scoped rel="stylesheet/less">
    .material_container {
        min-height: 300px;
        max-height: 500px;
        overflow-x: hidden;
        overflow-y: auto;
        .material {
            padding: 5px 10px;
            box-shadow: 0 0 0 1px #ccc inset;
            border-radius: 4px;
            cursor: pointer;
            box-sizing: border-box;
            &.selected {
                background-color: #00B4EE;
                color: #fff;
                box-shadow: 0 0 0 0 inset;
            }
        }
    }
</style>