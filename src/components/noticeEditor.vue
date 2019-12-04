<template>
    <div class="editor-container">
        <div class="view-header cl">
            <a href="javascript:;" class="f-l btn btn-primary radius" @click="goBack">返回</a>
            <div class="f-l ml-15 title">
                {{type == 'add' ? '新建公告' : '修改公告'}}
            </div>
            <a href="javascript:;" class="f-r btn btn-primary radius" @click="resetForm">重新创建公告</a>
        </div>
        <div class="cl m-content">
            <div class="leftBar">
                <div class="newsCoverBox no-selected">
                    <div class="coverTxt">封面图片</div>
                    <img :src="coverSrc || '../../static/images/notice-no-img.png'" alt="" class="coverImg"
                         @click="showImageView"/>
                    <a href="javascript:;" class="btn btn-primary changeCover radius" @click="changeCover">编辑图片</a>
                </div>
                <div class="clearfix b-b coverItem">
                    <div class="coverItemName no-selected">作者</div>
                    <input class="input-text coverItemInput" autocomplete="off" placeholder="公告作者(必填)" type="text"
                           name="author" v-model="author"/>
                </div>
                <div class="b-b cl m0 coverItem no-selected">
                    <div class="clearfix">
                        <div class="coverItemName no-selected pt-10 f-l">接收类型：</div>
                        <div class="right_selection f-l">
                            <div class="sel-all clearfix">
                                <div @click="changeTargetType('ALL')" class="selected f-l"
                                     :class="{sel: target_type == 'ALL'}">
                                    <i class="Hui-iconfont" v-if="target_type == 'ALL'">&#xe6a7;</i>
                                </div>
                                <div class="f-l ml-5">全部</div>
                            </div>
                            <div class="sel-department clearfix">
                                <div @click="changeTargetType('DEPARTMENT')" class="selected f-l"
                                     :class="{sel: target_type != 'ALL'}">
                                    <i class="Hui-iconfont" v-if="target_type != 'ALL'">&#xe6a7;</i>
                                </div>
                                <div class="f-l ml-5">部门</div>
                                <a v-if="target_type != 'ALL'" href="javascript:;"
                                   class="btn btn-primary addDepartment f-l ml-10" @click="addDepartment">添加</a>
                            </div>
                        </div>
                    </div>
                    <div class="departments-box clearfix"  v-show="target_type != 'ALL'">
                        <div v-for="(index, item) in selectedDepartments" track-by="$index" class="f-l item relative"
                             :class="{'ml': (index % 2 != 0)}">
                            <span :title="item.department_name">{{item.department_name}}</span>
                            <a href="javascript:;" class="deleteBtn" @click="deleteDeparts(index)">x</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="title_box">
                <input type="text" placeholder="请输入公告标题（必填）" v-model="title"/>
            </div>
            <div class="editor">
                <ue :notice="notice" v-on:ue-ready="ueReady" v-on:ue-destroy="ueDestroy"></ue>
            </div>
            <div class="rightBar">
                <div class="clearfix b-b summary">
                    <div class="summaryTxt no-selected">公告摘要</div>
                    <textarea class="summaryArea" autocomplete="off" maxlength="100" placeholder="新闻摘要(必填,字数100以内)"></textarea>
                </div>
                <!--<div class="clearfix b-b coverItem cl">-->
                    <!--<div class="coverItemName no-selected f-l pt-10">保存后是否发布</div>-->
                    <!--<div class="sel-box f-l" @click="clickSwitch">-->
                        <!--<span class="sel-mask" :class="{'open': status == 20}">-->
                            <!--<span class="sel-inner"></span>-->
                        <!--</span>-->
                    <!--</div>-->
                <!--</div>-->
                <a href="javascript:;" class="btn btn-primary previewNotice radius"
                   @click="previewNotice">预览公告</a>
                <a href="javascript:;" class="btn btn-primary saveContent radius"
                   @click="saveContent(10)">保存公告</a>
                <a href="javascript:;" class="btn btn-primary saveContent radius"
                   @click="saveContent(20)">保存并发布公告</a>
                <div class="clearfix b-b summary mt-20">
                    <div class="summaryTxt no-selected">温馨提示</div>
                    <p class="summaryTip red">
                        1. 建议图文内容图片尺寸宽度为650像素。<br/>
                        2. 接收类型选择【全部】时，将会对全公司员工发送公告。<br/>
                        3. 接收类型选择【部门】时，选择的部门有子部门，如果没有选择其子部门，则不会对子部门发送公告。<br/>
                    </p>
                </div>
            </div>
        </div>
        <div v-show="isShowChangeCover" class="showAddImage">
            <div class="addImageBox" :class="{'ani': !isShowChangeCover}">
                <div class="clearfix btns">
                    <a href="javascript:;" class="btn btn-primary mr-10 f-r saveBtn radius"
                       @click="saveCover">保存</a>
                    <a href="javascript:;" class="btn btn-default mr-10 f-r closeBtn radius"
                       @click="closeCover">取消</a>
                </div>
                <div class="relative showImage" v-for="imgData in imageInfoArr" style="text-align: center">
                    <span class="deleteImage" @click="deleteImage(imgData.id || 0)">x</span>
                    <img :src="imgData.url" alt="" @click="showImageView(imgData.url)"/>
                </div>
                <div class="selectImage" v-show="imageInfoArr.length == 0">
                    <img class="pointer addImageBtn" src="../../static/images/icon_camera.png" alt=""
                         @click="updateImg">
                    <p class="selectTxt">选择封面图片</p>
                </div>
                <div id="container" class="clearfix mt-5">
                    <input id="selectfiles" v-show="!isNotSupportOss" type="file" class="update-img"/>
                    <div class="recommend_size ml-10 text-c c-999" v-show="!isNotSupportOss">推荐尺寸：300x300 像素</div>
                    <div id="ossfile" v-show="isNotSupportOss" class="lh-30 c-red text-c mt-50">您的浏览器不支持上传图片</div>
                    <!--<div id="postfiles" class="f-l ml-10 lh-30 c-red">1</div>-->
                </div>
            </div>
            <div class="layui-layer-shade"></div>
        </div>
        <div class="m-loading" v-if="itemsLoading">
            <div class="cube1"></div>
            <div class="cube2"></div>
        </div>
        <pi v-if="isShowImageView" :src="showImageSrc" v-on:close-view="hideImageView"></pi>
        <pn v-if="isShowPreviewNotice" :data="selectNotice" @dialog-close="closePreview"></pn>
        <sel :departs="selectedDepartments" v-if="isShowSelectDepartment" v-on:sel-close="selClose"
             v-on:sel-save="selSave"></sel>
    </div>
