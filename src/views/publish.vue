<template>
    <section class="Hui-article-box">
    <div class="page-container">
        <div class="cl pd-5 bg-1 bk-gray"> 
            <span class="l">
                <a class="l btn btn-primary radius" v-link="{ name: 'notice'}">返回</a>
            </span> 
        </div>
        <form id="J-publish-form" class="form form-horizontal publish-form">
            <div class="row cl">
                <label class="form-label f-l col-2"><span class="c-red">*</span>标题：</label>
                <div class="formControls f-l col-4">
                    <input v-model="" type="text" class="input-text" value="" placeholder="" name="">
                </div>
            </div> 
            <div class="row cl">
                <label class="form-label f-l col-2"><span class="c-red">*</span>作者：</label>
                <div class="formControls f-l col-4">
                    <input v-model="" type="text" class="input-text" value="" placeholder="" name="">
                </div>
            </div> 
            <div class="row cl">
                <label class="form-label f-l col-2"><span class="c-red">*</span>接收部门：</label>
                <div class="formControls f-l col-4">
                    <input v-model="" type="text" class="input-text" value="" placeholder="" name="">
                </div>
            </div> 
            <div class="row cl">
                <label class="form-label f-l col-2"><span class="c-red">*</span>内容：</label>
                <div class="formControls f-l col-8">
                    <textarea v-model="\" class="input-text" value="" placeholder="" name=""></textarea>
                </div>
            </div> 
            <div class="row cl">
                <label class="form-label f-l col-2"></label>
                <div class="formControls f-l col-4">
                    <a class="l btn btn-success radius publish-btn">发布</a>
                </div>
            </div> 

            
        </form>

    </div>
    </section>
</template>

<style lang="less" scoped>
.publish-form{
    textarea{
        height:200px;
    }
    .form-label{
        padding-right:0;
    }

}
</style>

<script>
    import * as base from '../assets/js/base.js';
    let rideDetailReportOps = null;

    export default{
        ready () {
            rideDetailReportOps = {
                param:{
                    search:'',
                    start_date:'',
                    end_date:''
                },
                page:1,
                page_size:10
            };
            //验证
            $('#J-publish-form').validate({    
                rules: {  
                    shuttle_name:{
                        required: true,
                    },         
                    departure_time: {
                        required: true,
                    },
                    apply_expired_minutes: {
                        required: true,
                    },
                    seats: {
                        required: true,
                    },
                    price: {
                        required: true,
                        digits:true
                    }

                },                 
                submitHandler:function() {
                    let ajaxStation = [];
                    $('.J-station-item').each(function(){
                        ajaxStation.push({"station_name":$(this).val()});
                    })
                    // console.log(ajaxStation)
                    let ajaxData = {
                        shuttle_name:that.shuttleNameInput,
                        departure_time: that.departureTimeInput,
                        apply_expired_minutes:that.applyExpiredMinutesInput,
                        seats: that.seatsInput,
                        price: that.priceInput*100,
                        busstation_set: ajaxStation,
                    }

                    $.ajax({
                        url: ajaxUrl,
                        contentType: 'application/json',
                        type:ajaxType,
                        data: JSON.stringify(ajaxData)
                    })
                    .always(function(data) {
                        base.ajaxCallback(data,function(){
                            layer.msg('保存成功',{icon:1,time:1000});
                            that.$dispatch('dialog-save');
                        });
                    });
                    
                }             
            }); 
        },
        data:function(){
            return {
                items: [],
                noData:false,
            }
        },
        methods: {


        },
        components:{
            
        }
    }
</script>