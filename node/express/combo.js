const body = require('body-parser');
var express = require('express');
var app = express();
app.set('view engine', 'ejs'); //for using ejs
var mysql = require('mysql2');
const { resolve } = require('promise');
app.use(body.urlencoded({ extended: false }))

var con = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: 'root',
    database: 'combo'
});

con.connect((err) => {
    if (err) throw err;
    console.log('connected')

}); app.listen(9003);

var clmname = [];
con.query(`select combo_name from combo.select_master;`, (err,res)=>{
    if (err) throw err;
    clmname = res
console.log(clmname);


})


app.get('/',async(req,res)=>{
        for (let i = 0; i < clmname.length; i++) {
        
                createDynamicSelectBox(clmname[i].combo_name);
            }
   
    var subject = await createDynamicSelectBox('subject');
    var state = await createDynamicSelectBox('state');
    var status = await createDynamicSelectBox('status');
    var course = await createDynamicSelectBox('course');
    var language = await createDynamicSelectBox('language');
    var technology = await createDynamicSelectBox('technology');
    var location = await createDynamicSelectBox('location');
    var department = await createDynamicSelectBox('department');
    var gender = await createDynamicSelectBox('gender');
    var university = await createDynamicSelectBox('university');
    res.render('combo',{state,subject,status,course,language,technology,location,department,gender,university});
})


async function createDynamicSelectBox(clmname) {
    
    var comboname = clmname;
    
    var sql = `SELECT option_name,option_id FROM option_master join select_master ON select_master.id=option_master.select_id where select_master.combo_name = '${comboname}'; `
var data = await getdata(sql);

console.log('jhijho',data);

var str = '';

str += `<select id='${comboname}' name='${comboname}'>`;
str += `<option disabled selected>select ${comboname}</option>`
for (let i = 0; i < data.length; i++) {
    str += `<option value='${data[i].option_id}'> ${data[i].option_name} </option>`
    
}
str +=`</select>`
return str;

  }
  function getdata(sql){
      return new Promise((resolve,reject)=>{
        con.query(sql,(err,result)=>{
            if (err) throw err;
            resolve(result)
        })
    })
}