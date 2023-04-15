const express = require("express");
const ejs = require("ejs");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use('/views', express.static('static'));
app.use(express.static('public'));

app.get("/", function(req, res){
    res.render("index");
});
app.get("/map", function(req, res){
    res.render("map");
});
app.get("/list", function(req, res){
    res.render("list");
});
app.get("/news", function(req, res){
    res.render("news");
});
app.get("/notice", function(req, res){
    res.render("notice");
});
app.get("/login", function(req, res){
    res.render("login");
});
app.get("/signup", function(req, res){
    res.render("signup");
});
app.get("/create", function(req, res){
    res.render("create");
});

app.listen(port, () => {
    console.log(`server start on ${port}`);
});