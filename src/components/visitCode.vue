<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">访客二维码</div>
        <div class="layui-layer-content">
            <div class="code-box text-c" id="codeId">
                <div class="code-top">
                    <div>{{companyName}}</div>
                    <div>来访登记二维码</div>
                </div>
                <div id="qrCode" class="mt-15">

                </div>
                <div class="qrcode-hint mt-15">扫一扫上面二维码,申请访客预约</div>
            </div>
            <div class="row cl text-c" style="margin-top:30px">
                <a class="btn btn-primary radius " href="javascript:;" @click="downCode">下载二维码</a>
            </div>
        </div>
        <!--<div id="dom"></div>-->

        <!--<img :src="previewImg" alt="">-->
        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
        <!--<button   class="btn btn-primary radius f-r mr-10 mb-10" v-on:click="downCode()">下载二维码</button>-->

    </div>

    <div class="layui-layer-shade"></div>

</template>

<style lang="less" rel="stylesheet/less">
    .code-box {
        width: 300px;
        height: 400px;
        border-radius: 5px;
        overflow: hidden;
        margin: 0 auto;
        box-shadow: 0px 0px 5px #888888;

    .code-top {
        background: #2194f1;
        height: 70px;
        color: white;
        font-size: 14px;
        padding-top: 15px;
        box-sizing: border-box;
    }

    }
    #qrCode {
        padding-left: 15px;
    }

    #dom {
        width: 600px;
        height: 600px;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';

    export default {
        ready() {
            let that = this;
            base.verticalCenter('.layui-modify');


            // let codeData = `http://wx.test.pinbayun.com/views/visitAppointment.html?corpid=${localStorage.getItem('companyID')}`;
            // let codeData = `http://192.168.105.242:3000/views/visitAppointment.html?corpid=${localStorage.getItem('companyID')}`;
            let codeData = `http://wx.pinbayun.com/views/visitAppointment.html?corpid=${localStorage.getItem('companyID')}`;

            new QRCode(document.getElementById("qrCode"), {
                width: 270,
                height: 270,
            }).makeCode(codeData);
            this.$nextTick(() => {
                //增加蒙版 防止canvas未渲染完 点击下载二维码
                $.showLoading();
                html2canvas(document.getElementById('codeId'), {
                    // allowTaint: true,
                    // useCORS:true,
                    // letterRendering:false,
                    // imageTimeout:600000,
                    width: 300,
                    height: 400,
                }).then((canvas) => {
                    $.hideLoading();
                    $("#dom").html(canvas);
                    that.previewImg = canvas.toDataURL('image/jpeg', 1);
                    console.log(canvas);
                })
            });

        },
        props: [],
        data: function () {
            return {
                itemsLoading: false,
                usernameInput: '',
                previewImg: "",
                _canvas: "",
                companyName: localStorage.getItem("companyName") || "--",
            }
        },
        methods: {
            close: function () {
                this.$dispatch('dialog-close');
            },
            downCode: function () {
                this.downImg('访客二维码', this.previewImg)

            },
            downImg: function (fileName, content) {
                var base64ToBlob = function (code) {
                    let parts = code.split(';base64,');
                    let contentType = parts[0].split(':')[1];
                    let raw = window.atob(parts[1]);
                    let rawLength = raw.length;
                    let uInt8Array = new Uint8Array(rawLength);
                    for (let i = 0; i < rawLength; ++i) {
                        uInt8Array[i] = raw.charCodeAt(i);
                    }
                    return new Blob([uInt8Array], {
                        type: contentType
                    });
                };
                let aLink = document.createElement('a');
                let blob = base64ToBlob(content); //new Blob([content]);
                let evt = document.createEvent("HTMLEvents");
                evt.initEvent("click", true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
                aLink.download = fileName;
                aLink.href = URL.createObjectURL(blob);
                aLink.click();
            },
        },
        filters: {},
        components: {}
    }
</script>
