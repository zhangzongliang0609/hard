<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">{{title}}</div>
        <div class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;"
               @click="close()"></a>
        </div>
        <div v-if="type ==='reply'">
            <div class="layui-layer-content">
                <!--   <form id="J-layer-form" class="form form-horizontal layui-layer-wrap">
                       <div class="row cl">
                           <label class="form-label f-l col-3 ">留言者：</label>
                           <div class="formControls f-l col-4">
                               {{data.staff_name}}
                           </div>
                       </div>
                       <div class="row cl">
                           <label class="form-label f-l col-3 ">留言内容：</label>
                           <div class="formControls f-l col-4">
                               {{data.backmessage}}
                           </div>
                       </div>
                       <div class="row cl">
                           <label class="form-label f-l col-3 ">回复内容：</label>
                           <div class="formControls f-l col-4">
                           <textarea class="remark" name="remark" placeholder="请输入..." maxlength="300"
                                     cols="60" rows="6" v-model="replyContent"></textarea>
                           </div>
                       </div>
                   </form>-->
                <div>
                    <div class="row cl">
                        <label class="text-r f-l col-3 ">留言者：</label>
                        <div class="formControls f-l col-4">
                            {{data.staff_name}}
                        </div>
                    </div>
                    <div class="row cl">
                        <label class="text-r form-label f-l col-3 ">留言内容：</label>
                        <div class="formControls f-l col-4">
                            {{data.backmessage}}
                        </div>
                    </div>
                    <div class="row cl">
                        <label class="text-r form-label f-l col-3 ">回复内容：</label>
                        <div class="formControls f-l col-4">
                        <textarea class="remark" name="remark" placeholder="请输入..." maxlength="300"
                                  cols="60" rows="6" v-model="replyContent"></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-layer-btn" @click="save"><a class="layui-layer-btn0">确定</a></div>
        </div>
        <div v-else>
            <div class="layui-layer-content pl-20 pr-20 details-box">
                <div class="head">
                    <div class="mb-10">留言回复</div>
                    <div class="head_content mb-10">
                        <input type="text" placeholder="" v-model="replyContent" class="input-text radius-l"/>
                        <button @click="save" class="btn btn-success search-btn radius-r" type="button">
                            发送
                        </button>
                    </div>
                </div>
                <ul>
                    <li v-for="i in LWData">
                        <div v-if="i.reply ==='admin'">
                            <div>
                                <span>管理员</span>
                                <span class="ml-20 fs-12 fc-aaa">{{i.ctime}}</span>
                            </div>
                            <div>{{i.message}}</div>
                        </div>
                        <div v-else>
                            <div>
                                <span>{{i.staff_vo.real_name}}</span>
                                <span class="ml-20 fs-12 fc-aaa">{{i.ctime}}</span>
                            </div>
                            <div>{{i.backmessage}}</div>
                        </div>
                    </li>

                </ul>
            </div>
        </div>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<script type="text/ecmascript-6">
    import * as base from '../../assets/js/base.js';

    let ajaxUrl = '';
    let ajaxType = '';

    export default {
        ready() {
            base.verticalCenter('.layui-modify');
            if (this.type === 'details') {
                this.getLWList();
            }
        },
        props: ['title', 'type', 'data'],
        data: function () {
            return {
                replyContent: '',
                LWData: [],
            }
        },
        methods: {
            close: function () {
                this.$dispatch('dialog-close');
            },
            save: function () {
                if (this.replyContent === '') {
                    layer.msg('请输入回复内容', {icon: 2, time: 1000});
                    return
                } else {
                    layer.confirm('确定回复留言信息吗？', {title: "提示"}, (index) => {
                        $.showLoading();
                        $.ajax({
                            // url: `${base.gAjaxUrl.adminfeedback}${data.id}/`,
                            url: base.gAjaxUrl.adminfeedback,
                            type: 'POST',
                            contentType: "application/json",
                            data: JSON.stringify({
                                staff: this.data.staff_id,
                                message: this.replyContent,
                                terrace: this.data.terrace
                            })
                        }).always((data) => {
                            // layer.closeAll();
                            // this.$dispatch('dialog-save', this.type);
                            $.hideLoading();
                            base.ajaxCallback(data, () => {
                                layer.msg("回复成功", {icon: 1, time: 1500});
                                this.$dispatch('dialog-save', this.type);
                            })
                        });

                    });
                }
            },
            getLWList: function () {
                $.showLoading();
                console.log(this.data.id);
                $.ajax({
                    url: `${base.gAjaxUrl.adminfeedback}${this.data.staff_id}/`,
                    type: 'GET',
                    data:{
                        terrace:this.data.terrace,
                        page_size:9999,
                    }
                }).always((data) => {
                    $.hideLoading();
                    base.ajaxCallback(data, () => {
                        this.LWData = data.results || [];
                    })
                });
            }
        },
        filters: {},
        components: {}
    }
</script>
<style lang="less" scoped type="text/less">
    .remark {
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 4px;
        box-sizing: border-box;
    }

    .details-box {
        .head_content {
            position: relative;
            padding-left: 20px;

            input {
                padding-right: 60px;
            }

            button {
                position: absolute;
                right: 0;
                top: 0;
            }
        }

        ul {
            li:before {
                display: inline-block;
                content: "";
                height: 1px;
                width: 100%;
                background-color: #ddd;
                position: absolute;
                left: 0;
                top: 10px;
            }

            li {
                position: relative;
                padding: 20px 20px 0;
            }
        }
    }
</style>
