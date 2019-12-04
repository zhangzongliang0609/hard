/**
 * Created by fxdong on 2017/11/14.
 */

var UpLoadOptions = {
};
UpLoadOptions.accessid = '';
UpLoadOptions.accesskey = '';
UpLoadOptions.host = '';
UpLoadOptions.policyBase64 = '';
UpLoadOptions.signature = '';
UpLoadOptions.callbackbody = '';
UpLoadOptions.filename = '';
UpLoadOptions.key = '';
UpLoadOptions.expire = 0;
UpLoadOptions.g_object_name = '';
UpLoadOptions.g_object_name_type = 'random_name';
UpLoadOptions.uuid_arr = [];
UpLoadOptions.now = UpLoadOptions.timestamp = Date.parse(new Date()) / 1000;
UpLoadOptions.body = UpLoadOptions.pos = UpLoadOptions.suffix = null;
UpLoadOptions.serverUrl = '';
var uploader = null;

export default function init(opt) {
    UpLoadOptions.serverUrl = opt.url;
    let mime_types = null;
    switch (opt.type) {
        case 'img':
            mime_types = [ //只允许上传图片文件
                { title : "files", extensions : "jpg,jpeg,gif,png,bmp" }
            ];
            break;
        default:
            break;
    }

    let upOptions = {
        runtimes : 'html5,flash,silverlight,html4',
        browse_button : opt.btnSelectId,
        multi_selection: opt.multi_selection,
        container: document.getElementById(opt.containerId),
        flash_swf_url : 'upload/Moxie.swf',
        silverlight_xap_url : 'upload/Moxie.xap',
        url : 'http://oss.aliyuncs.com',
        filters: {
            mime_types : mime_types,
            max_file_size : opt.maxSize + 'kb', //最大只能上传 kb的文件
            prevent_duplicates : opt.prevent_duplicates, //不允许选取重复文件
        },
        resize : {
            crop: opt.crop,
            quality: opt.quality,
            preserve_headers: opt.preserve_headers,
        },
        init: {
            // 当Plupload初始化完成后触发监听函数参数
            Init: function (uploader) {
                var $input = $(uploader.settings.container).find("input");
                $input.attr("accept", "image/*");
                if (/android/i.test(window.navigator.userAgent)) {
                    $input.attr("capture", "camera");
                } else {
                    $input.removeAttr("capture");
                }
            },
            // 全局就触发一次 而且是在兼容的情况下调用
            // 如果不兼容不会调用次事件，所以在使用此插件时应该提前写好不兼容内容提醒，兼容后通过这个回调改好
            PostInit: function(up) {
                // console.log('PostInit');
                typeof opt.readyCallback === 'function' && opt.readyCallback(up);
                // // 给上传按钮注册上传事件 -------------
                // document.getElementById(opt.postFileId).onclick = function() {
                //     alert('set')
                //     set_upload_param(uploader, '', false);
                //     return false;
                // };
                // 图片准备好后，启动上传任务 将上传按钮事件绑定在uploader上，方便插件化调用
                uploader.startPost = function () {
                    set_upload_param(uploader, '', false);
                    return false;
                }
            },
            // 这个回调的作用是为了检查文件上传数量是否超出选择范围
            // 每增加一个file都会调用一次，
            FileFiltered: function(up, files){
                // console.log('FileFiltered');
                opt.beforeAddFilter && opt.beforeAddFilter(up);
                if(up.files.length > opt.numbers) {
                    up.files.pop();
                }
                // if(up.files.length > opt.numbers){
                //     layer.msg('只能上传一张图片',{icon: 1, time: 1000});
                //     return;
                // }
            },
            // 这个回调的作用是为了添加预览，
            // 一次添加多个文件也只调用一次
            FilesAdded: function(up, files) {
                if(!opt.previewCallback) return;
                // console.log('FilesAdded');
                // console.log(files === up.files); // files 表示
                let imageSrcArr = [];
                for(let i = 0, len = up.files.length;i < len;i++) {
                    previewImage(up.files[i], function(imgsrc) {
                        imageSrcArr.push({
                            id:up.files[i].id,
                            url: imgsrc
                        });
                        if(imageSrcArr.length === up.files.length) {
                            typeof opt.previewCallback === 'function' && opt.previewCallback(imageSrcArr);
                        }
                    });
                }
                // plupload.each(files, function(file) {
                //     console.log(up.files);
                //     previewImage(file, function(imgsrc) {
                //         imageSrcArr.push(imgsrc);
                //         if()
                //         // console.log('previewImage');
                //         // console.log(imgsrc); // base64
                //         // let div = document.createElement('div');
                //         // let img = document.createElement('img');
                //         // div.className = opt.imgBoxItemClassName;
                //         // div.setAttribute('rel-id', file.id);
                //         // img.src=imgsrc;
                //         // div.appendChild(img);
                //         // $(div).click(function () {
                //         //     $(this).remove();
                //         //     up.files.splice(0, opt.numbers);
                //         // });
                //         // console.log($('#previewImage').children())
                //         // $('#previewImage').append(div);
                //         // $('#previewImage').children().remove().end().append(div);
                //         opt.previewCallback()
                //     });
                // });
            },
            // 文件是一个一个上传的，每一次上传都会调用一次这个，并且传入当前上传文件的file
            BeforeUpload: function(up, file) {
                check_object_radio();
                // console.log('BeforeUpload');
                // console.log(file);
                set_upload_param(up, file.name, true);
                //console.log(file.length);
            },
            FileUploaded: function(up, file, info) {
                if (info.status == 200)
                {
                    // console.log('get_uploaded_object_name');
                    // console.log(file.name)
                    let uuidStr = get_uploaded_object_name(file.name);
                    // console.log(uuidStr);
                    //uuidStr = uuidStr.substring(0,uuidStr.indexOf('.'));
                    UpLoadOptions.uuid_arr.push(uuidStr);
                    // console.log(file);
                    // console.log(UpLoadOptions.uuid_arr)
                    // if(up.files.length == UpLoadOptions.uuid_arr.length){
                    //     let ajaxData = {};
                    //     ajaxData.images = UpLoadOptions.uuid_arr;
                    //     console.log('ajaxData');
                    //     console.log(ajaxData);
                    // }
                }
                else
                {
                    console.log(info.response);
                }
            },
            UploadComplete: function (up, files) {
                // 所有文件处理完成后生成的事件
                // console.log('upload completed uuid_arr');
                // console.log(UpLoadOptions.uuid_arr);
                typeof opt.uploadedCallback === 'function' && opt.uploadedCallback(UpLoadOptions.uuid_arr);
                up.files.splice(0, up.files.length); // 清空数组
                UpLoadOptions.uuid_arr = [];
            },
            Error: function(up, err) {
                if (err.code == -600) {
                    layer.msg('选择的文件不能超过' + parseInt(opt.maxSize/1024) + 'M', {icon: 2, time: 3000});
                }
                else if (err.code == -601) {
                    layer.msg('选择的文件格式不对', {icon: 2, time: 3000});
                }
                else if (err.code == -602) {
                    layer.msg('这个文件已经上传过一遍了', {icon: 2, time: 3000});
                }
                else
                {
                    console.log(err.response)
                }
            }
        }
    };
    opt.width && (upOptions.resize.width = opt.width);
    opt.height && (upOptions.resize.height = opt.height);


    uploader = new plupload.Uploader(upOptions);





    // $('#previewImage').on('click', '.imageItem img',function() {
    //     var toremove = '';
    //     var delid = $(this).parent('.imageItem').attr("rel-id");
    //     $(this).parent('.imageItem').remove();
    //     for (var i in uploader.files) {
    //         if (uploader.files[i].id === delid) {
    //             toremove = i;
    //         }
    //     }
    //     uploader.files.splice(toremove, 1);
    // })

    return uploader;
}


