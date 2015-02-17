$(function() {
    // parallax
    ImageController.init();
    
    var $window = $(window);
    /*$window.scroll(function() {
        var yPos = -($window.scrollTop() / bodySpeed);
        var coords = yPos +'px'  
        $image.css({top: coords});
    });*/
    //var r = ImageController.resizeBackground;
    $window.resize(ImageController.resizeBackground.bind(ImageController));
    ImageController.resizeBackground();
    
    $(".con_year").click(function(e){
      $(this).children(".collapse").toggle(200);
    });
    
    $(".con_month").click(function(e) {
      $(this).children(".collapse").toggle(200);
      return false;
    });
    
    $(".con_month a").click(function(e) {
      e.stopPropagation();
    });
    
    $(".con_year:first").children(".collapse").show();
    
    // silky smooth but ultimately more expensive.
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
    window.requestAnimFrame(ImageController.parallax.bind(ImageController));
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
  bodySpeed: 8.5,
  lastScrollTop: null,
  
  init : function() {
    this.$window = $(window);
    this.docWidth = this.$window.width();
    this.widths = [1060, 1280, 1920, 4096, 5600];
    this.$background = $("#background");
  },
  
  parallax : function() {
    if (this.dirty) {
      this.$background.prop("src", this.imageStr); 
      this.dirty = false;
    }
    var shouldUpdate = false;
    var currentScrollTop = this.$window.scrollTop();
    if (this.lastScrollTop == null) {
      shouldUpdate = true;
    } else if (this.lastScrollTop != currentScrollTop) {
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      var bodySpeed = this.bodySpeed
      var yPos = -(currentScrollTop / bodySpeed);
      this.$background.css({top: yPos});

      var articleBackgrounds = $(".glass");
      articleBackgrounds.each(function(idx, elem) {
        var $elem = $(elem);
        // var topOffset = $elem.offset().top;
        // var totalOffset = topOffset + currentScrollTop;
        // var yPos = -(totalOffset / bodySpeed);
        // var newPosition = "42% " + yPos + "px";
        $elem.css({"background-position": "42% " + yPos + "px"});
      });
    }

    
    this.lastScrollTop = currentScrollTop;
    window.requestAnimFrame(ImageController.parallax.bind(ImageController));
  },
  
  resizeBackground : function() {
    var docWidth = this.$window.width();
    var s;
    if (docWidth < 1124) {         
      s = "/static/image/Painting-Abstracts"+1024+".jpg";
    } else if (docWidth < 1380) {
      s = "/static/image/Painting-Abstracts"+1280+".jpg";
    } else if (docWidth < 2020) {          
      s = "/static/image/Painting-Abstracts"+1920+".jpg";
    } else {          
      s = "/static/image/Painting-Abstracts"+4096+".jpg";
    }
    
    if (s != this.imageStr) {
      this.imageStr = s;
      dirty = true;
    }
    
  },
  
  isMobile : function() {
    var $image = this.$background;
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