<template>
    <section class="Hui-article-box">
        <div class="layui-layer-title">公务车配置公告</div>
        <div class="layui-layer-content">
            <div class="layui-layer-title2">是否已发布：{{ modulenotice.has_pub == true ? "是" : "否" }}</div>
            <form id="J-layer-form" class="form form-horizontal layui-layer-wrap">
                <div class="row cl">
                    <label class="form-label f-l col-2"><span class="c-red">*</span>公务车公告内容：</label>
                    <div class="formControls f-l col-7">
                        <textarea v-model="contentInput" id="input-text" class="publish-content-textarea input-text"
                                  placeholder="先在这里输入要发布的内容，然后先保存才能发布，最后点击发布就可以发布内容了，然后内容会推送到手机端，打开E企行app进入公务车栏就可以看到推送了。"
                                  name="content">{{ modulenotice.content }}</textarea>
                    </div>
                </div>
            </form>
        </div>

        <div class="layui-layer-btn">
            <!--<a id="btn-primary" class="layui-layer-btn0 btn-primary" v-on:click="save()">保存</a>-->
            <a v-if="!modulenotice.has_pub"  class="layui-layer-btn0 publish-btn"
               v-on:click="save()">发布</a>
            <a v-if="modulenotice.has_pub"  class="layui-layer-btn0 publish-btn btn btn-warning radius"
               v-on:click="canclepub()">取消发布</a>
        </div>
    </section>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>

<style scoped lang="less" rel="stylesheet/less">
    .layui-layer-title {
        padding-left: 40px;
        font-size: 25px;
    }

    .layui-layer-title2 {
        padding-left: 40px;
        margin-left: 40%;
        font-size: 20px;
    }

    .btn-warning {
        height: 30px;
    }

    .layui-layer-btn {
        .publish-btn {
            background: #3bb4f2;
            border-color: #3bb4f2;
            margin: 0;
            margin-top: 20px;
            margin-right: 23%;
        }
        .btn-primary {
            margin-right: 15px;
            margin-top: 20px;
        }
    }

    div.layui-layer-content {
        // width: 100%;
        // height: 50%;
        margin-top: 100px;
        overflow: hidden;
        .form-label {
            font-size: 20px;
            line-height: 20px;
            margin-left: 40px;
        }
    }

    .publish-content-textarea {
        height: 250px;
        resize: none;
        font-size: 18px;
    }
</style>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    export default{

        ready () {

            let that = this;

            this.getOfficialcarNotice();

            base.verticalCenter('.layui-modify');

            //验证
            $('#J-layer-form').validate({
                rules: {
                    content: {
                        required: true,
                        maxlength: 256
                    },
                },
                submitHandler: function () {
                    that.setNotice();
                }
            });
        },
        props: ['title', 'type', 'data'],
        data: function () {
            return {
                titleInput: '',
                authorInput: '',
                targetSelected: '',
                contentInput: '',
                before_apply_time: '00:00',
                end_apply_time: '00:00',
                modulenotice: {},
                itemsLoading:false,
            }
        },
        methods: {
            getOfficialcarNotice: function () {
                $.ajax({
                    url: base.gAjaxUrl.vehicleConfiguration + 'officialcar/',
                    type: 'GET',
                }).always((data) => {
                    base.ajaxCallback(data, (data)=> {
                        console.log(data)
                        this.modulenotice = data;
                    });
                })
            },
            setNotice: function () {
                this.itemsLoading = true;
                var ajaxUrl = base.gAjaxUrl.vehicleConfiguration;
                var type = 'POST';
                var ajaxData = {
                    module: 2,
                    content: this.contentInput,
                    has_pub: false,
                };
                if (this.modulenotice.id) {
                    ajaxUrl = ajaxUrl + this.modulenotice.id + '/';
                    type = 'PUT';
                    ajaxData.has_pub = true;
                }
                $.ajax({
                    url: ajaxUrl,
                    type: type,
                    data: ajaxData,
                }).always((data) => {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, (data) => {
                        this.modulenotice = data || {};
                        this.pub()
                    });
                });
            },
            save: function () {
                layer.confirm('确认发布?',()=>{
                    $('#J-layer-form').submit();
                    layer.closeAll();
                })

            },
            pub: function () {

                if (!this.modulenotice.id) {
                    layer.msg("未查询到已经保存的公告", {icon: 2, time: 1500});
                    return;
                }
                this.itemsLoading = true;
                $.ajax({
                    url: base.gAjaxUrl.vehicleConfiguration + this.modulenotice.id + '/pub/',
                    type: 'GET',
                }).always((data) => {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=> {
                        this.modulenotice = data;
                    });
                });
            },
            canclepub: function () {
                let that = this;
                layer.confirm('确定取消发布?',()=>{
                    this.itemsLoading = true;
                    $.ajax({
                        url: base.gAjaxUrl.vehicleConfiguration + this.modulenotice.id + '/un_pub/',
                        type: 'GET',
                    }).always((data) => {
                        this.itemsLoading = false;
                        base.ajaxCallback(data, ()=> {
                            this.modulenotice = data;
                        });
                    });
                    layer.closeAll();
                })

            }
        }
    }
</script>
