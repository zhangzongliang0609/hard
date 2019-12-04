/*
* @Author: Marte
* @Date:   2017-03-14 11:44:52
* @Last Modified by:   Marte
* @Last Modified time: 2017-03-14 15:01:00
*/

// 'use strict';

/*$(function(){
    $("div.mask1").addClass('bg1'); // 初始化时添加背景1
    $("div.mask1").click(function() {
        $(this).toggleClass('bg1').toggleClass('bg2');
    });
});
*/

$(document).ready(function(){



    $(".mask1").addClass('bg1'); // 初始化时添加背景1
    $(".mask").click(function() {
        $(".mask1").toggleClass('bg2').toggleClass('bg1');
    });

   /* $(".mask").click(function(){
            var flag = 1;
            if(flag){
                $(".mask1").css({"background-image":"url(open.png)","display":"block"});
               return  flag = 0;
            }
            else {
                $(".mask1").css({"background-image":"url(close.png)","display":"block"});
               return flag = 1;
            }
        });*/
     /*
      $(".mask1").toggle(

        function(){
            var flag=1;
            if(flag){
                $(".mask1").css({"background-image":"url(open.png)","display":"block"});
                flag=0;
            }
            else {
                $(".mask1").css({"background-image":"url(close.png)","display":"block"});
                flag=1;
            }
            }*/
            /*,
    function(){
        $(".mask1").css({"background-image":"url(close.png)","display":"block"});
    },*/
    // function(){

    //     $(".mask1").css({"background-image":"url(open.png)","display":"block"});
    // },
    // )

    // });
      /*  function(){
        $(".mask1").css("background-image":"url(close.png)")},

        function(){
        $(".mask1").css("background-image":"url(open.png)")}*/
    // );

});



