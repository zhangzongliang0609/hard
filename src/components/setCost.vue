<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">
            设置订单费用
        </div>
        <div class="layui-layer-content pd-20">
            <div class="layui-layer-wrap">
                <div class="text-l clearfix">
                    <div>
                        <div class="l item mr-15">乘车人:{{order.passenger_name
                            ?order.passenger_name : order.staff_vo.real_name}}</div>
                        <div class="l item mr-15">起点/终点:{{order.source_name}}/{{order.destination_name}}</div>
                        <div class="l item mr-15">出发时间:{{order.ride_time}}</div>
                        <div class="l item mr-15">结束时间:{{order.end_time}}</div>
                        <div class="l item mr-15">人数:{{order.passenger_number}}</div>
                        <div class="l item mr-15">拼车/加急:{{order.is_carpool? '是': '否'}}/{{order.is_urgent? '是': '否'}}</div>
                    </div>
                </div>
                <div class="btn btn-primary radius mt-5" v-on:click="addCost()">添加费用</div>

                <div class="slice-box">
               <form action="" id="J-layer-form" class="form-box-set-cost">
                <table class="table table-border table-bordered table-bg table-sort row content-box ">
                        <thead>
                        <tr class="text-c">
                            <th width="150">费用名称</th>
                            <th width="100">金额</th>
                            <th width="100">操作员</th>
                            <th width="150">操作</th>
                        </tr>
                        </thead>
                        <tbody class="slice-box">
                        <tr class="text-c" v-for="bill in items">
                            <td class="relative" width="150">
                                <span v-show="isComplete || currentIndex !== $index " class="f-16">{{bill.feetype_name}}</span>
                                <select v-show="!isComplete && currentIndex === $index" name="costType" :value="bill.feetype_name | findId"   class="select mt-5 cost-type" :class="{'select-mask':isComplete || currentIndex !== $index}" :disabled="isComplete && currentIndex !== $index">
                                    <option :value="cost.id" v-for="cost in costTypeList">{{cost.name}}</option>
                                </select>
                            </td>
                            <td width="100" class="relative">
                                <input type="text" name="price" :value="bill.fee" class="input-text cost-price" :disabled="isComplete || currentIndex !== $index">
                            </td>
                            <td width="100">
                                <span class="operator f-16">
                                    {{bill.operator}}
                                </span>
                            </td>
                            <td width="150">
                                <div v-show="isComplete">
                                    <a href="javascript:;" class="btn btn-secondary radius" @click="changeCost($index,bill)">修改</a>
                                    <a href="javascript:;" class="btn btn-danger radius" @click="deleteCost(bill)">删除</a>
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
                <div class="text-c cl mt-20">
                </div>
                <div id="J-page" class="m-page row" v-show="!noData"></div>
                <div class="no-data text-c mt-50 row" v-if="noData">没有相关数据</div>
            </div>
        </div>
        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>

    </div>
    <div class="layui-layer-shade"></div>
    <div class="m-loading" v-if="itemsLoading">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
</template>
<style>
    #J-layer-form.form-box-set-cost label.error {
        right: 10px;
        position: absolute;
        top: 15px;
        color: #ef392b;
        font-size: 12px;
    }
</style>
<style lang="less" rel="stylesheet/less" scoped>

    .label-box{
        width: 20%;
        line-height: 31px;
    }
    .layui-modify{     margin-left: -400px;

    }
    .select{
        height: 31px;
        margin-top: 2px ;
    }
    .select-mask{
        width: 100%;
        background-color: #ebebe4;filter:Alpha(Opacity=60);opacity:0.6;
    }
    .slice-box{
        max-height: 400px;
        overflow:auto;
    }
    .layui-layer-content{
        overflow: hidden !important;
    }


