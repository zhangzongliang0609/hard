<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">
            确认{{title}}{{type == 'arrive' ? '到访' : '离开'}}
        </div>
        <div class="layui-layer-content pd-20">
            <form id="J-layer-form" class="form form-horizontal layui-layer-wrap">
                <div class="row cl" v-if="rules.duty_staff_cardnumber">
                    <label class="form-label f-l col-3 ">
                        <span class="c-red" v-show="rules.duty_staff">*</span>执勤人员：</label>
                    <!--                   <div class="formControls f-l col-6">-->
                    <!--                        <input v-model="dutyName" type="text" class="input-text" value="" placeholder="" name="duty_name">-->
                    <!--                    </div>-->
                    <div class="formControls f-l col-6">
                        <div class="department_select_container" @mouseleave="departmentEnter(false)"
                             @mouseenter="departmentEnter(true)">
                            <input v-if="departmentItem.length === 0" disabled type="text" class="input-text" name="duty_name"
                                   value="">
                            <input v-else autocomplete="off" @click="departmentClick" v-model="departmentSelectedName"
                                   type="text" class="input-text" value="" placeholder="" name="duty_name">
                            <i v-show="departmentSelectedName !== ''" class="empty-icon Hui-iconfont"
                               @click="emptySearch($event)">&#xe60b;</i>
                            <div class="departmentListBox" style="display: none">
                                <div :title="item.staff__real_name"
                                     v-for="item in departmentItem | filterBy departmentSelectedName in 'staff__real_name'"
                                     @click="setDepartmentValue(item)" class="departmentListItem">
                                    {{item.staff__real_name}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row cl" v-if="rules.duty_staff_cardnumber">
                    <label class="form-label f-l col-3 ">
                        <span class="c-red" v-show="rules.duty_cardnumber">*</span>来访证编号：</label>
                    <div class="formControls f-l col-6">
                        <input v-model="visitCard" type="text" class="input-text" placeholder="" name="visit_number">
                    </div>
                </div>

                <div class="row clearfix">
                    <label class="form-label f-l col-3">备注：</label>
                    <div class="formControls f-l col-6">
                                <textarea v-model="remark" type="text" class="textarea"
                                          placeholder="输入备注(最多300个字符)" name="remark"></textarea>
                    </div>
                </div>

                <div class="row clearfix">
                    <label class="form-label f-l col-3">随身物品：</label>
                    <div class="formControls f-l col-6">
                                <textarea v-model="personBelonging" type="text" class="textarea"
                                          placeholder="输入随身物品(最多300个字符)" name="person_belonging"></textarea>
                    </div>
                </div>

            </form>

            <div class="cl mt-20">

                <div class="btn btn-primary radius f-r ml-10" @click="confirm">确定</div>
                <div class="btn btn-default radius f-r" @click="close">取消</div>
            </div>
        </div>
        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
    </div>
    <div class="layui-layer-shade"></div>

</template>
<script>
    import * as base from "../assets/js/base.js";

    export default {
        ready() {
            this.getDepartments();
            console.log(this.rules);
            this.visitData = this.data.retinue ? this.data.retinue : this.data;
            this.remark = this.order.remark;
            this.personBelonging = this.order.personal_effects;
            // this.dutyName = this.visitData.duty_staff_name ? this.visitData.duty_staff_name : localStorage.getItem("user_name");
            base.verticalCenter(".layui-modify");
            let that = this;
            $('#J-layer-form').validate({
                rules: {
                    duty_name: {
                        required: this.rules.duty_staff,
                    },
                    visit_number: {
                        required: this.rules.duty_cardnumber,
                    },
                    person_belonging: {
                        maxlength: 300,
                    },
                    remark: {
                        maxlength: 300,
                    }
                },
                submitHandler: function () {
                    that.save();
                }
            });

        },
        props: ["data", "rules", 'type', 'order', 'title'],
        data() {
            return {
                visitData: {},
                dutyName: "",
                visitCard: "",
                personBelonging: "",
                remark: "",

                //下拉搜索
                departmentSelected: '',
                departmentSelectedName: '',
                isDepartmentFocus: '',
                departmentItem: [],
            }
        },
        methods: {
            close: function () {
                this.$dispatch("close")
            },
            confirm: function () {
                $('#J-layer-form').submit();
            },
            save: function () {
                // && this.rules.duty_staff
                var id = this.getDepartmentId(this.departmentSelectedName);
                if(this.departmentSelectedName){
                    if(!id) {
                        layer.msg('执勤人员名称不正确',{icon:2,time:1000});
                        return
                    }
                }

                $.showLoading();
                let data = {
                    remark: this.remark,
                    personal_effects: this.personBelonging,
                };
                let arr = [];
                if (Array.isArray(this.visitData)) {
                    this.visitData.map((item, index) => {
                        let obj = {}
                        if (this.type == 'arrive' && !item.arrive_time) {
                            obj.id = item.id;
                            obj.duty_staff_name = this.departmentSelectedName;
                            obj.duty_staff_name_id = this.departmentSelected;
                            obj.duty_id = this.visitCard;
                            arr.push(obj);
                        } else if (!item.leave_time && item.arrive_time) {
                            obj.id = item.id;
                            obj.leave_duty_name = this.departmentSelectedName;
                            obj.leave_duty_name_id = this.departmentSelected;
                            obj.duty_id = this.visitCard;
                            arr.push(obj);
                        }
                    })
                }
                else {
                    let data = {
                        id: this.visitData.id,
                        duty_id: this.visitCard,
                    }
                    if (this.type == 'arrive') {
                        data.duty_staff_name = this.departmentSelectedName;
                        data.duty_staff_name_id = this.departmentSelected;
                    } else {
                        data.leave_duty_name = this.departmentSelectedName;
                        data.leave_duty_name_id = this.departmentSelected;
                    }
                    arr.push(data);
                }
                data.items = arr;
                     $.ajax({
                         url: `${base.gAjaxUrl.visitRecords}${this.type}/`,
                         type: "POST",
                         contentType: "application/json",
                         data: JSON.stringify(data)
                     })
                         .always((data) => {
                         $.hideLoading();
                         base.ajaxCallback(data, () => {
                             layer.msg("提交成功", {icon: 1, time: 1500});
                             this.$dispatch("dialog-save");
                         })
                     })
            },

            // 清除搜索输入框
            emptySearch: function (e, type) {
                if (type) {

                } else {
                    this.departmentSelectedName = '';
                }
                $(e.target).nextAll(".departmentListBox").show();
            },
            departmentEnter: function (flag) {
                this.isDepartmentFocus = flag;
                !flag && $(".departmentListBox").hide();
            },
            setDepartmentValue: function (item) {
                console.log("setDepartmentValue");
                this.departmentSelectedName = item.staff__real_name;
                this.departmentSelected = item.staff_id;
                $(".departmentListBox").hide();
            },
            getDepartmentId: function (val) {
                var id = '';
                this.departmentItem.forEach(function (item) {
                    if (item.staff__real_name == val) {
                        id = item.staff_id;
                    }
                });
                return id;
            },
            departmentClick: function () {
                if (this.isDepartmentFocus) {
                    $(".departmentListBox").show();
                }
            },
            //获取执勤列表
            getDepartments() {
                $.ajax({
                    // url: `${base.gAjaxUrl.departments}?page=1&page_size=9999999`,
                    url: base.gAjaxUrl.get_publicsecurity,
                    type: 'GET',
                }).always((data) => {
                    this.departmentItem = data || [];  //staff__real_name
                });
            },
        },

    }
</script>
<style rel="stylesheet/less" lang="less" scoped>
    .layui-modify {
        width: 700px;
    }
</style>
