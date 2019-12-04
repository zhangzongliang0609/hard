
<template>
    <div class="__app_container" @click="bodyClick">
        <top v-on:refresh="refreshMessage"></top>
        <aside></aside>

        <router-view v-on:global="global"></router-view>
    </div>

</template>

<script>

    import top from "./components/top.vue";
    import aside from "./components/aside.vue";

    export default {
        created () {

            // $globalApp 暴露全局变量，方便其他组件广播全局事件 - $broadcast
            window.$globalApp = this;

        },
        ready() {

            this.$route.router.go({path: '/welcome', replace: true});

            window.onresize = function () {
                // 屏幕尺寸变化  对面界面进行调整
                this.$broadcast('screenSizeChange');
            }.bind(this);

            // 键盘事件 -- 全局广播
            window.onkeydown = function (e) {
                // enter 键盘
                // 部分页面需要做刷新处理
                if(e.keyCode === 13 || e.code === 'Enter') {
                    this.$broadcast('enterEvent');
                }
                this.$broadcast('keydown', e);
            }.bind(this);

        },
        replace: false,
        methods: {
            // 全局的 body 点击事件
            bodyClick() {
                this.$broadcast('bodyClick');
            },
            global: function () {
                switch (arguments[0]) {
                    case 'PB_MSG_REFRESH' :
                        this.$broadcast('refreshTop');
                        break;
                    case 'PB_LOGIN_IN' :
                        this.$broadcast('loginIn');
                        break;
                    default:
                        break;
                }
            },
            refreshMessage: function () {
                this.$broadcast('refreshMessage');
            }
        },
        components: {
            top,
            aside
        },
        beforeDestroy() {
            window.onresize = null;
        }
    }
</script>

<style lang="less">
    @import './assets/less/style';
    @import './assets/js/icheck/icheck';

    .__app_container{
        height: 100%;
    }
</style>


