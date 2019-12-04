<template>
    <div class="layui-layer layui-anim mSelectDepartmentContainer">
        <div class="layui-layer-title mTitle"><span  class="fw-n">[ {{data.name}} ]</span></div>
        <div class="page-container">
            <div class="inner_container">
                <div class="departmentContainer relative">
                    <div class="fw-b containerTitle cl">选择：
                         <div class="f-r">
                             全选
                             <input type="checkbox" class="check-box" :checked="isSelectedAll" @click="selectAll()">
                         </div>
                    </div>
                    <!-- 左侧侧边栏组件 -->
                    <div class="containerInner relative">
                        <div class="searchBox mt-10">
                            <input id="searchInputInner" type="text" v-model="searchInput" placeholder="资源名称" class="input-text">

                        </div>
                        <ul class="departmentList">
                            <li title="{{item.name}}" v-for="item in resourceList | filterBy searchInput in 'name'" @click="selectResource(item)">
                                {{item.name}}
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="selectContainer relative">
                    <div class="fw-b containerTitle">已选：</div>
                    <ul class="containerInner">
                        <li title="{{data.id | getLatestName}}" class="cl mt-5" v-for="data in selectedArr" track-by="$index">
                            <span class="f-l ml-30 ">
                                {{data.id | getLatestName}}
                            </span>
                            <i class="Hui-iconfont f-r mr-10" @click="deleteSelected(data.id)">&#xe706;</i>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" @click="close()"></a>
        </span>
        <div class="mt-10 mb-10 clearfix pd-10 b-box btns">
            <a v-on:click="save" class="btn btn-primary radius">确认</a>
            <a v-on:click="close" class="btn btn-default radius">取消</a>
        </div>
    </div>
    <div class="layui-layer-shade"></div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    export default{
        ready () {
            base.verticalCenter('.mSelectDepartmentContainer')
            this.getList();
            console.log("data: ", this.data)
            console.log("key: ", this.key)
            if(this.data.ids !== 'all'){
                let idArr = this.data.ids;
                for (let i = 0,len = idArr.length; i < len; i++) {
                    let obj = {
                        id:idArr[i],
                        name:this.data.resourceName[i],
                    }
                    this.selectedArr.push(obj);
                }
            }else{
                this.isSelectedAll = true;
            }
        },
        props: ['data','key'],
        data: function () {
            return {
                itemsLoading:false,
                searchInput:'',
                resourceList:[],
                selectedArr:[],
                isSelectedAll:false,
            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close')

            },
            save:function(){
                let data = {};
                data[this.key] = {
                    name:this.data.name,
                }
                if(this.selectedArr.length == this.resourceList.length){
                    data[this.key].ids = 'all'
                }else{
                    data[this.key].ids = [];
                    data[this.key].resourceName = []
                    for (let i = 0,len = this.selectedArr.length; i < len ; i++) {
                        data[this.key].ids.push(this.selectedArr[i].id)
                        data[this.key].resourceName.push(this.$options.filters.getLatestName.call(this, this.selectedArr[i].id))
                    }
                }

                this.$dispatch('update',data)
            },
            getList:function(){
                let that = this;
                $.ajax({
                    url:`${base.gAjaxUrl.resources}${that.key}/`,
                    type:'GET',
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
                        that.resourceList = data;
                        console.log("resourceList: ", this.resourceList);
                        if(that.data.ids == 'all'){
                            that.selectedArr = that.selectedArr.concat(data);
                        }
                    })
                })
            },
            selectResource:function(data){
                for (let i = 0,len = this.selectedArr.length; i < len ; i++) {
                    if(this.selectedArr[i].id == data.id){
                        return
                    }
                }
                let obj = {
                    id:data.id,
                    name:data.name
                }
                this.selectedArr.push(obj);

                if(this.selectedArr.length == this.resourceList.length){
                    this.isSelectedAll = true;
                }else{
                    this.isSelectedAll = false;
                }
            },
            deleteSelected:function(id){
                this.isSelectedAll = false;
                for (let i = 0,len = this.selectedArr.length; i < len ; i++) {
                    if(this.selectedArr[i].id == id){
                        this.selectedArr.splice(i,1);
                        return
                    }
                }
            },
            selectAll:function(){
                this.isSelectedAll = !this.isSelectedAll;
                this.selectedArr = [];
                if(this.isSelectedAll){
                    this.selectedArr = this.selectedArr.concat(this.resourceList)
                }
            },
        },
        components: {
        },
        filters: {
            getLatestName: function (id) {
                for(var i = 0, len = this.resourceList.length; i < len; i++) {
                    var item = this.resourceList[i];
                    if(item.id == id) {
                        return item.name
                    }
                }
                return '--'
            }
        }
    }
