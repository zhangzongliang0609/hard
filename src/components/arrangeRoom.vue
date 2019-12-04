<template>
    <slot-window v-if="showWindow" :title="windowTitle" @dialog-close="closeWindow">
        <div v-if="parent=='apply'">
            <p class="text-c">
                确定要安排 {{data.staff_vo.real_name}} 入住 {{windowData.building_name}} {{windowData.room_no}}吗?
            </p>
            <div class="text-c mt-25">
                <label for="lockRoom">是否锁定该房间</label>
                <input type="checkbox" id="lockRoom">
            </div>
            <a class="btn btn-primary radius mr-20 fs-12 mt-40 f-r" title="确定" href="javascript:;" v-on:click="confirmCheckin(item)">确定</a>
        </div>
      <div v-if="parent=='arrange'">
          <div class="cl window-box text-c">
              <div >
                  <!--确定要安排 {{selectStaff.real_name}} 入住 {{windowData.building_name}} {{windowData.room_no}}吗?,-->
              </div>
              <div class="mt-10">
                  <span>押金金额:</span>
                  <input type="text" id="price" class="input-text">
              </div>
              <div class="mt-10">
                  <span>押金单号:</span>
                  <input type="text" id="priceNumber" class="input-text">
              </div>
              <div class="text-c mt10">
                  <input type="checkbox" id="lockRoom"> 是否锁定该房间
              </div>
          </div>
          <a class="btn btn-primary radius f-r mr-10 mb-10 mt-20" @click="confirmSet()"   href="javascript:;" >确定</a>
      </div>
    </slot-window>
