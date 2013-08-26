$(function() {
    // parallax
    var $image = $("#background");
    
    var docWidth = $(window).width();
    var widths = [1280, 1920, 4096, 5600];
    
    for(var i = 0; i < widths.length; i++) {
        if (docWidth <= widths[i] || i == widths.length-1) {
            $image.prop("src", "static/image/Painting-Abstracts"+widths[i]+".jpg")
            break;
        }
    }
    
    var bodySpeed = 8.5;
    var $window = $(window);
    $window.scroll(function() {
        var yPos = -($window.scrollTop() / bodySpeed);
        var coords = yPos +'px'  
        $image.css({top: coords});
    });
    //molt.discover();
});

$(window).load(function(){
    // keeps transition from firing on page load
    $("body").removeClass("preload");  
});