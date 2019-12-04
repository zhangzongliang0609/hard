<template>
<div class="layui-layer layui-anim layui-layer-page layui-modify">
    <div class="layui-layer-title">{{title}}</div>
    <div class="layui-layer-content pd-10">
        <div class="">
            <div class="roomTitle">
                <img src="../assets/images/icon-room.png" height="atuo" width="32" alt="" class="mr-10 roomIcon">
                <span class="mr-10 f-20 roomNo">{{data.room_no}}房</span>
                <span class="mr-10">{{data.building_name}}</span>
            </div>
            <div class="mt-5 fc-999">
                <span class="mr-10">{{data.room_type_name}}({{data.content}}人)</span>
                <span class="mr-10">已入住：{{data.staff_num}}人</span>
                <span class="mr-10">房间配置:
                    <span v-for="item in data.equipments">{{item.equipment_name}}{{$index != data.equipments.length - 1 ? '/' : ''}}</span>
                </span>
                    <span class="mr-10">房间分组:
                        <span v-if="data.tags.length">
                            <span v-for="tag in data.tags">{{tag.name}}
                                <span v-show="$index != data.tags.length - 1">/</span>
                            </span>
                        </span>
                        <span v-else>无</span>
                    </span>
                <!--<span class="mr-10">空调：{{data.room_type_vo.has_TV?'有':'无'}}</span>-->
                <!--<span class="mr-10">电视：{{data.room_type_vo.has_air_conditioning?'有':'无'}}</span>-->
                <!--<span class="mr-10">电脑：{{data.room_type_vo.has_computer?'有':'无'}}</span>-->
            </div>
        </div>
        <table class="fixedParent table table-border table-bg table-striped mt-10 bor-l bor-r">
            <thead class="text-c">
                <tr>
                    <th>床号</th>
                    <th>姓名/性别</th>
                    <th>部门/职位</th>
                    <th>工号</th>
                    <th>电话</th>
                    <th class="max-200">分组</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody class="text-c">
                <tr v-for="item in items">
                    <td>{{$index+1}}</td>
                    <td>{{item.real_name}}/{{item.sex==1?'男':'女'}}</td>
                    <td>{{item.department_vo.department_name}}/{{item.position}}</td>
                    <td>{{item.job_number}}</td>
                    <td>{{item.phone}}</td>
                    <td class="max-200">
                        <span v-if="item.tags.length">
                            <span v-for="tag in item.tags">{{tag.name}}{{$index != item.tags.length - 1 ? '/' : ''}}</span>
                        </span>
                        <span v-else>--</span>
                    </td>
                    <td>
                        <a href="javascript:;" title="退房" v-on:click="clickCheckout(item)">
                            <img src="../assets/images/icon-tui.png" height="20" width="20" alt="" />
                        </a>
                    </td>
                </tr>
                <tr v-for="item in notfullItemsLength" v-if="this.data.content != this.data.staff_num">
                    <td>{{$index+1+data.staff_num}}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                        <a href="javascript:;" title="添加" v-on:click="clickAdd(item)"><img src="../assets/images/icon-add.png" height="20" width="20" alt=""></a>
                    </td>
                </tr>
            </tbody>

        </table>
    </div>
    <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
    <!-- <div class="layui-layer-btn" v-on:click="save"><a class="layui-layer-btn0" v-if="type!='check'">保存</a></div> -->
</div>
<div class="layui-layer-shade"></div>
    <div class="m-loading" v-if="isLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
    <!-- 添加 -->
    <add :title="dialogTitle" :type="dialogType" :data="data" v-if="isShowAddDialog" v-on:dialog-close="addDialogClose" v-on:dialog-save="addDialogSave"></add>
</template>

