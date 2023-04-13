
////****************************************login registration api****************************************

const ejs = require('ejs');
const body = require('body-parser');
var express = require('express');
var app = express();
app.set('view engine', 'ejs'); //for using ejs
var mysql = require('mysql2');
app.use(body.json())
var jwt = require('jsonwebtoken')
var cookies = require("cookie-parser");
app.use(cookies());
const path = require("path")

app.use(body.urlencoded({ extended: true }))
let bcrypt = require('bcryptjs');
const { log, Console } = require('console');

app.use(express.static('assets'))

var con = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: 'root',
    database: 'job_application_db'
});
var con2 = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: 'root',
    database: 'exel_format'
});
var con3 = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: 'root',
    database: 'studentdb'
});


con.connect((err) => {
    if (err) throw err;
    console.log('connected con')
});

con2.connect((err) => {
    if (err) throw err;
    console.log('connected con2')
});

con3.connect((err) => {
    if (err) throw err;
    console.log('http://localhost:8080/login')
}); app.listen(8080);


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
    console.log(result[0]);
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
    } else {
        res.json({ exists: true });
    }
})

function getdata(sql) { //sql query function  
    return new Promise((res, rej) => {
        con.query(sql, (err, data) => {
            if (err) throw err;
            res(data);
        })
    })
}






/////***********************************tic-tac-toe format****************************************


app.get("/tictactoe", (req, res) => {
    const isToken = req.cookies.jwtToken;
    if (isToken) {
        res.sendFile(path.join(__dirname, '/assets/html/tictactoe.html'));

    } else {
        return res.send(`you are not authorized register first <a href="/">sign up</a>`);
    }
})

/////***********************************kuku cube format****************************************



app.get("/kukucube", (req, res) => {
    const isToken = req.cookies.jwtToken;
    if (isToken) {
        res.sendFile(path.join(__dirname, '/assets/html/kukucube.html'));

    } else {
        return res.send(`you are not authorized register first <a href="/">sign up</a>`);
    }
})


/////***********************************Webpage format****************************************



app.get("/webpage", (req, res) => {
    const isToken = req.cookies.jwtToken;
    if (isToken) {
        res.sendFile(path.join(__dirname, '/assets/html/x.html'));

    } else {
        return res.send(`you are not authorized register first <a href="/">sign up</a>`);
    }
})



/////***********************************Exel format****************************************




app.get('/exel', async (req, res) => { //for retrive all saved data

    const isToken = req.cookies.jwtToken;
    if (!isToken) {
        return res.send(`you are not authorized register first <a href="/">sign up</a>`);
    }

    sql = `SELECT * FROM exel_format.exeltbl;`
    let data = await getdata(sql)
    res.render('exel', { data });
})


app.get('/save', async (req, res) => { //save user single inserted data

    const isToken = req.cookies.jwtToken;
    if (!isToken) {
        return res.send(`you are not authorized register first <a href="/">sign up</a>`);
    }

    var add = req.query

    console.log(add);
    var id = add.id;
    var fname = add.fname;
    var lname = add.lname;
    var mail = add.mail;
    var mobile = add.mobile;


    sql = `update exel_format.exeltbl set fname='${fname}',lname='${lname}',mobile='${mobile}',mail='${mail}' where id = '${id}' ; `;
    let data = await getdata(sql)
    //    alert("record saved successfully...")
    res.redirect('/exel')

})

app.get('/add', async (req, res) => { //use for add new records

    const isToken = req.cookies.jwtToken;
    if (!isToken) {
        return res.send(`you are not authorized register first <a href="/">sign up</a>`);
    }
    var add = req.query
    console.log(add);

    var fname = add.fname;
    var lname = add.lname;
    var mail = add.mail;
    var mobile = add.mobile;
    sql = `insert into exel_format.exeltbl (fname,lname,mobile,mail) values ('${fname}','${lname}','${mobile}','${mail}'); `;
    let data = await getdata(sql)
    res.redirect('/exel')
})

app.get('/delete', async (req, res) => { // api for delete  single record

    const isToken = req.cookies.jwtToken;
    if (!isToken) {
        return res.send(`you are not authorized register first <a href="/">sign up</a>`);
    }
    var dlt = req.query
    console.log(dlt);
    var id = dlt.id;

    sql = `delete from exel_format.exeltbl where id = '${id}' ;`;
    let data = await getdata(sql)
    res.redirect('/exel')
})

