<template>
    <div class="editorContainer">
        <script id="u_editor" type="text/plain" style="width:100%;height:100%"></script>
    </div>
</template>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base';
    import '../../static/ueditor/ueditor.config.js'
    import '../../static/ueditor/ueditor.all.js'
    import '../../static/ueditor/lang/zh-cn/zh-cn.js'

    export default {
        props: ['notice'],
        data() {
            return {
                config: {
                    autoHeightEnabled: false,
                    autoFloatEnabled: true,
                    initialContent: '请输入内容',   //初始化编辑器的内容,也可以通过textarea/script给值，看官网例子
                    autoClearinitialContent: true, //是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了
                    initialFrameWidth: null, // 初始化编辑器宽度
                    initialFrameHeight: null, // 初始化编辑器高度
                    BaseUrl: '',
                    toolbars:[[
//                        'fullscreen', //全屏编辑功能显示html按钮
//                        'source', //显示html按钮
//                        '|',
                        'undo',
                        'redo',
                        '|',
                        'bold',
                        'italic',
                        'underline',
                        'fontborder',
                        'strikethrough',
                        'superscript',
                        'subscript',
                        'removeformat',
                        'formatmatch',
//                        'autotypeset',
//                        'blockquote',
                        'pasteplain',
                        '|',
                        'forecolor',
                        'backcolor',
//                        'insertorderedlist',
//                        'insertunorderedlist',
                        'selectall',
                        'cleardoc',
                        '|',
                        'rowspacingtop',
                        'rowspacingbottom',
                        'lineheight',
                        '|',
//                        'customstyle',
//                        'paragraph',
                        'fontfamily',
                        'fontsize',
                        '|',
//                        'directionalityltr',
//                        'directionalityrtl',
                        'indent',
//                        '|',
                        'justifyleft',
                        'justifycenter',
                        'justifyright',
                        'justifyjustify',
                        '|',
//                        'touppercase',
//                        'tolowercase',
//                        '|',
                        'link',
                        'unlink',
//                        'anchor',
                        '|',
//                        'imagenone',
//                        'imageleft',
//                        'imageright',
//                        'imagecenter',
//                        '|',
                        'simpleupload',
//                        'insertimage',
                        'emotion',
//                        'scrawl',
//                        'insertvideo',
//                        'music',
//                        'attachment',
//                        'map',
//                        'gmap',
//                        'insertframe',
//                        'insertcode',
//                        'webapp',
//                        'pagebreak',
//                        'template',
//                        'background',
                        '|',
                        'horizontal',
//                        'date',
//                        'time',
                        'spechars',
//                        'snapscreen',
//                        'wordimage',
//                        '|',
//                        'inserttable',
//                        'deletetable',
//                        'insertparagraphbeforetable',
//                        'insertrow',
//                        'deleterow',
//                        'insertcol',
//                        'deletecol',
//                        'mergecells',
//                        'mergeright',
//                        'mergedown',
//                        'splittocells',
//                        'splittorows',
//                        'splittocols',
//                        'charts',
//                        '|',
//                        'print',
//                        'preview',
                        'searchreplace',
//                        'drafts',
//                        'help'
                    ]],
                    serverUrl: base.gAjaxUrl.UEUpFile + "?pk=" + localStorage.token,
                    UEDITOR_HOME_URL: 'static/ueditor/'
                },
                editor: null
            }
        },
        ready () {

            //初始化UE
            this.editor = UE.delEditor("u_editor");
            this.editor = UE.getEditor('u_editor', this.config);
            this.editor.ready(() => {
                this.$dispatch("ue-ready", this.editor);
            });
        },
        destoryed() {
            this.editor.destory();
            this.editor = null;
            this.$dispatch("ue-destroy");
        },
        methods: {
            getUEContent: function () {
                return this.editor.getContent();
            },
            getContentTxt: function () {
                return this.editor.getContentTxt();
            }
        }
    }
</script>
<style scoped rel="stylesheet/less" lang="less">
    .editorContainer {
        width: 100%;
        height: 100%;
    }
</style>
<style rel="stylesheet/less" lang="less">
    /* UEditor 编辑器，全屏样式展示 */
    #u_editor {
        width: 100%;
        height: 100%;
        & > .edui-editor {
            height: 100%;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            /*overflow-x: hidden;*/
            /*overflow-y: auto;*/
            overflow: hidden;
            & > .edui-editor-toolbarbox,
            & > .edui-editor-bottomContainer {
                flex-shrink: 0;
                flex-grow: 0;
            }
            & > .edui-editor-iframeholder {
                flex: 1;
                min-height: 450px;
            }
        }
    }
</style>
