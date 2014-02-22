exports.configure = function(express, app, fs) {
  
  console.log("config loaded");
  // = = = = = environment configurations = = = = = 
  app.configure(function() {
    
  	app.set('title', 'Personal Site');
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', {
      layout: false
    });
    
    app.set('port', 8000);
  
    app.engine('html', require('ejs').renderFile);
    
    app.use(express.favicon(__dirname + '/../public/image/favicon.ico'));
    
    app.use(express.cookieParser());
    app.use(express.session({secret: '17bY8Pv7290bMaL31'}))
    
    app.use(express.bodyParser());
  });

  app.configure('development', function() {
    app.locals.pretty = true;
    //app.set('port', process.env.PORT || 8000);
    app.set('domain', 'localhost');
  });

  app.configure('production', function() {
    //app.set('port', process.env.PORT || 443);
    app.set('domain', 'toadwork.com');
  });
  // = = = = = = = = = = = = = = = 

}