app.post('/saveall', async (req, res) => { // api for save & update records

    const isToken = req.cookies.jwtToken;
    if (!isToken) {
        return res.send(`you are not authorized register first <a href="/">sign up</a>`);
    }

    var saveall = req.body

    console.log(saveall);
    var id = saveall.id;
    console.log(id);
    var fname = saveall.fname;
    var lname = saveall.lname;
    var mail = saveall.mail;
    var mobile = saveall.mobile;

    for (let i = 0; i < fname.length; i++) {
        if (id[i] == undefined) {
            sql = `insert into exel_format.exeltbl (fname,lname,mobile,mail) values ('${fname[i]}','${lname[i]}','${mobile[i]}','${mail[i]}'); `;
            let data = await getdata(sql)

        } else {
            sql = `update exel_format.exeltbl set fname='${fname[i]}',lname='${lname[i]}',mobile='${mobile[i]}',mail='${mail[i]}' where id = '${id[i]}' ; `;
            let data = await getdata(sql)
        }
    }
    res.redirect('/exel')
})






////****************************************login registration api****************************************




app.get("/job_app_form", function (req, res) {//getting the select box data from database

    const isToken = req.cookies.jwtToken;
    if (!isToken) {
        return res.send(`you are not authorized register first <a href="/">sign up</a>`);
    }

    let states = [];
    let status = [];
    let courses = [];
    let locations = [];
    let departments = [];
    let languages = [];
    let technologies = [];


    con.query(`select * from job_application_db.states_tbl;`, function (err, result1) {
        if (err) throw err;
        states = result1;
    });

    con.query(`select option_name from job_application_db.option_master where select_id = 3;`, function (err, result3) {
        if (err) throw err;
        courses = result3;
    });
    con.query(`select option_name from job_application_db.option_master where select_id = 4;`, function (err, result4) {
        if (err) throw err;
        languages = result4;
    });
    con.query(`select option_name from job_application_db.option_master where select_id = 5;`, function (err, result5) {
        if (err) throw err;
        technologies = result5;
    });
    con.query(`select option_name from job_application_db.option_master where select_id = 6;`, function (err, result6) {
        if (err) throw err;
        locations = result6;
    });
    con.query(`select option_name from job_application_db.option_master where select_id = 7;`, function (err, result7) {
        if (err) throw err;
        departments = result7;
    });
    con.query(`select option_name from job_application_db.option_master where select_id = 2;`, function (err, result2) {
        if (err) throw err;
        status = result2;
        res.render('editview', { states, status, courses, departments, locations, languages, technologies });

    });
})

