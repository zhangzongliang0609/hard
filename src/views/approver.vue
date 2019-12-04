<template>

    <!-- 添加 -->
    <add :title="dialogTitle" :type="dialogType" :data="dialogData" v-if="isShowAddDialog" v-on:dialog-close="addDialogClose" v-on:dialog-save="addDialogSave"></add>
    <!-- 导入 -->
    <imoprt-data v-if="isShowImportDialog" v-on:dialog-close="importDialogClose" v-on:dialog-save="importDialogSave"></imoprt-data>
    <section class="Hui-article-box">
    <div class="page-container">
        <div class="text-l clearfix">
            <input id="searchInput"  type="text"  placeholder="姓名/工号/电话/部门/职位" style="width:250px" class="f-l input-text">
            <button v-on:click="getList(1)" class="btn btn-success" type="button"><i class="f-r Hui-iconfont">&#xe665;</i></button>
        </div>
        <div class="cl pd-5 bg-1 bk-gray mt-20">
            <span class="l">
                <a id="approverPeople" class="btn btn-primary radius mr-5" href="javascript:;" v-on:click="clickAdd()"><i class="Hui-iconfont">&#xe600;</i> 添加审批人
                </a>
                <a id="operation"  class="btn default-color btn-default btn-link size-M  size-M-reset radius"  v-on:click="operationTips(operation)">?</a>
            </span>
        </div>
        <table class="table table-border table-bordered table-hover table-bg table-sort">
            <thead>
                <tr class="text-c">
                    <!-- <th width="25"><input type="checkbox" value="" name=""></th> -->
                    <th width="50">头像</th>
                    <th width="100">姓名/性别</th>
                    <th >部门/职位</th>
                    <th width="70">工号</th>
                    <th width="150">电话</th>
                    <th>审批部门</th>
                    <th width="70">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr class="text-c" v-for="item in items">
                    <!-- <td><input type="checkbox" value="" name="">{{item.avatar}}</td> -->
                    <td><img class="avatar" v-bind:src="item.staff_vo.avatar?item.avatar:'./src/assets/images/avatar-default.jpg'"/></td>
                    <td>{{item.staff_vo.real_name}}/{{item.staff_vo.sex == 1 ? '男':'女'}}</td>
                    <td>{{item.staff_vo.department_vo.department_name}}/{{item.staff_vo.position}}</td>
                    <td>{{item.staff_vo.job_number}}</td>
                    <td>{{item.staff_vo.phone}}</td>
                    <td>{{item.department_vo?item.department_vo.department_name:'全部'}}</td>
                    <td class="f-14">
                        <a title="删除" href="javascript:;" class="ml-5" v-on:click="deleteBtn(item.id)"><i class="Hui-iconfont">&#xe6e2;</i></a>
                    </td>
                </tr>
            </tbody>
        </table>
        <div id="J-page" class="m-page" v-show="!noData"></div>
        <div class="no-data text-c mt-50" v-if="noData">没有相关数据</div>
        <div class="m-loading" v-if="itemsLoading">
            <div class="cube1"></div>
            <div class="cube2"></div>
        </div>
    </div>
    </section>
</template>

<style lang="less" rel="stylesheet/less">
.avatar{
    width: 50px;
}
a.btn.size-M-reset {
    padding: 4px 8px 10px 8px;
}
</style>

