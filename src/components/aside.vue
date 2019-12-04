<template>
    <aside class="Hui-aside Hui-aside1">
        <div class="menu_dropdown bk_2">

            <dl v-for="menu in asideData" v-if="menu.keyword | isShowGroup">
                <dt v-if="menu.child && menu.child.length"><img class="menu-item" :src="menu.keyword | srcFun" alt="">&nbsp;&nbsp;{{menu.name}}<i
                        class="Hui-iconfont menu_dropdown-arrow ">&#xe6d5;</i></dt>

                <dt v-else class="notice">
                    <a v-link="{ name: menu.keyword }" data-title="{{menu.name}}" href="javascript:;">
                        <img
                                class="menu-item" :src="menu.keyword | srcFun" alt="">
                        &nbsp;&nbsp;{{menu.name}}</a>
                </dt>

                <dd v-if="menu.child && menu.child.length">
                    <ul>
                        <li v-if="item | isAliveAndSuper" v-for="item in menu.child">
                            <a v-link="{ name: item.keyword }" :data-title="item.name"
                               href="javascript:;">{{item.name}}</a>
                        </li>
                    </ul>
                </dd>
            </dl>

            <!--<dl>-->
            <!--<dt class="notice"><a v-link="{ name: 'remind' }" data-title="提醒事项" href="javascript:;"><img-->
            <!--class="menu-item" src="../assets/images/remind-g.png" alt="">&nbsp;&nbsp;提醒事项</a></dt>-->
            <!--</dl>-->
            <!--<dl>-->
            <!--<dt class="notice"><a v-link="{ name: 'notice' }" data-title="公告管理" href="javascript:;"><img-->
            <!--class="menu-item" src="../assets/images/notice-g.png" alt="">&nbsp;&nbsp;公告管理</a></dt>-->
            <!--</dl>-->
            <!--<dl>-->
            <!--<dt class="notice"><a v-link="{ name: 'job' }" data-title="任务管理" href="javascript:;"><img-->
            <!--class="menu-item" src="../assets/images/job-g.png" alt="">&nbsp;&nbsp;任务管理</a></dt>-->
            <!--</dl>-->
        </div>
    </aside>
