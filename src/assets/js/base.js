/*
*	ajax返回处理
*/
export function ajaxCallback(data, callback) {
    callback = typeof callback == 'function' ? callback : () => {
    };
    let statusErrorRule = /^4\d{2}$/;
    let statusError500 = /^5\d{2}$/;
    let statusSuccessule = /^2\d{2}$/;
    let layerMessage = '';

    // 如果是'DELETE'删除操作，不会返回任何操作，data类型为undefined
    if (data && statusErrorRule.test(data.status)) {
        let dataResponseText = JSON.parse(data.responseText).detail;
        layerMessage = '请求错误';
        if (dataResponseText.code == 'AUTH_FAIL') {
            localStorage.removeItem("token");
            // window.location.href='/#!/login';
            window.location.hash = '#!/login';
            layerMessage = dataResponseText.msg;
        } else if (dataResponseText.msg) {
            layerMessage = dataResponseText.msg;
        } else if (dataResponseText.non_field_errors) {
            layerMessage = dataResponseText.non_field_errors[0];
        } else if (data.responseJSON.detail.non_field_errors) {
            layerMessage = data.responseJSON.detail.non_field_errors;
        } else if (typeof dataResponseText === 'object' && dataResponseText.length) {
            layerMessage = dataResponseText.join(',')
        } else if (typeof dataResponseText === 'object') {
            for (let key in dataResponseText) {
                layerMessage = dataResponseText[key][0] || "未知错误";
                break;
            }
        } else if (typeof dataResponseText === 'string') {
            layerMessage = dataResponseText
        }
        layer.msg(layerMessage, {icon: 2, time: 1500});
    } else if (statusError500.test(data && data.status)) {
        layer.msg("请求错误", {icon: 2, time: 1500});
    } else if (data.status == 0 && 'statusText' in data) {
        layer.msg("请求失败", {icon: 2, time: 1500});
    } else {
        callback(data);
    }
}

export function fixEchartsWidthPercentage(chartIds) {
    chartIds.forEach(function (value, index, array) {
        let el = document.getElementById(value)
        let computedWidth = window.getComputedStyle(el, null).getPropertyValue("width")
        // console.log('computed width: ' + computedWidth)
        $('#' + value).css('width', computedWidth)
        //let chartParent = $('#'+value).parent()
        //let chartWidth = $('#'+value).css('width')
        //let parentWidth = chartParent.width()
        //console.log('get real width')
        //let realWidth = getNearestValidWidthAncestorWidth(chartParent)
        //console.log('real width')
        //console.log(realWidth)
        //if (chartWidth.indexOf('%') > 0) {
        //// width为百分比,转换为具体数值
        //chartWidth = chartWidth.replace('%', '')
        //realWidth = parseInt(chartWidth) * parentWidth / 100
        //}
        //$('#'+value).css('width', realWidth)
    })
}

function getNearestValidWidthAncestorWidth(el) {
    if (el.width() == 0) {
        return getNearestValidWidthAncestorWidth(el.parent())
    } else {
        return el.width()
    }
}

export function dateRangeWithDay(day) {

}

export function createDateStringFromNow(day) {
    let now = new Date();
    let newValue = now.valueOf() + day * 24 * 60 * 60 * 1000;
    let newDate = new Date(newValue);
    return dateStringWithDate(newDate);
}

export function dateStringWithDate(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    if (m <= 9) m = "0" + m;
    if (d <= 9) d = "0" + d;
    return y + "-" + m + "-" + d;
}

export function dateZeroFill(num) {
    if (num >= 10) {
        return num;
    } else {
        return `0${num}`;
    }
}

export function verticalCenter(obj) {
    $(obj).css({
        position: 'absolute',
        left: ($(window).width() - $(obj).outerWidth()) / 2,
        // top: ($(window).height() - $(obj).outerHeight())/2 + $(document).scrollTop(),
        top: '50px',
        margin: 0
    });
}

