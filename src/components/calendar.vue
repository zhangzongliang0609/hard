<template>
<div class="dialog-calendar layui-layer layui-anim layui-layer-page layui-modify">
    <div class="layui-layer-title">编辑班车日期</div>
    <div id="J-calendar" class="layui-layer-content">
        <div class="date-color mt-20 ml-20 text-l">
            <ul>
                <li>
                    <span class="red"></span>
                    已过期
                </li>
                <li>
                    <span class="green"></span>
                    已售
                </li>
                <li>
                    <span class="selected"></span>
                    选中
                </li>
            </ul>
        </div>
    </div>
    <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>
    <div class="layui-layer-btn" v-on:click="save"><a class="layui-layer-btn0">保存</a></div>
</div>
<div class="layui-layer-shade"></div>
</template>

<style lang="less">
#app{
    .dialog-calendar{
        width: 500px;
        margin-left:-250px;
    }
    .date-color{
        height:20px;
        line-height: 20px;
        li{
            display: inline-block;
        }
        span{
            width: 20px;
            height:20px;
            float:left;
            border-radius: 3px;
            margin:0 5px;
            &.green{
                background: green;
            }
            &.red{
                background: red;
            }
            &.selected{
                background: #7EA0E2;   
            }
        }
    }
}
</style>
<script>
import * as base from '../assets/js/base.js';
    //添加数据
    let newAddArr = [];
    //删除数据
    let newDeleteArr = [];
    export default{
        ready () {
            let that = this;
            // 售票日期
            let saleDates = this.saledates;
            //已选中日期
            let sourceDate = this.sourcedate;
            //不能删日期
            let notDeleteArr = _.intersection(saleDates,sourceDate);

            // console.log('售卖日期')
            // console.log(saleDates)
            // console.log('选中日期')
            // console.log(sourceDate)
            // console.log('售卖+选中=不能删')
            // console.log(notDeleteArr) 
            
            newAddArr = [];
            newDeleteArr = [];

            new Kalendae({
                attachTo:document.getElementById('J-calendar'),
                months: 2,
                mode: 'multiple',
                selected:this.sourcedate, 
                direction:'today-future',
                subscribe: {
                    'date-clicked': function (date) {
                        let todayTimeStamp = new Date($('.k-today').attr('data-date')).getTime();
                        let currentDate = date._i;
                        let currentTimeStamp = new Date(currentDate).getTime();

                        //不能删除过去的日期 或 删除已售日期
                        if(currentTimeStamp < todayTimeStamp || notDeleteArr.indexOf(date._i)>=0){
                            layer.msg('操作失败',{icon:2,time:1000});
                            return false;  
                        }else{
                            //是否已选日期
                            if(_.includes(sourceDate,currentDate)){
                                //删除日期
                                let deleteArrOf = newDeleteArr.indexOf(currentDate);
                                if(deleteArrOf<0){
                                    newDeleteArr.push(currentDate);
                                }else{
                                    newDeleteArr.splice(deleteArrOf, 1);
                                }
                            }else{
                                //添加日期    
                                let addArrIndexOf = newAddArr.indexOf(currentDate);
                                if(addArrIndexOf<0){
                                    newAddArr.push(currentDate);
                                }else{
                                    newAddArr.splice(addArrIndexOf, 1);
                                }
                            }
                        }
                    },
                    'view-changed':function(){
                        setTimeout(function(){
                            dateColor();    
                        },50)
                    }
                }
            });
            $('.k-in-month').on('click',function(){
                dateColor();
            })
            
            base.verticalCenter('.layui-modify'); 
            dateColor();
            function dateColor(){
                let todayTimeStamp = new Date($('.k-today').attr('data-date')).getTime();
                $('.k-in-month, .k-out-of-month').each(function(){
                    let thisDate = $(this).attr('data-date');
                    let thisTimeStamp = new Date(thisDate).getTime();
                    //过期
                    if(thisTimeStamp<todayTimeStamp){
                        $(this).addClass('expire');
                    }
                    //已售
                    if(_.includes(notDeleteArr, thisDate)){
                        $(this).addClass('sales');
                    }
                })
            }                
            
        },
        //动态传值
        props: ['title','type','sourcedate','saledates','busid'], 
        methods: {
            close:function(){
                this.$dispatch('dialog-close');
            },
            save:function(){
                let that = this;
                let busIdData = this.busid;

                //添加
                let ajaxAddData = {
                    departure_date:newAddArr
                }
                $.ajax({
                    url: `${base.gAjaxUrl.shuttlebuses}${busIdData}/bulk_create_date/`,
                    contentType: 'application/json',
                    data:JSON.stringify(ajaxAddData)
                })
                .always((data)=>{
                    base.ajaxCallback(data,function(){
                        //删除
                        let ajaxDeleteData = {
                            departure_date:newDeleteArr
                        }
                        $.ajax({
                            type:'DELETE',
                            url: `${base.gAjaxUrl.shuttlebuses}${busIdData}/bulk_delete_date/`,
                            contentType: 'application/json',
                            data:JSON.stringify(ajaxDeleteData)
                        })
                        .always((data)=>{ 
                            layer.msg('保存成功',{icon:1,time:1000});
                            that.$dispatch('dialog-save');
                        }) 
                    });
                }) 
            }
        }
    }
</script>
