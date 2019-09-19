
//# sourceMappingURL=maps/swiper.jquery.min.js.map

/**
 * 滑动切换面板主体
 * Created by kiner on 16/9/22.
 */
;(function(win,doc,$){

    $.kinerSwiperPanel = function(options){

        var opts = $.extend(true,{},$.kinerSwiperPanel.options,options);

        var nav = $(opts.navSelector),
            con = $(opts.conSelector);

        var returnObj = {
            slideTo: function (index) {
                selectPanel(index, 2);
            },
            on: function (name, handler) {
                handlers[name] = handler;
            },
            handlerNameList: {
                "change": "change"
            }
        };


        var handlers = {

        };

        con.addClass('swiper-container').find('.wrapper').addClass('swiper-wrapper').end().find('.kinerItem').addClass('swiper-slide');
        var len = nav.find('item').length;
        nav.find("realBorder").css({
            width: (1/len)*100+"%"
        });


        var mySwiper = new Swiper(opts.conSelector+'.swiper-container', {
            direction: 'horizontal',
            observer: true,
            observeParents: true,
            onSlideChangeStart: function (swiper) {
                selectPanel(swiper.activeIndex,0);
            },
            onSlideChangeEnd: function (swiper) {
            }
        });

        $(win).resize(function(){
            mySwiper.update();
        });

        nav.on('click','item',function(e){
            selectPanel($(this).index()-1,1,e,this);
        });


        function selectPanel(index,type,e,ele){

            // console.log(arguments);

            nav.find("item").removeClass('active').eq(index).addClass('active');
            var len = nav.find('item').length;
            if(type==0){
                nav.find("realBorder").css({
                    left: index == 0 ? 0 : Math.floor((index / len)* 100)  + "%"
                });
                handlers[returnObj.handlerNameList.change].call(ele,index,e);
            }else if(type==1){
                mySwiper.slideTo(index);
            }else if(type==2){
                nav.find("realBorder").css({
                    left: index == 0 ? 0 : Math.floor((index / len)* 100)  + "%"
                });
                mySwiper.slideTo(index);
            }




        }

        return returnObj;

    };

    $.kinerSwiperPanel.options = {
    };

})(window,document,$);

/**
 * 对滑动面板的调用方法介绍
 * Created by kiner on 16/9/22.
 */
$(function(){
    //第一步:  实例化一个滑动面板,并绑定响应标签
    var ksp = $.kinerSwiperPanel({
        navSelector: "kinerNav",//导航栏选择器
        conSelector: "kinerContent"//显示面板选择器
    });

    $('.btn').click(function () {
        var index = $(this).attr("data-slideTo");
        ksp.slideTo(index);//可通过此方法主动调用切换面板方法
    });

    /**
     * 注册change函数,当面板切换时插件将自动调用所给函数,并将当前面板索引通过参数形式返回
     */
    ksp.on(ksp.handlerNameList.change,function(activeIndex,event){
        $('.eventPanel').text("事件回调信息: 面板已切换至" + (activeIndex+1)+"号面板");
    });




    $(".swiper-hdInside.swiper-container").click(function () {
        ksp.slideTo(1);
    });



    function remove2() {
        if($('.swiper-hdInside .swiper-wrapper').css("transform").slice(7, -1).split(",")[4] < -750 ){
            console.log(00000);

            ksp.slideTo(1);
        }
    }
    setInterval(remove2, 500);


});
