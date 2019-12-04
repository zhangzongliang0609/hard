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
                dialogType: 10, // 公务车审批流程
            }
        },
        methods: {
        },
        components: {
            procedure
        }
    }
</script>