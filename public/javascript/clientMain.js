$(function() {
    // parallax
    ImageController.adjustBackground();

    var $image = $("#background");
    // initialize parallax scroll
    var bodySpeed = 8.5;
    var $window = $(window);
    $window.scroll(function() {
        var yPos = -($window.scrollTop() / bodySpeed);
        var coords = yPos +'px'  
        $image.css({top: coords});
    });
    
    $(window).resize(ImageController.resizeBackground);
    
});

$(window).load(function(){
    // keeps transition from firing on page load
    $("body").removeClass("preload");  
});

var ImageController = {
  adjustBackground : function() {
    var $image = $("#background");
    
    var docWidth = $(window).width();
    var widths = [1060, 1280, 1920, 4096, 5600];
    
    for(var i = 0; i < widths.length; i++) {
        if (docWidth <= widths[i] || i == widths.length-1) {
            $image.prop("src", "/static/image/Painting-Abstracts"+widths[i]+".jpg")
            break;
        }
    }
  },
  
  resizeBackground : function() {
    var docWidth = $(window).width();
    var m = ImageController.isMobile();
    
    if (docWidth < 1060 && !m) {
      var $image = $("#background");
      $image.prop("src", "http://localhost:8000/static/image/Painting-Abstracts"+1060+".jpg");
    }
    
    if (docWidth >= 1060 && m) {
      var $image = $("#background");
      $image.prop("src", "http://localhost:8000/static/image/Painting-Abstracts"+1280+".jpg");
    }
  },
  
  isMobile : function() {
    var $image = $("#background");
    var s = $image.prop("src").split("s");
    return s[s.length-1] == "1060.jpg"
  }
}