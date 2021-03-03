var express = require("express");
var router = express.Router();
var sqlite3 = require("sqlite3");
const db = new sqlite3.Database("zipDB.sqlite", ":memory");

router.get("/", function (req, res, next) {
  const keyword = req.query;
  db.serialize(() => {
    db.all(
      `select * from zip1 where code LIKE '%${keyword.code1}%'`,
      (err, rows) => {
        // if (!err) {
        //   var data = { content: rows };
        //   res.render("", data);
        // }
        if (!err && rows) {
          // 改行コードを<br>に変換
          const newRows = rows.map((row) => {
            if (row.code && row.prefecture && row.city && row.town) {
              row.code = row.code.replace(/\"*\"/g, "");
              row.prefecture = row.prefecture.replace(/\"*\"/g, "");
              row.city = row.city.replace(/\"*\"/g, "");
              row.town = row.town.replace(/\"*\"/g, "");
            }
            return row;
          });
          console.log(newRows);
          // postsパラメータを渡した状態で、index.ejsをレンダリング
          res.render("", { content: newRows });
        }
      }
    );
  });
});

module.exports = router;
