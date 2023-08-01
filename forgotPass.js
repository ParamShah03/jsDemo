const email = document.getElementById('email');

// alert message
var warning = document.getElementById("warning-msg");
var alertWarning = document.getElementById("alert");
var close = document.getElementById("close-btn");

// initializing call API class
const get = new getDatabase();
// get Users from database
let users;
window.onload = async ()=>{
    users = await get.getUsers();
}

async function sendEmail() {
    event.preventDefault();

    let checkUserEmail = 0;

    // check if a user is registered
    for(let i = 0; i<users.length; i++){
        console.warn(users[i].email);
        if(users[i].email === email.value){
            checkUserEmail = 1;
            break;
        }
    }
    // send alert if user is not registered
    if(checkUserEmail === 0){
        startAlert("Not a Registered Account!");
    } else {
        fetch('http://jsdemo.onrender.com/forgotPassword',
        {
            method: "Post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: `${email.value}`,
            })
        })
        .then((res)=>{
            return res;
        })
        .then((data)=>{
            startAlert("Please check your Mail.");
            setTimeout(()=>{
                window.location.href = "/index.html";
            }, 2000);
        })
        .catch((err)=>{
            startAlert(err);
            console.warn("Error: ", err);
        });
    }

    return false;
}

// functionalities of alert 
close.addEventListener('click', ()=>{
    alertWarning.classList.add("hide");
    alertWarning.classList.remove("show");
});
function startAlert(msg) {
    warning.innerText = msg
    alertWarning.classList.add("show");
    alertWarning.classList.remove("hide");
    setTimeout(()=>{
        alertWarning.classList.add("hide");
        alertWarning.classList.remove("show");  
    },4000)
}
startAlert("Please Enter your Email.");