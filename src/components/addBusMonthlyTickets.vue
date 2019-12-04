<template>
    <div class="layui-layer layui-anim layui-layer-page layui-modify">
        <div class="layui-layer-title">{{type == 'add' ? '新增' : '修改'}}月票</div>
        <div class="layui-layer-content">
            <form id="J-layer-form" class="form form-horizontal layui-layer-wrap">
                <div id="fitbus">
                    <div id="row cl" class="row cl">
                        <label class="form-label f-l col-4 "><span class="c-red">*</span>月票名称：</label>
                        <div id="ticketNameInputid" class="formControls f-l col-4">
                            <input v-model="ticketNameInput" type="text" class="input-text" value="" placeholder=""
                                   name="ticket_name">
                        </div>
                    </div>
                    <div class="row cl">
                        <label class="form-label f-l col-4 "><span class="c-red">*</span>有效期：</label>
                        <div class="formControls f-l col-4">
                            <input v-model="dayInput" style="width: 100%" type="number" class="input-text"
                                   placeholder="请输入非负整数" name="day">
                        </div>
                        <div class="f-l form-label ml-5">天</div>
                    </div>
                    <div class="row cl">
                        <label class="form-label f-l col-4 "><span class="c-red">*</span>价格：</label>
                        <div class="formControls f-l col-4">
                            <input v-model="priceInput" type="text" class="input-text" value="" placeholder="请输入非负整数"
                                   name="price">
                        </div>
                        <div class="f-l form-label ml-5">元</div>
                    </div>
                    <div class="row cl">
                        <label class="form-label f-l col-4 ">说明：</label>
                        <div class="formControls f-l col-4">
                            <textarea v-model="ticketDescpInput" class="input-text area-text" placeholder=""
                                      name="ticket_descp"></textarea>
                        </div>
                    </div>
                </div>
                <div class="row cl">
                    <label class="form-label f-l col-4 "><span class="c-red">*</span>适用班次：</label>
                    <div class="formControls f-l col-7">
                        <div class="m-multiple-select clearfix">
                            <div id="area-l" class="area-l">
                                <div class="bd">
                                    <a v-if="selectedBusItems.indexOf(item.id)<0"
                                       v-bind:class="[addItemTemp.indexOf(item.id)>-1 ? 'active' : '']"
                                       v-bind:data-id="item.id" v-for="item in busItems" href="javascript:;"
                                       v-on:click="clickAddItemTemp(item.id)">{{item.shuttle_name}}</a>
                                </div>
                            </div>
                            <div id="s-btn" class="s-btn">
                                <a class="btn btn-primary size-MINI radius" href="javascript:;"
                                   v-on:click="clickBtnAdd">添加</a>
                                <a class="btn btn-primary size-MINI radius" href="javascript:;"
                                   v-on:click="clickBtnDelete">删除</a>
                            </div>
                            <div id="area-r" class="area-r">
                                <div class="bd">
                                    <a v-if="selectedBusItems.indexOf(item.id)>=0"
                                       v-bind:class="[deleteItemTemp.indexOf(item.id)>-1 ? 'active' : '']"
                                       v-bind:data-id="item.id" v-for="item in busItems" href="javascript:;"
                                       v-on:click="clickDeleteItemTemp(item.id)">{{item.shuttle_name}}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <span class="layui-layer-setwin">
            <a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;"
               v-on:click="close()"></a>
        </span>
        <div id="save" class="layui-layer-btn" v-on:click="save"><a class="layui-layer-btn0">保存</a></div>
    </div>
    <div class="layui-layer-shade"></div>