function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

function send_request() {
    var xmlhttp = null;
    if (window.XMLHttpRequest)
    {
        xmlhttp=new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }

    if (xmlhttp!=null)
    {
        xmlhttp.open( "GET", UpLoadOptions.serverUrl, false );
        xmlhttp.send( null );
        return xmlhttp.responseText
    }
    else
    {
        alert("Your browser does not support XMLHTTP.");
    }
};

function check_object_radio() {
    var tt = document.getElementsByName('myradio');
    for (var i = 0; i < tt.length ; i++ )
    {
        if(tt[i].checked)
        {
            UpLoadOptions.g_object_name_type = tt[i].value;
            break;
        }
    }
}

function get_signature() {
    //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
    UpLoadOptions.now = UpLoadOptions.timestamp = Date.parse(new Date()) / 1000;
    if (UpLoadOptions.expire < UpLoadOptions.now + 3)
    {
        UpLoadOptions.body = send_request();
        console.log(UpLoadOptions.body);
        console.log(UpLoadOptions.body.toString());
        var obj = eval ("(" + UpLoadOptions.body + ")");
        UpLoadOptions.host = obj['host']
        UpLoadOptions.policyBase64 = obj['policy']
        UpLoadOptions.accessid = obj['accessid']
        UpLoadOptions.signature = obj['signature']
        UpLoadOptions.expire = parseInt(obj['expire'])
        UpLoadOptions.callbackbody = obj['callback']
        UpLoadOptions.key = obj['dir']
        return true;
    }
    return false;
};

