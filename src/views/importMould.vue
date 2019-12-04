<template>
    <section class="Hui-article-box">
        <div class="page-container">
            <div class="panel panel-default radius pd-10 fs-16 clearfix">
                <a class="ml-5 f-l btn btn-primary radius" href="javascript:;" title="返回" @click="back()">返回</a>
                <span class="f-l ml-20 fw-b">【{{importList[type].title}}】 批量导入</span>
            </div>
            <div class="panel panel-default radius pd-15 content">
                <div class="import_abstract">
                    <div class="import_abstract_title fs-16 leftBorder pl-5 fw-b">导入</div>
                    <div class="clearfix mt-5">
                        <span class="f-l">第一步：请根据导入模板的格式整理需要导入的数据。</span>
                        <!--<a class="btn radius btn-primary f-l ml-15" href="http://eqixing.oss-cn-shenzhen.aliyuncs.com/{{importList[type].demoName}}.xlsx">示例模板下载</a>-->
                        <a class="btn radius btn-primary f-l ml-15" href="{{preUrl + importList[type].demoName + '.xlsx'}}">示例模板下载</a>
                    </div>
                    <div class="clearfix mt-5">
                        <span class="f-l">第二步：上传填写好的{{importList[type].tableName}}信息表。</span>
                        <a href="javascript:;" :class="{'disabled': isProgressing, 'btn-primary': !isProgressing}"
                           class="btn radius btn-default f-l ml-15" @click="selectExcel">选择上传文件</a>
                        <form id="uploadForm">
                            <input id="uploadInput" type="file" name="file"
                                   accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                   @change="setSelectFile"/>
                        </form>
                        <span class="f-l ml-15"
                              :class="{'c-3fa': selectFileName}">{{selectFileName || '未选择任何文件'}}</span>
                    </div>
                    <div class="upLoadBox clearfix mt-5 mb-5">
                        <a href="javascript:;"
                           :class="{'disabled': isProgressing || !selectFile, 'btn-primary': !isProgressing && selectFile}"
                           class="btn radius btn-default f-l upLoadBtn" @click="upLoadExcel">上传</a>
                        <div class="progress f-l ml-15">
                            <div class="progress_inner tr c-fff" :style="{'width': percentNumber +'%'}">
                                <div class="progress_inner_txt">进度{{percentNumber}}%</div>
                            </div>
                        </div>
                    </div>
                    <div class="import_abstract_result fs-16 leftBorder pl-5 mt-15 fw-b">导入结果</div>
                    <div class="import_results mt-5 mb-5 clearfix">
                        <!--<span class="f-l">总数：{{errorInfo.total}}条/成功导入：{{errorInfo.add}}条/新增：{{errorInfo.complete - errorInfo.cover}}条/覆盖：{{errorInfo.cover}}条</span>-->
                        <span class="f-l">总数：{{errorInfo.total || 0}} 条</span>
                        <span class="f-l ml-20">成功导入：{{errorInfo.complete || 0}} 条</span>
                        <span class="f-l ml-20">新增：{{errorInfo.add || 0}} 条</span>
                        <span class="f-l ml-20">覆盖：{{errorInfo.cover || 0}} 条</span>
                        <span class="f-l ml-20 c-red">导入失败：{{errorInfo.error || 0}} 条</span>
                    </div>
                    <div class="import_abstract_fail fs-16 leftBorder pl-5 mt-15 fw-b clearfix">
                        <span class="f-l">失败结果</span>
                        <a href="javascript:;"
                           :class="{'disabled': !errorResults.length || isProgressing, 'btn-primary': errorResults.length && !isProgressing}"
                           class="btn btn-default radius f-l ml-30" @click="exportFailResults">导出失败结果</a>
                    </div>
                </div>
                <div class="table_show">

                    <div class="table-fixed">
                        <!-- 员工 导入 -->
                        <table class="table table-border table-bordered table-hover table-bg" v-if="type == 'employee'">
                            <thead>
                            <tr class="text-c">
                                <th width="70">行数</th>
                                <th width="70">姓名</th>
                                <th width="50">性别</th>
                                <th width="120">部门</th>
                                <th width="80">职位</th>
                                <th width="100">电话</th>
                                <th width="100">工号</th>
                                <th width="100">员工卡号</th>
                                <th width="120">身份证</th>
                                <th width="50">等级</th>
                                <th width="80">学历</th>
                                <th width="130">分组</th>
                                <th width="200">失败原因</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="text-c" v-for="item in errorResults" track-by="$index">
                                <td>{{item.errorinfo | selectLine}}</td>
                                <td>{{item.real_name}}</td>
                                <td>{{item.sex==1? '男': '女'}}</td>
                                <td class="td-ellipsis">{{item.department||"--"}}</td>
                                <td class="td-ellipsis">{{item.position||"--"}}</td>
                                <td>{{item.phone}}</td>
                                <td>{{item.job_number}}</td>
                                <td>{{item.card_number && item.card_number !== 'None'?item.card_number:'--'}}</td>
                                <td>{{item.id_card && item.id_card != 'None'?item.id_card:'--'}}</td>
                                <td>{{item.level||"--"}}</td>
                                <td class="td-ellipsis">{{item.education||"--"}}</td>
                                <td>{{item.tags}}</td>
                                <td>{{item.errorinfo | deleteLine}}</td>
                            </tr>
                            </tbody>
                        </table>

                        <!-- 通勤车辆导入 -->
                        <table class="table table-border table-bordered table-hover table-bg"
                               v-if="type == 'bus'">
                            <thead>
                            <tr class="text-c">
                                <th width="70">行数</th>
                                <th width="70">车牌</th>
                                <th width="70">品牌</th>
                                <th width="70">型号</th>
                                <th width="70">颜色</th>
                                <th width="70">座位数</th>
                                <th width="150">车辆类型</th>
                                <th width="150">备注</th>
                                <th width="200">失败原因</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="text-c" v-for="item in errorResults" track-by="$index">
                                <td>{{item.errorinfo | selectLine}}</td>
                                <td>{{item.car_no || '--'}}</td>
                                <td>{{item.car_brand || '--'}}</td>
                                <td>{{item.car_model || '--'}}</td>
                                <td>{{item.car_color || '--'}}</td>
                                <td>{{item.seats || '--'}}</td>
                                <td>{{item.vehicle_type_name || '--'}}</td>
                                <td>{{item.remark || '--'}}</td>
                                <td>{{item.errorinfo | deleteLine}}</td>
                            </tr>
                            </tbody>
                        </table>

                        <!-- 公务车车辆导入 -->
                        <table class="table table-border table-bordered table-hover table-bg"
                               v-if="type == 'car'">
                            <thead>
                            <tr class="text-c">
                                <th width="70">行数</th>
                                <th width="70">车牌</th>
                                <th width="70">品牌</th>
                                <th width="70">型号</th>
                                <th width="70">颜色</th>
                                <th width="70">座位数</th>
                                <th width="150">车辆类型</th>
                                <th width="150">备注</th>
                                <th width="200">失败原因</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="text-c" v-for="item in errorResults" track-by="$index">
                                <td>{{item.errorinfo | selectLine}}</td>
                                <td>{{item.car_no || '--'}}</td>
                                <td>{{item.car_brand || '--'}}</td>
                                <td>{{item.car_model || '--'}}</td>
                                <td>{{item.car_color || '--'}}</td>
                                <td>{{item.seats || '--'}}</td>
                                <td>{{item.vehicle_type_name || '--'}}</td>
                                <td>{{item.remark || '--'}}</td>
                                <td>{{item.errorinfo | deleteLine}}</td>
                            </tr>
                            </tbody>
                        </table>

                        <!-- 私家车辆导入 -->
                        <table class="table table-border table-bordered table-hover table-bg"
                               v-if="type == 'privateCar'">
                            <thead>
                            <tr class="text-c">
                                <th width="70">行数</th>
                                <th width="100">姓名/性别</th>
                                <th width="100">部门/职位</th>
                                <th width="120">员工卡号</th>
                                <th width="100">工号</th>
                                <th width="120">电话</th>
                                <th width="100">车牌号</th>
                                <th width="200">失败原因</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="text-c" v-for="item in errorResults" track-by="$index">
                                <td>{{item.errorinfo | selectLine}}</td>
                                <td>{{item.real_name || '--'}}/{{item.sex || '--'}}</td>
                                <td>{{item.department || '--'}}/{{item.position || '--'}}</td>
                                <td>{{item.card_number || '--'}}</td>
                                <td>{{item.job_number || '--'}}</td>
                                <td>{{item.phone || '--'}}</td>
                                <td>{{item.car_no || '--'}}</td>
                                <td>{{item.errorinfo | deleteLine}}</td>
                            </tr>
                            </tbody>
                        </table>

                        <!-- 房间类型导入 -->
                        <table class="table table-border table-bordered table-hover table-bg"
                               v-if="type == 'roomType'">
                            <thead>
                            <tr class="text-c">
                                <th width="70">行数</th>
                                <th width="100">房间类型</th>
                                <th width="100">容纳人数</th>
                                <th width="100">床位</th>
                                <th width="120">配置</th>
                                <th width="200">失败原因</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="text-c" v-for="item in errorResults" track-by="$index">
                                <td>{{item.errorinfo | selectLine}}</td>
                                <td>{{item.room_type || '--'}}</td>
                                <td>{{item.content || '--'}}</td>
                                <td>{{item.bed_num || '--'}}</td>
                                <td>{{item.equipment || '--'}}</td>
                                <td>{{item.errorinfo | deleteLine}}</td>
                            </tr>
                            </tbody>
                        </table>

                        <!-- 宿舍导入 -->
                        <table class="table table-border table-bordered table-hover table-bg"
                               v-if="type == 'dormitory'">
                            <thead>
                            <tr class="text-c">
                                <th width="70">行数</th>
                                <th width="100">宿舍楼</th>
                                <th width="100">房间号</th>
                                <th width="100">房间类型</th>
                                <th width="120">房间分组</th>
                                <!--<th width="80">容纳人数</th>-->
                                <!--<th width="80">床位</th>-->
                                <!--<th width="120">配置</th>-->
                                <th width="200">失败原因</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="text-c" v-for="item in errorResults" track-by="$index">
                                <td>{{item.errorinfo | selectLine}}</td>
                                <td>{{item.building_name || '--'}}</td>
                                <td>{{item.room_no || '--'}}</td>
                                <td>{{item.room_type || '--'}}</td>
                                <td>{{item.room_tags || '--'}}</td>
                                <!--<td>{{item.content || '&#45;&#45;'}}</td>-->
                                <!--<td>{{item.bed_num || '&#45;&#45;'}}</td>-->
                                <!--<td>{{item.equipment || '&#45;&#45;'}}</td>-->
                                <td>{{item.errorinfo | deleteLine}}</td>
                            </tr>
                            </tbody>
                        </table>

                        <!-- 宿舍人员导入 -->
                        <table class="table table-border table-bordered table-hover table-bg" v-if="type == 'member'">
                            <thead>
                            <tr class="text-c">
                                <th width="70">行数</th>
                                <th width="100">姓名</th>
                                <th width="100">工号</th>
                                <th width="100">宿舍楼</th>
                                <th width="100">房间号</th>
                                <th width="100">押金</th>
                                <th width="100">押金票号</th>
                                <th width="200">失败原因</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="text-c" v-for="item in errorResults" track-by="$index">
                                <td>{{item.errorinfo | selectLine}}</td>
                                <td>{{item.real_name || '--'}}</td>
                                <td>{{item.job_number || '--'}}</td>
                                <td>{{item.building_name || '--'}}</td>
                                <td>{{item.room_no || '--'}}</td>
                                <td>{{item.room_no || '--'}}</td>
                                <td>{{item.room_no || '--'}}</td>
                                <td>{{item.errorinfo | deleteLine}}</td>
                            </tr>
                            </tbody>
                        </table>

                        <!-- 水电导入 -->
                        <table class="table table-border table-bordered table-hover table-bg" v-if="type == 'waterEle'">
                            <thead>
                            <tr class="text-c">
                                <th width="70">行数</th>
                                <th width="120">所属计费单</th>
                                <th width="120">宿舍楼</th>
                                <th width="120">房间号</th>
                                <th width="120">上次水量</th>
                                <th width="120">本次水量</th>
                                <th width="120">上次电量</th>
                                <th width="120">本次电量</th>
                                <th width="200">失败原因</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="text-c" v-for="item in errorResults" track-by="$index">
                                <td>{{item.errorinfo | selectLine}}</td>
                                <td>{{item.bill_name || '--'}}</td>
                                <td>{{item.building_name || '--'}}</td>
                                <td>{{item.room_no || '--'}}</td>
                                <td>{{item.last_water_degrees || '--'}}</td>
                                <td>{{item.water_degrees || '--'}}</td>
                                <td>{{item.last_electricity_degrees || '--'}}</td>
                                <td>{{item.electricity_consumption || '--'}}</td>
                                <td>{{item.errorinfo | deleteLine}}</td>
                            </tr>
                            </tbody>
                        </table>

                        <!-- 维修材料导入 -->
                        <table class="table table-border table-bordered table-hover table-bg"
                               v-if="type == 'material'">
                            <thead>
                            <tr class="text-c">
                                <th width="70">行数</th>
                                <th width="120">材料类型</th>
                                <th width="120">材料名称</th>
                                <th width="120">型号规格</th>
                                <th width="120">品牌</th>
                                <th width="120">属性</th>
                                <th width="120">单位</th>
                                <th width="120">单价(元)</th>
                                <th width="120">来源</th>
                                <th width="200">失败原因</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="text-c" v-for="item in errorResults" track-by="$index">
                                <td>{{item.errorinfo | selectLine}}</td>
                                <td>{{item.class_name || '--'}}</td>
                                <td>{{item.name || '--'}}</td>
                                <td>{{item.format || '--'}}</td>
                                <td>{{item.brand || '--'}}</td>
                                <td>{{item.prop || '--'}}</td>
                                <td>{{item.unit || '--'}}</td>
                                <td>{{item.price || '--'}}</td>
                                <td>{{item.source || '--'}}</td>
                                <td>{{item.errorinfo | deleteLine}}</td>
                            </tr>
                            </tbody>
                        </table>

                        <!-- 领用物资导入 -->
                        <table class="table table-border table-bordered table-hover table-bg"
                               v-if="type == 'goods'">
                            <thead>
                            <tr class="text-c">
                                <th width="70">行数</th>
                                <th width="120">类目</th>
                                <th width="120">物资名称</th>
                                <th width="120">型号规格</th>
                                <th width="120">单位</th>
                                <th width="120">库存</th>
                                <th width="120">单价(元)</th>
                                <th width="120">备注</th>
                                <th width="200">失败原因</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="text-c" v-for="item in errorResults" track-by="$index">
                                <td>{{item.errorinfo | selectLine}}</td>
                                <td>{{item.type || '--'}}</td>
                                <td>{{item.name || '--'}}</td>
                                <td>{{item.format || '--'}}</td>
                                <td>{{item.unit || '--'}}</td>
                                <td>{{item.stock || '--'}}</td>
                                <td>{{item.price || '--'}}</td>
                                <td>{{item.remark || '--'}}</td>
                                <td>{{item.errorinfo | deleteLine}}</td>
                            </tr>
                            </tbody>
                        </table>

                        <!-- ETC导入 -->
                        <table class="table table-border table-bordered table-hover table-bg" v-if="type == 'ETC'">
                            <thead>
                            <tr class="text-c">
                                <th width="70">行数</th>
                                <th width="120">交易时间</th>
                                <th width="120">卡号</th>
                                <th width="120">车牌号</th>
                                <th width="120">交易金额</th>
                                <th width="120">交易类型</th>
                                <th width="120">交易摘要</th>
                                <th width="120">清算时间</th>
                                <th width="200">银行记账</th>
                                <th width="200">错误信息</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="text-c" v-for="item in errorResults" track-by="$index">
                                <td>{{item.errorinfo | selectLine}}</td>
                                <td>{{item.fee_date || '--'}}</td>
                                <td>{{item.car_number || '--'}}</td>
                                <td>{{item.car_no || '--'}}</td>
                                <td>{{item.fee || '--'}}</td>
                                <td>{{item.type || '--'}}</td>
                                <td>{{item.summary || '--'}}</td>
                                <td>{{item.qssj || '--'}}</td>
                                <td>{{item.yhjz || '--'}}</td>
                                <td>{{item.errorinfo | deleteLine}}</td>
                            </tr>
                            </tbody>
                        </table>

                        <!-- 私家车补贴人员导入 -->
                        <table class="table table-border table-bordered table-hover table-bg" v-if="type == 'subsidy'">
                            <thead>
                            <tr class="text-c">
                                <th width="70">行数</th>
                                <th width="120">姓名</th>
                                <th width="120">工号</th>
                                <th width="200">错误信息</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="text-c" v-for="item in errorResults" track-by="$index">
                                <td>{{item.errorinfo | selectLine}}</td>
                                <td>{{item.real_name || '--'}}</td>
                                <td>{{item.job_number || '--'}}</td>
                                <td>{{item.errorinfo | deleteLine}}</td>
                            </tr>
                            </tbody>
                        </table>

                        <!-- 摆渡车排班导入 -->
                        <table class="table table-border table-bordered table-hover table-bg"
                               v-if="type == 'ferryBusDispatch'">
                            <thead>
                            <tr class="text-c">
                                <th width="70">行数</th>
                                <th width="120">线路名称</th>
                                <th width="120">司机名称</th>
                                <th width="120">司机电话</th>
                                <th width="120">排期日期</th>
                                <th width="120">发车时间</th>
                                <th width="120">车号/车牌号</th>
                                <th width="200">失败原因</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="text-c" v-for="item in errorResults" track-by="$index">
                                <td>{{item.errorinfo | selectLine}}</td>
                                <td>{{item.shuttle_name || '--'}}</td>
                                <td>{{item.driver_name || '--'}}</td>
                                <td>{{item.driver_phone || '--'}}</td>
                                <td>{{item.dep_date || '--'}}</td>
                                <td>{{item.dep_time || '--'}}</td>
                                <td>{{item.car_flag || '--'}}/{{item.car_no || '--'}}</td>
                                <td>{{item.errorinfo | deleteLine}}</td>
                            </tr>
                            </tbody>
                        </table>

                        <!-- 摆渡车辆导入 -->
                        <table class="table table-border table-bordered table-hover table-bg"
                               v-if="type == 'ferryBusVehicle'">
                            <thead>
                            <tr class="text-c">
                                <th width="70">行数</th>
                                <th width="70">车牌</th>
                                <th width="70">品牌</th>
                                <th width="70">型号</th>
                                <th width="70">颜色</th>
                                <th width="70">座位数</th>
                                <th width="150">车辆类型</th>
                                <th width="150">备注</th>
                                <th width="200">失败原因</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="text-c" v-for="item in errorResults" track-by="$index">
                                <td>{{item.errorinfo | selectLine}}</td>
                                <td>{{item.car_no || '--'}}</td>
                                <td>{{item.car_brand || '--'}}</td>
                                <td>{{item.car_model || '--'}}</td>
                                <td>{{item.car_color || '--'}}</td>
                                <td>{{item.seats || '--'}}</td>
                                <td>{{item.vehicle_type_name || '--'}}</td>
                                <td>{{item.remark || '--'}}</td>
                                <td>{{item.errorinfo | deleteLine}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="table_show_container">

                        <!-- 员工 导入 -->
                        <table class="table table-border table-bordered table-hover table-bg" v-if="type == 'employee'">
                            <thead>
                            <tr class="text-c">
                                <th width="70">行数</th>
                                <th width="70">姓名</th>
                                <th width="50">性别</th>
                                <th width="120">部门</th>
                                <th width="80">职位</th>
                                <th width="100">电话</th>
                                <th width="100">工号</th>
                                <th width="100">员工卡号</th>
                                <th width="120">身份证</th>
                                <th width="50">等级</th>
                                <th width="80">学历</th>
                                <th width="130">分组</th>
                                <th width="200">失败原因</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="text-c" v-for="item in errorResults" track-by="$index">
                                <td>{{item.errorinfo | selectLine}}</td>
                                <td>{{item.real_name}}</td>
                                <td>{{item.sex==1? '男': '女'}}</td>
                                <td class="td-ellipsis">{{item.department||"--"}}</td>
                                <td class="td-ellipsis">{{item.position||"--"}}</td>
                                <td>{{item.phone}}</td>
                                <td>{{item.job_number}}</td>
                                <td>{{item.card_number && item.card_number !== 'None'?item.card_number:'--'}}</td>
                                <td>{{item.id_card && item.id_card != 'None'?item.id_card:'--'}}</td>
                                <td>{{item.level||"--"}}</td>
                                <td class="td-ellipsis">{{item.education||"--"}}</td>
                                <td>{{item.tags}}</td>
                                <td>{{item.errorinfo | deleteLine}}</td>
                            </tr>
                            </tbody>
                        </table>

                        <!-- 通勤车辆导入 -->
                        <table class="table table-border table-bordered table-hover table-bg" v-if="type == 'bus'">
                            <thead>
                            <tr class="text-c">
                                <th width="70">行数</th>
                                <th width="70">车牌</th>
                                <th width="70">品牌</th>
                                <th width="70">型号</th>
                                <th width="70">颜色</th>
                                <th width="70">座位数</th>
                                <th width="150">车辆类型</th>
                                <th width="150">备注</th>
                                <th width="200">失败原因</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="text-c" v-for="item in errorResults" track-by="$index">
                                <td>{{item.errorinfo | selectLine}}</td>
                                <td>{{item.car_no || '--'}}</td>
                                <td>{{item.car_brand || '--'}}</td>
                                <td>{{item.car_model || '--'}}</td>
                                <td>{{item.car_color || '--'}}</td>
                                <td>{{item.seats || '--'}}</td>
                                <td>{{item.vehicle_type_name || '--'}}</td>
                                <td>{{item.remark || '--'}}</td>
                                <td>{{item.errorinfo | deleteLine}}</td>
                            </tr>
                            </tbody>
                        </table>

                        <!-- 公务车车辆导入 -->
                        <table class="table table-border table-bordered table-hover table-bg" v-if="type == 'car' || type == 'carV2' ">
                            <thead>
                            <tr class="text-c">
                                <th width="70">行数</th>
                                <th width="70">车牌</th>
                                <th width="70">品牌</th>
                                <th width="70">型号</th>
                                <th width="70">颜色</th>
                                <th width="70">座位数</th>
                                <th width="150">车辆类型</th>
                                <th width="150">备注</th>
                                <th width="200">失败原因</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="text-c" v-for="item in errorResults" track-by="$index">
                                <td>{{item.errorinfo | selectLine}}</td>
                                <td>{{item.car_no || '--'}}</td>
                                <td>{{item.car_brand || '--'}}</td>
                                <td>{{item.car_model || '--'}}</td>
                                <td>{{item.car_color || '--'}}</td>
                                <td>{{item.seats || '--'}}</td>
                                <td>{{item.vehicle_type_name || '--'}}</td>
                                <td>{{item.remark || '--'}}</td>
                                <td>{{item.errorinfo | deleteLine}}</td>
                            </tr>
                            </tbody>
                        </table>

                        <!-- 私家车辆导入 -->
                        <table class="table table-border table-bordered table-hover table-bg"
                               v-if="type == 'privateCar'">
                            <thead>
                            <tr class="text-c">
                                <th width="70">行数</th>
                                <th width="100">姓名/性别</th>
                                <th width="100">部门/职位</th>
                                <th width="120">员工卡号</th>
                                <th width="100">工号</th>
                                <th width="120">电话</th>
                                <th width="100">车牌号</th>
                                <th width="200">失败原因</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="text-c" v-for="item in errorResults" track-by="$index">
                                <td>{{item.errorinfo | selectLine}}</td>
                                <td>{{item.real_name || '--'}}/{{item.sex || '--'}}</td>
                                <td>{{item.department || '--'}}/{{item.position || '--'}}</td>
                                <td>{{item.card_number || '--'}}</td>
                                <td>{{item.job_number || '--'}}</td>
                                <td>{{item.phone || '--'}}</td>
                                <td>{{item.car_no || '--'}}</td>
                                <td>{{item.errorinfo | deleteLine}}</td>
                            </tr>
                            </tbody>
                        </table>

                        <!-- 房间类型导入 -->
                        <table class="table table-border table-bordered table-hover table-bg" v-if="type == 'roomType'">
                            <thead>
                            <tr class="text-c">
                                <th width="70">行数</th>
                                <th width="100">房间类型</th>
                                <th width="100">容纳人数</th>
                                <th width="100">床位</th>
                                <th width="120">配置</th>
                                <th width="200">失败原因</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="text-c" v-for="item in errorResults" track-by="$index">
                                <td>{{item.errorinfo | selectLine}}</td>
                                <td>{{item.room_type || '--'}}</td>
                                <td>{{item.content || '--'}}</td>
                                <td>{{item.bed_num || '--'}}</td>
                                <td>{{item.equipment || '--'}}</td>
                                <td>{{item.errorinfo | deleteLine}}</td>
                            </tr>
                            </tbody>
                        </table>

                        <!-- 宿舍导入 -->
                        <table class="table table-border table-bordered table-hover table-bg"
                               v-if="type == 'dormitory'">
                            <thead>
                            <tr class="text-c">
                                <th width="70">行数</th>
                                <th width="100">宿舍楼</th>
                                <th width="100">房间号</th>
                                <th width="100">房间类型</th>
                                <th width="120">房间分组</th>
                                <!--<th width="80">容纳人数</th>-->
                                <!--<th width="80">床位</th>-->
                                <!--<th width="120">配置</th>-->
                                <th width="200">失败原因</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="text-c" v-for="item in errorResults" track-by="$index">
                                <td>{{item.errorinfo | selectLine}}</td>
                                <td>{{item.building_name || '--'}}</td>
                                <td>{{item.room_no || '--'}}</td>
                                <td>{{item.room_type || '--'}}</td>
                                <td>{{item.room_tags || '--'}}</td>
                                <!--<td>{{item.content || '&#45;&#45;'}}</td>-->
                                <!--<td>{{item.bed_num || '&#45;&#45;'}}</td>-->
                                <!--<td>{{item.equipment || '&#45;&#45;'}}</td>-->
                                <td>{{item.errorinfo | deleteLine}}</td>
                            </tr>
                            </tbody>
                        </table>

                        <!-- 宿舍人员导入 -->
                        <table class="table table-border table-bordered table-hover table-bg" v-if="type == 'member'">
                            <thead>
                            <tr class="text-c">
                                <th width="70">行数</th>
                                <th width="100">姓名</th>
                                <th width="100">工号</th>
                                <th width="100">宿舍楼</th>
                                <th width="100">房间号</th>
                                <th width="100">押金</th>
                                <th width="100">押金票号</th>
                                <th width="200">失败原因</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="text-c" v-for="item in errorResults" track-by="$index">
                                <td>{{item.errorinfo | selectLine}}</td>
                                <td>{{item.real_name || '--'}}</td>
                                <td>{{item.job_number || '--'}}</td>
                                <td>{{item.building_name || '--'}}</td>
                                <td>{{item.room_no || '--'}}</td>
                                <td>{{item.deposit || '--'}}</td>
                                <td>{{item.deposit_no || '--'}}</td>
                                <td>{{item.errorinfo | deleteLine}}</td>
                            </tr>
                            </tbody>
                        </table>

                        <!-- 水电导入 -->
                        <table class="table table-border table-bordered table-hover table-bg" v-if="type == 'waterEle'">
                            <thead>
                            <tr class="text-c">
                                <th width="70">行数</th>
                                <th width="120">所属计费单</th>
                                <th width="120">宿舍楼</th>
                                <th width="120">房间号</th>
                                <th width="120">上次水量</th>
                                <th width="120">本次水量</th>
                                <th width="120">上次电量</th>
                                <th width="120">本次电量</th>
                                <th width="200">失败原因</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="text-c" v-for="item in errorResults" track-by="$index">
                                <td>{{item.errorinfo | selectLine}}</td>
                                <td>{{item.bill_name || '--'}}</td>
                                <td>{{item.building_name || '--'}}</td>
                                <td>{{item.room_no || '--'}}</td>
                                <td>{{item.last_water_degrees || '--'}}</td>
                                <td>{{item.water_degrees || '--'}}</td>
                                <td>{{item.last_electricity_degrees || '--'}}</td>
                                <td>{{item.electricity_consumption || '--'}}</td>
                                <td>{{item.errorinfo | deleteLine}}</td>
                            </tr>
                            </tbody>
                        </table>

                        <!-- 维修材料导入 -->
                        <table class="table table-border table-bordered table-hover table-bg" v-if="type == 'material'">
                            <thead>
                            <tr class="text-c">
                                <th width="70">行数</th>
                                <th width="120">材料类型</th>
                                <th width="120">材料名称</th>
                                <th width="120">型号规格</th>
                                <th width="120">品牌</th>
                                <th width="120">属性</th>
                                <th width="120">单位</th>
                                <th width="120">单价(元)</th>
                                <th width="120">来源</th>
                                <th width="200">失败原因</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="text-c" v-for="item in errorResults" track-by="$index">
                                <td>{{item.errorinfo | selectLine}}</td>
                                <td>{{item.class_name || '--'}}</td>
                                <td>{{item.name || '--'}}</td>
                                <td>{{item.format || '--'}}</td>
                                <td>{{item.brand || '--'}}</td>
                                <td>{{item.prop || '--'}}</td>
                                <td>{{item.unit || '--'}}</td>
                                <td>{{item.price || '--'}}</td>
                                <td>{{item.source || '--'}}</td>
                                <td>{{item.errorinfo | deleteLine}}</td>
                            </tr>
                            </tbody>
                        </table>

                        <!-- 领用物资导入 -->
                        <table class="table table-border table-bordered table-hover table-bg" v-if="type == 'goods'">
                            <thead>
                            <tr class="text-c">
                                <th width="70">行数</th>
                                <th width="120">类目</th>
                                <th width="120">物资名称</th>
                                <th width="120">型号规格</th>
                                <th width="120">单位</th>
                                <th width="120">库存</th>
                                <th width="120">单价(元)</th>
                                <th width="120">备注</th>
                                <th width="200">失败原因</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="text-c" v-for="item in errorResults" track-by="$index">
                                <td>{{item.errorinfo | selectLine}}</td>
                                <td>{{item.type || '--'}}</td>
                                <td>{{item.name || '--'}}</td>
                                <td>{{item.format || '--'}}</td>
                                <td>{{item.unit || '--'}}</td>
                                <td>{{item.stock || '--'}}</td>
                                <td>{{item.price || '--'}}</td>
                                <td>{{item.remark || '--'}}</td>
                                <td>{{item.errorinfo | deleteLine}}</td>
                            </tr>
                            </tbody>
                        </table>

                        <!-- ETC导入 -->
                        <table class="table table-border table-bordered table-hover table-bg" v-if="type == 'ETC'">
                            <thead>
                            <tr class="text-c">
                                <th width="70">行数</th>
                                <th width="120">交易时间</th>
                                <th width="120">卡号</th>
                                <th width="120">车牌号</th>
                                <th width="120">交易金额</th>
                                <th width="120">交易类型</th>
                                <th width="120">交易摘要</th>
                                <th width="120">清算时间</th>
                                <th width="200">银行记账</th>
                                <th width="200">错误信息</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="text-c" v-for="item in errorResults" track-by="$index">
                                <td>{{item.errorinfo | selectLine}}</td>
                                <td>{{item.fee_date || '--'}}</td>
                                <td>{{item.car_number || '--'}}</td>
                                <td>{{item.car_no || '--'}}</td>
                                <td>{{item.fee || '--'}}</td>
                                <td>{{item.type || '--'}}</td>
                                <td>{{item.summary || '--'}}</td>
                                <td>{{item.qssj || '--'}}</td>
                                <td>{{item.yhjz || '--'}}</td>
                                <td>{{item.errorinfo | deleteLine}}</td>
                            </tr>
                            </tbody>
                        </table>

                        <!-- 私家车补贴人员导入 -->
                        <table class="table table-border table-bordered table-hover table-bg" v-if="type == 'subsidy'">
                            <thead>
                            <tr class="text-c">
                                <th width="70">行数</th>
                                <th width="120">姓名</th>
                                <th width="120">工号</th>
                                <th width="200">错误信息</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="text-c" v-for="item in errorResults" track-by="$index">
                                <td>{{item.errorinfo | selectLine}}</td>
                                <td>{{item.real_name || '--'}}</td>
                                <td>{{item.job_number || '--'}}</td>
                                <td>{{item.errorinfo | deleteLine}}</td>
                            </tr>
                            </tbody>
                        </table>

                        <!-- 摆渡车排班导入 -->
                        <table class="table table-border table-bordered table-hover table-bg"
                               v-if="type == 'ferryBusDispatch'">
                            <thead>
                            <tr class="text-c">
                                <th width="70">行数</th>
                                <th width="120">线路名称</th>
                                <th width="120">司机名称</th>
                                <th width="120">司机电话</th>
                                <th width="120">排期日期</th>
                                <th width="120">发车时间</th>
                                <th width="120">车号/车牌号</th>
                                <th width="200">失败原因</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="text-c" v-for="item in errorResults" track-by="$index">
                                <td>{{item.errorinfo | selectLine}}</td>
                                <td>{{item.shuttle_name || '--'}}</td>
                                <td>{{item.driver_name || '--'}}</td>
                                <td>{{item.driver_phone || '--'}}</td>
                                <td>{{item.dep_date || '--'}}</td>
                                <td>{{item.dep_time || '--'}}</td>
                                <td>{{item.car_flag || '--'}}/{{item.car_no || '--'}}</td>
                                <td>{{item.errorinfo | deleteLine}}</td>
                            </tr>
                            </tbody>
                        </table>
                        <!-- 摆渡车辆导入 -->
                        <table class="table table-border table-bordered table-hover table-bg"
                               v-if="type == 'ferryBusVehicle'">
                            <thead>
                            <tr class="text-c">
                                <th width="70">行数</th>
                                <th width="70">车牌</th>
                                <th width="70">品牌</th>
                                <th width="70">型号</th>
                                <th width="70">颜色</th>
                                <th width="70">座位数</th>
                                <th width="150">车辆类型</th>
                                <th width="150">备注</th>
                                <th width="200">失败原因</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="text-c" v-for="item in errorResults" track-by="$index">
                                <td>{{item.errorinfo | selectLine}}</td>
                                <td>{{item.car_no || '--'}}</td>
                                <td>{{item.car_brand || '--'}}</td>
                                <td>{{item.car_model || '--'}}</td>
                                <td>{{item.car_color || '--'}}</td>
                                <td>{{item.seats || '--'}}</td>
                                <td>{{item.vehicle_type_name || '--'}}</td>
                                <td>{{item.remark || '--'}}</td>
                                <td>{{item.errorinfo | deleteLine}}</td>
                            </tr>
                            </tbody>
                        </table>

                        <div class="no-data text-c mt-50" v-if="errorResults.length == 0">没有相关数据</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="m-loading" v-if="loading">
            <div class="cube1"></div>
            <div class="cube2"></div>
        </div>
    </section>
</template>

<script type="text/ecmascript-6">
    import * as base from '../assets/js/base.js';

    export default{
        name: 'importMould',
        ready () {
            var type = this.$route.query.importType || localStorage.getItem('_importMouldType');
            if(!type || !this.importList[type]) {
                localStorage.removeItem('_importMouldType');
                layer.msg("接收参数异常", {icon:2, time: 2000});
                setTimeout(() => {
                    history.back();
                }, 2000)
            }  else {
                localStorage.setItem('_importMouldType', type);
                this.type = type;
            }
        },
        /**
         * type :
         * 员工管理 employee
         * 通勤车 bus
         * 公务车 car
         * 私家车 privateCar
         * 宿舍 dormitory
         * 宿舍人员 member
         * 水电 waterEle
         * 维修材料 material
         * 物资管理 goods
         * 摆渡车 ferryBushttp://www.pinbayun.com/static/xls/排班导入模板.xlsx
         */
        data: function () {
            return {
                loading: false,
                selectFileName: '',
                type: 'employee',
                selectFile: null,
                progressIntervalId: null, // 循环发送请求进度 interval id
                errorIndex: -1, // 上传进度 错误序号
                isProgressing: false, // 是否在上传过程中
                taskId: null, // 上传任务id
                preUrl: 'http://www.pinbayun.com/static/xls/',
                importList: { // 导入类型列表
                    employee: {
                        title: "部门员工",
                        tableName: "员工",
                        importUrl: 'staffs',
                        needPostfix: true,
                        demoName: '员工导入模板', // 就是模板的名称，但是由于后台命名模板总是会变动，所以这个就没有用了
//                        demoUrl: ''
                    },
                    bus: {
                        title: "通勤车",
                        tableName: "车辆",
                        importUrl: 'shuttlebusvehicles',
                        needPostfix: true,
                        demoName: '通勤车导入模板',
                        demoUrl: ''
                    },
                    car: {
                        title: "公务车",
                        tableName: "车辆",
                        importUrl: 'officialcarvehicles',
                        needPostfix: true,
                        demoName: '公务车导入模板',
                        demoUrl: ''
                    },
                    // 公务车V2
                    carV2: {
                        title: "公务车V2",
                        tableName: "车辆",
                        importUrl: 'officialcarVehicleList_V2',
                        needPostfix: true,
                        demoName: '公务车2导入模板',
                        demoUrl: ''
                    },
                    ETC: {
                        title: "ETC",
                        tableName: "ETC",
                        importUrl: 'officialcarOrder_V2',
                        needPostfix: false,
                        demoName: 'ETC导入模板',
                        demoUrl: ''
                    },
                    privateCar: {
                        title: "私家车",
                        tableName: "车辆",
                        importUrl: 'privateCar',
                        needPostfix: true,
                        demoName: '私家车导入模板',
                        demoUrl: ''
                    },
                    dormitory: {
                        title: "宿舍",
                        tableName: "宿舍",
                        importUrl: 'roomsImport',
                        needPostfix: false,
                        demoName: '宿舍导入模板',
                        demoUrl: ''
                    },
                    member: {
                        title: "宿舍人员",
                        tableName: "宿舍人员",
                        importUrl: 'roomsStaffsImport',
                        needPostfix: false,
                        demoName: '宿舍人员导入模板',
                        demoUrl: ''
                    },
                    roomType: {
                        title: "房间类型",
                        tableName: "房间类型",
                        importUrl: 'roomtypes',
                        needPostfix: true,
                        demoName: '房间类型导入模板',
                        demoUrl: ''
                    },
                    waterEle: {
                        title: "水电",
                        tableName: "水电",
                        importUrl: 'bills',
                        needPostfix: true,
                        demoName: '水电导入模板',
                        demoUrl: ''
                    },
                    material: {
                        title: "维修材料",
                        tableName: "维修材料",
                        importUrl: 'materials',
                        needPostfix: true,
                        demoName: '材料导入模板',
                        demoUrl: ''
                    },
                    goods: {
                        title: "物资管理",
                        tableName: "物资",
                        importUrl: 'materialsList',
                        needPostfix: true,
                        demoName: '物资导入模板',
                        demoUrl: ''
                    },
                    subsidy: {
                        title: "私家车补贴人员",
                        tableName: "私家车补贴人员",
                        importUrl: 'subsidyList',
                        needPostfix: false,
                        demoName: '生效人员导入',
                        demoUrl: ''
                    },
                    ferryBusVehicle: {
                        title: "摆渡车",
                        tableName: "车辆",
                        importUrl: 'ferryBusList',
                        needPostfix: true,
                        demoName: '摆渡车导入模板',
                        demoUrl: ''
                    },
                    ferryBusDispatch: {
                        title: "摆渡车排班",
                        tableName: "摆渡车排班",
                        importUrl: 'ferryBusDispatch',
                        needPostfix: true,
                        demoName: '排班导入模板',
                        demoUrl: ''
                    },
                },
                errorInfo: {
                    total: 0,
                    error: 0,
                    add: 0,
                    cover: 0,
                    complete: 0
                },
                errorResults: [], // 错误列表
                isChange: false, // 是否有上传
                percentNumber: 0 // 上传进度百分比
            }
        },
        events: {
            screenSizeChange: function () {
                this.fixedTableTitle();
            }
        },
        methods: {
            selectExcel () {
                $("#uploadInput").trigger("click");
            },
            finishLoading () {
                this.isProgressing = false;
                if (this.progressIntervalId != null) {
                    clearInterval(this.progressIntervalId);
                    this.progressIntervalId = null;
                }
            },
            // 获取进度
            getProgress () {
                $.ajax({
                    url: base.gAjaxUrl.uploadProgress + this.taskId + '/process/',
                    type: 'GET',
                    data: {
                        index: this.errorIndex == -1 ? 0 : this.errorIndex
//                        index: 0
                    }
                }).always((data)=> {
                    if (!this.isProgressing) {
                        return;
                    }
                    if (!/^2\d{2}$/.test(data.status) && data.readyState != undefined) {
                        layer.msg("导入出错", {icon: 2, time: 2000});
                        this.finishLoading();
                        return;
                    }
                    if (data.total == 0) {
                        this.percentNumber = 0;
                    } else {
                        this.percentNumber = Math.round((data.complete + data.error) / data.total * 100);
                    }
                    console.log("data");
                    console.log(data);
                    if (data.status && (data.total == data.error + data.complete)) {
                        console.log("finish");
                        this.percentNumber = 100;
                        this.finishLoading();
                    }
                    this.errorInfo.total = data.total; // 总数量
                    this.errorInfo.error = data.error; // 失败数量
                    this.errorInfo.add = data.add; // 完成数量 = 成功 + 覆盖
                    this.errorInfo.cover = data.cover; // 覆盖数量
                    this.errorInfo.complete = data.complete; // 覆盖数量
                    if (data.errorlist instanceof Array
                            && data.errorlist.length
                            && data.index > this.errorIndex
                            && data.index == this.errorResults.length + data.errorlist.length) {
                        this.errorIndex = data.index;
                        this.errorResults = this.errorResults.concat(data.errorlist);
                        this.fixedTableTitle();
                    }
                })
            },
            fixedTableTitle: function () {
                this.$nextTick(()=> {
                    $(".table_show .table-fixed").css({
                        width: $(".table_show_container .table").outerWidth(),
                        height: $(".table_show_container .table thead").outerHeight()
                    });
                })
            },
            queryAjax: function () {
                this.loading = true;
                this.isChange = true;
                this.isProgressing = true;
                let formData = new FormData($("#uploadForm")[0]);
                var obj = this.importList[this.type];
                var url = base.gAjaxUrl[obj.importUrl];
                if (obj.needPostfix) {
                    url += 'imports/'
                }
                if(obj.title == 'ETC'){
                    url += 'import_etc/'
                }
                if(obj.title == '私家车补贴人员'){
                    let id = localStorage.getItem("subsidyId")
                    url += `${id}/import_staff/`
                }
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false
                }).always((data)=> {
                    this.loading = false;
                    if (typeof data.pk == 'string') {
                        this.taskId = data.pk;
                        this.progressIntervalId = setInterval(() => {
                            this.getProgress();
                        }, 300)
                    } else {
                        this.finishLoading();
//                        console.log(data);
//                        if(data.status == 0) {// 当没有网络或者连接失败或者文件过大 data.status 都是0
//                            layer.msg("文件过大，无法上传", {icon: 2, time: 1500});
//                            return;
//                        }
                        base.ajaxCallback(data);
                    }
                })
            },
            upLoadExcel () {
                this.resetNumber();
                if ($("input[name='file']")[0].files.length == 0) {
                    layer.msg('请先选择需要导入的文件', {icon: 2, time: 1000});
                    return
                }
                this.queryAjax();
            },
            setSelectFile (e) {
                if (e.target.files.length) {
                    this.selectFile = e.target.files[0];
                    this.selectFileName = this.selectFile.name;
                } else {
                    this.selectFile = null;
                    this.selectFileName = '';
                }

                this.resetNumber();
//                console.log("selectFileName: ", this.selectFileName);
//                this.selectFileName = this.selectFile.name.replace(/\.xls$|\.xlsx$/, "");// 去掉后缀名
            },
            resetNumber () {
                this.percentNumber = 0; // 每次重新选择文件都将进度置为0
                this.errorInfo.total = 0;
                this.errorInfo.error = 0;
                this.errorInfo.add = 0;
                this.errorInfo.cover = 0;
                this.errorInfo.complete = 0;
                this.errorIndex = -1;
                this.errorResults = [];
                this.taskId = null;
            },
            exportFailResults () {
                this.loading = true;
                if (this.taskId) {
                    $.ajax({
                        url: base.gAjaxUrl.uploadProgress + this.taskId + '/error_export/',
                        type: 'GET',
                    }).always((data)=> {
//                        console.log("data: ", data);
                        this.loading = false;
                        base.ajaxCallback(data, ()=> {
                            window.open(data.error_download_url)
                        })
                    })
                } else {
                    layer.msg("无失败结果", {icon: 2, time: 1500});
                }
            },
            back () {
                if (this.isProgressing) {
                    layer.confirm('文件未上传完成，确认离开此页？', (index)=> {
//                        this.$dispatch("dialog-close", this.isChange);
                        layer.closeAll();
                        window.history.back();
                    });
                } else {
//                    this.$dispatch("dialog-close", this.isChange);
                    window.history.back();
                }
            }
        },
        filters: {
            deleteLine (str) {
                return str.replace(/^行数\d+[，,: ]/, "");
            },
            selectLine (str) {
                return str.match(/^行数\d+[，,: ]/)[0].slice(2, -1);
            }
        },
        beforeDestroy: function () {
            console.log("beforeDestroy: ");
            clearInterval(this.progressIntervalId);
        },
        components: {}
    }
