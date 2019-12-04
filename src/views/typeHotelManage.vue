<template>
    <add v-if="showAdd" :data="currentItem" :title="title" @dialog-save="getList" @dialog-close="closeAdd" :buildings="buildings"></add>
    <section class="Hui-article-box">
        <div class="head panel-body clearfix ">
            <h4 class="fw-b">费用类别管理</h4>
            <div class="search">
                <span>&nbsp;适用区域:&nbsp;</span>
                <select  v-model="buildingName" class="select-box">
                    <option value="" >全部</option>
                    <option :value="item.id" v-for="item in buildings">{{item.building_name}}</option>
                </select>
                <span>&nbsp;费用类别:&nbsp;</span>
                <select v-model="costType" class="select-box">
                    <option value="">全部</option>
                    <option value="1">固定</option>
                    <option value="0">非固定</option>
                </select>
                <input type="text" v-model="costName" class="input-text" placeholder="费用名称">
                <button v-on:click="getList(1)" class="btn btn-success" type="button"><i class="f-r Hui-iconfont">&#xe665;</i></button>
            </div>
            <a href="javascript:;" class="btn btn-secondary radius f-r mt-10" v-on:click="clickAdd()">添加类别</a>
        </div>
        <div class="page-container table-container">
            <table class="fixedParent table table-border table-bordered table-hover table-bg table-sort">
                <thead>
                <tr class="text-c">
                    <th width="70">费用名称</th>
                    <th width="70">适用区域</th>
                    <th width="70">费用类别</th>
                    <th width="70">是否启用</th>
                    <th width="70">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr class="text-c" v-for="item in costList">
                    <td>{{item.name}}</td>
                    <td class="hoverVisible">
                        <div v-show="item.name == '水费' || item.name == '电费'">全部</div>
                        <div v-show="item.name != '水费' && item.name != '电费'" class="tag_container">
                            <div @mouseenter="checkPosition($event, item.buildings.length <= 1)" class="tag_box" v-if="item.buildings.length">
                                <div class="tag_item">
                                    <span title="{{item.buildings[0].building_name}}">{{item.buildings[0].building_name}}</span><span class="tag_more" v-if="item.buildings.length > 1">...</span>
                                </div>
                                <div class="tag_second_box_sign"></div>
                                <div v-if="item.buildings.length > 1" class="tag_second_box clearfix">
                                    <div v-for="data in item.buildings" class="tag_item f-l" title="{{data.building_name}}">{{data.building_name}}</div>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>{{item.type==0?'非固定费用':'固定费用'}}</td>
                    <td>
                        <a v-show="item.is_active==0"  href="javascript:;" class="Hui-iconfont fs-22 c-red" @click="open(item)">&#xe706;</a>
                        <a v-show="item.is_active==1" href="javascript:;" class="Hui-iconfont fs-22" @click="close(item)">&#xe676;</a>
                    <td  class="f-14">
                        <a v-show="item.name != '水费' && item.name != '电费'" title="编辑" href="javascript:;" v-on:click="clickAdd(item)"><i class="Hui-iconfont">&#xe6df;</i></a>
                        <a v-show="item.name != '水费' && item.name != '电费'" title="删除" href="javascript:;" class="ml-5" v-on:click="deleteBtn(item)"><i class="Hui-iconfont">&#xe6e2;</i></a>
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
<style lang="less" rel="stylesheet/less" scoped>
    .head{
        position: relative;
        border:1px solid #c7c7c7;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        margin: 15px;
        margin-bottom:0;
      h4{
          display: inline-block;
          margin-right: 10px;
      }
        .search{
            width: 80%;
            display: inline-block;
            select{
                width: 120px;
            }
            input{
                margin-right: -5px;
                width: 200px;
                margin-left: 20px;
            }
        }
    }
    .hoverVisible:hover {
        overflow: visible;
    }
    .tag_container {
        width: 80px;
        margin: 0 auto;
    }
    .clearfix:before {
        content:"";
        display:block;
        height:0;
        clear:both;
        visibility:hidden;
        zoom:1;
    }

