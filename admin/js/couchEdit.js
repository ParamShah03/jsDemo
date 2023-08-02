const sidebarAttach = document.querySelector('.sidebar-attach');
const title = document.createElement('h2');
const contents = document.getElementById('couchEdit-contents');

// values of form
let couchTitle = document.getElementById('title');
// let couchImage = document.getElementById('image');
let description = document.getElementById('description');

// alert warning
var warning = document.getElementById("warning-msg");
var alertWarning = document.getElementById("alert");
var close = document.getElementById("close-btn-alert");
var deleteTitle = document.getElementById('modal-title');

// check cookie for the currentuser
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
                getSpecificCouch();
            })
            .catch(err => console.warn(err));
        title.innerText = "Welcome user.";
        //alert('welcome user.');

    }
    else {
        contents.style.display = "none";
        title.innerHTML = `<a href="http://127.0.0.1:5500/index.html">Please Login Again.</a>`;
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
            const couchTile = document.getElementById('Couchs');

            // making current page active
            collectionDropdown.style.display = "block";
            couchTile.style.background = "#0e6e9e";

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

// get request to get fetch specific couch data
async function getSpecificCouch() {

    if (id) {
        let couch = await fetch(`http://jsdemo.onrender.com/upload/couch/${id}`);
        couch = await couch.json();

        couchTitle.value = couch.title;
        description.value = couch.description;
    }

}

// progress bar
let file = document.getElementById('upload');
let progress = document.querySelector('progress');
let p_i = document.querySelector('.progress-indicator');
let load = 0;

file.oninput = () => {
    let filename = file.files[0].name;
    let filesize = file.files[0].size;

    // manipulating size of a file
    if (filesize <= 1000000) {
        filesize = (filesize / 1000).toFixed(2) + 'kb';
    }
    if (filesize == 1000000 || filesize <= 1000000000) {
        filesize = (filesize / 1000000).toFixed(2) + 'mb';
    }
    if (filesize == 1000000000 || filesize <= 1000000000000) {
        filesize = (filesize / 1000000000).toFixed(2) + 'gb';
    }

    document.querySelector('label[for="upload"]').innerText = filename;
    document.querySelector('.size').innerText = filesize;

    document.querySelector('.pr').style.display = "block";

}


// edit request to server
function editCouch() {
    const xhr = new XMLHttpRequest();
    let formData = new FormData();
    formData.append('title', couchTitle.value);
    formData.append('description', description.value);

    if (!file.files[0]) {
        // fetch(`http://localhost:4000/upload/couch/${id}`,
        //     {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify({
        //             title: couchTitle.value,
        //             description: description.value
        //         })
        //     })
        //     .then((res) => {
        //         res.json();
        //         startAlert('Edited Successfully.');
        //     })
        //     .then((data) => {
        //         console.warn(data);

        //     })
        //     .catch((err) => {
        //         console.warn("Error: ", err);
        //     })


        // upload get aborted
        xhr.upload.onabort = () => {
            console.error('Upload cancelled.')
        }
        // if some err
        xhr.onerror = function (e) {
            console.log('error', e);
        }

        xhr.open('POST', `//localhost:4000/upload/couch/${id}`, true);
        startAlert("Record Updated Successfully");

        xhr.send(formData);
    }
    else {
        formData.append('image', file.files[0]);
        let percentComplete = 0;

        // startAlert('Edited Successfully.');


        // fetch(`http://jsdemo.onrender.com/upload/couch/${id}`,
        //     {
        //         method: "POST",
        //         body: formData,
        //     })
        //     .then((res) => {
        //         res.json();
        //     })
        //     .then((data) => {

        //     })
        //     .catch((err) => {
        //         console.warn("Error: ", err);
        //     })


        // upload get aborted
        xhr.upload.onabort = () => {
            console.error('Upload cancelled.')
        }
        // if some err
        xhr.onerror = function (e) {
            console.log('error', e);
        }

        xhr.open('POST', `//localhost:4000/upload/couch/${id}`, true);
        xhr.send(formData);
        startAlert("Record Updating...");
        xhr.upload.addEventListener('progress', function (e) {
            percentComplete = (e.loaded / e.total) * 100;
            progress.value = percentComplete.toFixed(2);
            p_i.innerHTML = percentComplete.toFixed(2) + '%' + ' ' + 'Uploaded';

            
        });

        return false;
    }

    return false;
}



// functionalities of alert 
close.addEventListener('click', () => {
    alertWarning.classList.add("hide");
    alertWarning.classList.remove("show");
});
function startAlert(msg) {
    warning.innerText = msg
    alertWarning.classList.add("show");
    alertWarning.classList.remove("hide");

    setTimeout(() => {
        alertWarning.classList.add("hide");
        alertWarning.classList.remove("show");
    }, 3000)

}