$(function() {
    // parallax
    ImageController.init();
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
    
    $(".con_year").click(function(e){
      $(this).children(".collapse").toggle(200);
    });
    
    $(".con_month").click(function(e) {
      $(this).children(".collapse").toggle(200);
      return false;
    });
    
    $(".con_month a").click(function(e) {
      e.stopPropagation();
    })
    
    $(".con_year:first").children(".collapse").show();
});

$(window).load(function(){
    // keeps transition from firing on page load
    $("body").removeClass("preload");  
});

var ImageController = {
  
  $window : null,
  docWidth : null,
  widths : null,
  $background : null,
  
  init : function() {
    $window = $(window);
    docWidth = $window.width();
    widths = [1060, 1280, 1920, 4096, 5600];
    $background = $("#background");
  },
  
  adjustBackground : function() {
    var $image = $background;
    
    for(var i = 0; i < widths.length; i++) {
        if (docWidth <= widths[i] || i == widths.length-1) {
            $image.prop("src", "/static/image/Painting-Abstracts"+widths[i]+".jpg");
            break;
        }
    }
  },
  
  // 1. pick the right sized image based on window width
  // 2. append a y-mirrored image if image is shorter than document
  // repeat 1 for window resizing
  
  resizeBackground : function() {
    var docWidth = $window.width();
    var docHeight = $window.height();
    var m = isMobile();
    
    var $image = $background
    if (docWidth < 1060 && !m) {
      $image.prop("src", "http://localhost:8000/static/image/Painting-Abstracts"+1060+".jpg");
    }
    
    if (docWidth >= 1060 && m) {
      $image.prop("src", "http://localhost:8000/static/image/Painting-Abstracts"+1280+".jpg");
    }
    
  },
  
  isMobile : function() {
    var $image = $background;
    var s = $image.prop("src").split("s");
    return imageWidth() == 1080;
  },
  
  imageWidth : function() {
    var $image = $background;
    var s = $image.prop("src").split("s");
    s = s[s.length - 1].split(".")[0];
    return parseInt(s);
  }
  
  //cases:
  // width scales up
  // width scales down
}