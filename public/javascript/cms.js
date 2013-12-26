function previewContent() {
  var content = $("#content").val();
  var title = $("#title_input").val();
  
  $(".content").empty().append(content);
  $(".ar_title").text(title);
}