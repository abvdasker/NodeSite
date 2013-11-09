var users = require('./users.js');

function authenticate(req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect("/cms-login");
  }
}

exports.route = function(express, app) {

  app.set("views", __dirname +"/../views");
  
  app.use(app.router);
  
  // all static files!
  app.use('/static', express.static(__dirname + "/../public"));
  
  console.log("routes loaded");
  
  app.get('/cms-login', function(req, res) {
    if (req.session.loggedIn) {
      res.redirect("/cms-edit");
    } else {
      res.render('cms/login.jade');
    }
  });
  
  app.post('/cms-login/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    
    users.validate(username, password, function(valid) {
      if (valid) {
        req.session.loggedIn = true;
        res.redirect("/cms-edit");
      } else {
        res.redirect("/cms-login");
      }
    });
    
  });
  
  app.post('/logout', function(req, res) {
    req.session.loggedIn = false;
    res.redirect("/cms-edit");
  });
  
  app.get('/cms-edit', authenticate, function(req, res) {
    res.render("cms/edit.jade");
  });

  app.get('/index', function(req, res) {
    res.render('index.jade');
  });

  app.get('/', function(req, res) {
    res.render('index.jade');
  });

}