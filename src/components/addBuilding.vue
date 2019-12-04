<template>
    <div v-show="globalImageSrc" id="previewWindow">
        <img id="previewWindowImage" v-bind:src="globalImageSrc"/>
        <span @click="closeImagePreview" class="close-btn-img">x</span>
    </div>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">{{title}}</div>
        <div class="layui-layer-content">
            <form action="" id="J-layer-form" class="cl form form-horizontal layui-layer-wrap">
                <div class="row cl">
                    <label class="form-label f-l col-3">
                        <span class="c-red">*</span>
                        宿舍楼名称&nbsp;:&nbsp;
                    </label>
                    <div class="formControls f-l col-6">
                        <input autocomplete="off" type="text" name="buildingName" title="" v-model="buildingName"
                               class="input-text"/>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-3">
                        宿舍楼地址&nbsp;:&nbsp;
                    </label>
                    <div class="formControls f-l col-6">
                        <input autocomplete="off" type="text" name="address" title="" v-model="buildingAddress"
                               class="input-text"/>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-3">
                        管理员名称&nbsp;:&nbsp;
                    </label>
                    <div class="formControls f-l col-6">
                        <input autocomplete="off" type="text" name="name" title="" v-model="managerName"
                               class="input-text"/>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-3">
                        管理员电话&nbsp;:&nbsp;
                    </label>
                    <div class="formControls f-l col-6">
                        <input autocomplete="off" type="text" name="phone" title="" v-model="managerPhone"
                               class="input-text"/>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-3">
                        分组&nbsp;:&nbsp;
                    </label>
                    <div class="formControls f-l col-6">
                        <tags :tags="wTagsArr" :selected="tagsArr"></tags>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-3">
                        图片&nbsp;:&nbsp;
                    </label>
                    <div class="formControls f-l col-6">
                        <div class="add_img_box clearfix">
                            <div class="f-l add_img_item relative" v-for="item in buildingimg_set">
                                <span class="deleteImage c-white" @click="deleteImage(item.id || 'no')">x</span>
                                <img @click="previewImage(item.url)" class="add_img" :src="item.url"/>
                            </div>
                        </div>
                        <div id="container" class="clearfix">
                            <a v-show="!isNotSupportOss" id="selectfiles" href="javascript:void(0);"
                               class='f-l btn btn-primary radius'>上传图片</a>
                            <a v-show="!isNotSupportOss" @click="editImages" id="editImages" href="javascript:void(0);"
                               class='ml-10 f-l btn btn-primary radius'>图片编辑</a>
                            <span class="recommend_size ml-10">推荐尺寸：400x400(限10张内)</span>
                            <span id="ossfile" v-show="isNotSupportOss" class="f-l lh-30 c-red">您的浏览器不支持上传图片</span>
                            <!--<div id="postfiles" class="f-l ml-10 lh-30 c-red">1</div>-->
                        </div>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-3">
                        备注&nbsp;:&nbsp;
                    </label>
                    <div class="formControls f-l col-6">
                        <textarea class="remark" name="remark" placeholder="限150字" v-model="buildingRemark"
                                  maxlength="120" cols="60" rows="6"></textarea>
                    </div>
                </div>
            </form>
            <button v-on:click="save" class="f-r btn btn-primary radius mt-20 mr-20" type="button">保存</button>
        </div>
    <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
    </div>
    <div class="m-loading" v-if="isShowLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
    <div class="layui-layer-shade"></div>
    <div class="uper" v-show="showImageEdit">
        <edit v-if="showImageEdit" :data="buildingimg_set" v-on:edit-save="saveImageNames"
              v-on:edit-close="closeImageNames"></edit>
    </div>
