<template>
    <div class="_select no-selected"
         :class="{'disabled': disabled}"
         @click.stop="clickSelect($event)">
        <div class="text-ellipsis _select-title"
             :title="options[selectIndex]">{{options[selectIndex]}}</div>
        <div class="_select-option-box"
             v-el:option_box
             v-show="isShowChildren">
            <div v-for="item in options"
                 :title="item"
                 track-by="$index"
                 @click.stop="clickOption($index)"
                 class="_select-option pointer">{{item}}
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        compiled () {
            // console.log("compiled")
            let n = Math.min(parseInt(this.len), 10);
            if(n > 0) {
                this.$els.option_box.style.maxHeight = (n * 31) + 'px'
            }
            this.data = this.data || [];

            // console.log('hash', this.hash, this.hash.length);
            this.hash += + new Date();

        },
        ready() {
            this.setOptions();
        },
        events: {
            bodyClick: function (parameter) {
                // console.log("bodyClick: ", parameter === '' ? '空' : parameter);
                if(parameter !== this.hash) {
                    this.isShowChildren = false;
                }
            },
        },
        watch: {
            data () {
                this.setOptions();
            }
        },
        data: function () {
            return {
                selectIndex: 0,
                options: [],
                isShowChildren: false,
                hash: Math.random().toString().slice(2, 18)
            }
        },
        /*
        * data 展示的数组
        * key 匹配默认值用的key
        * index 默认选中的索引
        * order 组件的引用索引：重复渲染多个选择框的时候会用到
        * len 最多显示的数量；最大值10个
        * */
        props: ['data', 'key', 'index', 'order', 'len', 'disabled'],
        methods: {
            setOptions () {
                // 配置默认值
                this.selectIndex = this.index || 0;
                this.key = this.key || 'value';
                let data = this.data;
                if(data.length && typeof data[0] !== 'string') {
                    this.options = data.map(item => item[this.key]);
                } else {
                    this.options = [...data];
                }
            },
            clickSelect (e) {
                // console.log("clickSelect")
                $globalApp.$broadcast('bodyClick', this.hash); // 这一段代码会先执行，然后执行events，然后再执行下面的代码
                if(this.disabled) return;
                this.isShowChildren = !this.isShowChildren;
                if(!this.options.length) {
                    layer.msg("无可选择项", {icon:2, time: 1500})
                }
            },
            clickOption (index) {
                if(this.disabled) return;
                this.isShowChildren = false;
                this.selectIndex = index;
                this.$dispatch("save", this.data[index], index, this.order);
            },
        },
        components: {}
    }

    // 可以传入的两种数据结构
    // 第二种需要处理一下
    // let data = ['全部', '选项一', '选项二', '选项三', '选项四'];
    // let data = [
    //     {
    //         value: '全部', // 这个对象对应的key值是 value
    //         ... // 一些其他 <属性: 属性值>
    //     },
    //     ...
    // ]
    /*
        调用方式：

        <o-sel :data="areaOptions"
               class="radius" // 加圆角
               key="area_name"
               :disabled="!isAdd"
               :len="6"
               :index="selectAreaIndex"
               @save="onSearchChange"></o-sel>

    */
</script>

<style lang="less" scoped rel="stylesheet/less">
    @height: 31px;
    @top: 30px;
    @icon_top: 12px;
    ._select {
        height: @height;
        position: relative;
        line-height: @height;
        font-size: 14px;
        width: 100%;
        color:#858c96;
        cursor: pointer;
        box-sizing: border-box;
        padding-left: 10px;
        background: #ffffff;
        border: 1px solid #ddd;
        .radius {
            border-radius: 4px;
        }
        &.disabled {
            background-color: #e9e9e9;
        }
        ._select-option-box{
            position: absolute;
            left:-1px;
            top: @height;
            width: 100%;
            max-height: 200px;
            overflow: auto;
            z-index: 999;
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
            border: 1px solid #d7d7d7;
            border-top:none;
            background-color: #fff;
            ._select-option {
                height: @height;
                background: #ffffff;
                font-size: 14px;
                color:#858c96;
                box-sizing: border-box;
                padding-left: 10px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                &.active {
                    background: #f7f6f9;
                    color:#4a4a4a;
                }
                /*&:hover{*/
                /*    background: #f7f6f9;*/
                /*    color:#4a4a4a;*/
                /*}*/
            }
        }
        &::after {
            content: "";
            position: absolute;
            right: 10px;
            top: @icon_top;
            border-top: 8px solid transparent;
            border-bottom: 8px solid transparent;
            border-left: 3px solid transparent;
            border-right: 3px solid transparent;
            border-top-color: #333;
        }
        ._select-title {
            box-sizing: border-box;
            padding-right: 35px;
        }
    }
</style>

