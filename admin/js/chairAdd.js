const sidebarAttach = document.querySelector('.sidebar-attach');
const title = document.createElement('h2');
const contents = document.getElementById('chairEdit-contents');

// values of form
let chairTitle = document.getElementById('title');
let chairImage = document.getElementById('image');

// alert
var warning = document.getElementById("warning-msg");
var alertWarning = document.getElementById("alert");
var close = document.getElementById("close-btn-alert");
var deleteTitle = document.getElementById('modal-title');

// check cookie for the currentuser
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
            attachSidebar();
        })
        .catch(err=>console.warn(err));
        //alert('welcome user.');
        

    }
    else{
        contents.style.display = "none";
        title.innerText = "Please login again.";
        //alert('Cookie Expired.');
        document.body.appendChild(title);
    }
}

window.onload = checkUser();

// fetching sidebar
function attachSidebar(){
    fetch('../html/adminSidebar.html')
    .then(res => {
        if (res.ok) {
            return res.text();
        }
    })
    .then(data => {
        sidebarAttach.innerHTML = data;
        const collectionDropdown = document.getElementById('collection-dropdown');
        const chairTile = document.getElementById('Chairs');

        // making current page active
        collectionDropdown.style.display = "block";
        chairTile.style.background = "#0e6e9e";

    })
    .catch(err => console.warn(err));
}


function addChair(){
    if(!chairImage.files[0]){
        alert('Please selct a File!'); 
    }
    else {
        // appending data to a form object
        startAlert('Added successfully.')
        const formData = new FormData();
        formData.append('title', chairTitle.value);
        formData.append('image', chairImage.files[0]);

        fetch("http://localhost:4000/upload/chair/add",
        {
            method: "POST",
            body: formData,
        })
        .then((res)=>{
            return res.json();
        })
        .then((data)=>{
            window.location.href = "../html/chair.html";
            console.warn(data);
        })
        .catch((err)=>{
            console.warn("Error: ", err);
        })

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
    },3000)

}