const wrapper = document.querySelector('.wrapper');
const signUpLink = document.querySelector('.signUp-link');
const signInLink = document.querySelector('.signIn-link');

var warning = document.getElementById("warning-msg");
var alert = document.getElementById("alert");
var close = document.getElementById("close-btn");

function checkUser() {
    if (checkCookie()) {
        window.location.href = "/admin/html/admin.html";
        startAlert('Welcome Back!');

    }
    else {
        startAlert('Please Login.');
    }
}

window.onload = checkUser();

//to check special character
function containsSpecialChars(str) {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
}
//to check email
function validateEmail(str) {
    const emailChars = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailChars.test(str);
}


// on clicking sign up button
signUpLink.addEventListener('click', () => {
    wrapper.classList.add('animate-signIn');
    wrapper.classList.remove('animate-signUp');

});

// on clicking login button
signInLink.addEventListener('click', () => {
    wrapper.classList.add('animate-signUp');
    wrapper.classList.remove('animate-signIn');
});



//login button
function login() {
    var loginEmail = document.getElementById("login-email").value;
    var loginPassword = document.getElementById("login-password").value;

    //validating name and password
    if (!loginEmail) {
        startAlert("Warning: Email is required.");
    }
    else if (!validateEmail(loginEmail)) {
        startAlert("Warning: Enter a proper Email.");
    }
    else if (!loginPassword) {
        startAlert("Warning: Please enter a password.");
    }
    else {
        let formData = new FormData();
        formData.append('email', loginEmail);
        formData.append('password', loginPassword);

        fetch('http://param-training.netlify.app/login',
            {
                method: "Post",
                body: formData,
            })
            .then(res => {
                return res.json();
            })
            .then((result) => {
                if (result.Success) {
                    setCookie("CurrentUser", result.Id, 2);
                    startAlert("Verified User Credentials: Logging in...");
                    setTimeout(() => {
                        window.location.href = "/admin/html/admin.html";
                    }, 4500);
                } else {
                    console.warn(result.Message);
                    startAlert(result.Message);
                }
            })
            .catch((err) => {
                console.warn(err);
                startAlert(err);
            });
    }


    return false;
}

// signUp button
function signUp() {
    var signUpName = document.getElementById('signUp-name').value;
    var signUpPassword = document.getElementById('signUp-password').value;
    var email = document.getElementById('email').value;

    if (!signUpName) {
        startAlert("Warning: Username is required");
    }
    else if (!email) {
        startAlert("Warning: Email is required.")
    }
    else if (!validateEmail(email)) {
        startAlert("Warning: Enter a proper Email.");
    }
    else if (!signUpPassword) {
        startAlert("Warning: Password is required");
    }
    else if (signUpPassword.length < 6) {
        startAlert("Warning: Password too small.");
    }
    else if (!containsSpecialChars(signUpPassword)) {
        startAlert("Password does not have special characters!");
    }
    else {
        fetch('https://param-training.netlify.app/user',
            {
                method: "Post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: `${signUpName}`,
                    email: `${email}`,
                    password: `${signUpPassword}`
                })
            })
            .then((res) => {
                return res;
            })
            .then((data) => {
                wrapper.classList.add('animate-signUp');
                wrapper.classList.remove('animate-signIn');
                startAlert("Account Created Successfully.");
            })
            .catch((err) => {
                startAlert(err);
                console.warn("Error: ", err);
            })
    }



    return false;
}

// functionalities of alert 
close.addEventListener('click', () => {
    alert.classList.add("hide");
    alert.classList.remove("show");
});
function startAlert(msg) {
    warning.innerText = msg
    alert.classList.add("show");
    alert.classList.remove("hide");
    setTimeout(() => {
        alert.classList.add("hide");
        alert.classList.remove("show");
    }, 4000)
}

var users;