<script type="text/ecmascript-6">
import * as base from '../assets/js/base.js';
import add from "../components/addApprover.vue";

    let staffsOps = null;

    export default{
        ready () {

            let that = this;
            staffsOps = {
                param:{
                    search:'',
                    page:1,
                    page_size:10,
                }
            };
            this.init();
            this.queryAjax((tpageToal='4',count='0')=>{
                this.initPage('#J-page',tpageToal,staffsOps.param.page,count)
            });
        },
        data:function(){
            return {
                noData:false,
                itemsLoading:false, 
                isShowAddDialog:false,
                isShowImportDialog:false,
                items: [],
                searchInput:'',
                dialogTitle:'添加部门',
                dialogType:'add',
                dialogData:''
            }
        },
        methods: {
            init: function(){
                // 该函数是用来判断是否是第一次进入该新功能或页面
                // console.log(localStorage);     

                //判断是否是第一次进入该新功能或页面从而弹出新功能的提示

                if(localStorage.approverPromptFlag == 'true'){
                    let arrObj = [$('#approverPeople'),$('#searchInput'),];
                    let arrTitle = ['先点击这里添加要添加的审批人','审批人过多时可以在这里搜索'];
                    var promptTypes = ['approverPromptFlag',];
                    $.guidance({
                        obj:arrObj,
                        title:arrTitle,
                        flag:promptTypes,
                    });
                }

            },
            operationTips: function(id){
                // layer.tips(' 如果没有添加审批人，在公务车员工端就无法添加审批人，也没法提交公务车申请。', '#operation', {
                //   tips: [1, '#0FA6D8'],
                //   time: 7000
                // });
                //捕获页
               /* layer.open({
                  type: 1,
                  shade: false,
                  title: false, //不显示标题
                  content: $('.layer_notice'), //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
                  cancel: function(){
                    layer.msg('捕获就是从页面已经存在的元素上，包裹layer的结构', {time: 5000, icon:6});
                  }
                });*/
                //墨绿深蓝风
                layer.alert('如果没有添加审批人，在公务车员工端就无法添加审批人，也没法提交公务车申请。', {
                  skin: 'layui-layer-lan' //样式类名
                  ,closeBtn: 0
                }, /*function(){
                  // layer.alert('偶吧深蓝style', {
                  //   skin: 'layui-layer-lan'
                  //   ,closeBtn: 0
                  //   ,anim: 4 //动画类型
                  // });
                }*/);
            },
            addDialogClose:function(data){
                this.isShowAddDialog = false;
            },
            addDialogSave:function(data){
                this.isShowAddDialog = false;
                this.getList();
            },
            clickAdd:function(){
                this.dialogType='add';
                this.dialogTitle='添加审批人';
                this.isShowAddDialog = true;
            },
            clickModify:function(data){
                this.dialogTitle='修改资料';
                this.dialogType='modify';
                this.dialogData=data;
                this.isShowAddDialog = true;
            },
            //初始化分页
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
            queryAjax:function(callback=function(){}){
                this.itemsLoading = true;
                //修改参数
                staffsOps.param.search = this.searchInput;
                staffsOps.param.approver_type = 1;

                $.ajax({
                    url: base.gAjaxUrl.approvers,
                    type: 'GET',
                    data:staffsOps.param
                })
                .always((data)=>{
                    base.ajaxCallback(data,()=>{
                        let resultData = data.results;
                        this.itemsLoading = false, 
                        this.items = resultData;
                        if(resultData.length){
                            this.noData = false;
                            //回调
                            callback(data.num_pages,data.count);
                        }else{
                            this.noData = true;
                        }
                    });
                })
            },
            //获取列表
            getList:function(reset=0){
                //重置第一页
                // staffsOps.param.page = 1
                if(reset){
                    this.searchInput= $("#searchInput").val();
                    staffsOps.param.page = 1
                }

                this.queryAjax((tpageToal='4',count='0')=>{
                    this.initPage('#J-page',tpageToal,staffsOps.param.page,count)
                });
            },
            //删除
            deleteBtn:function(id){
                let that = this;
                layer.confirm('删除须谨慎，确认要删除吗？',(index)=>{

                    if($('tbody tr.text-c').length == 1 && staffsOps.param.page>1){
                        staffsOps.param.page--;
                    };

                    $.ajax({
                        url: `${base.gAjaxUrl.approvers}${id}/`,
                        type: 'DELETE',
                    })
                    .always((data)=>{
                            layer.msg('删除成功',{icon:1,time:1000});
                            that.getList();

                    })
                });

            }
        },
        components:{
            add
        }
    }
</script>