app.post("/jobapp", (req, res) => {//insert user data in database

    const isToken = req.cookies.jwtToken;
    if (!isToken) {
        return res.send(`you are not authorized register first <a href="/">sign up</a>`);
    }
    var data
    // ****** Basic Details

    let fname = req.body.fname;
    let lname = req.body.lname;
    let city = req.body.city;
    let address = req.body.address;
    let pincode = req.body.pincode;
    let state = req.body.state;
    let num = req.body.num;
    let email = req.body.email;
    let gender = req.body.gender;
    let relationlist = req.body.relationlist;
    let dob = req.body.dob;
    let designation = req.body.designation;


    con.query(`INSERT INTO job_application_db.candidate_basic_info (fname, lname, address, city,zipcode, state, contact, email, gender, relationship_status, dob, disignation, createtime)values ('${fname}', '${lname}', '${address}', '${city}', '${pincode}', '${state}', '${num}', '${email}', '${gender}', '${relationlist}', '${dob}', '${designation}',now());`, function (err, result) {
        if (err) throw err;
        // console.log("record add successfully")
        let appid = result.insertId;
        console.log(city);

        // ****** tech Details

        let technologies = req.body.technologies || "";
        // console.log(technologies)
        for (let i = 0; i < technologies.length; i++) {
            console.log(technologies[i]) // return technologies 
            console.log(req.body[technologies[i]])// return the tech. expertise value according to the tech selected 
        }

        for (var i = 0; i < technologies.length; i++) {
            var sql = con.query(`INSERT INTO job_application_db.technologies_tbl (c_id,tech_name, tech_expertise)values ('${appid}','${technologies[i]}', '${req.body[technologies[i]]}');`, function (err, result2) {
                if (err) throw err;
            });
        }
        // console.log(sql)

        // ****** lang Details

        let read = req.body.read || "";
        let write = req.body.write || "";
        let speak = req.body.speak || "";

        console.log(read);//return all read selected languages array
        console.log(write);//return all wtite selected languages array
        console.log(speak);//return all speak selected languages array

        var languages = '';

        // if multiple lang. avilable then go to if condition

        if (typeof (req.body.languages) == 'object') {
            languages = `insert into job_application_db.languages_tbl(c_id, languages, lang_read, lang_write, lang_speak) values`;
            for (let i = 0; i < req.body.languages.length; i++) {
                languages += `('${appid}','${req.body.languages[i]}', '${read.includes(req.body.languages[i]) ? 'yes' : 'no'}', '${write.includes(req.body.languages[i]) ? 'yes' : 'no'}', '${speak.includes(req.body.languages[i]) ? 'yes' : 'no'}'),`;
            }
            languages = languages.slice(0, languages.length - 1);
        } else {
            languages = `insert into job_application_db.languages_tbl(c_id, languages, lang_read, lang_write, lang_speak) value('${appid}','${req.body.languages}', '${read == req.body.languages ? 'yes' : 'no'}', '${write == req.body.languages ? 'yes' : 'no'}', '${speak == req.body.languages ? 'yes' : 'no'} ')`;
        }

        con.query(languages, function (err, result6) {
            if (err) throw err;
            // console.log(languages)


        });
        // ****** experience Details

        let company = req.body.company;
        let designation2 = req.body.designation2;
        let startdte = req.body.startdte;
        let enddte = req.body.enddte;

        console.log(company)
        console.log(designation2)
        console.log(startdte)
        console.log(enddte)
        if (typeof (company, designation2, startdte, enddte) == 'string') {
            con.query(`INSERT INTO job_application_db.experience_tbl (c_id,company_name, designation, start_date, end_date)values ('${appid}','${company}', '${designation2}', '${startdte}', '${enddte}');`, function (err, result2) {
                if (err) throw err;
                // console.log("record add successfully")
            });
        } else {
            for (var i = 0; i < company.length; i++) {
                con.query(`INSERT INTO job_application_db.experience_tbl (c_id,company_name, designation, start_date, end_date)values ('${appid}','${company[i]}', '${designation2[i]}', '${startdte[i]}', '${enddte[i]}');`, function (err, result2) {
                    if (err) throw err;
                    // console.log("record add successfully")
                });
            }
        }
        // ****** education Details

        let courses = req.body.coursename;
        let univercity = req.body.univercity;
        let year = req.body.year;
        let percentage = req.body.percentage;

        if (typeof (courses, univercity, year, percentage) == 'string') {
            con.query(`INSERT INTO job_application_db.education_tbl (c_id,course_name, certification_from, year_completed, percentage)values ('${appid}','${courses}', '${univercity}', '${year}', '${percentage}');`, function (err, result2) {
                if (err) throw err;
                // console.log("record add successfully")
            });
        } else {
            for (var i = 0; i < courses.length; i++) {
                con.query(`INSERT INTO job_application_db.education_tbl (c_id,course_name, certification_from, year_completed, percentage)values ('${appid}','${courses[i]}', '${univercity[i]}', '${year[i]}', '${percentage[i]}');`, function (err, result2) {
                    if (err) throw err;
                    // console.log("record add successfully")
                });
            }
        }

        // ****** prefference Details

        let location = req.body.location;
        let department = req.body.department;
        let curctc = req.body.curctc;
        let expectctc = req.body.expectctc;

        con.query(`INSERT INTO job_application_db.prefference_tbl (c_id ,location, department, current_ctc, expected_ctc)values ('${appid}','${location}', '${department}', '${curctc}', '${expectctc}');`, function (err, result7) {
            if (err) throw err;
            // console.log("record add successfully")
        });
        // ****** reference Details

        let p1name = req.body.p1name;
        let p1relation = req.body.p1relation;
        let p1mobile = req.body.p1mobile;
        let p2name = req.body.p2name;
        let p2relation = req.body.p2relation;
        let p2mobile = req.body.p2mobile;

        con.query(`INSERT INTO job_application_db.refrences_tbl (c_id , name, relation, contact)values ('${appid}','${p1name}', '${p1relation}', '${p1mobile}'),('${appid}','${p2name}', '${p2relation}', '${p2mobile}');`, function (err, result6) {
            if (err) throw err;

            // console.log("record add successfully")
        });


        con.query(`select * from job_application_db.candidate_basic_info where raw is null and c_id = '${appid}' ; `, function (err, result1) {
            if (err) throw err;
            data = result1;
            // console.log(appid);

            res.render('editview1', { data });
        });


    })
});

app.get('/fetch', async(req, res) => {//fetch the city according to state

    const isToken = req.cookies.jwtToken;
    if (!isToken) {
        return res.send(`you are not authorized register first <a href="/">sign up</a>`);
    }

    const stateid = req.query.stateid;

    sql = `SELECT state_id FROM job_application_db.states_tbl where state_name= '${stateid}';`
    let data = await getdata(sql);
    var id = data[0].state_id;
    console.log(id);

   sql2 = `select * from job_application_db.cities_tbl where state_id = ${id};`
   let result = await getdata(sql2);
   res.send(result);


})

