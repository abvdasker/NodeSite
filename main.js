var express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');

var crypto = require('crypto');
var privateKey = fs.readFileSync('./toadwork.key');
var certificate = fs.readFileSync('./toadwork.crt');

var credentials = {key:privateKey, cert:certificate};

require("./lib/mysql_init.js")();
var app = express(); 

var config = require('./core/config.js');
config.configure(express, app, fs);

var logger = require('./core/logger.js');
logger.log(express, app, fs);

app.locals = require("./lib/dates.js");

var routes = require('./core/routes.js');
routes.route(express, app);

function requireHTTPS(req, res, next) {
    if (!req.secure) {
        //FYI this should work for local development as well
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}
app.use(requireHTTPS);

var httpsServer = https.createServer(credentials, app);

//= = = = = = = Initialize
/*app.listen(app.get('port'), function() {
  console.log("server started in "+process.env.NODE_ENV+" mode, listening on port "+app.get('port'));
});*/

httpsServer.listen(443);
