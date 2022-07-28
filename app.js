//jshint esversion:6
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

// mongoose.connect('mongodb://localhost:27017/blogDB', {useNewUrlParser: true});
mongoose.connect('mongodb+srv://'+process.env.MONGO_ID+':'+process.env.MONGO_PASSWORD+'@cluster0.sll0h.mongodb.net/blogDB?retryWrites=true&w=majority', {useNewUrlParser: true});

const homeStartingContent = "Welcome to the blog Application. Here you can write your own blogs and view them. Just go to the compose page and then start create your own custom blogs with just one click.";
const aboutContent = "This app lets you make your own blog entries and view them.";
const contactContent = "+91-0000000000 | abcdefgh@xyz.com";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    if(err){
      console.log(err);
    }else{
      res.render("home", {startingContent: homeStartingContent, posts: posts});
    }
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const postTitle = _.capitalize(req.body.postTitle);
  const post = new Post({
    title: postTitle,
    content: req.body.postBody
  });

  post.save(function(err, result){
    res.redirect("/");
  });

});

app.get("/posts/:postId", function(req, res){
  const requestedId = req.params.postId;

  Post.findOne({_id: requestedId}, function(err, post){
    if(err){
      console.log(err);
    }else{
      res.render("post", {title: post.title, content: post.content});
    }
  });

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
