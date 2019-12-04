<template>
    <div class="viewer_container">
        <div id="pageContent">
            <a href="javascript:;" class="btn btn-default closeBtn radius" @click="close" @dblclick="close">关闭</a>
            <div id="imgContainer">
                <img id="_imageFullScreen" :src="currentSrc"/>
            </div>
            <div id="positionButtonDiv">
                <p>
                    <span>
                        <img id="zoomInButton" @click="zoomIn" class="zoomButton"
                             src="../../static/zoom/icons/zoomIn.png"
                             title="zoom in" alt="zoom in"/>
                        <img id="zoomOutButton" @click="zoomOut" class="zoomButton"
                             src="../../static/zoom/icons/zoomOut.png"
                             title="zoom out" alt="zoom out"/>
                    </span>
                </p>
            </div>
        </div>
        <div class="layui-layer-shade"></div>
    </div>

</template>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base';
    import '../../static/zoom/zoom.js';
    export default {
        ready: function () {
            this.currentSrc = this.src || '../../static/images/notice-no-img.png';
            console.log("preview image");

            $('#_imageFullScreen').load(function () {
                $(this).smartZoom({
                    'top': '0',
                    'left': '0',
                    'width': '100%',
                    'height': '100%',
                    'containerClass': 'pageContent'
                })
            });
        },
        props: ['src'],
        data: function () {
            return {
                currentSrc: ''
            }
        },
        methods: {
            zoomIn () {
                $('#_imageFullScreen').smartZoom('zoom', 0.8);
            },
            zoomOut () {
                $('#_imageFullScreen').smartZoom('zoom', -0.8);
            },
            close () {
                arguments[0].stopPropagation();
                this.$emit("close-view");
            }
        },
        destroyed () {
            $('#_imageFullScreen').smartZoom("destroy");
        },
        components: {},
        filters: {},
    }
    //  var opts = {'top' : '0', // zoom target container top position in pixel
    //    'left' : '0', // zoom target container left position in pixel
    //    'width' : '100%', // zoom target container width in pixel or in percent
    //    'height' : '100%', // zoom target container height in pixel or in percent
    //    'easing' : 'smartZoomEasing', // jquery easing function used when the browser doesn't support css transitions
    //    'maxScale' : 3, // the max scale that will be applied on the zoom target
    //    'dblClickMaxScale' : 1.8, // the max scale that will be applied on the zoom target on double click
    //    'mouseEnabled' : true, // enable plugin mouse interaction
    //    'scrollEnabled' : true, // enable plugin mouse wheel behviour
    //    'dblClickEnabled' : true, // enable plugin mouse doubleClick behviour
    //    'mouseMoveEnabled' : true, // enable plugin target drag behviour
    //    'moveCursorEnabled' : true, // show moveCursor for drag
    //    'touchEnabled' : true, // enable plugin touch interaction
    //    'dblTapEnabled' : true, // enable plugin double tap behaviour
    //    'pinchEnabled' : true, // enable zoom when user pinch on target
    //    'touchMoveEnabled' : true, // enable target move via touch
    //    'containerBackground' : '#FFFFFF', // zoom target container background color (if containerClass is not set)
    //    'containerClass' : ''// class to apply to zoom target container if you whant to change background or borders (don't change size or position via css)
    //  };
</script>

<style scoped lang="less" rel="stylesheet/less">
    @import "../../static/zoom/zoom.css";
</style>
<style scoped lang="less" rel="stylesheet/less">
    .viewer_container {
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        top: 0;
        z-index: 110;
        #pageContent {
            padding: 0;
            box-sizing: border-box;
            z-index: 110;
            box-shadow: 0 0 0 5px #eaeaea;
            border-radius: 10px;
            position: absolute;
            width: 80%;
            height: 80%;
            left: 10%;
            top: 10%;
            overflow: hidden;
            background-color: #f7f7f7;
            /* 不能加动画, 不然会导致内部图片缩放出问题 */
            /*animation: show .3s ease;*/
        }
        #positionButtonDiv {
            position: absolute;
            right: 15px;
            bottom: 20px;
            background-color: rgba(160, 160, 160, 0.2);
            padding: 8px 10px;
            border-radius: 4px;
            p {
                margin: 0;
            }
            span:after, span:before {
                clear: both;
                content: "";
                height: 0;
                line-height: 0;
                visibility: hidden;
                display: block;
            }
            .zoomButton {
                width: 36px;
                height: 32px;
                float: left;
            }
            #zoomInButton {
                margin-right: 8px;
            }
        }
        .closeBtn {
            position: absolute;
            right: 15px;
            top: 10px;
            color: #fff;
            background-color: #ccc;
            cursor: pointer;
            z-index: 200;
        }
    }

    @keyframes show {
        from {
            width: 0;
            height: 0
        }
        to {
            width: 80%;
            height: 80%
        }
    }

    #_imageFullScreen {
        /*visibility: hidden;*/
    }

</style>
