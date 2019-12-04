<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify f-14">
        <div class="layui-layer-title">{{type == "add" ? '添加' : "修改"}}补贴</div>
        <div class="layui-layer-content">
            <form id="J-layer-form" class="form form-horizontal layui-layer-wrap ">
                <div class="procedure_name mt-20">
                    <div class="row cl">
                        <label class="form-label f-l col-2"><span class="c-red">*</span>补贴类型：</label>
                        <div class="formControls f-l col-4">
                            <select name="" class="select-box" v-model="selectedType">
                                <option :value="item" v-for="item in typeArr">{{item}}</option>
                            </select>
                        </div>
                    </div>

                    <div class="row cl">
                        <label class="form-label f-l col-2"><span class="c-red">*</span>补贴方式：</label>
                        <div class="formControls f-l col-4">
                            <select name="" class="select-box" v-model="selectedMode">
                                <option :value="item" v-for="item in modeArr">{{item}}</option>
                            </select>
                        </div>
                    </div>

                    <div class="row cl">
                        <label class="form-label f-l col-2"><span class="c-red">*</span>补贴参数：</label>
                        <div class="formControls f-l col-4">
                            <input type="text" class="input-text" v-model="parameter" name="parameter">
                        </div>
                    </div>

                    <div class="row cl">
                        <label class="form-label f-l col-2"><span class="c-red">*</span>补贴单价：</label>
                        <div class="formControls f-l col-4">
                            <input type="text" class="input-text" v-model="price" name="price">
                        </div>
                    </div>

                    <div class="row cl">
                        <label class="form-label f-l col-2">补贴说明：</label>
                        <div class="formControls f-l col-4">
                            <textarea name="remake" v-model="remake" class="textarea" cols="30" rows="10"></textarea>
                        </div>
                    </div>

                </div>
            </form>


            <!-- 生效范围 -->
            <div class="procedure_range mt-15 lh-30">
                <div class="range_title clearfix">
                    <span class="f-l f-20 b-l pl-10">生效范围</span>
                    <a class="f-l ml-15 btn btn-primary radius" href="javascript:;" v-on:click="addRange()">添加</a>
                </div>
                <div class="range_content clearfix row  pl-15">
                    <div class="selected_type f-l col-2">
                        <div @click="scope_type = 20" class="select_btn"
                             :class="{'selected' : scope_type == 20}">指定部门
                        </div>
                        <div @click="scope_type = 10" class="select_btn"
                             :class="{'selected' : scope_type == 10}">指定人员
                        </div>
                    </div>
                    <div v-show="scope_type == 20" class="selected_content f-l clearfix col-10">
                        <div v-for="item in departments" class="select_item f-l" track-by="$index">
                            <span>{{item.department_name}}</span>
                            <span @click="deleteItem(item, $index, 'departments')" class="delete_btn c-fff"><i
                                    class="Hui-iconfont">&#xe60b;</i></span>
                        </div>
                    </div>
                    <div v-show="scope_type == 10" class="selected_content f-l clearfix col-10">
                        <div v-for="item in staffs" class="select_item f-l">
                            <span>{{item.real_name}}</span>
                            <span @click="deleteItem(item, $index, 'staffs')" class="delete_btn c-fff"><i
                                    class="Hui-iconfont">&#xe60b;</i></span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;"
               v-on:click="close()"></a>
        </span>
        <div class="layui-layer-btn" v-on:click="save"><a class="layui-layer-btn0">保存</a></div>
    </div>
    <!-- 选择部门 -->
    <sel :departs="departments" :is_single="isDepartmentSingleSelect" :is_double_click="doubleClick" v-if="isShowSelectDepartment"
         v-on:sel-close="departmentClose" :dbl_selected_child="dblSelectedChild" v-on:sel-save="departmentSave"></sel>
    <sel_staff :list="staffs" :is_single="isStaffSingleSelect" v-if="isShowSelectStaff" v-on:sel-close="staffClose"
               v-on:sel-save="staffSave"></sel_staff>
    <sel_staff :list="approves" :is_single="isApproveSingleSelect" v-if="isShowSelectApprove"
               v-on:sel-close="approveClose" v-on:sel-save="approveSave"></sel_staff>
    <div class="layui-layer-shade"></div>

</template>

