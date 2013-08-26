$(function() {
    // parallax
    
    var $image = $("#background");
    var bodySpeed = 8.5;
    var $window = $(window);
    $window.scroll(function() {
        var yPos = -($window.scrollTop() / bodySpeed);
        var coords = yPos +'px'  
        $image.css({top: coords});
    });
    
    //molt.discover();
});