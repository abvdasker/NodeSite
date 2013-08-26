var express = require('express');
var fs = require('fs');
var app = express();
var molt = require('molt');

/*app.get('/', function(req, res) {
	res.send('hello world');
});*/

// = = = = = log setup = = = = = 
var logFilePath = __dirname+"/log.txt";
console.log(logFilePath);

app.use(function(req, res, next) {
	var d = new Date();
	var logString = "\nat: "+d+"\nmethod: "+req.method + "\nurl: "+ req.url+"\nparams: "+req.params+"\n";
	console.log(logString);
	fs.appendFile(logFilePath, logString, function(err) {
		if (err)
			console.log(err + ": Error writing to "+logFilePath+" message "+logString);
	});
	next();
});
// = = = = = = = = = = = = = = = 

// = = = = = static file routing setup = = = = =
// = = = = = = = = = = = = = = =

// = = = = = environment configurations = = = = = 
app.configure(function() {
  app.set('port', process.env.PORT || 8000);
  
	app.set('title', 'Personal Site');
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('vew options', {
    layout: false,
    pretty: true
  });
  
  app.use(app.router);
  app.use('/static', express.static(__dirname + "/public"));
});

app.configure('development', function() {
	
});

app.configure('production', function() {
	
});
// = = = = = = = = = = = = = = = 

/*app.get('/users/:userId', function(req, res){}); 
* how to parameterize a route
*/

app.get('/', function(req, res) {
  res.render('index.jade');
});

app.listen(app.get('port'), function() {
  console.log("server started, listening on port "+app.get('port'));
});