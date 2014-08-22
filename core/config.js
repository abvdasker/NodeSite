var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

exports.configure = function(express, app, fs) {
  
  console.log("config loaded");
	app.set('title', 'Personal Site');
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false
  });
  
  app.set('port', 8000);

  app.engine('html', require('ejs').renderFile);
  
  app.use(favicon(__dirname + '/../public/image/favicon.ico'));
  
  app.use(cookieParser());
  app.use(session({secret: '17bY8Pv7290bMaL31'}))
  
  app.use(bodyParser());

  // = = = = = environment configurations = = = = = 
  var environment = app.get('env');
  if (environment == 'development') {
    app.locals.pretty = true;
    //app.set('port', process.env.PORT || 8000);
    app.set('domain', 'localhost');
  }
  
  if (environment == 'production') {
    //app.set('port', process.env.PORT || 443);
    app.set('domain', 'toadwork.com');
    
  }
  // = = = = = = = = = = = = = = = 

}