</script>

<style scoped lang="less" rel="stylesheet/less">
    .page-container {
        min-height: 600px;
        height: 100%;
        box-sizing: border-box;
        overflow-y: auto;
        position: relative;
        font-size: 14px;
        .content {
            position: absolute;
            top: 88px;
            left: 20px;
            right: 20px;
            bottom: 20px;
            .c-3fa {
                color: #3fa8ef;
            }
            /* 标签 */
            .tag_container {
                width: 80px;
                margin: 0 auto;
            }
            .upLoadBtn {
                width: 120px;
            }
            .progress {
                width: 800px;
                height: 25px;
                box-sizing: border-box;
                border-radius: 5px;
                border: 1px solid #ccc;
                overflow: hidden;
                .progress_inner {
                    height: 100%;
                    font-size: 14px;
                    line-height: 23px;
                    box-sizing: border-box;
                    background-color: #00CC99;
                    text-align: right;
                    .progress_inner_txt {
                        padding-right: 20px;
                        min-width: 60px;
                        text-align: right;
                        white-space: nowrap;
                        color: #000;
                    }
                }
            }
            .import_results {
                line-height: 30px;
            }
            .import_abstract_fail {
                line-height: 25px;
                height: 25px;
            }
            .btn {
                padding: 1px 12px;
                height: 25px;
                font-size: 12px;
            }
            .table_show {
                position: absolute;
                left: 20px;
                top: 280px;
                right: 20px;
                bottom: 20px;
                overflow: hidden;
                box-sizing: border-box;
                background-color: #fefefe;
                & > .table-fixed { /* 想固定表头，但是右边有滚动条对不齐，暂时不做了 */
                    position: absolute;
                    z-index: 100;
                    top: 0;
                    left: 0;
                    width: 100%;
                    overflow: hidden;
                    .table {
                        width: 100%;
                    }
                }
                .table_show_container {
                    width: 100%;
                    height: 100%;
                    overflow-x: hidden;
                    overflow-y: auto;
                    position: relative;
                    box-shadow: 0 0 0 1px #ccc inset;
                    box-sizing: border-box;
                    .div_fixed {
                        position: fixed;
                        z-index: 110;
                        top: 0;
                        left: 0;
                        bottom: 0;
                        right: 0;
                        background-color: green;
                    }
                }
            }
        }
    }

    .leftBorder {
        border-left: 8px solid #ccc;
        box-sizing: border-box;
    }

    #uploadInput, #uploadForm {
        width: 0;
        height: 0;
        overflow: hidden;
    }
</style>
