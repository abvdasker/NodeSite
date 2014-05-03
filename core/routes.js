var users = require('./users.js');
var articles = require('./articles.js');
var dates = require('../lib/dates.js');
var querystring = require('querystring');

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

function respond404(req, res) {
  res.status(404);
  
  // respond with html page
  if (req.accepts('html')) {
    res.render('static/404.html', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
  console.log("ERROR: 404 error on "+req.url+"");
}

// need to separate the response handling from the routes!!!
exports.route = function(app) {
  //updates the context menu once every minute
  
  articles.setContextResults();
  setInterval(articles.setContextResults, 1000 * 60);
  
  // how all the routes should look:
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
    var image_url = req.body.image_url;
    
    articles.createArticle(title, content, image_url, function() {
      // redirects to newest article; the one just created
      res.redirect("/cms/article");
    });
  });
  
  app.post("/cms/update", authenticate, function(req, res) {
    var id = req.body.id;
    var new_title = req.body.title_str;
    var new_content = req.body.content_str;
    var image_url = req.body.image_url;
    
    articles.updateArticle(id, new_title, new_content, image_url, function() {
      req.params.article_id = id;
      res.redirect("/cms/article/"+id);
    });
  });
  
  app.get('/article/:id', function(req, res) {
    var id = req.params.id;
    articles.getArticle(id, function(results) {

      var dateMap = dates.makeDateMap(articles.contextResults);
      // need to include all articles in datemap by wrapping in call to all articles. . .
      if (results.length > 0) {
        res.render("article.jade",
        { article : results[0],
          dateMap : dateMap
        });
      } else {
        respond404(req, res);
      }
    });
  });
   
  app.get('/older/:id', function(req, res) {
    var id = parseInt(req.params.id);
    
    articles.getLastFive(id - 1, function(results) {
      
      if (results.length < 1) {
        respond404(req, res);
      } else if (results.length < 4) {
        var dateMap = dates.makeDateMap(articles.contextResults);
        res.render('index.jade', 
          { ar_obj : results,
            dateMap : dateMap,
            older : null
          });
      } else {
        results.pop(); // throw away the last result!
        var older = results[results.length - 1]["id"];
        var dateMap = dates.makeDateMap(articles.contextResults);
        res.render('index.jade', 
          { ar_obj : results,
            dateMap : dateMap,
            older : older
          });
      }
    });
  });
  
  app.get('/index', function(req, res) {
    res.redirect('/');
  });

  // just get 4 most recent articles!
  app.get('/', function(req, res) {
    
    articles.getLastFive(Number.MAX_VALUE, function(results) {
      res.render('index.jade', 
        { ar_obj : results
        });
    });
  });
  
  app.get('/about', function(req, res) {
    res.render('about.jade', {page_class : 'about'});
  });
  
  app.get('/projects', function(req, res) {
    res.render('projects.jade', {page_class : 'projects'});
  });
  
  app.get('/contact', function(req, res) {
    res.render('contact.jade', {page_class : 'contact'});
  });
  
  app.use(function(req, res) {
    respond404(req, res);
  });
  console.log("routes loaded");
}