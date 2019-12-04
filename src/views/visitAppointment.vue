<template>
    <add v-if="showAdd" :item="currentItem" :type="dialogType" :title="dialogTitle" :end="defaultDueDate" @dialog-close="closeDialog" @dialog-save="addSave"></add>
    <visit-record v-if="showVisit" :item="currentItem" @dialog-close="closeVisit"></visit-record>
    <section class="Hui-article-box">
        <div class="page-container">
            <div class="panel panel-default radius">
                <div class="panel-body">
                    <span class="f-20 fw-b">访客管理</span>
                </div>
            </div>
            <div class="bk-gray radius mt-10 bgc-fff">
                <div class="pd-15 clearfix">
                    <span class=" f-l mr-10">
                        <select v-model="searchType" class="select f-l" style="width:100px;height:31px;margin-right: -1px;" @change="onSelectedStatus($event, item)">
                            <!--<option value="">全部</option>-->
                            <option value="real_name">姓名</option>
                            <option value="phone">电话</option>
                        </select>
                              <input  v-model="searchContent" type="text"   style="width:250px" class="f-l input-text">
                        <button v-on:click="getList(1)" class="btn btn-success" type="button"><i class="f-r Hui-iconfont">&#xe665;</i></button>
                    </span>

                    <div class="f-l clearfix lh-30 ml-30">
                        <span class="f-l">
                            是否自动为临时人员创建账号
                        </span>
                        <div class="f-l ">
                                <span class="open-box ml-5 " :class="{'bc-blue':isOpen}" @click="switchOpen(item)">
                                <span class="open-box-round" :class="isOpen?'open-box-open':'open-box-close'"></span>
                             </span>
                        </div>
                    </div>

                    <div class="f-r lh-30 clearfix mt-10-1300">
                        <button   class="btn btn-primary radius f-l mr-10" v-on:click="setUserTime()">设置账号时效</button>
                        <button   class="btn btn-primary radius f-l" v-on:click="addUser()">添加访客</button>
                    </div>
                </div>
                <table class="table table-border table-bg table-striped">
                    <thead class="text-c">
                    <tr>
                        <th class="pl-15">姓名</th>
                        <th>电话</th>
                        <th>访客单位/公司</th>
                        <!--<th>身份证号</th>-->
                        <th>账号状态</th>
                        <th>开始时间</th>
                        <th>到期时间</th>
                        <th>来访记录</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="text-c" v-for="item in items">
                        <td class="relative pl-15">{{item.real_name}}</td>
                        <td>{{item.phone}}</td>
                        <td>{{item.vistor_company}}</td>
                        <!--<td>{{item.id_card}}</td>-->
                        <td>
                             <span class="open-box ml-5 " :class="{'bc-blue':item.is_active}" @click="changeStatus(item)">
                                <span class="open-box-round" :class="item.is_active?'open-box-open':'open-box-close'"></span>
                             </span>
                        </td>
                        <td>{{item.effective_date ? item.effective_date : "--"}}</td>
                        <td>{{item.due_date ? item.due_date :"永久"}}</td>
                        <td>
                            <div><button   class="btn btn-primary radius" v-on:click="showVisitRecord(item)">查看来访记录</button></div>
                        </td>
                        <td>
                        <a title="编辑" href="javascript:;" v-on:click="clickModify(item)"><i class="Hui-iconfont">&#xe6df;</i></a>
                        <a title="删除" href="javascript:;" class="ml-5" v-on:click="deleteEmployee(item)"><i class="Hui-iconfont">&#xe6e2;</i></a>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div id="J-page" class="m-page" v-show="!noData"></div>
                <div class="no-data text-c" v-if="noData">没有相关数据</div>
                <div class="m-loading" v-if="itemsLoading">
                    <div class="cube1"></div>
                    <div class="cube2"></div>
                </div>
            </div>
        </div>
    </section>

    <!--设置时效的选择框-->
    <div v-show="false" id="timeSelect" class="form-horizontal">
        <div class="text-c hint">提示:输入0,有效期为永久</div>
        <div class="row cl">
            <label class="form-label f-l col-4 ">有效时长:&nbsp;</label>
            <div class="formControls f-l col-6">
                <input v-model="validTime" type="text" class="input-text">
            </div>
            <span class="f-l col-2 lh-30">天</span>
        </div>
        <button   class="btn btn-primary radius f-r mr-10 mt-20" v-on:click="confirmTime">确认</button>
    </div>

    <!--弹出选择时效的选择框-->
    <div v-show="false" id="timeChoiceDiv" class="form-horizontal">
        <div class="text-c hint">提示:输入0,有效期为永久</div>
        <div class="row cl">
            <label class="form-label f-l col-4 ">有效时长至:&nbsp;</label>
            <div class="formControls f-l col-6">
                <input v-model="defaultDueDate" type="text" class="input-text" id="timeInput">
            </div>
        </div>
        <button   class="btn btn-primary radius f-r mr-10 mt-20" v-on:click="staffActive">确认</button>
    </div>
