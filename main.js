var express = require('express');
var fs = require('fs');
var app = express();

/*app.get('/', function(req, res) {
	res.send('hello world');
});*/

var config = require('./core/config.js');
config.configure(express, app, fs);

var logger = require('./core/logger.js');
logger.log(express, app, fs);

var routes = require('./core/routes.js');
routes.route(express, app);

//= = = = = = = Initialize
app.listen(app.get('port'), function() {
  console.log("server started in "+process.env.NODE_ENV+" mode, listening on port "+app.get('port'));
});