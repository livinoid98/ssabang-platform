const express = require("express");
const ejs = require("ejs");
const app = express();
const session = require("express-session");
const db_config = require(__dirname + "/config/database.js");
const conn = db_config.init();
const port = 3000;

db_config.connect(conn);

app.set("view engine", "ejs");
app.use('/views', express.static('static'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: true,
    })
  );

app.get("/", function(req, res){
    if(req.session.name){
        let name = req.session.name;
        res.render("index", {user_name: name})
    }else{
        res.render("index", {user_name: null});
    }
});
app.get("/map", function(req, res){
    if(req.session.name){
        let name = req.session.name;
        res.render("map", {user_name: name})
    }else{
        res.render("map", {user_name: null});
    }
});
app.get("/list", function(req, res){
    if(req.session.name){
        let name = req.session.name;
        res.render("list", {user_name: name})
    }else{
        res.render("list", {user_name: null});
    }
});
app.get("/news", function(req, res){
    if(req.session.name){
        let name = req.session.name;
        res.render("news", {user_name: name})
    }else{
        res.render("news", {user_name: null});
    }
});
app.get("/notice", function(req, res){
    let sql = "select * from board";
    conn.query(sql, function (err, rows, fields) {
        if(err) console.log('query is not excuted. select fail...\n' + err);
        if(req.session.name){
            let name = req.session.name;
            res.render("notice", {user_name: name, list : rows})
        }else{
            res.render("notice", {user_name: null, list : rows});
        }
    });
});
app.get("/login", function(req, res){
    res.render("login");
});
app.post("/login", (req,res) => {
    let id = req.body.id;
    let password = req.body.password;

    let sql = `select * from user where id='${id}' and password = '${password}'`;
    conn.query(sql, (err, rows, fields) => {
        if(err){
            alert("로그인 정보가 존재하지 않습니다.");
            console.log('query is not excuted. select fail...\n' + err);
        }
        else{
            req.session.name = rows[0].name;
            res.redirect("/");
        }
    });
});
app.get("/logout", (req,res) => {
    req.session.destroy((err) => {
        if(err){
            console.log("session logout error");
            alert("정상적으로 로그아웃 되지 않았습니다. 지속적으로 같은 문제 발생 시 관리자에게 문의하세요.");
        }
        res.redirect("/");
    });
});
app.get("/signup", function(req, res){
    res.render("signup");
});
app.post("/signup" , (req,res) => {
    let id = req.body.id;
    let password = req.body.password;
    let name = req.body.name;
    let phone = req.body.phone;
    let email = req.body.email;

    let sql = `insert into user(id, password, name, phone, email) values('${id}', '${password}', '${name}', '${phone}', '${email}')`;
    conn.query(sql, (err, rows, fields) => {
        if(err) console.log('query is not excuted. select fail...\n' + err);
        else res.redirect("/");
    });
});
app.get("/create", function(req, res){
    if(req.session.name){
        let name = req.session.name;
        res.render("create", {user_name: name})
    }else{
        res.render("create", {user_name: null});
    }
});
app.post("/create" , (req,res) => {
    let title = req.body.title;
    let content = req.body.content;

    let sql = `insert into board(title, content) values('${title}', '${content}')`;
    conn.query(sql, (err, rows, fields) => {
        if(err) console.log('query is not excuted. select fail...\n' + err);
        else res.redirect("notice");
    });
});
app.get("/detail/:page", function(req, res){
    const {page} = req.params;
    let sql = `select * from board where board_no = ${page}`;
    conn.query(sql, (err, result) => {
        if(err) console.log('query is not excuted. select fail...\n' + err);
        else {
            let date = result[0].modified_at.toISOString()
            let year = date.replace('T', ' ').slice(0,4);
            let month = date.replace('T', ' ').slice(5,7);
            let day = date.replace('T', ' ').slice(8,10);
            let res_date = year + "년 " + month + "월 " + day + "일";
            if(req.session.name){
                let name = req.session.name;
                res.render("detail", {user_name: name, list : result[0], date : res_date})
            }else{
                res.render("detail", {user_name: null, list : result[0], date : res_date});
            }
        }
    });
});
app.get("/delete/:article", function(req, res){
    const {article} = req.params;
    let sql = `delete from board where board_no = ${article}`;
    conn.query(sql, (err, result) => {
        if(err) console.log('query is not excuted. select fail...\n' + err);
        else res.redirect("/notice");
    });
});

app.listen(port, () => {
    console.log(`server start on ${port}`);
});