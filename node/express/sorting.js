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
app.get("/sorting", (req, res) => {
    var data = [];
   let count;
    let page = req.query.num || 1;
    let curpage = parseInt(req.query.num);
    let limit = 25;
    let offset = (page - 1) * limit;

    let cur_order = req.query.curorder; //column name for order by
    let odrtype = req.query.odrtype; // ascending or decending type

    if (req.query.curorder){ 
        cur_order = req.query.curorder;
        odrtype = req.query.odrtype;
    }
    else{ // first time loding the url
        cur_order='id'
        curpage =1;
        odrtype = 'ASC';
    }


    if (isNaN(offset)) {
        offset = 0;
    }
    
    con.query(`select count(*) as numrows from student_express;`, function (err, res) {
        if (err) throw err;
        data[0] = res[0].numrows;
        console.log(data[0]);
        count = Math.ceil(data[0]/limit);
       
    });
    con.query(`select * from student_express order by ${cur_order} ${odrtype} 
    limit ${offset},${limit} ; `, function (err, result1) {
        if (err) throw err;
        data[1] = result1;
        res.render('sorting', {data:data, count:count,curpage,cur_order,odrtype});
        console.log("record showed successfully");

    });

}); app.listen(8080);