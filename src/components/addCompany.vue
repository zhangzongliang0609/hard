<template>
    <set v-if="showSetResource" :data="resourceData" :key="resourceKey" @dialog-close="closeSetResource" @update="update" ></set>
    <div>
        <div class="layui-layer layui-anim layui-layer-page layui-modify">
            <div class="layui-layer-title">{{title}}</div>
            <div class="layui-layer-content ">
                <p class="ml-20">
                    基础信息:
                <p/>
                <form id="P-form" class="form form-horizontal layui-layer-wrap">
                    <div class="row cl">
                        <label class="form-label f-l col-4 "><span class="c-red">*</span>姓名：</label>
                        <div class="formControls f-l col-4">
                            <input v-model="userName" type="text" class="input-text" value="" placeholder="" name="userName">
                        </div>
                    </div>
                    <div class="row cl">
                        <label class="form-label f-l col-4 "><span class="c-red">*</span>电话：</label>
                        <div class="formControls f-l col-4">
                            <input v-model="phone" type="text" class="input-text" value="" placeholder="" name="phone">
                        </div>
                    </div>
                    <div class="row cl">
                        <label class="form-label f-l col-4 "><span class="c-red" v-if="passwrodFlag">*</span>密码：</label>
                        <div class="formControls f-l col-4">
                            <input id="Password" v-model="password" type="password" class="input-text" value="" placeholder="" name="password">
                        </div>
                    </div>
                    <div class="row cl">
                        <label class="form-label f-l col-4 "><span class="c-red" v-if="passwrodFlag">*</span>确认密码：</label>
                        <div class="formControls f-l col-4">
                            <input type="password" class="input-text" value="" placeholder="" name="confirmPassword">
                        </div>
                    </div>

                </form>
                <div class="mt-10 ml-20 cl relative">
                    <span class="fz-15 inline-block">权限配置</span>
                    <a href="javascript:;" class="layui-btn layui-btn-xs" @click="changeOpen">{{isOpen?'收起':'展开'}}</a>
                    <span class="fz-10 inline-block red">(新增默认开启全部权限)</span>
                    <div class="layui-layer-btn " style="top:-15px" v-on:click="save"><a class="layui-layer-btn0 mt-5" v-if="type!='check'">保存</a></div>
                </div>

                <div v-show="isOpen" class="jurisdiction-box row cl text-c mt-10">
                    <div class="col-3 f-l">
                        <h5 class="p-5 border-bottom text-c fw-b">一级功能模块</h5>
                        <ul class="one text-c pt-10 h100">
                            <li class="mb-10 relative" v-for="item in menuList" :key="$index" v-if="item.is_allow">
                  <span class="inline-block round mr-10 pointer" :class="idArr[item.id] && idArr[item.id].length?'checked':''" @click="clickOne(item.id,$index)">
                    <i class="Hui-iconfont none">&#xe6a7;</i>
                  </span>
                                <span class="inline-block jurisdiction-name p-5 pointer" :class="{'checked':currentLi === $index}" @click="clickLi($index)">{{item.name}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="col-3 f-l">
                        <h5 class="p-5 border-bottom border-left text-c fw-b" > 二级功能模块</h5>
                        <ul class="two text-c pt-10 border-left h100">
                            <li class="mb-10 relative" v-for=" data in twoMenuList.child" :key="$index" v-if="data.is_allow && data.name !== '企业管理员'">
                  <span class="inline-block round mr-10 pointer" :class="{'checked':idArr[data.parent_id] && checkId(data)}"  @click="clickId(data,$index)">
                    <i v-if="idArr[data.parent_id] && checkId(data)"  class="Hui-iconfont">&#xe6a7;</i>
                  </span>
                                <span class="inline-block jurisdiction-name p-5 pointer" :class="{'checked':secondIndex === $index}" @click="clickSecondModel(data,$index)">{{data.name}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="col-6 f-l">
                        <h5 class="p-5 border-bottom border-left text-c fw-b" > 界面操作权限配置</h5>
                        <div class=" text-c p-10 border-left pt-10 operating-box"  style="height:34px;">
                            <section v-if="operatingConfig.write_allow">
                            <div class="cl f-l relative fun-box" >
                                   <span class="inline-block round mr-10 pointer" :class="operatingConfig.add_allow?'checked':''" @click="ConfigSet('add')">
                    <i class="Hui-iconfont none">&#xe6a7;</i>
                  </span>
                                <span class="f-r ml-10 inline-block config-name p-5 pointer">增加</span>
                            </div>

                            <div class="cl f-l  relative fun-box">
   <span class="inline-block round mr-10 pointer" :class="operatingConfig.del_allow?'checked':''" @click="ConfigSet('del')">
                    <i class="Hui-iconfont none">&#xe6a7;</i>
                  </span>
                            <span class="f-r inline-block config-name p-5 pointer">删除</span>
                            </div>

                            <div class="cl f-l relative fun-box">
                                   <span class="inline-block round mr-10 pointer" :class="operatingConfig.edit_allow?'checked':''" @click="ConfigSet('change')">
                    <i class="Hui-iconfont none">&#xe6a7;</i>
                  </span>
                            <span class="f-r inline-block config-name p-5 pointer">修改</span>
                            </div>

                            </section>
                            <h5 class="text-c" v-if="!operatingConfig.write_allow && secondIndex !== ''">此模块并未开通操作权限配置功能~</h5>
                        </div>
                        <h5 class="p-5 border-bottom border-left text-c fw-b border-top" > 可用资源配置</h5>
                        <section class="border-left h90">
                            <ul class="two text-c pl-10 pt-10 h90" v-if="operatingConfig.config_allow">
                                <li class="mb-10 text-l cl " v-for="(key , resource) in operatingConfig.resources
" :key="i" >
                                    <a href="javascript:;" class="layui-btn layui-btn-xs f-l mr-10" @click="setResource(resource,key)">{{resource.name}}&nbsp;:</a>
                                    <span v-if="resource.ids === 'all'" style="line-height: 30px">
                                        全部
                                    </span>
                                    <span class="f-l mr-5" style="line-height: 30px" track-by="$index" v-if="resource.ids !== 'all'" v-for="item in resource.resourceName">
                                        {{item}}{{ $index != resource.resourceName.length - 1 ? ',' : ''}}
                                    </span>
                                </li>
                            </ul>
                            <h5 class="text-c" style="margin-top: 50px;" v-if="!operatingConfig.config_allow && secondIndex !== ''">此模块并未开通资源配置功能~</h5>
                        </section>
                    </div>
                </div>

            </div>
            <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
        </div>

        <div class="m-loading" v-if="loading">
            <div class="cube1"></div>
            <div class="cube2"></div>
        </div>

        <div class="layui-layer-shade"></div>
    </div>
</template>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base'
    import set from '../components/setResource'
    export default {
        ready:function () {
            let that = this;
            let ajaxType = 'POST';
            let ajaxUrl = `${base.gAjaxUrl.authority}`;
            let ajaxData = [];
            this.getAuthorityMenu();
            base.verticalCenter('.layui-modify');
            if(this.type == 'add'){

            }else if(this.type == 'modify'){
                ajaxType = 'PATCH';
                ajaxUrl = ajaxUrl + this.data.id + '/';
                this.phone = this.data.phone;
                this.userName = this.data.user_name;
            }
            $.validator.addMethod('mobile', function( value, element ){
                // /^1\d{10}$/ 来自支付宝的正则
                // console.log("element:", element.value)
                // 这里的处理主要是为了防止手机复制粘贴首末位有换行符的问题
                value = element.value.match(/\d+/g).join('');
                element.value = value;
                return this.optional( element ) || /^1\d{10}$/.test( value );
            }, '请输入正确的手机号码');
            $('#P-form').validate({
                rules: {
                    userName: {
                        required: true,
                    },
                    phone:{
                        required: true,
                        // number:true,
                        mobile:true,
                    },
                    password: {
                        required: that.type != 'modify',
                    },
                    confirmPassword: {
                        required: that.type != 'modify',
                        equalTo: "#Password"
                    },
                },
                submitHandler:function() {
                    if(that.type == 'modify' && that.phone != that.data.phone && !that.password){
                        layer.msg('修改手机后请重新设置密码',{icon:2,time:2000});
                        return
                    }
                    that.loading = true;
                    let rules = [] ;
                    let dataObj = that.idArr;
                    // 一级模块的id也需要以同样的格式传给后台
                    for (let key in dataObj){
                        let dataArr = dataObj[key];
                        let obj = {
                            id:key,
                            is_allow:true,
                            add_allow:true,
                            edit_allow:true,
                            del_allow:true,
                            resources:'',
                        }

                        for (let i = 0,len = dataArr.length; i < len; i++) {
                            rules.push(dataArr[i])
                        }
                        if(dataObj[key].length > 0 && dataArr[0].id != key){
                            rules.push(obj);
                        }

                    }
                    ajaxData = {
                        user_name:that.userName,
                        phone:that.phone,
                        rules:rules,
                    }
                    // 编辑状态下,如果用户没有修改密码,则不要带密码这个key值
                    if(that.password !== ''){
                        ajaxData['password'] = that.password;
                    }
                    $.ajax({
                        url:ajaxUrl,
                        type:ajaxType,
                        contentType:'application/json',
                        data:JSON.stringify(ajaxData)
                    }).always((data)=>{
                        that.loading = false;
                        base.ajaxCallback(data,()=>{
                            that.$dispatch('dialog-save')
                        })
                    })
                },
            });
        },
        props:['title','type','data'],
        data:function () {
            return{
                userName:'',
                phone:'',
                password:'',
                confirmPassword:'',
                isOpen: true,
                currentLi:'',
                menuList:[],
                twoMenuList:[],
                idArr:{},
                loading:false,
                passwrodFlag:true,
                operatingConfig:'', // 可用资源配置的对象
                firstIndex:'', // 一级模块中的索引
                secondIndex:'', // 二级模块中的索引
                showSetResource:false,
                resourceData:'', // 被点击的可用资源配置的大类
                resourceKey:'', // 资源配置的key值
            }
        },
        methods:{
            close:function(){
                this.$dispatch('dialog-close')
            },
            clickOne:function(currentId,index){
                if(this.idArr[currentId]){
                   delete this.idArr[currentId]
                }else{
                    this.idArr[currentId] = [];
                    let data  = this.menuList[index].child;
                    if(data){
                        for (let i = 0,len = data.length; i < len; i++) {
                            let obj = {
                                "id":data[i].id,
                                "add_allow":data[i].add_allow,
                                "edit_allow":data[i].edit_allow,
                                "del_allow":data[i].del_allow,
                                "resources":data[i].resources?data[i].resources:[]
                            }
                            this.idArr[currentId].push(obj);
                        }
                    }else{
                        let firstData = this.menuList[index];
                        let obj = {
                            "id":firstData.id,
                            "add_allow":firstData.add_allow,
                            "edit_allow":firstData.edit_allow,
                            "del_allow":firstData.del_allow,
                            "resources":firstData.resources?firstData.resources:[]
                        }
                        firstData.parent_id = firstData.id;
                        this.idArr[currentId].push(obj);
                    }
                }
                // 需要重新指向一下vue实例对象的地址,从而去引起重新渲染
                let copy = this.menuList ;
                let childCopy = this.twoMenuList;
                this.menuList = [];
                this.twoMenuList = [];
                this.$nextTick(()=>{
                    this.menuList = copy;
                    this.twoMenuList = childCopy;
                })

            },
            clickLi:function(i){
                this.firstIndex = i;
                this.currentLi = i;
                this.twoMenuList = this.menuList[i]
                this.secondIndex = '';
                this.operatingConfig = '';
                if(!this.twoMenuList.child){
                    this.operatingConfig = this.twoMenuList;
                    this.secondIndex = 0;
                }
            },
            clickId:function(data,index){
                let parentId = data.parent_id;
                if(!this.idArr[parentId]){
                    this.idArr[parentId] = [];
                }
                let currentData =  this.idArr[parentId];
                let currentIndex = '';
                // 遍历寻找当前点击的id在idArr中的位置
                for (let i = 0,len = currentData.length; i < len; i++) {
                    if(currentData[i].id == data.id){
                        currentIndex = i;
                        break
                    }
                }
                if(currentIndex === ''){
                    let obj = {
                        "id":data.id,
                        "add_allow":data.add_allow,
                        "edit_allow":data.edit_allow,
                        "del_allow":data.del_allow,
                        "resources":data.resources?data.resources:[]
                    }

                    this.idArr[parentId].push(obj);
                }else{
                    this.idArr[parentId].splice(currentIndex,1);
                }
                    let copy = this.twoMenuList.child;
                    let oneCopy = this.menuList;
                    this.twoMenuList.child = [];
                    this.menuList = [];
                    this.$nextTick(()=>{
                        this.twoMenuList.child = copy;
                        this.menuList = oneCopy;
                    })
            },
            changeOpen:function(){
                this.isOpen = !this.isOpen;
            },
            save:function(){
                $('#P-form').submit();
            },
            getAuthorityMenu:function(){
                this.loading = true;
                $.ajax({
                    url:`${base.gAjaxUrl.authority}${localStorage['user_id']}/`,
                    type:'GET',
                }).always((data)=>{
                    this.loading = false;
                    base.ajaxCallback(data,()=>{
                        this.menuList = data.menus;

                        if(this.type == 'modify'){
                            this.getModifyList();
                        }else {
                            this.allSelected()
                        }
                    })
                })
            },
            allSelected:function(){
                let rulesArr = this.menuList;
                for (let i = 0,len = rulesArr.length; i < len; i++) {
                    let parent = rulesArr[i];
                    this.idArr[parent.id] = [];
                    if(parent.child){
                        for (let j = 0,leng = parent.child.length; j < leng; j++) {
                            // 存放到需要提交的数组当中
                            let obj = {
                                "id":parent.child[j].id,
                                "add_allow":parent.child[j].add_allow,
                                "edit_allow":parent.child[j].edit_allow,
                                "del_allow":parent.child[j].del_allow,
                                "resources":parent.child[j].resources?parent.child[j].resources:[]
                            }
                            this.idArr[parent.id].push(obj)
                        }
                    }else {
                        this.menuList[i].parent_id = parent.id;
                        let obj = {
                            "id":parent.id,
                            "add_allow":parent.add_allow,
                            "edit_allow":parent.edit_allow,
                            "del_allow":parent.del_allow,
                            "resources":parent.resources?parent.resources:[]
                        }
                        this.idArr[parent.id].push(obj);
                    }

                }
                // 更新数组的内容,使其重新渲染
                let copy = this.menuList;
                this.menuList = [];
                this.$nextTick(()=>{
                    this.menuList = copy;
                })
            },
            checkId:function(data){
                let dataArr = this.idArr[data.parent_id];
                if(dataArr &&  dataArr.length != 0){
                    for (let i = 0,len = dataArr.length; i < len; i++) {
                        if(dataArr[i].id == data.id){
                            return true
                        }else if(i == len -1 ){
                            return false
                        }
                    }
                }else{
                    return false
                }
            },
            clickSecondModel:function(data,index){
                this.secondIndex = index;
                this.operatingConfig = data
            },
            ConfigSet:function(type){
                let idIndex = ''
                let configData = '';
                if(this.menuList[this.firstIndex].child){
                    configData = this.menuList[this.firstIndex].child[this.secondIndex];
                }else{
                    configData = this.menuList[this.firstIndex]
                }
                let idData = this.idArr[this.operatingConfig.parent_id];
                if(!idData){
                    layer.msg('修改配置请先勾选当前模块',{icon:2,time:1500})
                    return
                }
                for (let i = 0 , len = idData.length; i < len; i++) {
                    if(idData[i].id == this.operatingConfig.id){
                        idIndex = i;
                        break
                    }
                }
                if(idIndex === ''){
                    layer.msg('修改配置请先勾选当前模块',{icon:2,time:1500})
                    return
                }
                // 修改界面中对象的值,让vue重新渲染
                if(type == 'add'){
                    configData.add_allow = !configData.add_allow
                }else if(type == 'del'){
                    configData.del_allow = !configData.del_allow
                }else if(type == 'change'){
                    configData.edit_allow = !configData.edit_allow
                }

                // if(idData && idData.length > 0){
                    for (let i = 0,len = idData.length ; i < len; i++) {
                       if(idData[i].id == this.operatingConfig.id){
                               idData[i].add_allow = configData.add_allow
                               idData[i].del_allow = configData.del_allow
                               idData[i].edit_allow = configData.edit_allow
                           return
                       }
                    }
                // }
            },
            setResource:function(data,key){
                let idIndex = '';
                let idData = this.idArr[this.operatingConfig.parent_id];
                if(!idData){
                    layer.msg('修改配置请先勾选当前模块',{icon:2,time:1500})
                    return
                }
                for (let i = 0 , len = idData.length; i < len; i++) {
                    if(idData[i].id == this.operatingConfig.id){
                        idIndex = i;
                        break
                    }
                }
                if(idIndex === ''){
                    layer.msg('修改配置请先勾选当前模块',{icon:2,time:1500})
                    return
                }
                this.showSetResource = true;
                this.resourceData = data;
                this.resourceKey = key;
            },
            closeSetResource:function(){

                this.showSetResource = false;
            },
            update:function(freshData){
                // 取出保存在idArr中的已选的id的位置,然后重新赋值它的资源配置.
                let dataArr =  this.idArr[this.operatingConfig.parent_id];
                for (let i = 0,len = dataArr.length; i < len; i++) {
                    if(dataArr[i].id == this.operatingConfig.id){
                        dataArr[i].resources[this.resourceKey] = freshData[this.resourceKey];
                        break;
                    }
                }
                // 这样的赋值是让界面重新渲染.
                this.resourceData = freshData;
                this.showSetResource = false;
            },
            getModifyList:function(){
                let that = this;
                let rulesArr = [];
                $.ajax({
                    url:`${base.gAjaxUrl.authority}${that.data.id}/`,
                    type:'GET',
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
                        rulesArr = data.menus;
                        for (let i = 0,len = rulesArr.length; i < len; i++) {
                            let parent = rulesArr[i];
                            if(!parent.is_allow){
                                continue
                            }
                            this.idArr[parent.id] = [];
                            if(parent.child){
                                for (let j = 0,leng = parent.child.length; j < leng; j++) {
                                    if(!parent.child[j].is_allow){
                                        continue
                                    }
                                    // 更新界面上展示的数组.
                                    this.menuList[i].child[j]["add_allow"] = parent.child[j].add_allow;
                                    this.menuList[i].child[j]["edit_allow"] = parent.child[j].edit_allow;
                                    this.menuList[i].child[j]["del_allow"] = parent.child[j].del_allow;
                                    this.menuList[i].child[j]["resources"] = parent.child[j].resources;

                                    // 存放到需要提交的数组当中
                                    let obj = {
                                        "id":parent.child[j].id,
                                        "add_allow":parent.child[j].add_allow,
                                        "edit_allow":parent.child[j].edit_allow,
                                        "del_allow":parent.child[j].del_allow,
                                        "resources":parent.child[j].resources?parent.child[j].resources:[]
                                    }
                                    that.idArr[parent.id].push(obj)
                                }
                            }else {
                                this.menuList[i].add_allow = parent.add_allow;
                                this.menuList[i].edit_allow = parent.edit_allow;
                                this.menuList[i].del_allow = parent.del_allow;
                                this.menuList[i].resources = parent.resources;
                                this.menuList[i].parent_id = parent.id;
                                let obj = {
                                    "id":parent.id,
                                    "add_allow":parent.add_allow,
                                    "edit_allow":parent.edit_allow,
                                    "del_allow":parent.del_allow,
                                    "resources":parent.resources?parent.resources:[]
                                }
                                this.idArr[parent.id].push(obj);
                            }

                        }
                        // 更新数组的内容,使其重新渲染
                        let copy = this.menuList;
                        this.menuList = [];
                        this.$nextTick(()=>{
                            this.menuList = copy;
                        })
                    })
                })
            }

        },
        events:{
        },
        components:{
            set:set,
        },
        filters:{

        }
    }
