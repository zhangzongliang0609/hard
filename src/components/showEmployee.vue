<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">查看申请人信息</div>
        <div class="layui-layer-content">
            <form id="J-layer-form" class="form form-horizontal layui-layer-wrap">
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>姓名：</label>
                    <div class="formControls f-l col-4">
                        <input :value="data.real_name" type="text" class="input-text" value="" placeholder="" disabled="disabled">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>性别：</label>
                    <div class="formControls f-l col-4">
                        <input :value="data.sex==1?'男':'女'" type="text" class="input-text" value="" placeholder="" disabled="disabled">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>部门：</label>
                    <div class="formControls f-l col-4">
                        <input type="text" class="input-text" :value="data.department_vo.department_name" disabled="disabled" >
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>职位：</label>
                    <div class="formControls f-l col-4">
                        <input :value="data.position?data.position:'--'" type="text" class="input-text" value="" placeholder="" disabled="disabled">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>电话：</label>
                    <div class="formControls f-l col-4">
                        <input :value="data.phone" type="text" class="input-text" value="" placeholder="" disabled="disabled">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>工号：</label>
                    <div class="formControls f-l col-4">
                        <input :value="data.job_number" type="text" class="input-text" value="" placeholder="" disabled="disabled">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">员工卡号：</label>
                    <div class="formControls f-l col-4">
                        <input :value="data.card_number?data.card_number:'--'" type="text" class="input-text" value="" placeholder="" disabled="disabled">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">身份证号：</label>
                    <div class="formControls f-l col-4">
                        <input :value="data.id_card?data.id_card:'--'" type="text" class="input-text" value="" placeholder="" disabled="disabled">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">等级：</label>
                    <div class="formControls f-l col-4">
                        <input :value="data.level?data.level:'--'" type="text" class="input-text" value="" placeholder="" disabled="disabled">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">学历：</label>
                    <div class="formControls f-l col-4">
                        <input :value="data.education?data.education:'--'" type="text" class="input-text" value="" placeholder="" disabled="disabled">
                    </div>
                </div>
                <!--<div class="row cl">-->
                    <!--<label class="form-label f-l col-4 ">标签：</label>-->
                    <!--<div class="formControls f-l col-4">-->
                        <!--&lt;!&ndash;<input v-model="employee_tag" type="text" class="input-text" value="" placeholder="" name="employee_tag">&ndash;&gt;-->
                        <!--<div class="tag_container relative">-->
                            <!--<div class="tag_item_list clearfix">-->
                                <!--<div v-for="item in tagsArr" class="f-l tag_item relative">-->
                                    <!--<div class="tag_item text-ellipsis"  title="{{item.name}}">-->
                                        <!--<div>{{item.name}}</div>-->
                                    <!--</div>-->
                                    <!--<span class="tag_delete" @click="deleteTag(item)">x</span>-->
                                <!--</div>-->
                            <!--</div>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</div>-->
                <!--<div class="row cl">-->
                    <!--<div class="formControls f-l col-4 col-offset-4">-->
                        <!--<div class="whole_tag_container">-->
                            <!--<div class="tag_item_list clearfix">-->
                                <!--<div @click="addTag(item)" v-for="item in wTagsArr" class="tag_item text-ellipsis f-l" title="{{item.name}}">{{item.name}}</div>-->
                            <!--</div>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</div>-->
            </form>
        </div>
        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
    </div>
    <div class="layui-layer-shade"></div>
</template>

<style lang="less" scoped rel="stylesheet/less">
    .tag_item_list {
        /*width: 270px;*/
        width: 100%;
        box-sizing: border-box;
        z-index: 2;
        min-height: 40px;
        padding: 3% 3% 6%;
        border-radius: 5px;
        border: 1px solid #ccc;
        background-color: #fff;
        .tag_item {
            /*width: 80px;*/
            width: 28%;
            color: #eee;
            font-size: 14px;
            line-height: 25px;
            margin-left: 3%;
            margin-top: 3%;
            border-radius: 5px;
            background-color: #ff9542;
            text-align: center;
            position: relative;
            cursor: pointer;
            box-sizing: border-box;
            padding: 0 5px;
            div {
                width: 100%;
                height: 100%;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
        .tag_delete {
            position: absolute;
            width: 16px;
            height: 16px;
            text-align: center;
            line-height: 12px;
            font-size: 12px;
            border-radius: 50%;
            background-color: #000;
            color: #fff;
            top: -5px;
            right: -5px;
            cursor: pointer;
        }
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    let departmentOps = null;

    export default{
        ready () {
            base.verticalCenter('.layui-modify');
        },
        props: ['data', 'title', 'type'],
        data:function(){
            return {

            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },

        },
        filters: {
        }
    }
</script>
