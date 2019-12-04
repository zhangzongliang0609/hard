<template>
<select_employee :title="dialogTitle" :type="dialogType" :data="dialogData"  v-if="(this.step==1)" v-on:dialog-close="dialogClose" v-on:dialog-next="dialogNext" v-on:did-selected-employee="didSelectedEmployee" v-on:did-selected-department="didSelectedDepartment" v-on:dialog-save="dialogSave"></select_employee>
<!--<select_vehicle :title="dialogTitle" :type="dialogType" :data="dialogData"  v-if="(this.step==2)" v-on:dialog-close="dialogClose" v-on:did-selected-vehicle="didSelectedVehicle" v-on:dialog-save="dialogSave"></select_vehicle>-->
</template>

<style lang="less">

</style>
<script>
import * as base from '../assets/js/base.js';
import select_employee from "../components/select_employee_as_approver.vue";

     let params = null;

    export default{
        ready () {
            params = {
                staff:'',
                department:'',
            }
            let that = this;
            let ajaxUrl = base.gAjaxUrl.approvers;
            let ajaxType = 'POST';
            let step = 1;
            let getData = this.data;
            base.verticalCenter('.layui-modify');
            let driverInfo = getData;

            //类型判断
            if(this.type == 'add'){
                this.ajaxUrl = base.gAjaxUrl.approvers;
                this.ajaxType = 'POST';
                this.dialogTitle = '选择绑定车辆';
            }else if(this.type == 'modify'){
                this.step = 2;
                this.ajaxUrl = `${base.gAjaxUrl.approvers}${getData.id}/`;
                this.ajaxType = 'PUT';
                this.selectedEmployee = getData.staff_vo;
            }
        },
        props: ['title','type','data'],
        data:function(){
            return {
                isShowAddDialog:true,
                step:1,
                selectedEmployee: '',
                selectDepartment: '',
                selectedDepartment:''
            }
        },
        methods: {
            dialogNext:function(){
                this.step += 1;
            },
            close:function(){
                this.$dispatch('dialog-close');
            },
            dialogSave:function(){
                var vm = this;
                var selectedEmployee = this.selectedEmployee;
                var selectedDepartment = this.selectedDepartment;
                console.log(selectedEmployee)
                console.log(selectedDepartment)
                if (!selectedDepartment) {
                    // 人员为空
                    layer.msg("请选择审批部门")
                    return
                }
                if (!selectedEmployee) {
                    // 人员为空
                    layer.msg("请选择人员")
                    return
                }
                $.ajax({
                    url: this.ajaxUrl,
                    type: this.ajaxType,
                    data: {
                        staff: selectedEmployee.id,
                        department: selectedDepartment
                    }
                })
                .always(function(data) {
                    base.ajaxCallback(data,function(){
                        layer.msg('提交成功',{icon:1,time:1000});
                        vm.$dispatch('dialog-save');
                    });
                });
                //放到外面后添加后不会自动添加到driver里面了所以要个定时器.
                setTimeout(function(){
                    vm.$dispatch('dialog-save');
                },500);
            },
            didSelectedEmployee:function(selectedEmployee){
                this.selectedEmployee = selectedEmployee;
            },
            didSelectedDepartment:function(selectedDepartment){
                this.selectedDepartment = selectedDepartment;
            }
        },
        components: {
            select_employee,
            }
    }
</script>

