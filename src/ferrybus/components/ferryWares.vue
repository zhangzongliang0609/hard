<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">{{title}}</div>
        <div class="layui-layer-content">
            <div class="pl-10 pr-10">
                <div class="f-16 fw-b">[{{data.car_no}}]</div>
                <div>
                    <span class="pr-5">品牌:</span><span class="iconspace">{{data.car_brand}}</span>
                    <span class="pl-10 pr-5">型号:</span><span class="iconspace">{{data.car_model}}</span>
                    <span class="pl-10 pr-5">颜色:</span><span class="iconspace">{{data.car_color}}</span>
                    <span class="pl-10 pr-5">发动机:</span><span class="iconspace">{{data.engine_no}}</span>
                    <span class="pl-10 pr-5">车架号:</span><span class="iconspace">{{data.drive_no}}</span>
                    <span class="pl-10 pr-5">车辆注册日期:</span><span>{{data.register_date}}</span>
                </div>
                <div class="mt-10" v-if="data.position_hardware_vo">
                    <span class="pr-5">已绑定定位器:</span>{{data.position_hardware_vo.hardware_no}}
                    <a class="btn btn-primary radius" href="javascript:;"
                       v-on:click="deletePositioninghardwares(data.position_hardware_vo.hardware_no)"><i
                            class="Hui-iconfont">&#xe706;</i>解除绑定</a>
                </div>
            </div>
            <div class="row cl location-control">
                <div class="col-12 f-l">
                    <div class="form-label f-l col-2 text-r mr-5 mt-5 select-department">搜索定位器ID:</div>
                    <div class="formControls f-l col-4">
                        <div class="department_select_container" @mouseleave="departmentEnter(false,$event)"
                             @mouseenter="departmentEnter(true,$event)">
                            <input v-if="items.length === 0" disabled type="text" class="input-text" value="无可选择硬件">
                            <input v-else autocomplete="off" @click="departmentClick($event)" v-model="selectLocator"
                                   type="text" class="input-text" value="" placeholder="" name="department">
                            <i v-show="selectLocator !== ''" class="empty-icon Hui-iconfont"
                               @click="emptySearch($event)">&#xe60b;</i>
                            <div class="departmentListBox" style="display: none">
                                <div v-bind:title="item" track-by="$index"
                                     v-for="item in items | filterBy selectLocator in 'hardware_no'"
                                     @click="setDepartmentValue(item,$event)" class="departmentListItem">
                                    {{item.hardware_no}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bk-gray radius mt-10 ml-20 mr-20">
                <ul>
                    <li class="locator-title">定位器</li>
                </ul>
                <div class="table-box">
                    <table class="table table-border table-bg">
                        <thead class="text-c">
                        <tr>
                            <th>选择</th>
                            <th>定位器ID</th>
                            <th>绑定车辆</th>
                        </tr>
                        </thead>
                        <tbody class="text-c">
                        <!--<label >-->
                        <tr class="locator-tr" v-for="item in items" @click="clickTr($index,item)"
                            :class="$index === currentIndex?'current-tr':''">
                            <td><input class="locator-input" :id="item.id | idJoint" type="radio"
                                       :checked="$index === currentIndex && !item.car_no "
                                       v-bind:disabled="data.hardware_vo || item.car_no"></td>
                            <td>{{item.hardware_no }}</td>
                            <td>{{item.car_no?item.car_no:'--'}}</td>
                        </tr>
                        <!--</label>-->
                        </tbody>
                    </table>
                </div>
                <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>


            </div>
            <div class="clearfix">
                <div class="layui-layer-btn place f-r" v-on:click="save">
                    <a class="layui-layer-btn0" v-if="type!='check'">绑定</a>
                </div>
            </div>
        </div>
        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
    </div>
    <div class="layui-layer-shade"></div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>

<style lang="less" scoped>
    .iconspace {
        padding-right: 10px;
        border-right: 1px solid #5a98de;
    }

    .locator-title {
        display: block;
        position: relative;
        border: 1px solid #ddd;
        border-bottom: none;
        border-radius: 5px;
        top: 2px;
        width: 70px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background-color: #f5fafe;
    }

    .table-box {
        max-height: 300px;
        overflow-y: auto;
    }

    .current-tr {
        background-color: #30bfb0;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../../assets/js/base.js';


    export default{
        ready () {

            base.verticalCenter('.layui-modify');

            this.queryAjax();

        },
        props: ['title', 'type', 'data',],
        data: function () {
            return {
                noData: false,
                searchInput: '',
                items: [],
                selectHardware: [],
                newId: '',
                isDepartmentFocus: false,
                selectLocator: '',
                currentIndex: '',
            }
        },
        filters: {
            idJoint: function (val) {
                return "id" + val
            },
        },
        methods: {
            close: function () {
                this.$dispatch('dialog-close');
            },
            save: function () {
                let that = this;
                if (!this.selectHardware) {
                    layer.msg('请选择硬件', {icon: 2, time: 1000});
                    return;
                }
                let ajaxData = {
                    hardware: this.selectHardware,
                };
                $.ajax({
                    url:base.gAjaxUrl.ferryBusList+`${this.data.id}/positioninghardware/`,
                    type: 'PATCH',
                    contentType: 'application/json',
                    data: JSON.stringify(ajaxData),
                })
                        .always(function (data) {
                            base.ajaxCallback(data, function () {
                                layer.msg('提交成功', {icon: 1, time: 1000});
                                that.$dispatch('dialog-save');
                            });
                        });
            },
            deletePositioninghardwares: function (locator) {
                let that = this;
                layer.confirm('删除须谨慎，确认要解除' + locator + '这个定位器的绑定吗？', ()=> {
                    $.ajax({
                        url: base.gAjaxUrl.ferryBusList+`${this.data.id}/positioninghardware/`,
                        type: 'DELETE',
                    }).always(function (data) {
                        base.ajaxCallback(data, function () {
                            layer.msg('删除成功', {icon: 1, time: 1000});
                            that.data.position_hardware_vo = null;
                            that.data.position_hardware = null;
                            that.queryAjax();
                        });
                    });

                    layer.closeAll('dialog')
                });


            },
            //获取定位器列表
            getList: function (reset = 0) {
                let that = this;
                //重置第一页
                if (reset) {
                    itemOps.param.page = 1
                }

                this.queryAjax();
            },
            queryAjax: function (callback = function () {
            }) {
                let that = this;
                //修改参数
                this.itemsLoading = true;
                $.ajax({
                    url: base.gAjaxUrl.positioninghardwares,
                    type: 'GET',
                    data: {
                        page: 1,
                        page_size: 999999
                    },
                }).always((data) => {
                    that.itemsLoading = false;
                    base.ajaxCallback(data, () => {
                             console.log(data)
                                let res = data.results || [];
                                that.items = res;
                                that.noData = !res.length;
                            }
                    );
                });
            },
            departmentEnter: function (flag, e) {
                this.isDepartmentFocus = flag;
                !flag && $(e.target).children(".departmentListBox").hide();
            },
            departmentClick: function (e) {
                if (this.isDepartmentFocus) {
                    $(e.target).nextAll(".departmentListBox").show();
                }
            },
            setDepartmentValue: function (item, e) {
                this.selectLocator = item.hardware_no;
                let index = this.items.indexOf(item);
                this.clickTr(index, item)
                let distance = $(".locator-tr").eq(index).offset().top;
                $('.table-box').scrollTop(distance - 300);
                $(e.target).parent(".departmentListBox").hide();
            },
            // 清除搜索输入框
            emptySearch: function (e) {
                this.selectLocator = '';
                $(e.target).nextAll(".departmentListBox").show();
            },
            clickTr: function (index, item) {
                if (item.car_no) {
                    this.selectHardware = '';
                    layer.msg("定位器已绑定其他车辆", {time: 1500, icon: 2});
                } else {
                    this.selectHardware = item.id;
                }
                this.currentIndex = index;
            }
        }
    }
</script>
