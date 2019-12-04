<template>
    <div class="selected-input-box" :class="[classObj]">
        <div class="department_select_container" @mouseleave="inputEnter(false)" @mouseenter="inputEnter(true)">
            <input v-if="arr.length === 0" disabled type="text" class="input-text" value="无可选择项">
            <input v-else autocomplete="off" @click="inputClick" v-model="keyname" type="text"
                   class="input-text" value="" placeholder="">
            <i v-show="keyname" class="empty-icon Hui-iconfont" @click="emptySearch()">&#xe60b;</i>
            <div class="departmentListBox" style="display: none">
                <div v-bind:title="item[key]" v-for="item in arr | filterBy keyname in key" @click="setValue(item)"
                     class="departmentListItem">{{item[key]}}
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .selected-input-box {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    export default{
        ready(){
            this.classObj = 'a' + Math.random().toFixed(16).slice(2, -1);
            this.keyname = this.name;
            this.$nextTick(() => {
                this.$list = $("." + this.classObj + " .departmentListBox");
            });
        },
        data: function () {
            return {
                keyname: '',
                lineFocus: false,
                $list: '',
                classObj: '',
            }
        },
        // arr 需要遍历的数组; key 关键字段，用于显示名称arr[i][key]；name 已经选择的 key 值
        props: ['arr', 'key', 'name', 'index'],
        methods: {
            inputEnter: function (flag) {
                this.lineFocus = flag;
                if (!flag) {
//                    this.save();
                    this.$list.hide();
                }
            },
            inputClick: function () {
                this.$list.show();
            },
            // 清除搜索输入框
            emptySearch: function () {
                this.keyname = '';
                this.$list.show();
                this.save();
            },
            setValue: function (item) {
                this.keyname = item[this.key];
                this.$list.hide();
                this.save();
            },
            getValue: function () {
                let sel = null;
                for (var i = 0; i < this.arr.length; i++) {
                    if (this.keyname == this.arr[i][this.key]) {
                        sel = this.arr[i];
                        break
                    }
                }
                return sel;
            },
            save: function () {
                this.$dispatch("sel", this.getValue(), this.index);
            }
        },
        watch: {
            name: function (n, o) {
//                console.log("name: ", n)
                this.keyname = n;
            },
            arr: function (n, o) {
                this.keyname = this.name
            }
        }
    }
</script>