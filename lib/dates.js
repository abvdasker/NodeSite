// BE CAREFUL! LOCAL VARS HERE MUST NOT CONFLICT WITH VIEW VARIABLES!

var monthNames = [ "January", "February", "March", "April", 
"May", "June", "July", "August", "September", "October", 
"November", "December"];

var formatDate = function(sqldate) {
  var d = new Date(sqldate);
  var dateString = d.toDateString().split(" ")[0]+" "+(d.getMonth()+1)+"-"+d.getDate()+"-"+d.getFullYear();
  return dateString;
} 

var urlFormat = function(date) {
  return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
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

var makeDateMap = function(results) {
  var map = {};
  for (result in results) {
    result = results[result];
    var year = new Date(result["created"]).getFullYear().toString();

    var mi = new Date(result["created"]).getMonth().toString();
    var month = monthNames[mi];
    
    var id = result["id"];
    var title = result["title"];
    
    var obj = {id:id, title:title};
    
    if (map[year] != null) {
      if (map[year][month] != null) {
        map[year][month].push(obj);
      } else {
        map[year][month] = [obj];
      }
    } else {
      map[year] = {};
      map[year][month] = [obj];
    }
  }
  console.log("MAP: "+map)
  return map;
}

module.exports = {
  formatDate : formatDate,
  datesEqual : datesEqual,
  makeDateMap : makeDateMap,
  urlFormat : urlFormat
}