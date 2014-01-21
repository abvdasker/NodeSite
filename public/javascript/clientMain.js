$(function() {
    // parallax
    ImageController.init();
    ImageController.adjustBackground();
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
    
    
    $("img.background:first").load(function(){
      
    });
    
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
  
  init : function() {
    $window = $(window);
    docWidth = $window.width();
    widths = [1060, 1280, 1920, 4096, 5600];
    $background = $("#background");
  },
  
  parallax : function() {
        var bodySpeed = 8.5;
        $window
        var yPos = -($window.scrollTop() / bodySpeed);
        var coords = yPos;  
        $background.css({top: coords});
        /*if (this.$background2 != null) {
          //alert("!");
          $background2.css({top : (coords + $background.prop("height")) });
        }*/
        window.requestAnimFrame(ImageController.parallax);
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
  
  resizeBackground : function() {
    var docWidth = $window.width();
    //var docHeight = $window.height();
    //var scrollHeight = $("body")[0].scrollHeight;
    var $image = $background
    
    if (docWidth < 820) {      
      $image.prop("src", "http://localhost:8000/static/image/Painting-Abstracts"+720+".jpg");
    } else if (docWidth < 1124) {      
      $image.prop("src", "http://localhost:8000/static/image/Painting-Abstracts"+1024+".jpg");  
    } else if (docWidth < 1300) {      
      $image.prop("src", "http://localhost:8000/static/image/Painting-Abstracts"+1920+".jpg");
    } else if (docWidth < 4196) {      
      $image.prop("src", "http://localhost:8000/static/image/Painting-Abstracts"+4096+".jpg");
    }
    /*alert("image height: " + $image[0].scrollHeight);
    if (scrollHeight > $image.prop("height") && this.$background2 == null) {
      alert("second image");
      $background2 = $(".background.second");
      $background2.prop("src", $image.attr("src"));
    }*/
    
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