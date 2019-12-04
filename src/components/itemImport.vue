<template>
<loading v-if="isShowLoading"></loading>
<div class="layui-layer layui-anim layui-layer-page layui-modify layui-modify-width">
    <div class="layui-layer-title">批量导入</div>
    <div class="layui-layer-content">
        <form id="uploadForm" class="pd-20">  
              <p> <input type="file" name="file" accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/></p>  
        </form>   
    </div>
    <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
    <div class="layui-layer-btn">
        <a class="layui-layer-btn1" v-bind:href="urldata.templateUrl">示例模块下载</a>
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
            this.templateUrl = this.urldata.templateUrl;
        },
        data:function(){
            return {
                isShowLoading:false,
                templateUrl: '',
            }
        },
        props: ['urldata'],
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            save:function(){
                 let formData = new FormData($("#uploadForm")[0]);
                if($("input[name='file']")[0].files.length == 0 ){
                    layer.msg('请先选择需要导入的文件',{icon:2,time:1000});
                    return
                }
                // console.log($("#uploadForm"));
                let that = this;
                this.isShowLoading = true;
                 setTimeout(function(){
                     $.ajax({  
                        url: that.urldata.importUrl,
                        type: 'POST',  
                        data: formData,  
                        async: false,  
                        cache: false,  
                        contentType: false,  
                        processData: false,  
                        success: function (data) { 
                            if(data.error_cnt == 0){
                                layer.msg('导入成功',{icon:1,time:1000});
                                that.$dispatch('dialog-save');
                            }else{
                                layer.msg(data.error_msg.join('<br/>'),{icon:2,time:4000});
                            }
                            that.isShowLoading = false;
                        },  
                        error: function (data) {  
                            layer.msg('导入失败',{icon:2,time:1000});
                            that.isShowLoading = false;
                        }  
                     });  
                }, 500)
                
            }
        },
        components:{
            loading       
        }
    }
</script>
