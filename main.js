var express = require('express');
var fs = require('fs');

var privateKey = fs.readFileSync('./toadwork.key').toString();
console.log("key");
var certificate = fs.readFileSync('./toadwork.crt').toString();
console.log("cert");
var credentials = {key: privateKey, cert: certificate};

require("./lib/mysql_init.js")();
var app = express(); 

var config = require('./core/config.js');
config.configure(express, app, fs);

var logger = require('./core/logger.js');
logger.log(express, app, fs);

app.locals = require("./lib/dates.js");

var routes = require('./core/routes.js');
routes.route(express, app);

//var http = require('http');

var httpServer = express();
httpServer.get('*', function(req, res) {
  res.redirect('https://'+app.get('domain')+req.url);
});
//app.use(requireHTTPS);

//var httpServer = http.createServer(app);
var https = require('https');
var httpsServer = https.createServer(credentials, app);

//= = = = = = = Initialize
/*app.listen(app.get('port'), function() {
  console.log("server started in "+process.env.NODE_ENV+" mode, listening on port "+app.get('port'));
});*/

httpServer.listen(80);
httpsServer.listen(443);