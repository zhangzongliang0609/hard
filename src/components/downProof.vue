<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify layui-modify-cansel">
        <div class="layui-layer-title">下载凭证</div>
        <div class="layui-layer-content">
            <div class="row cl">
                <label class="form-label f-l col-4 text-r lh-31">下载链接：</label>
                <div class="formControls f-l col-7" id="copyText">
                    <!--https://qiye.pinbayun.com/pdf/index.html?id=%s-->
                    https://qiye.pinbayun.com/pdf/index.html?id={{data.id}}
                    <!--http://pc.test.pinbayun.com/pdf/index.html?id={{data.id}}-->
                </div>
            </div>

        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close"></a>
        </span>
        <div class="layui-layer-btn">
            <a class="layui-layer-btn0" v-on:click="openDown">下载</a>
            <a class="layui-layer-btn1" v-on:click="copyLink">复制链接</a>
        </div>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<script>
    import * as base from '../assets/js/base.js';
    export default{
        ready () {

        },
        props: ['data'],
        data:function(){
            return {

            }
        },
        methods: {
            close:function(){
                this.$emit('dialog-close');
            },
            openDown:function(){
                window.open(`https://qiye.pinbayun.com/pdf/index.html?id=${this.data.id}`)
                // window.open(`http://pc.test.pinbayun.com/pdf/index.html?id=${this.data.id}`)
                // window.open(`http://127.0.0.1:8333/pdf/index.html?id=${this.data.id}`)
            },
            copyLink:function(){
                if(window.getSelection){
                    var selection = window.getSelection();   // 创建Selection 对象

                    var range = document.createRange(); //创建Range 对象

                    range.selectNodeContents(document.getElementById("copyText")); //设定一个目标节点内容的 Range

                    selection.removeAllRanges();  //清空选择区域

                    selection.addRange(range);  //选中元素, 这一步可以实现全选

                    document.execCommand("copy"); //复制到粘贴板

                    selection.removeAllRanges(); //选择完成之后清空选择
                    layer.msg("复制成功",{icon:1,time:1000});

                }else{
                    layer.msg("你当前的浏览器不支持该功能,请自行进行复制",{icon:2,time:2000});

                }
            },
        }
    }
</script>
<style lang="less" scoped>

    .layui-modify{
        height: 200px;
    }
    .opacity{
        height: 0;
        opacity: 0;
    }
</style>
