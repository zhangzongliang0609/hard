<template>
    <div class="preview_win" @click="close">
        <div class="mobile" @click.prev.stop="mobileClick">
            <div class="mobile_win">
                <iframe src="../../static/notice/notice.html" frameborder="0" class="iframe" id="ifr"></iframe>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base';

    export default {
        data() {
            return {}
        },
        ready () {
            if (!this.data) {
                console.log(' data error ');
                layer.msg("数据异常", {icon: 2, time: 1500});
                setTimeout(() => {
                    this.$dispatch("dialog-close");
                }, 1500);
                return;
            }
            var win = document.querySelector("#ifr").contentWindow;
            win.onload = () => {
//                win.notcie_data = this.data;
                win.page.showPage(this.data);
            }
        },
        props: ['data'],
        methods: {
            close () {
                this.$dispatch("dialog-close");
            },
            mobileClick () {
            },
        },
        destoryed() {
        }
    }
</script>
<style scoped rel="stylesheet/less" lang="less">
    .preview_win {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        overflow: auto;
        background-color: rgba(0, 0, 0, .3);
        min-height: 700px;
        user-select: none;
        z-index: 19848899;
        .mobile {
            width: 375px;
            height: 680px;
            position: absolute;
            top: 50%;
            right: 50%;
            margin-top: -340px;
            margin-right: -188px;
            background: url("/static/notice/phoneBg.png") no-repeat left top /100% 100%;
            animation: s-in 0.22s linear;
            .mobile_win {
                position: absolute;
                left: 15px;
                top: 77px;
                width: 345px;
                height: 527px;
                /*background-color: rgba(0, 228, 47, 0.3);*/
                background-color: #fff;
                overflow: hidden;
                cursor: pointer;
                .iframe {
                    width: 100%;
                    height: 100%;
                    overflow: auto;
                }
            }
        }
    }

    @keyframes s-in {
        /*0% {right: -50%}*/
        /*100% {right: 50%}*/
        0% {
            transform: scale(0.3)
        }
        100% {
            transform: scale(1)
        }
    }
</style>