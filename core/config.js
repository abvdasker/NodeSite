var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var session = require('express-session');

exports.configure = function(express, app, fs) {
  console.log("current working dir: "+__dirname)
  
  console.log("config loaded");
  // = = = = = environment configurations = = = = = 
  app.set('title', 'Personal Site');
  app.set('views', __dirname + '/../views');
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: true
  });
  
  app.set('port', 8000);

  app.engine('html', require('ejs').renderFile);
  
  app.use(favicon(__dirname + '/../public/image/favicon.ico'));
  
  app.use(cookieParser());
  app.use(session({secret: '17bY8Pv7290bMaL31'}));

  app.set("views", __dirname +"/../views");
  app.use('/static', express.static(__dirname + "/../public"));
  
  app.use(bodyParser());

  var env = process.env.NODE_ENV || 'development';
  
  var morgan = require('morgan');
  morgan.format('custom', 'HTTP :http-version   :method :url   :remote-addr :date   :response-time ms')
  
  if (env == "development" || typeof env == 'undefined') {
    app.locals.pretty = true;
    //app.set('port', process.env.PORT || 8000);
    app.use(morgan({
      format : 'custom'
    }));
    app.set('domain', 'localhost');
  } else if (env == "production") {
    
    var output = fs.createWriteStream(__dirname + "/../log/log.txt", {flags:"a"});
    
    app.use(morgan({
      stream : output,
      format : 'custom'
    }))
    //app.set('port', process.env.PORT || 443);
    app.set('domain', 'toadwork.com');
  }

}

function defineMorgan(morgan, logfile) {
  
}