app.get("/edit", async (req, res) => {//select all user enter data from database

    const isToken = req.cookies.jwtToken;
    if (!isToken) {
        return res.send(`you are not authorized register first <a href="/">sign up</a>`);
    }
    var appid = req.query.id;

    //  console.log(appid)

    sql1 = `select * from job_application_db.candidate_basic_info where c_id = '${appid}' ; `;
    let om = await getdata(sql1);

    sql2 = `select * from job_application_db.education_tbl where c_id = '${appid}' ; `;
    let om1 = await getdata(sql2);

    sql3 = `select * from job_application_db.experience_tbl where c_id = '${appid}' ; `;
    let om2 = await getdata(sql3);

    sql5 = `select * from job_application_db.prefference_tbl where c_id = '${appid}' ; `;
    let om4 = await getdata(sql5);
    // console.log(om4)
    sql4 = `select * from job_application_db.languages_tbl where c_id = '${appid}' ; `;
    let om3 = await getdata(sql4);
    // console.log(om3)
    sql6 = `select * from job_application_db.refrences_tbl where c_id = '${appid}' ; `;
    let om5 = await getdata(sql6);
    // console.log(om5)

    sql7 = `select * from job_application_db.technologies_tbl where c_id = '${appid}' ; `;
    let om6 = await getdata(sql7);

    sql8 = `select * from job_application_db.states_tbl;`
    let states = await getdata(sql8);

    sql9 = `select option_name from job_application_db.option_master where select_id = '2'`
    let status = await getdata(sql9);

    sql10 = `select option_name from job_application_db.option_master where select_id = 3`
    let courses = await getdata(sql10);

    sql11 = `select option_name from job_application_db.option_master where select_id = 7;`
    let departments = await getdata(sql11);

    sql12 = `select option_name from job_application_db.option_master where select_id = 6;`
    let locations = await getdata(sql12);

    sql13 = `select option_name from job_application_db.option_master where select_id = 4  ;`
    let languages = await getdata(sql13);

    sql14 = `select option_name from job_application_db.option_master where select_id = 5;`
    let technologies = await getdata(sql14);

    console.log(technologies)
    console.log(om6)
    res.render('editview2', { om, om2, om1, om3, om4, om5, om6, states, status, courses, departments, locations, languages, technologies });
});

