<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">订单详情</div>
        <div class="layui-layer-content layui-layer-order-wrap">
            <form id="J-layer-form" class="form form-horizontal layui-layer-wrap ">
                <div class="row cl">
                    <label class="form-label f-l col-4 ">申请人：</label>
                    <div class="formControls f-l col-4">
                        <div class="lh-25">
                            {{items.staff_vo? items.staff_vo.real_name: '--'}}
                        </div>
                        <!--<input type="text" class="input-text" value="{{items.staff_vo? items.staff_vo.real_name: '&#45;&#45;'}}"-->
                               <!--readonly>-->
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">审批流程：</label>
                    <div class="formControls f-l col-6">
                        <div class="lh-25">
                         {{items.approvalinfo_set?items.approvalinfo_set.join('→'):"--"}}
                        </div>
                        <!--<input type="text" class="input-text" value="{{items.approvalinfo_set}}" readonly>-->
                    </div>
                </div>

                <!--<div class="row cl">-->
                    <!--<label class="form-label f-l col-4 ">乘车人电话：</label>-->
                    <!--<div class="formControls f-l col-4">-->
                        <!--<div class="lh-25">-->
                            <!--{{items.passenger_phone}}-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</div>-->
                <div class="row cl">
                    <label class="form-label f-l col-4 ">起点：</label>
                    <div class="formControls f-l col-4">
                        <div class="lh-25">
                            {{items.source_name}}
                        </div>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">终点：</label>
                    <div class="formControls f-l col-4">
                        <div class="lh-25">{{items.destination_name}}</div>
                        <!--<input type="text" class="input-text" value="{{items.destination_name}}" readonly>-->
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">出发时间：</label>
                    <div class="formControls f-l col-4">
                        <div class="lh-25">
                            {{items.ride_time}}
                        </div>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">结束时间：</label>
                    <div class="formControls f-l col-4">
                        <div class="lh-25">
                            {{items.end_time}}
                        </div>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">乘车人数：</label>
                    <div class="formControls f-l col-4">
                        <div class="lh-25">
                            {{items.passenger_number}}
                        </div>
                    </div>
                </div>

                <div class="row cl">
                    <label class="form-label f-l col-4 ">乘车人名称/电话：</label>
                    <div class="formControls f-l col-4">
                        <div v-if="!items.use_staffs" class="lh-25">
                            <span class="inline-block lh-25">{{items.passenger_name}}</span>
                            <span class="inline-block lh-25">{{items.passenger_phone}}</span>
                        </div>
                        <div class="lh-25" v-if="items.use_staffs && items.use_staffs.length > 0">
                            <div v-for="staff in items.use_staffs">
                                <span class="inline-block lh-25">{{staff.real_name}}</span>
                                <span class="inline-block lh-25">{{staff.phone}}</span>
                            </div>
                        </div>
                        <!--<input type="text" class="input-text" value="{{items.passenger_name}}" readonly>-->
                    </div>
                </div>

                <div class="row cl">
                    <label class="form-label f-l col-4 ">拼车：</label>
                    <div class="formControls f-l col-4">
                        <div class="lh-25">
                            {{items.is_carpool}}
                        </div>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">加急：</label>
                    <div class="formControls f-l col-4">
                        <div class="lh-25">
                            {{items.is_urgent}}
                        </div>
                    </div>
                </div>


                <div class="row cl">
                    <label class="form-label f-l col-4 ">接送司机：</label>
                    <div class="formControls f-l col-4">
                        <div class="lh-25">
                            {{items.driver_vo? items.driver_vo.staff_vo.real_name: '--'}}
                        </div>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">接送车辆：</label>
                    <div class="formControls f-l col-4">
                        <div class="lh-25">
                            {{items.vehicle_vo? items.vehicle_vo.car_no: '--'}}
                        </div>
                    </div>
                </div>

                <div class="row cl">
                    <label class="form-label f-l col-4 ">状态：</label>
                    <div class="formControls f-l col-4">
                        <div class="lh-25">
                            {{items.order_status_name}}
                        </div>
                    </div>
                </div>


                <div class="row cl">
                    <label class="form-label f-l col-4 ">原因：</label>
                    <div class="formControls f-l col-4">
                        <div class="lh-25">
                            {{items.reason}}
                        </div>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">备注：</label>
                    <div class="formControls f-l col-4">
                        <div class="lh-25">
                            {{items.remark}}
                        </div>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">取消原因：</label>
                    <div class="formControls f-l col-4">
                        <div class="lh-25">
                            {{items.cancel_reason}}
                        </div>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 ">司机反馈：</label>
                    <div class="formControls f-l col-4">
                        <div class="lh-25">
                            {{items.driver_feedback}}
                        </div>
                    </div>
                </div>

                <div class="row cl">
                    <label class="form-label f-l col-4 ">分组：</label>
                    <div class="formControls f-l col-4">
                        <tags :tags="wTagsArr" :selected="tagsArr"></tags>
                    </div>
                </div>

                <div class="row cl">
                    <label class="form-label f-l col-4 ">订单费用：</label>
                    <div class="formControls f-l col-4">
                        <table class="table table-border table-bordered table-hover table-bg mt-10">
                            <thead>
                            <tr class="text-c">
                                <th>费用名称</th>
                                <th>金额</th>
                                <th>操作员</th>
                            </tr>
                            </thead>
                            <div class="result" v-if="!noData">
                                <tbody>
                                <tr class="text-c" v-for="order in items.fee_orders">
                                    <td>{{order.name}}</td>
                                    <td>{{order.fee}}</td>
                                    <td>{{order.operator?order.operator:''}}</td>
                                </tr>
                                </tbody>
                            </div>
                        </table>
                    </div>
                </div>
            </form>
        </div>
    <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close"></a>
    </span>
        <div class="layui-layer-btn" v-on:click="save"><a class="layui-layer-btn0">保存</a></div>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import tags from './setTags'
    export default{
        ready () {
            this.getTagList();
            let getData = JSON.parse(JSON.stringify(this.data));
            let id = getData.order_id ? getData.order_id : getData.id;
            $.ajax({
                url: `${base.gAjaxUrl.officialcarorders}${id}/`,
                type: 'GET',
            }).always((data)=> {
                this.items = data;
                this.items.is_carpool = this.items.is_carpool ? '是' : '否';
                this.items.is_urgent = this.items.is_urgent ? '是' : '否';
            });
            this.tagsArr = getData.tags;
        },
        props: ['data'],
        data: function () {
            return {
                noData: false,
                items: {
                    is_carpool: '',
                    is_urgent: '',
                },
                orderData: [{cost_name: "过桥费", price: 1000, operator: '小明'}],
                tagsArr: [],
                wTagsArr: [],
            }
        },
        methods: {
            close: function () {
                this.$dispatch('order-dialog-close');
            },
            isUrgent: function (data) {
                if (data) {
                    return '<span class="red">是</span>';
                } else {
                    return '否';
                }
            },
            getTagList: function () {
                this.itemsLoading = true;
                // 3代表大巴车,4代表公务车
                $.ajax({
                    url: base.gAjaxUrl.tagGroup,
                    type: 'GET',
                    data: {
                        type: 4,
                        page: 1,
                        page_size: 999999,
                        flag: 'tag_offorder'
                    }
                }).always((data)=> {
                    this.itemsLoading = false;
                    base.ajaxCallback(data, ()=> {
                        this.wTagsArr = data.results || [];
                    });
                });
            },
            getTagIds: function (tagArr) {
                let arr = [];
                for (let i = 0, len = tagArr.length; i < len; i++) {
                    arr.push(tagArr[i].id);
                }
                return arr;
            },
            save: function () {
                let id = this.data.order_id ? this.data.order_id : this.data.id;
                let ajaxData = {
                    tags_set: this.getTagIds(this.tagsArr)
                }
                $.ajax({
                    url: `${base.gAjaxUrl.officialcarorders}${id}/`,
                    type: 'PATCH',
                    contentType: 'application/json',
                    data: JSON.stringify(ajaxData)
                }).always((data)=> {
                    base.ajaxCallback(data, ()=> {
                        this.$dispatch('dialog-save')
                    })
                })
            }
        },
        components: {
            tags: tags,
        }
    }
</script>
<style lang="less">
    .layui-order-detail {
        width: 1000px !important;
        margin-left: -500px !important;
    }

    .layui-layer-title {

    .m-info {
        border: none;
        padding: 9px 0;
        margin: 0;
    }

    }
    .layui-layer-order-wrap .form .row {
        margin-top: 10px;
    }
    .lh-25{
        line-height:25px;
    }
</style>
