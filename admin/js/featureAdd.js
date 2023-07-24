const sidebarAttach = document.querySelector('.sidebar-attach');
const title = document.createElement('h2');
const contents = document.getElementById('featureEdit-contents');

// values of form
let featureTitle = document.getElementById('title');
let featureImage = document.getElementById('image');
let description = document.getElementById('description');

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
        title.innerHTML = `<a href="http://127.0.0.1:5500/index.html">Please Login Again.</a>`;        //alert('Cookie Expired.');
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
        const featureTile = document.getElementById('Features');

        // making current page active
        collectionDropdown.style.display = "block";
        featureTile.style.background = "#0e6e9e";

    })
    .catch(err => console.warn(err));
}

// adding record to database
function addFeature(){
    if(!featureImage.files[0]){
        alert('Please selct a File!'); 
    }
    else {

        // appending data to a form object
        startAlert('Added successfully.')
        const formData = new FormData();
        formData.append('title', featureTitle.value);
        formData.append('image', featureImage.files[0]);
        formData.append('description', description.value);

        fetch("http://jsdemo.onrender.com/upload/feature/add",
        {
            method: "POST",
            body: formData,
        })
        .then((res)=>{
            return res.json();
        })
        .then((data)=>{
            window.location.href = "../html/feature.html";
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