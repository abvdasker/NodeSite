console.log("NODE_ENV: "+process.env.NODE_ENV);

var express = require('express');
var fs = require('fs');

require("./lib/mysql_init.js")();
var app = express(); 

var config = require('./core/config.js');
config.configure(express, app, fs);

var logger = require('./core/logger.js');
logger.log(express, app, fs);

app.locals = require("./lib/dates.js");

var routes = require('./core/routes.js');
routes.route(express, app);

//= = = = = = = Initialize
/*app.listen(app.get('port'), function() {
  console.log("server started in "+process.env.NODE_ENV+" mode, listening on port "+app.get('port'));
});*/

app.listen(app.get('port'), function() {
  console.log("server started in "+process.env.NODE_ENV+" mode, listening on port "+app.get('port'));
});