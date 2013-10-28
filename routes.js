exports.route = function(express, app) {
  
  app.use(app.router);
  
  // all static files!
  app.use('/static', express.static(__dirname + "/public"));
  
  console.log("routes loaded");
  /*app.get('/users/:userId', function(req, res){}); 
  * how to parameterize a route
  */
  app.post('/cms-login/login', function(req, res) {
    res.render("index.jade");
  });

  app.get('/cms-login', function(req, res) {
    res.render('cms/login.jade');
  });

  app.get('/index', function(req, res) {
    res.render('index.jade');
  });

  app.get('/', function(req, res) {
    res.render('index.jade');
  });

}