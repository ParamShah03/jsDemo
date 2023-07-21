const title = document.createElement('h2');
const sidebarAttach = document.querySelector('.sidebar-attach');

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
        })
        .catch(err=>console.warn(err));
        title.innerText = "Welcome user.";
        //alert('welcome user.');
        document.body.appendChild(title);
    }
    else{
        title.innerText = "Please login again.";
        alert('Cookie Expired.');
        document.body.appendChild(title);
    }
}

window.onload = checkUser();