</template>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    export default{
        ready () {

            let that = this;
            let ajaxUrl = '';
            let ajaxType = '';
            let getData = this.data;

            base.verticalCenter('.layui-modify');

            //获取班次
            $.ajax({
                url: base.gAjaxUrl.shuttlebuses,
                type: 'GET',
                data: {
                    page: 1,
                    page_size: 999999,
                }
            }).always((data)=> {
                base.ajaxCallback(data, () => {
                    this.busItems = data.results;
                })
            });

            //类型判断
            if (this.type == 'add') {
                ajaxUrl = base.gAjaxUrl.busmonthlytickets;
                ajaxType = 'POST';

                this.ticketNameInput = '';
                this.priceInput = '';
                this.ticketDescpInput = '';
            } else if (this.type == 'modify') {
                ajaxUrl = `${base.gAjaxUrl.busmonthlytickets}${getData.id}/`;
                ajaxType = 'PUT';
                this.ticketNameInput = getData.ticket_name;
                this.priceInput = getData.price / 100;
                this.ticketDescpInput = getData.ticket_descp;
                this.dayInput = getData.day;
                this.selectedBusItems = getData.shuttle_buses;
            }

            //验证
            $('#J-layer-form').validate({
                rules: {
                    ticket_name: {
                        required: true,
                    },
                    day: {
                        required: true,
                        digits: true
                    },
                    price: {
                        required: true,
                        digits: true
                    },
                },
                submitHandler: function () {
                    $.ajax({
                        url: ajaxUrl,
                        type: ajaxType,
                        contentType: 'application/json',
                        data: JSON.stringify({
                            ticket_name: that.ticketNameInput,
                            price: that.priceInput * 100,
                            day: that.dayInput,
                            ticket_descp: that.ticketDescpInput,
                            shuttle_buses: that.selectedBusItems
                        })
                    }).always(function (data) {
                        let len = that.selectedBusItems.length;
                        if (len > 0) {
                            base.ajaxCallback(data, function () {
                                layer.msg('提交成功', {icon: 1, time: 1000});
                                that.$dispatch('dialog-save');
                            });
                        } else {
                            layer.msg('请先选择适用班次', function () {
                                //关闭后的操作
                            });
                        }
                    });

                }
            });

            setTimeout(function () {
                that.init();
            }, 200);
        },

        props: ['type', 'data'],
        data: function () {
            return {
                busItems: [],      //班次列表
                addItemTemp: [],     //添加数据到缓存区
                deleteItemTemp: [],  //删除数据到缓存区
                selectedBusItems: [],  //选中班次
                ticketNameInput: '',
                priceInput: '',
                dayInput: '',
                ticketDescpInput: ''
            }
        },
        methods: {
            init: function () {

                //判断是否是第一次进入该新功能或页面从而弹出新功能的提示
                if (localStorage.addBusMonthlyTicketsPromptFlag == 'true') {
                    let arrObj = [$('#fitbus'), $('#area-l'), $('#s-btn'), $('#area-r'), $('#save')];
                    /*$('check'),$('exportData'),*/
                    let arrTitle = ['先填写好月票名称、价格、说明哦', '再点击选择这边的内容', '把选择的内容添加到右边框里或删除', '添加的内容选项在这里了哦', '最后点击保存就可以了',];
                    /*'点击这里可以查看到搭乘详情哦','点击这里可以导出想要的订单详情哦',*/
                    var promptTypes = ['addBusMonthlyTicketsPromptFlag',];
                    $.guidance({
                        obj: arrObj,
                        title: arrTitle,
                        flag: promptTypes,
                    });
                }
            },
            close: function () {
                this.$dispatch('dialog-close');
            },
            save: function () {
                $('#J-layer-form').submit();
            },
            clickAddItemTemp: function (id) {
                let idIdexOf = (this.addItemTemp).indexOf(id);
                if (idIdexOf < 0) {
                    this.addItemTemp.push(id)
                } else {
                    this.addItemTemp.splice(idIdexOf, 1)
                }
            },
            clickBtnAdd: function () {
                $(this.addItemTemp).each((i, e)=> {
                    this.selectedBusItems.push(e)
                })
                this.addItemTemp = [];
            },
            clickDeleteItemTemp: function (id) {
                let idIdexOf = (this.deleteItemTemp).indexOf(id);
                if (idIdexOf < 0) {
                    this.deleteItemTemp.push(id)
                } else {
                    this.deleteItemTemp.splice(idIdexOf, 1)
                }
            },
            clickBtnDelete: function () {
                $(this.deleteItemTemp).each((i, e)=> {

                    let idIdexOf = (this.selectedBusItems).indexOf(this.deleteItemTemp[i]);

                    if (idIdexOf > -1) {
                        this.selectedBusItems.splice(idIdexOf, 1)
                    }
                })
                this.deleteItemTemp = [];
            },
        }
    }
</script>
  