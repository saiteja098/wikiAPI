const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
const ejs = require("ejs");

const app = express();

app.set("view engine", ejs);

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));


mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model('Article', articleSchema);


/////////////////////////////////////////////////////////HTTP REQUESTS FOR ARTICLES COLLECTION///////////////////////////////////////////////////


app.route("/articles")

  .get(function (req, res) {

     Article.find({}, function(err, foundItems){
        if(!err){
            res.send(foundItems);
        }else{
            console.log(err);
        }
     })
  })

  .post(function(req, res){

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if(!err){
            res.send("successfully added " + req.body.title +" article");
        }else{
            res.send(err);
        }
    })
  })

  .delete(function(req, res){

    Article.deleteMany(function(err){
        if(!err){
            res.send("successfully deleted all articles.");
        }else{
            res.send(err);
        }
    })
  })


  //////////////////////////////////////////////////HTTP REQUESTS FOR SINGLE ARTICLE///////////////////////////////////////////////////////////

  app.route("/articles/:articleTitle")

  .get(function(req, res){

    Article.findOne({title: req.params.articleTitle}, 
    function(err, foundItem){
        if(!err){
            res.send(foundItem);
        }else{
            res.send(err);
        }
    });
  })

  .put(function(req, res){

    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        function(err){
            if(!err){
            res.send("successfully updated the " + req.params.articleTitle + " article");
            }else{
                res.send(err);
            }
        }
        );
  })

  .patch(function(req, res){

    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("successfully updated the " + req.params.articleTitle + " article")
            }else{
                res.send(err);
            }
        }
        
    );
  })

  .delete(function(req, res){

    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                res.send("successfully deleted the " + req.params.articleTitle + " article.");
            }else{
                res.send(err);
            }
        }
    );
  });






app.listen(3000, function(){
    console.log("server is up and running at 3000");
});

