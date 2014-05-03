var articles = require('./articles.js');
var dates = require('../lib/dates.js');
var users = require('./users.js');

//var querystring = require('querystring');

var respond404 = function(req, res) {
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

var cms_main = function(req, res) {
  if (req.session.loggedIn) {
    res.redirect("/cms/article");
  } else {
    res.render('cms/login.jade');
  }
}

var index = function(req, res) {    
  articles.getLastFive(Number.MAX_VALUE, function(results) {
  res.render('index.jade', 
    { ar_obj : results
    });
  });
}

var single_article = function(req, res) {
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
      handlers.respond404(req, res);
    }
  });
}

var older_articles = function(req, res) {
  var id = parseInt(req.params.id);
  
  articles.getLastFive(id - 1, function(results) {
    
    if (results.length < 1) {
      handlers.respond404(req, res);
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
}

var update = function(req, res) {
  var id = req.body.id;
  var new_title = req.body.title_str;
  var new_content = req.body.content_str;
  var image_url = req.body.image_url;
  
  articles.updateArticle(id, new_title, new_content, image_url, function() {
    req.params.article_id = id;
    res.redirect("/cms/article/"+id);
  });
}

var create = function(req, res) {
  var title = req.body.title_str;
  var content = req.body.content_str;
  var image_url = req.body.image_url;
  
  articles.createArticle(title, content, image_url, function() {
    // redirects to newest article; the one just created
    res.redirect("/cms/article");
  });
}

var delete_ar = function(req, res) {
  var id = req.body.id;
  
  articles.deleteArticle(id, function(rows) {
    // redirects to newest article
    res.redirect("/cms/article");
  });
}

var cms_article = function(req, res) {
  var id = req.params.article_id;
  articles.getTitlesAndIds(function(results1) {
    articles.getArticle(id, function(results2) {
      res.render("cms/edit.jade",
        {   article : results2[0],
            context : results1
        });
    });
  });
}

var new_ar = function(req, res) {
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
}

var last_article = function(req, res) {
  articles.getLastArticle(function(results2) {
    var a = results2[0];
    if (typeof a != "undefined") {
      res.redirect("/cms/article/"+results2[0].id);
    } else {
      res.redirect("/cms/article/new");
    }
  });
}

var logout = function(req, res) {
  req.session.loggedIn = false;
  res.redirect("/cms/article");
}

var login = function(req, res) {
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
  
}

var authenticate = function(req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect("/cms/login");
  }
}

module.exports = {
  index : index,
  single_article : single_article,
  older_articles : older_articles,
  respond404 : respond404,
  cms : {
    cms_main : cms_main,
    update : update,
    create : create,
    delete_ar : delete_ar,
    article : cms_article,
    new_ar : new_ar,
    last_article : last_article,
    logout : logout,
    login : login,
    authenticate : authenticate
  }
}