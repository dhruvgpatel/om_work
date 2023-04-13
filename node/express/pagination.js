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

});app.listen(8080);
app.get("/:page", (req, res) => {
    var data = [];
   let count;
    let page = req.params.page || 1;
    let curpage = parseInt(req.params.page);
    let limit = 25;
    let offset = (page - 1) * limit;

    if (isNaN(offset)) {
        offset = 0;
    }
    
    con.query(`select count(*) as numrows from student_express;`, function (err, res) {
        if (err) throw err;
        data[0] = res[0].numrows;
        console.log(data[0])
        count = Math.ceil(data[0]/limit);
       console.log(count);

    });
    con.query(`select * from studentdb.student_express limit ${offset},${limit};`, function (err, result1) {
        if (err) throw err;
        data[1] = result1;
        res.render('pagination', {data:data, count:count,curpage});
        console.log("record showed successfully");

    });

}); 