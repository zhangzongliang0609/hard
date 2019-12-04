<template>

    <div v-show="globalImageSrc" id="previewWindow">
        <img id="previewWindowImage" v-bind:src="globalImageSrc"/>
        <span @click="closeImagePreview" class="close-btn-img">x</span>
    </div>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">{{title}}</div>
        <div class="layui-layer-content">
            <div class="panel panel-default radius w-600 mt-10-auto">

                <!-- 订单详情 标题 -->
                <div class="panel-header detailHeader">
                    <img src="../assets/images/icon-order.png" height="20" width="20" alt="" class="icon">
                    <div class="fw-b f-16">报修单号：{{detail.order_no || '--'}}</div>
                    <div class="fc-999 fw-n clearfix">
                        <span>申请时间:{{detail.ctime || '--'}}</span>
                        <span class="f-r">订单状态：<span class="fc-ffab10">{{detail.status_name || '--'}}</span></span>
                    </div>
                </div>


                <!-- 订单详情 明细 -->
                <div class="panel-body detailContent">
                    <div class="clearfix cell_row pt-5 pb-5">
                        <div class="f-l clearfix cell_item">
                            <div class="cell_name">申请人：</div>
                            <div class="f-l cell_content">{{detail.staff_vo ? detail.staff_vo.real_name : '--'}}</div>
                        </div>
                        <div class="f-r clearfix cell_item">
                            <div class="cell_name">联系电话：</div>
                            <div class="f-l cell_content">{{detail.contact_phone || '--'}}</div>
                        </div>
                    </div>
                    <div class="clearfix cell_row pt-5 pb-5">
                        <div class="f-l clearfix cell_item">
                            <div class="cell_name">工号：</div>
                            <div class="f-l cell_content">{{detail.staff_vo ? detail.staff_vo.job_number : '--'}}</div>
                        </div>
                        <div class="f-r clearfix cell_item">
                            <div class="cell_name">部门：</div>
                            <div class="f-l cell_content">
                                {{detail.repairtree_code || '--'}}
                            </div>
                        </div>
                    </div>
                    <div class="clearfix cell_row pt-5 pb-5">
                        <div class="f-l clearfix cell_item">
                            <div class="cell_name">职位：</div>
                            <div class="cell_content">{{detail.position || '--'}}</div>
                        </div>
                        <div class="f-r clearfix cell_item">
                            <div class="cell_name">报修地址：</div>
                            <div class="cell_content">{{detail.location || '--'}}</div>
                        </div>
                    </div>
                    <div class="clearfix cell_row pt-5 pb-5">
                        <div class="f-l clearfix cell_item">
                            <div class="cell_name">报修区域：</div>
                            <div class="cell_content">{{detail.repairarea_name || '--'}}</div>
                        </div>
                        <div class="f-r clearfix cell_item">
                            <div class="cell_name">报修项目：</div>
                            <div class="cell_content">
                                {{detail.fault_item_vos | getFaultItems}}
                            </div>
                        </div>
                    </div>
                    <div class="clearfix cell_row pt-5 pb-5">
                        <div class="f-l clearfix cell_item">
                            <div class="cell_name">故障描述：</div>
                            <div class="cell_content">{{detail.fault_desc || '--'}}</div>
                        </div>
                        <div class="f-r clearfix cell_item">
                            <div class="cell_name">报修图片：</div>
                            <div class="cell_content">
                                <div class="clearfix"
                                     v-if="detail.image_urls && detail.image_urls.length">
                                    <div v-for="imgSrc in detail.image_urls"
                                         class="f-l w30 pointer" @click="previewImage(imgSrc)">
                                        <img :src="imgSrc" alt="" class="img">
                                    </div>
                                </div>
                                <div v-else>--</div>
                            </div>
                        </div>
                    </div>
                    <div class="clearfix cell_row pt-5 pb-5">
                        <div class="f-l clearfix cell_item">
                            <div class="cell_name">期望维修时间：</div>
                            <div class="cell_content">{{detail.expect_repair_time ? detail.expect_repair_time.slice(0,
                                16) : "--"}}
                            </div>
                        </div>
                        <div class="f-r clearfix cell_item"
                             v-if="detail.statusrecord_set && detail.statusrecord_set.length">
                            <div class="cell_name">审批状态：</div>
                            <div class="cell_content">{{detail.approval_status_name || "--"}}</div>
                        </div>
                    </div>
                    <div class="clearfix cell_row pt-5 pb-5">
                        <div class="f-l clearfix cell_item">
                            <div class="cell_name">维修工：</div>
                            <div class="cell_content">
                                {{detail.repairman_name || "--"}}
                            </div>
                        </div>
                        <div class="f-r clearfix cell_item">
                            <div class="cell_name">维修工电话：</div>
                            <div class="cell_content">
                                {{detail.repairman_vo ? (detail.repairman_vo.staff_vo.phone || '--') : "--"}}
                            </div>
                        </div>
                    </div>
                    <div class="clearfix cell_row pt-5 pb-5">
                        <div class="f-l clearfix cell_item">
                            <div class="cell_name">支付方式：</div>
                            <div class="cell_content">
                                {{detail | getPayTypeName}}
                            </div>
                        </div>
                        <div class="f-r clearfix cell_item">
                            <div class="cell_name">维修金额：</div>
                            <div class="cell_content">
                                {{detail.pay_amount | getAmount}} 元
                            </div>
                        </div>
                    </div>
                    <div class="clearfix cell_row pt-5 pb-5">
                        <div class="f-l clearfix cell_item">
                            <div class="cell_name">完成时间：</div>
                            <div class="cell_content">
                                {{detail.complete_time ? detail.complete_time.slice(0, 16) : "--"}}
                            </div>
                        </div>
                        <div class="f-r clearfix cell_item">
                            <div class="cell_name">验收时间：</div>
                            <div class="cell_content">
                                {{detail.check_time ? detail.check_time.slice(0, 16) : "--"}}
                            </div>
                        </div>
                    </div>
                    <div class="clearfix cell_row pt-5 pb-5">
                        <div class="f-l clearfix cell_item">
                            <div class="cell_name">验收人员：</div>
                            <div class="cell_content">
                                {{detail.check_staff || "--"}}
                            </div>
                        </div>
                        <div class="f-r clearfix cell_item">
                            <div class="cell_name">验收备注：</div>
                            <div class="cell_content">
                                {{detail.check_remark || '--'}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 审批信息 -->
            <div class="panel panel-default radius w-600 mt-10-auto"
                 v-if="detail.statusrecord_set && detail.statusrecord_set.length">
                <div class="panel-header commentHeader">
                    <img src="../assets/images/icon-order.png" width="20" alt="" class="icon">
                    <div class="fw-b f-16">审批信息</div>
                </div>
                <div class="panel-body clearfix">
                    <div class="lh-30">
                        <div class="pl-20">
                            <div class="clearfix approvers">
                                <div class="f-l approvers_title">审批人员:</div>
                                <div class="ml-5 f-l" v-if="!detail.statusrecord_set">--</div>
                                <div class="clearfix approve_box f-l" v-else>
                                    <span>{{detail.statusrecord_set | getApprove}}</span>
                                </div>
                            </div>
                            <div class="clearfix rate relative" v-if="item.extend_info.length"
                                 v-for="(index, item) in detail.statusrecord_set"
                                 :class="{'b-b': index < detail.statusrecord_set.length - 1}">
                                <div class="clearfix rate_box" v-for="approver in item.extend_info">
                                    <div class="pd-10 leftRate fc-206afc"><i class="Hui-iconfont  fs-22">&#xe6a8;</i>
                                    </div>
                                    <div class="rightRate">
                                        <div class="rateBox">
                                            <img src="../assets/images/avatar-default.jpg" alt="" class="avatar"/>
                                            <div class="clearfix">
                                                <!-- 参见bug【4720】：【审批通过】和【驳回】显示时间 -->
                                                <span class="f-l fc-333">{{approver.approver}}</span>
                                                <span class="f-l ml-10 fc-999" v-if="getStatus(approver.status_name) <= 10">{{approver.datetime}}</span>
                                                <span class="f-r fc-206afc">{{approver.status_name}}</span>
                                            </div>
                                            <div class="cl">
                                                <div class="fc-999 f-12" style="line-height: 20px">
                                                    {{approver.approval_reason || '--'}}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 订单评价 -->
            <div class="panel panel-default radius w-600 mt-10-auto">
                <div class="panel-header commentHeader">
                    <img src="../assets/images/icon-comment.png" width="20" alt="" class="icon">
                    <div class="fw-b f-16">订单评价</div>
                </div>
                <div class="panel-body clearfix" v-if="detail.comment_vo">
                    <div class="f-l w-100">
                        <div class="f-30 fc-ffab10 text-c">{{detail.comment_vo.score}}</div>
                        <div class="text-c">
                            <img src="../assets/images/icon-star.png" height="15" width="15" alt=""
                                 v-for="item in detail.comment_vo.score" class="mr-5">
                        </div>
                    </div>
                    <div class="comment">
                        <div>
                            <span class="mr-4 bgc-fa bor-e pl-8 pr-8 lh-26 radius dp-ilb"
                                  v-for="item in detail.comment_vo.tags">{{item}}</span>
                        </div>
                        <div class="mt-10 pl-10">{{detail.comment_vo.content}}</div>
                    </div>
                </div>
            </div>

        </div>
        <div class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1"
               href="javascript:;"
               v-on:click="close()"></a>
        </div>
    </div>

    <div class="layui-layer-shade"></div>

</template>

<script type="text/ecmascript-6">

    import * as base from '../assets/js/base.js';

    export default {
        ready() {

            base.verticalCenter('.layui-modify');

            this.getDetail(this.data.id);

        },
        props: ['title', 'data', 'parent_component'],
        data: function () {
            return {
                detail: {
                    image_urls: [],
                    statusrecord_set: []
                },
                showTimeArr: ['驳回', '审批通过', '正在审批', ''],
                globalImageSrc: '',
            }
        },
        methods: {
            getStatus(name) {
                let status = 10;
                switch (name) {
                    case '驳回':
                        status = -10;
                        break;
                    case '审批通过':
                        status = 10;
                        break;
                    case '正在审批':
                        status = 20;
                        break;
                    case '无需审批':
                        status = 30;
                        break;
                    case '未轮到审批':
                        status = 40;
                        break;
                    case '委托审批':
                        status = 50;
                        break;
                    default:
                        break;
                }
                return status
            },
            getDetail: function (id) {
                $.showLoading();
                $.ajax({
                    url: base.gAjaxUrl.repairorders + id + '/',
                    type: "GET",
                }).always((data) => {
                    $.hideLoading();
                    base.ajaxCallback(data, () => {
                        this.detail = data;
                    })
                })
            },
            close: function () {
                this.$dispatch('dialog-close');
            },
            clickImg: function (url) {
                layer.open({
                    title: '故障描述',
                    content: `<img src="${url}" style="width:280px;height:auto">`,
                });
            },
            closeImagePreview: function (e) {
                this.globalImageSrc = "";
            },
            previewImage: function (src) {
                this.globalImageSrc = src;
            }
        },
        filters: {
            getApprove(detail) {
                detail = detail || [];
                var str = '';
                detail.forEach((item, i) => {
                    // console.log(item, i);
                    let names = '';
                    if (item.extend_info.length) {
                        item.extend_info.forEach((member, j) => {
                            names += member.approver + '/'
                        })
                    }
                    // console.log("names: ", names)
                    str += ' → ' + names.slice(0, -1)
                });
                return str.slice(3, 999999) || '--';
            },
            getAmount(price) {
                price = price || 0;
                return price != 0 ? (price / 100).toFixed(2) : 0
            },
            getFaultItems(arr) {
                let str = '--';
                if (arr && arr.length) {
                    str = arr.map(item => item.fault_name).join('/')
                }
                return str
            },
            getPayTypeName (item) {
                // 订单状态item.status>=50（已过支付流程）
                // 有  pay_type_name 就显示；没有就显示“无需支付”
                // 50 之前的状态显示 '--'
                if(item.status >= 50) {
                    return item.pay_type_name || '无需支付'
                } else {
                    return '--'
                }
            }
        }
    }
</script>


<style lang="less" scoped rel="stylesheet/less">
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

    .cell_row {
        line-height: 22px;

        .cell_item {
            width: 275px;
            box-sizing: border-box;

            .cell_name {
                float: left;
            }

            .cell_content {
                overflow: hidden;
                .w30 {
                    width: 50px;
                    height: 50px;
                    margin-left: 5px;
                    .img {
                        width: 100%;
                        height: 100%;
                        display: block;
                    }
                }
            }
        }
    }

    .detailContent div span {
        display: inline-block;
    }

    .desc {
        overflow: hidden;
    }

    .descImg {
        width: 120px;
        height: 120px;
        border-radius: 4px;
        margin-right: 10px;
        margin-bottom: 10px;
        overflow: hidden;
        display: inline-block;
    }

    .descImg img {
        cursor: pointer;
    }

    .comment {
        overflow: hidden;
    }

    .text-overflow:hover {
        white-space: nowrap !important;
    }

    .approvers {
        width: 550px;
        padding: 5px 0 20px;

        .approvers_title {
            width: 80px;
        }

        .approve_box {
            width: 470px;
        }
    }

    .b-b {
        border-bottom: 1px dashed #ccc;
    }

    .rate {
        width: 100%;
        box-sizing: border-box;
        margin-bottom: 10px;

        .rate_box {
            width: 100%;
            box-sizing: border-box;
            position: relative;
            padding-left: 64px;
        }

        .leftRate {
            position: absolute;
            top: 10px;
            left: 0;
            bottom: 10px;
            border-right: 1px dashed #d9d9d9;
            width: 16px;

            i {
                position: absolute;
                top: 50%;
                margin-top: -15px;
                left: 25px;
            }
        }

        .rightRate {
            overflow: hidden;
            padding: 10px;
            box-sizing: border-box;

            .avatar {
                position: absolute;
                left: 15px;
                top: 10px;
                width: 32px;
                box-sizing: border-box;
            }

            .rateBox {
                position: relative;
                border: 1px solid #D9D9D9;
                background-color: #fff;
                padding: 4px;
                border-radius: 4px;
                width: 100%;
                padding-left: 64px;
                padding-right: 10px;
                box-sizing: border-box;
            }
        }
    }
</style>
