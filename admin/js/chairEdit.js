const sidebarAttach = document.querySelector('.sidebar-attach');
const contents = document.getElementById('chairEdit-contents');
const title = document.createElement('h2');

// values of form
let chairTitle = document.getElementById('title');
let chairImage = document.getElementById('image');

// checking cookie of currentuser
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
                attachSidebar();
                getSpecificChair();
            })
            .catch(err => console.warn(err));
        title.innerText = "Welcome user.";
        //alert('welcome user.');


    }
    else {
        contents.style.display = "none";
        title.innerHTML = `<a href="http://127.0.0.1:5500/index.html">Please Login Again.</a>`;
        startAlert('Cookie Expired.');
        document.body.appendChild(title);
    }
}

window.onload = checkUser();

// fetching sidebar
function attachSidebar() {
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

// get id from querystring
let url = window.location.href;
let searchParams = new URL(url).searchParams;
let entries = new URLSearchParams(searchParams).entries();
let array = Array.from(entries);

// couch ID
let id = array[0][1];
console.warn(id);

// get request to get fetch specific couch data
async function getSpecificChair() {

    if (id) {
        let chair = await fetch(`http://localhost:4000/upload/chair/${id}`);
        chair = await chair.json();
        chairTitle.value = chair.name;
    }

}


function editChair() {
    if (!chairImage.files[0]) {
        alert('no file chosen');
        fetch(`http://localhost:4000/upload/chair/${id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: chairTitle.value,
                    description: description.value
                })
            })
            .then((res) => {
                return res;
            })
            .then((data) => {
                console.warn(data);
            })
            .catch((err) => {
                console.warn("Error: ", err);
            })
    }
    else {
        startAlert('Edited successfully.')
        let formData = new FormData();
        formData.append('title', chairTitle.value);
        formData.append('image', chairImage.files[0]);

        fetch(`http://jsdemo.onrender.com/upload/chair/${id}`,
            {
                method: "POST",
                body: formData,
            })
            .then((res) => {
                res.json();
            })
            .then((data) => {
                console.warn(data);
            })
            .catch((err) => {
                console.warn("Error: ", err);
            })

    }

    return false;
}