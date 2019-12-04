/**
 * Created by fxdong on 2017/12/27.
 */

/**
 *
 * @param containerId 容器的父盒子 id
 * @param fixId 固定标题的容器 id
 */
export default function (containerId, fixId) {
    if(!$(fixId).length || !$(containerId).length) {
        // layer.msg("滚动界面参数传入错误", {icon: 2, time: 1500});
        console.log("滚动界面参数传入错误");
        return;
    }
    var isMouseDown = false,
        startX = 0,
        targetX = 0,
        currentX = 0;
    var $this = $(containerId);
    if(calContainerWidth()) {
        console.log("页面结构出错~");
        return;
    }
    var $pot = $this.find(".scroll-pot");
    var $leftBar = $this.find(".scroll-left");
    var $rightBar = $this.find(".scroll-right");
    var $scrollBar = $this.find(".scroll-bar");
    var $scrollRoll = $this.find(".scroll-bottom-roll");
    var $scrollBody = $this.find(".scroll-bottom-body");
    var $fixedDom = $this.find(".scroll-top-fixed");
    var $fixedMask = $this.find(".scroll-top-fixed-mask");
    var $fixDom = $(fixId);
    var $html = $("html");
    var $leftBarWidth = parseInt($leftBar.outerWidth());
    var $scrollBodyWidth = parseInt($scrollBody.outerWidth());
    var $fixDomLeft = $fixDom.offset().left - $fixDom.parents(".fixedParent").offset().left + parseInt($fixDom.parents(".fixedParent").css("borderWidth")); // 固定的table表单元素列的距离左边的间距
    // console.log($fixDomLeft);
    $scrollBar.css({
        left: $fixDomLeft,
        // top: $scrollBody.offset().top - $scrollRoll.offset().top + parseInt($fixDom.parents(".fixedParent").outerHeight()),
    });
    $fixedDom.css({width: $fixDomLeft});
    $fixedMask.css({width: $fixDomLeft});
    var $scrollBarWidth = parseInt($scrollBar.outerWidth()); // 滚动条总宽度
    // 最大的 transX 的移动距离
    var maxTransX = $scrollBodyWidth - $scrollBarWidth - $fixDomLeft + parseInt($fixDom.parents(".fixedParent").css("borderWidth"));
    var potWidth = $scrollBarWidth - $leftBarWidth * 2 - maxTransX;
    potWidth = potWidth < 100 ? 100 : potWidth;
    potWidth = potWidth > potWidth - 30 ? potWidth - 30 : potWidth;
    $pot.css({width: potWidth});
    var $potWidth = parseInt($pot.outerWidth(true));
    var scrollWidth = $scrollBarWidth - $potWidth - $leftBarWidth * 2; // 滚动条可滚动的距离
    var step = maxTransX / scrollWidth; // 滚动条总宽度
    // console.log($leftBarWidth, $potWidth, $fixDomLeft, $scrollBarWidth, $scrollBodyWidth, maxTransX, step);
    $leftBar.click(function (e) {
        $pot.css({left: $leftBarWidth});
        $scrollBody.css({"transform": "translate(" + 0 + "px, 0px)"});
        wStop(e);
    });
    $rightBar.click(function (e) {
        // console.log(maxTransX);
        $pot.css({left: $leftBarWidth + scrollWidth});
        $scrollBody.css({"transform": "translate(" + (-maxTransX) + "px, 0px)"});
        wStop(e);
    });
    $pot.mousedown(function (e) {
        isMouseDown = true;
        startX = e.clientX;
        currentX = parseInt($pot.css("left"));
        e.preventDefault();
        wStop(e);
    });
    $html.mousemove(function (e) {
        if(isMouseDown) {
            targetX = e.clientX - startX + currentX;
            setPlace(targetX);
        }
    });
    $rightBar.dblclick(function (e) {
        isMouseDown = false;
    });
    $html.mouseup(function (e) {
        isMouseDown = false;
    });
    $scrollBar.click(function (e) {
        e = e || window.event;
        // console.log(e.offsetX);
        var currentLeft = parseInt($pot.css("left"));
        var left = e.offsetX - $potWidth / 2;
        if(left < $leftBarWidth) {
            left = $leftBarWidth;
        } else if(left > $leftBarWidth + scrollWidth) {
            left = $leftBarWidth + scrollWidth;
        }
        setPlace(left);
    });
    $pot.click(function (e) {
        // console.log(e)
        wStop(e);
    });
    // compensate = 10 为补偿值，拖动过程中，到最左侧或者最右侧的并不能拖到终点
    // 所以在距离终点这个补偿值的时候，就直接将值设定为终点
    var compensate = 10;
    function setPlace(targetX) {
        if(targetX >= $leftBarWidth && targetX <= scrollWidth + $leftBarWidth){
            // console.log(targetX);
            $(".scroll-pot").css({left: targetX});
            var distance = parseInt(targetX * step) - $leftBarWidth;
            distance = maxTransX - distance > compensate ? distance : maxTransX;
            distance = distance < compensate ? 0 : distance;
            $(".scroll-bottom-body").css({"transform": "translate(" + -distance + "px, 0px)"});
        }
    };
    function wStop(e) {
        if(e&&e.stopPropagation){
            e.stopPropagation()
        }else if(window.event){
            window.event.cancelBubble=true;
        }
    };
    function calContainerWidth() {
        var $tables = $this.find("table");
        if($tables.length === 0) return true;
        var $th = $tables.eq(0).find("th");
        var wWidth = 0;
        $.each($th, function (i, item) {
            wWidth += parseInt($(item).outerWidth());
        });
        if($this.find(".scroll-bottom-roll").width() >= wWidth) {
            // console.log("scroll-bottom-roll hide", $this.find(".scroll-bottom-roll").width(), wWidth);
            $this.find(".scroll-bar").hide();
            return true;
        }
        $(".scroll-top-body, .scroll-bottom-body").css({
            width: wWidth
        });
        return false;
    }
}