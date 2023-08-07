//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const fs = require("fs");

const homeStartingContent = "Welcome to my journal webpage! You can compose and post your journal by clicking 'POST' button in the navigation bar. Anything you posted here can be retrieved anytime and shared with everyone. ";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
const key = fs.readFileSync("mongoDBkey.txt", "utf-8");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://liqqianl:"+ key +"@cluster0.kvvk5qk.mongodb.net/journalsDB");

const journalsSchema = mongoose.Schema({
  title: String,
  content: String
})

const Journal = mongoose.model("Journal", journalsSchema);

app.get("/", async (req, res) => {
  const posts = await Journal.find();
  res.render("home.ejs", 
  { content: homeStartingContent,
    posts: posts,
  });
});

// app.get("/posts/:title", async (req, res) => {
//   const requestTitle = _.lowerCase(req.params.title);
//   const posts = await Journal.find();

//   posts.forEach( post => {
//     const postTitle = _.lowerCase(post.title);
//     if (postTitle === requestTitle) {
//       res.render("post.ejs", { post: post });
//     }
//   });
// });

app.get("/posts/:postId", async (req, res) => {

  const requestId = req.params.postId;

  if (requestId.length === 24) {

    const post = await Journal.findOne({_id: requestId});
    res.render("post.ejs", { post: post });
  
  } else {

    const requestTitle = _.lowerCase(req.params.postId);
    const posts = await Journal.find();

    posts.forEach( post => {
      const postTitle = _.lowerCase(post.title);
      if (postTitle === requestTitle) {
        res.render("post.ejs", { post: post });
      }
    });
  }

});

app.get("/about", (req, res) => {
  res.render("about.ejs", { content: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs", { content: contactContent });
});

app.get("/compose", (req, res) => {
  res.render("compose.ejs");
});

app.post("/compose", (req, res) => {
  //console.log(req.body.content);
  const post = new Journal ({
    title: req.body.title,
    content: req.body.content,
  });
  //console.log(JSON.stringify(journal));
  post.save();
  //console.log(posts);
  res.redirect("/");
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}



app.listen(port, function() {
  console.log("Server started on port 3000");
});