<style lang="less" scoped rel="stylesheet/less">
    .layui-layer.layui-layer-page .layui-layer-content {
        min-height: 350px;
        max-height: 400px;
        overflow: auto;
        padding: 0 20px 60px;
    }

    .b-l {
        box-sizing: border-box;
        border-left: 5px solid #ccc;
    }

    .pl-15 {
        padding-left: 15px;
    }

    .range_content {
        box-sizing: border-box;
        height: 120px;
        .selected_type {
            .select_btn {
                margin-right: auto;
                margin-left: auto;
                width: 80px;
                height: 32px;
                line-height: 30px;
                box-sizing: border-box;
                border-radius: 3px;
                border: 1px solid #5a98de;
                text-align: center;
                color: #5a98de;
                margin-top: 18px;
                cursor: pointer;
                &.selected {
                    background-color: #5a98de;
                    color: #fff;
                }
            }
        }
        .selected_content {
            border-radius: 4px;
            border: 1px solid #ccc;
            box-sizing: border-box;
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 10px 15px 15px;
            .select_item {
                padding: 0 38px 0 8px;
                line-height: 30px;
                background-color: #5a98de;
                color: #fff;
                margin-top: 5px;
                margin-left: 5px;
                border-radius: 3px;
                position: relative;
                .delete_btn {
                    cursor: pointer;
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 30px;
                    height: 30px;
                    text-align: center;
                    font-size: 20px;
                    line-height: 25px;
                    vertical-align: middle;
                }
            }
        }
    }

    .procedure_order {
        .order_container {
            box-sizing: border-box;
            .btn_add {
                width: 100%;
                height: 40px;
                line-height: 38px;
                font-size: 20px;
                padding: 0;
                border-radius: 5px;
            }
        }
        .table {
            border: 1px solid #ddd;
            .btn_add_approve {
                font-size: 14px;
                line-height: 20px;
                height: 20px;
                padding: 3px 10px;
                border-radius: 4px;
                background-color: #5a98de;
                color: #fff;
                text-decoration: none;
                &:hover {
                    background-color: #06c;
                }
            }
            .approve_box {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-wrap: wrap;
                .approve_staff {
                    padding: 4px 33px 4px 8px;
                    font-size: 14px;
                    line-height: 18px;
                    background-color: #aaa;
                    color: #fff;
                    position: relative;
                    border-radius: 3px;
                    flex-grow: 0;
                    flex-shrink: 0;
                    .approve_delete {
                        width: 20px;
                        height: 20px;
                        font-size: 16px;
                        line-height: 16px;
                        text-align: center;
                        position: absolute;
                        right: 5px;
                        top: 4px;
                        cursor: pointer;
                    }
                }
            }
            .set_condition {
                position: relative;
                &:hover .abstract {
                    display: block;
                }
                .abstract {
                    position: absolute;
                    width: 120px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    background-color: #fafafa;
                    line-height: 20px;
                    right: 0;
                    top: -10px;
                    padding: 5px 10px;
                    text-align: left;
                    transform: translate(50%, -100%);
                    z-index: 1;
                    display: none;
                }
            }
            .btn_set_condition.outer {
                display: block;
                margin-left: auto;
                margin-right: auto;
                width: 50px;
                height: 26px;
                border-radius: 15px;
                background-color: #5a98de;
                box-shadow: 0 0 0 1px inset #ddd;
                cursor: pointer;
                &._close {
                    background-color: rgba(42, 128, 255, 0.2);
                    .inner {
                        transform: translate(0, 0);
                    }
                }
                .inner {
                    display: block;
                    width: 26px;
                    height: 26px;
                    background-color: #fff;
                    border-radius: 50%;
                    box-shadow: 0 0 0 1px inset #ddd;
                    transform: translate(100%, 0);
                    transition: all 0.2s ease;
                }
            }
        }
    }
</style>


