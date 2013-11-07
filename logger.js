exports.log = function(express, app, fs) {
  
  console.log("logger loaded");
  // = = = = = log setup = = = = = 
  var logFilePath = __dirname+"/log.txt";
  console.log(logFilePath);

  app.use(function(req, res, next) {
    
  	var d = new Date();
    var at = "\nat: "+d+"\n";
    var from = "from: "+req.connection.remoteAddress+"\n";
    var method = "method: "+req.method + "\n";
    var url = "url: "+ req.url+"\n";
    var params = "params: "+req.params+"\n";
    var body = "body: "+req.body+"\n";
    
  	var logString = at + from + method + url + params + body;
  	console.log(logString);
    
  	fs.appendFile(logFilePath, logString, function(err) {
  		if (err)
  			console.log(err + ": Error writing to "+logFilePath+" message "+logString);
  	});
  	next();
  });
  // = = = = = = = = = = = = = = = 
  
}