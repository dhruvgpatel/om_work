const body = require('body-parser');
var express = require('express');
var app = express();
app.set('view engine', 'ejs'); //for using ejs
var mysql = require('mysql2');
app.use(body.urlencoded({ extended: false }))

var con = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: 'root',
    database: 'job_application_db'
});

con.connect((err) => {
    if (err) throw err;
    console.log('connected')

}); app.listen(8080);

app.get("/job_app_form", function (req, res) {//getting the select box data from database

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

app.get('/fetch', (req, res) => {//fetch the city according to state
    const stateid = req.query.stateid;
    console.log('hooo'+stateid);
    con.query(`SELECT state_id FROM job_application_db.states_tbl where state_name= '${stateid}';`, function (err, result1) {
        if (err) throw err;
        var id = result1[0].state_id
        console.log(id)
        con.query(`select * from job_application_db.cities_tbl where state_id = '${id}';`, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    });
})

app.get("/edit", async (req, res) => {//select all user enter data from database
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

    res.render('editview3') ;
})

async function getdata(sql) {//for run sql query
    return new Promise((res, rej) => {
        con.query(sql, (err, data) => {
            if (err) throw err;
            res(data);
        })
    })
}


