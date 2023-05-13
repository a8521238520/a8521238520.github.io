var express = require('express');
var router = express.Router();

sqlite = require('sqlite3').verbose();
db = new sqlite.Database("./db.sqlite", sqlite.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});
// 電影台詞
sql = 'CREATE TABLE IF NOT EXISTS quote (ID INTEGER PRIMARY KEY AUTOINCREMENT, movie TEXT, quote TEXT, character TEXT)'
db.run(sql);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', (req, res) =>{
  const {year, model, price}=req.body;
  sql = "INSERT INTO MSI (year, model, price) VALUES (?, ?, ?)";
  db.run(sql, [year, model, price], (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('inserted');
  });
  //res.redirect("/data.html")
  res.send("Inserted")
});

module.exports = router;
