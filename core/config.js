exports.configure = function(express, app, fs) {
  
  console.log("config loaded");
  // = = = = = environment configurations = = = = = 
  app.configure(function() {
    
    app.set('port', process.env.PORT || 8000);
  	app.set('title', 'Personal Site');
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', {
      layout: false
    });
    
    app.use(express.favicon(__dirname + '/../public/image/favicon.ico'));
    
    app.use(express.cookieParser());
    app.use(express.session({secret: '17bY8Pv7290bMaL31'}))
    
    app.use(express.bodyParser());
  });

  app.configure('development', function() {
      app.locals.pretty = true;
  });

  app.configure('production', function() {
	
  });
  // = = = = = = = = = = = = = = = 

}