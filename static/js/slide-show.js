$("#slide-show div.slide-show-bg div.nav ul li").hover(function () {
    var index = $(this).index();
    $(this).addClass("first").siblings().removeClass("first");
    $("#slide-show div.slide-show-img ul li").eq(index).css({
        "display": "block",
        "opacity": "0"
    }).
    animate({
        "opacity": 1
    }, 500).siblings().css({
        "opacity": 1,
        "display": "none"
    });
});