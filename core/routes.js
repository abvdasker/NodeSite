var articles = require('./articles.js');
var handlers = require('./handlers.js');

// need to separate the response handling from the routes!!!
exports.route = function(app) {
  //updates the context menu once every minute
  
  articles.setContextResults();
  setInterval(articles.setContextResults, 1000 * 60);
  
  var authenticate = handlers.cms.authenticate;
  
  // how all the routes should look:
  app.get('/cms', handlers.cms.cms_main);
  app.get('/cms/', handlers.cms.cms_main);
  app.get('/cms/login', handlers.cms.cms_main);
  
  app.post('/cms/login-auth', handlers.cms.login);
  
  app.post('/cms/logout', handlers.cms.logout);
  
  // create route for individual articles based on id
  app.get("/cms/article", authenticate, handlers.cms.last_article);
  
  app.get('/cms/article/new', authenticate, handlers.cms.new_ar);
  
  app.get('/cms/article/:article_id', authenticate, handlers.cms.article);
  
  app.post('/cms/article/delete', authenticate, handlers.cms.delete_ar);
  
  app.post("/cms/create", authenticate, handlers.cms.create);
  
  app.post("/cms/update", authenticate, handlers.cms.update);
  
  app.get('/article/:id', handlers.single_article);
   
  app.get('/older/:id', handlers.older_articles);
  
  app.get('/index', function(req, res) {
    res.redirect('/');
  });

  // just get 4 most recent articles!
  app.get('/', handlers.index);
  
  app.get('/about', function(req, res) {
    res.render('about.jade', {page_class : 'about'});
  });
  
  app.get('/projects', function(req, res) {
    res.render('projects.jade', {page_class : 'projects'});
  });
  
  app.get('/contact', function(req, res) {
    res.render('contact.jade', {page_class : 'contact'});
  });
  
  app.use(handlers.respond404);
  console.log("routes loaded");
}