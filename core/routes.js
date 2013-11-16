var users = require('./users.js');
var articles = require('./articles.js');
var dates = require('../lib/dates.js');

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
  
  // create route for individual articles based on id
  
  app.get('/cms-edit', authenticate, function(req, res) {
    // one page to find/browse articles
      // by creation date
      // by title
      // search
      // each article has a preview and an edit button
    // list articles on the side as links
    // a "create new article" button
    // a logout button
    res.render("cms/edit.jade");
  });

  app.get('/index', function(req, res) {
    res.redirect('/');
  });

  app.get('/', function(req, res) {
    var today = new Date();
    var monthago = new Date(today.getTime());
    monthago.setMonth(monthago.getMonth() - 1);
    console.log("monthago "+monthago);
    console.log("today "+today);
    articles.getFromDates(monthago, today, function(results) {
      console.log("RESULTS: "+results+", "+results.length);
      for (r in results) {
        console.log(results[r]);
      }
      res.render('index.jade', 
        { ar_obj : results,
          formatDate : dates.formatDate,
          datesEqual : dates.datesEqual
        });
    });
  });

}