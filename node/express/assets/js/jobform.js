



// var gender = document.frm.gender;
// var state = document.getElementById('state').value;
// var city = document.getElementById('city').value;
// var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
// var ckb = document.frm.ckb;

function nameErr() {
    var name = document.frm.fname.value;

    if (name.trim() == '') {
        document.getElementById('nameErr').innerHTML = "** please enter the name field";
    }
    else if ((name.length < 2) || (name.length > 20)) {
        document.getElementById('nameErr').innerHTML = "** name must contain 2-20 characters";
    }
    else if (!isNaN(name)) {
        document.getElementById('nameErr').innerHTML = "** name contain only alphabets";
    }
    else {
        document.getElementById('nameErr').innerHTML = "";

    }

}

function lnameErr() {
    var lname = document.frm.lname.value;

    if (lname.trim() == '') {
        document.getElementById('lnameErr').innerHTML = "** please enter the name field";
    }
    else if ((lname.length < 2) || (lname.length > 20)) {
        document.getElementById('lnameErr').innerHTML = "** field must contain 2-20 characters";
    }
    else if (!isNaN(lname)) {
        document.getElementById('lnameErr').innerHTML = "** field contain only alphabets";
    }
    else {
        document.getElementById('lnameErr').innerHTML = "";

    }

}


function numErr() {
    var num = document.frm.num.value;
    console.log(num);

    if (num.trim() == '') {
        document.getElementById('numErr').innerHTML = "** please enter the name field";
    }
    else if (isNaN(num)) {
        document.getElementById('numErr').innerHTML = "** number contains only digits";

    }
    else if (num.length != 10) {
        document.getElementById('numErr').innerHTML = "** number must be 10 digits";

    }
    else {
        document.getElementById('numErr').innerHTML = "";
    }

}

function emailErr() {
    var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var mail = document.frm.email.value;
    console.log(mail);

    if (mail.trim() == '') {
        document.getElementById('emailErr').innerHTML = "** please enter the mail field"

    }
    else if (!reg.test(mail)) {
        document.getElementById('emailErr').innerHTML = "** please enter valid mail";

    }
    else {
        document.getElementById('emailErr').innerHTML = "";
    }

}

function adsErr() {
    var address = document.frm.address.value;
    console.log(address);

    if (address.trim() == '') {
        document.getElementById('adsErr').innerHTML = "** please enter the address field";

    }
    else if (address.length >= 250) {
        document.getElementById('adsErr').innerHTML = "** address must be 250 letters";

    }
    else {
        document.getElementById('adsErr').innerHTML = "";
    }

}
function pinErr() {
    var pin = document.frm.pincode.value;
    // console.log(address);

    if (pin.trim() == '') {
        document.getElementById('pinErr').innerHTML = "** please enter the address field";

    }
    else if (pin.length > 6) {
        document.getElementById('pinErr').innerHTML = "** address must be 6 letters";

    }
    else {
        document.getElementById('pinErr').innerHTML = "";
    }

}
function designationErr() {
    var designation = document.frm.designation.value;

    if (designation.trim() == '') {
        document.getElementById('designationErr').innerHTML = "** please enter the address field";

    }
    else if (designation.length > 40) {
        document.getElementById('designationErr').innerHTML = "** address must be 40 letters";

    }
    else {
        document.getElementById('designationErr').innerHTML = "";
    }

}

function onsubmit() {
    

    var radio = document.frm.gender;
    
    if (!radio[0].checked && !radio[1].checked && !radio[2].checked) {
                document.getElementById('genderErr').innerHTML = "** plese select any one option";
    
            }
            else {
                document.getElementById('genderErr').innerHTML = "";
            }

}




    //     if (name.length == 0) {
    //         document.getElementById('1').innerHTML = "** please enter the name field";

    //     }
    //     else if ((name.length < 2) || (name.length > 20)) {
    //         document.getElementById('1').innerHTML = "** name must contain 2-20 characters";

    //     }
    //     else if (!isNaN(name)) {
    //         document.getElementById('1').innerHTML = "** name contain only alphabets";

    //     }
    //     else {
    //         document.getElementById('1').innerHTML = "";

    //     }
    //     if (pwd.length == 0) {
    //         document.getElementById('2').innerHTML = "** please enter the password field"

    //     }
    //     else if ((pwd.length < 7) || (pwd.length > 20)) {
    //         document.getElementById('2').innerHTML = "** password must contain 8-20 characters";

    //     }
    //     else {
    //         document.getElementById('2').innerHTML = "";
    //     }

    //     if (num.length == 0) {
    //         document.getElementById('3').innerHTML = "** please enter the number field"

    //     }
    //     else if (isNaN(num)) {
    //         document.getElementById('3').innerHTML = "** number contains only digits";

    //     }
    //     else if (num.length != 10) {
    //         document.getElementById('3').innerHTML = "** number must be 10 digits";

    //     }
    //     else {
    //         document.getElementById('3').innerHTML = "";
    //     }

    //     if (mail.length == 0) {
    //         document.getElementById('4').innerHTML = "** please enter the mail field"

    //     }
    //     else if (!reg.test(mail)) {
    //         document.getElementById('4').innerHTML = "** please enter valid mail";

    //     }
    //     else {
    //         document.getElementById('4').innerHTML = "";
    //     }
    //     if (list.length <= 0) {
    //         document.getElementById('5').innerHTML = "** please select any one game";

    //     }
    //     else {
    //         document.getElementById('5').innerHTML = "";
    //     }
    //     if (!radio[0].checked && !radio[1].checked) {
    //         document.getElementById('6').innerHTML = "** plese select any one option";

    //     }
    //     else {
    //         document.getElementById('6').innerHTML = "";
    //     }
    //     if (txtarea.length == 0) {
    //         document.getElementById('8').innerHTML = "** please enter the feed";

    //     }
    //     else {
    //         document.getElementById('8').innerHTML = "";
    //     }
    //     if (!ckb[0].checked && !ckb[1].checked && !ckb[2].checked && !ckb[3].checked && !ckb[4].checked) {
    //         document.getElementById('7').innerHTML = "** plese select atleast one checkbox";

    //         alert("please fill all detail..");

    //         return false;


    //     }
    //     else {
    //         document.getElementById('7').innerHTML = "";
    //         alert("please fill all detail..");

    //           return false;
    //     }





