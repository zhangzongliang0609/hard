<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title fw-b">{{title}}</div>
        <div class="layui-layer-content row cl">
            <form id="J-layer-form" class="form form-horizontal layui-layer-wrap">
                <div class="row cl">
                 <label class="form-label f-l col-4 "><span class="c-red">*</span>费用名称:</label>
                 <div class="formControls f-l col-4 ml-5">
                     <input type="text" name="building" class="input-text" v-model="buildingTypeName">
                 </div>
             </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 " >
                        通用区域:
                    </label>

             <div class="formControls f-l col-4 ml-5">
                 <div>
                     全选
                     <span  class="select_all_btn" @click="pickAll">
                    <ins v-show="selectBuildings.length == buildings.length" class="ins_checked"></ins>
                    </span>
                 </div>
                    <ul class="cl building-box">
                        <li v-for="item in buildings" class="f-l mr-10" >
                            <div class="select_all_btn" @click="checkBuilding(item)">
                                <ins v-show="item.id | contains"  class="ins_checked"></ins>
                            </div>
                            {{item.building_name}}
                        </li>
                    </ul>
             </div>
             </div>
                <div class="row cl">
                <label class="form-label f-l col-4 "> 费用类别:&nbsp;</label>
                <div class="formControls f-l col-4 ml-5">
                    <label>
                        <input name="hotelType" value="1" type="radio" checked="checked">
                        固定费用
                    </label>
                </div>
               <!--下版本才会有非固定费用功能-->
                <!--<label>-->
                    <!--<input name="hotelType" value="0" type="radio" :checked="buildingCostType == 0">-->
                    <!--非固定费用-->
                <!--</label>-->
            </div>
                <div class="row cl">
                <label class="form-label f-l col-4 ">  是否启用:&nbsp;</label>
                <div class="formControls f-l col-4 ml-5">
                    <select name="" v-model="is_active" class="select-box">
                        <option value="1">是</option>
                        <option value="0">否</option>
                    </select>
                </div>
            </div>
            </form>
        </div>

        <div class="layui-layer-btn f-r" v-on:click="save"><a class="layui-layer-btn0">保存</a></div>
        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
        <!--<div class="layui-layer-btn" v-on:click="save"><a class="layui-layer-btn0" v-if="type!='check'">保存</a></div>-->
    </div>
    <div class="layui-layer-shade"></div>

    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>

</template>
<style lang="less" rel="stylesheet/less" scoped>
    /*.layui-layer-content{*/
        /*padding-left: 300px;*/
    /*}*/
    /*.layui-layer-content>div{*/
        /*margin-bottom: 20px;*/
    /*}*/
    .input-text {
        width: 200px;
    }
    .select-box{
        width: 120px;
    }
    .building-box{
        width: 270px;
        li{
            height: 30px;
            line-height: 30px;
        }
    }
    .select_all_btn {
        display: inline-block;
        width: 18px;
        height: 18px;
        position: relative;
        top: 4px;
        border: 1px solid #ccc;
    }
    .ins_checked {
        display: block;
        margin: 0;
        padding: 0;
        width: 18px;
        height: 18px;
        background: url('../../src/assets/js/icheck/blue.png') no-repeat -40px 0;
        border: none;
        cursor: pointer;
    }


</style>
<script>
    import * as base from '../assets/js/base.js';
    export default{
        ready(){
            let that = this;
            if(this.data){
                for (var i = 0,len = this.data.buildings.length; i < len; i++){
                    this.selectBuildings.push(this.data.buildings[i].id)
                }
                this.buildingTypeName = this.data.name;
                this.buildingCostType = this.data.type;
                this.is_active = this.data.is_active?1:0;
                this.ajaxUrl = `${base.gAjaxUrl.buildingsCostTypeList}${this.data.id}/`;
                this.ajaxType = "PUT";
            }else{

                this.ajaxUrl = base.gAjaxUrl.buildingsCostTypeList;
                this.ajaxType = "POST";
            }



            $('#J-layer-form').validate({
                rules: {
                    building: {
                        required: true,
                    },
                },
                submitHandler:function() {
                    that.itemsLoading = true;
                    $.ajax({
                        url:that.ajaxUrl,
                        type:that.ajaxType,
                        contentType:"application/json",
                        data:JSON.stringify({
                            name:that.buildingTypeName,
                            building_set:that.selectBuildings,
                            type:+$("input[name='hotelType']:checked").val(), // 前面加个+号是把字符串转成数字
                            is_active:+that.is_active,
                        }),
                    }).always((data)=>{
                        that.itemsLoading = false;
                        base.ajaxCallback(data,()=>{
                            that.$dispatch("dialog-save");
                        })
                    })
                }
            });
        },
        data:function () {
            return{
                itemsLoading:false,
                selectBuildings:[],
                buildingTypeName:"",
                buildingCostType:'',
                is_active:1,
                ajaxUrl:'',
                ajaxType:'',
            }
        },
        props:['data','title','buildings'],
        methods:{
            close:function () {
                this.$dispatch("dialog-close")
            },
            save:function () {
                if(this.buildingTypeName.length > 32){
                    layer.msg("费用名称长度不能超过32个字符",{icon:2,time:1500});
                }else{
                    $('#J-layer-form').submit();
                }
            },
            pickAll:function () {
                if(this.selectBuildings.length !== this.buildings.length){
                    for (var i = 0,len = this.buildings.length; i < len; i++) {
                        if(this.selectBuildings.indexOf(this.buildings[i].id) == -1){
                            this.selectBuildings.push(this.buildings[i].id)
                        }
                    }
                }else{
                    this.selectBuildings = [];
                }

            },
            checkBuilding:function (item) {
                let index  = this.selectBuildings.indexOf(item.id);
                if(index == -1){
                    this.selectBuildings.push(item.id)
                }else{
                    this.selectBuildings.splice(index,1);
                }
            },
        },
        filters:{
            contains: function (para){
                return this.selectBuildings.indexOf(para) > -1;
            },

        },
    }
</script>