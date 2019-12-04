<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">
            <label>请选择巴士班次</label>
        </div>
        <div class="col-lg-4">
            <input type="checkbox" id="all" v-model="checked" v-on:click="checkedAll"><label for="all">全选</label>
        </div>
        <br>
        <div class="layui-layer-content">
            <div>
                <div v-for="bus in buses" class="col-lg-4">
                <!-- <div v-for="(index,bus) in buses" class="col-lg-4"> -->
                    <input type="checkbox" v-bind:id="bus.id" v-bind:value="bus.id" v-model="busSelected" :checked="inArray(bus.id, busesSelected)">
                    <!-- <input type="checkbox" v-bind:id="bus.id" v-bind:value="bus.id" v-model="busSelected" :checked="index==indexFirst"> -->
                    <label v-bind:for="bus.id">{{bus.shuttle_name}}</label>
                </div>
            </div>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
        </span>
        <div class="layui-layer-btn" v-on:click="save"><a class="layui-layer-btn0">选择</a></div>
    </div>
    <div class="layui-layer-shade"></div>
</template>

<script>
    import * as base from '../assets/js/base.js';
    export default{
        ready(){
            console.log(this.busesSelected);
        },
        props:['data', 'selected'],
        data:function(){
            return{
                buses:this.data,
                busesSelected:this.selected,
                busSelected:[],
                checked:""
            }
        },
        methods:{
            close:function(){
                this.$dispatch('dialog-close');
            },
            save:function(){
                this.$emit('dialog-save', this.busSelected);
            },
            inArray:function(item, array){
                let in_array = false;
                let index;
                for(index in array){
                    if(item==array[index]){
                        in_array = true;
                        break;
                    }
                }
                // for((index,bus) in array){
                //     if(item==array[index]){
                //         in_array = true;
                //         break;
                //     }
                //     if(index==indexFirst){
                //         in_array = true;
                //         break;
                //     }
                // }
                return in_array;
            },
            checkedAll: function() {
                var _this = this;
                if (this.checked) {//实现反选
                  _this.busSelected = [];
                }else{//实现全选
                  _this.busSelected = [];
                  _this.buses.forEach(function(item) {
                    _this.busSelected.push(item.id);
                  });
                }
                console.log(_this.busSelected);
            }
        }
    }
</script>
<style lang="less" rel="stylesheet/less" scoped>
.layui-layer-title{
    .m-info{
        border: none;
        padding: 9px 0;
        margin: 0;
    }
}
    .layui-layer{
        top:200px;
    }
</style>