</script>

<!-- 标签规则 -->
<style lang="less" rel="stylesheet/less" scoped>
    .layui-layer-shade{
        z-index: 102;
    }
    .mSelectDepartmentContainer {
        width: 95%;
        height: 95%;
        min-width: 600px;
        max-width: 800px;
        min-height: 500px;
        max-height: 600px;
        background-color: #fff;
        z-index: 112;
        position: relative;
        .mTitle {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            font-weight: bold;
        }
        .page-container {
            padding: 15px;
            height: 100%;
            overflow: auto;
            box-sizing: border-box;
            position: relative;
            width: 100%;
            .inner_container {
                box-sizing: border-box;
                position: absolute;
                top: 57px;
                left: 15px;
                right: 15px;
                bottom: 52px;
                overflow-y: auto;
                /*overflow: auto;*/
                display: flex;
                .containerTitle {
                    border-left: 5px solid #00B4EE;
                    line-height: 18px;
                    height: 20px;
                    font-size: 16px;
                    margin: 10px 0;
                    padding-left: 10px;
                }
                .containerInner {
                    background-color: #f7f7f7;
                    flex: 1;
                    position: absolute;
                    top: 57px;
                    left: 15px;
                    right: 15px;
                    bottom: 52px;
                    overflow-y: auto;
                    li{
                        height:30px;
                        line-height: 30px;
                    }
                    li:hover{
                        background-color: #dedede;

                        /*color:white;*/
                    }
                    i{
                        cursor:pointer;
                    }
                    i:hover{
                        color:red;
                    }
                }
                .departmentContainer {
                    width: 300px;
                    height: 100%;
                    overflow: auto;
                    box-sizing: border-box;
                    padding: 10px;
                    flex: 1;
                    margin: 0 10px;
                    display: flex;
                    flex-direction: column;
                    .searchBox {
                        display: flex;
                        box-sizing: border-box;
                        padding: 0 10px;
                        #searchInputInner {
                            flex: 1;
                        }
                        .btn {
                            width: 40px;
                        }
                    }
                    .departmentList {
                        position: absolute;
                        top: 51px;
                        left: 0;
                        bottom: 0;
                        right: 0;
                        overflow: auto;
                        li{
                            height:30px;
                            width: 100%;
                            text-align: left;
                            line-height: 30px;
                            padding: 0 20px;
                            box-sizing: border-box;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                            cursor:pointer;
                        }
                        li:hover{
                            background-color: #dedede;
                        }

                    }
                }
                .selectContainer {
                    width: 300px;
                    height: 100%;
                    box-sizing: border-box;
                    padding: 10px;
                    flex: 1;
                    margin: 0 10px;
                    display: flex;
                    flex-direction: column;
                }
            }
        }
        .saveBtn {
            position: absolute;
            right: 15px;
            bottom: 10px;
        }
        .btns {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            box-sizing: border-box;
            align-content: center;
            justify-content: center;
            .btn {
                flex: 1;
                max-width: 120px;
                margin: 0 20px;
            }
        }
    }
</style>