app.post("/update", async (req, res) => {//update the data and store in the database


    const isToken = req.cookies.jwtToken;
    if (!isToken) {
        return res.send(`you are not authorized register first <a href="/">sign up</a>`);
    }
    var appid = req.body.id;
    // console.log(appid)
    var update = req.body;
    console.log(update);

    var sql1 = `update job_application_db.candidate_basic_info set fname='${update.fname}',lname='${update.lname}',address='${update.address}',city='${update.city}',zipcode='${update.pincode}',state='${update.state}',contact='${update.num}',email='${update.email}',gender='${update.gender}',relationship_status='${update.relationlist}',dob='${update.dob}',disignation='${update.designation}',createtime=now() where c_id = '${appid}' ; `;

    let basicdetail = await getdata(sql1);
    // console.log(basicdetail)

    var academicid = []
    academicid = update.eid
    // console.log('aaa'+academicid)
    // console.log(update.coursename.length)

    for (let i = 0; i < update.coursename.length; i++) {

        if (typeof academicid[i] != 'undefined') {
            sql2 = `update job_application_db.education_tbl set course_name='${update.coursename[i]}',certification_from='${update.univercity[i]}',year_completed='${update.year[i]}',percentage='${update.percentage[i]}' where academic_id = '${academicid[i]}' ;`
            let education1 = await getdata(sql2);
            // console.log(education1)
        } else {
            sql3 = `INSERT INTO job_application_db.education_tbl (c_id,course_name, certification_from, year_completed, percentage)values ('${appid}','${update.coursename[i]}', '${update.univercity[i]}', '${update.year[i]}', '${update.percentage[i]}');`

            let education2 = await getdata(sql3);

            // console.log(education2)
        }

    }

    var experienceid = []
    experienceid = update.exid
    console.log('aaaex' + experienceid)
    // console.log(update.coursename.length)

    for (var i = 0; i < update.company.length; i++) {

        if (typeof experienceid[i] != 'undefined') {
            sql2 = `update  job_application_db.experience_tbl set company_name='${update.company[i]}',designation='${update.designation2[i]}',start_date='${update.startdte[i]}',end_date='${update.enddte[i]}' where exid = '${experienceid[i]}' ;`
            let experience1 = await getdata(sql2);
            console.log(experience1)
        } else {
            sql3 = `INSERT  job_application_db.experience_tbl (c_id,company_name, designation, start_date, end_date)values ('${appid}','${update.company[i]}', '${update.designation2[i]}', '${update.startdte[i]}', '${update.enddte[i]}');`

            let experience2 = await getdata(sql3);
        }
    }


    var referif, referif2
    referif = update.refid
    referif2 = update.refid2
    console.log('aaa' + referif)
    console.log('aaa' + referif2)

    sql2 = `update  job_application_db.refrences_tbl set name='${update.p1name}',relation='${update.p1relation}',contact='${update.p1mobile}' where refrences_id = '${referif}' ;`
    let refer1 = await getdata(sql2);
    console.log(refer1)

    sql3 = `update  job_application_db.refrences_tbl set name='${update.p2name}',relation='${update.p2relation}',contact='${update.p2mobile}'where refrences_id = '${referif2}' ;`
    let refer2 = await getdata(sql3);
    console.log(refer2)

    var prefid = update.prefid;

    sql2 = `update  job_application_db.prefference_tbl set location='${update.location}',department='${update.department}',current_ctc='${update.curctc}',expected_ctc='${update.expectctc}' where id = '${prefid}' ;`
    let pref = await getdata(sql2);
    console.log(pref)

    let read = req.body.read || "";
    let write = req.body.write || "";
    let speak = req.body.speak || "";

    sql2 = `DELETE FROM job_application_db.languages_tbl WHERE c_id = '${appid}' ;`
    let dltlang = await getdata(sql2);
    console.log(dltlang)

    var languages = '';
    if (typeof (req.body.languages) == 'object') {
        languages = `insert into job_application_db.languages_tbl(c_id, languages, lang_read, lang_write, lang_speak) values`;
        for (let i = 0; i < req.body.languages.length; i++) {
            languages += `('${appid}','${req.body.languages[i]}', '${read.includes(req.body.languages[i]) ? 'yes' : 'no'}', '${write.includes(req.body.languages[i]) ? 'yes' : 'no'}', '${speak.includes(req.body.languages[i]) ? 'yes' : 'no'}'),`;
        }
        languages = languages.slice(0, languages.length - 1);
        let lang1 = await getdata(languages);
    } else {
        languages = `insert into job_application_db.languages_tbl(c_id, languages, lang_read, lang_write, lang_speak) value('${appid}','${req.body.languages}', '${read == req.body.languages ? 'yes' : 'no'}', '${write == req.body.languages ? 'yes' : 'no'}', '${speak == req.body.languages ? 'yes' : 'no'} ')`;
        let lang1 = await getdata(languages);
    }


    sql2 = `DELETE FROM job_application_db.technologies_tbl WHERE c_id = '${appid}' ;`
    let dlttech = await getdata(sql2);
    console.log(dlttech)

    let technologies = req.body.technologies || "";

    for (let i = 0; i < technologies.length; i++) {
        console.log(req.body[technologies[i]])
    }

    for (var i = 0; i < technologies.length; i++) {
        var sql = `INSERT INTO job_application_db.technologies_tbl (c_id,tech_name, tech_expertise)values ('${appid}','${technologies[i]}', '${req.body[technologies[i]]}');`

        let tech1 = await getdata(sql);
    }

    res.render('editview3');
})



/////***********************************Sorting format****************************************



app.get("/sorting", (req, res) => {


    const isToken = req.cookies.jwtToken;
    if (!isToken) {
        return res.send(`you are not authorized register first <a href="/">sign up</a>`);
    }

    var data = [];

    let count;
    let page = req.query.num || 1;
    let curpage = parseInt(req.query.num);
    let limit = 25;
    let offset = (page - 1) * limit;

    let cur_order = req.query.curorder; //column name for order by
    let odrtype = req.query.odrtype; // ascending or decending type

    if (req.query.curorder) {
        cur_order = req.query.curorder;
        odrtype = req.query.odrtype;
    }
    else { // first time loding the url
        cur_order = 'id'
        curpage = 1;
        odrtype = 'ASC';
    }


    if (isNaN(offset)) {
        offset = 0;
    }

    con3.query(`select count(*) as numrows from student_express;`, function (err, res) {
        if (err) throw err;
        data[0] = res[0].numrows;
        console.log(data[0]);
        count = Math.ceil(data[0] / limit);

    });
    con3.query(`select * from student_express order by ${cur_order} ${odrtype} 
    limit ${offset},${limit} ; `, function (err, result1) {
        if (err) throw err;
        data[1] = result1;
        res.render('sorting', { data: data, count: count, curpage, cur_order, odrtype });
        console.log("record showed successfully");

    });

});




/////***********************************calc format****************************************



