// 引入页面！
import welcome from './views/welcome';      //欢迎页
import login from './views/login';      //登录
import register from './views/register';      //注册
import modifypassword from './views/modifypassword';      //修改密码
import departmentEmployee from './views/departmentEmployee';      //员工管理
import department from './views/departments';  //部门管理
import departmentAuths from './views/departmentAuths';  //部门管理
import company from './views/company';        //公司管理
import busManagement from './views/busManagement';        //巴士管理
import monthlyTicket from './views/monthlyTicket';        //月票
import saleable from './views/saleable';        //售票
import rideReport from './views/rideReport';        //员工搭乘统计
import busInfoReport from './views/busInfoReport';  //班车统计
import notice from './views/notice';  //公告
import publish from './views/publish';  //发公告
import orderManagement from './views/orderManagement';  //订单管理
import assignDriver from './views/assignDriver';  //司机列表
import assignCar from './views/assignCar';  //车辆列表
import driverReport from './views/driverReport';   //司机用车统计
import employeeReport from './views/employeeReport';   //员工用车统计
import vehicleReport from './views/vehicleReport';   //车辆统计
import busRecord from './views/busRecord';   // 通勤车辆统计详细
import vehicleRecord from './views/vehicleRecord';   // 通勤车辆统计详细
import showBusLocation from './views/showBusLocation';   // 通勤车辆统计详细
import messageCenter from './views/messageCenter';   // 消息中心
import vehicle from './views/vehicle';
import driver from './views/driver';
import job from './views/job';
import busVehicle from './views/busVehicle';
import busDriver from './views/busDriver';
import busRealTimeInfo from './views/busRealTimeInfo'; // 班车实时情况
import timeapply from './views/timeapply'; //时间申请规则
import approver from './views/approver.vue';
import vehicleConfiguration from './views/vehicleConfiguration.vue';//公务车车辆配置
import orderLargeScreenDisplay from './views/orderLargeScreenDisplay.vue';//公务车车辆配置
import busDataPanel from './views/busDataPanel.vue';//通勤车数据面板展示
import officialcarDataPanel from './views/officialcarDataPanel.vue';//公务车数据面板展示
import officialCarLocation from './views/officialCarLocation.vue';//公务车查看绑定位置
import repairmen from './views/repairmen.vue';//设置公共报修项目审批人
import publicRepairtypes from './views/publicRepairtypes.vue';//公共报修项目类型
import setPubrepairApprovers from './views/setPubrepairApprovers.vue';//设置公共报修项目审批人
import pubrepairorders from './views/pubrepairorders.vue';//设置公共报修项目审批人
import faultitems from './views/faultitems.vue';//设置公共报修项目审批人
import infoReport from './views/infoReport.vue';//维修材料统计列表
import materials from './views/materials.vue';//维修材料
import repairorders from './views/repairorders.vue';//宿舍维修单
import repairDepartReport from './views/repairDepartReport'; // 部门统计 - 报修
import repairEmployeeReport from './views/repairEmployeeReport'; // 人员统计 - 报修
import buildings from './views/buildings.vue';//宿舍楼列表
import towerManage from './views/towerManage.vue';//宿舍楼列表
import roomtypes from './views/roomtypes.vue';//房间类型
import roommessages from './views/roommessages.vue';//房务信息
import housingrecords from './views/housingrecords.vue';//宿舍人员管理
import longStayApply from './views/longStayApply.vue';//长住申请
import longStayModulenotice from './views/longStayModulenotice.vue';//住宿信息设置
import dormitoryrules from './views/dormitoryrules.vue';//设置申请规则
import longStayApprovers from './views/longStayApprovers.vue';//设置审批人
import dormitoryPersonalExpense from './views/dormitoryPersonalExpense.vue';// 个人费率管理
import chargeBills from './views/chargeBills.vue'; // 费用计费单管理
import dormitoryConstantExpenses from './views/dormitoryConstantExpenses.vue';//固定费用录入管理
import dormitorybills from './views/dormitorybills.vue';//水电录入管理
import dormitoryExpense from './views/dormitoryExpense.vue';//缴费管理
import waterorders from './views/waterorders.vue';//订水订单管理
import waterorderRules from './views/waterorderRules.vue';//订水规则设置
import vehicleRepairManagement from './views/vehicleRepairManagement.vue';//维修/故障管理(车辆)
import vehicleFaultitems from './views/vehicleFaultitems.vue';//车辆故障项目管理
import vehicleRepairprincioal from './views/vehicleRepairprincioal.vue';//负责/审批人管理(车辆)
import vehicleRepairrule from './views/vehicleRepairrule.vue';//临界金额设置管理(车辆)
import waterStockManagement from './views/waterStockManagement.vue';//库存管理
import materialsManage from './views/materialsManage.vue';//物资管理
import materialsNotes from './views/materialsNotes.vue';// 物料领取管理
import remind from './views/remind.vue';// 提醒事项
import typeHotelManage from './views/typeHotelManage';// 费用类别管理
import lineDispatch from './views/lineDispatch.vue';// 线路调度
import vehicleCost from './views/vehicleCost.vue';// 车辆费用
import vehicleBill from './views/vehicleBill.vue';// 车辆账单
import employeeGroup from './views/employeeGroup.vue';// 员工分组
import busGroup from './views/busGroup.vue';// 通勤车分组
import vehicleGroup from './views/vehicleGroup.vue';// 公务车分组
import dormitoryGroup from './views/dormitoryGroup.vue';// 宿舍分组
import noModel from './views/noModel.vue';// 如果没有开通任何模块的管理员的提示页面
import dormitoryProgram from './views/dormitoryProgram.vue';// 住宿管理 - 项目管理页面
import repairApprove from './views/repairApprove.vue'; // 流程审批
import repairsAreaManage from './views/repairsAreaManage'; // 报修区域管理
import importMould from './views/importMould'; // 批量导入
import visitAppointment from './views/visitAppointment'; // 访客人员管理
import visitRecord from './views/visitRecord'; // 访客来访记录
import visitJurisdictionManage from './views/visitJurisdictionManage'; // 访客权限管理
import carryOut from './views/carryOut'; // 执勤人员管理
// import repairNotice from './views/repairNotice.vue';// 公共报修通知 -- 先不做这个界面
import whiteList from './views/whiteList.vue';
import bustypes from './views/bustypes.vue';// 车辆类型管理
import linePrice from './views/linePrice.vue';// 价格管理
import officialApply from './views/officialApply.vue';// 公务车审批流程
import visitApplyRule from './views/visitApplyRule.vue';// 访客申请规则
import busViolationStatistics from './views/busViolationStatistics.vue';// 通勤车违规统计

