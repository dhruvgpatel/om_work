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
    database: 'exel_format'
});

con.connect((err) => {
    if (err) throw err;
    console.log('connected')

}); app.listen(9091);

app.get('/',async(req,res)=>{
  sql = `SELECT * FROM exel_format.exeltbl;`
  let data = await getdata(sql)
  res.render('exel', {data});
})


    app.get('/save',async(req,res)=>{
        var add = req.query

        console.log(add);
        var id = add.id;
        var fname = add.fname;
        var lname = add.lname;
        var mail = add.mail;
        var mobile = add.mobile;
        

    sql = `update exel_format.exeltbl set fname='${fname}',lname='${lname}',mobile='${mobile}',mail='${mail}' where id = '${id}' ; `;
        let data = await getdata(sql)
       
      })
       

app.get('/add',async(req,res)=>{
    var add = req.query
    console.log(add);
   
    var fname = add.fname;
    var lname = add.lname;
    var mail = add.mail;
    var mobile = add.mobile;
    sql = `insert into exel_format.exeltbl (fname,lname,mobile,mail) values ('${fname}','${lname}','${mobile}','${mail}'); `;
    let data = await getdata(sql)
    lastid=data.insertId;
    res.send({lastid});
    console.log(data);

    console.log(data.insertId);
  })
   
  app.post('/saveall',async(req,res)=>{
    var saveall = req.body

    console.log(saveall);
    var id = saveall.id;
    console.log(id);
    var fname = saveall.fname;
    var lname = saveall.lname;
    var mail = saveall.mail;
    var mobile = saveall.mobile;
    
    for (let i = 1; i < id.length; i++) {
        if(id[i] != 'abc'){

            sql = `update exel_format.exeltbl set fname='${fname[i]}',lname='${lname[i]}',mobile='${mobile[i]}',mail='${mail[i]}' where id = '${id[i]}' ; `;
                let data = await getdata(sql)
            
        }else{
            sql = `insert into exel_format.exeltbl (fname,lname,mobile,mail) values ('${fname[i]}','${lname[i]}','${mobile[i]}','${mail[i]}'); `;
            let data = await getdata(sql)
        }
    }
   
  })


async function getdata(sql) {
    return new Promise((res, rej) => {
        con.query(sql, (err, data) => {
            if (err) throw err;
            res(data);
        })
    })
}