</style>
<script>
    import * as base from '../assets/js/base.js';
    // import moment from "moment";
    // let staffsOps = {
    //     param:{
    //         page:1,
    //         page_size:999999,
    //     }
    // }
    export default{
        ready(){
            let that = this;
            this.getCostTypeList();
            jQuery.validator.addMethod("isInt", function(value, element) {
                let reg = /^([1-9]\d*\.?|0\.)\d{0,2}$/;
                return reg.test(value)
            }, "最多输入2位小数");
            jQuery.validator.addMethod("isFloat", function(value, element) {
                return value > -1
            }, "不能为负数");

            // jQuery.validator.addMethod("isInt", function(value, element) {
            //
            //     return value > 0 ;
            // }, "金额不能是负数");

            $('#J-layer-form').validate({
                rules:{
                    price:{
                        required: true,
                        number:true,
                        isInt:true,
                        isFloat:true,
                    },
                    costType:{
                        required: true,
                    }
                },
                submitHandler:function () {
                    that.itemsLoading = true;
                    that.isComplete = true;
                    let i = that.currentIndex;
                    let costType = $(".cost-type").eq(i).val();
                    let price = $(".cost-price").eq(i).val();
                    if(that.items[i].id){
                        let costTypeName = that.searchTypeName(costType);
                        if(that.items[i].feetype_name !== costTypeName || that.items[i].fee !== (+price) ){
                            let data = {fee:+price};
                            if(costType !== '0123'){
                                data['feetype'] = costType;
                            }
                            $.ajax({
                                url:`${base.gAjaxUrl.officialCarFees}${that.items[i].id}/`,
                                type:'PATCH',
                                contentType:'application/json',
                                data:JSON.stringify(data)
                            }).always((data)=>{

                                base.ajaxCallback(data,()=>{
                                    that.getCostList()
                                })
                            })
                        }
                        that.itemsLoading = false;
                    }else{
                        $.ajax({
                            url:`${base.gAjaxUrl.officialCarFees}`,
                            type:'POST',
                            contentType:'application/json',
                            data:JSON.stringify({
                                feetype:costType,
                                fee:price,
                                order:that.order.id,
                            })
                        }).always((data)=>{
                            that.itemsLoading = false;
                            base.ajaxCallback(data,()=>{
                                that.getCostList()
                            })
                        })
                    }

                }
            },)
        },
        data:function () {
            return{
                itemsLoading:false,
                noData:false,
                isComplete:true,
                currentIndex:'',
                items:[],
                costTypeList:'',
                oldCostName:'',
                oldCost:'',
            }
        },
        props:['order'],
        methods:{
            getCostList:function () {
                let that = this;
                this.itemsLoading = true;
                this.currentIndex  = '';

                if(this.costTypeList[0] && this.costTypeList[0].id === '0123'){
                    this.costTypeList.splice(0,1);
                }
                $.ajax({
                    url: `${base.gAjaxUrl.officialCarFees}`,
                    type: 'GET',
                    data:{
                        order:`${that.order.id}`,
                        page:1,
                        page_size:99999999,
                    }
                }).always((data)=>{
                    that.itemsLoading = false;
                    base.ajaxCallback(data,()=>{
                        let orderCost = 0; // 外层表单上显示的费用
                        if(data.results){
                            that.items = data.results
                            for (let i = 0,len = data.results.length ; i < len; i++) {
                              if(typeof (data.results[i].fee) ==='number'){
                                  orderCost += data.results[i].fee;
                              }
                            }
                        }else{
                            that.items = [];
                        }
                        that.$dispatch('changeCost',orderCost)
                    });
                })
            },
            getCostTypeList:function () {
                let that = this;
                $.ajax({
                    url: `${base.gAjaxUrl.officialCarFeeTypes}`,
                    type: 'GET',
                    data:{
                      page:1,
                      page_size:999999,
                    },
                }).always((data)=>{
                    base.ajaxCallback(data,()=>{
                        that.costTypeList = data.results;
                        that.getCostList();
                    });
                })


            },
            addCost:function(){
                this.items.unshift({
                    feetype_name:this.costTypeList[0] ? this.costTypeList[0].name : '',
                })
                this.$nextTick(()=>{
                    this.currentIndex =  0;
                    this.isComplete = false;
                })

            },
            deleteBill:function (i) {
                this.items.splice(i,1);
            },
            close:function () {
                this.$dispatch('close')

            },
            changeCost:function (index,item) {
                // 解决该费用类型被删除之后,在下拉框中显示空白的问题
                if(this.costTypeList.length != 0){
                    for (let i = 0,len = this.costTypeList.length; i < len; i++) {
                        if(this.costTypeList[i].name === item.feetype_name){
                            break
                        }else if(i == (len - 1)){
                            let data = {
                                id:'0123',
                                name:item.feetype_name
                            }
                            this.costTypeList.unshift(data);
                        }
                    }
                }else{
                    let obj = {
                        id:'0123',
                        name:item.feetype_name
                    }
                    this.costTypeList.unshift(obj);
                }
                this.currentIndex = index;
                this.isComplete = false;
            },
            doneChange:function (i) {
                this.currentIndex = i;
                $('#J-layer-form').submit();
            },
            deleteCost:function(item){
                let that = this;
                layer.confirm(`确定要删除这条费用吗?`,function(){
                    $.ajax({
                        url: `${base.gAjaxUrl.officialCarFees}${item.id}`,
                        type: 'DELETE',
                        success:function(){
                            that.getCostList();
                        }
                    }).always((data)=>{
                    })
                    layer.closeAll("dialog");
                })
            },
            cancelChange:function () {
                this.isComplete = true;
                this.getCostList();

            },
            searchTypeName:function(typeId){
                for (let i = 0,len = this.costTypeList.length; i < len; i++) {
                    if(this.costTypeList[i].id === typeId){
                        return this.costTypeList[i].name
                    }
                }
            },

        },
        filters:{
            findId:function (value) {
                for (let i = 0,len = this.costTypeList.length; i < len; i++) {
                    if(this.costTypeList[i].name === value){
                        return this.costTypeList[i].id
                    }
                }
            }
        },
        events:{},
        components:{},
    }
</script>