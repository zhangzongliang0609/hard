<template>
<select_employee :title="dialogTitle" :type="dialogType" :data="dialogData"  v-if="(this.step==1)" v-on:dialog-close="dialogClose" v-on:dialog-next="dialogNext" v-on:did-selected-employee="didSelectedEmployee" v-on:dialog-save="dialogSave">   
</select_employee>
<!--<select_vehicle :title="dialogTitle" :type="dialogType" :data="dialogData"  v-if="(this.step==2)" v-on:dialog-close="dialogClose" v-on:did-selected-vehicle="didSelectedVehicle" v-on:dialog-save="dialogSave"></select_vehicle>-->
</template>

<style lang="less">

</style>
<script>
import * as base from '../assets/js/base.js';
import select_employee from "../components/select_employee.vue";
import select_vehicle from "../components/select_vehicle.vue";

    let params = null;

    export default{
        ready () {
            params = {
                staff:'',
                vehicle:'',
            };
            let that = this;
            let ajaxUrl = base.gAjaxUrl.shuttlebusdrivers;
            let ajaxType = 'POST';
            let step = 1;
            let getData = this.data;
            // let selectedEmployee = '';
            let selectedVehicle = '';
            base.verticalCenter('.layui-modify');
            let driverInfo = getData;

            //类型判断
            if(this.type == 'add'){
                this.ajaxUrl = base.gAjaxUrl.shuttlebusdrivers;
                this.ajaxType = 'POST';
                this.dialogTitle = '选择绑定车辆';
            }else if(this.type == 'modify'){
                this.step = 2;
                this.ajaxUrl = `${base.gAjaxUrl.shuttlebusdrivers}${getData.id}/`;
                this.ajaxType = 'PUT';
                this.selectedEmployee = getData.staff_vo;
                this.selectedVehicle = getData.vehicle_vo;
                this.dialogTitle = '修改绑定车辆';
            }
        },
        props: ['title','type','data'],
        data:function(){
            return {
                car_no:'',
                car_brand:'',
                car_model:'',
                car_color:'',
                seats:'',
                car_type:'',
                remark:'',
                isShowAddDialog:true,
                step:1,
                
                selectedEmployees:[],
            }
        },
        methods: {
            dialogNext:function(){
                this.step += 1;
            },
            close:function(){
                this.$dispatch('dialog-close');
            },
            dialogSave:function(selectedVehicle){
                // var vm = this;
                // var selectedEmployee = this.selectedEmployee;
                // $.ajax({
                //     url: this.ajaxUrl,
                //     type: this.ajaxType,
                //     data: {
                //         staff: selectedEmployee.id/*,
                //         去除添加司机选择车辆
                //         vehicle: selectedVehicle.id*/
                //     }
                // })
                this.isShowAddDialog = true;
                var vm = this;
                var selectedEmployees = this.selectedEmployees;
                var selectedIds = []; 
                for (var i=0; i<selectedEmployees.length; i++) {
                    selectedIds.push(selectedEmployees[i].id);                    
                    // console.log(selectedIds);
                    // console.log(selectedEmployees[i].id);
                }
                console.log(selectedIds);
                $.ajax({
                    url: this.ajaxUrl+'bulk_create/',
                    type: this.ajaxType,
                    contentType:"application/json",
                    data: JSON.stringify({
                        staffs: selectedIds,
                        /*taff: selectedEmployee.id/*,
                        去除添加司机选择车辆
                        vehicle: selectedVehicle.id*/
                    })
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
                // vm.$dispatch('dialog-save');
            },
            didSelectedEmployee:function(selectedEmployee){
                this.selectedEmployees = selectedEmployee;
            },
            didSelectedVehicle:function(selectedVehicle){
                this.selectedVechicle = selectedVehicle;
            }
        },
        components: {
            select_employee,
            // select_vehicle
            }
    }
</script>

