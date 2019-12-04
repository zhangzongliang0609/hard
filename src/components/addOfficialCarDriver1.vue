<template>
    <select_employee
            :title="dialogTitle"
            v-on:dialog-close="dialogClose"
            v-on:did-selected-employee="didSelectedEmployee"
            v-on:dialog-save="dialogSave">
    </select_employee>
</template>

<style lang="less">

</style>

<script>

    import * as base from '../assets/js/base.js';
    import select_employee from "../components/select_employee.vue";


    export default {
        ready() {

            base.verticalCenter('.layui-modify');

        },
        data: function () {
            return {
                ajaxUrl: base.gAjaxUrl.officialcardrivers,
                ajaxType: 'POST',
                step: 1,
                selectedEmployees: [],
            }
        },
        methods: {
            dialogClose: function () {
                this.$dispatch('dialog-close');
            },
            dialogSave: function () {
                $.showLoading();
                $.ajax({
                    url: this.ajaxUrl + 'bulk_create/',
                    type: this.ajaxType,
                    contentType: "application/json",
                    data: JSON.stringify({
                        staffs: this.selectedEmployees.map(item => item.id)
                    })
                }).always((data) => {
                    $.hideLoading();
                    base.ajaxCallback(data, () => {
                        layer.msg('添加成功', {icon: 1, time: 1000});
                    });
                    this.$dispatch('dialog-save');
                });
            },
            didSelectedEmployee: function (selectedEmployees) {
                this.selectedEmployees = selectedEmployees;
            }
        },
        components: {
            select_employee
        }
    }
</script>
