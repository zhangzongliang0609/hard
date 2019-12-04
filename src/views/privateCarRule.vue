<template>

    <section class="Hui-article-box">
        <div class="page-container">
            <div class="panel panel-default radius">
                <div class="panel-body">
                    <span class="f-20 fw-b">申请规则</span>
                </div>
            </div>


            <div class="rule_item mt-20 pd-20 clearfix radius">
                <div class="f-l lh-24">
                    是否开启加急：
                </div>
                <div class="f-l ml-15">
                        <span class="switch-outer" :class="{'selected': config.urgent}" @click="setConfig('urgent')">
                                <span class="switch-inner">
                                    <span class="switch-center"></span>
                                </span>
                        </span>
                </div>
                <div class="f-l ml-15 lh-24">
                    开启加急后可在审批中开始行程
                </div>
            </div>
            <div class="rule_item mt-15 pd-20 clearfix">
                <div class="f-l lh-24">
                    是否开启流程审批：
                </div>
                <div class="f-l ml-15">
                        <span class="switch-outer"
                              :class="{'selected': config.approval}"
                              @click="setConfig('approval')">
                                <span class="switch-inner">
                                    <span class="switch-center"></span>
                                </span>
                        </span>
                </div>
                <div class="f-l ml-15 lh-24">

                </div>
            </div>

        </div>
    </section>
</template>

<style lang="less" rel="stylesheet" scoped>

    .rule_item {
        border: 1px solid #d7d8da;
        border-radius: 5px;
    }
    .lh-24 {
        line-height: 24px;
    }

</style>

<script type="text/ecmascript-6">

    import * as base from '../assets/js/base';

    export default {
        ready() {
            this.getRule();
        },
        data: function () {
            return {
                config: {
                    approval: false, // 是否开启流程审批，默认false
                    urgent: false, // 是否加急，默认false
                }
            }
        },
        methods: {
            setConfig(key) {
                let config = Object.assign({}, this.config);
                config[key] = !config[key];
                $.showLoading();
                $.ajax({
                    url: base.gAjaxUrl.privateCarRule,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(config)
                }).always((data) => {
                    $.hideLoading();
                    base.ajaxCallback(data, () => {
                        this.config = data;
                    })
                })
            },
            getRule() {
                $.showLoading();
                $.ajax({
                    url: base.gAjaxUrl.privateCarRule,
                    type: 'GET'
                }).always((data) => {
                    $.hideLoading();
                    base.ajaxCallback(data, () => {
                        this.config = data;
                    })
                })
            }
        },
        components: {}
    }
</script>
