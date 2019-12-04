<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">委派维修工</div>
        <div class="layui-layer-content">
            <div class="repair">
<!--                报修项目：<span v-for="item in data.fault_item_vos"><span>{{item.fault_name}}<span-->
<!--                    v-show="$index < data.fault_item_vos.length-1">/</span></span></span>&nbsp;&nbsp;&nbsp;&nbsp;-->
                报修项目：{{data.fault_items}}&nbsp;&nbsp;&nbsp;&nbsp;
                地址：{{data.location}}
            </div>
            <div class="bk-gray radius mt-10">
                <div class="clear">
                    <div class="text-l clearfix f-l mr-15 mt-10 ml-10">
                        <input v-model="searchInput" type="text" placeholder="名字/工号/手机号" style="width:250px"
                               class="f-l input-text">
                        <button v-on:click="getList(1)" class="btn btn-success" type="button"><i
                                class="f-r Hui-iconfont">&#xe665;</i></button>
                    </div>
                    <div class="layui-layer-btn place f-r" v-on:click="save(data.id)"><a class="layui-layer-btn0"
                                                                                         v-if="type!='check'">确认选择</a>
                    </div>
                </div>
                <table class="table table-border table-bg table-striped">
                    <thead class="text-c">
                    <tr>
                        <th>选择</th>
                        <th>姓名/性别</th>
                        <th>部门/职位</th>
                        <th>工号</th>
                        <th>电话</th>
                    </tr>
                    </thead>
                    <tbody class="text-c">
                    <tr v-for="item in items">
                        <td><input type="radio" v-model="selectRepairmen" value="{{item.id}}"></td>
                        <td>{{item.staff_vo.real_name}}/{{item.staff_vo.sex==1? '男': '女';}}</td>
                        <td>{{item.staff_vo.department_vo.department_name}}/{{item.staff_vo.position}}</td>
                        <td>{{item.staff_vo.job_number}}</td>
                        <td>{{item.staff_vo.phone}}</td>
                    </tr>
                    </tbody>
                </table>
                <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>

            </div>
            <div id="J-page" class="m-page" v-show="!noData"></div>
        </div>
    <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
    </div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
    <div class="layui-layer-shade"></div>
</template>

<style lang="less">
    .repair {
        background-color: #fafafa;
        border: 1px solid #eeeeee;
        padding: 6px 12px;
        margin: 10px;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';

    let repairOps = null;

    export default{
        ready () {

            repairOps = {
                param: {
                    search: '',
                    page: 1,
                    page_size: 10,
                }
            };

            base.verticalCenter('.layui-modify');

            this.getList(1);

        },
        props: ['title', 'type', 'data'],
        data: function () {
            return {
                typeNameInput: '',
                items: [],
                selectRepairmen: [],
                noData: false,
                itemsLoading: false,
            }
        },
        methods: {
            close: function () {
                this.$dispatch('dialog-close');
            },
            save: function (id) {
                let that = this;
                let ajaxAddData = {
                    repairman: this.selectRepairmen,
                };
                $.ajax({
                    url: `${base.gAjaxUrl.repairorders}${id}/repairman/`,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(ajaxAddData),
                }).always(function (data) {
                    base.ajaxCallback(data, function () {
                        layer.msg('提交成功', {icon: 1, time: 1000});
                        that.$dispatch('dialog-save');
                    });
                });
            },
            //初始化分页
            initPage: function (obj, tpageToal = '4', current = '1', count = '0') {
                $(obj).createPage({
                    pageCount: tpageToal,
                    current: current,
                    count: count,
                    callback: (p)=> {
                        repairOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            //获取列表
            getList: function (reset = 0) {
                //重置第一页
                if (reset) {
                    repairOps.param.page = 1
                }

                this.queryAjax((tpageToal = '4', count = '0')=> {
                    this.initPage('#J-page', tpageToal, repairOps.param.page, count)
                });
            },
            queryAjax: function (callback = () => {}) {
                //修改参数
                this.itemsLoading = true;
                repairOps.param.search = this.searchInput;
                $.ajax({
                    url: base.gAjaxUrl.repairsArea + this.data.repairarea + '/repairman/',
                    type: 'GET',
                    data: repairOps.param
                }).always((data)=> {
                    base.ajaxCallback(data, ()=> {
                        this.itemsLoading = false;
                        let resultData = data.results;
                        this.items = resultData;
                        if (resultData && resultData.length > 0) {
                            this.noData = false;
                            //回调
                            callback(data.num_pages, data.count);
                        } else {
                            this.noData = true;
                        }
                    });
                })
            },
        }
    }
</script>
