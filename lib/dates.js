
var formatDate = function(sqldate) {
  var d = new Date(sqldate);
  var dateString = d.toDateString().split(" ")[0]+" "+d.getMonth()+"-"+d.getDate()+"-"+d.getFullYear();
  return dateString;
} 

var datesEqual = function(sqldate1, sqldate2) {
  sqldate1 = new Date(sqldate1);
  sqldate2 = new Date(sqldate2);
  var d1 = sqldate1.getDate();
  var m1 = sqldate1.getMonth();
  var y1 = sqldate1.getYear();
  
  var d2 = sqldate2.getDate();
  var m2 = sqldate2.getMonth();
  var y2 = sqldate2.getYear();
  return (d1 == d2 && m1 == m2 && y1 == y2)
}

module.exports = {
  formatDate : formatDate,
  datesEqual : datesEqual
}