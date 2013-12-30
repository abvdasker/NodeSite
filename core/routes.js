var users = require('./users.js');
var articles = require('./articles.js');
//var dates = require('../lib/dates.js');

function authenticate(req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect("/cms/login");
  }
}

function main(req, res) {
  if (req.session.loggedIn) {
    res.redirect("/cms/article");
  } else {
    res.render('cms/login.jade');
  }
}

// need to separate the response handling from the routes!!!
exports.route = function(express, app) {

  app.set("views", __dirname +"/../views");
  
  app.use(app.router);
  
  // all static files!
  app.use('/static', express.static(__dirname + "/../public"));
  
  console.log("routes loaded");

  app.get('/cms', main);
  app.get('/cms/', main);
  app.get('/cms/login', main);
  
  app.post('/cms/login-auth', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    
    users.validate(username, password, function(valid) {
      if (valid) {
        req.session.loggedIn = true;
        res.redirect("/cms/article");
      } else {
        res.redirect("/cms/login");
      }
    });
    
  });
  
  app.post('/cms/logout', function(req, res) {
    req.session.loggedIn = false;
    res.redirect("/cms/article");
  });
  
  // create route for individual articles based on id
  app.get("/cms/article", authenticate, function(req, res) {
    articles.getLastArticle(function(results2) {
      var a = results2[0];
      if (typeof a != "undefined") {
        res.redirect("/cms/article/"+results2[0].id);
      } else {
        res.redirect("/cms/article/new");
      }
    });
  });
  
  app.get('/cms/article/new', authenticate, function(req, res) {
    articles.getTitlesAndIds(function(results1) {
      var d = new Date();
      
      res.render("cms/new.jade",
        {   article : {
              id : "",
              title : "",
              article : "",
              created : d,
              updated : d},
            context : results1
        });
    });
  });
  
  app.get('/cms/article/:article_id', authenticate, function(req, res) {
    var id = req.params.article_id;
    articles.getTitlesAndIds(function(results1) {
      articles.getArticle(id, function(results2) {
        res.render("cms/edit.jade",
          {   article : results2[0],
              context : results1
          });
      });
    });
  });
  
  app.post('/cms/article/delete', authenticate, function(req, res) {
    var id = req.body.id;
    
    console.log("delete called for article " + id);
    
    articles.deleteArticle(id, function(rows) {
      // redirects to newest article
      res.redirect("/cms/article");
    });
  });
  
  app.post("/cms/create", authenticate, function(req, res) {
    var title = req.body.title_str;
    var content = req.body.content_str;
    
    articles.createArticle(title, content, function() {
      // redirects to newest article; the one just created
      res.redirect("/cms/article");
    });
  });
  
  app.post("/cms/update", authenticate, function(req, res) {
    console.log("UPDATE CALLED");
    var id = req.body.id;
    console.log(id);
    var new_title = req.body.title_str;
    console.log(new_title);
    var new_content = req.body.content_str;
    console.log(id);
    
    articles.updateArticle(id, new_title, new_content, function() {
      req.params.article_id = id;
      res.redirect("/cms/article/"+id);
    });
  });

  app.get('/index', function(req, res) {
    res.redirect('/');
  });

  app.get('/', function(req, res) {
    var today = new Date();
    var monthago = new Date(today.getTime());
    monthago.setMonth(monthago.getMonth() - 4);
    //console.log("monthago "+monthago);
    //console.log("today "+today);
    articles.getFromDates(monthago, today, function(results) {
      for (r in results) {
        console.log(results[r]);
      }
      res.render('index.jade', 
        { ar_obj : results
        });
    });
  });
  
  app.get('/about', function(req, res) {
    res.render('about.jade');
  });

}