export function verticalBodyCenter(obj) {
    $(obj).css({
        position: 'absolute',
        left: ($(document.body).width() - $(obj).outerWidth()) / 2,
        // top: ($(window).height() - $(obj).outerHeight())/2 + $(document).scrollTop(),
        top: '50px',
        margin: 0
    });
}

export function cutString(str, len) {
    if (str.length * 2 <= len) {
        return str;
    }
    var strlen = 0;
    var s = "";
    for (var i = 0; i < str.length; i++) {
        s = s + str.charAt(i);
        if (str.charCodeAt(i) > 128) {
            strlen = strlen + 2;
            if (strlen >= len) {
                return s.substring(0, s.length - 1) + "...";
            }
        } else {
            strlen = strlen + 1;
            if (strlen >= len) {
                return s.substring(0, s.length - 2) + "...";
            }
        }
    }
    return s;
}

export function isUrgent(data) {
    if (data) {
        return '<span class="red">是</span>';
    } else {
        return '否';
    }
}

export function compareDate(strDate1, strDate2) {
    var date1 = strDate1.replace(/\-/g, "")
    var date2 = strDate2.replace(/\-/g, "")
    return date1 - date2
}

export function calTableWidth(obj) {
    if (!obj) return;
    var $tables = $(obj);
    var $th = $tables.eq(0).find("th");
    var wWidth = 0;
    $.each($th, function (i, item) {
        wWidth += parseInt($(item).attr("width"));
    });
    wWidth += parseInt($tables.eq(0).css("borderWidth"));
    if (wWidth <= $tables.eq(0).parent().outerWidth()) return;
    // console.log(wWidth);
    $tables.css({
        tableLayout: "fixed",
        width: wWidth
    });
    return null;
}

function LoadJS(fileUrl) {

    var oHead = document.getElementsByTagName('HEAD').item(0),
        oScript = document.createElement("script");

    oScript.src = fileUrl;
    oHead.appendChild(oScript);

}