<style lang="less" scoped>
    .max-200 {
        max-width: 200px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .max-200:hover {
        white-space: normal;
    }
    .roomTitle{
        position: relative;
        padding-left: 36px;
    }
    .roomIcon{
        position: absolute;
        top: 0px;
        left: 0;
    }
    .roomNo{
        color:#206afc;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import add from "../components/setRoomStaff.vue";

    export default{
        ready () {
            let that = this;
            let ajaxUrl = '';
            let ajaxType = '';
            let getData = this.data;
            base.verticalCenter('.layui-modify');
            this.getList(getData.id);
            this.notfullItemsLength = this.data.content - this.data.staff_num;
            this.notfullItemsLength = this.notfullItemsLength >= 0 ? this.notfullItemsLength : 0;
        },
        props: ['title','type','data','buildingid'],
        data:function(){
            return {
                isLoading: false,
                isShowAddDialog: false,
                items: [],
                notfullItemsLength: 0,
                dialogType:'add',
                dialogTitle:'选择入住员工',
                dialogData:{},
                equipments:[],
            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            addDialogClose:function(data){
                this.isShowAddDialog = false;
            },
            addDialogSave:function(){
                this.isShowAddDialog = false;
                this.getList(this.data.id);
                this.getRoomsMessage(this.data.id);
            },
            clickAdd:function(){
                console.log(this.data);
                if(this.data.is_locking){
                    layer.msg("该房间已锁定,如需要安排人员入住,请先解除锁定",{icon:2,time:2000});
                    return
                }
                this.dialogType='add';
                this.dialogTitle='添加宿舍人员';
                this.isShowAddDialog = true;
            },
            clickCheckout:function(item){
                let that = this;
                layer.confirm(
                    `确认${item.real_name}从${this.data.building_name}${this.data.room_no}退宿吗?
                       <br>
                     押金金额:&nbsp;${item.deposit?item.deposit:0}
                       <br>
                     押金票号:&nbsp;${item.deposit_no?item.deposit_no:'无'}`,
                    (index)=>{
                        that.isLoading = true;
                        layer.closeAll("dialog");
                        let ajaxData = {
                            staff: item.id
                        }
                        $.ajax({
                            url: `${base.gAjaxUrl.rooms}${that.data.id}/checkout/`,
                            contentType: 'application/json',
                            type: 'POST',
                            data: JSON.stringify(ajaxData)
                        })
                        .always((data)=>{
                            base.ajaxCallback(data,()=>{
                                layer.msg('退房成功',{icon:1,time:1000});
                                that.getList(that.data.id);
                                that.getRoomsMessage(that.data.id);
                            })
                        })
                    }
                );
            },
            //获取房间所住员工列表
            getList:function(id){
                let that = this;
                this.isLoading = true;

                $.ajax({
                    url: `${base.gAjaxUrl.rooms}${id}/staffs/`,
                    type: 'GET',
                })
                .always((data)=>{
                    this.isLoading = false;
                    base.ajaxCallback(data,()=>{
                        this.items = data;
                        console.log("this.items");
                        console.log(this.items);
                    });
                })
            },
            getRoomsMessage:function(id){
                let that = this;
                $.ajax({
                    url: `${base.gAjaxUrl.rooms}${id}/`,
                    type: 'GET',
                })
                .always((data)=>{
                    that.isLoading = false;
                    base.ajaxCallback(data,()=>{
                        let resultData = data;
                        console.log("resultsData: ");
                        console.log(resultData);
                        // that.data = resultData;
                        that.data.staff_num = resultData.occupancy_number;
                        that.data.is_locking = resultData.is_locking;
                        that.notfullItemsLength = resultData.room_type_vo.content - resultData.occupancy_number;
                        that.notfullItemsLength = that.notfullItemsLength >= 0 ? that.notfullItemsLength : 0;
                    });
                })
            },
            // getRoomTotal:function (id) {
            //     $.ajax({
            //         url:`${base.gAjaxUrl.rooms}${id}`,
            //         type:"GET",
            //     }).always((data)=>{
            //         base.ajaxCallback(data,()=>{
            //             this.equipments = data.results;
            //         })
            //     })
            // }
        },
        components:{
            add,
        }
    }
</script>
