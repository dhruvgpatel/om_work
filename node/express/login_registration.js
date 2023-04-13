const body = require('body-parser');
var express = require('express');
var app = express();
app.set('view engine', 'ejs'); //for using ejs
var mysql = require('mysql2');
app.use(body.json())
var jwt = require('jsonwebtoken')
var cookies = require("cookie-parser");
app.use(cookies());

app.use(body.urlencoded({ extended: false }))
let bcrypt = require('bcryptjs');

app.use(express.static('assets'))

var con = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: 'root',
    database: 'job_application_db'
});

con.connect((err) => {
    if (err) throw err;
    console.log('connected 8081')

}); app.listen(8081);



app.get("/", function (req, res) { //registration api
    const isToken = req.cookies.jwtToken;
    if (isToken) {
        res.redirect("/home");
    }
    res.render('registration')
});

app.get("/signup", function (req, res) { //signup api
    const isToken = req.cookies.jwtToken;
    if (isToken) {
        res.redirect("/home");
    }
    res.render('registration')
});

app.post("/data", async function (req, res) { //registration post api for user stored data
    const { name, mail, pwd } = req.body;

    console.log(name)
    console.log(pwd)
    console.log(mail)

    var hash = await bcrypt.hash(pwd, 10)
    var string = Math.random().toString(36).substring(2, 17);
    console.log(string);


    sql = `insert into job_application_db.registration_tbl (name,mail,password,activationlink) values ('${name}','${mail}','${hash}','${string}'); `;
    let data = await getdata(sql)
    res.render("link", { string })

})

app.get("/activate", async function (req, res) { //activate api for activate user
    const string = req.query.activate
    console.log(string)

    sql = `UPDATE job_application_db.registration_tbl SET activationstatus = '1' WHERE activationlink ='${string}';`
    let data = await getdata(sql);
    res.render("login");

});

app.get('/login', (req, res) => { //login api

    const isToken = req.cookies.jwtToken;
    if (isToken) {
        res.redirect("/home");
    }
    res.render('login')
})

app.post("/logindata", async function (req, res) { //login post api for user authenticate data

    const { mail, pwd } = req.body;
    var sql = `select * from job_application_db.registration_tbl where mail = '${mail}'`;
    var result = await getdata(sql)
    console.log(result);
    if (result[0].length == 0) {
        return res.send("user not found")
    }
    console.log(result[0]);

    //comparing password
    let regpwd = result[0].password;
    console.log("regpwd", regpwd)
    var match = await bcrypt.compare(pwd, regpwd);
    console.log(match);
    if (!match) {
        return res.send(`wrong details!`)
    }

    //generating jwt token
    const jwtToken = jwt.sign(result[0], "om");
    res.cookie("jwtToken", jwtToken);
    res.redirect("/home");

})


app.get("/home", (req, res) => { //home page api
    const isToken = req.cookies.jwtToken;
    if (!isToken) {
        return res.send(`you are not authorized register first <a href="/">sign up</a>`);
    }
    const tkn = jwt.verify(isToken, "om")
    res.render("home", { tkn });

})

app.get('/logout', (req, res) => { //after logout clear cookie api
    res.clearCookie("jwtToken")
    res.redirect("/")
})

app.get("/finduser?", async (req, res) => {
    const mail = req.query.mail;
    var sql = `select mail from job_application_db.registration_tbl where mail = '${mail}'`;
    var result = await getdata(sql)

    if (result == "") {
        res.json({ exists: false });
    } else {
        res.json({ exists: true });
    }

})

app.get("/finduser2?", async (req, res) => {
    const mail = req.query.mail;
    const pwd = req.query.pwd;
    var sql = `select password from job_application_db.registration_tbl where mail = '${mail}'`;
    var result = await getdata(sql)
    console.log('password', result);
    if (result != "") {
    console.log('password', result[0].password);
        var match = await bcrypt.compare(pwd, result[0].password);
        console.log(match);
        if (match) {
            res.json({ exists: false });
        } else {
            res.json({ exists: true });
        }
    }else{
        res.json({ exists: true });
    }
})
async function getdata(sql) { //sql query function  
    return new Promise((res, rej) => {
        con.query(sql, (err, data) => {
            if (err) throw err;
            res(data);
        })
    })
}