const globalPB = {
    domian: wpSiteUrl,
    webScoket: webScoketUrl,
}
export const gAjaxUrl = {
    'interactList': globalPB.domian + '/api/v4/admin/adminterrace/',          //互动平台管理
    'adminfeedback': globalPB.domian + '/api/v4/admin/adminfeedback/',          //留言信息管理
    'search_terrace': globalPB.domian + '/api/v4/admin/adminfeedback/search_terrace/',          //平台可选项
    'busLocation': globalPB.domian + '/api/v2/admin/shuttlebusvehicles/locations/',          //车辆定位
    // 'shuttlebuses3':globalPB.domian+'/api/v3/admin/shuttlebuses/',//巴士3.0
    'shuttlebuses3': globalPB.domian + '/api/v4/admin/shuttlebuses/',//V4新版 巴士3.0
    'officialCarLocations': globalPB.domian + '/api/v1/admin/officialcarvehicles/locations/',          //车辆
    'jobs': globalPB.domian + '/api/v1/admin/jobs/',  //下载任务
    'batchAddBusTime': globalPB.domian + '/api/v2/admin/shuttlebuses/bulk_create_date/',// 批量设置通勤车时间
    'batchDeleteBusTime': globalPB.domian + '/api/v3/admin/shuttlebuses/bulk_delete_date/',// 批量删除通勤车时间
    'shuttleBusTime': globalPB.domian + '/api/v1/admin/shuttlebustime/',// 修改通勤车班车线路时间

    // 数据面板
    'paytypes': globalPB.domian + '/api/v1/admin/paytypes/', //付款方式列表
    'positioninghardwares': globalPB.domian + '/api/v3/admin/positioninghardwares/', //硬件列表
    'vehiclerepairorders': globalPB.domian + '/api/v3/admin/vehiclerepairorders/', //车辆故障项目列表
    'vehicleFaultitems': globalPB.domian + '/api/v3/admin/faultitems/', //车辆故障项目列表
    'vehicleRepairrule': globalPB.domian + '/api/v3/admin/vehiclerepairrule/', //车辆维修规则列表
    'vehicleRepairprincioal': globalPB.domian + '/api/v3/admin/vehiclerepairprincioal/', //车辆维修负责人列表
    'vehicleRepairapprovers': globalPB.domian + '/api/v3/admin/vehiclerepairapprovers/', //车辆维修审价人列表
    'time': globalPB.domian + '/api/v1/util/time/',          //时间
    // 'adminLogin': globalPB.domian + '/api/v1/admin/auths/login/',          //登录
    'adminLogin': globalPB.domian + '/api/v4/admin/auths/login/',          //登录
    'adminLogout': globalPB.domian + '/api/v1/admin/auths/logout/',   //注销
    // 'staffs': globalPB.domian + '/api/v3/admin/staffs/',          //员工
    'staffs': globalPB.domian + '/api/v4/admin/staffs/',          //v4员工
    'staffsIpmort': globalPB.domian + '/api/v1/admin/staffs/imports/',//员工导入
    'rideReport': globalPB.domian + '/api/v2/admin/staffs/ride_report/',//员工搭乘统计列表
    'departmentsV4': globalPB.domian + '/api/v4/admin/departments/',// v4部门
    'departments': globalPB.domian + '/api/v1/admin/departments/',//部门
    'departmentsV3': globalPB.domian + '/api/v3/admin/departments/',//部门
    'companyadmins': globalPB.domian + '/api/v1/admin/companyadmins/',//管理员
    // 'shuttlebusvehicles': globalPB.domian + '/api/v2/admin/shuttlebusvehicles/',          //车辆
    'shuttlebusvehicles': globalPB.domian + '/api/v4/admin/shuttlebusvehicles/',          //V4新版本车辆
    // 'shuttlebusdrivers': globalPB.domian + '/api/v2/admin/shuttlebusdrivers/',          //司机
    'shuttlebusdrivers': globalPB.domian + '/api/v4/admin/shuttlebusdrivers/',          //V4新版本司机
    // 'shuttlebuses2': globalPB.domian + '/api/v2/admin/shuttlebuses/',//巴士2.0
    'shuttlebuses2': globalPB.domian + '/api/v4/admin/shuttlebuses/',//巴士4.0
    'shuttlebusdates2': globalPB.domian + '/api/v2/admin/shuttlebusdates/', //巴士班次2.0
    'shuttlebusdates3': globalPB.domian + '/api/v3/admin/shuttlebusdates/', //巴士班次2.0
    'shuttlebuses': globalPB.domian + '/api/v1/admin/shuttlebuses/',//巴士
    'saleable': globalPB.domian + '/api/v2/admin/shuttlebuses/saleable/',//可销售班次日期
    'createOrder': globalPB.domian + '/api/v1/admin/shuttlebuses/create_order/',//创建订单
    'busInfoReport': globalPB.domian + '/api/v2/admin/shuttlebuses/info_report/',//创建订单
    'busmonthlytickets': globalPB.domian + '/api/v1/admin/busmonthlytickets/',//月票
    'notices': globalPB.domian + '/api/v1/admin/notices/',//公告
    'officialcarorders': globalPB.domian + '/api/v2/admin/officialcarorders/',//订单
    // 'carpool': globalPB.domian + '/api/v1/admin/officialcarorders/carpool/',//订单管理
    'carpool': globalPB.domian + '/api/v2/admin/officialcarorders/carpool/',//订单管理
    // 'officialcarvehicles': globalPB.domian + '/api/v1/admin/officialcarvehicles/',          //车辆
    'officialcarvehicles': globalPB.domian + '/api/v4/admin/officialcarvehicles/',          //V4车辆
    // 'officialcardrivers': globalPB.domian + '/api/v1/admin/officialcardrivers/',          //司机
    'officialcardrivers': globalPB.domian + '/api/v4/admin/officialcardrivers/',          //V4司机
    'officialcardriversLock': globalPB.domian + '/api/v1/admin/officialcardrivers/lock/',          //锁定
    'officialcardriversUnlock': globalPB.domian + '/api/v1/admin/officialcardrivers/unlock/',          //解锁
    'officialcarstaffs': globalPB.domian + '/api/v1/admin/officialcarstaffs/',          //员工用车
    'orderStatus': globalPB.domian + '/api/v1/admin/officialcarorders/order_status/', //订单状态
    'approvalStatus': globalPB.domian + '/api/v1/admin/officialcarorders/approval_status/', //审批状态
    'orderSeparate': globalPB.domian + '/api/v1/admin/officialcarorders/separate/',  //取消拼单
    'officialcarrules': globalPB.domian + '/api/v1/admin/officialcarrules/',//公务车申请规则
    'approvers': globalPB.domian + '/api/v1/admin/approvers/', //审批人
    'vehicleConfiguration': globalPB.domian + '/api/v1/admin/modulenotice/', //公务车模块公告模块
    'stationSignupNums': globalPB.domian + '/api/v2/admin/shuttlebusstation/', //时间段内站点每天各个出发时间的报名人数
    'departmentOrderNums': globalPB.domian + '/api/v1/admin/officialcarorders/department_order_nums/', //公务车模块公告模块部门订单总数
    'orderNums': globalPB.domian + '/api/v1/admin/officialcarorders/order_nums/', //公务车模块公告模块时间段内每天订单数
    'orderDistributions': globalPB.domian + '/api/v1/admin/officialcarorders/order_distributions/', //公务车模块公告模块
    'officialcarProfile': globalPB.domian + '/api/v1/admin/officialcarorders/officialcar_profile/', //公务车模块公告模块
    'repairtypes': globalPB.domian + '/api/v1/admin/repairtypes/', //公共区域维修类型
    'dormitoryApprovers': globalPB.domian + '/api/v1/admin/dormitory_approvers/', //公共区域审批人
    'dormitoryApproversCreate': globalPB.domian + '/api/v1/admin/dormitory_approvers/bulk_create/', //公共区域审批人批量新增
    'pubrepairorders': globalPB.domian + '/api/v1/admin/pubrepairorders/', //公共区域审批人批量新增
    'repairmen': globalPB.domian + '/api/v1/admin/repairmen/', //维修工列表
    'addRepairmen': globalPB.domian + '/api/v1/admin/repairmen/bulk_create/', //添加维修工列表
    'infoReport': globalPB.domian + '/api/v1/admin/materials/info_report/', //维修材料统计列表
    'faultitems': globalPB.domian + '/api/v1/admin/faultitems/', //故障项目
    'repairorders_v1': globalPB.domian + '/api/v1/admin/repairorders/', //宿舍维修单
    'repairorders': globalPB.domian + '/api/v4/admin/repairorders/', //宿舍维修单
    'materialclasses': globalPB.domian + '/api/v1/admin/materialclasses/', //维修材料类型
    'materials': globalPB.domian + '/api/v1/admin/materials/', //维修材料
    'materialsImport': globalPB.domian + '/api/v1/admin/materials/materials_import/', //维修材料批量导入
    'buildings': globalPB.domian + '/api/v4/admin/buildings/', //V4宿舍楼
    'buildingsTag': globalPB.domian + '/api/v3/admin/tagsofroom/', //宿舍楼标签
    'buildingsCostTypeList': globalPB.domian + '/api/v3/admin/feetypes/', //宿舍楼费用类型列表
    'roomtypes': globalPB.domian + '/api/v3/admin/roomtypes/', //房间类型
    // 'rooms': globalPB.domian + '/api/v3/admin/rooms/', //房间
    'rooms': globalPB.domian + '/api/v4/admin/rooms/', //V4房间
    'roomequipments': globalPB.domian + '/api/v3/admin/roomequipments/', // 房间设备列表
    // 'housingrecords': globalPB.domian + '/api/v1/admin/housingrecords/', //房间类型
    'housingrecords': globalPB.domian + '/api/v4/admin/applysettleorders/settle_staff/', //房间类型
    'roomsImport': globalPB.domian + '/api/v4/admin/rooms/rooms_import/', //宿舍批量导入
    'roomsStaffsImport': globalPB.domian + '/api/v4/admin/rooms/staffs_import/', //宿舍员工批量导入
    'applysettleorders': globalPB.domian + '/api/v3/admin/applysettleorders/', //长住申请单列表
    'dormitorybills': globalPB.domian + '/api/v3/admin/dormitorybills/', //宿舍水电计费单列表
    'bills': globalPB.domian + '/api/v3/admin/bills/', //水电季度计费单列表
    'waterElePrice': globalPB.domian + '/api/v1/admin/water_ele_price/', //宿舍楼水电单价设置
    'waterEleOrders': globalPB.domian + '/api/v1/admin/water_ele_orders/', //宿舍水电缴费单列表
    'modulenotice': globalPB.domian + '/api/v1/admin/modulenotice/', //模块公告
    'applyModulenotice': globalPB.domian + '/api/v1/admin/modulenotice/apply/', //入住申请公告查询
    'checkinModulenotice': globalPB.domian + '/api/v1/admin/modulenotice/checkin/', //入住公告查询
    'checkoutModulenotice': globalPB.domian + '/api/v1/admin/modulenotice/checkout/', //退房公告查询
    'applyroomrules': globalPB.domian + '/api/v1/admin/applyroomrules/', //入住申请规则列表
    'dormitoryrules': globalPB.domian + '/api/v1/admin/dormitoryrules/', //宿舍规则列表
    'waterorders': globalPB.domian + '/api/v1/admin/waterorders/', //宿舍规则列表
    'picktypes': globalPB.domian + '/api/v1/admin/picktypes/', //配送方式列表
    'picktypesSet': globalPB.domian + '/api/v1/admin/picktypes/set/', //配送方式设置
    'reservewaterModulenotice': globalPB.domian + '/api/v1/admin/modulenotice/reservewater/', //订水提示公告
    // 订水管理
    'waterInfo': globalPB.domian + '/api/v1/admin/barreledwater/', //订水基本信息列表
    "messages": globalPB.domian + '/api/v1/admin/messages/', // 消息中心列表
    "messagesTypes": globalPB.domian + '/api/v1/admin/messages/types/', // 消息中心列表
    "messagesDelete": globalPB.domian + '/api/v1/admin/messages/bulk_delete/', // 消息中心列表
    "messagesReadAll": globalPB.domian + '/api/v1/admin/messages/bulk_read/', // 消息中心列表
    // 物资模块
    "goods": globalPB.domian + '/api/v1/admin/goodsapplyorders/', // 物品领用管理
    'materialsTypes': globalPB.domian + '/api/v1/admin/goodstypes/',// 物资类型列表,新增与删除都是这个接口,方法不同
    'materialsList': globalPB.domian + '/api/v1/admin/goods/', // 物资列表,
    'materialsGetRuleList': globalPB.domian + '/api/v1/admin/goodsapplyrules/', // 物资申请规则列表
    "wsUrl": globalPB.webScoket, //  webSocket专用接口
    "ossToken": globalPB.domian + '/api/v1/oss_token/', // 获取oss_token
    // 费用管理模块新增
    'staffsTag': globalPB.domian + '/api/v3/admin/tageofstaff/',//员工标签列表       //员工
    'stafffeePoint': globalPB.domian + '/api/v3/admin/stafffeepoint/', //个人费率列表
    'feeTypeList': globalPB.domian + '/api/v3/admin/feetypes/feetype_list/', //所有费用类别列表，用于费率设置
    'feeType': globalPB.domian + '/api/v3/admin/feetypes/', // 费用类别列表
    'setFee': globalPB.domian + '/api/v3/admin/stafffeepoint/bulk_updata/', //住户费率批量设置
    'roomTag': globalPB.domian + '/api/v3/admin/tagsofroom/', //宿舍标签列表
    'payOrder': globalPB.domian + '/api/v3/admin/payorders/', //缴费单列表
    'remind': globalPB.domian + '/api/v3/admin/remindmsg/', //事项提醒
    'feeRemark': globalPB.domian + '/api/v3/admin/payorders/', //事项提醒
    'exportPayOrders': globalPB.domian + '/api/v3/admin/payorders/export/', //事项提醒
    // 线路调度
    "linebustime": globalPB.domian + '/api/v3/admin/shuttlebuses/', // 车辆调度
    "busDispatchList": globalPB.domian + '/api/v3/admin/shuttlebusdispatch/', // 车辆调度列表
    "busDateCheck": globalPB.domian + '/api/v3/admin/shuttlebusdispatch/dispatch_validate/', // 设置司机车辆校验
    "addBusDispatchDate": globalPB.domian + '/api/v3/admin/shuttlebusdispatch/bulk_set/', // 新增班车调度时间
    "busTrail": globalPB.domian + '/api/v3/admin/buslocation/device_info/', // 实时状态查询
    "carTrail": globalPB.domian + '/api/v2/admin/officialcarlocation/device_info/', // 实时状态查询
    "busTrack": globalPB.domian + '/api/v3/admin/buslocation/track/', // 轨迹查询
    "carTrack": globalPB.domian + '/api/v2/admin/officialcarlocation/track/', // 轨迹查询
    "busLocationExport": globalPB.domian + '/api/v3/admin/buslocation/export/', // 巴士轨迹导出
    "carLocationExport": globalPB.domian + '/api/v2/admin/officialcarlocation/export/', // 公务车轨迹导出
    "busLocationGetDriver": globalPB.domian + '/api/v3/admin/buslocation/get_driver/', // 巴士实时获取司机信息
    "carLocationGetDriver": globalPB.domian + '/api/v2/admin/officialcarlocation/get_driver/', // 公务车实时获取司机信息
    'officialCarFeeTypes': globalPB.domian + '/api/v2/admin/officialcarfeetypes/',// 公务车费用类型
    'officialCarFees': globalPB.domian + '/api/v2/admin/officialcarfees/', //  公务车费用
    'privateCar': globalPB.domian + '/api/v1/admin/privatecarvehicles/',//  私家车
    'privateCarOrders': globalPB.domian + '/api/v1/admin/privatecarorders/',  // 私家车行程单
    'repairsArea': globalPB.domian + '/api/v4/admin/repairarea/',  // 新增报修区域
    // 权限管理控制
    'authorityMenu': globalPB.domian + '/api/v4/admin/companyadmins/getmenu/',  // 公司权限菜单
    'authority': globalPB.domian + '/api/v4/admin/companyadmins/',  // 当前管理员菜单列表
    'departmentTree': globalPB.domian + '/api/v4/admin/departments/tree_obj/',  // 部门树形结构
    'resetPassword': globalPB.domian + '/api/v4/admin/auths/reset_password/',  // 超级管理员重置密码 resetPassword
    'setAllAuths': globalPB.domian + '/api/v4/admin/departments/bulk_setmodels/',  // 设置所有部门权限
    'tagGroup': globalPB.domian + '/api/v4/admin/tags/', // 分组接口
    'resources': globalPB.domian + '/api/v4/admin/resources/', // 资源配置
    'uploadProgress': globalPB.domian + '/api/v4/admin/uploadjob/', // 上传进度
    'project': globalPB.domian + '/api/v3/admin/project/', // 宿舍项目
    'procedure': globalPB.domian + '/api/v4/admin/approvprocess/', // 流程审批
    'busconfig': globalPB.domian + '/api/v1/admin/config/bus/', // 线路调度 获取调度配置信息
    'whitelist': globalPB.domian + '/api/v3/admin/whitelist/', // 白名单
    'bustypes': globalPB.domian + '/api/v1/admin/busvehicletype/', // 车辆类型
    'lineprice': globalPB.domian + '/api/v1/admin/shuttlebusprice/', // 车辆类型
    'linedispatch': globalPB.domian + '/api/v1/admin/shuttlebusdates/', // 线路排班
    'busnoticemanager': globalPB.domian + '/api/v1/admin/adminnotificationbinding/', // 线路排班
    'publicsecurity': globalPB.domian + '/api/v4/admin/publicsecurity/', // 执勤人员列表
    'visitRecords': globalPB.domian + '/api/v4/admin/visitrecords/', // 访客来访记录
    'get_publicsecurity': globalPB.domian + '/api/v4/admin/visitrecords/get_publicsecurity/', // 获取执勤人员可选项
    'accountForbidden': globalPB.domian + '/api/v4/admin/temporaryaccounts/allow_login/', // 设置账号是否启用
    'accountTime': globalPB.domian + '/api/v4/admin/temporaryaccounts/validity_time/', // 访客账号时效
    'visitorList': globalPB.domian + '/api/v4/admin/temporaryaccounts/', // 访客列表
    'visitorDepartment': globalPB.domian + '/api/v4/admin/temporaryaccounts/get_department/', // 访客列表
    'UEUpFile': globalPB.domian + '/api/v1/admin/uploadfile/action/', // UEditor上传文件
    "baseConfig": globalPB.domian + "/api/v1/admin/config/",  // 获取配置信息
    "visitorconfig": globalPB.domian + "/api/v1/admin/visitorconfig/",  // 获取访客预约规则
    "privateCarCostTypes": globalPB.domian + "/api/v1/admin/privatecarfeetype/",  // 私家车费用类型
    "privateCarAddCost": globalPB.domian + "/api/v1/admin/privatecarfee/",  // 私家车添加费用
    "privateCarProofList": globalPB.domian + "/api/v1/admin/privatecarvoucher/",  // 私家车凭证列表
    "voucherSet": globalPB.domian + "/api/v1/admin/VoucherSettings/",  // 私家车凭证设置
    "subsidyList": globalPB.domian + "/api/v1/admin/subsidy/",  // 补贴列表
    "subsidyStatistics": globalPB.domian + "/api/v1/admin/subsidyorder/",  // 补贴统计
    "busViolationList": globalPB.domian + "/api/v4/admin/orderviolationrecords/",  // 通勤车违规统计

    // 公务车V2版本接口
    'officialcarVehicleList_V2': globalPB.domian + '/api/v1/admin/officialcarvehicles2/', // 车辆列表
    'officialcarDriverList_V2': globalPB.domian + '/api/v1/admin/officialcardrivers2/', // 司机列表
    'officialcarApplyRule_V2': globalPB.domian + '/api/v1/admin/officialcarrules2/', // 申请规则
    'officialcarFile_V2': globalPB.domian + '/api/v1/admin/officialcarvehicles2/', // 车辆档案
    'officialcarCost_V2': globalPB.domian + '/api/v1/admin/officialcarfees2/', // 车辆费用
    'officialcarCostTypes_V2': globalPB.domian + '/api/v1/admin/officialcarfeetypes2/', // 车辆费用类型
    'officialcarPath_V2': globalPB.domian + '/api/v1/admin/officialcarlocation2/', // 轨迹查询
    'officialcarLocation_V2': globalPB.domian + '/api/v1/admin/buslocation2/track/', // 车辆轨迹
    'officialcarOrder_V2': globalPB.domian + '/api/v1/admin/officialcarorders2/', // 订单管理
    'officialcarDispatchDriverList_V2': globalPB.domian + '/api/v1/admin/officialcardrivers2/delegate/', // 委派司机列表c
    'officialcarTrip_V2': globalPB.domian + '/api/v1/admin/officialcartrip2/', // 行程
    'officialcarNotice_V2': globalPB.domian + '/api/v1/admin/modulenotice/officialcar2/', // 车辆配置公告
    'officialcarStatistics_V2': globalPB.domian + '/api/v1/admin/officialcarvehicles2/report/', // 车辆统计
    'officialcarDriverStatistics_V2': globalPB.domian + '/api/v1/admin/officialcardrivers2/order_report/', // 司机用车统计
    'officialcarDriverTrip_V2': globalPB.domian + '/api/v1/admin/officialcardrivertrip2/', // 司机用车明细
    'officialcarStaffStatistics_V2': globalPB.domian + '/api/v1/admin/officialcarorders2/staff_use_report/', // 员工用车统计
    'officialcarBillList_V2': globalPB.domian + '/api/v1/admin/officialcarfees2/', // 车辆账单
    'busApproveList': globalPB.domian + '/api/v1/admin/busorderes/busapproval/', // 订单列表
    'busApprove': globalPB.domian + '/api/v1/admin/busorderes/approval/', // 订单审批

    // 私家车部分
    'privateCarRule': globalPB.domian + '/api/v1/admin/privatecarconfig/', // 私家车配置信息

    // 'officialcarOrderWait_V2':globalPB.domian + '/api/v1/admin/officialcarorders2/waitorder_today/', // 当天等待接单数
    // 通勤车
    'busAuths': globalPB.domian + '/api/v4/admin/shuttlebusrules/', // 通勤车线路权限

    //摆渡车
    'ferryBusLines': globalPB.domian + '/api/v1/admin/ferryshuttlebuses/',//线路列表
    'ferryBusDates': globalPB.domian + '/api/v1/admin/ferryshuttlebusdates/',// 线路日期
    'ferryBusTimes': globalPB.domian + '/api/v1/admin/ferryshuttlebustime/',//线路时间表
    'ferryBusDispatch': globalPB.domian + '/api/v1/admin/ferryshuttlebusdispatch/',//获得班次日期
    'ferryBusDriver': globalPB.domian + '/api/v1/admin/ferryshuttlebusdrivers/',//司机管理
    'ferryBusList':globalPB.domian+'/api/v1/admin/ferryshuttlebusvehicles/',//车辆列表
    'ferryBusType':globalPB.domian+'/api/v1/admin/ferrybusvehicletype/',//类型列表

   //摆渡车
    'driverList':globalPB.domian+'/api/v1/admin/ferryshuttlebusdrivers/worker_summary/',//司机统计列表
    'addDriver':globalPB.domian+'/api/v1/admin/ferryshuttlebusdrivers/bulk_create/',//添加司机
    'deviceInfo':globalPB.domian+'/api/v1/admin/ferrybuslocation/device_info/',//轨迹设备列表
    'ferryTrack':globalPB.domian+'/api/v1/admin/ferrybuslocation/track/',//车辆轨迹
    'goBus':globalPB.domian+'/api/v1/admin/ferrybuslocation/get_driver/',//获取车辆信息


};
//替换公司名
$(function () {
    $('#J-company').text(localStorage.companyName);
});

// if(isHttps){
//     LoadJS('https://api.map.baidu.com/api?v=2.0&ak=BMvPNolfzSZK2FTuPPk0i9Lp&s=1')
// }else{
//     LoadJS('http://api.map.baidu.com/api?v=2.0&ak=BMvPNolfzSZK2FTuPPk0i9Lp')
// }

/*判断localstorage是否存在某个标志位，从而判断用户是不是第一次使用某个功能*/
var promptTypes = ['approverPromptFlag', 'approverSelectPromptFlag', 'orderManagementPromptFlag', 'timeapplyPromptFlag',
    'vehicleConfigurationPromptFlag', 'locaaddBusdatePromptFlag', 'rideReportPromptFlag', 'addBusMonthlyTicketsPromptFlag',
    'addBusdatePromptFlag', 'addBus2PromptFlag'];

for (var i = 0; i < promptTypes.length; i++) {
    var promptType = localStorage.getItem(promptTypes[i])
    if (promptType == undefined) {
        localStorage.setItem(promptTypes[i], true)
    }
}

var countlogin = localStorage.getItem('countlogin')
if (countlogin == undefined) {
    localStorage.setItem('countlogin', 1);
}
