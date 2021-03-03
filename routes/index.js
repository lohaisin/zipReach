// var express = require("express");
// var router = express.Router();

// /* GET home page. */
// router.get("/", function (req, res, next) {
//   res.render("index");
// });

// module.exports = router;

var express = require("express");
var router = express.Router();
var sqlite3 = require("sqlite3");
const db = new sqlite3.Database("zipDB.sqlite");

router.get("/", function (req, res, next) {
  const keyword = req.query;
  db.serialize(() => {
    db.all(
      `select * from zip1 where code = '${keyword.code1}'`,
      (err, rows) => {
        if (!err) {
          var data = { content: rows };
          res.render("index", data);
        }
      }
    );
  });
});

module.exports = router;