app.get('/calc', (req, res) => {
    const isToken = req.cookies.jwtToken;
    if (!isToken) {
        return res.send(`you are not authorized register first <a href="/">sign up</a>`);
    }
  res.render('calc')
})


/////***********************************Searching format****************************************


app.get("/searching", function (req, res) {// use for  select option value from database i.e. courses
    const isToken = req.cookies.jwtToken;
    if (!isToken) {
        return res.send(`you are not authorized register first <a href="/">sign up</a>`);
    }

    let states = [];
    let status = [];
    let courses = [];
    let locations = [];
    let departments = [];
    let languages = [];
    let technologies = [];


    con.query(`select * from job_application_db.states_tbl;`, function (err, result1) {
        if (err) throw err;
        states = result1;
    });

    con.query(`select option_name from job_application_db.option_master where select_id = 3;`, function (err, result3) {
        if (err) throw err;
        courses = result3;
    });
    con.query(`select option_name from job_application_db.option_master where select_id = 4;`, function (err, result4) {
        if (err) throw err;
        languages = result4;
    });
    con.query(`select option_name from job_application_db.option_master where select_id = 5;`, function (err, result5) {
        if (err) throw err;
        technologies = result5;
    });
    con.query(`select option_name from job_application_db.option_master where select_id = 6;`, function (err, result6) {
        if (err) throw err;
        locations = result6;
    });
    con.query(`select option_name from job_application_db.option_master where select_id = 7;`, function (err, result7) {
        if (err) throw err;
        departments = result7;
    });
    con.query(`select option_name from job_application_db.option_master where select_id = 2;`, function (err, result2) {
        if (err) throw err;
        status = result2;
        res.render('registrationform1', { states, status, courses, departments, locations, languages, technologies });

    });
})

