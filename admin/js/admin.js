const title = document.createElement('h2');
const sidebarAttach = document.querySelector('.sidebar-attach');

var warning = document.getElementById("warning-msg");
var alertDiv = document.getElementById("alert");
var close = document.getElementById("close-btn");

var deleteTitle = document.getElementById('modal-title');

function checkUser(){
    if(checkCookie()){
        fetch('../html/adminSidebar.html')
        .then(res =>{
            if(res.ok){
                return res.text();
            }
        })
        .then(data => {
            sidebarAttach.innerHTML = data;
            startAlert('Welcome Admin');
        })
        .catch(err=>console.warn(err));
        title.innerText = "Welcome user.";
        //alert('welcome user.');
        document.body.appendChild(title);
    }
    else{
        title.innerHTML = `<a href="http://127.0.0.1:5500/index.html">Please Login Again.</a>`;        //alert('Cookie Expired.');
        alert('Cookie Expired.');
        document.body.appendChild(title);
    }
}

window.onload = checkUser();

// logging out and deleting cookie
function logout(){
    deleteCookie("CurrentUser")
    .then(()=>{
        window.location.href = "../../index.html";
    })
    .catch(e => console.warn(e));
  
    return false;
}

// functionalities of alert 
close.addEventListener('click', ()=>{
    alertDiv.classList.add("hide");
    alertDiv.classList.remove("show");
});
function startAlert(msg) {
    warning.innerText = msg
    alertDiv.classList.add("show");
    alertDiv.classList.remove("hide");
    setTimeout(()=>{
        alertDiv.classList.add("hide");
        alertDiv.classList.remove("show");  
    },4000)
}