</template>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import tags from './setTags';
    import edit from './editImage.vue'
    import up from '../assets/js/ossUplpad.js';
    var uploader = null;

    export default{
        ready () {
            let getData = JSON.parse(JSON.stringify(this.data));
            if (this.type == 'add') {
                this.ajaxUrl = base.gAjaxUrl.buildings;
                this.ajaxType = 'POST'
            } else if (this.type == 'compile') {
                this.buildingName = getData.building_name;
                this.buildingAddress = getData.addr;
                this.buildingRemark = getData.remark;
                this.tagsArr = getData.tags;
                this.managerName = getData.real_name || '';
                this.managerPhone = getData.phone || '';
                this.ajaxUrl = `${base.gAjaxUrl.buildings}${getData.id}/`;
                this.ajaxType = 'PUT';
                this.oldImageSet = getData.imgs || [];
                this.concatOldNew();
            }
            this.initUpload();
            this.getTagList();
            this.initForm();
        },
        data: function () {
            return {
                isShowLoading: false,
                buildingName: '',
                buildingAddress: '',
                buildingRemark: '',
                managerName: '',
                managerPhone: '',
                ajaxUrl: '',
                ajaxType: '',
                isNotSupportOss: true, // 是否不支持当前的 oss 上传
                globalImageSrc: '', // 需要预览的图片src
                buildingimg_set: [], // 宿舍楼图片 -- 上传至至服务器的数据，在上传前url属性是base64的字符串,上传之后url属性是http://格式的
                newAddImageSet: [], // 修改的情况下新增的图片数组
                oldImageSet: [], // 从modify切换过来的图片上数组
                max_img_num: 10, // 最大上传图片数量
                showImageEdit: false,
                tagsArr: [],
                wTagsArr: [],
            }
        },
        props: ["title", 'type', 'data'],
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
                    maxSize: 3072, // 最大上传的图片尺寸大小，单位kb
                    preserve_headers: false, // 压缩后是否保留图片的元数据，true为保留，false为不保留,默认为true。
                    // 删除图片的元数据能使图片的体积减小一点点
                    prevent_duplicates: true, // 是否不允许选取重复的文件，为true时表示不允许，为false时表示允许
                    multi_selection: true, // 是否允许多选图片
                    btnSelectId: 'selectfiles', // 点击选择图片按钮的id
                    containerId: 'container',// 用来指定Plupload所创建的html结构的父容器，默认为前面指定的browse_button的父元
                    readyCallback: function (up) { // uploader 初始化完成，并且浏览器兼容的情况下的回调
                        that.isNotSupportOss = false;
//                        console.log("supported ready");
                    },
                    previewCallback: function (imageInfoArr) { // uploader 选择图片并且打算预览的情况下的回调
//                        console.log("imageInfoArr: ");
//                        console.log(imageInfoArr);
                        // 调试数据
//                        var str = '';
//                        for(var i = 0, len = imageInfoArr.length; i < len; i++) {
//                            str += imageInfoArr[i].id.slice(-5, 9999) + " "
//                        }
//                        console.log(str);
                        that.newAddImageSet = imageInfoArr;
                        that.addNewImage();
                    },
                    beforeAddFilter: function (up) {
                        if (up.files.length + that.oldImageSet.length > that.max_img_num) {
                            up.files.pop();
                            layer.msg("最多上传10张照片", {icon: 2});
                        }
                    },
                    /**
                     * // 文件全部上传的图片，返回文件的文件名
                     * @param uuid_arr 图片文件名后缀的数组
                     * 图片的url = 'https://eqx-app-data.oss-cn-shenzhen.aliyuncs.com/' + uuid_arr[i]
                     */
                    uploadedCallback: function (uuid_arr) {
//                        console.log("uuid_arr---: ", uuid_arr);
                        for (var i = 0, len = uuid_arr.length; i < len; i++) {
                            that.newAddImageSet[i].url = ossUrl + uuid_arr[i];
                        }
                        that.setBuildingSet();
                    }
                };
                uploader = up(opt);