// 通勤车
import busAuths from './views/busAuths.vue';// 线路权限
import setStations from './views/setStations.vue';// 通勤车设置站点


// 私家车
import driverVehicleManage from './views/driverVehicleManage.vue';// 私家车司机车辆管理
import privateCarApply from './views/privateCarApply.vue';// 流程审批
import travelItinerary from './views/travelItinerary.vue';// 行程单
import proofManage from './views/proofManage.vue';// 凭证管理
import subsidyManage from './views/subsidyManage.vue';// 补贴管理
import subsidyStatistics from './views/subsidyStatistics.vue';// 补贴统计
import voucherCustomization from './views/voucherCustomization.vue';// 凭证定制
import privateCarRule from './views/privateCarRule.vue';// 申请规则
import showPrivateCarLocation from './views/showPrivateCarLocation.vue';// 轨迹查询

// 公务车V2版本
import officialcarManage from "./officialcarV2/views/officialcarManage" // 车辆管理
import officialDriverManage from "./officialcarV2/views/officialDriverManage" // 司机管理
import officialcarFlowPath from "./officialcarV2/views/officialcarFlowPath" // 流程审批
import officialcarOrderManage from "./officialcarV2/views/officialcarOrderManage" // 订单管理
import officialcarCost from "./officialcarV2/views/officialcarCost" // 车辆费用
import officialcarBill from "./officialcarV2/views/officialcarBill" // 车辆账单
import applyRule from "./officialcarV2/views/applyRule" // 申请规则
import officialcarConfigNotice from "./officialcarV2/views/officialcarConfigNotice" // 车辆配置公告
import officialcartDriverStatistics from "./officialcarV2/views/officialcartDriverStatistics" // 司机用车统计
import officialcarStaffStatistics from "./officialcarV2/views/officialcarStaffStatistics" // 员工用车统计
import officialcarStatistics from "./officialcarV2/views/officialcarStatistics" // 车辆统计
import officialcarRecord from "./officialcarV2/views/officialcarRecord" // 车辆档案
import officialcarPathSearch from "./officialcarV2/views/officialcarPathSearch" // 轨迹查询
import officialcarV2Group from "./views/officialcarV2Group" // 公务车V2分组
import rideApprove from "./views/rideApprove" // 公务车V2分组
import interactTerrace from "./interact/interactTerrace" // 互动平台管理
import leaveWord from "./interact/leaveWord" // 留言信息管理

