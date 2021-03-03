var express = require("express");
var router = express.Router();
var fs = require("fs");
var multer = require("multer");
var upload = multer({ dest: "./uploads/" });
const csv = require("csv-parser");
var readline = require("readline");
var sqlite3 = require("sqlite3");
const db = new sqlite3.Database("zipDB.sqlite");
const results = [];

/* GET users listing. */
router.post(
  "/",
  upload.fields([{ name: "thumbnail" }]),
  function (req, res, next) {
    var path = req.files.thumbnail[0].path;
    var filename = req.files.thumbnail[0].filename;
    var originalname = req.files.thumbnail[0].originalname;
    var targetPath = "./uploads/" + originalname;

    function insert_db(db, item) {
      let sql = `INSERT INTO zip1 (code,prefecture,city,town,pre_en,city_en,town_en) VALUES (?,?,?,?,?,?,?)`;
      let stmt = db.prepare(sql);
      stmt.run(
        item.code,
        item.prefecture,
        item.city,
        item.town,
        item.pre_en,
        item.city_en,
        item.town_en
      );
      stmt.finalize();
      db.close();
    }
    function proc_arr_check(items) {
      let self = this;
      items.forEach(function (item) {
        var code = item[0];
        var prefecture = item[1];
        var city = item[2];
        var town = item[3];
        var pre_en = item[4];
        var city_en = item[5];
        var town_en = item[6];
        var arr = {
          code: code,
          prefecture: prefecture,
          city: city,
          town: town,
          pre_en: pre_en,
          city_en: city_en,
          town_en: town_en,
        };
        insert_db(db, arr);
      });
    }
    function read_csvFile() {
      var items = [];
      var rs = fs.createReadStream(`${path}`);
      var readline = require("readline");
      var rl = readline.createInterface(rs, {});
      var i = 0;
      let self = this;
      rl.on("line", function (line) {
        if (i > 0) {
          if (line.length > 0) {
            let col = line.split(",");
            //console.log( col.length );
            if (col.length >= 3) {
              items.push(col);
            }
          }
        }
        i += 1;
      }).on("close", function () {
        proc_arr_check(items);
      });
    }
    read_csvFile();
    res.render("upload", { title: "Express" });
  }
);

module.exports = router;
