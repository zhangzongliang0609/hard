<template>
    <procedure :type="dialogType"></procedure>
</template>
<script type="text/ecmascript-6">

    import procedure from '../components/procedureApprove.vue';

    export default{
        ready(){
        },
        data: function () {
            return {
                dialogType: 20, // 公共区域报修流程审批
            }
        },
        methods: {
        },
        components: {
            procedure
        }
    }
</script>