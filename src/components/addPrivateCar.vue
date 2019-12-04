<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">
            <a href="javascript:;" class="btn btn-success radius" @click="returnSelectEmployee()">返回</a>
            <span class="ml-20">
              {{title}}
            </span>
        </div>
        <div class="layui-layer-content">
            <form id="J-layer-form" class="form form-horizontal layui-layer-wrap">
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>姓名：</label>
                    <div class="formControls f-l col-4">
                        <input v-model="usernameInput" type="text" class="input-text" value="" placeholder="" name="username">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red" v-if="passwrodFlag">*</span>密码：</label>
                    <div class="formControls f-l col-4">
                        <input id="password" v-model="passwordInput" type="password" class="input-text" value="" placeholder="" name="password">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red" v-if="passwrodFlag">*</span>确认密码：</label>
                    <div class="formControls f-l col-4">
                        <input type="password" class="input-text" value="" placeholder="" name="confirm_password">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>性别：</label>
                    <div class="formControls f-l col-4">
                    <span class="select-box">
                <select v-model="sexSelected" name="sex" class="select">
                    <option value="" selected="">请选择</option>
                    <option v-bind:value="item.id" v-for="item in sexItem">{{item.value}}</option>
                </select>
                </span>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>部门：</label>
                    <div class="formControls f-l col-4">
                        <div class="department_select_container" @mouseleave="departmentEnter(false)" @mouseenter="departmentEnter(true)">
                            <input v-if="departmentItem.length === 0 && type === 'add'" disabled type="text" class="input-text" value="无可选择部门">
                            <input v-else autocomplete="off" @click="departmentClick" v-model="departmentSelectedName" type="text" class="input-text" value="" placeholder="" name="department">
                            <i v-show="departmentSelectedName !== ''" class="empty-icon Hui-iconfont" @click="emptySearch()">&#xe60b;</i>
                            <div class="departmentListBox" style="display: none">
                                <div v-bind:title="item.department_tree" v-for="item in departmentItem | filterBy departmentSelectedName in 'department_tree'" @click="setDepartmentValue(item)" class="departmentListItem">{{item.department_tree}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>职位：</label>
                    <div class="formControls f-l col-4">
                        <input v-model="positionInput" type="text" class="input-text" value="" placeholder="" name="position">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>电话：</label>
                    <div class="formControls f-l col-4">
                        <input v-model="phoneInput" type="text" class="input-text" value="" placeholder="" name="phone">
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>工号：</label>
                    <div class="formControls f-l col-4">
                        <input v-model="jobNumberInput" type="text" class="input-text" value="" placeholder="" name="job_number">
                    </div>
                </div>
            </form>
            <div class="pd-30">
                <div class="cl">
                    <span class="f-l fw-b">车辆登记:</span>
                    <a href="javascript:;" class="btn btn-secondary radius f-r" @click="addCost()">添加车辆</a>
                </div>
                <form action="" id="PrivateCarForm" class="form-box-set-cost">
                    <table class="table table-border table-bordered table-bg table-sort row content-box ">
                        <thead>
                        <tr class="text-c">
                            <th >车牌号</th>
                            <th >品牌</th>
                            <th >型号</th>
                            <th >颜色</th>
                            <th >座位数</th>
                            <th width="120">操作</th>
                        </tr>
                        </thead>
                        <tbody class="slice-box">
                        <tr class="text-c car-box" v-for="car in items">

                            <td class="relative"  >
                                <input type="text" name="car_no" :value="car.car_no" class="input-text car_no" :disabled="isComplete || currentIndex !== $index">
                            </td>
                            <td   class="relative">
                                <input type="text" name="car_brand" :value="car.car_brand" class="input-text car_brand" :disabled="isComplete || currentIndex !== $index">
                            </td>
                            <td class="relative"  >
                                <input type="text" name="car_model" :value="car.car_model" class="input-text car_model" :disabled="isComplete || currentIndex !== $index">
                            </td>
                            <td class="relative"  >
                                <input type="text" name="car_color" :value="car.car_color" class="input-text car_color" :disabled="isComplete || currentIndex !== $index">
                            </td>
                            <td class="relative" >
                                <input type="text" name="car_seats" :value="car.seats" class="input-text car_seats" :disabled="isComplete || currentIndex !== $index">
                            </td>
                            <td >
                                <div v-show="isComplete">
                                    <a href="javascript:;" class="btn btn-secondary radius" @click="changeCost($index,car)">修改</a>
                                    <a href="javascript:;" class="btn btn-danger radius" @click="deleteCost(car,$index)">删除</a>
                                </div>
                                <div v-show="!isComplete && currentIndex === $index">
                                    <a href="javascript:;" class="btn btn-success radius" @click="doneChange($index)">完成</a>
                                    <a href="javascript:;" class="btn btn-secondary radius" @click="cancelChange($index)">取消</a>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </form>
            </div>

        </div>
        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
        <div class="layui-layer-btn" v-on:click="save"><a class="layui-layer-btn0" v-if="type!='check'">保存</a></div>
    </div>
    <div class="layui-layer-shade"></div>

    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>

<style lang="less" scoped rel="stylesheet/less">
    .tag_item_list {
        /*width: 270px;*/
        width: 100%;
        box-sizing: border-box;
        z-index: 2;
        min-height: 40px;
        padding: 3% 3% 6%;
        border-radius: 5px;
        border: 1px solid #ccc;
        background-color: #fff;
        .tag_item {
            /*width: 80px;*/
            width: 28%;
            color: #eee;
            font-size: 14px;
            line-height: 25px;
            margin-left: 3%;
            margin-top: 3%;
            border-radius: 5px;
            background-color: #ff9542;
            text-align: center;
            position: relative;
            cursor: pointer;
            box-sizing: border-box;
            padding: 0 5px;
            div {
                width: 100%;
                height: 100%;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
        .tag_delete {
            position: absolute;
            width: 16px;
            height: 16px;
            text-align: center;
            line-height: 12px;
            font-size: 12px;
            border-radius: 50%;
            background-color: #000;
            color: #fff;
            top: -5px;
            right: -5px;
            cursor: pointer;
        }
    }
</style>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    let departmentOps = null;

    export default{
        ready () {
            departmentOps = {
                page:1,
                page_size:999999,
            };
            let that = this;
            let ajaxUrl = '';
            let ajaxType = '';
            let getData = this.data;
            base.verticalCenter('.layui-modify');
            // this.getTagList();

            //类型判断
            if(this.type == 'add'){
                ajaxUrl = base.gAjaxUrl.staffs;
                ajaxType = 'POST';
                this.passwrodFlag = true;
                this.departmentSelectedName = '';
            }else if(this.type == 'modify'){
                ajaxUrl = `${base.gAjaxUrl.staffs}${getData.id}/`;
                ajaxType = 'PUT';
                this.passwrodFlag = false;
                this.usernameInput = getData.real_name;
                setTimeout(function(){
                    that.sexSelected = getData.sex;
                });
                this.departmentSelected = getData.department_vo.id;
                this.departmentSelectedName = getData.department_vo.department_tree || '--';
                this.positionInput = getData.position;
                this.phoneInput = getData.phone;
                this.jobNumberInput = getData.job_number;

                this.getPrivateCarList()
                // this.id_card = getData.id_card;
                // this.level = getData.level || 0;
                // this.cardInput = getData.card_number;
                // this.education = getData.education || '';
                // this.tagsArr = getData.tags || [];
                // this.tagsIdArr = getData.tags.length ? this.getTagIds(getData.tags) : [];
            }else if(this.type == 'check'){
                this.passwrodFlag = false;
                this.usernameInput = getData.real_name;
                setTimeout(function(){
                    that.sexSelected = getData.sex;
                });
                this.departmentSelected = getData.department;
                this.positionInput = getData.position;
                this.phoneInput = getData.phone;
                this.jobNumberInput = getData.job_number;
                // this.id_card = getData.id_card;
                // this.level = getData.level || 0;
                // this.cardInput = getData.card_number;
                // this.education = getData.education || '';
                // this.tagsArr = getData.tags || [];
                // this.tagsIdArr = getData.tags.length ? this.getTagIds(getData.tags) : [];
            }

            $.validator.addMethod('mobile', function( value, element ){
                return this.optional( element ) || /^1\d{10}$/.test( value );
            }, '请输入正确的手机号码');
            $.validator.addMethod("idCard",function(value,element,params){
                if(!value) {
                    return true;
                } else {
                    // 18位和15位身份证号验证
                    return /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value) || /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/.test(value);
                }
            }, "请输入正确的身份证号");
            $.validator.addMethod("cardNumber",function(value,element,params){
                return /^[0-9a-fA-F]{8}$/.test(value) || !value;
            }, "使用8位数字和a-f字母");

            $.validator.addMethod('isFloat', function( value, element ){
                return value.indexOf('.') == -1 && value > 0;
            }, '请输入正整数');

            //验证
            $('#J-layer-form').validate({
                rules: {
                    username: {
                        required: true,
                    },
                    password:{
                        required: that.passwrodFlag,
                    },
                    confirm_password: {
                        required: that.passwrodFlag,
                        equalTo: "#password"
                    },
                    sex:{
                        required: true,
                    },
                    department:{
                        required: true,
                    },
                    position:{
                        required: true,
                    },
                    phone:{
                        required: true,
                        number:true,
                        mobile: true,
                    },
                    job_number:{
                        required: true,
                    },
                    // id_card: {
                    //     idCard: true
                    // },
                    // card_number:{
                    //     cardNumber:true,
                    // },
                    // level: {
                    //     digits: true,
                    // },
                },
                submitHandler:function() {
                    that.itemsLoading = true;
                    let ajaxData = {
                        real_name: that.usernameInput,
//                        password: that.passwordInput,
                        sex: that.sexSelected,
                        department: that.departmentSelected,
                        position: that.positionInput,
                        phone: that.phoneInput,
                        job_number: that.jobNumberInput,
                        // id_card: that.id_card,
                        // level: that.level || 0,
                        // card_number: (that.cardInput && that.cardInput.toUpperCase()) || '',
                        // education: that.education || '',
                        // tags_set: that.tagsIdArr,
                    };
                    that.passwordInput && (ajaxData.password = that.passwordInput);
                    $.ajax({
                        url: ajaxUrl,
                        type:ajaxType,
//                        data: ajaxData,
                        contentType: 'application/json',
                        data: JSON.stringify(ajaxData),
                    }).always(function(data) {
                        that.itemsLoading = false;
                        base.ajaxCallback(data,function(){
                            that.savePrivateCar(data);
                            // layer.msg('提交成功',{icon:1, time:1000});
                            // that.$dispatch('dialog-save');
                        });
                    });
                }
            });

            $('#PrivateCarForm').validate({
                rules:{
                    car_no:{
                        required: true,

                    },
                    car_brand:{
                        required: true,
                    },
                    car_model:{
                        required: true,

                    },
                    // car_color:{
                    //     required: true,
                    // },
                    car_seats:{
                        required:true,
                        number:true,
                        isFloat:true,
                    }
                },
                submitHandler:function () {
                    let boxArr = $('.car-box');
                    let arr = [];
                    let obj = {};
                    console.log("that.items");
                    console.log(that.currentIndex);
                    console.log(that.items);
                    obj['car_no'] = $(boxArr[that.currentIndex]).find('.car_no').val();
                    obj['car_brand'] = $(boxArr[that.currentIndex]).find('.car_brand').val();
                    obj['car_model'] = $(boxArr[that.currentIndex]).find('.car_model').val();
                    obj['car_color'] = $(boxArr[that.currentIndex]).find('.car_color').val();
                    obj['seats'] = $(boxArr[that.currentIndex]).find('.car_seats').val();
                    arr.push(obj);
                    if(that.type == 'modify' && that.items[that.currentIndex].id){
                        $.ajax({
                            url:`${base.gAjaxUrl.privateCar}${that.items[that.currentIndex].id}`,
                            type:"PATCH",
                            data:obj
                        }).always((data)=>{
                            base.ajaxCallback(data,()=>{
                                that.getPrivateCarList();
                            })
                        })
                    }else if(that.type == 'modify'){
                        $.ajax({
                            url:`${base.gAjaxUrl.privateCar}bulk_create/`,
                            type:'POST',
                            contentType:'application/json',
                            data:JSON.stringify({staff_id:that.data.id, car_data:arr})
                        }).always((data)=>{
                            base.ajaxCallback(data,()=>{
                                that.getPrivateCarList();
                            })
                        })
                    }
                    that.realItemArr  = [].concat(that.items);
                    that.isComplete = true;
                    $('.error').remove();

                }
            },)
            //获取部门列表
            $.ajax({
                url: `${base.gAjaxUrl.departments}?page=1&page_size=9999999`,
                type: 'GET',
            }).always((data)=>{
                this.departmentItem = data || [];
            })
        },
        props: ['title','type','data'],
        data:function(){
            return {
                usernameInput:'',
                passwordInput:'',
                sexSelected:'',
                departmentSelected:'',
                departmentSelectedName: '',
                positionInput:'',
                phoneInput:'',
                jobNumberInput:'',
                cardInput:'',
                passwrodFlag: '', // 密码是否必填
                // id_card: '',
                // level: 0,
                departmentItem:[],
                cardNumberInput:'',
                // education: '', // 员工学历
//                employee_tag: '', // 员工标签
                isDepartmentFocus: '', // 是否显示部门列表
                // tagsArr:[],
                // tagsIdArr: [],
                // wTagsArr: [],
                sexItem:[
                    {
                        id:'1',
                        value:'男'
                    },
                    {
                        id:'2',
                        value:'女'
                    }
                ],
                isComplete:true,
                currentIndex:'',
                items:[],
                realItemArr:[], // 前端仿后台真实的数组
                itemsLoading:false,

            }
        },
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            save:function(){
                if(!this.isComplete){
                    layer.msg("请先完成当前车辆操作",{icon:2,time:1500})
                    return
                }
                if(this.realItemArr.length == 0){
                    layer.msg("请至少添加一辆私家车",{icon:2,time:1500})
                    return
                }
                // 如果编辑的状态下修改了密码,就需要用户重新设置密码
                if(this.type == 'modify' && this.data.phone !== this.phoneInput && this.passwordInput === ''){
                    this.passwrodFlag = true;
                    layer.msg('修改了电话号码,请重新设置密码',{icon:2,time:1500})
                    return
                }
                if(this.phoneInput.length == 11){
                    var id = this.getDepartmentId(this.departmentSelectedName);
                    if(!id) {
                        layer.msg('部门名称不正确',{icon:2,time:1000});
                    } else {
                        this.departmentSelected = id;
                        $('#J-layer-form').submit();
                    }
                } else {
                    layer.msg('手机号码数为11位数字哦',{icon:2,time:1000});
                }
            },
            departmentClick: function () {
                if(this.isDepartmentFocus) {
                    $(".departmentListBox").show();
                }
            },
            departmentEnter: function (flag) {
                this.isDepartmentFocus = flag;
                !flag && $(".departmentListBox").hide();
            },
            setDepartmentValue: function (item) {
                console.log("setDepartmentValue");
                this.departmentSelectedName = item.department_tree;
                this.departmentSelected = item.id;
                $(".departmentListBox").hide();
            },
            // 清除搜索输入框
            emptySearch:function(){
                this.departmentSelectedName = '';
                $(".departmentListBox").show();
            },
            getDepartmentId: function (val) {
                var id = '';
                this.departmentItem.forEach(function (item) {
                    if(item.department_tree == val) {
                        id = item.id;
                    }
                });
                return id;
            },
            savePrivateCar:function (data) {
                let that = this;
                if(this.type == 'add'){
                    let boxArr = $('.car-box');
                    let arr = [];
                    for (let i = 0,len = boxArr.length; i < len; i++) {
                        let obj = {};
                        obj['car_no'] = $(boxArr[i]).find('.car_no').val();
                        obj['car_brand'] = $(boxArr[i]).find('.car_brand').val();
                        obj['car_model'] = $(boxArr[i]).find('.car_model').val();
                        obj['car_color'] = $(boxArr[i]).find('.car_color').val();
                        obj['seats'] = $(boxArr[i]).find('.car_seats').val();
                        arr.push(obj);
                    }
                    $.ajax({
                        url:`${base.gAjaxUrl.privateCar}bulk_create/`,
                        type:'POST',
                        contentType:'application/json',
                        data:JSON.stringify({staff_id:data.id, car_data:arr})
                    }).always((data)=>{
                        base.ajaxCallback(data,()=>{

                        })
                    })
                }
                that.$dispatch('dialog-save')
            },
            // deleteTag: function (para) {
            //     this.tagsArr.splice(this.tagsArr.indexOf(para), 1);
            //     this.tagsIdArr.splice(this.tagsIdArr.indexOf(para.id), 1);
            // },
            // addTag: function (para) {
            //     if(this.tagsArr.indexOf(para) == -1) {
            //         this.tagsArr.push(para);
            //         this.tagsIdArr.push(para.id);
            //     } else {
            //         console.log("已经存在");
            //     }
            // },
            // getTagList: function () {
            //     this.itemsLoading = true;
            //     $.ajax({
            //         url: base.gAjaxUrl.staffsTag,
            //         type: 'GET',
            //         data: {
            //             page: 1,
            //             page_size: 999999,
            //         }
            //     }).always((data)=>{
            //         this.itemsLoading = false;
            //         base.ajaxCallback(data, ()=>{
            //             this.wTagsArr = data.results || [];
            //         });
            //     });
            // },
            // getTagIds: function (tagArr) {
            //     let arr = [];
            //     for(let i = 0, len = tagArr.length;i < len; i++) {
            //         arr.push(tagArr[i].id);
            //     }
            //     return arr;
            // },
            addCost:function(){
                if(!this.isComplete){
                    layer.msg('请先完成当前操作',{icon:2,time:1500})
                    return
                }
                this.items.unshift({
                     car_no:'',
                     car_brand:'',
                    car_model:'',
                    car_color:'',
                    seats:'',
                })
                this.$nextTick(()=>{
                    this.currentIndex =  0;
                    this.isComplete = false;
                })

            },
            changeCost:function (index,item) {
                // 解决该费用类型被删除之后,在下拉框中显示空白的问题
                // if(this.costTypeList.length != 0){
                //     for (let i = 0,len = this.costTypeList.length; i < len; i++) {
                //         if(this.costTypeList[i].name === item.feetype_name){
                //             break
                //         }else if(i == (len - 1)){
                //             let data = {
                //                 id:'0123',
                //                 name:item.feetype_name
                //             }
                //             this.costTypeList.unshift(data);
                //         }
                //     }
                // }else{
                //     let obj = {
                //         id:'0123',
                //         name:item.feetype_name
                //     }
                //     this.costTypeList.unshift(obj);
                // }
                this.currentIndex = index;
                this.isComplete = false;
            },
            doneChange:function (i,value) {
                this.currentIndex = i;
                $('#PrivateCarForm').submit();
            },
            deleteCost:function(item,i){
                let that = this;
                layer.confirm(`确定要删除这辆车吗?`,function(){
                    that.realItemArr.splice(i,1);
                    that.items = [].concat(that.realItemArr);
                    if(item.id){
                        $.ajax({
                            url: `${base.gAjaxUrl.privateCar}${item.id}/`,
                            type: 'DELETE',
                        }).always((data)=>{
                            base.ajaxCallback(data,()=>{
                                that.getPrivateCarList();
                            });
                        })
                    }
                    layer.closeAll("dialog");
                })
            },
            cancelChange:function () {
                this.isComplete = true;
                this.items = [].concat(this.realItemArr);
                // this.getCostList();

            },
            getPrivateCarList:function () {
                let that = this;
                this.itemsLoading = true;
                $.ajax({
                    url:`${base.gAjaxUrl.privateCar}`,
                    type:"GET",
                    data:{
                        staff:that.data.id
                    }
                }).always((data)=>{
                    this.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
                        if(data.results){
                            that.realItemArr = data.results;
                            that.items =  that.realItemArr;
                        }
                    })
                })
            },
            returnSelectEmployee:function () {
                this.$dispatch('dialog-return')
            }
        },
        filters: {
        }
    }
</script>
