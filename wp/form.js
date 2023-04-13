function fun() {
    let name = document.frm.name.value;
    let pwd = document.frm.pwd.value;
    let num = document.frm.num.value;
    let mail = document.frm.email.value;
    let txtarea = document.frm.txtarea.value;
    let list = document.getElementById('list').value;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let radio = document.frm.gender;
    let ckb = document.frm.ckb;


    if (name.length == 0) {
        document.getElementById('1').innerHTML = "** please enter the name field";

    }
    else if ((name.length < 2) || (name.length > 20)) {
        document.getElementById('1').innerHTML = "** name must contain 2-20 characters";

    }
    else if (!isNaN(name)) {
        document.getElementById('1').innerHTML = "** name contain only alphabets";

    }
    else {
        document.getElementById('1').innerHTML = "";

    }
    if (pwd.length == 0) {
        document.getElementById('2').innerHTML = "** please enter the password field"

    }
    else if ((pwd.length < 7) || (pwd.length > 20)) {
        document.getElementById('2').innerHTML = "** password must contain 8-20 characters";

    }
    else {
        document.getElementById('2').innerHTML = "";
    }

    if (num.length == 0) {
        document.getElementById('3').innerHTML = "** please enter the number field"

    }
    else if (isNaN(num)) {
        document.getElementById('3').innerHTML = "** number contains only digits";

    }
    else if (num.length != 10) {
        document.getElementById('3').innerHTML = "** number must be 10 digits";

    }
    else {
        document.getElementById('3').innerHTML = "";
    }

    if (mail.length == 0) {
        document.getElementById('4').innerHTML = "** please enter the mail field"

    }
    else if (!reg.test(mail)) {
        document.getElementById('4').innerHTML = "** please enter valid mail";

    }
    else {
        document.getElementById('4').innerHTML = "";
    }
    if (list.length <= 0) {
        document.getElementById('5').innerHTML = "** please select any one game";

    }
    else {
        document.getElementById('5').innerHTML = "";
    }
    if (!radio[0].checked && !radio[1].checked) {
        document.getElementById('6').innerHTML = "** plese select any one option";

    }
    else {
        document.getElementById('6').innerHTML = "";
    }
    if (txtarea.length == 0) {
        document.getElementById('8').innerHTML = "** please enter the feed";

    }
    else {
        document.getElementById('8').innerHTML = "";
    }
    if (!ckb[0].checked && !ckb[1].checked && !ckb[2].checked && !ckb[3].checked && !ckb[4].checked) {
        document.getElementById('7').innerHTML = "** plese select atleast one checkbox";
        
        alert("please fill all detail..");
        
        return false;
        

    }
    else {
        document.getElementById('7').innerHTML = "";
        alert("please fill all detail..");
       
          return false;
    }
    


}



