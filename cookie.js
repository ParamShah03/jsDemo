// set a cookie
function setCookie(cname, cvalue, exdays) {
  console.warn('cookie: ', cvalue);    
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  console.warn('Cookie set');
}

// get cookie value
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        console.warn(c.substring(name.length, c.length));
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

// check for a cookie
function checkCookie() {
    console.warn('checking cookie');
    let cUser = getCookie('CurrentUser');
    if (cUser.length===0) {
      console.warn("Cookie Expired!");
      return false;
    } else {
      console.warn("Welcome User:", cUser);
      return true;
    }
}

async function deleteCookie(cname) {
  document.cookie = await cname + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;;path=/';
  console.warn(document.cookie);
}