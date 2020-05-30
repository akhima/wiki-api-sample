const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

const article1 = new Article({
  title: "HTML",
  content: "The building block of any webpage."
});

// article1.save();


//////////////////////////////////////All articles//////////////////////////////////////////////////////////

app.route("/articles")

  .get(function(req, res) {
    Article.find({}, function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function(req, res) {
    console.log(req.body.title);
    console.log(req.body.content);

    const article2 = new Article({
      title: req.body.title,
      content: req.body.content
    });

    article2.save(function(err) {
      if (!err) {
        console.log("Article inserted into DB successfully");
        res.send("Successfully added your article on " + req.body.title);
      } else {
        console.log("Error encountered while saving article to DB " + err);
        res.send("Your article " + req.body.title + " couldn't be inserted due to an error " + err);
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany({}, function(err) {
      if (!err) {
        res.send("Successfully deleted all articles.");
        console.log("Successfully deleted all articles.");
      } else {
        console.log("Couldn't delete all articles due to : " + err);
        res.send("Couldn't delete all articles due to : " + err);
      }
    });
  });


//////////////////////////////////Specific article//////////////////////////////////////////////


app.route("/articles/:articleName")

  .get(function(req, res) {
    const articleRequired = (req.params.articleName);
    console.log(articleRequired);
    Article.findOne({
      title: articleRequired
    }, function(err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No article on " + articleRequired + " found");
      }
    });
  })


  .put(function(req, res) {
    Article.update({
      title: req.params.articleName
    }, {
      title: req.body.title,
      content: req.body.content
    }, {
      overwrite: true
    }, function(err, updatedArticle) {
      if (!err) {
        res.send("Successfully updated article on "+req.params.articleName);
      } else {
        res.send("Couldn't update article due to " + err);
      }
    });
  })

.patch(function(req, res){
  Article.updateOne(
    {title: req.params.articleName},
    // {$set: {content: req.body.content},
    {$set: req.body},
  function(err){
    if(!err){
      res.send("Successfully updated details of "+req.params.articleName);
    } else{
      res.send("Error in updating details: "+err);
    }
  }
  );
})

.delete(function(req, res){
  Article.deleteOne({title: req.params.articleName},function(err){
    if(!err){
      res.send("Successfully deleted your article on "+req.params.articleName);
    } else {
      res.send("Failed to delete article! " + err);
    }
  });
})

  .post(function(req, res) {

  });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
