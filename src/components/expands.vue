<template>
    <li>
        <div :class="{folder: isFolder, clearfix: true}" @click="toggle" @dblclick="changeType">
            <span class="expand_01" :class="{open: open}"></span>
            <span class="expand_02" :class="{open: open}"></span>
            {{model.name}}
        </div>
        <ul v-show="open" v-if="isFolder">
            <item class="item" v-for="model in model.children" :model="model"></item>
            <!--<li class="add" @click="addChild">+</li>-->
        </ul>
    </li>
</template>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base';
    var Tag = "expand";
    export default {
        ready(){
            console.log(this.model);
        },
        props: {
            model: Object
        },
        data: function () {
            return {
                open: false
            }
        },
        computed: {
            isFolder: function () {
                return this.model.children && this.model.children.length;
            }
        },
        methods: {
            toggle: function () {
                if (this.isFolder) {
                    this.open = !this.open
                }
            },
            changeType: function () {
                if (!this.isFolder) {
                    this.$set("model.children", []);
                    console.log(Tag, "model.children");
                    this.addChild();
                    this.open = true;
                }
            },
            addChild: function () {
                this.model.children.push({
                    name: 'new stuff'
                });
                console.log(Tag, this.model);
            }
        },
        components: {
            item: {
                name: 'item',
                props: {
                    model: Object
                },
                data: function () {
                    return {
                        open: false
                    }
                },
                computed: {
                    isFolder: function () {
                        return this.model.children && this.model.children.length;
                    }
                },
                methods: {
                    toggle: function () {
                        if (this.isFolder) {
                            this.open = !this.open
                        }
                    },
                    changeType: function () {
                        if (!this.isFolder) {
                            this.$set("model.children", []);
                            console.log(Tag, "model.children");
                            this.addChild();
                            this.open = true;
                        }
                    },
                    addChild: function () {
                        this.model.children.push({
                            name: 'new stuff'
                        });
                        console.log(this.model);
                    }
                },
                template: `<li>
                                <div :class="{folder: isFolder}" @click="toggle" @dblclick="changeType">
                                    <span class="expand_01" :class="{open: open}"></span>
                                    <span class="expand_02" :class="{open: open}"></span>
                                    {{model.name}}
                                </div>
                                <ul v-show="open" v-if="isFolder">
                                    <item class="item" v-for="model in model.children" :model="model"></item>
                                    <!--<li class="add" @click="addChild">+</li>-->
                                </ul>
                        </li>`
            }
        }
    }
</script>
