function loginUser(){

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

// Check empty fields
if(email === "" || password === ""){
alert("Please fill all fields");
return;
}

// Check email format
if(!email.includes("@")){
alert("Please enter a valid email address");
return;
}

// Password length check
if(password.length < 6){
alert("Password must be at least 6 characters");
return;
}

localStorage.setItem("loggedIn","true");

window.location.href = "ecom.html";

}

const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");

togglePassword.addEventListener("click", function(){

if(password.type === "password"){
password.type = "text";
this.classList.remove("fa-eye");
this.classList.add("fa-eye-slash");
}else{
password.type = "password";
this.classList.remove("fa-eye-slash");
this.classList.add("fa-eye");
}

});