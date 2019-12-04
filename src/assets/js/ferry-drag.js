/**
 * Created by Administrator on 2017/10/10.
 */

    // 记录插件的操作,在vue中使用
   export var indexObj = {start:0,end:0,canDrag:false};
           var parent;
    // vue中传进来的回调函数,在拖拽动画完成之后调用
    //        var cb ;
           var scrollMove = 0;
    export var isMove = false;

   export function Pointer(x, y) {
        this.x = x ;
        this.y = y ;
    }
    export function Position(left, top) {
        this.left = left ;
        this.top = top ;
    }
    export function main (i){
        // if(callback){
        //     cb = callback;
        // }
        this.init = function () { // 初始化
            if(!this.box){
                this.box = $(this).parents("li") ;
            }
            if(!parent){
                parent = $(this).parents(".item_content");
            }
            $(this).attr("index", i).css({
                position : "absolute",
                left : this.box[0].offsetLeft,
                top : this.box[0].offsetTop,
            }).appendTo(".item_content") ;
            this.drag() ;
        },
            this.move = function() {  // 移动
                $(this).stop(true).animate({
                    left : this.box[0].offsetLeft,
                    top : this.box[0].offsetTop,
                }, 500, function() {
                    parent.scrollTop(scrollMove);
                    // if(callback) {
                    //     callback.call(this) ;

                        // 执行完回调函数之后会局部刷新列表,在刷新列表后让滚动条恢复到没有刷新之前
                        // if(isMove){
                        //     cb(function(){
                        //
                        //     });
                        // }
                    // }
                }) ;
            },
            this.collisionCheck = function() {
                var currentItem = this ;
                var direction = null ;
                $(this).siblings(".item").each(function() {
                    if(
                        currentItem.pointer.x > this.box.offset().left &&
                        currentItem.pointer.y > this.box.offset().top &&
                        (currentItem.pointer.x < this.box.offset().left + this.box.width()) &&
                        (currentItem.pointer.y < this.box.offset().top + this.box.height())
                    ) {
                        // 返回对象和方向
                        if(currentItem.box.offset().top < this.box.offset().top) {
                            direction = "down" ;
                        } else if(currentItem.box.offset().top > this.box.offset().top) {
                            direction = "up" ;
                        } else {
                            direction = "normal" ;
                        }
                        this.swap(currentItem, direction) ;
                    }
                }) ;
            },
            this.swap = function(currentItem, direction) { // 交换位置
                if(this.moveing) return false ;
                var directions = {
                    normal : function() {
                        var saveBox = this.box ;
                        this.box = currentItem.box ;
                        currentItem.box = saveBox ;
                        this.move() ;
                        $(this).attr("index", this.box.index()) ;
                        $(currentItem).attr("index", currentItem.box.index()) ;
                    },
                    down : function() {
                        // 移到上方
                        var box = this.box ;
                        var node = this ;
                        var startIndex = currentItem.box.index() ;
                        var endIndex = node.box.index(); ;
                        for(var i = endIndex; i > startIndex ; i--) {
                            var prevNode = $(".item_content .item[index="+ (i - 1) +"]")[0] ;
                            node.box = prevNode.box ;
                            $(node).attr("index", node.box.index()) ;
                            node.move() ;
                            node = prevNode ;
                        }
                        currentItem.box = box ;
                        $(currentItem).attr("index", box.index()) ;
                    },
                    up : function() {
                        // 移到上方
                        var box = this.box ;
                        var node = this ;
                        var startIndex = node.box.index() ;
                        var endIndex = currentItem.box.index();
                        // console.info(currentItem.box);
                        for(var i = startIndex; i < endIndex; i++) {
                            var nextNode = $(".item_content .item[index="+ (i + 1) +"]")[0] ;
                            node.box = nextNode.box ;
                            $(node).attr("index", node.box.index()) ;
                            node.move() ;
                            node = nextNode ;
                        }
                        currentItem.box = box ;
                        $(currentItem).attr("index", box.index()) ;
                    }
                }
                directions[direction].call(this) ;
            },
            this.drag = function() { // 拖拽
                var oldPosition = new Position() ;
                var oldPointer = new Pointer() ;
                var myTime;
                var isDrag = false ;
                var currentItem = null ;

                $(this).mousedown(function(e) {
                    // 判断除了点击中间的span站点名称之外,都不能拖拽移动站点
                    if(!indexObj.canDrag || e.target.className.indexOf('item-name') == -1){
                        return
                    }
                    e.preventDefault() ;
                    scrollMove =  parent.scrollTop();
                    indexObj.start = $(this).attr("index")
                    oldPosition.left = $(this).position().left ;
                    oldPosition.top =  $(this).position().top ;
                    oldPointer.x = e.clientX ;
                    oldPointer.y = e.clientY ;
                    isDrag = true ;

                    currentItem = this ;

                }) ;
                $(document).mousemove(function(e) {
                    if(!isDrag) return false ;
                    var currentPointer = new Pointer(e.clientX, e.clientY) ;
                    isMove = true;
                    clearInterval(myTime);
                    $(currentItem).css({
                        "opacity" : "0.8",
                        "z-index" :1
                    }) ;
                    // 判断滚动条是否需要上移
                    if(currentPointer.y < parent.offset().top ){
                        clearInterval(myTime);
                        myTime = setInterval(function () {
                                    parent.scrollTop(scrollMove -= 2);
                                },10)
                    }
                    // 判断滚动条是否需要下移,下移的时候,不应该超过最大的滚动条值
                    else if(currentPointer.y > (parent.offset().top + parent.height())  &&  parent.scrollTop() < (parent.height() - parent.offset().top)){
                        clearInterval(myTime);
                        myTime = setInterval(function () {
                            parent.scrollTop(scrollMove += 2);
                        },10)

                    }
                    var left = currentPointer.x - oldPointer.x + oldPosition.left ;
                    var top = currentPointer.y - oldPointer.y + oldPosition.top + parent.scrollTop()  ;

                    $(currentItem).css({
                        left : left,
                        top : top
                    }) ;
                    currentItem.pointer = currentPointer ;
                    // 开始交换位置

                    currentItem.collisionCheck() ;


                }) ;
                $(document).mouseup(function() {
                    if(!isDrag) return false ;
                    isDrag = false ;
                    clearInterval(myTime);
                    indexObj.end = $(currentItem).attr("index");
                    currentItem.move(function() {
                        $(this).css({
                            "opacity" : "1",
                            "z-index" : 0
                        }) ;
                    }) ;
                    isMove = false;
                }) ;

            }
        this.init() ;
    }

    export function dragStation(isCreate ) {
        var itemArr = $(".item_content .item");
        if(isCreate === "add"){
            var item =  Array.prototype.shift.call(itemArr,itemArr[0]);
            Array.prototype.push.call(itemArr,item);
            main.call(item,itemArr.length-1 );
        }
        else{
            itemArr.each(function(i) {
                main.call(this,i);
            }) ;
        }
    }
