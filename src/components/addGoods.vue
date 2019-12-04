﻿<template>
    <div v-show="globalImageSrc" id="previewWindow">
        <img id="previewWindowImage" v-bind:src="globalImageSrc"/>
        <span @click="closeImagePreview" class="close-btn-img">x</span>
    </div>
    <div class="layui-layer layui-anim layui-layer-page layui-modify materials-manage">
        <div class="layui-layer-title">物资管理</div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;"
               v-on:click="manageClose()"></a>
        </span>
        <div class="layui-layer-content pr-20" id="vehicle_content">
            <form id="postorders" class="form form-horizontal layui-layer-wrap">
                <div class="materialsMsg ">
                    <!--<h4 class="materials-title">物资信息 </h4>-->
                    <div class="row cl">
                        <label class="form-label f-l col-4"><span class="c-red">*</span>类目&nbsp;</label>
                        <div class="formControls f-l col-8">
                            <select name="materials_type" id="materialsType">
                                <option :selected="item.id === materials_type" value="{{item.id}}" v-for="item in type">
                                    {{item.type_name}}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="row cl">
                        <label class="form-label f-l col-4"><span class="c-red">*</span>名称&nbsp;</label>
                        <div class="formControls f-l col-4">
                            <input v-model="materialsName" type="text" class="input-text" value="" placeholder=""
                                   name="materials_name">
                        </div>
                    </div>
                    <div class="row cl">
                        <label class="form-label f-l col-4">图片&nbsp;</label>
                        <!--<div>故障描述<span class="fc-00CCC1">(图片<span id="imageNum" rel-data="0">0</span>/3)</span></div>-->
                        <div class="formControls f-l col-4">
                            <div id="container" class="mt-15 clearfix">
                                <a v-show="!isNotSupportOss" id="selectfiles" href="javascript:void(0);" class='f-l'>
                                    <img class="ml-10 add-img" src="../assets/images/icon_camera.png" alt="">
                                </a>
                                <div class="f-l ml-10 add-img relative" v-for="item in imageInfoArr">
                                    <span class="deleteImage c-white" @click="deleteImage(item.id || 0)">x</span>
                                    <img @click="previewImage(item.url)" class="add-img" :src="item.url">
                                </div>
                                <span id="ossfile" v-show="isNotSupportOss" class="f-l lh-30 c-red">您的浏览器不支持上传图片</span>
                                <!--<div id="postfiles" class="f-l ml-10 lh-30 c-red">1</div>-->
                            </div>
                        </div>
                        <!--<div class="formControls f-l col-8">-->
                        <!--<input v-model="" type="text" class="input-text" value="" placeholder=""-->
                        <!--name="materialsImg">-->
                        <!--</div>-->

                    </div>
                    <div class="row cl">
                        <label class="form-label f-l col-4"><span class="c-red">*</span>规格型号&nbsp; </label>
                        <div class="formControls f-l col-8">
                            <input v-model="materialsModel" type="text" class="input-text" value="" placeholder=""
                                   name="materials_model">
                        </div>
                    </div>
                    <div class="row cl">
                        <label class="form-label f-l col-4"><span class="c-red">*</span>单位&nbsp; </label>
                        <div class="formControls f-l col-8">
                            <input v-model="materialsUnit" type="text" class="input-text" value="" placeholder=""
                                   name="materials_unit">
                        </div>
                    </div>
                    <div @click="clickStock" class="row cl">
                        <label class="form-label f-l col-4"><span class="c-red">*</span>库存量&nbsp; </label>
                        <div class="formControls f-l col-8">
                            <input :disabled="isCompile" v-model="materialsNumber" type="text" class="input-text"
                                   value="" placeholder="" name="materials_number">
                        </div>
                    </div>
                    <div class="row cl">
                        <label class="form-label f-l col-4"><span class="c-red">*</span>单价(元)&nbsp; </label>
                        <div class="formControls f-l col-8">
                            <input v-model="materialsPrice" type="text" class="input-text" value="" placeholder=""
                                   name="price">
                        </div>
                    </div>
                    <div class="row cl">
                        <label class="form-label f-l col-4">备注&nbsp; </label>
                        <div class="formControls f-l col-8">
                            <textarea name="materialsRemark" style="width:200px;height:80px; resize:none;"
                                      v-model="materialsRemark"></textarea>
                        </div>
                    </div>
                </div>
            </form>

            <div class="set-rule">
                <div class="f-20 lh-30 mt-10 mb-10">设置领用权限</div>
                <span class="c-red f-14 lh-20">(注意一:勾选部门后不设置领用权限,则为全部门可不限数量领取~)</span><br/>
                <!--<span class="c-red f-14 lh-20" >(注意二:等级设置请按从小到大的规则设置~)</span><br />-->
                <div class="department-rule all-rule mt-10">
                    <span class="department-name btn btn-primary radius" @click="setAllDepartment">批量设置所选部门</span>
                    &nbsp;等级
                    <input v-model="allRuleLevelStart" type="number" class="input-text start">至
                    <input v-model="allRuleLevelEnd" type="number" class="input-text end">
                    &nbsp;领取上限
                    <select v-model="allRuleTarget" name="getRule">
                        <option value="20">每人</option>
                        <option value="10">每部门</option>
                    </select>
                    <select v-model="allRulePeriod" name="getDateRule">
                        <option value="0">不限</option>
                        <option value="10">每日</option>
                        <option value="20">每周</option>
                        <option value="30">每月</option>
                        <option value="60">每季度</option>
                        <option value="40">每半年</option>
                        <option value="50">每年</option>
                    </select>
                    &nbsp;数量<input v-model="allRuleNumber" type="number" class="input-text number">
                </div>

                <div class="all-box">
                    全选
                    <div class="m_check_box all-check" @click="selectAll()">
                        <ins v-show="checkAll" class="ins_checked"></ins>
                    </div>
                </div>

                <ul>
                    <li :id="'s'+ data.department_vo.id" v-for="data in allArr" v-show="data">
                        <div class="relative message_list_item pl-10">
                            <div class="m_check_box" @click="selectDepartment(data.department_vo.id)">
                                <ins v-show="data.department_vo.id | contains " class="ins_checked"></ins>
                            </div>
                            <div class="ml-30 department-rule">
                                <div v-show="data.department_vo.id | nocontains " class="mask" @click="clickMask"></div>
                                <span class="department-name text-overflow" title="{{data.department_vo.department_tree}}">{{data.department_vo.department_tree}}</span>
                                &nbsp;等级
                                <input :value="data.low_level || data.low_level === 0?+data.low_level:''" type="number"
                                       class="input-text start">至
                                <input :value="data.high_level && data.high_level != 999 ?+data.high_level:''"
                                       type="number" class="input-text end">
                                &nbsp;领取上限
                                <select name="getRule">
                                    <option :selected="data.target == 20" value="20">每人</option>
                                    <option :selected="data.target == 10" value="10">每部门</option>
                                </select>
                                <select name="getDateRule">
                                    <option :selected="data.period == 0" value="0">不限</option>
                                    <option :selected="data.period == 10" value="10">每日</option>
                                    <option :selected="data.period == 20" value="20">每周</option>
                                    <option :selected="data.period == 30" value="30">每月</option>
                                    <option :selected="data.period == 60" value="60">每季度</option>
                                    <option :selected="data.period == 40" value="40">每半年</option>
                                    <option :selected="data.period == 50" value="50">每年</option>
                                </select>
                                &nbsp;数量<input :value="data.period_number?+data.period_number:''" type="number"
                                               class="input-text number">
                            </div>
                        </div>
                    </li>
                </ul>

                <div class="btn btn-default radius close-btn" v-on:click="manageClose">取消</div>
                <div class="btn btn-primary radius save" v-on:click="save">保存</div>

            </div>
        </div>


    </div>
    <div class="layui-layer-shade"></div>
    <div class="m-loading" v-if="loading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .m-loading {
        left: 0;
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

    .m_check_box, .select_all_btn {
        width: 18px;
        height: 18px;
        position: absolute;
        left: 10px;
        top: 50%;
        margin-top: -10px;
        border: 1px solid #3a3a3a;
    }

    .m_check_box:hover, .select_all_btn:hover {
        border-color: #5a98de;
    }

    .materials-manage {
        top: 5%;
        margin-left: -44%;
        width: 90%;
        height: 90%;
    }

    .materialsMsg {
        position: absolute;
        width: 30%;
        height: 100%;
        left: 0;
        top: 0;
        .materials-title {
            position: absolute;
            top: -43px;
            left: 10px;
        }

    }

    .cl {
        margin-top: 6% !important;
    }

    .set-rule {
        margin-left: 3%;
        position: absolute;
        width: 67%;
        height: 100%;
        right: 0;
        top: 0;
        ul {
            max-height: 67%;
            overflow-y: auto;
            li {
                margin-top: 10px;
            }
        }
        input {
            box-sizing: border-box;
            border: solid 1px #ddd;
            width: 8%;
        }
        .close-btn {
            position: absolute;
            right: 80px;
            bottom: 10px;
        }
        .save {
            position: absolute;
            right: 10px;
            bottom: 10px;
        }
    }

    .layui-layer-content {
        width: 98%;
        height: 81%;
        max-height: 87% !important;
    }

    .all-box {
        padding-left: 40px;
        position: relative;
    }

    .all-check {
        top: 12px;
    }

    #materialsType {
        width: 50%;
        font-size: 14px;
    }

    .department-rule {
        position: relative;
        .mask {
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: #fff;
            filter: Alpha(Opacity=60);
            opacity: 0.6;
        }
        .department-name {
            display: inline-block;
            width: 250px;
            vertical-align: middle;
        }
    }

    .add-img {
        width: 50px;
        height: 50px;
    }

    .btn {
        height: auto;
    }

    .all-rule {
        margin-bottom: 20px;
        .department-name {
            margin-right: 39px;
        }
        /*margin:0 0 20px 30px;*/
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import up from '../assets/js/ossUplpad.js';
    let uploader = null;
    let ajaxData = null;
    let ossUrl = 'https://eqx-app-data.oss-cn-shenzhen.aliyuncs.com/';
    export default{
        ready(){
            if (this.data) {
                this.isCompile = true;
            }
            ajaxData = null;
            let that = this;
            console.log(!!this.data);
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
                    console.log("supported ready");
                },
                previewCallback: function (imageInfoArr) { // uploader 选择图片并且打算预览的情况下的回调
                    console.log(imageInfoArr);
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
                        ajaxData.url = ossUrl + uuid_arr[0];
                    } else { // 如果没有上传图片，就使用imageInfoArr存储的url，如果没有地址，表示删除图片
                        ajaxData.url = that.imageInfoArr[0] || '';
                    }
                    $.ajax({
                        url: that.materialsUrl,
                        type: that.materialsUrlType,
                        data: ajaxData,
                    }).always(function (data) {
                        base.ajaxCallback(data, function () {
                            that.imageInfoArr = [];
                            that.setMaterialsRule(data.id);
                            // that.$dispatch('add-goods-save');
                        });
                    });
                    return false;
                }
            }

            uploader = up(opt);