</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import add from '../components/addHotelType'

    let listOpt = null;
    export default{
        ready(){
            listOpt = {
                param:{
                    page:1,
                    page_size:10,
                }
            }
            this.getList();
            this.getBuildingsList();
        },
        data:function () {
            return{
                itemsLoading:false,
                noData:false,
                buildings:[],
                showAdd:false,
                currentItem:'',
                title:'',
                costList:'',
                buildingName:'',
                costType:"",
                costName:'',

            }
        },
        methods:{
            getList:function (type) {
                if(type){
                    listOpt.param.page = 1;
                }
                let that = this;
                this.showAdd = false;
                this.itemsLoading = true;
                this.queryAjax((tpageToal='4',count='0')=>{
                    that.initPage('#J-page',tpageToal,listOpt.param.page,count)
                });
            },
            initPage:function(obj,tpageToal='4',current='1',count='0'){
                let that = this;
                $(obj).createPage({
                    pageCount:tpageToal,
                    current:current,
                    count:count,
                    callback:(p)=>{
                        listOpt.param.page = p;
                        that.queryAjax();
                    }
                });
            },
            checkPosition: function (e, flag) {
                if(flag) return;
                let target = e.srcElement ? e.srcElement : e.target;
                let $this = $(target);
                if($this.hasClass("top") || $this.hasClass("bottom")) return;
                let $parent = $this.parents(".fixedParent"); // 以下判断方法，需要$parent的padding为0，不然要重新插入padding的判断
                let $tagBox = $this.children(".tag_second_box");
                if($tagBox.offset().top + $tagBox.outerHeight() + $this.find(".tag_second_box_sign").outerHeight() > $parent.offset().top + $parent.height() && $this.parents("td").offset().top - $parent.offset().top < $this.find(".tag_second_box_sign").outerHeight() + $tagBox.outerHeight()){
                    var height = $parent.parents(".table-container").height();
                    var currentHeight = $this.offset().top - $parent.offset().top + $this.find(".tag_second_box_sign").outerHeight() + $tagBox.outerHeight() + $this.parents("td").outerHeight();
                    var compensate = $parent.offset().top - $parent.parent().offset().top;
                    if(currentHeight + compensate > height) $parent.parents(".table-container").css({minHeight: currentHeight + compensate});
                    $this.addClass("bottom");
                } else if($tagBox.offset().top + $tagBox.outerHeight() + $this.find(".tag_second_box_sign").outerHeight() > $parent.offset().top + $parent.outerHeight()){
                    $this.addClass("top");
                } else {
                    $this.addClass("bottom");
                }
            },
            clickAdd:function (item) {
                this.showAdd = true;
                if(item){
                    this.currentItem = item;
                    this.title = "编辑信息"
                }else{
                    this.title = "添加类别";
                    this.currentItem = '';
                }
            },
            closeAdd:function () {
                this.showAdd = false;
            },
            getBuildingsList:function(callback=function(){}){
                let ajaxData = {
                    param:{
                        page:1,
                        page_size:999999,
                    }
                }
                $.ajax({
                    url: base.gAjaxUrl.buildings,
                    type: 'GET',
                    data: ajaxData.param
                }).always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
                        this.buildings = data.results;
                    });
                })
            },
            queryAjax:function (callback=function (){}) {
                let that = this;
              $.ajax({
                  url:`${base.gAjaxUrl.buildingsCostTypeList}`,
                  type:"GET",
                  data:{
                      page:listOpt.param.page,
                      page_size:listOpt.param.page_size,
                      building:that.buildingName,
                      type:that.costType,
                      name:that.costName
                  }
              }).always((data)=>{
                  that.itemsLoading = false;
                  base.ajaxCallback(data,()=>{
                    that.costList = data.results;
                      if(that.costList.length == 0){
                          that.noData = true;
                      }else{
                          that.noData = false;
                      }
                      callback(data.num_pages,data.count);
                  })
              })
            },
            deleteBtn:function (item) {
                let that = this;
                layer.confirm(`确定要删除${item.name}这个费用吗?`,function () {
                    that.itemsLoading = true;
                    $.ajax({
                        url:`${base.gAjaxUrl.buildingsCostTypeList}${item.id}/`,
                        type:"DELETE",
                    }).always((data) =>{
                        that.itemsLoading = false;
                        base.ajaxCallback(data,()=>{
                            if(that.costList.length == 1) {
                                listOpt.param.page--;
                                listOpt.param.page = listOpt.param.page < 1 ? 1 : listOpt.param.page;
                            }
                            that.getList();
                        })
                    })
                    layer.closeAll("dialog");
                })

            },
            close:function (item) {
                console.log("item");
                console.log(item);
                let that = this;
                layer.confirm(`是否确定关闭${item.name}?`,function(){
                    that.itemsLoading = true;
                    $.ajax({
                        url:`${base.gAjaxUrl.buildingsCostTypeList}${item.id}/`,
                        type:"PUT",
                        contentType:"application/json",
                        data:JSON.stringify({
                            name:item.name,
                            is_active:0,
                        })
                    }).always((data)=>{
                        that.itemsLoading = false;
                        base.ajaxCallback(data,()=>{
                            that.getList();
                        })
                    })
                    layer.closeAll("dialog")
                })

            },
            open:function (item) {
                let that = this;
                layer.confirm(`是否确定启用${item.name}?`,function(index){
                    that.itemsLoading = true;
                    $.ajax({
                        url:`${base.gAjaxUrl.buildingsCostTypeList}${item.id}/`,
                        type:"PUT",
                        contentType:"application/json",
                        data:JSON.stringify({
                            name:item.name,
                            is_active:1,
                        })
                    }).always((data)=>{
                        that.itemsLoading = false;
                        base.ajaxCallback(data,()=>{
                            that.getList();
                        })
                    })
                    layer.close(index)
                })

            }


        },
        components:{
            add,
        },
    }
</script>