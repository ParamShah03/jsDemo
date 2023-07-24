const sidebarAttach = document.querySelector('.sidebar-attach');
const couchData = document.getElementById('couchData');
const table = document.getElementById('couch-table');
const contents = document.getElementById('couch-contents');
const title = document.createElement('h2');

const addBtn = document.getElementById('addBtn');

const couchPopup = document.querySelector('.couchPopup');
const popupData = document.getElementById('popupData');
const popupTitle = document.getElementById('popup-title');
const popupDescription = document.getElementById('popup-desc');

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
            getCouch();
            attachSidebar();
        })
        .catch(err=>console.warn(err));
        //alert('welcome user.');
        
    }
    else{
        contents.style.display = "none";
        title.innerHTML = `<a href="http://127.0.0.1:5500/index.html">Please Login Again.</a>`;
        //alert('Cookie Expired.');
        document.body.appendChild(title);
    }
}
checkUser();

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
        const couchTile = document.getElementById('Couchs');

        // making current page active
        collectionDropdown.style.display = "block";
        couchTile.style.background = "#0e6e9e";

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

    deleteImage(couchId.value, couchImg.value);

    return false;
}

// display delete modal
var couchId = document.getElementById('couchId');
var couchImg = document.getElementById('couchImg');
function openModal(id, image, title) {

    couchId.value = id;
    couchImg.value = image;
    deleteTitle.innerHTML = title;

    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");

    return false;
};
// close delete modal
function closeModal() {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");

    couchPopup.classList.add("hidden");

    return false;

};
// closing while clicking outside the modal
overlay.addEventListener("click", closeModal);



// add button on click
addBtn.addEventListener('click',()=>{
    window.location.href = "../html/couchAdd.html";
});
// initializing acll API class
const get = new getDatabase();


// get couch data
async function getCouch() {
    let couchs = await get.getCouchs();
    console.warn(couchs.length);
    for (let i = 0; i < couchs.length; i++) {
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


        td1.innerHTML = couchs[i]['title'];
        td1.title = "view details";
        // td2.innerHTML = couchs[i]['name'];
        // td3.innerHTML = couchs[i]['description'];
        // icons in table
        td4.innerHTML = `<a href="#" target="_blank" title="view Image" id="viewImage${i}" onclick="viewImage('${couchs[i]['name']}',${i})"><i class="fas fa-eye"></i></a>`;
        td5.innerHTML = `<a href="../html/couchEdit.html" target="_blank" onclick="passCouch('${couchs[i]['_id']}',${i})" title="edit data" id="editData${i}"><i class="fas fa-pencil"></i></a>`;
        td6.innerHTML = `<a href="#" target="_self" title="delete data" onclick="return openModal('${couchs[i]['_id']}','${couchs[i]['name']}','${couchs[i]['title']}');"><i class="fas fa-trash"></i></a>`;
        // add to table row
        tr.appendChild(td1);
        // tr.appendChild(td2);
        // tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);

        couchData.appendChild(tr);

        // deatils popup
        td1.addEventListener('click', ()=>{
            displayDetails(`${couchs[i]['title']}`,`${couchs[i]['description']}`);
        });
    }
}

// viewing image
function viewImage(name,i) {
    let viewImage = document.getElementById(`viewImage${i}`);
    viewImage.href = `http://localhost:5500/upload/images/couchs/${name}`;
    //alert(image);
}

// deleting an image
function deleteImage(id, image) {
    fetch(`http://jsdemo.onrender.com/upload/couch/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: `${image}`
        })
    })
    .then(res => {
        startAlert("Deleted.");
        res.json();
    })
    .then((result) =>{
        
    })
    .catch(err=> console.warn(err));

    return false;
}

// edit couch data
function passCouch(id,i){
    let editHref = document.getElementById(`editData${i}`);
    // passing id in url as querystring
    var obj = {
        id: id,
    }
    let searchParams = new URLSearchParams(obj);
    let querystring = searchParams.toString();

    editHref.href = `../html/couchEdit.html?${querystring}`;
}

// display details
function displayDetails (title, desc){

    popupTitle.innerHTML = title;
    popupDescription.innerHTML = desc;

    overlay.classList.remove('hidden');
    couchPopup.classList.remove('hidden');
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