//            console.log('https://api.pinbayun.com/api/v1/oss_token/');
                uploader.init();
            },
            close: function () {
                this.$dispatch('dialog-close');
            },
            save: function () {
                if (this.checkImageNames()) {
                    $('#J-layer-form').submit();
                } else {
                    layer.msg("图片必须设定名字", {icon: 2, time: 1500})
                }
            },
            setBuildingSet: function () {
                for (var i = 0, len = this.buildingimg_set.length; i < len; i++) {
                    var item = this.buildingimg_set[i];
                    for (var j = 0, len_j = this.newAddImageSet.length; j < len_j; j++) {
                        var img = this.newAddImageSet[j];
                        if (item.id == img.id) {
                            item.url = img.url;
                            break;
                        }
                    }
                }
                $.ajax({
                    url: this.ajaxUrl,
                    type: this.ajaxType,
                    contentType: 'application/json',
                    data: JSON.stringify({
                        building_name: this.buildingName,
                        addr: this.buildingAddress,
                        phone: this.managerPhone,
                        real_name: this.managerName,
                        remark: this.buildingRemark,
                        tags_set: this.getTagIds(this.tagsArr),
                        buildingimg_set: this.buildingimg_set
                    })
                }).always( (data) => {
                    this.isShowLoading = false;
                    base.ajaxCallback(data, () => {
                        layer.msg('提交成功', {icon: 1, time: 1000});
                        this.$dispatch('dialog-save');
                    });
                });
            },
            checkImageNames: function () {
                var flag = true;
                $.each(this.buildingimg_set, function (i, item) {
                    if (!item.name) {
                        flag = false;
                        return false;
                    }
                });
                return flag;
            },
            saveImageNames: function (data) {
                this.showImageEdit = false;
                this.filterOldNewImage(data);
            },
            closeImageNames: function () {
                this.showImageEdit = false;
            },
            getTagList: function () {
                this.isShowLoading = true;
                //1代表员工,2代表宿舍, 3代表大巴车,4代表公务车
                $.ajax({
                    url: base.gAjaxUrl.tagGroup,
                    type: 'GET',
                    data: {
                        type: 2,
                        page: 1,
                        page_size: 999999,
                        flag: 'tag_building'
                    }
                }).always((data) => {
                    this.isShowLoading = false;
                    base.ajaxCallback(data, () => {
                        this.wTagsArr = data.results || [];
                    })
                })
            },
            getTagIds: function (tagArr) {
                var arr = [];
                for (var i = 0, len = tagArr.length; i < len; i++) {
                    arr.push(tagArr[i].id);
                }
                return arr;
            },
            initForm: function () {
                $.validator.addMethod('phone', function (value, element) {
                    // /^1\d{10}$/ 来自支付宝的正则
                    return this.optional(element) || /^1\d{10}$/.test(value);
                }, '请输入正确的手机号码');
                base.verticalCenter('.layui-modify');
                $('#J-layer-form').validate({
                    rules: {
                        buildingName: {
                            required: true,
                        },
                        phone: {
                            required: false,
                            phone: true
                        }
                    },
                    submitHandler: function () {
                        this.isShowLoading = true;
                        uploader.startPost();
                    }
                })
            },
            editImages: function () {
                this.showImageEdit = true;
            },
            addNewImage: function () {
                var max_new = this.max_img_num - this.oldImageSet.length;
                if (max_new == 0) {
                    this.newAddImageSet = [];
                    uploader.files = [];
                    layer.msg("最多上传10张照片", {icon: 2});
                    return;
                }
                // 新增的数组图片，根据 id 重新赋值
                for (var i = 0, len = this.newAddImageSet.length; i < len; i++) {
                    var item = this.newAddImageSet[i];
                    for (var j = 0, len_j = this.buildingimg_set.length; j < len_j; j++) {
                        var val = this.buildingimg_set[j];
                        if (val.id == item.id) {
                            this.newAddImageSet[i].name = val.name;
                            break;
                        }
                    }
                }
                this.concatOldNew();
            },
            // 删数组
            filterOldNewImage: function (data) {
                var arr = [];
                for (var i = 0, len = this.oldImageSet.length; i < len; i++) {
                    var item = this.oldImageSet[i];
                    for (var j = 0, len_j = data.length; j < len_j; j++) {
                        var val = data[j];
                        if (val.id == item.id) {
                            this.oldImageSet[i].name = val.name;
                            break;
                        } else if (j == len_j - 1) {
                            arr.push(item.id);
                        }
                    }
                }
                for (i = 0, len = this.newAddImageSet.length; i < len; i++) {
                    item = this.newAddImageSet[i];
                    for (j = 0, len_j = data.length; j < len_j; j++) {
                        val = data[j];
                        if (val.id == item.id) {
                            this.newAddImageSet[i].name = val.name;
                            break;
                        } else if (j == len_j - 1) {
                            arr.push(item.id);
                        }
                    }
                }
                this.editDeleteImage(arr);
            },
            // 将新增的和原来的图片数组合并到 buildingimg_set
            concatOldNew: function () {
                var arr = [].concat(this.oldImageSet);
                for (var i = 0, len = this.newAddImageSet.length; i < len; i++) {
                    var item = this.newAddImageSet[i];
                    arr.push({
                        id: item.id,
                        url: item.url,
                        name: item.name || ""
                    })
                }
                this.buildingimg_set = arr;
            },
            isInside: function (id, arr) {
                for (var i = 0, len = arr.length; i < len; i++) {
                    if (id == arr[i].id) return true
                }
                return false;
            },
            closeImagePreview: function (e) {
                this.globalImageSrc = "";
            },
            previewImage: function (url) {
                this.globalImageSrc = url;
            },
            editDeleteImage: function (arr) {
                for (var i = 0, len = arr.length; i < len; i++) {
                    this.deleteImage(arr[i], true);
                }
                this.concatOldNew();
            },
            // 删除图片删除三个数组
            deleteImage: function (id, noRefresh) {
                for (var i = 0, len = uploader.files.length; i < len; i++) {
                    var item = uploader.files[i];
                    if (item.id === id) {
                        uploader.files.splice(i, 1);
                        break;
                    }
                }
                for (i = 0, len = this.oldImageSet.length; i < len; i++) {
                    item = this.oldImageSet[i];
                    if (item.id === id) {
                        this.oldImageSet.splice(i, 1);
                        break;
                    }
                }
                for (i = 0, len = this.newAddImageSet.length; i < len; i++) {
                    item = this.newAddImageSet[i];
                    if (item.id === id) {
                        this.newAddImageSet.splice(i, 1);
                        break;
                    }
                }
                if (!noRefresh) this.concatOldNew();
            },

        },
        components: {
            tags,
            edit
        }
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>

    .remark {
        width: 100%;
    }

    textarea {
        resize: none;
    }

    .recommend_size {
        line-height: 31px;
        color: #aaa;
    }

    .add_img_box {
        width: 100%;
        box-sizing: border-box;
        max-height: 152px;
        min-height: 82px;
        /*box-shadow: 0 0 0 1px #ccc;*/
        padding: 10px;
        padding-top: 0;
        border: 1px solid #ccc;
        border-radius: 4px;
        overflow-x: hidden;
        overflow-y: auto;
        .add_img_item {
            margin-top: 20px;
            margin-left: 20px;
            .add_img {
                width: 50px;
                height: 50px;
            }
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
    }

    #container {
        margin-top: 15px;
    }

    .uper {
        position: fixed;
        z-index: 102;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        min-height: 600px;
        /*background-color: green;*/
    }

</style>

