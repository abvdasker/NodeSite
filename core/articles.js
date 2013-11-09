var createArticle = function(title, text) {
  var query = "INSERT INTO articles (title, article) "+
  "VALUES(?, ?)";
  connection.query(query, [title, text]);
}

var updateArticle = function(id, text) {
  var query = "UPDATE articles SET article=? WHERE id=?";
  connection.query(query, [text, id]);
}

var getFromTitle = function(title, f) {
  var query = "SELECT * FROM articles WHERE title=?";
  connection.query(query, [title], function(err, rows) {
    console.log("ERR: "+ err);
    f(rows[0]);
  })
}

var allArticles = function(f) {
  var query = "SELECT * FROM articles";
  connection.query(query, function(err, rows) {
    console.log("ERR: "+ err);
    f(rows[0]);
  })
}

module.exports = {
  createArticle : createArticle,
  updateArticle : updateArticle,
  getFromTitle : getFromTitle
}