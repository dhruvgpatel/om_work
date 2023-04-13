var express = require('express');
var app = express();
app.set('view engine', 'ejs'); //for using ejs
var mysql = require('mysql2');

var con = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: 'root',
    database: 'studentdb'
});

con.connect((err) => {
    if (err) throw err;
    console.log('connected')

}); app.listen(8095);
app.get("/searching", (req, res) => {
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

    con.query(`select count(*) as numrows from student_express;`, function (err, res) {
        if (err) throw err;
        data[0] = res[0].numrows;
        console.log(data[0]);
        count = Math.ceil(data[0] / limit);

    });
    con.query(`select * from student_express order by ${cur_order} ${odrtype} 
    limit ${offset},${limit} ; `, function (err, result1) {
        if (err) throw err;
        data[1] = result1;
        res.render('searching', { data: data, count: count, curpage, cur_order, odrtype });
        //     console.log("record showed successfully");

    });



});

app.get("/search", (req, res) => {
    var search = req.query.text
    var multi = req.query.multi
    console.log("multi :- " + multi)
    var arr = [], arr2 = [], arr3 = []
    var fname, lname, mail, mobile, dob

    for (var i = 0; i < search.length; i++) {
        if (search[i] == '*' || search[i] == '^' || search[i] == '_' || search[i] == '!' ||
            search[i] == '%') {
            arr.push(i) //pushing the index of delimeters
            arr3.push(search[i])//pushing the delimeters
            console.log(arr)
            console.log(arr3)
        }
    }
    console.log("String :- " + search)
    console.log("array :- " + arr)

    for (var i = 0; i < arr.length; i++) {
        arr2.push(search.substring(arr[i] + 1, arr[i + 1]))
        console.log(arr2)
    }

    // console.log(arr2)
    var sql = `select * from student_express where `
    if (multi == 'and') {
        console.log(arr2)
        for (var i = 0; i < arr3.length; i++) {
            if (arr3[i] == '*') {
                fname = arr2[i]
                sql += `fname="${fname.trim()}" and `
            }
            else if (arr3[i] == '^') {
                lname = arr2[i]
                sql += `lname="${lname.trim()}" and `
            }
            else if (arr3[i] == '_') {
                mail = arr2[i]
                sql += `mail="${mail.trim()}" and `
            }
            else if (arr3[i] == '!') {
                mobile = arr2[i]
                sql += `mobile="${mobile.trim()}" and `
            }
            else if (arr3[i] == '%') {
                dob = arr2[i]
                sql += `dob="${dob.trim()}" and `
            }
        }
        sql = sql.slice(0, (sql.length - 5))
    } else {
        // console.log(arr2)
        for (var i = 0; i < arr3.length; i++) {
            if (arr3[i] == '*') {
                fname = arr2[i]
                sql += `fname="${fname.trim()}" or `
            }
            else if (arr3[i] == '^') {
                lname = arr2[i]
                sql += `lname="${lname.trim()}" or `
            }
            else if (arr3[i] == '_') {
                mail = arr2[i]
                sql += `mail="${mail.trim()}" or `
            }
            else if (arr3[i] == '!') {
                mobile = arr2[i]
                sql += `mobile="${mobile.trim()}" or `
            }
            else if (arr3[i] == '%') {
                dob = arr2[i]
                sql += `dob="${dob.trim()}" or `
            }
        }
        sql = sql.slice(0, (sql.length - 3))

    }
        con.query(sql, (err, result3) => {
            if (err) throw err;
            console.log(result3)
            res.render('searching', { data: result3 , multi })
        })
    })


