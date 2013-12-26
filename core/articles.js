var createArticle = function(title, text, f) {
  var query = "INSERT INTO articles (title, article) VALUES(?, ?)";
  connection.query(query, [title, text], function(err, rows) {
    console.log("ERR: "+err);
    f();
  });
}

var updateArticle = function(id, title, text, f) {
  var query = "UPDATE articles SET title=?, article=? WHERE id=?";
  connection.query(query, [title, text, id], function(err, rows) {
    console.log("ERR: "+err);
    f();
  });
}

var getFromTitle = function(title, f) {
  var query = "SELECT * FROM articles WHERE title=?";
  connection.query(query, [title], function(err, rows) {
    console.log("ERR: "+ err);
    f(rows[0]);
  })
}

var getAll = function(f) {
  var query = "SELECT * FROM articles";
  connection.query(query, function(err, rows) {
    console.log("ERR: "+ err);
    f(rows);
  })
}

var getFromDates = function(start, end, f) {
  var query = "SELECT * FROM articles WHERE"+
  " DATE(created)>=DATE(?) AND DATE(created)<=DATE(?) ORDER BY created DESC";
  connection.query(query, [start, end], function(err, rows) {
    console.log("ERR: "+err);
    console.log("ROWS FOR GET DATES:"+rows);
    f(rows);
  })
}

var getTitlesAndIds = function(f) {
  var query = "SELECT id, title, created FROM articles ORDER BY created DESC;"
  
  connection.query(query, function(err, rows) {
    console.log("ERR: "+err);
    f(rows);
  });
}

var getArticle = function(id, f) {
  var query = "SELECT * FROM articles WHERE id=?;"
  
  connection.query(query, [id], function(err, rows) {
    console.log("ERR: "+err);
    f(rows);
  });
}

var getLastArticle = function(f) {
  var query = "SELECT * FROM articles ORDER BY created DESC LIMIT 1;"
  
  connection.query(query, function(err, rows) {
    console.log("ERR: "+err);
    f(rows);
  });
}

var getLastUpdated = function(f) {
  var query = "SELECT * FROM articles ORDER BY updated DESC LIMIT 1;"
  
  connection.query(query, function(err, rows) {
    console.log("ERR: "+err);
    f(rows);
  });
}

var deleteArticle = function(id, f) {
  var query = "DELETE FROM articles WHERE id=?;"
  
  connection.query(query, [id], function(err, rows) {
    console.log("ERR: "+err);
    f(rows);
  });
}

// add method for date range of articles

module.exports = {
  createArticle : createArticle,
  updateArticle : updateArticle,
  getFromTitle : getFromTitle,
  getAll : getAll,
  getFromDates : getFromDates,
  getTitlesAndIds : getTitlesAndIds,
  getArticle : getArticle,
  getLastArticle : getLastArticle,
  deleteArticle : deleteArticle
}