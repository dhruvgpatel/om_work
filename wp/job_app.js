function fun() {

}
let count1 = 1;
function func1()
{
   
   let html1 = '<div id="div1">\
 <tr>\
     <td><label> Education Courses:</label></td>\
     <td><select id="courselist'+count1+ '" name="courselist1">\
             <option value=""> Choose any one</option>\
             <option value="10th">10th</option>\
             <option value="12th">12th</option>\
             <option value="be">BE</option>\
             <option value="me">ME</option>\
         </select>\
     </td>\
     <td><label>Institution Name:</label></td>\
     <td><input type="text" name="institute'+count1+ '" class="width"> <br> <span id="institute'+count1+'" class="bold"></span></td>\
 </tr>\
 <tr>\
     <td><label>Passing Year:</label></td>\
     <td><input type="text" name="year'+count1+'" class="width"> <br> <span id="year'+count1+'" class="bold"></span></td>\
     <td><label>Percentage:</label></td>\
     <td><input type="text" name="percent'+count1+'" class="width"> <br> <span id="percent'+count1+'" class="bold"></span></td>\
 </tr>\
 </div>'
    var form1 = document.getElementById("frm1")
    form1.innerHTML+=html1
    count1++;

}