</template>

<script type="text/ecmascript-6">

    import * as base from '../assets/js/base';
    import ue from '../components/ueditor.vue';
    import pi from '../components/previewImage.vue';
    import pn from '../components/previewNotice.vue';
    import sel from '../components/selectDepartments.vue';
    import up from '../assets/js/ossUplpad';
    import moment from 'moment';
    let uploader = null;
    let ossUrl = 'https://eqx-app-data.oss-cn-shenzhen.aliyuncs.com/';
    export default {
        props: ['type', 'notice'],
        ready: function () {
            this.initUpLoader();
            this.getDepartments();
        },
        data: function () {
            return {
                ajaxUrl: base.gAjaxUrl.notices,
                ajaxType: 'POST',
                selectedDepartments: [], // 选择的部门
                departments: [], // 所有部门集合
                isShowSelectDepartment: false, // 显示选择部门
                isShowPreviewNotice: false, // 显示公告预览
                selectNotice: {}, // 需要预览的公告内容
                itemsLoading: false,
                editor: null, // ueditor 编辑器对象
                isChange: null, // 是否对文章进行了上传操作
                title: '', // 公告标题
                author: '', // 公告作者
                status: 10, // 是否发布: 20 发布; 10 保存
                isShowImageView: false, // 是否显示图片预览
                showImageSrc: '', // 图片预览展示图片路径
                coverSrc: '', // 封面图片
                isNotSupportOss: true, // 是否支持图片上传组件
                isShowChangeCover: false, // 是否显示图片预览
                imageInfoArr: [], // 图片预览数组
                target_type: 'ALL', // 图片预览数组
                target_ids: '', // 图片预览数组
                noticeContent: '' // 公告图文内容
            }
        },
        methods: {
            addDepartment: function () {
                this.isShowSelectDepartment = true;
            },
            selSave: function (data) {
                this.selectedDepartments = data;
                console.log(data);
                this.isShowSelectDepartment = false;
            },
            selClose: function () {
                this.isShowSelectDepartment = false;
            },
            deleteDeparts: function (index) {
                this.selectedDepartments.splice(index, 1);
//                this.selectedDepartments.every((ite, i) => {
//                    if (item.id == ite.id) {
//                        this.selectedDepartments.splice(i, 1);
//                        return false; // 阻断循环
//                    }
//                    return true; // 继续循环
//                });
            },
            // 编辑时将公告内容重新编辑
            setNoticeData: function () {
                this.type = 'modify';
                this.target_type = this.notice.target_type;
                this.target_ids = this.notice.target_ids;
                this.title = this.notice.title;
                this.coverSrc = this.notice.img;
                this.noticeContent = this.notice.html || '';
                this.editor.setContent(this.noticeContent);
                this.status = this.notice.status;
                this.author = this.notice.author;
                this.ajaxType = 'PUT';
                this.ajaxUrl = base.gAjaxUrl.notices + this.notice.id + '/';
                $(".summaryArea").val(this.notice.content);
                this.setSelectedDepartments();
            },
            saveContent: function (status) {
                if (this.editor) {
                    this.status = status;
                    this.noticeContent = this.editor.getContent();
                    if (this.checkForm()) {
                        if (this.target_type == 'DEPARTMENT' && this.selectedDepartments.length == 0) {
//                            layer.confirm("确认不设定接收部门并保存公告？", (index) => {
//                                this.save();
//                                layer.close(index);
//                            })
                            layer.msg("请先选择接收部门后再保存和发布", {icon: 2, time: 1500});
                        } else{
                            this.save();
                        }
                    }
                } else {
                    layer.msg("编辑器初始化中。。。", {icon: 2, time: 2000});
                }
            },
            save: function () {
                this.itemsLoading = true;
                this.isChange = true;
                if (this.imageInfoArr.length) {
                    uploader.startPost();
                } else {
                    this.upLoad();
                }
            },
            upLoad: function (arr) {
                let ajaxData = {
                    title: this.title,
                    img: arr && arr.length ? (ossUrl + arr[0]) : this.coverSrc,
                    html: this.noticeContent,
                    content: $(".summaryArea").val(),
                    checked_ids: this.getIds(),
                    target_type: this.target_type,
                    status: this.status, // 新增时候，默认发布
                    author: this.author,
                };
                $.ajax({
                    url: this.ajaxUrl,
                    type: this.ajaxType,
                    contentType: "application/json",
                    data: JSON.stringify(ajaxData)
                }).always((data) => {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, () => {
                        this.notice = data;
                        this.setNoticeData();
                        layer.msg("保存成功", {icon: 1, time: 1500});
                    })
                })
            },
            // 检查需要上传的表单字段 flag表示是否要检查接收类型是否正确
            checkForm: function () {
//                if (!this.coverSrc) {
//                    layer.msg("请选择封面图片", {icon: 2, time: 2000});
//                } else if (!this.author) {
                if (!this.author) {
                    layer.msg("请输入公告作者", {icon: 2, time: 2000});
                } else if (!this.title) {
                    layer.msg("请输入公告标题", {icon: 2, time: 2000});
                } else if (/>请输入内容</.test(this.noticeContent) || !this.noticeContent) {
                    layer.msg("请输入公告内容", {icon: 2, time: 2000});
                } else if (!$(".summaryArea").val()) {
                    layer.msg("请输入公告摘要", {icon: 2, time: 2000});
                    $(".summaryArea").focus();
                } else {
                    return true
                }
                return false
            },
            getId: function (data) {
                var arr = [];
                for (var i = 0, len = data.length; i < len; i++) {
                    arr.push(data[i].id);
                }
                return arr;
            },
            // 重置表单初始值
            resetForm: function () {
                this.title = '';
                this.coverSrc = '';
                this.noticeContent = '';
                this.target_type = 'ALL';
                this.target_ids = '';
                this.type = 'add';
                this.editor.setContent("");
                this.status = 20;
                this.author = '';
                this.imageInfoArr = [];
                this.ajaxType = 'POST';
                this.ajaxUrl = base.gAjaxUrl.notices;
                uploader.files.splice(0);
            },
            changeCover: function () {
                this.isShowChangeCover = true;
            },
            initUpLoader: function () {
                let that = this;
                let opt = {
                    url: base.gAjaxUrl.ossToken, // 向服务器获取oss服务器验证信息的链接
                    numbers: 1, // 上传文件的数量
//                    width: 200, // 压缩后宽度 不传递这两个参数就不会压缩
//                    height: 100, // 压缩后高度
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
                        that.imageInfoArr = imageInfoArr;
                    },
                    /**
                     * // 文件全部上传的图片，返回文件的文件名
                     * @param uuid_arr 图片文件名后缀的数组
                     * 图片的url = 'https://eqx-app-data.oss-cn-shenzhen.aliyuncs.com/' + uuid_arr[i]
                     */
                    uploadedCallback: function (uuid_arr) {
                        that.upLoad(uuid_arr);
                        return false;
                    }
                };
                uploader = up(opt);

//                console.log('uploader.getOption()');
//                console.log(uploader.getOption());
//                let opts = uploader.getOption();
//                opts.resize.width = 'resize';
//              // opts 就是uploader的配置信息，可以直接

                uploader.init();
            },
            saveCover: function () {
                if (this.imageInfoArr.length) {
                    this.coverSrc = this.imageInfoArr[0].url;
                } else {
                    this.coverSrc = '';
//                    this.coverSrc = this.coverSrc || '';
                }
                this.isShowChangeCover = false;
            },
            closeCover: function () {
                this.isShowChangeCover = false;
            },
            updateImg: function () {
                if (this.isNotSupportOss) {
                    layer.msg("您的浏览器不支持图片上传", {icon: 2, time: 2000});
                    return;
                }
                $('#selectfiles').trigger('click');
            },
            removeOldSrc: function () {
                this.coverSrc = '';
            },
            deleteImage: function (id) {
                this.imageInfoArr = [];
                if (!id) {
                    return
                }
                for (let i = 0, len = uploader.files.length; i < len; i++) {
                    let item = uploader.files[i];
                    if (item.id === id) {
                        uploader.files.splice(i, 1);
                        break;
                    }
                }
            },
            showImageView: function (src) {
                if (src && typeof src == 'object') {
                    src = src.target.src
                }
                this.showImageSrc = src;
                this.isShowImageView = true;
            },
            hideImageView: function () {
                this.showImageSrc = '';
                this.isShowImageView = false;
            },
            // 预览公告
            previewNotice: function () {
                this.noticeContent = this.editor.getContent();
                if (this.checkForm()) {
                    this.selectNotice = {
                        title: this.title,
                        author: this.author,
                        pub_time: this.getCurrentTime(),
                        target_type: this.target_type,
                        html: this.editor.getContent(),
                        content: $(".summaryArea").val(),
                        status: this.status,
                        img: this.coverSrc,
                    };
                    this.isShowPreviewNotice = true;
                }
            },
            getCurrentTime: function () {
                let date = new Date();
                let y = (date.getFullYear());
                let m = (date.getMonth() + 1);
                m = m > 9 ? m : ('0' + m);
                let d = date.getDate();
                d = d > 9 ? d : ('0' + d);
                let h = date.getHours();
                h = h > 9 ? h : ('0' + h);
                let mi = date.getMinutes();
                mi = mi > 9 ? mi : ('0' + mi);
                let s = date.getSeconds();
                s = s > 9 ? s : ('0' + s);
                return y + '-' + m + '-' + d + ' ' + h + ':' + mi + ':' + s;
            },
            // 获取选择部门的集合
            getIds: function () {
                let str = '';
                if (this.target_type == 'DEPARTMENT') {
                    this.selectedDepartments.forEach((item, i) => {
                        str += item.id + ','
                    });
                }
                return str.slice(0, -1)
            },
            // 关闭预览公告
            closePreview: function () {
                this.isShowPreviewNotice = false;
            },
            clickSwitch: function () {
                this.status = this.status == 10 ? 20 : 10;
            },
            changeTargetType: function (target_type) {
                this.target_type = target_type;
            },
            ueReady: function (editor) {
                this.editor = editor;
                if (this.type == 'modify') {
                    this.setNoticeData();
                }
            },
            ueDestroy: function () {
                this.editor = null;
            },
            goBack: function () {
                layer.confirm('请确认公告保存后再离开当前页面', (i) => {
                    this.$emit("dialog-close", this.isChange);
                    layer.close(i)
                });
            },
            // 获取部门数据
            getDepartments: function () {
                this.itemsLoading = true;
                //修改参数
                $.ajax({
                    url: base.gAjaxUrl.departments,
                    type: 'GET',
                    data: {
                        page: 1,
                        page_size: 999999
                    }
                }).always((data)=> {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=> {
                        this.departments = data || [];
                        this.setSelectedDepartments()
                    });
                })
            },
            // 设置已选择的
            setSelectedDepartments: function () {
                let arr = [];
                this.departments.forEach((item, i) => {
                    if(this.target_ids.indexOf(item.id) > -1) {
                        arr.push(item)
                    }
                });
                this.selectedDepartments = arr;
            }
        },
        components: {ue, pi, pn, sel},

        filters: {},
    }
