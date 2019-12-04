<template>
    <header class="navbar-wrapper navbar-wrapper1">
        <div class="navbar-container">
            <div class="container-fluid cl">
                <a class="logo navbar-logo f-l mr-10" v-link="{ name: 'orderManagement' }" data-title="员工管理">
                    <img src="../assets/images/logo.png"/>
                    智慧后勤管理系统
                </a>
                <div id="J-company" class="logo navbar-slogan f-l ml-10">{{companyName}}</div>
                <div class="secondary_company fs-14 ml-10 f-l clearfix c-fff" v-if="false">
                    <div class="company_name f-l">子公司</div>
                    <select class="company_select ml-10 f-l" v-model="sonCompanyId">
                        <option value="a0001">广州拼吧信息科技有限公司</option>
                        <option value="a0002">东圃汽车客运站</option>
                    </select>
                    <a href="javascript:;" class="btn btn-primary radius ml-10 f-l seeCompany"
                       @click="seeCompany">查看</a>
                </div>
                <div class="settings f-r tc c-fff">
                    <div class="Hui-iconfont setting_icon">&#xe61d;</div>
                    <div class="changePassword tc" @click="changePassword">修改密码</div>
                    <div class="logout tc" @click="logout">注销</div>
                </div>
                <div @click="showMore" class="message-box clearfix c-fff">
                    <i class="Hui-iconfont message-icon">&#xe63b;</i>
                    <span v-show="notReadCount != 0" class="message-number c-white">{{notReadCount}}</span>
                    <div class="message-list">
                        <h4 c-gray>消息通知</h4>
                        <ul>
                            <li v-for="data in messageArr" @click="details(data)">
                                <div class="f-14">
                                    <p class="message-content c-666">
                                        <i :class="{'c-trans': data.is_read != 0}" class="Hui-iconfont c-red f-16 mr-5">
                                            &#xe6e0;</i>{{data.content}}
                                    </p>
                                    <span class="message-title c-red f-r ">{{data.title}}</span>
                                </div>
                                <div class="gray">【{{data.msg_type_name}}】<span class="f-r">{{data.ctime}}</span>
                                </div>
                            </li>
                        </ul>
                        <div class="text-c show-more fs-18">
                            <a href="javascript:" @click="showMore">查看更多</a>
                        </div>
                    </div>
                </div>
                <span class="salutatory f-r c-fff mr-5">{{welcome}}, 您好</span>
            </div>

            <ul class="inform-box">
                <li :id="'p'+data.id" class="inform-list" v-for="data in popupArr">
                    <div class="f-16">
                        <p class="message-content">
                            <i class="Hui-iconfont c-red f-20">&#xe6e0;</i>{{data.content}}
                        </p>
                        <span class="message-title c-red f-r mt-5">{{data.title}}</span>
                    </div>
                    <p class="c-gray">【{{data.msg_type_name}}】<span class="f-r">{{data.time}}</span></p>
                </li>
            </ul>
        </div>
    </header>
    <details v-if="showDetails" :data="data" @dialog-close="close"></details>
    <cp v-if="showCP" @dialog-close="closeCP"></cp>
