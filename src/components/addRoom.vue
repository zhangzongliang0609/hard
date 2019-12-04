<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">{{title}}</div>
        <div class="layui-layer-content">
            <form id="J-layer-form" class="form form-horizontal layui-layer-wrap">
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>所在楼：</label>
                    <div class="formControls f-l col-4">
                        <select name="" class="select-box" v-model="buildingInput"  >
                            <option v-for="item in buildings_list" :value="item.id">{{item.building_name}}</option>
                        </select>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>房间类型：</label>
                    <div class="formControls f-l col-4">
                        <select name="" class="select-box" v-model="roomTypeInput"  >
                            <option v-for="item in room_types_list" :value="item.id">{{item.type_name}}</option>
                        </select>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>房间号：</label>
                    <div class="formControls f-l col-4">
                        <input v-model="roomNoInput" type="text" name="room_no" class="input-text">
                    </div>
                </div>

                <div class="row cl">
                    <label class="form-label f-l col-4 ">分组：</label>
                    <div class="formControls f-l col-4">
                        <!--<input v-model="employee_tag" type="text" class="input-text" value="" placeholder="" name="employee_tag">-->
                        <tags :tags="wTagsArr" :selected="tagsArr"></tags>
                    </div>
                </div>
                <!--<div class="row cl">-->
                    <!--<div class="formControls f-l col-4 col-offset-4">-->
                        <!--<div class="whole_tag_container">-->
                            <!--<div class="tag_item_list clearfix">-->
                                <!--<div @click="addTag(item)" v-for="item in tag_arr" class="tag_item f-l" title="{{item.name}}">{{item.name}}</div>-->
                            <!--</div>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</div>-->
            </form>
        </div>
        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
        <div class="layui-layer-btn" v-on:click="save"><a class="layui-layer-btn0" v-if="type!='check'">保存</a></div>
    </div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
    <div class="layui-layer-shade"></div>
</template>

<style lang="less" scoped>
    .tag_item_list {

        width: 100%;
        box-sizing: border-box;
        z-index: 2;
        min-height: 40px;
        padding: 3% 3% 6%;
        border-radius: 5px;
        border: 1px solid #ccc;
        background-color: #fff;
    .tag_item {
        /*width: 80px;*/
        width: 28%;
        color: #eee;
        font-size: 14px;
        line-height: 25px;
        margin-left: 3%;
        margin-top: 3%;
        border-radius: 5px;
        background-color: #ff9542;
        text-align: center;
        position: relative;
        cursor: pointer;
    p {
        width: 100%;
        height: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    span {
        position: absolute;
        width: 16px;
        height: 16px;
        text-align: center;
        line-height: 12px;
        font-size: 12px;
        border-radius: 50%;
        background-color: #000;
        color: #fff;
        top: -5px;
        right: -5px;
        cursor: pointer;
    }
    }
    }
    /*.tag_container, .whole_tag_container {*/
    /*width: 100%;*/
    /*.tag_box {*/
    /*overflow: auto;*/
    /*height: auto;*/
    /*.tag_second_box {*/
    /*position: relative;*/
    /*left: 0;*/
    /*top: 0;*/
    /*margin: 0;*/
    /*.tag_item span {*/
    /*position: absolute;*/
    /*width: 20px;*/
    /*height: 20px;*/
    /*border-radius: 50%;*/
    /*background-color: #000;*/
    /*color: #fff;*/
    /*top: -10px;*/
    /*right: -10px;*/
    /*}*/
    /*}*/
    /*}*/
    /*}*/
</style>
<script type="text/ecmascript-6">
import * as base from '../assets/js/base.js';
import tags from './setTags'

    export default{
        ready () {
            let that = this;
            let ajaxUrl = '';
            let ajaxType = '';
            let getData = JSON.parse(JSON.stringify(this.data));
            this.getTagList();
            base.verticalCenter('.layui-modify');

            //this.getBuildingsList();
            //this.getRoomTypesList();
            this.buildingInput = this.buildings_list[0].id;
            this.roomTypeInput = this.room_types_list[0].id;

            //类型判断
            if(this.type == 'add'){
                ajaxUrl = base.gAjaxUrl.rooms;
                ajaxType = 'POST';
                // this.buildingInput = this.building_id;
            }else if(this.type == 'modify'){
                ajaxUrl = `${base.gAjaxUrl.rooms}${getData.id}/`;
                ajaxType = 'PUT';
                this.buildingInput = getData.building;
                this.roomTypeInput = getData.room_type;
                this.roomNoInput = getData.room_no;
                this.tagsArr = getData.room_tags;
            }

            //验证
            $('#J-layer-form').validate({
                rules: {
                    room_no: {
                        required: true,
                    },
                },
                submitHandler:function() {
                    that.itemsLoading = true;
                    let idArr = [];
                    for (var i = 0,len = that.tagsArr.length; i < len; i++) {
                        idArr.push(that.tagsArr[i].id);
                    }

                    $.ajax({
                        url: ajaxUrl,
                        type:ajaxType,
                        contentType:'application/json',
                        data:JSON.stringify({
                            building: that.buildingInput,
                            room_type: that.roomTypeInput,
                            room_no: that.roomNoInput,
                            tags_set:idArr,
                        },)
                    })
                    .always(function(data) {
                        that.itemsLoading = false;
                        base.ajaxCallback(data,function(){
                            layer.msg('提交成功',{icon:1,time:1000});
                            that.$dispatch('dialog-save');
                        });
                    });

                }
            });
        },
        props: ['title','type','data','tag_arr','buildings_list','room_types_list',],
        data:function(){
            return {
                buildingInput:'',
                roomTypeInput:'',
                roomNoInput:'',
                tagsArr:[],
                wTagsArr: [],
                itemsLoading:false,
            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            save:function(){
                $('#J-layer-form').submit();
            },
            getTagList: function () {
                this.itemsLoading = true;
                //1代表员工,2代表宿舍, 3代表大巴车,4代表公务车
                $.ajax({
                    url: base.gAjaxUrl.tagGroup,
                    type: 'GET',
                    data: {
                        type:2,
                        page: 1,
                        page_size: 999999,
                        flag: 'tag_room'
                    }
                }).always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=>{
                        this.wTagsArr = data.results || [];
                    });
                });
            },
            getTagIds: function (tagArr) {
                let arr = [];
                for(let i = 0, len = tagArr.length;i < len; i++) {
                    arr.push(tagArr[i].id);
                }
                return arr;
            },
        },
        components:{
            tags:tags,
        }
    }
</script>
