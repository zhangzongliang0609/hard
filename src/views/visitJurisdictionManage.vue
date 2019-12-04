<template>
    <section class="Hui-article-box">
        <div class="page-container">
            <div class="panel panel-default radius">
                <div class="panel-body">
                    <span class="f-20 fw-b">访客权限管理</span>
                </div>
            </div>

            <div class="auths_container">
                <div class="top clearfix">
                    <div class="f-l mt-20">app访问／使用权限配置</div>
                    <div class="right f-r mt-15 mr-30" @click="setSelected">
                        <a href="javascript:;" class="btn btn-primary radius">{{isSelected ? '取消修改权限' : '修改权限'}}</a>
                    </div>
                </div>
                <div class="list">
                    <div v-for="item in currentDepartmentDetail" class="item">
                        <div class="icon"><img :src="item.ico" :alt="item.name"></div>
                        <div class="title fs-12" :title="item.name">{{ item.name }}</div>
                        <div @click="changeSelected(item)" class="selected"
                             :class="{sel: isSelected, can: item.is_allow}">
                            <i class="Hui-iconfont" v-if="item.is_allow">&#xe6a7;</i>
                        </div>
                    </div>
                </div>
            </div>
            <div v-show="isSelected" class="mt-20" @click="save">
                <a href="javascript:;" class="btn btn-primary radius f-r mr-30">保存</a>
            </div>
        </div>
    </section>
</template>

<style lang="less" rel="stylesheet" scoped>
    .list{
        display: flex;
        flex-direction:row;
        justify-content: space-around;
        margin-top: 20px;
        .item{
            display: flex;
            flex-direction:column;
            align-items: center;
            img{
                width:60px;
                height:60px;
            }
            .selected {
                text-align: center;
                border-radius: 50%;
                width: 26px;
                height: 26px;
                margin: 0 auto;
                box-sizing: border-box;
                border: 1px solid #ccc;
                font-size: 14px;
                font-weight: bold;
                color: #fff;
                cursor: pointer;
                &.sel.can {
                    background-color: #5a98de;
                }
                &.can {
                    background-color: #ccc;
                }
            }
            .title{
                height:30px;
                line-height: 30px;
            }
        }
    }
</style>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import add from "../components/addCompany.vue";
    let companyManageOps = null;

    export default{
        ready () {
            let that = this;
            companyManageOps = {
                param:{
                    search:'',
                    page:1,
                    page_size:10,
                }
            };
            this.getDepartmentId();

        },
        data:function(){
            return {
                noData:false,
                itemsLoading:false,
                isShowAddDialog:false,
                isShowModifyDialog:false,
                items: [],
                departmentId:"",
                currentDepartmentDetail:"",
                isChanged:false,
                isSelected:false,
            }
        },
        methods: {
            getList:function(){
                let that = this;
                $.ajax({
                    url: base.gAjaxUrl.departmentsV4 +that.departmentId+ '/',
                    type: 'GET',
                }).always((data)=> {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=> {
                        this.currentDepartmentDetail = this.getMenu(data.appmodels);
                    });
                })
            },
            getDepartmentId:function(){
                $.ajax({
                    url:base.gAjaxUrl.visitorDepartment,
                    type:"GET",
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
                        this.departmentId = data.id;
                        this.getList();
                    })
                })

            },
            // 返回的数据有一部分是模块类型的数据 如：[智慧出行] [智慧生活] [智慧办公]
            getMenu: function (target) {
                var arr = [];
                target.forEach((item) => {
                    if (item.is_menu) arr.push(item)
                });
                return arr;
            },
            // 点击 选择/取消选择模块功能
            changeSelected: function (item) {
                if (this.isSelected) {
                    item.is_allow = !item.is_allow;
                    this.isChanged = true;
                } else {
                    layer.msg("请先开启【修改权限】!", {icon: 2, time: 1500});
                }
            },
            // 开启 权限修改 功能
            setSelected: function () {
                this.isSelected = !this.isSelected;
            },
            save:function(){
                let that = this;
                this.itemsLoading = true;
                layer.confirm('确定保存当前的设置吗？',(index)=>{
                    $.ajax({
                        url: base.gAjaxUrl.departmentsV4 + this.departmentId + '/set_models/',
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            models: that.getAuthsId(),
                            apply_childs: false,
                        })
                    }).always((data)=> {
                        this.itemsLoading = false;
                        base.ajaxCallback(data, ()=> {
                            layer.msg("设置成功", {icon: 1, time: 1500});
                            this.isChanged = false;
                            this.isSelected = false;
                            this.getList();
                        });
                    })
                });


            },
            getAuthsId: function () {
                var arr = [];
                this.currentDepartmentDetail.forEach((item) => {
                    if (item.is_allow) arr.push(item.id);
                });
                return arr;
            },
        },
        components:{
        }
    }

</script>
