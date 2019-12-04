<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify building-box">
        <div class="layui-layer-title">{{title}}</div>
        <div class="layui-layer-content">
            <div v-show="showChange" class="text-c" @click="addType">
                <img class="add-icon" src="../../assets/images/icon-add.png" alt="">
                <a class="btn btn-link" href="javascript:;">{{add}}</a>
            </div>
            <div class="addMaterials-content">
                <div class=" ml-20 mr-20 f-16">
                    <ul class="category-manage-list">
                        <li class="f-15 li-box  " v-for="item in tagArr">
                            <div class="type-name f-l">
                                <span class="" v-show="$index !== currentIndex || showChange">{{item.name}}</span>
                                <input v-model="inputData"  class="category-input f-14" type="text" v-show="!showChange && $index === currentIndex">
                            </div>
                            <div class="operate f-r">
                                <a v-if="item.name | showBtn" class="mr-5 	btn btn-secondary radius"  href="javascript:;" @click="changeType($index,item.name)" v-show="showChange">修改</a>
                                <a class="mr-5 btn btn-success radius" href="javascript:;" @click="saveChange(item.id)" v-show="!showChange && $index === currentIndex" >完成</a>
                                <a v-if="item.name | showBtn" href="javascript:;" class="btn btn-danger radius" v-show="showChange" @click="deleteType(item)">删除</a>
                                <a href="javascript:;" class="btn btn-secondary radius" v-show="!showChange && $index === currentIndex" @click="closeChange">取消</a>
                            </div>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
        <!--<div class="layui-layer-btn" v-on:click="save"><a class="layui-layer-btn0" v-if="type!='check'">保存</a></div>-->
    </div>
    <div class="layui-layer-shade"></div>
</template>

<style lang="less"  rel="stylesheet/less" scoped>
    .li-box{
        border-bottom:1px dashed #c7c7c7;
    }

    .add-icon{
        width: 20px;
        height: 20px;
    }
    .building-box{
        width: 400px;

    }
    .category-input{
        width: 100%;
        height: 28px;
        padding-left: 5px;
        border-radius:5px;
        border:1px solid #ccc;

    }
    .category-manage-list{
        margin:10px 0;
        max-height: 500px;
        /*overflow-y: auto;*/
        li{
            position: relative;
            min-height: 35px;

            .type-name{
                display: inline-block;
            }
            .operate{
                display: inline-block;
                padding-top:2px;
            }
        }
        .type-name>span{
            display: inline-block;
            width: 200px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
        .type-name>span:hover{
            white-space:normal;
        }
    }
    .floor{
        position: relative;
    }
    .floor span{
        position: absolute;
        top: 4px;
        right: -22px;
    }
</style>
<script>
    import * as base from '../../assets/js/base.js';


    export default{
        ready () {
            base.verticalCenter('.layui-modify');
            this.getRoomTag();
        },
        data:function(){
            return {
                currentIndex:'',
                showChange:true,
                inputData:'',
                tagArr:'',
            }
        },
        props:['url','title','add'],
        filters:{
            showBtn:function(item){
                switch (item) {
                    case "油费":{
                        return false;
                    }
                    case "ETC费用":{
                        return false;
                    }
                    case "保养费":{
                        return false;
                    }
                }

                return true;
            },
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            saveChange:function (id='') {
                let that = this;
                if(!this.inputData ){
                    layer.msg(`${that.title}名称不能为空`,{icon:2,time:2000});
                    return
                }
                else if( this.inputData.length > 35){
                    layer.msg(`${that.title}名称不能超过35个字符`,{icon:2,time:2000});
                    return
                }

                // 用id判断是新增还是修改
                if(id){
                    console.log('进入了Id');
                    $.ajax({
                        url: `${that.url}${id}/`,
                        type: 'PUT',
                        data:{
                            "name":that.inputData
                        },
                    }).always((data)=>{
                        base.ajaxCallback(data, ()=>{
                        })
                        that.getRoomTag();
                    })
                }else{
                    $.ajax({
                        url: `${that.url}`,
                        type: 'POST',
                        data: {
                            name:that.inputData
                        },
                    }).always((data)=>{
                        base.ajaxCallback(data, ()=>{
                        })
                        that.getRoomTag();
                    })
                }

                this.showChange = true;
            },
            changeType:function (index,data) {
                this.currentIndex = index;
                this.inputData = data;
                this.showChange = false;
                this.$nextTick(()=>{
                    $('.category-input').eq(index).focus()
                })
            },
            deleteType:function (item) {
                let that = this;
                layer.confirm(`删除须谨慎，确认要删除${item.name}吗？`,()=>{
                    that.itemsLoading = true;
                    $.ajax({
                        url: `${that.url}${item.id}/`,
                        type: 'DELETE',
                    }).always((data)=>{
                        that.getRoomTag();
                    })
                    layer.closeAll('dialog')
                });

            },
            closeChange:function () {
                this.getRoomTag();
                this.showChange = true;
            },
            addType:function () {
                this.inputData = "";
                this.tagArr.unshift({name:""});
                this.currentIndex = 0;
                this.showChange = false;
                this.$nextTick(()=>{
                    $('.category-input').eq(0).focus()
                })

            },
            getRoomTag:function () {
                let that = this;
                $.ajax({
                    url:`${that.url}`,
                    type:"GET",
                    data:{
                        page:1,
                        page_size:99999999,
                    }
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
                        console.log("this.data");
                        console.log(data);
                        this.tagArr = data;
                    })
                })
            }
        }
    }
</script>
