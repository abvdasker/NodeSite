// make this OO maybe?

var mysql = require("mysql");
var crypto = require("crypto");
var connection = mysql.createConnection({
  host : "localhost",
  user : "hal",
});
connection.connect();
connection.query("use NodeSite;");

var validate = function (username, password, f) {
  
  getUser(username, function(user) {
    if (user == null || user === undefined) {
      f(false);
    } else {
      var passhash = user["password"];
      var salt = user["salt"];
      var submit_hash = hashString(password+salt);
      console.log("passhash: "+passhash+" salt: "+salt);
      console.log("submitted: "+submit_hash);
      f(passhash == submit_hash);
    }
  });
  
}

var create = function (username, password) {
  var salt_rand = Math.random()*1000;
  var salt = hashString(salt_rand.toString()).substr(0, 8);
  console.log("SALT: "+ salt);
  var passhash = hashString(password+salt);
  
  var query = "INSERT INTO NodeSite.users (username, password, salt) VALUES(?, ?, ?)";
  var val_ar = [username, passhash, salt];
  connection.query(query, val_ar, function(err, result) {});
}

var getUser = function (username, doresult) {
  var query = "SELECT * FROM users WHERE username=? LIMIT 1";
  var q = connection.query(query, [username], function(err, rows) {
    console.log("ERR: "+ err);
    doresult(rows[0]);
  });
}

var close = function() {
  connection.end();
}

function hashString(str) {
  var sha = crypto.createHash("sha256", "utf-8");
  sha.update(str);
  return sha.digest("hex");
}

module.exports = {
  validate : validate,
  create : create,
  getUser : getUser
}