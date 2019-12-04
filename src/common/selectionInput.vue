<template>
    <div class="select_container"
         @click="itemClick"
         @mouseleave="resetValue">
        <div class="input_box"
             v-if="originalData.length">
            <input v-else
                   autocomplete="off"
                   :title="searchInput"
                   v-model="searchInput"
                   type="text"
                   class="input-text"
                   value=""
                   placeholder="">
        </div>
        <div v-else class="tip_no_data">无可选择项目</div>
        <i v-show="searchInput !== ''"
           class="empty_icon Hui-iconfont"
           @click="emptySearch()">&#xe60b;</i>
        <div class="select_list"
             v-el:list
             style="display: none">
            <div v-bind:title="item[itemKey]"
                 v-for="item in items"
                 @click.stop="setSelectValue(item)"
                 class="select_item">{{item[itemKey]}}
            </div>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">

    /*
    items: 列表、子项必须包含value字段显示名称(也可以自定义key)
    items:[
        {
            value: '名称',
            ...
        }
    ]
    */

    export default {
        ready() {


            this.listDom = this.$els.list;

            if (this.key && typeof this.key === 'string') {
                this.itemKey = this.key
            }

        },
        props: ['options', 'key', 'order'],
        data: function () {
            return {
                searchInput: '',
                selectedItem: null,
                originalData: [], // 所有数据
                items: [], // 筛选后的数据
                listDom: null,
                itemKey: 'value',
            }
        },
        watch: {
            searchInput(n, o) {
                this.filterOptions();
            },
            options(n, o) {
                this.setOptions();
            }
        },
        methods: {
            setOptions() {
                if (this.options instanceof Array) {
                    this.originalData = this.options;
                    this.filterOptions();
                } else {
                    this.items = this.originalData = [];
                    this.setSelectValue(null);
                }
            },
            filterOptions() {
                this.items = this.originalData.filter(item => item[this.itemKey] && item[this.itemKey].indexOf(this.searchInput) > -1);
                this.resetValue();
            },
            showList(flag) {
                if (!this.listDom) return;
                if (flag) {
                    this.listDom.style = '';
                } else {
                    this.listDom.style = 'display: none';
                }
            },
            itemClick() {
                this.showList(true);
            },
            // 清楚搜索输入框
            emptySearch() {
                this.searchInput = '';
                this.showList(true);
            },
            resetValue() {
                let item = this.getItem();
                if (item !== this.selectedItem) {
                    this.setSelectValue(item);
                } else {
                    this.showList(false);
                }
            },
            setSelectValue(item) {
                this.selectedItem = item;
                if (item) {
                    this.searchInput = item[this.itemKey];
                }
                this.showList(false);
                this.$dispatch("selected", item, this.order);
            },
            getItem() {
                let val = this.searchInput;
                let item = null;
                this.originalData.every(data => {
                    if (data[this.itemKey] === val) {
                        item = data;
                        return false
                    }
                    return true
                });
                return item;
            }
        },
        filters: {},
    }

</script>

<style lang="less" scoped>
    .select_container {
        width: 100%;
        height: 100%;
        position: relative;
        box-sizing: border-box;

        &:after {
            position: absolute;
            display: block;
            content: "";
            right: 8px;
            top: 50%;
            z-index: 98;
            margin-top: -3px;
            border-top: 8px solid #333;
            border-left: 3px solid transparent;
            border-right: 3px solid transparent;
        }

        .input_box {
            width: 100%;
            box-sizing: border-box;
            padding-right: 50px;
            border: 1px solid #ddd;
            position: relative;
            z-index: 10;
            display: flex;
            align-items: center;
            input {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                width: 100%;
                height: 100%;
                position: relative;
                border: 0 none;
            }
        }
        .tip_no_data {
            padding: 0 5px;
            box-sizing: border-box;
            background-color: #ddd;
        }

        .empty_icon {
            position: absolute;
            display: block;
            right: 20px;
            top: 50%;
            z-index: 20;
            height: 30px;
            width: 30px;
            line-height: 30px;
            margin-top: -17px;
            color: #999999;
            font-size: 20px;
            cursor: pointer;
            text-align: center;

            &:hover {
                color: red;
            }
        }

        .select_list {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            height: 165px;
            box-sizing: border-box;
            z-index: 1;
            overflow-x: hidden;
            overflow-y: auto;
            border: 1px solid #ddd;
            border-top: none;
            background-color: #fff;
            padding-bottom: 10px;
            border-radius: 0 0 5px 5px;

            .select_item {
                padding: 4px;
                height: 15px;
                line-height: 15px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;

                &:hover {
                    background-color: #00B4EE;
                }
            }
        }
    }


</style>