//            console.log('https://api.pinbayun.com/api/v1/oss_token/');
            uploader.init();
//            console.log(uploader);
            this.queryAjax();
            $.validator.addMethod("two_decimal", function (value, element, param) {
                return this.optional(element) || /^\d+\.{0,1}\d{0,2}$/.test(value);
//                return this.optional( element ) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test( value );
            }, $.validator.format("请输入正两位小数"));

            $('#postorders').validate({
                rules: {
                    materials_name: {
                        required: true,
                        maxlength: 10
                    },
                    materials_model: {
                        required: true,
                    },
                    materials_unit: {
                        required: true,
                    },
                    price: {
                        required: true,
                        number: true,
                        two_decimal: true,
                    },
                    materials_number: {
                        digits: true,
                        required: true,
                        number: true,
                    },
                },
                submitHandler: function () {
                    that.loading = true;
                    ajaxData = {
                        name: that.materialsName,
//                        stock: that.materialsNumber,
                        type: $("#materialsType").val(),
                        format: that.materialsModel,
                        unit: that.materialsUnit,
                        price: that.materialsPrice,
                        url: that.materialsImgUrl,
                        remark: that.materialsRemark,
                    };
                    !that.data && (ajaxData.stock = that.materialsNumber)
                    uploader.startPost();
                }
            });

        },
        props: ["type", "data", "materials_type"],
        data: function () {
            return {
                departmentList: [], // 部门数组
                loading: false,
                noData: false,
                materialsNumber: '', // 物资数量
                materialsTypeId: '', // 物资类型ID
                materialsName: '', // 物资的名称
                materialsModel: '', // 物资的类型
                materialsUnit: '', // 物资的单位
                materialsPrice: '', // 物资的单价
                materialsImgUrl: '', // 物资的图片链接
                materialsRemark: '', // 物资的备注
                materialsUrl: base.gAjaxUrl.materialsList, // 物资管理保存时的url
                materialsUrlType: 'POST', // 当时的url的type
                selectDepartmentArr: [], // 记录被选中的部门
                checkAll: false, //  是否是全选
                allArr: [],// 部门列表数组与规则数组的集合
//                showImageSrc: ["https://eqx-app-data.oss-cn-shenzhen.aliyuncs.com/263cff14-5b71-4575-8ac5-45a7b29730f7"],
                imageInfoArr: [],
                globalImageSrc: '',
                isNotSupportOss: true,
                allRuleLevelStart: "", // 批量设置的起始等级
                allRuleLevelEnd: "", // 批量设置的结束等级
                allRuleTarget: "20", // 批量设置的目标
                allRulePeriod: "0", // 批量设置的周期
                allRuleNumber: "", // 批量设置的数量
                isCompile: false, // 是否是物资编辑状态
            }
        },
        methods: {
            queryAjax: function () {
                this.loading = true;
                //修改参数
                $.ajax({
                    url: `${base.gAjaxUrl.departments}`,
                    type: 'GET',
                    data: {
                        search: '',
                        page: 1,
                        page_size: 999999,
                    }
                }).always((data)=> {
                    this.loading = false;
                    base.ajaxCallback(data, ()=> {
                        let resultData = data || [];
                        if (resultData.length) {
                            this.noData = false;
                            this.departmentList = resultData;
                            //回调
                        } else {
                            this.noData = true;
                        }
                        if (this.data) {
                            this.loading = true;
                            this.materialsNumber = this.data.stock; // 物资数量
                            this.materialsTypeId = this.data.id; // 物资类型ID
                            this.materialsName = this.data.name; // 物资的名称
                            this.materialsModel = this.data.format; // 物资的类型
                            this.materialsUnit = this.data.unit;// 物资的单位
                            this.materialsPrice = this.data.price; // 物资的单价
                            this.materialsImgUrl = this.data.url; // 物资的图片链接
                            if (this.materialsImgUrl) {
                                this.imageInfoArr = [{
                                    id: "id" + Math.floor(Math.random() * 0x111),
                                    url: this.materialsImgUrl
                                }];
                            }
                            this.materialsRemark = this.data.remark;// 物资的备注
                            this.getGoodsRule(this.data);
                            this.materialsUrl = base.gAjaxUrl.materialsList + this.data.id + '/';
                            this.materialsUrlType = "PATCH";
                        } else {
                            for (let j = 0, len_j = this.departmentList.length; j < len_j; j++) {
                                this.allArr.push({department_vo: this.departmentList[j]});
                            }

                        }

                    });
                })
            },
            selectDepartment: function (id) {
                let index = this.selectDepartmentArr.indexOf(id);
                index == -1 ? this.selectDepartmentArr.push(id) : this.selectDepartmentArr.splice(index, 1);
                if (this.selectDepartmentArr.length == this.allArr.length) {
                    this.checkAll = true;
                } else {
                    this.checkAll = false;
                }
            },
            manageClose: function () {
                let that = this;
                layer.confirm('确认关闭物资管理界面吗？', ()=> {
                    that.$dispatch('add-goods-close');
                    layer.closeAll('dialog');
                });
            },
            selectAll: function () {
                if (this.selectDepartmentArr.length == this.allArr.length) {
                    this.selectDepartmentArr = [];
                    this.checkAll = false;

                } else {
                    this.selectDepartmentArr = [];
                    for (var i = 0; i < this.allArr.length; i++) {
                        this.selectDepartmentArr.push(this.allArr[i].department_vo.id)
                    }
                    this.checkAll = true;
                }
            },
            save: function () {
                $("#postorders").submit();
            },
            setMaterialsRule: function (id) {
                let that = this;
                let ruleArr = [];
                for (var i = 0; i < this.selectDepartmentArr.length; i++) {
                    let materialsRuleId = this.selectDepartmentArr[i];
                    let currentId = "#s" + materialsRuleId;
                    let ruleObj = {}
                    ruleObj.department = materialsRuleId;
                    let startVal = $(currentId + " .start").val();
                    let endVal = $(currentId + " .end").val();

                    let max = 999;
                    let min = 0;

                    if (startVal === "" && endVal === "") {
                    } else if (startVal === "") {
                        max = endVal * 1;
                    } else if (endVal === "") {
                        min = startVal * 1;
                    } else {
                        startVal *= 1;
                        endVal *= 1;
                        max = startVal > endVal ? startVal : endVal;
                        min = startVal > endVal ? endVal : startVal;
                    }

                    ruleObj.low_level = min;
                    ruleObj.high_level = max;
                    ruleObj.target = $(currentId + " select:eq(0) option:selected").val();
                    ruleObj.period = parseInt($(currentId + " select:eq(1) option:selected").val());
                    $(currentId + " .number").val() === '' ? '' : ruleObj.period_number = $(currentId + " .number").val();
                    ruleArr.push(ruleObj);
                }
                $.ajax({
                    url: `${base.gAjaxUrl.materialsList}${id}/rules/`,
                    type: "POST",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify({data: ruleArr})
                }).always((data)=> {
                    base.ajaxCallback(data, function () {
                        that.loading = false;
                        layer.msg("保存成功", {icon: 1, time: 1500,})
                        that.$dispatch('add-goods-save');
                    });
                })
            },
            clickMask: function () {
                layer.msg("请先勾选该部门", {icon: 2, time: 1500,})
            },
            getGoodsRule: function (data) {
                let that = this;
                $.ajax({
                    url: `${base.gAjaxUrl.materialsGetRuleList}?goods=${data.id}`,
                    type: "GET",
                }).always((data)=> {
                    that.loading = false;
                    base.ajaxCallback(data, function () {
                                let results = data;
                                console.log(results.length);
                                if (results.length > 0) {
                                    let arr = [];
                                    for (let j = 0, len_j = that.departmentList.length; j < len_j; j++) {
                                        for (var i = 0; i < results.length; i++) {
                                            if (results[i].department_vo.id === that.departmentList[j].id) {
                                                break;
                                            } else if (i === results.length - 1) {
                                                arr.push({department_vo: that.departmentList[j]});
                                            }
                                        }
                                    }
                                    that.allArr = results.concat(arr);
                                    that.$nextTick(function () {
                                        for (var k = 0; k < results.length; k++) {
                                            that.selectDepartmentArr.push(results[k].department_vo.id);
                                        }
                                    })
                                } else {
                                    for (let k = 0, len_j = that.departmentList.length; k < len_j; k++) {
                                        that.allArr.push({department_vo: that.departmentList[k]});
                                    }
                                }


                            }
                    )
                })
            },
            closeImagePreview: function (e) {
                this.globalImageSrc = "";
            },
            previewImage: function (url) {
                this.globalImageSrc = url;
            },
            deleteImage: function (id) {
                for (let i = 0, len = this.imageInfoArr.length; i < len; i++) {
                    let item = this.imageInfoArr[i];
                    if (item.id === id) {
                        this.imageInfoArr.splice(i, 1);
                        break;
                    }
                }
                console.log(uploader.files);
                for (let i = 0, len = uploader.files.length; i < len; i++) {
                    let item = uploader.files[i];
                    if (item.id === id) {
                        uploader.files.splice(i, 1);
                        break;
                    }
                }

            },
            setAllDepartment: function () {
                let that = this;
                let selectIdArr = that.selectDepartmentArr;
                let itemArr = [].concat(that.allArr);
                that.allArr = [];
                for (let i = 0, len = selectIdArr.length; i < len; i++) {
                    for (let k = 0, length = itemArr.length; k < length; k++) {
                        if (selectIdArr[i] == itemArr[k].department_vo.id) {
                            itemArr[k].low_level = that.allRuleLevelStart;
                            itemArr[k].high_level = that.allRuleLevelEnd;
                            itemArr[k].target = that.allRuleTarget;
                            itemArr[k].period = that.allRulePeriod;
                            itemArr[k].period_number = that.allRuleNumber;
                        }
                    }
                }
                that.$nextTick(function () {
                    that.allArr = [].concat(itemArr);
                })
            },
            clickStock: function () {
                if (this.isCompile) {
                    layer.msg("修改库存在请在表格列表中的库存项中点击符号修改", {icon: 2, time: 2000});
                }
            }
        },
        filters: {
            contains: function (para) {
                return this.selectDepartmentArr.indexOf(para) > -1;
            },
            nocontains: function (para) {
                return this.selectDepartmentArr.indexOf(para) === -1;
            },
        },
    }
</script>
