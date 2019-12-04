<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify layui-modifyHeight">
        <div class="layui-layer-title">{{title}}</div>
        <div class="layui-layer-content">
            <form id="J-layer-form" class="form form-horizontal layui-layer-wrap ">
                <div class="row cl">
                    <label class="form-label f-l col-2"><span class="c-red">*</span>标题：</label>
                    <div class="formControls f-l col-3">
                        <input v-model="titleInput" type="text" class="input-text" value="" placeholder=""  name="title" v-on:focus="toggleShow()" v-on:blur="toggleHidden()">
                    </div>
                    <div v-if="is_show" class="ml-5 f-l col-4 btn-secondary-outline pl-5 tips-border"><i class="f-18 c-primary Hui-iconfont">&#xe6cd;</i>
                     <i class="pt-5 lh-28">标题最大长度为20个字符。</i>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-2"><span class="c-red">*</span>作者：</label>
                    <div class="formControls f-l col-4">
                        <input v-model="authorInput" type="text" class="input-text" value="" placeholder="" name="author">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-2"><span class="c-red">*</span>接收类型：</label>
                    <div class="formControls f-l col-4">
                        <span class="select-box">
                            <select v-model="targetSelected" name="target_type" class="select">
                                <option value="ALL" selected="">全部</option>
                                <option value="DEPARTMENT">部门</option>
                            </select>
                        </span>
                    </div>
                </div>
                <div class="row cl" v-if="targetSelected == 'DEPARTMENT'">
                    <label class="form-label f-l col-2"></label>
                    <div class="formControls f-l col-7">
                        <div class="m-multiple-select clearfix">
                            <div class="area-l">
                                <div class="bd">
                                    <a v-if="selectedItems.indexOf(item.id)<0" v-bind:class="[addItemTemp.indexOf(item.id)>-1 ? 'active' : '']" v-bind:data-id="item.id" v-for="item in departmentItems" href="javascript:;" v-on:click="clickAddItemTemp(item.id)">{{item.department_tree}}</a>
                                </div>
                            </div>
                            <div class="s-btn">
                                <a class="btn btn-primary size-MINI radius" href="javascript:;" v-on:click="clickBtnAdd">添加</a>
                                <a class="btn btn-primary size-MINI radius" href="javascript:;" v-on:click="clickBtnDelete">删除</a>
                            </div>
                            <div class="area-r">
                                <div class="bd">
                                    <a v-if="selectedItems.indexOf(item.id)>=0" v-bind:class="[deleteItemTemp.indexOf(item.id)>-1 ? 'active' : '']" v-bind:data-id="item.id" v-for="item in departmentItems" href="javascript:;" v-on:click="clickDeleteItemTemp(item.id)">{{item.department_tree}}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row cl">
                    <label class="form-label f-l col-2"><span class="c-red">*</span>内容：</label>
                    <div class="formControls f-l col-7">
                        <textarea v-model="contentInput" v-on:focus="toggleContentShow()" v-on:blur="toggleContentHidden()" class="publish-content-textarea input-text" value="" placeholder="这里写的内容，经保存和发布后，在手机端App可以收到公告的内容。" name="content"></textarea>
                    </div>
                   <!--  <div v-if="is_show_content" class="ml-5 f-l col-3 btn-secondary-outline pl-5 tips-content tips-border"><i class="f-18 c-primary Hui-iconfont">&#xe6cd;</i>
                     <i class="pt-5 lh-28" >内容最大长度为200个字符。</i>
                    </div> -->

                </div>
                <!--<div class="row cl" v-if="is_show_content">-->
                    <!--<label class="form-label f-l col-2"><span class="c-red"></span></label>-->
                    <!--<div  class="f-l col-4-width btn-secondary-outline pl-5 tips-border"><i class="f-18 c-primary Hui-iconfont">&#xe6cd;</i>-->
                     <!--<i class="pt-5 lh-28" >内容最大长度为200个字符。</i>   -->
                    <!--</div>-->
                <!--</div> -->
            </form>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
        </span>
        <div class="layui-layer-btn">
            <a class="layui-layer-btn0 btn-primary" v-on:click="save(10)">保存</a>
            <a class="layui-layer-btn0 publish-btn" v-on:click="save(20)">发布</a>
        </div>

    </div>
    <div class="layui-layer-shade"></div>
</template>
<style scoped lang="less">
   /*.layui-modifyHeight {*/
        /*height: 350px;*/
   /*}*/

    .layui-layer-btn{
        .publish-btn{
            background: #3bb4f2;
            border-color: #3bb4f2;
            margin:0;
        }
    }
    .publish-content-textarea{
        height:100px;
        resize:none;
    }
    .tips-border {
        height: 30px;
        line-height: 22px;
        border: 1px solid #3bb4f2;
    }
    .tips-content{
       height: 60px;
    }
    .col-8-width{
        width: 480px;
    }
