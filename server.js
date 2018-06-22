var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;
var app = express();
app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// Connect to the Mongo DB
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Routes
app.get('/', function (req, res) {
  db.Article.find({})
  .populate('note')
    .then(function (data) {
      var hbsObject = {
        Articles: data
      };

      res.render("index", hbsObject);
    });
});


app.get("/scrape", function (req, res) {

  axios.get("https://www.smashingmagazine.com/").then(function (response) {
    var $ = cheerio.load(response.data);

    $("h2").each(function (i, element) {
      var result = {};
      result.title = $(this)
        .children("a")
        .text();
      result.link = "https://www.smashingmagazine.com" + $(this).children("a").attr("href");
      // ***********************************************
      axios.get(result.link).then(function (res){
        var $$ = cheerio.load(res.data);
        console.log("The new axios code ran")
        result.summary = $$(".article__summary").text()
        
        db.Article.create(result)
        .then(function (dbArticle) {})
        .catch(function (err) {
          //return res.json(err);
        });

      })

      //************************************************* */
      // db.Article.create(result)
      //   .then(function (dbArticle) {})
      //   .catch(function (err) {
      //     return res.json(err);
      //   });
    });
    res.send("Scrape Complete");
  });
});


app.get("/articles", function (req, res) {

  db.Article.find({})
    .then(function (dbArticle) {
     // res.json(dbArticle);
    })
    .catch(function (err) {
      //res.json(err);
    });
});

app.get("/articles/:id", function (req, res) {
  db.Article.findOne({
      _id: req.params.id
    })
    .populate("note")
    .then(function (dbArticle) {
      //res.json(dbArticle);
    })
    .catch(function (err) {
     // res.json(err);
    });
});


app.post("/articles/:id", function (req, res) {
  db.Note.create(req.body)
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate({
        _id: req.params.id
      }, {"$push":{
        note: dbNote._id}
      }, {
        new: true
      });
    })
    .then(function (dbArticle) {})
    .catch(function (err) {
     // res.json(err);
    });
});

app.delete("/deletecomment/:id", function (req,res) {
  db.Note.findByIdAndRemove(req.params.id,(err, comment) => {  
    // As always, handle any potential errors:
    if (err) return res.status(500).send(err);
    });
})

app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});