<script type="text/ecmascript-6">

    import * as base from '../assets/js/base.js';
    import sel from './selectDepartment.vue';
    import sel_staff from './selectStaff.vue';

    export default{
        ready () {
            //验证
            let that = this;
            let ajaxUrl = "";
            let ajaxType = "";

            if(this.type == "add"){

                ajaxUrl = base.gAjaxUrl.subsidyList;
                ajaxType = "POST";
            }else{
                this.getDetail()
                ajaxUrl = `${base.gAjaxUrl.subsidyList}${this.data.id}/`;
                ajaxType = "PATCH";

            }
            $.validator.addMethod('floatNum',function(value, element){
                var length = value.length;
                var reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$|^0$/;
                return this.optional(element) || reg.test( value );
            },'请输入正确的金额');
            $('#J-layer-form').validate({
                rules: {
                    parameter: {
                        required: true,
                        maxlength:80,
                    },
                    price: {
                        required: true,
                        floatNum:true,
                    },
                    remake: {
                        maxlength:500,
                    },

                },
                submitHandler:function() {

                    let targetIds = [];
                    if(that.scope_type == 20){
                        targetIds = that.departments.map((item)=>{
                            return item.id
                        })
                    }else{
                        targetIds = that.staffs.map((item)=>{
                            return item.id
                        })
                    }

                    $.ajax({
                        url: ajaxUrl,
                        type:ajaxType,
                        contentType:"application/json",

                        data: JSON.stringify({
                            type: that.selectedType,
                            mode: that.selectedMode,
                            parameter: that.parameter,
                            uprice: that.price,
                            target_ids:targetIds,
                            remake:that.remake,
                            scope_type:that.scope_type,

                        }),
                    })
                        .always(function(data) {
                            base.ajaxCallback(data,function(){
                                layer.msg('提交成功',{icon:1,time:1000});
                                that.$dispatch('dialog-save');
                            });
                        });



                }
            });
        },

        props: ['type', 'data'],
        data: function () {
            return {
                ajaxUrl: '',
                ajaxType: '',
                doubleClick:false, // 是否额外监听双击事件
                procedureName: '', // 流程名称
                scope_type: 20, // 生效范围的类型: 20 表示部门; 10 表示员工
                isShowSelectDepartment: false, // 展示添加部门
                isDepartmentSingleSelect: false, // 是否为单选
                departments: [], // 需要添加的部门集合
                isShowSelectStaff: false, // 展示添加员工
                isStaffSingleSelect: false, // 是否为单选
                isShowSelectApprove: false, // 展示添加审批人
                isApproveSingleSelect: false, // 是否为单选
                staffs: [], // 需要添加的员工集合
                typeArr:["里程补贴"], // 补贴类型
                modeArr:["里程数补贴"], // 补贴模式
                parameter:"",
                price:"",
                remake:"",
                selectedType:"",
                selectedMode:"",
                dblSelectedChild:true, // 双击是否选择所有子部门
            }
        },
        methods: {
            initModifyData () {
                this.scope_type = this.data.scope_type;
                this.orders = this.data.approv_nodes;
                this.procedureName = this.data.approv_name;
                if (this.scope_type == 10) {
                    this.staffs = [...this.data.approv_rule.staffs];
                } else {
                    this.departments = [...this.data.approv_rule.departments];
                }
            },
            deleteItem (item, index, typeName) {
                console.log("deleteItem: ", typeName);
                this[typeName].splice(index, 1);
            },
            getDetail:function(){
                $.showLoading();
                $.ajax({
                    url:`${base.gAjaxUrl.subsidyList}${this.data.id}/`,
                    type:"GET",

                }).always((data)=>{
                    $.hideLoading();
                    base.ajaxCallback(data,()=>{
                        this.parameter = data.parameter;
                        this.price = data.uprice;
                        this.remake = data.remake;
                        this.selectedType = data.type;
                        this.selectedMode = data.mode;
                        this.scope_type = data.scope_type;
                        this.departments = data.departments || [];
                        this.staffs = data.staffs || [];
                    })
                })
            },
            // 部门/员工 选择部分
            addRange () {
                if (this.scope_type == 20) {
                    this.isDepartmentSingleSelect = false;
                    this.isShowSelectDepartment = true;
                } else {
                    this.isStaffSingleSelect = false;
                    this.isShowSelectStaff = true;
                }
            },
            departmentSave (data) {
                this.isShowSelectDepartment = false;
                this.departments = data || [];
            },
            departmentClose () {
                this.isShowSelectDepartment = false;
            },
            staffSave (data) {
                this.staffs = data || [];
                this.isShowSelectStaff = false;
            },
            staffClose () {
                this.isShowSelectStaff = false;
            },
            // 添加审批人
            addApprove (index) {
                this.orderIndex = index;
                this.approves = this.orders[index].approvers || [];
                this.isApproveSingleSelect = false;
                this.isShowSelectApprove = true;
            },
            approveSave (data) {
                data = data || [];
                this.orders[this.orderIndex].approvers = data;
                this.isShowSelectApprove = false;
            },

            // 获取生效范围对象
            getRange () {
                var res = [];
                var arr = this[this.scope_type == 20 ? 'departments' : 'staffs'];
                for (let i = 0, len = arr.length; i < len; i++) {
                    res.push(arr[i].id);
                }
                return res;
            },

            close () {
                this.$dispatch('dialog-close', false);
            },
            save () {
                if(!this.selectedType){
                    layer.msg("补贴类型不能为空",{icon:2,time:2000});
                    return;
                }else if(!this.selectedMode){
                    layer.msg("补贴方式不能为空",{icon:2,time:2000});
                    return;
                }else if(!this.getRange().length){
                    layer.msg("请添加生效范围再保存",{icon:2,time:2000});
                    return;
                }
                $("#J-layer-form").submit();
            }
        },
        components: {sel, sel_staff},
    }
</script>
