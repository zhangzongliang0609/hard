<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">{{type == 'add' ? '新增' : '修改'}}司机</div>
        <div class="layui-layer-content">
            <form id="J-layer-form" class="form form-horizontal layui-layer-wrap">
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>姓名：</label>
                    <div class="formControls f-l col-4">
                        <input v-model="usernameInput" type="text" class="input-text" value="" placeholder=""
                               name="username">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>性别：</label>
                    <div class="formControls f-l col-4">
                    <span class="select-box">
                <select v-model="sexSelected" name="sex" class="select">
                    <option value="" selected="">请选择</option>
                    <option v-bind:value="item.id" v-for="item in sexItem">{{item.value}}</option>
                </select>
                </span>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red" v-if="passwrodFlag">*</span>密码：</label>
                    <div class="formControls f-l col-4">
                        <input id="password" v-model="passwordInput" type="password" class="input-text" value=""
                               placeholder="" name="password">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red" v-if="passwrodFlag">*</span>确认密码：</label>
                    <div class="formControls f-l col-4">
                        <input type="password" class="input-text" value="" placeholder="" name="confirm_password">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>电话：</label>
                    <div class="formControls f-l col-4">
                        <input v-model="phoneInput" type="text" class="input-text" value="" placeholder="" name="phone">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>部门：</label>
                    <div class="formControls f-l col-4">
                        <div class="department_select_container" @mouseleave="departmentEnter(false)"
                             @mouseenter="departmentEnter(true)">
                            <input v-if="departmentItem.length === 0 && type === 'add'" disabled type="text"
                                   class="input-text" value="无可选择部门">
                            <input v-else autocomplete="off" @click="departmentClick($event)" v-model="departmentSelectedName"
                                   type="text" class="input-text" value="" placeholder="" name="department">
                            <i v-show="departmentSelectedName !== ''" class="empty-icon Hui-iconfont"
                               @click="emptyDepartmentSearch($event)">&#xe60b;</i>
                            <div class="departmentListBox" style="display: none">
                                <div v-bind:title="item.department_tree"
                                     v-for="item in departmentItem | filterBy departmentSelectedName in 'department_tree'"
                                     @click="setDepartmentValue(item)" class="departmentListItem">
                                    {{item.department_tree}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>职位：</label>
                    <div class="formControls f-l col-4">
                        <input v-model="positionInput" type="text" class="input-text" value="" placeholder=""
                               name="position">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>工号：</label>
                    <div class="formControls f-l col-4">
                        <input v-model="jobNumberInput" type="text" class="input-text" value="" placeholder=""
                               name="job_number">
                    </div>
                </div>
            </form>
        </div>
    <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
        <div class="layui-layer-btn" v-on:click="save"><a class="layui-layer-btn0" v-if="type!='check'">保存</a></div>
    </div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<script type="text/ecmascript-6">
    import * as base from '../../assets/js/base.js';

    export default{
        ready () {

            let that = this;
            let ajaxUrl = '';
            let ajaxType = '';

            base.verticalCenter('.layui-modify');
            this.init();

            //类型判断
            if (this.type == 'add') {
                ajaxUrl = base.gAjaxUrl.staffs;
                ajaxType = 'POST';
                this.passwrodFlag = true;
                this.departmentSelectedName = '';
            } else if (this.type == 'modify') {
                let getData = this.data.staff_vo || {};
                getData = JSON.parse(JSON.stringify(getData));
                ajaxUrl = `${base.gAjaxUrl.staffs}${getData.id}/`;
                ajaxType = 'PUT';
                this.passwrodFlag = false;
                this.usernameInput = getData.real_name;
                setTimeout(function () {
                    that.sexSelected = getData.sex;
                });
                this.departmentSelected = getData.department_vo.id;
                this.departmentSelectedName = getData.department_vo.department_tree || '--';
                this.positionInput = getData.position;
                this.phoneInput = getData.phone;
                this.jobNumberInput = getData.job_number;
            }

            $.validator.addMethod('mobile', function (value, element) {
                return this.optional(element) || /^1\d{10}$/.test(value);
            }, '请输入正确的手机号码');
            $.validator.addMethod("idCard", function (value, element, params) {
                if (!value) {
                    return true;
                } else {
                    // 18位和15位身份证号验证
//                    return /^[1-9]\d{5}(18|19|(2\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value) || /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$/.test(value);
                    // 测试最新要求 -- 18位最后一位可以是Xx,其余都是数字；15位全部是数字即可
                    return /^\d{17}[0-9Xx]$/.test(value) || /^\d{15}$/.test(value);
                }
            }, "请输入正确的身份证号");
            // 取消卡号的限制;有客户10位卡号
            // $.validator.addMethod("cardNumber", function (value, element, params) {
            //     return /^[0-9a-fA-F]{8}$/.test(value) || !value;
            // }, "使用8位数字和a-f字母");
            //验证
            $('#J-layer-form').validate({
                rules: {
                    username: {
                        required: true,
                    },
                    sex: {
                        required: true,
                    },
                    password: {
                        required: that.passwrodFlag,
                    },
                    confirm_password: {
                        required: that.passwrodFlag,
                        equalTo: "#password"
                    },
                    department: {
                        required: true,
                    },
                    position: {
                        required: true,
                    },
                    phone: {
                        required: true,
                        number: true,
                        mobile: true,
                    },
                    job_number: {
                        required: true,
                    },

                },
                submitHandler: function () {
                    that.itemsLoading = true;
                    let ajaxData = {
                        real_name: that.usernameInput,
                        sex: that.sexSelected,
                        department: that.departmentSelected,
                        position: that.positionInput,
                        phone: that.phoneInput,
                        job_number: that.jobNumberInput,
                    };
                    that.passwordInput && (ajaxData.password = that.passwordInput);
                    $.ajax({
                        url: ajaxUrl,
                        type: ajaxType,
                        contentType: 'application/json',
                        data: JSON.stringify(ajaxData),
                    }).always(function (data) {
                        console.log(data)
                        that.itemsLoading = false;
                        base.ajaxCallback(data, function () {
                            if(that.type == 'add') {
                                that.addDriver(data.id);
                            } else {
                                that.modifyDriver()
                            }
                        });
                    });
                }
            });
        },
        props: ['type', 'data'],
        data: function () {
            return {
                usernameInput: '',
                sexSelected: '',
                passwordInput: '',
                departmentSelected: '',
                departmentSelectedName: '',
                positionInput: '',
                phoneInput: '',
                jobNumberInput: '',
                departmentItem: [],
                cardNumberInput: '',
                passwrodFlag: '',//密码必填
                isDepartmentFocus: '', // 是否显示部门列表
                isBusFocus: '', // 是否显示车辆列表
                tagsArr: [],
                itemsLoading: false,
                sexItem: [
                    {
                        id: '1',
                        value: '男'
                    },
                    {
                        id: '2',
                        value: '女'
                    }
                ],
            }
        },
        methods: {
            close: function () {
                this.$dispatch('dialog-close');
            },
            save: function () {
                let data = this.data.staff_vo ? this.data.staff_vo : this.data;
                // 如果编辑的状态下修改了密码,就需要用户重新设置密码
                if (this.type == 'modify' && data.phone !== this.phoneInput && this.passwordInput === '') {
                    this.passwrodFlag = true;
                    layer.msg('修改了电话号码,请重新设置密码', {icon: 2, time: 1500})
                    return
                }
                if (this.phoneInput.length == 11) {
                    var id = this.getDepartmentId(this.departmentSelectedName);
                    if (!id) {
                        layer.msg('部门名称不正确', {icon: 2, time: 1000});
                    } else {
                        this.departmentSelected = id;
                        $('#J-layer-form').submit();
                    }
                } else {
                    layer.msg('手机号码数为11位数字哦', {icon: 2, time: 1000});
                }
            },
            departmentClick: function (e) {
                if (this.isDepartmentFocus) {
                    $(e.target).nextAll(".departmentListBox").show();
                }
            },
            departmentEnter: function (flag) {
                this.isDepartmentFocus = flag;
                !flag && $(".departmentListBox").hide();
            },
            setDepartmentValue: function (item) {
                this.departmentSelectedName = item.department_tree;
                this.departmentSelected = item.id;
                $(".departmentListBox").hide();
            },
            getDepartmentId: function (val) {
                var id = '';
                this.departmentItem.forEach(function (item) {
                    if (item.department_tree == val) {
                        id = item.id;
                    }
                });
                return id;
            },
            // 清除搜索输入框 -- 部门和车辆选择公用方法
            emptyDepartmentSearch: function (e) {
                this.departmentSelectedName = '';
                $(e.target).nextAll(".departmentListBox").show();
            },
            // 清除搜索输入框 -- 部门和车辆选择公用方法
            emptyBusSearch: function (e) {
                $(e.target).nextAll(".departmentListBox").show();
            },
            init: function () {
                this.getDepartmentsList();
            },

            getDepartmentsList: function () {
                this.itemsLoading = true;
                //获取部门列表
                $.ajax({
                    url: `${base.gAjaxUrl.departments}?page=1&page_size=9999999`,
                    type: 'GET',
                }).always((data)=> {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=> {
                        this.departmentItem = data || [];
                    });
                });
            },
            getTagIds: function (tagArr) {
                let arr = [];
                for (let i = 0, len = tagArr.length; i < len; i++) {
                    arr.push(tagArr[i].id);
                }
                return arr;
            },
            addDriver: function (id) {
                this.itemsLoading = true;
                $.ajax({
                    url: base.gAjaxUrl.ferryBusDriver,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        staff: id,
                    }),
                }).always((data)=> {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=> {
                        layer.msg('提交成功', {icon: 1, time: 1000});
                        this.$dispatch('dialog-save');
                    });
                })
            },
            modifyDriver: function () {
                this.itemsLoading = true;
                $.ajax({
                    url: base.gAjaxUrl.ferryBusDriver+ this.data.id + '/',
                    type: 'PATCH',
                    contentType: 'application/json',
                    data: JSON.stringify({
                    }),
                }).always((data)=> {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=> {
                        layer.msg('提交成功', {icon: 1, time: 1000});
                        this.$dispatch('dialog-save');
                    });
                })
            }
        },
        filters: {},

    }
</script>

<style lang="less" scoped rel="stylesheet/less">
    .layui-layer.layui-layer-page .layui-layer-content {
        padding-bottom: 100px;
    }
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
</style>
