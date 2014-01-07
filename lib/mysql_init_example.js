module.exports = function() {
  GLOBAL.mysql = require('mysql');
  var connection = mysql.createConnection({
    host : "localhost",
    user : "user1",
    password: "pass123"
  });
  connection.connect();
  connection.query("use NodeSite;");
  GLOBAL.connection = connection;
}