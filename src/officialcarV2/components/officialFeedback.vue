<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">沟通反馈</div>

        <div class="layui-layer-content pd-15">
            <div class="cl">
                <span class="f-l mr-20">
                    发送到:
                </span>
                <div class="f-l">
                    <label >
                        <input type="checkbox" class="person-check" :checked="applyStaff" @click="receivePersons('applyStaff')">
                        <span>申请人</span>
                    </label>
                </div>
                <!--<div class="f-l ml-10">-->
                    <!--<label >-->
                        <!--<input type="checkbox" class="person-check">-->
                        <!--<span>乘车人</span>-->
                    <!--</label>-->
                <!--</div>-->
                <div class="f-l ml-10">
                    <label >
                        <input type="checkbox" class="person-check" :checked="driver" @click="receivePersons('driver')" >
                        <span>司机</span>
                    </label>
                </div>
            </div>

            <textarea v-model="content" class="content-text mt-10" name="" id="" placeholder="请输入反馈内容,最多只能输入65字" style="resize: none">

            </textarea>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
        </span>
        <div class="layui-layer-btn" v-on:click="send"><a class="layui-layer-btn0">发送</a></div>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<script>
    import * as base from '../../assets/js/base.js';
    export default{
        ready () {

        },
        props: ["data","type"],
        data:function(){
            return {
                content:"",
                applyStaff:false,
                driver:false,
            }
        },
        methods: {
            close:function(){
                this.$dispatch("dialog-close","showFeedBackDialog")
            },
            receivePersons:function(key){
                this[key] = !this[key];
            },
            send:function(){
                if(this.content === ''){
                    layer.msg("反馈内容不能为空",{icon:2,time:3000});
                    return;
                }
                let arr = [];
                if(this.driver){
                    arr.push("driver");
                }
                if(this.applyStaff){
                    arr.push("staff");
                }
                if(arr.length == 0){
                    layer.msg("请选择接收反馈内容的角色",{icon:2,time:3000});
                    return;
                }
                $.ajax({
                    url:`${base.gAjaxUrl.officialcarOrder_V2}feedback/`,
                    type:"POST",
                    contentType:"application/json",
                    data:JSON.stringify({
                        type:this.type,
                        content:this.content,
                        target:arr,
                        pk:this.data.id
                    })
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
                        layer.msg("发送成功",{icon:1,time:2000});
                        this.$dispatch("dialog-close","showFeedBackDialog")
                    })
                })
            }
        }
    }
</script>
<style lang="less" scoped>
    .person-check{
        width:20px;
        height:20px;
    }
    .content-text{
        border:1px solid #999999;
        border-radius: 8px;
        width:100%;
        height:300px;
        padding:0;
    }
</style>
