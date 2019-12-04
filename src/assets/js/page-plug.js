(function($){
    var ms = {
		init:function(obj,args){
			obj.unbind();
			return (function(){
				ms.fillHtml(obj,args);
				ms.bindEvent(obj,args);
			})();
		},
		//填充html
		fillHtml:function(obj,args){
			return (function(){
				obj.empty();
				//上一页
				obj.append('<p style="color:#999;font-size: 12px;display: inline-block;margin-right: 20px">'+"有" +args.count + "条数据" + " ,共" + args.pageCount + "页"  + '</p>');
				obj.append('<a href="javascript:;" class="num">首页</a>');
				if(args.current > 1){
					obj.append('<a href="javascript:;" class="prevPage">上一页</a>');
				}else{
					obj.remove('.prevPage');
					obj.append('<a class="disabled">上一页</a>');
				}
				//中间页码
				// if(args.current != 1 && args.current >= 4 && args.pageCount != 4){
				// 	obj.append('<a href="javascript:;" class="num">'+1+'</a>');
				// }
				if(args.current-2 > 2 && args.current <= args.pageCount && args.pageCount > 5){
					obj.append('<a class="separate">...</a>');
				}
				var start = args.current -2,end = args.current+2;
				if((start > 1 && args.current < 4)||args.current == 1){
					end++;
				}
				if(args.current > args.pageCount-4 && args.current >= args.pageCount){
					start--;
				}
				for (;start <= end; start++) {
					if(start <= args.pageCount && start >= 1){
						if(start != args.current){
							obj.append('<a href="javascript:;" class="num">'+ start +'</a>');
						}else{
							obj.append('<a class="current">'+ start +'</a>');
						}
					}
				}
				if(args.current + 2 < args.pageCount - 1 && args.current >= 1 && args.pageCount > 5){
					obj.append('<a class="separate">...</a>');
				}
				if(args.current != args.pageCount && args.current < args.pageCount -2  && args.pageCount != 4){
					// obj.append('<a href="javascript:;" class="num">'+args.pageCount+'</a>');
				}
				//下一页
				if(args.current < args.pageCount){
					obj.append('<a href="javascript:;" class="nextPage">下一页</a>');
				}else{
					obj.remove('.nextPage');
					obj.append('<a class="disabled">下一页</a>');
				}
				obj.append('<a href="javascript:;" class="num">尾页</a>');

				obj.append('<input type="number" class="num page-num" style="text-align:center;width: 40px;height: 24px; margin-left: 10px;margin-right: 10px" />');
				obj.append('<a href="javascript:;" class="go">GO</a>');
			})();
		},
		//绑定事件
		bindEvent:function(obj,args){
			return (function(){
				obj.on("click","a.num",function(){
					var current;
					var currentText = $(this).text();
					if(currentText == "尾页"){
						current = args.pageCount;
					}
					else if(currentText == "首页"){
						current = 1;
					}
					else{
						current = parseInt(currentText);
					}
					ms.fillHtml(obj,{"current":current,"pageCount":args.pageCount,count:args.count});
					if(typeof(args.callback)=="function"){
						args.callback(current);
					}
				});
				obj.on("click","a.go",function(){

					// var current = $(".page-num").value;

					var current = $("#" + obj.attr("id")+">.page-num").val();

					current = parseInt(current);
					console.log(current);
					console.log(args.pageCount);
					if(current > args.pageCount ||  current <= 0  || !current){
						layer.msg("没有这一页",{icon:2,time:1500});
						return;
					}

					ms.fillHtml(obj,{"current":current,"pageCount":args.pageCount,count:args.count});
					if(typeof(args.callback)=="function"){
						args.callback(current);
					}
				});
				//上一页
				obj.on("click","a.prevPage",function(){
					var current = parseInt(obj.children("a.current").text());
					ms.fillHtml(obj,{"current":current-1,"pageCount":args.pageCount,count:args.count});
					if(typeof(args.callback)=="function"){
						args.callback(current-1);
					}
				});
				//下一页
				obj.on("click","a.nextPage",function(){
					var current = parseInt(obj.children("a.current").text());
					ms.fillHtml(obj,{"current":current+1,"pageCount":args.pageCount,count:args.count});
					if(typeof(args.callback)=="function"){
						args.callback(current+1);
					}
				});
			})();
		}
	}
	$.fn.createPage = function(options){
		var args = $.extend({
			pageCount : 1,
			current : 1,
			count:1,
			callback : function(){}
		},options);
		ms.init(this,args);
	}
})(jQuery);