<div class="layui-layer layui-anim layui-layer-page layui-modify zIndex-103 room-box">
    <div class="layui-layer-title">{{title}}</div>
    <div class="layui-layer-content bgc-f5">
        <div class="pd-10">
            <div v-if="parent == 'apply'" class="panel panel-default radius">
                <div class="panel-body">
                    <i class="Hui-iconfont fc-206afc">&#xe619;</i>
                    <span class="mr-15">申请人:&nbsp;{{data.staff_vo.real_name}}</span>
                    <span class="mr-15">手机号:&nbsp;{{data.staff_vo.phone}}</span>
                    <span class="mr-15">部门/职位/学历:&nbsp;{{data.staff_vo.department_vo.department_name}}/{{data.staff_vo.position?data.staff_vo.position:'--'}}/{{data.staff_vo.education?data.staff_vo.education:'--'}}</span>
                    <span class="mr-15">员工分组:&nbsp;
                        <span class="staff-tag text-c pr-5 pl-5 mr-5" v-for="item in data.staff_vo.tags">{{item.name}}</span>
                    </span>
                    <!--<span class="mr-15">员工标签:&nbsp;-->
                        <!--<span class="staff-tag text-c pr-5 pl-5 mr-5" v-for="item in data.tags">{{item.name}}</span>-->
                    <!--</span>-->
                    <span class="mr-15">工号:&nbsp;{{data.staff_vo.job_number?data.staff_vo.job_number:'无'}}</span>
                    <span class="mr-15">备注:&nbsp;{{data.remark?data.remark:'--'}}</span>
                    <span class="mr-15">审批人:&nbsp;<span v-for="item in data.approvalinfo_set">{{item.approver_vo.real_name}}<span v-show="$index < data.approvalinfo_set.length-1">/</span></span></span>
                    <span class="mr-15">申请的宿舍楼:&nbsp;<span class="fc-206afc">{{data.booking_building_vo.building_name?data.booking_building_vo.building_name:"--"}}</span></span>
                    <span class="mr-15">申请的房间类型:&nbsp;<span class="fc-206afc">{{data.room_type_vo?data.room_type_vo.type_name:"--"}}</span></span>
                </div>
            </div>
            <div v-if="parent == 'arrange'" class="panel panel-default radius">
                <div class="panel-body">
                    <i class="Hui-iconfont fc-206afc">&#xe619;</i>
                    <span class="mr-15">员工名称:&nbsp;{{data.real_name}}</span>
                    <span class="mr-15">手机号:&nbsp;{{data.phone}}</span>
                    <span class="mr-15">部门/职位/学历:&nbsp;{{data.department_vo.department_name}}/{{data.position?data.position:'--'}}/{{data.education?data.education:'--'}}</span>
                    <span class="mr-15">员工分组:&nbsp;
                        <span class="staff-tag text-c pr-5 pl-5 mr-5" v-for="item in data.tags">{{item.name}}</span>
                    </span>
                    <span class="mr-15">工号:&nbsp;{{data.job_number?data.job_number:'无'}}</span>
                </div>
            </div>
            <div class="panel radius bgc-e5">
                <div class="panel-body">
                    <div class="clearfix">
                        <span class="f-18 fw-b mr-10">{{buildingName}}</span>
                        <span class="f-r btn radius full mr-5 cursor-d" @click="getList(1)">满房：{{currBuilding.room_info?currBuilding.room_info.full_cnt:0}}间</span>
                        <span class="f-r btn radius mr-5 notfull cursor-d" @click="getList(2)">未满：{{currBuilding.room_info?currBuilding.room_info.not_full_cnt:0}}间</span>
                        <span class="f-r btn radius mr-5 null-room cursor-d" @click="getList(3)">空房：{{currBuilding.room_info?currBuilding.room_info.empty_cnt:0}}间</span>
                        <span class="f-r btn radius mr-5 btn-success cursor-d" @click="getList(0)">全部：{{currBuilding.room_info?currBuilding.room_info.all_cnt:0}}间</span>
                    </div>
                    <div>
                        <span class="type" v-for="item in currBuilding.type_info"><i class="Hui-iconfont">&#xe619;</i>{{item.type_name}}：{{item.cnt}}间</span>
                    </div>
                </div>
            </div>
            <div class="mt-10 clearfix">
                <div class="materialclasses bgc-fff f-l">
                    <ul>
                        <li class="item" v-bind:class="[itemIndex==-1?'curr':'']" v-on:click="clickItem('all')">
                            <span class="text-c fw-b name">全部</span>
                        </li>
                        <li class="item" v-for="item in buildings" v-bind:class="[item.index==itemIndex?'curr':'']" v-on:click="clickItem(item)">
                            <span class="text-c fw-b name">{{item.building_name}}</span>
                        </li>
                    </ul>
                </div>
                <div class="materials">
                    <ul class="clear">
                        <li class="roomItem choiceRoom" v-for="item in items" v-bind:class="[item.staff_num==0?'null-room':(item.is_full?'full':'notfull')]" v-on:click="setRoom(item)">
                            <div>
                                <div class="text-c">{{item.building_name}}</div>
                                <div class="text-c">{{item.room_no}}</div>
                                <div class="text-c">{{item.room_type_name}}({{item.content}}人)</div>
                                <div class="">已住：{{item.staff_num}}人
                                    <img class="w-20 cursor-p ml-10" v-bind:src="item.is_locking?'./src/assets/images/lock_close.png':'./src/assets/images/lock_open.png'" v-on:click.stop="toggleLock(item)">
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div id="M-page" class="m-page" v-show="!noData"></div>

                    <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
                </div>
            </div>
        </div>

    </div>
    <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
</div>
<div class="layui-layer-shade zIndex-102"></div>
    <div class="m-loading" v-if="isLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>
