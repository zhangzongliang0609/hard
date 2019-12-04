<template>
<loading v-if="isShowLoading"></loading>
<div class="layui-layer layui-anim layui-layer-page layui-modify layui-modify-width">
    <div class="layui-layer-title">批量导入</div>
    <div class="layui-layer-content">
        <form id="uploadForm" class="pd-20">  
              <p> <input type="file" name="file"/></p>  
        </form>   
    </div>
    <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
    <div class="layui-layer-btn">
        <a class="layui-layer-btn1" href="http://eqixing.oss-cn-shenzhen.aliyuncs.com/%E5%91%98%E5%B7%A5%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx">示例模块下载</a>
        <a class="layui-layer-btn0" v-on:click="save">导入</a>
    </div>
</div>

</template>

<style lang="less">
    div.layui-modify-width {margin-left: -25pc;}
</style>
<script>
import * as base from '../assets/js/base.js';
import loading from "../components/loading.vue";
    export default{
        ready () {

        },
        data:function(){
            return {
                isShowLoading:false,
            }
        },
        props: ['title','url'],
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            save:function(){
                 let formData = new FormData($("#uploadForm")[0]);  
                 let that = this;

                 this.isShowLoading = true;
                 setTimeout(function(){
                     $.ajax({  
                        url: base.gAjaxUrl.staffsIpmort,
                        type: 'POST',  
                        data: formData,  
                        async: false,  
                        cache: false,  
                        contentType: false,  
                        processData: false,  
                        success: function (data) {  
                            if(data.success_cnt){
                                layer.msg('导入成功',{icon:1,time:1500});
                                that.$dispatch('dialog-save');
                            }else{
                                layer.open({
                                    title: '错误提醒：',
                                    content: data.error_msg.join(',<br />'),
                                })
//                                layer.msg(data.error_msg.join(','),{icon:2,time:2000});
                            }
                            that.isShowLoading = false;
                        },  
                        error: function (data) {  
                            layer.msg('导入失败',{icon:2,time:1500});
                            that.isShowLoading = false;
                        },
                     });
                }, 500)
                
            }
        },
        components:{
            loading       
        }
    }
</script>
