$(function() {
    // parallax
    ImageController.init();
    
    var $window = $(window);
    /*$window.scroll(function() {
        var yPos = -($window.scrollTop() / bodySpeed);
        var coords = yPos +'px'  
        $image.css({top: coords});
    });*/
    var r = ImageController.resizeBackground;
    $window.resize(r);
    r();
    
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
    
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function( callback ) {
                window.setTimeout(callback, 1000 / 60);
              };
    })();
    window.requestAnimFrame(ImageController.parallax);
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
  imageStr : null,
  dirty : true,
  
  init : function() {
    $window = $(window);
    docWidth = $window.width();
    widths = [1060, 1280, 1920, 4096, 5600];
    $background = $("#background");
  },
  
  parallax : function() {
        if (this.dirty) {
          $background.prop("src", this.imageStr); 
          this.dirty = false;
        }
        var bodySpeed = 8.5;
        var yPos = -($window.scrollTop() / bodySpeed);
        var coords = yPos;  
        $background.css({top: coords});
        window.requestAnimFrame(ImageController.parallax);
  },
  
  resizeBackground : function() {
    var docWidth = $window.width();
    var s;
    if (docWidth < 1124) {         
      s = "/static/image/Painting-Abstracts"+1024+".jpg";
    } else if (docWidth < 1380) {
      s = "/static/image/Painting-Abstracts"+1280+".jpg";
    }else if (docWidth < 2020) {          
      s = "/static/image/Painting-Abstracts"+1920+".jpg";
    } else if (docWidth < 4196) {          
      s = "/static/image/Painting-Abstracts"+4096+".jpg";
    }
    
    if (s != this.imageStr) {
      this.imageStr = s;
      dirty = true;
    }
    
  },
  
  isMobile : function() {
    var $image = $background;
    var s = $image.prop("src").split("s");
    return this.imageWidth() < 1080;
  },
  
  imageWidth : function() {
    var $image = $background;
    var s = $image.prop("src").split("s");
    s = s[s.length - 1].split(".")[0];
    return parseInt(s);
  }
  
}