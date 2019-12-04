/**
 * Created by Administrator on 2017/11/7.
 */



    /* 这些值都是必传
    * data是个对象
    * url：服务器的url地址 字符串
    * time: 检测连接的时长  单位为毫秒
    * text: 发送给服务器的测试连接的内容，可随便定义
    * againTime : 重连的延迟时长，单位毫秒
    * lockReconnect : 防止多次触发重连，默认为false
    *  function  initWebScoket() {
         ws.addEventListener("message",function (e) {
     })
     }     这个方法在外面定义，方法名不能为错。

     ws 是外部传进来接收创建出来的WebScoket的实例对象
    * */
export default  function  webScoketHeartBeat(that) {
    console.log("创建that.ws之前");
    console.log(that.ws);
    var lockReconnect = false;//避免重复连接
        // 重连的方法
        function reconnect() {
            // 如果已经连接上,就不用重连
            if(lockReconnect) return;
            lockReconnect = true;
            //没连接上会一直重连，设置延迟避免请求过多
            setTimeout(function () {
                // 开始重连
                webScoketHeartBeat(that);
                lockReconnect = false;
            }, that.wsData.againTime);
        }


        that.ws = new WebSocket(that.wsData.url);
        var heartBeat = ''; // 心跳包的定时器
        var sendBeat = ''; // 发送心跳的定时器
        if(!'WebSocket' in window) {
            alert("你的浏览器版本过低。无法使用消息提醒功能，请将您的IE浏览器升级到10或者以上版本。")
            return
        }

        // 断开连接之后，就开始重连
    that.ws.addEventListener("close",function (e) {
        reconnect()
        })
        // 连接异常的，开始重连
    that.ws.addEventListener("error",function (e) {
            reconnect()
        })
        // 接收到服务器返回的数据时。开始进入心跳检测
    that.ws.addEventListener("message",function (e) {
        // console.log('message');
            clearTimeout(heartBeat);
            clearTimeout(sendBeat);
        sendBeat = setTimeout(function () {
                that.ws.send(JSON.stringify(that.wsData.text));
                heartBeat = setTimeout(function () {
                   that.ws.close();
                },that.wsData.time)
            },that.wsData.time)

        })
    that.monitorMessage();
    }


//     function webScoketHeartbeat(data) {
//         var lockReconnect = false;//避免重复连接
//
//         function createWebSocket(url) {
//             if(WebSocket in window){
//                 alert("您目前的浏览器不支持websocket,请将ie浏览器升级10或者以上版本");
//                 return
//             }
//             try {
//                 ws = new WebSocket(url);
//                 initEventHandle();
//             } catch (e) {
//                 reconnect(url);
//             }
//         }
//
//         function initEventHandle() {
//             // 连接关闭就重连
//             ws.onclose = function () {
//                 reconnect(data.url);
//             };
//             // 连接异常也重连
//             ws.onerror = function () {
//                 reconnect(data.url);
//             };
//             // webscoket发送信息
//             ws.onopen = function () {
//                 //心跳检测重置
//                 heartCheck.start();
//             };
//             // webscoket接收信息
//             ws.onmessage = function (event) {
//                 //如果获取到消息，心跳检测重置
//                 //拿到任何消息都说明当前连接是正常的
//                 heartCheck.start();
//             }
//         }
//
// // 心动重连的方法
//         function reconnect(url) {
//             // 如果已经连接上,就不用重连
//             if(lockReconnect) return;
//             lockReconnect = true;
//             //没连接上会一直重连，设置延迟避免请求过多
//             setTimeout(function () {
//                 // 开始重连
//                 createWebSocket(url);
//                 lockReconnect = false;
//             }, data.againTime);
//         }
//
//
//         //心跳检测
//         var heartCheck = {
//             timeoutObj: null,
//             serverTimeoutObj: null,
//             // reset: function(){
//             //     clearTimeout(this.timeoutObj);
//             //     clearTimeout(this.serverTimeoutObj);
//             //     return this;
//             // },
//             start: function(){
//                 var self = this;
//                 clearTimeout(this.timeoutObj);
//                 clearTimeout(this.serverTimeoutObj);
//                 this.timeoutObj = setTimeout(function(){
//                     //这里发送一个心跳，后端收到后，返回一个心跳消息，
//                     //onmessage拿到返回的心跳就说明连接正常
//                     ws.send(obj.heartBaseText);
//                     self.serverTimeoutObj = setTimeout(function(){//如果超过一定时间还没重置，说明后端主动断开了
//                         ws.close();//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
//                     }, obj.heartCheckTime)
//                 },obj.heartCheckTime)
//             }
//         }
//
//         createWebSocket(obj.url);
//         initWebScoket();
//     }
//
