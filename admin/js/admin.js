const title = document.createElement('h2');
const sidebarAttach = document.querySelector('.sidebar-attach');

var warning = document.getElementById("warning-msg");
var alertDiv = document.getElementById("alert");
var close = document.getElementById("close-btn");

var deleteTitle = document.getElementById('modal-title');
const deletePara = document.getElementById('delete-para');

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

function checkUser() {
    if (checkCookie()) {
        fetch('../html/adminSidebar.html')
            .then(res => {
                if (res.ok) {
                    return res.text();
                }
            })
            .then(data => {
                sidebarAttach.innerHTML = data;
                startAlert('Welcome Admin');
            })
            .catch(err => console.warn(err));
        title.innerText = "Welcome user.";
        //alert('welcome user.');
        document.body.appendChild(title);
    }
    else {
        title.innerHTML = `<a href="http://param-training.netlify.app/index.html">Please Login Again.</a>`;        //alert('Cookie Expired.');
        startAlert('Cookie Expired.');
        document.body.appendChild(title);
    }
}

window.onload = checkUser();

// logging out and deleting cookie
function logout() {
    deleteCookie("CurrentUser")
        .then(() => {
            window.location.href = "../../index.html";
        })
        .catch(e => console.warn(e));

    return false;
}

function openModalLogout() {
    if (window.confirm('Are you sure you want to logout?')) {
        deleteCookie("CurrentUser")
        .then(() => {
            window.location.href = "../../index.html";
        })
        .catch(e => console.warn(e));
    }
}

// functionalities of alert 
close.addEventListener('click', () => {
    alertDiv.classList.add("hide");
    alertDiv.classList.remove("show");
});
function startAlert(msg) {
    warning.innerText = msg
    alertDiv.classList.add("show");
    alertDiv.classList.remove("hide");
    setTimeout(() => {
        alertDiv.classList.add("hide");
        alertDiv.classList.remove("show");
    }, 4000)
}