</script>

<style scoped lang="less" rel="stylesheet/less">
    .p-5{
        padding:2px;
    }
    h5{
        margin: 0;
    }
    .jurisdiction-box{
        border:1px solid #e6e6e6;
    }
    .jurisdiction-box .h90{
        height:130px ;
        overflow-y: auto;
    }
    .jurisdiction-box .h100{
        height:180px ;
        overflow-y: auto;
    }
    .layui-modify{
        width:1000px;
        max-height: 600px;
    }
    @media (min-height: 600px) and (max-height:800px){
        .jurisdiction-box .h100{
            height:350px !important;
        }
        .jurisdiction-box .h90{
            height:290px !important;
        }
        .layui-modify{
            width:1000px;
            max-height: 700px !important;
        }
    }
    @media (min-height: 900px){
        .jurisdiction-box .h100{
            height:505px !important;
        }
        .jurisdiction-box .h90{
            height:450px !important;
        }
        .layui-modify{
            width:1000px;
            max-height: 1000px !important;
        }
    }
    .none{
        display: none;
    }
    .two{
        min-height: 100px;
    }
    .round{
        position: absolute;
        top:50%;
        margin-top: -12px;
        border:1px solid #e6e6e6;
        width: 25px;
        height: 25px;
        line-height: 25px;
        border-radius: 50%;
        /*vertical-align: bottom;*/
    }
    .checked{
        color:white;
        background-color: #0099ff;
        .Hui-iconfont{
            display: inline-block !important;
        }
    }
    .jurisdiction-name{
        border:1px solid #e6e6e6;
        width: 100px;
        border-radius: 3px;
        margin-left: 35px;
    }
    .layui-modify{
        width:1000px;
    }
    .layui-layer-content{
        max-height:none !important;
    }
    .layui-btn-xs{
        height: 24px; line-height: 22px; padding: 4px 5px; font-size: 12px;
        border-radius: 5px;
        background-color: #009688;;
        color: white;
    }
    .pointer{
        cursor:pointer
    }
    .config-name{
        height:25px;
        line-height: 25px;
        border:1px solid #e6e6e6;
        border-radius: 5px;
        /*background-color: #a02b65;*/
        /*color: white;*/
    }
    .fun-box{
        width:150px;
    }
    .border{border:1px solid #e6e6e6;}
    .border-right{border-right:1px solid #e6e6e6;}
    .border-left{border-left:1px solid #e6e6e6;}
    .border-bottom{border-bottom:1px solid #e6e6e6;}
    .border-top{border-top:1px solid #e6e6e6;}
</style>