app.post("/", (req, res) => {// api for show the form to the user

    const isToken = req.cookies.jwtToken;
    if (!isToken) {
        return res.send(`you are not authorized register first <a href="/">sign up</a>`);
    }

    // ****** Basic Details

    let fname = req.body.fname;
    let lname = req.body.lname;
    let city = req.body.city;
    let address = req.body.address;
    let pincode = req.body.pincode;
    let state = req.body.state;
    let num = req.body.num;
    let email = req.body.email;
    let gender = req.body.gender;
    let relationlist = req.body.relationlist;
    let dob = req.body.dob;
    let designation = req.body.designation;


    con.query(`INSERT INTO job_application_db.candidate_basic_info (fname, lname, address, city,zipcode, state, contact, email, gender, relationship_status, dob, disignation, createtime)values ('${fname}', '${lname}', '${address}', '${city}', '${pincode}', '${state}', '${num}', '${email}', '${gender}', '${relationlist}', '${dob}', '${designation}',now());`, function (err, result) {
        if (err) throw err;
        // console.log("record add successfully")
        let appid = result.insertId;
        console.log(city);

        // ****** tech Details

        let technologies = req.body.technologies || "";
        // console.log(technologies)
        for (let i = 0; i < technologies.length; i++) {
            console.log(req.body[technologies[i]])
        }

        for (var i = 0; i < technologies.length; i++) {
            var sql = con.query(`INSERT INTO job_application_db.technologies_tbl (c_id,tech_name, tech_expertise)values ('${appid}','${technologies[i]}', '${req.body[technologies[i]]}');`, function (err, result2) {
                if (err) throw err;
            });
        }
        // console.log(sql)

        // ****** lang Details

        let read = req.body.read || "";
        let write = req.body.write || "";
        let speak = req.body.speak || "";

        var languages = '';
        if (typeof (req.body.languages) == 'object') {
            languages = `insert into job_application_db.languages_tbl(c_id, languages, lang_read, lang_write, lang_speak) values`;
            for (let i = 0; i < req.body.languages.length; i++) {
                languages += `('${appid}','${req.body.languages[i]}', '${read.includes(req.body.languages[i]) ? 'yes' : 'no'}', '${write.includes(req.body.languages[i]) ? 'yes' : 'no'}', '${speak.includes(req.body.languages[i]) ? 'yes' : 'no'}'),`;
            }
            languages = languages.slice(0, languages.length - 1);
        } else {
            languages = `insert into job_application_db.languages_tbl(c_id, languages, lang_read, lang_write, lang_speak) value('${appid}','${req.body.languages}', '${read == req.body.languages ? 'yes' : 'no'}', '${write == req.body.languages ? 'yes' : 'no'}', '${speak == req.body.languages ? 'yes' : 'no'} ')`;
        }

        con.query(languages, function (err, result6) {
            if (err) throw err;
            // console.log(languages)


        });
        // ****** experience Details

        let company = req.body.company;
        let designation2 = req.body.designation2;
        let startdte = req.body.startdte;
        let enddte = req.body.enddte;

        if (typeof (company, designation2, startdte, enddte) == 'string') {
            con.query(`INSERT INTO job_application_db.experience_tbl (c_id,company_name, designation, start_date, end_date)values ('${appid}','${company}', '${designation2}', '${startdte}', '${enddte}');`, function (err, result2) {
                if (err) throw err;
                // console.log("record add successfully")
            });
        } else {
            for (var i = 0; i < company.length; i++) {
                con.query(`INSERT INTO job_application_db.experience_tbl (c_id,company_name, designation, start_date, end_date)values ('${appid}','${company[i]}', '${designation2[i]}', '${startdte[i]}', '${enddte[i]}');`, function (err, result2) {
                    if (err) throw err;
                    // console.log("record add successfully")
                });
            }
        }
        // ****** education Details

        let courses = req.body.coursename;
        let univercity = req.body.univercity;
        let year = req.body.year;
        let percentage = req.body.percentage;

        if (typeof (courses, univercity, year, percentage) == 'string') {
            con.query(`INSERT INTO job_application_db.education_tbl (c_id,course_name, certification_from, year_completed, percentage)values ('${appid}','${courses}', '${univercity}', '${year}', '${percentage}');`, function (err, result2) {
                if (err) throw err;
                // console.log("record add successfully")
            });
        } else {
            for (var i = 0; i < courses.length; i++) {
                con.query(`INSERT INTO job_application_db.education_tbl (c_id,course_name, certification_from, year_completed, percentage)values ('${appid}','${courses[i]}', '${univercity[i]}', '${year[i]}', '${percentage[i]}');`, function (err, result2) {
                    if (err) throw err;
                    // console.log("record add successfully")
                });
            }
        }

        // ****** prefference Details

        let location = req.body.location;
        let department = req.body.department;
        let curctc = req.body.curctc;
        let expectctc = req.body.expectctc;

        con.query(`INSERT INTO job_application_db.prefference_tbl (c_id ,location, department, current_ctc, expected_ctc)values ('${appid}','${location}', '${department}', '${curctc}', '${expectctc}');`, function (err, result7) {
            if (err) throw err;
            // console.log("record add successfully")
        });
        // ****** reference Details

        let p1name = req.body.p1name;
        let p1relation = req.body.p1relation;
        let p1mobile = req.body.p1mobile;
        let p2name = req.body.p2name;
        let p2relation = req.body.p2relation;
        let p2mobile = req.body.p2mobile;

        con.query(`INSERT INTO job_application_db.refrences_tbl (c_id , name, relation, contact)values ('${appid}','${p1name}', '${p1relation}', '${p1mobile}'),('${appid}','${p2name}', '${p2relation}', '${p2mobile}');`, function (err, result6) {
            if (err) throw err;

            // console.log("record add successfully")
        });


    })
    con.query(`select * from job_application_db.candidate_basic_info where raw is not null ; `, function (err, result1) {
        if (err) throw err;
        var data = result1;
        res.render('registrationformsearch1', { data: data });

    });
});

