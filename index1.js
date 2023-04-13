// const fs = require("fs");
// 
// fs.writeFileSync("indext.txt",'hello node js');
// // fs.writeFileSync("indext.txt", 'my name is om modi');

// const fs = require('fs');
// fs.appendFileSync("indext.txt", ' hello js how r u' ); // use for append data (write) in text file 

// console.log(fs.readFileSync("indext.txt")); // store date in form of buffer retrive data in buffer format
// {/* <Buffer 68 65 6c 6c 6f 20 6e 6f 64 65 20 6a 73 68 65 6c 6c 6f 20 6a 73 20 68 6f 77 20 72 20 75 20 68 65 6c 6c 6f 20 6a 73 20 68 6f 77 20 72 20 75 0a 31 36 35 ... 50 more bytes> */}

// convert buffer data in to string
// const bufdata = fs.readFileSync("indext.txt");
// originaldata = bufdata.toString();
// console.log(originaldata);
// ***o/p***// hello node jshello js how r u hello js how r u
// 1654
// 4465
// 5468
// 65464
// 6465
// 546846
// 164 hello js how r u
// const bufdata = fs.readFileSync("indext.txt", "utf-8");
// console.log(bufdata) //without use of to string function read file 

//create file 
// fs.mkdirSync("om");

// create new rtext file 
// fs.writeFileSync('om/crud.txt', "if this file is not create already then create yhe file first then enter this sentence");

// now add the data without changing the txt data
// fs.appendFileSync("om/crud.txt","hello this is crud opp. we append the data using append ")

//  now malke the file then delete it
// fs.mkdirSync("x");

// delete the folder
// fs.rmdirSync('x');

// fs.open('indext.txt');