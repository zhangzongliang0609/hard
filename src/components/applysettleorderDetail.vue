<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">{{title}}</div>
        <div class="layui-layer-content pl-20 pr-20">
            <div class="fw-b lh-30 pl-20">订单状态:<span class="fc-206afc">{{data.status_name}}</span></div>
            <div class="cl lh-30">
                <div class="f-l col-7">
                    <div class="fc-999 fs-16 fw-b pl-20">申请信息</div>
                    <div class="pl-20"><span class="mr-15">申请人:</span>{{data.staff_vo.real_name}}</div>
                    <div class="pl-20"><span class="mr-15">部门:</span>{{data.staff_vo.department_vo.department_name}}
                    </div>
                    <div class="pl-20"><span class="mr-15">职位:</span>{{data.staff_vo.position}}</div>
                    <div class="pl-20"><span class="mr-15">学历:</span>{{data.staff_vo.education?data.staff_vo.education:'--'}}
                    </div>
                    <div class="pl-20">
                        <span class="mr-15">员工分组:</span>
                        <span class="staff-tag text-c pr-5 pl-5 mr-5 mt-5" v-for="item in data.staff_vo.tags">
                        {{item.name}}
                    </span>
                    </div>
                    <div class="pl-20"><span class="mr-15">工号:</span>{{data.staff_vo.job_number}}</div>
                    <div class="pl-20"><span class="mr-15">手机号:</span>{{data.staff_vo.phone}}</div>
                    <div class="pl-20"><span class="mr-15">身份证:</span>{{data.id_card?data.id_card:data.staff_vo.id_card?data.staff_vo.id_card:'--'}}
                    </div>
                    <div class="pl-20 fc-206afc"><span class="mr-15">申请宿舍楼名称:</span>{{data.booking_building_vo?data.booking_building_vo.building_name?data.booking_building_vo.building_name:'--':'--'}}
                    </div>
                    <div class="pl-20 fc-206afc"><span class="mr-15">申请房间类型:</span>{{data.room_type_vo?data.room_type_vo.type_name:'--'}}
                    </div>

                    <div class="pl-20 fc-206afc"><span class="mr-15">预计入住日期:</span>{{data.checkin_pre || '--'}}</div>
                    <div class="pl-20 fc-206afc"><span class="mr-15">预计退房日期:</span>{{data.checkout_pre || '--'}}</div>
                </div>
                <div class="f-l col-5">
                    <div class="fc-999 fs-16 fw-b">住宿信息</div>
                    <div><span class="mr-15">住宿地址:</span>{{data.room_vo?data.room_vo.location:'--'}}</div>
                    <div><span class="mr-15">分配房间类型:</span>
                        {{data.room_vo ? data.room_vo.room_type_vo.type_name:'--'}}
                    </div>
                    <div><span class="mr-15">押金金额:{{data.deposit?data.deposit:0}}</span>
                        <!--{{data.room_vo ? data.room_vo.room_type_vo.type_name:'&#45;&#45;'}}-->
                    </div>
                    <div><span class="mr-15">押金票号:{{data.deposit_no?data.deposit_no:'无'}}</span>
                        <!--{{data.room_vo ? data.room_vo.room_type_vo.type_name:'&#45;&#45;'}}-->
                    </div>
                    <div><span class="mr-15">二级处:{{data.second_level || '--'}}</span>
                    </div>
                    <div><span class="mr-15">项目:{{data.project_name || '--'}}</span>
                    </div>
                    <div><span class="mr-15">分配日期:</span>{{data.assign_date?data.assign_date:'--'}}</div>
                    <div><span class="mr-15">入住日期:</span>{{data.checkin_time?data.checkin_time:'--'}}</div>
                    <div class="fc-206afc"><span class="mr-15">期望退房日期:</span>{{data.checkout_date?data.checkout_date:'--'}}
                    </div>
                    <div><span class="mr-15">退房日期:</span>{{data.checkout_time?data.checkout_time:'--'}}</div>
                </div>
            </div>
            <div class="lh-30 bor-b">
                <div class="pl-20"><span class="mr-15">备注:</span>{{data.remark?data.remark:'--'}}</div>
                <!--<div class="pl-20"><span class="mr-15">申请原因:</span>{{data.apply_reason?data.apply_reason:'&#45;&#45;'}}</div>-->
            </div>
            <div class="lh-30 row">
                <div class="pl-20">
                    <div class="fc-999 fs-16 fw-b">审批信息</div>
                    <div class="clearfix">
                        <span class="mr-10 f-l">审批人员:</span>
                        <span class="ml-5" v-if="!data.approvalinfo_set">--</span>
                        <span class="clearfix approva" v-else v-for="item in data.approvalinfo_set">
                        <img class="avatar"
                             v-bind:src="item.approver_vo.avatar?item.approver_vo.avatar:'./src/assets/images/avatar-default.jpg'"/>
                        <span class="approvaName lh-20">{{item.approver_vo.real_name}}</span>
                    </span>
                    </div>
                    <div v-if="data.approvalinfo_set">
                        <!--<div class="clearfix rate relative">-->
                        <!--<div class="pd-10 leftRate"><i class="Hui-iconfont fc-206afc fs-22">&#xe6a8;</i></div>-->
                        <!--<div class="rightRate">-->
                        <!--<div class="rateBox">-->
                        <!--<img v-bind:src="data.staff_vo.avatar?data.staff_vo.avatar:'./src/assets/images/avatar-default.jpg'" alt="" class="avatar">-->
                        <!--<div class="clearfix">-->
                        <!--<span>{{data.staff_vo.real_name}}</span>-->
                        <!--<span class="f-r fc-999">{{data.ctime}}</span>-->
                        <!--</div>-->
                        <!--<div class="fc-206afc">发起申请</div>-->
                        <!--</div>-->
                        <!--</div>-->
                    </div>
                    <div class="clearfix rate relative"
                         v-for="item in statusList">
                        <div class="pd-10 leftRate fc-206afc"><i class="Hui-iconfont  fs-22">&#xe6a8;</i></div>
                        <div class="rightRate">
                            <div class="rateBox clearfix">
                                <div class="left_img f-l">
                                    <img v-bind:src="item.avatar?item.avatar:'./src/assets/images/avatar-default.jpg'"
                                         alt="">
                                </div>
                                <div class="right_box f-l">

                                    <div class="clearfix operate_title">
                                        <span class="f-l title_name">{{item.operator_name}}</span>
                                        <span class="f-r fc-999 title_time text-r"
                                              v-if="isShowDateTime(item.status_name)">{{item.time}}</span>
                                    </div>

                                    <!-- 20:正在审批中;10:审批通过;-10:驳回 -->
                                    <div class="fc-206afc">{{item.status_name}}
                                    </div>
                                    <div class="fc-999 f-12">{{item.remark?item.remark:''}}</div>

                                </div>


                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div>
    <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
        </div>
    </div>

    <div class="layui-layer-shade"></div>
