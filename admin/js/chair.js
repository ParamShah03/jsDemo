const sidebarAttach = document.querySelector('.sidebar-attach');
const couchData = document.getElementById('chairData');
const table = document.getElementById('chair-table');
const contents = document.getElementById('chair-contents');
const title = document.createElement('h2');
const addBtn = document.getElementById('addBtn');

// alert warning
var warning = document.getElementById("warning-msg");
var alertWarning = document.getElementById("alert");
var close = document.getElementById("close-btn-alert");
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
            attachSidebar();
            getChair();
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
        const chairTile = document.getElementById('Chairs');

        // making current page active
        collectionDropdown.style.display = "block";
        chairTile.style.background = "#0e6e9e";

    })
    .catch(err => console.warn(err));
}

// add button on click
addBtn.addEventListener('click',()=>{
    window.location.href = "../html/chairAdd.html";
});

// initializing acll API class
const get = new getDatabase();

// display delete modal
var chairId = document.getElementById('chairId');
var chairImg = document.getElementById('chairImg');

// delete button functionalities
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

const confirm = document.getElementById('yes');
// yes button function
function yesBtn(){
    closeModal();

    deleteImage(chairId.value, chairImg.value);

    return false;
}

function openModal(id, image) {

    chairId.value = id;
    chairImg.value = image;
    deleteTitle.innerHTML = image;

    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");

    return false;
};
// close delete modal
function closeModal() {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");

    return false;

};
// closing while clicking outside the modal
overlay.addEventListener("click", closeModal);

// get couch data
async function getChair() {
    let chairs = await get.getChairs();
    console.warn(chairs.length);
    for (let i = 0; i < chairs.length; i++) {
        let tr = document.createElement('tr');
        let td2 = document.createElement('td');
        let td4 = document.createElement('td');
        td4.id = "view-data";
        let td5 = document.createElement('td');
        td5.id = "edit-data";
        let td6 = document.createElement('td');
        td6.id = "delete-data";


        td2.innerHTML = chairs[i]['name'];
        // icons in table
        td4.innerHTML = `<a href="#" target="_blank" title="view Image" id="viewImage${i}" onclick="viewImage(${i})"><i class="fas fa-eye"></i></a>`;
        td5.innerHTML = `<a href="../html/chairEdit.html" target="_blank" onclick="passChair('${chairs[i]['_id']}',${i})" title="edit data" id="editData${i}"><i class="fas fa-pencil"></i></a>`;
        td6.innerHTML = `<a href="#" title="delete data" id="deleteData" onclick="return openModal('${chairs[i]['_id']}','${chairs[i]['name']}');"><i class="fas fa-trash"></i></a>`;
        // add to table row
        tr.appendChild(td2);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);

        couchData.appendChild(tr);


    }
}

// viewing image
function viewImage(i) {
    let image = chairData.rows[i].cells[0].innerHTML;
    let viewImage = document.getElementById(`viewImage${i}`);
    viewImage.href = `http://localhost:5500/upload/images/chairs/${image}`;
    //alert(image);
}

// deleting an image
function deleteImage(id, image) {
    fetch(`http://jsdemo.onrender.com/upload/chair/${id}`, {
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
function passChair(id,i){
    let editHref = document.getElementById(`editData${i}`);
    // passing id in url as querystring
    var obj = {
        id: id,
    }
    let searchParams = new URLSearchParams(obj);
    let querystring = searchParams.toString();

    editHref.href = `../html/chairEdit.html?${querystring}`;
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