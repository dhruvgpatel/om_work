
// function f(string,star){
     
//     var string = string.split(star);
//     console.log(string);
// }
// var string = "my*name*is*om*modi";
// var star = '*';
// f(string,star);

// let date_ob = new Date();

// // current date
// // adjust 0 before single digit date
// let date = ("0" + date_ob.getDate()).slice(-2);

// // current month
// let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// // current year
// let year = date_ob.getFullYear();

// // current hours
// let hours = date_ob.getHours();

// // current minutes
// let minutes = date_ob.getMinutes();

// // current seconds
// let seconds = date_ob.getSeconds();

// // prints date in YYYY-MM-DD format
// console.log(date+'/'+month+'/'+year);

// // prints date & time in YYYY-MM-DD HH:MM:SS format
// console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

// // prints time in HH:MM format
// console.log(hours + ":" + minutes);



//     const x = date_ob.getDate() + 10;
//     console.log(x)
//  var cal = require('node-calendar');

// //  var leap = cal.leapdays(1985,2023);

// //  console.log(`leap year is : ${leap}`);

// var x = cal.weekday(2023,2,6)
// console.log(xconst prompt = require('prompt-sync')();

// const prompt = require('prompt-sync')();
// const value = prompt('enter last number ');

// console.log(`even numbers between 0 to ${value} is :`);
// for(i=0; i<=value; i++){
    
//   if(i % 2 == 0){
   
//     console.log(i);
//   }
// }

// console.log(`odd numbers between 0 to ${value} is :`);
// for(i=0; i<=value; i++){
    
//   if(i % 2 == 1){
   
//     console.log(i);
//   }
// }

// console.log(`prime numbers between 0 to ${value} is :`);

// for (let i = 0; i <= value; i++) {
//   let flag = 0;

  
//   for (let j = 2; j < i; j++) {
//       if (i % j == 0) {
//           flag = 1;
//           break;
//       }
//   }

//   if (i > 1 && flag == 0) {
//       console.log(i);
//   }
// }

// console.log(`fibonnaci numbers between 0 to ${value} is :`);
// let n1 = 0, n2 = 1, nextTerm;

// // console.log('Fibonacci Series:');

// for (let i = 1; i <= value; i++) {
//     console.log(n1);
//     nextTerm = n1 + n2;
//     n1 = n2;
//     n2 = nextTerm;
// }
console.log(`fibonnaci numbers between 0 to ${value} is :`);
let n1 = 0, n2 = 1, nextTerm;

console.log('Fibonacci Series:');

for (let i = 1; i <= value; i++) {
    console.log(n1);
    nextTerm = n1 + n2;
    n1 = n2;
    n2 = nextTerm;
}


// var text = "hello, My NAme is OM MOdI whats App";
// console.log(text);
// var x = text.toLowerCase();
// console.log(x);
// var w = text.toUpperCase();
// console.log(w);