</template>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';

    export default {
        ready() {
            localStorage.routeName = this.$route.name;
            this.set_asides_event();
            this.get_asides();
            console.log("localStorage.is_super: ", localStorage.is_super)
//            console.log("-----------------")
//            console.log(this.$route.router)
//            console.log(this.$route.router._recognizer.names)
        },
        methods: {
            get_asides: function () {
                var id = localStorage.getItem("user_id");
                if (id == '') {
                    layer.msg("请重新登录", {icon: 2, time: 1500});
                    setTimeout(function () {
                        this.$route.router.go({path: '/login', replace: true});
                    }.bind(this), 1500);
                    return;
                }
                $.ajax({
                    url: base.gAjaxUrl.authority + id + '/',
                    type: 'GET',
                }).always((data) => {
                    base.ajaxCallback(data, () => {
                        this.filterList(data.menus)
                    })
                });
            },
            /* 点击侧边栏折叠事件 */
            set_asides_event: function () {
                function Huifold(obj, obj_c, speed, obj_type, Event) {
                    if (obj_type == 2) {
                        $(obj + ":first").find("b").html("-");
                        $(obj_c + ":first").show();
                    }
                    $('body').on(Event, obj, function (event) {
                        if ($(this).next().is(":visible")) {
                            if (obj_type == 2) {
                                return false;
                            } else {
                                $(this).next().slideUp(speed).end().removeClass("selected");
                                if ($(this).find("b")) {
                                    $(this).find("b").html("+");
                                }
                            }
                        } else {
                            if (obj_type == 3) {
                                $(this).next().slideDown(speed).end().addClass("selected");
                                if ($(this).find("b")) {
                                    $(this).find("b").html("-");
                                }
                            } else {
                                $(obj_c).slideUp(speed);
                                $(obj).removeClass("selected");
                                if ($(this).find("b")) {
                                    $(obj).find("b").html("+");
                                }
                                $(this).next().slideDown(speed).end().addClass("selected");
                                if ($(this).find("b")) {
                                    $(this).find("b").html("-");
                                }
                            }
                        }
                    });
                }

                /*左侧菜单*/
                Huifold(".menu_dropdown dl dt", ".menu_dropdown dl dd", "fast", 1, "click");
            },
            filterList: function (list) {
                let filteredList = [];
                for (let i = 0, len = list.length; i < len; i++) {
                    let oneList = list[i];
                    if (oneList.is_allow) {
                        filteredList.push(oneList)
                    }
                }
                this.asideData = filteredList;
                let firstScreen = '';
                if (filteredList.length != 0) {
                    if (filteredList[0].child) {
                        let childArr = filteredList[0].child;
                        for (let i = 0, len = childArr.length; i < len; i++) {
                            if (childArr[i].is_allow && (childArr[i].keyword != 'company' || localStorage['is_super'] == 'true')) {
                                firstScreen = `/${childArr[i].keyword}`;
                                break
                            }
                        }
                    } else {
                        firstScreen = `/${filteredList[0].keyword}`
                    }
                    if (!localStorage['routeName']) {
                        console.log(firstScreen);
                        this.$route.router.go({path: firstScreen, replace: true});
                    }
                } else {
                    this.$route.router.go({path: '/noModel', replace: true});
                }

            },
            // 点击事件，但是动态改变侧边栏之后
            set_current_asides_event: function () {
//                if(this.isDestroyed) return;
                let regRoute = new RegExp(this.$route.name);
                $("li > a").each(function (i, item) {
                    if (regRoute.test($(this).attr("href"))) {
                        let $pt = $(this).parent().parent().parent().prev("dt");
                        if ($pt.hasClass("selected")) return false;
                        $pt.trigger("click");
                        return false;
                    }
                    if (i == $("li > a").length - 1) {
                        $(".menu_dropdown dt:eq(0)").trigger("click");
                    }
                });
            },
            get_permissions: function () {
                console.log('-----------------------');
                let admin = localStorage.admin;
                console.log(admin);
            },
        },
        data: function () {
            return {
                permissions: localStorage.permissions ? localStorage.permissions : [],
                asideData: [],
                localStorage: localStorage,
            }
        },
        events: {
            'showMenu': function () {
                this.permissions = localStorage.permissions;
            },
            'loginIn': function () {
                this.get_asides();
            },
        },
        filters: {
            srcFun: function (keyword) {
                if (keyword == '') {
                    return '';
                } else {
//                    console.log(require('../assets/images/' + src + '-g.png'));
                    let src = '';
                    try {
                      src = require('../assets/images/' + keyword + '-g.png')
                    } catch (e) {
                    }
                    return src ? src : require('../assets/images/sjkb-g.png');
                }
            },
            // 匹配路由是否存在 不存在就不要创建侧边栏
            isAliveAndSuper: function (item) {
                return !!this.$route.router._recognizer.names[item.keyword]
                    && item.is_allow
                    && (item.keyword != 'company' || (item.keyword == 'company' && localStorage.is_super == 'true'));
            },
            // 非超级管理员。不显示分组设置
            isShowGroup: function (keyword) {
                // 屏蔽正在开发的功能访管理
                // return (window.localStorage.is_super == String(true) || keyword != 'groupSet') && keyword != 'visitManage'
                return (window.localStorage.is_super == String(true) || keyword != 'groupSet')
            }
        }
    }
</script>

<style lang="less" rel="stylesheet" scoped>
    .menu-item {
        width: 25px;
        height: 25px;
        font-size: 25px;
    }

    .Hui-aside {
        border-right: 0;
    }

    .Hui-aside1 {
        background-color: #273238;
        /*width: 180px;*/
    }

    .Hui-aside1 .menu_dropdown.bk_2 dt {
        border-bottom: 0;
        color: #fff;
        line-height: 46px;
    }

    .Hui-aside .menu_dropdown dd li {
        /*padding-left: 12px;*/
    }

    .Hui-aside .menu_dropdown li a {
        color: #959DA0;
    }

    .Hui-aside .notice a {
        color: #fff;
    }

    .Hui-aside .menu_dropdown dd li a {
        padding-left: 50px;
    }

    .Hui-aside .menu_dropdown li a.v-link-active {
        /*color: #fff;*/
        background-color: #3D4A50;
    }

    .Hui-aside .menu_dropdown li.v-link-active {
        color: #fff;
        background-color: #3D4A50;
    }

    .Hui-aside .menu_dropdown dd ul {
        padding: 0;
    }

    .Hui-aside .menu_dropdown dl {
        background-color: #253238;
    }

    .Hui-aside .menu_dropdown dd {
        background-color: #323F45;
    }
</style>