</template>
<style lang="less" scoped>
    .bgc-f5{
        background-color: #f5f5f5;
    }
    .fw-b{
        font-weight: bold;
    }
    .btn.pd-4{
        padding: 4px;
    }
    .btn.fs-12{
        font-size: 12px;
    }
    .icon-sq{
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 3px;
        margin-right: 3px;
        margin-top: 10px;
    }
    .table th.pl-15,
    .table td.pl-15{
        padding-left: 15px;
    }
    .tableTags{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 10px;
        display: inline-block;
    }
    .no-data {
        line-height: 60px;
    }
    .hint{
        color:#999;
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import add from '../components/addVisitAppointment';
    import visitRecord from '../components/showVisitRecord'
    import moment from "moment";

    let itemsOps = null;

    export default{
        ready(){
            itemsOps = {
                param:{
                    page:1,
                    page_size:10,
                }
            };

            new Kalendae.Input('timeInput', {
                months: 1,
                clickHide: true
            });

            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-page',tpageToal,itemsOps.param.page,count)
            });

            this.getDueDate();

            this.getSwitchStatus();

        },
        data: function(){
            return{
                noData:false,
                itemsLoading:false,
                isShowDetailDialog:false,
                items: [],
                searchType:'real_name',
                searchContent:'',
                showAdd:false,
                dialogType:"add",
                dialogTitle :"添加临时人员",
                validTime:0,
                showVisit:false,
                defaultDueDate:"",
                currentItem:'',
                isOpen:false,
            }
        },
        methods: {
            //初始化分页
            initPage:function(obj,tpageToal='4',current='1',count='0'){
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:current,
                    count:count,
                    callback:(p)=>{
                        itemsOps.param.page = p;
                        this.queryAjax();
                    }
                });
            },
            getList:function(reset=0){
                let that = this;
                //重置第一页
                if(reset){
                    this.searchInput = $("#searchInput").val();
                    itemsOps.param.page = 1
                }

                this.queryAjax((tpageToal='4',count='0')=>{
                    that.initPage('#J-page',tpageToal,itemsOps.param.page,count)
                });
            },
            queryAjax:function(callback=function(){}){
                let data = {
                    page:itemsOps.param.page,
                    page_size: itemsOps.param.page_size,
                }
                //修改参数
                this.itemsLoading = true;
                console.log("this.searchContent");
                console.log(this.searchContent);
                this.searchContent ? data[this.searchType] = this.searchContent:'';
                $.ajax({
                    url: base.gAjaxUrl.visitorList,
                    type: 'GET',
                    data:data
                })
                    .always((data)=>{
                        this.itemsLoading = false;
                        base.ajaxCallback(data,()=>{
                            let resultData = data.results;
                            this.items = resultData;
                            if(resultData && resultData.length){
                                this.noData = false;
                                //回调
                                callback(data.num_pages,data.count);
                            }else{
                                this.noData = true;
                            }
                        });
                    })
            },
            closeDialog:function(){
                this.showAdd = false;
            },
            addUser:function(){
                this.showAdd = true;
                this.dialogType = 'add';
                this.dialogTitle = '添加临时人员';

            },
            setUserTime:function(){
                layer.open({
                    title:"默认临时账号有效时长",
                    type: 1,
                    // skin: 'layui-layer-rim', //加上边框
                    area: ['320px', '220px'], //宽高
                    content: $("#timeSelect")
                });

            },
            confirmTime:function(){
                let that = this;

                if(/[a-zA-Z\u4e00-\u9fa5/\.\~|`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g.test(this.validTime) || this.validTime < 0 ){
                    layer.msg("请输入正确的正整型数字",{icon:2,time:1500});
                    return;
                }

                this.itemsLoading = true;

                $.ajax({
                    url:base.gAjaxUrl.accountTime,
                    type:'POST',
                    contentType:"application/json",
                    data:JSON.stringify({days:that.validTime,})
                }).always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
                        layer.msg("保存成功",{icon:1,time:1500});
                        this.validTime = data.days
                    })
                })
              layer.closeAll();
            },
            getDueDate:function(){
                $.ajax({
                    url:base.gAjaxUrl.accountTime,
                    type:'GET',
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
                        this.validTime = data.days;
                    })
                })
            },
            addSave:function(){
                this.showAdd = false;
                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-page',tpageToal,itemsOps.param.page,count)
                });
            },
            changeStatus:function(data){
                let that = this;
                this.currentItem = data;
                if(!data.is_active){
                    layer.open({
                        title:"账号有效时长",
                        type: 1,
                        area: ['420px', '210px'], //宽高
                        content: $("#timeChoiceDiv"),
                    });
                }else{
                    layer.confirm(`停用后该临时账号将无法登录员工端,确认停用${data.real_name}?`,function(){
                        $.ajax({
                            url:`${base.gAjaxUrl.visitorList}${data.id}`,
                            type:"PATCH",
                            data:{
                                is_active:false,
                            }
                        }).always((data)=>{
                            base.ajaxCallback(data,()=>{
                                that.queryAjax((tpageToal='4',count='0')=>{
                                    that.initPage('#J-page',tpageToal,itemsOps.param.page,count)
                                });
                            })
                        })
                        layer.closeAll();
                    })
                }

            },
            showVisitRecord:function(item){
                this.showVisit = true;
                this.currentItem = item;

            },
            closeVisit:function(){
                this.showVisit = false;
            },
            staffActive:function(){
                if(moment(this.defaultDueDate).isBefore(this.currentItem.effective_date) && this.defaultDueDate != 0 ){
                    layer.msg("结束时间不能早于开始时间",{icon:2,time:2000});
                    return;
                }
                let that = this;
                $.ajax({
                    url:`${base.gAjaxUrl.visitorList}${that.currentItem.id}`,
                    type:"PATCH",
                    contentType:"application/json",
                    data:JSON.stringify({
                        is_active:true,
                        due_date:that.defaultDueDate
                    })
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
                        this.queryAjax((tpageToal='4',count='0')=>{
                            this.initPage('#J-page',tpageToal,itemsOps.param.page,count)
                        });
                    })
                })
                layer.closeAll();
            },
            deleteEmployee:function(item){
                let that = this;
                layer.confirm(`确认删除${item.real_name}吗?`,()=>{
                    that.itemsLoading = true;
                    $.ajax({
                        url:`${base.gAjaxUrl.visitorList}${item.id}/`,
                        type:"DELETE",
                        success:function(){
                            if(that.items.length == 1 && itemsOps.param.page != 1){
                                itemsOps.param.page--;
                            }

                            that.queryAjax((tpageToal='4',count='0')=>{
                                that.initPage('#J-page',tpageToal,itemsOps.param.page,count)
                            });
                        }
                    }).always((data)=>{
                        that.itemsLoading = false;
                    })
                    layer.closeAll();
                })
            },
            clickModify:function(item){
                this.showAdd = true;
                this.currentItem = item;
                this.dialogType = 'modify';
                this.dialogTitle = '编辑临时人员';
            },
            switchOpen:function(){
                let that = this;
                let typeStr = this.isOpen ? "关闭" : "开启";
                layer.confirm(`确认${typeStr}自动为临时人员创建账号的开关吗?`,()=>{
                    that.itemsLoading = true;
                    $.ajax({
                        url:base.gAjaxUrl.accountForbidden,
                        type:"POST",
                        contentType:"application/json",
                        data:JSON.stringify({allow:that.isOpen?0:1})
                    }).always((data)=>{
                        that.itemsLoading = false;
                        base.ajaxCallback(data,()=>{
                            layer.msg("提交成功",{icon:1,time:1500});
                            that.getSwitchStatus();
                        })
                    })
                    layer.closeAll();
                })
            },

            getSwitchStatus:function(){
                $.ajax({
                    url:base.gAjaxUrl.accountForbidden,
                    type:"GET",
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
                      this.isOpen = data.allow;
                    })
                })
            }


        },
        components: {
            add:add,
            visitRecord:visitRecord,
        },
        filters: {

        }
    }
</script>