</template>

<style lang="less" scoped>
    .panel-header.detailHeader,
    .panel-header.commentHeader {
        position: relative;
        padding: 15px;
        padding-left: 42px;
    }

    .detailHeader .icon {
        position: absolute;
        top: 26px;
        left: 12px;
    }

    .commentHeader .icon {
        position: absolute;
        top: 16px;
        left: 12px;
    }

    .approva {
        position: relative;
        display: inline-block;
        width: 56px;
        text-align: center;
    }

    .approva .approvaName {
        display: block;
        text-align: center;
        width: 56px;
        margin-top: 5px
    }

    .rate {
        padding-left: 64px;
    }

    .rate .leftRate {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        border-right: 1px solid #d9d9d9;
        width: 16px;
    }

    .rate .leftRate i {
        position: absolute;
        top: 50%;
        margin-top: -15px;
        left: 25px;
    }

    .rate .rightRate {
        overflow: hidden;
        padding: 10px;
    }

    .rightRate .avatar {
        position: absolute;
        left: 15px;
        top: 10px;
        width: 32px;
        /*margin-top: -16px;*/
    }

    .rateBox {
        position: relative;
        border: 1px solid #D9D9D9;
        background-color: #fff;
        border-radius: 4px;
        padding: 15px;
        box-sizing: border-box;
        width: 500px;

        .left_img {
            width: 40px;
            height: 100%;

            img {
                display: block;
                width: 32px;
                height: 32px;
            }
        }

        .right_box {
            margin-left: 10px;
            width: 410px;
            line-height: 24px;

            .operate_title {
                .title_name {
                    width: 235px;
                }

                .title_time {
                    width: 160px;
                }
            }
        }
    }

    .staff-tag {
        display: inline-block;
        height: 30px;
        line-height: 30px;
        background-color: #ff9542;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        color: white;
    }
</style>
<script>
    import * as base from '../assets/js/base.js';

    let getData = '';

    export default {
        ready() {
            let that = this;
            getData = this.data;

            base.verticalCenter('.layui-modify');
            this.getStatusList();

            // ajaxUrl = `${base.gAjaxUrl.pubrepairorders}${getData.id}/`;

        },
        props: ['title', 'type', 'data'],
        data: function () {
            return {
                detail: {},
                statusList: [],
            }
        },
        methods: {
            isShowDateTime(status_name) {
                if (/(^待[\s\S]+)|(^正在[\s\S]+)/.test(status_name)) return false;
                return true
            },
            close: function () {
                this.$dispatch('dialog-close');
            },
            getStatusList: function () {
                $.ajax({
                    url: `${base.gAjaxUrl.applysettleorders}${this.data.id}/status_record/`,
                    type: "GET",
                }).always((data) => {
                    base.ajaxCallback(data, () => {
                        this.statusList = data.record_list;
                        console.log("statusList");
                        console.log(this.statusList);
                    })
                })
            }
        },
    }
</script>
