<!--
    params 举例:
    params: {
        department_name: '',
        id: '', // 通过匹配 id , 加背景颜色
        add: false, // 是否允许添加
        hidePeople: false, // 是否隐藏人数
        autoWidth: false, // 是否自动宽度 默认固定宽度220px
    }

-->

<template>
    <li>
        <div :class="{'folder': isFolder, 'bg-e': params.id === model.id }"
             @click.stop="departmentClick" @dblclick.stop="add">
            <span @click.stop="toggle" class="expand_01" :class="{open: open}"></span>
            <span class="expand_02" :class="{open: open}"></span>
            {{model.company_name}} <i v-if="!params.hidePeople">({{model.staff_cnt || 0}}人)</i>
            <span @click.stop="deleteClick" v-if="del" class="deleteBtn"><i class="Hui-iconfont">&#xe6e2;</i></span>
        </div>
        <ul v-show="open" v-if="isFolder" :class="{autoWidth: params.autoWidth}">
            <item v-on:item-click="itemClick" v-on:item-dbl="itemDblClick" v-on:item-del="itemDelete" class="item"
                  v-for="model in model.child" :model="model" :params="params"></item>
            <!-- <li class="add" @click="addChild">+</li> -->
        </ul>
    </li>
</template>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base';
    //    var Tag = "expand";
    export default {
        ready(){
//            console.log(Tag, this.model);
        },
        props: {
            model: {
                type: Object,
            },
            params: {
                type: Object,
            }
        },
        watch: {
            'model': function (nVal, oVal) {
//                console.log("model-change", nVal, oVal);
            }
        },
        data: function () {
            return {
                open: true,
            }
        },
        computed: {
            isFolder: function () {
                return this.model.child && this.model.child.length;
            }
        },
        methods: {
            toggle: function () {
                if (this.isFolder) {
                    this.open = !this.open
                }
            },
            departmentClick: function () {
//                console.log(Tag, this.model.department_name);
                this.$dispatch("depart-click", this.model);
            },
            deleteClick: function () {
//                console.log(Tag, this.model.department_name);
                this.$dispatch("del-click", this.model);
            },
            itemDblClick: function (data) {
               console.log("itemDblClick", data);
                this.$dispatch("dbl-click", data);
            },
            itemClick: function (data) {
//                console.log(Tag, data.department_name);
                this.$dispatch("depart-click", data);
            },
            itemDelete: function (data) {
//                console.log(Tag, data.department_name);
                this.$dispatch("del-click", data);
            },
            add: function () {
                if (this.params.add) {
                    if(this.model.child && this.model.child.length) {
                        this.$dispatch("dbl-click", this.model)
                        return;
                    }
                    this.$set('model.child', [{
                        department_name: 'son',
                        children: [],
                    }]);
                    this.open = true;
                    this.$dispatch("dbl-click", this.model)
                }else if(this.params.dblSelectedChild){

                    if(this.model.child && this.model.child.length) {
                        this.$dispatch("dbl-click", this.model)
                        return;
                    }
                }
            },
        },
        components: {
            item: {
                name: 'item',
                props: {
                    model: {
                        type: Object,
                    },
                    params: {
                        type: Object,
                    }
                },
                data: function () {
                    return {
                        open: false,
                    }
                },
                computed: {
                    isFolder: function () {
                        return this.model.child && this.model.child.length;
                    }
                },
                methods: {
                    toggle: function () {
                        if (this.isFolder) {
                            this.open = !this.open
                        }
                    },
                    departmentClick: function () {
//                        console.log("departmentClick - ", this.model.department_name);
                        this.$dispatch("item-click", this.model);
                    },
                    deleteClick: function () {
//                        console.log("deleteClick - ", this.model.department_name);
                        this.$dispatch("del-click", this.model);
                    },
                    itemDblClick: function (data) {

                        console.log("itemDblClickdata", data);
//                        console.log("departmentClick - ", this.model.department_name);
                        this.$dispatch("item-dbl", this.model);
                    },
                    itemClick: function (data) {
                        this.$dispatch("item-click", data);
                    },
                    itemDelete: function (data) {
                        this.$dispatch("item-del", data);
                    },
                    add: function () {
                        if (this.params.add) {
                            if(this.model.child && this.model.child.length) {
                                this.$dispatch("item-dbl", this.model);
                                return;
                            }
                            this.$set('model.child', [{
                                department_name: 'son'
                            }]);
                            this.open = true;
                            this.$dispatch("item-dbl", this.model);
                        }else if(this.params.dblSelectedChild){

                            if(this.model.child && this.model.child.length) {
                                this.$dispatch("dbl-click", this.model)
                                return;
                            }
                        }
                    },
                },
                template: `<li>
                                <div :class="{'folder': isFolder, 'bg-e': params.id === model.id}" class="relative" @click.stop="departmentClick" @dblclick.stop="add">
                                    <span @click.stop="toggle" class="expand_01" :class="{open: open}"></span>
                                    <span class="expand_02" :class="{open: open}"></span>
                                    {{ model.department_name }} <i v-if="!params.hidePeople">({{model.staff_cnt || 0}}人)</i>
                                    <span @click.stop="deleteClick" v-if="del" class="deleteBtn"><i class="Hui-iconfont">&#xe6e2;</i></span>
                                </div>
                                <ul v-show="open" v-if="isFolder" :class="{autoWidth: params.autoWidth}">
                                    <item v-on:item-click="itemClick" v-on:item-dbl="itemDblClick" v-on:item-del="itemDelete" class="item" v-for="model in model.child" :model="model" :params="params"></item>
                                    <!--<li class="add" @click="addChild">+</li>-->
                                </ul>
                        </li>`
            }
        }
    }
</script>
