var express = require('express');
var fs = require('fs');
var app = express();

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
app.use('/static', express.static(__dirname + "/public"));
// = = = = = = = = = = = = = = =

// = = = = = environment configurations = = = = = 
app.configure(function() {
	app.set('title', 'Personal Site');
});

app.configure('development', function() {
	
});

app.configure('production', function() {
	
});
// = = = = = = = = = = = = = = = 

app.listen(8000);