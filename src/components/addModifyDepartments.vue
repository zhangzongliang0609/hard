<template>
    <div class="layui-anim mModifyDepartmentContainer bgc-fff">
        <div class="layui-layer-title fw-b">{{title}}</div>
        <div class="layui-layer-content">
            <form id="J-layer-form" class="form form-horizontal layui-layer-wrap">
                <div class="row cl">
                    <label class="form-label f-l col-4"><span class="c-red">*</span>部门名称：</label>
                    <div class="formControls f-l col-6">
                        <input autocomplete="off" v-model="departmentNameInput" type="text" class="input-text" value="" placeholder="请填写部门名称" name="department_name">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4">上级部门：</label>
                    <div class="formControls f-l col-6">
                        <input type="text" class="input-text" v-model="parentDepartment.department_name" placeholder="未选择上级部门" readonly @click="showSelect">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4">序号：</label>
                    <div class="formControls f-l col-6">
                        <input type="text" class="input-text" v-model="departmentOrder" placeholder="序号" />
                    </div>
                </div>
            </form>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
        </span>
        <div class="mt-10 clearfix pd-10 b-box">
            <a v-on:click="cancel" class="btn btn-default radius f-r mr-10">取消</a>
            <a v-on:click="save" class="btn btn-primary radius f-r mr-10">确认</a>
        </div>
    </div>
    <div class="layui-layer-shade mShade"></div>
    <sel :parent="parentDepartment" :name="departmentNameInput" :son="sonDepartment" v-if="isShowSelect" v-on:sel-close="selectClose" v-on:sel-save="selectSave"></sel>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>
<script>
    import * as base from '../assets/js/base.js';
    import sel from './selectParentDepartment.vue';
    export default{
        ready () {
            let that = this;
            let ajaxUrl = '';
            let ajaxType = '';
            let getData = this.depart;

            base.verticalCenter('.mModifyDepartmentContainer');
            
            //类型判断
            if(this.type == 'add'){ // 添加部门显示为空，传入后台1000
                ajaxUrl = base.gAjaxUrl.departments;
                ajaxType = 'POST';
                this.departmentNameInput = '';
                this.parentDepartment = getData.department_name ? { department_name: getData.department_name,id: getData.id} : {};
                this.departmentOrder = '';
            }else if(this.type == 'modify'){
                ajaxUrl = `${base.gAjaxUrl.departments}${getData.id}/`;
                ajaxType = 'PUT';
                this.departmentNameInput = this.getName(getData);
                this.parentDepartment = getData.parent_id ? {department_name: getData.parent_name, id: getData.parent_id} : {};
                this.sonDepartment = getData.department_name ? { department_name: getData.department_name,id: getData.id} : {};
                if(getData.node_id == 0 && getData.node_id !== '') { // 数值 0
                    this.departmentOrder = 0;
                } else {
                    this.departmentOrder = getData.node_id * 1;
                }
            }

            //验证
            $('#J-layer-form').validate({    
                rules: {            
                    department_name: {
                        required: true,
                    },
                },                 
                submitHandler:function() {
                    if(that.departmentNameInput.indexOf('/') != -1){
                        layer.msg("部门名称中不能包含/", {icon: 2, time: 1500});
                        return;
                    }
                    if(that.departmentNameInput.length > 128) {
                        layer.msg("部门名称不能超过128个字！", {icon: 2, time: 1500});
                        return;
                    }
                    if(that.type == 'modify' && that.depart.id == that.parentDepartment.id) {
                        layer.msg("部门重复，无法设置！", {icon: 2, time: 1500});
                        return;
                    }
                    if(that.departmentOrder * 1 != that.departmentOrder * 1 || that.departmentOrder < 0) {
                        layer.msg("序号是非负整数", {icon: 2, time: 1500});
                        return;
                    }
                    that.itemsLoading = true;
                    $.ajax({
                        url: ajaxUrl,
                        type: ajaxType,
                        contentType: 'application/json',
                        data: JSON.stringify({
                            department_name: that.departmentNameInput,
                            parent: that.parentDepartment.id || '',
                            node_id: that.getNodeId(that.departmentOrder),
                        }),
                    }).always(function(data) {
                        that.itemsLoading = false;
                        base.ajaxCallback(data, function(){
                            layer.msg('提交成功',{icon:1,time:1000});
                            that.$dispatch('depart-save');
                        });
                    });
                }             
            }); 
        },
        props: ['title','type','depart'],
        data:function(){
            return {
                departmentNameInput:'',
                parentDepartmentNameInput: '',
                parentDepartment: {},
                sonDepartment: {},
                isShowSelect: false,
                itemsLoading: false,
                departmentOrder: 0, // 产品要求默认值1000
            }
        },
        methods: {
            getNodeId (id) {
                if(id === '') {
                    return 1000
                } else {
                    return id * 1
                }
            },
            close:function(){
                this.$dispatch('depart-close');
            },
            getName: function (data) {
                if(data.parent_name){
                   return data.department_name.replace(`${data.parent_name}/`, "")
                }else{
                    return data.department_name
                }
            },
            save:function(){
                $('#J-layer-form').submit();
            },
            cancel: function () {
                this.$dispatch('depart-close');
            },
            showSelect: function () {
                this.isShowSelect = true;
            },
            selectClose: function () {
                this.isShowSelect = false;
            },
            selectSave: function (data) {
//                console.log(data);
                this.parentDepartment = data;
                this.isShowSelect = false;
            },
        },
        components: {
            sel,
        }
    }
</script>

<style scoped rel="stylesheet/less" lang="less">
    .mModifyDepartmentContainer {
        width: 400px;
        z-index: 111;
        animation-duration: .3s;
        .row {
            margin: 10px 0 0;
        }
    }
    .mShade {
        z-index: 110;
    }
</style>