function random_string(len) {
    len = len || 32;
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = chars.length;
    var pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

function get_suffix(filename) {
    UpLoadOptions.pos = filename.lastIndexOf('.')
    UpLoadOptions.suffix = ''
    if (UpLoadOptions.pos != -1) {
        UpLoadOptions.suffix = filename.substring(UpLoadOptions.pos)
    }
    return UpLoadOptions.suffix;
}

function calculate_object_name(filename) {
    if (UpLoadOptions.g_object_name_type == 'local_name')
    {
        UpLoadOptions.g_object_name += "${UpLoadOptionsfilename}"
    }
    else if (UpLoadOptions.g_object_name_type == 'random_name')
    {
        UpLoadOptions.suffix = get_suffix(filename)
        var uuId = uuid();
        UpLoadOptions.g_object_name = UpLoadOptions.key + uuId + UpLoadOptions.suffix
    }
    return ''
}

function get_uploaded_object_name(filename) {
    // console.log('get_uploaded_object_name: ')
    // console.log(filename)
    if (UpLoadOptions.g_object_name_type == 'local_name')
    {
        var tmp_name = UpLoadOptions.g_object_name;
        tmp_name = tmp_name.replace("${UpLoadOptions.filename}", filename);
        return tmp_name
    }
    else if(UpLoadOptions.g_object_name_type == 'random_name')
    {
        return UpLoadOptions.g_object_name
    }
}

function set_upload_param(up, filename, ret) {
    if (ret == false)
    {
        ret = get_signature()
    }
    UpLoadOptions.g_object_name = UpLoadOptions.key;
    if (filename != '') {
        UpLoadOptions.suffix = get_suffix(filename)
        calculate_object_name(filename)
    }
    UpLoadOptions.g_object_name = UpLoadOptions.g_object_name.substring(0,UpLoadOptions.g_object_name.lastIndexOf('.'));
    var new_multipart_params = {
        'key' : UpLoadOptions.g_object_name,
        'policy': UpLoadOptions.policyBase64,
        'OSSAccessKeyId': UpLoadOptions.accessid,
        'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
        'callback' : UpLoadOptions.callbackbody,
        'signature': UpLoadOptions.signature,
    };

    up.setOption({
        'url': UpLoadOptions.host,
        'multipart_params': new_multipart_params
    });
    // alert(up === uploader);

    up.start();
}

function previewImage(file, callback) { //file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
    if (!file || !/image\//.test(file.type)) return;
    if (file.type == 'image/gif') { //gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
        var fr = new mOxie.FileReader();
        fr.onload = function() {
            callback(fr.result);
            fr.destroy();
            fr = null;
        }
        fr.readAsDataURL(file.getSource());
    } else {
        var preloader = new mOxie.Image();
        preloader.onload = function() {
            // 先不做压缩处理
            // preloader.downsize(300, 300); //先压缩一下要预览的图片,宽300，高300
            var imgsrc = preloader.type == 'image/jpeg' ? preloader.getAsDataURL('image/jpeg', 80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
            callback && callback(imgsrc); //callback传入的参数为预览图片的url
            preloader.destroy();
            preloader = null;
        };
        preloader.load(file.getSource());
    }
}
