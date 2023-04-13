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
    console.log('connected 9002')

}); app.listen(9002);

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
        res.render('registrationpagination2', { states, status, courses, departments, locations, languages, technologies });

    });
})

app.post("/page", (req, res) => {


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
    // con.query(`select * from job_application_db.candidate_basic_info where raw is null ; `, function (err, result1) {
    //     if (err) throw err;
    //     var data = result1;
    //     res.render('registrationpaginationsearch2', { data: data });

    // });
});

app.get("/search", (req, res) => {
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
        res.render('registrationpaginationsearch2', { data: result3, multi })
    })
})

app.get('/fetch',(req,res)=>{
    const stateid = req.query.stateid;
    console.log(stateid);
    con.query(`select * from job_application_db.cities_tbl where state_id = '${stateid}';`, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
})

app.get('/delete',(req,res)=>{
    var id  = req.query.deleteid;
    console.log(id);
    con.query(`UPDATE candidate_basic_info SET raw = '1' WHERE c_id ='${id}';`, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
})

app.post('/deleteall',(req,res)=>{
    console.log(req.body)
    var id  = req.query.d_id;
    console.log(id);
    con.query(`UPDATE candidate_basic_info SET raw = '1' WHERE c_id in (${id});`, function (err, result) {
        if (err) throw err;
       
    }); res.json({ans: "delete successfully"});
})

app.get("/page", (req, res) => {

    let page = req.query.num || 1;
    let curpage = parseInt(req.query.num);
    let limit = 5;
    let offset = (page - 1) * limit;
    let ajax = req.query.ajax || 'false';


    var sql = `select * from job_application_db.candidate_basic_info where raw is null limit ${offset},${limit}; `
    var sql2 = `select count(*) as numrows from job_application_db.candidate_basic_info where raw is null ;`
    con.query(sql, function (err, data) {
        if (err) throw err;
        console.log(sql)
        console.log(sql2)
        con.query(sql2, function (err, result) {
            if (err) throw err;

            let totatpages = Math.ceil(result[0].numrows / limit);
            let count = []
            for (let i = 0; i < totatpages; i++) {
                count.push(i)

            }
            if (ajax == 'false') {
                res.render('registrationpaginationsearch2', { data, curpage, count });
            } else {
                console.log(data)
                res.json(data)
            }
        });

    });

});
