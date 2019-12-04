<template>
    <div v-show="globalImageSrc" id="previewWindow">
        <img id="previewWindowImage" v-bind:src="globalImageSrc"/>
        <span @click="closeImagePreview" class="close-btn-img">x</span>
    </div>
    <previre v-if="isShowPreview" :company_name="companyName" :voucher_name="voucherName" :trip_name="tripName" :logo_url="imageInfoArr[0]" :type="previewType" @dialog-close="closePreview"></previre>
    <section class="Hui-article-box">
        <div class="page-container">
            <div class="panel panel-default radius">
                <div class="panel-body">
                    <span class="f-20 fw-b">凭证定制</span>
                </div>
            </div>

            <div class="">

                <div class="rule-box pl-20">
                    <h4>规则设置</h4>

                    <div class="row cl">
                        <label class="form-label f-l col-4"><span class="c-red">*</span>开具凭证时,是否同步开具费用凭证单&nbsp;</label>
                        <div class="formControls f-l col-8">
                        <span class="switch-outer" :class="{'selected': openVoucher}" @click="changeVoucher">
                                <span class="switch-inner">
                                    <span class="switch-center"></span>
                                </span>
                        </span>
                        </div>
                    </div>
                </div>

                <div class="pl-20">

                    <h4>公司信息定制</h4>

                    <form id="postorders" class="form form-horizontal layui-layer-wrap">
                        <div class="cl mt-10 ">
                            <div class="f-l lh-31 w-250">公司品牌名称:&nbsp;</div>
                            <div class="f-l relative">
                                <input type="text" v-model="companyName" name="company_name" class="input-text">
                            </div>

                        </div>



                        <div class="cl mt-10">
                            <div class="f-l lh-31 w-250">凭证单抬头名称:&nbsp;</div>
                            <div class="f-l relative">
                                <input v-model="voucherName" type="text" name="voucher_name" class="input-text"  placeholder=""
                                       >
                            </div>

                        </div>

                        <div class="cl mt-10">
                            <div class="f-l lh-31 w-250">行程单抬头名称:&nbsp;</div>
                            <div class="f-l relative">
                                <input v-model="tripName" type="text" class="input-text"  placeholder=""
                                       name="trip_name">
                            </div>

                        </div>


                        <div class="cl mt-10">
                            <div class="f-l lh-31 w-250">公司LOGO:&nbsp;</div>
                            <div class="f-l">
                                <!--<label class="ml-10">-->
                                    <!--<input type="radio" @click="isSelectRoomType(1)" name="checkType"-->
                                           <!--:checked="zLogo">-->
                                    <!--正方形LOGO-->
                                <!--</label>-->
                                <!--<label class="ml-10">-->
                                    <!--<input type="radio" @click="isSelectRoomType(1)" name="checkType"-->
                                           <!--:checked="!zLogo">-->
                                    <!--长方形LOGO-->
                                <!--</label>-->

                                <div id="container" class="mt-15 clearfix">
                                    <a v-show="!isNotSupportOss && !imageInfoArr.length" id="selectfiles" href="javascript:void(0);" class='f-l'>
                                        <img class="ml-10 add-img" src="../assets/images/icon_camera.png" alt="">
                                    </a>

                                    <span id="ossfile" v-show="isNotSupportOss" class="f-l lh-30 c-red">您的浏览器不支持上传图片</span>
                                </div>

                                <div class="f-l ml-10 add-img relative" v-for="item in imageInfoArr">
                                    <span class="deleteImage c-white pointer" @click="deleteImage(item.id || 0)">x</span>
                                    <img @click="previewImage(item.url)" class="add-img" :src="item.url">
                                </div>
                            </div>
                        </div>

                    </form>
                </div>


                <div class="cl btn-box">
                    <a class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="clickPreview(0)"> 行程单预览</a>
                    <a class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="clickPreview(1)"> 凭证单预览</a>
                    <a class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="save()"> 保存</a>
                </div>
            </div>

        </div>
    </section>
</template>

<style lang="less" rel="stylesheet" scoped>
    .rule-box{
        border-bottom:1px solid #d7d8da;
        padding-bottom: 20px;
    }
    .btn-box{
        margin:50px auto;
        width: 500px;

    }
    .add-img{
        width: 80px;

    }
    .deleteImage {
        width: 20px;
        height: 20px;
        font-size: 14px;
        line-height: 18px;
        text-align: center;
        border-radius: 50%;
        background-color: red;
        position: absolute;
        right: -10px;
        top: -10px;
    }