</script>

<style scoped lang="less" rel="stylesheet/less">
    .editor-container {
        position: absolute;
        left: 0;
        bottom: 0;
        top: 0;
        right: 0;
        overflow: hidden;
        background-color: #fff;
        padding: 10px;
        .m-content {
            position: absolute;
            left: 10px;
            top: 80px;
            right: 10px;
            bottom: 10px;
            min-height: 500px;
            box-sizing: border-box;
            border: 1px solid #e6e6e6;
            border-radius: 4px;
            margin: 0;
            padding: 10px;
            .leftBar {
                width: 220px;
                height: 100%;
                overflow-x: hidden;
                overflow-y: auto;
                box-sizing: border-box;
                .newsCoverBox {
                    width: 100%;
                    height: auto;
                    border: 1px solid #ccc;
                    box-sizing: border-box;
                    padding-bottom: 10px;
                    .coverTxt {
                        font-size: 16px;
                        line-height: 30px;
                        border-bottom: 1px solid #ccc;
                        box-sizing: border-box;
                        padding-left: 10px;
                        background-color: #eaeaea;
                    }
                    .coverImg { /* 正宽高比 400 * 250 */
                        width: 200px;
                        height: 200px;
                        margin-top: 10px;
                        margin-right: auto;
                        margin-left: auto;
                        display: block;
                        cursor: pointer;
                    }
                }
                .changeCover {
                    width: 200px;
                    margin: 10px auto 0;
                    display: block;
                }
            }
            .title_box {
                position: absolute;
                left: 240px;
                top: 10px;
                right: 240px;
                box-sizing: border-box;
                input {
                    height: 50px;
                    line-height: 30px;
                    font-size: 20px;
                    box-sizing: border-box;
                    padding: 5px 10px;
                    width: 100%;
                    border: 0 none;
                    border-bottom: 1px solid #aaa;
                    transition: all 0.3s ease;
                    font-weight: bold;
                    letter-spacing: 1px;
                    &:hover {
                        border-color: #333;
                    }
                }
            }
            .editor {
                position: absolute;
                left: 240px;
                bottom: 0;
                top: 80px;
                right: 240px;
                z-index: 10;
                /*max-width: 650px;*/
                /*margin-left: auto;*/
                /*margin-right: auto;*/
            }
            .rightBar {
                position: absolute;
                right: 10px;
                top: 10px;
                width: 220px;
                height: 100%;
                overflow-x: hidden;
                overflow-y: auto;
                box-sizing: border-box;
                .m0 {
                    margin: 0;
                }
                .summary {
                    border: 1px solid #ccc;
                    .summaryTxt {
                        font-size: 16px;
                        line-height: 30px;
                        border-bottom: 1px solid #ccc;
                        box-sizing: border-box;
                        padding-left: 10px;
                        background-color: #eaeaea;
                    }
                    .summaryArea {
                        outline: 0 none;
                        border: 0 none;
                        resize: none;
                        width: 100%;
                        line-height: 22px;
                        font-size: 14px;
                        height: 200px;
                        padding: 10px;
                        box-sizing: border-box;
                    }
                    .summaryTip {
                        padding: 10px;
                        box-sizing: border-box;
                        font-size: 10px;
                        line-height: 18px;
                    }
                }
                .saveContent {
                    width: 100%;
                    letter-spacing: 2px;
                    margin-top: 20px;
                }
                .previewNotice {
                    width: 100%;
                    letter-spacing: 2px;
                    margin-top: 20px;
                }
            }
            .coverItem {
                width: 100%;
                padding: 0 10px 10px;
                box-sizing: border-box;
                border: 1px solid #ccc;
                margin-top: 20px;
                overflow: hidden;
                .coverItemName {
                    font-size: 14px;
                    line-height: 30px;
                }
                .itemBox { /* 总宽度158 */
                    max-height: 90px;
                    overflow-x: hidden;
                    overflow-y: auto;
                    .item {
                        /*width: 42px;!* 一行显示2个 *!*/
                        width: 65px; /* 一行显示3个 */
                        border-radius: 3px;
                        box-sizing: border-box;
                        height: 24px;
                        line-height: 24px;
                        margin-top: 5px;
                        background-color: #1E9FFF;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                        color: #fff;
                        padding: 0 20px 0 5px;
                        &.ml {
                            margin-left: 4px;
                        }
                        .deleteBtn {
                            width: 18px;
                            height: 18px;
                            position: absolute;
                            right: 3px;
                            top: 3px;
                            border: 1px solid #fff;
                            box-sizing: border-box;
                            color: #fff;
                            font-size: 10px;
                            line-height: 16px;
                            text-align: center;
                            border-radius: 50%;
                        }
                    }
                }
                .sel-box {
                    margin-top: 14px;
                    margin-left: 5px;
                    width: 40px;
                    height: 20px;
                    border-radius: 10px;
                    cursor: pointer;
                    box-sizing: border-box;
                    position: relative;
                    background-color: #0099ff;
                    overflow: hidden;
                    span {
                        position: absolute;
                        left: 0;
                        top: 0;
                        cursor: pointer;
                        box-sizing: border-box;
                        border-radius: 10px;
                    }
                    .sel-mask {
                        background-color: rgba(255, 255, 255, .75);
                        width: 100%;
                        height: 100%;
                        left: 0;
                        transition: all 0.2s ease;
                        &.open {
                            left: 20px;
                        }
                    }
                    .sel-inner {
                        background-color: #fff;
                        width: 20px;
                        height: 20px;
                        border: 1px solid #ccc;
                    }
                }
                .selected {
                    text-align: center;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    margin: 0 auto;
                    box-sizing: border-box;
                    border: 1px solid #ccc;
                    font-size: 12px;
                    padding-top: 2px;
                    line-height: 12px;
                    font-weight: bold;
                    color: #fff;
                    cursor: pointer;
                    &.sel {
                        background-color: #0099ff;
                    }
                }
                .pt-10 {
                    padding-top: 10px;
                }
            }
        }
        .title {
            line-height: 31px;
            font-size: 18px;
            font-weight: bold;
            span {
                font-weight: normal;
                font-size: 14px;
                color: #646464;
            }

        }
        .showAddImage {
            z-index: 110;
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            .addImageBox {
                width: 480px;
                height: 330px;
                position: absolute;
                left: 50%;
                top: 50%;
                transition: transform 0.3s ease;
                transform: translate(-50%, -50%) scale(1);
                z-index: 110;
                border-radius: 5px;
                background-color: #f7f7f7;
                box-sizing: border-box;
                .selectImage {
                    width: 200px;
                    height: 200px;
                    margin: 50px auto 0;
                    text-align: center;
                    img {
                        width: 160px;
                        height: 160px;
                    }
                    p {
                        line-height: 40px;
                        width: 160px;
                        margin: 0 auto;
                    }
                }
                .showImage {
                    width: 240px;
                    height: 175px;
                    margin: 50px auto 0;
                    text-align: center;
                    img {
                        width: 240px;
                        height: 175px;
                    }
                    .deleteImage {
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        line-height: 30px;
                        font-size: 20px;
                        color: #fff;
                        position: absolute;
                        right: -10px;
                        top: -10px;
                        background-color: red;
                        cursor: pointer;
                    }
                }
                .btns {
                    position: absolute;
                    right: 0;
                    bottom: 10px;
                    width: 100%;
                    .closeBtn {
                        background-color: #ccc;
                    }
                }
                &.ani {
                    transform: translate(-50%, -50%) scale(0.2);
                }
            }
            .update-img {
                display: none;
            }
        }
    }

    .right_selection {
        margin-top: 10px;
        width: 126px;
        font-size: 14px;
        box-sizing: border-box;
        padding-left: 10px;
        .clearfix {
            box-sizing: border-box;
            height: 30px;
            padding-top: 5px;
            line-height: 20px;
        }
        .addDepartment {
            padding: 0 5px;
            height: 20px;
            line-height: 18px;
            font-size: 12px;
            border-radius: 3px;
        }
    }
    .departments-box {
        width: 100%;
        background-color: #eee;
        max-height: 90px;
        overflow-x: hidden;
        overflow-y: auto;
        min-height: 30px;
        .item {
            width: 90px;
            border-radius: 3px;
            box-sizing: border-box;
            height: 24px;
            line-height: 24px;
            margin-top: 5px;
            background-color: #1E9FFF;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            color: #fff;
            padding: 0 20px 0px 5px;
            &.ml {
                margin-left: 4px;
            }
            .deleteBtn {
                width: 18px;
                height: 18px;
                position: absolute;
                right: 3px;
                top: 3px;
                border: 1px solid #fff;
                box-sizing: border-box;
                color: #fff;
                font-size: 10px;
                line-height: 12px;
                text-align: center;
                border-radius: 50%;
            }
        }
    }
    .c-999 {
        color: #999;
    }

    .c-red {
        color: red;
    }

</style>