app.get("/search", (req, res) => {// api for search the data  using delimeters

    const isToken = req.cookies.jwtToken;
    if (!isToken) {
        return res.send(`you are not authorized register first <a href="/">sign up</a>`);
    }
    var search = req.query.text
    var multi = req.query.multi
    // console.log("multi :- " + multi)
    var arr = [], arr2 = [], arr3 = []
    var fname, lname, email, contact, dob, address, city, zipcode, state, gender, relationship_status, cretetime

    for (var i = 0; i < search.length; i++) {
        if (search[i] == '*' || search[i] == '^' || search[i] == '@' || search[i] == '#' ||
            search[i] == '$' || search[i] == '~' || search[i] == '!' || search[i] == '_' ||
            search[i] == '?' || search[i] == '+' || search[i] == '%' || search[i] == '-') {
            arr.push(i) //pushing the index of delimeters
            arr3.push(search[i])//pushing the delimeters
            // console.log(arr)
            // console.log(arr3)
        }
    }
    // console.log("String :- " + search)
    // console.log("array :- " + arr)

    for (var i = 0; i < arr.length; i++) {
        arr2.push(search.substring(arr[i] + 1, arr[i + 1]))
        // console.log(arr2)
    }

    // console.log(arr2)
    var sql = `select * from job_application_db.candidate_basic_info where `
    if (multi == 'and') {
        // console.log(arr2)
        for (var i = 0; i < arr3.length; i++) {
            if (arr3[i] == '*') {
                fname = arr2[i]
                sql += `fname="${fname.trim()}" and `
            }
            else if (arr3[i] == '^') {
                lname = arr2[i]
                sql += `lname="${lname.trim()}" and `
            }
            else if (arr3[i] == '@') {
                address = arr2[i]
                sql += `address="${address.trim()}" and `
            }
            else if (arr3[i] == '#') {
                city = arr2[i]
                sql += `city="${city.trim()}" and `
            }
            else if (arr3[i] == '$') {
                zipcode = arr2[i]
                sql += `zipcode="${zipcode.trim()}" and `
            }
            else if (arr3[i] == '~') {
                state = arr2[i]
                sql += `state="${state.trim()}" and `
            }
            else if (arr3[i] == '!') {
                contact = arr2[i]
                sql += `contact="${contact.trim()}" and `
            }
            else if (arr3[i] == '_') {
                email = arr2[i]
                sql += `email="${email.trim()}" and `
            }
            else if (arr3[i] == '?') {
                gender = arr2[i]
                sql += `gender="${gender.trim()}" and `
            }
            else if (arr3[i] == '+') {
                relationship_status = arr2[i]
                sql += `relationship_status="${relationship_status.trim()}" and `
            }
            else if (arr3[i] == '%') {
                dob = arr2[i]
                sql += `dob="${dob.trim()}" and `
            }
            else if (arr3[i] == '-') {
                cretetime = arr2[i]
                sql += `cretetime="${cretetime.trim()}" and `
            }
        }
        sql = sql.slice(0, (sql.length - 5))
    } else {

        for (var i = 0; i < arr3.length; i++) {
            if (arr3[i] == '*') {
                fname = arr2[i]
                sql += `fname="${fname.trim()}" or `
            }
            else if (arr3[i] == '^') {
                lname = arr2[i]
                sql += `lname="${lname.trim()}" or `
            }
            else if (arr3[i] == '@') {
                address = arr2[i]
                sql += `address="${address.trim()}" or `
            }
            else if (arr3[i] == '#') {
                city = arr2[i]
                sql += `city="${city.trim()}" or `
            }
            else if (arr3[i] == '$') {
                zipcode = arr2[i]
                sql += `zipcode="${zipcode.trim()}" or `
            }
            else if (arr3[i] == '~') {
                state = arr2[i]
                sql += `state="${state.trim()}" or `
            }
            else if (arr3[i] == '!') {
                contact = arr2[i]
                sql += `contact="${contact.trim()}" or `
            }
            else if (arr3[i] == '_') {
                email = arr2[i]
                sql += `email="${email.trim()}" or `
            }
            else if (arr3[i] == '?') {
                gender = arr2[i]
                sql += `gender="${gender.trim()}" or `
            }
            else if (arr3[i] == '+') {
                relationship_status = arr2[i]
                sql += `relationship_status="${relationship_status.trim()}" or `
            }
            else if (arr3[i] == '%') {
                dob = arr2[i]
                sql += `dob="${dob.trim()}" or `
            }
            else if (arr3[i] == '-') {
                cretetime = arr2[i]
                sql += `cretetime="${cretetime.trim()}" or `
            }
        }
        sql = sql.slice(0, (sql.length - 3))

    }
    con.query(sql, (err, result3) => {
        if (err) throw err;
        console.log(result3)
        res.render('registrationformsearch1', { data: result3, multi })
    })
})

app.get('/fetch2', (req, res) => {// use for fetch cities according to the change the cities
    const isToken = req.cookies.jwtToken;
    if (!isToken) {
        return res.send(`you are not authorized register first <a href="/">sign up</a>`);
    }
    const stateid = req.query.stateid;
    console.log(stateid);
    con.query(`select * from job_application_db.cities_tbl where state_id = '${stateid}';`, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
})

app.get('/delete', (req, res) => { // use for delete records

    const isToken = req.cookies.jwtToken;
    if (!isToken) {
        return res.send(`you are not authorized register first <a href="/">sign up</a>`);
    }
    var id = req.query.deleteid;
    console.log(id);
    con.query(`UPDATE candidate_basic_info SET raw = '1' WHERE c_id ='${id}';`, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
})

app.post('/deleteall', (req, res) => {// use for multiple delete

    const isToken = req.cookies.jwtToken;
    if (!isToken) {
        return res.send(`you are not authorized register first <a href="/">sign up</a>`);
    }
    console.log(req.body)
    var id = req.query.d_id;
    console.log(id);
    con.query(`UPDATE candidate_basic_info SET raw = '1' WHERE c_id in (${id});`, function (err, result) {
        if (err) throw err;

    }); res.json({ ans: "delete successfully" });
})