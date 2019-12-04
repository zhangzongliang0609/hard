<template>
    <div v-show="globalImageSrc" id="previewWindow">
        <img id="previewWindowImage" :src="globalImageSrc"/>
        <span @click="closeImagePreview" class="close-btn-img">x</span>
    </div>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">{{title}}</div>
        <div class="layui-layer-content">
            <form id="J-layer-form" class="form form-horizontal layui-layer-wrap">
                <div class="row cl">
                    <label class="form-label f-l col-3 "><span class="c-red">*</span>平台名称：</label>
                    <div class="formControls f-l col-4">
                        <input v-model="addForm.name" type="text" name="terraceName" class="input-text"
                               placeholder="请输入...">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-3 ">公告内容：</label>
                    <div class="formControls f-l col-4">
                        <textarea class="remark" name="remark" placeholder="限300字内" maxlength="300"
                                  cols="60" rows="6" v-model="addForm.message"></textarea>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-3 ">是否启用互动平台：</label>
                    <div class="formControls f-l col-4">
                      <span class="switch-outer mt-5" :class="{'selected':addForm.is_active}"
                            @click="addForm.is_active = !addForm.is_active">
                                <span class="switch-inner">
                                    <span class="switch-center"></span>
                                </span>
                        </span>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-3 ">平台图片：</label>
                    <div class="formControls f-l col-8">
                        <div class="add_img_box clearfix">
                            <div class="f-l add_img_item relative" v-for="item in newAddImageSet">
                                <span class="deleteImage c-white" @click="deleteImage(item.id || 'no')">x</span>
                                <img @click="previewImage(item.url)" class="add_img" :src="item.url"/>
                            </div>
                        </div>
                        <div id="container" class="clearfix" v-show="newAddImageSet.length===0">
                            <a v-show="!isNotSupportOss" id="selectfiles"
                               href="javascript:void(0);"
                               class='f-l btn btn-primary radius'>上传图片</a>
                            <span id="ossfile" v-show="isNotSupportOss" class="f-l lh-30 c-red">您的浏览器不支持上传图片</span>
                        </div>
                        <span class="recommend_size ml-10">
                            限上传一张图片，图片大小不高于5M，建议图片尺寸180x180
                        </span>
                    </div>
                </div>

            </form>
        </div>
        <div class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;"
               @click="close()"></a>
        </div>
        <div class="layui-layer-btn" @click="save"><a class="layui-layer-btn0">保存</a></div>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<script type="text/ecmascript-6">
    import * as base from '../../assets/js/base.js';
    import up from '../../assets/js/ossUplpad.js';

    let uploader = null;

    export default {
        ready() {
            console.log(this.data);
            base.verticalCenter('.layui-modify');
            this.initUpload();
            if (this.type == 'modify') {
                let getData = this.data;
                this.addForm.name = getData.name;
                this.addForm.message = getData.message;
                this.addForm.is_active = getData.is_active;
                if (getData.images && getData.images !== 'null') {
                    this.addForm.images = getData.images;
                    this.newAddImageSet = [{id: "id" + Math.floor(Math.random() * 0x111), url: getData.images}];
                }
            }
            $('#J-layer-form').validate({
                rules: {
                    terraceName: {
                        required: true,
                        maxlength: 20,
                    },
                    remark: {
                        maxlength: 300,
                    },
                },
                submitHandler: function () {
                    uploader.startPost();
                }
            });
        },
        props: ['title', 'type', 'data'],
        data: function () {
            return {
                isNotSupportOss: true, // 是否不支持当前的 oss 上传
                globalImageSrc: '', // 需要预览的图片src
                buildingimg_set: [], // 宿舍楼图片 -- 上传至至服务器的数据，在上传前url属性是base64的字符串,上传之后url属性是http://格式的
                newAddImageSet: [], // 修改的情况下新增的图片数组
                oldImageSet: [], // 从modify切换过来的图片上数组
                max_img_num: 1, // 最大上传图片数量
                showImageEdit: false,
                addForm: {
                    name: '',
                    images: '',
                    message: '',
                    is_active: true,
                },
            }
        },
        methods: {
            initUpload: function () {
                var that = this;
                var ossUrl = 'https://eqx-app-data.oss-cn-shenzhen.aliyuncs.com/';
                var opt = {
                    url: base.gAjaxUrl.ossToken, // 向服务器获取oss服务器验证信息的链接
                    numbers: this.max_img_num, // 上传文件的数量
                    width: 400, // 压缩后宽度
                    height: 400, // 压缩后高度
                    quality: 90, // 压缩后图片的质量，只对jpg格式的图片有效，默认为90
                    crop: false, // 是否裁剪图片
                    type: 'img', // 目前只支持图片
                    maxSize: 5120, // 最大上传的图片尺寸大小，单位kb
                    preserve_headers: false, // 压缩后是否保留图片的元数据，true为保留，false为不保留,默认为true。
                    // 删除图片的元数据能使图片的体积减小一点点
                    prevent_duplicates: true, // 是否不允许选取重复的文件，为true时表示不允许，为false时表示允许
                    multi_selection: false, // 是否允许多选图片
                    btnSelectId: 'selectfiles', // 点击选择图片按钮的id
                    containerId: 'container',// 用来指定Plupload所创建的html结构的父容器，默认为前面指定的browse_button的父元
                    readyCallback: function (up) { // uploader 初始化完成，并且浏览器兼容的情况下的回调
                        that.isNotSupportOss = false;
//                        console.log("supported ready");
                    },
                    previewCallback: function (imageInfoArr) { // uploader 选择图片并且打算预览的情况下的回调
                        that.newAddImageSet = imageInfoArr;
                    },
                    beforeAddFilter: function (up) {
                        if (up.files.length + that.oldImageSet.length > that.max_img_num) {
                            up.files.pop();
                            layer.msg("最多上传1张照片", {icon: 2});
                        }
                    },
                    /**
                     * // 文件全部上传的图片，返回文件的文件名
                     * @param uuid_arr 图片文件名后缀的数组
                     * 图片的url = 'https://eqx-app-data.oss-cn-shenzhen.aliyuncs.com/' + uuid_arr[i]
                     */
                    uploadedCallback: function (uuid_arr) {
                        // console.log("uuid_arr---: ", uuid_arr);
                        for (var i = 0, len = uuid_arr.length; i < len; i++) {
                            that.newAddImageSet[i].url = ossUrl + uuid_arr[i];
                            that.addForm.images = ossUrl + uuid_arr[i];
                        }
                        that.addDriver();
                    }
                };
                uploader = up(opt);
                uploader.init();
            },
            previewImage: function (url) {
                this.globalImageSrc = url;
            },
            deleteImage: function (id) {
                for (let i = 0, len = this.newAddImageSet.length; i < len; i++) {
                    let item = this.newAddImageSet[i];
                    if (item.id === id) {
                        this.newAddImageSet.splice(i, 1);
                        break;
                    }
                }
                for (let i = 0, len = uploader.files.length; i < len; i++) {
                    let item = uploader.files[i];
                    if (item.id === id) {
                        uploader.files.splice(i, 1);
                        break;
                    }
                }
                this.addForm.images = this.newAddImageSet[0] || '';
            },
            closeImagePreview: function (e) {
                this.globalImageSrc = "";
            },
            save: function () {
                if (!this.addForm.name) {
                    layer.msg('请输入平台名称', {icon: 2, time: 1000});
                } else {

                    $('#J-layer-form').submit();
                }
            },
            addDriver: function (data) {
                let url = base.gAjaxUrl.interactList;
                let type = "POST";
                if (this.type === 'modify') { // 修改
                    url += this.data.id + '/';
                    type = 'PATCH';
                }
                $.showLoading();
                $.ajax({
                    url: url,
                    type: type,
                    contentType: 'application/json',
                    data: JSON.stringify(this.addForm),
                }).always((data) => {
                    $.hideLoading();
                    base.ajaxCallback(data, () => {
                        layer.msg("提交成功", {icon: 1, time: 1500});
                        this.$dispatch('dialog-save', this.type);
                    })
                })
            },
            close: function () {
                this.$dispatch('dialog-close');
            },
        },
        filters: {},
        components: {}
    }
</script>
<style lang="less" scoped type="text/less">
    .tag_item_list {
        /*width: 270px;*/
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
            box-sizing: border-box;
            padding: 0 5px;

            div {
                width: 100%;
                height: 100%;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }

        .tag_delete {
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

    .remark {
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 4px;
        box-sizing: border-box;
    }

    .add_img_item {
        margin-top: 10px;
        /*margin-left: 20px;*/

        .add_img {
            width: 50px;
            height: 50px;
        }
    }

    .recommend_size {
        line-height: 31px;
        color: #aaa;
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