//摆渡车
import ferryBusSetStation from './ferrybus/views/ferryBusSetStation.vue';//站点设置
import ferryBusLine from  './ferrybus/views/ferryBusLine.vue'//线路管理
import ferryBusArrangeBus from  './ferrybus/views/ferryBusArrangeBus.vue'//线路排班
import ferryBusDriver from  './ferrybus/views/ferryBusDriver.vue'//司机管理
import ferryBusVehicle from  './ferrybus/views/ferryBusVehicle.vue'//车辆管理
import ferryBusTypes from './ferrybus/views/ferryBusTypes.vue'//车辆管理
import ferryBusDriverStatistics from  './ferrybus/views/ferryBusDriverStatistics.vue'//司机统计
import ferryBusLocationReview from  './ferrybus/views/ferryBusLocationReview.vue'//轨迹查询


export default function (router) {
    router.map({
        '/welcome': {
            name: 'welcome',
            component: welcome
        },
        '/login': {
            name: 'login',
            component: login
        },
        '/register': {
            name: 'register',
            component: register
        },
        '/modifypassword': {
            name: 'modifypassword',
            component: modifypassword
        },
        '/notice': {
            name: 'notice',
            component: notice
        },
        '/messageCenter': {
            name: 'messageCenter',
            component: messageCenter
        },
        '/departmentEmployee': {
            name: 'departmentEmployee',
            component: departmentEmployee
        },
        '/vehicle': {
            name: 'vehicle',
            component: vehicle
        },
        '/driver': {
            name: 'driver',
            component: driver
        },
        '/department': {
            name: 'department',
            component: department
        },
        '/departmentAuths': {
            name: 'departmentAuths',
            component: departmentAuths
        },
        '/company': {
            name: 'company',
            component: company
        },
        '/busVehicle': {
            name: 'busVehicle',
            component: busVehicle
        },
        '/busDriver': {
            name: 'busDriver',
            component: busDriver
        },
        '/busManagement': {
            name: 'busManagement',
            component: busManagement
        },
        '/monthlyTicket': {
            name: 'monthlyTicket',
            component: monthlyTicket
        },
        '/saleable': {
            name: 'saleable',
            component: saleable
        },
        '/rideReport': {
            name: 'rideReport',
            component: rideReport
        },
        '/busInfoReport': {
            name: 'busInfoReport',
            component: busInfoReport
        },
        '/publish': {
            name: 'publish',
            component: publish
        },
        '/orderManagement': {
            name: 'orderManagement',
            component: orderManagement
        },
        '/assignDriver': {
            name: 'assignDriver',
            component: assignDriver
        },
        '/assignCar': {
            name: 'assignCar',
            component: assignCar
        },
        '/driverReport': {
            name: 'driverReport',
            component: driverReport
        },
        '/employeeReport': {
            name: 'employeeReport',
            component: employeeReport
        },
        '/vehicleReport': {
            name: 'vehicleReport',
            component: vehicleReport
        },
        '/job': {
            name: 'job',
            component: job
        },
        '/busRealTimeInfo': {
            name: 'busRealTimeInfo',
            component: busRealTimeInfo
        },
        '/timeapply': {
            name: 'timeapply',
            component: timeapply
        },
        '/approver': {
            name: 'approver',
            component: approver
        },
        '/vehicleConfiguration': {
            name: 'vehicleConfiguration',
            component: vehicleConfiguration
        },
        '/busDataPanel': {
            name: 'busDataPanel',
            component: busDataPanel
        },
        '/orderLargeScreenDisplay': {
            name: 'orderLargeScreenDisplay',
            component: orderLargeScreenDisplay
        },
        '/officialcarDataPanel': {
            name: 'officialcarDataPanel',
            component: officialcarDataPanel
        },
        '/repairmen': {
            name: 'repairmen',
            component: repairmen,
        },
        '/publicRepairtypes': {
            name: 'publicRepairtypes',
            component: publicRepairtypes,
        },
        '/setPubrepairApprovers': {
            name: 'setPubrepairApprovers',
            component: setPubrepairApprovers
        },
        '/pubrepairorders': {
            name: 'pubrepairorders',
            component: pubrepairorders
        },
        '/faultitems': {
            name: 'faultitems',
            component: faultitems
        },
        '/infoReport': {
            name: 'infoReport',
            component: infoReport
        },
        '/materials': {
            name: 'materials',
            component: materials
        },
        '/repairorders': {
            name: 'repairorders',
            component: repairorders
        },
        '/buildings': {
            name: 'buildings',
            component: buildings
        },
        '/roomtypes': {
            name: 'roomtypes',
            component: roomtypes
        },
        '/roommessages': {
            name: 'roommessages',
            component: roommessages
        },
        '/housingrecords': {
            name: 'housingrecords',
            component: housingrecords
        },
        '/longStayApply': {
            name: 'longStayApply',
            component: longStayApply
        },
        '/longStayModulenotice': {
            name: 'longStayModulenotice',
            component: longStayModulenotice
        },
        '/dormitoryrules': {
            name: 'dormitoryrules',
            component: dormitoryrules
        },
        '/longStayApprovers': {
            name: 'longStayApprovers',
            component: longStayApprovers
        },
        '/dormitorybills': {
            name: 'dormitorybills',
            component: dormitorybills
        },
        '/dormitoryConstantExpenses': {
            name: 'dormitoryConstantExpenses',
            component: dormitoryConstantExpenses
        },
        '/dormitoryPersonalExpense': {
            name: 'dormitoryPersonalExpense',
            component: dormitoryPersonalExpense
        },
        '/dormitoryExpense': {
            name: 'dormitoryExpense',
            component: dormitoryExpense
        },
        '/waterorders': {
            name: 'waterorders',
            component: waterorders
        },
        '/waterorderRules': {
            name: 'waterorderRules',
            component: waterorderRules
        },
        '/setStations': {
            name: 'setStations',
            component: setStations
        },
        '/vehicleRepairManagement': {
            name: 'vehicleRepairManagement',
            component: vehicleRepairManagement
        },
        '/vehicleFaultitems': {
            name: 'vehicleFaultitems',
            component: vehicleFaultitems
        },
        '/vehicleRepairprincioal': {
            name: 'vehicleRepairprincioal',
            component: vehicleRepairprincioal
        },
        '/vehicleRepairrule': {
            name: 'vehicleRepairrule',
            component: vehicleRepairrule
        },
        '/busRecord': {
            name: 'busRecord',
            component: busRecord
        },
        '/vehicleRecord': {
            name: 'vehicleRecord',
            component: vehicleRecord
        },
        '/showBusLocation': {
            name: 'showBusLocation',
            component: showBusLocation,
        },
        '/officialCarLocation': {
            name: 'officialCarLocation',
            component: officialCarLocation,
        },
        '/waterStockManagement': {
            name: 'waterStockManagement',
            component: waterStockManagement
        },
        '/materialsManage': {
            name: 'materialsManage',
            component: materialsManage
        },
        '/materialsNotes': {
            name: 'materialsNotes',
            component: materialsNotes
        },
        '/lineDispatch': {
            name: 'lineDispatch',
            component: lineDispatch
        },
        '/chargeBills': {
            name: 'chargeBills',
            component: chargeBills
        },
        '/remind': {
            name: 'remind',
            component: remind
        },
        '/typeHotelManage': {
            name: 'typeHotelManage',
            component: typeHotelManage
        },
        '/towerManage': {
            name: 'towerManage',
            component: towerManage
        },
        '/vehicleCost': {
            name: 'vehicleCost',
            component: vehicleCost
        },
        '/vehicleBill': {
            name: 'vehicleBill',
            component: vehicleBill
        },
        '/driverVehicleManage': {
            name: 'driverVehicleManage',
            component: driverVehicleManage,
        },
        '/travelItinerary': {
            name: 'travelItinerary',
            component: travelItinerary,
        },
        '/employeeGroup': {
            name: 'employeeGroup',
            component: employeeGroup,
        },
        '/busGroup': {
            name: 'busGroup',
            component: busGroup,
        },
        '/vehicleGroup': {
            name: 'vehicleGroup',
            component: vehicleGroup,
        },
        '/dormitoryGroup': {
            name: 'dormitoryGroup',
            component: dormitoryGroup,
        },
        '/noModel': {
            name: 'noModel',
            component: noModel,
        },
        '/dormitoryProgram': {
            name: 'dormitoryProgram',
            component: dormitoryProgram,
        },
        '/repairApprove': {
            name: 'repairApprove',
            component: repairApprove,
        },
        '/repairsAreaManage': {
            name: "repairsAreaManage",
            component: repairsAreaManage,
        },
        '/importMould': {
            name: "importMould",
            component: importMould,
        },
        '/visitAppointment': {
            name: "visitAppointment",
            component: visitAppointment,
        },
        "/visitJurisdictionManage": {
            name: "visitJurisdictionManage",
            component: visitJurisdictionManage,
        },
        "/visitRecord": {
            name: "visitRecord",
            component: visitRecord,
        },
        // '/repairNotice':{
        //     name: 'repairNotice',
        //     component: repairNotice,
        // },
        '/showPrivateCarLocation': {
            name: 'showPrivateCarLocation',
            component: showPrivateCarLocation,
        },
        '/whiteList': {
            name: 'whiteList',
            component: whiteList,
        },
        '/bustypes': {
            name: 'bustypes',
            component: bustypes,
        },
        '/linePrice': {
            name: 'linePrice',
            component: linePrice,
        },
        '/officialApply': {
            name: 'officialApply',
            component: officialApply,
        },
        '/visitApplyRule': {
            name: 'visitApplyRule',
            component: visitApplyRule,
        },
        "officialcarManage": {
            name: "officialcarManage",
            component: officialcarManage,
        },
        "officialDriverManage": {
            name: "officialDriverManage",
            component: officialDriverManage,
        },
        "officialcarFlowPath": {
            name: "officialcarFlowPath",
            component: officialcarFlowPath,
        },
        "officialcarOrderManage": {
            name: "officialcarOrderManage",
            component: officialcarOrderManage,
        },
        "officialcarCost": {
            name: "officialcarCost",
            component: officialcarCost,
        },
        "officialcarBill": {
            name: "officialcarBill",
            component: officialcarBill,
        },
        "applyRule": {
            name: "applyRule",
            component: applyRule,
        },
        "officialcarConfigNotice": {
            name: "officialcarConfigNotice",
            component: officialcarConfigNotice,
        },
        "officialcartDriverStatistics": {
            name: "officialcartDriverStatistics",
            component: officialcartDriverStatistics,
        },
        "officialcarStaffStatistics": {
            name: "officialcarStaffStatistics",
            component: officialcarStaffStatistics,
        },
        "officialcarStatistics": {
            name: "officialcarStatistics",
            component: officialcarStatistics,
        },
        "officialcarRecord": {
            name: "officialcarRecord",
            component: officialcarRecord,
        },
        "officialcarPathSearch": {
            name: "officialcarPathSearch",
            component: officialcarPathSearch,
        },
        "officialcarV2Group": {
            name: "officialcarV2Group",
            component: officialcarV2Group,
        },
        "rideApprove": {
            name: "rideApprove",
            component: rideApprove,
        },
        "proofManage": {
            name: "proofManage",
            component: proofManage,
        },
        "subsidyManage": {
            name: "subsidyManage",
            component: subsidyManage,
        },
        "subsidyStatistics": {
            name: "subsidyStatistics",
            component: subsidyStatistics,
        },
        "voucherCustomization": {
            name: "voucherCustomization",
            component: voucherCustomization,
        },
        "privateCarApply": {
            name: "privateCarApply",
            component: privateCarApply,
        },
        "privateCarRule": {
            name: "privateCarRule",
            component: privateCarRule,
        },
        "busViolationStatistics": {
            name: "busViolationStatistics",
            component: busViolationStatistics
        },
        "repairDepartReport": {
            name: "repairDepartReport",
            component: repairDepartReport
        },
        "repairEmployeeReport": {
            name: "repairEmployeeReport",
            component: repairEmployeeReport
        },
        "interactTerrace": {
            name: "interactTerrace",
            component: interactTerrace
        },
        "leaveWord": {
            name: "leaveWord",
            component: leaveWord
        },
        "carryOut": {
            name: "carryOut",
            component: carryOut
        },
        "busAuths": {
            name: "busAuths",
            component: busAuths
        },
        "ferryBusLine": {
            name: "ferryBusLine",
            component: ferryBusLine
        },
        'ferryBusArrangeBus': {
            name: 'ferryBusArrangeBus',
            component: ferryBusArrangeBus
        },
        'ferryBusDriver': {
            name: 'ferryBusDriver',
            component: ferryBusDriver
        },
        'ferryBusVehicle':{
            name:'ferryBusVehicle',
            component: ferryBusVehicle
        },
        'ferryBusTypes':{
            name:'ferryBusTypes',
            component: ferryBusTypes
        },
        'ferryBusSetStation':{
            name:'ferryBusSetStation',
            component: ferryBusSetStation
        },
        'ferryBusDriverStatistics':{
            name:'ferryBusDriverStatistics',
            component: ferryBusDriverStatistics
        },
        'ferryBusLocationReview':{
            name:'ferryBusLocationReview',
            component:ferryBusLocationReview
        },

    });
    router.redirect({
        '*': "/welcome"
    });
}
