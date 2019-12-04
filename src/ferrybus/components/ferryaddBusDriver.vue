<template>
<select_employee :title="title"  :data="dialogData"  v-if="(this.step==1)" v-on:dialog-close="dialogClose" v-on:dialog-next="dialogNext" v-on:did-selected-employee="didSelectedEmployee">
</select_employee>
</template>

<style lang="less">

</style>
<script>
import * as base from '../../assets/js/base.js';
import select_employee from "../components/ferryselect_employee.vue";

    let params = null;

    export default{
        ready () {
            params = {
                staff:'',
                vehicle:'',
            };
            let getData = this.data;
            // let selectedEmployee = '';
            let selectedVehicle = '';
            base.verticalCenter('.layui-modify');
            let driverInfo = getData;

            //类型判断
                this.ajaxUrl = base.gAjaxUrl.addDriver;
                this.ajaxType = 'POST';

        },
        props: ['title','type','data'],
        data:function(){
            return {

                step:1,

                selectedEmployees:[],
            }
        },
        methods: {

            close:function(){
                this.$dispatch('dialog-close');
            },
            dialogNext:function(selectedVehicle){
                var vm = this;
                var selectedEmployees = this.selectedEmployees;
                var selectedIds = [];
                for (var i=0; i<selectedEmployees.length; i++) {
                    selectedIds.push(selectedEmployees[i].id);
                }
                console.log(selectedIds)
                $.ajax({
                    url: this.ajaxUrl,
                    type: this.ajaxType,
                    contentType: "application/json",
                    data: JSON.stringify({staffs:selectedIds,})
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
                this.step += 1;
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
            }
    }
</script>

