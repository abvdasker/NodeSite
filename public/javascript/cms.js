function previewContent() {
  var content = $("#content").val();
  var title = $("#title").val();
  
  $(".content").empty().append(content);
  $(".ar_title").text(title);
}