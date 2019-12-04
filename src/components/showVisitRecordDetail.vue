<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">查看申请人信息</div>
        <div class="layui-layer-content">
            <form id="J-layer-form" class="form form-horizontal layui-layer-wrap pr-20">
                <div class="row cl">
                    <label class="form-label f-l col-2 ">申请人姓名：</label>
                    <div class="formControls f-l col-10">
                        <div class="lh-30">{{data.visitor_name}}</div>
                        <!--<input :value="data.visitor_name" type="text" class="input-text" value="" placeholder="" disabled="disabled">-->
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-2 ">申请人电话：</label>
                    <div class="formControls f-l col-10">
                        <div class="lh-30">{{data.visitor_phone}}</div>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-2 ">访客单位/公司：</label>
                    <div class="formControls f-l col-10">
                        <div class="lh-30">{{data.vistor_company}}</div>
                    </div>
                </div>

                <div class="row cl">
                    <label class="form-label f-l col-2 ">申请时间：</label>
                    <div class="formControls f-l col-10">
                        <div class="lh-30">{{data.ctime}}</div>
                    </div>
                </div>

                <div class="row cl">
                    <label class="form-label f-l col-2 ">拜访时间：</label>
                    <div class="formControls f-l col-10">
                        <div class="lh-30">{{data.visit_time}}</div>
                    </div>
                </div>


                <div class="row cl">
                    <label class="form-label f-l col-2 ">状态：</label>
                    <div class="formControls f-l col-10">
                        <div class="lh-30">{{data.status_name}}</div>
                    </div>
                </div>

                <div class="row cl ">
                    <label class="form-label f-l col-2 ">来访事由：</label>
                    <div class="formControls f-l col-10">
                        <div class="lh-30">{{data.visit_reason}}</div>
                    </div>
                </div>

                <div class="row cl">
                    <label class="form-label f-l col-2 ">来访人员：</label>
                    <div class="formControls f-l col-10">
                        <table class="table table-border table-bg table-striped table-hover">
                            <thead class="text-c">
                            <tr>
                                <th class="pl-15">访客名称</th>
                                <th>访客电话</th>
                                <th>到访时间</th>
                                <th>离开时间</th>
                                <th v-if="rules.second_id_switch">身份证号码</th>
                                <th v-if="rules.duty_staff_cardnumber">执勤人员(到达/离开)</th>
                                <th v-if="rules.duty_staff_cardnumber">来访证编号</th>
                            </tr>
                            </thead>
                            <tbody >
                            <tr class="text-c" v-for="item in data.retinue">
                                <td>{{item.visitor_name}}</td>
                                <td>{{item.visitor_phone}}</td>
                                <td>{{item.arrive_time ? item.arrive_time.slice(0,16) : "--"}}</td>
                                <td>{{item.leave_time ? item.leave_time.slice(0,16) : "--"}}</td>
                                <td v-if="rules.second_id_switch">{{item.visitor_idcard || '--'}}</td>
                                <td v-if="rules.duty_staff_cardnumber">{{item.duty_staff_name}}/{{item.leave_duty_name}}</td>
                                <td v-if="rules.duty_staff_cardnumber">{{item.duty_id}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="row cl">
                    <label class="form-label f-l col-2 ">来访随身物品：</label>
                    <div class="formControls f-l col-10">
                        <div class="lh-30">{{data.personal_effects}}</div>
                    </div>
                </div>

                <div class="row cl">
                    <label class="form-label f-l col-2 ">备注：</label>
                    <div class="formControls f-l col-10">
                        <div class="lh-30">{{data.remark}}</div>
                    </div>
                </div>

                <div class="row cl">
                    <label class="form-label f-l col-2 ">随行车辆车牌号：</label>
                    <div class="formControls f-l col-10">
                        <div class="lh-30">{{data.car_no}}</div>
                    </div>
                </div>

                <div class="row cl">
                    <label class="form-label f-l col-2 ">被访人姓名：</label>
                    <div class="formControls f-l col-10">
                        <div class="lh-30">{{data.staff_name}}</div>
                    </div>
                </div>

                <div class="row cl">
                    <label class="form-label f-l col-2 ">被访人电话：</label>
                    <div class="formControls f-l col-10">
                        <div class="lh-30">{{data.staff_phone}}</div>
                    </div>
                </div>

            </form>
        </div>
        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
    </div>
    <div class="layui-layer-shade"></div>
</template>

<style lang="less" scoped rel="stylesheet/less">
    .layui-modify{
        width: 80%;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    let departmentOps = null;

    export default{
        ready () {
            base.verticalCenter('.layui-modify');
            this.getData();
        },
        props: ['data','rules'],
        data:function(){
            return {

            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            getData:function(){
                let that = this;
                $.ajax({
                    url:`${base.gAjaxUrl.visitRecords}${that.data.id}/`,
                    type:"GET",
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{

                    })
                })
            },
            isShowVisiting:function(item){
                for (let data of item.retinue){
                    if(data.extra && data.extra.visitrecord_duty_staff_cardnumber){
                        return true;
                    }
                }
                return false
            }

        },
        filters: {
        }
    }
</script>