</style>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import up from '../assets/js/ossUplpad.js';
    import previre from "../components/previewTripVoucher"
    let uploader = null;
    let ajaxData = null;
    let ossUrl = 'https://eqx-app-data.oss-cn-shenzhen.aliyuncs.com/';
    export default{
        ready(){

            ajaxData = null;
            let that = this;
            let opt = {
                url: base.gAjaxUrl.ossToken, // 向服务器获取oss服务器验证信息的链接
                numbers: 1, // 上传文件的数量
                width: 400, // 压缩后宽度
                height: 400, // 压缩后高度
                quality: 90, // 压缩后图片的质量，只对jpg格式的图片有效，默认为90
                crop: false, // 是否裁剪图片
                type: 'img', // 目前只支持图片
                maxSize: 3072, // 最大上传的图片尺寸大小，单位kb
                preserve_headers: false, // 压缩后是否保留图片的元数据，true为保留，false为不保留,默认为true。
                // 删除图片的元数据能使图片的体积减小一点点
                prevent_duplicates: true, // 是否不允许选取重复的文件，为true时表示不允许，为false时表示允许
                multi_selection: false, // 是否允许多选图片
                btnSelectId: 'selectfiles', // 点击选择图片按钮的id
                containerId: 'container',// 用来指定Plupload所创建的html结构的父容器，默认为前面指定的browse_button的父元
                readyCallback: function (up) { // uploader 初始化完成，并且浏览器兼容的情况下的回调
                    that.isNotSupportOss = false;
                },
                previewCallback: function (imageInfoArr) { // uploader 选择图片并且打算预览的情况下的回调
                    console.log("imageInfoArr");
                    console.log(imageInfoArr);
                    console.log("uploader",uploader);
                    that.imageInfoArr = imageInfoArr;
                },
                /**
                 * // 文件全部上传的图片，返回文件的文件名
                 * @param uuid_arr 图片文件名后缀的数组
                 * 图片的url = 'https://eqx-app-data.oss-cn-shenzhen.aliyuncs.com/' + uuid_arr[i]
                 */
                uploadedCallback: function (uuid_arr) {
                    console.log(uuid_arr);
                    // 需要清空数组的数据
                    if (uuid_arr.length) { // 如果有上传图片，就更新图片
                        ajaxData.logo = uuid_arr[0];
                    } else { // 如果没有上传图片，就使用imageInfoArr存储的url，如果没有地址，表示删除图片
                        // ajaxData.logo = that.imageInfoArr[0] || '';
                        ajaxData.logo = "";
                    }
                    $.ajax({
                        url: base.gAjaxUrl.voucherSet,
                        type: "POST",
                        contentType:"application/json",
                        data: JSON.stringify(ajaxData),
                    }).always(function (data) {
                        base.ajaxCallback(data, function () {
                            layer.msg("提交成功",{icon:1,time:1500});
                            that.getSet();
                        });
                    });
                    return false;
                }
            }
            this.getSet();
            uploader = up(opt);
            uploader.init();

            $('#postorders').validate({
                rules: {
                    company_name: {
                        maxlength: 40
                        // required: true,
                    },
                    trip_name: {
                        maxlength:40,
                        // required: true,
                    },
                    voucher_name: {
                        maxlength:40,
                        // required: true,
                    },
                },
                submitHandler: function () {
                    that.loading = true;
                    ajaxData = {
                        name: that.companyName ? that.companyName : localStorage.getItem("companyName"),
                        title:that.tripName ? that.tripName : '私车公用',
                        voucher_title: that.voucherName ? that.voucherName : '私车公用',
                        async_voucher: that.openVoucher,
                    };
                    !that.data && (ajaxData.stock = that.materialsNumber);
                    uploader.startPost();
                }
            });

        },
        props: [],
        data: function () {
            return {
                companyName:localStorage.getItem("companyName"),
                tripName:"私车公用",
                voucherName:"私车公用",
                openVoucher:false,
                zLogo:true,
                setData:{},
                imageInfoArr:[],
                globalImageSrc:"",
                isShowPreview:false,
                previewType:0,
            }
        },
        methods: {
            getSet:function(){
                $.ajax({
                    url:base.gAjaxUrl.voucherSet,
                    type:"GET",
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
                        if(data.name){
                            this.companyName = data.name;
                            this.tripName  = data.title;
                            this.voucherName = data.voucher_title;
                            this.openVoucher = data.async_voucher;
                            if(data.logo){
                                let imgurl = {
                                    url:data.logo
                                } ;
                                this.imageInfoArr = [];
                                this.imageInfoArr.push(imgurl);
                            }
                        }else{
                            this.companyName = localStorage.getItem("companyName");
                        }
                    })

                })
            },
            save: function () {
                $("#postorders").submit();
            },
            closeImagePreview: function (e) {
                this.globalImageSrc = "";
            },
            previewImage: function (url) {
                this.globalImageSrc = url;
            },
            deleteImage: function (id) {
                this.imageInfoArr = [];
                uploader.removeFile(id);
            },
            clickPreview:function(type){
                /*1---凭证单预览,0---行程单预览*/
                this.previewType = type;
                this.isShowPreview = true;
            },
            closePreview:function(){
                this.isShowPreview = false;
            },
            changeVoucher:function(){
                this.openVoucher = !this.openVoucher;
            }
        },
        filters: {

        },
        components:{
            previre
        }
    }
</script>
