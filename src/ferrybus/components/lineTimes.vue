<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify building-box">
        <div class="layui-layer-title">时刻表</div>
        <div class="layui-layer-content">
            <div class="inline-block clearfix">
                <span class="f-l lh-31">请选择日期：</span>
                <input autocomplete="off"
                       v-model="startDateInput"
                       type="text"
                       class="input-text f-l"
                       style="width:200px;"
                       v-el:input_time />
            </div>
            <div class="time_box clearfix mt-15">
                <span v-for="(index, item) in timesArr"
                      :class="{'ml-20': index % 7 != 0, 'mt-15': index > 6}"
                      class="f-l time_item">{{item.time}}</span>
            </div>
        </div>
        <span class="layui-layer-setwin">
        <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" v-on:click="close()"></a>
    </span>

    </div>
    <div class="layui-layer-shade"></div>
</template>

<style lang="less"  rel="stylesheet/less" scoped>

    .building-box.layui-layer-page {
        width: 620px;
        box-sizing: border-box;
        .layui-layer-content{
            padding-left: 15px;
            padding-right: 15px;
            padding-bottom: 20px;
            height: 320px;
            box-sizing: border-box;
            .time_box {
                padding: 15px;
                height: 220px;
                box-sizing: border-box;
                overflow: auto;
                border: 1px solid #ccc;
                .time_item {
                    width: 60px;
                    height: 30px;
                    border: 1px solid #858c96;
                    border-radius: 4px;
                    box-sizing: border-box;
                    line-height: 28px;
                    text-align: center;
                    color: #858c96;
                }
            }
        }
    }

</style>
<script>

    import * as base from '../../assets/js/base.js';
    import moment from 'moment';

    export default{
        props:['line_id'],
        ready () {
            window._this = this;
            if(!this.line_id) {
``
            } else {
                new Kalendae.Input(this.$els.input_time, {
                    months: 1,
                    // direction: 'today-future',
                    subscribe: {
                        'date-clicked': function (date) {
                            this.startDateInput = date._i;
                            setTimeout(() => {
                                this.getList();
                            });
                        }.bind(this)

                    },
                    clickHide: true,
                });
                this.getList();
            }
            // function getTime(n) {
            //     return moment(new Date().getTime() + n * 1800).format('HH:MM');
            // }
            // while (this.timesArr.length < 200) {
            //     this.timesArr.push({
            //         time: getTime(this.timesArr.length),
            //         id: Math.random().toFixed(16).slice(2, -1)
            //     })
            // }

        },
        data(){
            return{
                startDateInput: moment().format('YYYY-MM-DD'),
                timesArr:[],
            }
        },
        methods: {

            getList () {
                $.showLoading();
                $.ajax({
                    url:base.gAjaxUrl.ferryBusDates + 'times/',
                    type:'GET',
                    data:{
                        shuttle_date:this.startDateInput,
                        shuttlebus_id: this.line_id
                    }
                }).always((data)=> {
                    $.hideLoading();
                    base.ajaxCallback(data,()=> {
                        this.timesArr = data;
                    });
                })

            },
            close:function(){
                this.$dispatch('dialog-close');
            },
        },

    }

</script>
