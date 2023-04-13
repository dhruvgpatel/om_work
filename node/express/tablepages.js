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

});
app.get("/", (req, res) => {
    // let page = req.params.page || 1;
    // let limit = 10;
    // let offset = (page - 1) * limit;
    var data = [];
    con.query(`select * from student_express limit 0,10;`, function (err, result0) {
        if (err) throw err; 
        data[0] = result0;
    });
    con.query(`select * from student_express limit 10,10;`, function (err, result1) {
        if (err) throw err;
        data[1] = result1;
    });
    con.query(`select * from student_express limit 20,10;`, function (err, result2) {
        if (err) throw err;
        data[2] = result2;
    });
    con.query(`select * from student_express limit 30,10;`, function (err, result3) {
        if (err) throw err;
        data[3] = result3;
    });
    con.query(`select * from student_express limit 40,10;`, function (err, result4) {
        if (err) throw err;
        data[4] = result4;
    });
    con.query(`select * from student_express limit 50,10;`, function (err, result5) {
        if (err) throw err;
        data[5] = result5;
    });
    con.query(`select * from student_express limit 60,10;`, function (err, result6) {
        if (err) throw err;
        data[6] = result6;
        res.render('tablepages',{data});
    });
});app.listen(4086);








// app.get("/x", (req, res) => {
//     con.query("select * from student_express limit 10,10;", function (err, result) {
//         if (err) throw err;
//         // res.send(result);
//         res.render('x', { data: result });
//     });
// }); 
    // con.query("select * from student_express limit 10,10;", function (err, result1) {
    //     if (err) throw err;
    //     // res.send(result);
    //     res.render('hello', { data: result1 });
        
        
    // });
    // con.query("select * from student_express limit 20,10;", function (err, result) {
    //     if (err) throw err;
    //     // res.send(result);
    //     res.render('hello', { data2: result });
        
        
    // });
    



// app.get("/", function (req, res) {
//     con.query("select * from student_express limit 10,10;", function (err, result1) {
//         if (err) throw err;
//         res.render('hello', { data1: result1 });
//         
//     });
// }); app.listen(4085);
// app.get('/hello',function(req,res){
//     var name = ['om','milan','vijay','khushi'];
//     res.render('hello',{name})
// })
// app.listen(7373);
