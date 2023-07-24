const sidebarAttach = document.querySelector('.sidebar-attach');
const featureData = document.getElementById('featureData');
const table = document.getElementById('feature-table');
const contents = document.getElementById('feature-contents');
const title = document.createElement('h2');

const addBtn = document.getElementById('addBtn');

const featurePopup = document.querySelector('.featurePopup');
const popupData = document.getElementById('popupData');
const popupTitle = document.getElementById('popup-title');
const popupDescription = document.getElementById('popup-desc');

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
            getFeature();
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

// delete button functionalities
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");


const confirm = document.getElementById('yes');
// yes button function
function yesBtn(){
    closeModal();

    deleteImage(featureId.value, featureImg.value);

    return false;
}

// display delete modal
var featureId = document.getElementById('featureId');
var featureImg = document.getElementById('featureImg');
function openModal(id, image, title) {

    featureId.value = id;
    featureImg.value = image;
    deleteTitle.innerHTML = title;

    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");

    return false;
};
// close delete modal
function closeModal() {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");

    featurePopup.classList.add("hidden");

    return false;

};
// closing while clicking outside the modal
overlay.addEventListener("click", closeModal);



// add button on click
addBtn.addEventListener('click',()=>{
    window.location.href = "../html/featureAdd.html";
});

// initializing acll API class
const get = new getDatabase();


// get couch data
async function getFeature() {
    let features = await get.getFeatures();
    console.warn(features.length);
    for (let i = 0; i < features.length; i++) {
        let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        td1.className = "details";
        // let td2 = document.createElement('td');
        // let td3 = document.createElement('td');
        let td4 = document.createElement('td');
        td4.id = "view-data";
        let td5 = document.createElement('td');
        td5.id = "edit-data";
        let td6 = document.createElement('td');
        td6.id = "delete-data";


        td1.innerHTML = features[i]['name'];
        td1.title = "details";
        // td2.innerHTML = features[i]['image'];
        // td3.innerHTML = features[i]['description'];
        // icons in table
        td4.innerHTML = `<a href="#" target="_blank" title="view Image" id="viewImage${i}" onclick="viewImage('${features[i]['image']}',${i})"><i class="fas fa-eye"></i></a>`;
        td5.innerHTML = `<a href="../html/featureEdit.html" target="_blank" onclick="passFeature('${features[i]['_id']}',${i})" title="edit data" id="editData${i}"><i class="fas fa-pencil"></i></a>`;
        td6.innerHTML = `<a href="#" target="_self" title="delete data" id="deleteData" onclick="return openModal('${features[i]['_id']}','${features[i]['image']}','${features[i]['name']}');"><i class="fas fa-trash"></i></a>`;
        // add to table row
        tr.appendChild(td1);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);

        featureData.appendChild(tr);

        // details popup
        td1.addEventListener('click', ()=>{
            displayDetails(`${features[i]['name']}`,`${features[i]['description']}`);
        });
    }
}

// viewing image
function viewImage(name,i) {
    let viewImage = document.getElementById(`viewImage${i}`);
    viewImage.href = `http://localhost:5500/upload/images/features/${name}`;
    //alert(image);
}

// deleting an image
function deleteImage(id, image) {
    fetch(`http://jsdemo.onrender.com/upload/feature/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: `${image}`
        })
    })
    .then(res => {
        res.json();
    })
    .then((result) =>{
        startAlert("deleted");
    })
    .catch(err=> console.warn(err));

    return false;
}

// edit couch data
function passFeature(id,i){
    let editHref = document.getElementById(`editData${i}`);
    // passing id in url as querystring
    var obj = {
        id: id,
    }
    let searchParams = new URLSearchParams(obj);
    let querystring = searchParams.toString();

    editHref.href = `../html/featureEdit.html?${querystring}`;
}

// display details
function displayDetails (title, desc){

    popupTitle.innerHTML = title;
    popupDescription.innerHTML = desc;

    overlay.classList.remove('hidden');
    featurePopup.classList.remove('hidden');
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