</template>
<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';
    import messageDetails from '../components/messageDetails';
    import createWebScoket from '../assets/js/webscoket.js';
    import cp from './changePassword.vue';


    export default{
        ready(){
            if (localStorage.token) {
                this.init();
            }

            this.setCompanyName(); // 组件初始化的时候要设定好公司名称
        },
        data: function () {
            return {
                ws: "vue", // WebScoket的实例对象
                wsData: {// WebScoket的参数对象
                    url: base.gAjaxUrl.wsUrl + localStorage.getItem("companyID"),
                    time: 360000, // time: 检测连接的时长  单位为毫秒
                    text: {}, // 发送给服务器的测试连接的内容，可随便定义
                    againTime: 30000,  //重连的延迟时长，单位毫秒
                },
                popupArr: [],
                welcome: localStorage.getItem("user_name"),
                showDetails: false,
                messageArr: [],
                notReadCount: 0,
                companyName: '',
                sonCompanyId: 'a0001', // 选中的子公司 id
                showCP: false,
            }
        },
        events: {
            refreshTop: function () {
                this.refreshData();
                this.setCompanyName();
            },
            loginIn: function () {
                this.welcome = localStorage.getItem("user_name");
                this.setCompanyName();
//				this.init();
            },
        },
        methods: {
            // 对top组件进行设置公司名称
            setCompanyName: function () {
                this.companyName = localStorage.getItem("companyName") || "";
            },
            init: function () {
                createWebScoket(this);
                this.refreshData();
            },
            refreshData: function () {
                this.getMessage();
                this.getNotReadMessage();
            },
            logout: function () {
                // 注销
                // 显示加载的loading
                layer.load();
                $.ajax({
                    url: base.gAjaxUrl.adminLogout,
                    type: 'POST',
                }).always((data)=> {
                    layer.closeAll('loading');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user_name');
                    localStorage.removeItem('companyName');
                    this.$route.router.go({path: '/login', replace: true})
                    GLOBAL_AUTHOR = null;
                })
            },
            getMessage: function () {
                let that = this;
                $.ajax({
                    url: base.gAjaxUrl.messages,
                    type: "GET",
                }).always((data)=> {
                    base.ajaxCallback(data, function () {
                        that.messageArr = [];
                        let dataArr = data.results;
                        if (dataArr.length > 5) {
                            for (var i = 0; i < 5; i++) {
                                that.messageArr.push(data.results[i])
                            }
                        } else {
                            that.messageArr = data.results
                        }
                    })
                })

            },
            getNotReadMessage: function () {
                let that = this;
                $.ajax({
                    url: base.gAjaxUrl.messages,
                    type: "GET",
                    data: {
                        msg_type: '',
                        is_read: 0,
                        page: 1,
                        page_size: 10,
                    }
                }).always((data)=> {
                    base.ajaxCallback(data, function () {
//						console.log("未读信息");
//						console.log(data.results);
                        that.notReadCount = data.count;
                    })

                })
            },
            close: function () {
                this.showDetails = false;
                this.getNotReadMessage();
            },
            details: function (data) {
                let that = this;
                console.log(data)
                if (data.is_read == 0) {
                    $.ajax({
                        url: `${base.gAjaxUrl.messages}${data.id}/read/`,
                        type: "GET"
                    }).always((data)=> {
                        base.ajaxCallback(data, function () {
                            that.getMessage();
                            that.getNotReadMessage();
                            that.$emit('refresh');
                        })
                    })
                }
                this.showDetails = true;
                this.data = data;
            },
            showMore: function () {
                this.$route.router.go({path: '/messageCenter', replace: false});

            },
            monitorMessage: function () {
                let that = this;
                this.ws.addEventListener("message", function (e) {
                    console.log("连接成功了");
                    if (e.data == 0) return; // 第一次连接成功,会接收到空的信息,所以要判断一下
                    let data = JSON.parse(e.data);
                    that.popupArr.unshift(data);
                    that.$nextTick(function () {
                        that.initPopup(data)
                    })
                })
            },
            initPopup: function (data) {
                let that = this;
                let item = $("#p" + data.id);
                item.slideDown(100, function () {
                    that.getMessage();
                    that.getNotReadMessage();
//					console.log(that.popupArr);
                    setTimeout(function () {
                        item.slideUp(100, function () {
                            that.popupArr.splice(that.popupArr.indexOf(data), 1);
                        })
                    }, 10000)
                })
            },
            seeCompany: function () {
                if (this.sonCompanyId) {
                    console.log("seeCompanyId", this.sonCompanyId);
                } else {
                    layer.msg("您尚未选择子公司", {icon: 2, time: 1500});
                }
            },
            changePassword: function () {
                console.log("changePassword");
                this.showCP = true;
            },
            closeCP: function () {
                this.showCP = false;
            }
        },
        components: {
            details: messageDetails,
            cp: cp,
        }
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .navbar-container {
        background-color: #34474E;
        min-width: 1200px;
        height: 44px;
        line-height: 44px;
        .logo {
            img {
                height: 30px;
                vertical-align: -9px;
            }
        }
        .navbar1 {
            background-color: #36474f;
        }
        .secondary_company {
            .seeCompany {
                height: 26px;
                line-height: 16px;
                margin-top: 9px;
            }
            .company_select {
                height: 26px;
                margin-top: 9px;
            }
        }
        .settings {
            width: 100px;
            height: 44px;
            overflow: hidden;
            transition: all 0.2s ease;
            &:hover {
                height: 104px;
                background-color: #393939;
            }
            .setting_icon {
                font-size: 26px;
            }
            .changePassword, .logout {
                line-height: 30px;
                cursor: pointer;
                background-color: #36474f;
                color: white;
            }
            .changePassword:hover, .logout:hover {
                background-color: #4A708B;

            }
            .logout {
                /*border-radius: 0 0 5px 5px;*/
            }
        }
    }

    .message-box {
        position: relative;
        float: right;
        width: 80px;
        height: 44px;
        top: 0;
        text-align: center;
        .message-list {
            position: absolute;
            top: 43px;
            right: -50px;
            height: 0;
            line-height: 1.6;
            width: 300px;
            overflow: hidden;
            color: black;
            transition: all 0.4s;
            background-color: white;
            box-shadow: -10px 10px 5px #888888;
            text-align: left;
            h4 {
                background-color: #f2f2f2;
                margin: 0;
                height: 50px;
                line-height: 50px;
                border-bottom: 1px solid #c7c7c7;
                text-indent: 5px;
                text-align: center;
            }

            li {
                background-color: white;
                padding: 10px;
                padding-bottom: 0;
                height: 65px;
                border-bottom: 1px solid #c7c7c7;
                cursor: pointer;
                .gray {
                    font-size: 12px;
                    margin-top: 3px;
                    color: #c4c4c4;
                    text-indent: 16px;
                    span {
                        margin-top: 4px;
                    }
                }
                p {
                    margin: 0;
                }
            }
            li:hover {
                background-color: #393939;
                p {
                    color: white;
                }
            }
        }

        .message-icon {
            font-size: 30px;
        }
        .message-number {
            position: absolute;
            /*width: 20px;*/
            min-width: 10px;
            padding: 0 5px;
            height: 20px;
            /*padding: 0 6px;*/
            line-height: 18px;
            right: 15px;
            top: 3px;
            text-align: center;
            font-size: 12px;
            background-color: red;
            border-radius: 10px;
        }
        .show-more {
            height: 50px;
            line-height: 50px;
            cursor: pointer;
        }

    }

    .message-box:hover {
        background-color: #333333;
        .message-list {
            height: 480px;
        }
    }

    .message-title {
        width: 30%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .message-content {
        display: inline-block;
        width: 60%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .c-trans {
        color: transparent;
    }

    .inform-box {
        position: absolute;
        top: 50px;
        right: 40px;
        z-index: -1;
        li {
            display: none;
            height: 90px;
            /*height: 0;*/
            width: 270px;
            padding: 0 10px;
            background-color: #f2f2f2;
            border-radius: 8px;
            box-shadow: 5px 5px 5px #888888;
            margin-top: 5px;
            div {
                height: 50px;
            }

        }
    }

</style>

