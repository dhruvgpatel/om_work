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
    console.log('connected 9003')

}); app.listen(9003);

app.get("/", function (req, res) {

    
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
        res.render('demo', { states, status, courses, departments, locations, languages, technologies });
        
    });
})

app.post("/", (req, res) => {
    
    console.log(req.body)
    
    // ****** Basic Details

    let fname = req.body.fname;
    let lname = req.body.lname;
    let city = req.body.city;
    let address = req.body.address;
    let pincode = req.body.pincode;
    let state = req.body.state;
    console.log(state);
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

        let technologies = req.body.technologies|| "";
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
    con.query(`select * from job_application_db.candidate_basic_info where raw is null ; `, function (err, result1) {
        if (err) throw err;
        var data = result1;
        res.render('registrationformsearch1', { data: data });

    });
});


app.get('/fetch2',(req,res)=>{
    const stateid = req.query.stateid;
    console.log(stateid);
    con.query(`select * from job_application_db.cities_tbl where state_id = '${stateid}';`, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
})