</style>
<script>
    import * as base from '../assets/js/base.js';
    export default{
        ready () {
            let that = this;
            let ajaxUrl = '';
            let ajaxType = '';
            let getData = this.data;

            base.verticalCenter('.layui-modify')

            //获取部门列表
            $.ajax({
                url: base.gAjaxUrl.departments,
                type: 'GET',
            })
            .always((data)=>{
                this.departmentItems = data || [];
            })


            //类型判断
            if(this.type == 'add'){
                ajaxUrl = base.gAjaxUrl.notices;
                ajaxType = 'POST';
                this.titleInput = '';
                this.authorInput = '';
                this.targetSelected = 'ALL';
                this.contentInput = '';
                this.target_ids = '';

            }else if(this.type == 'modify'){
                ajaxUrl = `${base.gAjaxUrl.notices}${getData.id}/`;
                ajaxType = 'PUT';
                this.departmentNameInput = getData.department_name;
                this.titleInput = getData.title;
                this.authorInput = getData.author;
                this.targetSelected = getData.target_type;
                this.contentInput = getData.content;
                this.selectedItems = (getData.target_ids).split(',');

            }

            //验证
            $('#J-layer-form').validate({
                rules: {
                    title: {
                        required: true,
                        // maxlength:20
                    },
                    author: {
                        required: true,
                    },
                    target_type: {
                        required: true,
                    },
                    content: {
                        required: true,
                        // maxlength: 1000
                    },
                },
                submitHandler:function() {
                    let departmentIds = (that.selectedItems).join(','),
                        allIds = 0,
                        targetIds = 'ALL';

                    if(that.targetSelected == 'ALL'){
                        targetIds = allIds;
                    }else if(that.targetSelected == 'DEPARTMENT'){
                        targetIds = departmentIds;
                    }

                    $.ajax({
                        url: ajaxUrl,
                        type:ajaxType,
                        data: {
                            title: that.titleInput,
                            author: that.authorInput,
                            target_type: that.targetSelected,
                            content: that.contentInput,
                            target_ids:targetIds,
                            status:that.btnStatus
                        },
                    })
                    .always(function(data) {
                        base.ajaxCallback(data,function(){
                            layer.msg('提交成功',{icon:1,time:1000});
                            that.$dispatch('dialog-save');
                        });
                    });



                }
            });
        },
        props: ['title','type','data'],
        data:function(){
            return {
                titleInput:'',
                authorInput:'',
                targetSelected:'',
                contentInput:'',
                departmentItems:[],      //部门列表
                addItemTemp:[],     //添加数据到缓存区
                deleteItemTemp:[],  //删除数据到缓存区
                selectedItems:[],  //选中的部门
                btnStatus:'',
                is_show: false,
                is_show_content: false,
            }
        },
        methods: {
            toggleShow: function(obj,flag){
                this.is_show = true;
            },
            toggleHidden: function(obj,flag){
                this.is_show = false;
            },
            toggleContentShow: function(obj,flag){
                this.is_show_content = true;
            },
            toggleContentHidden: function(obj,flag){
                this.is_show_content = false;
            },
            close:function(){
                this.$dispatch('dialog-close');
            },
            save:function(status){
                this.btnStatus = status;
                $('#J-layer-form').submit();
            },
            clickAddItemTemp:function(id){
                let idIdexOf = (this.addItemTemp).indexOf(id);
                if(idIdexOf<0){
                    this.addItemTemp.push(id)
                }else{
                    this.addItemTemp.splice(idIdexOf,1)
                }
            },
            clickBtnAdd:function(){
                $(this.addItemTemp).each((i,e)=>{
                    this.selectedItems.push(e)
                })
                this.addItemTemp = [];
            },
            clickDeleteItemTemp:function(id){
                let idIdexOf = (this.deleteItemTemp).indexOf(id);
                if(idIdexOf<0){
                    this.deleteItemTemp.push(id)
                }else{
                    this.deleteItemTemp.splice(idIdexOf,1)
                }
            },
            clickBtnDelete:function(){
                $(this.deleteItemTemp).each((i,e)=>{

                    let idIdexOf = (this.selectedItems).indexOf(this.deleteItemTemp[i]);

                    if(idIdexOf>-1){
                        this.selectedItems.splice(idIdexOf,1)
                    }
                })
                this.deleteItemTemp = [];
            },

        }
    }
</script>