<style lang="less" scoped>
    .window-box{
        .input-text{
            width: 150px;
        }
    }
    .room-box{
        width: 1100px;
        left: 40%;
    }
    .materialclasses{
        width: 198px;
        border: 1px solid #eee;
        overflow: auto;
    }
    .materialclasses ul{
        max-height: 411px;
        overflow: auto;
    }
    .materialclasses .item{
        padding: 4px 10px;
        border-bottom: 1px solid #eee;
        text-align: left;
        cursor: pointer;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow:hidden;
    }
    .materialclasses .item.curr{
      background-color: #e5e5e5;
    }
    .materialclasses .item.curr .name{
        color: #206afc
    }
    .materials{
        /*padding-left: 200px; */
        overflow:hidden;
        padding-left: 10px;
    }
    .type{
        position: relative;
        padding-left: 14px;
        margin-right: 10px;
    }
    .type i{
        color: #c9d1d9;
        position: absolute;
        top: 1px;
        left: 0;
        font-size: 10px;
    }
    .roomItem{
        border: 1px solid #eee;
        float: left;
        display: block;
        width: 160px;
        height: 130px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        border: 1px solid #eee;
    }
    .full{
        background-color: #ff3b6a !important;
        color: #fff;
    }
    .notfull{
        background-color: #5bacfd !important;
        color: #fff;
    }
    .null-room{
        background: #d2d2d2;;
    }
    .roomItem.choiceRoom.full{
        cursor: not-allowed;
    }
    .roomItem.choiceRoom.bgc-fff,
    .roomItem.choiceRoom.notfull{
        cursor: pointer;
    }
    .m-page{
        display:inline-block ;
        width: 900px;
    }
    .lock{
        color: red;
    }
    .no-lock{
        color: black;
    }
    .staff-tag{
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
    import slotWindow from '../components/slotWindow.vue';

    let staffsOps = null;

    export default{
        ready(){
            console.log("this.data");
            console.log(this.data);
            let that = this;
            this.isLoading = true;
            staffsOps = {
                param:{
                    page:1,
                    page_size:10,
                }
            };
            this.getBuildingsList();
        },
        props: ['title','type','data','parent'],
        data: function(){
            return{
                noData:false,
                isLoading:false,
                itemIndex: -1,
                currBuilding: {},
                items: [],
                buildings: [],
                buildingsId: '',
                buildingName: '全部',
                roomArr:[],
                showWindow:false,
                windowData:'',
                windowTitle:"安排房间",
                currentType:'',
            }
        },
        methods: {
              initPage:function(obj,tpageToal='4',current='1',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:current,
                    count:count,
                    callback:(p)=>{
                        staffsOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            close:function(){
                this.$dispatch('dialog-close');
            },
            clickItem:function(item){
                  if(item === 'all'){
                      this.itemIndex = -1;
                      this.buildingsId = '';
                      this.buildingName = "全部";
                  }else{
                      this.itemIndex = item.index;
                      this.buildingsId = item.id;
                      this.buildingName = item.building_name;
                  }

                this.getList();
                this.getBuildingsMessage();
            },
            setRoom:function(item){
                if(item.is_locking){
                    layer.msg("该房间已锁定,如需要安排人员入住,请先解除锁定",{icon:2,time:2000});
                    return
                }
                if(item.is_full){
                    layer.msg("该房间已住满人,无法再安排人员入住",{icon:2,time:2000});
                    return
                }
                this.showWindow = true;
                this.windowData = item;
            },
            confirmSet:function () {
                  let that = this;
                let price = $("#price").val();
                let priceNumber = $("#priceNumber").val();
                if(!/^\d+(?:\.\d{1,2})?$/.test(price) && price){
                    layer.msg("押金金额必须是数字而且最多两位小数",{icon:2,time:1500});
                    return
                }
                this.isLoading = true;
                  let ajaxAddData = {
                      building:that.buildingsId,
                      room:that.windowData.id,
                      deposit:price,
                      deposit_no:priceNumber,
                  }
                if(!this.windowData.is_full && that.parent == 'apply'){
                    $.ajax({
                        url: `${base.gAjaxUrl.applysettleorders}${that.data.id}/room/`,
                        type:'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(ajaxAddData),
                    })
                        .always(function(data) {
                            that.isLoading = false;
                            base.ajaxCallback(data,function(){
                                layer.msg('提交成功',{icon:1,time:1000});
                                that.showWindow = false;
                            });
                        });
                }else if(that.parent == 'arrange'){
                    $.ajax({
                        url: `${base.gAjaxUrl.rooms}${that.windowData.id}/staffs/`,
                        type:'POST',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            staff: that.data.id,
                            deposit:price,
                            deposit_no:priceNumber,
                        }),
                    })
                        .always(function(data) {
                            that.isLoading = false;
                            base.ajaxCallback(data,function(){
                                that.showWindow = false;
                                that.roomLocking();
                            });
                        });
                }

            },
            closeWindow:function () {
                this.showWindow = false;
            },
            //获取宿舍列表
            getList:function(type){
                let that = this;
                if(type){
                    staffsOps.param.page = 1;
                }
                 this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#M-page',tpageToal,staffsOps.param.page,count)
                },type);

            },
            queryAjax:function(callback=function(){},type){
                //修改参数
                let that = this;
                this.isLoading = true;
                $.ajax({
                    url: `${base.gAjaxUrl.rooms}occupancy_info/`,
                    type: 'GET',
                    data: {
                        page:staffsOps.param.page,
                        page_size:staffsOps.param.page_size,
                        building:that.buildingsId,
                        status:type,
                    }
                })
                .always((data)=>{
                    base.ajaxCallback(data,()=>{
                        this.isLoading = false;
                        let resultData = data.results;
                        this.items = resultData;
                        this.roomArr = resultData;
                        if(resultData && resultData.length != 0){
                            this.noData = false;
                            //回调
                            callback(data.num_pages,data.count);
                        }else{
                            this.noData = true;
                        }
                    });
                })
            },
            //获取宿舍楼列表
            getBuildingsList:function(callback=function(){}){
                $.ajax({
                    url: base.gAjaxUrl.buildings,
                    type: 'GET',
                })
                .always((data)=>{
                    base.ajaxCallback(data,()=>{
                        this.isLoading = false;
                        let resultData = data.results;
                        for(let i=0; i<resultData.length; i++){
                            resultData[i].index = i;
                        }
                        this.buildings = resultData;

                        // this.buildingsId = resultData[0].id;
                        // this.buildingName = resultData[0].building_name;
                        // this.currBuilding = resultData[0];
                        if(resultData && resultData.length){
                            this.noData = false;
                            //回调
                            //callback();
                            this.getList();
                            this.getBuildingsMessage();
                        }else{
                            this.noData = true;
                        }
                    });
                })
            },
            getBuildingsMessage:function(){
                  let that = this;
                $.ajax({
                    url: `${base.gAjaxUrl.rooms}rooms_stat/`,
                    type: 'GET',
                    data:{
                        building:that.buildingsId,
                    }
                })
                .always((data)=>{
                    base.ajaxCallback(data,()=>{
                        this.isLoading = false;
                        let resultData = data;
                        console.log("data");
                        console.log(resultData);
                        this.currBuilding = resultData;
                    });
                })
            },
            // 锁定/解锁房间
            toggleLock:function(room){
                let that = this;
                if(room.is_locking){
                    layer.confirm(`房间解锁之后可以分配人员入住,确定解锁${room.room_no}这个房间吗？`,function(){
                        $.ajax({
                            url:`${base.gAjaxUrl.rooms}${room.id}`,
                            type:"PUT",
                            contentType:'application/json',
                            data:JSON.stringify({
                                room_no:room.room_no,
                                building:room.building,
                                room_type:room.room_type,
                                is_locking:false,
                            })
                        }).always((data)=>{
                            base.ajaxCallback(data,()=>{
                                that.getList();
                            })
                        })
                        layer.closeAll("dialog");
                    })
                }else{
                    layer.confirm(`房间锁定之后将不能分配人员入住,确定锁定${room.room_no}这个房间吗？`,function(){
                        $.ajax({
                            url:`${base.gAjaxUrl.rooms}${room.id}`,
                            type:"PUT",
                            contentType:'application/json',
                            data:JSON.stringify({
                                room_no:room.room_no,
                                building:room.building,
                                room_type:room.room_type,
                                is_locking:true,
                            })
                        }).always((data)=>{
                            base.ajaxCallback(data,()=>{
                                that.getList();
                            })
                        })
                        layer.closeAll("dialog");
                    })
                }
            },
            confirmCheckin:function () {
                this.isLoading = true;
                let that = this;
                    $.ajax({
                        url: `${base.gAjaxUrl.applysettleorders}${that.data.id}/room/`,
                        type: 'POST',
                        data:{
                            room:that.windowData.id,
                        }
                    }).always((data)=>{
                            this.isLoading = false;
                            base.ajaxCallback(data,()=>{
                                layer.msg('提交成功',{icon:1,time:1000});
                                that.showWindow = false;
                                that.$dispatch("dialog-save")
                                that.roomLocking();
                                // this.getBuildingsMessage();
                            });
                        })
            },
            roomLocking:function () {
                let that = this;
                let isLock = $("#lockRoom").is(':checked');
                if(isLock){
                    $.ajax({
                        url:`${base.gAjaxUrl.rooms}${that.windowData.id}/`,
                        type:"PUT",
                        data:{
                            room_no:that.windowData.room_no,
                            building:that.windowData.building,
                            room_type:that.windowData.room_type,
                            is_locking:true,
                        }
                    }).always((data)=>{
                        base.ajaxCallback(data,()=>{
                            that.getList();
                        })
                    })
                }else{
                    that.getList();
                }
            }
        },
        components: {
            slotWindow:slotWindow,
        }
    }
</script>
